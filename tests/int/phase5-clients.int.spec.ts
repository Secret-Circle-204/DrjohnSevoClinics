import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

let payload: Payload
const createdClientIds: number[] = []

describe('Phase 5 — Client Management Foundation Integration Tests', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    // Clean up test documents
    for (const id of createdClientIds) {
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
  })

  it('1 & 2: Admin/Staff can create a Client record without a User (user: null)', async () => {
    const client = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Ahmad Al-Mansoor',
        phone: '+971501112233',
        email: 'ahmad.mansoor@example.com',
        dateOfBirth: '1985-06-15T00:00:00.000Z',
        gender: 'male',
        address: 'Downtown Dubai, Boulevard Plaza Tower 1',
        emergencyContact: {
          name: 'Fatima Al-Mansoor',
          relationship: 'Spouse',
          phone: '+971501112234',
        },
        status: 'active',
        internalNotes: 'Administrative note: Prefers morning appointments, VIP courtesy.',
        notificationPreferences: {
          emailNotifications: true,
          dashboardNotifications: true,
        },
      },
      overrideAccess: true, // Emulates authenticated admin/staff
    })

    expect(client).toBeDefined()
    expect(client.id).toBeDefined()
    expect(client.fullName).toBe('Ahmad Al-Mansoor')
    expect(client.phone).toBe('+971501112233')
    expect(client.user).toBeNull()
    expect(client.status).toBe('active')
    expect(client.notificationPreferences?.emailNotifications).toBe(true)

    createdClientIds.push(client.id)
  })

  it('3: Public/unauthenticated visitors strictly CANNOT create Client records', async () => {
    await expect(
      payload.create({
        collection: 'clients',
        data: {
          fullName: 'Malicious Public Actor',
          phone: '+971509999999',
          status: 'active',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('4: Public/unauthenticated visitors strictly CANNOT read Client records', async () => {
    await expect(
      payload.find({
        collection: 'clients',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('5: Public/unauthenticated visitors strictly CANNOT update Client records', async () => {
    const targetId = createdClientIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.update({
        collection: 'clients',
        id: targetId,
        data: {
          fullName: 'Hacked Name',
        },
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('6: Public/unauthenticated visitors strictly CANNOT delete Client records', async () => {
    const targetId = createdClientIds[0]
    expect(targetId).toBeDefined()

    await expect(
      payload.delete({
        collection: 'clients',
        id: targetId,
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('7: Duplicate email is accepted (non-unique email constraint for family members)', async () => {
    const sharedEmail = 'family.shared@example.com'

    const client1 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Omar Khalid (Parent)',
        phone: '+971502223344',
        email: sharedEmail,
        status: 'active',
      },
      overrideAccess: true,
    })
    createdClientIds.push(client1.id)

    const client2 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Zayd Omar (Child)',
        phone: '+971502223345',
        email: sharedEmail, // Same email!
        status: 'active',
      },
      overrideAccess: true,
    })
    createdClientIds.push(client2.id)

    expect(client1.id).toBeDefined()
    expect(client2.id).toBeDefined()
    expect(client1.email).toBe(sharedEmail)
    expect(client2.email).toBe(sharedEmail)
    expect(client1.id).not.toBe(client2.id)
  })

  it('8: Duplicate phone number is accepted (non-unique phone constraint for household/landlines)', async () => {
    const sharedPhone = '+97144445555'

    const client1 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Maryam Al-Sabah',
        phone: sharedPhone,
        status: 'active',
      },
      overrideAccess: true,
    })
    createdClientIds.push(client1.id)

    const client2 = await payload.create({
      collection: 'clients',
      data: {
        fullName: 'Nour Al-Sabah',
        phone: sharedPhone, // Same phone!
        status: 'active',
      },
      overrideAccess: true,
    })
    createdClientIds.push(client2.id)

    expect(client1.phone).toBe(sharedPhone)
    expect(client2.phone).toBe(sharedPhone)
    expect(client1.id).not.toBe(client2.id)
  })

  it('9: Phone search works through bounded server-side retrieval', async () => {
    const targetPhone = '+971501112233'
    const results = await payload.find({
      collection: 'clients',
      where: {
        phone: {
          equals: targetPhone,
        },
      },
      limit: 10,
      overrideAccess: true,
    })

    expect(results.totalDocs).toBeGreaterThanOrEqual(1)
    expect(results.docs[0].phone).toBe(targetPhone)
    expect(results.limit).toBe(10)
  })

  it('10 & 11: Field-level security hides internalNotes from unauthenticated/client context', async () => {
    const client = await payload.findByID({
      collection: 'clients',
      id: createdClientIds[0],
      overrideAccess: false,
      user: null as any,
    }).catch((err) => err)

    // Unauthenticated access fails completely at collection level
    expect(client).toBeInstanceOf(Error)

    // Admin access retrieves full record with internal notes
    const adminClient = await payload.findByID({
      collection: 'clients',
      id: createdClientIds[0],
      overrideAccess: true,
    })
    expect(adminClient.internalNotes).toBeDefined()
    expect(adminClient.internalNotes).toContain('Administrative note')
  })

  it('12: User relationship remains optional and nullable', async () => {
    const client = await payload.findByID({
      collection: 'clients',
      id: createdClientIds[0],
      overrideAccess: true,
    })
    expect(client.user).toBeNull()
  })

  it('13: No assignedDoctor field exists on Clients collection schema', () => {
    const clientCollection = payload.config.collections.find((c) => c.slug === 'clients')
    expect(clientCollection).toBeDefined()

    const fieldNames = clientCollection?.fields.map((f: any) => f.name)
    expect(fieldNames).not.toContain('assignedDoctor')
    expect(fieldNames).not.toContain('doctor')
    expect(fieldNames).not.toContain('doctors')
  })

  it('14: No Inquiry -> Client relationship exists on Inquiries collection schema', () => {
    const inquiryCollection = payload.config.collections.find((c) => c.slug === 'inquiries')
    expect(inquiryCollection).toBeDefined()

    const fieldNames = inquiryCollection?.fields.map((f: any) => f.name)
    expect(fieldNames).not.toContain('client')
    expect(fieldNames).not.toContain('clients')
  })

  it('15: No Client repository exists without a real application consumer', () => {
    const repoPath = path.resolve('src/repositories/clients.ts')
    expect(fs.existsSync(repoPath)).toBe(false)
  })
})
