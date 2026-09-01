import Link from 'next/link'
import Image from 'next/image'

export interface UseCaseBlockProps {
  id?: string
  eyebrow: string
  /** 쉼표 반전 구문을 반복하지 않는다. 명사구·평서문을 섞어 쓴다 */
  title: React.ReactNode
  body: string
  image: string
  imageAlt: string
  tags?: string[]
  href: string
  cta: string
  /** 이미지를 오른쪽에 둘지 (데스크톱 기준) */
  imageRight?: boolean
  /** 회색 배경 섹션 */
  grey?: boolean
}

/**
 * 용도별 설명 블록 — 텍스트와 이미지를 좌우로 분리한다.
 * 이미지 위에 텍스트를 얹지 않는다. (토스 UI 분석 §10)
 */
export function UseCaseBlock({
  id,
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  tags,
  href,
  cta,
  imageRight = true,
  grey = false,
}: UseCaseBlockProps) {
  return (
    <section id={id} className={`wk-sec ${grey ? 'bg-wk-bg' : 'bg-white'}`}>
      <div className="wk-wrap grid items-center gap-5 lg:grid-cols-2 lg:gap-8">
        <div className={imageRight ? 'lg:order-1' : 'lg:order-2'}>
          <p className="wk-eyebrow">{eyebrow}</p>
          <h2 className="wk-h2 text-wk-ink">{title}</h2>
          <p className="wk-lead mt-4">{body}</p>

          {tags && tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className={`wk-tag ${grey ? 'bg-white' : ''}`}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Link href={href} className="wk-btn-w">
              {cta}
            </Link>
          </div>
        </div>

        <div className={imageRight ? 'lg:order-2' : 'lg:order-1'}>
          <div className="wk-card-img relative aspect-[4/3]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
