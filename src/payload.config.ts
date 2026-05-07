import path from 'path'
import { fileURLToPath } from 'url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Team } from './collections/Team'
import { Services } from './collections/Services'

import { SiteSettings } from './globals/SiteSettings'
import { HeaderMenu } from './globals/HeaderMenu'
import { FooterMenu } from './globals/FooterMenu'
import { HomePage } from './globals/HomePage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— NWT Payload',
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Tags,
    Posts,
    Pages,
    Team,
    Services,
  ],
  globals: [SiteSettings, HeaderMenu, FooterMenu, HomePage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // Storage: when BLOB_READ_WRITE_TOKEN is set (production on Vercel), uploads
  // to the `media` collection are written to Vercel Blob and `media.url` is
  // populated with the Blob URL. Without the token (local dev), uploads stay
  // on the local filesystem under `media/` and the adapter is a no-op.
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  sharp,
  upload: {
    limits: {
      fileSize: 25_000_000,
    },
  },
})
