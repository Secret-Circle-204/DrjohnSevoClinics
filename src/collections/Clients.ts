import type { CollectionConfig } from 'payload'
import {
  isAdmin,
  isAdminFieldLevel,
  isAdminOrStaff,
  isAdminOrStaffFieldLevel,
} from '../access/rbac'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'email', 'status', 'createdAt'],
  },
  access: {
    // Strictly server-side administrative access in Phase 5
    // Public visitors have ZERO access (create, read, update, delete)
    create: isAdminOrStaff,
    read: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin,
  },
  fields: [
    // 1. Core Patient Identity & Contact Information
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Patient Full Name',
      access: {
        update: isAdminOrStaffFieldLevel,
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      index: true, // Indexed for rapid staff lookup; NOT unique per clinic requirements
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      // NOT unique to allow family members to share email addresses
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Date of Birth',
      access: {
        update: isAdminOrStaffFieldLevel,
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      label: 'Gender',
      access: {
        update: isAdminOrStaffFieldLevel,
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Residential Address',
    },
    {
      name: 'emergencyContact',
      type: 'group',
      label: 'Emergency Contact',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Contact Name',
        },
        {
          name: 'relationship',
          type: 'text',
          label: 'Relationship',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Contact Phone',
        },
      ],
    },

    // 2. Clinic Administrative State & Notes (Clinic-controlled)
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
      access: {
        update: isAdminOrStaffFieldLevel,
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Administrative Clinic Notes',
      admin: {
        position: 'sidebar',
        description:
          'Administrative and operational clinic notes only. Strictly hidden from patient.',
      },
      access: {
        read: isAdminOrStaffFieldLevel,
        update: isAdminOrStaffFieldLevel,
      },
    },

    // 3. User Authentication Relationship (Optional, 1-to-1)
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      unique: true,
      label: 'Linked User Account',
      admin: {
        position: 'sidebar',
        description: 'Optional web authentication account.',
      },
      access: {
        update: isAdminFieldLevel,
      },
    },

    // 4. Notification Preferences (Storage Only - Section 28)
    {
      name: 'notificationPreferences',
      type: 'group',
      label: 'Notification Preferences',
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Email Notifications',
        },
        {
          name: 'dashboardNotifications',
          type: 'checkbox',
          defaultValue: true,
          label: 'In-Portal Notifications',
        },
      ],
    },
  ],
}
