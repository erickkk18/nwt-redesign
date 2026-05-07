import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Content',
    plural: 'Content blocks',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Single column', value: 'single' },
        { label: 'Two columns', value: 'two' },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
}
