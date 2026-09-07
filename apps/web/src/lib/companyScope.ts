/**
 * 회사 소개에 쓰는 "취급 범위" 수치 — 전부 코드에서 파생한다.
 *
 * 🔴 왜 이 파일이 따로 있는가.
 * 회사 소개 페이지에 큰 활자로 숫자를 걸면 그 숫자는 곧 대외 주장이 된다.
 * 우리는 첫 수주 전이라 실적·납품 건수·연차 같은 숫자가 하나도 없다.
 * 그래서 **지어낼 수 있는 자리를 아예 만들지 않는다.** 이 파일은 손으로 적은 값을
 * 하나도 두지 않고, 견적엔진(`standardBlock.ts`)과 제품 카탈로그(`products.ts`)에서
 * 계산한 값만 내보낸다. 카탈로그가 바뀌면 회사 소개의 숫자도 같이 바뀐다.
 *
 * 여기 있는 것은 전부 "우리가 무엇을 다루는가"(카탈로그 사실)이지
 * "우리가 무엇을 해냈는가"(실적)가 아니다. 후자는 확보되기 전까지 자리를 비워 둔다.
 */
import { PRODUCTS } from './products'
import {
  CABINET_H_MM,
  CABINET_W_MM,
  CONTROLLERS,
  FAMILIES,
  LAYOUTS,
  MODULES_PER_CABINET,
} from './standardBlock'

/** 'P1.86' → 1.86 */
const pitchValue = (p: string) => Number(p.replace(/[^0-9.]/g, ''))
/** '6,000 nit' → 6000 */
const nitValue = (b: string) => Number(b.replace(/[^0-9]/g, ''))

const ko = (n: number) => n.toLocaleString('ko-KR')

/**
 * 취급 화소 간격 — 견적엔진 제품군 ∪ 제품 카탈로그의 합집합.
 * 이전에는 CompanyHero 안에 'P1.86 – P6' 문자열이 손으로 박혀 있었다.
 * 카탈로그가 늘어도 그 문자열은 따라오지 않으므로 계산으로 바꿨다.
 */
const ALL_PITCHES = Array.from(
  new Set([...Object.values(FAMILIES).map((f) => f.pitch), ...PRODUCTS.map((p) => p.pitch)]),
).sort((a, b) => pitchValue(a) - pitchValue(b))

export const PITCH_MIN = ALL_PITCHES[0]
export const PITCH_MAX = ALL_PITCHES[ALL_PITCHES.length - 1]
export const PITCH_RANGE = `${PITCH_MIN} – ${PITCH_MAX}`

/** 밝기 범위 — 실내 최저부터 옥외 최고까지 */
const NITS = PRODUCTS.map((p) => nitValue(p.brightness)).filter((n) => Number.isFinite(n) && n > 0)
export const NIT_MIN = Math.min(...NITS)
export const NIT_MAX = Math.max(...NITS)
export const NIT_RANGE = `${ko(NIT_MIN)} – ${ko(NIT_MAX)}`

/** 표준 캐비닛 외형 — 견적엔진의 단일 진실원 */
export const CABINET_SIZE = `${CABINET_W_MM} × ${CABINET_H_MM}`
export const MODULES_PER_CAB = MODULES_PER_CABINET

/** 견적엔진에 등록된 표준 배치 수 */
export const LAYOUT_COUNT = LAYOUTS.length

/** 옥외 제품의 방수·방진 등급 (제품 카탈로그에서 추출, 'IP65 (전면·후면)' → 'IP65') */
export const OUTDOOR_INGRESS =
  PRODUCTS.find((p) => p.env === 'outdoor')?.ingress.match(/IP\d{2}/)?.[0] ?? ''

/** 컨트롤러 1대가 감당하는 최대 화소 (NovaStar Taurus 상위 모델 기준) */
const TOP_CONTROLLER = CONTROLLERS.reduce((a, b) => (b.max_px > a.max_px ? b : a))
export const CONTROLLER_MAX_PX = ko(TOP_CONTROLLER.max_px)
export const CONTROLLER_MODEL = TOP_CONTROLLER.model
