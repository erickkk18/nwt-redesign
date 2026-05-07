// Facts:
// 1. Registered in src/payload.config.ts under `globals`. Read by
//    src/components/site/Nav.tsx via payload.findGlobal({ slug: 'header-menu' }).
// 2. Glob: src/globals/HeaderMenu.ts returned No files found.
// 3. Singleton. Schema: { items: [{label, href, openInNewTab}],
//    cta: {label, href} }.
// 4. User: "add menus options on the admin so we can edit header and footer
//    menu."

import type { GlobalConfig } from 'payload'

export const HeaderMenu: GlobalConfig = {
  slug: 'header-menu',
  label: 'Header Menu',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      defaultValue: [
        { label: 'What We Do', href: '/our-services' },
        { label: 'Our Team', href: '/our-team' },
        { label: 'About Us', href: '/what-sets-us-apart' },
        { label: 'News & Insights', href: '/posts' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description:
              'Use a leading slash for internal links (e.g. /our-team) or a full URL for external.',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Primary CTA',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Get in Touch' },
        { name: 'href', type: 'text', defaultValue: '/contact-us' },
      ],
    },
  ],
}
