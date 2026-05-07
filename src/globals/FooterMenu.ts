// Facts:
// 1. Registered in src/payload.config.ts under `globals`. Read by
//    src/components/site/Footer.tsx via payload.findGlobal({ slug: 'footer-menu' }).
// 2. Glob: src/globals/FooterMenu.ts returned No files found.
// 3. Singleton. Schema: { columns: [{title, links: [{label, href, openInNewTab}]}],
//    bottomLinks: [{label, href}], copyrightSuffix }.
// 4. User: "add menus options on the admin so we can edit header and footer
//    menu."

import type { GlobalConfig } from 'payload'

export const FooterMenu: GlobalConfig = {
  slug: 'footer-menu',
  label: 'Footer Menu',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      defaultValue: [
        {
          title: 'Firm',
          links: [
            { label: 'What We Do', href: '/our-services' },
            { label: 'Our Team', href: '/our-team' },
            { label: 'What Sets Us Apart', href: '/what-sets-us-apart' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'News & Insights', href: '/posts' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
          ],
        },
        {
          title: 'Locations',
          links: [
            { label: 'Houston', href: '/houston-healthcare-lawyer' },
            { label: 'Austin', href: '/austin-healthcare-lawyer' },
            { label: 'Dallas', href: '/dallas-healthcare-lawyer' },
            { label: 'San Antonio', href: '/san-antonio-healthcare-lawyer' },
          ],
        },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          labels: { singular: 'Link', plural: 'Links' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'offices',
      type: 'array',
      labels: { singular: 'Office', plural: 'Offices' },
      defaultValue: [
        { label: 'Houston', address: '2402 Dunlavy Street, Suite 2000\nHouston, Texas 77006', phone: '713-405-7090' },
        { label: 'Austin', address: '2901 Bee Caves Road, Suite A\nAustin, Texas 78746', phone: '512-221-3057' },
      ],
      fields: [
        { name: 'label', type: 'text' },
        { name: 'address', type: 'textarea', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'licensing',
      type: 'group',
      label: 'Licensing block',
      admin: {
        description: 'Bar admission notice shown alongside the offices in the footer.',
      },
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Licensed in Texas* and California' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Unless otherwise noted, our lawyers are not certified by the Texas Board of Legal Specialization.\n\n*All attorneys licensed in Texas\n\nScott Nichols is licensed in Texas and California.\n\nZach Thomas is licensed in Texas, California, Illinois, Missouri and Oregon.',
          admin: { description: 'Multi-paragraph; blank lines render as paragraph breaks.' },
        },
      ],
    },
    {
      name: 'sharedEmail',
      type: 'text',
      defaultValue: 'firm@nwtlaw.com',
      admin: { description: 'Single shared email shown under the offices block.' },
    },
    {
      name: 'getInTouchLabel',
      type: 'text',
      defaultValue: 'Get In Touch',
      admin: { description: 'Heading above the social icons.' },
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      defaultValue:
        'The information on this website is for general information purposes only. Nothing on this site should be taken as legal advice for any individual case or situation. This information is not intended to create, and receipt or viewing does not constitute, an attorney-client relationship.',
      admin: { description: 'Long-form legal disclaimer rendered above the bottom row.' },
    },
    {
      name: 'bottomLinks',
      type: 'array',
      labels: { singular: 'Bottom link', plural: 'Bottom links' },
      defaultValue: [{ label: 'Privacy', href: '/privacy-policy' }],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'copyrightSuffix',
      type: 'text',
      defaultValue: 'Nichols Weitzner Thomas LLP · All rights reserved',
      admin: {
        description:
          'Appended to the © year in the bottom strip. Year is auto-generated.',
      },
    },
    {
      name: 'designerCredit',
      type: 'text',
      defaultValue: '',
      admin: {
        description: 'Optional agency/designer credit (e.g., "Designed by REFUGE Marketing"). Shown next to the copyright when set.',
      },
    },
  ],
}
