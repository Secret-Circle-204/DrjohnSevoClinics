'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { X, ArrowRight, Calendar } from 'lucide-react'
import { ClinicLogo } from './ClinicLogo'

export interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  clinicName?: string | null
}

const NAV_ITEMS = [
  { num: '01', label: 'Home', href: '/' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Services', href: '/services' },
  { num: '04', label: 'Blog', href: '/blog' },
  { num: '05', label: 'Results', href: '/#results' },
  { num: '06', label: 'Contact', href: '/contact' },
]

export function MobileNav({ isOpen, onClose, clinicName }: MobileNavProps) {
  const pathname = usePathname()
  const [isExiting, setIsExiting] = useState(false)

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Golden Aurora Dissolve Close Trigger
  const triggerGoldenClose = useCallback((targetHref?: string) => {
    if (isExiting) return
    setIsExiting(true)

    // Duration matches the goldenLateralExit keyframe duration (350ms)
    setTimeout(() => {
      onClose()
      setIsExiting(false)

      if (targetHref && targetHref.startsWith('#') && targetHref.length > 1) {
        const el = document.querySelector(targetHref)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (targetHref) {
        window.location.href = targetHref
      }
    }, 350)
  }, [isExiting, onClose])

  // Lock body scroll while open & listen for Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') triggerGoldenClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, triggerGoldenClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-gradient-to-b from-[#36302f] via-[#2d2827] to-[#221e1d] text-[#f5f5f5] overflow-hidden select-none ${
        isExiting ? 'animate-golden-aurora-exit' : 'animate-cinematic-sheet'
      }`}
    >
      {/* Golden Exit Overlays */}
      {isExiting && (
        <>
          {/* Luminous Golden Leading Edge on the Left Border */}
          <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-[#E1C38C] to-transparent shadow-[-4px_0_25px_rgba(225,195,140,0.9)] z-50 pointer-events-none" />
          {/* Subtle Golden Ambient Aura Flash */}
          <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-r from-transparent via-[#E1C38C]/15 to-[#b58a48]/25 animate-golden-aura-flash" />
          {/* Golden Shimmer Wipe */}
          <div className="absolute inset-0 z-[51] pointer-events-none overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#E1C38C]/35 to-transparent animate-golden-shimmer-wipe" />
          </div>
        </>
      )}

      {/* Top Gold Horizon Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E1C38C] to-transparent pointer-events-none" />

      {/* Top Header Bar */}
      <div
        className={`relative z-20 flex items-center justify-between px-6 py-5 border-b border-[#b58a48]/20 bg-[#36302f]/80 backdrop-blur-md ${
          isExiting ? 'animate-header-sweep-up' : ''
        }`}
      >
        <div className="flex items-center">
          <ClinicLogo variant="light-vertecal" height={52} clinicName={clinicName} />
        </div>

        {/* Clean Luxury Close Button */}
        <button
          type="button"
          onClick={() => triggerGoldenClose()}
          disabled={isExiting}
          aria-label="Close navigation"
          className="relative w-11 h-11 rounded-full border border-[#E1C38C]/50 bg-[#433c3a]/70 text-[#E1C38C] hover:bg-[#b58a48] hover:text-white flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 group"
        >
          <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
        </button>
      </div>

      {/* Spacious Haute-Couture Links List with Staggered Cascading Hops */}
      <div
        className="relative z-10 flex-1 px-6 py-4 overflow-y-auto flex flex-col justify-center divide-y divide-[#b58a48]/15"
      >
        {NAV_ITEMS.map((item, idx) => {
          const active = isLinkActive(item.href)
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                triggerGoldenClose(item.href)
              }}
              style={{
                animation: isExiting
                  ? `navItemSlideOutLateral 0.24s cubic-bezier(0.32, 0.72, 0, 1) ${idx * 16}ms both`
                  : `cinematicHop 0.52s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60 + 50}ms both`,
              }}
              className={`group relative flex items-center justify-between py-3.5 sm:py-4 px-3 rounded-2xl transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-[#b58a48]/25 via-[#b58a48]/10 to-transparent border border-[#b58a48]/35 shadow-xs'
                  : 'hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={`font-castelar text-sm sm:text-base tracking-widest ${
                    active ? 'text-[#E1C38C] font-bold' : 'text-[#E1C38C]/70'
                  }`}
                >
                  {item.num}
                </span>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`block font-americana text-2xl sm:text-3xl tracking-wide transition-all duration-200 group-hover:translate-x-1.5 ${
                      active ? 'text-[#E1C38C] font-bold' : 'text-white group-hover:text-[#E1C38C]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-[#E1C38C] shadow-[0_0_10px_#E1C38C]" />
                  )}
                </div>
              </div>

              <div
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 ${
                  active
                    ? 'border-[#E1C38C] bg-[#b58a48]/30 text-[#E1C38C]'
                    : 'border-[#E1C38C]/20 group-hover:border-[#E1C38C] group-hover:bg-[#b58a48]/20 text-[#E1C38C]/60 group-hover:text-[#E1C38C]'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          )
        })}
      </div>

      {/* Bottom Cinematic Action Bar */}
      <div
        className={`relative z-20 px-6 py-5 border-t border-[#b58a48]/20 bg-[#2b2524]/90 backdrop-blur-md space-y-4 ${
          isExiting ? 'animate-footer-sweep-down' : ''
        }`}
      >
        {/* Book Visit Button */}
        <a
          href="#booking"
          onClick={(e) => {
            e.preventDefault()
            triggerGoldenClose('#booking')
          }}
          style={{
            animation: !isExiting
              ? 'cinematicHop 0.52s cubic-bezier(0.16, 1, 0.3, 1) 420ms both'
              : undefined,
          }}
          className="relative w-full py-4 rounded-full bg-gradient-to-r from-[#E1C38C] via-[#b58a48] to-[#E1C38C] text-[#36302f] font-americana font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_6px_25px_rgba(181,138,72,0.35)] hover:shadow-[0_8px_30px_rgba(225,195,140,0.5)] overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] group"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/30 animate-shimmer-beam pointer-events-none" />
          <Calendar className="w-4 h-4 text-[#36302f]" />
          <span>Book Appointment</span>
          <ArrowRight className="w-4 h-4 text-[#36302f] group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Footer Meta & Social Icons */}
        <div
          style={{
            animation: !isExiting
              ? 'cinematicHop 0.52s cubic-bezier(0.16, 1, 0.3, 1) 480ms both'
              : undefined,
          }}
          className="flex items-center justify-between pt-2"
        >
          <div className="text-xs font-dinar text-[#ede8e4]">
            {clinicName && <span className="block text-[#E1C38C] font-semibold">{clinicName}</span>}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E1C38C] to-[#b58a48] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E1C38C] to-[#b58a48] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="#"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E1C38C] to-[#b58a48] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E1C38C] to-[#b58a48] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

