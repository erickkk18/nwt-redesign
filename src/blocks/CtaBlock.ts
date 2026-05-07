import type { Block } from 'payload'

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'Call to action',
    plural: 'Calls to action',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'surface',
      options: [
        { label: 'Surface', value: 'surface' },
        { label: 'Brand', value: 'brand' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'buttons',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
  ],
}
