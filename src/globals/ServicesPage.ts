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
        { name: 'eyebrowText', type: 'text', defaultValue: 'Excellence in Customer Service' },
        { name: 'heading', type: 'text', defaultValue: 'Full-Service' },
        { name: 'headingItalic', type: 'text', defaultValue: 'Law Firm.' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'We are a full-service law firm with the depth and experience to handle almost any transactional, litigation, corporate, or compliance matter in a variety of fields. Our team has particular expertise in the highly regulated healthcare industry. We offer our clients an exceptional team, dedicated to the delivery of outstanding service — always with the personalized and responsive touch of a small law firm.',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: '02 · Closing CTA',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Why Our Firm' },
        { name: 'heading', type: 'text', defaultValue: 'We provide the highest quality counsel' },
        { name: 'headingItalic', type: 'text', defaultValue: 'for your business.' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'Our team has particular expertise in the highly regulated healthcare industry. We offer our clients an exceptional team, dedicated to the delivery of outstanding service — always with the personalized and responsive touch of a small law firm.',
        },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Contact Us' },
            { name: 'href', type: 'text', defaultValue: '/contact-us' },
          ],
        },
      ],
    },
  ],
}
