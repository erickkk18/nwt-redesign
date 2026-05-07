// Facts:
// 1. Auto-discovered by Next.js as the route "/" inside the (frontend) layout.
//    No static importers — the framework loads it.
// 2. Public function affected: default-exported Page (now async).
// 3. Reads MongoDB via Payload Local API:
//    - team:   { id, name, slug, role, category, photo: { url, alt } }
//    - posts:  { id, title, slug, publishedAt (ISO-8601 UTC), excerpt,
//                featuredImage: { url, alt }, categories: [{ title }] }
//    - services: { id, title, slug, summary, featuredImage: { url, alt } }
// 4. User: "continue the image swap, text swap and wiring to payload"

import { getPayload } from 'payload'
import config from '@payload-config'

import { HomePage } from './HomePage'
import type { HomePageContent, NewsPost, Service, TeamMember } from './HomePage'

// Re-render on every request so freshly migrated content appears without a
// rebuild. Switch to ISR (`export const revalidate = 60`) once content stabilizes.
export const dynamic = 'force-dynamic'

export default async function Page() {
  let team: TeamMember[] = []
  let posts: NewsPost[] = []
  let services: Service[] = []
  let content: HomePageContent | null = null

  try {
    const payload = await getPayload({ config })

    const [t, p, s, hp] = await Promise.all([
      payload.find({
        collection: 'team',
        limit: 12,
        sort: 'order',
        depth: 1,
      }),
      payload.find({
        collection: 'posts',
        limit: 3,
        sort: '-publishedAt',
        depth: 1,
      }),
      payload.find({
        collection: 'services',
        limit: 5,
        sort: 'order',
        depth: 1,
      }),
      payload.findGlobal({ slug: 'home-page', depth: 1 }),
    ])

    team = t.docs as unknown as TeamMember[]
    posts = p.docs as unknown as NewsPost[]
    services = s.docs as unknown as Service[]
    content = hp as unknown as HomePageContent
  } catch (err) {
    // DB may be unreachable (before migration runs / Mongo not started yet).
    // Fall through with empty arrays + null content — HomePage uses defaults.
    console.warn('[home] payload fetch failed, using design fallback:', err)
  }

  return (
    <HomePage team={team} posts={posts} services={services} content={content} />
  )
}
