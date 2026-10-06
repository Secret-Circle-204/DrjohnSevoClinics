import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  badge?: string | null
  title?: string | null
  subtitle?: string | null
}

export function HeroSection({
  badge,
  title,
  subtitle,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-8 pb-16 lg:py-16">
      {/* Subtle Official Watermark Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-15 lg:opacity-20 select-none z-0">
        <Image
          src="/logos/logo-watermark-opacity-39.svg"
          alt=""
          width={500}
          height={550}
          className="w-[360px] lg:w-[480px] h-auto object-contain"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6 reveal-fade">
            {badge && (
              <span className="font-castelar text-xs tracking-[0.22em] font-normal uppercase text-[#b58a48] block">
                {badge}
              </span>
            )}

            {title && (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-americana text-[#36302f] leading-[1.15] font-bold">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="font-perpetua text-[#5a5350] text-lg sm:text-xl max-w-lg leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#booking"
                className="btn rounded-xl bg-[#8e6e4f] text-white hover:bg-[#a27e5b] py-3.5 px-7 text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="btn rounded-xl bg-[#ede7de] text-[#36302f] hover:bg-[#e4dcce] border border-[#d8cec2] py-3.5 px-7 text-sm font-semibold transition-all"
              >
                Our Services
              </a>
            </div>
          </div>

          {/* Right Doctor Presentation */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.8)]">
              <Image
                src="/images/hero-doctor.webp"
                alt={title || ''}
                width={554}
                height={345}
                priority
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
