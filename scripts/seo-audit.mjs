/**
 * SEO 점검표 생성 — seo-crawl.mjs 가 만든 crawl.json 을 읽어
 * 상태코드·앵커·메타·JSON-LD·이미지·접근성·문구 잔재 표를 report-part.md 로 출력한다.
 * 사용법은 seo-crawl.mjs 헤더 참조.
 */
import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync('crawl.json', 'utf8'))
const P = d.pages
const L = []
const say = (...a) => L.push(a.join(' '))

function dec(s){return s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function meta(html, key, attr='name'){
  const re = new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`,'i')
  const re2 = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`,'i')
  const m = html.match(re) || html.match(re2)
  return m ? dec(m[1]) : null
}

say('## 1. 상태코드 표\n')
say('| 경로 | 상태 | 유입 링크 수 | HTML 크기 |')
say('|---|---|---|---|')
const bad = []
for (const [p, r] of Object.entries(P).sort()) {
  const flag = r.status === 200 ? '200' : `**${r.status}${r.loc ? ' → ' + r.loc : ''}**`
  if (r.status !== 200) bad.push([p, r.status, r.loc, r.from])
  say(`| ${p} | ${flag} | ${r.from.length} | ${(r.size/1024).toFixed(0)}KB |`)
}
say('')
say('### 비-200')
if (!bad.length) say('없음.')
for (const b of bad) say(`- \`${b[0]}\` → ${b[1]} ${b[2]||''} (유입: ${b[3].join(', ')||'없음'})`)

// sitemap vs actual
say('\n### sitemap 대조')
const smPaths = d.sitemapUrls.map(u=>u.replace('https://wooktech.co.kr','')||'/')
for (const s of smPaths) if (!P[s] || P[s].status!==200) say(`- sitemap 항목 비정상: ${s} (${P[s]?.status})`)
const linkedNotInSm = Object.keys(P).filter(p=>!smPaths.includes(p) && P[p].status===200)
say(`- sitemap 미포함 200 페이지: ${linkedNotInSm.join(', ') || '없음'}`)
say(`- sitemap 항목 수: ${smPaths.length}`)

// anchors
say('\n## 앵커 검증')
const anchorProblems = []
for (const [p, r] of Object.entries(P)) {
  if (r.status !== 200 || !r.html) continue
  for (const m of r.html.matchAll(/href="([^"]*#[A-Za-z][^"]*)"/g)) {
    let t = m[1]
    if (t.startsWith('http')) { if (!t.includes('wooktech.co.kr')&&!t.includes('localhost')) continue; t = t.replace(/^https?:\/\/[^/]+/,'') }
    const [bp0, id] = t.split('#')
    const bp = bp0 || p
    const target = P[bp]
    if (!target || target.status !== 200) { anchorProblems.push(`${p} → ${t} (대상 페이지 ${target?.status||'없음'})`); continue }
    const has = new RegExp(`id="${id}"`).test(target.html)
    if (!has) anchorProblems.push(`${p} → ${t} (id="${id}" 없음)`)
  }
}
say([...new Set(anchorProblems)].map(x=>'- '+x).join('\n') || '문제 없음.')

// META
say('\n## 2. 메타 태그')
say('| 경로 | title(길이) | description(길이) | canonical | og:image | tw:card |')
say('|---|---|---|---|---|---|')
const titles = new Map(), descs = new Map()
const metaIssues = []
for (const [p, r] of Object.entries(P).sort()) {
  if (r.status !== 200 || !r.html.includes('<html')) continue
  const t = (r.html.match(/<title>([^<]*)<\/title>/)||[])[1]
  const title = t ? dec(t) : null
  const desc = meta(r.html,'description')
  const can = (r.html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)||[])[1]
  const ogi = meta(r.html,'og:image','property')
  const ogt = meta(r.html,'og:title','property')
  const ogd = meta(r.html,'og:description','property')
  const ogu = meta(r.html,'og:url','property')
  const tw = meta(r.html,'twitter:card')
  say(`| ${p} | ${title?title.length:'**없음**'} | ${desc?desc.length:'**없음**'} | ${can?(can.startsWith('https://wooktech.co.kr')?'OK':'**'+can+'**'):'**없음**'} | ${ogi?'OK':'**없음**'} | ${tw||'**없음**'} |`)
  if (title){ if(!titles.has(title)) titles.set(title,[]); titles.get(title).push(p) }
  if (desc){ if(!descs.has(desc)) descs.set(desc,[]); descs.get(desc).push(p) }
  if (!title) metaIssues.push(`${p}: title 없음`)
  else if (title.length<30||title.length>60) metaIssues.push(`${p}: title ${title.length}자 — "${title}"`)
  if (!desc) metaIssues.push(`${p}: description 없음`)
  else if (desc.length<70||desc.length>160) metaIssues.push(`${p}: description ${desc.length}자`)
  if (!can) metaIssues.push(`${p}: canonical 없음`)
  if (!ogt) metaIssues.push(`${p}: og:title 없음`)
  if (!ogd) metaIssues.push(`${p}: og:description 없음`)
  if (!ogu) metaIssues.push(`${p}: og:url 없음`)
  if (!ogi) metaIssues.push(`${p}: og:image 없음`)
  if (!tw) metaIssues.push(`${p}: twitter:card 없음`)
  if (!/^.+ \| 우강테크$/.test(title||'') && p!=='/') metaIssues.push(`${p}: title 템플릿 불일치 — "${title}"`)
}
say('\n### 메타 이슈')
say(metaIssues.map(x=>'- '+x).join('\n')||'없음')
say('\n### 중복 title')
for (const [t,ps] of titles) if (ps.length>1) say(`- "${t}" → ${ps.join(', ')}`)
say('### 중복 description')
for (const [t,ps] of descs) if (ps.length>1) say(`- (${t.slice(0,40)}…) → ${ps.join(', ')}`)

// JSON-LD
say('\n## 3. 구조화 데이터')
const ldIssues = []
say('| 경로 | @type 목록 | 유효 |')
say('|---|---|---|')
for (const [p, r] of Object.entries(P).sort()) {
  if (r.status !== 200 || !r.html.includes('<html')) continue
  const blocks = [...r.html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1])
  const types = []
  let ok = true
  for (const b of blocks) {
    try {
      const j = JSON.parse(dec(b))
      const arr = Array.isArray(j)?j:[j]
      for (const o of arr) {
        types.push(o['@type'])
        if (o['@type']==='Organization'){
          for (const k of ['name','url','logo']) if(!o[k]) ldIssues.push(`${p} Organization: ${k} 없음`)
          if(!o.telephone) ldIssues.push(`${p} Organization: telephone 없음(최상위)`)
          if(!o.address) ldIssues.push(`${p} Organization: address 없음`)
          if(!o.email) ldIssues.push(`${p} Organization: email 없음(최상위)`)
          if(!o.areaServed) ldIssues.push(`${p} Organization: areaServed 없음`)
          if(Array.isArray(o.sameAs)&&o.sameAs.length===0) ldIssues.push(`${p} Organization: sameAs 빈 배열`)
        }
        if (o['@type']==='LocalBusiness'){
          if(!o.telephone) ldIssues.push(`${p} LocalBusiness: telephone 없음`)
          if(!o.address?.streetAddress) ldIssues.push(`${p} LocalBusiness: address.streetAddress 없음`)
          if(Array.isArray(o.sameAs)&&o.sameAs.length===0) ldIssues.push(`${p} LocalBusiness: sameAs 빈 배열`)
        }
        if (o['@type']==='BreadcrumbList'){
          const el=o.itemListElement||[]
          el.forEach((e,i)=>{ if(e.position!==i+1) ldIssues.push(`${p} Breadcrumb: position 순서 오류 @${i}`); if(!e.name) ldIssues.push(`${p} Breadcrumb: name 없음 @${i}`)})
        }
        if ((o['@type']==='Product'||o['@type']==='Service') && !o.name) ldIssues.push(`${p} ${o['@type']}: name 없음`)
        if (o['@type']==='ItemList') (o.itemListElement||[]).forEach((e,i)=>{ if(!e.item?.name) ldIssues.push(`${p} ItemList: item.name 없음 @${i}`)})
        if (o['@type']==='HowTo') ldIssues.push(`${p} HowTo 존재 — 화면 대조 필요: "${o.name}"`)
        if (o['@type']==='FAQPage') { const n=(o.mainEntity||[]).length; if(!n) ldIssues.push(`${p} FAQPage: mainEntity 비어있음`) }
      }
    } catch(e){ ok=false; ldIssues.push(`${p}: JSON-LD 파싱 실패 — ${e.message}`) }
  }
  say(`| ${p} | ${types.join(', ')||'**없음**'} | ${ok?'OK':'**FAIL**'} |`)
  if (!blocks.length) ldIssues.push(`${p}: JSON-LD 없음`)
}
say('\n### JSON-LD 이슈')
say([...new Set(ldIssues)].map(x=>'- '+x).join('\n')||'없음')

// images
say('\n## 4. 이미지')
const imgs = new Map()
const altIssues = []
for (const [p, r] of Object.entries(P)) {
  if (r.status!==200||!r.html.includes('<html')) continue
  for (const m of r.html.matchAll(/<img\b([^>]*)>/g)) {
    const tag = m[1]
    let src = (tag.match(/src="([^"]*)"/)||[])[1]
    if (!src) { altIssues.push(`${p}: <img> src 없음`); continue }
    src = dec(src)
    if (src.startsWith('/_next/image')) {
      const u = new URL('http://x'+src); src = decodeURIComponent(u.searchParams.get('url')||'')
    }
    if (src.startsWith('/')) { if(!imgs.has(src)) imgs.set(src,new Set()); imgs.get(src).add(p) }
    const altM = tag.match(/alt="([^"]*)"/)
    if (!altM) altIssues.push(`${p}: alt 속성 자체 없음 — ${src}`)
    else if (altM[1]==='' && !/aria-hidden="true"/.test(tag)) altIssues.push(`${p}: alt="" 인데 aria-hidden 없음 — ${src}`)
  }
}
fs.writeFileSync('imgs.json', JSON.stringify([...imgs].map(([k,v])=>[k,[...v]])))
say(`참조 이미지 ${imgs.size}종 (별도 HEAD 검사)`)
say('\n### alt 이슈')
say([...new Set(altIssues)].map(x=>'- '+x).join('\n')||'없음')

// a11y
say('\n## 5. 접근성 기본')
const a11y = []
say('| 경로 | h1 개수 | main | nav | footer | 빈 링크 |')
say('|---|---|---|---|---|---|')
for (const [p, r] of Object.entries(P).sort()) {
  if (r.status!==200||!r.html.includes('<html')) continue
  const h1 = (r.html.match(/<h1\b/g)||[]).length
  const hasMain = /<main\b/.test(r.html), hasNav=/<nav\b/.test(r.html), hasFooter=/<footer\b/.test(r.html)
  // empty links: <a ...></a> or only tags with no text and no aria-label
  let empties=0
  for (const m of r.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs=m[1], inner=m[2]
    const text = inner.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').trim()
    if (text) continue
    if (/aria-label="[^"]+"/.test(attrs) || /title="[^"]+"/.test(attrs)) continue
    if (/aria-label="[^"]+"/.test(inner)) continue
    if (/alt="[^"]+"/.test(inner)) continue
    empties++
    a11y.push(`${p}: 접근 가능 이름 없는 <a ${attrs.trim().slice(0,90)}>`)
  }
  for (const m of r.html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs=m[1], inner=m[2]
    const text = inner.replace(/<[^>]*>/g,'').trim()
    if (text) continue
    if (/aria-label="[^"]+"/.test(attrs)||/title="[^"]+"/.test(attrs)) continue
    if (/aria-label="[^"]+"/.test(inner)||/alt="[^"]+"/.test(inner)) continue
    a11y.push(`${p}: 접근 가능 이름 없는 <button ${attrs.trim().slice(0,90)}>`)
  }
  say(`| ${p} | ${h1===1?1:'**'+h1+'**'} | ${hasMain?'O':'**X**'} | ${hasNav?'O':'**X**'} | ${hasFooter?'O':'**X**'} | ${empties||'-'} |`)
}
say('\n### 접근 가능 이름 누락')
say([...new Set(a11y)].map(x=>'- '+x).join('\n')||'없음')

// text residue
say('\n## 7. 문구 잔재')
const terms = ['밝기','nit','소요 기간','서류로 증명','진행 절차','괜찮습니다','임직원 일동','대표이사','기업부설연구소','예시이며','납품 실적','TA-2607','contact@wooktech','카카오워크']
const res = {}
for (const [p, r] of Object.entries(P)) {
  if (r.status!==200) continue
  const text = r.html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]*>/g,' ')
  const raw = r.html
  for (const t of terms) {
    const inText = text.includes(t)
    const inRaw = raw.includes(t)
    if (inText||inRaw) { (res[t] ||= []).push(`${p}${inText?'':'(JSON-LD/스크립트만)'}`) }
  }
}
say('| 문구 | 발견 페이지 |')
say('|---|---|')
for (const t of terms) say(`| ${t} | ${res[t]?res[t].join(', '):'없음'} |`)

fs.writeFileSync('report-part.md', L.join('\n'))
console.log(L.join('\n'))
