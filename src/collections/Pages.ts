// Facts:
// 1. Called by src/payload.config.ts line 16 (import { Pages } from './collections/Pages');
//    queried by Phase-4 routes app/[slug]/page.tsx and app/page.tsx via Payload Local API;
//    written to by scripts/migrate.ts for every WP item where wp:post_type === 'page'.
// 2. Glob check: '**/collections/Pages.ts' under nwt-payload/ returned No files found.
// 3. Schema example record (synthetic):
//    { title: "About Us", slug: "about-us", publishedAt: "2024-03-12T08:00:00.000Z",
//      hero: { heading, image }, layout: [{ blockType: "content", body: {...} }, ...],
//      seo: { metaTitle, metaDescription }, wpPostId: 567 }
//    Date format: ISO-8601 UTC. Slug format: kebab-case.
// 4. User instruction: "Pages collection must use a `layout` blocks field for flexible layouts"
//    "Always include: title (text), slug (text, unique), publishedAt (date)"
//    "ACF flexible_content → Payload blocks"

import type { CollectionConfig } from 'payload'

import { HeroBlock } from '../blocks/HeroBlock'
import { ContentBlock } from '../blocks/ContentBlock'
import { ImageBlock } from '../blocks/ImageBlock'
import { TwoColumnBlock } from '../blocks/TwoColumnBlock'
import { CtaBlock } from '../blocks/CtaBlock'
import { TeamBlock } from '../blocks/TeamBlock'
import { ServicesBlock } from '../blocks/ServicesBlock'
import { GalleryBlock } from '../blocks/GalleryBlock'
import { FormBlock } from '../blocks/FormBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
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
      admin: {
        description: 'Use "home" for the homepage. Otherwise kebab-case path segment.',
      },
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
      name: 'hero',
      type: 'group',
      admin: {
        description: 'Page hero — separate from layout blocks so every page has a consistent header treatment',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'subheading',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page layout',
      minRows: 0,
      blocks: [
        HeroBlock,
        ContentBlock,
        ImageBlock,
        TwoColumnBlock,
        CtaBlock,
        TeamBlock,
        ServicesBlock,
        GalleryBlock,
        FormBlock,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO (Yoast import)',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description: 'Mirrors WP `post_parent` for nested pages',
      },
    },
    {
      name: 'wpPostId',
      type: 'number',
      unique: true,
      index: true,
      admin: {
        description: 'Original WordPress page ID — idempotency key for re-runs',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
