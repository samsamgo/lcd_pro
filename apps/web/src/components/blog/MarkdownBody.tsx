/**
 * 경량 마크다운 → React 렌더러
 *
 * 후속 MDX 마이그레이션 전까지의 임시 변환기. 지원 요소:
 * - H2/H3, 단락(p), blockquote(>), unordered list(-), ordered list(1.),
 *   table(| ... |), 인라인 bold(**), italic(*), link([text](url)), code(`)
 * - 표·리스트 외 빈 줄로 구분된 블록 단위 처리.
 *
 * 본 컴포넌트는 본문 마크다운에서 본 ORDER 범위의 글이 사용하는 요소만 안전하게 렌더링한다.
 * 더 복잡한 마크다운은 후속 MDX 마이그레이션에서 처리.
 */
import React from 'react'

interface Props {
  source: string
}

type InlineNode = React.ReactNode

function renderInline(text: string, keyPrefix = 'inline'): InlineNode[] {
  const nodes: InlineNode[] = []
  let remaining = text
  let idx = 0
  // 우선순위: link → bold → italic → code
  // 단순 토큰 스캔. 중첩은 link 내부 inline 만 처리.
  const pattern =
    /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/
  while (remaining.length > 0) {
    const m = remaining.match(pattern)
    if (!m || m.index === undefined) {
      nodes.push(remaining)
      break
    }
    if (m.index > 0) {
      nodes.push(remaining.slice(0, m.index))
    }
    const k = `${keyPrefix}-${idx++}`
    if (m[1] && m[2]) {
      nodes.push(
        <a
          key={k}
          href={m[2]}
          className="text-blue-600 underline-offset-4 hover:underline"
        >
          {m[1]}
        </a>,
      )
    } else if (m[3]) {
      nodes.push(
        <strong key={k} className="text-zinc-900">
          {m[3]}
        </strong>,
      )
    } else if (m[4]) {
      nodes.push(<em key={k}>{m[4]}</em>)
    } else if (m[5]) {
      nodes.push(
        <code key={k} className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          {m[5]}
        </code>,
      )
    }
    remaining = remaining.slice(m.index + m[0].length)
  }
  return nodes
}

function renderTable(rows: string[], key: string): React.ReactNode {
  const cells = rows.map((r) =>
    r
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim()),
  )
  if (cells.length < 2) return null
  const [head, divider, ...body] = cells
  // divider 행이 ---|--- 패턴인지 확인 (없으면 본문 첫 행으로 처리)
  const hasDivider = divider?.every((c) => /^:?-+:?$/.test(c))
  const bodyRows = hasDivider ? body : [divider, ...body].filter(Boolean)
  return (
    <div key={key} className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-300 bg-white/40">
            {head.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-zinc-800"
              >
                {renderInline(h, `${key}-h-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} className="border-b border-zinc-200/60">
              {row.map((c, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 align-top text-zinc-700"
                >
                  {renderInline(c, `${key}-${ri}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MarkdownBody({ source }: Props) {
  const lines = source.split(/\r?\n/)
  const blocks: string[][] = []
  let cur: string[] = []
  for (const line of lines) {
    if (line.trim() === '') {
      if (cur.length > 0) {
        blocks.push(cur)
        cur = []
      }
    } else {
      cur.push(line)
    }
  }
  if (cur.length > 0) blocks.push(cur)

  return (
    <div className="prose-wktech max-w-none text-zinc-700 leading-relaxed">
      {blocks.map((block, bi) => {
        const first = block[0]
        const key = `b-${bi}`
        if (first.startsWith('## ')) {
          return (
            <h2
              key={key}
              className="mt-12 mb-4 text-2xl font-bold tracking-tight text-zinc-900"
            >
              {renderInline(first.slice(3), key)}
            </h2>
          )
        }
        if (first.startsWith('### ')) {
          return (
            <h3
              key={key}
              className="mt-8 mb-3 text-xl font-semibold text-zinc-900"
            >
              {renderInline(first.slice(4), key)}
            </h3>
          )
        }
        if (first.startsWith('> ')) {
          const text = block.map((l) => l.replace(/^>\s?/, '')).join(' ')
          return (
            <blockquote
              key={key}
              className="my-6 border-l-4 border-blue-500/40 bg-blue-500/[0.04] py-2 pl-4 italic text-zinc-700"
            >
              {renderInline(text, key)}
            </blockquote>
          )
        }
        if (/^\|.*\|$/.test(first)) {
          return renderTable(block, key)
        }
        if (/^\d+\.\s/.test(first)) {
          return (
            <ol
              key={key}
              className="my-4 list-decimal space-y-1.5 pl-6 text-zinc-700"
            >
              {block.map((l, i) => (
                <li key={i}>
                  {renderInline(l.replace(/^\d+\.\s/, ''), `${key}-${i}`)}
                </li>
              ))}
            </ol>
          )
        }
        if (first.startsWith('- ')) {
          return (
            <ul
              key={key}
              className="my-4 list-disc space-y-1.5 pl-6 text-zinc-700"
            >
              {block.map((l, i) => (
                <li key={i}>
                  {renderInline(l.replace(/^-\s/, ''), `${key}-${i}`)}
                </li>
              ))}
            </ul>
          )
        }
        const text = block.join(' ')
        return (
          <p key={key} className="my-4 leading-[1.75]">
            {renderInline(text, key)}
          </p>
        )
      })}
    </div>
  )
}
