import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@lcd-pro/ui', '@lcd-pro/db'],
  /**
   * 2026-09-08 — 회사소개·고객지원을 한 페이지로 합치면서 사라진 주소들.
   * 검색 결과·외부 링크·명함 QR 이 옛 주소를 물고 있을 수 있어 섹션으로 보낸다.
   */
  async redirects() {
    return [
      { source: '/services', destination: '/about#process', permanent: true },
      { source: '/about/location', destination: '/about#location', permanent: true },
      { source: '/faq', destination: '/support#faq', permanent: true },
      { source: '/support/downloads', destination: '/support#downloads', permanent: true },
    ]
  },
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

/**
 * exFAT quirk 전역 교정.
 *
 * EISDIR 을 EINVAL 로 번역한다. 둘 다 뜻은 같다 — **"이건 심볼릭 링크가 아니다."**
 * 표준 파일시스템은 EINVAL 을 주고, 툴체인은 그 값만 "링크 아님"으로 알아듣는다.
 * exFAT 은 reparse point 자체가 없어 EISDIR 을 주고, 그걸 아무도 처리하지 못한다.
 *
 * 빌드 한 번에 **세 곳**이 각각 이 오류로 죽었다. 한 군데씩 막으면 다음 군데가 나온다 —
 *   ① enhanced-resolve (모듈 해석)          → resolve.symlinks = false 로 이미 대응돼 있었다
 *   ② webpack FileSystemInfo (스냅샷)        → "Compiled successfully" 전에서 멈춤
 *   ③ @vercel/nft (collect-build-traces)     → fs.promises.readlink 를 직접 부른다
 * 그래서 특정 도구를 고치지 않고 **fs 모듈 자체**를 고친다. 위 셋을 한 번에 덮는다.
 *
 * 링크를 무시하는 게 아니라 오류코드만 정상화하므로 진짜 심볼릭 링크는 그대로 해석된다.
 * quirk 가 있는 볼륨에서만 실행된다 — Vercel(Linux)에서는 이 블록을 통째로 건너뛴다.
 */
function normalizeReadlinkErrno() {
  const toEinval = (err) => {
    if (!err || err.code !== 'EISDIR') return err
    const e = new Error(`EINVAL: invalid argument, readlink '${err.path ?? ''}'`)
    e.code = 'EINVAL'
    e.errno = -22
    e.syscall = 'readlink'
    e.path = err.path
    return e
  }

  const origSync = fs.readlinkSync
  fs.readlinkSync = function (...args) {
    try {
      return origSync.apply(this, args)
    } catch (err) {
      throw toEinval(err)
    }
  }

  const origCb = fs.readlink
  fs.readlink = function (target, options, callback) {
    const cb = typeof options === 'function' ? options : callback
    const wrapped = (err, result) => cb(toEinval(err), result)
    return typeof options === 'function'
      ? origCb.call(this, target, wrapped)
      : origCb.call(this, target, options, wrapped)
  }

  if (fs.promises && typeof fs.promises.readlink === 'function') {
    const origPromise = fs.promises.readlink.bind(fs.promises)
    fs.promises.readlink = async (...args) => {
      try {
        return await origPromise(...args)
      } catch (err) {
        throw toEinval(err)
      }
    }
  }
}

if (quirk) normalizeReadlinkErrno()

/**
 * exFAT 의 readlink 오류코드를 표준값으로 되돌리는 webpack 플러그인.
 *
 * `resolve.symlinks = false` 는 **모듈 해석기(enhanced-resolve)** 만 잠재운다.
 * 실제로 빌드를 죽이는 건 webpack 의 `FileSystemInfo` 다 — 얘는 파일마다
 * readlink 를 걸어 심볼릭 링크인지 확인하고, `EINVAL`·`ENOENT`·`UNKNOWN` 만
 * "링크 아님"으로 처리한다. exFAT 이 돌려주는 `EISDIR` 은 그 목록에 없어서
 * 처리되지 않은 오류로 위로 튀고, 빌드가 첫 API 라우트에서 멈춘다.
 *
 * 그래서 컴파일러가 실제로 쓰는 inputFileSystem 의 readlink 를 감싸
 * **EISDIR 을 EINVAL 로 번역**한다. 의미가 같다 — 둘 다 "이건 심볼릭 링크가 아니다".
 * 링크를 무시하는 게 아니라 오류코드만 정상화하므로, 진짜 심볼릭 링크는 그대로 해석된다.
 *
 * quirk 가 있는 볼륨에서만 붙는다. Vercel(Linux)에서는 아예 설치되지 않는다.
 */
class ExfatReadlinkFix {
  apply(compiler) {
    const patch = (fsys) => {
      if (!fsys || fsys.__wkReadlinkPatched) return
      const toEinval = (err) => {
        if (err && err.code === 'EISDIR') {
          const e = new Error(`EINVAL: invalid argument, readlink '${err.path ?? ''}'`)
          e.code = 'EINVAL'
          e.errno = -22
          e.syscall = 'readlink'
          e.path = err.path
          return e
        }
        return err
      }

      if (typeof fsys.readlink === 'function') {
        const orig = fsys.readlink.bind(fsys)
        fsys.readlink = (target, options, callback) => {
          const cb = typeof options === 'function' ? options : callback
          const wrapped = (err, result) => cb(toEinval(err), result)
          return typeof options === 'function'
            ? orig(target, wrapped)
            : orig(target, options, wrapped)
        }
      }
      if (typeof fsys.readlinkSync === 'function') {
        const origSync = fsys.readlinkSync.bind(fsys)
        fsys.readlinkSync = (...args) => {
          try {
            return origSync(...args)
          } catch (err) {
            throw toEinval(err)
          }
        }
      }
      fsys.__wkReadlinkPatched = true
    }

    // inputFileSystem 은 environment 단계에서 세팅된다. 그 직후와 실행 직전 두 번 건다 —
    // Next 가 중간에 CachedInputFileSystem 으로 갈아끼우는 경우가 있다.
    compiler.hooks.afterEnvironment.tap('ExfatReadlinkFix', () => patch(compiler.inputFileSystem))
    compiler.hooks.beforeRun.tap('ExfatReadlinkFix', () => patch(compiler.inputFileSystem))
    patch(compiler.inputFileSystem)
  }
}


/**
 * `.next/prerender-manifest.js` 가 없어서 빌드가 죽는 것을 막는 스텁.
 *
 * 왜 필요한가 — `src/app/opengraph-image.tsx` 는 edge 런타임이어야 한다(그 파일 주석 참조).
 * Next 14 는 빌드의 "Collecting page data" 단계에서 edge 라우트를 샌드박스에 넣어 평가하고,
 * 그 샌드박스가 `.next/prerender-manifest.js` 를 읽는다. 그런데 그 파일은 **빌드 뒷단계에서**
 * 만들어진다. 순서가 어긋나 있고, 그래서 ENOENT 로 빌드가 멈춘다(Next 쪽 문제).
 *
 * 컴파일이 끝난 직후(afterEmit) 빈 매니페스트를 하나 깔아 둔다. Next 가 나중에 진짜
 * 매니페스트로 덮어쓰므로 결과물에는 영향이 없다. 이미 파일이 있으면 손대지 않는다.
 */
class PrerenderManifestStub {
  constructor(distDir) {
    this.distDir = distDir
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap('PrerenderManifestStub', () => {
      const file = path.join(this.distDir, 'prerender-manifest.js')
      if (fs.existsSync(file)) return
      const empty = {
        version: 4,
        routes: {},
        dynamicRoutes: {},
        notFoundRoutes: [],
        preview: {
          previewModeId: '',
          previewModeSigningKey: '',
          previewModeEncryptionKey: '',
        },
      }
      try {
        fs.mkdirSync(this.distDir, { recursive: true })
        fs.writeFileSync(file, `self.__PRERENDER_MANIFEST=${JSON.stringify(JSON.stringify(empty))}`)
      } catch {
        // 스텁을 못 깔아도 빌드를 막지는 않는다 — 원래 오류가 그대로 드러나면 된다
      }
    })
  }
}

config.webpack = (cfg) => {
  cfg.resolve.alias = { ...cfg.resolve.alias, ...wsAlias }
  if (quirk) {
    cfg.resolve.symlinks = false
    cfg.plugins = [...(cfg.plugins ?? []), new ExfatReadlinkFix()]
  }
  cfg.plugins = [
    ...(cfg.plugins ?? []),
    new PrerenderManifestStub(path.join(fileURLToPath(new URL('.', import.meta.url)), '.next')),
  ]
  return cfg
}

export default config
