// Facts:
// 1. Imported by every detail/list route under src/app/(frontend) above Footer.
// 2. Glob: src/components/sections/ContactBand.tsx returned No files found.
// 3. No I/O. Server component.
// 4. User: "wire up sections on the pages and create components".

interface ContactBandProps {
  lead?: string
  italicHighlight?: string
  ctaLabel?: string
  ctaHref?: string
}

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: 8 }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ContactBand({
  lead = 'We bring proven experience with personalized counsel to',
  italicHighlight = 'complex healthcare',
  ctaLabel = 'Get In Touch',
  ctaHref = '/contact-us',
}: ContactBandProps) {
  return (
    <section
      style={{
        background: 'var(--ink)',
        color: 'var(--cream)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="container-wide"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 48,
          flexWrap: 'wrap',
        }}
      >
        <h2
          className="display"
          style={{
            fontSize: 'clamp(36px, 4vw, 60px)',
            maxWidth: 800,
            color: 'var(--cream)',
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          {lead}{' '}
          <a
            href={ctaHref}
            className="display-italic"
            style={{
              color: 'var(--accent)',
              borderBottom: '1px solid currentColor',
              textDecoration: 'none',
            }}
          >
            {italicHighlight}
          </a>
          .
        </h2>
        <a
          href={ctaHref}
          className="btn btn-light"
          style={{
            padding: '18px 32px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {ctaLabel}
          <ArrowIcon />
        </a>
      </div>
    </section>
  )
}
