'use client'

import { useState } from 'react'
import type { CSSProperties, ChangeEvent, FormEvent } from 'react'

interface OfficeContent {
  label?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  phone?: string | null
}

interface ContactHeaderContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  heading?: string | null
  headingItalic?: string | null
  lede?: string | null
}

interface ContactDetailsContent {
  detailsHeading?: string | null
  detailsHeadingItalic?: string | null
  offices?: OfficeContent[] | null
  sharedEmail?: string | null
  hoursLabel?: string | null
  hoursBody?: string | null
}

interface ContactFormCopy {
  submitLabel?: string | null
  disclaimer?: string | null
  successEyebrow?: string | null
  successHeading?: string | null
  successBody?: string | null
}

export interface ContactPageContent {
  header?: ContactHeaderContent | null
  details?: ContactDetailsContent | null
  form?: ContactFormCopy | null
}

interface ContactSectionProps {
  content?: ContactPageContent | null
}

interface FormState {
  name: string
  email: string
  phone: string
  firm: string
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  firm: '',
  message: '',
}

function s(value: string | null | undefined, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? value : fallback
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

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '16px 0',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--line-2)',
  fontFamily: 'var(--sans)',
  fontSize: 16,
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color 0.3s',
}

const labelStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--ink-3)',
  marginBottom: 8,
  display: 'block',
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--ink-3)',
}

export function ContactSection({ content }: ContactSectionProps = {}) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const update =
    (k: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const eyebrowNumber = s(content?.header?.eyebrowNumber, '09')
  const eyebrowText = s(content?.header?.eyebrowText, 'Contact')
  const heading = s(content?.header?.heading, 'Tell us about')
  const headingItalic = s(content?.header?.headingItalic, 'your matter.')
  const lede = s(
    content?.header?.lede,
    'A short note is enough — share what you can, and a partner will respond within one business day. All inquiries are confidential.',
  )

  const detailsHeading = s(content?.details?.detailsHeading, 'Contact')
  const detailsHeadingItalic = s(content?.details?.detailsHeadingItalic, 'Details.')
  const offices =
    content?.details?.offices && content.details.offices.length > 0
      ? content.details.offices
      : [
          {
            label: 'Houston Office',
            addressLine1: '1717 West Loop South, Suite 1800',
            addressLine2: 'Houston, Texas 77027',
            phone: '+1 (713) 555-0140',
          },
        ]
  const sharedEmail = s(content?.details?.sharedEmail, 'info@nwtlaw.example')
  const hoursLabel = s(content?.details?.hoursLabel, 'Hours')
  const hoursBody = s(content?.details?.hoursBody, 'Mon — Fri · 8:30 AM – 6:00 PM CT')

  const submitLabel = s(content?.form?.submitLabel, 'Send Message')
  const disclaimer = s(
    content?.form?.disclaimer,
    'Submitting this form does not create an attorney-client relationship. By contacting us, you acknowledge that we may not represent you until a formal engagement is established.',
  )
  const successEyebrow = s(content?.form?.successEyebrow, 'Message received')
  const successHeading = s(content?.form?.successHeading, 'Thank you')
  const successBody = s(
    content?.form?.successBody,
    "We've received your inquiry and will be in touch within one business day.",
  )

  return (
    <section
      id="contact"
      style={{
        background: 'var(--paper)',
        padding: 'clamp(80px, 12vh, 140px) 0',
        position: 'relative',
      }}
    >
      <div className="container-wide">
        <div
          className="contact-header"
          style={{
            marginBottom: 80,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.9fr)',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'end',
            paddingBottom: 32,
            borderBottom: '1px solid var(--line)',
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
                fontSize: 'clamp(40px, 5vw, 80px)',
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
          </div>
          <p
            className="body-lg"
            style={{
              color: 'var(--ink-2)',
              margin: 0,
              maxWidth: 460,
              lineHeight: 1.6,
            }}
          >
            {lede}
          </p>
        </div>

        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)',
            gap: 'clamp(48px, 6vw, 100px)',
          }}
        >
          <div>
            <h3
              className="display"
              style={{
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                color: 'var(--ink)',
                margin: 0,
                marginBottom: 40,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              {detailsHeading}{' '}
              <span className="display-italic" style={{ color: 'var(--teal-800)' }}>
                {detailsHeadingItalic}
              </span>
            </h3>

            <div style={{ display: 'grid', gap: 32 }}>
              {offices.map((office, idx) => (
                <div key={idx}>
                  <div style={{ ...eyebrowStyle, marginBottom: 8 }}>
                    {s(office?.label, 'Office')}
                  </div>
                  <p className="body" style={{ color: 'var(--ink)', margin: 0, marginBottom: 6 }}>
                    {s(office?.addressLine1, '')}
                    {office?.addressLine2 ? (
                      <>
                        <br />
                        {office.addressLine2}
                      </>
                    ) : null}
                  </p>
                  {office?.phone && (
                    <a
                      href={`tel:${office.phone.replace(/\s+/g, '')}`}
                      className="ulink body-sm"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {office.phone}
                    </a>
                  )}
                </div>
              ))}

              <div>
                <div style={{ ...eyebrowStyle, marginBottom: 8 }}>Email</div>
                <a
                  href={`mailto:${sharedEmail}`}
                  className="ulink body"
                  style={{ color: 'var(--ink)' }}
                >
                  {sharedEmail}
                </a>
              </div>

              <div>
                <div style={{ ...eyebrowStyle, marginBottom: 8 }}>{hoursLabel}</div>
                <p className="body" style={{ color: 'var(--ink-2)', margin: 0, whiteSpace: 'pre-line' }}>
                  {hoursBody}
                </p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div
              style={{
                background: 'var(--cream-2)',
                padding: '48px 40px',
                borderRadius: 4,
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ ...eyebrowStyle, color: 'var(--accent)', marginBottom: 16 }}>
                {successEyebrow}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 32,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                {successHeading}, {form.name || 'there'}.
              </h3>
              <p className="body" style={{ color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
                {successBody}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 28 }}>
              <div className="contact-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={update('name')} required />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={form.email}
                    onChange={update('email')}
                    required
                  />
                </div>
              </div>
              <div className="contact-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
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
                <textarea
                  rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  value={form.message}
                  onChange={update('message')}
                />
              </div>
              <p className="body-sm" style={{ marginTop: 16, color: 'var(--ink-3)', lineHeight: 1.6 }}>
                {disclaimer}
              </p>
              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '16px 32px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {submitLabel}
                  <ArrowIcon />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
