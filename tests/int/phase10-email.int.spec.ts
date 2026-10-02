import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest'
import {
  queueInquiryNotification,
  dispatchOutboxRecord,
  processPendingOutbox,
  isPermanentSmtpError,
} from '@/lib/email/dispatcher'

let payload: Payload
const createdInquiryIds: number[] = []
const createdOutboxIds: number[] = []

describe('Phase 10 — Production Email Delivery Foundation Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    // Clean up created test outbox records
    for (const id of createdOutboxIds) {
      try {
        await payload.delete({
          collection: 'email-outbox',
          id,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }

    // Clean up created test inquiries
    for (const id of createdInquiryIds) {
      try {
        await payload.delete({
          collection: 'inquiries',
          id,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }
  })

  it('1: Nodemailer adapter initializes correctly with configured default sender', () => {
    expect(payload.email).toBeDefined()
    expect(payload.email.defaultFromAddress).toBeDefined()
    expect(payload.email.defaultFromName).toContain('Dr. John Sevo')
    expect(typeof payload.sendEmail).toBe('function')
  })

  it('2: Creating an Inquiry triggers hook and creates reception and patient confirmation EmailOutbox records', async () => {
    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        fullName: 'Phase 10 Test Patient',
        phone: '+971505556677',
        email: 'patient.phase10@example.com',
        preferredTime: 'morning',
        status: 'new',
        message: 'Looking for a comprehensive smile makeover consultation.',
      },
      overrideAccess: true,
    })
    createdInquiryIds.push(inquiry.id)

    // Verify Reception EmailOutbox record was created by the hook
    const receptionOutboxDocs = await payload.find({
      collection: 'email-outbox',
      where: {
        referenceId: {
          equals: `inquiry-${inquiry.id}`,
        },
      },
      overrideAccess: true,
    })

    expect(receptionOutboxDocs.docs.length).toBe(1)
    const receptionRecord = receptionOutboxDocs.docs[0]
    expect(receptionRecord.subject).toContain('New Patient Inquiry')
    expect(receptionRecord.subject).toContain('Phase 10 Test Patient')
    expect(receptionRecord.html).toContain('Phase 10 Test Patient')
    expect(receptionRecord.html).toContain('+971505556677')
    expect(receptionRecord.referenceId).toBe(`inquiry-${inquiry.id}`)
    createdOutboxIds.push(receptionRecord.id)

    // Verify Patient Confirmation EmailOutbox record was created by the hook
    const confirmationOutboxDocs = await payload.find({
      collection: 'email-outbox',
      where: {
        referenceId: {
          equals: `inquiry-confirmation-${inquiry.id}`,
        },
      },
      overrideAccess: true,
    })

    expect(confirmationOutboxDocs.docs.length).toBe(1)
    const confirmationRecord = confirmationOutboxDocs.docs[0]
    expect(confirmationRecord.to).toBe('patient.phase10@example.com')
    expect(confirmationRecord.subject).toContain('Appointment Request Received')
    expect(confirmationRecord.html).toContain('Dear Phase 10 Test Patient')
    expect(confirmationRecord.referenceId).toBe(`inquiry-confirmation-${inquiry.id}`)
    createdOutboxIds.push(confirmationRecord.id)
  })

  it('3: EmailOutbox record starts as pending with attempts = 0', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Fresh Queued Notification',
        html: '<p>Freshly queued message content.</p>',
        referenceId: 'test-pending-start-check',
        status: 'pending',
        attempts: 0,
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    expect(outbox.status).toBe('pending')
    expect(outbox.attempts).toBe(0)
    expect(outbox.sentAt).toBeFalsy()
    expect(outbox.lastError).toBeFalsy()
  })

  it('4: Duplicate processing of the same Inquiry does NOT create duplicate outbox records (Idempotency)', async () => {
    const testInquiryId = 999901
    const inquiryStub = {
      id: testInquiryId,
      fullName: 'Idempotency Patient Test',
      phone: '+971501112233',
      email: 'idempotent@example.com',
    }

    // First queue call
    const firstOutboxId = await queueInquiryNotification(inquiryStub, payload)
    expect(firstOutboxId).toBeDefined()
    if (firstOutboxId) createdOutboxIds.push(firstOutboxId)

    // Second duplicate queue call for the exact same inquiry
    const secondOutboxId = await queueInquiryNotification(inquiryStub, payload)

    // Returns the exact same outbox ID without inserting a duplicate
    expect(secondOutboxId).toBe(firstOutboxId)

    // Verify only 1 record exists in the database
    const countDocs = await payload.find({
      collection: 'email-outbox',
      where: {
        referenceId: {
          equals: `inquiry-${testInquiryId}`,
        },
      },
      overrideAccess: true,
    })

    expect(countDocs.docs.length).toBe(1)
  })

  it('5: Successful SMTP delivery updates record to sent and records sentAt', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Successful SMTP Test',
        html: '<p>Testing successful transmission.</p>',
        referenceId: 'test-smtp-success',
        status: 'pending',
        attempts: 0,
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    // Mock sendEmail to succeed
    const sendSpy = vi.spyOn(payload, 'sendEmail').mockResolvedValue({} as any)

    const success = await dispatchOutboxRecord(outbox.id, payload)
    expect(success).toBe(true)
    expect(sendSpy).toHaveBeenCalled()

    // Check updated outbox document
    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    expect(updated.status).toBe('sent')
    expect(updated.sentAt).toBeDefined()
    expect(updated.lastError).toBeNull()

    sendSpy.mockRestore()
  })

  it('6: Retryable SMTP failure (Attempt 1) increments attempts to 1 and schedules nextRetryAt for +5 minutes', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Retryable Failure Test 1',
        html: '<p>Testing retryable timeout.</p>',
        referenceId: 'test-retryable-1',
        status: 'pending',
        attempts: 0,
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    // Mock sendEmail to throw a transient timeout error
    const sendSpy = vi.spyOn(payload, 'sendEmail').mockRejectedValueOnce(
      new Error('ETIMEDOUT: Connection to smtp.gmail.com:587 timed out')
    )

    const success = await dispatchOutboxRecord(outbox.id, payload)
    expect(success).toBe(false)

    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    expect(updated.status).toBe('pending')
    expect(updated.attempts).toBe(1)
    expect(updated.lastError).toContain('ETIMEDOUT')
    expect(updated.nextRetryAt).toBeDefined()

    // nextRetryAt should be ~5 minutes in the future
    const retryTime = new Date(updated.nextRetryAt!).getTime()
    const expectedApprox = Date.now() + 5 * 60 * 1000
    expect(Math.abs(retryTime - expectedApprox)).toBeLessThan(15000)

    sendSpy.mockRestore()
  })

  it('7: Second retryable failure (Attempt 2) increments attempts to 2 and schedules nextRetryAt for +30 minutes', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Retryable Failure Test 2',
        html: '<p>Testing second retry backoff.</p>',
        referenceId: 'test-retryable-2',
        status: 'pending',
        attempts: 1, // Pre-existing 1 attempt
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    // Mock sendEmail to throw another transient error
    const sendSpy = vi.spyOn(payload, 'sendEmail').mockRejectedValueOnce(
      new Error('ECONNRESET: Connection reset by peer')
    )

    const success = await dispatchOutboxRecord(outbox.id, payload)
    expect(success).toBe(false)

    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    expect(updated.status).toBe('pending')
    expect(updated.attempts).toBe(2)
    expect(updated.lastError).toContain('ECONNRESET')

    // nextRetryAt should be ~30 minutes in the future
    const retryTime = new Date(updated.nextRetryAt!).getTime()
    const expectedApprox = Date.now() + 30 * 60 * 1000
    expect(Math.abs(retryTime - expectedApprox)).toBeLessThan(15000)

    sendSpy.mockRestore()
  })

  it('8: Third failed attempt transitions to terminal "failed" status and halts retries', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Max Retries Exhausted Test',
        html: '<p>Testing retry exhaustion.</p>',
        referenceId: 'test-retryable-3-exhausted',
        status: 'pending',
        attempts: 2, // 2 prior attempts
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    // Mock 3rd failure
    const sendSpy = vi.spyOn(payload, 'sendEmail').mockRejectedValueOnce(
      new Error('421 4.7.0 Try again later, closing connection')
    )

    const success = await dispatchOutboxRecord(outbox.id, payload)
    expect(success).toBe(false)

    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    expect(updated.status).toBe('failed')
    expect(updated.attempts).toBe(3)
    expect(updated.lastError).toContain('Try again later')

    sendSpy.mockRestore()
  })

  it('9: Permanent/non-retryable SMTP error transitions directly to "failed" without wasting retry attempts', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Permanent SMTP Auth Rejection Test',
        html: '<p>Testing immediate terminal failure.</p>',
        referenceId: 'test-permanent-failure',
        status: 'pending',
        attempts: 0,
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    // Mock permanent credential rejection (535)
    const permanentError: any = new Error('535 5.7.8 Username and Password not accepted')
    permanentError.code = 'EAUTH'
    permanentError.responseCode = 535

    const sendSpy = vi.spyOn(payload, 'sendEmail').mockRejectedValueOnce(permanentError)

    const success = await dispatchOutboxRecord(outbox.id, payload)
    expect(success).toBe(false)

    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    // Immediately transitions to failed on attempt 1!
    expect(updated.status).toBe('failed')
    expect(updated.attempts).toBe(1)
    expect(updated.lastError).toContain('Username and Password not accepted')

    sendSpy.mockRestore()
  })

  it('10: Email failure NEVER deletes, alters, or rollbacks the underlying Inquiry record', async () => {
    // Mock sendEmail to throw error
    const sendSpy = vi.spyOn(payload, 'sendEmail').mockRejectedValue(
      new Error('Permanent SMTP Down')
    )

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        fullName: 'Preserved Patient Despite Email Failure',
        phone: '+971509988776',
        email: 'preserved.patient@example.com',
        status: 'new',
        message: 'Ensure patient inquiry remains safely stored in PostgreSQL.',
      },
      overrideAccess: true,
    })
    createdInquiryIds.push(inquiry.id)

    // Track created outbox records for cleanup
    const queuedOutbox = await payload.find({
      collection: 'email-outbox',
      where: {
        or: [
          { referenceId: { equals: `inquiry-${inquiry.id}` } },
          { referenceId: { equals: `inquiry-confirmation-${inquiry.id}` } },
        ],
      },
      overrideAccess: true,
    })
    queuedOutbox.docs.forEach((doc) => createdOutboxIds.push(doc.id))

    // Verify the inquiry is 100% saved in the database
    const savedInquiry = await payload.findByID({
      collection: 'inquiries',
      id: inquiry.id,
      overrideAccess: true,
    })

    expect(savedInquiry).toBeDefined()
    expect(savedInquiry.id).toBe(inquiry.id)
    expect(savedInquiry.fullName).toBe('Preserved Patient Despite Email Failure')
    expect(savedInquiry.status).toBe('new')

    sendSpy.mockRestore()
  })

  it('11: Pending outbox records whose nextRetryAt has arrived are picked up by processPendingOutbox', async () => {
    // Create a pending record whose retry timestamp is in the past (due now)
    const pastTime = new Date(Date.now() - 120000).toISOString()
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Due Retry Polling Test',
        html: '<p>Pending retry test.</p>',
        referenceId: 'test-pending-due-record',
        status: 'pending',
        attempts: 1,
        nextRetryAt: pastTime,
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    const sendSpy = vi.spyOn(payload, 'sendEmail').mockResolvedValue({} as any)

    // Run worker function
    const processedCount = await processPendingOutbox(payload)
    expect(processedCount).toBeGreaterThanOrEqual(1)

    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    expect(updated.status).toBe('sent')
    expect(updated.sentAt).toBeDefined()

    sendSpy.mockRestore()
  })

  it('12: Concurrency guard: two simultaneous dispatch calls cannot send the same outbox record twice', async () => {
    const outbox = await payload.create({
      collection: 'email-outbox',
      data: {
        to: 'reception@drjohnsevo.com',
        subject: 'Concurrency Guard Test',
        html: '<p>Testing atomic claim.</p>',
        referenceId: 'test-concurrency-atomic-claim',
        status: 'pending',
        attempts: 0,
      },
      overrideAccess: true,
    })
    createdOutboxIds.push(outbox.id)

    // Simulate slight transmission delay
    let callCount = 0
    const sendSpy = vi.spyOn(payload, 'sendEmail').mockImplementation(async () => {
      callCount++
      await new Promise((r) => setTimeout(r, 60))
      return {} as any
    })

    // Fire two simultaneous dispatch calls
    const [result1, result2] = await Promise.all([
      dispatchOutboxRecord(outbox.id, payload),
      dispatchOutboxRecord(outbox.id, payload),
    ])

    // Exactly one call claimed and sent; the other was guarded
    expect(callCount).toBe(1)
    expect([result1, result2]).toContain(true)
    expect([result1, result2]).toContain(false)

    const updated = await payload.findByID({
      collection: 'email-outbox',
      id: outbox.id,
      overrideAccess: true,
    })

    expect(updated.status).toBe('sent')

    sendSpy.mockRestore()
  })

  it('13: Error classification helper accurately identifies permanent vs transient errors', () => {
    // Permanent errors
    expect(isPermanentSmtpError({ code: 'EAUTH' })).toBe(true)
    expect(isPermanentSmtpError({ responseCode: 535 })).toBe(true)
    expect(isPermanentSmtpError({ responseCode: 550 })).toBe(true)
    expect(isPermanentSmtpError(new Error('Invalid login credentials'))).toBe(true)
    expect(isPermanentSmtpError(new Error('No recipients defined'))).toBe(true)

    // Transient errors
    expect(isPermanentSmtpError({ code: 'ETIMEDOUT' })).toBe(false)
    expect(isPermanentSmtpError({ code: 'ECONNRESET' })).toBe(false)
    expect(isPermanentSmtpError({ responseCode: 421 })).toBe(false)
    expect(isPermanentSmtpError({ responseCode: 451 })).toBe(false)
    expect(isPermanentSmtpError(new Error('Temporary network glitch'))).toBe(false)
  })
})
