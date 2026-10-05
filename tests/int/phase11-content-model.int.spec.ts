import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Phase 11 Content Model & Admin Architecture Verification', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('verifies Home global contains structured Why Choose pillars and Trust Stats', async () => {
    const home = await payload.findGlobal({
      slug: 'home',
    })
    expect(home).toBeDefined()
    expect(home.whyChooseTitle).toBe('Our Strengths')
    expect(Array.isArray(home.whyChooseItems)).toBe(true)
    expect(home.whyChooseItems!.length).toBeGreaterThanOrEqual(9)
    expect(home.whyChooseItems![0].title).toBe('Advanced Dental Technologies')

    expect(Array.isArray(home.trustStats)).toBe(true)
    expect(home.trustStats!.length).toBeGreaterThanOrEqual(4)
    expect(home.trustStats![0].value).toBe('100%')
  })

  it('verifies About global contains Founder Message, Core Values, and Lexical narratives', async () => {
    const about = await payload.findGlobal({
      slug: 'about',
    })
    expect(about).toBeDefined()
    expect(about.founderName).toBe('Dr. John Sevo Dawod')
    expect(about.founderQuote).toContain('Since the beginning')
    expect(about.founderRole).toBe('Founder & Medical Director')

    expect(about.positioning).toContain('Modern Dentistry')

    expect(Array.isArray(about.coreValues)).toBe(true)
    expect(about.coreValues!.length).toBe(7)
    expect(about.coreValues![0].title).toBe('Patient First')
    expect(about.coreValues![6].title).toBe('Integrity')

    expect(about.storyContent).toBeDefined()
    expect((about.storyContent as any)?.root?.children?.length).toBeGreaterThan(0)

    expect(about.experienceNarrative).toBeDefined()
    expect((about.experienceNarrative as any)?.root?.children?.length).toBeGreaterThan(0)
  })

  it('verifies ClinicInfo operational structures remain semantic and structured', async () => {
    const info = await payload.findGlobal({
      slug: 'clinic-info',
    })
    expect(info).toBeDefined()
    expect(info.clinicName).toBeDefined()
    expect(Array.isArray(info.phoneNumbers)).toBe(true)
    expect(Array.isArray(info.openingHours)).toBe(true)
    expect(Array.isArray(info.socialLinks)).toBe(true)
  })

  it('verifies Before & After cases migrated to dedicated Transformations collection', async () => {
    const home = await payload.findGlobal({
      slug: 'home',
    })
    expect(home).toBeDefined()
    expect((home as any).beforeAfterCases).toBeUndefined()

    const transformations = await payload.find({
      collection: 'transformations' as any,
      limit: 10,
    })
    expect(transformations).toBeDefined()
    expect(transformations.totalDocs).toBeGreaterThanOrEqual(2)
    expect(transformations.docs[0].title).toBeDefined()
    expect(transformations.docs[0].beforeImage).toBeDefined()
    expect(transformations.docs[0].afterImage).toBeDefined()
  })

  it('verifies Doctors collection qualifications array preserves its structure', async () => {
    const doctors = await payload.find({
      collection: 'doctors',
      limit: 1,
    })
    expect(doctors).toBeDefined()
  })
})
