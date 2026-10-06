import React from 'react'
import Image from 'next/image'
import {
  Cpu,
  HeartHandshake,
  Feather,
  Sparkles,
  ShieldCheck,
  Shield,
  FileCheck,
  Gem,
  Award,
  Smile,
  CheckCircle,
} from 'lucide-react'

export interface PillarItem {
  title: string
  description?: string | null
  iconName?: string | null
}

interface ExperienceSectionProps {
  overviewTitle?: string | null
  overviewText?: string | null
  overviewImageUrl?: string | null
  whyChooseTitle?: string | null
  whyChooseSubtitle?: string | null
  pillars?: PillarItem[] | null
}

function getPillarIcon(iconName?: string | null, idx?: number) {
  const name = (iconName || '').toLowerCase()
  if (name.includes('sparkle') || name.includes('tech') || name.includes('gem')) {
    return <Sparkles className="w-5 h-5" />
  }
  if (name.includes('shieldcheck') || name.includes('multi')) {
    return <ShieldCheck className="w-5 h-5" />
  }
  if (name.includes('shield') || name.includes('safe') || name.includes('steril')) {
    return <Shield className="w-5 h-5" />
  }
  if (name.includes('heart') || name.includes('care') || name.includes('gentle')) {
    return <HeartHandshake className="w-5 h-5" />
  }
  if (name.includes('file') || name.includes('transpar')) {
    return <FileCheck className="w-5 h-5" />
  }
  if (name.includes('award') || name.includes('elite')) {
    return <Award className="w-5 h-5" />
  }
  if (name.includes('smile') || name.includes('comfort')) {
    return <Smile className="w-5 h-5" />
  }
  if (name.includes('check') || name.includes('wellness')) {
    return <CheckCircle className="w-5 h-5" />
  }
  if (name.includes('cpu')) {
    return <Cpu className="w-5 h-5" />
  }
  if (idx === 0) return <Sparkles className="w-5 h-5" />
  if (idx === 1) return <ShieldCheck className="w-5 h-5" />
  return <Feather className="w-5 h-5" />
}

export function ExperienceSection({
  overviewTitle,
  overviewText,
  overviewImageUrl,
  whyChooseTitle,
  whyChooseSubtitle,
  pillars,
}: ExperienceSectionProps) {
  const hasOverview = Boolean(overviewTitle || overviewText || overviewImageUrl)
  const hasPillars = Boolean(pillars && pillars.length > 0)

  if (!hasOverview && !hasPillars) {
    return null
  }

  return (
    <section id="about" className="section bg-[#f4eee7] py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 space-y-16">
        {/* Top Overview Grid */}
        {hasOverview && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Reception Image */}
            {overviewImageUrl ? (
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-[rgba(255,255,255,0.7)] relative aspect-[395/240]">
                  <Image
                    src={overviewImageUrl}
                    alt={overviewTitle || ''}
                    fill
                    priority
                    className="w-full h-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            ) : null}

            {/* Right Story Narrative */}
            <div className={overviewImageUrl ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
              {overviewTitle && (
                <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f] leading-tight">
                  {overviewTitle}
                </h2>
              )}

              {overviewText && (
                <p className="text-[#5a5350] text-base sm:text-lg font-perpetua leading-relaxed">
                  {overviewText}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Why Choose Us / Strengths Pillars (Renders only real CMS pillars) */}
        {hasPillars && pillars && (
          <div className={`space-y-8 ${hasOverview ? 'pt-10 border-t border-[rgba(54,48,47,0.1)]' : ''}`}>
            {(whyChooseTitle || whyChooseSubtitle) && (
              <div>
                {whyChooseTitle && (
                  <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-1">
                    {whyChooseTitle}
                  </span>
                )}
                {whyChooseSubtitle && (
                  <h3 className="text-2xl sm:text-3xl font-perpetua font-bold text-[#36302f]">
                    {whyChooseSubtitle}
                  </h3>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((pillar, idx) => (
                <div
                  key={`${pillar.title}-${idx}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/70 border border-[rgba(54,48,47,0.06)] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8dece] flex items-center justify-center flex-shrink-0 text-[#8e6e4f]">
                    {getPillarIcon(pillar.iconName, idx)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-[#36302f] font-perpetua">{pillar.title}</h4>
                    {pillar.description && (
                      <p className="text-xs sm:text-sm text-[#706865] leading-relaxed">{pillar.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
