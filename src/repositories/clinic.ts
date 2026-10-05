import { getPayload, type Where } from 'payload'
import configPromise from '@payload-config'
import type { Home, About, ClinicInfo, Service, Doctor, Transformation } from '@/payload-types'

export interface PaginatedResult<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
}

/**
 * Retrieves the Home page singleton content.
 */
export async function getHomeContent(): Promise<Home | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    return await payload.findGlobal({
      slug: 'home',
      depth: 1,
    })
  } catch {
    return null
  }
}

/**
 * Retrieves the About page singleton content.
 */
export async function getAboutContent(): Promise<About | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    return await payload.findGlobal({
      slug: 'about',
      depth: 1,
    })
  } catch {
    return null
  }
}

/**
 * Retrieves the central Clinic Information singleton (phones, hours, location, email).
 */
export async function getClinicInfo(): Promise<ClinicInfo | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    return await payload.findGlobal({
      slug: 'clinic-info',
      depth: 0,
    })
  } catch {
    return null
  }
}

/**
 * Bounded, demand-driven retrieval of active clinical services.
 * Respects Constitution Section 12 (limit bounds the page, not the dataset).
 */
export async function getServices({
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
} = {}): Promise<PaginatedResult<Service>> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'services',
    where: {
      isActive: {
        equals: true,
      },
    },
    sort: 'order',
    page,
    limit,
    depth: 1,
    overrideAccess: false,
  })

  return {
    docs: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? 1,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

/**
 * Retrieves a single active service by its unique URL slug.
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'services',
    where: {
      and: [
        { slug: { equals: slug } },
        { isActive: { equals: true } },
      ],
    },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })

  return result.docs[0] || null
}

/**
 * Bounded, demand-driven retrieval of the active medical team (Doctors).
 */
export async function getMedicalTeam({
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
} = {}): Promise<PaginatedResult<Doctor>> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'doctors',
    where: {
      isActive: {
        equals: true,
      },
    },
    sort: 'order',
    page,
    limit,
    depth: 1,
    overrideAccess: false,
  })

  return {
    docs: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? 1,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
    nextPage: result.nextPage,
  }
}

export interface GetTransformationsParams {
  page?: number
  limit?: number
  featuredOnly?: boolean
}

/**
 * Bounded, demand-driven retrieval of clinical Before & After transformations.
 * Respects Constitution Sections 11–14, 48, and 55 (Bounded, Demand-Driven Data Retrieval & Pagination Strategy).
 * Initial query retrieves only the bounded window required for the Theatre (default limit: 6).
 * pagination: false is strictly prohibited.
 */
export async function getTransformations({
  page = 1,
  limit = 6,
  featuredOnly = true,
}: GetTransformationsParams = {}): Promise<PaginatedResult<Transformation>> {
  const payload = await getPayload({ config: configPromise })

  // Guardrail: Enforce bounded limits (max 24 items per request)
  const boundedLimit = Math.max(1, Math.min(limit, 24))
  const safePage = Math.max(1, page)

  const whereClause: Where = featuredOnly
    ? {
        isFeatured: {
          equals: true,
        },
      }
    : {}

  let result = await payload.find({
    collection: 'transformations',
    where: whereClause,
    sort: ['displayOrder', '-createdAt'],
    page: safePage,
    limit: boundedLimit,
    depth: 1,
    overrideAccess: false,
  })

  // Fallback: If featured query yielded 0 docs on page 1, fetch general transformations boundedly
  if (result.docs.length === 0 && featuredOnly && safePage === 1) {
    result = await payload.find({
      collection: 'transformations',
      sort: ['displayOrder', '-createdAt'],
      page: 1,
      limit: boundedLimit,
      depth: 1,
      overrideAccess: false,
    })
  }

  return {
    docs: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? 1,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
    nextPage: result.nextPage,
  }
}

