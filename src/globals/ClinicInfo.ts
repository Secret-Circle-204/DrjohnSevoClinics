import type { GlobalConfig } from 'payload'
import { isAdminOrStaff } from '../access/rbac'

export const ClinicInfo: GlobalConfig = {
  slug: 'clinic-info',
  label: 'Clinic Information & Contact',
  access: {
    read: () => true,
    update: isAdminOrStaff,
  },
  fields: [
    {
      name: 'clinicName',
      type: 'text',
      required: true,
      defaultValue: 'Dr. John Sevo Dental Clinic & Aesthetics',
      label: 'Official Clinic Name',
    },
    {
      name: 'phoneNumbers',
      type: 'array',
      label: 'Contact Numbers',
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
    {
      name: 'openingHours',
      type: 'array',
      label: 'Weekly Opening Hours',
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
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Official Social Media Links',
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
}
