import React from 'react'
import Image from 'next/image'
import { Cpu, HeartHandshake, Feather } from 'lucide-react'

interface PillarItem {
  title: string
  description?: string | null
  iconName?: string | null
}

interface ExperienceSectionProps {
  overviewTitle?: string | null
  overviewText?: string | null
  overviewImageUrl?: string | null
  pillars?: PillarItem[] | null
}

const defaultPillars: PillarItem[] = [
  {
    title: 'Modern Technology',
    description: 'Precision and comfort',
    iconName: 'cpu',
  },
  {
    title: 'Patient-Centered Care',
    description: 'You always come first',
    iconName: 'heart',
  },
  {
    title: 'A Calmer Experience',
    description: 'Because your comfort matters',
    iconName: 'feather',
  },
]

function getPillarIcon(iconName?: string | null, idx?: number) {
  const name = (iconName || '').toLowerCase()
  if (name.includes('cpu') || name.includes('tech') || idx === 0) {
    return <Cpu className="w-5 h-5" />
  }
  if (name.includes('heart') || name.includes('care') || idx === 1) {
    return <HeartHandshake className="w-5 h-5" />
  }
  return <Feather className="w-5 h-5" />
}

export function ExperienceSection({
  overviewTitle = 'A Better Dental Experience',
  overviewText = 'We combine advanced technology with a human touch to create a comfortable, stress-free experience. Our focus is always on you — your health, your comfort, and your smile.',
  overviewImageUrl = '/images/clinic-reception.webp',
  pillars,
}: ExperienceSectionProps) {
  const displayTitle = overviewTitle || 'A Better Dental Experience'
  const displayText = overviewText || 'We combine advanced technology with a human touch to create a comfortable, stress-free experience. Our focus is always on you — your health, your comfort, and your smile.'
  const displayImage = overviewImageUrl || '/images/clinic-reception.webp'
  const displayPillars = pillars && pillars.length > 0 ? pillars : defaultPillars

  return (
    <section id="about" className="section bg-[#f4eee7]">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Reception Image */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[rgba(255,255,255,0.7)] relative aspect-[395/215]">
              <Image
                src={displayImage}
                alt="Dr. John Sevo Clinic Reception"
                fill
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Right Story & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              More Than a Clinic
            </span>

            <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f] leading-tight">
              {displayTitle}
            </h2>

            <p className="text-[#5a5350] text-base sm:text-lg font-perpetua leading-relaxed">
              {displayText}
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[rgba(54,48,47,0.1)]">
              {displayPillars.slice(0, 3).map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8dece] flex items-center justify-center flex-shrink-0 text-[#8e6e4f]">
                    {getPillarIcon(pillar.iconName, idx)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#36302f] font-perpetua">{pillar.title}</h4>
                    {pillar.description && (
                      <p className="text-xs text-[#706865] mt-0.5">{pillar.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
