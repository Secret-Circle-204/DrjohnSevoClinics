'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Sparkles, ShieldCheck, Award, Smile, Layers } from 'lucide-react'

export interface PillarItem {
  title: string
  description?: string | null
  iconName?: string | null
}

interface ExperienceSectionProps {
  whyChooseTitle?: string | null
  pillars?: PillarItem[] | null
}

function getReasonIcon(iconName?: string | null, idx: number = 0) {
  const name = (iconName || '').toLowerCase()
  if (name.includes('cpu') || name.includes('tech') || idx === 0) {
    return <Cpu className="w-6 h-6 stroke-[1.75]" />
  }
  if (
    name.includes('team') ||
    name.includes('expert') ||
    name.includes('users') ||
    name.includes('award') ||
    idx === 1
  ) {
    return <Award className="w-6 h-6 stroke-[1.75]" />
  }
  if (name.includes('comfort') || name.includes('smile') || name.includes('heart') || idx === 2) {
    return <Smile className="w-6 h-6 stroke-[1.75]" />
  }
  if (
    name.includes('comprehens') ||
    name.includes('care') ||
    name.includes('shield') ||
    idx === 3
  ) {
    return <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
  }
  if (name.includes('sparkle')) return <Sparkles className="w-6 h-6 stroke-[1.75]" />
  if (name.includes('layers')) return <Layers className="w-6 h-6 stroke-[1.75]" />
  return <Sparkles className="w-6 h-6 stroke-[1.75]" />
}

export function ExperienceSection({ whyChooseTitle, pillars }: ExperienceSectionProps) {
  const hasReasons = Boolean(pillars && pillars.length > 0)

  if (!hasReasons) {
    return null
  }

  const titleText = whyChooseTitle?.trim()

  return (
    <section
      id="why-choose"
      className="section relative overflow-hidden bg-gradient-to-b from-[#f7f3ee] via-[#efe7dc] to-[#f7f3ee] py-20 sm:py-28 lg:py-32 border-b border-[#e1c38c]/25"
    >
      {/* Ambient background lighting and luxury radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(225,195,140,0.18),transparent)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#b58a48]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#b58a48]/30 text-[#b58a48] font-castelar text-xs tracking-[0.25em] uppercase mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b58a48]" />
            <span>Excellence in Patient Care</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-americana font-bold text-3xl sm:text-4xl lg:text-5xl text-[#36302f] tracking-tight leading-tight"
          >
            {titleText || 'Why Choose Us?'}
          </motion.h2>

          {/* Luxury gold accent divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-3 my-6"
          >
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#b58a48]/60" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#b58a48]" />
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#b58a48]/60" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-dinar text-[#6e6662] text-lg sm:text-xl leading-relaxed"
          >
            Four core commitments to clinical excellence, advanced diagnostics, and dedicated
            comfort that define your healthcare journey at Dr. John Sevo Clinics.
          </motion.p>
        </div>

        {/* 4 Reasons Grid with Keys to Our Success Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars?.map((item, idx) => {
            const sequenceStr = String(idx + 1).padStart(2, '0')
            return (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl p-8 sm:p-9 bg-gradient-to-br from-[#36302f] via-[#2b2524] to-[#1c1817] border border-[#e1c38c]/25 shadow-xl hover:shadow-2xl hover:border-[#e1c38c]/60 transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top gold hairline */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#e1c38c]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Soft warm ambient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e1c38c]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Subtle warm corner glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#b58a48]/10 rounded-full blur-2xl group-hover:bg-[#b58a48]/20 transition-all duration-500 pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Row: 2-Digit Sequence & Icon Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-castelar font-bold text-3xl sm:text-4xl text-[#e1c38c]/40 group-hover:text-[#e1c38c] transition-colors duration-300 select-none">
                      {sequenceStr}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-[#e1c38c]/25 text-[#e1c38c] flex items-center justify-center group-hover:bg-[#e1c38c] group-hover:text-[#2b2524] group-hover:scale-105 transition-all duration-300 shadow-sm">
                      {getReasonIcon(item.iconName, idx)}
                    </div>
                  </div>

                  {/* Reason Title */}
                  <h3 className="font-americana font-bold text-xl sm:text-2xl text-white group-hover:text-[#e1c38c] transition-colors duration-300 mb-3 leading-snug">
                    {item.title}
                  </h3>

                  {/* Reason Description */}
                  {item.description && (
                    <p className="font-dinar text-[#f5f5f5]/85 text-base leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom Card Accent */}
                <div className="relative z-10 pt-6 mt-8 border-t border-[#e1c38c]/15 flex items-center justify-end">
                  <Sparkles className="w-3.5 h-3.5 text-[#e1c38c] opacity-35 group-hover:opacity-80 transition-opacity duration-300" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
