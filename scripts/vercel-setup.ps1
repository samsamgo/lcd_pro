# 우강테크 홈페이지 — Vercel 프로젝트 연결 + 환경변수 등록
#
# 왜 스크립트로 두는가 —
# 환경변수를 손으로 넣으면 오타가 나고, 어떤 값을 넣었는지 기록이 안 남는다.
# 값은 apps/web/.env.local 에서 읽으므로 이 파일에는 비밀값이 들어가지 않는다.
#
# 사전 조건: vercel login 이 되어 있어야 한다 (브라우저 인증이라 사람이 해야 함)
# 실행: powershell -File scripts\vercel-setup.ps1

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $Root 'apps\web\.env.local'

Write-Output '== 1. 로그인 확인 =='
$who = & vercel whoami 2>&1 | Out-String
if ($who -match 'Logged out') {
  Write-Output '로그인이 안 되어 있습니다. 먼저 실행하십시오:  vercel login'
  exit 1
}
Write-Output $who.Trim()

Write-Output ''
Write-Output '== 2. 프로젝트 연결 =='
if (-not (Test-Path (Join-Path $Root '.vercel\project.json'))) {
  Write-Output '프로젝트가 연결돼 있지 않습니다. 아래를 실행해 연결하십시오:'
  Write-Output '  vercel link'
  Write-Output '  (Set up and deploy? → 기존 프로젝트가 있으면 Link to existing 선택)'
  exit 1
}
Write-Output (Get-Content (Join-Path $Root '.vercel\project.json') -Raw)

Write-Output ''
Write-Output '== 3. 환경변수 등록 =='

# .env.local 에서 값을 읽는다. 비밀값을 화면에 찍지 않는다.
$vals = @{}
foreach ($line in Get-Content $EnvFile) {
  if ($line -match '^\s*#') { continue }
  if ($line -match '^\s*([A-Z0-9_]+)\s*=\s*(.+)$') { $vals[$Matches[1]] = $Matches[2].Trim() }
}

# 배포본에서 실제로 필요한 것만 올린다.
# NEXT_PUBLIC_* 은 브라우저에 노출되는 값이고, 나머지는 서버 전용이다.
$keys = @(
  'KAKAOWORK_BOT_KEY',       # 견적 문의 알림을 보낼 봇
  'KAKAOWORK_ADMIN_EMAIL',   # 알림 받을 카카오워크 계정
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
)

Push-Location $Root
foreach ($k in $keys) {
  if (-not $vals.ContainsKey($k) -or [string]::IsNullOrWhiteSpace($vals[$k])) {
    Write-Output ("  건너뜀 {0} — .env.local 에 값이 없습니다" -f $k)
    continue
  }
  foreach ($envName in @('production', 'preview')) {
    # 이미 있으면 지우고 다시 넣는다 (vercel env add 는 중복을 허용하지 않는다)
    & vercel env rm $k $envName --yes 2>&1 | Out-Null
    $vals[$k] | & vercel env add $k $envName 2>&1 | Out-Null
  }
  Write-Output ("  등록 {0}  (production, preview)" -f $k)
}
Pop-Location

Write-Output ''
Write-Output '== 4. 확인 =='
Push-Location $Root
& vercel env ls
Pop-Location

Write-Output ''
Write-Output '환경변수 등록 완료. 값을 바꾼 뒤에는 재배포해야 반영됩니다.'
