import React from 'react'
import { ArrowRight, Smile, ShieldCheck, Clock } from 'lucide-react'
import type { Service } from '@/payload-types'

interface ServicesSectionProps {
  services?: Service[]
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

export function ServicesSection({ services = [] }: ServicesSectionProps) {
  return (
    <section id="services" className="section bg-[#fdfcf9] border-t border-b border-[rgba(54,48,47,0.08)]">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-2">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f]">
              Complete Care for Every Smile
            </h2>
          </div>
          <a
            href="#services"
            className="text-sm font-semibold text-[#8e6e4f] hover:text-[#b58a48] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
            <p className="font-perpetua text-[#706865] text-base leading-relaxed">
              Our clinical service catalog is currently being updated. Please contact our clinic reception for specialized treatment consultations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {services.map((service) => (
              <div
                key={service.id || service.slug}
                className="card bg-white p-5 rounded-2xl border border-[rgba(54,48,47,0.08)] hover:border-[#b58a48]/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center mb-4 text-[#b58a48] group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.iconName, service.title)}
                  </div>
                  <h3 className="font-bold text-[#36302f] text-base mb-2 font-perpetua">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#706865] leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[rgba(54,48,47,0.06)] text-right">
                  <ArrowRight className="w-4 h-4 text-[#8e6e4f] inline-block group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
