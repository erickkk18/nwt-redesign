// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "02 Industries We Serve" section.
// 2. Glob: src/components/home/Industries.tsx returned No files found before write.
// 3. No file I/O. Pure UI. Static `industries` array of 5 { n, name, desc } items.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import { useState } from 'react'

import { Icon, s, useReveal, type IndustriesContent, type IndustryContent } from './_shared'

const fallbackIndustries: IndustryContent[] = [
  { number: '01', name: 'Healthcare', description: "We work to advance our clients' goals at the intersection of healthcare, business, and the law. We provide thoughtful, business-minded counsel to physicians, providers, hospitals, and health systems." },
  { number: '02', name: 'Investors & Entrepreneurs', description: 'We help our clients structure deals, navigate disputes and raise capital. From the boardroom to the courtroom, we counsel investors, founders and operators on the matters that move their business forward.' },
  { number: '03', name: 'Life Sciences', description: 'Pharmaceutical and life-science clients turn to us for our depth and breadth across regulatory, transactional, and dispute-resolution challenges from drug development to commercialization.' },
  { number: '04', name: 'Engineering, Manufacturing, & Construction', description: 'We represent engineers, manufacturers and construction companies in matters that range from contract negotiation and project administration to dispute resolution and litigation.' },
  { number: '05', name: 'Outside General Counsel', description: 'Our experienced attorneys serve as outside general counsel to growing companies, providing the day-to-day legal guidance an in-house team would, with the depth of a full firm behind it.' },
]

export function Industries({ content }: { content?: IndustriesContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const eyebrowNumber = s(content?.eyebrowNumber, '02')
  const eyebrowText = s(content?.eyebrowText, 'Industries We Serve')
  const headline = s(
    content?.headline,
    'Our clients include entrepreneurs, large public companies, family-owned businesses, and',
  )
  const headlineItalic = s(content?.headlineItalic, 'everything')
  const headlineTail = s(content?.headlineTail, 'in between.')
  const items = content?.items && content.items.length > 0 ? content.items : fallbackIndustries

  return (
    <section style={{ background: 'var(--cream)', padding: '160px 0 180px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div ref={ref} className="container-wide reveal">
        <div className="grid-2" style={{ marginBottom: 96, display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'end' }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 68px)', color: 'var(--ink)', maxWidth: 900 }}>
            {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span> {headlineTail}
          </h2>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {items.map((item, i) => (
            <IndustryRow key={`${item.number}-${i}`} item={item} isLast={i === items.length - 1} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function IndustryRow({ item, isLast }: { item: IndustryContent; isLast: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="industries-row"
      style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1.4fr 60px', gap: 40, alignItems: 'baseline', padding: '40px 0', borderBottom: isLast ? 'none' : '1px solid var(--line-2)', cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative' }}
    >
      <div className="eyebrow" style={{ color: hovered ? 'var(--accent)' : 'var(--ink-4)', transition: 'color 0.3s' }}>— {item.number}</div>
      <h3 className="display" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: hovered ? 'var(--teal-800)' : 'var(--ink)', transition: 'color 0.3s, transform 0.3s', transform: hovered ? 'translateX(8px)' : 'none' }}>{item.name}</h3>
      <p className="industries-desc" style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-3)', opacity: hovered ? 1 : 0.7, transition: 'opacity 0.3s', maxWidth: 560 }}>{item.description}</p>
      <div className="industries-arrow" style={{ color: hovered ? 'var(--teal-800)' : 'var(--ink-4)', transform: hovered ? 'translateX(8px)' : 'none', transition: 'all 0.3s', textAlign: 'right' }}>
        <Icon.ArrowUpRight size={22} />
      </div>
    </li>
  )
}
