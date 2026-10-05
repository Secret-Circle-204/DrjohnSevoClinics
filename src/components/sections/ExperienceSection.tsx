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

const defaultPillars: PillarItem[] = [
  {
    title: 'Advanced Dental Technologies',
    description: 'Precision diagnostic imaging, 3D scanning, and modern clinical equipment ensuring safety and comfort.',
    iconName: 'Sparkles',
  },
  {
    title: 'Comprehensive Multi-Disciplinary Care',
    description: 'All dental specialties under one roof, from cosmetic smile design and implants to orthodontics.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Rigorous Sterilization & Safety',
    description: 'Strict multi-barrier infection control protocols and hospital-grade sterilization standards.',
    iconName: 'Shield',
  },
]

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
  overviewTitle = 'About Dr. John Sevo Dawod Clinics',
  overviewText = 'Dr. John Sevo Clinics represents a distinguished benchmark in advanced dentistry and oral aesthetics. Founded on the principles of medical excellence, ethical practice, and patient-centered hospitality, the clinic brings together top-tier dental specialists, state-of-the-art diagnostic and treatment equipment, and rigorous international sterilization standards to provide exceptional care under one roof.',
  overviewImageUrl = '/images/clinic-reception.webp',
  whyChooseTitle = 'Our Strengths',
  whyChooseSubtitle = 'Why Patients Choose Dr. John Sevo Clinics',
  pillars,
}: ExperienceSectionProps) {
  const displayTitle = overviewTitle || 'About Dr. John Sevo Dawod Clinics'
  const displayText =
    overviewText ||
    'Dr. John Sevo Clinics represents a distinguished benchmark in advanced dentistry and oral aesthetics. Founded on the principles of medical excellence, ethical practice, and patient-centered hospitality, the clinic brings together top-tier dental specialists, state-of-the-art diagnostic and treatment equipment, and rigorous international sterilization standards to provide exceptional care under one roof.'
  const displayImage = overviewImageUrl || '/images/clinic-reception.webp'
  const displayWhyTitle = whyChooseTitle || 'Our Strengths'
  const displayWhySubtitle = whyChooseSubtitle || 'Why Patients Choose Dr. John Sevo Clinics'
  const displayPillars = pillars && pillars.length > 0 ? pillars : defaultPillars

  return (
    <section id="about" className="section bg-[#f4eee7] py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 space-y-16">
        {/* Top Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Reception Image */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[rgba(255,255,255,0.7)] relative aspect-[395/240]">
              <Image
                src={displayImage}
                alt="Dr. John Sevo Clinic Reception"
                fill
                priority
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Right Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              Benchmark in Modern Dentistry
            </span>

            <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f] leading-tight">
              {displayTitle}
            </h2>

            <p className="text-[#5a5350] text-base sm:text-lg font-perpetua leading-relaxed">
              {displayText}
            </p>
          </div>
        </div>

        {/* Why Choose Us / Strengths Pillars (Uncapped, renders all CMS pillars) */}
        <div className="pt-10 border-t border-[rgba(54,48,47,0.1)] space-y-8">
          <div>
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-1">
              {displayWhyTitle}
            </span>
            <h3 className="text-2xl sm:text-3xl font-perpetua font-bold text-[#36302f]">
              {displayWhySubtitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPillars.map((pillar, idx) => (
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
      </div>
    </section>
  )
}
