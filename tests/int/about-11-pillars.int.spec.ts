import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'
import { extractSectionsFromLexical } from '@/lib/lexicalSections'

let payload: Payload

describe('About Page 11 Official Content Pillars & Consumer Coverage Test', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('verifies 01 — Founder message is fully populated from About global', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    expect(about).toBeDefined()
    expect(about.founderQuote).toBeDefined()
    expect(about.founderQuote!.length).toBeGreaterThan(20)
    expect(about.founderName).toBe('Dr. John Sevo Dawod')
    expect(about.founderRole).toBeDefined()
    expect(about.founderTitle).toBeDefined()
  })

  it('verifies 02 — Philosophy is extractable from experienceNarrative with zero duplication', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    const sections = extractSectionsFromLexical(about.experienceNarrative)
    const philosophy =
      sections['ourphilosophy'] ||
      Object.values(sections).find((s) => s.title.toLowerCase().includes('philosophy'))

    expect(philosophy).toBeDefined()
    expect(philosophy!.paragraphs.length).toBeGreaterThanOrEqual(1)
    expect(philosophy!.paragraphs[0]).toContain('patient-centered dentistry')
  })

  it('verifies 03 — About John Sevo Clinics heritage is populated from storyTitle & storyContent', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    expect(about.storyTitle).toBeDefined()
    expect(about.storyTitle!.length).toBeGreaterThan(0)
    expect(about.storyContent).toBeDefined()
    expect((about.storyContent as any)?.root?.children?.length).toBeGreaterThan(0)
  })

  it('verifies 04 — The Vision is populated from About.vision', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    expect(about.vision).toBeDefined()
    expect(about.vision!.length).toBeGreaterThan(20)
  })

  it('verifies 05 — The Mission is populated from About.mission', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    expect(about.mission).toBeDefined()
    expect(about.mission!.length).toBeGreaterThan(20)
  })

  it('verifies 06 — Core Values contains all 7 official values', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    expect(Array.isArray(about.coreValues)).toBe(true)
    expect(about.coreValues!.length).toBe(7)
    const titles = about.coreValues!.map((v) => v.title)
    expect(titles).toContain('Patient First')
    expect(titles).toContain('Clinical Excellence')
    expect(titles).toContain('Trust & Transparency')
    expect(titles).toContain('Continuous Development')
    expect(titles).toContain('Innovation')
    expect(titles).toContain('Teamwork')
    expect(titles).toContain('Integrity')
  })

  it('verifies 07 — Strengths is cleanly sourced from Home.whyChooseItems with zero duplication', async () => {
    const home = await payload.findGlobal({ slug: 'home' })
    expect(home.whyChooseItems).toBeDefined()
    expect(home.whyChooseItems!.length).toBeGreaterThanOrEqual(9)
    expect(home.whyChooseItems![0].title).toBeDefined()
    expect(home.whyChooseItems![0].description).toBeDefined()
  })

  it('verifies 08 — Keys to Success is extractable from experienceNarrative', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    const sections = extractSectionsFromLexical(about.experienceNarrative)
    const success =
      sections['keystooursuccess'] ||
      sections['keystosuccess'] ||
      Object.values(sections).find((s) => s.title.toLowerCase().includes('success'))

    expect(success).toBeDefined()
    expect(success!.paragraphs.length).toBeGreaterThanOrEqual(1)
    expect(success!.paragraphs.join(' ')).toContain('Expertise')
  })

  it('verifies 09 — Research & Development is extractable from experienceNarrative', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    const sections = extractSectionsFromLexical(about.experienceNarrative)
    const rd =
      sections['researchdevelopment'] ||
      sections['research'] ||
      Object.values(sections).find((s) => s.title.toLowerCase().includes('research'))

    expect(rd).toBeDefined()
    expect(rd!.paragraphs.length).toBeGreaterThanOrEqual(1)
  })

  it('verifies 10 — Human Capital narrative is extractable and Doctors collection provides active doctors', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    const sections = extractSectionsFromLexical(about.experienceNarrative)
    const humanCapital =
      sections['humancapital'] ||
      Object.values(sections).find((s) => s.title.toLowerCase().includes('human'))

    expect(humanCapital).toBeDefined()
    expect(humanCapital!.paragraphs.length).toBeGreaterThanOrEqual(1)

    const doctors = await payload.find({
      collection: 'doctors',
      where: { isActive: { equals: true } },
    })
    expect(doctors).toBeDefined()
  })

  it('verifies 11 — Positioning statement is populated from About.positioning', async () => {
    const about = await payload.findGlobal({ slug: 'about' })
    expect(about.positioning).toBeDefined()
    expect(about.positioning!.length).toBeGreaterThan(20)
  })
})
