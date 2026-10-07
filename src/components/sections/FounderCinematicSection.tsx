'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Quote, Sparkles, ArrowRight } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

export interface FounderCinematicSectionProps {
  title?: string | null
  quote?: string | null
  name?: string | null
  role?: string | null
  imageUrl?: string | null
}

// Framer Motion Animation Variants (Smooth, Luxury, Lightweight)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const portraitVariants: Variants = {
  hidden: { opacity: 0, x: -30, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const quoteCardVariants: Variants = {
  hidden: { opacity: 0, x: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function FounderCinematicSection({
  title = 'A Word from the Founder',
  quote,
  name = 'Dr. John Sevo Dawod',
  role = 'Founder & Medical Director',
  imageUrl = '/images/hero-doctor.webp',
}: FounderCinematicSectionProps) {
  // Parse paragraphs strictly from real quote data
  const rawQuote = quote?.trim() || ''
  const paragraphs = rawQuote
    ? rawQuote
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  if (!rawQuote && paragraphs.length === 0) {
    return null
  }

  const sectionTitle = title?.trim() || 'A Word from the Founder'

  return (
    <section
      id="founder-word"
      className="relative overflow-hidden w-full max-w-full bg-[#f2ebe1] text-[#36302f] py-16 lg:py-20 border-t border-[#e2d5c3] border-b border-[#36302f]/25"
      aria-label={sectionTitle}
    >
      {/* 1. Cinematic Ambient Lighting & Floating Warm Parchment Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f2ea] via-[#f2ebe1] to-[#eae0d2] opacity-95" />

        {/* Floating Ambient Warm Bronze/Gold Light Glows with Framer Motion */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-32 top-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#b58a48]/15 via-[#e1c38c]/25 to-transparent blur-3xl opacity-70"
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 25, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-0 bottom-10 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#e1c38c]/25 via-[#b58a48]/15 to-transparent blur-3xl opacity-60"
        />

        {/* Subtle Watermark Emblem in Background */}
        <div className="absolute right-0 lg:-right-8 top-1/2 -translate-y-1/2 opacity-[0.14] lg:opacity-[0.18] pointer-events-none select-none z-0">
          <Image
            src="/logos/logo-watermark-opacity-39.svg"
            alt=""
            width={580}
            height={580}
            className="w-[440px] lg:w-[600px] h-auto object-contain"
          />
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="container relative z-10 mx-auto px-6 lg:px-8 max-w-7xl"
      >
        {/* Section Header with smooth entrance */}
        <motion.div variants={fadeUpVariants} className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#b58a48]/35 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b58a48] animate-pulse" />
            <span className="font-castelar text-xs tracking-[0.25em] text-[#8e6e4f] uppercase font-semibold">
              Founder&apos;s Message
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-americana font-bold text-[#36302f] tracking-tight">
            {sectionTitle}
          </h2>
        </motion.div>

        {/* Balanced Grid: Exactly Equal Heights (items-stretch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          {/* ====================================================================
              LEFT: Doctor Portrait Card (Framer Motion Enhanced)
              ==================================================================== */}
          <motion.div variants={portraitVariants} className="lg:col-span-5 flex flex-col">
            <motion.div
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full min-h-[380px] sm:min-h-[420px] lg:min-h-full rounded-3xl overflow-hidden bg-[#e4dacb] border border-[#b1957b]/35 shadow-xl flex flex-col justify-end group cursor-default"
            >
              {/* Doctor Portrait Image: Focused strictly on Dr. John Sevo */}
              <Image
                src={imageUrl || '/images/hero-doctor.webp'}
                alt={name || 'Dr. John Sevo Dawod'}
                fill
                priority
                className="object-cover object-[18%_top] transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />

              {/* Seamless Vignette Gradient at base of photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#191413]/90 via-[#191413]/25 to-transparent opacity-85 group-hover:opacity-80 transition-opacity duration-700" />

              {/* Subtle ambient light sweep across the card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Bottom Authentic Doctor Plaque */}
              <div className="relative z-10 p-5 sm:p-6 space-y-1 border-t border-[rgba(225,195,140,0.25)] bg-gradient-to-t from-[#191413]/95 via-[#191413]/70 to-transparent backdrop-blur-[2px]">
                {name && (
                  <h3 className="font-americana text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {name}
                  </h3>
                )}

                {role && (
                  <p className="font-castelar text-xs sm:text-sm tracking-widest text-[#e1c38c] uppercase font-light">
                    {role}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* ====================================================================
              RIGHT: Editorial Quote Card (Warm Luxury Parchment)
              ==================================================================== */}
          <motion.div variants={quoteCardVariants} className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-full rounded-3xl bg-white/50 backdrop-blur-md border border-white/80 p-6 sm:p-8 lg:p-9 shadow-[0_8px_32px_0_rgba(54,48,47,0.06)] flex flex-col justify-between">
              {/* Top: Animated Gold Quote Icon & Flowing Paragraphs */}
              <div className="space-y-4">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#b58a48]/45 select-none -mb-3 inline-block"
                >
                  <Quote className="w-10 h-10 sm:w-12 sm:h-12" />
                </motion.div>

                {/* Staggered Paragraphs using Framer Motion */}
                <motion.div
                  variants={{
                    visible: { transition: { staggerChildren: 0.12 } },
                  }}
                  className="space-y-4"
                >
                  {paragraphs.map((p, idx) => (
                    <motion.p
                      key={idx}
                      variants={paragraphVariants}
                      className="font-dinar text-base sm:text-lg lg:text-xl text-[#36302f] leading-relaxed font-normal"
                    >
                      &ldquo;{p}&rdquo;
                    </motion.p>
                  ))}
                </motion.div>
              </div>

              {/* Bottom: Action Bar with Authentic Clinic Heritage Link */}
              <motion.div
                variants={fadeUpVariants}
                className="mt-6 pt-5 border-t border-[#b1957b]/20 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5 text-[#8e6e4f] text-xs font-castelar tracking-widest uppercase font-semibold">
                  <Sparkles className="w-4 h-4 text-[#b58a48]" />
                  <span>Dr. John Sevo Dental Clinic Group</span>
                </div>

                <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/about"
                    className="btn rounded-xl bg-[#8e6e4f] hover:bg-[#a27e5b] text-white py-2.5 px-6 text-xs font-castelar tracking-wider uppercase shadow-md transition-all flex items-center gap-2 group active:scale-95"
                  >
                    <span>About Us</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
