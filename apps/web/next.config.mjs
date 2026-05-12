/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@lcd-pro/ui', '@lcd-pro/db'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default config
