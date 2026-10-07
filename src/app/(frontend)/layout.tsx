import React from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getClinicInfo } from '@/repositories/clinic'
import './styles.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'

export async function generateMetadata(): Promise<Metadata> {
  const clinicInfo = await getClinicInfo()
  const clinicName = clinicInfo?.clinicName

  if (!clinicName) {
    return {
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
    }
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: clinicName,
      template: `%s | ${clinicName}`,
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: clinicName,
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
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
        <Header clinicName={clinicInfo?.clinicName} />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <Footer clinicInfo={clinicInfo} />
      </body>
    </html>
  )
}
