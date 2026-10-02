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
        try {
          revalidatePath('/about')
        } catch {
          // Safe outside Next.js request context (CLI, tests, seeds)
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story & Heritage',
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
          ],
        },
        {
          label: "Founder's Message",
          fields: [
            {
              name: 'founderTitle',
              type: 'text',
              label: "Founder's Message Title",
              defaultValue: 'A Word from the Founder',
            },
            {
              name: 'founderQuote',
              type: 'textarea',
              label: "Founder's Message Narrative",
            },
            {
              name: 'founderName',
              type: 'text',
              label: 'Founder Full Name',
              defaultValue: 'Dr. John Sevo Dawod',
            },
            {
              name: 'founderRole',
              type: 'text',
              label: 'Founder Professional Role',
              defaultValue: 'Founder & Medical Director',
            },
          ],
        },
        {
          label: 'Mission, Vision & Positioning',
          fields: [
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
              name: 'positioning',
              type: 'textarea',
              label: 'Strategic Clinic Positioning',
            },
          ],
        },
        {
          label: 'Core Values',
          fields: [
            {
              name: 'valuesTitle',
              type: 'text',
              label: 'Values & Vision Headline',
            },
            {
              name: 'coreValues',
              type: 'array',
              label: 'Core Value Pillars',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#CoreValueRowLabel',
                },
                description: 'The clinic fundamental values guiding clinical decisions and patient care.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Value Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Value Description',
                },
              ],
            },
          ],
        },
        {
          label: 'Philosophy & Innovation',
          fields: [
            {
              name: 'experienceNarrative',
              type: 'richText',
              label: 'Clinical Philosophy, Keys to Success & Innovation',
            },
          ],
        },
      ],
    },
  ],
}
