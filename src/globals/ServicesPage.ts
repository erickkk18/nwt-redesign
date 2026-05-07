import type { GlobalConfig } from 'payload'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services Page (/our-services)',
  access: { read: () => true },
  admin: {
    description: 'Edit the Practice Areas list-page intro and CTA copy.',
  },
  fields: [
    {
      name: 'intro',
      type: 'group',
      label: '01 · Intro',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '04' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Practice Areas' },
        { name: 'heading', type: 'text', defaultValue: 'What We' },
        { name: 'headingItalic', type: 'text', defaultValue: 'Do.' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Concentrated practice areas, deep healthcare fluency, and counsel calibrated to the stakes. Pick a practice to see how we work in it.',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: '02 · Closing CTA',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Engage Us' },
        { name: 'heading', type: 'text', defaultValue: "Don't see your" },
        { name: 'headingItalic', type: 'text', defaultValue: 'matter?' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            "We take on adjacent and bespoke matters when they sit in our wheelhouse. The fastest answer is a 15-minute call.",
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Talk to a Partner' },
            { name: 'href', type: 'text', defaultValue: '/contact-us' },
          ],
        },
      ],
    },
  ],
}
