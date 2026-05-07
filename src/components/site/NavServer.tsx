// Facts:
// 1. Imported by src/app/(frontend)/layout.tsx in place of <Nav />.
// 2. Glob: src/components/site/NavServer.tsx returned No files found.
// 3. Reads two Payload globals via Local API:
//    - 'header-menu' → { items: [{label, href, openInNewTab}], cta: {label, href} }
//    - 'site-settings' → { logo: Media|null, logoAlt }
//    Falls back to client Nav defaults if Mongo unreachable.
// 4. User: "add menus options on the admin so we can edit header and footer
//    menu. and site settings like the logo settings etc."

import { getPayload } from 'payload'
import config from '@payload-config'

import { Nav } from './Nav'

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

interface HeaderMenuDoc {
  items?: Array<{
    label: string
    href: string
    openInNewTab?: boolean | null
  }> | null
  cta?: {
    label?: string | null
    href?: string | null
  } | null
}

interface SiteSettingsDoc {
  logo?: MediaDoc | string | null
  logoAlt?: string | null
}

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

export async function NavServer() {
  let header: HeaderMenuDoc | null = null
  let settings: SiteSettingsDoc | null = null

  try {
    const payload = await getPayload({ config })
    const [h, s] = await Promise.all([
      payload.findGlobal({ slug: 'header-menu', depth: 0 }),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    ])
    header = h as unknown as HeaderMenuDoc
    settings = s as unknown as SiteSettingsDoc
  } catch (err) {
    console.warn('[NavServer] global fetch failed:', err)
  }

  const items =
    header?.items?.map((i) => ({
      label: i.label,
      href: i.href,
      openInNewTab: i.openInNewTab ?? false,
    })) ?? undefined

  const cta =
    header?.cta?.label && header.cta.href
      ? { label: header.cta.label, href: header.cta.href }
      : undefined

  const logoUrl = mediaUrl(settings?.logo) ?? undefined
  const logoAlt = settings?.logoAlt ?? undefined

  return <Nav links={items} cta={cta} logoUrl={logoUrl} logoAlt={logoAlt} />
}
