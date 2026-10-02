export interface InquiryNotificationData {
  inquiryId: number | string
  fullName: string
  phone: string
  email: string
  serviceTitle?: string | null
  preferredDate?: string | null
  preferredTime?: string | null
  message?: string | null
  createdAt?: string | Date
  siteUrl?: string
}

export interface PatientConfirmationData {
  inquiryId: number | string
  fullName: string
  email: string
  phone: string
  serviceTitle?: string | null
  preferredDate?: string | null
  preferredTime?: string | null
  clinicPhone?: string | null
  clinicEmail?: string | null
  clinicAddress?: string | null
  siteUrl?: string
}

/**
 * Formats date into a human-readable display string.
 */
function formatDateDisplay(dateStr?: string | null): string {
  if (!dateStr) return 'Flexible / Earliest Available'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * Formats time of day into a human-readable descriptive window.
 */
function formatTimeDisplay(timeStr?: string | null): string {
  if (!timeStr) return 'Flexible / Any Time'
  switch (timeStr.toLowerCase()) {
    case 'morning':
      return 'Morning (9:00 AM - 1:00 PM)'
    case 'afternoon':
      return 'Afternoon (1:00 PM - 5:00 PM)'
    case 'evening':
      return 'Evening (5:00 PM - 9:00 PM)'
    default:
      return timeStr
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Operational Email Template: Sent to Clinic Reception / Management.
 */
export function formatInquiryNotificationHtml(data: InquiryNotificationData): string {
  const siteUrl = data.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'
  const adminUrl = `${siteUrl}/admin/collections/inquiries/${data.inquiryId}`
  const createdDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : new Date().toLocaleString()

  const formattedDate = formatDateDisplay(data.preferredDate)
  const formattedTime = formatTimeDisplay(data.preferredTime)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Patient Inquiry #${data.inquiryId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f2ec; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #36302f;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f2ec; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(54, 48, 47, 0.08); border: 1px solid #ebd9c8;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #36302f; padding: 28px 32px; text-align: left; border-bottom: 3px solid #b58a48;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #b58a48; font-weight: 700; display: block; margin-bottom: 6px;">
                Dr. John Sevo Dental Clinic & Aesthetics
              </span>
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">
                New Patient Appointment Request
              </h1>
            </td>
          </tr>

          <!-- Notification Lead -->
          <tr>
            <td style="padding: 24px 32px 16px; border-bottom: 1px solid #f0e6dc;">
              <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #5a5350;">
                A new inquiry has been submitted through the clinic website. Please review the patient details below and contact them promptly to schedule their appointment.
              </p>
              <div style="margin-top: 12px; display: inline-block; background-color: #faf6f0; border: 1px solid #e2d2c1; padding: 4px 12px; border-radius: 6px; font-size: 13px; color: #846332; font-weight: 600;">
                Inquiry Reference: #${data.inquiryId} &bull; ${createdDate}
              </div>
            </td>
          </tr>

          <!-- Patient & Inquiry Details Table -->
          <tr>
            <td style="padding: 20px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; width: 38%; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Patient Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px; font-weight: 600;">${escapeHtml(data.fullName)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px; font-weight: 600;">
                    <a href="tel:${escapeHtml(data.phone)}" style="color: #b58a48; text-decoration: none;">${escapeHtml(data.phone)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px;">
                    <a href="mailto:${escapeHtml(data.email)}" style="color: #b58a48; text-decoration: none; font-weight: 600;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Requested Service</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px; font-weight: 600;">
                    ${escapeHtml(data.serviceTitle || 'General Dental Consultation')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px;">
                    ${escapeHtml(formattedDate)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Time</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px;">
                    ${escapeHtml(formattedTime)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Patient Notes</td>
                  <td style="padding: 10px 0; color: #5a5350; font-size: 14px; line-height: 1.6;">
                    ${data.message ? escapeHtml(data.message).replace(/\n/g, '<br/>') : '<em>No additional notes provided.</em>'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action CTA -->
          <tr>
            <td style="padding: 12px 32px 32px; text-align: center;">
              <a href="${adminUrl}" style="display: inline-block; background-color: #36302f; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; border: 1px solid #b58a48; letter-spacing: 0.5px;">
                Open Inquiry in Clinic Admin &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f2ec; padding: 18px 32px; text-align: center; font-size: 12px; color: #8c827a; border-top: 1px solid #ebd9c8;">
              This is an automated operational notification generated by the Dr. John Sevo Dental Clinic Management System.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Plaintext counterpart for Clinic Reception notification.
 */
export function formatInquiryNotificationText(data: InquiryNotificationData): string {
  const siteUrl = data.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'
  const adminUrl = `${siteUrl}/admin/collections/inquiries/${data.inquiryId}`

  return `
NEW PATIENT APPOINTMENT INQUIRY (#${data.inquiryId})
-------------------------------------------------------------
Patient Name:      ${data.fullName}
Phone Number:      ${data.phone}
Email Address:     ${data.email}
Requested Service: ${data.serviceTitle || 'General Dental Consultation'}
Preferred Date:    ${formatDateDisplay(data.preferredDate)}
Preferred Time:    ${formatTimeDisplay(data.preferredTime)}
Notes / Concerns:  ${data.message || 'No additional notes provided.'}
-------------------------------------------------------------
View and manage this inquiry in the Clinic Admin:
${adminUrl}
`.trim()
}

/**
 * Patient-Facing Confirmation Email Template:
 * Sent directly to the patient's email upon submitting an inquiry.
 */
export function formatPatientConfirmationHtml(data: PatientConfirmationData): string {
  const formattedDate = formatDateDisplay(data.preferredDate)
  const formattedTime = formatTimeDisplay(data.preferredTime)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Request Received — Dr. John Sevo Dental Clinic</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f2ec; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #36302f;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f2ec; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(54, 48, 47, 0.08); border: 1px solid #ebd9c8;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #36302f; padding: 32px 36px; text-align: left; border-bottom: 3px solid #b58a48;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #b58a48; font-weight: 700; display: block; margin-bottom: 6px;">
                Dr. John Sevo Dental Clinic & Aesthetics
              </span>
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">
                We Have Received Your Appointment Request
              </h1>
            </td>
          </tr>

          <!-- Welcome Body -->
          <tr>
            <td style="padding: 28px 36px 20px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #36302f; font-weight: 600;">
                Dear ${escapeHtml(data.fullName)},
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #5a5350;">
                Thank you for choosing Dr. John Sevo Dental Clinic. We have successfully received your appointment request.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #5a5350;">
                Our clinical reception team is currently reviewing doctor availability for your requested date and time. A member of our staff will reach out to you shortly by phone or email to confirm your exact appointment.
              </p>
            </td>
          </tr>

          <!-- Request Summary Box -->
          <tr>
            <td style="padding: 0 36px 24px;">
              <div style="background-color: #faf6f0; border: 1px solid #e8dbcc; border-radius: 12px; padding: 20px 24px;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #846332; font-weight: 700; display: block; margin-bottom: 12px;">
                  Your Appointment Request Summary
                </span>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 6px 0; width: 40%; font-size: 13px; color: #8c827a; font-weight: 600;">Reference:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #36302f; font-weight: 700;">#${data.inquiryId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #8c827a; font-weight: 600;">Requested Service:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #36302f; font-weight: 600;">${escapeHtml(data.serviceTitle || 'General Dental Consultation')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #8c827a; font-weight: 600;">Preferred Date:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #36302f;">${escapeHtml(formattedDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #8c827a; font-weight: 600;">Preferred Time:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #36302f;">${escapeHtml(formattedTime)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #8c827a; font-weight: 600;">Phone Number:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #36302f;">${escapeHtml(data.phone)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Clinic Direct Contact Info -->
          <tr>
            <td style="padding: 0 36px 28px; border-top: 1px solid #f0e6dc; padding-top: 20px;">
              <p style="margin: 0 0 12px; font-size: 13px; color: #5a5350; font-weight: 600;">
                Need to reschedule or have immediate clinical questions?
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${data.clinicPhone ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #8c827a; width: 25%;">Telephone:</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #36302f; font-weight: 600;">
                    <a href="tel:${escapeHtml(data.clinicPhone)}" style="color: #b58a48; text-decoration: none;">${escapeHtml(data.clinicPhone)}</a>
                  </td>
                </tr>` : ''}
                ${data.clinicEmail ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #8c827a; width: 25%;">Email:</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #36302f; font-weight: 600;">
                    <a href="mailto:${escapeHtml(data.clinicEmail)}" style="color: #b58a48; text-decoration: none;">${escapeHtml(data.clinicEmail)}</a>
                  </td>
                </tr>` : ''}
                ${data.clinicAddress ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #8c827a; width: 25%;">Location:</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #5a5350;">
                    ${escapeHtml(data.clinicAddress)}
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #8c827a; width: 25%;">Hours:</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #5a5350;">
                    Monday &ndash; Saturday: 9:00 AM &ndash; 8:00 PM
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding: 0 36px 32px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #5a5350;">
                We look forward to welcoming you to our clinic.<br/>
                <strong style="color: #36302f; display: block; margin-top: 8px;">Dr. John Sevo &amp; The Clinical Care Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f2ec; padding: 18px 36px; text-align: center; font-size: 12px; color: #8c827a; border-top: 1px solid #ebd9c8;">
              Dr. John Sevo Dental Clinic &amp; Aesthetics &bull; Precision &bull; Excellence &bull; Patient Care
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Plaintext counterpart for Patient Confirmation email.
 */
export function formatPatientConfirmationText(data: PatientConfirmationData): string {
  return `
DR. JOHN SEVO DENTAL CLINIC & AESTHETICS
Appointment Request Received (#${data.inquiryId})
-------------------------------------------------------------
Dear ${data.fullName},

Thank you for choosing Dr. John Sevo Dental Clinic. We have successfully received your appointment request.

Our clinical reception team is currently reviewing your schedule request and will contact you shortly by phone or email to confirm your exact appointment date and time.

APPOINTMENT REQUEST SUMMARY:
- Reference Number: #${data.inquiryId}
- Requested Service: ${data.serviceTitle || 'General Dental Consultation'}
- Preferred Date:    ${formatDateDisplay(data.preferredDate)}
- Preferred Time:    ${formatTimeDisplay(data.preferredTime)}
- Your Phone Number: ${data.phone}

CLINIC CONTACT DETAILS:
${data.clinicPhone ? `Telephone: ${data.clinicPhone}\n` : ''}${data.clinicEmail ? `Email:     ${data.clinicEmail}\n` : ''}${data.clinicAddress ? `Address:   ${data.clinicAddress}\n` : ''}Working Hours: Monday - Saturday: 9:00 AM - 8:00 PM

We look forward to welcoming you to our practice.

Warm regards,
Dr. John Sevo & The Clinical Care Team
`.trim()
}
