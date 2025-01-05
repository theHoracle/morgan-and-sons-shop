import { isAdminOrOwner } from '@/lib/helpers'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    admin: ({ req }) => req.user?.role === "admin",
    read: isAdminOrOwner,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'deliveryDetails',
      type: 'array',
      fields: [
        {
          name: 'fullName',
          type: 'text',
        },
        {
          name: 'phoneNumber',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
          unique: true,
        },
      ],
      defaultValue: [],
    }
  ],
}
