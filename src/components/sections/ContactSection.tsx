// Facts:
// 1. Imported by [slug]/page.tsx for slug 'contact-us' (and similar).
// 2. Glob: src/components/sections/ContactSection.tsx returned No files found.
// 3. No I/O. Client component (form state).
// 4. User: "wire up sections on the pages and create components".

'use client'

import { useState } from 'react'
import type { CSSProperties, ChangeEvent, FormEvent } from 'react'

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

export function ContactSection() {
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

  return (
    <section
      id="contact"
      style={{ background: 'var(--paper)', padding: '120px 0' }}
    >
      <div className="container-wide">
        <div
          style={{
            marginBottom: 80,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--line)',
            paddingBottom: 24,
          }}
        >
          <div className="eyebrow">
            <span style={{ color: 'var(--accent)', marginRight: 10 }}>09</span>{' '}
            Contact
          </div>
        </div>

        <div
          className="grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 100,
          }}
        >
          <div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(36px, 4vw, 56px)',
                color: 'var(--ink)',
                marginBottom: 40,
              }}
            >
              Contact{' '}
              <span
                className="display-italic"
                style={{ color: 'var(--teal-800)' }}
              >
                Details.
              </span>
            </h2>
            <div style={{ display: 'grid', gap: 32 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Houston Office
                </div>
                <p className="body" style={{ color: 'var(--ink)', margin: 0 }}>
                  1717 West Loop South, Suite 1800
                  <br />
                  Houston, Texas 77027
                </p>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Phone
                </div>
                <p className="body" style={{ color: 'var(--ink)', margin: 0 }}>
                  +1 (713) 555-0140
                </p>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Email
                </div>
                <a
                  href="mailto:info@nwtlaw.example"
                  className="ulink body"
                  style={{ color: 'var(--ink)' }}
                >
                  info@nwtlaw.example
                </a>
              </div>
            </div>
          </div>

          {submitted ? (
            <div
              style={{
                background: 'var(--cream-2)',
                padding: '48px 40px',
                borderRadius: 4,
              }}
            >
              <div
                className="eyebrow"
                style={{ color: 'var(--accent)', marginBottom: 16 }}
              >
                Message received
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
                Thank you, {form.name || 'there'}.
              </h3>
              <p className="body" style={{ color: 'var(--ink-2)', margin: 0 }}>
                We&apos;ve received your inquiry and will be in touch within one
                business day.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 28 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 32,
                }}
              >
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={update('name')}
                    required
                  />
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
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 32,
                }}
              >
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    style={inputStyle}
                    value={form.phone}
                    onChange={update('phone')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Company / Firm</label>
                  <input
                    style={inputStyle}
                    value={form.firm}
                    onChange={update('firm')}
                  />
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
              <p className="body-sm" style={{ marginTop: 16 }}>
                Submitting this form does not create an attorney-client
                relationship. By contacting us, you acknowledge that we may not
                represent you until a formal engagement is established.
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
                  Send Message
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
