// Facts:
// 1. One-off CLI: `pnpm tsx scripts/migrate-globals-to-pages.ts`. Not imported.
// 2. New file. No prior version.
// 3. Reads four Payload globals (about-page, contact-page, team-page,
//    services-page) and writes per-page section data into the `pages`
//    collection's `sectionContent.<key>` group. Idempotent — skips pages whose
//    sectionContent already has the matching key populated. If no Pages doc
//    matches the canonical slug, creates a stub with title + slug and the
//    section data.
// 4. User: "The other subpages has moved to globals now. the pages should be
//    on the collections instead and wired up like what it is right now."

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

interface GlobalToPageMap {
  globalSlug: 'about-page' | 'contact-page' | 'team-page' | 'services-page'
  sectionKey: 'about' | 'contact' | 'team' | 'services'
  canonicalSlug: string
  fallbackTitle: string
}

const MAP: GlobalToPageMap[] = [
  { globalSlug: 'about-page', sectionKey: 'about', canonicalSlug: 'what-sets-us-apart', fallbackTitle: 'What Sets Us Apart' },
  { globalSlug: 'contact-page', sectionKey: 'contact', canonicalSlug: 'contact-us', fallbackTitle: 'Contact Us' },
  { globalSlug: 'team-page', sectionKey: 'team', canonicalSlug: 'our-team', fallbackTitle: 'Our Team' },
  { globalSlug: 'services-page', sectionKey: 'services', canonicalSlug: 'our-services', fallbackTitle: 'Our Services' },
]

const PAYLOAD_META_KEYS = new Set(['id', '_id', 'globalType', 'createdAt', 'updatedAt', '__v'])

function stripPayloadMeta<T extends Record<string, unknown>>(input: T): Partial<T> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(input)) {
    if (PAYLOAD_META_KEYS.has(k)) continue
    out[k] = v
  }
  return out as Partial<T>
}

async function main() {
  const payload = await getPayload({ config })

  for (const entry of MAP) {
    console.log(`\n[migrate] ${entry.globalSlug} → pages[${entry.canonicalSlug}].sectionContent.${entry.sectionKey}`)

    // Read the raw global document directly from MongoDB. The four subpage
    // globals were removed from payload.config.ts in this same change, so
    // payload.findGlobal() no longer resolves them — but the data is still
    // sitting in the `globals` collection until we patch it into pages.
    let globalDoc: Record<string, unknown> | null = null
    try {
      // Payload's mongoose adapter exposes `payload.db.connection` for the
      // active mongoose connection. Cast to any to reach the underlying
      // collection without re-wiring Payload types.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conn = (payload as any).db?.connection
      if (!conn) throw new Error('no mongoose connection on payload.db')
      const raw = await conn
        .collection('globals')
        .findOne({ globalType: entry.globalSlug })
      globalDoc = (raw as Record<string, unknown> | null) ?? null
    } catch (err) {
      console.warn(`  · raw read of ${entry.globalSlug} failed:`, err)
      continue
    }

    if (!globalDoc) {
      console.log(`  · no Mongo doc with globalType="${entry.globalSlug}", skipping`)
      continue
    }

    const sectionPayload = stripPayloadMeta(globalDoc)

    // Read the page doc directly from Mongo so we see the actually persisted
    // shape — payload.find() injects defaultValue fields which would falsely
    // suggest sectionContent is populated. Write also goes through raw Mongo
    // because the source global may contain ObjectId references (e.g.,
    // hero.image → media _id) that Payload's cast layer rejects when handed
    // a BSON ObjectId object instead of a 24-char hex string.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = (payload as any).db?.connection
    const pagesCol = conn.collection('pages')

    const rawPage = (await pagesCol.findOne({ slug: entry.canonicalSlug })) as
      | { _id: unknown; sectionContent?: Record<string, unknown> | null }
      | null

    const now = new Date()

    if (!rawPage) {
      console.log(`  · pages doc missing — creating stub with slug "${entry.canonicalSlug}"`)
      await pagesCol.insertOne({
        title: entry.fallbackTitle,
        slug: entry.canonicalSlug,
        sectionContent: { [entry.sectionKey]: sectionPayload },
        createdAt: now,
        updatedAt: now,
      })
      console.log('  · created.')
      continue
    }

    const persisted = rawPage.sectionContent?.[entry.sectionKey]
    if (persisted && typeof persisted === 'object' && Object.keys(persisted as object).length > 0) {
      console.log('  · sectionContent already persisted in Mongo, skipping (idempotent)')
      continue
    }

    await pagesCol.updateOne(
      { _id: rawPage._id },
      {
        $set: {
          [`sectionContent.${entry.sectionKey}`]: sectionPayload,
          updatedAt: now,
        },
      },
    )
    console.log('  · patched.')
  }

  console.log('\n[migrate] done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('[migrate] FAILED:', err)
  process.exit(1)
})
