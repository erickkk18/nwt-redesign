import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services',
    plural: 'Services sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Bento', value: 'bento' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
  ],
}
