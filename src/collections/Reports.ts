import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrStaff } from '../access/rbac'

const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['finalized', 'cancelled'],
  finalized: [], // Terminal state
  cancelled: [], // Terminal state
}

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'doctor', 'reportType', 'reportDate', 'status'],
  },
  access: {
    // Strictly server-side administrative access in Phase 9
    // Public visitors have ZERO access (create, read, update, delete)
    create: isAdminOrStaff,
    read: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin, // Hard deletion is strictly restricted to Admin
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc, operation, req }) => {
        if (!data) return data

        // 1. Enforce Cancellation Reason when status is cancelled (both create and update)
        if (data.status === 'cancelled') {
          const reason = data.cancellationReason
          if (!reason || typeof reason !== 'string' || reason.trim() === '') {
            throw new APIError(
              'cancellationReason is required when cancelling a report.',
              400,
            )
          }
        }

        // 2. Enforce Lifecycle State Machine & Staff Finalized Protection on update
        if (operation === 'update' && originalDoc) {
          const currentStatus = originalDoc.status as string
          const targetStatus = data.status as string | undefined

          // Non-admin staff cannot modify a finalized report
          if (currentStatus === 'finalized' && req?.user && req.user.role !== 'admin') {
            throw new APIError(
              'Staff cannot modify finalized reports.',
              403,
            )
          }

          if (targetStatus && targetStatus !== currentStatus) {
            const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || []
            if (!allowed.includes(targetStatus)) {
              throw new APIError(
                `Invalid report status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowed.join(', ') || 'none (terminal state)'}].`,
                400,
              )
            }
          }
        }

        return data
      },
    ],
  },
  fields: [
    // 1. Document Title (Mandatory)
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Report Title',
      admin: {
        description: 'Official document title (e.g. Comprehensive Periodontal Assessment, Specialist Referral).',
      },
    },

    // 2. Patient Relationship (Mandatory)
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      index: true,
      label: 'Patient (Client)',
      access: {
        update: isAdminFieldLevel, // Once created, reassigning to another client requires Admin
      },
      admin: {
        description: 'Authoritative patient identity record.',
      },
    },

    // 3. Attending / Authoring Doctor Relationship (Optional)
    {
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      required: false,
      index: true,
      label: 'Attending / Authoring Doctor',
      admin: {
        description: 'Dentist or specialist issuing the report (optional).',
      },
    },

    // 4. Associated Consultation Relationship (Optional)
    {
      name: 'consultation',
      type: 'relationship',
      relationTo: 'consultations',
      required: false,
      index: true,
      label: 'Associated Consultation',
      admin: {
        description: 'Originating clinical consultation encounter (optional).',
      },
    },

    // 5. Associated Appointment Relationship (Optional)
    {
      name: 'appointment',
      type: 'relationship',
      relationTo: 'appointments',
      required: false,
      index: true,
      label: 'Associated Appointment',
      admin: {
        description: 'Associated appointment encounter context (optional).',
      },
    },

    // 6. Report Issuance Date (Mandatory)
    {
      name: 'reportDate',
      type: 'date',
      required: true,
      index: true,
      label: 'Report Issuance Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Official date of report issuance.',
      },
    },

    // 7. Report Classification (Strictly clinical_summary or referral_letter in Phase 9)
    {
      name: 'reportType',
      type: 'select',
      required: true,
      defaultValue: 'clinical_summary',
      index: true,
      label: 'Report Classification',
      options: [
        { label: 'Clinical Summary', value: 'clinical_summary' },
        { label: 'Referral Letter', value: 'referral_letter' },
      ],
      admin: {
        description: 'Official classification of the document.',
      },
    },

    // 8. Report Status (Server-Enforced Lifecycle)
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      label: 'Report Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Finalized', value: 'finalized' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Server-enforced operational lifecycle state.',
      },
    },

    // 9. Official Report Summary / Text
    {
      name: 'summary',
      type: 'textarea',
      label: 'Official Report Summary / Content',
      admin: {
        description: 'Official text, findings summary, or clinical statement.',
      },
    },

    // 10. Document Attachment (Optional relationship to existing Media collection)
    {
      name: 'attachment',
      type: 'relationship',
      relationTo: 'media',
      required: false,
      label: 'Document Attachment',
      admin: {
        description: 'Optional uploaded document or official signed PDF file.',
      },
    },

    // 11. Cancellation Reason (Required when status is cancelled)
    {
      name: 'cancellationReason',
      type: 'textarea',
      label: 'Cancellation Reason',
      admin: {
        condition: (data) => data?.status === 'cancelled',
        description: 'Mandatory documentation when report is cancelled.',
      },
    },
  ],
}
