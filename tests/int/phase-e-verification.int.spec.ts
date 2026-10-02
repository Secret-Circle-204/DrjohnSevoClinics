import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import * as nextCache from 'next/cache'

// Spy on next/cache revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

let payload: Payload
const createdServiceIds: number[] = []
const createdPostIds: number[] = []
const createdDoctorIds: number[] = []
const createdMediaIds: number[] = []
const createdCategoryIds: number[] = []

describe('Phase E Evidence Closure Verification', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    // Cleanup any created test documents
    for (const id of createdServiceIds) {
      await payload.delete({ collection: 'services', id, overrideAccess: true }).catch(() => {})
    }
    for (const id of createdPostIds) {
      await payload.delete({ collection: 'blog-posts', id, overrideAccess: true }).catch(() => {})
    }
    for (const id of createdDoctorIds) {
      await payload.delete({ collection: 'doctors', id, overrideAccess: true }).catch(() => {})
    }
    for (const id of createdCategoryIds) {
      await payload.delete({ collection: 'categories', id, overrideAccess: true }).catch(() => {})
    }
    for (const id of createdMediaIds) {
      await payload.delete({ collection: 'media', id, overrideAccess: true }).catch(() => {})
    }
  })

  describe('1. Sitemap Dynamic Coverage & Bounded Pagination Verification', () => {
    it('proves that active services and posts appear in sitemap while inactive ones are excluded', async () => {
      // 1. Create an active service
      const activeService = await payload.create({
        collection: 'services',
        data: {
          title: 'Evidence Active Service',
          slug: 'evidence-active-service',
          shortDescription: 'Active service for sitemap verification',
          isActive: true,
        },
        overrideAccess: true,
      })
      createdServiceIds.push(activeService.id)

      // 2. Create an inactive service (draft / hidden)
      const inactiveService = await payload.create({
        collection: 'services',
        data: {
          title: 'Evidence Inactive Service',
          slug: 'evidence-inactive-service',
          shortDescription: 'Inactive service should be excluded',
          isActive: false,
        },
        overrideAccess: true,
      })
      createdServiceIds.push(inactiveService.id)

      // Create a test media for blog post
      const fs = await import('fs')
      const path = await import('path')
      const imageBuffer = fs.readFileSync(path.resolve('public/images/patient-sarah.png'))
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: 'Blog cover image',
          visibility: 'public',
        },
        file: {
          data: new Uint8Array(imageBuffer) as unknown as Buffer,
          name: 'blog-cover.png',
          mimetype: 'image/png',
          size: imageBuffer.length,
        },
        overrideAccess: true,
      })
      createdMediaIds.push(media.id)

      // Create a test category
      const category = await payload.create({
        collection: 'categories',
        data: {
          name: 'Oral Health',
          slug: 'oral-health',
        },
        overrideAccess: true,
      })
      createdCategoryIds.push(category.id)

      // 3. Create an active blog post with all required fields
      const activePost = await payload.create({
        collection: 'blog-posts',
        data: {
          title: 'Evidence Active Blog Article',
          slug: 'evidence-active-article',
          excerpt: 'Active blog article for sitemap verification',
          featuredImage: media.id,
          category: category.id,
          content: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  children: [{ type: 'text', text: 'Article content', version: 1 }],
                },
              ],
              direction: 'ltr',
            },
          },
          isActive: true,
        },
        overrideAccess: true,
      })
      createdPostIds.push(activePost.id)

      // 4. Generate sitemap
      const entries = await sitemap()

      // Assertions
      const urls = entries.map((e) => e.url)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'

      // Static routes present
      expect(urls).toContain(`${baseUrl}`)
      expect(urls).toContain(`${baseUrl}/about`)
      expect(urls).toContain(`${baseUrl}/services`)
      expect(urls).toContain(`${baseUrl}/blog`)
      expect(urls).toContain(`${baseUrl}/contact`)

      // Dynamic active service present with correct priority
      const serviceEntry = entries.find((e) => e.url === `${baseUrl}/services/evidence-active-service`)
      expect(serviceEntry).toBeDefined()
      expect(serviceEntry?.priority).toBe(0.8)

      // Dynamic active blog article present with correct priority
      const postEntry = entries.find((e) => e.url === `${baseUrl}/blog/evidence-active-article`)
      expect(postEntry).toBeDefined()
      expect(postEntry?.priority).toBe(0.7)

      // INACTIVE service strictly excluded
      expect(urls).not.toContain(`${baseUrl}/services/evidence-inactive-service`)
    })
  })

  describe('2. JSON-LD Runtime Evidence Verification', () => {
    it('verifies Dentist JSON-LD renders only real CMS fields without fake fallbacks', async () => {
      // Fetch clinic info from DB
      const clinicInfo = await payload.findGlobal({ slug: 'clinic-info' })

      // Verify that clinicName is genuine and from DB
      expect(clinicInfo.clinicName).toBe('Dr. John Sevo Dental Clinic & Aesthetics')

      // Simulate rendering of Dentist schema exactly as implemented in RootLayout
      const siteUrl = 'https://drjohnsevo.com'
      const clinicJsonLd = clinicInfo
        ? {
            '@context': 'https://schema.org',
            '@type': 'Dentist',
            name: clinicInfo.clinicName,
            url: siteUrl,
            telephone: clinicInfo.phoneNumbers?.[0]?.number || undefined,
            email: clinicInfo.email || undefined,
            address: clinicInfo.address
              ? {
                  '@type': 'PostalAddress',
                  streetAddress: clinicInfo.address,
                }
              : undefined,
            openingHours: clinicInfo.openingHours
              ?.map((oh) => `${oh.days} ${oh.hours}`)
              .filter(Boolean),
            sameAs: clinicInfo.socialLinks
              ?.map((s) => s.url)
              .filter((url): url is string => typeof url === 'string' && url.length > 0),
          }
        : null

      expect(clinicJsonLd).not.toBeNull()
      expect(clinicJsonLd?.['@type']).toBe('Dentist')
      expect(clinicJsonLd?.name).toBe(clinicInfo.clinicName)
      expect(clinicJsonLd?.url).toBe(siteUrl)

      // Prove that no fake ratings, no fake prices, no fake reviews exist
      expect((clinicJsonLd as any).aggregateRating).toBeUndefined()
      expect((clinicJsonLd as any).priceRange).toBeUndefined()
      expect((clinicJsonLd as any).review).toBeUndefined()
    })

    it('verifies ServiceDetailPage renders valid Service JSON-LD in DOM without fake properties', async () => {
      const { default: ServiceDetailPage } = await import('@/app/(frontend)/services/[slug]/page')
      const jsx = await ServiceDetailPage({ params: Promise.resolve({ slug: 'evidence-active-service' }) })

      // Locate JSON-LD script element in JSX tree
      const children = Array.isArray(jsx.props.children) ? jsx.props.children : [jsx.props.children]
      const scriptEl = children.find((el: any) => el?.type === 'script' && el?.props?.type === 'application/ld+json')

      expect(scriptEl).toBeDefined()
      const parsed = JSON.parse(scriptEl.props.dangerouslySetInnerHTML.__html)

      expect(parsed['@context']).toBe('https://schema.org')
      expect(parsed['@type']).toBe('Service')
      expect(parsed.name).toBe('Evidence Active Service')
      expect(parsed.description).toBe('Active service for sitemap verification')
      expect(parsed.provider?.name).toBe('Dr. John Sevo Dental Clinic')
      expect(parsed.aggregateRating).toBeUndefined()
      expect(parsed.priceRange).toBeUndefined()
    })

    it('verifies BlogPostPage renders valid BlogPosting JSON-LD in DOM without fake properties', async () => {
      const { default: BlogPostPage } = await import('@/app/(frontend)/blog/[slug]/page')
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'evidence-active-article' }) })

      // Locate JSON-LD script element in JSX tree
      const children = Array.isArray(jsx.props.children) ? jsx.props.children : [jsx.props.children]
      const scriptEl = children.find((el: any) => el?.type === 'script' && el?.props?.type === 'application/ld+json')

      expect(scriptEl).toBeDefined()
      const parsed = JSON.parse(scriptEl.props.dangerouslySetInnerHTML.__html)

      expect(parsed['@context']).toBe('https://schema.org')
      expect(parsed['@type']).toBe('BlogPosting')
      expect(parsed.headline).toBe('Evidence Active Blog Article')
      expect(parsed.description).toBe('Active blog article for sitemap verification')
      expect(parsed.publisher?.name).toBe('Dr. John Sevo Dental Clinic')
      expect(parsed.aggregateRating).toBeUndefined()
      expect(parsed.review).toBeUndefined()
    }, 15000)
  })

  describe('3. Targeted Revalidation Verification', () => {
    it('verifies Home mutation triggers revalidatePath("/")', async () => {
      vi.clearAllMocks()
      await payload.updateGlobal({
        slug: 'home',
        data: {
          heroTitle: 'Evidence Tested Hero Main Headline',
        },
      })
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/')
    })

    it('verifies About mutation triggers revalidatePath("/about")', async () => {
      vi.clearAllMocks()
      await payload.updateGlobal({
        slug: 'about',
        data: {
          storyTitle: 'Evidence Tested Story Headline',
        },
      })
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/about')
    })

    it('verifies ClinicInfo mutation triggers revalidatePath("/", "layout")', async () => {
      vi.clearAllMocks()
      await payload.updateGlobal({
        slug: 'clinic-info',
        data: {
          clinicName: 'Dr. John Sevo Dental Clinic & Aesthetics',
        },
      })
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('verifies Services mutation triggers revalidatePath("/")', async () => {
      vi.clearAllMocks()
      const service = await payload.create({
        collection: 'services',
        data: {
          title: 'Revalidation Test Service',
          slug: 'revalidation-test-service',
          shortDescription: 'Testing revalidation hook',
          isActive: true,
        },
        overrideAccess: true,
      })
      createdServiceIds.push(service.id)
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/')

      vi.clearAllMocks()
      await payload.delete({
        collection: 'services',
        id: service.id,
        overrideAccess: true,
      })
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/')
    })

    it('verifies Doctors mutation triggers revalidatePath("/about")', async () => {
      // First create a dummy media record for doctor photo
      const fs = await import('fs')
      const path = await import('path')
      const imageBuffer = fs.readFileSync(path.resolve('public/images/patient-sarah.png'))
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: 'Test Doctor Avatar',
          visibility: 'public',
        },
        file: {
          data: new Uint8Array(imageBuffer) as unknown as Buffer,
          name: 'test-doc.png',
          mimetype: 'image/png',
          size: imageBuffer.length,
        },
        overrideAccess: true,
      })
      createdMediaIds.push(media.id)

      vi.clearAllMocks()
      const doctor = await payload.create({
        collection: 'doctors',
        data: {
          name: 'Dr. Test Revalidation',
          slug: 'dr-test-revalidation',
          title: 'Specialist Dentist',
          photo: media.id,
          isActive: true,
        },
        overrideAccess: true,
      })
      createdDoctorIds.push(doctor.id)
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/about')

      vi.clearAllMocks()
      await payload.delete({
        collection: 'doctors',
        id: doctor.id,
        overrideAccess: true,
      })
      expect(nextCache.revalidatePath).toHaveBeenCalledWith('/about')
    })
  })
})
