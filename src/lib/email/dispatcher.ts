import type { Payload } from 'payload'
import {
  formatInquiryNotificationHtml,
  formatInquiryNotificationText,
  formatPatientConfirmationHtml,
  formatPatientConfirmationText,
} from './templates/inquiryNotification'

export const MAX_DELIVERY_ATTEMPTS = 3

/**
 * Calculates exponential backoff retry schedule:
 * - Attempt 1: Immediate on creation (attempts = 0 -> 1)
 * - Attempt 2: +5 minutes (attempts = 1 -> 2)
 * - Attempt 3: +30 minutes (attempts = 2 -> 3)
 */
export function calculateNextRetry(attempts: number): Date {
  const now = Date.now()
  if (attempts === 1) {
    return new Date(now + 5 * 60 * 1000) // +5 minutes
  }
  if (attempts === 2) {
    return new Date(now + 30 * 60 * 1000) // +30 minutes
  }
  return new Date(now + 60 * 60 * 1000) // +60 minutes fallback
}

/**
 * Determines whether an SMTP/network error is permanent (non-retryable).
 * Permanent errors fail immediately without burning remaining retry attempts.
 */
export function isPermanentSmtpError(error: any): boolean {
  if (!error) return false

  const message = String(error.message || error).toLowerCase()
  const code = String(error.code || '').toUpperCase()
  const responseCode = Number(error.responseCode) || 0

  // 1. Authentication / Credentials Rejected
  if (
    code === 'EAUTH' ||
    responseCode === 535 ||
    responseCode === 534 ||
    message.includes('invalid login') ||
    message.includes('authentication failed') ||
    message.includes('bad credentials') ||
    message.includes('username and password not accepted')
  ) {
    return true
  }

  // 2. Permanent Recipient Rejections (550, 551, 552, 553, 501)
  if (
    responseCode === 550 ||
    responseCode === 551 ||
    responseCode === 552 ||
    responseCode === 553 ||
    responseCode === 501 ||
    message.includes('recipient rejected') ||
    message.includes('invalid recipient') ||
    message.includes('mailbox unavailable') ||
    message.includes('user unknown') ||
    message.includes('syntax error in parameters')
  ) {
    return true
  }

  // 3. Invalid Configuration / Missing Addresses
  if (
    message.includes('no recipients defined') ||
    message.includes('no recipient') ||
    message.includes('invalid address')
  ) {
    return true
  }

  return false
}

/**
 * Queues an official inquiry reception notification into the EmailOutbox.
 * Guarantees idempotency via referenceId = inquiry-${inquiry.id}.
 * Does not block or fail the caller if queueing throws.
 */
export async function queueInquiryNotification(inquiry: any, payload: Payload): Promise<number | null> {
  if (!inquiry || !inquiry.id) {
    return null
  }

  const referenceId = `inquiry-${inquiry.id}`

  try {
    // 1. Idempotency Check: Prevent duplicate outbox rows for the same inquiry
    const existing = await payload.find({
      collection: 'email-outbox',
      where: {
        referenceId: {
          equals: referenceId,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      // Already queued or dispatched
      return existing.docs[0].id
    }

    // 2. Resolve Clinic Reception Email Address
    // Strictly from: (1) Primary Contact Email in Clinic Info Admin, or (2) CLINIC_RECEPTION_EMAIL in .env
    let recipientEmail: string | undefined
    let clinicInfo: any = null

    try {
      clinicInfo = await payload.findGlobal({
        slug: 'clinic-info',
        overrideAccess: true,
      })
      if (clinicInfo?.email && typeof clinicInfo.email === 'string' && clinicInfo.email.trim()) {
        recipientEmail = clinicInfo.email.trim()
      }
    } catch {
      // Global fetch fallback to env
    }

    if (!recipientEmail && process.env.CLINIC_RECEPTION_EMAIL && process.env.CLINIC_RECEPTION_EMAIL.trim()) {
      recipientEmail = process.env.CLINIC_RECEPTION_EMAIL.trim()
    }

    if (!recipientEmail) {
      payload.logger.error(
        `[EmailOutbox] Cannot queue inquiry notification for #${inquiry.id}: No reception email found. Please configure "Primary Contact Email" in Clinic Info or set CLINIC_RECEPTION_EMAIL in .env.`,
      )
      return null
    }

    // 3. Resolve Requested Service Title if referenced
    let serviceTitle: string | undefined
    if (inquiry.service) {
      if (typeof inquiry.service === 'object' && inquiry.service.title) {
        serviceTitle = inquiry.service.title
      } else if (typeof inquiry.service === 'number') {
        try {
          const serviceDoc = await payload.findByID({
            collection: 'services',
            id: inquiry.service,
            overrideAccess: true,
          })
          serviceTitle = serviceDoc?.title
        } catch {
          // Ignore service resolution failure
        }
      }
    }

    const formattedHours = clinicInfo?.openingHours?.length
      ? clinicInfo.openingHours.map((oh: any) => `${oh.days}: ${oh.hours}`).join(', ')
      : null

    // 4. Render Reception Email Template
    const templateData = {
      inquiryId: inquiry.id,
      fullName: inquiry.fullName,
      phone: inquiry.phone,
      email: inquiry.email,
      serviceTitle,
      preferredDate: inquiry.preferredDate,
      preferredTime: inquiry.preferredTime,
      message: inquiry.message,
      createdAt: inquiry.createdAt,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com',
      clinicName: clinicInfo?.clinicName || null,
    }

    const serviceSuffix = serviceTitle ? ` - ${serviceTitle}` : ''
    const subject = `[New Patient Inquiry] ${inquiry.fullName}${serviceSuffix} (#${inquiry.id})`
    const html = formatInquiryNotificationHtml(templateData)
    const text = formatInquiryNotificationText(templateData)

    // 5. Persist Reception Notification into EmailOutbox
    const outboxDoc = await payload.create({
      collection: 'email-outbox',
      data: {
        to: recipientEmail,
        subject,
        html,
        text,
        referenceId,
        status: 'pending',
        attempts: 0,
        nextRetryAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    // 6. Trigger non-blocking asynchronous dispatch for Reception Notification
    void dispatchOutboxRecord(outboxDoc.id, payload).catch((err) => {
      payload.logger.error(`[EmailOutbox] Background dispatch error for reception #${outboxDoc.id}: ${err?.message || err}`)
    })

    // 7. Patient Confirmation Email: Queue confirmation directly to patient
    if (inquiry.email && typeof inquiry.email === 'string' && inquiry.email.includes('@')) {
      const confirmationRefId = `inquiry-confirmation-${inquiry.id}`
      try {
        const existingConfirmation = await payload.find({
          collection: 'email-outbox',
          where: {
            referenceId: {
              equals: confirmationRefId,
            },
          },
          limit: 1,
          overrideAccess: true,
        })

        if (existingConfirmation.docs.length === 0) {
          const patientTemplateData = {
            inquiryId: inquiry.id,
            fullName: inquiry.fullName,
            email: inquiry.email.trim(),
            phone: inquiry.phone,
            serviceTitle,
            preferredDate: inquiry.preferredDate,
            preferredTime: inquiry.preferredTime,
            clinicPhone: clinicInfo?.phoneNumbers?.[0]?.number || null,
            clinicEmail: recipientEmail,
            clinicAddress: clinicInfo?.address || null,
            clinicHours: formattedHours,
            clinicName: clinicInfo?.clinicName || null,
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com',
          }

          const patientSubject = clinicInfo?.clinicName
            ? `Appointment Request Received — ${clinicInfo.clinicName} (#${inquiry.id})`
            : `Appointment Request Received (#${inquiry.id})`
          const patientHtml = formatPatientConfirmationHtml(patientTemplateData)
          const patientText = formatPatientConfirmationText(patientTemplateData)

          const patientDoc = await payload.create({
            collection: 'email-outbox',
            data: {
              to: inquiry.email.trim(),
              subject: patientSubject,
              html: patientHtml,
              text: patientText,
              referenceId: confirmationRefId,
              status: 'pending',
              attempts: 0,
              nextRetryAt: new Date().toISOString(),
            },
            overrideAccess: true,
          })

          void dispatchOutboxRecord(patientDoc.id, payload).catch((err) => {
            payload.logger.error(
              `[EmailOutbox] Background dispatch error for patient confirmation #${patientDoc.id}: ${err?.message || err}`,
            )
          })
        }
      } catch (confirmErr: any) {
        payload.logger.error(
          `[EmailOutbox] Failed to queue patient confirmation for inquiry #${inquiry.id}: ${confirmErr?.message || confirmErr}`,
        )
      }
    }

    return outboxDoc.id
  } catch (err: any) {
    payload.logger.error(`[EmailOutbox] Failed to queue inquiry notification for #${inquiry?.id}: ${err?.message || err}`)
    return null
  }
}

// In-process lock to prevent duplicate dispatch of the same outbox record concurrently
const activeDispatchLocks = new Set<number>()

/**
 * Atomically claims and dispatches an outbox record via Payload sendEmail.
 * Returns true if sent successfully, false otherwise.
 */
export async function dispatchOutboxRecord(outboxId: number, payload: Payload): Promise<boolean> {
  // 1. In-process concurrency guard
  if (activeDispatchLocks.has(outboxId)) {
    return false
  }
  activeDispatchLocks.add(outboxId)

  try {
    // 2. Database Concurrency Guard: Atomically claim the record by transitioning 'pending' -> 'processing'
    // In PostgreSQL, row-level locking ensures that concurrent PM2 worker processes cannot claim the same record
    let record: {
      id: number
      to: string
      subject: string
      html: string
      text?: string | null
      attempts: number
    } | null = null

    const dbPool = (payload.db as any)?.pool
    if (dbPool && typeof dbPool.query === 'function') {
      const res = await dbPool.query(
        `UPDATE "email_outbox" 
         SET "status" = 'processing', "updated_at" = NOW() 
         WHERE "id" = $1 AND "status" = 'pending' 
         RETURNING "id", "to", "subject", "html", "text", "attempts"`,
        [outboxId],
      )

      if (!res.rows || res.rows.length === 0) {
        return false
      }

      const row = res.rows[0]
      record = {
        id: row.id,
        to: row.to,
        subject: row.subject,
        html: row.html,
        text: row.text,
        attempts: Number(row.attempts || 0),
      }
    } else {
      const claim = await payload.update({
        collection: 'email-outbox',
        where: {
          id: {
            equals: outboxId,
          },
          status: {
            equals: 'pending',
          },
        },
        data: {
          status: 'processing',
        },
        overrideAccess: true,
      })

      if (!claim.docs || claim.docs.length === 0) {
        return false
      }

      const doc = claim.docs[0]
      record = {
        id: doc.id,
        to: doc.to,
        subject: doc.subject,
        html: doc.html,
        text: doc.text,
        attempts: Number(doc.attempts || 0),
      }
    }

    if (!record) {
      return false
    }

    // 3. Attempt SMTP Send via Payload configured email adapter
    try {
      await payload.sendEmail({
        to: record.to,
        subject: record.subject,
        html: record.html,
        text: record.text || undefined,
      })

      // 4. Success: Mark sent with timestamp
      await payload.update({
        collection: 'email-outbox',
        id: outboxId,
        data: {
          status: 'sent',
          sentAt: new Date().toISOString(),
          lastError: null,
        },
        overrideAccess: true,
      })

      return true
    } catch (sendError: any) {
      const errorMsg = sendError?.message || String(sendError)
      const currentAttempts = (record.attempts || 0) + 1
      const isPermanent = isPermanentSmtpError(sendError)

      // 5. Failure: Classify into permanent or retryable
      if (isPermanent || currentAttempts >= MAX_DELIVERY_ATTEMPTS) {
        // Permanent failure or max 3 attempts exhausted
        await payload.update({
          collection: 'email-outbox',
          id: outboxId,
          data: {
            status: 'failed',
            attempts: currentAttempts,
            lastError: errorMsg,
          },
          overrideAccess: true,
        })
      } else {
        // Transient retryable failure
        const nextRetry = calculateNextRetry(currentAttempts)
        await payload.update({
          collection: 'email-outbox',
          id: outboxId,
          data: {
            status: 'pending',
            attempts: currentAttempts,
            nextRetryAt: nextRetry.toISOString(),
            lastError: errorMsg,
          },
          overrideAccess: true,
        })
      }

      return false
    }
  } catch (err: any) {
    payload.logger.error(`[EmailOutbox] Fatal dispatch error for outbox #${outboxId}: ${err?.message || err}`)
    return false
  } finally {
    activeDispatchLocks.delete(outboxId)
  }
}

/**
 * Worker function: processes pending outbox records whose scheduled retry timestamp has arrived.
 */
export async function processPendingOutbox(payload: Payload, limit = 5): Promise<number> {
  const now = new Date()

  try {
    const pending = await payload.find({
      collection: 'email-outbox',
      where: {
        status: {
          equals: 'pending',
        },
        nextRetryAt: {
          less_than_equal: now,
        },
      },
      limit,
      sort: 'nextRetryAt',
      overrideAccess: true,
    })

    let processedCount = 0
    for (const doc of pending.docs) {
      const ok = await dispatchOutboxRecord(doc.id, payload)
      if (ok) {
        processedCount++
      }
    }

    return processedCount
  } catch (err: any) {
    payload.logger.error(`[EmailOutbox] Worker polling error: ${err?.message || err}`)
    return 0
  }
}
