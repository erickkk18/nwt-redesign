interface MediaDoc {
  url?: string | null
  alt?: string | null
}

export interface Service {
  id: string
  title: string
  slug: string
  summary?: string | null
  featuredImage?: MediaDoc | string | null
  order?: number | null
}

interface CtaContent {
  label?: string | null
  href?: string | null
}

interface ServicesIntroContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  description?: string | null
}

interface ServicesCtaContent {
  enabled?: boolean | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  body?: string | null
  primaryCta?: CtaContent | null
}

export interface ServicesPageContent {
  intro?: ServicesIntroContent | null
  cta?: ServicesCtaContent | null
}

interface ServicesGridProps {
  services: Service[]
  content?: ServicesPageContent | null
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

function ServiceRow({
  service,
  index,
  total,
}: {
  service: Service
  index: number
  total: number
}) {
  const url = mediaUrl(service.featuredImage)
  const numLabel = String(index + 1).padStart(2, '0')
  return (
    <a
      href={`/services/${service.slug}`}
      className="services-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr 320px 60px',
        gap: 32,
        alignItems: 'center',
        padding: '36px 0',
        borderTop: '1px solid var(--line)',
        borderBottom: index === total - 1 ? '1px solid var(--line)' : 'none',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'padding-left 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div className="eyebrow" style={{ color: 'var(--accent)', fontSize: 12 }}>
        {numLabel}
      </div>

      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(24px, 2.4vw, 36px)',
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          margin: 0,
        }}
      >
        {service.title}
      </h3>

      {service.summary ? (
        <p className="body-sm" style={{ color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>
          {service.summary}
        </p>
      ) : (
        <div />
      )}

      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: url ? 'transparent' : 'var(--cream-2)',
          overflow: 'hidden',
          justifySelf: 'end',
        }}
      >
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
    </a>
  )
}

function ServicesCta({ content }: { content?: ServicesCtaContent | null }) {
  if (content?.enabled === false) return null
  const eyebrowText = s(content?.eyebrowText, 'Engage Us')
  const heading = s(content?.heading, "Don't see your")
  const headingItalic = s(content?.headingItalic, 'matter?')
  const body = s(
    content?.body,
    "We take on adjacent and bespoke matters when they sit in our wheelhouse. The fastest answer is a 15-minute call.",
  )
  const ctaLabel = s(content?.primaryCta?.label, 'Talk to a Partner')
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
          <p className="body-lg" style={{ marginTop: 28, color: 'var(--ink-2)', lineHeight: 1.6 }}>
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

export function ServicesGrid({ services, content }: ServicesGridProps) {
  const eyebrowNumber = s(content?.intro?.eyebrowNumber, '04')
  const eyebrowText = s(content?.intro?.eyebrowText, 'Excellence in Customer Service')
  const heading = s(content?.intro?.heading, 'Full-Service')
  const headingItalic = s(content?.intro?.headingItalic, 'Law Firm.')
  const description = s(
    content?.intro?.description,
    'We are a full-service law firm with the depth and experience to handle almost any transactional, litigation, corporate, or compliance matter in a variety of fields. Our team has particular expertise in the highly regulated healthcare industry. We offer our clients an exceptional team, dedicated to the delivery of outstanding service — always with the personalized and responsive touch of a small law firm.',
  )

  return (
    <>
      <section
        id="practices"
        style={{ padding: 'clamp(80px, 12vh, 140px) 0', background: 'var(--paper)' }}
      >
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
                <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
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

          {services.length === 0 ? (
            <p className="body-lg" style={{ color: 'var(--ink-3)' }}>
              Practice-area details are being prepared.
            </p>
          ) : (
            <div>
              {services.map((s, i) => (
                <ServiceRow key={s.id} service={s} index={i} total={services.length} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ServicesCta content={content?.cta} />
    </>
  )
}
