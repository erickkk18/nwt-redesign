// Facts:
// 1. Called by src/app/(frontend)/[slug]/page.tsx (Pages route) and any future
//    detail page that embeds blocks. The route passes the Pages.layout array
//    via <BlockRenderer blocks={page.layout} />.
// 2. Glob: src/components/blocks/** returned No files found before this write.
// 3. No file I/O. Receives block payloads keyed by `blockType`; example:
//    [{ blockType: 'hero', heading: 'Hello', image: { url, alt } },
//     { blockType: 'content', columns: 'single', body: { root: {...} } }]
// 4. User: "proceed" — Phase 4 routing.

import type { CSSProperties } from 'react'

import { RichText } from '../RichText'

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

interface MediaDoc {
  id?: string
  url?: string | null
  alt?: string | null
  filename?: string | null
}

interface TeamDoc {
  id: string
  name: string
  slug: string
  role?: string | null
  photo?: MediaDoc | string | null
}

interface ServiceDoc {
  id: string
  title: string
  slug: string
  summary?: string | null
  featuredImage?: MediaDoc | string | null
}

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

function mediaAlt(m: MediaDoc | string | null | undefined, fallback: string) {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

// ---------------------------------------------------------------------------
// Block payload shapes (mirror src/blocks/*.ts)
// ---------------------------------------------------------------------------

interface HeroPayload {
  blockType: 'hero'
  variant?: 'centered' | 'split' | 'fullBleed'
  heading: string
  subheading?: string | null
  image?: MediaDoc | string | null
  cta?: { label?: string | null; href?: string | null } | null
}

interface ContentPayload {
  blockType: 'content'
  columns?: 'single' | 'two'
  body: unknown
}

interface ImagePayload {
  blockType: 'image'
  image: MediaDoc | string
  caption?: string | null
  size?: 'narrow' | 'wide' | 'fullBleed'
}

interface TwoColumnPayload {
  blockType: 'twoColumn'
  imagePosition?: 'left' | 'right'
  image?: MediaDoc | string | null
  heading?: string | null
  body?: unknown
  cta?: { label?: string | null; href?: string | null } | null
}

interface CtaPayload {
  blockType: 'cta'
  heading: string
  body?: string | null
  background?: 'surface' | 'brand' | 'dark'
  buttons?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'ghost'
  }[]
}

interface TeamBlockPayload {
  blockType: 'team'
  heading?: string | null
  subheading?: string | null
  members?: Array<TeamDoc | string> | null
}

interface ServicesBlockPayload {
  blockType: 'services'
  heading?: string | null
  layout?: 'grid' | 'bento' | 'carousel'
  items?: Array<ServiceDoc | string> | null
}

interface GalleryPayload {
  blockType: 'gallery'
  heading?: string | null
  layout?: 'grid' | 'masonry' | 'carousel'
  images?: { image: MediaDoc | string; caption?: string | null }[]
}

interface FormPayload {
  blockType: 'form'
  heading?: string | null
  body?: string | null
  wpFormId?: number | null
  formSlug?: string | null
}

export type BlockPayload =
  | HeroPayload
  | ContentPayload
  | ImagePayload
  | TwoColumnPayload
  | CtaPayload
  | TeamBlockPayload
  | ServicesBlockPayload
  | GalleryPayload
  | FormPayload

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  children,
  background = 'paper',
}: {
  children: React.ReactNode
  background?: 'paper' | 'cream' | 'ink' | 'teal-800' | 'teal-900'
}) {
  const isDark =
    background === 'ink' || background === 'teal-800' || background === 'teal-900'
  const style: CSSProperties = {
    background:
      background === 'cream'
        ? 'var(--cream)'
        : background === 'ink'
          ? 'var(--ink)'
          : background === 'teal-800'
            ? 'var(--teal-800)'
            : background === 'teal-900'
              ? 'var(--teal-900)'
              : 'var(--paper)',
    color: isDark ? 'var(--cream)' : 'var(--ink)',
    padding: '120px 0',
  }
  return (
    <section style={style}>
      <div className="container-wide">{children}</div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Block views
// ---------------------------------------------------------------------------

function HeroBlockView({ heading, subheading, image, cta, variant = 'centered' }: HeroPayload) {
  const url = mediaUrl(image)
  const alt = mediaAlt(image, heading)
  const isFull = variant === 'fullBleed'
  const isSplit = variant === 'split'

  return (
    <Section background={isFull ? 'teal-900' : 'paper'}>
      <div
        className={isSplit ? 'grid-2' : ''}
        style={
          isSplit
            ? { display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'center' }
            : { textAlign: isFull ? 'center' : 'left', maxWidth: 980 }
        }
      >
        <div>
          <h1
            className="display"
            style={{
              fontSize: 'clamp(48px, 7vw, 112px)',
              lineHeight: 0.96,
              letterSpacing: '-0.03em',
              marginBottom: 24,
            }}
          >
            {heading}
          </h1>
          {subheading && (
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 22,
                fontStyle: 'italic',
                fontWeight: 300,
                maxWidth: 580,
                lineHeight: 1.4,
              }}
            >
              {subheading}
            </p>
          )}
          {cta?.href && cta.label && (
            <div style={{ marginTop: 32 }}>
              <a href={cta.href} className="btn btn-primary">
                {cta.label}
              </a>
            </div>
          )}
        </div>
        {url && isSplit && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt} style={{ width: '100%', borderRadius: 4 }} />
        )}
      </div>
    </Section>
  )
}

function ContentBlockView({ columns = 'single', body }: ContentPayload) {
  return (
    <Section background="paper">
      <div
        style={
          columns === 'two'
            ? { columnCount: 2, columnGap: 64, maxWidth: 1100, margin: '0 auto' }
            : { maxWidth: 760, margin: '0 auto' }
        }
      >
        <RichText data={body} />
      </div>
    </Section>
  )
}

function ImageBlockView({ image, caption, size = 'wide' }: ImagePayload) {
  const url = mediaUrl(image)
  if (!url) return null
  const maxWidth = size === 'narrow' ? 760 : size === 'wide' ? 1180 : '100%'
  return (
    <Section background="paper">
      <figure style={{ maxWidth, margin: '0 auto' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={mediaAlt(image, caption ?? 'image')}
          style={{ width: '100%', display: 'block' }}
        />
        {caption && (
          <figcaption
            className="body-sm"
            style={{ marginTop: 12, textAlign: 'center' }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </Section>
  )
}

function TwoColumnBlockView({
  imagePosition = 'left',
  image,
  heading,
  body,
  cta,
}: TwoColumnPayload) {
  const url = mediaUrl(image)
  const imageEl = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={mediaAlt(image, heading ?? '')}
      style={{ width: '100%', display: 'block' }}
    />
  ) : null

  return (
    <Section background="paper">
      <div
        className="grid-2"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        {imagePosition === 'left' && imageEl}
        <div>
          {heading && (
            <h2
              className="display"
              style={{
                fontSize: 'clamp(36px, 4vw, 56px)',
                marginBottom: 24,
              }}
            >
              {heading}
            </h2>
          )}
          {body != null && <RichText data={body} className="body-lg" />}
          {cta?.href && cta.label && (
            <div style={{ marginTop: 24 }}>
              <a href={cta.href} className="btn btn-primary">
                {cta.label}
              </a>
            </div>
          )}
        </div>
        {imagePosition === 'right' && imageEl}
      </div>
    </Section>
  )
}

function CtaBlockView({
  heading,
  body,
  background = 'surface',
  buttons = [],
}: CtaPayload) {
  const bg =
    background === 'brand' ? 'teal-800' : background === 'dark' ? 'ink' : 'cream'
  return (
    <Section background={bg as 'cream' | 'ink' | 'teal-800'}>
      <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
        <h2
          className="display"
          style={{ fontSize: 'clamp(36px, 4vw, 60px)', marginBottom: body ? 16 : 32 }}
        >
          {heading}
        </h2>
        {body && (
          <p className="body-lg" style={{ maxWidth: 640, margin: '0 auto 32px' }}>
            {body}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {buttons.map((b, i) => {
            const klass =
              b.variant === 'secondary'
                ? 'btn btn-ghost'
                : b.variant === 'ghost'
                  ? 'btn btn-light'
                  : 'btn btn-primary'
            return (
              <a key={i} href={b.href} className={klass}>
                {b.label}
              </a>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function TeamBlockView({ heading, subheading, members }: TeamBlockPayload) {
  const list = (members ?? []).filter((m): m is TeamDoc => typeof m !== 'string')
  return (
    <Section background="paper">
      {heading && (
        <h2
          className="display"
          style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 16 }}
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="body-lg" style={{ maxWidth: 640, marginBottom: 64 }}>
          {subheading}
        </p>
      )}
      <div
        className="grid-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          marginTop: 40,
        }}
      >
        {list.map((m) => {
          const url = mediaUrl(m.photo)
          return (
            <a
              key={m.id}
              href={`/team/${m.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
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
                    alt={mediaAlt(m.photo, m.name)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 22,
                  fontWeight: 400,
                  marginBottom: 4,
                }}
              >
                {m.name}
              </h3>
              {m.role && (
                <div className="eyebrow" style={{ color: 'var(--ink-3)' }}>
                  {m.role}
                </div>
              )}
            </a>
          )
        })}
      </div>
    </Section>
  )
}

function ServicesBlockView({ heading, items }: ServicesBlockPayload) {
  const list = (items ?? []).filter(
    (s): s is ServiceDoc => typeof s !== 'string',
  )
  return (
    <Section background="cream">
      {heading && (
        <h2
          className="display"
          style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 48 }}
        >
          {heading}
        </h2>
      )}
      <div
        className="grid-3"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
        }}
      >
        {list.map((s) => {
          const url = mediaUrl(s.featuredImage)
          return (
            <a
              key={s.id}
              href={`/services/${s.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={mediaAlt(s.featuredImage, s.title)}
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    marginBottom: 16,
                  }}
                />
              )}
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 24,
                  fontWeight: 400,
                  marginBottom: 8,
                }}
              >
                {s.title}
              </h3>
              {s.summary && (
                <p className="body" style={{ maxWidth: 360 }}>
                  {s.summary}
                </p>
              )}
            </a>
          )
        })}
      </div>
    </Section>
  )
}

function GalleryBlockView({ heading, images = [] }: GalleryPayload) {
  return (
    <Section background="paper">
      {heading && (
        <h2
          className="display"
          style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', marginBottom: 40 }}
        >
          {heading}
        </h2>
      )}
      <div
        className="grid-3"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {images.map((g, i) => {
          const url = mediaUrl(g.image)
          if (!url) return null
          return (
            <figure key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={mediaAlt(g.image, g.caption ?? '')}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {g.caption && (
                <figcaption className="body-sm" style={{ marginTop: 8 }}>
                  {g.caption}
                </figcaption>
              )}
            </figure>
          )
        })}
      </div>
    </Section>
  )
}

function FormBlockView({ heading, body, formSlug }: FormPayload) {
  return (
    <Section background="cream">
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        {heading && (
          <h2
            className="display"
            style={{ fontSize: 'clamp(28px, 3vw, 44px)', marginBottom: 16 }}
          >
            {heading}
          </h2>
        )}
        {body && (
          <p className="body-lg" style={{ marginBottom: 32 }}>
            {body}
          </p>
        )}
        <p className="body-sm" style={{ color: 'var(--ink-3)' }}>
          {/* TODO: render real form once a Forms collection or rebuilt form
              component exists. */}
          Form&nbsp;
          {formSlug ? <code>{formSlug}</code> : 'placeholder'}
          &nbsp;— please reach us via the contact form on the homepage.
        </p>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// BlockRenderer
// ---------------------------------------------------------------------------

export function BlockRenderer({
  blocks,
}: {
  blocks: BlockPayload[] | null | undefined
}) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlockView key={i} {...block} />
          case 'content':
            return <ContentBlockView key={i} {...block} />
          case 'image':
            return <ImageBlockView key={i} {...block} />
          case 'twoColumn':
            return <TwoColumnBlockView key={i} {...block} />
          case 'cta':
            return <CtaBlockView key={i} {...block} />
          case 'team':
            return <TeamBlockView key={i} {...block} />
          case 'services':
            return <ServicesBlockView key={i} {...block} />
          case 'gallery':
            return <GalleryBlockView key={i} {...block} />
          case 'form':
            return <FormBlockView key={i} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
