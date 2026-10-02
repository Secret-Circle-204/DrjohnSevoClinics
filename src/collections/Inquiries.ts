import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrStaff } from '../access/rbac'
import { queueInquiryNotification } from '../lib/email/dispatcher'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'service', 'preferredDate', 'status', 'createdAt'],
  },
  access: {
    // Public visitors can submit appointment inquiries from the website
    create: () => true,
    // Strictly ZERO public read access - only authorized clinic admin/staff can read patient leads
    read: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            await queueInquiryNotification(doc, req.payload)
          } catch (err: any) {
            req.payload.logger.error(`[Inquiries] Error in afterChange email hook: ${err?.message || err}`)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Patient Full Name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Requested Service',
    },
    {
      name: 'preferredDate',
      type: 'date',
      label: 'Preferred Appointment Date',
    },
    {
      name: 'preferredTime',
      type: 'select',
      label: 'Preferred Time of Day',
      options: [
        { label: 'Morning (9:00 AM - 1:00 PM)', value: 'morning' },
        { label: 'Afternoon (1:00 PM - 5:00 PM)', value: 'afternoon' },
        { label: 'Evening (5:00 PM - 9:00 PM)', value: 'evening' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Patient Concerns / Notes',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Inquiry Status',
      options: [
        { label: 'New (Uncontacted)', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Scheduled into Clinic', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Tracking status for clinic reception and staff.',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Clinic Staff Private Notes',
      admin: {
        position: 'sidebar',
        description: 'Internal administrative communication regarding this patient inquiry.',
      },
    },
  ],
}
