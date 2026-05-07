// Facts:
// 1. Registered in src/payload.config.ts under `globals`. Read by
//    src/components/site/Nav.tsx, Footer.tsx, and the (frontend) layout via
//    payload.findGlobal({ slug: 'site-settings' }).
// 2. Glob: src/globals/*.ts returned No files found.
// 3. Singleton document in Mongo. Schema:
//    { logo (upload→media), logoAlt, tagline, defaultOgImage (upload),
//      contactEmail, contactPhone, addressLines (textarea),
//      social: [{platform: select, url: text}] }.
// 4. User: "add menus options on the admin so we can edit header and footer
//    menu. and site settings like the logo settings etc."

import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'PNG with transparent background; the Nav inverts it to cream over dark heroes.',
      },
    },
    {
      name: 'logoAlt',
      type: 'text',
      defaultValue: 'Nichols Weitzner Thomas — Attorneys at Law',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Healthcare. Focused. Attorneys.',
      admin: {
        description: 'Used in the footer brand block and as a default OG title.',
      },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fallback social-share image for pages without their own.',
      },
    },
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        {
          name: 'contactEmail',
          type: 'text',
          defaultValue: 'info@nwtlaw.example',
        },
        {
          name: 'contactPhone',
          type: 'text',
          defaultValue: '+1 (713) 555-0140',
        },
        {
          name: 'addressLines',
          type: 'textarea',
          defaultValue:
            '1717 West Loop South, Suite 1800\nHouston, Texas 77027',
          admin: {
            description: 'One line per row; rendered with line breaks.',
          },
        },
      ],
    },
    {
      name: 'social',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X (Twitter)', value: 'x' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
