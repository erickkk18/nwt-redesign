import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      saveToJWT: true,
    },
    {
      name: 'wpUserId',
      type: 'number',
      admin: {
        description: 'Original WordPress user ID — set by migration script',
        readOnly: true,
        position: 'sidebar',
      },
      index: true,
    },
  ],
}
