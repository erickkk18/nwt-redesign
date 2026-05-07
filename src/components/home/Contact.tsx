// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    promo strip + "09 Contact" section as the final block.
// 2. Glob: src/components/home/Contact.tsx returned No files found before write.
// 3. No file I/O. In-memory FormState { name, email, phone, firm, message };
//    onSubmit is preventDefault only (no backend wiring yet).
// 4. User: "the homepage fix the links make the sections components wire it up"
//
// Link fix vs. previous inline version:
//   - Email link href="#" -> "mailto:info@nwtlaw.example"

'use client'

import { useState, type CSSProperties } from 'react'

import { Icon, s, useReveal, type ContactContent, type OfficeContent } from './_shared'

const fallbackOffices: OfficeContent[] = [
  { label: 'Houston Office', address: '2402 Dunlavy Street, Suite 2000\nHouston, Texas 77006', phone: '713-405-7090' },
  { label: 'Austin Office', address: '2901 Bee Caves Road, Suite A\nAustin, Texas 78746', phone: '512-221-3057' },
]

interface FormState {
  name: string
  email: string
  phone: string
  firm: string
  message: string
}

export function Contact({ content }: { content?: ContactContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', firm: '', message: '' })

  const inputStyle: CSSProperties = { width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--line-2)', fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink)', outline: 'none', transition: 'border-color 0.3s' }
  const labelStyle: CSSProperties = { fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8, display: 'block' }

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const bannerHeadline = s(content?.bannerHeadline, 'We bring proven experience with personalized counsel to')
  const bannerHighlight = s(content?.bannerHighlight, 'complex healthcare')
  const bannerHighlightHref = s(content?.bannerHighlightHref, '#contact')
  const bannerSuffix = s(content?.bannerSuffix, '.')
  const bannerCtaLabel = s(content?.bannerCta?.label, 'Get In Touch')
  const bannerCtaHref = s(content?.bannerCta?.href, '#contact')

  const eyebrowNumber = s(content?.eyebrowNumber, '09')
  const eyebrowText = s(content?.eyebrowText, 'Contact')
  const headline = s(content?.headline, 'Contact')
  const headlineItalic = s(content?.headlineItalic, 'Details.')

  const sharedEmail = s(content?.sharedEmail, 'firm@nwtlaw.com')
  const hoursLabel = s(content?.hours?.label, 'Monday – Friday')
  const hoursValue = s(content?.hours?.value, '9:00 AM – 6:00 PM')
  const offices = content?.offices && content.offices.length > 0 ? content.offices : fallbackOffices

  const formDisclaimer = s(
    content?.form?.disclaimer,
    'Submitting this form does not create an attorney-client relationship. By contacting us, you acknowledge that we may not represent you until a formal engagement is established.',
  )
  const submitLabel = s(content?.form?.submitLabel, 'Send Message')

  return (
    <>
      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 60px)', maxWidth: 800, color: 'var(--cream)' }}>
            {bannerHeadline} <a href={bannerHighlightHref} className="display-italic" style={{ color: 'var(--accent)', borderBottom: '1px solid currentColor', textDecoration: 'none' }}>{bannerHighlight}</a>{bannerSuffix}
          </h2>
          <a href={bannerCtaHref} className="btn btn-light" style={{ padding: '18px 32px' }}>{bannerCtaLabel} <Icon.Arrow size={14} /></a>
        </div>
      </section>

      <section id="contact" style={{ background: 'var(--paper)', padding: '160px 0 120px' }}>
        <div ref={ref} className="container-wide reveal">
          <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
            <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 100 }}>
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: 'var(--ink)', marginBottom: 40 }}>
                {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span>
              </h2>
              <a
                href={`mailto:${sharedEmail}`}
                className="ulink body"
                style={{
                  color: 'var(--ink)',
                  fontFamily: 'var(--serif)',
                  fontSize: 20,
                  display: 'inline-block',
                  marginBottom: 28,
                }}
              >
                {sharedEmail}
              </a>

              <div
                style={{
                  display: 'grid',
                  gap: 4,
                  paddingTop: 20,
                  paddingBottom: 28,
                  borderTop: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                  marginBottom: 36,
                }}
              >
                <div className="eyebrow" style={{ color: 'var(--ink-3)' }}>{hoursLabel}</div>
                <div className="body" style={{ color: 'var(--ink)' }}>{hoursValue}</div>
              </div>

              <div style={{ display: 'grid', gap: 28 }}>
                {offices.map((o, i) => {
                  const phoneHref = o.phone ? `tel:${o.phone.replace(/[^+\d]/g, '')}` : null
                  return (
                    <div key={`${o.label}-${i}`} style={{ display: 'grid', gap: 8 }}>
                      <div
                        style={{
                          fontFamily: 'var(--serif)',
                          fontSize: 18,
                          fontWeight: 500,
                          color: 'var(--ink)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {o.label}
                      </div>
                      <p className="body" style={{ color: 'var(--ink-2)', whiteSpace: 'pre-line', margin: 0 }}>{o.address}</p>
                      {o.phone && phoneHref && (
                        <a
                          href={phoneHref}
                          className="ulink"
                          style={{ fontSize: 14, color: 'var(--teal-800)', justifySelf: 'start' }}
                        >
                          {o.phone}
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 28 }}>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={update('name')} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={update('email')} />
                </div>
              </div>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} value={form.phone} onChange={update('phone')} />
                </div>
                <div>
                  <label style={labelStyle}>Company / Firm</label>
                  <input style={inputStyle} value={form.firm} onChange={update('firm')} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>How can we help?</label>
                <textarea rows={4} style={{ ...inputStyle, resize: 'none' }} value={form.message} onChange={update('message')} />
              </div>
              <p className="body-sm" style={{ marginTop: 16 }}>
                {formDisclaimer}
              </p>
              <div>
                <button type="submit" className="btn btn-primary" style={{ padding: '16px 32px' }}>
                  {submitLabel} <Icon.Arrow size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
