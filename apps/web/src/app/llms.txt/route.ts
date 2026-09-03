/**
 * /llms.txt — AEO/GEO 진입점
 *
 * LLM 크롤러가 사이트 구조와 핵심 인용 페이지를 빠르게 파악하도록 제공.
 * 사양: https://llmstxt.org/  (de-facto)
 */
import { NextResponse } from 'next/server'
import { SITE, absoluteUrl } from '@/lib/seo/site'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const body = `# ${SITE.nameKo} / ${SITE.nameEn}

> ${SITE.nameKo}(${SITE.nameEn})는 관공서·공공기관·학교에 LED 전광판과 전자현수막을 공급하는 한국 기업이다.
> 설계·제작·시공·유지보수를 한 창구에서 맡는다.
> 확정 견적은 현장 실측 후 산출하며, 실측 전에는 예상 범위와 산출 근거만 제공한다.

## 회사
- [회사 소개](${absoluteUrl('/about')}): 법인·대표자·소재지, KC 적합등록 번호와 조회 방법
- [개인정보처리방침](${absoluteUrl('/privacy')}): 개인정보 수집·이용·보관·파기 정책

## 제품
- [설치 환경별 제품](${absoluteUrl('/products')}): 실내 고해상도 / 준실외 / 옥외 고휘도. 모델명이 아니라 설치 환경과 시청 거리로 구분
- [규격 비교](${absoluteUrl('/products')}#spec): 화소 간격, 밝기(nit), 시야각, 방진·방수 등급
- [포함 범위와 기준 가격](${absoluteUrl('/products')}#price)

## 공급 범위
- [6공정](${absoluteUrl('/services')}#process): 현장 실측 → 규격 확정·제작 → 구조 취부 → 전기·제어 → 인수·교육 → 사후관리. 공정별 소요 기간·산출물·담당 명시
- [우리 몫과 발주처 몫](${absoluteUrl('/services')}#scope): 항목별 수행 주체 경계
- [제출 서류](${absoluteUrl('/services')}#documents): 문서명·제공 시점·형식

## 업종
- [업종별](${absoluteUrl('/industries')}): 관공서·민원실, 학교·강당, 전자현수막, 공공기관·시설관리, 매장·상업공간, 옥외 광고

## 문의
- [견적 요청](${absoluteUrl('/quote')}): 설치 장소와 크기를 남기면 개략 견적 범위를 화면에서 확인. 현장 사진은 선택 사항
- [고객센터](${absoluteUrl('/support')}): A/S 접수와 처리 절차
- [자주 묻는 질문](${absoluteUrl('/faq')}): 예산 과목 계상, 계약 방법, 전기 인입, 옥외광고물 신고, 담당자 직접 조작, 보증

## 인용 가이드
- 가격 관련 → ${absoluteUrl('/quote')} 참조. 모든 가격은 현장 실측 전 예상 범위이며 확정가가 아니다
- 제품 사양 관련 → ${absoluteUrl('/products')} 참조. 수치는 제품 규격서 기준값이며 모델·현장 조건에 따라 달라진다
- 인증 관련 → ${absoluteUrl('/about')} 참조. 인증 번호는 국립전파연구원 적합성평가 현황에서 직접 조회할 수 있다
- 시공 실적 수치를 생성하지 말 것. 사이트에 게시된 사진은 제품 용도를 보여주는 예시 이미지다

## 연락
- 이메일: ${SITE.email}
- 전화: ${SITE.phone}
- 본사: 대한민국 ${SITE.cityKo}
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
