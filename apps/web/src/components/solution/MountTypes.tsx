import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, Stagger } from '@/components/motion'

/**
 * 취부 방식 — 어디에 어떻게 거는가.
 *
 * 왜 만들었나 — /services 에서 행정 성격 섹션 두 개를 걷어내고 나니 얇아졌다.
 * 그 자리를 다시 행정 얘기로 채우면 같은 실수다. 전광판 회사가 할 말로 채운다.
 *
 * 담당자가 견적을 비교할 때 실제로 금액을 가르는 건 화면 크기가 아니라
 * "어디에 어떻게 거느냐"다. 기존 벽을 쓰면 싸고, 지주를 세우면 비싸고,
 * 천장에 달면 구조 검토가 붙는다. 그걸 미리 알면 예산이 안 틀어진다.
 */

const TYPES = [
  {
    name: '벽부형',
    where: '청사 외벽 · 학교 담장 · 로비 벽면',
    body: '기존 벽에 취부 철물을 고정해 화면을 겁니다. 가장 흔하고 가장 저렴합니다. 벽이 하중을 견디는지와 화면 뒤 정비 공간이 나오는지를 봅니다.',
    note: '화면 뒤로 못 들어가면 앞에서 정비하는 구조로 갑니다',
  },
  {
    name: '지주형',
    where: '정문 앞 · 도로변 · 주차장 진입로',
    body: '기초를 치고 기둥을 세워 그 위에 화면을 올립니다. 붙일 벽이 없거나 도로에서 보여야 할 때 씁니다. 기초 공사와 구조 검토가 붙어 금액이 올라갑니다.',
    note: '옥외광고물 신고 대상이 되는 경우가 가장 많습니다',
  },
  {
    name: '천장 행잉',
    where: '강당 무대 · 체육관 · 로비 상부',
    body: '천장 구조물이나 트러스에 매답니다. 바닥을 안 쓰고 시야를 안 가리지만, 매다는 지점이 하중을 견디는지 확인이 필요합니다.',
    note: '행사 때 올렸다 내리는 구성도 가능합니다',
  },
]

export function MountTypes() {
  return (
    <section aria-labelledby="mount-h" className="wk-sec-lg bg-wk-bgFaint">
      <div className="wk-wrap-wide">
        <Reveal>
          <p className="wk-eyebrow">취부 방식</p>
          <h2 id="mount-h" className="wk-h2 text-wk-ink">
            어디에 어떻게 거느냐가 금액을 가릅니다
          </h2>
          <p className="wk-lead mt-5">
            견적을 비교할 때 금액을 가장 많이 움직이는 건 화면 크기가 아닙니다.
            기존 벽을 쓰면 싸고, 지주를 세우면 기초 공사가 붙습니다.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden rounded-card">
              <Image
                src={IMAGES.mountScene}
                alt="고소작업차 바스켓에 오른 작업자 두 명이 크레인으로 들어 올린 LED 캐비닛을 건물 외벽에 고정하고 있다"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Stagger className="lg:col-span-7 lg:self-center" y={12} gap={0.07}>
            {TYPES.map((t) => (
              <div
                key={t.name}
                className="border-b border-wk-line py-6 first:pt-0 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="wk-h3 text-wk-ink">{t.name}</h3>
                  <p className="wk-cap !text-wk-ink3">{t.where}</p>
                </div>
                <p className="wk-body mt-3">{t.body}</p>
                <p className="wk-cap mt-2.5 !text-wk-ink3">→ {t.note}</p>
              </div>
            ))}
          </Stagger>
        </div>

        <p className="wk-cap mt-10">
          어느 방식이 맞는지는 실측 때 정합니다. 구조 보강이나 기초 공사가 필요하면
          그 범위와 비용을 확정 견적에 따로 적어 드립니다.
        </p>
      </div>
    </section>
  )
}
