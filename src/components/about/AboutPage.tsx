import type { CSSProperties } from 'react'

import { HeroTheme } from '@/components/site/HeroTheme'

interface PayloadMedia {
  id?: string
  url?: string | null
  alt?: string | null
}

interface CtaContent {
  label?: string | null
  href?: string | null
}

interface AboutHeroContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  lede?: string | null
  image?: PayloadMedia | string | null
}

interface AboutPillarItem {
  numLabel?: string | null
  title?: string | null
  body?: string | null
}

interface AboutPillarsContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  items?: AboutPillarItem[] | null
}

interface AboutLicenseItem {
  jurisdiction?: string | null
  body?: string | null
}

interface AboutLicensesContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  disclaimer?: string | null
  items?: AboutLicenseItem[] | null
  cta?: CtaContent | null
}

interface AboutCtaContent {
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  body?: string | null
  primaryCta?: CtaContent | null
}

export interface AboutPageContent {
  hero?: AboutHeroContent | null
  pillars?: AboutPillarsContent | null
  licenses?: AboutLicensesContent | null
  cta?: AboutCtaContent | null
}

interface AboutPageProps {
  content?: AboutPageContent | null
}

function s(value: string | null | undefined, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? value : fallback
}

function mediaUrl(m: PayloadMedia | string | null | undefined): string | null {
  if (!m) return null
  if (typeof m === 'string') return null
  return m.url ?? null
}

function mediaAlt(m: PayloadMedia | string | null | undefined, fallback: string): string {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--ink-3)',
}

function AboutHero({ content }: { content?: AboutHeroContent | null }) {
  const eyebrowNumber = s(content?.eyebrowNumber, '02')
  const eyebrowText = s(content?.eyebrowText, 'What We Do')
  const headline = s(content?.headline, 'All the Experience of a')
  const headlineItalic = s(content?.headlineItalic, 'Big Law Firm Without the Waste.')
  const lede = s(
    content?.lede,
    "Before you hire that giant international firm, give us a call. Big Law has its place, but it's not every place. Our lawyers have BigLaw pedigrees — all the high-profile experience and elite-level skills, because that's where they came from. Combined, our team has 130+ years representing the nation's largest, most demanding clients on transactions and litigation involving billions of dollars.",
  )
  const imgUrl = mediaUrl(content?.image)
  const imgAlt = mediaAlt(content?.image, 'Nichols Weitzner Thomas')

  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: 'clamp(140px, 18vh, 200px) 0 clamp(80px, 12vh, 140px)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="container-wide">
        <div
          className="about-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'end',
          }}
        >
          <div>
            <div style={{ ...eyebrowStyle, marginBottom: 32 }}>
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span>
              {eyebrowText}
            </div>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(48px, 7vw, 112px)',
                lineHeight: 0.96,
                letterSpacing: '-0.03em',
                margin: 0,
                color: 'var(--ink)',
              }}
            >
              {headline}{' '}
              <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
                {headlineItalic}
              </span>
            </h1>
            <p
              className="body-lg"
              style={{
                marginTop: 40,
                maxWidth: 620,
                color: 'var(--ink-2)',
                fontSize: 'clamp(17px, 1.3vw, 20px)',
                lineHeight: 1.65,
              }}
            >
              {lede}
            </p>
          </div>

          <div
            style={{
              aspectRatio: '4/5',
              background: 'var(--cream-2)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -30px rgba(0,0,0,0.25), 0 1px 0 rgba(0,0,0,0.04)',
            }}
          >
            {imgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt={imgAlt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background:
                    'repeating-linear-gradient(135deg, var(--cream-2) 0 14px, rgba(0,0,0,0.04) 14px 28px)',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                left: 24,
                bottom: 20,
                ...eyebrowStyle,
                color: 'var(--paper)',
                mixBlendMode: 'difference',
              }}
            >
              130+ Years of BigLaw Pedigree
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutPillars({ content }: { content?: AboutPillarsContent | null }) {
  const eyebrowNumber = s(content?.eyebrowNumber, '03')
  const eyebrowText = s(content?.eyebrowText, 'How We Work')
  const heading = s(content?.heading, 'Personable.')
  const headingItalic = s(content?.headingItalic, 'Creative. Efficient.')
  const items =
    content?.items && content.items.length > 0
      ? content.items
      : [
          { numLabel: '01', title: 'Personable', body: '' },
          { numLabel: '02', title: 'Creative', body: '' },
          { numLabel: '03', title: 'Efficient', body: '' },
        ]

  return (
    <section
      id="pillars"
      style={{ background: 'var(--paper)', padding: 'clamp(80px, 12vh, 140px) 0' }}
    >
      <div className="container-wide">
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 80,
            paddingBottom: 24,
            borderBottom: '1px solid var(--line)',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <div style={{ ...eyebrowStyle, marginBottom: 16 }}>
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span>
              {eyebrowText}
            </div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(40px, 5.5vw, 88px)',
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {heading}{' '}
              <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
                {headingItalic}
              </span>
            </h2>
          </div>
        </div>

        <div
          className="about-pillars-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(32px, 3vw, 56px)',
          }}
        >
          {items.map((pillar, idx) => (
            <article
              key={pillar.numLabel ?? idx}
              style={{ position: 'relative', paddingTop: 36, borderTop: '1px solid var(--ink)' }}
            >
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(48px, 5vw, 80px)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--teal-800)',
                  lineHeight: 1,
                  marginBottom: 28,
                  letterSpacing: '-0.02em',
                }}
              >
                {s(pillar.numLabel, String(idx + 1).padStart(2, '0'))}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(24px, 2.2vw, 36px)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  marginBottom: 20,
                  color: 'var(--ink)',
                }}
              >
                {s(pillar.title, '—')}
              </h3>
              <p className="body" style={{ color: 'var(--ink-2)', margin: 0, lineHeight: 1.65 }}>
                {s(pillar.body, '')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutLicenses({ content }: { content?: AboutLicensesContent | null }) {
  const eyebrowNumber = s(content?.eyebrowNumber, '04')
  const eyebrowText = s(content?.eyebrowText, 'State Bar Qualification')
  const heading = s(content?.heading, 'Our')
  const headingItalic = s(content?.headingItalic, 'Licenses.')
  const disclaimer = s(
    content?.disclaimer,
    'Unless otherwise noted, our lawyers are not certified by the Texas Board of Legal Specialization.',
  )
  const items =
    content?.items && content.items.length > 0
      ? content.items
      : [
          { jurisdiction: 'Texas', body: 'All of our attorneys are licensed in Texas.' },
          { jurisdiction: 'California', body: 'Scott Nichols and Zach Thomas are licensed in California.' },
          { jurisdiction: 'Other States', body: 'Zach Thomas is also licensed in Illinois, Missouri, and Oregon.' },
        ]
  const ctaLabel = s(content?.cta?.label, 'View Our Team')
  const ctaHref = s(content?.cta?.href, '/our-team')

  return (
    <section
      style={{
        background: 'var(--cream-2)',
        padding: 'clamp(80px, 12vh, 140px) 0',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="container-wide">
        <div
          className="about-licenses-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ ...eyebrowStyle, marginBottom: 16 }}>
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span>
              {eyebrowText}
            </div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                margin: 0,
                marginBottom: 24,
              }}
            >
              {heading}{' '}
              <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
                {headingItalic}
              </span>
            </h2>
            <p className="body-sm" style={{ color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 32 }}>
              {disclaimer}
            </p>
            <a
              href={ctaHref}
              className="ulink body"
              style={{ color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              {ctaLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <div style={{ display: 'grid', gap: 0 }}>
            {items.map((lic, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)',
                  gap: 'clamp(16px, 3vw, 48px)',
                  padding: '28px 0',
                  borderTop: '1px solid var(--line)',
                  borderBottom: idx === items.length - 1 ? '1px solid var(--line)' : 'none',
                  alignItems: 'baseline',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(22px, 2vw, 30px)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: 'var(--teal-800)',
                    margin: 0,
                  }}
                >
                  {s(lic.jurisdiction, '—')}
                </h3>
                <p className="body" style={{ color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
                  {s(lic.body, '')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutCta({ content }: { content?: AboutCtaContent | null }) {
  const eyebrowText = s(content?.eyebrowText, 'Get in Touch')
  const headline = s(content?.headline, 'We bring proven experience')
  const headlineItalic = s(content?.headlineItalic, 'with personalized counsel.')
  const body = s(
    content?.body,
    'Complex healthcare regulations require counsel who understands both the law and the operational pressures behind it. Tell us about your matter — a partner will respond within one business day.',
  )
  const ctaLabel = s(content?.primaryCta?.label, 'Contact Us')
  const ctaHref = s(content?.primaryCta?.href, '/contact-us')

  return (
    <section
      style={{
        background: 'var(--teal-900, #08312f)',
        color: 'var(--paper)',
        padding: 'clamp(80px, 14vh, 160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ ...eyebrowStyle, marginBottom: 32, color: 'rgba(255,255,255,0.6)' }}>
            {eyebrowText}
          </div>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 88px)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--paper)',
            }}
          >
            {headline}{' '}
            <span className="display-italic" style={{ color: 'var(--accent)' }}>
              {headlineItalic}
            </span>
          </h2>
          <p
            className="body-lg"
            style={{ marginTop: 32, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}
          >
            {body}
          </p>
          <div style={{ marginTop: 48 }}>
            <a
              href={ctaHref}
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '18px 36px',
                background: 'var(--paper)',
                color: 'var(--ink)',
              }}
            >
              {ctaLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutPage({ content }: AboutPageProps) {
  return (
    <main>
      <HeroTheme value="light" />
      <AboutHero content={content?.hero} />
      <AboutPillars content={content?.pillars} />
      <AboutLicenses content={content?.licenses} />
      <AboutCta content={content?.cta} />
    </main>
  )
}
