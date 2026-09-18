import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
let testClientId: number
let testClient2Id: number
let testAppointmentId: number | undefined
let staffUser: any
const createdFollowUpIds: number[] = []

describe('Phase 7 — Follow-Up Foundation Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // 1. Create primary test Client fixture
    const client1 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 7 Test Patient One',
        phone: '+971501112233',
        status: 'active',
      },
      overrideAccess: true,
    })
    testClientId = client1.id

    // 2. Create secondary test Client fixture (for reassignment testing)
    const client2 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 7 Test Patient Two',
        phone: '+971504445566',
        status: 'active',
      },
      overrideAccess: true,
    })
    testClient2Id = client2.id

    // 3. Create a test Appointment fixture for related follow-up testing
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        dateTime: '2026-10-10T10:00:00.000Z',
        appointmentType: 'treatment',
        status: 'completed',
        followUpRequired: true,
        followUpNotes: 'Check stitches after 7 days',
      },
      overrideAccess: true,
    })
    testAppointmentId = appointment.id

    // 4. Fetch or create Staff test user fixture
    const users = await payload.find({
      collection: 'users',
      limit: 10,
      overrideAccess: true,
    })

    staffUser = users.docs.find((u) => u.role === 'staff')

    if (!staffUser) {
      staffUser = await payload.create({
        collection: 'users',
        data: {
          name: 'Phase 7 Test Staff',
          email: 'phase7-staff-test@example.com',
          password: 'Password123!',
          role: 'staff',
        },
        overrideAccess: true,
      })
    }
  })

  afterAll(async () => {
    // Clean up created follow-ups
    for (const id of createdFollowUpIds) {
      try {
        await payload.delete({
          collection: 'follow-ups',
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

  it('1: Fails to create a follow-up without a Client (client is required)', async () => {
    await expect(
      payload.create({
        collection: 'follow-ups',
        data: {
          client: null as any,
          dueDate: '2026-10-17T00:00:00.000Z',
          followUpType: 'clinical_check',
          status: 'pending',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('2: Fails to create a follow-up without a dueDate (dueDate is required)', async () => {
    await expect(
      payload.create({
        collection: 'follow-ups',
        data: {
          client: testClientId,
          dueDate: null as any,
          followUpType: 'clinical_check',
          status: 'pending',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('3: Admin/Staff can successfully create a follow-up linked to an appointment', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        appointment: testAppointmentId,
        dueDate: '2026-10-17T00:00:00.000Z',
        followUpType: 'suture_removal',
        status: 'pending',
        notes: 'Remove surgical sutures from upper right molar area.',
      },
      overrideAccess: true,
    })

    expect(followUp).toBeDefined()
    expect(followUp.id).toBeDefined()
    expect(followUp.status).toBe('pending')
    expect(followUp.followUpType).toBe('suture_removal')
    expect(followUp.notes).toBe('Remove surgical sutures from upper right molar area.')

    createdFollowUpIds.push(followUp.id)
  })

  it('4: Successfully creates an independent periodic recall follow-up WITHOUT an appointment', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2027-04-15T00:00:00.000Z',
        followUpType: 'routine_recall',
        status: 'pending',
        notes: 'Six-month periodic check-up and scaling reminder.',
      },
      overrideAccess: true,
    })

    expect(followUp).toBeDefined()
    expect(followUp.id).toBeDefined()
    expect(followUp.appointment).toBeFalsy()
    expect(followUp.followUpType).toBe('routine_recall')

    createdFollowUpIds.push(followUp.id)
  })

  it('5: Public visitors strictly CANNOT create follow-ups', async () => {
    await expect(
      payload.create({
        collection: 'follow-ups',
        data: {
          client: testClientId,
          dueDate: '2026-10-25T00:00:00.000Z',
          followUpType: 'administrative',
          status: 'pending',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('6: Public visitors strictly CANNOT read follow-ups', async () => {
    await expect(
      payload.find({
        collection: 'follow-ups',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('7: Public visitors strictly CANNOT update follow-ups', async () => {
    const targetId = createdFollowUpIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.update({
        collection: 'follow-ups',
        id: targetId,
        data: {
          notes: 'Malicious public edit attempt',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('8: Public visitors strictly CANNOT delete follow-ups', async () => {
    const targetId = createdFollowUpIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.delete({
        collection: 'follow-ups',
        id: targetId,
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('9: Server enforces valid lifecycle sequence: pending -> contacted -> completed', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-18T00:00:00.000Z',
        followUpType: 'treatment_review',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Step 1: Transition pending -> contacted
    const contacted = await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'contacted',
      },
      overrideAccess: true,
    })
    expect(contacted.status).toBe('contacted')

    // Step 2: Transition contacted -> completed
    const completed = await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'completed',
        outcome: 'Patient confirmed healing with no sensitivity. Case closed.',
      },
      overrideAccess: true,
    })
    expect(completed.status).toBe('completed')
    expect(completed.outcome).toBe('Patient confirmed healing with no sensitivity. Case closed.')
  })

  it('10: Server enforces authorized lifecycle transition: contacted -> cancelled with cancellationReason', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-19T00:00:00.000Z',
        followUpType: 'clinical_check',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Move to contacted
    await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'contacted',
      },
      overrideAccess: true,
    })

    // Move contacted -> cancelled
    const cancelled = await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'cancelled',
        cancellationReason: 'Patient relocated abroad and requested to cancel all further follow-ups.',
      },
      overrideAccess: true,
    })

    expect(cancelled.status).toBe('cancelled')
    expect(cancelled.cancellationReason).toBe(
      'Patient relocated abroad and requested to cancel all further follow-ups.',
    )
  })

  it('11: Server enforces cancellationReason requirement when status is set to cancelled', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-20T00:00:00.000Z',
        followUpType: 'administrative',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Attempt cancellation without cancellationReason -> MUST FAIL
    await expect(
      payload.update({
        collection: 'follow-ups',
        id: followUp.id,
        data: {
          status: 'cancelled',
          cancellationReason: '', // Empty reason
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cancellationReason is required/)
  })

  it('12: Server rejects invalid transition from contacted back to pending', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-21T00:00:00.000Z',
        followUpType: 'clinical_check',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Transition to contacted
    await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'contacted',
      },
      overrideAccess: true,
    })

    // Attempt illegal transition: contacted -> pending
    await expect(
      payload.update({
        collection: 'follow-ups',
        id: followUp.id,
        data: {
          status: 'pending',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid follow-up status transition from 'contacted' to 'pending'/)
  })

  it('13: Server rejects any status transition from terminal completed state', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-22T00:00:00.000Z',
        followUpType: 'clinical_check',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Direct transition pending -> completed
    await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'completed',
        outcome: 'Direct completion after clinic encounter.',
      },
      overrideAccess: true,
    })

    // Attempt illegal transition from terminal completed
    await expect(
      payload.update({
        collection: 'follow-ups',
        id: followUp.id,
        data: {
          status: 'pending',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid follow-up status transition from 'completed' to 'pending'/)
  })

  it('14: Server rejects any status transition from terminal cancelled state', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-23T00:00:00.000Z',
        followUpType: 'clinical_check',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Cancel with valid reason
    await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        status: 'cancelled',
        cancellationReason: 'Patient declined post-operative check.',
      },
      overrideAccess: true,
    })

    // Attempt illegal transition from terminal cancelled
    await expect(
      payload.update({
        collection: 'follow-ups',
        id: followUp.id,
        data: {
          status: 'contacted',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid follow-up status transition from 'cancelled' to 'contacted'/)
  })

  it('15: Staff cannot reassign client on an existing follow-up (isAdminFieldLevel)', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-24T00:00:00.000Z',
        followUpType: 'administrative',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Attempt reassignment with Staff user
    const updated = await payload.update({
      collection: 'follow-ups',
      id: followUp.id,
      data: {
        client: testClient2Id, // Staff attempts to reassign patient
        notes: 'Staff valid note edit',
      },
      overrideAccess: false,
      user: staffUser,
    })

    // Client field remains unchanged (preserved referential integrity)
    const clientRef = typeof updated.client === 'object' ? (updated.client as any).id : updated.client
    expect(clientRef).toBe(testClientId)
    expect(clientRef).not.toBe(testClient2Id)
    expect(updated.notes).toBe('Staff valid note edit')
  })

  it('16: Staff cannot delete a follow-up (hard deletion is restricted to Admin)', async () => {
    const followUp = await payload.create({
      collection: 'follow-ups',
      data: {
        client: testClientId,
        dueDate: '2026-10-25T00:00:00.000Z',
        followUpType: 'administrative',
        status: 'pending',
      },
      overrideAccess: true,
    })
    createdFollowUpIds.push(followUp.id)

    // Staff deletion attempt -> MUST FAIL
    await expect(
      payload.delete({
        collection: 'follow-ups',
        id: followUp.id,
        overrideAccess: false,
        user: staffUser,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('17: Bounded Querying directly via Payload Local API with limit and client filter (No artificial repository)', async () => {
    const result = await payload.find({
      collection: 'follow-ups',
      limit: 10,
      where: {
        client: {
          equals: testClientId,
        },
      },
      sort: '-dueDate',
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
