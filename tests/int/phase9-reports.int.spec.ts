import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let testClientId: number
let testClient2Id: number
let testDoctorId: number | undefined
let testAppointmentId: number | undefined
let testConsultationId: number | undefined
let testMediaId: number | undefined
let staffUser: any
let adminUser: any
const createdReportIds: number[] = []

describe('Phase 9 — Reports / Clinical Reporting Foundation Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // 1. Create primary test Client fixture
    const client1 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 9 Test Patient One',
        phone: '+971509991122',
        status: 'active',
      },
      overrideAccess: true,
    })
    testClientId = client1.id

    // 2. Create secondary test Client fixture (for reassignment testing)
    const client2 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 9 Test Patient Two',
        phone: '+971509993344',
        status: 'active',
      },
      overrideAccess: true,
    })
    testClient2Id = client2.id

    // 3. Fetch or find existing Doctor fixture
    const doctors = await payload.find({
      collection: 'doctors',
      limit: 1,
      overrideAccess: true,
    })
    if (doctors.docs.length > 0) {
      testDoctorId = doctors.docs[0].id
    }

    // 4. Create a test Appointment fixture
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        doctor: testDoctorId,
        dateTime: '2026-10-20T10:00:00.000Z',
        appointmentType: 'consultation',
        status: 'completed',
        notes: 'Pre-report clinical examination visit.',
      },
      overrideAccess: true,
    })
    testAppointmentId = appointment.id

    // 5. Create a test Consultation fixture
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        doctor: testDoctorId,
        appointment: testAppointmentId,
        consultationDate: '2026-10-20T00:00:00.000Z',
        consultationType: 'comprehensive_evaluation',
        status: 'completed',
        chiefComplaint: 'Pre-prosthetic clinical evaluation.',
        clinicalNotes: 'Intraoral scan completed; patient ready for specialist referral.',
        recommendations: 'Formal referral to oral and maxillofacial surgeon.',
      },
      overrideAccess: true,
    })
    testConsultationId = consultation.id

    // 6. Find or fetch existing Media fixture for attachment testing
    const mediaDocs = await payload.find({
      collection: 'media',
      limit: 1,
      overrideAccess: true,
    })
    if (mediaDocs.docs.length > 0) {
      testMediaId = mediaDocs.docs[0].id
    }

    // 7. Fetch or create Staff and Admin test user fixtures
    const users = await payload.find({
      collection: 'users',
      limit: 10,
      overrideAccess: true,
    })

    adminUser = users.docs.find((u) => u.role === 'admin')
    staffUser = users.docs.find((u) => u.role === 'staff')

    if (!staffUser) {
      staffUser = await payload.create({
        collection: 'users',
        data: {
          name: 'Phase 9 Test Staff',
          email: 'phase9-staff-test@example.com',
          password: 'Password123!',
          role: 'staff',
        },
        overrideAccess: true,
      })
    }
  })

  afterAll(async () => {
    // Clean up created reports
    for (const id of createdReportIds) {
      try {
        await payload.delete({
          collection: 'reports',
          id,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }

    // Clean up test consultation
    if (testConsultationId) {
      try {
        await payload.delete({
          collection: 'consultations',
          id: testConsultationId,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }

    // Clean up test appointment
    if (testAppointmentId) {
      try {
        await payload.delete({
          collection: 'appointments',
          id: testAppointmentId,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }

    // Clean up test clients
    for (const id of [testClientId, testClient2Id]) {
      if (id) {
        try {
          await payload.delete({
            collection: 'clients',
            id,
            overrideAccess: true,
          })
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  })

  it('1: Fails to create a report without a title (title is required)', async () => {
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: null as any,
          client: testClientId,
          reportDate: '2026-10-21T00:00:00.000Z',
          reportType: 'clinical_summary',
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('2: Fails to create a report without a Client (client is required)', async () => {
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Clinical Summary Report',
          client: null as any,
          reportDate: '2026-10-21T00:00:00.000Z',
          reportType: 'clinical_summary',
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('3: Fails to create a report without a reportDate (reportDate is required)', async () => {
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Clinical Summary Report',
          client: testClientId,
          reportDate: null as any,
          reportType: 'clinical_summary',
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('4: Fails to create a report without a reportType (reportType is required)', async () => {
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Clinical Summary Report',
          client: testClientId,
          reportDate: '2026-10-21T00:00:00.000Z',
          reportType: null as any,
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('5: Only clinical_summary and referral_letter are accepted (future types rejected)', async () => {
    // 5a. Valid: clinical_summary succeeds
    const rep1 = await payload.create({
      collection: 'reports',
      data: {
        title: 'Comprehensive Clinical Summary',
        client: testClientId,
        reportDate: '2026-10-21T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
      },
      overrideAccess: true,
    })
    expect(rep1.reportType).toBe('clinical_summary')
    createdReportIds.push(rep1.id)

    // 5b. Valid: referral_letter succeeds
    const rep2 = await payload.create({
      collection: 'reports',
      data: {
        title: 'Endodontic Specialist Referral Letter',
        client: testClientId,
        reportDate: '2026-10-21T00:00:00.000Z',
        reportType: 'referral_letter',
        status: 'draft',
      },
      overrideAccess: true,
    })
    expect(rep2.reportType).toBe('referral_letter')
    createdReportIds.push(rep2.id)

    // 5c. Invalid: medical_clearance is rejected
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Unauthorized Clearance Report',
          client: testClientId,
          reportDate: '2026-10-21T00:00:00.000Z',
          reportType: 'medical_clearance' as any,
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()

    // 5d. Invalid: insurance_report is rejected
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Unauthorized Insurance Report',
          client: testClientId,
          reportDate: '2026-10-21T00:00:00.000Z',
          reportType: 'insurance_report' as any,
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('6: Successful creation with all optional relationships (doctor, consultation, appointment, attachment, summary)', async () => {
    const reportData: any = {
      title: 'Full Encounter Official Clinical Summary',
      client: testClientId,
      doctor: testDoctorId,
      consultation: testConsultationId,
      appointment: testAppointmentId,
      reportDate: '2026-10-22T00:00:00.000Z',
      reportType: 'clinical_summary',
      status: 'draft',
      summary: 'Patient presented with stable periodontium and completed composite restoration.',
    }
    if (testMediaId) {
      reportData.attachment = testMediaId
    }

    const report = await payload.create({
      collection: 'reports',
      data: reportData,
      overrideAccess: true,
    })

    expect(report).toBeDefined()
    expect(report.id).toBeDefined()
    expect(report.title).toBe('Full Encounter Official Clinical Summary')
    expect(report.reportType).toBe('clinical_summary')
    expect(report.status).toBe('draft')
    expect(report.summary).toContain('stable periodontium')
    if (testDoctorId) {
      const docId = typeof report.doctor === 'object' ? (report.doctor as any)?.id : report.doctor
      expect(docId).toBe(testDoctorId)
    }
    if (testConsultationId) {
      const consId = typeof report.consultation === 'object' ? (report.consultation as any)?.id : report.consultation
      expect(consId).toBe(testConsultationId)
    }
    if (testAppointmentId) {
      const apptId = typeof report.appointment === 'object' ? (report.appointment as any)?.id : report.appointment
      expect(apptId).toBe(testAppointmentId)
    }
    if (testMediaId) {
      const attId = typeof report.attachment === 'object' ? (report.attachment as any)?.id : report.attachment
      expect(attId).toBe(testMediaId)
    }

    createdReportIds.push(report.id)
  })

  it('7: Successfully creates an independent report WITHOUT a consultation', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Direct Referral Letter Without Consultation Record',
        client: testClientId,
        appointment: testAppointmentId,
        reportDate: '2026-10-23T00:00:00.000Z',
        reportType: 'referral_letter',
        status: 'draft',
        summary: 'Direct referral to orthodontist for aligner treatment.',
      },
      overrideAccess: true,
    })

    expect(report).toBeDefined()
    expect(report.id).toBeDefined()
    expect(report.consultation).toBeFalsy()
    expect(report.reportType).toBe('referral_letter')
    expect(report.status).toBe('draft')

    createdReportIds.push(report.id)
  })

  it('8: Successfully creates an independent report WITHOUT an appointment', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Historical Summary Without Appointment Link',
        client: testClientId,
        reportDate: '2026-10-24T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
        summary: 'Archived clinical summary of previous treatment courses.',
      },
      overrideAccess: true,
    })

    expect(report).toBeDefined()
    expect(report.id).toBeDefined()
    expect(report.appointment).toBeFalsy()
    expect(report.consultation).toBeFalsy()
    expect(report.status).toBe('draft')

    createdReportIds.push(report.id)
  })

  it('9: Public visitors strictly CANNOT create reports', async () => {
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Public Unauthorized Report',
          client: testClientId,
          reportDate: '2026-10-25T00:00:00.000Z',
          reportType: 'clinical_summary',
          status: 'draft',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('10: Public visitors strictly CANNOT read reports', async () => {
    await expect(
      payload.find({
        collection: 'reports',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('11: Public visitors strictly CANNOT update reports', async () => {
    const targetId = createdReportIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.update({
        collection: 'reports',
        id: targetId,
        data: {
          title: 'Public Tampered Title',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('12: Public visitors strictly CANNOT delete reports', async () => {
    const targetId = createdReportIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.delete({
        collection: 'reports',
        id: targetId,
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('13: Server enforces valid lifecycle transition: draft -> finalized', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Provisional Clinical Summary',
        client: testClientId,
        reportDate: '2026-10-26T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
        summary: 'Draft summary awaiting official finalization.',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Finalize report: draft -> finalized
    const finalized = await payload.update({
      collection: 'reports',
      id: report.id,
      data: {
        status: 'finalized',
        summary: 'Final clinical summary issued and certified by clinic doctor.',
      },
      overrideAccess: true,
    })

    expect(finalized.status).toBe('finalized')
    expect(finalized.summary).toBe('Final clinical summary issued and certified by clinic doctor.')
  })

  it('14: Server enforces valid lifecycle transition: draft -> cancelled with cancellationReason', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Draft Referral Letter',
        client: testClientId,
        reportDate: '2026-10-27T00:00:00.000Z',
        reportType: 'referral_letter',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Cancel report: draft -> cancelled with reason
    const cancelled = await payload.update({
      collection: 'reports',
      id: report.id,
      data: {
        status: 'cancelled',
        cancellationReason: 'Specialist referral superseded by patient choice of in-house treatment.',
      },
      overrideAccess: true,
    })

    expect(cancelled.status).toBe('cancelled')
    expect(cancelled.cancellationReason).toBe(
      'Specialist referral superseded by patient choice of in-house treatment.',
    )
  })

  it('15: Cancellation without cancellationReason fails server-side (empty string and create directly)', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Draft Report To Be Cancelled',
        client: testClientId,
        reportDate: '2026-10-28T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // 15a: Update to cancelled without reason -> MUST FAIL
    await expect(
      payload.update({
        collection: 'reports',
        id: report.id,
        data: {
          status: 'cancelled',
          cancellationReason: '',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cancellationReason is required/)

    // 15b: Direct creation as cancelled without reason -> MUST FAIL
    await expect(
      payload.create({
        collection: 'reports',
        data: {
          title: 'Direct Cancelled Report Without Reason',
          client: testClientId,
          reportDate: '2026-10-28T00:00:00.000Z',
          reportType: 'clinical_summary',
          status: 'cancelled',
          cancellationReason: '   ', // Whitespace only
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cancellationReason is required/)
  })

  it('16: Server enforces that finalized status is TERMINAL (rejects transition to draft or cancelled)', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Immutable Finalized Official Document',
        client: testClientId,
        reportDate: '2026-10-29T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'finalized',
        summary: 'Certified official report.',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Attempt illegal transition: finalized -> draft
    await expect(
      payload.update({
        collection: 'reports',
        id: report.id,
        data: {
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid report status transition from 'finalized' to 'draft'/)

    // Attempt illegal transition: finalized -> cancelled
    await expect(
      payload.update({
        collection: 'reports',
        id: report.id,
        data: {
          status: 'cancelled',
          cancellationReason: 'Retrospective attempt to cancel finalized legal document',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid report status transition from 'finalized' to 'cancelled'/)
  })

  it('17: Server enforces that cancelled status is TERMINAL (rejects transition to draft or finalized)', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Cancelled Document',
        client: testClientId,
        reportDate: '2026-10-30T00:00:00.000Z',
        reportType: 'referral_letter',
        status: 'cancelled',
        cancellationReason: 'Patient moved overseas before appointment.',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Attempt illegal transition: cancelled -> draft
    await expect(
      payload.update({
        collection: 'reports',
        id: report.id,
        data: {
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid report status transition from 'cancelled' to 'draft'/)

    // Attempt illegal transition: cancelled -> finalized
    await expect(
      payload.update({
        collection: 'reports',
        id: report.id,
        data: {
          status: 'finalized',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid report status transition from 'cancelled' to 'finalized'/)
  })

  it('18: Staff cannot reassign client on an existing report (isAdminFieldLevel)', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Original Patient Clinical Summary',
        client: testClientId,
        reportDate: '2026-10-31T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Attempt client reassignment with Staff user
    const updated = await payload.update({
      collection: 'reports',
      id: report.id,
      data: {
        client: testClient2Id, // Staff attempts to reassign patient
        summary: 'Staff updated summary on draft',
      },
      overrideAccess: false,
      user: staffUser,
    })

    // Client field remains unchanged (preserved referential integrity)
    const clientRef =
      typeof updated.client === 'object' ? (updated.client as any).id : updated.client
    expect(clientRef).toBe(testClientId)
    expect(clientRef).not.toBe(testClient2Id)
    expect(updated.summary).toBe('Staff updated summary on draft')
  })

  it('19: Staff cannot delete a report (hard deletion is restricted to Admin)', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Protected Report from Staff Deletion',
        client: testClientId,
        reportDate: '2026-11-01T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Staff deletion attempt -> MUST FAIL
    await expect(
      payload.delete({
        collection: 'reports',
        id: report.id,
        overrideAccess: false,
        user: staffUser,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('20: Staff cannot modify finalized report (server-enforced hook protection)', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Officially Finalized Report',
        client: testClientId,
        reportDate: '2026-11-02T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'finalized',
        summary: 'Original finalized text.',
      },
      overrideAccess: true,
    })
    createdReportIds.push(report.id)

    // Staff attempts to modify the finalized report -> MUST FAIL with 403
    await expect(
      payload.update({
        collection: 'reports',
        id: report.id,
        data: {
          summary: 'Staff unauthorized modification of finalized document',
        },
        overrideAccess: false,
        user: staffUser,
      }),
    ).rejects.toThrow(/Staff cannot modify finalized reports/)
  })

  it('21: Admin CAN successfully delete a report', async () => {
    const report = await payload.create({
      collection: 'reports',
      data: {
        title: 'Report Targeted for Admin Hard Deletion',
        client: testClientId,
        reportDate: '2026-11-03T00:00:00.000Z',
        reportType: 'clinical_summary',
        status: 'draft',
      },
      overrideAccess: true,
    })

    const deleted = await payload.delete({
      collection: 'reports',
      id: report.id,
      overrideAccess: false,
      user: adminUser,
    })

    expect(deleted).toBeDefined()
    expect(deleted.id).toBe(report.id)
  })

  it('22: Bounded Local API retrieval is used with limit and client filter (No artificial repository)', async () => {
    const result = await payload.find({
      collection: 'reports',
      limit: 10,
      where: {
        client: {
          equals: testClientId,
        },
      },
      sort: '-reportDate',
      overrideAccess: true,
    })

    expect(result).toBeDefined()
    expect(result.docs).toBeInstanceOf(Array)
    expect(result.docs.length).toBeGreaterThan(0)
    expect(result.limit).toBe(10)
    expect(result.totalDocs).toBeGreaterThanOrEqual(result.docs.length)

    // Verify each returned record belongs to testClientId
    for (const doc of result.docs) {
      const cId = typeof doc.client === 'object' ? (doc.client as any).id : doc.client
      expect(cId).toBe(testClientId)
    }
  })

  it('23: No pagination: false (pagination options are strictly bounded)', async () => {
    const result = await payload.find({
      collection: 'reports',
      limit: 5,
      page: 1,
      overrideAccess: true,
    })

    expect(result).toBeDefined()
    expect(result.docs.length).toBeLessThanOrEqual(5)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(5)
    expect(typeof result.hasNextPage).toBe('boolean')
    expect(typeof result.hasPrevPage).toBe('boolean')
    expect(typeof result.totalPages).toBe('number')
  })
})
