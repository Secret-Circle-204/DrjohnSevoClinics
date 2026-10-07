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
          revalidatePath('/')
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
              label: 'About Story Title',
            },
            {
              name: 'storySummary',
              type: 'textarea',
              label: 'Clinic Overview Narrative',
              admin: {
                description:
                  'Executive narrative and overview used across the clinic presentation.',
              },
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
              label: 'Core Values Section Title',
            },
            {
              name: 'coreValues',
              type: 'array',
              label: 'Core Values List',
              admin: {
                components: {
                  Field: '@/components/admin/DrawerArrayField#DrawerArrayField',
                },
                description: 'The clinic fundamental values guiding clinical decisions and patient care. Click any card to edit details in the side drawer.',
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
              name: 'philosophyContent',
              type: 'richText',
              label: 'Our Philosophy Content',
            },
            {
              name: 'keysToSuccessContent',
              type: 'richText',
              label: 'Keys to Our Success Content',
            },
            {
              name: 'keysToSuccessCulmination',
              type: 'text',
              label: 'Keys to Success — Culmination Outcome',
              defaultValue: 'Principles of Clinical Excellence',
            },
            {
              name: 'keysToSuccessPillars',
              type: 'array',
              label: 'Keys to Success — Interactive Equation Pillars',
              admin: {
                components: {
                  Field: '@/components/admin/DrawerArrayField#DrawerArrayField',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Pillar Principle Title',
                },
              ],
            },
            {
              name: 'rdContent',
              type: 'richText',
              label: 'Research & Development Content',
            },
            {
              name: 'humanCapitalContent',
              type: 'richText',
              label: 'Human Capital Content',
            },
          ],
        },
        {
          label: 'Clinical Strengths',
          fields: [
            {
              name: 'strengthsTitle',
              type: 'text',
              label: 'Clinical Strengths Title',
              defaultValue: 'Our Strengths',
            },
            {
              name: 'clinicalStrengths',
              type: 'array',
              label: 'Clinical Strengths List',
              admin: {
                components: {
                  Field: '@/components/admin/DrawerArrayField#DrawerArrayField',
                },
                description:
                  'The 9 core clinical strengths of Dr. John Sevo Dawod Clinics. Click any card to edit details in the side drawer.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Strength Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Strength Description',
                },
                {
                  name: 'iconName',
                  type: 'text',
                  label: 'Design System Icon Key',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
