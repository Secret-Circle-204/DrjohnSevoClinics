import React from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getClinicInfo } from '@/repositories/clinic'
import './styles.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dr. John Sevo Dental Clinic — Advanced Dental Care & Aesthetics',
    template: '%s | Dr. John Sevo Dental Clinic',
  },
  description: 'Advanced dental care, implants, and cosmetic dentistry with refined luxury and clinical excellence.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dr. John Sevo Dental Clinic',
    url: siteUrl,
    images: [
      {
        url: '/images/clinic-reception.webp',
        width: 1200,
        height: 630,
        alt: 'Dr. John Sevo Dental Clinic',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/clinic-reception.webp'],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const clinicInfo = await getClinicInfo()

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

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {clinicJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col surface-light-neutral text-deep-brown selection:bg-[var(--color-primary-gold)] selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer clinicInfo={clinicInfo} />
      </body>
    </html>
  )
}
