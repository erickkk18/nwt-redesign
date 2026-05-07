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
        { name: 'eyebrowText', type: 'text', defaultValue: 'Our Team' },
        { name: 'heading', type: 'text', defaultValue: 'Founded By Veterans of' },
        { name: 'headingItalic', type: 'text', defaultValue: 'Big Law Firms.' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'We bring proven experience with personalized counsel to complex healthcare regulations. Partners and senior counsel staff every matter — never delegated to a churning bullpen.',
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
