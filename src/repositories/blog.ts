import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { BlogPost, Category, YoutubeVideo } from '@/payload-types'
import type { PaginatedResult } from './clinic'

/**
 * Bounded, demand-driven retrieval of educational articles.
 */
export async function getBlogPosts({
  categorySlug,
  page = 1,
  limit = 10,
}: {
  categorySlug?: string
  page?: number
  limit?: number
} = {}): Promise<PaginatedResult<BlogPost>> {
  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = [{ isActive: { equals: true } }]

  if (categorySlug) {
    whereConditions.push({
      'category.slug': {
        equals: categorySlug,
      },
    })
  }

  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: whereConditions,
    },
    sort: '-publishedAt',
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
 * Retrieves a single educational article by its unique URL slug.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { isActive: { equals: true } },
      ],
    },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })

  return result.docs[0] || null
}

/**
 * Retrieves all content categories for blog and video filtering.
 */
export async function getCategories(): Promise<Category[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'categories',
    sort: 'name',
    limit: 50,
    depth: 0,
    overrideAccess: false,
  })

  return result.docs
}

/**
 * Bounded, demand-driven retrieval of YouTube educational videos.
 */
export async function getYouTubeVideos({
  categorySlug,
  page = 1,
  limit = 10,
}: {
  categorySlug?: string
  page?: number
  limit?: number
} = {}): Promise<PaginatedResult<YoutubeVideo>> {
  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = [{ isActive: { equals: true } }]

  if (categorySlug) {
    whereConditions.push({
      'category.slug': {
        equals: categorySlug,
      },
    })
  }

  const result = await payload.find({
    collection: 'youtube-videos',
    where: {
      and: whereConditions,
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
 * Derives YouTube video ID dynamically from canonical youtubeUrl.
 * Eliminates duplicate database source of truth.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

