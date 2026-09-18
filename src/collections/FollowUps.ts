import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrStaff } from '../access/rbac'

const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['contacted', 'completed', 'cancelled'],
  contacted: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
}

export const FollowUps: CollectionConfig = {
  slug: 'follow-ups',
  admin: {
    useAsTitle: 'dueDate',
    defaultColumns: ['client', 'followUpType', 'dueDate', 'status', 'appointment'],
  },
  access: {
    // Strictly server-side administrative access in Phase 7
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

        // 1. Enforce Cancellation Reason when status is cancelled
        if (data.status === 'cancelled') {
          const reason = data.cancellationReason
          if (!reason || typeof reason !== 'string' || reason.trim() === '') {
            throw new APIError(
              'cancellationReason is required when cancelling a follow-up.',
              400,
            )
          }
        }

        // 2. Enforce Lifecycle State Transitions on update
        if (operation === 'update' && originalDoc) {
          const currentStatus = originalDoc.status as string
          const targetStatus = data.status as string | undefined

          if (targetStatus && targetStatus !== currentStatus) {
            const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || []
            if (!allowed.includes(targetStatus)) {
              throw new APIError(
                `Invalid follow-up status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowed.join(', ') || 'none (terminal state)'}].`,
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

    // 2. Related Appointment Relationship (Optional Phase 7 Design Decision)
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

    // 3. Due Date (Operational Target Date - Descriptive Metadata, NOT a Scheduler)
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      index: true,
      label: 'Due Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Target date for the follow-up interaction. Purely operational metadata.',
      },
    },

    // 4. Follow-Up Type (Operational Vocabulary)
    {
      name: 'followUpType',
      type: 'select',
      required: true,
      defaultValue: 'clinical_check',
      label: 'Follow-Up Type',
      options: [
        { label: 'Clinical Check / Evaluation', value: 'clinical_check' },
        { label: 'Suture Removal', value: 'suture_removal' },
        { label: 'Treatment Review', value: 'treatment_review' },
        { label: 'Routine Dental Recall', value: 'routine_recall' },
        { label: 'Administrative Follow-Up', value: 'administrative' },
      ],
      admin: {
        description: 'Operational classification of the follow-up action.',
      },
    },

    // 5. Follow-Up Status (Server-Enforced Lifecycle)
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      label: 'Follow-Up Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Server-enforced operational lifecycle state.',
      },
    },

    // 6. Operational Administrative Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Operational Notes',
      admin: {
        description: 'Administrative and operational notes regarding this follow-up.',
      },
    },

    // 7. Operational Outcome (Interaction Result ONLY - NOT a clinical record)
    {
      name: 'outcome',
      type: 'textarea',
      label: 'Operational Outcome',
      admin: {
        description:
          'Operational result of the contact/interaction. Must not be used for clinical diagnoses or medical records.',
      },
    },

    // 8. Cancellation Reason (Required when status is cancelled)
    {
      name: 'cancellationReason',
      type: 'textarea',
      label: 'Cancellation Reason',
      admin: {
        condition: (data) => data?.status === 'cancelled',
        description: 'Mandatory documentation when follow-up is cancelled.',
      },
    },
  ],
}
