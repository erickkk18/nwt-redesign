// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "Client Voices" rotating-quote section.
// 2. Glob: src/components/home/Testimonial.tsx returned No files found before write.
// 3. No file I/O. Static `quotes` array of 3 { text, author, role } items.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import { useState } from 'react'

import { s, useReveal, type QuoteContent, type TestimonialContent } from './_shared'

const fallbackQuotes: QuoteContent[] = [
  { text: 'Amazing law firm to take care of all of our needs! Seriously great people work here and they are very thorough.', author: 'Health Org', role: 'Healthcare Client' },
  { text: 'Their team understands the business of medicine in ways most lawyers simply do not. Pragmatic, proactive, sharp.', author: 'Provider Group', role: 'Outside General Counsel' },
  { text: "When we needed to act fast, they delivered — quickly and on budget. They've become a trusted extension of our team.", author: 'Investor', role: 'Private Equity' },
]

export function Testimonial({ content }: { content?: TestimonialContent | null }) {
  const [idx, setIdx] = useState(0)
  const ref = useReveal<HTMLDivElement>()
  const eyebrow = s(content?.eyebrow, 'Client Voices')
  const quotes = content?.quotes && content.quotes.length > 0 ? content.quotes : fallbackQuotes
  const safeIdx = Math.min(idx, quotes.length - 1)
  return (
    <section style={{ background: 'var(--cream)', padding: '140px 0 160px', borderTop: '1px solid var(--line)' }}>
      <div ref={ref} className="container-narrow reveal">
        <div className="eyebrow" style={{ marginBottom: 48, textAlign: 'center' }}>{eyebrow}</div>
        <blockquote style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3.5vw, 52px)', lineHeight: 1.2, fontWeight: 300, fontStyle: 'italic', color: 'var(--ink)', textAlign: 'center', letterSpacing: '-0.01em', marginBottom: 56, minHeight: 220 }}>
          <span style={{ color: 'var(--accent)', fontSize: '1.4em', verticalAlign: '-0.2em', marginRight: 8 }}>&ldquo;</span>
          {quotes[safeIdx].text}
          <span style={{ color: 'var(--accent)', fontSize: '1.4em', verticalAlign: '-0.2em', marginLeft: 4 }}>&rdquo;</span>
        </blockquote>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show testimonial ${i + 1}`}
              style={{ width: i === safeIdx ? 32 : 8, height: 8, borderRadius: 4, background: i === safeIdx ? 'var(--teal-800)' : 'var(--line-2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{quotes[safeIdx].author} &middot; {quotes[safeIdx].role}</span>
        </div>
      </div>
    </section>
  )
}
