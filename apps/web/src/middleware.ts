import { NextResponse, type NextRequest } from 'next/server'

/**
 * 2026-09-09 CEO 지시 — "핸드폰은 메인 페이지 없애고 그냥 회사소개 페이지 바로 뜨게."
 *
 * 폰(휴대전화 UA)에서 `/` 를 열면 `/about` 으로 보낸다. 태블릿·데스크톱은 그대로 홈.
 * 302(임시)로 보낸다 — 검색엔진이 홈 주소 자체를 버리지 않게. 모바일 구글봇도 같은 규칙을 받는다
 * (기기별로 다른 내용을 몰래 주는 클로킹이 아니라, 모든 폰이 같은 redirect 를 받는다).
 * ⚠️ 부작용: 모바일 검색결과에서 홈이 회사소개로 이어진다 — CEO 가 알고 결정한 것(2026-09-09).
 */
const PHONE_UA = /Android.+Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || ''
  if (PHONE_UA.test(ua)) {
    const url = req.nextUrl.clone()
    url.pathname = '/about'
    return NextResponse.redirect(url, 302)
  }
  return NextResponse.next()
}

// `/` 하나만 본다. 다른 경로·정적 파일·API 는 건드리지 않는다.
export const config = { matcher: ['/'] }
