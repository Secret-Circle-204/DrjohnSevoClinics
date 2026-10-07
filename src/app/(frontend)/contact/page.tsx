import React from 'react'
import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import { getClinicInfo, getServices } from '@/repositories/clinic'
import { BookingSection } from '@/components/sections/BookingSection'

export const metadata: Metadata = {
  title: 'Contact & Location',
  description: 'Reach our clinic reception, find our clinic address, opening hours, and submit an appointment inquiry.',
  alternates: {
    canonical: '/contact',
  },
}

export default async function ContactPage() {
  const [clinicInfo, servicesResult] = await Promise.all([
    getClinicInfo(),
    getServices({ limit: 20 }),
  ])

  const clinicName = clinicInfo?.clinicName
  const phoneNumbers = clinicInfo?.phoneNumbers || []
  const email = clinicInfo?.email
  const address = clinicInfo?.address
  const openingHours = clinicInfo?.openingHours || []

  return (
    <div className="bg-[#fdfcf9] min-h-screen">
      {/* Page Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 border-b border-[rgba(54,48,47,0.08)]">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              Direct Contact & Reception
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-americana font-bold text-[#36302f] leading-tight tracking-tight">
              Contact & Reception
            </h1>
            <p className="font-dinar text-[#5a5350] text-lg sm:text-xl leading-relaxed">
              {clinicName
                ? `Connect with ${clinicName} for appointments, specialized inquiries, or directions to our practice.`
                : 'Connect with our team for appointments, specialized inquiries, or directions to our practice.'}
            </p>
          </div>
        </div>
      </section>

      {/* Clinic Details Info Cards */}
      {(phoneNumbers.length > 0 || email || address || openingHours.length > 0) && (
        <section className="section py-16">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phone */}
              {phoneNumbers.length > 0 && (
                <div className="card bg-white p-7 rounded-3xl border border-[rgba(54,48,47,0.08)] shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-americana font-bold text-lg text-[#36302f]">
                    Phone
                  </h3>
                  <div className="space-y-1">
                    {phoneNumbers.map((p, idx) => (
                      <div key={idx} className="text-xs font-dinar text-[#706865]">
                        <span className="font-semibold text-[#36302f] block">{p.number}</span>
                        {p.label && <span className="text-[11px] text-[#8e6e4f]">{p.label}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="card bg-white p-7 rounded-3xl border border-[rgba(54,48,47,0.08)] shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-americana font-bold text-lg text-[#36302f]">
                    Email Inquiries
                  </h3>
                  <p className="text-xs font-dinar text-[#706865] break-all">
                    {email}
                  </p>
                  <span className="text-[11px] text-[#8e6e4f] block">
                    General & Specialist Questions
                  </span>
                </div>
              )}

              {/* Address */}
              {address && (
                <div className="card bg-white p-7 rounded-3xl border border-[rgba(54,48,47,0.08)] shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-americana font-bold text-lg text-[#36302f]">
                    Clinic Location
                  </h3>
                  <p className="text-xs font-dinar text-[#706865] leading-relaxed">
                    {address}
                  </p>
                  {clinicInfo?.locationOnMap && (
                    <a
                      href={clinicInfo.locationOnMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e6e4f] hover:text-[#b58a48] transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Opening Hours */}
              {openingHours.length > 0 && (
                <div className="card bg-white p-7 rounded-3xl border border-[rgba(54,48,47,0.08)] shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-americana font-bold text-lg text-[#36302f]">
                    Working Hours
                  </h3>
                  <div className="space-y-1.5">
                    {openingHours.map((h, idx) => (
                      <div key={idx} className="text-xs font-dinar text-[#706865] flex justify-between">
                        <span className="font-medium text-[#36302f]">{h.days}:</span>
                        <span>{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Form Section using BookingSection component */}
      <section className="pb-16 lg:pb-24">
        <BookingSection availableServices={servicesResult.docs} />
      </section>
    </div>
  )
}
