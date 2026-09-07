/**
 * 공통 폼 부품.
 *
 * 이 사이트의 문의 입력 칸은 넷이다 — 견적 마법사(/quote) · 빠른 상담 모달 ·
 * /about 문의 · /support A/S 접수. **받는 정보와 목적지가 실제로 다르므로 합치지 않는다.**
 * 합쳐야 하는 것은 겉모습과 동작이다. 라벨·필수 표시·오류·동의·버튼·완료 화면을
 * 여기 한 곳에 두고 넷이 가져다 쓴다. 중복이 없어야 다음에 또 갈라지지 않는다.
 *
 * 리드 경로 자체(어디로 무엇을 보내는가)는 각 폼이 그대로 갖는다.
 */
export { FormToneProvider, useFormTone, useFormToneName, FORM_TONES } from './tone'
export type { FormToneName, ToneTokens } from './tone'
export { Field, RequiredLegend } from './Field'
export { TextInput, TextArea, SelectInput, OptionButton, CheckRow } from './controls'
export {
  FormError,
  FormSuccess,
  ResponsePromise,
  RESPONSE_PROMISE,
  SUBMIT_FAILED,
} from './feedback'
export { PrivacyConsent } from './PrivacyConsent'
export { SubmitButton } from './SubmitButton'
