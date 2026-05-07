// Facts:
// 1. Imported by 12 sibling files at src/components/home/* (Hero, Protect,
//    Industries, Approach, Practices, Stats, Attorneys, Testimonial, News,
//    FAQ, Awards, Contact). Types re-exported by src/app/(frontend)/HomePage.tsx
//    for page.tsx:16 (`import type { NewsPost, Service, TeamMember }`).
// 2. Glob: src/components/home/** returned No files found before this write.
// 3. No file I/O. Pure module: types, hooks, Icon SVG map, Placeholder.
//    Types describe Payload Local API JSON shapes (see PayloadMedia / TeamMember
//    / NewsPost / Service / HomePageProps). Date fields are ISO-8601 UTC strings.
// 4. User: "the homepage fix the links make the sections components wire it up"

'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

// ---------------------------------------------------------------------------
// Payload-shaped types (subset — kept narrow so this file doesn't depend on
// payload-types.ts). page.tsx fetches via Local API and passes plain JSON.
// ---------------------------------------------------------------------------

export interface PayloadMedia {
  id: string
  url?: string | null
  alt?: string | null
  filename?: string | null
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  role?: string | null
  category?: string | null
  photo?: PayloadMedia | string | null
  email?: string | null
  phone?: string | null
}

export interface NewsPost {
  id: string
  title: string
  slug: string
  publishedAt?: string | null
  excerpt?: string | null
  featuredImage?: PayloadMedia | string | null
  categories?: Array<{ id: string; title: string } | string> | null
}

export interface Service {
  id: string
  title: string
  slug: string
  summary?: string | null
  featuredImage?: PayloadMedia | string | null
}

export interface HomePageProps {
  team?: TeamMember[]
  posts?: NewsPost[]
  services?: Service[]
  content?: HomePageContent | null
}

// ---------------------------------------------------------------------------
// HomePage global content shape — mirrors src/globals/HomePage.ts. All fields
// are optional so each section can fall back to its current frontend defaults.
// ---------------------------------------------------------------------------

export interface CtaContent {
  label?: string | null
  href?: string | null
}

export interface HeroContent {
  eyebrow?: string | null
  titleLine1?: string | null
  titleLine2?: string | null
  titleLine3?: string | null
  tagline?: string | null
  backgroundImage?: PayloadMedia | string | null
  primaryCta?: CtaContent | null
  secondaryCta?: CtaContent | null
}

export interface ProtectContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  locations?: string | null
  headline?: string | null
  headlineItalic?: string | null
  intro?: string | null
  primaryLink?: CtaContent | null
  secondaryLink?: CtaContent | null
  badge?: string | null
  image1?: PayloadMedia | string | null
  image2?: PayloadMedia | string | null
  subEyebrow?: string | null
  subHeadline?: string | null
  subHeadlineItalic?: string | null
  subHeadlineTail?: string | null
  subBody1?: string | null
  subBody2Prefix?: string | null
  subBody2LinkLabel?: string | null
  subBody2LinkHref?: string | null
  subBody2Suffix?: string | null
}

export interface IndustryContent {
  number: string
  name: string
  description: string
}

export interface IndustriesContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  headlineTail?: string | null
  items?: IndustryContent[] | null
}

export interface PillarContent {
  title: string
  description: string
}

export interface ApproachContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  headlineTail?: string | null
  cta?: CtaContent | null
  image?: PayloadMedia | string | null
  pillars?: PillarContent[] | null
}

export interface PracticesContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  viewAll?: CtaContent | null
}

export interface StatItemContent {
  value: number
  suffix?: string | null
  label: string
  sub?: string | null
}

export interface StatsContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  headlineTail?: string | null
  items?: StatItemContent[] | null
  cities?: Array<{ name: string }> | null
}

export interface AttorneysContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  headlineTail?: string | null
  viewAll?: CtaContent | null
}

export interface QuoteContent {
  text: string
  author: string
  role?: string | null
}

export interface TestimonialContent {
  eyebrow?: string | null
  quotes?: QuoteContent[] | null
}

export interface NewsSectionContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  viewAll?: CtaContent | null
}

export interface FaqItemContent {
  question: string
  answer: string
}

export interface FaqContent {
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  items?: FaqItemContent[] | null
}

export interface AwardItemContent {
  title: string
  subtitle?: string | null
  year?: string | null
  tag?: string | null
}

export interface AwardsContent {
  items?: AwardItemContent[] | null
}

export interface OfficeContent {
  label: string
  address: string
  phone?: string | null
}

export interface ContactContent {
  bannerHeadline?: string | null
  bannerHighlight?: string | null
  bannerHighlightHref?: string | null
  bannerSuffix?: string | null
  bannerCta?: CtaContent | null
  eyebrowNumber?: string | null
  eyebrowText?: string | null
  headline?: string | null
  headlineItalic?: string | null
  sharedEmail?: string | null
  hours?: {
    label?: string | null
    value?: string | null
  } | null
  offices?: OfficeContent[] | null
  form?: {
    disclaimer?: string | null
    submitLabel?: string | null
  } | null
}

export interface HomePageContent {
  hero?: HeroContent | null
  protect?: ProtectContent | null
  industries?: IndustriesContent | null
  approach?: ApproachContent | null
  practices?: PracticesContent | null
  stats?: StatsContent | null
  attorneys?: AttorneysContent | null
  testimonial?: TestimonialContent | null
  news?: NewsSectionContent | null
  faq?: FaqContent | null
  awards?: AwardsContent | null
  contact?: ContactContent | null
}

// `s(value, fallback)` — pick string value if present and non-empty, else fallback.
export function s(value: string | null | undefined, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? value : fallback
}

// ---------------------------------------------------------------------------
// Media helpers
// ---------------------------------------------------------------------------

export function mediaUrl(
  m: PayloadMedia | string | null | undefined,
): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

export function mediaAlt(
  m: PayloadMedia | string | null | undefined,
  fallback: string,
): string {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

export function firstCategoryTitle(
  categories: NewsPost['categories'] | undefined,
): string {
  if (!categories || categories.length === 0) return 'News'
  const first = categories[0]
  if (typeof first === 'string') return 'News'
  return first.title || 'News'
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('in')
            io.unobserve(el)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

export function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const triggered = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !triggered.current) {
            triggered.current = true
            const start = performance.now()
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration)
              const eased = 1 - Math.pow(1 - t, 3)
              setVal(Math.round(target * eased))
              if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])
  return [val, ref] as const
}

export function useScrollY(): number {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return y
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

interface IconProps {
  size?: number
}

export const Icon = {
  Arrow: ({ size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ArrowUpRight: ({ size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  Plus: ({ size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: ({ size = 16 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
}

// ---------------------------------------------------------------------------
// Placeholder
// ---------------------------------------------------------------------------

interface PlaceholderProps {
  label: string
  ratio?: string
  tone?: 'cream' | 'dark' | 'teal'
  style?: CSSProperties
}

export function Placeholder({ label, ratio = '4/3', tone = 'cream', style }: PlaceholderProps) {
  const colors =
    tone === 'teal'
      ? { bg: '#14617a', stripe: '#0f4c5c', text: 'rgba(255,255,255,0.85)' }
      : tone === 'dark'
        ? { bg: '#0e1517', stripe: '#1a2326', text: 'rgba(246,242,234,0.7)' }
        : { bg: '#ede7db', stripe: '#e3ddd0', text: '#5a6569' }
  return (
    <div
      style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(135deg, ${colors.bg} 0 14px, ${colors.stripe} 14px 28px)`,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Geist Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: colors.text,
          textAlign: 'center',
          padding: 16,
        }}
      >
        <span style={{ background: colors.bg, padding: '6px 10px' }}>{label}</span>
      </div>
    </div>
  )
}
