// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "06 Who We Are" attorneys section. Receives `team` prop (Payload JSON).
// 2. Glob: src/components/home/Attorneys.tsx returned No files found before write.
// 3. No file I/O. Reads in-memory `team` prop. TeamMember:
//    { id, name, slug, role, category, photo:{ url, alt } }.
// 4. User: "the homepage fix the links make the sections components wire it up"
//
// Link fixes vs. previous inline version:
//   - "View all attorneys →" : "#" -> "/our-team"
//   - Each card now links to "/team/<slug>" (was non-clickable).

'use client'

import { useState } from 'react'

import {
  mediaAlt,
  mediaUrl,
  s,
  useReveal,
  type AttorneysContent,
  type TeamMember,
} from './_shared'

interface AttorneyView {
  key: string
  slug: string
  name: string
  role: string
  city: string
  tag?: string
  photoUrl?: string | null
  photoAlt?: string
}

const fallbackAttorneys: AttorneyView[] = [
  { key: 'a0', slug: 'scott-nichols', name: 'Scott Nichols', role: 'Partner', city: 'Houston', tag: 'Founding' },
  { key: 'a1', slug: 'marissa-weitzner', name: 'Marissa Weitzner', role: 'Partner', city: 'Houston', tag: 'Founding' },
  { key: 'a2', slug: 'josh-thomas', name: 'Josh Thomas', role: 'Partner', city: 'Austin' },
  { key: 'a3', slug: 'kevin-wood', name: 'Kevin Wood', role: 'Partner', city: 'Dallas' },
  { key: 'a4', slug: 'melanie-kuhnsey', name: 'Melanie Kuhnsey', role: 'Counsel', city: 'Houston' },
  { key: 'a5', slug: 'michelle-sanchez', name: 'Michelle Sanchez', role: 'Counsel', city: 'San Antonio' },
  { key: 'a6', slug: 'louis-williams', name: 'Louis Williams', role: 'Counsel', city: 'Houston' },
  { key: 'a7', slug: 'greg-hines', name: 'Greg Hines', role: 'Counsel', city: 'Dallas' },
  { key: 'a8', slug: 'leah-larson', name: 'Leah Larson', role: 'Associate', city: 'Houston' },
  { key: 'a9', slug: 'jackie-harrison', name: 'Jackie Harrison', role: 'Associate', city: 'Austin' },
  { key: 'a10', slug: 'adam-pena', name: 'Adam Pena', role: 'Associate', city: 'El Paso' },
  { key: 'a11', slug: 'tracie-boggess', name: 'Tracie Boggess', role: 'Associate', city: 'Galveston' },
]

function teamToView(team?: TeamMember[]): AttorneyView[] {
  if (!team || team.length === 0) return fallbackAttorneys
  return team.slice(0, 12).map((t, i) => ({
    key: t.id,
    slug: t.slug,
    name: t.name,
    role: t.role ?? 'Attorney',
    // Category from the migrated cpt_team_group taxonomy.
    city: t.category ? t.category.replace(/-/g, ' ') : '',
    tag: i < 2 ? 'Founding' : undefined,
    photoUrl: mediaUrl(t.photo),
    photoAlt: mediaAlt(t.photo, t.name),
  }))
}

export function Attorneys({ team, content }: { team?: TeamMember[]; content?: AttorneysContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const items = teamToView(team)
  const eyebrowNumber = s(content?.eyebrowNumber, '06')
  const eyebrowText = s(content?.eyebrowText, 'Who We Are')
  const headline = s(content?.headline, 'Our attorneys are veterans of big law firms, public company')
  const headlineItalic = s(content?.headlineItalic, 'boardrooms')
  const headlineTail = s(content?.headlineTail, ', and academic medical centers.')
  const viewAllLabel = s(content?.viewAll?.label, 'View all attorneys →')
  const viewAllHref = s(content?.viewAll?.href, '/our-team')
  return (
    <section style={{ background: 'var(--paper)', padding: '160px 0 140px' }}>
      <div ref={ref} className="container-wide reveal">
        <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
          <a href={viewAllHref} className="ulink" style={{ fontSize: 13 }}>{viewAllLabel}</a>
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 72px)', color: 'var(--ink)', maxWidth: 1100, marginBottom: 96 }}>
          {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span>{headlineTail}
        </h2>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {items.map((p) => {
            const { key, ...rest } = p
            return <AttorneyCard key={key} {...rest} />
          })}
        </div>
      </div>
    </section>
  )
}

function AttorneyCard({ slug, name, role, city, tag, photoUrl, photoAlt }: Omit<AttorneyView, 'key'>) {
  const [hovered, setHovered] = useState(false)
  const gradId = `grad-${name.replace(/\s/g, '')}`
  return (
    <a
      href={`/team/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 18, background: 'var(--cream-2)' }}>
        <div style={{ aspectRatio: '4/5', background: photoUrl ? 'var(--cream-2)' : 'repeating-linear-gradient(135deg, #cdb89a 0 14px, #c3ae90 14px 28px)', transition: 'transform 0.6s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'scale(1.04)' : 'scale(1)', position: 'relative' }}>
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={photoAlt ?? name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <svg viewBox="0 0 200 250" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1a3540" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#0a3a47" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <ellipse cx="100" cy="95" rx="34" ry="40" fill={`url(#${gradId})`} />
              <path d={`M 30 250 Q 30 165 100 155 Q 170 165 170 250 Z`} fill={`url(#${gradId})`} />
            </svg>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(15,76,92,0.92) 100%)', padding: '32px 16px 16px', opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.35s ease', color: 'var(--cream)' }}>
            {city && <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.7)', marginBottom: 4 }}>{city}</div>}
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13 }}>View profile →</div>
          </div>
          {tag && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: 'var(--cream)', padding: '4px 10px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{tag}</div>
          )}
        </div>
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 4, letterSpacing: '-0.01em' }}>{name}</h3>
      <div className="eyebrow" style={{ color: 'var(--ink-3)' }}>{role}</div>
    </a>
  )
}
