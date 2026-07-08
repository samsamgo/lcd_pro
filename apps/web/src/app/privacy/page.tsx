import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { SITE } from '@/lib/seo/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `개인정보처리방침 — ${SITE.nameKo}`,
  robots: 'noindex',
}

const SECTIONS = [
  {
    title: '1. 수집하는 개인정보',
    content: `견적 요청 시 다음의 개인정보를 수집합니다:
- 상호명, 담당자 성명
- 연락처(휴대폰 번호), 이메일(선택)
- 설치 희망 지역
- 현장 사진 (업로드된 이미지)`,
  },
  {
    title: '2. 수집 및 이용 목적',
    content: `수집된 개인정보는 다음 목적에만 사용됩니다:
- LED 전광판 설치 견적 산출 및 발송
- 견적 관련 상담 및 계약 진행
- 설치 완료 후 AS·유지보수 안내`,
  },
  {
    title: '2-1. 현장 사진의 수집·이용',
    content: `업로드하신 매장·현장 사진은 오직 설치 위치와 규모를 파악해 범위 견적을 산출하는 용도로만 사용합니다.
- 사진은 견적 산출·상담 목적 외에 마케팅 등 다른 용도로 사용하지 않습니다.
- 고객 동의 없이 사진을 외부에 공개하거나 제3자에게 제공하지 않습니다.
- 견적 목적 달성 후 또는 삭제 요청 시 지체 없이 파기합니다.
- 시공 사례로 활용이 필요한 경우, 별도의 명시적 동의를 받은 사진만 사용합니다.`,
  },
  {
    title: '3. 보유 및 이용 기간',
    content: `개인정보 수집일로부터 3년간 보유 후 즉시 파기합니다.
단, 계약이 체결된 경우 관련 법령에 따라 계약서, 청약철회에 관한 기록은 5년간 보존됩니다.`,
  },
  {
    title: '4. 개인정보의 제3자 제공',
    content: `수집된 개인정보는 원칙적으로 제3자에게 제공하지 않습니다.
다만, 설치 공사를 위해 파트너 설치 기사에게 설치 주소와 연락처가 공유될 수 있으며, 이 경우 사전에 고객의 동의를 받습니다.`,
  },
  {
    title: '5. 개인정보 보호 조치',
    content: `- 전송 구간 암호화 (HTTPS/TLS)
- 데이터베이스 암호화 저장
- 접근 권한 최소화 (담당자 한정)
- 사진 파일 비공개 전용 스토리지 저장`,
  },
  {
    title: '6. 정보주체의 권리',
    content: `고객은 언제든지 다음 권리를 행사할 수 있습니다:
- 개인정보 열람 요청
- 개인정보 정정·삭제 요청
- 개인정보 처리 정지 요청

요청은 이메일(${SITE.email}) 또는 상담 채널로 접수합니다. 10일 이내에 처리합니다.
사진 삭제를 원하시면 위 연락처로 요청해 주시면 즉시 파기합니다.`,
  },
  {
    title: '7. 문의처',
    content: `개인정보 관련 문의:\n이메일: ${SITE.email}${SITE.phone ? `\n전화: ${SITE.phone}` : ''}${SITE.openingHours ? `\n운영시간: ${SITE.openingHours}` : ''}`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900">개인정보처리방침</h1>
          <p className="mb-10 text-sm text-zinc-500">시행일: 2024년 1월 1일 · 최종 수정: 2024년 1월 1일</p>

          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="mb-3 text-lg font-semibold text-zinc-900">{s.title}</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
