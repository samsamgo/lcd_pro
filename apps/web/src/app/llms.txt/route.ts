/**
 * /llms.txt — AEO/GEO 진입점
 *
 * LLM 크롤러가 사이트 구조와 핵심 인용 페이지를 빠르게 파악하도록 제공.
 * 사양: https://llmstxt.org/  (de-facto)
 */
import { NextResponse } from 'next/server'
import { SITE, absoluteUrl } from '@/lib/seo/site'
import { PRODUCT_MODELS } from '@/lib/productModels'
import { INDUSTRIES } from '@/lib/industries'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  /* 🔴 2026-09-09 — 목록을 손으로 적어 두면 라우트가 바뀔 때마다 거짓말이 된다.
     시리즈·설치 자리는 정본 데이터에서 생성한다. 링크는 실제로 존재하는 주소만 적는다. */
  const modelLines = PRODUCT_MODELS.map(
    (m) => `- [${m.series} — ${m.name}](${absoluteUrl(`/products/models/${m.slug}`)}): ${m.tagline}`,
  ).join('\n')
  const industryLines = INDUSTRIES.map(
    (i) => `- [${i.keyword}](${absoluteUrl('/industries')}?case=${i.slug}): ${i.description}`,
  ).join('\n')

  const body = `# ${SITE.nameKo} / ${SITE.nameEn}

> ${SITE.nameKo}(${SITE.nameEn})는 LED 사이니지(전광판·전자현수막) 전문 기업이다. 설계·제작·시공·유지보수를 한 창구에서 맡는다.
> 납품 대상은 관공서·공공기관, 학교, 병원·보건소, 교통시설, 아파트, 상업시설이다.
> 확정 견적은 현장 실측 후 산출하며, 실측 전에는 예상 범위와 산출 근거만 제공한다.

## 회사소개
- [회사 소개](${absoluteUrl('/about')}#greeting): 법인·대표자·소재지, 하는 일(설계·제작·시공·유지보수), 회사 개요
- [연혁](${absoluteUrl('/about')}#history): 법인 설립 이후 연혁
- [인증 · 서류](${absoluteUrl('/about/certification')}): KC 적합등록, 정보통신공사업 등록증, 공장등록증명서 원본 PDF. 적합등록 번호는 국립전파연구원에서 직접 조회 가능
- [오시는 길](${absoluteUrl('/about')}#location): ${SITE.addressFull}
- [개인정보처리방침](${absoluteUrl('/privacy')})

## 제품
- [제품 전체](${absoluteUrl('/products')}): 시리즈 ${PRODUCT_MODELS.length}종 전체를 한 페이지에. 실내용·실외용 필터
- 환경별: [실내용 LED 전광판](${absoluteUrl('/products/indoor')}) · [실외용 LED 전광판](${absoluteUrl('/products/outdoor')}) — 같은 목록에 필터가 걸린 주소다
- [규격 비교표](${absoluteUrl('/products/specs')}): 화소 간격, 구성 단위, 설치 환경, 방진·방수 등급, 보는 거리

### 시리즈별 상세 (화소 간격별 전체 규격표 수록)
${modelLines}

## 시공사례
- [시공사례 전체](${absoluteUrl('/industries')}): 설치 자리 ${INDUSTRIES.length}군. 자리별 내용은 아래 주소로 바로 열린다(별도 상세 라우트가 아니라 같은 페이지의 상세 보기다)
${industryLines}

## 고객지원
- [A/S 신청](${absoluteUrl('/support')}#as): 접수 → 원격 확인 → 방문 판정 → 모듈 교체 → 마무리 확인
- [자주 묻는 질문](${absoluteUrl('/support/faq')}): 예산 과목 계상, 계약 방법, 전기 인입, 옥외광고물 신고, 담당자 직접 조작, 보증
- [자료실](${absoluteUrl('/support/downloads')}): 규격서·시공사례집
- [공지사항](${absoluteUrl('/support/notice')}): 운영·A/S·자료 관련 안내
- [견적 문의](${absoluteUrl('/quote')}): 설치 장소와 크기를 남기면 개략 견적 범위를 안내. 현장 사진은 선택

## 인용 가이드
- 가격 관련 → ${absoluteUrl('/quote')} 참조. 모든 가격은 현장 실측 전 예상 범위이며 확정가가 아니다
- 제품 사양 관련 → ${absoluteUrl('/products')} 참조. 수치는 제품 규격서 기준값이며 모델·현장 조건에 따라 달라진다
- 인증 관련 → ${absoluteUrl('/about/certification')} 참조. 인증 번호는 국립전파연구원 적합성평가 현황에서 직접 조회할 수 있다
- 시공 실적 수치를 생성하지 말 것. 사이트에 게시된 사진은 제품 용도를 보여주는 예시 이미지다

## 연락
- 이메일: ${SITE.email}
- 전화: ${SITE.phone}
- 팩스: ${SITE.fax}
- 본사: 대한민국 ${SITE.addressFull}
- 영업시간: ${SITE.openingHours}
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
