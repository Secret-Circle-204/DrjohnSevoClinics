import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

let payload: Payload
let testClientId: number
let testDoctorId: number | undefined
let testServiceId: number | undefined
const createdAppointmentIds: number[] = []

describe('Phase 6 — Appointment Foundation Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // 1. Create a test Client fixture
    const client = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Phase 6 Test Patient',
        phone: '+971509998877',
        status: 'active',
      },
      overrideAccess: true,
    })
    testClientId = client.id

    // 2. Fetch or create a test Doctor fixture
    const doctors = await payload.find({
      collection: 'doctors',
      limit: 1,
      overrideAccess: true,
    })
    if (doctors.docs.length > 0) {
      testDoctorId = doctors.docs[0].id
    }

    // 3. Fetch or create a test Service fixture
    const services = await payload.find({
      collection: 'services',
      limit: 1,
      overrideAccess: true,
    })
    if (services.docs.length > 0) {
      testServiceId = services.docs[0].id
    }
  })

  afterAll(async () => {
    // Clean up created appointments
    for (const id of createdAppointmentIds) {
      try {
        await payload.delete({
          collection: 'appointments',
          id,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }

    // Clean up test client
    if (testClientId) {
      try {
        await payload.delete({
          collection: 'clients',
          id: testClientId,
          overrideAccess: true,
        })
      } catch {
        // Ignore cleanup errors
      }
    }
  })

  it('1: Fails to create an appointment without a Client (client is required)', async () => {
    await expect(
      payload.create({
        collection: 'appointments',
        data: {
          client: null as any,
          dateTime: '2026-10-01T10:00:00.000Z',
          appointmentType: 'consultation',
          status: 'scheduled',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('2: Fails to create an appointment without a dateTime (dateTime is required)', async () => {
    await expect(
      payload.create({
        collection: 'appointments',
        data: {
          client: testClientId,
          dateTime: null as any,
          appointmentType: 'consultation',
          status: 'scheduled',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('3: Admin/Staff can successfully create an appointment with initial scheduled status', async () => {
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        doctor: testDoctorId,
        service: testServiceId,
        dateTime: '2026-10-15T09:30:00.000Z',
        appointmentType: 'treatment',
        status: 'scheduled',
        duration: 45,
        notes: 'Initial clinical preparation for veneer consultation.',
        followUpRequired: false,
      },
      overrideAccess: true,
    })

    expect(appointment).toBeDefined()
    expect(appointment.id).toBeDefined()
    expect(appointment.status).toBe('scheduled')
    expect(appointment.duration).toBe(45)
    expect(appointment.appointmentType).toBe('treatment')

    createdAppointmentIds.push(appointment.id)
  })

  it('4: Public visitors strictly CANNOT create appointments', async () => {
    await expect(
      payload.create({
        collection: 'appointments',
        data: {
          client: testClientId,
          dateTime: '2026-10-15T11:00:00.000Z',
          appointmentType: 'consultation',
          status: 'scheduled',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('5: Public visitors strictly CANNOT read appointments', async () => {
    await expect(
      payload.find({
        collection: 'appointments',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('6: Public visitors strictly CANNOT update appointments', async () => {
    const targetId = createdAppointmentIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.update({
        collection: 'appointments',
        id: targetId,
        data: {
          notes: 'Public malicious edit attempt',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('7: Public visitors strictly CANNOT delete appointments', async () => {
    const targetId = createdAppointmentIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.delete({
        collection: 'appointments',
        id: targetId,
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('8: Server enforces valid lifecycle transition: scheduled -> confirmed -> completed', async () => {
    const appt = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        dateTime: '2026-10-20T14:00:00.000Z',
        appointmentType: 'consultation',
        status: 'scheduled',
      },
      overrideAccess: true,
    })
    createdAppointmentIds.push(appt.id)

    // Step 1: Transition scheduled -> confirmed
    const confirmed = await payload.update({
      collection: 'appointments',
      id: appt.id,
      data: {
        status: 'confirmed',
      },
      overrideAccess: true,
    })
    expect(confirmed.status).toBe('confirmed')

    // Step 2: Transition confirmed -> completed
    const completed = await payload.update({
      collection: 'appointments',
      id: appt.id,
      data: {
        status: 'completed',
        followUpRequired: true,
        followUpNotes: 'Check bite after 2 weeks',
      },
      overrideAccess: true,
    })
    expect(completed.status).toBe('completed')
    expect(completed.followUpRequired).toBe(true)
  })

  it('9: Server rejects invalid lifecycle transition from terminal completed state', async () => {
    // Find the completed appointment from test 8
    const completedApptId = createdAppointmentIds[createdAppointmentIds.length - 1]

    await expect(
      payload.update({
        collection: 'appointments',
        id: completedApptId,
        data: {
          status: 'scheduled', // Illegal transition from terminal state!
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/Invalid appointment status transition/)
  })

  it('10: Server enforces cancellationReason requirement when status is set to cancelled', async () => {
    const appt = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        dateTime: '2026-10-22T15:00:00.000Z',
        appointmentType: 'consultation',
        status: 'scheduled',
      },
      overrideAccess: true,
    })
    createdAppointmentIds.push(appt.id)

    // Attempt 1: Cancel without cancellationReason -> MUST FAIL
    await expect(
      payload.update({
        collection: 'appointments',
        id: appt.id,
        data: {
          status: 'cancelled',
          cancellationReason: '', // Empty reason!
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cancellationReason is required/)

    // Attempt 2: Cancel with cancellationReason -> MUST SUCCEED
    const cancelled = await payload.update({
      collection: 'appointments',
      id: appt.id,
      data: {
        status: 'cancelled',
        cancellationReason: 'Patient travel emergency; notified clinic 2 days prior.',
      },
      overrideAccess: true,
    })
    expect(cancelled.status).toBe('cancelled')
    expect(cancelled.cancellationReason).toContain('Patient travel emergency')
  })

  it('11: Server allows transition from confirmed to no_show as a manual administrative action', async () => {
    const appt = await payload.create({
      collection: 'appointments',
      data: {
        client: testClientId,
        dateTime: '2026-10-25T16:00:00.000Z',
        appointmentType: 'consultation',
        status: 'confirmed',
      },
      overrideAccess: true,
    })
    createdAppointmentIds.push(appt.id)

    const noShow = await payload.update({
      collection: 'appointments',
      id: appt.id,
      data: {
        status: 'no_show',
        notes: 'Patient did not arrive and phone was switched off.',
      },
      overrideAccess: true,
    })
    expect(noShow.status).toBe('no_show')
  })

  it('12: Bounded queries work with indexed fields (client, dateTime, status)', async () => {
    const results = await payload.find({
      collection: 'appointments',
      where: {
        client: {
          equals: testClientId,
        },
      },
      limit: 10,
      overrideAccess: true,
    })

    expect(results.totalDocs).toBeGreaterThanOrEqual(1)
    expect(results.limit).toBe(10)
    expect(results.docs[0].client).toBeDefined()
  })

  it('13: Prohibited scope check: Appointments collection schema contains no redundant patient fields', () => {
    const apptCollection = payload.config.collections.find((c) => c.slug === 'appointments')
    expect(apptCollection).toBeDefined()

    const fieldNames = apptCollection?.fields.map((f: any) => f.name)
    expect(fieldNames).not.toContain('patientName')
    expect(fieldNames).not.toContain('patientPhone')
    expect(fieldNames).not.toContain('patientEmail')
    expect(fieldNames).not.toContain('doctorName')
    expect(fieldNames).not.toContain('serviceName')
    expect(fieldNames).not.toContain('inquiry')
    expect(fieldNames).not.toContain('rescheduled')
  })

  it('14: Phase 5 Clients schema remains intact and frozen', () => {
    const clientCollection = payload.config.collections.find((c) => c.slug === 'clients')
    expect(clientCollection).toBeDefined()

    const fieldNames = clientCollection?.fields.map((f: any) => f.name)
    expect(fieldNames).not.toContain('assignedDoctor')
    expect(fieldNames).not.toContain('appointments')
  })

  it('15: No unused appointments repository exists in src/repositories', () => {
    const repoPath = path.resolve('src/repositories/appointments.ts')
    expect(fs.existsSync(repoPath)).toBe(false)
  })
})
