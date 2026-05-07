// Facts:
// 1. Imported by [slug]/page.tsx for pages with rich-text body content
//    (Privacy Policy, default fallback).
// 2. Glob: src/components/sections/RichTextSection.tsx returned No files found.
// 3. No I/O. Wraps @/components/RichText to render Lexical JSON.
// 4. User: "wire up sections on the pages and create components".

import { RichText } from '@/components/RichText'

interface RichTextSectionProps {
  data: unknown
  eyebrow?: string
  eyebrowNumber?: string
  heading?: string
  italicSuffix?: string
  /** Reading-width column for body content. */
  narrow?: boolean
}

export function RichTextSection({
  data,
  eyebrow,
  eyebrowNumber,
  heading,
  italicSuffix,
  narrow = true,
}: RichTextSectionProps) {
  if (!data) return null

  return (
    <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
      <div
        className="container-wide"
        style={narrow ? { maxWidth: 800, margin: '0 auto' } : undefined}
      >
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 56 }}>
            {(eyebrow || eyebrowNumber) && (
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {eyebrowNumber && (
                  <span style={{ color: 'var(--accent)', marginRight: 10 }}>
                    {eyebrowNumber}
                  </span>
                )}
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(36px, 4vw, 64px)',
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {heading}
                {italicSuffix && (
                  <>
                    {' '}
                    <span
                      className="display-italic"
                      style={{ color: 'var(--teal-800)' }}
                    >
                      {italicSuffix}
                    </span>
                  </>
                )}
              </h2>
            )}
          </div>
        )}

        <RichText
          data={data}
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: 'var(--ink-1)',
          }}
        />
      </div>
    </section>
  )
}
