'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface ChapterItem {
  id: string
  num: string
  label: string
}

const CHAPTERS: ChapterItem[] = [
  { id: 'chapter-founder', num: '01', label: "Founder's Message" },
  { id: 'chapter-philosophy', num: '02', label: 'Our Philosophy' },
  { id: 'chapter-clinics', num: '03', label: 'About Our Clinics' },
  { id: 'chapter-vision', num: '04', label: 'Our Vision' },
  { id: 'chapter-mission', num: '05', label: 'Our Mission' },
  { id: 'chapter-values', num: '06', label: 'Core Values' },
  { id: 'chapter-strengths', num: '07', label: 'Our Strengths' },
  { id: 'chapter-success', num: '08', label: 'Keys to Success' },
  { id: 'chapter-rd', num: '09', label: 'R&D & Precision' },
  { id: 'chapter-team', num: '10', label: 'Medical Team' },
  { id: 'chapter-positioning', num: '11', label: 'Our Positioning' },
]

export function ChapterNav() {
  const [activeId, setActiveId] = useState<string>('chapter-founder')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, observerOptions)

    CHAPTERS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 90
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const activeIndex = CHAPTERS.findIndex((c) => c.id === activeId)
  const safeActiveIndex = activeIndex !== -1 ? activeIndex : 0
  const currentChapter = CHAPTERS[safeActiveIndex]

  const goToPrevChapter = () => {
    if (safeActiveIndex > 0) {
      scrollToChapter(CHAPTERS[safeActiveIndex - 1].id)
    }
  }

  const goToNextChapter = () => {
    if (safeActiveIndex < CHAPTERS.length - 1) {
      scrollToChapter(CHAPTERS[safeActiveIndex + 1].id)
    }
  }

  return (
    <>
      {/* Desktop Floating Editorial Rail with Signature Brown Abstract Background */}
      <nav
        aria-label="Story Chapters"
        className={`group/rail fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1 p-2 rounded-2xl bg-[#241e1d] border border-[#e1c38c]/35 shadow-2xl overflow-hidden transition-all duration-300 ease-out w-[54px] hover:w-[225px] ${
          isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        {/* Signature Brown Abstract Background */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden rounded-2xl">
          <Image
            src="/images/primary-brown-abstract-background.png"
            alt=""
            fill
            className="object-cover opacity-50 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#241e1d]/85 via-[#36302f]/80 to-[#1e1918]/90" />
        </div>

        {/* Top Header: Slim '§' on collapse, full 'Overview' on hover */}
        <div className="relative z-10 px-1 pt-1 pb-1.5 border-b border-[#e1c38c]/20 text-center flex items-center justify-center min-h-[22px]">
          <span className="font-castelar text-[9px] tracking-[0.2em] text-[#e1c38c] uppercase whitespace-nowrap overflow-hidden transition-all duration-300">
            <span className="inline group-hover/rail:hidden">§</span>
            <span className="hidden group-hover/rail:inline">Overview</span>
          </span>
        </div>

        {/* Chapters List */}
        <div className="relative z-10 flex flex-col gap-0.5 py-1">
          {CHAPTERS.map((ch) => {
            const isActive = activeId === ch.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className={`flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-[#b58a48]/30 text-white font-bold'
                    : 'text-[#f5f5f5]/70 hover:text-[#f5f5f5] hover:bg-white/10'
                }`}
                title={ch.label}
              >
                {/* Slim Default Representation: Gold Dot + Index */}
                <span className="flex items-center justify-center gap-1.5 flex-shrink-0 w-7">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-[#e1c38c] scale-125 shadow-[0_0_8px_rgba(225,195,140,0.9)]'
                        : 'bg-[#e1c38c]/40'
                    }`}
                  />
                  <span
                    className={`font-castelar text-[10px] tracking-wider ${
                      isActive ? 'text-[#e1c38c] font-bold' : 'text-[#e1c38c]/75'
                    }`}
                  >
                    {ch.num}
                  </span>
                </span>

                {/* Expanded Full Label on Hover */}
                <span className="text-xs font-dinar tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 max-w-0 opacity-0 group-hover/rail:max-w-[160px] group-hover/rail:opacity-100">
                  {ch.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile Ultra-Slim Bottom Dock (Docked at bottom edge, minimal height, zero scrollbars, quiet luxury) */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 xl:hidden transition-transform duration-300 ease-out ${
          isScrolled ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* Backdrop for Chapter Selector */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Bottom Chapter Selector Sheet */}
        {isMobileMenuOpen && (
          <div className="relative z-50 rounded-t-2xl bg-[#241e1d] border-t border-x border-[#e1c38c]/30 shadow-2xl overflow-hidden max-h-[65vh] flex flex-col">
            {/* Signature Brown Abstract Background */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              <Image
                src="/images/primary-brown-abstract-background.png"
                alt=""
                fill
                className="object-cover opacity-45 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#241e1d]/92 via-[#36302f]/88 to-[#1e1918]/95" />
            </div>

            {/* Sheet Handle & Header */}
            <div className="relative z-10 px-4 pt-2.5 pb-2 border-b border-[#e1c38c]/15">
              <div className="w-8 h-1 bg-[#e1c38c]/40 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-castelar text-[11px] tracking-widest text-[#e1c38c] font-bold uppercase">
                    Chapters
                  </span>
                  <span className="text-[#e1c38c]/40 text-xs">/</span>
                  <span className="font-dinar text-xs text-[#e1c38c]/80">فصول الصفحة</span>
                  <span className="font-castelar text-[10px] text-[#e1c38c]/60 ml-1">
                    ({CHAPTERS.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-[#f5f5f5]/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chapters List (Strictly hidden scrollbar, clean tap targets) */}
            <div className="relative z-10 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1 max-h-[50vh]">
              {CHAPTERS.map((ch) => {
                const isActive = activeId === ch.id
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      scrollToChapter(ch.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-[#b58a48]/35 text-white font-bold border border-[#e1c38c]/35'
                        : 'text-[#f5f5f5]/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-castelar text-[11px] text-[#e1c38c] font-semibold w-5">
                        {ch.num}
                      </span>
                      <span className="font-dinar text-xs">
                        {ch.label}
                      </span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e1c38c] shadow-[0_0_6px_#e1c38c]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Slim Docked Bottom Bar (Flat to bottom edge, minimal height, elegant simplicity) */}
        <div className="relative z-40 h-10 px-2 bg-[#241e1d] border-t border-[#e1c38c]/30 shadow-[0_-4px_25px_rgba(0,0,0,0.35)] flex items-center justify-between select-none">
          {/* Signature Brown Abstract Background */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <Image
              src="/images/primary-brown-abstract-background.png"
              alt=""
              fill
              className="object-cover opacity-45 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#241e1d]/95 via-[#36302f]/90 to-[#241e1d]/95" />
          </div>

          {/* Left: Previous Chapter */}
          <button
            type="button"
            onClick={goToPrevChapter}
            disabled={safeActiveIndex <= 0}
            className="relative z-10 w-8 h-8 rounded-md flex items-center justify-center text-[#e1c38c] hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-95"
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Center: Tapable Chapter Name (Slim, clear, prestigious) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-10 flex-1 flex items-center justify-center gap-2 px-2 h-full text-center active:opacity-75 transition-opacity"
            aria-label="Open Chapter Selector"
          >
            <span className="font-castelar text-[10px] text-[#e1c38c] font-bold">
              {currentChapter.num}
            </span>
            <span className="text-[#e1c38c]/40 text-[10px]">·</span>
            <span className="text-xs font-dinar text-[#fdfcf9] font-medium truncate max-w-[190px] sm:max-w-[260px]">
              {currentChapter.label}
            </span>
            <span className="font-castelar text-[9px] text-[#e1c38c]/60">
              ({safeActiveIndex + 1}/{CHAPTERS.length})
            </span>
          </button>

          {/* Right: Next Chapter */}
          <button
            type="button"
            onClick={goToNextChapter}
            disabled={safeActiveIndex >= CHAPTERS.length - 1}
            className="relative z-10 w-8 h-8 rounded-md flex items-center justify-center text-[#e1c38c] hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all active:scale-95"
            aria-label="Next Chapter"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
