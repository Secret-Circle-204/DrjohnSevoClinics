'use client'

import React, { useEffect, useState } from 'react'

export interface ChapterItem {
  id: string
  label: string
}

const CHAPTERS: ChapterItem[] = [
  { id: 'chapter-founder', label: "Founder's Message" },
  { id: 'chapter-philosophy', label: 'Our Philosophy' },
  { id: 'chapter-clinics', label: 'About Our Clinics' },
  { id: 'chapter-vision', label: 'Our Vision' },
  { id: 'chapter-mission', label: 'Our Mission' },
  { id: 'chapter-values', label: 'Core Values' },
  { id: 'chapter-strengths', label: 'Our Strengths' },
  { id: 'chapter-success', label: 'Keys to Success' },
  { id: 'chapter-rd', label: 'R&D & Precision' },
  { id: 'chapter-team', label: 'Medical Team' },
  { id: 'chapter-positioning', label: 'Our Positioning' },
]

export function ChapterNav() {
  const [activeId, setActiveId] = useState<string>('chapter-founder')
  const [isScrolled, setIsScrolled] = useState(false)

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

  return (
    <>
      {/* Desktop Floating Editorial Rail */}
      <nav
        aria-label="Story Chapters"
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1 p-2 rounded-2xl bg-[#36302f]/92 backdrop-blur-md border border-[#e1c38c]/25 shadow-2xl transition-all duration-500 ${
          isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-1 pb-1.5 border-b border-[#e1c38c]/15 text-[9px] font-castelar tracking-[0.2em] text-[#e1c38c] uppercase text-center">
          Story
        </div>
        <div className="flex flex-col gap-0.5 py-1">
          {CHAPTERS.map((ch) => {
            const isActive = activeId === ch.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-[#b58a48]/25 text-[#f5f5f5]'
                    : 'text-[#f5f5f5]/60 hover:text-[#f5f5f5] hover:bg-white/5'
                }`}
                title={ch.label}
              >
                <span
                  className={`font-mono text-[11px] transition-colors ${
                    isActive ? 'text-[#e1c38c] font-bold' : 'text-[#f5f5f5]/50 group-hover:text-[#e1c38c]'
                  }`}
                >
                  {ch.num}
                </span>
                <span
                  className={`text-xs font-perpetua tracking-wide whitespace-nowrap transition-all max-w-0 overflow-hidden group-hover:max-w-[140px] opacity-0 group-hover:opacity-100 ${
                    isActive ? '!max-w-[140px] !opacity-100 font-bold text-white' : ''
                  }`}
                >
                  {ch.label}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ml-auto transition-all ${
                    isActive ? 'bg-[#e1c38c] scale-125' : 'bg-transparent group-hover:bg-[#e1c38c]/50'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile Sticky Horizontal Chapter Bar */}
      <div
        className={`fixed top-16 left-0 right-0 z-30 xl:hidden bg-[#36302f]/95 backdrop-blur-md border-b border-[#e1c38c]/20 py-2 px-3 shadow-lg transition-all duration-300 ${
          isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="font-castelar text-[10px] tracking-widest text-[#e1c38c] uppercase whitespace-nowrap mr-1">
            Story:
          </span>
          {CHAPTERS.map((ch) => {
            const isActive = activeId === ch.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#b58a48] text-white font-semibold shadow-sm'
                    : 'bg-white/10 text-[#f5f5f5]/75 hover:bg-white/15'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{ch.num}</span>
                <span className="font-perpetua">{ch.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
