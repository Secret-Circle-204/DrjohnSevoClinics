import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface CreateInquiryInput {
  fullName: string
  phone: string
  email: string
  service?: number
  preferredDate?: string
  preferredTime?: 'morning' | 'afternoon' | 'evening'
  message?: string
}

export interface CreateInquiryResult {
  success: boolean
  id?: number
  error?: string
}

/**
 * Creates a public visitor inquiry / pre-appointment request.
 * Public write is allowed; strictly ZERO public read.
 */
export async function createInquiry(input: CreateInquiryInput): Promise<CreateInquiryResult> {
  const trimmedName = input.fullName?.trim()
  const trimmedPhone = input.phone?.trim()
  const trimmedEmail = input.email?.trim()

  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Full name is required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { success: false, error: 'A valid email address is required.' }
  }

  if (!trimmedPhone || trimmedPhone.length < 7) {
    return { success: false, error: 'Valid phone number is required.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.create({
      collection: 'inquiries',
      data: {
        fullName: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        service: input.service || undefined,
        preferredDate: input.preferredDate ? new Date(input.preferredDate).toISOString() : undefined,
        preferredTime: input.preferredTime || undefined,
        message: input.message?.trim() || undefined,
        status: 'new',
      },
      overrideAccess: false,
    })

    return {
      success: true,
      id: doc.id,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.'
    return {
      success: false,
      error: message,
    }
  }
}
