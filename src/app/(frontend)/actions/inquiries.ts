'use server'

import { createInquiry, type CreateInquiryInput } from '@/repositories/inquiries'

export interface SubmitActionResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Server Action: processes visitor booking & contact form submission.
 */
export async function submitInquiryAction(input: CreateInquiryInput): Promise<SubmitActionResult> {
  const result = await createInquiry(input)

  if (!result.success) {
    return {
      success: false,
      message: result.error || 'Unable to submit your appointment request. Please check your details.',
      error: result.error,
    }
  }

  return {
    success: true,
    message: 'Thank you. Your appointment request has been received. Our clinic team will contact you shortly.',
  }
}
