// Facts:
// 1. One-off CLI: `pnpm tsx scripts/migrate-media-to-blob.ts` (also wired as
//    `pnpm migrate:media` in package.json). Not imported by any source file.
// 2. Glob: scripts/migrate-media-to-blob.ts returned No files found before write.
// 3. Reads + writes MongoDB via Payload Local API. Iterates `media` docs
//    { id, filename, mimeType, url, filesize }, reads bytes from local
//    media/<filename>, calls payload.update({ file: { data, name, mimetype, size } }) —
//    Payload re-saves through the configured storage adapter (Vercel Blob when
//    BLOB_READ_WRITE_TOKEN is set) and updates each doc's `url` to the Blob URL.
//    Doc IDs are preserved so existing relationships stay valid.
// 4. User: "so the process is ill give you the blob storage env token or
//    something then youll run the script to migrate the media to vercel?"

import 'dotenv/config'
import path from 'node:path'
import { readFile, stat } from 'node:fs/promises'
import { getPayload } from 'payload'

import config from '../src/payload.config'

interface MediaDoc {
  id: string
  filename?: string | null
  mimeType?: string | null
  url?: string | null
  filesize?: number | null
}

const PAGE_SIZE = 100
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

function isAlreadyOnBlob(url: string | null | undefined): boolean {
  if (!url) return false
  return /\.public\.blob\.vercel-storage\.com/i.test(url)
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      '[migrate:media] BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` or paste the token into .env before running this script.',
    )
    process.exit(1)
  }

  const payload = await getPayload({ config })
  console.log(`[migrate:media] reading local files from ${MEDIA_DIR}`)

  let page = 1
  let totalProcessed = 0
  let totalUploaded = 0
  let totalSkipped = 0
  let totalMissing = 0
  let totalErrored = 0

  while (true) {
    const result = await payload.find({
      collection: 'media',
      limit: PAGE_SIZE,
      page,
      depth: 0,
      sort: 'createdAt',
    })
    const docs = result.docs as unknown as MediaDoc[]
    if (docs.length === 0) break

    for (const doc of docs) {
      totalProcessed += 1

      if (!doc.filename) {
        console.warn(`[migrate:media] skip ${doc.id}: no filename`)
        totalSkipped += 1
        continue
      }

      if (isAlreadyOnBlob(doc.url)) {
        console.log(`[migrate:media] skip ${doc.filename}: already on Blob`)
        totalSkipped += 1
        continue
      }

      const filePath = path.join(MEDIA_DIR, doc.filename)
      try {
        const info = await stat(filePath)
        if (!info.isFile()) {
          console.warn(`[migrate:media] missing ${doc.filename}: not a file`)
          totalMissing += 1
          continue
        }
        const data = await readFile(filePath)

        await payload.update({
          collection: 'media',
          id: doc.id,
          file: {
            data,
            name: doc.filename,
            mimetype: doc.mimeType ?? 'application/octet-stream',
            size: doc.filesize ?? data.length,
          },
        })

        totalUploaded += 1
        console.log(`[migrate:media] ✓ ${doc.filename} (${data.length} bytes)`)
      } catch (err: unknown) {
        const code = (err as NodeJS.ErrnoException)?.code
        if (code === 'ENOENT') {
          console.warn(`[migrate:media] missing ${doc.filename}: not in ${MEDIA_DIR}`)
          totalMissing += 1
        } else {
          console.error(`[migrate:media] error ${doc.filename}:`, err)
          totalErrored += 1
        }
      }
    }

    if (docs.length < PAGE_SIZE) break
    page += 1
  }

  console.log('[migrate:media] done')
  console.log(`  processed: ${totalProcessed}`)
  console.log(`  uploaded:  ${totalUploaded}`)
  console.log(`  skipped:   ${totalSkipped}`)
  console.log(`  missing:   ${totalMissing}`)
  console.log(`  errored:   ${totalErrored}`)

  process.exit(totalErrored > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('[migrate:media] fatal:', err)
  process.exit(1)
})
