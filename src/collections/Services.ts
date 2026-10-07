import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdmin, isAdminOrStaff, isPublicActive } from '../access/rbac'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'isActive'],
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
        try {
          revalidatePath('/')
        } catch {
          // Safe outside Next.js request context
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidatePath('/')
        } catch {
          // Safe outside Next.js request context
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      label: 'Service Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug',
      admin: {
        description: 'Unique URL identifier for this service (e.g. dental-implants, cosmetic-dentistry).',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 250,
      label: 'Short Overview',
      admin: {
        description: 'Concise summary displayed on service cards and navigation overviews (max 250 chars).',
      },
    },
    {
      name: 'patientBenefit',
      type: 'textarea',
      label: 'Patient Benefit',
      admin: {
        description: 'Key benefit to the patient (e.g. Protects against gum disease, freshens breath, and restores your natural, healthy shine).',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Full Clinical Description',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'iconName',
      type: 'text',
      label: 'Design System Icon Key',
      admin: {
        description: 'Icon identifier mapped in the clinic design system (e.g. tooth, smile, shield, clock).',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sort Order',
      admin: {
        position: 'sidebar',
        description: 'Controls display order on the website (lowest number first).',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active on Website',
      admin: {
        position: 'sidebar',
        description: 'Unchecking hides this service from public visitors while keeping it for administration.',
      },
    },
  ],
}
