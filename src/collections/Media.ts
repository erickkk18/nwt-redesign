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
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      { name: 'xs', width: 240, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'mobile', width: 480, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'card', width: 768, height: 512, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'tablet', width: 1024, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'feature', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    mimeTypes: [
      'image/*',
      'video/*',
      'application/pdf',
      'audio/*',
    ],
  },
}
