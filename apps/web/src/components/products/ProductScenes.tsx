import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RiseMask, ScrollBridge } from '@/components/motion'

/**
 * 환경별 장면.
 *
 * 같은 화면도 놓이는 자리에 따라 견적 단계에서 확인하는 항목이 달라진다.
 * 사진마다 "이 자리에서는 무엇이 먼저인지"를 한 줄로 적는다.
 *
 * 2026-09-07 사진 전수 육안 판독으로 4장 중 3장을 바꿨다. 판정 기준은 2단이다 —
 *   ① 화면에 뜬 문구가 한국어인가  ② 화면 밖 배경이 한국인가.
 *   · B6_park-info-kiosk — 열대 수목·현지 복장. 국내 현장이 아니라 탈락.
 *   · B2_city-hall-wall — 화면이 회색 막대 와이어프레임(플레이스홀더 티).
 *   · C1_corporate-lobby-wall — 화면이 추상 그라데이션이고 바닥에 시공 잔재가 널려 있다.
 * 대체한 4장은 전부 화면에 한국어가 떠 있거나(주민 설명회·교육 안전 연수·산불 위험 감속)
 * 배경이 명백히 국내다(벚꽃 핀 초등학교 정문).
 *
 * ⚠ 이 장면들은 설치 형태를 설명하는 예시이며 우강테크의 납품 실적이 아니다.
 */
const SCENES = [
  {
    src: IMAGES.productScenes[0],
    alt: '관공서 출입구 캐노피 위에 가로로 길게 설치된 LED 화면에 "주민 설명회 오늘 2시"가 표시되어 있다',
    label: '청사 출입구 · 상부 벽부',
    body: '드나드는 사람이 지나가며 한 줄을 읽는 자리입니다. 문장이 짧아 화소보다 글자 높이와 처마 그늘이 먼저입니다.',
  },
  {
    src: IMAGES.productScenes[1],
    alt: '학교 다목적강당 무대 벽면의 대형 실내 LED 화면에 "교육 안전 연수"가 표시되어 있다',
    label: '강당 · 대형 실내 벽부',
    body: '맨 뒷줄에서도 읽혀야 합니다. 강당 길이를 재서 글자 크기를 역산하고, 형광등 조도에 맞춰 밝기를 낮춰 잡습니다.',
  },
  {
    src: IMAGES.productScenes[2],
    alt: '벚꽃이 핀 초등학교 정문 문주 위에 가로형 옥외 LED 화면이 설치되어 있다',
    label: '학교 정문 · 문주 상부',
    body: '학부모와 통학 차량이 몇 초 안에 봅니다. 바깥이라 방수와 밝기가 올라가고, 문주가 하중을 견디는지를 실측에서 확인합니다.',
  },
  {
    src: IMAGES.productScenes[3],
    alt: '흐린 날 지방 도로변에 지주로 세워진 옥외 LED 화면에 "산불 위험 감속"이 표시되어 있다',
    label: '도로변 · 지주형',
    body: '달리는 차에서 읽어야 합니다. 시청 거리가 멀어 화소는 넓게 밝기는 높게 잡고, 옥외광고물 신고 대상인지를 먼저 확인합니다.',
  },
]

export function ProductScenes() {
  return (
    <>
      {/* 2026-09-07 — 그냥 색면이던 다리를 ScrollBridge 로 바꿨다.
          이 페이지에서 라이트↔다크가 갈리는 유일한 지점인데 아무 일도 일어나지 않아
          두 장이 그냥 "붙어" 있었다(구조정본 §16-A 진단 ①). 화소가 켜졌다 꺼진다. */}
      <ScrollBridge direction="down" className="wk-bridge-down h-24 md:h-32" cell={16} />

      {/* 발광 어휘(§17-B). 이 섹션은 다크 면 위에 **켜져 있는 화면 사진 4장**이 걸리는
          자리라 홈 ScreenGallery 와 성격이 같다. 같은 재료에는 같은 표현을 준다.
          화소 격자는 섹션 위 모서리에서 시작해 본문 쪽으로 사라진다(다크 구간의 입구 표시). */}
      <section className="wk-night wk-sec wk-pixelgrid wk-pixelgrid-top wk-pixelgrid-coarse relative overflow-hidden">
        <div className="wk-wrap relative">
          <Reveal y={10}>
            <p className="wk-eyebrow !text-wk-nightMuted">설치 환경</p>
          </Reveal>
          <RiseMask delay={0.06}>
            <h2 className="wk-display wk-emit-text max-w-3xl text-wk-nightInk">
              자리가 바뀌면 확인할 항목이 바뀝니다
            </h2>
          </RiseMask>
          <Reveal y={14} delay={0.16}>
            <p className="wk-lead mt-5 !text-wk-nightMuted">
              같은 화면이라도 청사 출입구와 도로변은 견적 단계에서 보는 것이 다릅니다.
              아래 네 자리는 그 차이가 가장 크게 갈리는 경우입니다.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {SCENES.map((s, n) => (
              <Reveal key={s.label} y={16} delay={Math.min(n, 4) * 0.07}>
                <figure className="m-0">
                  {/* .wk-emit = 안쪽 베젤 + 상단 스페큘러, .wk-emit-spill = 새어 나오는 빛.
                      호버는 .wk-hov-emit-media — 누를 수 없는 카드라 **뜨지 않는다**(§17-B). */}
                  <div className="wk-emit wk-emit-spill wk-hov-emit-media relative aspect-[4/5] overflow-hidden rounded-card-m bg-wk-night2 sm:rounded-card">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <b className="block text-body-lg font-semibold text-wk-nightInk">
                      {s.label}
                    </b>
                    <span className="mt-1.5 block text-label leading-relaxed text-wk-nightMuted">
                      {s.body}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-caption leading-relaxed text-wk-nightMuted">
            설치 형태를 설명하기 위한 장면이며 우강테크의 납품 실적 사진이 아닙니다.
            실제 시공 사진은 첫 현장 검수가 끝난 뒤 발주처와 공개 범위를 협의해 올립니다.
          </p>
        </div>
      </section>
      <ScrollBridge direction="up" className="wk-bridge-up h-24 md:h-32" cell={16} />
    </>
  )
}
