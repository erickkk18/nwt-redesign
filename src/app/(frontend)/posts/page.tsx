// Facts:
// 1. Auto-discovered by Next.js as "/posts". Wrapped by (frontend) layout.
//    Linked from Nav, Footer, HomePage News section, and posts/[slug] related
//    strips.
// 2. Glob: src/app/(frontend)/posts/page.tsx returned 1 file (this one).
// 3. Reads MongoDB via Payload Local API. Posts shape:
//    { id, title, slug, publishedAt: ISO-8601 UTC, excerpt,
//      featuredImage: {url, alt}, categories: [{id, title}] }.
// 4. User: "proceed" — apply editorial design polish to subpages.

import type { Metadata } from 'next'

import { getPayload } from 'payload'
import config from '@payload-config'

import { ContactBand } from '@/components/sections/ContactBand'

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

interface PostListDoc {
  id: string
  title: string
  slug: string
  publishedAt?: string | null
  excerpt?: string | null
  featuredImage?: MediaDoc | string | null
  categories?: Array<{ id: string; title: string } | string> | null
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'News & Insights — NWT Law',
  description:
    'Healthcare law updates, regulatory commentary, and firm news from Nichols Weitzner Thomas LLP.',
}

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

function firstCategoryTitle(
  cats: PostListDoc['categories'] | undefined,
): string {
  if (!cats || cats.length === 0) return 'News'
  const first = cats[0]
  if (typeof first === 'string') return 'News'
  return first.title || 'News'
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

export default async function PostsListPage() {
  let posts: PostListDoc[] = []
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'posts',
      limit: 50,
      sort: '-publishedAt',
      depth: 1,
    })
    posts = res.docs as unknown as PostListDoc[]
  } catch (err) {
    console.warn('[/posts] payload fetch failed:', err)
  }

  const [featured, ...rest] = posts

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      {/* Editorial dark hero */}
      <section
        style={{
          background: 'var(--teal-900)',
          color: 'var(--cream)',
          padding: '180px 0 100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-wide">
          <div
            className="eyebrow"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginBottom: 32,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>07</span>
            <span style={{ color: 'rgba(246,242,234,0.7)' }}>
              News &amp; Insights
            </span>
            {posts.length > 0 && (
              <span style={{ color: 'rgba(246,242,234,0.4)' }}>
                · {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </span>
            )}
          </div>

          <h1
            className="display"
            style={{
              fontSize: 'clamp(48px, 7.5vw, 128px)',
              lineHeight: 0.94,
              letterSpacing: '-0.03em',
              maxWidth: 1200,
              margin: 0,
              color: 'var(--cream)',
            }}
          >
            In{' '}
            <span
              className="display-italic"
              style={{ color: 'var(--accent)' }}
            >
              The News.
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              fontSize: 22,
              fontWeight: 300,
              maxWidth: 600,
              lineHeight: 1.45,
              marginTop: 32,
              color: 'rgba(246,242,234,0.78)',
            }}
          >
            Regulatory commentary, healthcare law updates, and firm news from
            our team in Houston.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section style={{ padding: '120px 0 160px' }}>
          <div className="container-wide">
            <p className="body-lg" style={{ maxWidth: 640 }}>
              No articles yet. Run the migration script (<code>pnpm migrate</code>)
              to import content from the WordPress export.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured (latest) — full-bleed asymmetric card */}
          {featured && (
            <section
              style={{
                padding: '100px 0 80px',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div className="container-wide">
                <FeaturedCard post={featured} />
              </div>
            </section>
          )}

          {/* Secondary grid */}
          {rest.length > 0 && (
            <section style={{ padding: '80px 0 160px' }}>
              <div className="container-wide">
                <div
                  className="eyebrow"
                  style={{ color: 'var(--accent)', marginBottom: 48 }}
                >
                  More articles
                </div>

                <div
                  className="grid-3"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 48,
                  }}
                >
                  {rest.map((p) => (
                    <ArticleCard key={p.id} post={p} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <ContactBand />
    </main>
  )
}

function FeaturedCard({ post }: { post: PostListDoc }) {
  const url = mediaUrl(post.featuredImage)
  const date = formatDate(post.publishedAt)
  const cat = firstCategoryTitle(post.categories)
  return (
    <a
      href={`/posts/${post.slug}`}
      className="grid-2"
      style={{
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        gap: 80,
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          aspectRatio: '4/3',
          background: 'var(--cream-2)',
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

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <span
            className="eyebrow"
            style={{
              color: 'var(--cream)',
              background: 'var(--teal-800)',
              padding: '6px 12px',
              borderRadius: 999,
            }}
          >
            Latest
          </span>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>
            {cat}
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(28px, 3vw, 48px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: 24,
          }}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p
            className="body-lg"
            style={{
              color: 'var(--ink-2)',
              margin: 0,
              marginBottom: 28,
              maxWidth: 480,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            color: 'var(--ink-3)',
            fontSize: 14,
          }}
        >
          {date && <span>{date}</span>}
          <span style={{ color: 'var(--accent)' }}>Read article →</span>
        </div>
      </div>
    </a>
  )
}

function ArticleCard({ post }: { post: PostListDoc }) {
  const url = mediaUrl(post.featuredImage)
  const date = formatDate(post.publishedAt)
  const cat = firstCategoryTitle(post.categories)
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
        {cat}
      </div>
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          margin: 0,
          marginBottom: 12,
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
