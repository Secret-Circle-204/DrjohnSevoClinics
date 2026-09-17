import React from 'react'
import { Users, Star, Award, HeartHandshake } from 'lucide-react'

interface StatItem {
  value: string
  label: string
  icon: React.ReactNode
}

const stats: StatItem[] = [
  {
    value: '5,000+',
    label: 'Happy Patients',
    icon: <Users className="w-6 h-6 text-[#E1C38C]" />,
  },
  {
    value: '4.9/5',
    label: 'Patient Satisfaction',
    icon: <Star className="w-6 h-6 text-[#E1C38C] fill-[#E1C38C]" />,
  },
  {
    value: '15+',
    label: 'Years of Experience',
    icon: <Award className="w-6 h-6 text-[#E1C38C]" />,
  },
  {
    value: '100%',
    label: 'Commitment to Care',
    icon: <HeartHandshake className="w-6 h-6 text-[#E1C38C]" />,
  },
]

export function TrustStatsSection() {
  return (
    <section className="relative section surface-deep-abstract text-white overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 text-center relative z-10">
        <span className="font-castelar text-xs tracking-[0.22em] text-[#E1C38C] uppercase block mb-2">
          Real People. Real Smiles.
        </span>
        <h2 className="text-3xl sm:text-4xl font-perpetua text-white font-bold mb-3">
          Trusted by Our Patients
        </h2>
        <p className="font-perpetua text-base sm:text-lg text-neutral-300 max-w-xl mx-auto mb-12 leading-relaxed">
          We are proud to be part of thousands of smiles and stories.
        </p>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-[#b58a48]/60 bg-black/20 flex items-center justify-center mb-3 text-[#E1C38C]">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold font-americana text-white">{stat.value}</div>
              <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
