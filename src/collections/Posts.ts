import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'WP post_meta `_thumbnail_id` resolves here',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO (Yoast import)',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'Maps from `_yoast_wpseo_title`' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'Maps from `_yoast_wpseo_metadesc`' },
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'wpPostId',
      type: 'number',
      unique: true,
      index: true,
      admin: {
        description: 'Original WordPress post ID — idempotency key for re-runs',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
