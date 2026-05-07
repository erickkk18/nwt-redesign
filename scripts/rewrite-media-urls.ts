import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_SIZE = 100

async function main() {
  const publicUrl = process.env.S3_PUBLIC_URL
  if (!publicUrl) {
    console.error('[rewrite-media-urls] S3_PUBLIC_URL not set')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  let page = 1
  let updated = 0
  let skipped = 0

  while (true) {
    const result = await payload.find({
      collection: 'media',
      limit: PAGE_SIZE,
      page,
      depth: 0,
      sort: 'createdAt',
    })
    if (result.docs.length === 0) break

    for (const doc of result.docs as any[]) {
      if (!doc.filename) {
        skipped += 1
        continue
      }

      const newUrl = `${publicUrl}/${doc.filename}`
      const sizes = doc.sizes ?? {}
      const newSizes: Record<string, any> = {}
      for (const [sizeName, sizeData] of Object.entries(sizes)) {
        const sd = sizeData as any
        if (sd?.filename) {
          newSizes[sizeName] = { ...sd, url: `${publicUrl}/${sd.filename}` }
        } else {
          newSizes[sizeName] = sd
        }
      }

      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          url: newUrl,
          sizes: newSizes,
        },
      })

      updated += 1
      if (updated % 50 === 0) console.log(`[rewrite-media-urls] ${updated} updated`)
    }

    if (result.docs.length < PAGE_SIZE) break
    page += 1
  }

  console.log(`[rewrite-media-urls] done — updated: ${updated}, skipped: ${skipped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[rewrite-media-urls] fatal:', err)
  process.exit(1)
})
