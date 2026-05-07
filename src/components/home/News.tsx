// Facts:
// 1. Imported by src/app/(frontend)/HomePage.tsx (orchestrator). Renders the
//    "07 News & Insights" preview section. Receives `posts` prop.
// 2. Glob: src/components/home/News.tsx returned No files found before write.
// 3. No file I/O. Reads in-memory `posts` prop. NewsPost:
//    { id, title, slug, publishedAt: ISO-8601 UTC, excerpt, featuredImage, categories }.
//    This section uses id/title/slug/featuredImage/categories only.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import Image from 'next/image'
import { useState } from 'react'

import {
  Icon,
  Placeholder,
  firstCategoryTitle,
  mediaAlt,
  mediaUrl,
  s,
  useReveal,
  type NewsPost,
  type NewsSectionContent,
} from './_shared'

interface NewsView {
  key: string
  cat: string
  title: string
  href: string
  imageUrl?: string | null
  imageAlt?: string
}

const fallbackNews: NewsView[] = [
  { key: 'n0', cat: 'OIG Releases', title: 'OIG Releases First-Ever Medicare Advantage Compliance Program Guidance Since 1999', href: '/posts' },
  { key: 'n1', cat: 'Compliance', title: 'New Medicare Prior Authorization Requirements in Pain Management: What Texas ASCs Must Know in 2026', href: '/posts' },
  { key: 'n2', cat: 'Awards', title: 'Nichols Weitzner Thomas LLP Partners Lead Presentation on Private Equity in Healthcare for HBA Health Law Section', href: '/posts' },
]

function postsToView(posts?: NewsPost[]): NewsView[] {
  if (!posts || posts.length === 0) return fallbackNews
  return posts.slice(0, 3).map((p) => ({
    key: p.id,
    cat: firstCategoryTitle(p.categories),
    title: p.title,
    href: `/posts/${p.slug}`,
    imageUrl: mediaUrl(p.featuredImage),
    imageAlt: mediaAlt(p.featuredImage, p.title),
  }))
}

export function News({ posts, content }: { posts?: NewsPost[]; content?: NewsSectionContent | null }) {
  const ref = useReveal<HTMLDivElement>()
  const items = postsToView(posts)
  const eyebrowNumber = s(content?.eyebrowNumber, '07')
  const eyebrowText = s(content?.eyebrowText, 'News & Insights')
  const headline = s(content?.headline, 'In')
  const headlineItalic = s(content?.headlineItalic, 'The News.')
  const viewAllLabel = s(content?.viewAll?.label, 'View all →')
  const viewAllHref = s(content?.viewAll?.href, '/posts')
  return (
    <section style={{ background: 'var(--paper)', padding: '160px 0 140px' }}>
      <div ref={ref} className="container-wide reveal">
        <div style={{ marginBottom: 64, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 24 }}>
          <div className="eyebrow"><span style={{ color: 'var(--accent)', marginRight: 10 }}>{eyebrowNumber}</span> {eyebrowText}</div>
          <a href={viewAllHref} className="ulink" style={{ fontSize: 13 }}>{viewAllLabel}</a>
        </div>
        <h2 className="display" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', marginBottom: 80, color: 'var(--ink)', maxWidth: 800 }}>
          {headline} <span className="display-italic" style={{ color: 'var(--teal-800)' }}>{headlineItalic}</span>
        </h2>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {items.map((item) => {
            const { key, ...rest } = item
            return <NewsCard key={key} {...rest} />
          })}
        </div>
      </div>
    </section>
  )
}

function NewsCard({ cat, title, href, imageUrl, imageAlt }: Omit<NewsView, 'key'>) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div style={{ overflow: 'hidden', marginBottom: 24 }}>
        {imageUrl ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/2',
              transition: 'transform 0.7s cubic-bezier(.2,.7,.2,1)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <Placeholder label={cat} ratio="3/2" tone="cream" style={{ transition: 'transform 0.7s cubic-bezier(.2,.7,.2,1)', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        )}
      </div>
      <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--accent)' }}>{cat}</div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, lineHeight: 1.25, color: hovered ? 'var(--teal-800)' : 'var(--ink)', letterSpacing: '-0.01em', transition: 'color 0.3s' }}>{title}</h3>
      <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-3)', transform: hovered ? 'translateX(6px)' : 'none', transition: 'transform 0.3s' }}>
        Read article <Icon.Arrow size={13} />
      </div>
    </a>
  )
}
