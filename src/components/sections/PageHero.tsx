// Facts:
// 1. Imported by [slug]/page.tsx, posts/page.tsx, posts/[slug]/page.tsx,
//    team/[slug]/page.tsx, services/[slug]/page.tsx. Replaces inline hero JSX.
// 2. Glob: src/components/sections/PageHero.tsx returned No files found.
// 3. No I/O. Server component.
// 4. User: "wire up sections on the pages and create components".

interface PageHeroProps {
  eyebrow?: string
  eyebrowNumber?: string
  title: string
  titleItalicSuffix?: string
  subheading?: string
  imageUrl?: string | null
  imageAlt?: string
  theme?: 'dark' | 'light'
  /** Compact hero (smaller padding + headline) for list pages. */
  compact?: boolean
}

export function PageHero({
  eyebrow,
  eyebrowNumber,
  title,
  titleItalicSuffix,
  subheading,
  imageUrl,
  imageAlt,
  theme = 'dark',
  compact = false,
}: PageHeroProps) {
  const isDark = theme === 'dark'
  const titleScale = compact
    ? 'clamp(40px, 5.5vw, 80px)'
    : 'clamp(48px, 7vw, 112px)'

  return (
    <section
      style={{
        background: isDark ? 'var(--teal-900)' : 'var(--paper)',
        color: isDark ? 'var(--cream)' : 'var(--ink)',
        padding: compact ? '160px 0 80px' : '200px 0 120px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: isDark ? 'none' : '1px solid var(--line)',
      }}
    >
      {imageUrl && isDark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt ?? title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.32,
          }}
        />
      )}

      <div className="container-wide" style={{ position: 'relative' }}>
        {(eyebrow || eyebrowNumber) && (
          <div
            className="eyebrow"
            style={{
              marginBottom: 24,
              color: isDark ? 'var(--cream)' : 'var(--ink-2)',
            }}
          >
            {eyebrowNumber && (
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>
                {eyebrowNumber}
              </span>
            )}
            {eyebrow}
          </div>
        )}

        <h1
          className="display"
          style={{
            fontSize: titleScale,
            lineHeight: 0.96,
            letterSpacing: '-0.03em',
            maxWidth: 1100,
            margin: 0,
            color: isDark ? 'var(--cream)' : 'var(--ink)',
          }}
        >
          {title}
          {titleItalicSuffix && (
            <>
              {' '}
              <span
                className="display-italic"
                style={{ color: isDark ? 'var(--accent)' : 'var(--teal-800)' }}
              >
                {titleItalicSuffix}
              </span>
            </>
          )}
        </h1>

        {subheading && (
          <p
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 22,
              fontStyle: 'italic',
              fontWeight: 300,
              maxWidth: 720,
              lineHeight: 1.4,
              marginTop: 32,
              color: isDark ? 'rgba(246,242,234,0.85)' : 'var(--ink-2)',
            }}
          >
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}
