'use client'

import { useEffect, useRef } from 'react'

import { useReducedMotion } from '@/components/motion'

/**
 * HeroLedWall — 홈 히어로 배경. **사진이 아니라 전광판 그 자체를 그린다.**
 *
 * 2026-09-09 CEO "메인 화면 배경화면 너무 구리다."
 * 원인을 원본까지 열어 확인했다 —
 *   ① AI 연출 사진 원본이 1440px 인데 1920+ 화면에 풀블리드 + Ken Burns 확대라 흐렸다.
 *   ② 로비 컷은 바닥에 플라이트 케이스·박스·케이블이 널린 **공사 현장**이었고,
 *      청사 컷은 화면 내용이 **와이어프레임 가안**이었다. 파는 물건이 안 팔리는 사진이다.
 *   ③ 거기에 균일 딤 18% + 좌측 스크림 + 하단 스크림 55% 까지 덮여 전체가 탁했다.
 *
 * 온빛·케이시스는 히어로에 **영상**(LED 월 위로 흐르는 빛)을 쓴다. 우리는 실사도 영상도 없다.
 * 없는 실물을 지어내는 대신(날조 금지) **코드로 그린다** — 해상도와 무관하게 선명하고,
 * 브랜드색으로 통제되고, 전송량 0바이트이며, 진위 문제가 애초에 생기지 않는다.
 *
 * ── 무엇을 그리는가
 * 검정 바탕 위 원형 화소 격자. 각 화소의 밝기는 아주 느린 광파 3개의 합이다.
 *   v = ( sin(x·K1 + t·W1) + sin(y·K2 − t·W2) + sin((x+y)·K3 + t·W3) ) / 3
 * 주기는 16 / 12 / 20초. 빠르면 싸구려 스크린세이버가 된다.
 * 세 주기가 서로 나누어떨어지지 않아 겉보기 반복 주기는 240초다.
 *
 * ══════════════════════════════════════════════════════════════════
 * 성능 — 이 파일에서 가장 중요한 부분. 🔴 여기를 고치기 전에 아래를 읽어라.
 * ══════════════════════════════════════════════════════════════════
 * **2026-09-09 실측 사고**: 첫 구현은 프레임마다 `arc()`+`fill()` 로 8,400개 도트와
 * 수천 개 글로우를 DPR 2 캔버스(약 3136×1500)에 직접 래스터했다. 그 결과 로컬
 * 프로덕션 빌드를 크롬에서 열었을 때 **렌더러가 45초 이상 응답하지 않았다**
 * (Runtime.evaluate 타임아웃, 스크린샷 실패). 계산부는 0.036ms/frame 으로 빨랐지만
 * **경로 래스터화 비용이 전부를 잡아먹었다.** 교훈: 캔버스에서 비싼 것은 산술이 아니라 픽셀이다.
 *
 * 그래서 프레임 루프에서 경로 그리기를 **완전히 없앴다.** 지금 구조는 다섯 겹이다.
 *   1) **스프라이트 블릿** — 48단계 밝기마다 (글로우 + 도트) 를 합성한 작은 오프스크린
 *      캔버스를 마운트·리사이즈 때 한 번 굽는다. 프레임 루프는 `drawImage` 만 한다.
 *      arc/fill 호출 수: 프레임당 8,400+ → **0**.
 *   2) **DPR 절감** — 폭 ≥1400 이면 1, 그 외 min(1.5, dpr). 도트 간격이 12~16px 라
 *      1x 로도 또렷하다. 2x 는 픽셀 수를 4배로 만들 뿐이었다.
 *   3) **30fps 상한** — 광파 주기가 12~20초다. 60fps 로 그릴 이유가 없고, 예산이 2배가 된다.
 *   4) **프레임 예산 자가 점검** — 첫 60프레임 평균 tick 이 8ms 를 넘으면 셀을 키워
 *      (화소 수를 줄여) 다시 굽는다. 저사양 기기에서 자동으로 완화된다. 이 로직을 지우지 마라.
 *   5) **화면 밖·탭 숨김이면 루프 중단** — IntersectionObserver + visibilitychange.
 *      히어로를 지나쳐 스크롤한 뒤에도 계속 돌면 페이지 전체가 무거워진다.
 *
 * 🔴 이 컴포넌트는 장식이다. 의미는 h1 이 진다 — aria-hidden.
 * 🔴 캔버스는 클라이언트 전용이라 서버 HTML 에는 검은 면만 나온다. LCP 는 텍스트가 잡는다.
 */

/** 화소 사이 바탕. 완전한 검정보다 살짝 푸른 쪽이 유리 표면처럼 읽힌다. */
const BG = '#05080C'

/** 밝기 양자화 단계 = 스프라이트 장수. 48이면 그라데이션 띠가 눈에 보이지 않는다. */
const LEVELS = 48

/**
 * 팔레트 — 꺼진 화소 → 딥블루 → 브랜드 주황 → 흰 하이라이트.
 * 어두운 화소가 있어야 "켜진 화면" 으로 보이지만, **너무 많으면 회색 덩어리가 된다.**
 *
 * 2026-09-09 COO 스크린샷 검수: "방향은 맞는데 탁하다."
 * → 딥블루·주황 정거장을 앞으로 당겨(0.58→0.50, 0.84→0.72) **하이라이트 구간을 넓혔다.**
 *   주황→흰 구간이 0.16 폭에서 0.28 폭이 되면서 광파의 마루가 또렷한 띠로 흐른다.
 */
const STOPS: Array<[number, [number, number, number]]> = [
  [0.0, [11, 18, 32]], // #0B1220 — 꺼진 화소
  [0.28, [16, 30, 78]],
  [0.5, [30, 58, 138]], // #1E3A8A 딥블루
  [0.72, [222, 103, 29]], // #DE671D 브랜드 주황
  [1.0, [255, 238, 214]], // 하이라이트
]

/** 레벨 → [r,g,b]. 모듈 로드 시 1회. */
const PALETTE: Array<[number, number, number]> = (() => {
  const out: Array<[number, number, number]> = []
  for (let i = 0; i < LEVELS; i += 1) {
    const p = i / (LEVELS - 1)
    let k = 0
    while (k < STOPS.length - 2 && p > STOPS[k + 1][0]) k += 1
    const [p0, c0] = STOPS[k]
    const [p1, c1] = STOPS[k + 1]
    const f = p1 === p0 ? 0 : (p - p0) / (p1 - p0)
    out.push([
      Math.round(c0[0] + (c1[0] - c0[0]) * f),
      Math.round(c0[1] + (c1[1] - c0[1]) * f),
      Math.round(c0[2] + (c1[2] - c0[2]) * f),
    ])
  }
  return out
})()

/** 글로우를 얹기 시작하는 레벨. 상위 40% 만 발광한다. */
const GLOW_FROM = Math.floor(LEVELS * 0.6)
/** 글로우 불투명도. 2026-09-09 검수에서 .25 → .35 (도트 사이 검정이 좁아져 "면"으로 읽힌다). */
const GLOW_ALPHA = 0.35
/** 도트 반지름 = 셀 × 이 값. 검수에서 .38 → .42. */
const DOT_RATIO = 0.42

/**
 * 밝기 곡선 LUT — 원시값 0~1(257단계)을 팔레트 레벨로 옮긴다.
 *
 * 왜 표로 굽는가 — 감마를 `Math.pow` 로 화소마다 계산하면 프레임당 8천 번이다.
 * 곡선은 시간에 따라 변하지 않으므로 모듈 로드 시 한 번 구워 두면 루프에서 배열 조회 1회로 끝난다.
 *
 * 🔴 지수 1.35. 처음에는 1.8 이었는데 중간 밝기 화소가 전부 눌려 회색 덩어리로 읽혔다
 *    (2026-09-09 COO 스크린샷 검수). 1.35 는 꺼진 화소를 남기면서 중간 밝기를 되살리는 지점이다.
 *    1.0 으로 내리면 전 화소가 골고루 빛나 그냥 알록달록한 배경이 된다.
 */
const GAMMA = 1.35
const CURVE: Uint8Array = (() => {
  const lut = new Uint8Array(257)
  for (let i = 0; i <= 256; i += 1) {
    const g = Math.pow(i / 256, GAMMA)
    lut[i] = Math.min(LEVELS - 1, Math.round(g * (LEVELS - 1)))
  }
  return lut
})()

/** 공간 주파수 — 화소 칸 기준. 데스크톱 폭(약 100칸)에 큰 파동 1.5~2.5개가 지나간다. */
const K1 = (Math.PI * 2) / 74
const K2 = (Math.PI * 2) / 46
const K3 = (Math.PI * 2) / 118

/** 시간 주파수 — 주기 16 / 12 / 20초. */
const W1 = (Math.PI * 2) / 16
const W2 = (Math.PI * 2) / 12
const W3 = (Math.PI * 2) / 20

/** 커서 광원 반경(px)과 최대 가산 밝기. */
const CURSOR_R = 220
const CURSOR_GAIN = 0.32

/** 프레임 상한 30fps. 33ms 보다 이르게 온 프레임은 그리지 않고 넘긴다. */
const FRAME_MS = 33

/** 자가 점검 — 첫 60프레임 평균이 이 값을 넘으면 셀을 키워 화소 수를 줄인다. */
const BUDGET_MS = 8
const PROBE_FRAMES = 60
/** 완화 단계 상한. 무한히 성겨지면 격자가 사라진다. */
const MAX_RELIEF = 3

export function HeroLedWall({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    /* ── 격자 상태. 리사이즈·완화 때만 다시 잡는다 ─────────────── */
    let cw = 0 // CSS 픽셀 폭
    let ch = 0
    let cell = 14
    let cols = 0
    let rows = 0
    /** 저사양 완화 단계. 셀 크기에 +3px/단계. */
    let relief = 0

    let waveX = new Float32Array(0)
    let waveY = new Float32Array(0)
    let waveD = new Float32Array(0)
    /** 스프라이트를 찍을 좌상단 좌표(정수). 정수 정렬이 블릿을 빠르게 한다. */
    let posX = new Int16Array(0)
    let posY = new Int16Array(0)
    /** 레벨별 스프라이트. 크기는 spriteCss(CSS px) 정사각. */
    let sprites: HTMLCanvasElement[] = []
    let spriteCss = 0

    /**
     * 스프라이트를 굽는다 — (글로우 alpha .25, 반지름 1.6배) + (도트 본체) 합성 1장 × 48레벨.
     * 프레임 루프가 이 그림을 그대로 찍기만 하므로, 여기서 아무리 정성껏 그려도 런타임 비용이 아니다.
     */
    const bakeSprites = (dotR: number, dpr: number) => {
      const glowR = dotR * 1.6
      spriteCss = Math.ceil(glowR * 2) + 2
      const px = Math.ceil(spriteCss * dpr)
      const c = spriteCss / 2

      sprites = PALETTE.map(([r, g, b], l) => {
        const s = document.createElement('canvas')
        s.width = px
        s.height = px
        const sc = s.getContext('2d')
        if (!sc) return s
        sc.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (l >= GLOW_FROM) {
          sc.fillStyle = `rgba(${r},${g},${b},${GLOW_ALPHA})`
          sc.beginPath()
          sc.arc(c, c, glowR, 0, Math.PI * 2)
          sc.fill()
        }
        sc.fillStyle = `rgb(${r},${g},${b})`
        sc.beginPath()
        sc.arc(c, c, dotR, 0, Math.PI * 2)
        sc.fill()
        return s
      })
    }

    const layout = () => {
      const rect = canvas.getBoundingClientRect()
      cw = Math.max(1, Math.round(rect.width))
      ch = Math.max(1, Math.round(rect.height))

      // 셀 간격 12~16px(+완화 단계). 좁은 화면일수록 촘촘하면 모아레가 생기므로 폭에 비례시킨다.
      cell = Math.max(12, Math.min(16, Math.round(cw / 105))) + relief * 3
      const dotR = Math.max(2, cell * DOT_RATIO)
      cols = Math.ceil(cw / cell) + 1
      rows = Math.ceil(ch / cell) + 1

      /**
       * DPR — 넓은 화면에서 2x 를 쓰면 픽셀 수가 4배가 되고 그게 45초 멈춤의 절반이었다.
       * 도트 간격이 12~16px 라 1x 로도 격자는 또렷하다.
       */
      const raw = window.devicePixelRatio || 1
      const dpr = cw >= 1400 ? 1 : Math.min(1.5, raw)

      canvas.width = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // 스프라이트는 이미 알맞은 크기로 구워져 있다. 확대 보간을 끄면 블릿이 더 싸다.
      ctx.imageSmoothingEnabled = false

      bakeSprites(dotR, dpr)

      waveX = new Float32Array(cols)
      waveY = new Float32Array(rows)
      waveD = new Float32Array(cols + rows)
      posX = new Int16Array(cols)
      posY = new Int16Array(rows)
      const half = spriteCss / 2
      for (let x = 0; x < cols; x += 1) posX[x] = Math.round(x * cell + cell * 0.5 - half)
      for (let y = 0; y < rows; y += 1) posY[y] = Math.round(y * cell + cell * 0.5 - half)
    }

    /* ── 커서 광원 — 지역 변수. 리렌더를 만들지 않는다 ───────── */
    let pointerOn = false
    let ptrX = 0
    let ptrY = 0
    let lerpX = 0
    let lerpY = 0

    const draw = (tSec: number) => {
      // 1) 파동 항 분리 — 세 항이 각각 x·y·(x+y) 에만 의존하므로 프레임당 sin 은 약 300회뿐이다
      for (let x = 0; x < cols; x += 1) waveX[x] = Math.sin(x * K1 + tSec * W1)
      for (let y = 0; y < rows; y += 1) waveY[y] = Math.sin(y * K2 - tSec * W2)
      for (let d = 0; d < cols + rows; d += 1) waveD[d] = Math.sin(d * K3 + tSec * W3)

      // 커서는 지연 추종. 즉시 따라오면 신경질적으로 보인다.
      lerpX += (ptrX - lerpX) * 0.12
      lerpY += (ptrY - lerpY) * 0.12

      ctx.fillStyle = BG
      ctx.fillRect(0, 0, cw, ch)

      const r2 = CURSOR_R * CURSOR_R
      const size = spriteCss
      const halfCell = cell * 0.5

      // 2) 블릿 — 경로 그리기 없음. drawImage 한 번씩.
      for (let y = 0; y < rows; y += 1) {
        const wy = waveY[y]
        const py = posY[y]
        const cy = y * cell + halfCell
        for (let x = 0; x < cols; x += 1) {
          let v = (waveX[x] + wy + waveD[x + y]) / 3 // -1 ~ 1
          v = v * 0.5 + 0.5 // 0 ~ 1

          if (pointerOn) {
            const dx = x * cell + halfCell - lerpX
            const dy = cy - lerpY
            const d2 = dx * dx + dy * dy
            if (d2 < r2) {
              const f = 1 - d2 / r2
              v += CURSOR_GAIN * f * f
            }
          }

          // 감마는 LUT 가 진다 — 화소마다 Math.pow 를 부르지 않는다
          const lv = CURVE[v <= 0 ? 0 : v >= 1 ? 256 : (v * 256) | 0]
          ctx.drawImage(sprites[lv], posX[x], py, size, size)
        }
      }
    }

    layout()

    /* ── reduced-motion: 한 프레임만 그리고 끝낸다 ───────────── */
    if (reduce) {
      draw(0)
      const roStatic = new ResizeObserver(() => {
        layout()
        draw(0)
      })
      roStatic.observe(canvas)
      return () => roStatic.disconnect()
    }

    /* ── 애니메이션 루프 ─────────────────────────────────────── */
    let raf = 0
    let running = false
    let onScreen = true
    let last = 0
    const t0 = performance.now()

    // 프레임 예산 자가 점검 상태
    let probeCount = 0
    let probeSum = 0
    let probeDone = false

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      // 30fps 상한 — 광파가 12~20초 주기라 60fps 는 낭비다
      if (now - last < FRAME_MS) return
      last = now

      const t1 = performance.now()
      draw((now - t0) / 1000)

      if (!probeDone) {
        probeSum += performance.now() - t1
        probeCount += 1
        if (probeCount >= PROBE_FRAMES) {
          const avg = probeSum / probeCount
          if (avg > BUDGET_MS && relief < MAX_RELIEF) {
            // 저사양 자동 완화 — 셀을 키워 화소 수를 줄이고 다시 잰다
            relief += 1
            layout()
            probeCount = 0
            probeSum = 0
          } else {
            probeDone = true
          }
        }
      }
    }

    const start = () => {
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    const sync = () => {
      if (onScreen && !document.hidden) start()
      else stop()
    }

    document.addEventListener('visibilitychange', sync)

    /**
     * 🔴 히어로가 화면 밖으로 나가면 멈춘다. 이게 없으면 사용자가 페이지 아래쪽을 읽는 내내
     *    보이지도 않는 8천 개 도트를 계속 그린다.
     */
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting)
        sync()
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    /**
     * 커서 광원.
     * 🔴 캔버스와 그 래퍼는 pointer-events-none 이라 요소에 직접 건 리스너는 절대 발화하지 않는다.
     *    그래서 window 에서 받고 캔버스 사각형으로 좌표를 환산한다(패럴랙스 이동도 rect 에 반영된다).
     * 터치는 제외한다 — 손가락 아래는 어차피 안 보이고 리페인트만 는다.
     */
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !running) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < -CURSOR_R || y < -CURSOR_R || x > rect.width + CURSOR_R || y > rect.height + CURSOR_R) {
        pointerOn = false
        return
      }
      ptrX = x
      ptrY = y
      if (!pointerOn) {
        // 첫 진입에서 화면 밖(0,0)부터 날아오지 않게 시작점을 맞춘다
        lerpX = x
        lerpY = y
        pointerOn = true
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const ro = new ResizeObserver(() => layout())
    ro.observe(canvas)

    sync()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pointermove', onPointerMove)
      io.disconnect()
      ro.disconnect()
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
      style={{ backgroundColor: BG }}
    />
  )
}
