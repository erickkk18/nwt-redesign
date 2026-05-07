// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "05 About Us" stats section.
// 2. Glob: src/components/home/Stats.tsx returned No files found before write.
// 3. No file I/O. Pure UI; counter targets and city list hardcoded.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import { forwardRef } from 'react'

import { s, useCounter, useReveal, type StatsContent } from './_shared'

const FALLBACK_CITIES = ['Houston','Austin','Dallas','The Woodlands','San Antonio','El Paso','Corpus Christi','Galveston','San Angelo','Fort Worth']

const FALLBACK_STATS = [
  { value: 53, suffix: '', label: 'Combined attorneys', sub: 'Partners, counsel, associates' },
  { value: 370, suffix: '+', label: 'Years of practice', sub: 'Combined experience' },
  { value: 3284, suffix: '', label: 'Matters resolved', sub: 'Across our practice areas' },
] as const

function fmt(n: number): string {
  return n >= 1000 ? n.toLocaleString() : String(n)
}

interface StatCellProps {
  value: string | number
  suffix?: string
  label: string
  sub: string
  isLast?: boolean
}

const StatCell = forwardRef<HTMLDivElement, StatCellProps>(({ value, suffix = '', label, sub, isLast }, ref) => (
  <div ref={ref} style={{ padding: '48px 32px 32px 0', borderRight: isLast ? 'none' : '1px solid rgba(246,242,234,0.18)' }}>
    <div className="display" style={{ fontSize: 'clamp(80px, 10vw, 156px)', lineHeight: 0.9, color: 'var(--cream)', marginBottom: 24, fontFeatureSettings: '"lnum"' }}>{value}{suffix}</div>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', fontWeight: 300, color: 'var(--teal-100)', marginBottom: 6 }}>{label}</div>
    <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.5)' }}>{sub}</div>
  </div>
))
StatCell.displayName = 'StatCell'

export function Stats({ content }: { content?: StatsContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const items = content?.items && content.items.length === 3
    ? content.items
    : (FALLBACK_STATS as unknown as { value: number; suffix?: string | null; label: string; sub?: string | null }[])
  const [v0, ref0] = useCounter(items[0].value)
  const [v1, ref1] = useCounter(items[1].value)
  const [v2, ref2] = useCounter(items[2].value)

  const eyebrowNumber = s(content?.eyebrowNumber, '05')
  const eyebrowText = s(content?.eyebrowText, 'About Us')
  const headline = s(content?.headline, 'Big law experience in a')
  const headlineItalic = s(content?.headlineItalic, 'boutique')
  const headlineTail = s(content?.headlineTail, 'format.')

  const cities = content?.cities && content.cities.length > 0
    ? content.cities.map((c) => c.name)
    : FALLBACK_CITIES

  return (
    <section style={{ background: 'var(--teal-800)', color: 'var(--cream)', padding: '160px 0 180px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(199,112,74,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(20,97,122,0.4) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div ref={ref} className="container-wide reveal" style={{ position: 'relative' }}>
        <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.55)', marginBottom: 32 }}><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
        <h2 className="display" style={{ fontSize: 'clamp(48px, 6vw, 96px)', color: 'var(--cream)', maxWidth: 1100, marginBottom: 100 }}>
          {headline} <span className="display-italic" style={{ color: 'var(--teal-100)' }}>{headlineItalic}</span> {headlineTail}
        </h2>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid rgba(246,242,234,0.18)', marginBottom: 80 }}>
          <StatCell ref={ref0} value={fmt(v0)} suffix={items[0].suffix ?? ''} label={items[0].label} sub={items[0].sub ?? ''} />
          <StatCell ref={ref1} value={fmt(v1)} suffix={items[1].suffix ?? ''} label={items[1].label} sub={items[1].sub ?? ''} />
          <StatCell ref={ref2} value={fmt(v2)} suffix={items[2].suffix ?? ''} label={items[2].label} sub={items[2].sub ?? ''} isLast />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 40px', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 300, color: 'rgba(246,242,234,0.85)', paddingTop: 40, borderTop: '1px solid rgba(246,242,234,0.18)' }}>
          {cities.map((city, i, arr) => (
            <span key={`${city}-${i}`} style={{ display: 'inline-flex', gap: 40 }}>
              <span>{city}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--accent)' }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
