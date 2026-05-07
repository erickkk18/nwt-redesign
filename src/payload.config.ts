import path from 'path'
import { fileURLToPath } from 'url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { TeamPage } from './globals/TeamPage'
import { ServicesPage } from './globals/ServicesPage'

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
  globals: [
    SiteSettings,
    HeaderMenu,
    FooterMenu,
    HomePage,
    AboutPage,
    ContactPage,
    TeamPage,
    ServicesPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.S3_ACCESS_KEY),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename }) =>
            `${process.env.S3_PUBLIC_URL || ''}/${filename}`,
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: 'auto',
        forcePathStyle: false,
      },
    }),
  ],
  sharp,
  upload: {
    limits: {
      fileSize: 25_000_000,
    },
  },
})
