import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, UserCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { getServiceBySlug, getMedicalTeam } from '@/repositories/clinic'
import type { Media, Doctor } from '@/payload-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drjohnsevo.com'

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>
}

function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

export async function generateMetadata(props: ServiceDetailPageProps): Promise<Metadata> {
  const params = await props.params
  const service = await getServiceBySlug(params.slug)
  if (!service) {
    return { title: 'Service Not Found' }
  }
  const imageUrl = getMediaUrl(service.featuredImage)
  return {
    title: service.title,
    description: service.shortDescription,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.shortDescription,
      url: `/services/${service.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: service.title }] : undefined,
    },
  }
}

export default async function ServiceDetailPage(props: ServiceDetailPageProps) {
  const params = await props.params
  const service = await getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  const imageUrl = getMediaUrl(service.featuredImage)
  const medicalTeam = await getMedicalTeam({ limit: 4 })
  const doctors: Doctor[] = medicalTeam.docs

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription,
    url: `${siteUrl}/services/${service.slug}`,
    image: imageUrl || undefined,
    provider: {
      '@type': 'Dentist',
      name: 'Dr. John Sevo Dental Clinic',
      url: siteUrl,
    },
  }

  return (
    <div className="bg-[#fdfcf9] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* Detail Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 border-b border-[rgba(54,48,47,0.08)]">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e6e4f] hover:text-[#b58a48] uppercase tracking-wider mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              Specialized Treatment
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-americana text-[#36302f] leading-[1.15] font-bold">
              {service.title}
            </h1>
            <p className="font-perpetua text-[#5a5350] text-lg sm:text-xl leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-10">
              {imageUrl && (
                <div className="rounded-3xl overflow-hidden border border-[rgba(54,48,47,0.08)] shadow-lg relative aspect-[16/9] bg-[#faf6f0]">
                  <Image
                    src={imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-perpetua font-bold text-[#36302f]">
                  Procedure Overview & Clinical Method
                </h2>
                <div className="text-[#5a5350] font-perpetua text-base sm:text-lg leading-relaxed space-y-4">
                  <p>
                    {service.shortDescription}
                  </p>
                  <p>
                    Our clinical specialists utilize high-magnification dental loupes, digital impression scanners, and bio-compatible materials to ensure long-lasting structural integrity and seamless aesthetics.
                  </p>
                </div>
              </div>

              {/* Specialists Performing this Treatment */}
              {doctors.length > 0 && (
                <div className="pt-8 border-t border-[rgba(54,48,47,0.08)] space-y-6">
                  <h3 className="text-xl font-perpetua font-bold text-[#36302f] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#8e6e4f]" />
                    <span>Specialists Performing this Procedure</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doctor) => {
                      const docPhoto = getMediaUrl(doctor.photo)
                      return (
                        <div
                          key={doctor.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-[#fcfbf9] border border-[rgba(54,48,47,0.08)] shadow-sm"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden relative bg-[#faf6f0] flex-shrink-0">
                            {docPhoto ? (
                              <Image
                                src={docPhoto}
                                alt={doctor.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : null}
                          </div>
                          <div>
                            <h4 className="font-americana font-bold text-base text-[#36302f]">{doctor.name}</h4>
                            <p className="text-xs text-[#706865]">{doctor.title}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-[rgba(54,48,47,0.08)] shadow-lg space-y-6">
                <h3 className="font-americana font-bold text-xl text-[#36302f]">
                  Treatment Details
                </h3>

                <div className="space-y-4 text-sm font-perpetua">
                  <div className="flex items-start gap-3 pb-3 border-b border-[rgba(54,48,47,0.06)]">
                    <CheckCircle2 className="w-5 h-5 text-[#8e6e4f] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#36302f] block">Personalized Care</span>
                      <span className="text-[#706865] text-xs">Custom tailored treatment plan</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-[rgba(54,48,47,0.06)]">
                    <Clock className="w-5 h-5 text-[#8e6e4f] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#36302f] block">Comfort & Gentle Care</span>
                      <span className="text-[#706865] text-xs">Stress-free clinical protocols</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="w-full h-12 rounded-xl bg-[#8e6e4f] text-white hover:bg-[#a27e5b] text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
