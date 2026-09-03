import Link from 'next/link'
import { FileText } from 'lucide-react'

import { Reveal, Stagger } from '@/components/motion'

/**
 * 제출 서류 목록.
 *
 * 담당자가 결재를 올릴 때 실제로 막히는 것은 제품이 아니라 **첨부 서류**다.
 * "필요한 서류 다 드립니다"는 아무 정보가 없다. 무엇을, 언제, 어떤 형식으로
 * 받을 수 있는지 적어야 그대로 기안문 첨부 목록으로 옮길 수 있다.
 *
 * ⚠️ 파일 크기·개정일을 적으려면 실제 파일이 있어야 한다(벤치마크 §6 안티패턴 14).
 *    지금은 현장마다 내용이 달라 미리 올려 둔 고정 파일이 없다. 그래서
 *    없는 다운로드 링크를 만들지 않고 "요청 시 발송"이라고 정직하게 적는다.
 *    표준 규격서가 확정되면 그때 크기·개정일과 함께 직접 내려받게 바꾼다.
 */
type Doc = { name: string; when: string; form: string; note?: string }

const DOCS: Doc[] = [
  { name: '사업자등록증 · 법인등기부등본', when: '문의 즉시', form: 'PDF' },
  { name: '개략 견적서', when: '문의 후 1영업일 이내', form: 'PDF', note: '예상 범위와 산출 근거 포함' },
  { name: '제품 규격서', when: '견적 단계', form: 'PDF', note: '품명·규격·수량·내용연수 기재' },
  { name: '현장 실측 조서', when: '실측 후', form: 'PDF' },
  { name: '설치 위치 도면', when: '실측 후', form: 'PDF · DWG', note: '기존 구조물·지상고 표기' },
  { name: '확정 견적서', when: '실측 후', form: 'PDF' },
  { name: '취부 상세도 · 구조 검토 의견서', when: '시공 전', form: 'PDF' },
  { name: 'KC 적합등록 서류', when: '계약 단계', form: 'PDF', note: '해당 부품의 인증서 사본' },
  { name: '작동 검사 성적서', when: '출고 시', form: 'PDF', note: '색·밝기 균일도 측정 기록' },
  { name: '시운전 확인서 · 시공 사진 대장', when: '준공 시', form: 'PDF' },
  { name: '조작 안내서', when: '인수 시', form: 'PDF', note: '화면 캡처를 넣은 담당자용' },
  { name: 'A/S 처리 보고서', when: '장애 처리 후', form: 'PDF', note: '검수·감사 자료로 사용 가능' },
]

export function DocumentList() {
  return (
    <section id="documents" aria-labelledby="docs-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">제출 서류</p>
          <h2 id="docs-h" className="wk-h2 text-wk-ink">
            결재에 붙일 서류를
            <br className="hidden sm:block" /> 미리 적어 둡니다
          </h2>
          <p className="wk-lead mt-5">
            어떤 문서를 언제 받을 수 있는지 알아야 기안 일정을 잡으실 수 있습니다.
            아래 목록을 그대로 첨부 서류 항목으로 쓰셔도 됩니다.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line sm:grid-cols-2" y={12} gap={0.04}>
          {DOCS.map((d) => (
            <div key={d.name} className="flex h-full gap-4 bg-white p-5 sm:p-6">
              <FileText size={18} className="mt-0.5 shrink-0 text-wk-cta" aria-hidden="true" />
              <div className="min-w-0">
                <b className="block text-body font-semibold text-wk-ink">{d.name}</b>
                <p className="wk-cap mt-1.5">
                  {d.when} · {d.form}
                </p>
                {d.note && <p className="wk-cap mt-1 !text-wk-ink3">{d.note}</p>}
              </div>
            </div>
          ))}
        </Stagger>

        <Reveal delay={0.1} y={12}>
          <div className="mt-8 flex flex-col gap-3 rounded-card-m border border-wk-line bg-wk-bgFaint p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="wk-body !text-wk-ink2">
              모든 서류는 요청하시면 기관 양식에 맞춰 정리해 보내드립니다.
              필요한 목록만 알려주십시오.
            </p>
            <Link href="/quote" className="wk-btn-p shrink-0">
              서류 요청하기
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
