// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (the orchestrator); rendered as
//    the first section of the homepage.
// 2. Glob: src/components/home/Hero.tsx returned No files found before this write.
// 3. No file I/O. Pure UI. Copy mirrors design-source/nwt-redesign verbatim.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import Image from 'next/image'

import { HeroTheme } from '@/components/site/HeroTheme'
import { Icon, mediaAlt, mediaUrl, s, useScrollY, type HeroContent } from './_shared'

export function Hero({ content }: { content?: HeroContent | null }) {
  const y = useScrollY()
  const parallax = Math.min(y * 0.4, 200)
  const opacity = Math.max(1 - y / 600, 0)

  const eyebrow = s(content?.eyebrow, 'Est. 2007 · Houston, Texas')
  const titleLine1 = s(content?.titleLine1, 'Healthcare. Focused.')
  const titleLine2 = s(content?.titleLine2, 'Attorneys.')
  const titleLine3Raw = content?.titleLine3?.trim() ?? ''
  const titleLine3 = titleLine3Raw.length > 0 ? titleLine3Raw : null
  const tagline = s(content?.tagline, 'A nimble law firm with a modern approach.')
  const primaryLabel = s(content?.primaryCta?.label, 'Our Approach')
  const primaryHref = s(content?.primaryCta?.href, '#approach')
  const secondaryLabel = s(content?.secondaryCta?.label, 'Get in Touch')
  const secondaryHref = s(content?.secondaryCta?.href, '#contact')
  const bgUrl = mediaUrl(content?.backgroundImage)
  const bgAlt = mediaAlt(content?.backgroundImage, titleLine1)

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 720,
        overflow: 'hidden',
        background: 'var(--teal-900)',
      }}
    >
      <HeroTheme value="dark" />
      <div
        style={{
          position: 'absolute',
          inset: '-10% 0 -10% 0',
          transform: `translateY(${parallax}px)`,
          willChange: 'transform',
        }}
      >
        {bgUrl ? (
          <Image
            src={bgUrl}
            alt={bgAlt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{ objectFit: 'cover', opacity: 0.32 }}
          />
        ) : (
          <SkylineArt />
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(180deg, rgba(10,58,71,0.55) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(10,58,71,0.55) 70%, rgba(10,58,71,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container-wide"
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: 88,
          opacity,
          transform: `translateY(${y * 0.15}px)`,
          transition: 'opacity 0.2s',
        }}
      >
        <div style={{ maxWidth: 980 }}>
          <div className="eyebrow" style={{ color: 'rgba(246,242,234,0.7)', marginBottom: 28 }}>
            <span
              style={{
                display: 'inline-block',
                width: 24,
                height: 1,
                background: 'currentColor',
                verticalAlign: 'middle',
                marginRight: 12,
              }}
            />
            {eyebrow}
          </div>
          <h1
            className="display"
            style={{
              color: 'var(--cream)',
              fontSize: 'clamp(56px, 9vw, 148px)',
              lineHeight: 0.92,
              letterSpacing: '-0.035em',
              marginBottom: 36,
            }}
          >
            {titleLine1}
            <br />
            <span className="display-italic" style={{ color: 'var(--teal-100)' }}>
              {titleLine2}
            </span>
            {titleLine3 && (
              <>
                <br />
                {titleLine3}
              </>
            )}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 48,
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 22,
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'rgba(246,242,234,0.85)',
                maxWidth: 480,
                lineHeight: 1.4,
              }}
            >
              {tagline}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={primaryHref} className="btn btn-light">
                {primaryLabel}
              </a>
              <a
                href={secondaryHref}
                className="btn"
                style={{
                  background: 'transparent',
                  color: 'var(--cream)',
                  border: '1px solid rgba(246,242,234,0.35)',
                }}
              >
                {secondaryLabel} <Icon.Arrow size={14} />
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 32,
            bottom: 88,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            color: 'var(--cream)',
            opacity: 0.7,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              writingMode: 'vertical-rl',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 56,
              background: 'linear-gradient(180deg, var(--cream) 0%, transparent 100%)',
              animation: 'scrollHint 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}

function SkylineArt() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(199,112,74,0.15) 0%, transparent 60%), linear-gradient(180deg, #0a3a47 0%, #14617a 45%, #2a8198 75%, #c7704a 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 20% at 30% 30%, rgba(246,242,234,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 15% at 70% 50%, rgba(246,242,234,0.04) 0%, transparent 60%)`,
        }}
      />
      <svg viewBox="0 0 1920 600" preserveAspectRatio="xMidYEnd slice" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%', opacity: 0.55 }}>
        <defs>
          <linearGradient id="bldg-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a3a47" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0a3a47" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path fill="url(#bldg-back)" d="M0,600 L0,400 L80,400 L80,340 L160,340 L160,380 L220,380 L220,300 L300,300 L300,360 L380,360 L380,250 L460,250 L460,320 L540,320 L540,280 L620,280 L620,200 L700,200 L700,260 L780,260 L780,310 L860,310 L860,220 L940,220 L940,180 L1020,180 L1020,260 L1100,260 L1100,310 L1180,310 L1180,240 L1260,240 L1260,290 L1340,290 L1340,200 L1420,200 L1420,260 L1500,260 L1500,330 L1580,330 L1580,280 L1660,280 L1660,360 L1740,360 L1740,310 L1820,310 L1820,380 L1920,380 L1920,600 Z" />
      </svg>
      <svg viewBox="0 0 1920 600" preserveAspectRatio="xMidYEnd slice" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }}>
        <defs>
          <linearGradient id="bldg-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#082932" stopOpacity="0.85" />
            <stop offset="1" stopColor="#051c22" stopOpacity="1" />
          </linearGradient>
          <pattern id="windows" x="0" y="0" width="14" height="22" patternUnits="userSpaceOnUse">
            <rect x="2" y="3" width="3" height="6" fill="#c7704a" fillOpacity="0.35" />
            <rect x="9" y="3" width="3" height="6" fill="#c7704a" fillOpacity="0.2" />
            <rect x="2" y="13" width="3" height="6" fill="#c7704a" fillOpacity="0.15" />
            <rect x="9" y="13" width="3" height="6" fill="#c7704a" fillOpacity="0.3" />
          </pattern>
        </defs>
        <g fill="url(#bldg-front)">
          <rect x="120" y="380" width="90" height="220" />
          <rect x="220" y="320" width="70" height="280" />
          <rect x="300" y="260" width="100" height="340" />
          <rect x="410" y="200" width="90" height="400" />
          <rect x="510" y="280" width="60" height="320" />
          <rect x="580" y="120" width="110" height="480" />
          <polygon points="700,80 720,40 760,40 780,80 780,600 700,600" />
          <rect x="800" y="160" width="100" height="440" />
          <rect x="910" y="220" width="80" height="380" />
          <rect x="1000" y="100" width="120" height="500" />
          <rect x="1130" y="240" width="70" height="360" />
          <polygon points="1210,90 1240,60 1290,60 1320,90 1320,600 1210,600" />
          <rect x="1330" y="180" width="90" height="420" />
          <rect x="1430" y="260" width="80" height="340" />
          <rect x="1520" y="200" width="110" height="400" />
          <rect x="1640" y="320" width="80" height="280" />
          <rect x="1730" y="280" width="100" height="320" />
        </g>
        <g opacity="0.6">
          <rect x="125" y="385" width="80" height="215" fill="url(#windows)" />
          <rect x="225" y="325" width="60" height="275" fill="url(#windows)" />
          <rect x="305" y="265" width="90" height="335" fill="url(#windows)" />
          <rect x="415" y="205" width="80" height="395" fill="url(#windows)" />
          <rect x="585" y="125" width="100" height="475" fill="url(#windows)" />
          <rect x="705" y="85" width="75" height="515" fill="url(#windows)" />
          <rect x="805" y="165" width="90" height="435" fill="url(#windows)" />
          <rect x="1005" y="105" width="110" height="495" fill="url(#windows)" />
          <rect x="1215" y="95" width="105" height="505" fill="url(#windows)" />
          <rect x="1335" y="185" width="80" height="415" fill="url(#windows)" />
          <rect x="1525" y="205" width="100" height="395" fill="url(#windows)" />
        </g>
        <g stroke="#051c22" strokeWidth="2" fill="none" opacity="0.9">
          <line x1="380" y1="600" x2="380" y2="80" />
          <line x1="380" y1="100" x2="240" y2="100" />
          <line x1="380" y1="100" x2="450" y2="140" />
          <line x1="380" y1="80" x2="240" y2="100" />
          <line x1="280" y1="100" x2="280" y2="180" />
        </g>
      </svg>
    </div>
  )
}
