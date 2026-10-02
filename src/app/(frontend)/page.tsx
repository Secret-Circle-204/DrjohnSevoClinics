import React from 'react'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { TrustStatsSection } from '@/components/sections/TrustStatsSection'
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection'
import { BookingSection } from '@/components/sections/BookingSection'
import { getHomeContent, getServices } from '@/repositories/clinic'

export const metadata: Metadata = {
  title: 'Exclusive Dental Care & Aesthetics',
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const [homeContent, servicesResult] = await Promise.all([
    getHomeContent(),
    getServices({ limit: 6 }),
  ])

  const overviewImageUrl = typeof homeContent?.overviewImage === 'object' && homeContent?.overviewImage?.url
    ? homeContent.overviewImage.url
    : undefined

  return (
    <>
      <HeroSection
        badge={homeContent?.heroBadge}
        title={homeContent?.heroTitle}
        subtitle={homeContent?.heroSubtitle}
      />
      <ServicesSection services={servicesResult.docs} />
      <ExperienceSection
        overviewTitle={homeContent?.overviewTitle}
        overviewText={homeContent?.overviewText}
        overviewImageUrl={overviewImageUrl}
        whyChooseTitle={homeContent?.whyChooseTitle}
        whyChooseSubtitle={homeContent?.whyChooseSubtitle}
        pillars={homeContent?.whyChooseItems}
      />
      <TrustStatsSection stats={homeContent?.trustStats} />
      <BeforeAfterSection cases={homeContent?.beforeAfterCases} />
      <BookingSection
        availableServices={servicesResult.docs}
        ctaHeadline={homeContent?.ctaHeadline}
        ctaSubtitle={homeContent?.ctaSubtitle}
      />
    </>
  )
}

