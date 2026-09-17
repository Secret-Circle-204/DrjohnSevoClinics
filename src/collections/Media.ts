import type { CollectionConfig } from 'payload'
import { isAdminOrStaff, isPublicOrStaffMedia } from '../access/rbac'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'visibility', 'createdAt'],
  },
  access: {
    read: isPublicOrStaffMedia,
    create: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdminOrStaff,
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Descriptive alternative text for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public (Website visitors can view)', value: 'public' },
        { label: 'Private (Admin & Staff only)', value: 'private' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Access visibility. Private files are guarded server-side against public access.',
      },
    },
  ],
}
