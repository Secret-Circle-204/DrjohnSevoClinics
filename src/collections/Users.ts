import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isSelfOrAdmin } from '../access/rbac'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isSelfOrAdmin,
    update: isSelfOrAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        position: 'sidebar',
        description: 'Role-based access level. Only Admins can modify user roles.',
      },
    },
  ],
}
