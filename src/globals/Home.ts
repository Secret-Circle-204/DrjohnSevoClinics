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
              label: 'Hero Main Headline',
            },
            {
              name: 'heroSubtitle',
              type: 'text',
              label: 'Hero Subtitle Text',
            },
          ],
        },
        {
          label: 'Overview & Strengths',
          fields: [
            {
              name: 'overviewTitle',
              type: 'text',
              label: 'Clinic Overview Headline',
            },
            {
              name: 'overviewText',
              type: 'textarea',
              label: 'Clinic Overview Narrative',
            },
            {
              name: 'overviewImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Clinic Overview Photo',
            },
            {
              name: 'whyChooseTitle',
              type: 'text',
              label: 'Why Choose Us Headline',
            },
            {
              name: 'whyChooseSubtitle',
              type: 'text',
              label: 'Why Choose Us Subtitle',
            },
            {
              name: 'whyChooseItems',
              type: 'array',
              label: 'Why Choose Us Value Pillars',
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
                  label: 'Pillar Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Pillar Description',
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
                description: 'Verified operational statistics or clinic metrics. If empty, the statistics bar remains non-promissory or displays verified defaults.',
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
          label: 'Before & After Cases',
          fields: [
            {
              name: 'beforeAfterCases',
              type: 'array',
              label: 'Before & After Photo Showcase Cases',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#CaseRowLabel',
                },
                description: 'Curated clinical case photos demonstrating before and after dental results. Click row to edit case details.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Case Title',
                },
                {
                  name: 'beforeImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Before Treatment Image',
                },
                {
                  name: 'afterImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'After Treatment Image',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Case Summary Note',
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
              label: 'Call to Action Headline',
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
