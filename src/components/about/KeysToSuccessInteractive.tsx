'use client'

import React, { useState } from 'react'
import { Sparkles, ShieldCheck, Check } from 'lucide-react'
import { RichText } from '@/components/richText/RichText'

interface KeysToSuccessInteractiveProps {
  content?: any
  equationText?: string
  explanatoryParagraphs?: string[]
  pillars?: string[]
  culmination?: string
}

const DEFAULT_PILLARS = [
  'Professional Expertise',
  'Modern Technology',
  'Continuous Development',
  'Patient Trust',
  'Teamwork',
]

export function KeysToSuccessInteractive({
  content,
  equationText,
  explanatoryParagraphs = [],
  pillars,
  culmination = 'Principles of Clinical Excellence',
}: KeysToSuccessInteractiveProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [hoveredResult, setHoveredResult] = useState(false)

  // Determine formula items cleanly
  let formulaItems: string[] = pillars && pillars.length > 0 ? pillars : []
  let formulaResult = culmination

  if (formulaItems.length === 0 && equationText) {
    if (equationText.includes('=')) {
      const [left, right] = equationText.split('=')
      formulaItems = left.split('+').map((s) => s.trim()).filter(Boolean)
      if (right) formulaResult = right.replace(/\.$/, '').trim()
    } else if (equationText.includes('+')) {
      const sentences = equationText.split(/(?<=[.!?])\s+/)
      const formulaSentence = sentences.find((s) => s.includes('+')) || equationText
      let rawFormula = formulaSentence
      if (rawFormula.includes(':')) {
        rawFormula = rawFormula.split(':')[1]
      }
      rawFormula = rawFormula.replace(/\.$/, '')
      formulaItems = rawFormula
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }

  // If still empty, use the authentic 5 clinical principles
  if (formulaItems.length === 0) {
    formulaItems = DEFAULT_PILLARS
  }

  return (
    <div className="w-full space-y-12">
      {/* Desktop Convergence Architecture (hidden on screens < 1024px) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-center">
        {/* Left: The 5 Formula Pillars (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {formulaItems.map((item, idx) => {
            const isHovered = hoveredIdx === idx
            const isHighlighted = isHovered || hoveredResult

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isHighlighted
                    ? 'bg-gradient-to-r from-[#b58a48]/25 to-white/10 border-[#e1c38c] shadow-lg translate-x-2'
                    : 'bg-white/[0.04] border-[#e1c38c]/15 hover:bg-white/[0.08] hover:border-[#e1c38c]/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono text-xs font-bold w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isHighlighted
                        ? 'bg-[#e1c38c] text-[#2b2524] shadow-md'
                        : 'bg-white/10 text-[#e1c38c] group-hover:bg-[#e1c38c]/20'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className={`font-americana font-bold text-lg transition-colors ${
                      isHighlighted ? 'text-white' : 'text-[#f5f5f5]/90'
                    }`}
                  >
                    {item}
                  </span>
                </div>

                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    isHighlighted
                      ? 'border-[#e1c38c] bg-[#e1c38c] scale-125'
                      : 'border-[#e1c38c]/30 bg-transparent'
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Center: Dynamic SVG Convergence Connectors (2 cols) */}
        <div className="lg:col-span-2 h-[340px] relative flex items-center justify-center pointer-events-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 160 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {formulaItems.map((_, idx) => {
              const total = formulaItems.length
              const startY = total > 1 ? 34 + idx * ((340 - 68) / (total - 1)) : 170
              const endY = 170
              const isHighlighted = hoveredIdx === idx || hoveredResult

              return (
                <path
                  key={idx}
                  d={`M 0 ${startY} C 80 ${startY}, 80 ${endY}, 160 ${endY}`}
                  stroke={isHighlighted ? '#e1c38c' : 'rgba(225, 195, 140, 0.25)'}
                  strokeWidth={isHighlighted ? '2.5' : '1.5'}
                  strokeDasharray={isHighlighted ? 'none' : '4 4'}
                  className="transition-all duration-300"
                />
              )
            })}

            {/* Central Convergence Node */}
            <circle
              cx="160"
              cy="170"
              r={hoveredResult ? '8' : '5'}
              fill="#e1c38c"
              className="transition-all duration-300"
            />
          </svg>
        </div>

        {/* Right: The Culmination / Outcome Card (5 cols) */}
        <div
          className="lg:col-span-5"
          onMouseEnter={() => setHoveredResult(true)}
          onMouseLeave={() => setHoveredResult(false)}
        >
          <div
            className={`p-8 sm:p-10 rounded-3xl border transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[340px] group ${
              hoveredResult
                ? 'bg-gradient-to-br from-[#36302f] via-[#2b2524] to-[#1c1817] border-[#e1c38c] shadow-2xl scale-[1.02]'
                : 'bg-white/[0.05] border-[#e1c38c]/30 hover:border-[#e1c38c]/60'
            }`}
          >
            {/* Subtle Gold Background Radial Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#b58a48]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-castelar tracking-[0.25em] text-[#e1c38c] uppercase">
                <Sparkles className="w-4 h-4 text-[#e1c38c]" />
                <span>The Unified Standard</span>
              </div>

              <h3 className="font-americana text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {formulaResult}
              </h3>

              <div className="h-px w-20 bg-gradient-to-r from-[#e1c38c] to-transparent my-4" />
            </div>

            <div className="relative z-10 pt-6 border-t border-[#e1c38c]/20 flex items-center justify-between text-xs font-castelar tracking-wider text-[#e1c38c] uppercase">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e1c38c]" />
                Clinical Excellence
              </span>
              <span className="text-white/60 font-dinar text-sm tracking-normal capitalize">
                Dr. John Sevo Clinics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Convergence Stepper (hidden on screens >= 1024px) */}
      <div className="lg:hidden space-y-4">
        <div className="space-y-3">
          {formulaItems.map((item, idx) => (
            <div
              key={`mob-${idx}`}
              className="p-4 rounded-2xl bg-white/[0.05] border border-[#e1c38c]/20 flex items-center gap-3.5"
            >
              <span className="font-mono text-xs font-bold w-7 h-7 rounded-lg bg-[#e1c38c]/20 text-[#e1c38c] flex items-center justify-center flex-shrink-0">
                0{idx + 1}
              </span>
              <span className="font-americana font-bold text-base text-white">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Downward Connector Arrow */}
        <div className="flex flex-col items-center justify-center py-2 text-[#e1c38c]">
          <div className="w-0.5 h-6 bg-[#e1c38c]/40 mb-1" />
          <span className="text-xl font-bold leading-none">⇓</span>
        </div>

        {/* Mobile Culmination Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#36302f] to-[#1c1817] border border-[#e1c38c]/40 text-center space-y-3 shadow-xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-castelar tracking-widest text-[#e1c38c] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#e1c38c]" />
            <span>The Unified Standard</span>
          </div>
          <h3 className="font-americana text-2xl font-bold text-white leading-snug">
            {formulaResult}
          </h3>
        </div>
      </div>

      {/* Narrative from Doctor's Content */}
      {(content || explanatoryParagraphs.length > 0) && (
        <div className="pt-6 border-t border-[#e1c38c]/15">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-[#e1c38c]/15 space-y-3 relative overflow-hidden text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-castelar tracking-wider text-[#e1c38c] uppercase">
                <Check className="w-3.5 h-3.5 text-[#e1c38c]" />
                <span>Our Principles</span>
              </div>
              {content ? (
                <div className="font-dinar text-lg sm:text-xl text-[#f5f5f5]/90 leading-relaxed">
                  <RichText
                    data={content}
                    className="prose-invert !text-[#f5f5f5] [&_*]:!text-[#f5f5f5]"
                  />
                </div>
              ) : (
                explanatoryParagraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="font-dinar text-lg sm:text-xl text-[#f5f5f5]/90 leading-relaxed"
                  >
                    {p}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
