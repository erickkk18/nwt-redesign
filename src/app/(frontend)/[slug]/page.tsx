import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getPayload } from 'payload'
import config from '@payload-config'

import {
  BlockRenderer,
  type BlockPayload,
} from '@/components/blocks/BlockRenderer'
import { PageHero } from '@/components/sections/PageHero'
import { ContactBand } from '@/components/sections/ContactBand'
import {
  ContactSection,
  type ContactPageContent,
} from '@/components/sections/ContactSection'
import {
  TeamGrid,
  type TeamMember,
  type TeamPageContent,
} from '@/components/sections/TeamGrid'
import {
  ServicesGrid,
  type Service,
  type ServicesPageContent,
} from '@/components/sections/ServicesGrid'
import { RichTextSection } from '@/components/sections/RichTextSection'
import { AboutPage, type AboutPageContent } from '@/components/about/AboutPage'

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

interface PageDoc {
  id: string
  title: string
  slug: string
  hero?: {
    enabled?: boolean | null
    heading?: string | null
    subheading?: string | null
    image?: MediaDoc | string | null
  } | null
  layout?: BlockPayload[] | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
  sectionContent?: {
    about?: AboutPageContent | null
    contact?: ContactPageContent | null
    team?: TeamPageContent | null
    services?: ServicesPageContent | null
  } | null
  publishedAt?: string | null
}

export const dynamic = 'force-dynamic'

const CONTACT_SLUGS = new Set([
  'contact-us',
  'thank-you-contact',
  'thank-you-get-in-touch',
])
const TEAM_SLUGS = new Set(['our-team', 'team'])
const SERVICES_SLUGS = new Set([
  'our-services',
  'what-we-do',
  'services',
  'practices',
])
const ABOUT_SLUGS = new Set(['what-sets-us-apart', 'about', 'about-us'])

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

async function loadPage(slug: string): Promise<PageDoc | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return (res.docs[0] as unknown as PageDoc) ?? null
  } catch (err) {
    console.warn(`[/${slug}] payload fetch failed:`, err)
    return null
  }
}

async function loadTeam(): Promise<TeamMember[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'team',
      limit: 50,
      sort: 'order',
      depth: 1,
    })
    return res.docs as unknown as TeamMember[]
  } catch (err) {
    console.warn('[team] payload fetch failed:', err)
    return []
  }
}

async function loadServices(): Promise<Service[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      limit: 50,
      sort: 'order',
      depth: 1,
    })
    return res.docs as unknown as Service[]
  } catch (err) {
    console.warn('[services] payload fetch failed:', err)
    return []
  }
}

async function loadGlobal<T>(slug: string): Promise<T | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.findGlobal({ slug: slug as never, depth: 1 })
    return res as unknown as T
  } catch (err) {
    console.warn(`[global ${slug}] fetch failed:`, err)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await loadPage(slug)
  if (!page) return { title: 'Not found' }
  return {
    title: page.seo?.metaTitle || `${page.title} — NWT Law`,
    description: page.seo?.metaDescription ?? undefined,
  }
}

function hasRichBody(page: PageDoc): boolean {
  if (!Array.isArray(page.layout) || page.layout.length === 0) return false
  return page.layout.some((b) => {
    if (!b || typeof b !== 'object') return false
    const block = b as { blockType?: string; body?: unknown }
    if (block.blockType !== 'content') return false
    const body = block.body as { root?: { children?: unknown[] } } | undefined
    return Boolean(body?.root?.children?.length)
  })
}

export default async function PageRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (slug === 'home') notFound()

  const page = await loadPage(slug)
  if (!page) notFound()

  const isContact = CONTACT_SLUGS.has(slug)
  const isTeam = TEAM_SLUGS.has(slug)
  const isServices = SERVICES_SLUGS.has(slug)
  const isAbout = ABOUT_SLUGS.has(slug)
  const isThankYou =
    slug === 'thank-you-contact' || slug === 'thank-you-get-in-touch'

  if (isAbout) {
    const about =
      page.sectionContent?.about ??
      (await loadGlobal<AboutPageContent>('about-page'))
    return <AboutPage content={about} />
  }

  const heroEnabled = page.hero?.enabled !== false
  const heroImageUrl = mediaUrl(page.hero?.image)
  const heroHeading = page.hero?.heading ?? page.title
  const heroSubheading = page.hero?.subheading ?? undefined

  const sectionContact = page.sectionContent?.contact ?? null
  const sectionTeam = page.sectionContent?.team ?? null
  const sectionServices = page.sectionContent?.services ?? null

  const [team, services, contactGlobal, teamGlobal, servicesGlobal] =
    await Promise.all([
      isTeam ? loadTeam() : Promise.resolve<TeamMember[]>([]),
      isServices ? loadServices() : Promise.resolve<Service[]>([]),
      isContact && !sectionContact
        ? loadGlobal<ContactPageContent>('contact-page')
        : Promise.resolve<ContactPageContent | null>(sectionContact),
      isTeam && !sectionTeam
        ? loadGlobal<TeamPageContent>('team-page')
        : Promise.resolve<TeamPageContent | null>(sectionTeam),
      isServices && !sectionServices
        ? loadGlobal<ServicesPageContent>('services-page')
        : Promise.resolve<ServicesPageContent | null>(sectionServices),
    ])

  return (
    <main>
      {heroEnabled && (
        <PageHero
          eyebrow={
            isContact
              ? 'Contact'
              : isTeam
                ? 'The Team'
                : isServices
                  ? 'What We Do'
                  : page.title
          }
          eyebrowNumber={
            isContact ? '09' : isTeam ? '06' : isServices ? '04' : undefined
          }
          title={heroHeading}
          subheading={heroSubheading}
          imageUrl={heroImageUrl}
          imageAlt={page.title}
          theme="dark"
          compact={isContact}
        />
      )}

      {isTeam && <TeamGrid team={team} content={teamGlobal} />}

      {isServices && <ServicesGrid services={services} content={servicesGlobal} />}

      {isContact && !isThankYou && <ContactSection content={contactGlobal} />}

      {!isContact && !isTeam && !isServices && hasRichBody(page) && (
        <BlockRenderer blocks={page.layout} />
      )}

      {!isContact &&
        !isTeam &&
        !isServices &&
        !hasRichBody(page) &&
        heroSubheading && (
          <RichTextSection
            data={{
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    direction: 'ltr',
                    children: [
                      {
                        type: 'text',
                        text: heroSubheading,
                        format: 0,
                        style: '',
                        mode: 'normal',
                        detail: 0,
                        version: 1,
                      },
                    ],
                  },
                ],
              },
            }}
          />
        )}

      {!isContact && <ContactBand />}
    </main>
  )
}
