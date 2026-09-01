param(
    [string]$SourceDir,
    [string]$OutputDir
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
if (-not $SourceDir) { $SourceDir = Join-Path $repoRoot 'apps\web\public\cases' }
if (-not $OutputDir) { $OutputDir = Join-Path $SourceDir 'opt' }

Add-Type -AssemblyName System.Drawing

$source = @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

public sealed class CaseImageResult
{
    public string Name { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public double BeforeBrightness { get; set; }
    public double AfterBrightness { get; set; }
    public long BeforeBytes { get; set; }
    public long DesktopBytes { get; set; }
    public long MobileBytes { get; set; }
    public double Gamma { get; set; }
    public double RedGain { get; set; }
    public double GreenGain { get; set; }
    public double BlueGain { get; set; }
    public bool Denoised { get; set; }
}

public sealed class ImageStats
{
    public double Mean;
    public int P05;
    public int P50;
    public int P95;
    public double DarkFraction;
    public double BrightFraction;
}

public static class CaseImageOptimizer
{
    private static readonly PixelFormat WorkingFormat = PixelFormat.Format24bppRgb;

    public static CaseImageResult Process(string inputPath, string desktopPath, string mobilePath)
    {
        using (var loaded = new Bitmap(inputPath))
        using (var source = To24Bpp(loaded))
        {
            int stride;
            byte[] original = ReadPixels(source, out stride);
            ImageStats before = Analyze(original, source.Width, source.Height, stride);

            double redGain, greenGain, blueGain;
            EstimateWhiteBalance(original, source.Width, source.Height, stride, before,
                out redGain, out greenGain, out blueGain);

            double anchor = 0.65 * before.P50 + 0.35 * before.Mean;
            anchor = Math.Max(25.0, Math.Min(235.0, anchor));
            double requestedGamma = Math.Log(125.0 / 255.0) / Math.Log(anchor / 255.0);
            double gamma = 1.0 + (requestedGamma - 1.0) * 0.65;
            gamma = Clamp(gamma, 0.88, 1.12);

            bool denoise = before.Mean < 105.0 || before.DarkFraction > 0.28;
            byte[] working = denoise
                ? GentleShadowDenoise(original, source.Width, source.Height, stride)
                : (byte[])original.Clone();

            ApplyToneAndColor(working, source.Width, source.Height, stride,
                gamma, redGain, greenGain, blueGain);

            using (var corrected = FromPixels(working, source.Width, source.Height, stride))
            using (var desktop = Sharpen(corrected, 0.70, 0.26))
            {
                SaveJpeg(desktop, desktopPath, 82L);

                using (var mobileBase = Resize(corrected, 720))
                using (var mobile = Sharpen(mobileBase, 0.70, 0.28))
                {
                    SaveJpeg(mobile, mobilePath, 76L);
                }
            }

            double afterMean;
            using (var saved = new Bitmap(desktopPath))
            using (var saved24 = To24Bpp(saved))
            {
                int savedStride;
                byte[] savedPixels = ReadPixels(saved24, out savedStride);
                afterMean = Analyze(savedPixels, saved24.Width, saved24.Height, savedStride).Mean;
            }

            return new CaseImageResult {
                Name = Path.GetFileName(inputPath),
                Width = source.Width,
                Height = source.Height,
                BeforeBrightness = before.Mean,
                AfterBrightness = afterMean,
                BeforeBytes = new FileInfo(inputPath).Length,
                DesktopBytes = new FileInfo(desktopPath).Length,
                MobileBytes = new FileInfo(mobilePath).Length,
                Gamma = gamma,
                RedGain = redGain,
                GreenGain = greenGain,
                BlueGain = blueGain,
                Denoised = denoise
            };
        }
    }

    private static Bitmap To24Bpp(Bitmap source)
    {
        var output = new Bitmap(source.Width, source.Height, WorkingFormat);
        output.SetResolution(source.HorizontalResolution > 0 ? source.HorizontalResolution : 96,
            source.VerticalResolution > 0 ? source.VerticalResolution : 96);
        using (Graphics g = Graphics.FromImage(output))
        {
            g.CompositingMode = CompositingMode.SourceCopy;
            g.DrawImageUnscaled(source, 0, 0);
        }
        return output;
    }

    private static byte[] ReadPixels(Bitmap bitmap, out int stride)
    {
        Rectangle rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
        BitmapData data = bitmap.LockBits(rect, ImageLockMode.ReadOnly, WorkingFormat);
        try
        {
            stride = Math.Abs(data.Stride);
            byte[] bytes = new byte[stride * bitmap.Height];
            Marshal.Copy(data.Scan0, bytes, 0, bytes.Length);
            return bytes;
        }
        finally { bitmap.UnlockBits(data); }
    }

    private static Bitmap FromPixels(byte[] pixels, int width, int height, int sourceStride)
    {
        var bitmap = new Bitmap(width, height, WorkingFormat);
        Rectangle rect = new Rectangle(0, 0, width, height);
        BitmapData data = bitmap.LockBits(rect, ImageLockMode.WriteOnly, WorkingFormat);
        try
        {
            int destStride = Math.Abs(data.Stride);
            if (destStride == sourceStride)
            {
                Marshal.Copy(pixels, 0, data.Scan0, pixels.Length);
            }
            else
            {
                for (int y = 0; y < height; y++)
                {
                    IntPtr row = IntPtr.Add(data.Scan0, y * data.Stride);
                    Marshal.Copy(pixels, y * sourceStride, row, width * 3);
                }
            }
        }
        finally { bitmap.UnlockBits(data); }
        return bitmap;
    }

    private static ImageStats Analyze(byte[] pixels, int width, int height, int stride)
    {
        long[] histogram = new long[256];
        double sum = 0;
        long count = (long)width * height;
        for (int y = 0; y < height; y++)
        {
            int row = y * stride;
            for (int x = 0; x < width; x++)
            {
                int i = row + x * 3;
                int lum = (int)Math.Round(0.0722 * pixels[i] + 0.7152 * pixels[i + 1] + 0.2126 * pixels[i + 2]);
                lum = Math.Max(0, Math.Min(255, lum));
                histogram[lum]++;
                sum += lum;
            }
        }

        return new ImageStats {
            Mean = sum / count,
            P05 = Percentile(histogram, count, 0.05),
            P50 = Percentile(histogram, count, 0.50),
            P95 = Percentile(histogram, count, 0.95),
            DarkFraction = histogram.Take(40).Sum() / (double)count,
            BrightFraction = histogram.Skip(246).Sum() / (double)count
        };
    }

    private static int Percentile(long[] histogram, long count, double percentile)
    {
        long target = (long)Math.Ceiling(count * percentile);
        long cumulative = 0;
        for (int i = 0; i < histogram.Length; i++)
        {
            cumulative += histogram[i];
            if (cumulative >= target) return i;
        }
        return 255;
    }

    private static void EstimateWhiteBalance(byte[] pixels, int width, int height, int stride,
        ImageStats stats, out double redGain, out double greenGain, out double blueGain)
    {
        double rSum = 0, gSum = 0, bSum = 0;
        long count = 0;
        int low = Math.Max(55, stats.P50);
        int high = Math.Min(238, stats.P95 + 12);

        for (int y = 0; y < height; y += 2)
        {
            int row = y * stride;
            for (int x = 0; x < width; x += 2)
            {
                int i = row + x * 3;
                double b = pixels[i], g = pixels[i + 1], r = pixels[i + 2];
                double lum = 0.0722 * b + 0.7152 * g + 0.2126 * r;
                double max = Math.Max(r, Math.Max(g, b));
                double min = Math.Min(r, Math.Min(g, b));
                if (lum >= low && lum <= high && max > 1 && (max - min) / max <= 0.28)
                {
                    rSum += r; gSum += g; bSum += b; count++;
                }
            }
        }

        if (count < width * height / 200)
        {
            redGain = greenGain = blueGain = 1.0;
            return;
        }

        double rMean = rSum / count, gMean = gSum / count, bMean = bSum / count;
        double neutral = (rMean + gMean + bMean) / 3.0;
        redGain = Clamp(neutral / Math.Max(1, rMean), 0.92, 1.08);
        greenGain = Clamp(neutral / Math.Max(1, gMean), 0.92, 1.08);
        blueGain = Clamp(neutral / Math.Max(1, bMean), 0.92, 1.08);

        double luminanceGain = 0.2126 * redGain + 0.7152 * greenGain + 0.0722 * blueGain;
        redGain /= luminanceGain;
        greenGain /= luminanceGain;
        blueGain /= luminanceGain;
        redGain = Clamp(redGain, 0.92, 1.08);
        greenGain = Clamp(greenGain, 0.92, 1.08);
        blueGain = Clamp(blueGain, 0.92, 1.08);
    }

    private static byte[] GentleShadowDenoise(byte[] source, int width, int height, int stride)
    {
        byte[] result = (byte[])source.Clone();
        for (int y = 1; y < height - 1; y++)
        {
            int row = y * stride;
            for (int x = 1; x < width - 1; x++)
            {
                int i = row + x * 3;
                double lum = 0.0722 * source[i] + 0.7152 * source[i + 1] + 0.2126 * source[i + 2];
                if (lum >= 95) continue;
                double blend = 0.13 * (1.0 - lum / 95.0);
                int up = i - stride, down = i + stride, left = i - 3, right = i + 3;
                for (int c = 0; c < 3; c++)
                {
                    double average = (source[up + c] + source[down + c] + source[left + c] + source[right + c]) / 4.0;
                    result[i + c] = ToByte(source[i + c] * (1.0 - blend) + average * blend);
                }
            }
        }
        return result;
    }

    private static void ApplyToneAndColor(byte[] pixels, int width, int height, int stride,
        double gamma, double redGain, double greenGain, double blueGain)
    {
        const double contrast = 0.10;
        const double saturation = 1.03;
        for (int y = 0; y < height; y++)
        {
            int row = y * stride;
            for (int x = 0; x < width; x++)
            {
                int i = row + x * 3;
                double b = pixels[i] / 255.0 * blueGain;
                double g = pixels[i + 1] / 255.0 * greenGain;
                double r = pixels[i + 2] / 255.0 * redGain;

                double luminance = Math.Max(0.0001, 0.0722 * b + 0.7152 * g + 0.2126 * r);
                double exposed = Math.Pow(Math.Min(1.0, luminance), gamma);
                double curved = exposed + contrast * exposed * (1.0 - exposed) * (2.0 * exposed - 1.0);
                double scale = curved / luminance;
                r *= scale; g *= scale; b *= scale;

                double adjustedLum = 0.0722 * b + 0.7152 * g + 0.2126 * r;
                r = adjustedLum + (r - adjustedLum) * saturation;
                g = adjustedLum + (g - adjustedLum) * saturation;
                b = adjustedLum + (b - adjustedLum) * saturation;

                double max = Math.Max(r, Math.Max(g, b));
                if (max > 0.998)
                {
                    double highlightScale = 0.998 / max;
                    r *= highlightScale; g *= highlightScale; b *= highlightScale;
                }
                double min = Math.Min(r, Math.Min(g, b));
                if (min < 0)
                {
                    r -= min; g -= min; b -= min;
                }

                pixels[i] = ToByte(b * 255.0);
                pixels[i + 1] = ToByte(g * 255.0);
                pixels[i + 2] = ToByte(r * 255.0);
            }
        }
    }

    private static Bitmap Resize(Bitmap source, int targetWidth)
    {
        int targetHeight = (int)Math.Round(source.Height * targetWidth / (double)source.Width);
        var output = new Bitmap(targetWidth, targetHeight, WorkingFormat);
        using (Graphics g = Graphics.FromImage(output))
        {
            g.CompositingMode = CompositingMode.SourceCopy;
            g.CompositingQuality = CompositingQuality.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.DrawImage(source, new Rectangle(0, 0, targetWidth, targetHeight),
                0, 0, source.Width, source.Height, GraphicsUnit.Pixel);
        }
        return output;
    }

    private static Bitmap Sharpen(Bitmap source, double sigma, double amount)
    {
        int stride;
        byte[] original = ReadPixels(source, out stride);
        byte[] horizontal = new byte[original.Length];
        byte[] blurred = new byte[original.Length];
        double w0 = Math.Exp(-4.0 / (2.0 * sigma * sigma));
        double w1 = Math.Exp(-1.0 / (2.0 * sigma * sigma));
        double w2 = 1.0;
        double norm = 2 * w0 + 2 * w1 + w2;
        w0 /= norm; w1 /= norm; w2 /= norm;

        for (int y = 0; y < source.Height; y++)
        {
            int row = y * stride;
            for (int x = 0; x < source.Width; x++)
            {
                for (int c = 0; c < 3; c++)
                {
                    double value = 0;
                    value += original[row + Math.Max(0, x - 2) * 3 + c] * w0;
                    value += original[row + Math.Max(0, x - 1) * 3 + c] * w1;
                    value += original[row + x * 3 + c] * w2;
                    value += original[row + Math.Min(source.Width - 1, x + 1) * 3 + c] * w1;
                    value += original[row + Math.Min(source.Width - 1, x + 2) * 3 + c] * w0;
                    horizontal[row + x * 3 + c] = ToByte(value);
                }
            }
        }

        for (int y = 0; y < source.Height; y++)
        {
            int row = y * stride;
            for (int x = 0; x < source.Width; x++)
            {
                int i = row + x * 3;
                for (int c = 0; c < 3; c++)
                {
                    double value = 0;
                    value += horizontal[Math.Max(0, y - 2) * stride + x * 3 + c] * w0;
                    value += horizontal[Math.Max(0, y - 1) * stride + x * 3 + c] * w1;
                    value += horizontal[i + c] * w2;
                    value += horizontal[Math.Min(source.Height - 1, y + 1) * stride + x * 3 + c] * w1;
                    value += horizontal[Math.Min(source.Height - 1, y + 2) * stride + x * 3 + c] * w0;
                    blurred[i + c] = ToByte(value);
                }
            }
        }

        byte[] sharpened = (byte[])original.Clone();
        for (int y = 0; y < source.Height; y++)
        {
            int row = y * stride;
            for (int x = 0; x < source.Width; x++)
            {
                int i = row + x * 3;
                for (int c = 0; c < 3; c++)
                {
                    double detail = original[i + c] - blurred[i + c];
                    if (Math.Abs(detail) < 1.5) detail = 0;
                    sharpened[i + c] = ToByte(original[i + c] + amount * detail);
                }
            }
        }
        return FromPixels(sharpened, source.Width, source.Height, stride);
    }

    private static void SaveJpeg(Bitmap bitmap, string path, long quality)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(path));
        ImageCodecInfo jpeg = ImageCodecInfo.GetImageEncoders().First(c => c.MimeType == "image/jpeg");
        using (var parameters = new EncoderParameters(1))
        {
            parameters.Param[0] = new EncoderParameter(Encoder.Quality, quality);
            bitmap.Save(path, jpeg, parameters);
        }
    }

    private static byte ToByte(double value)
    {
        return (byte)Math.Max(0, Math.Min(255, (int)Math.Round(value)));
    }

    private static double Clamp(double value, double min, double max)
    {
        return Math.Max(min, Math.Min(max, value));
    }
}
'@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing -Language CSharp

$mobileDir = Join-Path $OutputDir 'sm'
New-Item -ItemType Directory -Force -Path $OutputDir, $mobileDir | Out-Null

$files = Get-ChildItem -LiteralPath $SourceDir -Filter 'case-*.jpg' -File |
    Where-Object { $_.BaseName -match '^case-(0[0-9]|1[0-9]|2[0-9])$' } |
    Sort-Object Name

if ($files.Count -ne 30) {
    throw "Expected 30 source images, found $($files.Count)."
}

$results = foreach ($file in $files) {
    $desktopPath = Join-Path $OutputDir $file.Name
    $mobilePath = Join-Path $mobileDir $file.Name
    Write-Host "Processing $($file.Name)..."
    [CaseImageOptimizer]::Process($file.FullName, $desktopPath, $mobilePath)
}

$reportPath = Join-Path $OutputDir 'processing-report.csv'
$results |
    Select-Object Name, Width, Height,
        @{n='BeforeBrightness';e={[math]::Round($_.BeforeBrightness, 2)}},
        @{n='AfterBrightness';e={[math]::Round($_.AfterBrightness, 2)}},
        BeforeBytes, DesktopBytes, MobileBytes,
        @{n='Gamma';e={[math]::Round($_.Gamma, 4)}},
        @{n='RedGain';e={[math]::Round($_.RedGain, 4)}},
        @{n='GreenGain';e={[math]::Round($_.GreenGain, 4)}},
        @{n='BlueGain';e={[math]::Round($_.BlueGain, 4)}},
        Denoised |
    Export-Csv -LiteralPath $reportPath -NoTypeInformation -Encoding UTF8

$results | Format-Table Name,
    @{n='Before';e={'{0:N2}' -f $_.BeforeBrightness}},
    @{n='After';e={'{0:N2}' -f $_.AfterBrightness}},
    @{n='OriginalKB';e={'{0:N1}' -f ($_.BeforeBytes / 1KB)}},
    @{n='DesktopKB';e={'{0:N1}' -f ($_.DesktopBytes / 1KB)}},
    @{n='MobileKB';e={'{0:N1}' -f ($_.MobileBytes / 1KB)}},
    Denoised -AutoSize

Write-Host "Report: $reportPath"
