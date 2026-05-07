// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "03 How We Work" section.
// 2. Glob: src/components/home/Approach.tsx returned No files found before write.
// 3. No file I/O. Pure UI. Static `pillars` array of 4 { title, desc } items.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import Image from 'next/image'

import { Icon, Placeholder, mediaAlt, mediaUrl, s, useReveal, type ApproachContent, type PillarContent } from './_shared'

const fallbackPillars: PillarContent[] = [
  { title: 'We Solve Problems, Not Create Them', description: 'We will achieve your business objectives in a defined timeframe, on or under budget. We aim to give you definitive answers and pragmatic advice based on real-world experience.' },
  { title: 'We Stay Accessible', description: 'We answer the phone or email when you call. We aim for next-day responses to most inquiries, and same-day to anything urgent. Your matter receives the focus it deserves.' },
  { title: "We Anticipate Tomorrow's Challenges", description: 'To serve, who would dare to think will need to know more, anticipate even more clearly the new technologies of our future and apply that knowledge to your work today.' },
  { title: 'We Save You Time, Money, and Stress', description: 'Legal services are an investment in your business. We will work efficiently to add value and bring tangible results to ensure long-term success.' },
]

export function Approach({ content }: { content?: ApproachContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const eyebrowNumber = s(content?.eyebrowNumber, '03')
  const eyebrowText = s(content?.eyebrowText, 'How We Work')
  const headline = s(content?.headline, "We've reimagined what a")
  const headlineItalic = s(content?.headlineItalic, 'client-attorney')
  const headlineTail = s(content?.headlineTail, 'relationship should look like.')
  const ctaLabel = s(content?.cta?.label, 'Get In Touch')
  const ctaHref = s(content?.cta?.href, '#contact')
  const imageUrl = mediaUrl(content?.image)
  const imageAlt = mediaAlt(content?.image, 'Workspace')
  const pillars = content?.pillars && content.pillars.length > 0 ? content.pillars : fallbackPillars

  return (
    <section id="approach" style={{ background: 'var(--paper)', padding: '160px 0' }}>
      <div ref={ref} className="container-wide reveal">
        <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
        </div>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 100, alignItems: 'flex-start' }}>
          <div style={{ position: 'sticky', top: 120 }}>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', marginBottom: 40, color: 'var(--ink)' }}>
              {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span> {headlineTail}
            </h2>
            <div style={{ position: 'relative', marginBottom: 32 }}>
              {imageUrl ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 960px) 50vw, 100vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <Placeholder label="Workspace" ratio="4/3" tone="cream" />
              )}
            </div>
            <a href={ctaHref} className="btn btn-primary">{ctaLabel} <Icon.Arrow size={14} /></a>
          </div>
          <div>
            {pillars.map((p, i) => (
              <Pillar key={i} title={p.title} description={p.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Pillar({ title, description }: PillarContent) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="reveal" style={{ padding: '32px 0', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '40px 1fr', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal-50)', color: 'var(--teal-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon.Check size={16} />
      </div>
      <div>
        <h3 className="display" style={{ fontSize: 28, marginBottom: 12, color: 'var(--ink)' }}>{title}</h3>
        <p className="body" style={{ maxWidth: 560 }}>{description}</p>
      </div>
    </div>
  )
}
