import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { getTransformations, getHomeContent } from '@/repositories/clinic'
import { loadMoreTransformationsAction } from '@/app/(frontend)/actions/transformations'

let payload: Payload
const createdTestIds: number[] = []

describe('Transformations Bounded Scale & Scalable Public Content Architecture (Constitution 14.1)', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Seed a test dataset of 30 additional transformations to simulate scale > 24
    for (let i = 1; i <= 30; i++) {
      const doc = await payload.create({
        collection: 'transformations' as any,
        data: {
          title: `Scale Test Case #${i.toString().padStart(2, '0')}`,
          beforeImage: 76,
          afterImage: 75,
          description: `Clinical verification case for scale testing #${i}`,
          isFeatured: true,
          displayOrder: 10 + i,
        },
      })
      createdTestIds.push(doc.id as number)
    }
  })

  afterAll(async () => {
    // Clean up created scale test items
    for (const id of createdTestIds) {
      try {
        await payload.delete({
          collection: 'transformations' as any,
          id,
        })
      } catch {
        // Ignore deletion errors during cleanup
      }
    }
  })

  it('proves initial query returns strictly at most 6 records despite large database cardinality', async () => {
    const result = await getTransformations({ page: 1, limit: 6, featuredOnly: true })

    expect(result.docs).toBeDefined()
    expect(result.docs.length).toBeLessThanOrEqual(6)
    expect(result.docs.length).toBe(6)
    expect(result.totalDocs).toBeGreaterThanOrEqual(22)
    expect(result.page).toBe(1)
    expect(result.hasNextPage).toBe(true)
    expect(result.nextPage).toBe(2)
  })

  it('proves page 2 returns only the next bounded window with disjoint IDs', async () => {
    const page1 = await getTransformations({ page: 1, limit: 6, featuredOnly: true })
    const page2 = await getTransformations({ page: 2, limit: 6, featuredOnly: true })

    expect(page2.docs.length).toBe(6)
    expect(page2.page).toBe(2)
    expect(page2.hasPrevPage).toBe(true)

    const page1Ids = page1.docs.map((d) => d.id)
    const page2Ids = page2.docs.map((d) => d.id)

    // Ensure zero overlap between page 1 and page 2
    for (const id of page2Ids) {
      expect(page1Ids).not.toContain(id)
    }
  })

  it('proves server-side sorting by displayOrder is enforced deterministically', async () => {
    const result = await getTransformations({ page: 1, limit: 6, featuredOnly: true })

    for (let i = 0; i < result.docs.length - 1; i++) {
      const currentOrder = result.docs[i].displayOrder ?? 0
      const nextOrder = result.docs[i + 1].displayOrder ?? 0
      expect(currentOrder).toBeLessThanOrEqual(nextOrder)
    }
  })

  it('proves repository enforces bounded limit guardrail against unbounded requests', async () => {
    // Attempt an unbounded or very large query (e.g. limit: 10,000)
    const result = await getTransformations({ page: 1, limit: 10000, featuredOnly: false })

    // Must be bounded to the max server ceiling (24), never returning all 22+ docs unrestricted
    expect(result.docs.length).toBeLessThanOrEqual(24)
    expect(result.docs.length).toBeLessThan(result.totalDocs)
  })

  it('proves loadMoreTransformationsAction server action retrieves next bounded page', async () => {
    const res = await loadMoreTransformationsAction(2, 6)

    expect(res).toBeDefined()
    expect(res.docs.length).toBe(6)
    expect(res.page).toBe(2)
  })

  it('proves migrated clinical records preserve media relationships and data', async () => {
    const result = await getTransformations({ page: 1, limit: 2, featuredOnly: true })
    expect(result.docs.length).toBeGreaterThanOrEqual(2)

    const firstCase = result.docs[0]
    expect(firstCase.title).toBeDefined()
    expect(firstCase.beforeImage).toBeDefined()
    expect(firstCase.afterImage).toBeDefined()

    // Relationships resolved at depth 1
    if (typeof firstCase.beforeImage === 'object') {
      expect(firstCase.beforeImage.url).toBeDefined()
    }
    if (typeof firstCase.afterImage === 'object') {
      expect(firstCase.afterImage.url).toBeDefined()
    }
  })

  it('proves Home singleton no longer stores embedded cases and remains healthy', async () => {
    const home = await getHomeContent()
    expect(home).toBeDefined()
    expect((home as any)?.beforeAfterCases).toBeUndefined()
    expect(home?.heroTitle).toBeDefined()
    expect(home?.whyChooseItems).toBeDefined()
    expect(home?.trustStats).toBeDefined()
  })
})
