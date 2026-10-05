import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdmin, isAdminOrStaff } from '../access/rbac'

export const Transformations: CollectionConfig = {
  slug: 'transformations',
  labels: {
    singular: 'Transformation',
    plural: 'Transformations',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isFeatured', 'displayOrder', 'createdAt'],
    pagination: {
      defaultLimit: 10,
      limits: [10, 25, 50],
    },
    group: 'Content',
    description: 'Documented clinical before-and-after smile transformations and patient results.',
  },
  access: {
    read: () => true,
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
          // Safe outside Next.js request context (CLI, tests, seeds)
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidatePath('/')
        } catch {
          // Safe outside Next.js request context (CLI, tests, seeds)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Case Title',
      admin: {
        placeholder: 'e.g. Full Arch Ceramic Rehabilitation',
      },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Before Treatment Image',
      admin: {
        description: 'Clinical photograph before procedure.',
      },
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'After Treatment Image',
      admin: {
        description: 'Clinical photograph after procedure / final aesthetic result.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Case Summary Note / Clinical Description',
      admin: {
        description: 'Brief non-confidential description of the clinical treatment and aesthetic outcome.',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Feature on Homepage Theatre',
      admin: {
        position: 'sidebar',
        description: 'When checked, this transformation is prioritized in the featured homepage theatre showcase.',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order Sequence',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers display first (e.g. 0, 1, 2...).',
      },
    },
  ],
}
