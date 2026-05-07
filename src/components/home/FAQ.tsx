// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "08 Frequently Asked" accordion section.
// 2. Glob: src/components/home/FAQ.tsx returned No files found before write.
// 3. No file I/O. Static `faqs` array of 7 { q, a } items.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import { useState } from 'react'

import { Icon, s, useReveal, type FaqContent, type FaqItemContent } from './_shared'

const fallbackFaqs: FaqItemContent[] = [
  { question: 'What does Nichols Weitzner Thomas spell over the past five firms?', answer: "Unlike larger firms in our market, we're the operational equivalent of any one of the firms you might have heard of. Our partners managed and built the business of multinational firms before founding NWT. As a result, our team is fluent across firm operations, billing models, conflict checking, and matter management." },
  { question: 'Why should we consider outside general counsel instead of project-based legal work?', answer: 'Outside general counsel offers consistent, business-aligned legal support without the overhead of an in-house team. Your matters are handled by attorneys who already understand your business, with predictable monthly retainers.' },
  { question: "I've been burned by attorneys who didn't understand my business. How do I know you're different?", answer: "Our attorneys have run businesses, served on boards, and led divisions inside operating companies. We're not just legal advisors — we're business advisors who happen to practice law." },
  { question: 'Do you work with businesses of all sizes?', answer: 'Yes. We work with everyone from solo founders to publicly traded companies. Our model is built to scale with your stage and complexity.' },
  { question: 'What experience does your team have in healthcare law?', answer: 'Our team has decades of combined experience in healthcare regulatory work, payor-provider disputes, transactions involving healthcare companies, and compliance counseling for providers across the spectrum.' },
  { question: 'What types of healthcare compliance issues does your firm handle?', answer: 'HIPAA, Stark, anti-kickback, Medicare/Medicaid billing, state licensure, corporate practice of medicine, fee-splitting, and audit defense — to name several.' },
  { question: 'What makes a good healthcare litigation lawyer?', answer: "Deep substantive knowledge of healthcare regulation, sharp courtroom instincts, and the operational understanding to know what a win actually looks like for the client's business." },
]

export function FAQ({ content }: { content?: FaqContent | null }) {
  const [open, setOpen] = useState<number>(0)
  const ref = useReveal<HTMLDivElement>()
  const eyebrowNumber = s(content?.eyebrowNumber, '08')
  const eyebrowText = s(content?.eyebrowText, 'Frequently Asked')
  const headline = s(content?.headline, 'Frequently Asked')
  const headlineItalic = s(content?.headlineItalic, 'Questions.')
  const items = content?.items && content.items.length > 0 ? content.items : fallbackFaqs

  return (
    <section style={{ background: 'var(--cream)', padding: '160px 0 180px', borderTop: '1px solid var(--line)' }}>
      <div ref={ref} className="container-wide reveal">
        <div style={{ marginBottom: 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line-2)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
        </div>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'start' }}>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 60px)', color: 'var(--ink)', position: 'sticky', top: 120 }}>
            {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span>
          </h2>
          <div>
            {items.map((it, i) => (
              <FaqRow key={i} q={it.question} a={it.answer} isOpen={open === i} onClick={() => setOpen(open === i ? -1 : i)} isLast={i === items.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqRow({ q, a, isOpen, onClick, isLast }: { q: string; a: string; isOpen: boolean; onClick: () => void; isLast: boolean }) {
  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--line-2)' }}>
      <button
        onClick={onClick}
        style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, color: isOpen ? 'var(--teal-800)' : 'var(--ink)', letterSpacing: '-0.01em', transition: 'color 0.3s' }}
      >
        <span style={{ flex: 1 }}>{q}</span>
        <span style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s', color: 'var(--ink)' }}>
          <Icon.Plus size={14} />
        </span>
      </button>
      <div style={{ maxHeight: isOpen ? 400 : 0, opacity: isOpen ? 1 : 0, overflow: 'hidden', transition: 'all 0.45s ease' }}>
        <p className="body-lg" style={{ paddingBottom: 32, maxWidth: 720 }}>{a}</p>
      </div>
    </div>
  )
}
