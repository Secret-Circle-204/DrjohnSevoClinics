import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrStaff } from '../access/rbac'

const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
}

export const Consultations: CollectionConfig = {
  slug: 'consultations',
  admin: {
    useAsTitle: 'consultationDate',
    defaultColumns: ['client', 'doctor', 'consultationType', 'consultationDate', 'status'],
  },
  access: {
    // Strictly server-side administrative access in Phase 8
    // Public visitors have ZERO access (create, read, update, delete)
    create: isAdminOrStaff,
    read: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin, // Hard deletion is strictly restricted to Admin
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc, operation }) => {
        if (!data) return data

        // 1. Enforce Cancellation Reason when status is cancelled (both create and update)
        if (data.status === 'cancelled') {
          const reason = data.cancellationReason
          if (!reason || typeof reason !== 'string' || reason.trim() === '') {
            throw new APIError(
              'cancellationReason is required when cancelling a consultation.',
              400,
            )
          }
        }

        // 2. Enforce Lifecycle State Machine on update
        if (operation === 'update' && originalDoc) {
          const currentStatus = originalDoc.status as string
          const targetStatus = data.status as string | undefined

          if (targetStatus && targetStatus !== currentStatus) {
            const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || []
            if (!allowed.includes(targetStatus)) {
              throw new APIError(
                `Invalid consultation status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowed.join(', ') || 'none (terminal state)'}].`,
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
    // 1. Patient Relationship (Mandatory)
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

    // 2. Attending Doctor Relationship (Optional)
    {
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      required: false,
      index: true,
      label: 'Attending Doctor',
      admin: {
        description: 'Attending dentist or specialist who conducted the consultation.',
      },
    },

    // 3. Related Appointment Relationship (Optional)
    {
      name: 'appointment',
      type: 'relationship',
      relationTo: 'appointments',
      required: false,
      index: true,
      label: 'Related Appointment',
      admin: {
        description: 'Associated appointment encounter context (optional).',
      },
    },

    // 4. Consultation Date (Operational Target Date - Required)
    {
      name: 'consultationDate',
      type: 'date',
      required: true,
      index: true,
      label: 'Consultation Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Date the clinical examination was performed.',
      },
    },

    // 5. Consultation Type (Operational Clinical Vocabulary)
    {
      name: 'consultationType',
      type: 'select',
      required: true,
      defaultValue: 'initial_examination',
      label: 'Consultation Type',
      options: [
        { label: 'Initial Examination', value: 'initial_examination' },
        { label: 'Comprehensive Evaluation', value: 'comprehensive_evaluation' },
        { label: 'Treatment Planning Session', value: 'treatment_planning' },
        { label: 'Specialist Consultation', value: 'specialist_consult' },
        { label: 'Clinical Review / Check-up', value: 'clinical_review' },
      ],
      admin: {
        description: 'Operational classification of the clinical consultation.',
      },
    },

    // 6. Consultation Status (Server-Enforced Lifecycle)
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      label: 'Consultation Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Server-enforced operational lifecycle state.',
      },
    },

    // 7. Chief Complaint (Patient's Stated Concern)
    {
      name: 'chiefComplaint',
      type: 'textarea',
      label: 'Chief Complaint',
      admin: {
        description: "Patient's primary stated concern or reason for visit.",
      },
    },

    // 8. Clinical Notes (General intraoral findings & examination notes)
    {
      name: 'clinicalNotes',
      type: 'textarea',
      label: 'Clinical Examination Notes',
      admin: {
        description: 'General clinical examination observations and intraoral findings.',
      },
    },

    // 9. Recommendations & Proposed Plan (Verbal clinical recommendations)
    {
      name: 'recommendations',
      type: 'textarea',
      label: 'Recommendations & Proposed Plan',
      admin: {
        description: 'Verbal clinical recommendations and treatment plan outline discussed with the patient.',
      },
    },

    // 10. Cancellation Reason (Required when status is cancelled)
    {
      name: 'cancellationReason',
      type: 'textarea',
      label: 'Cancellation Reason',
      admin: {
        condition: (data) => data?.status === 'cancelled',
        description: 'Mandatory documentation when consultation is cancelled.',
      },
    },
  ],
}
