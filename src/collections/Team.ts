// Facts:
// 1. Called by src/payload.config.ts; referenced by src/blocks/TeamBlock.ts;
//    queried by app/team/page.tsx and app/team/[slug]/page.tsx; written by
//    scripts/migrate.ts for WP CPT 'cpt_team'.
// 2. Glob: collection file already exists; this is an in-place update.
// 3. Maps from TRX Addons `trx_addons_options` postmeta (PHP serialized):
//      subtitle → role, email → email, phone → phone, address → address,
//      socials[] → social[]. Photo from `_thumbnail_id`. Category from
//      `cpt_team_group` taxonomy.
//    Date: ISO-8601 UTC. Slug: kebab-case (taken from wp:post_name).
// 4. User: "Always include: title (text), slug (text, unique), publishedAt (date)"

import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Team member',
    plural: 'Team',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Mapped from WP post title' },
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
      name: 'role',
      type: 'text',
      admin: { description: 'e.g. "Partner" — TRX `subtitle`' },
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'e.g. "experts" — from WP cpt_team_group taxonomy',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'From WP `_thumbnail_id`' },
    },
    {
      name: 'bio',
      type: 'richText',
      admin: { description: 'From WP post content' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'social',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'GitHub', value: 'github' },
            { label: 'Website', value: 'website' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Display order — mapped from WP `menu_order`',
      },
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
