/**
 * exFAT 볼륨 대응 shim.
 *
 * 이 저장소는 D: (exFAT) 에 있다. exFAT 은 reparse point 를 지원하지 않아서
 * 일반 파일에 readlink 를 걸면 NTFS 의 EINVAL 대신 EISDIR 을 돌려준다.
 * webpack / next 는 "EINVAL = 심볼릭 링크 아님" 만 처리하도록 짜여 있어서
 * 빌드가 첫 파일에서 멈춘다.
 *
 * 여기서 EISDIR 을 EINVAL 로 바꿔주면 상위 코드가 원래 의도대로 동작한다.
 * (심볼릭 링크가 실제로 없는 볼륨이므로 의미상으로도 맞다.)
 *
 * 사용: NODE_OPTIONS="--require ./scripts/exfat-shim.cjs" next build
 */
const fs = require('node:fs')

const asEinval = (err) => {
  if (err && err.code === 'EISDIR' && /readlink/.test(err.syscall || '')) {
    const e = new Error(`EINVAL: invalid argument, readlink '${err.path}'`)
    e.code = 'EINVAL'
    e.errno = -22
    e.syscall = 'readlink'
    e.path = err.path
    return e
  }
  return err
}

const origSync = fs.readlinkSync
fs.readlinkSync = function (...args) {
  try {
    return origSync.apply(this, args)
  } catch (err) {
    throw asEinval(err)
  }
}

const origCb = fs.readlink
fs.readlink = function (path, options, cb) {
  const done = typeof options === 'function' ? options : cb
  const opts = typeof options === 'function' ? undefined : options
  const wrapped = (err, res) => done(err ? asEinval(err) : null, res)
  return opts === undefined
    ? origCb.call(this, path, wrapped)
    : origCb.call(this, path, opts, wrapped)
}

const origPromise = fs.promises.readlink
fs.promises.readlink = function (...args) {
  return origPromise.apply(this, args).catch((err) => {
    throw asEinval(err)
  })
}

// graceful-fs 등이 이미 캡처한 뒤라면 realpath 계열도 같은 증상을 낸다.
for (const key of ['realpathSync', 'realpath']) {
  const orig = fs[key]
  if (typeof orig !== 'function') continue
  if (key === 'realpathSync') {
    fs.realpathSync = function (...args) {
      try {
        return orig.apply(this, args)
      } catch (err) {
        throw asEinval(err)
      }
    }
    if (orig.native) fs.realpathSync.native = orig.native
  }
}
