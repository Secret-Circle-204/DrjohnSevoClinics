import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Smile, ShieldCheck, Clock } from 'lucide-react'
import { getServices } from '@/repositories/clinic'
import type { Service } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Specialized Dental Services',
  description: 'Explore our complete range of specialized dental treatments, from preventative care to cosmetic dentistry and implants.',
  alternates: {
    canonical: '/services',
  },
}

function getServiceIcon(iconName?: string | null, title?: string): React.ReactNode {
  const key = `${iconName || ''} ${title || ''}`.toLowerCase()
  if (key.includes('implant')) {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v6m-4-3h8m-6 3h4m-5 4h6m-4 4h2m-1 0v5" />
      </svg>
    )
  }
  if (key.includes('cosmetic') || key.includes('smile') || key.includes('whitening')) {
    return <Smile className="w-6 h-6" />
  }
  if (key.includes('ortho') || key.includes('brace')) {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="9" width="16" height="6" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="9" x2="8" y2="15" strokeLinecap="round" />
        <line x1="12" y1="9" x2="12" y2="15" strokeLinecap="round" />
        <line x1="16" y1="9" x2="16" y2="15" strokeLinecap="round" />
      </svg>
    )
  }
  if (key.includes('restor') || key.includes('shield')) {
    return <ShieldCheck className="w-6 h-6" />
  }
  if (key.includes('emerg') || key.includes('clock')) {
    return <Clock className="w-6 h-6" />
  }
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C8 3 5 6 5 10c0 4 2 8 3 10 1 2 2 1 4 0 2 1 3 2 4 0 1-2 3-6 3-10 0-4-3-7-7-7z" />
    </svg>
  )
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

  return (
    <div className="bg-[#fdfcf9] min-h-screen">
      {/* Services Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 border-b border-[rgba(54,48,47,0.08)]">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              Clinical Specializations
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-americana text-[#36302f] leading-[1.15] font-bold">
              Complete Dental Care for Every Smile
            </h1>
            <p className="font-perpetua text-[#5a5350] text-lg sm:text-xl leading-relaxed">
              Tailored treatments engineered for long-term oral health, restorative strength, and radiant facial harmony.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
              <p className="font-perpetua text-[#706865] text-base leading-relaxed">
                Our clinical service catalog is currently being updated. Please contact our clinic reception for specialized treatment consultations.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service: Service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="card bg-white p-7 rounded-3xl border border-[rgba(54,48,47,0.08)] hover:border-[#b58a48]/50 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center mb-6 text-[#b58a48] group-hover:scale-105 transition-transform">
                        {getServiceIcon(service.iconName, service.title)}
                      </div>
                      <h2 className="font-americana font-bold text-2xl text-[#36302f] mb-3 group-hover:text-[#b58a48] transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-sm font-perpetua text-[#706865] leading-relaxed line-clamp-3">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[rgba(54,48,47,0.06)] flex items-center justify-between text-sm font-semibold text-[#8e6e4f]">
                      <span>View Treatment Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bounded Pagination Controls */}
              {servicesResult.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-14 pt-8 border-t border-[rgba(54,48,47,0.08)]">
                  {servicesResult.hasPrevPage && (
                    <Link
                      href={`/services?page=${validPage - 1}`}
                      className="px-5 py-2.5 rounded-xl border border-[rgba(54,48,47,0.15)] text-xs font-semibold text-[#5a5350] hover:text-[#36302f] hover:bg-[#faf6f0] transition-colors"
                    >
                      Previous Page
                    </Link>
                  )}
                  <span className="text-xs font-perpetua text-[#706865]">
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
    </div>
  )
}
