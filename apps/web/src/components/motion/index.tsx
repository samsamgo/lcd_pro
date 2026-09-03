'use client'

/**
 * 우강테크 모션 프리미티브.
 *
 * 왜 한 파일에 모으는가 —
 * 페이지마다 각자 transition을 적으면 곡선과 지속시간이 조금씩 어긋난다.
 * 그 어긋남이 "템플릿으로 만든 사이트" 느낌의 정체다.
 * 사이트 전체가 여기 있는 부품만 쓰면 연출이 한 손에서 나온 것처럼 읽힌다.
 *
 * 규칙
 * - 이징은 EASE 4종만 쓴다. 새 곡선을 컴포넌트에 직접 적지 말 것.
 * - 애니메이션 대상은 transform / opacity 로 제한한다(레이아웃 재계산 회피).
 * - 모든 부품은 prefers-reduced-motion 에서 정적으로 떨어진다.
 */

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

/** 사이트 전역 이징. tailwind.config.ts 의 transitionTimingFunction 과 같은 값. */
export const EASE = {
  /** 등장 — 빠르게 나와서 부드럽게 멈춘다 */
  entrance: [0.16, 1, 0.3, 1] as const,
  /** 상태 변화 — hover / press */
  state: [0.4, 0, 0.2, 1] as const,
  /** 스크롤 스크럽 — 양끝이 무겁다 */
  scrub: [0.83, 0, 0.17, 1] as const,
  /** 강조 팝 — 살짝 넘어갔다 돌아온다 */
  spring: [0.34, 1.56, 0.64, 1] as const,
}

export const DUR = {
  state: 0.15,
  enter: 0.6,
  cine: 0.9,
  image: 1.2,
}

/* ────────────────────────────────────────────────────────────
   1. Reveal — 스크롤 등장
   ──────────────────────────────────────────────────────────── */

type RevealProps = {
  children: ReactNode
  /** 시작 오프셋(px). 0이면 페이드만 */
  y?: number
  x?: number
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  style?: CSSProperties
  as?: 'div' | 'section' | 'li' | 'span' | 'article' | 'header'
}

export function Reveal({
  children,
  y = 22,
  x = 0,
  delay = 0,
  duration = DUR.cine,
  className = '',
  once = true,
  style,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as] as typeof motion.div

  return (
    <Tag
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: reduce ? 0.3 : duration, delay, ease: EASE.entrance }}
    >
      {children}
    </Tag>
  )
}

/**
 * 이미지 전용 — 살짝 확대·블러 상태에서 제자리로 온다.
 * 사진이 "붙어 있는 그림" 이 아니라 "들어오는 장면" 으로 읽힌다.
 */
export function RevealImage({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.07, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: reduce ? 0.3 : DUR.image, delay, ease: EASE.entrance }}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   2. Stagger — 자식들이 차례로 들어온다
   ──────────────────────────────────────────────────────────── */

/**
 * 카드 목록·리스트에 쓴다.
 * 간격 70ms 는 "따라 들어온다" 가 보이면서 답답하지 않은 지점이다.
 */
export function Stagger({
  children,
  className = '',
  gap = 0.07,
  delay = 0,
  y = 20,
}: {
  children: ReactNode
  className?: string
  gap?: number
  delay?: number
  y?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{ show: { transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay } } }}
    >
      {Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={{
            hide: reduce ? { opacity: 0 } : { opacity: 0, y },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: reduce ? 0.3 : DUR.enter, ease: EASE.entrance }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   3. SplitText — 제목을 어절 단위로 쪼개 올린다
   ──────────────────────────────────────────────────────────── */

/**
 * 한글은 글자 단위로 쪼개면 어색하다(자소 조합이 눈에 띈다).
 * 어절(공백) 단위로 끊어야 문장으로 읽히면서 움직임이 산다.
 */
export function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  gap = 0.055,
  as: Tag = 'h2',
  once = true,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  gap?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  once?: boolean
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hide"
        whileInView="show"
        viewport={{ once, margin: '-12% 0px' }}
        variants={{ show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{
                hide: { y: '110%', opacity: 0 },
                show: { y: '0%', opacity: 1 },
              }}
              transition={{ duration: 0.85, ease: EASE.entrance }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/* ────────────────────────────────────────────────────────────
   4. Parallax — 스크롤에 따라 느리게 흐른다
   ──────────────────────────────────────────────────────────── */

/**
 * 배경 사진에 얹는다. 강도 0.12~0.25 를 넘기면 멀미가 난다.
 */
export function Parallax({
  children,
  strength = 0.16,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const raw = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`])
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   5. StickyScene — 화면에 고정된 채 스크롤로 장면이 바뀐다
   ──────────────────────────────────────────────────────────── */

/**
 * Apple 제품 페이지의 그 연출.
 * 바깥 컨테이너에 높이를 주고, 안쪽은 sticky 로 붙인다.
 * children 은 0~1 진행도를 받아 원하는 변형을 만든다.
 *
 * 진행도를 직접 쓰기 때문에 스크롤 위치와 화면이 정확히 일치한다
 * (IntersectionObserver 로는 이 정밀도가 안 나온다).
 */
export function StickyScene({
  children,
  /** 스크롤 길이 배수. 2 = 화면 2개분 스크롤 동안 장면이 진행 */
  length = 2.4,
  className = '',
}: {
  children: (progress: MotionValue<number>) => ReactNode
  length?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35 })

  return (
    <div ref={ref} className={className} style={{ height: `${length * 100}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">{children(smooth)}</div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   6. Counter — 숫자가 올라간다
   ──────────────────────────────────────────────────────────── */

export function Counter({
  to,
  from = 0,
  duration = 1.4,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: {
  to: number
  from?: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(from)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      // out-expo — 카운터는 초반이 빨라야 "센다" 는 느낌이 난다
      const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setVal(from + (to - from) * e)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, from, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString('ko-KR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   7. Marquee — 끊김 없이 흐르는 띠
   ──────────────────────────────────────────────────────────── */

/**
 * 같은 내용을 두 벌 넣고 -50% 로 밀어 이음매를 없앤다.
 * 전광판 회사의 사이트라 흐르는 텍스트 자체가 제품 데모다.
 */
export function Marquee({
  children,
  speed = 'slow',
  className = '',
  reverse = false,
  pauseOnHover = true,
}: {
  children: ReactNode
  speed?: 'slow' | 'fast'
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className={[
          'flex w-max shrink-0',
          reduce ? '' : speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee',
          reverse ? '[animation-direction:reverse]' : '',
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
        ].join(' ')}
        aria-hidden={false}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   8. Spotlight — 커서를 따라다니는 광원
   ──────────────────────────────────────────────────────────── */

/**
 * 다크 카드 위에서만 쓴다. 라이트 배경에서는 때가 탄 것처럼 보인다.
 * 좌표는 CSS 변수로 넘겨 리렌더를 만들지 않는다.
 */
export function Spotlight({
  children,
  className = '',
  color = 'rgba(49,130,246,.22)',
  size = 420,
}: {
  children: ReactNode
  className?: string
  color?: string
  size?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={`group/spot relative ${className}`}
      style={{ ['--spot' as string]: color, ['--spot-size' as string]: `${size}px` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-state group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(var(--spot-size) circle at var(--mx,50%) var(--my,50%), var(--spot), transparent 70%)',
        }}
      />
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   9. Magnetic — 커서에 살짝 끌려오는 버튼
   ──────────────────────────────────────────────────────────── */

export function Magnetic({
  children,
  strength = 0.22,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.3 })
  const y = useSpring(my, { stiffness: 260, damping: 20, mass: 0.3 })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        mx.set((e.clientX - (r.left + r.width / 2)) * strength)
        my.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   10. ScrollScale — 들어오면서 커지고 모서리가 펴진다
   ──────────────────────────────────────────────────────────── */

/**
 * 큰 사진 한 장을 화면 폭까지 밀어 올릴 때 쓴다.
 * radius 를 같이 줄여야 "화면에 박힌다" 는 인상이 생긴다.
 */
export function ScrollScale({
  children,
  className = '',
  from = 0.86,
  to = 1,
}: {
  children: ReactNode
  className?: string
  from?: number
  to?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'end 55%'] })
  const s = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const scale = useTransform(s, [0, 1], [from, to])
  const radius = useTransform(s, [0, 1], ['36px', '20px'])

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduce ? undefined : { scale, borderRadius: radius }}
        className="overflow-hidden will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
