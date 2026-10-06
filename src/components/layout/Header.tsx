'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, Menu } from 'lucide-react'
import { ClinicLogo } from './ClinicLogo'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  clinicName?: string | null
}

export function Header({ clinicName }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#fdfcf9]/95 backdrop-blur-md border-b border-[rgba(54,48,47,0.08)] shadow-[0_2px_12px_rgba(54,48,47,0.03)] transition-all">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-[88px] flex items-center justify-between">
          {/* Outer Left: Official Brand Wordmark / Mobile Trigger */}
          <div className="flex-1 flex items-center justify-start">
            {/* Desktop Brand Typography Logo */}
            <div className="hidden sm:flex items-center">
              <ClinicLogo variant="text-only" height={26} clinicName={clinicName} className="hover:opacity-90 transition-opacity" />
            </div>

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="sm:hidden relative w-11 h-11 rounded-full border border-[#b58a48]/35 bg-gradient-to-br from-[#fdfcf9] to-[#f4ede4] flex items-center justify-center text-[#36302f] hover:text-[#b58a48] hover:border-[#b58a48] shadow-sm hover:shadow-[0_2px_12px_rgba(181,138,72,0.25)] transition-all duration-200 active:scale-95 group"
            >
              <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b58a48] ring-2 ring-white" />
            </button>
          </div>

        {/* Center: The Intimate Navigation Core (3 Links — Centered Emblem — 3 Links) */}
        <div className="flex items-center justify-center">
          {/* Desktop Cluster */}
          <div className="hidden md:flex items-center">
            {/* Left 3 Links */}
            <nav className="flex items-center gap-6 lg:gap-8 text-[13px] tracking-[0.06em] font-medium uppercase pr-4 lg:pr-6">
              <Link
                href="/"
                className="text-[#36302f] font-semibold relative py-1.5 text-center transition-colors hover:text-[#b58a48]"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-[#5a5350] hover:text-[#b58a48] py-1.5 transition-colors"
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-[#5a5350] hover:text-[#b58a48] py-1.5 transition-colors"
              >
                Services
              </Link>
            </nav>

            {/* Enlarged Centered Pure Gold Emblem */}
            <div className="flex-shrink-0 px-2 lg:px-4">
              <ClinicLogo variant="emblem-only" height={68} clinicName={clinicName} />
            </div>

            {/* Right 3 Links */}
            <nav className="flex items-center gap-6 lg:gap-8 text-[13px] tracking-[0.06em] font-medium uppercase pl-4 lg:pl-6">
              <Link
                href="/blog"
                className="text-[#5a5350] hover:text-[#b58a48] py-1.5 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/#results"
                className="text-[#5a5350] hover:text-[#b58a48] py-1.5 transition-colors"
              >
                Results
              </Link>
              <Link
                href="/contact"
                className="text-[#5a5350] hover:text-[#b58a48] py-1.5 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile Centered Logo */}
          <div className="md:hidden flex items-center justify-center">
            <ClinicLogo variant="emblem-only" height={52} clinicName={clinicName} />
          </div>
        </div>

        {/* Outer Right: Action Button */}
        <div className="flex-1 flex items-center justify-end">
          <a
            href="#booking"
            className="btn rounded-full bg-[#8e6e4f] hover:bg-[#a27e5b] text-white py-2.5 px-5 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center gap-2 group"
          >
            <Calendar className="w-3.5 h-3.5 text-[#e1c38c]" />
            <span className="hidden sm:inline">Book Visit</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
        </div>
      </header>

      {/* Futuristic Cinematic Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        clinicName={clinicName}
      />
    </>
  )
}
