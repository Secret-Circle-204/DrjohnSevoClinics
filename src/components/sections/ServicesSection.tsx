'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
  Smile,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  HeartHandshake,
  Zap,
  Eye,
  Check,
} from 'lucide-react'
import type { Service, Media } from '@/payload-types'

interface ServicesSectionProps {
  services?: Service[]
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

export function ServicesSection({ services = [] }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  const activeService = services[activeIndex] || services[0]

  const handleRailScroll = useCallback(() => {
    if (!railRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current
    const maxScroll = scrollWidth - clientWidth
    if (maxScroll > 0) {
      setScrollProgress(Math.max(0, Math.min(1, scrollLeft / maxScroll)))
    }
    setIsInteracting(true)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 1500)
  }, [])

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, clickX / rect.width))
    const { scrollWidth, clientWidth } = railRef.current
    railRef.current.scrollTo({
      left: ratio * (scrollWidth - clientWidth),
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  const handleSelectService = useCallback(
    (index: number) => {
      if (index >= 0 && index < services.length) {
        setSlideDirection(index > activeIndex ? 'left' : 'right')
        setActiveIndex(index)
      }
    },
    [activeIndex, services.length]
  )

  const handleNext = useCallback(() => {
    setSlideDirection('left')
    setActiveIndex((prev) => (prev + 1) % (services.length || 1))
  }, [services.length])

  const handlePrev = useCallback(() => {
    setSlideDirection('right')
    setActiveIndex((prev) => (prev - 1 + (services.length || 1)) % (services.length || 1))
  }, [services.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current

    // Horizontal swipe threshold: 35px, with horizontal intent
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartXRef.current = null
    touchStartYRef.current = null
  }

  // Safely scroll ONLY the internal rail container without touching window or parent ancestors
  useEffect(() => {
    if (railRef.current) {
      const rail = railRef.current
      const activeEl = rail.children[activeIndex] as HTMLElement
      if (activeEl) {
        const targetScrollLeft =
          activeEl.offsetLeft - rail.clientWidth / 2 + activeEl.clientWidth / 2
        rail.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth',
        })
      }
    }
  }, [activeIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    const sectionEl = document.getElementById('services')
    if (!sectionEl) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Trigger appointment pre-selection
  const handleRequestAppointment = (svc: Service) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-clinic-service', {
          detail: { slug: svc.slug, id: svc.id },
        })
      )
      const bookingEl = document.getElementById('booking')
      if (bookingEl) {
        bookingEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  if (!services || services.length === 0) {
    return (
      <section
        id="services"
        className="section scroll-mt-28 relative overflow-hidden bg-[#241e1d] text-white py-20 border-y border-[#e1c38c]/20"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <span className="font-castelar text-xs tracking-[0.28em] text-[#e1c38c] uppercase block mb-3 font-semibold">
            Specialized Care & Treatments
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-americana font-bold text-white tracking-tight mb-6">
            Clinical Services
          </h2>
          <div className="bg-white/[0.04] rounded-2xl p-8 border border-white/10 max-w-lg mx-auto">
            <p className="font-dinar text-[#dcd6d1] text-base leading-relaxed">
              Our clinical service catalog is being updated. Please consult our reception for
              specialized treatment inquiries.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const activeImageUrl =
    getMediaUrl(activeService.featuredImage) || `/images/services/${activeService.slug}.jpg`
  const currentNumStr = String(activeIndex + 1).padStart(2, '0')
  const totalNumStr = String(services.length).padStart(2, '0')

  // Common visual image frame component
  const renderImageFrame = (aspect = 'aspect-[4/3] sm:aspect-[16/11]') => (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-[#e1c38c]/25 shadow-2xl relative touch-pan-y select-none"
    >
      <div className={`relative ${aspect} rounded-xl overflow-hidden bg-black/40`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageUrl}
            initial={{
              opacity: 0,
              x: slideDirection === 'left' ? 36 : slideDirection === 'right' ? -36 : 0,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: slideDirection === 'left' ? -36 : slideDirection === 'right' ? 36 : 0,
            }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onPanEnd={(_, info) => {
              if (info.offset.x < -25 || info.velocity.x < -150) {
                handleNext()
              } else if (info.offset.x > 25 || info.velocity.x > 150) {
                handlePrev()
              }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={activeImageUrl}
              alt={`${activeService.title} - Dr. John Sevo Dental Clinic`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <section
      id="services"
      className="scroll-mt-28 relative overflow-hidden w-full max-w-full bg-[#241e1d] text-white py-16 sm:py-20 lg:py-24 border-y border-[#e1c38c]/20"
      aria-label="Clinical Services"
    >
      {/* =========================================================================
          ATMOSPHERIC AMBIENT DEPTH (Official Deep Brand Surface)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/primary-brown-abstract-background.png"
          alt=""
          fill
          priority={false}
          className="object-cover opacity-15 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1817] via-transparent to-[#1c1817] opacity-80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#241e1d]/50 to-[#181413]/90" />

        {/* Ambient Warm Bronze Lighting Glows */}
        <div className="absolute -left-36 top-1/4 w-[500px] h-[500px] rounded-full bg-[#e1c38c]/10 blur-3xl" />
        <div className="absolute -right-36 bottom-1/4 w-[500px] h-[500px] rounded-full bg-[#b1957b]/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        {/* =========================================================================
            SECTION HEADER (Editorial Presentation)
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="hidden sm:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-[#e1c38c]/30 text-xs font-castelar tracking-[0.24em] text-[#e1c38c] uppercase mb-4 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#e1c38c]" />
              <span>Comprehensive Dental Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-americana font-bold text-white tracking-tight leading-tight">
              Clinical Services
            </h2>
            <p className="font-dinar text-[#dcd6d1] text-base sm:text-lg max-w-2xl mt-3 leading-relaxed">
              Explore our wide range of specialized treatments designed to protect, restore, and
              enhance your smile.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#e1c38c] hover:text-white transition-colors group"
            >
              <span className="font-castelar uppercase tracking-wider text-xs">
                Explore All 11 Services
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Header Tactile Arrows */}
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous clinical service"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#e1c38c] hover:bg-white/[0.08] text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next clinical service"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#e1c38c] hover:bg-white/[0.08] text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ARCHITECTURAL SHOWCASE PAVILION (Deep Surface Centerpiece)
            ========================================================================= */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-3xl bg-white/[0.03] border border-[#e1c38c]/25 backdrop-blur-md overflow-hidden shadow-2xl mb-8 p-6 sm:p-10 lg:p-12 touch-pan-y"
        >
          {/* Subtle Watermark Service Number */}
          <div className="absolute top-2 right-6 sm:right-10 font-americana text-[7rem] sm:text-[10rem] font-bold text-white/[0.03] pointer-events-none select-none leading-none z-0">
            {currentNumStr}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
            {/* Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Meta Badge Bar */}
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-[#e1c38c]/35 text-[#e1c38c] text-xs font-castelar tracking-wider uppercase font-semibold">
                    {getServiceIcon(activeService.slug)}
                    <span>
                      Procedure {currentNumStr} of {totalNumStr}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id || activeService.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-americana font-bold text-white tracking-tight leading-tight">
                      {activeService.title}
                    </h3>

                    {/* MOBILE ONLY VISUAL (Positioned gracefully right below the title) */}
                    <div className="block lg:hidden my-5">
                      {renderImageFrame('aspect-[4/3] min-h-[250px] sm:min-h-[280px]')}
                      {/* Mobile arrow controls & pagination */}
                      <div className="flex items-center justify-between mt-3 px-1">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                          aria-label="Previous service"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10">
                          <span className="text-xs font-castelar tracking-widest text-[#e1c38c] font-semibold">
                            {currentNumStr}
                          </span>
                          <span className="text-white/30 text-xs">/</span>
                          <span className="text-xs font-castelar tracking-widest text-[#a59b95]">
                            {totalNumStr}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                          aria-label="Next service"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="font-dinar text-base sm:text-lg text-[#dcd6d1] leading-relaxed">
                      {activeService.shortDescription}
                    </p>

                    {/* Patient Benefit Architectural Plaque */}
                    {activeService.patientBenefit ? (
                      <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-black/25 border border-[#e1c38c]/30 text-white relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e1c38c] to-[#b58a48]" />
                        <div className="flex items-start gap-3 pl-1">
                          <Sparkles className="w-5 h-5 text-[#e1c38c] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[11px] font-castelar tracking-widest uppercase font-bold text-[#e1c38c] block mb-1">
                              Patient Clinical Benefit
                            </span>
                            <p className="text-sm sm:text-base font-dinar font-medium text-[#f5f5f5] leading-snug">
                              {activeService.patientBenefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="pt-7 mt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleRequestAppointment(activeService)}
                  className="btn rounded-xl bg-[#8e6e4f] hover:bg-[#a27e5b] text-white py-3.5 px-7 text-sm font-semibold shadow-lg transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href={`/services/${activeService.slug}`}
                  className="btn rounded-xl bg-transparent border border-white/20 hover:border-[#e1c38c] text-white hover:text-[#e1c38c] py-3.5 px-6 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <span>Full Procedure Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* DESKTOP ONLY Visual Frame (Art Gallery / Medical Framing) */}
            <div className="hidden lg:block lg:col-span-6 relative">
              {renderImageFrame('aspect-[4/3] xl:aspect-[16/11]')}
            </div>
          </div>
        </div>

        {/* =========================================================================
            TACTILE EDITORIAL TREATMENT RAIL (Horizontal Index Ribbon & Futuristic Ambient Scrubber)
            ========================================================================= */}
        <div
          className="pt-2 relative group/rail"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          {/* Subtle Atmospheric Side Edge Fade Masks */}
          <div className="absolute left-0 top-0 bottom-12 w-6 sm:w-16 bg-gradient-to-r from-[#241e1d] to-transparent pointer-events-none z-10 opacity-80 hidden sm:block" />
          <div className="absolute right-0 top-0 bottom-12 w-6 sm:w-16 bg-gradient-to-l from-[#241e1d] to-transparent pointer-events-none z-10 opacity-80 hidden sm:block" />

          {/* Horizontal Scrollable Ribbon (Native scrollbar completely stripped) */}
          <div
            ref={railRef}
            tabIndex={0}
            onScroll={handleRailScroll}
            aria-label="Clinical treatments horizontal ribbon"
            className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth snap-x snap-mandatory focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map((svc, idx) => {
              const isActive = idx === activeIndex
              const thumbUrl =
                getMediaUrl(svc.featuredImage) || `/images/services/${svc.slug}.jpg`
              const numStr = String(idx + 1).padStart(2, '0')

              return (
                <button
                  key={svc.id || svc.slug}
                  type="button"
                  onClick={() => handleSelectService(idx)}
                  className={`flex-shrink-0 text-left rounded-2xl p-3 transition-all snap-start flex items-center gap-3 border cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.12] text-white border-[#e1c38c] ring-1 ring-[#e1c38c]/50 shadow-xl scale-[1.01]'
                      : 'bg-white/[0.03] text-[#c8bfb9] border-white/10 hover:border-[#e1c38c]/40 hover:bg-white/[0.06] hover:text-white'
                  } min-w-[250px] sm:min-w-[270px] max-w-[290px]`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 bg-black/40 border border-white/10">
                    <Image
                      src={thumbUrl}
                      alt={svc.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-[10px] font-castelar tracking-wider block uppercase mb-0.5 ${
                        isActive ? 'text-[#e1c38c]' : 'text-[#a59b95]'
                      }`}
                    >
                      Procedure {numStr}
                    </span>
                    <h4
                      className={`text-sm font-americana font-bold truncate leading-tight ${
                        isActive ? 'text-white' : 'text-[#f5f5f5]'
                      }`}
                    >
                      {svc.title}
                    </h4>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Futuristic Intelligent Ambient Scrubber Bar */}
          <div
            className={`flex items-center justify-center gap-3.5 pt-3 transition-all duration-500 ${
              isInteracting
                ? 'opacity-100 translate-y-0'
                : 'opacity-40 sm:opacity-50 hover:opacity-100'
            }`}
          >
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous clinical service"
              className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-[#e1c38c]/20 border border-white/10 hover:border-[#e1c38c]/50 text-[#e1c38c] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Glowing Interactive Track */}
            <div
              onClick={handleTrackClick}
              role="slider"
              aria-label="Clinical treatments scrubber track"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(scrollProgress * 100)}
              className="relative w-44 sm:w-64 h-1.5 sm:h-2 rounded-full bg-white/[0.08] border border-[#e1c38c]/25 hover:border-[#e1c38c]/60 cursor-pointer overflow-hidden backdrop-blur-md transition-all group"
            >
              {/* Dynamic Luminous Gradient Capsule */}
              <div
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#b58a48] via-[#e1c38c] to-[#f8ede3] shadow-[0_0_12px_rgba(225,195,140,0.7)] transition-all duration-150 ease-out"
                style={{
                  width: '30%',
                  left: `${scrollProgress * 70}%`,
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next clinical service"
              className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-[#e1c38c]/20 border border-white/10 hover:border-[#e1c38c]/50 text-[#e1c38c] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
