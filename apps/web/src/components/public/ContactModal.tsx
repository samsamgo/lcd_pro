'use client'

import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'
import { SITE } from '@/lib/seo/site'

/**
 * 문의 채널 모달.
 *
 * 화면 전체를 문의 페이지로 넘기지 않고, 연락 수단만 모아서 띄운다.
 * '전화 문의' 같은 행위 지시형 문구 대신 채널 이름과 값을 그대로 보여준다.
 *
 * 채널 값이 없는 항목(카카오톡 채널 등)은 렌더하지 않는다.
 * 빈 링크를 남겨두면 담당자가 눌렀을 때 아무 일도 일어나지 않아 신뢰를 잃는다.
 */
export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tel = SITE.phone.replace(/[^0-9+]/g, '')

  const channels: { label: string; value: string; href: string; note?: string }[] = []

  if (SITE.phone) {
    channels.push({
      label: '대표번호',
      value: SITE.phone,
      href: `tel:${tel}`,
      note: SITE.openingHours,
    })
  }
  channels.push({
    label: '이메일',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  })
  if (SITE.kakaoChannelUrl) {
    channels.push({
      label: '카카오톡 채널',
      value: '채널로 문의',
      href: SITE.kakaoChannelUrl,
    })
  }
  if (SITE.naverTalkUrl) {
    channels.push({
      label: '네이버 톡톡',
      value: '톡톡으로 문의',
      href: SITE.naverTalkUrl,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="문의" size="sm">
      <div className="rounded-card-m bg-wk-bg px-4">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
            className="wk-row-link"
          >
            <span className="w-[86px] shrink-0 text-sm font-medium text-wk-ink3">{c.label}</span>
            <span className="flex-1">
              <b className="block text-body font-semibold text-wk-ink">{c.value}</b>
              {c.note && <span className="wk-cap mt-0.5 block">{c.note}</span>}
            </span>
            <span className="shrink-0 text-wk-ink3">→</span>
          </a>
        ))}
      </div>

      <div className="mt-5">
        <Link href="/quote" className="wk-btn-p" onClick={onClose}>
          견적·규격서 요청
        </Link>
        <p className="wk-cap mt-3">
          설치 장소와 크기를 알려주시면 공간에 맞는 규격과 예상 견적을 정리해드립니다.
        </p>
      </div>
    </Modal>
  )
}
