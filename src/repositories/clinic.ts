import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Home, About, ClinicInfo, Service, Doctor } from '@/payload-types'

export interface PaginatedResult<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
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
  }
}
