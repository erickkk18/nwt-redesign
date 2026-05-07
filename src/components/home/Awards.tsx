// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    awards card pair (Best Lawyers / Super Lawyers).
// 2. Glob: src/components/home/Awards.tsx returned No files found before write.
// 3. No file I/O. Static `awards` array of 2 { title, subtitle, year, tag }.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import { useState } from 'react'

import { Icon, useReveal, type AwardItemContent, type AwardsContent } from './_shared'

const fallbackAwards: AwardItemContent[] = [
  { title: 'Best Lawyers®', subtitle: 'Best Law Firms', year: '2026', tag: 'Recognized' },
  { title: 'Best Lawyers®', subtitle: 'And Texas Super Lawyers', year: '2026', tag: 'Honored' },
]

export function Awards({ content }: { content?: AwardsContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const items = content?.items && content.items.length > 0 ? content.items : fallbackAwards
  return (
    <section style={{ background: 'var(--paper)', padding: '120px 0 80px' }}>
      <div ref={ref} className="container-wide reveal">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {items.map((c, i) => (
            <AwardCard key={i} title={c.title} subtitle={c.subtitle ?? ''} year={c.year ?? ''} tag={c.tag ?? ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AwardCard({ title, subtitle, year, tag }: { title: string; subtitle: string; year: string; tag: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--teal-900)', color: 'var(--cream)', padding: '48px 48px 0', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.4s ease', transform: hovered ? 'translateY(-4px)' : 'none' }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 16 }}>{tag} · {year}</div>
          <h3 className="display" style={{ fontSize: 44, color: 'var(--cream)', marginBottom: 8 }}>{title}</h3>
          <div className="display-italic" style={{ fontSize: 22, color: 'var(--teal-100)' }}>{subtitle}</div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent)', color: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: hovered ? 'rotate(-45deg)' : 'rotate(0)', transition: 'transform 0.4s' }}>
          <Icon.ArrowUpRight size={18} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 48 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ aspectRatio: '3/4', background: 'repeating-linear-gradient(135deg, rgba(246,242,234,0.12) 0 8px, rgba(246,242,234,0.06) 8px 16px)' }} />
        ))}
      </div>
    </div>
  )
}
