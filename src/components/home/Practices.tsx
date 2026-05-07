// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "04 Practice Areas" section. Receives `services` prop (Payload-shaped JSON).
// 2. Glob: src/components/home/Practices.tsx returned No files found before write.
// 3. No file I/O. Reads in-memory `services` prop only.
//    Service shape: { id, title, slug, summary, featuredImage:{ url, alt } }.
// 4. User: "the homepage fix the links make the sections components wire it up"
//
// Link fix vs. previous inline version:
//   - "View all practices →" : "#" -> "/our-services"

'use client'

import { useState } from 'react'

import {
  Placeholder,
  mediaAlt,
  mediaUrl,
  s,
  useReveal,
  type PracticesContent,
  type Service,
} from './_shared'

interface PracticeViewItem {
  key: string
  label: string
  tag: string
  desc: string
  imageUrl?: string | null
  imageAlt?: string
}

const fallbackPractices: PracticeViewItem[] = [
  { key: 'p0', label: 'Outside General Counsel for Growing Providers', tag: 'Healthcare', desc: 'We act as your in-house counsel from negotiation to litigation.' },
  { key: 'p1', label: 'Healthcare Payor-Provider Disputes', tag: 'Disputes', desc: 'A deep bench across reimbursement, audit, and contract litigation.' },
  { key: 'p2', label: 'Labor & Employment', tag: 'Workforce', desc: 'Counsel for non-competes, executive separations, and litigation.' },
  { key: 'p3', label: 'Regulatory & Compliance', tag: 'Regulated', desc: 'Federal, state and local compliance for highly regulated industries.' },
  { key: 'p4', label: 'Business Services & Transactions', tag: 'Corporate', desc: 'Mergers, acquisitions, equity raises, and joint ventures.' },
]

function servicesToView(services?: Service[]): PracticeViewItem[] {
  if (!services || services.length === 0) return fallbackPractices
  return services.slice(0, 5).map((s, i) => ({
    key: s.id,
    label: s.title,
    tag: `Practice ${String(i + 1).padStart(2, '0')}`,
    desc: s.summary ?? '',
    imageUrl: mediaUrl(s.featuredImage),
    imageAlt: mediaAlt(s.featuredImage, s.title),
  }))
}

export function Practices({ services, content }: { services?: Service[]; content?: PracticesContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const items = servicesToView(services)
  const eyebrowNumber = s(content?.eyebrowNumber, '04')
  const eyebrowText = s(content?.eyebrowText, 'Practice Areas')
  const viewAllLabel = s(content?.viewAll?.label, 'View all practices →')
  const viewAllHref = s(content?.viewAll?.href, '/our-services')
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '120px 0 140px' }}>
      <div ref={ref} className="container-wide reveal">
        <div style={{ marginBottom: 64, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.55)' }}><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
          <a href={viewAllHref} className="ulink" style={{ fontSize: 14, color: 'var(--cream)', borderColor: 'rgba(246,242,234,0.3)' }}>{viewAllLabel}</a>
        </div>
        <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 0, borderTop: '1px solid rgba(246,242,234,0.12)' }}>
          {items.map((item, i) => {
            const { key, ...rest } = item
            return <PracticeCell key={key} {...rest} isLast={i === items.length - 1} />
          })}
        </div>
      </div>
    </section>
  )
}

function PracticeCell({ label, tag, desc, imageUrl, imageAlt, isLast }: PracticeViewItem & { isLast: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', padding: '24px 24px 32px', borderRight: isLast ? 'none' : '1px solid rgba(246,242,234,0.12)', cursor: 'pointer', transition: 'background 0.4s', background: hovered ? 'rgba(20,97,122,0.4)' : 'transparent', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div style={{ marginBottom: 20, overflow: 'hidden' }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt ?? tag}
            style={{
              width: '100%',
              aspectRatio: '4/3',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              display: 'block',
            }}
          />
        ) : (
          <Placeholder label={tag} ratio="4/3" tone="dark" style={{ transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.03)' : 'scale(1)' }} />
        )}
      </div>
      <div>
        <div className="eyebrow" style={{ color: hovered ? 'var(--accent)' : 'rgba(246,242,234,0.5)', transition: 'color 0.3s', marginBottom: 12 }}>{tag}</div>
        <h3 className="display" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 12, color: 'var(--cream)' }}>{label}</h3>
        <p style={{ fontSize: 13, color: 'rgba(246,242,234,0.65)', lineHeight: 1.5, maxHeight: hovered ? 100 : 0, opacity: hovered ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s ease' }}>{desc}</p>
      </div>
    </div>
  )
}
