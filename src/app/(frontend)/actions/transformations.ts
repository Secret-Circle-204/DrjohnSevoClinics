'use server'

import { getTransformations, type PaginatedResult } from '@/repositories/clinic'
import type { Transformation } from '@/payload-types'

/**
 * Server Action: Bounded retrieval of transformations for user-driven pagination / Load More.
 * Enforces bounded limits (max 12 per call) and safe page numbers.
 * Respects Constitution Section 14.1 (Scalable Repeated Public Content & Bounded Reads).
 */
export async function loadMoreTransformationsAction(
  page: number,
  limit: number = 6,
): Promise<PaginatedResult<Transformation>> {
  const boundedLimit = Math.max(1, Math.min(limit, 12))
  const safePage = Math.max(1, page)

  return await getTransformations({
    page: safePage,
    limit: boundedLimit,
    featuredOnly: true,
  })
}
