import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@lcd-pro/ui', '@lcd-pro/db'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
}

/**
 * 워크스페이스 패키지를 소스로 직접 가리킨다.
 * 개발 PC 저장소가 exFAT 볼륨이라 pnpm 이 워크스페이스 심볼릭 링크를 만들지 못하는데,
 * alias 를 걸어 두면 링크 유무와 상관없이 어느 환경에서든 같은 소스를 본다.
 */
const wsAlias = {
  '@lcd-pro/db': fileURLToPath(new URL('../../packages/db/src', import.meta.url)),
  '@lcd-pro/ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
}

/**
 * exFAT 볼륨인지 실제로 확인한다.
 *
 * exFAT 은 reparse point 를 지원하지 않아 일반 파일에 readlink 를 걸면
 * NTFS/ext4 의 EINVAL 대신 EISDIR 을 돌려준다. webpack 은 EINVAL 만
 * "심볼릭 링크 아님"으로 처리하므로 빌드가 첫 파일에서 멈춘다.
 *
 * 그 경우에만 심볼릭 링크 해석을 끈다. Vercel(Linux, pnpm 심볼릭 링크)에서
 * 무조건 끄면 같은 패키지가 두 벌 로드될 수 있어 조건부로 둔다.
 */
function readlinkQuirk() {
  try {
    fs.readlinkSync(fileURLToPath(import.meta.url))
    return false
  } catch (e) {
    return e && e.code === 'EISDIR'
  }
}

const quirk = readlinkQuirk()

config.webpack = (cfg) => {
  cfg.resolve.alias = { ...cfg.resolve.alias, ...wsAlias }
  if (quirk) cfg.resolve.symlinks = false
  return cfg
}

export default config
