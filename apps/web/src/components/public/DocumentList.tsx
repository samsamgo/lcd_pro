import Link from 'next/link'

/**
 * 발주 전 자료실.
 *
 * 경쟁사 12곳 조사에서 어느 곳도 제공하지 않았다.
 * 화려한 연출보다 담당자의 실제 업무(규격서 작성·검수 준비)를 줄여주는 쪽이
 * 공공 구매자에게 강하게 작동한다.
 *
 * ⚠️ 문서 6종은 아직 작성 전이다. 파일이 준비되기 전까지 href는 문의로 보낸다.
 *    준비되면 ready: true 와 file 경로를 채운다.
 */
interface Doc {
  title: string
  format: string
  ready?: boolean
  file?: string
}

const DOCS: Doc[] = [
  { title: '표준 규격서 양식', format: 'HWP · PDF' },
  { title: '현장조사표', format: 'PDF' },
  { title: '설치 범위표', format: 'PDF' },
  { title: '검수 체크리스트', format: 'PDF' },
  { title: 'A/S 기준 · 보증 범위', format: 'PDF' },
  { title: '사업자등록증 · KC 인증서', format: 'PDF' },
]

export function DocumentList() {
  return (
    <section id="docs" className="wk-sec bg-wk-bg">
      <div className="wk-wrap">
        <p className="wk-eyebrow">자료실</p>
        <h2 className="wk-h2 text-wk-ink">발주 전에 필요한 서류</h2>
        <p className="wk-lead mt-3.5 max-w-[40em]">
          회원가입 없이 받으실 수 있습니다. 예산 잡는 단계에서 참고만 하셔도 됩니다.
        </p>

        <div className="mt-7 rounded-card-m bg-white px-5 py-1 sm:rounded-card sm:px-7">
          {DOCS.map((d) => (
            <Link
              key={d.title}
              href={d.ready && d.file ? d.file : '/quote'}
              className="wk-row-link"
            >
              <span className="flex-1 text-[17px] font-semibold text-wk-ink">{d.title}</span>
              <span className="shrink-0 text-sm text-wk-ink4">{d.format} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
