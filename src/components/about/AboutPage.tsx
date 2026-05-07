import type { CSSProperties } from 'react'

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

interface AboutQuoteContent {
  body?: string | null
  attribution?: string | null
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

interface AboutStoryContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  body1?: string | null
  body2?: string | null
  image?: PayloadMedia | string | null
  imageCaption?: string | null
}

interface AboutStatItem {
  value?: string | null
  suffix?: string | null
  label?: string | null
}

interface AboutStatsContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  items?: AboutStatItem[] | null
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
  quote?: AboutQuoteContent | null
  pillars?: AboutPillarsContent | null
  story?: AboutStoryContent | null
  stats?: AboutStatsContent | null
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
  const eyebrowText = s(content?.eyebrowText, 'About')
  const headline = s(content?.headline, 'What Sets')
  const headlineItalic = s(content?.headlineItalic, 'Us Apart.')
  const lede = s(
    content?.lede,
    'A boutique law firm built around three quiet convictions: clients deserve real attention, complex matters reward focused experience, and the right room is the one where decisions get made.',
  )
  const imgUrl = mediaUrl(content?.image)
  const imgAlt = mediaAlt(content?.image, 'Nichols Weitzner partners')

  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: 'clamp(80px, 14vh, 160px) 0 clamp(80px, 12vh, 140px)',
        position: 'relative',
        overflow: 'hidden',
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
                fontSize: 'clamp(56px, 9vw, 144px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                margin: 0,
                color: 'var(--ink)',
              }}
            >
              {headline}
              <br />
              <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
                {headlineItalic}
              </span>
            </h1>
            <p
              className="body-lg"
              style={{
                marginTop: 40,
                maxWidth: 560,
                color: 'var(--ink-2)',
                fontSize: 'clamp(18px, 1.4vw, 22px)',
                lineHeight: 1.55,
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
              boxShadow:
                '0 30px 60px -30px rgba(0,0,0,0.25), 0 1px 0 rgba(0,0,0,0.04)',
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
              Houston · 2007
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutQuote({ content }: { content?: AboutQuoteContent | null }) {
  const body = s(
    content?.body,
    'We built Nichols Weitzner to be the firm we wanted to hire — fast on the work, slow on the relationship.',
  )
  const attribution = s(content?.attribution, 'Founding Partners')

  return (
    <section
      style={{
        background: 'var(--cream-2)',
        padding: 'clamp(80px, 12vh, 140px) 0',
        position: 'relative',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <span
            aria-hidden
            style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(120px, 16vw, 220px)',
              lineHeight: 0.6,
              color: 'var(--teal-800)',
              opacity: 0.18,
              position: 'absolute',
              top: -28,
              left: -8,
              userSelect: 'none',
            }}
          >
            “
          </span>
          <p
            className="display"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(28px, 3.6vw, 56px)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              fontWeight: 300,
              color: 'var(--ink)',
              margin: 0,
              position: 'relative',
            }}
          >
            {body}
          </p>
          <div
            style={{
              marginTop: 40,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{ width: 48, height: 1, background: 'var(--ink-3)', display: 'inline-block' }} />
            <span style={eyebrowStyle}>{attribution}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutPillars({ content }: { content?: AboutPillarsContent | null }) {
  const eyebrowNumber = s(content?.eyebrowNumber, '03')
  const eyebrowText = s(content?.eyebrowText, 'Pillars')
  const heading = s(content?.heading, 'Three Things')
  const headingItalic = s(content?.headingItalic, 'We Refuse to Compromise.')
  const items =
    content?.items && content.items.length > 0
      ? content.items
      : [
          { numLabel: '01', title: 'Senior-Led Service', body: 'Every matter is staffed by partners and senior counsel — never delegated to a churning bullpen of associates billing for training.' },
          { numLabel: '02', title: 'Healthcare Native', body: 'We have spent careers inside hospital systems, payor disputes, and provider transactions. Industry fluency is the floor, not the ceiling.' },
          { numLabel: '03', title: 'Plain-Spoken Counsel', body: 'Real clarity beats legal hedging. We tell you what we would do if it were our company — then we go do it.' },
        ]

  return (
    <section id="pillars" style={{ background: 'var(--paper)', padding: 'clamp(80px, 12vh, 140px) 0' }}>
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
                  fontSize: 'clamp(22px, 1.9vw, 30px)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  marginBottom: 16,
                  color: 'var(--ink)',
                }}
              >
                {s(pillar.title, '—')}
              </h3>
              <p className="body" style={{ color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
                {s(pillar.body, '')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutStory({ content }: { content?: AboutStoryContent | null }) {
  const eyebrowNumber = s(content?.eyebrowNumber, '04')
  const eyebrowText = s(content?.eyebrowText, 'Origin')
  const heading = s(content?.heading, 'Built by lawyers who')
  const headingItalic = s(content?.headingItalic, 'left big law on purpose.')
  const body1 = s(
    content?.body1,
    'Nichols Weitzner began with a deliberate departure. Our founders left top-tier firms after watching too many sophisticated clients buried under the weight of process, conflicts, and committee.',
  )
  const body2 = s(
    content?.body2,
    'The result is a practice deliberately scaled to the work — large enough to handle bet-the-company litigation and complex transactions, small enough to know your business by heart.',
  )
  const imgUrl = mediaUrl(content?.image)
  const imgAlt = mediaAlt(content?.image, 'Firm history')
  const imageCaption = s(content?.imageCaption, 'Houston · 2007 → Today')

  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: 'clamp(60px, 10vh, 120px) 0',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="container-wide">
        <div
          className="about-story-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ ...eyebrowStyle, marginBottom: 24 }}>
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span>
              {eyebrowText}
            </div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(36px, 4.4vw, 64px)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                margin: 0,
                marginBottom: 32,
              }}
            >
              {heading}{' '}
              <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
                {headingItalic}
              </span>
            </h2>
            <p className="body-lg" style={{ color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 20 }}>
              {body1}
            </p>
            <p className="body-lg" style={{ color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>
              {body2}
            </p>
          </div>

          <figure style={{ margin: 0 }}>
            <div
              style={{
                aspectRatio: '5/4',
                background: 'var(--cream-2)',
                overflow: 'hidden',
                position: 'relative',
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
                      'repeating-linear-gradient(45deg, var(--cream-2) 0 16px, rgba(0,0,0,0.05) 16px 32px)',
                  }}
                />
              )}
            </div>
            <figcaption
              style={{ ...eyebrowStyle, marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ width: 24, height: 1, background: 'var(--ink-3)', display: 'inline-block' }} />
              {imageCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function AboutStats({ content }: { content?: AboutStatsContent | null }) {
  const eyebrowNumber = s(content?.eyebrowNumber, '05')
  const eyebrowText = s(content?.eyebrowText, 'By the Numbers')
  const items =
    content?.items && content.items.length > 0
      ? content.items
      : [
          { value: '19', suffix: 'Years', label: 'Continuous Texas practice' },
          { value: '$2B+', suffix: '', label: 'In matters handled to verdict or close' },
          { value: '40+', suffix: '', label: 'Healthcare systems served' },
          { value: '3', suffix: 'Cities', label: 'Houston · Austin · Dallas' },
        ]

  return (
    <section
      style={{
        background: 'var(--teal-900, #08312f)',
        color: 'var(--paper)',
        padding: 'clamp(80px, 12vh, 140px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-wide">
        <div style={{ marginBottom: 64 }}>
          <div style={{ ...eyebrowStyle, color: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span>
            {eyebrowText}
          </div>
        </div>

        <div
          className="about-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
            gap: 'clamp(28px, 3vw, 56px)',
          }}
        >
          {items.map((stat, idx) => (
            <div
              key={idx}
              style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.18)' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
                <span
                  className="display-italic"
                  style={{
                    fontFamily: 'var(--serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(56px, 6vw, 96px)',
                    lineHeight: 0.95,
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                    color: 'var(--paper)',
                  }}
                >
                  {s(stat.value, '—')}
                </span>
                {stat.suffix && (
                  <span style={{ ...eyebrowStyle, color: 'rgba(255,255,255,0.55)' }}>{stat.suffix}</span>
                )}
              </div>
              <p
                className="body-sm"
                style={{ color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}
              >
                {s(stat.label, '')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutCta({ content }: { content?: AboutCtaContent | null }) {
  const eyebrowText = s(content?.eyebrowText, 'Get in Touch')
  const headline = s(content?.headline, "Let's see if we")
  const headlineItalic = s(content?.headlineItalic, 'fit your matter.')
  const body = s(
    content?.body,
    'A 30-minute conversation tells us both whether the chemistry — and the case — make sense. No engagement, no obligation.',
  )
  const ctaLabel = s(content?.primaryCta?.label, 'Book a Conversation')
  const ctaHref = s(content?.primaryCta?.href, '/contact-us')

  return (
    <section style={{ background: 'var(--paper)', padding: 'clamp(80px, 14vh, 160px) 0', position: 'relative' }}>
      <div className="container">
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ ...eyebrowStyle, marginBottom: 32 }}>{eyebrowText}</div>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(44px, 6vw, 96px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            {headline}{' '}
            <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
              {headlineItalic}
            </span>
          </h2>
          <p className="body-lg" style={{ marginTop: 32, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            {body}
          </p>
          <div style={{ marginTop: 48 }}>
            <a
              href={ctaHref}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 36px' }}
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
      <AboutHero content={content?.hero} />
      <AboutQuote content={content?.quote} />
      <AboutPillars content={content?.pillars} />
      <AboutStory content={content?.story} />
      <AboutStats content={content?.stats} />
      <AboutCta content={content?.cta} />
    </main>
  )
}
