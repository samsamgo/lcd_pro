/**
 * Server Component 안에서 임의 JSON-LD를 inline 삽입.
 * - script type="application/ld+json" 표준 형식
 * - 다중 스키마는 여러 JsonLd 호출로 누적
 */
import React from 'react'

interface Props {
  id?: string
  data: object | object[]
}

export function JsonLd({ id, data }: Props) {
  const json = JSON.stringify(data)
  return (
    <script
      id={id}
      type="application/ld+json"
      // 직접 직렬화 — XSS 차단을 위해 </ 등 위험 토큰 제거
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  )
}
