import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrStaff } from '../access/rbac'

export const EmailOutbox: CollectionConfig = {
  slug: 'email-outbox',
  labels: {
    singular: 'Email Outbox',
    plural: 'Email Outbox',
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['to', 'subject', 'status', 'attempts', 'nextRetryAt', 'sentAt', 'referenceId'],
    description: 'Internal transactional email delivery outbox for reliable, durable, and retryable email notifications.',
  },
  access: {
    // Strictly internal operational collection - ZERO public access
    create: isAdminOrStaff,
    read: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin,
  },
  fields: [
    // 1. Recipient Address
    {
      name: 'to',
      type: 'text',
      required: true,
      label: 'Recipient Email',
      admin: {
        description: 'Destination email address.',
      },
    },
    // 2. Email Subject
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subject Line',
    },
    // 3. HTML Content
    {
      name: 'html',
      type: 'textarea',
      required: true,
      label: 'HTML Message Content',
    },
    // 4. Plain Text Fallback
    {
      name: 'text',
      type: 'textarea',
      label: 'Plain Text Fallback',
    },
    // 5. Reference / Idempotency Identifier
    {
      name: 'referenceId',
      type: 'text',
      index: true,
      unique: true,
      label: 'Reference / Idempotency Key',
      admin: {
        description: 'Unique business event reference (e.g. inquiry-123) to prevent duplicate delivery.',
      },
    },
    // 6. Delivery Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      label: 'Delivery Status',
      options: [
        { label: 'Pending / Queued', value: 'pending' },
        { label: 'Processing (In-Flight)', value: 'processing' },
        { label: 'Sent (Successfully Delivered)', value: 'sent' },
        { label: 'Failed (Terminal Error)', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // 7. Delivery Attempts Counter
    {
      name: 'attempts',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Attempts Count',
      admin: {
        position: 'sidebar',
        description: 'Number of SMTP transmission attempts made (max: 3).',
      },
    },
    // 8. Last Error Message
    {
      name: 'lastError',
      type: 'textarea',
      label: 'Last Recorded Error',
      admin: {
        description: 'Error diagnostics recorded from the last failed delivery attempt.',
      },
    },
    // 9. Next Scheduled Retry
    {
      name: 'nextRetryAt',
      type: 'date',
      index: true,
      label: 'Next Retry Scheduled',
      admin: {
        position: 'sidebar',
        description: 'Scheduled timestamp for the next automated retry attempt.',
      },
    },
    // 10. Sent At Timestamp
    {
      name: 'sentAt',
      type: 'date',
      label: 'Sent Timestamp',
      admin: {
        position: 'sidebar',
        description: 'Timestamp when the message was successfully accepted by SMTP.',
      },
    },
  ],
}
