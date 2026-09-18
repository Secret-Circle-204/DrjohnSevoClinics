import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdminOrStaff } from '../access/rbac'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page Content',
  access: {
    read: () => true,
    update: isAdminOrStaff,
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/about')
      },
    ],
  },
  fields: [
    {
      name: 'storyTitle',
      type: 'text',
      label: 'About Story Headline',
    },
    {
      name: 'storyContent',
      type: 'richText',
      label: 'Clinic Heritage & Story',
    },
    {
      name: 'storyImage',
      type: 'upload',
      relationTo: 'media',
      label: 'About Story Image',
    },
    {
      name: 'valuesTitle',
      type: 'text',
      label: 'Values & Vision Headline',
    },
    {
      name: 'mission',
      type: 'textarea',
      label: 'Mission Statement',
    },
    {
      name: 'vision',
      type: 'textarea',
      label: 'Vision Statement',
    },
    {
      name: 'experienceNarrative',
      type: 'richText',
      label: 'Experience & Specialties Overview',
    },
  ],
}
