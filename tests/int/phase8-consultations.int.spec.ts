import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let testClientId: number
let testClient2Id: number
let testDoctorId: number | undefined
let testAppointmentId: number | undefined
let staffUser: any
let adminUser: any
const createdConsultationIds: number[] = []

describe('Phase 8 — Consultations Foundation Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // 1. Create primary test Client fixture
    const client1 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 8 Test Patient One',
        phone: '+971507778899',
        status: 'active',
      },
      overrideAccess: true,
    })
    testClientId = client1.id

    // 2. Create secondary test Client fixture (for reassignment testing)
    const client2 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 8 Test Patient Two',
        phone: '+971508889900',
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

    // 4. Create a test Appointment fixture for related consultation testing
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        doctor: testDoctorId,
        dateTime: '2026-10-15T11:00:00.000Z',
        appointmentType: 'consultation',
        status: 'completed',
        notes: 'Initial comprehensive dental checkup.',
      },
      overrideAccess: true,
    })
    testAppointmentId = appointment.id

    // 5. Fetch or create Staff and Admin test user fixtures
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
          name: 'Phase 8 Test Staff',
          email: 'phase8-staff-test@example.com',
          password: 'Password123!',
          role: 'staff',
        },
        overrideAccess: true,
      })
    }
  })

  afterAll(async () => {
    // Clean up created consultations
    for (const id of createdConsultationIds) {
      try {
        await payload.delete({
          collection: 'consultations',
          id,
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

  it('1: Fails to create a consultation without a Client (client is required)', async () => {
    await expect(
      payload.create({
        collection: 'consultations',
        data: {
          client: null as any,
          consultationDate: '2026-10-15T00:00:00.000Z',
          consultationType: 'initial_examination',
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('2: Fails to create a consultation without a consultationDate (consultationDate is required)', async () => {
    await expect(
      payload.create({
        collection: 'consultations',
        data: {
          client: testClientId,
          consultationDate: null as any,
          consultationType: 'initial_examination',
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('3: Successfully creates a consultation with Doctor and Appointment relationships', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        doctor: testDoctorId,
        appointment: testAppointmentId,
        consultationDate: '2026-10-15T00:00:00.000Z',
        consultationType: 'comprehensive_evaluation',
        status: 'draft',
        chiefComplaint: 'Mild sensitivity on lower left premolar when drinking cold water.',
        clinicalNotes: 'Intraoral examination revealed enamel wear and localized gingival recession.',
        recommendations: 'Recommended desensitizing toothpaste and scheduled composite bonding check.',
      },
      overrideAccess: true,
    })

    expect(consultation).toBeDefined()
    expect(consultation.id).toBeDefined()
    expect(consultation.status).toBe('draft')
    expect(consultation.consultationType).toBe('comprehensive_evaluation')
    expect(consultation.chiefComplaint).toBe(
      'Mild sensitivity on lower left premolar when drinking cold water.',
    )
    expect(consultation.clinicalNotes).toContain('enamel wear')
    expect(consultation.recommendations).toContain('desensitizing toothpaste')

    createdConsultationIds.push(consultation.id)
  })

  it('4: Successfully creates an independent Walk-in consultation WITHOUT an appointment', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-16T00:00:00.000Z',
        consultationType: 'initial_examination',
        status: 'draft',
        chiefComplaint: 'Walk-in emergency check: fractured cusp on upper molar.',
        clinicalNotes: 'Fractured palatal cusp of tooth 26 without pulp exposure.',
        recommendations: 'Temporary restoration placed; scheduled onlay preparation.',
      },
      overrideAccess: true,
    })

    expect(consultation).toBeDefined()
    expect(consultation.id).toBeDefined()
    expect(consultation.appointment).toBeFalsy()
    expect(consultation.status).toBe('draft')
    expect(consultation.consultationType).toBe('initial_examination')

    createdConsultationIds.push(consultation.id)
  })

  it('5: Public visitors strictly CANNOT create consultations', async () => {
    await expect(
      payload.create({
        collection: 'consultations',
        data: {
          client: testClientId,
          consultationDate: '2026-10-17T00:00:00.000Z',
          consultationType: 'initial_examination',
          status: 'draft',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('6: Public visitors strictly CANNOT read consultations', async () => {
    await expect(
      payload.find({
        collection: 'consultations',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('7: Public visitors strictly CANNOT update consultations', async () => {
    const targetId = createdConsultationIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.update({
        collection: 'consultations',
        id: targetId,
        data: {
          clinicalNotes: 'Public unauthorized modification attempt',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('8: Public visitors strictly CANNOT delete consultations', async () => {
    const targetId = createdConsultationIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.delete({
        collection: 'consultations',
        id: targetId,
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('9: Server enforces valid lifecycle transition: draft -> completed', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-18T00:00:00.000Z',
        consultationType: 'treatment_planning',
        status: 'draft',
        clinicalNotes: 'Draft treatment plan discussed.',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Finalize consultation: draft -> completed
    const completed = await payload.update({
      collection: 'consultations',
      id: consultation.id,
      data: {
        status: 'completed',
        recommendations: 'Full arch treatment plan finalized and approved by patient.',
      },
      overrideAccess: true,
    })

    expect(completed.status).toBe('completed')
    expect(completed.recommendations).toBe(
      'Full arch treatment plan finalized and approved by patient.',
    )
  })

  it('10: Server enforces valid lifecycle transition: draft -> cancelled with cancellationReason', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-19T00:00:00.000Z',
        consultationType: 'specialist_consult',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Cancel consultation: draft -> cancelled
    const cancelled = await payload.update({
      collection: 'consultations',
      id: consultation.id,
      data: {
        status: 'cancelled',
        cancellationReason: 'Patient departed prior to specialist clinical examination.',
      },
      overrideAccess: true,
    })

    expect(cancelled.status).toBe('cancelled')
    expect(cancelled.cancellationReason).toBe(
      'Patient departed prior to specialist clinical examination.',
    )
  })

  it('11: Server enforces cancellationReason requirement when status is set to cancelled (empty reason rejected)', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-20T00:00:00.000Z',
        consultationType: 'clinical_review',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Attempt cancellation without cancellationReason -> MUST FAIL
    await expect(
      payload.update({
        collection: 'consultations',
        id: consultation.id,
        data: {
          status: 'cancelled',
          cancellationReason: '', // Empty reason
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cancellationReason is required/)
  })

  it('12: Server rejects creation as cancelled without cancellationReason', async () => {
    await expect(
      payload.create({
        collection: 'consultations',
        data: {
          client: testClientId,
          consultationDate: '2026-10-21T00:00:00.000Z',
          consultationType: 'initial_examination',
          status: 'cancelled',
          cancellationReason: '   ', // Whitespace only
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cancellationReason is required/)
  })

  it('13: Server enforces that completed status is TERMINAL (rejects transition to draft or cancelled)', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-22T00:00:00.000Z',
        consultationType: 'comprehensive_evaluation',
        status: 'completed',
        clinicalNotes: 'Finalized examination record.',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Attempt illegal transition: completed -> draft
    await expect(
      payload.update({
        collection: 'consultations',
        id: consultation.id,
        data: {
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid consultation status transition from 'completed' to 'draft'/)

    // Attempt illegal transition: completed -> cancelled
    await expect(
      payload.update({
        collection: 'consultations',
        id: consultation.id,
        data: {
          status: 'cancelled',
          cancellationReason: 'Illegal retrospective cancellation',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid consultation status transition from 'completed' to 'cancelled'/)
  })

  it('14: Server enforces that cancelled status is TERMINAL (rejects transition to draft or completed)', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-23T00:00:00.000Z',
        consultationType: 'clinical_review',
        status: 'cancelled',
        cancellationReason: 'Patient cancelled visit.',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Attempt illegal transition: cancelled -> draft
    await expect(
      payload.update({
        collection: 'consultations',
        id: consultation.id,
        data: {
          status: 'draft',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid consultation status transition from 'cancelled' to 'draft'/)

    // Attempt illegal transition: cancelled -> completed
    await expect(
      payload.update({
        collection: 'consultations',
        id: consultation.id,
        data: {
          status: 'completed',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid consultation status transition from 'cancelled' to 'completed'/)
  })

  it('15: Staff cannot reassign client on an existing consultation (isAdminFieldLevel)', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-24T00:00:00.000Z',
        consultationType: 'initial_examination',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Attempt client reassignment with Staff user
    const updated = await payload.update({
      collection: 'consultations',
      id: consultation.id,
      data: {
        client: testClient2Id, // Staff attempts to reassign patient
        chiefComplaint: 'Staff valid complaint edit',
      },
      overrideAccess: false,
      user: staffUser,
    })

    // Client field remains unchanged (preserved referential integrity)
    const clientRef =
      typeof updated.client === 'object' ? (updated.client as any).id : updated.client
    expect(clientRef).toBe(testClientId)
    expect(clientRef).not.toBe(testClient2Id)
    expect(updated.chiefComplaint).toBe('Staff valid complaint edit')
  })

  it('16: Staff cannot delete a consultation (hard deletion is restricted to Admin)', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-25T00:00:00.000Z',
        consultationType: 'initial_examination',
        status: 'draft',
      },
      overrideAccess: true,
    })
    createdConsultationIds.push(consultation.id)

    // Staff deletion attempt -> MUST FAIL
    await expect(
      payload.delete({
        collection: 'consultations',
        id: consultation.id,
        overrideAccess: false,
        user: staffUser,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('17: Admin CAN successfully delete a consultation', async () => {
    const consultation = await payload.create({
      collection: 'consultations',
      data: {
        client: testClientId,
        consultationDate: '2026-10-26T00:00:00.000Z',
        consultationType: 'initial_examination',
        status: 'draft',
      },
      overrideAccess: true,
    })

    const deleted = await payload.delete({
      collection: 'consultations',
      id: consultation.id,
      overrideAccess: false,
      user: adminUser,
    })

    expect(deleted).toBeDefined()
    expect(deleted.id).toBe(consultation.id)
  })

  it('18: Bounded Querying directly via Payload Local API with limit and client filter (No artificial repository, no pagination:false)', async () => {
    const result = await payload.find({
      collection: 'consultations',
      limit: 10,
      where: {
        client: {
          equals: testClientId,
        },
      },
      sort: '-consultationDate',
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
})
