import type { MetadataRoute } from 'next'

/**
 * Search Engine Crawling Directives.
 * Note: robots.txt is strictly a crawler guideline, never a security or authorization mechanism.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
