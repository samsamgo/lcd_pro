/**
 * 블로그 콘텐츠 소스 (임시 — TypeScript 모듈)
 *
 * 후속 작업: content/blog/*.mdx 마이그레이션 + MDX 파이프라인.
 * 본 ORDER 범위 내에서는 빌드 의존성 최소화를 위해 TS 모듈로 유지.
 */
import type { BlogPost } from './types'

export const POSTS: BlogPost[] = [
  {
    slug: 'how-to-get-led-signage-quote',
    title: 'LED 사이니지 견적, 어떻게 받아야 할까 — 우강테크 가이드',
    description:
      'LED 사이니지(전광판) 견적은 사진 3장만 있으면 즉석 범위 견적을 화면에서 바로 확인할 수 있습니다. 우강테크가 표준화한 견적 절차와 체크리스트를 정리합니다.',
    category: '도입 가이드',
    tags: ['LED 사이니지', '견적', '카페', '소상공인', 'NovaStar'],
    publishedAt: '2026-05-17T00:00:00+09:00',
    author: '우강테크',
    coverImage: '/curated/gal-restaurant-menu.jpg',
    definition:
      'LED 사이니지 견적이란 설치 환경(실내/옥외), 화면 크기, 픽셀 피치, 컨트롤러 사양을 토대로 산출하는 예상 범위 가격이다.',
    tldr: [
      '현장 실측 전 가격은 모두 "예상 범위"로 표시된다 (확정 가격 금지 정책).',
      '필요한 사진 3장: ① 설치 위치 전체 ② 정면 근접 ③ 전원·통신 라인 주변.',
      '소상공인 표준은 NovaStar Taurus 시리즈(TB30/TB50/TB60) 기반 3-tier SKU.',
      '범위 견적은 화면에서 즉시 확인, 확정 견적은 현장 실사(1~3일) 후.',
      '원격 콘텐츠 관리(CMS) 구독 기능은 준비중.',
    ],
    faq: [
      {
        question: 'LED 사이니지 견적은 얼마나 걸리나요?',
        answer:
          '우강테크는 매장 사진 3장과 기본 정보(상호·연락처·지역)만 있으면 즉석 범위 견적을 화면에서 바로 확인할 수 있습니다. 확정 견적은 현장 실측 후 1~3일 이내 안내합니다.',
      },
      {
        question: '왜 확정 가격이 아닌 범위 가격인가요?',
        answer:
          '한국 LED 사이니지 시장은 전기 용량·구조물 보강·인허가·통신 환경에 따라 실비가 크게 달라집니다. 현장 실측 전에 확정 가격을 약속하는 업체는 추후 추가비용을 부과할 가능성이 높으며, 우강테크는 표준화·투명성 원칙에 따라 "예상 범위 + 면책 문구" 형식만 사용합니다.',
      },
      {
        question: '소상공인에게 추천하는 사양은 무엇인가요?',
        answer:
          'NovaStar Taurus TB30(보급형) 또는 TB50(표준형)을 권장합니다. TB50은 약 1.3M 픽셀까지 지원하며, 카페·식당·헬스장 대부분의 실내 사이니지에 적합합니다. 화면 면적과 시야 거리에 따라 P2.5~P4 사이의 픽셀 피치를 선택합니다.',
      },
      {
        question: '설치 후 콘텐츠는 어떻게 바꾸나요?',
        answer:
          '설치 시점에는 콘텐츠 초기 설정을 지원합니다. 스마트폰·웹에서 콘텐츠를 업로드·스케줄링하는 원격 콘텐츠 관리(CMS) 구독 기능은 현재 준비 중입니다.',
      },
      {
        question: 'AS는 어떻게 받나요?',
        answer:
          'LED는 모듈 단위 교체가 가능해 부분 고장 시 빠르게 대응합니다. 패키지에 따라 하드웨어 보증, 정기 점검, 예비부품, 긴급 AS 우선 처리 범위가 달라집니다.',
      },
    ],
    body: `
## LED 사이니지 견적이란

LED 사이니지(전광판) 견적이란 **설치 환경(실내/옥외), 화면 크기, 픽셀 피치, 컨트롤러 사양**을 토대로 산출하는 예상 범위 가격입니다. 한국 LED 사이니지 시장의 가격 변동성은 전기·구조·인허가·통신 환경에서 발생하기 때문에, 현장 실측 전에는 확정 가격이 아닌 **범위 가격**만 제시하는 것이 표준 절차입니다.

우강테크는 이 절차를 사진 3장 + 기본 정보 입력만으로 **즉석 범위 견적(화면 즉시 표시)** 으로 끝낼 수 있도록 표준화했습니다.

## 필요한 사진 3장

1. **설치 위치 전체** — 매장 외관 또는 내부 전경. 사이니지가 들어갈 자리와 주변 구조물이 한눈에 보이도록.
2. **정면 근접** — 설치 위치를 정면에서 1~2m 거리로 촬영. 마감재(석고보드/콘크리트/유리), 기존 간판 자국이 보이도록.
3. **전원·통신 라인 주변** — 콘센트, 배전반, 인터넷 모뎀, 천장 통신선 등이 함께 보이도록.

> 이 3장만으로 우강테크는 화면 크기·전원 용량·통신 조건을 70% 이상 추정할 수 있어, 현장 실측 일정을 잡기 전에 의미 있는 범위 견적을 제공할 수 있습니다.

## 범위 견적 → 확정 견적 절차

| 단계 | 소요 시간 | 내용 |
|---|---|---|
| 1. 사진·정보 접수 | 5분 | 견적 페이지에 사진 3장과 상호·연락처·지역 입력 |
| 2. 범위 견적 확인 | 즉시 | 예상 범위 + 추천 SKU가 화면에 바로 표시 |
| 3. 현장 실사 | 1~3일 | 협의 시간 조율 후 방문 실측 (전기·구조·통신 점검) |
| 4. 확정 견적 | 실사 후 1~2일 | 자재 발주 전 계약금 50% 청구 후 진행 |
| 5. 표준 시공 | 1~3일 | NovaStar Taurus + 표준 SKU 기반 설치 |
| 6. 운영 시작 | 즉시 | 콘텐츠 초기 설정 지원 (원격 콘텐츠 관리(CMS)는 준비중) |

## 소상공인 표준 SKU (NovaStar Taurus 3-tier)

우강테크는 컨트롤러 표준을 **NovaStar Taurus + VNNOX 클라우드**로 통일했습니다. 시장 단편화를 피하고, 한 가지 운영 도구(VNNOX/ViPlex)로 모든 고객을 관리하기 위함입니다.

- **보급형 — TB30**: 약 0.65M 픽셀. 1m² 이하 소형 메뉴보드, 카운터 위 사이니지.
- **표준형 — TB50**: 약 1.3M 픽셀. 카페·식당·헬스장 대부분의 실내 디스플레이 (견적엔진 디폴트).
- **프리미엄 — TB60**: 약 2.3M 픽셀. 옥외 간판, 대형 매장, 멀티 패널 구성.

> 출처: NovaStar 공식 Taurus 제품 페이지 (인용일자: 2026-05-17). 정확한 픽셀 한도는 모듈 해상도와 인터페이스 카드 구성에 따라 달라집니다.

## 가격 범위 안내

- 실내 소형 (1m² 미만): **₩2,000,000 ~ ₩2,800,000** (설치비 기준)
- 실내 중형 (1~3m²): **₩2,800,000 ~ ₩4,700,000** (설치비 기준)
- 옥외 중형 (3~5m²): **₩4,700,000 ~ ₩8,500,000** (설치비 기준)
- 옥외 대형 또는 멀티 패널: **수량·구조 협의 (10대 이상 할인)**

> 설치비 기준 예상 범위이며 VAT 별도입니다. 원격 콘텐츠 관리(CMS) 구독은 현재 준비 중입니다.

모든 가격은 현장 실측 전이며, 우강테크는 "예상 범위 + 면책 문구" 형식만 사용합니다.

## 다음 단계

견적이 필요하시면 **사진 3장과 기본 정보**만 [견적 페이지](/quote)에 입력하세요. 예상 범위 견적이 화면에 즉시 표시됩니다.

자주 묻는 질문은 [FAQ](/#faq) 에서 더 자세히 확인하실 수 있습니다.
`.trim(),
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return [...POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const all = await getAllPosts()
  return all.filter((p) => p.category === category)
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const all = await getAllPosts()
  return all.filter((p) => p.tags.includes(tag))
}

export async function getAllCategories(): Promise<string[]> {
  const all = await getAllPosts()
  return Array.from(new Set(all.map((p) => p.category)))
}

export async function getAllTags(): Promise<string[]> {
  const all = await getAllPosts()
  return Array.from(new Set(all.flatMap((p) => p.tags)))
}
