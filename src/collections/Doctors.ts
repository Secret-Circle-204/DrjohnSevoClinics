import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdmin, isAdminOrStaff, isPublicActive } from '../access/rbac'

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'order', 'isActive'],
  },
  access: {
    read: isPublicActive,
    create: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/about')
      },
    ],
    afterDelete: [
      () => {
        revalidatePath('/about')
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Doctor Full Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Professional Title',
      admin: {
        description: 'Specialty designation (e.g. Lead Implantologist & Cosmetic Dentist).',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biography & Clinical Philosophy',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Doctor Portrait',
    },
    {
      name: 'specialties',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Associated Services',
    },
    {
      name: 'qualifications',
      type: 'array',
      label: 'Degrees & Certifications',
      fields: [
        {
          name: 'degree',
          type: 'text',
          required: true,
          label: 'Qualification / Fellowship',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Staff Member',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
