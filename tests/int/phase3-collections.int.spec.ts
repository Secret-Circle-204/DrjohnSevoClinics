import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Phase 3 Schema & Access Control Verification', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('verifies all Phase 3 collections are registered and accessible to admin', async () => {
    const collections = ['users', 'media', 'services', 'doctors', 'categories', 'blog-posts', 'youtube-videos', 'inquiries'] as const
    for (const collection of collections) {
      const res = await (payload.find as any)({
        collection,
        overrideAccess: true,
        limit: 1,
      })
      expect(res).toBeDefined()
      expect(typeof res.totalDocs).toBe('number')
    }
  })

  it('strictly blocks public/unauthenticated read access on Inquiries by throwing Forbidden', async () => {
    await expect(
      payload.find({
        collection: 'inquiries',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)
  })

  it('allows public creation of Inquiries while keeping read access strictly forbidden', async () => {
    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        fullName: 'Test Public Visitor',
        phone: '+971500000000',
        email: 'visitor@example.com',
        preferredTime: 'morning',
        message: 'Pre-appointment inquiry test',
        status: 'new',
      },
      overrideAccess: false,
      user: null as any,
    })
    expect(inquiry.id).toBeDefined()
    expect(inquiry.fullName).toBe('Test Public Visitor')

    // Verify public still cannot read this created inquiry (throws Forbidden)
    await expect(
      payload.find({
        collection: 'inquiries',
        overrideAccess: false,
        user: null as any,
      }),
    ).rejects.toThrow(/not allowed/)

    // Clean up test doc with overrideAccess
    await payload.delete({
      collection: 'inquiries',
      id: inquiry.id,
      overrideAccess: true,
    })
  })

  it('verifies public read access on Media blocks private media', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const imageBuffer = fs.readFileSync(path.resolve('public/images/patient-sarah.png'))

    // Create a private media document with valid buffer
    const privateMedia = await payload.create({
      collection: 'media',
      data: {
        alt: 'Private clinical record image',
        visibility: 'private',
      },
      file: {
        data: new Uint8Array(imageBuffer) as unknown as Buffer,
        name: 'patient-sarah.png',
        mimetype: 'image/png',
        size: imageBuffer.length,
      },
      overrideAccess: true,
    })

    // Public should NOT see private media (where filter returns 0 docs)
    const publicFind = await payload.find({
      collection: 'media',
      where: {
        id: {
          equals: privateMedia.id,
        },
      },
      overrideAccess: false,
      user: null as any,
    })
    expect(publicFind.totalDocs).toBe(0)

    // Clean up test doc
    await payload.delete({
      collection: 'media',
      id: privateMedia.id,
      overrideAccess: true,
    })
  })
})
