import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdminOrStaff } from '../access/rbac'

export const ClinicInfo: GlobalConfig = {
  slug: 'clinic-info',
  label: 'Clinic Information & Contact',
  access: {
    read: () => true,
    update: isAdminOrStaff,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'layout')
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
          label: 'General Information',
          fields: [
            {
              name: 'clinicName',
              type: 'text',
              required: true,
              defaultValue: 'Dr. John Sevo Dental Clinic & Aesthetics',
              label: 'Official Clinic Name',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Primary Contact Email',
            },
            {
              name: 'address',
              type: 'text',
              label: 'Physical Clinic Address',
            },
            {
              name: 'locationOnMap',
              type: 'text',
              label: 'Location on Map (URL or Embed)',
              admin: {
                description: 'Google Maps embed link or directions URL.',
              },
            },
          ],
        },
        {
          label: 'Phone Directory',
          fields: [
            {
              name: 'phoneNumbers',
              type: 'array',
              label: 'Contact Numbers',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#PhoneRowLabel',
                },
              },
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  label: 'Phone Number',
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label (e.g. Main Reception, WhatsApp, Emergency)',
                },
              ],
            },
          ],
        },
        {
          label: 'Operating Hours',
          fields: [
            {
              name: 'openingHours',
              type: 'array',
              label: 'Weekly Opening Hours',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#OpeningHoursRowLabel',
                },
              },
              fields: [
                {
                  name: 'days',
                  type: 'text',
                  required: true,
                  label: 'Days of Week (e.g. Monday - Friday)',
                },
                {
                  name: 'hours',
                  type: 'text',
                  required: true,
                  label: 'Operating Hours (e.g. 9:00 AM - 8:00 PM)',
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Official Social Media Links',
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/RowLabels#SocialLinkRowLabel',
                },
              },
              fields: [
                {
                  name: 'platform',
                  type: 'text',
                  required: true,
                  label: 'Platform (e.g. Instagram, Facebook, YouTube, LinkedIn)',
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Profile URL',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
