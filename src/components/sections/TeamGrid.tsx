interface MediaDoc {
  url?: string | null
  alt?: string | null
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  role?: string | null
  category?: string | null
  photo?: MediaDoc | string | null
  order?: number | null
}

interface CtaContent {
  label?: string | null
  href?: string | null
}

interface TeamIntroContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  description?: string | null
}

interface TeamCtaContent {
  enabled?: boolean | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  body?: string | null
  primaryCta?: CtaContent | null
}

export interface TeamPageContent {
  intro?: TeamIntroContent | null
  cta?: TeamCtaContent | null
}

interface TeamGridProps {
  team: TeamMember[]
  content?: TeamPageContent | null
}

function s(value: string | null | undefined, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? value : fallback
}

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

function mediaAlt(
  m: MediaDoc | string | null | undefined,
  fallback: string,
): string {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

function AttorneyCard({ member }: { member: TeamMember }) {
  const url = mediaUrl(member.photo)
  const alt = mediaAlt(member.photo, member.name)
  return (
    <a
      href={`/team/${member.slug}`}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          aspectRatio: '4/5',
          background: 'var(--cream-2)',
          marginBottom: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'repeating-linear-gradient(135deg, var(--cream-2) 0 12px, var(--cream-3, var(--cream-2)) 12px 24px)',
            }}
          />
        )}
      </div>
      {member.category && (
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>
          {member.category}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          margin: 0,
          marginBottom: 4,
        }}
      >
        {member.name}
      </h3>
      {member.role && (
        <div
          className="body-sm"
          style={{
            color: 'var(--ink-3)',
            fontStyle: 'italic',
            fontFamily: 'var(--serif)',
          }}
        >
          {member.role}
        </div>
      )}
    </a>
  )
}

function TeamCta({ content }: { content?: TeamCtaContent | null }) {
  if (content?.enabled === false) return null
  const eyebrowText = s(content?.eyebrowText, 'Work with us')
  const heading = s(content?.heading, 'Looking for the right')
  const headingItalic = s(content?.headingItalic, 'attorney?')
  const body = s(
    content?.body,
    "Tell us about your matter — we'll match you with the partner whose practice and disposition fit best.",
  )
  const ctaLabel = s(content?.primaryCta?.label, 'Get in Touch')
  const ctaHref = s(content?.primaryCta?.href, '/contact-us')

  return (
    <section
      style={{
        background: 'var(--cream-2)',
        padding: 'clamp(80px, 12vh, 140px) 0',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              marginBottom: 24,
            }}
          >
            {eyebrowText}
          </div>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(36px, 4.6vw, 72px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            {heading}{' '}
            <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
              {headingItalic}
            </span>
          </h2>
          <p
            className="body-lg"
            style={{ marginTop: 28, color: 'var(--ink-2)', lineHeight: 1.6 }}
          >
            {body}
          </p>
          <div style={{ marginTop: 40 }}>
            <a
              href={ctaHref}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '16px 32px',
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

export function TeamGrid({ team, content }: TeamGridProps) {
  const eyebrowNumber = s(content?.intro?.eyebrowNumber, '06')
  const eyebrowText = s(content?.intro?.eyebrowText, 'The Team')
  const heading = s(content?.intro?.heading, 'Our')
  const headingItalic = s(content?.intro?.headingItalic, 'Attorneys.')
  const description = s(
    content?.intro?.description,
    'A bench of healthcare-focused attorneys who have tried, settled, and counseled through the most consequential matters facing Texas providers.',
  )

  return (
    <>
      <section style={{ padding: 'clamp(80px, 12vh, 140px) 0', background: 'var(--paper)' }}>
        <div className="container-wide">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
              gap: 'clamp(32px, 5vw, 80px)',
              alignItems: 'end',
              marginBottom: 64,
              paddingBottom: 24,
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-3)',
                  marginBottom: 16,
                }}
              >
                <span style={{ color: 'var(--accent)', marginRight: 10 }}>
                  {eyebrowNumber}
                </span>
                {eyebrowText}
              </div>
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(40px, 5vw, 80px)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {heading}{' '}
                <span
                  className="display-italic"
                  style={{ color: 'var(--teal-800)' }}
                >
                  {headingItalic}
                </span>
              </h2>
            </div>
            <p
              className="body-lg"
              style={{
                color: 'var(--ink-2)',
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              {description}
            </p>
          </div>

          {team.length === 0 ? (
            <p className="body-lg" style={{ color: 'var(--ink-3)' }}>
              Team profiles are being prepared. Check back soon.
            </p>
          ) : (
            <div
              className="grid-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 48,
              }}
            >
              {team.map((m) => (
                <AttorneyCard key={m.id} member={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      <TeamCta content={content?.cta} />
    </>
  )
}
