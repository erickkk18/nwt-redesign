import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page (/what-sets-us-apart)',
  access: { read: () => true },
  admin: {
    description:
      'Edit the What Sets Us Apart page section by section. Defaults match the launch design; clear a field to fall back to the default.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: '01 · Hero',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '02' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'About' },
        { name: 'headline', type: 'text', defaultValue: 'What Sets' },
        { name: 'headlineItalic', type: 'text', defaultValue: 'Us Apart.' },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue:
            'A boutique law firm built around three quiet convictions: clients deserve real attention, complex matters reward focused experience, and the right room is the one where decisions get made.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional. Right-side hero image (4:5 portrait works best).' },
        },
      ],
    },

    {
      name: 'quote',
      type: 'group',
      label: '02 · Pull Quote',
      fields: [
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'We built Nichols Weitzner to be the firm we wanted to hire — fast on the work, slow on the relationship.',
        },
        { name: 'attribution', type: 'text', defaultValue: 'Founding Partners' },
      ],
    },

    {
      name: 'pillars',
      type: 'group',
      label: '03 · Pillars',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '03' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Pillars' },
        { name: 'heading', type: 'text', defaultValue: 'Three Things' },
        { name: 'headingItalic', type: 'text', defaultValue: 'We Refuse to Compromise.' },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          defaultValue: [
            {
              numLabel: '01',
              title: 'Senior-Led Service',
              body: 'Every matter is staffed by partners and senior counsel — never delegated to a churning bullpen of associates billing for training.',
            },
            {
              numLabel: '02',
              title: 'Healthcare Native',
              body: 'We have spent careers inside hospital systems, payor disputes, and provider transactions. Industry fluency is the floor, not the ceiling.',
            },
            {
              numLabel: '03',
              title: 'Plain-Spoken Counsel',
              body: 'Real clarity beats legal hedging. We tell you what we would do if it were our company — then we go do it.',
            },
          ],
          fields: [
            { name: 'numLabel', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'body', type: 'textarea' },
          ],
        },
      ],
    },

    {
      name: 'story',
      type: 'group',
      label: '04 · Story',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '04' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Origin' },
        { name: 'heading', type: 'text', defaultValue: 'Built by lawyers who' },
        { name: 'headingItalic', type: 'text', defaultValue: 'left big law on purpose.' },
        {
          name: 'body1',
          type: 'textarea',
          defaultValue:
            'Nichols Weitzner began with a deliberate departure. Our founders left top-tier firms after watching too many sophisticated clients buried under the weight of process, conflicts, and committee.',
        },
        {
          name: 'body2',
          type: 'textarea',
          defaultValue:
            'The result is a practice deliberately scaled to the work — large enough to handle bet-the-company litigation and complex transactions, small enough to know your business by heart.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Right-column image for the Story block.' },
        },
        { name: 'imageCaption', type: 'text', defaultValue: 'Houston · 2007 → Today' },
      ],
    },

    {
      name: 'stats',
      type: 'group',
      label: '05 · Numbers',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '05' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'By the Numbers' },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          defaultValue: [
            { value: '19', suffix: 'Years', label: 'Continuous Texas practice' },
            { value: '$2B+', suffix: '', label: 'In matters handled to verdict or close' },
            { value: '40+', suffix: '', label: 'Healthcare systems served' },
            { value: '3', suffix: 'Cities', label: 'Houston · Austin · Dallas' },
          ],
          fields: [
            { name: 'value', type: 'text' },
            { name: 'suffix', type: 'text' },
            { name: 'label', type: 'text' },
          ],
        },
      ],
    },

    {
      name: 'cta',
      type: 'group',
      label: '06 · Closing CTA',
      fields: [
        { name: 'eyebrowText', type: 'text', defaultValue: 'Get in Touch' },
        { name: 'headline', type: 'text', defaultValue: "Let's see if we" },
        { name: 'headlineItalic', type: 'text', defaultValue: 'fit your matter.' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'A 30-minute conversation tells us both whether the chemistry — and the case — make sense. No engagement, no obligation.',
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Book a Conversation' },
            { name: 'href', type: 'text', defaultValue: '/contact-us' },
          ],
        },
      ],
    },
  ],
}
