import React from 'react'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { FounderCinematicSection } from '@/components/sections/FounderCinematicSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { TrustStatsSection } from '@/components/sections/TrustStatsSection'
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection'
import { BookingSection } from '@/components/sections/BookingSection'
import {
  getHomeContent,
  getAboutContent,
  getServices,
  getTransformations,
} from '@/repositories/clinic'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const [homeContent, aboutContent, servicesResult, transformationsResult] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
    getServices({ limit: 12 }),
    getTransformations({ limit: 6, page: 1, featuredOnly: true }),
  ])

  const aboutImageUrl =
    typeof aboutContent?.storyImage === 'object' && aboutContent?.storyImage?.url
      ? aboutContent.storyImage.url
      : undefined

  return (
    <>
      <HeroSection
        badge={homeContent?.heroBadge}
        title={homeContent?.heroTitle}
        subtitle={homeContent?.heroSubtitle}
      />
      <FounderCinematicSection
        title={aboutContent?.founderTitle}
        quote={aboutContent?.founderQuote}
        name={aboutContent?.founderName}
        role={aboutContent?.founderRole}
        imageUrl={aboutImageUrl || '/images/hero-doctor.webp'}
      />
      <ServicesSection services={servicesResult.docs} />
      <ExperienceSection
        whyChooseTitle={homeContent?.whyChooseTitle}
        pillars={homeContent?.whyChooseItems}
      />
      <TrustStatsSection stats={homeContent?.trustStats} />
      <BeforeAfterSection
        initialCases={transformationsResult.docs}
        initialPagination={{
          totalDocs: transformationsResult.totalDocs,
          totalPages: transformationsResult.totalPages,
          page: transformationsResult.page,
          hasNextPage: transformationsResult.hasNextPage,
          hasPrevPage: transformationsResult.hasPrevPage,
        }}
      />
      <BookingSection
        availableServices={servicesResult.docs}
        ctaHeadline={homeContent?.ctaHeadline}
        ctaSubtitle={homeContent?.ctaSubtitle}
      />
    </>
  )
}
