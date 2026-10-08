import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Smile,
  HeartHandshake,
  Zap,
  Eye,
  Check,
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  getServiceBySlug,
  getRelatedServices,
  getMedicalTeam,
  getClinicInfo,
} from '@/repositories/clinic'
import { RichText } from '@/components/richText/RichText'
import type { Media, Doctor, Service } from '@/payload-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>
}

function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
      return media.url
    }
    if (media.url.startsWith('/api/media/file/')) {
      return null
    }
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

export async function generateMetadata(props: ServiceDetailPageProps): Promise<Metadata> {
  const params = await props.params
  const service = await getServiceBySlug(params.slug)
  if (!service) {
    return { title: 'Service Not Found' }
  }
  const imageUrl =
    getMediaUrl(service.featuredImage) || `/images/services/${service.slug}.jpg`
  return {
    title: `${service.title} | Specialized Dental Care | Dr. John Sevo Clinics`,
    description: service.shortDescription,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | Dr. John Sevo Clinics`,
      description: service.shortDescription,
      url: `/services/${service.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: service.title }] : undefined,
    },
  }
}

export default async function ServiceDetailPage(props: ServiceDetailPageProps) {
  const params = await props.params
  const [service, clinicInfo, medicalTeam, relatedServices] = await Promise.all([
    getServiceBySlug(params.slug),
    getClinicInfo(),
    getMedicalTeam({ limit: 4 }),
    getRelatedServices({ currentSlug: params.slug, limit: 3 }),
  ])

  if (!service) {
    notFound()
  }

  const imageUrl =
    getMediaUrl(service.featuredImage) || `/images/services/${service.slug}.jpg`

  const doctors: Doctor[] = medicalTeam.docs

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription,
    url: `${siteUrl}/services/${service.slug}`,
    image: imageUrl || undefined,
    provider: clinicInfo?.clinicName
      ? {
          '@type': 'Dentist',
          name: clinicInfo.clinicName,
          url: siteUrl,
        }
      : undefined,
  }

  return (
    <div className="bg-[#fbf8f4] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* =========================================================================
          CINEMATIC EDITORIAL HERO (Official Deep Brand Surface)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[#241e1d] text-white pt-12 pb-16 lg:pb-24 border-b border-[#e1c38c]/20">
        {/* Ambient atmospheric layers */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <Image
            src="/images/primary-brown-abstract-background.png"
            alt=""
            fill
            priority={false}
            className="object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1817] via-transparent to-[#1c1817] opacity-80" />
          <div className="absolute -left-32 top-1/4 w-[450px] h-[450px] rounded-full bg-[#e1c38c]/10 blur-3xl" />
          <div className="absolute -right-32 bottom-1/4 w-[450px] h-[450px] rounded-full bg-[#b1957b]/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#e1c38c] hover:text-white uppercase tracking-wider mb-8 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-castelar">All Clinical Services</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#e1c38c]/30 text-xs font-castelar tracking-wider uppercase text-[#e1c38c] font-semibold">
                {getServiceIcon(service.slug)}
                <span>Specialized Clinical Treatment</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-americana font-bold text-white leading-tight tracking-tight">
                {service.title}
              </h1>

              {/* Mobile image preview right below title */}
              <div className="block lg:hidden my-4">
                <div className="p-2 rounded-2xl bg-white/[0.03] border border-[#e1c38c]/25 shadow-xl relative">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/40">
                    <Image
                      src={imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-castelar tracking-wider uppercase text-white/90">
                      <ShieldCheck className="w-3 h-3 text-[#e1c38c]" />
                      <span>Certified Clinical Protocol</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-dinar text-[#dcd6d1] text-lg sm:text-xl leading-relaxed">
                {service.shortDescription}
              </p>

              {/* Patient Benefit Highlight Badge */}
              {service.patientBenefit ? (
                <div className="p-5 rounded-2xl bg-black/30 border border-[#e1c38c]/30 text-white relative overflow-hidden shadow-lg">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e1c38c] to-[#b58a48]" />
                  <div className="flex items-start gap-3 pl-1">
                    <Sparkles className="w-5 h-5 text-[#e1c38c] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-castelar tracking-widest uppercase font-bold text-[#e1c38c] block mb-1">
                        Patient Clinical Benefit
                      </span>
                      <p className="text-sm sm:text-base font-dinar font-medium text-[#f5f5f5] leading-snug">
                        {service.patientBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}



              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/contact?service=${service.slug}#booking`}
                  className="btn rounded-xl bg-[#8e6e4f] hover:bg-[#a27e5b] text-white py-4 px-8 text-sm font-semibold shadow-xl transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request This Treatment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#procedure-overview"
                  className="btn rounded-xl bg-transparent border border-white/20 hover:border-[#e1c38c] text-white hover:text-[#e1c38c] py-4 px-7 text-sm font-semibold transition-all"
                >
                  <span>Procedure Overview</span>
                </a>
              </div>
            </div>

            {/* Desktop Hero Image Frame */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-[#e1c38c]/25 shadow-2xl relative">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
                  <Image
                    src={imageUrl}
                    alt={`${service.title} - Dr. John Sevo Clinics`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-castelar tracking-wider uppercase text-white/90">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#e1c38c]" />
                      <span>Certified Clinical Protocol</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN CLINICAL CONTENT & METHODOLOGY (Serene Reading Surface)
          ========================================================================= */}
      <section id="procedure-overview" className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                <span className="font-castelar text-xs tracking-[0.2em] text-[#b58a48] uppercase block font-semibold">
                  Clinical Method & Standards
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-americana font-bold text-[#36302f] tracking-tight">
                  Procedure Overview & Clinical Method
                </h2>

                {service.description ? (
                  <div className="font-dinar text-[#4a4340] text-lg sm:text-xl leading-relaxed space-y-4">
                    <RichText data={service.description} />
                  </div>
                ) : (
                  <div className="text-[#5a5350] font-dinar text-base sm:text-lg leading-relaxed">
                    <p>{service.shortDescription}</p>
                  </div>
                )}
              </div>

              {/* Three Clinical Pillars of this Procedure */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[rgba(54,48,47,0.08)]">
                <div className="p-5 rounded-2xl bg-white border border-[rgba(54,48,47,0.08)] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48] mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-americana font-bold text-sm text-[#36302f] mb-1">
                    Certified Precision
                  </h4>
                  <p className="text-xs font-dinar text-[#706865] leading-relaxed">
                    Guided by modern digital diagnostics and standardized clinical protocols.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[rgba(54,48,47,0.08)] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48] mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-americana font-bold text-sm text-[#36302f] mb-1">
                    Biocompatible Materials
                  </h4>
                  <p className="text-xs font-dinar text-[#706865] leading-relaxed">
                    Premium dental ceramics, composites, and alloys meeting international medical
                    standards.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[rgba(54,48,47,0.08)] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48] mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-americana font-bold text-sm text-[#36302f] mb-1">
                    Patient Comfort Focus
                  </h4>
                  <p className="text-xs font-dinar text-[#706865] leading-relaxed">
                    Atraumatic techniques and gentle anesthesia protocols designed to eliminate
                    anxiety.
                  </p>
                </div>
              </div>

              {/* Specialists Section */}
              {doctors.length > 0 && (
                <div className="pt-8 border-t border-[rgba(54,48,47,0.08)] space-y-6">
                  <div>
                    <span className="font-castelar text-xs tracking-[0.2em] text-[#b58a48] uppercase block mb-1 font-semibold">
                      Expertise
                    </span>
                    <h3 className="text-2xl font-americana font-bold text-[#36302f] flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-[#8e6e4f]" />
                      <span>Specialists Performing this Procedure</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doctor) => {
                      const docPhoto = getMediaUrl(doctor.photo)
                      return (
                        <div
                          key={doctor.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[rgba(54,48,47,0.08)] shadow-sm"
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
                            <h4 className="font-americana font-bold text-base text-[#36302f]">
                              {doctor.name}
                            </h4>
                            <p className="text-xs font-dinar text-[#706865]">{doctor.title}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Sidebar (Deep Brand Surface Elegance) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#241e1d] text-white rounded-3xl p-8 border border-[#e1c38c]/30 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e1c38c]/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <span className="text-[11px] font-castelar tracking-widest text-[#e1c38c] uppercase block mb-1 font-semibold">
                    Direct Treatment Inquiry
                  </span>
                  <h3 className="font-americana font-bold text-xl text-white">
                    Schedule Your Consultation
                  </h3>
                </div>

                <div className="space-y-4 text-sm font-dinar">
                  <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-[#e1c38c] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Pre-Selected Treatment</span>
                      <span className="text-[#c8bfb9] text-xs">
                        {service.title} is automatically attached to your request
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                    <Clock className="w-5 h-5 text-[#e1c38c] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">
                        Prompt Reception Follow-Up
                      </span>
                      <span className="text-[#c8bfb9] text-xs">
                        Our coordination desk confirms your exact time slot
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/contact?service=${service.slug}#booking`}
                  className="w-full h-12 rounded-xl bg-[#8e6e4f] hover:bg-[#a27e5b] text-white text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request This Treatment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-center text-[#a59b95] font-dinar">
                  No payment required online. Appointments confirmed upon reception review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOUNDED RELATED SERVICES SECTION
          ========================================================================= */}
      {relatedServices.length > 0 ? (
        <section className="section py-16 bg-[#f7f2ec] border-t border-[rgba(54,48,47,0.08)]">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-castelar text-xs tracking-[0.2em] text-[#b58a48] uppercase block mb-1 font-semibold">
                  Complementary Care
                </span>
                <h3 className="text-2xl sm:text-3xl font-americana font-bold text-[#36302f] tracking-tight">
                  Related Clinical Treatments
                </h3>
              </div>

              <Link
                href="/services"
                className="text-xs font-semibold text-[#8e6e4f] hover:text-[#b58a48] flex items-center gap-1 transition-colors"
              >
                <span>View All 11 Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((relSvc: Service) => {
                const relImage =
                  getMediaUrl(relSvc.featuredImage) || `/images/services/${relSvc.slug}.jpg`

                return (
                  <Link
                    key={relSvc.id || relSvc.slug}
                    href={`/services/${relSvc.slug}`}
                    className="card bg-white rounded-2xl border border-[rgba(54,48,47,0.08)] hover:border-[#b58a48]/50 hover:shadow-lg transition-all p-5 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-neutral-100">
                        <Image
                          src={relImage}
                          alt={relSvc.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <span className="text-[10px] font-castelar tracking-wider uppercase text-[#8e6e4f] block mb-1">
                        Specialized Care
                      </span>
                      <h4 className="font-americana font-bold text-lg text-[#36302f] group-hover:text-[#b58a48] transition-colors mb-2">
                        {relSvc.title}
                      </h4>
                      <p className="text-xs font-dinar text-[#706865] line-clamp-2">
                        {relSvc.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[rgba(54,48,47,0.06)] flex items-center justify-between text-xs font-semibold text-[#8e6e4f] group-hover:text-[#b58a48]">
                      <span>Clinical Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
