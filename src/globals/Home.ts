import type { GlobalConfig } from 'payload'
import { isAdminOrStaff } from '../access/rbac'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page Content',
  access: {
    read: () => true,
    update: isAdminOrStaff,
  },
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
    {
      name: 'beforeAfterCases',
      type: 'array',
      label: 'Before & After Photo Showcase Cases',
      admin: {
        description: 'Curated clinical case photos demonstrating before and after dental results.',
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
}
