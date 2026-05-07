// Facts:
// 1. Imported by src/app/(frontend)/layout.tsx in place of <Footer />.
// 2. Glob: src/components/site/FooterServer.tsx returned No files found before
//    its initial write. Currently the only consumer of footer-menu + site-settings
//    on the layout edge.
// 3. Reads two Payload globals via Local API:
//    - 'footer-menu' → { columns, bottomLinks, copyrightSuffix, offices,
//        licensing:{title, body}, sharedEmail, getInTouchLabel, disclaimer,
//        designerCredit }
//    - 'site-settings' → { logo, logoAlt, tagline, social:[{platform, url}] }
// 4. User: "make more fields for the offices. and more fields for the footer."

import { getPayload } from 'payload'
import config from '@payload-config'

import { Footer } from './Footer'

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

interface FooterMenuDoc {
  columns?: Array<{
    title: string
    links?: Array<{
      label: string
      href: string
      openInNewTab?: boolean | null
    }> | null
  }> | null
  bottomLinks?: Array<{
    label: string
    href: string
  }> | null
  copyrightSuffix?: string | null
  offices?: Array<{
    label?: string | null
    address?: string | null
    phone?: string | null
  }> | null
  licensing?: {
    title?: string | null
    body?: string | null
  } | null
  sharedEmail?: string | null
  getInTouchLabel?: string | null
  disclaimer?: string | null
  designerCredit?: string | null
}

interface SocialItem {
  platform?: string | null
  url?: string | null
}

interface SiteSettingsDoc {
  logo?: MediaDoc | string | null
  logoAlt?: string | null
  tagline?: string | null
  social?: SocialItem[] | null
}

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

export async function FooterServer() {
  let menu: FooterMenuDoc | null = null
  let settings: SiteSettingsDoc | null = null

  try {
    const payload = await getPayload({ config })
    const [m, s] = await Promise.all([
      payload.findGlobal({ slug: 'footer-menu', depth: 0 }),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    ])
    menu = m as unknown as FooterMenuDoc
    settings = s as unknown as SiteSettingsDoc
  } catch (err) {
    console.warn('[FooterServer] global fetch failed:', err)
  }

  const columns = menu?.columns?.map((c) => ({
    title: c.title,
    links: (c.links ?? []).map((l) => ({
      label: l.label,
      href: l.href,
      openInNewTab: l.openInNewTab ?? false,
    })),
  }))

  const bottomLinks = menu?.bottomLinks?.map((l) => ({
    label: l.label,
    href: l.href,
  }))

  const offices = menu?.offices
    ?.filter((o) => typeof o.address === 'string' && o.address.length > 0)
    .map((o) => ({
      label: o.label ?? undefined,
      address: o.address ?? '',
      phone: o.phone ?? undefined,
    }))

  const socials = (settings?.social ?? [])
    .filter((s) => s && typeof s.platform === 'string' && typeof s.url === 'string' && s.url.length > 0)
    .map((s) => ({ platform: s.platform as string, url: s.url as string }))

  return (
    <Footer
      columns={columns}
      bottomLinks={bottomLinks}
      tagline={settings?.tagline ?? undefined}
      copyrightSuffix={menu?.copyrightSuffix ?? undefined}
      logoUrl={mediaUrl(settings?.logo) ?? undefined}
      logoAlt={settings?.logoAlt ?? undefined}
      offices={offices}
      socials={socials}
      sharedEmail={menu?.sharedEmail ?? undefined}
      getInTouchLabel={menu?.getInTouchLabel ?? undefined}
      licensingTitle={menu?.licensing?.title ?? undefined}
      licensingBody={menu?.licensing?.body ?? undefined}
      disclaimer={menu?.disclaimer ?? undefined}
      designerCredit={menu?.designerCredit ?? undefined}
    />
  )
}
