import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdminOrStaff } from '../access/rbac'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page Content',
  access: {
    read: () => true,
    update: isAdminOrStaff,
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
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero & Identity',
          fields: [
            {
              name: 'heroBadge',
              type: 'text',
              label: 'Hero Badge Text',
            },
            {
              name: 'heroTitle',
              type: 'text',
              required: true,
              label: 'Hero Main Title',
            },
            {
              name: 'heroSubtitle',
              type: 'text',
              label: 'Hero Subtitle Text',
            },
          ],
        },
        {
          label: 'Clinical Strengths',
          fields: [
            {
              name: 'whyChooseTitle',
              type: 'text',
              label: 'Strengths Section Title',
            },
            {
              name: 'whyChooseSubtitle',
              type: 'text',
              label: 'Why Choose Us Subtitle',
            },
            {
              name: 'whyChooseItems',
              type: 'array',
              label: 'Clinical Strengths List',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#PillarRowLabel',
                },
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
        {
          label: 'Trust & Statistics',
          fields: [
            {
              name: 'trustStats',
              type: 'array',
              label: 'Trust & Metric Highlights',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#TrustStatRowLabel',
                },
                description: 'Key clinic operational highlights and statistics.',
              },
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: 'Metric Value (e.g. 100%, 24/7)',
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Metric Label (e.g. Commitment to Care, Sterile Environment)',
                },
                {
                  name: 'iconKey',
                  type: 'select',
                  label: 'Icon Symbol',
                  options: [
                    { label: 'Users / Patients', value: 'users' },
                    { label: 'Star / Quality', value: 'star' },
                    { label: 'Award / Excellence', value: 'award' },
                    { label: 'Heart Handshake / Care', value: 'heartHandshake' },
                    { label: 'Shield / Safety & Sterilization', value: 'shield' },
                    { label: 'Clock / Accessibility', value: 'clock' },
                  ],
                  defaultValue: 'star',
                },
              ],
            },
          ],
        },
        {
          label: 'Call to Action',
          fields: [
            {
              name: 'ctaHeadline',
              type: 'text',
              label: 'Call to Action Title',
            },
            {
              name: 'ctaSubtitle',
              type: 'text',
              label: 'Call to Action Subtitle',
            },
          ],
        },
      ],
    },
  ],
}
