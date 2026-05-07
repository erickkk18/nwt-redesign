import type { GlobalConfig } from 'payload'

export const TeamPage: GlobalConfig = {
  slug: 'team-page',
  label: 'Team Page (/our-team)',
  access: { read: () => true },
  admin: {
    description: 'Edit the Our Team list-page intro and CTA copy.',
  },
  fields: [
    {
      name: 'intro',
      type: 'group',
      label: '01 · Intro',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '06' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'The Team' },
        { name: 'heading', type: 'text', defaultValue: 'Our' },
        { name: 'headingItalic', type: 'text', defaultValue: 'Attorneys.' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'A bench of healthcare-focused attorneys who have tried, settled, and counseled through the most consequential matters facing Texas providers.',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: '02 · Closing CTA',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Work with us' },
        { name: 'heading', type: 'text', defaultValue: 'Looking for the right' },
        { name: 'headingItalic', type: 'text', defaultValue: 'attorney?' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            "Tell us about your matter — we'll match you with the partner whose practice and disposition fit best.",
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Get in Touch' },
            { name: 'href', type: 'text', defaultValue: '/contact-us' },
          ],
        },
      ],
    },
  ],
}
