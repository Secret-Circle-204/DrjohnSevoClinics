import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Smile,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  Layers,
  ChevronRight,
  Clock,
  HeartHandshake,
  Zap,
  Eye,
  Check,
} from 'lucide-react'
import { getServices } from '@/repositories/clinic'
import type { Service, Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Specialized Clinical Services | Dr. John Sevo Clinics',
  description:
    'Explore our 11 comprehensive dental treatments engineered to protect, restore, and enhance your smile through modern clinical dentistry.',
  alternates: {
    canonical: '/services',
  },
}


function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

function getServiceIcon(slug: string): React.ReactNode {
  switch (slug) {
    case 'scaling-and-polishing':
      return <Sparkles className="w-4 h-4 text-[#e1c38c]" />
    case 'teeth-whitening':
      return <Smile className="w-4 h-4 text-[#e1c38c]" />
    case 'implants':
      return <Award className="w-4 h-4 text-[#e1c38c]" />
    case 'restorative-treatment':
      return <ShieldCheck className="w-4 h-4 text-[#e1c38c]" />
    case 'crowns-and-bridges':
      return <Layers className="w-4 h-4 text-[#e1c38c]" />
    case 'root-canal-treatment':
      return <ShieldCheck className="w-4 h-4 text-[#e1c38c]" />
    case 'extractions':
      return <Clock className="w-4 h-4 text-[#e1c38c]" />
    case 'removable-dentures':
      return <Smile className="w-4 h-4 text-[#e1c38c]" />
    case 'pediatric-dentistry':
      return <HeartHandshake className="w-4 h-4 text-[#e1c38c]" />
    case 'braces':
      return <Zap className="w-4 h-4 text-[#e1c38c]" />
    case 'invisalign':
      return <Eye className="w-4 h-4 text-[#e1c38c]" />
    default:
      return <Sparkles className="w-4 h-4 text-[#e1c38c]" />
  }
}

interface ServicesPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ServicesPage(props: ServicesPageProps) {
  const searchParams = await props.searchParams
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage

  const servicesResult = await getServices({
    page: validPage,
    limit: 12,
  })

  const services = servicesResult.docs
  const featuredService = services[0]
  const remainingServices = services.slice(1)

  return (
    <div className="bg-[#fbf8f4] min-h-screen">
      {/* =========================================================================
          HERO SECTION (Official Deep Brand Surface)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[#241e1d] text-white pt-14 pb-20 sm:pb-24 border-b border-[#e1c38c]/20">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <Image
            src="/images/primary-brown-abstract-background.png"
            alt=""
            fill
            priority={false}
            className="object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1817] via-transparent to-[#1c1817] opacity-80" />
          <div className="absolute -left-36 top-1/4 w-[500px] h-[500px] rounded-full bg-[#e1c38c]/10 blur-3xl" />
          <div className="absolute -right-36 bottom-1/4 w-[500px] h-[500px] rounded-full bg-[#b1957b]/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#e1c38c]/30 text-xs font-castelar tracking-[0.24em] text-[#e1c38c] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#e1c38c]" />
              <span>Comprehensive Dental Disciplines • 11 Specialized Treatments</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-americana font-bold text-white leading-tight tracking-tight">
              Clinical Specializations
            </h1>
            <p className="font-dinar text-[#dcd6d1] text-lg sm:text-xl leading-relaxed pt-1">
              Explore our wide range of specialized treatments designed to protect, restore, and
              enhance your smile.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED ASYMMETRICAL LEAD SERVICE (Page 1 Lead Treatment)
          ========================================================================= */}
      {featuredService && validPage === 1 ? (
        <section className="py-14 sm:py-16 border-b border-[rgba(54,48,47,0.08)] bg-white">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="rounded-3xl border border-[#e1c38c]/30 bg-[#faf6f0] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-2 right-6 font-americana text-[8rem] font-bold text-[rgba(54,48,47,0.03)] pointer-events-none select-none leading-none">
                01
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#b58a48]/30 text-xs font-castelar tracking-wider uppercase text-[#8e6e4f] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#b58a48]" />
                    <span>Featured Clinical Procedure • 01</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-americana font-bold text-[#36302f] tracking-tight">
                    {featuredService.title}
                  </h2>

                  <p className="font-dinar text-base sm:text-lg text-[#5a5350] leading-relaxed">
                    {featuredService.shortDescription}
                  </p>

                  {featuredService.patientBenefit ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e1c38c]/40 text-[#4a413d] flex items-start gap-3.5 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#b58a48] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-castelar tracking-widest uppercase font-bold text-[#8e6e4f] block mb-0.5">
                          Patient Clinical Benefit
                        </span>
                        <p className="text-sm sm:text-base font-dinar font-medium text-[#36302f]">
                          {featuredService.patientBenefit}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/contact?service=${featuredService.slug}#booking`}
                      className="btn rounded-xl bg-[#8e6e4f] hover:bg-[#a27e5b] text-white py-3.5 px-7 text-sm font-semibold shadow-md transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Request an Appointment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/services/${featuredService.slug}`}
                      className="btn rounded-xl bg-white border border-[rgba(54,48,47,0.15)] hover:border-[#b58a48] text-[#36302f] hover:text-[#b58a48] py-3.5 px-6 text-sm font-semibold transition-all flex items-center gap-2"
                    >
                      <span>Read Clinical Procedure</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Image */}
                <div className="lg:col-span-5">
                  <div className="p-2 sm:p-2.5 rounded-3xl bg-white border border-[#e1c38c]/30 shadow-md">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] relative bg-neutral-200">
                      <Image
                        src={
                          getMediaUrl(featuredService.featuredImage) ||
                          `/images/services/${featuredService.slug}.jpg`
                        }
                        alt={`${featuredService.title} - Dr. John Sevo Dental Clinic`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority
                      />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-castelar tracking-wider uppercase text-white/90">
                        <ShieldCheck className="w-3 h-3 text-[#e1c38c]" />
                        <span>Certified Clinical Protocol</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* =========================================================================
          FULL SERVICES COLLECTION GRID
          ========================================================================= */}
      <section className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-[rgba(54,48,47,0.08)] pb-6">
            <div>
              <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-1 font-semibold">
                Clinical Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-americana font-bold text-[#36302f] tracking-tight">
                All Specialized Procedures
              </h2>
            </div>
            <span className="text-xs font-dinar text-[#706865]">
              Showing {services.length} of {servicesResult.totalDocs} clinical disciplines
            </span>
          </div>

          {services.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
              <p className="font-dinar text-[#706865] text-base leading-relaxed">
                Our clinical service catalog is currently being updated. Please contact our clinic
                reception for specialized treatment consultations.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {(validPage === 1 ? remainingServices : services).map(
                  (service: Service, idx: number) => {
                    const imageUrl =
                      getMediaUrl(service.featuredImage) ||
                      `/images/services/${service.slug}.jpg`
                    const displayIndex = validPage === 1 ? idx + 2 : idx + 1

                    return (
                      <div
                        key={service.id || service.slug}
                        className="bg-white rounded-3xl border border-[rgba(54,48,47,0.12)] hover:border-[#b58a48]/60 hover:shadow-2xl transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between group"
                      >
                        {/* Service Visual Card Header */}
                        <div>
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm border border-[#e1c38c]/20">
                            <Image
                              src={imageUrl}
                              alt={`${service.title} - Dr. John Sevo Clinics`}
                              fill
                              className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-2xl" />

                            {/* Index badge */}
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-castelar tracking-wider uppercase border border-white/10">
                              {String(displayIndex).padStart(2, '0')}
                            </div>

                            <div className="absolute bottom-2.5 left-3 text-[10px] font-castelar tracking-widest uppercase text-[#e1c38c]">
                              Specialized Care
                            </div>
                          </div>

                          <div className="pt-4 pb-2 space-y-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#faf6f0] border border-[#e1c38c]/40 flex items-center justify-center text-[#b58a48] flex-shrink-0 shadow-xs">
                                {getServiceIcon(service.slug)}
                              </div>
                              <h3 className="font-americana font-bold text-xl sm:text-[22px] text-[#36302f] group-hover:text-[#b58a48] transition-colors leading-snug">
                                {service.title}
                              </h3>
                            </div>

                            <p className="text-[15px] sm:text-base font-dinar text-[#5a5350] leading-relaxed line-clamp-3">
                              {service.shortDescription}
                            </p>

                            {service.patientBenefit ? (
                              <div className="p-3.5 rounded-xl bg-[#faf6f0]/90 border border-[#e1c38c]/40 text-sm font-dinar text-[#36302f]">
                                <span className="text-[11px] font-castelar tracking-wider uppercase font-bold text-[#8e6e4f] block mb-1">
                                  Patient Clinical Benefit:
                                </span>
                                <span className="leading-relaxed">{service.patientBenefit}</span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-4 pb-1 border-t border-[rgba(54,48,47,0.08)] flex items-center justify-between gap-3">
                          <Link
                            href={`/services/${service.slug}`}
                            className="text-sm font-semibold text-[#8e6e4f] hover:text-[#b58a48] transition-colors flex items-center gap-1.5 group/link"
                          >
                            <span>Explore Details</span>
                            <ChevronRight className="w-4 h-4 group-link-hover:translate-x-0.5 transition-transform" />
                          </Link>

                          <Link
                            href={`/contact?service=${service.slug}#booking`}
                            className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#36302f] hover:bg-[#8e6e4f] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm active:scale-95"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Request</span>
                          </Link>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>

              {/* Bounded Pagination Controls */}
              {servicesResult.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-[rgba(54,48,47,0.08)]">
                  {servicesResult.hasPrevPage && (
                    <Link
                      href={`/services?page=${validPage - 1}`}
                      className="px-5 py-2.5 rounded-xl border border-[rgba(54,48,47,0.15)] text-xs font-semibold text-[#5a5350] hover:text-[#36302f] hover:bg-[#faf6f0] transition-colors"
                    >
                      Previous Page
                    </Link>
                  )}
                  <span className="text-xs font-dinar text-[#706865]">
                    Page {servicesResult.page} of {servicesResult.totalPages}
                  </span>
                  {servicesResult.hasNextPage && (
                    <Link
                      href={`/services?page=${validPage + 1}`}
                      className="px-5 py-2.5 rounded-xl border border-[rgba(54,48,47,0.15)] text-xs font-semibold text-[#5a5350] hover:text-[#36302f] hover:bg-[#faf6f0] transition-colors"
                    >
                      Next Page
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          CALLOUT: PERSONALIZED CLINICAL CONSULTATION
          ========================================================================= */}
      <section className="section bg-[#241e1d] text-white py-16 lg:py-20 border-t border-[#e1c38c]/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <Image
            src="/images/primary-brown-abstract-background.png"
            alt=""
            fill
            priority={false}
            className="object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#181413]/90" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="font-castelar text-xs tracking-[0.25em] text-[#e1c38c] uppercase block font-semibold">
            Unsure Which Treatment You Need?
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-americana font-bold text-white tracking-tight">
            Schedule a Comprehensive Clinical Consultation
          </h2>
          <p className="font-dinar text-base sm:text-lg text-[#dcd6d1] max-w-2xl mx-auto leading-relaxed">
            Our medical director and specialist team will conduct a thorough diagnostic examination
            with digital radiography to develop your personalized biological treatment plan.
          </p>
          <div className="pt-2">
            <Link
              href="/contact#booking"
              className="btn inline-flex items-center gap-2 rounded-xl bg-[#8e6e4f] hover:bg-[#a27e5b] text-white py-4 px-8 text-sm font-semibold tracking-wider transition-all shadow-xl active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
