import 'dotenv/config'
import path from 'node:path'
import { readFile, readdir, stat } from 'node:fs/promises'
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

function isAlreadyOnR2(url: string | null | undefined): boolean {
  if (!url) return false
  const publicUrl = process.env.S3_PUBLIC_URL || ''
  return publicUrl.length > 0 && url.startsWith(publicUrl)
}

async function buildFileIndex(dir: string): Promise<Map<string, string>> {
  const index = new Map<string, string>()
  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true })
    await Promise.all(
      entries.map(async (entry) => {
        const full = path.join(current, entry.name)
        if (entry.isDirectory()) {
          await walk(full)
        } else {
          index.set(entry.name.toLowerCase(), full)
        }
      }),
    )
  }
  await walk(dir)
  return index
}

async function main() {
  if (!process.env.S3_ACCESS_KEY) {
    console.error('[migrate:media] S3_ACCESS_KEY is not set in .env')
    process.exit(1)
  }

  const wpUploadsPath = process.env.WP_UPLOADS_PATH
  if (!wpUploadsPath) {
    console.error('[migrate:media] WP_UPLOADS_PATH is not set in .env')
    process.exit(1)
  }

  console.log(`[migrate:media] indexing files in ${wpUploadsPath} ...`)
  const fileIndex = await buildFileIndex(wpUploadsPath)
  console.log(`[migrate:media] indexed ${fileIndex.size} files`)

  const payload = await getPayload({ config })

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

      if (isAlreadyOnR2(doc.url)) {
        console.log(`[migrate:media] skip ${doc.filename}: already on R2`)
        totalSkipped += 1
        continue
      }

      // Payload may have appended `-1` during the previous migration run.
      // Try the exact name first, then strip a trailing `-N` numeric suffix.
      const strippedFilename = doc.filename.replace(/-\d+(\.[^.]+)$/, '$1')
      const resolvedPath =
        fileIndex.get(doc.filename.toLowerCase()) ??
        fileIndex.get(strippedFilename.toLowerCase())
      const resolvedFilename = resolvedPath
        ? path.basename(resolvedPath)
        : doc.filename

      if (!resolvedPath) {
        console.warn(`[migrate:media] missing ${doc.filename}: not found in uploads`)
        totalMissing += 1
        continue
      }

      try {
        const info = await stat(resolvedPath)
        if (!info.isFile()) {
          console.warn(`[migrate:media] missing ${doc.filename}: not a file`)
          totalMissing += 1
          continue
        }
        const data = await readFile(resolvedPath)

        await payload.update({
          collection: 'media',
          id: doc.id,
          file: {
            data,
            name: resolvedFilename,
            mimetype: doc.mimeType ?? 'application/octet-stream',
            size: doc.filesize ?? data.length,
          },
        })

        totalUploaded += 1
        console.log(`[migrate:media] ✓ ${resolvedFilename} (${data.length} bytes)`)
      } catch (err: unknown) {
        console.error(`[migrate:media] error ${doc.filename}:`, err)
        totalErrored += 1
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
