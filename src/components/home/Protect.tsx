// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "01 The Firm" section.
// 2. Glob: src/components/home/Protect.tsx returned No files found before write.
// 3. No file I/O. Pure UI.
// 4. User: "the homepage fix the links make the sections components wire it up"
//
// Link fixes vs. previous inline version:
//   - "What we do"          : "#" -> "/our-services"
//   - "Read about our cases": "#" -> "/posts"
//   - "difference"          : "#" -> "/what-sets-us-apart"

'use client'

import { Placeholder, mediaAlt, mediaUrl, s, useReveal, type ProtectContent } from './_shared'

export function Protect({ content }: { content?: ProtectContent | null }) {
  const ref1 = useReveal<HTMLDivElement>()
  const ref2 = useReveal<HTMLDivElement>()
  const ref3 = useReveal<HTMLDivElement>()

  const eyebrowNumber = s(content?.eyebrowNumber, '01')
  const eyebrowText = s(content?.eyebrowText, 'The Firm')
  const locations = s(content?.locations, 'Houston · Austin · Dallas')
  const headline = s(content?.headline, 'We Protect Everything')
  const headlineItalic = s(content?.headlineItalic, "You've Built.")
  const intro = s(
    content?.intro,
    "Legal challenges don't pause if you fail to do so. They threaten your business, partnerships, and everything you've worked to build. Our highly-experienced team handles the toughest cases.",
  )
  const link1Label = s(content?.primaryLink?.label, 'What we do')
  const link1Href = s(content?.primaryLink?.href, '/our-services')
  const link2Label = s(content?.secondaryLink?.label, 'Read about our cases')
  const link2Href = s(content?.secondaryLink?.href, '/posts')
  const badge = s(content?.badge, '19 Years of Practice')

  const subEyebrow = s(content?.subEyebrow, 'A Different Kind of Texas Law Firm')
  const subHeadline = s(content?.subHeadline, 'At Nichols Weitzner, we know big')
  const subHeadlineItalic = s(content?.subHeadlineItalic, 'law')
  const subHeadlineTail = s(content?.subHeadlineTail, " — we've managed it.")
  const subBody1 = s(
    content?.subBody1,
    'Our legal experience has been augmented by hard-earned business experience and the ability to put yourself, your team and your work first.',
  )
  const subBody2Prefix = s(
    content?.subBody2Prefix,
    "When you work with us, you'll immediately notice the ",
  )
  const subBody2LinkLabel = s(content?.subBody2LinkLabel, 'difference')
  const subBody2LinkHref = s(content?.subBody2LinkHref, '/what-sets-us-apart')
  const subBody2Suffix = s(content?.subBody2Suffix, '.')

  const image1Url = mediaUrl(content?.image1)
  const image1Alt = mediaAlt(content?.image1, 'Attorney with client')
  const image2Url = mediaUrl(content?.image2)
  const image2Alt = mediaAlt(content?.image2, 'Modern desk — laptop and documents')

  return (
    <section style={{ background: 'var(--paper)', padding: '160px 0 140px' }}>
      <div className="container-wide">
        <div ref={ref1} className="reveal" style={{ marginBottom: 100, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
          <div className="eyebrow" style={{ color: 'var(--ink-4)' }}>{locations}</div>
        </div>

        <div ref={ref2} className="reveal grid-2" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 100, alignItems: 'center', marginBottom: 140 }}>
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(44px, 5vw, 76px)', marginBottom: 32, color: 'var(--ink)' }}>
              {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span>
            </h2>
            <p className="body-lg" style={{ maxWidth: 520 }}>{intro}</p>
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <a href={link1Href} className="ulink" style={{ fontSize: 14, fontWeight: 500 }}>{link1Label}</a>
              <span style={{ width: 24, height: 1, background: 'var(--line-2)' }} />
              <a href={link2Href} className="ulink" style={{ fontSize: 14, fontWeight: 500 }}>{link2Label}</a>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            {image1Url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image1Url}
                alt={image1Alt}
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Placeholder label="Attorney with client" ratio="4/3" tone="cream" />
            )}
            <div style={{ position: 'absolute', bottom: -28, left: -28, background: 'var(--cream)', padding: '16px 22px', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-2)', border: '1px solid var(--line)' }}>
              <span style={{ color: 'var(--accent)', marginRight: 8 }}>◆</span>
              {badge}
            </div>
          </div>
        </div>

        <div ref={ref3} className="reveal grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 100, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            {image2Url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image2Url}
                alt={image2Alt}
                style={{ width: '100%', aspectRatio: '5/4', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Placeholder label="Modern desk — laptop & docs" ratio="5/4" tone="cream" />
            )}
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--teal-800)' }}>{subEyebrow}</div>
            <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 58px)', marginBottom: 28, color: 'var(--ink)', maxWidth: 640 }}>
              {subHeadline} <span className="display-italic">{subHeadlineItalic}</span>{subHeadlineTail}
            </h2>
            <p className="body-lg" style={{ maxWidth: 580, marginBottom: 20 }}>{subBody1}</p>
            <p className="body-lg" style={{ maxWidth: 580 }}>
              {subBody2Prefix}<a href={subBody2LinkHref} className="ulink" style={{ color: 'var(--teal-800)', fontWeight: 500 }}>{subBody2LinkLabel}</a>{subBody2Suffix}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
