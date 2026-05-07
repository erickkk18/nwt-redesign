// Facts:
// 1. Auto-discovered as /services/<slug>. Linked from HomePage Practices,
//    /our-services grid, and the related-practices strip on this page itself.
//    Wrapped by (frontend) layout (global Nav + Footer).
// 2. Glob: src/app/(frontend)/services/[slug]/page.tsx returned 1 file (this).
// 3. Reads MongoDB via Payload Local API. Services doc shape:
//    { id, title, slug, publishedAt: ISO-8601 UTC, summary,
//      featuredImage: {url, alt}, icon, content: Lexical root,
//      highlights: [{label, description}], cta: {label, href}, order, seo }.
//    Also fetches up to 4 sibling services for the related strip.
// 4. User: "proceed" — apply editorial design polish to subpages.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getPayload } from 'payload'
import config from '@payload-config'

import { RichText } from '@/components/RichText'
import { ContactBand } from '@/components/sections/ContactBand'
import { HeroTheme } from '@/components/site/HeroTheme'

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

interface HighlightItem {
  label?: string | null
  description?: string | null
}

interface ServiceDoc {
  id: string
  title: string
  slug: string
  publishedAt?: string | null
  summary?: string | null
  featuredImage?: MediaDoc | string | null
  icon?: string | null
  content?: unknown
  highlights?: HighlightItem[] | null
  cta?: {
    label?: string | null
    href?: string | null
  } | null
  order?: number | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
}

export const dynamic = 'force-dynamic'

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

function mediaAlt(
  m: MediaDoc | string | null | undefined,
  fallback: string,
): string {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

async function loadService(slug: string): Promise<ServiceDoc | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return (res.docs[0] as unknown as ServiceDoc) ?? null
  } catch (err) {
    console.warn(`[/services/${slug}] payload fetch failed:`, err)
    return null
  }
}

async function loadRelated(currentId: string): Promise<ServiceDoc[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      where: { id: { not_equals: currentId } },
      limit: 4,
      sort: 'order',
      depth: 1,
    })
    return res.docs as unknown as ServiceDoc[]
  } catch (err) {
    console.warn('[services related] fetch failed:', err)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await loadService(slug)
  if (!service) return { title: 'Not found' }
  return {
    title: service.seo?.metaTitle || `${service.title} — NWT Law`,
    description: service.seo?.metaDescription || service.summary || undefined,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await loadService(slug)
  if (!service) notFound()

  const heroUrl = mediaUrl(service.featuredImage)
  const heroAlt = mediaAlt(service.featuredImage, service.title)
  const orderLabel =
    typeof service.order === 'number'
      ? String(service.order).padStart(2, '0')
      : '01'

  const related = await loadRelated(service.id)

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <HeroTheme value="dark" />
      {/* Editorial dark hero */}
      <section
        style={{
          background: 'var(--teal-900)',
          color: 'var(--cream)',
          padding: '180px 0 120px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {heroUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroUrl}
            alt={heroAlt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.22,
            }}
          />
        )}
        <div className="container-wide" style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 40,
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/our-services"
              className="eyebrow"
              style={{
                color: 'rgba(246,242,234,0.65)',
                textDecoration: 'none',
              }}
            >
              <span aria-hidden>←</span> Practice Areas
            </a>
            <span
              aria-hidden
              style={{
                color: 'rgba(246,242,234,0.3)',
                userSelect: 'none',
              }}
            >
              /
            </span>
            <div className="eyebrow">
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>
                {orderLabel}
              </span>{' '}
              {service.title}
            </div>
          </div>

          <h1
            className="display"
            style={{
              fontSize: 'clamp(48px, 7vw, 120px)',
              lineHeight: 0.94,
              letterSpacing: '-0.03em',
              maxWidth: 1200,
              margin: 0,
              color: 'var(--cream)',
            }}
          >
            {service.title}
          </h1>

          {service.summary && (
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(20px, 1.8vw, 28px)',
                fontStyle: 'italic',
                fontWeight: 300,
                maxWidth: 760,
                lineHeight: 1.4,
                marginTop: 40,
                color: 'rgba(246,242,234,0.85)',
              }}
            >
              {service.summary}
            </p>
          )}
        </div>
      </section>

      {/* Highlights — editorial 3-up grid (replaces sticky aside) */}
      {service.highlights && service.highlights.length > 0 && (
        <section
          style={{
            padding: '120px 0 80px',
            background: 'var(--paper)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div className="container-wide">
            <div
              className="eyebrow"
              style={{ color: 'var(--accent)', marginBottom: 16 }}
            >
              How we help
            </div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(32px, 3.5vw, 56px)',
                letterSpacing: '-0.02em',
                margin: 0,
                marginBottom: 64,
                maxWidth: 800,
              }}
            >
              What this practice{' '}
              <span
                className="display-italic"
                style={{ color: 'var(--teal-800)' }}
              >
                covers.
              </span>
            </h2>

            <div
              className="grid-3"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 48,
              }}
            >
              {service.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    paddingTop: 32,
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <div
                    className="eyebrow"
                    style={{ color: 'var(--accent)', marginBottom: 16 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {h.label && (
                    <h3
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: 24,
                        lineHeight: 1.25,
                        fontWeight: 400,
                        margin: 0,
                        marginBottom: 12,
                      }}
                    >
                      {h.label}
                    </h3>
                  )}
                  {h.description && (
                    <p
                      className="body-sm"
                      style={{
                        color: 'var(--ink-2)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {h.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div
          className="container-wide"
          style={{ maxWidth: 760, margin: '0 auto' }}
        >
          {service.content ? (
            <RichText
              data={service.content}
              style={{
                fontSize: 19,
                lineHeight: 1.75,
                color: 'var(--ink-1)',
                fontFamily: 'var(--serif)',
              }}
            />
          ) : (
            <p
              className="body-lg"
              style={{ color: 'var(--ink-3)', textAlign: 'center' }}
            >
              Detailed information for this practice area is being prepared.
              Contact the firm directly for tailored counsel.
            </p>
          )}

          {/* Inline CTA */}
          {service.cta?.href && service.cta.label && (
            <div
              style={{
                marginTop: 64,
                padding: '40px 0',
                borderTop: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 22,
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                Ready to talk about your matter?
              </p>
              <a
                href={service.cta.href}
                className="btn btn-primary"
                style={{ padding: '16px 28px' }}
              >
                {service.cta.label}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Related practices */}
      {related.length > 0 && (
        <section
          style={{
            padding: '120px 0',
            background: 'var(--cream)',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div className="container-wide">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 56,
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <h2
                className="display"
                style={{
                  fontSize: 'clamp(32px, 3.5vw, 56px)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Other{' '}
                <span
                  className="display-italic"
                  style={{ color: 'var(--teal-800)' }}
                >
                  practice areas.
                </span>
              </h2>
              <a
                href="/our-services"
                className="ulink"
                style={{ fontSize: 14 }}
              >
                View all practices →
              </a>
            </div>

            <div
              className="grid-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 32,
              }}
            >
              {related.map((s, i) => (
                <RelatedPracticeCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBand />
    </main>
  )
}

function RelatedPracticeCard({
  service,
  index,
}: {
  service: ServiceDoc
  index: number
}) {
  return (
    <a
      href={`/services/${service.slug}`}
      style={{
        display: 'block',
        padding: '32px 0',
        borderTop: '1px solid var(--line)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        className="eyebrow"
        style={{ color: 'var(--accent)', marginBottom: 16 }}
      >
        {String((service.order ?? index + 1)).padStart(2, '0')}
      </div>
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          margin: 0,
          marginBottom: 12,
        }}
      >
        {service.title}
      </h3>
      {service.summary && (
        <p
          className="body-sm"
          style={{
            color: 'var(--ink-3)',
            margin: 0,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.summary}
        </p>
      )}
    </a>
  )
}
