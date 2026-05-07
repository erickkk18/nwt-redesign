// Facts:
// 1. Imported by FooterServer (which is imported by (frontend)/layout.tsx).
// 2. Glob: src/components/site/Footer.tsx returned 1 file (this one).
// 3. No I/O. Server component, no hooks. Pure render.
// 4. User: "make more fields for the footer. … the images are for reference
//    still follow the design rules"

interface FooterLink {
  label: string
  href: string
  openInNewTab?: boolean
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

interface OfficeProps {
  label?: string
  address: string
  phone?: string
}

interface SocialProps {
  platform: string
  url: string
}

const DEFAULT_COLUMNS: FooterColumnProps[] = [
  {
    title: 'Firm',
    links: [
      { label: 'What We Do', href: '/our-services' },
      { label: 'Our Team', href: '/our-team' },
      { label: 'What Sets Us Apart', href: '/what-sets-us-apart' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'News & Insights', href: '/posts' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
  {
    title: 'Locations',
    links: [
      { label: 'Houston', href: '/houston-healthcare-lawyer' },
      { label: 'Austin', href: '/austin-healthcare-lawyer' },
      { label: 'Dallas', href: '/dallas-healthcare-lawyer' },
      { label: 'San Antonio', href: '/san-antonio-healthcare-lawyer' },
    ],
  },
]

const DEFAULT_OFFICES: OfficeProps[] = [
  { label: 'Houston', address: '2402 Dunlavy Street, Suite 2000\nHouston, Texas 77006', phone: '713-405-7090' },
  { label: 'Austin', address: '2901 Bee Caves Road, Suite A\nAustin, Texas 78746', phone: '512-221-3057' },
]

const DEFAULT_LICENSING_TITLE = 'Licensed in Texas* and California'
const DEFAULT_LICENSING_BODY =
  'Unless otherwise noted, our lawyers are not certified by the Texas Board of Legal Specialization.\n\n*All attorneys licensed in Texas\n\nScott Nichols is licensed in Texas and California.\n\nZach Thomas is licensed in Texas, California, Illinois, Missouri and Oregon.'
const DEFAULT_DISCLAIMER =
  'The information on this website is for general information purposes only. Nothing on this site should be taken as legal advice for any individual case or situation. This information is not intended to create, and receipt or viewing does not constitute, an attorney-client relationship.'

interface FooterProps {
  columns?: FooterColumnProps[]
  bottomLinks?: FooterLink[]
  tagline?: string
  copyrightSuffix?: string
  logoUrl?: string
  logoAlt?: string
  offices?: OfficeProps[]
  socials?: SocialProps[]
  sharedEmail?: string
  getInTouchLabel?: string
  licensingTitle?: string
  licensingBody?: string
  disclaimer?: string
  designerCredit?: string
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <div
        className="eyebrow"
        style={{ color: 'rgba(246,242,234,0.5)', marginBottom: 20 }}
      >
        {title}
      </div>
      <ul
        style={{ listStyle: 'none', display: 'grid', gap: 10, padding: 0, margin: 0 }}
      >
        {links.map((l, i) => (
          <li key={`${l.href}-${i}`}>
            <a
              href={l.href}
              target={l.openInNewTab ? '_blank' : undefined}
              rel={l.openInNewTab ? 'noopener noreferrer' : undefined}
              style={{ color: 'var(--cream)', textDecoration: 'none', fontSize: 14 }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OfficeBlock({ office }: { office: OfficeProps }) {
  const phoneHref = office.phone ? `tel:${office.phone.replace(/[^+\d]/g, '')}` : null
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {office.label && (
        <div
          className="eyebrow"
          style={{ color: 'rgba(246,242,234,0.55)', marginBottom: 4 }}
        >
          {office.label}
        </div>
      )}
      <p
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 16,
          lineHeight: 1.5,
          color: 'rgba(245,241,232,0.85)',
          whiteSpace: 'pre-line',
          margin: 0,
        }}
      >
        {office.address}
      </p>
      {office.phone && phoneHref && (
        <a
          href={phoneHref}
          style={{
            color: 'rgba(245,241,232,0.7)',
            fontSize: 13,
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            justifySelf: 'start',
            marginTop: 4,
          }}
        >
          {office.phone}
        </a>
      )}
    </div>
  )
}

function socialIconLabel(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return 'in'
    case 'x':
    case 'twitter':
      return '𝕏'
    case 'facebook':
      return 'f'
    case 'instagram':
      return 'IG'
    case 'youtube':
      return 'YT'
    default:
      return platform.slice(0, 2).toUpperCase()
  }
}

export function Footer({
  columns = DEFAULT_COLUMNS,
  bottomLinks = [{ label: 'Privacy', href: '/privacy-policy' }],
  tagline = 'Healthcare. Focused. Attorneys.',
  copyrightSuffix = 'Nichols Weitzner Thomas LLP · All rights reserved',
  logoUrl = '/nwt-logo.png',
  logoAlt = 'Nichols Weitzner Thomas',
  offices = DEFAULT_OFFICES,
  socials = [],
  sharedEmail = 'firm@nwtlaw.com',
  getInTouchLabel = 'Get In Touch',
  licensingTitle = DEFAULT_LICENSING_TITLE,
  licensingBody = DEFAULT_LICENSING_BODY,
  disclaimer = DEFAULT_DISCLAIMER,
  designerCredit = '',
}: FooterProps = {}) {
  const cols = columns.length > 0 ? columns : DEFAULT_COLUMNS
  const offs = offices.length > 0 ? offices : DEFAULT_OFFICES

  return (
    <footer
      style={{
        background: 'var(--teal-900)',
        color: 'var(--cream)',
        padding: '96px 0 48px',
      }}
    >
      <div className="container-wide">
        {/* Top brand strip */}
        <div
          className="footer-top grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'flex-start',
            gap: 48,
            paddingBottom: 56,
            borderBottom: '1px solid rgba(246,242,234,0.18)',
          }}
        >
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={logoAlt}
              style={{
                height: 56,
                width: 'auto',
                filter: 'brightness(0) invert(1)',
                marginBottom: 20,
              }}
            />
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 18,
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(245,241,232,0.7)',
                maxWidth: 360,
                margin: 0,
              }}
            >
              {tagline}
            </p>
          </div>

          {(socials.length > 0 || getInTouchLabel) && (
            <div style={{ minWidth: 200 }}>
              <div
                className="eyebrow"
                style={{ color: 'rgba(246,242,234,0.5)', marginBottom: 16 }}
              >
                {getInTouchLabel}
              </div>
              {sharedEmail && (
                <a
                  href={`mailto:${sharedEmail}`}
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 18,
                    color: 'var(--cream)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 4,
                    display: 'inline-block',
                    marginBottom: 20,
                  }}
                >
                  {sharedEmail}
                </a>
              )}
              {socials.length > 0 && (
                <div style={{ display: 'flex', gap: 12 }}>
                  {socials.map((s, i) => (
                    <a
                      key={`${s.platform}-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '1px solid rgba(246,242,234,0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cream)',
                        textDecoration: 'none',
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {socialIconLabel(s.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Offices + Licensing + Nav columns */}
        <div
          className="footer-mid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.2fr) repeat(auto-fit, minmax(0, 1fr))',
            gap: 56,
            paddingTop: 56,
            paddingBottom: 56,
            borderBottom: '1px solid rgba(246,242,234,0.18)',
          }}
        >
          <div>
            <div
              className="eyebrow"
              style={{ color: 'rgba(246,242,234,0.5)', marginBottom: 20 }}
            >
              Offices
            </div>
            <div style={{ display: 'grid', gap: 28 }}>
              {offs.map((o, i) => (
                <OfficeBlock key={`${o.label ?? i}-${i}`} office={o} />
              ))}
            </div>
          </div>

          <div>
            <div
              className="eyebrow"
              style={{ color: 'rgba(246,242,234,0.5)', marginBottom: 20 }}
            >
              {licensingTitle}
            </div>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 15,
                lineHeight: 1.6,
                color: 'rgba(245,241,232,0.78)',
                whiteSpace: 'pre-line',
                margin: 0,
                maxWidth: 380,
              }}
            >
              {licensingBody}
            </p>
          </div>

          {cols.map((c, i) => (
            <FooterColumn key={`${c.title}-${i}`} {...c} />
          ))}
        </div>

        {/* Disclaimer */}
        {disclaimer && (
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: 'rgba(245,241,232,0.55)',
              maxWidth: 980,
              margin: '40px 0 32px',
            }}
          >
            {disclaimer}
          </p>
        )}

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 24,
            gap: 24,
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(246,242,234,0.12)',
          }}
        >
          <div className="eyebrow" style={{ color: 'rgba(245,241,232,0.5)' }}>
            © {new Date().getFullYear()} {copyrightSuffix}
            {designerCredit && (
              <span style={{ marginLeft: 16, color: 'rgba(245,241,232,0.4)' }}>
                · {designerCredit}
              </span>
            )}
          </div>
          {bottomLinks.length > 0 && (
            <div style={{ display: 'flex', gap: 24 }}>
              {bottomLinks.map((l, i) => (
                <a
                  key={`${l.href}-${i}`}
                  href={l.href}
                  style={{
                    color: 'rgba(246,242,234,0.5)',
                    fontSize: 12,
                    textDecoration: 'none',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Atmospheric watermark */}
      <div
        style={{
          marginTop: 80,
          textAlign: 'center',
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(80px, 18vw, 280px)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          color: 'rgba(246,242,234,0.06)',
          userSelect: 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        NWT <span style={{ fontStyle: 'italic' }}>Law</span>
      </div>
    </footer>
  )
}
