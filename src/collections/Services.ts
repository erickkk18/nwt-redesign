// Facts:
// 1. Called by src/payload.config.ts line 20; referenced by
//    src/blocks/ServicesBlock.ts (relationTo: 'services'); written by
//    scripts/migrate.ts for the WP services CPT.
// 2. Glob: **/collections/Services.ts under nwt-payload/ returned No files found.
// 3. Example synthetic record:
//    { title: "Web Development", slug: "web-development",
//      publishedAt: "2024-03-12T08:00:00.000Z", summary: "...",
//      featuredImage: "<media-id>", wpPostId: 33 }
//    Date: ISO-8601 UTC. Slug: kebab-case.
// 4. User: "For each post type (posts, pages, and every CPT), generate a Payload
//    CollectionConfig in TypeScript at: src/collections/[Name].ts"
//    "Always include: title (text), slug (text, unique), publishedAt (date)"

import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
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
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Short blurb shown on services grid / cards',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        // TODO: switch to a select once the design system's icon set is finalized.
        description: 'Icon name from the design system (e.g. "code", "design"). Plain text for now.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Display order (lower = earlier)',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
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
