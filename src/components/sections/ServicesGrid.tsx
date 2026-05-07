// Facts:
// 1. Imported by [slug]/page.tsx for slug 'what-we-do' and similar pages.
// 2. Glob: src/components/sections/ServicesGrid.tsx returned No files found.
// 3. No I/O. Server component; takes Payload services docs as a prop.
//    Doc shape: { id, title, slug, summary, featuredImage: {url, alt}, order }.
// 4. User: "wire up sections on the pages and create components".

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

interface ServicesGridProps {
  services: Service[]
  eyebrowNumber?: string
  heading?: string
  italicSuffix?: string
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
      <div
        className="eyebrow"
        style={{ color: 'var(--accent)', fontSize: 12 }}
      >
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
        <p
          className="body-sm"
          style={{ color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}
        >
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

export function ServicesGrid({
  services,
  eyebrowNumber = '04',
  heading = 'What We',
  italicSuffix = 'Do.',
}: ServicesGridProps) {
  return (
    <section
      id="practices"
      style={{ padding: '120px 0', background: 'var(--paper)' }}
    >
      <div className="container-wide">
        <div style={{ marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            <span style={{ color: 'var(--accent)', marginRight: 10 }}>
              {eyebrowNumber}
            </span>{' '}
            Practice Areas
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
              {italicSuffix}
            </span>
          </h2>
        </div>

        {services.length === 0 ? (
          <p className="body-lg" style={{ color: 'var(--ink-3)' }}>
            Practice-area details are being prepared.
          </p>
        ) : (
          <div>
            {services.map((s, i) => (
              <ServiceRow
                key={s.id}
                service={s}
                index={i}
                total={services.length}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
