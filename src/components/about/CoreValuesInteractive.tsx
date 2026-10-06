'use client'

import React, { useState } from 'react'
import { Sparkles, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'

export interface CoreValueItem {
  title: string
  description?: string | null
}

interface CoreValuesInteractiveProps {
  values: CoreValueItem[]
}

export function CoreValuesInteractive({ values }: CoreValuesInteractiveProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(0)

  if (!values || values.length === 0) {
    return null
  }

  const activeValue = values[activeIndex] || values[0]

  return (
    <div className="w-full">
      {/* Desktop Editorial Interactive Layout (hidden on screens < 1024px) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Active Value Large Editorial Display (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-10 sm:p-14 border border-[rgba(54,48,47,0.1)] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Subtle Decorative Background Number */}
          <div className="absolute top-4 right-8 font-americana text-[140px] font-bold text-[#b1957b]/10 select-none pointer-events-none leading-none">
            0{activeIndex + 1}
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#b58a48] tracking-widest uppercase px-3 py-1 rounded-full bg-[#b58a48]/10 border border-[#b58a48]/20">
                Principle 0{activeIndex + 1} of 0{values.length}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#b58a48]/30 to-transparent" />
            </div>

            <h3 className="font-americana text-3xl sm:text-4xl lg:text-5xl font-bold text-[#36302f] leading-tight transition-all duration-300">
              {activeValue.title}
            </h3>

            {activeValue.description && (
              <p className="font-perpetua text-[#5a5350] text-xl sm:text-2xl leading-relaxed transition-all duration-300 pt-2">
                {activeValue.description}
              </p>
            )}
          </div>

          <div className="relative z-10 pt-8 border-t border-[rgba(54,48,47,0.08)] flex items-center justify-between text-xs font-castelar tracking-widest text-[#8e6e4f] uppercase">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#b58a48]" />
              <span>Principle 0{activeIndex + 1}</span>
            </span>
            <span className="text-[#36302f]/40 font-mono">
              [ 0{activeIndex + 1} / 0{values.length} ]
            </span>
          </div>
        </div>

        {/* Value Selector Vertical Rail (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
          {values.map((val, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={`${val.title}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-white border-[#b58a48] shadow-md -translate-x-1'
                    : 'bg-white/60 border-[rgba(54,48,47,0.08)] hover:bg-white hover:border-[#b58a48]/40'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#b58a48] text-white'
                        : 'bg-[#b58a48]/10 text-[#8e6e4f] group-hover:bg-[#b58a48]/20'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className={`font-perpetua font-bold text-lg sm:text-xl truncate transition-colors ${
                      isActive ? 'text-[#36302f]' : 'text-[#5a5350] group-hover:text-[#36302f]'
                    }`}
                  >
                    {val.title}
                  </span>
                </div>
                <ArrowRight
                  className={`w-4 h-4 transition-all flex-shrink-0 ${
                    isActive
                      ? 'text-[#b58a48] translate-x-0 opacity-100'
                      : 'text-[#36302f]/30 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile & Tablet Editorial Accordion Layout (hidden on lg and up) */}
      <div className="lg:hidden space-y-3">
        {values.map((val, idx) => {
          const isExpanded = mobileExpandedIndex === idx
          return (
            <div
              key={`mob-${val.title}-${idx}`}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white border-[#b58a48] shadow-md'
                  : 'bg-white/80 border-[rgba(54,48,47,0.08)]'
              }`}
            >
              <button
                type="button"
                onClick={() => setMobileExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center ${
                      isExpanded ? 'bg-[#b58a48] text-white' : 'bg-[#b58a48]/10 text-[#8e6e4f]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="font-perpetua font-bold text-lg text-[#36302f]">
                    {val.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#8e6e4f] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-[#b58a48]' : ''
                  }`}
                />
              </button>

              {isExpanded && val.description && (
                <div className="px-5 pb-5 pt-1 border-t border-[rgba(54,48,47,0.06)] text-base font-perpetua text-[#5a5350] leading-relaxed">
                  {val.description}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
