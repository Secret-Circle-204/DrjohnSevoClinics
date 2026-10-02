import React from 'react'
import { Users, Star, Award, HeartHandshake, Shield, Clock } from 'lucide-react'

export interface TrustStatItem {
  value: string
  label: string
  iconKey?: 'users' | 'star' | 'award' | 'heartHandshake' | 'shield' | 'clock' | string | null
}

interface TrustStatsSectionProps {
  stats?: TrustStatItem[] | null
}

function getStatIcon(iconKey?: string | null) {
  switch (iconKey) {
    case 'users':
      return <Users className="w-6 h-6 text-[#E1C38C]" />
    case 'award':
      return <Award className="w-6 h-6 text-[#E1C38C]" />
    case 'heartHandshake':
      return <HeartHandshake className="w-6 h-6 text-[#E1C38C]" />
    case 'shield':
      return <Shield className="w-6 h-6 text-[#E1C38C]" />
    case 'clock':
      return <Clock className="w-6 h-6 text-[#E1C38C]" />
    case 'star':
    default:
      return <Star className="w-6 h-6 text-[#E1C38C] fill-[#E1C38C]" />
  }
}

export function TrustStatsSection({ stats }: TrustStatsSectionProps) {
  // If stats array is empty or undefined, render non-promissory verified clinical commitments
  const displayStats: TrustStatItem[] =
    stats && stats.length > 0
      ? stats
      : [
          {
            value: '100%',
            label: 'Sterilization & Safety',
            iconKey: 'shield',
          },
          {
            value: 'Multi-Specialty',
            label: 'Comprehensive Care',
            iconKey: 'award',
          },
          {
            value: 'State-of-the-Art',
            label: 'Digital Diagnostics',
            iconKey: 'star',
          },
          {
            value: 'Patient-Centered',
            label: 'Personalized Plans',
            iconKey: 'heartHandshake',
          },
        ]

  return (
    <section className="relative section surface-deep-abstract text-white overflow-hidden py-16">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 text-center relative z-10">
        <span className="font-castelar text-xs tracking-[0.22em] text-[#E1C38C] uppercase block mb-2">
          Clinical Excellence & Trust
        </span>
        <h2 className="text-3xl sm:text-4xl font-perpetua text-white font-bold mb-3">
          Our Commitment to Every Patient
        </h2>
        <p className="font-perpetua text-base sm:text-lg text-neutral-300 max-w-xl mx-auto mb-12 leading-relaxed">
          Excellence in modern dentistry, uncompromising safety protocols, and personalized care.
        </p>

        {/* Dynamic Stats Grid */}
        <div className={`grid grid-cols-2 ${displayStats.length >= 4 ? 'md:grid-cols-4' : `md:grid-cols-${displayStats.length}`} gap-8`}>
          {displayStats.map((stat, idx) => (
            <div key={`${stat.label}-${idx}`} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-[#b58a48]/60 bg-black/20 flex items-center justify-center mb-3 text-[#E1C38C]">
                {getStatIcon(stat.iconKey)}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-americana text-white">{stat.value}</div>
              <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
