/**
 * next 실행 래퍼.
 *
 * 왜 필요한가 —
 * 개발 PC의 저장소가 exFAT 볼륨(D:)에 있어서 readlink 가 EINVAL 대신 EISDIR 을 던진다.
 * webpack/next 는 EINVAL 만 "심볼릭 링크 아님"으로 처리해서 빌드가 첫 파일에서 멈춘다.
 * 그래서 exfat-shim 을 먼저 물려야 한다.
 *
 * 그런데 package.json 에 next 의 경로를 직접 적으면(`../../node_modules/next/dist/bin/next`)
 * 그 경로는 이 PC의 hoisted 배치에만 맞는다. Vercel 은 pnpm 기본 배치라
 * next 가 apps/web/node_modules 에 놓여 빌드가 깨진다.
 *
 * require.resolve 로 찾으면 어느 배치에서도 동작한다. shim 은 NTFS/Linux 에서
 * readlink 가 정상이라 아무 일도 하지 않으므로 그대로 둬도 안전하다.
 *
 * 사용: node scripts/run-next.cjs build | dev | start
 */
require('./exfat-shim.cjs')
require(require.resolve('next/dist/bin/next'))
