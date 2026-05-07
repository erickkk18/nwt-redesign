import type { Block } from 'payload'

// Placeholder for Gravity Forms / Contact Form 7 sections.
// Phase 2 migration writes the original WP form ID into `wpFormId`.
// Phase 4 frontend renders these via a Form component — the actual form
// schema either lives in a Forms collection added later or is hand-rebuilt
// per form.
export const FormBlock: Block = {
  slug: 'form',
  interfaceName: 'FormBlock',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'wpFormId',
      type: 'number',
      admin: {
        description: 'Original Gravity Forms form ID — used by Phase 4 to look up the form schema',
      },
    },
    {
      // TODO: replace with relationTo: 'forms' once a Forms collection is built.
      name: 'formSlug',
      type: 'text',
      admin: {
        description: 'Slug of the rebuilt form — placeholder until a Forms collection exists',
      },
    },
  ],
}
