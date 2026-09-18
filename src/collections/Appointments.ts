import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrStaff } from '../access/rbac'

const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  scheduled: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled', 'no_show'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
  no_show: [],   // Terminal state
}

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'dateTime',
    defaultColumns: ['client', 'dateTime', 'doctor', 'status', 'appointmentType'],
  },
  access: {
    // Strictly server-side administrative access in Phase 6
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
              'cancellationReason is required when cancelling an appointment.',
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
                `Invalid appointment status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowed.join(', ') || 'none (terminal state)'}].`,
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

    // 2. Attending Doctor Relationship (Optional until confirmed/assigned)
    {
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      required: false,
      index: true,
      label: 'Attending Doctor',
      admin: {
        description: 'Assigned specialist or attending dentist (optional until scheduled).',
      },
    },

    // 3. Clinical Service / Procedure Context (Optional)
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: false,
      label: 'Clinical Service / Procedure',
      admin: {
        description: 'Associated clinical service context (optional).',
      },
    },

    // 4. Appointment Date & Time
    {
      name: 'dateTime',
      type: 'date',
      required: true,
      index: true,
      label: 'Appointment Date & Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // 5. Appointment Type (Operational Vocabulary)
    {
      name: 'appointmentType',
      type: 'select',
      required: true,
      defaultValue: 'consultation',
      label: 'Appointment Type',
      options: [
        { label: 'Initial Consultation', value: 'consultation' },
        { label: 'Dental Treatment / Procedure', value: 'treatment' },
        { label: 'Post-Procedure Follow-Up', value: 'followup' },
        { label: 'Routine Check-Up & Cleaning', value: 'routine_checkup' },
        { label: 'Emergency Dental Care', value: 'emergency' },
      ],
      admin: {
        description: 'Initial operational visit classification.',
      },
    },

    // 6. Appointment Status (Server-Enforced Lifecycle)
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      index: true,
      label: 'Appointment Status',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No-Show', value: 'no_show' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Server-enforced operational lifecycle state.',
      },
    },

    // 7. Duration (Operational Metadata - Does NOT prevent scheduling conflicts)
    {
      name: 'duration',
      type: 'number',
      defaultValue: 30,
      label: 'Estimated Duration (Minutes)',
      admin: {
        position: 'sidebar',
        description:
          'Operational appointment metadata (does not prevent scheduling conflicts).',
      },
    },

    // 8. Operational Visit Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Operational Visit Notes',
      admin: {
        description: 'Administrative and operational notes for the encounter.',
      },
    },

    // 9. Cancellation Reason (Required when status is cancelled)
    {
      name: 'cancellationReason',
      type: 'textarea',
      label: 'Cancellation Reason',
      admin: {
        condition: (data) => data?.status === 'cancelled',
        description: 'Mandatory documentation when appointment is cancelled.',
      },
    },

    // 10. Follow-Up Requirements
    {
      name: 'followUpRequired',
      type: 'checkbox',
      defaultValue: false,
      label: 'Follow-Up Required',
      admin: {
        position: 'sidebar',
        description: 'Flag indicating post-encounter follow-up action is needed.',
      },
    },
    {
      name: 'followUpNotes',
      type: 'textarea',
      label: 'Follow-Up Instructions / Requirements',
      admin: {
        condition: (data) => Boolean(data?.followUpRequired),
        description: 'Clinical or administrative follow-up instructions.',
      },
    },
  ],
}
