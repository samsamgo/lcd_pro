/**
 * 연락처 검증 — 화면과 서버가 같은 규칙을 쓴다.
 *
 * 왜 따로 뺐나 —
 * A/S 폼과 빠른 상담 모달은 "비어 있지 않은지"만 봤는데 `/api/lead` 는 숫자 9~11자리를 요구했다.
 * "010-12" 처럼 덜 적은 담당자에게는 400 이 돌아왔고, 화면에는 서버가 준 사유 대신
 * "접수 중 문제가 발생했습니다" 만 떴다. 무엇을 고쳐야 하는지 알 수 없으니 그대로 이탈한다.
 * 규칙이 한 곳에 있어야 다시 어긋나지 않는다. 서버 규칙 = `app/api/lead/route.ts`.
 */
export const phoneDigits = (v: string) => v.replace(/[^\d]/g, '')

/** 통과하면 null, 아니면 화면에 그대로 띄울 사유를 돌려준다. */
export function validatePhone(v: string): string | null {
  const raw = v.trim()
  if (!raw) return '연락처를 입력해 주십시오.'
  const digits = phoneDigits(raw)
  if (digits.length < 9 || digits.length > 11) {
    return '연락처를 다시 확인해 주십시오. 지역번호나 휴대폰 번호를 숫자 9~11자리로 입력합니다.'
  }
  return null
}

/**
 * 접수 실패 응답에서 사유를 꺼낸다.
 * 서버가 이유를 말해 줬는데 화면이 "네트워크 오류" 로 뭉개면 담당자는 고칠 방법이 없다.
 */
export async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const json = (await res.json()) as { error?: unknown }
    if (typeof json.error === 'string' && json.error.trim()) return json.error
  } catch {
    // 본문이 JSON 이 아니면 fallback 을 쓴다
  }
  return fallback
}
