// Facts:
// 1. Auto-discovered as /posts/<slug>. Linked from posts/page.tsx cards,
//    HomePage News section, and the related-articles strip on this page itself.
//    Wrapped by (frontend) layout (which mounts global Nav + Footer).
// 2. Glob: src/app/(frontend)/posts/[slug]/page.tsx returned 1 file (this one).
// 3. Reads MongoDB via Payload Local API. Posts doc shape:
//    { id, title, slug, publishedAt: ISO-8601 UTC, excerpt, content: Lexical
//      root, featuredImage: {url, alt}, categories: [{id, title}],
//      author: {id, name, email}, seo: {metaTitle, metaDescription} }.
//    Also fetches up to 3 sibling posts in the same category for the related
//    strip.
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

interface AuthorDoc {
  id: string
  name?: string | null
  email?: string | null
}

interface CategoryDoc {
  id: string
  title: string
}

interface PostDoc {
  id: string
  title: string
  slug: string
  publishedAt?: string | null
  excerpt?: string | null
  content?: unknown
  featuredImage?: MediaDoc | string | null
  categories?: Array<CategoryDoc | string> | null
  author?: AuthorDoc | string | null
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

function firstCategory(cats: PostDoc['categories'] | undefined): {
  id?: string
  title: string
} {
  if (!cats || cats.length === 0) return { title: 'News' }
  const first = cats[0]
  if (typeof first === 'string') return { id: first, title: 'News' }
  return { id: first.id, title: first.title || 'News' }
}

function authorName(a: PostDoc['author'] | undefined): string | null {
  if (!a || typeof a === 'string') return null
  return a.name ?? null
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function readingTime(content: unknown): number {
  if (!content || typeof content !== 'object') return 3
  const json = JSON.stringify(content)
  // Rough word-count from the serialised Lexical JSON, divided by 220 wpm.
  const words = (json.match(/\b\w+\b/g) ?? []).length
  const minutes = Math.max(1, Math.round(words / 220))
  return minutes
}

async function loadPost(slug: string): Promise<PostDoc | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return (res.docs[0] as unknown as PostDoc) ?? null
  } catch (err) {
    console.warn(`[/posts/${slug}] payload fetch failed:`, err)
    return null
  }
}

async function loadRelated(
  currentId: string,
  categoryId: string | undefined,
): Promise<PostDoc[]> {
  try {
    const payload = await getPayload({ config })
    const where = categoryId
      ? {
          and: [
            { categories: { in: [categoryId] } },
            { id: { not_equals: currentId } },
          ],
        }
      : { id: { not_equals: currentId } }
    const res = await payload.find({
      collection: 'posts',
      where: where as unknown as Parameters<typeof payload.find>[0]['where'],
      limit: 3,
      sort: '-publishedAt',
      depth: 1,
    })
    return res.docs as unknown as PostDoc[]
  } catch (err) {
    console.warn('[posts related] fetch failed:', err)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) return { title: 'Not found' }
  return {
    title: post.seo?.metaTitle || `${post.title} — NWT Law`,
    description: post.seo?.metaDescription || post.excerpt || undefined,
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) notFound()

  const heroUrl = mediaUrl(post.featuredImage)
  const heroAlt = mediaAlt(post.featuredImage, post.title)
  const category = firstCategory(post.categories)
  const author = authorName(post.author)
  const date = formatDate(post.publishedAt)
  const minutes = readingTime(post.content)
  const related = await loadRelated(post.id, category.id)

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <HeroTheme value="light" />

      {/* Editorial header — cream canvas, generous whitespace */}
      <section
        style={{
          padding: '140px 0 64px',
          background: 'var(--paper)',
        }}
      >
        <div
          className="container-wide"
          style={{ maxWidth: 1100, margin: '0 auto' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 48,
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/posts"
              className="eyebrow"
              style={{
                color: 'var(--ink-3)',
                textDecoration: 'none',
              }}
            >
              <span aria-hidden>←</span> News & Insights
            </a>
            <span
              aria-hidden
              style={{ color: 'var(--line-2)', userSelect: 'none' }}
            >
              /
            </span>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>
              {category.title}
            </div>
          </div>

          <h1
            className="display"
            style={{
              fontSize: 'clamp(40px, 5.6vw, 88px)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              margin: 0,
              maxWidth: 1000,
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(20px, 1.8vw, 26px)',
                lineHeight: 1.45,
                color: 'var(--teal-800)',
                marginTop: 32,
                marginBottom: 0,
                maxWidth: 760,
              }}
            >
              {post.excerpt}
            </p>
          )}

          <div
            className="body-sm"
            style={{
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              alignItems: 'center',
              color: 'var(--ink-3)',
              marginTop: 48,
              paddingTop: 24,
              borderTop: '1px solid var(--line)',
            }}
          >
            {date && (
              <span>
                <span style={{ color: 'var(--ink-3)' }}>Published</span>{' '}
                <span style={{ color: 'var(--ink-1)' }}>{date}</span>
              </span>
            )}
            {author && (
              <span>
                <span style={{ color: 'var(--ink-3)' }}>By</span>{' '}
                <span style={{ color: 'var(--ink-1)' }}>{author}</span>
              </span>
            )}
            <span style={{ color: 'var(--ink-3)' }}>{minutes} min read</span>
          </div>
        </div>
      </section>

      {/* Featured image band — full-bleed for visual impact */}
      {heroUrl && (
        <section style={{ padding: '0 32px 80px', background: 'var(--paper)' }}>
          <div
            className="container-wide"
            style={{ maxWidth: 1480, margin: '0 auto', padding: 0 }}
          >
            <div
              style={{
                aspectRatio: '16/8',
                overflow: 'hidden',
                background: 'var(--cream-2)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroUrl}
                alt={heroAlt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section style={{ padding: '0 0 120px', background: 'var(--paper)' }}>
        <div
          className="container-wide"
          style={{ maxWidth: 760, margin: '0 auto' }}
        >
          {post.content ? (
            <RichText
              data={post.content}
              style={{
                fontSize: 19,
                lineHeight: 1.75,
                color: 'var(--ink-1)',
                fontFamily: 'var(--serif)',
                fontWeight: 400,
              }}
            />
          ) : (
            <p className="body-lg" style={{ color: 'var(--ink-3)' }}>
              No content available for this article.
            </p>
          )}

          {/* Footer byline strip */}
          <div
            style={{
              marginTop: 80,
              padding: '32px 0',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div className="body-sm" style={{ color: 'var(--ink-3)' }}>
              {author ? (
                <>
                  Written by{' '}
                  <span
                    style={{
                      color: 'var(--ink-1)',
                      fontFamily: 'var(--serif)',
                      fontStyle: 'italic',
                      fontSize: 18,
                    }}
                  >
                    {author}
                  </span>
                </>
              ) : (
                <span>Nichols Weitzner Thomas LLP</span>
              )}
            </div>
            <a
              href="/posts"
              className="eyebrow"
              style={{
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              All articles →
            </a>
          </div>
        </div>
      </section>

      {/* Related articles */}
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
              <div>
                <div
                  className="eyebrow"
                  style={{ color: 'var(--accent)', marginBottom: 16 }}
                >
                  Continue reading
                </div>
                <h2
                  className="display"
                  style={{
                    fontSize: 'clamp(32px, 3.5vw, 56px)',
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}
                >
                  More from{' '}
                  <span
                    className="display-italic"
                    style={{ color: 'var(--teal-800)' }}
                  >
                    {category.title}.
                  </span>
                </h2>
              </div>
              <a href="/posts" className="ulink" style={{ fontSize: 14 }}>
                View all news →
              </a>
            </div>

            <div
              className="grid-3"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 40,
              }}
            >
              {related.map((p) => (
                <RelatedPostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBand />
    </main>
  )
}

function RelatedPostCard({ post }: { post: PostDoc }) {
  const url = mediaUrl(post.featuredImage)
  const date = formatDate(post.publishedAt)
  const cat = firstCategory(post.categories)
  return (
    <a
      href={`/posts/${post.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          aspectRatio: '3/2',
          background: 'var(--cream-2)',
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <div
        className="eyebrow"
        style={{ color: 'var(--accent)', marginBottom: 8 }}
      >
        {cat.title}
      </div>
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          margin: 0,
          marginBottom: 10,
        }}
      >
        {post.title}
      </h3>
      <div className="body-sm" style={{ color: 'var(--ink-3)' }}>
        {date}
      </div>
    </a>
  )
}
