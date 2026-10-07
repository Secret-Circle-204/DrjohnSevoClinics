import React from 'react'
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 lg:py-20">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6 reveal-fade">
          {badge && (
            <span className="font-castelar text-xs tracking-[0.25em] font-semibold uppercase text-[#b58a48] block">
              {badge}
            </span>
          )}

          {title && (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-americana font-bold text-[#36302f] leading-tight tracking-tight">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="font-dinar text-[#5a5350] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <a
              href="#booking"
              className="btn rounded-xl bg-[#8e6e4f] text-white hover:bg-[#a27e5b] py-3.5 px-8 text-sm font-semibold shadow-md transition-all flex items-center gap-2 group active:scale-95"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              className="btn rounded-xl bg-[#ede7de] text-[#36302f] hover:bg-[#e4dcce] border border-[#d8cec2] py-3.5 px-8 text-sm font-semibold transition-all"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
