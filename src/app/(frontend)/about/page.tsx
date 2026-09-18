import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Compass, Heart, ShieldCheck } from 'lucide-react'
import { getAboutContent, getMedicalTeam } from '@/repositories/clinic'
import type { Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our clinic heritage, mission, philosophy of care, and specialized medical team.',
  alternates: {
    canonical: '/about',
  },
}

function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

export default async function AboutPage() {
  const [aboutContent, doctorsResult] = await Promise.all([
    getAboutContent(),
    getMedicalTeam({ limit: 12 }),
  ])

  const storyImageUrl = getMediaUrl(aboutContent?.storyImage)
  const doctors = doctorsResult.docs

  return (
    <div className="bg-[#fdfcf9] min-h-screen">
      {/* Page Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 border-b border-[rgba(54,48,47,0.08)]">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              About Our Clinic
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-americana text-[#36302f] leading-[1.15] font-bold">
              {aboutContent?.storyTitle || 'Artistry & Excellence in Modern Dentistry'}
            </h1>
            <p className="font-perpetua text-[#5a5350] text-lg sm:text-xl leading-relaxed">
              Where world-class clinical precision meets an unwavering commitment to patient comfort and aesthetic perfection.
            </p>
          </div>
        </div>
      </section>

      {/* Clinic Story Section */}
      <section className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
                Our Heritage & Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f] leading-tight">
                Personalized Care Built on Decades of Trust
              </h2>
              <div className="text-[#5a5350] font-perpetua text-base sm:text-lg leading-relaxed space-y-4">
                <p>
                  At Dr. John Sevo Dental Clinic, our clinical ethos is anchored in delivering restorative and cosmetic dentistry of the highest standard. We believe every patient deserves compassionate, tailored treatment supported by modern digital diagnostic technologies.
                </p>
                <p>
                  From preventative dental health to full-mouth implant rehabilitation and aesthetic transformations, we combine gentle hands with advanced clinical methodologies.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="btn inline-flex items-center gap-2 rounded-xl bg-[#8e6e4f] text-white hover:bg-[#a27e5b] py-3.5 px-7 text-sm font-semibold transition-all shadow-sm"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-[rgba(54,48,47,0.08)] relative aspect-[4/3] bg-[#faf6f0]">
                {storyImageUrl ? (
                  <Image
                    src={storyImageUrl}
                    alt="Dr. John Sevo Dental Clinic Experience"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <Image
                    src="/images/clinic-reception.webp"
                    alt="Dr. John Sevo Dental Clinic Experience"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Pillars */}
      <section className="section bg-[#f4eee7] border-t border-b border-[rgba(54,48,47,0.08)] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-2">
              Our Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f]">
              {aboutContent?.valuesTitle || 'Mission, Vision & Principles'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card bg-white p-8 rounded-3xl border border-[rgba(54,48,47,0.08)] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-perpetua font-bold text-[#36302f]">
                Our Mission
              </h3>
              <p className="text-sm font-perpetua text-[#706865] leading-relaxed">
                {aboutContent?.mission || 'To provide comprehensive, state-of-the-art dental solutions with unparalleled gentleness, restoring confidence and long-term oral health for every patient.'}
              </p>
            </div>

            <div className="card bg-white p-8 rounded-3xl border border-[rgba(54,48,47,0.08)] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-perpetua font-bold text-[#36302f]">
                Our Vision
              </h3>
              <p className="text-sm font-perpetua text-[#706865] leading-relaxed">
                {aboutContent?.vision || 'To be the benchmark of aesthetic excellence and personalized dental care in the region, recognized for clinical integrity and exceptional patient comfort.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Team Section */}
      <section className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-2">
              Clinical Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f]">
              Our Specialized Medical Team
            </h2>
            <p className="text-sm sm:text-base text-[#706865] mt-2 font-perpetua">
              Distinguished doctors dedicated to clinical mastery and individualized patient care.
            </p>
          </div>

          {doctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
              <p className="font-perpetua text-[#706865] text-base leading-relaxed">
                Medical team credentials and specialist profiles are currently being updated in our clinical directory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => {
                const photoUrl = getMediaUrl(doctor.photo)
                return (
                  <div
                    key={doctor.id}
                    className="card bg-white rounded-3xl overflow-hidden border border-[rgba(54,48,47,0.08)] shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="relative aspect-[4/5] bg-[#faf6f0] overflow-hidden">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={doctor.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#b58a48]">
                          <Award className="w-16 h-16 opacity-30" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-castelar text-[10px] tracking-wider text-[#b58a48] uppercase block mb-1">
                          {doctor.title}
                        </span>
                        <h3 className="font-americana font-bold text-xl text-[#36302f]">
                          {doctor.name}
                        </h3>
                      </div>

                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div className="pt-3 border-t border-[rgba(54,48,47,0.06)] space-y-1">
                          {doctor.qualifications.map((q, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#706865]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#8e6e4f] flex-shrink-0" />
                              <span>{q.degree}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
