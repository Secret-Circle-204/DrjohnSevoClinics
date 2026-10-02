export interface InquiryNotificationData {
  inquiryId: number | string
  fullName: string
  phone: string
  email?: string | null
  serviceTitle?: string | null
  preferredDate?: string | null
  preferredTime?: string | null
  message?: string | null
  createdAt?: string | Date
  siteUrl?: string
}

export function formatInquiryNotificationHtml(data: InquiryNotificationData): string {
  const siteUrl = data.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'
  const adminUrl = `${siteUrl}/admin/collections/inquiries/${data.inquiryId}`
  const createdDate = data.createdAt ? new Date(data.createdAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }) : new Date().toLocaleString()

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
                A new inquiry has been submitted through the clinic website. Please review the details below and contact the patient to confirm availability.
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
                    ${data.email ? `<a href="mailto:${escapeHtml(data.email)}" style="color: #b58a48; text-decoration: none;">${escapeHtml(data.email)}</a>` : '<span style="color: #999;">Not provided</span>'}
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
                    ${data.preferredDate ? escapeHtml(data.preferredDate) : 'Flexible / Earliest available'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #8c827a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Time</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f5ede6; color: #36302f; font-size: 15px; text-transform: capitalize;">
                    ${data.preferredTime ? escapeHtml(data.preferredTime) : 'Any time'}
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

export function formatInquiryNotificationText(data: InquiryNotificationData): string {
  const siteUrl = data.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'
  const adminUrl = `${siteUrl}/admin/collections/inquiries/${data.inquiryId}`

  return `
NEW PATIENT APPOINTMENT INQUIRY (#${data.inquiryId})
-------------------------------------------------------------
Patient Name:      ${data.fullName}
Phone Number:      ${data.phone}
Email Address:     ${data.email || 'Not provided'}
Requested Service: ${data.serviceTitle || 'General Dental Consultation'}
Preferred Date:    ${data.preferredDate || 'Flexible / Earliest available'}
Preferred Time:    ${data.preferredTime || 'Any time'}
Notes / Concerns:  ${data.message || 'None'}
-------------------------------------------------------------
View and manage this inquiry in the Clinic Admin:
${adminUrl}
`.trim()
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
