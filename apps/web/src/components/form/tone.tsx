'use client'

import { createContext, useContext, type ReactNode } from 'react'

/**
 * 폼 톤(라이트/다크).
 *
 * 왜 필요한가 — 문의 폼 4종 중 `/about#contact` 만 다크 섹션(`wk-night`) 위에 얹힌다.
 * 라이트용 `.input-base` 를 그대로 쓰면 검은 면 위에 흰 상자가 떠서 위계가 뒤집히고,
 * 반대로 다크용 색을 흰 카드에 쓰면 글자가 읽히지 않는다.
 *
 * 그래서 **같은 부품을 쓰되 색만 갈라진다.** 부품마다 라이트/다크 두 벌을 만들지 않는다.
 * 색 조합은 여기 한 곳에만 있다 — 다시 갈라지지 않게 하려는 것이 이 파일의 목적이다.
 *
 * 🔴 `app/globals.css` 는 전역 시각 언어 담당 소유라 손대지 않는다.
 *    이미 있는 `.input-base` / `.wk-input-dark` 를 가져다 쓰고, 모자란 상태만 여기서 덧댄다.
 */
export type FormToneName = 'light' | 'dark'

export interface ToneTokens {
  /** 입력 상자 */
  input: string
  /** 필드 라벨 */
  label: string
  /** 라벨 옆 필수 표시 */
  required: string
  /** 입력 아래 설명 */
  hint: string
  /** 오류 문구 */
  error: string
  /** 폼 전체 오류 상자 */
  errorBox: string
  /** 동의 문구 등 보조 텍스트 */
  muted: string
  /** 본문 텍스트 */
  body: string
  /** 제목 */
  title: string
  /** 인라인 링크 */
  link: string
  /** 안내 상자(접수 후 안내) */
  noticeBox: string
}

export const FORM_TONES: Record<FormToneName, ToneTokens> = {
  light: {
    // .input-base 는 [aria-invalid='true'] 규칙을 이미 갖고 있다
    input: 'input-base',
    label: 'text-wk-ink',
    required: 'text-wk-cta',
    hint: 'text-wk-ink3',
    error: 'text-wk-bad',
    errorBox: 'border-wk-bad/30 bg-wk-bad/[0.06] text-wk-bad',
    muted: 'text-wk-ink3',
    body: 'text-wk-ink2',
    title: 'text-wk-ink',
    link: 'text-wk-cta underline underline-offset-4 hover:text-wk-ctaActive',
    noticeBox: 'border-wk-cta/30 bg-wk-cta/[0.06]',
  },
  dark: {
    // .wk-input-dark 에는 오류 상태 규칙이 없다. 전역 CSS 를 고치지 않고 여기서 덧댄다.
    input:
      'wk-input-dark aria-[invalid=true]:!border-wk-bad aria-[invalid=true]:focus:!ring-wk-bad/25',
    label: 'text-wk-nightInk',
    required: 'text-wk-blue',
    hint: 'text-wk-nightMuted',
    error: 'text-wk-bad',
    errorBox: 'border-wk-bad/40 bg-wk-bad/10 text-wk-bad',
    muted: 'text-wk-nightMuted',
    body: 'text-wk-nightMuted',
    title: 'text-wk-nightInk',
    link: 'text-wk-blue underline underline-offset-4 hover:text-wk-nightInk',
    noticeBox: 'border-white/15 bg-white/[0.04]',
  },
}

const ToneCtx = createContext<FormToneName>('light')

/** 폼을 감싸 톤을 지정한다. 감싸지 않으면 라이트. */
export function FormToneProvider({
  tone,
  children,
}: {
  tone: FormToneName
  children: ReactNode
}) {
  return <ToneCtx.Provider value={tone}>{children}</ToneCtx.Provider>
}

export function useFormTone(): ToneTokens {
  return FORM_TONES[useContext(ToneCtx)]
}

export function useFormToneName(): FormToneName {
  return useContext(ToneCtx)
}
