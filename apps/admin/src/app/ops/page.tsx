import { Activity } from 'lucide-react'
import { scanDept, findHarnessRoot, type DeptScan } from '@/lib/opsScan'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Status = 'done' | 'prog' | 'hold' | 'gap'

const STATUS: Record<Status, { badge: string; bar: string }> = {
  done: { badge: 'bg-emerald-500/20 text-emerald-300', bar: 'bg-emerald-400' },
  prog: { badge: 'bg-amber-500/20 text-amber-300', bar: 'bg-amber-400' },
  hold: { badge: 'bg-zinc-500/20 text-zinc-400', bar: 'bg-zinc-500' },
  gap: { badge: 'bg-red-500/20 text-red-300', bar: 'bg-red-400' },
}

type Dept = {
  name: string
  fn: string
  status: Status
  label: string
  progress: number
  doing: string
  dir?: string // 하네스 상대경로 — 있으면 라이브 카운트 표시
}

type Track = { name: string; role: string; dot: string; depts: Dept[] }

const STRUCTURE: Track[] = [
  {
    name: 'T1 · 제품 · 시공',
    role: 'LED HW 표준 · BOM · 시공 SOP · 자재 검수 · AS',
    dot: 'bg-teal-300',
    depts: [
      { name: '02 제품·하드웨어', fn: '표준블록·SKU', status: 'done', label: '✅ 95%', progress: 95, doing: '3 family × layout × ZONE 표준 + NovaStar 3-tier 확정', dir: 'T1-product/02-product-hardware' },
      { name: '08 운영·물류', fn: '시공SOP·재고', status: 'done', label: '✅ 90%', progress: 90, doing: '시공·설치·검수 SOP + 재고·물류 표준 완료', dir: 'T1-product/08-operations-logistics' },
      { name: '11 엔지니어링 통합', fn: 'BOM 게이트', status: 'prog', label: '🟡 60%', progress: 60, doing: '견적 v2.1 BOM 게이트 조건부 통과 → 정식 라벨 보강중', dir: 'T1-product/11-engineering-integration' },
    ],
  },
  {
    name: 'T2 · 시장 · 고객',
    role: '인바운드 마케팅 · 외주 영업 · CS/AS · 브랜드',
    dot: 'bg-fuchsia-300',
    depts: [
      { name: '07 디자인·브랜딩', fn: '브랜드·카피', status: 'done', label: '✅ 95%', progress: 95, doing: '우강테크/WK Tech 브랜드·워드마크·톤 확정(DECISION-FINAL)', dir: 'T2-market/07-design-branding' },
      { name: '06 고객·CS', fn: 'AS·카카오', status: 'prog', label: '🟡 80%', progress: 80, doing: 'CS·AS SOP·FAQ 완료 / AS SLA v2 ORDER 재발의 대기', dir: 'T2-market/06-customer-cs' },
      { name: '03 마케팅·영업', fn: 'SEO·외주', status: 'hold', label: '⏸ 50%', progress: 50, doing: '유료광고 중단 · 블로그/SEO·AEO 우선 ORDER 재발의 대기', dir: 'T2-market/03-marketing-sales' },
    ],
  },
  {
    name: 'T3 · 소프트웨어',
    role: 'lcd_pro 웹 · 관리자 · 견적 · 결제 · CMS · 모니터링',
    dot: 'bg-sky-300',
    depts: [
      { name: '01 웹개발 · MVP1', fn: '랜딩·문의·견적', status: 'done', label: '✅ 100%', progress: 100, doing: '랜딩 9섹션 + 견적 마법사 + 카카오/SMS 알림 — 구현 완료', dir: 'T3-software/01-web-development' },
      { name: '01 웹개발 · MVP2', fn: '관리자·결제', status: 'done', label: '✅ 90%', progress: 90, doing: '견적·파트너·프로젝트 관리 + Toss 정기결제 풀스택' },
      { name: '01 웹개발 · MVP3 + 배포', fn: 'CMS·라이브', status: 'gap', label: '🔴 35%', progress: 35, doing: 'CMS 설계만 완료 · Supabase prod 미실행 · 라이브 미배포' },
    ],
  },
  {
    name: 'T4 · 운영 · 법무 · 재무',
    role: '법인 · 계약 · 회계/견적 · 인사 · 공공조달',
    dot: 'bg-amber-300',
    depts: [
      { name: '04 재무·견적', fn: '가격·마진', status: 'done', label: '✅ 90%', progress: 90, doing: '견적 v2.1(3축+BOM9) 게이트 통과 / 시공단가 상향 영업정합 확인 필요', dir: 'T4-ops/04-finance-accounting' },
      { name: '10 공공조달', fn: '입찰', status: 'done', label: '✅ 85%', progress: 85, doing: '입찰 요건·G2B 모니터링·제안서 템플릿 / KC·EMC·ISO 자격 준비', dir: 'T4-ops/10-public-procurement' },
      { name: '05 법무·인증', fn: '계약·KC', status: 'prog', label: '🟡 80%', progress: 80, doing: '계약·약관·개인정보 완료 / P1.56·P5 KC OCR + 상표 출원 진행', dir: 'T4-ops/05-legal-compliance' },
      { name: '09 인사·조직', fn: 'JD·RACI', status: 'hold', label: '⏸ 보류', progress: 100, doing: '조직도·JD·RACI 작성 완료 / 채용 실행은 1차 목표 후', dir: 'T4-ops/09-hr-organization' },
    ],
  },
]

const KPIS = [
  { v: '₩0', l: '자체 매출', zero: true },
  { v: '0건', l: '자체 명의 시공', zero: true },
  { v: '0', l: '유료 구독(MRR)', zero: true },
  { v: '미배포', l: '라이브 서비스', zero: true },
  { v: '4종', l: 'KC 인증 모델', zero: false },
  { v: '4건', l: '실증 케이스(인계)', zero: false },
]

const PANELS = [
  {
    h: '⏳ 미결 의사결정',
    chip: 'CEO/창업팀',
    items: [
      ['공동창업', '역할·지분·시점 미정 (2주+ 경과)'],
      ['TRL 자료 권리', '인계 자산 활용 합의 미체결'],
      ['첫 외주 수주', '0건 — 컨택·파트너 MOU 필요'],
      ['플랫폼 배포', 'DB 실행 후 즉시 가능'],
      ['시공단가 상향', '영업 약속 정합 확인'],
    ],
  },
  {
    h: '🔴 리스크 · 공백',
    chip: '',
    items: [
      ['권리', '자산 상당수 TRL 인계분 — 자체실적 0건'],
      ['매출', '시장 검증 0 — "만들고 안 판" 상태'],
      ['공급망', '검증 직거래 다롄 1곳 편중(RMA 4개월)'],
      ['미점화', 'Supabase prod + Toss MID 미승인'],
    ],
  },
  {
    h: '🎯 다음 30일 게이트',
    chip: '',
    items: [
      ['1', '외주 가능처 5곳 컨택 + 파트너 1곳 MOU'],
      ['2', 'Supabase 실행 → 플랫폼 라이브 배포'],
      ['3', '보험 4종 견적 회수(첫 시공 전 필수)'],
      ['4', '공동창업자 1차 미팅 + TRL 권리 정리'],
    ],
  },
]

function fmtDate(ms: number | null): string {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export default function OpsPage() {
  const root = findHarnessRoot()
  // 라이브 스캔: dir이 있는 부서만
  const scans: Record<string, DeptScan> = {}
  for (const t of STRUCTURE) for (const d of t.depts) if (d.dir) scans[d.dir] = scanDept(d.dir)

  const now = new Date().toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="p-6">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Activity size={22} className="text-emerald-400" /> 전사 현황 (Ops)
          </h1>
          <p className="mt-1 text-sm text-zinc-500">부서별 역할 · 진행 작업 · 진척도 — 하네스 폴더 라이브 스캔</p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          1차 목표 · 첫 외주 시공 1건으로 제품 실증
        </span>
      </div>

      {!root && (
        <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          ⚠ 하네스 루트를 찾지 못했습니다. 라이브 카운트는 표시되지 않습니다. (env <code>HARNESS_ROOT</code> 설정 시 해결)
        </div>
      )}

      {/* KPI */}
      <div className="mb-5 grid grid-cols-3 gap-3 lg:grid-cols-6">
        {KPIS.map((k) => (
          <div key={k.l} className="glass rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.zero ? 'text-red-300' : 'text-emerald-300'}`}>{k.v}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">{k.l}</p>
          </div>
        ))}
      </div>

      {/* dual gauge */}
      <div className="mb-6 grid gap-3 lg:grid-cols-2">
        <Gauge name="내부 준비도 (제품·SW·인증·자산)" pct={80} color="from-emerald-400 to-teal-300" tone="text-emerald-300"
          note="표준·견적·관리자·결제·인증·재고 대부분 확보. '쏠 준비는 된' 상태." />
        <Gauge name="시장 실행도 (배포·매출·외주·구독)" pct={5} color="from-red-400 to-amber-300" tone="text-red-300"
          note="아직 첫 발 미발사 — DB 실행·배포·첫 외주 수주가 남은 핵심 게이트." />
      </div>

      {/* legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-[11px] text-zinc-500">
        <Lg c="bg-emerald-400" t="완료(≥90%)" /><Lg c="bg-amber-400" t="진행중" />
        <Lg c="bg-zinc-500" t="전략상 보류" /><Lg c="bg-red-400" t="공백/미점화" />
        <span className="text-zinc-600">라이브 = inbox(할당) · outbox(완료) · workspace(산출물) 폴더 실시간 집계</span>
      </div>

      {/* tracks */}
      <div className="grid gap-3 lg:grid-cols-2">
        {STRUCTURE.map((t) => (
          <div key={t.name} className="glass rounded-xl p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className={`inline-block h-2.5 w-2.5 rounded-sm ${t.dot}`} />
              {t.name}
            </h2>
            <p className="mb-3 mt-0.5 text-[11px] text-zinc-500">{t.role}</p>

            <div className="divide-y divide-white/[0.05]">
              {t.depts.map((d) => {
                const s = d.dir ? scans[d.dir] : undefined
                return (
                  <div key={d.name} className="py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-zinc-200">
                        {d.name} <span className="text-[11px] font-normal text-zinc-600">{d.fn}</span>
                      </span>
                      <span className={`badge ${STATUS[d.status].badge}`}>{d.label}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-black/40">
                      <div className={`h-full rounded ${STATUS[d.status].bar}`} style={{ width: `${d.progress}%` }} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      <span className="text-zinc-300">지금:</span> {d.doing}
                    </p>
                    {s?.found && (
                      <p className="mt-1 text-[10.5px] text-zinc-600">
                        할당 <span className="text-zinc-400">{s.orders}</span> · 완료{' '}
                        <span className="text-zinc-400">{s.reports}</span> · 산출물{' '}
                        <span className="text-zinc-400">{s.workspace}</span> · 최근{' '}
                        <span className="text-zinc-400">{fmtDate(s.lastActivity)}</span>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* panels */}
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {PANELS.map((p) => (
          <div key={p.h} className="glass rounded-xl p-4">
            <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold text-zinc-200">
              {p.h}
              {p.chip && <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] text-blue-300">{p.chip}</span>}
            </h3>
            <ul className="divide-y divide-white/[0.05]">
              {p.items.map(([tag, txt]) => (
                <li key={tag + txt} className="flex gap-2 py-1.5 text-[11.5px] text-zinc-500">
                  <span className="shrink-0 font-semibold text-zinc-300">{tag}</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-white/[0.06] pt-3 text-[10.5px] text-zinc-600">
        <span>라이브 스캔 · {root ?? '루트 미발견'} · {now}</span>
        <span>※ 실증 케이스·인증·재고는 TRL Korea 인계 자산 — 외부 자체실적 표기는 권리 합의 전제</span>
      </div>
    </div>
  )
}

function Gauge({ name, pct, color, tone, note }: { name: string; pct: number; color: string; tone: string; note: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-zinc-400">{name}</span>
        <span className={`text-2xl font-extrabold ${tone}`}>~{pct}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded bg-black/40">
        <div className={`h-full rounded bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[11px] text-zinc-600">{note}</p>
    </div>
  )
}

function Lg({ c, t }: { c: string; t: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-sm ${c}`} /> {t}
    </span>
  )
}
