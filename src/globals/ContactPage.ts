import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page (/contact-us)',
  access: { read: () => true },
  admin: {
    description: 'Edit the Contact page section by section.',
  },
  fields: [
    {
      name: 'header',
      type: 'group',
      label: '01 · Header',
      fields: [
        { name: 'eyebrowNumber', type: 'text', defaultValue: '09' },
        { name: 'eyebrowText', type: 'text', defaultValue: 'Contact' },
        { name: 'heading', type: 'text', defaultValue: 'Tell us about' },
        { name: 'headingItalic', type: 'text', defaultValue: 'your matter.' },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue:
            'A short note is enough — share what you can, and a partner will respond within one business day. All inquiries are confidential.',
        },
      ],
    },

    {
      name: 'details',
      type: 'group',
      label: '02 · Contact Details',
      fields: [
        { name: 'detailsHeading', type: 'text', defaultValue: 'Contact' },
        { name: 'detailsHeadingItalic', type: 'text', defaultValue: 'Details.' },
        {
          name: 'offices',
          type: 'array',
          minRows: 1,
          maxRows: 5,
          defaultValue: [
            {
              label: 'Houston Office',
              addressLine1: '2402 Dunlavy Street, Suite 2000',
              addressLine2: 'Houston, Texas 77006',
              phone: '713-405-7090',
            },
            {
              label: 'Austin Office',
              addressLine1: '2901 Bee Caves Road, Suite A',
              addressLine2: 'Austin, Texas 78746',
              phone: '512-221-3057',
            },
          ],
          fields: [
            { name: 'label', type: 'text' },
            { name: 'addressLine1', type: 'text' },
            { name: 'addressLine2', type: 'text' },
            { name: 'phone', type: 'text' },
          ],
        },
        { name: 'sharedEmail', type: 'text', defaultValue: 'firm@nwt.local' },
        { name: 'hoursLabel', type: 'text', defaultValue: 'Hours' },
        {
          name: 'hoursBody',
          type: 'textarea',
          defaultValue: 'Monday – Friday · 9:00 AM – 6:00 PM',
        },
      ],
    },

    {
      name: 'form',
      type: 'group',
      label: '03 · Form Copy',
      fields: [
        { name: 'submitLabel', type: 'text', defaultValue: 'Send Message' },
        {
          name: 'disclaimer',
          type: 'textarea',
          defaultValue:
            'Submitting this form does not create an attorney-client relationship. By contacting us, you acknowledge that we may not represent you until a formal engagement is established.',
        },
        { name: 'successEyebrow', type: 'text', defaultValue: 'Message received' },
        { name: 'successHeading', type: 'text', defaultValue: 'Thank you' },
        {
          name: 'successBody',
          type: 'textarea',
          defaultValue:
            "We've received your inquiry and will be in touch within one business day.",
        },
      ],
    },
  ],
}
