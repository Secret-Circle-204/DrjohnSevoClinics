import type { MetadataRoute } from 'next'
import { getServices } from '@/repositories/clinic'
import { getBlogPosts } from '@/repositories/blog'

/**
 * Dynamic XML Sitemap Generator.
 * Traverses active public content through bounded repository pagination.
 * Excludes inactive or draft content strictly.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'
  const now = new Date()

  // 1. Static Approved Public Routes
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // 2. Bounded Active Services Traversal (Batch size 25, continues via hasNextPage)
  let servicePage = 1
  let hasMoreServices = true
  while (hasMoreServices) {
    const res = await getServices({ page: servicePage, limit: 25 })
    for (const service of res.docs) {
      if (service.slug) {
        entries.push({
          url: `${siteUrl}/services/${service.slug}`,
          lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
    hasMoreServices = res.hasNextPage
    servicePage++
  }

  // 3. Bounded Active Educational Blog Posts Traversal (Batch size 25, continues via hasNextPage)
  let blogPage = 1
  let hasMorePosts = true
  while (hasMorePosts) {
    const res = await getBlogPosts({ page: blogPage, limit: 25 })
    for (const post of res.docs) {
      if (post.slug) {
        entries.push({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
    hasMorePosts = res.hasNextPage
    blogPage++
  }

  return entries
}
