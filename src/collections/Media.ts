import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'wpAttachmentId',
      type: 'number',
      admin: {
        description: 'Original WordPress attachment post ID — set by migration script',
        readOnly: true,
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'wpSourceUrl',
      type: 'text',
      admin: {
        description: 'Original WP attachment URL (used by migration to rewrite content references)',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'tablet', width: 1024 },
      { name: 'feature', width: 1920 },
    ],
    mimeTypes: [
      'image/*',
      'video/*',
      'application/pdf',
      'audio/*',
    ],
  },
}
