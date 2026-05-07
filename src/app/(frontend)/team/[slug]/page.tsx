// Facts:
// 1. Auto-discovered as /team/<slug>. Linked from HomePage Attorneys + the
//    related-attorneys strip on this page itself. Wrapped by (frontend) layout.
// 2. Glob: src/app/(frontend)/team/[slug]/page.tsx returned 1 file (this one).
// 3. Reads MongoDB via Payload Local API. Team doc shape:
//    { id, name, slug, role, category, photo: {url, alt}, bio: Lexical root,
//      email, phone, address, social: [{platform, url}], order }.
//    Also fetches up to 4 other team docs with the same category for the
//    related-attorneys strip.
// 4. User: "redesign the subpages to make it look good".

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getPayload } from 'payload'
import config from '@payload-config'

import { RichText } from '@/components/RichText'
import { HeroTheme } from '@/components/site/HeroTheme'
import { ContactBand } from '@/components/sections/ContactBand'

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

interface SocialItem {
  platform?: string | null
  url?: string | null
}

interface TeamDoc {
  id: string
  name: string
  slug: string
  role?: string | null
  category?: string | null
  photo?: MediaDoc | string | null
  bio?: unknown
  email?: string | null
  phone?: string | null
  address?: string | null
  social?: SocialItem[] | null
  order?: number | null
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

async function loadMember(slug: string): Promise<TeamDoc | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'team',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return (res.docs[0] as unknown as TeamDoc) ?? null
  } catch (err) {
    console.warn(`[/team/${slug}] payload fetch failed:`, err)
    return null
  }
}

async function loadRelated(
  currentId: string,
  category: string | null | undefined,
): Promise<TeamDoc[]> {
  try {
    const payload = await getPayload({ config })
    const where = category
      ? {
          and: [
            { category: { equals: category } },
            { id: { not_equals: currentId } },
          ],
        }
      : { id: { not_equals: currentId } }
    const res = await payload.find({
      collection: 'team',
      where: where as unknown as Parameters<typeof payload.find>[0]['where'],
      limit: 4,
      sort: 'order',
      depth: 1,
    })
    return res.docs as unknown as TeamDoc[]
  } catch (err) {
    console.warn('[team related] fetch failed:', err)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const member = await loadMember(slug)
  if (!member) return { title: 'Not found' }
  return {
    title: `${member.name} — NWT Law`,
    description: member.role
      ? `${member.name}, ${member.role} at Nichols Weitzner Thomas LLP.`
      : undefined,
  }
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const member = await loadMember(slug)
  if (!member) notFound()

  const photoUrl = mediaUrl(member.photo)
  const photoAlt = mediaAlt(member.photo, member.name)
  const related = await loadRelated(member.id, member.category)

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <HeroTheme value="light" />

      {/* Breadcrumb strip */}
      <section
        style={{
          padding: '120px 0 32px',
        }}
      >
        <div
          className="container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/our-team"
            className="eyebrow"
            style={{
              color: 'var(--ink-3)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span aria-hidden>←</span> All attorneys
          </a>
          {member.category && (
            <div
              className="eyebrow"
              style={{ color: 'var(--accent)' }}
            >
              {member.category}
            </div>
          )}
        </div>
      </section>

      {/* Hero — sticky photo, info column */}
      <section style={{ paddingBottom: 120 }}>
        <div
          className="container-wide team-detail-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 7fr',
            gap: 80,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 100,
            }}
          >
            <div
              style={{
                aspectRatio: '4/5',
                background: 'var(--cream-2)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={photoAlt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </div>
          </div>

          <div>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(48px, 6.5vw, 96px)',
                lineHeight: 0.98,
                letterSpacing: '-0.025em',
                margin: 0,
                marginBottom: 16,
              }}
            >
              {member.name.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {word}
                  {i === arr.length - 2 && <br />}
                  {i !== arr.length - 1 && i !== arr.length - 2 && ' '}
                </span>
              ))}
            </h1>

            {member.role && (
              <p
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 26,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  lineHeight: 1.35,
                  color: 'var(--teal-800)',
                  marginTop: 0,
                  marginBottom: 56,
                  maxWidth: 540,
                }}
              >
                {member.role}
              </p>
            )}

            {/* Contact card */}
            <div
              style={{
                background: 'var(--cream-2)',
                padding: '32px 36px',
                marginBottom: 64,
                display: 'grid',
                gap: 20,
              }}
            >
              <div className="eyebrow" style={{ color: 'var(--accent)' }}>
                Get in touch
              </div>
              {member.email && (
                <ContactRow
                  label="Email"
                  value={member.email}
                  href={`mailto:${member.email}`}
                />
              )}
              {member.phone && (
                <ContactRow
                  label="Phone"
                  value={member.phone}
                  href={`tel:${member.phone.replace(/[^+\d]/g, '')}`}
                />
              )}
              {member.address && (
                <ContactRow label="Office" value={member.address} />
              )}
              {member.social && member.social.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: 20,
                    paddingTop: 12,
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  {member.social.map((s, i) =>
                    s.url ? (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="eyebrow"
                        style={{
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                      >
                        {s.platform || 'Link'}
                      </a>
                    ) : null,
                  )}
                </div>
              )}
            </div>

            {/* Biography */}
            {member.bio ? (
              <div>
                <div
                  className="eyebrow"
                  style={{ color: 'var(--accent)', marginBottom: 24 }}
                >
                  Biography
                </div>
                <RichText
                  data={member.bio}
                  style={{
                    fontSize: 18,
                    lineHeight: 1.75,
                    color: 'var(--ink-1)',
                  }}
                />
              </div>
            ) : (
              <p className="body-lg" style={{ color: 'var(--ink-3)' }}>
                Biography coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Related attorneys */}
      {related.length > 0 && (
        <section
          style={{
            padding: '120px 0',
            borderTop: '1px solid var(--line)',
            background: 'var(--paper)',
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
                  fontSize: 'clamp(32px, 3.5vw, 48px)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                More from{' '}
                <span
                  className="display-italic"
                  style={{ color: 'var(--teal-800)' }}
                >
                  the team.
                </span>
              </h2>
              <a
                href="/our-team"
                className="ulink"
                style={{ fontSize: 14 }}
              >
                View full team →
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
              {related.map((m) => (
                <RelatedAttorneyCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBand />
    </main>
  )
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <>
      <span
        className="eyebrow"
        style={{
          color: 'var(--ink-3)',
          minWidth: 60,
          fontSize: 11,
        }}
      >
        {label}
      </span>
      <span style={{ color: 'var(--ink-1)' }}>{value}</span>
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: 'inherit',
          textDecoration: 'none',
          fontSize: 15,
          lineHeight: 1.4,
        }}
      >
        {inner}
      </a>
    )
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        fontSize: 15,
        lineHeight: 1.4,
      }}
    >
      {inner}
    </div>
  )
}

function RelatedAttorneyCard({ member }: { member: TeamDoc }) {
  const url = mediaUrl(member.photo)
  return (
    <a
      href={`/team/${member.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          aspectRatio: '4/5',
          background: 'var(--cream-2)',
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={member.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 20,
          fontWeight: 400,
          lineHeight: 1.2,
          margin: 0,
          marginBottom: 4,
        }}
      >
        {member.name}
      </h3>
      {member.role && (
        <div
          className="body-sm"
          style={{
            color: 'var(--ink-3)',
            fontStyle: 'italic',
            fontFamily: 'var(--serif)',
          }}
        >
          {member.role}
        </div>
      )}
    </a>
  )
}
