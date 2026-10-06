import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Compass,
  Heart,
  ShieldCheck,
  Quote,
  Sparkles,
} from 'lucide-react'
import { getAboutContent, getHomeContent, getMedicalTeam, getClinicInfo } from '@/repositories/clinic'
import { RichText } from '@/components/richText/RichText'
import { ChapterNav } from '@/components/about/ChapterNav'
import { CoreValuesInteractive } from '@/components/about/CoreValuesInteractive'
import { KeysToSuccessInteractive } from '@/components/about/KeysToSuccessInteractive'
import { extractSectionsFromLexical } from '@/lib/lexicalSections'
import type { Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'About Us | John Sevo Clinics',
  description: 'The story, clinical philosophy, specialized medical team, and guiding principles of John Sevo Clinics.',
  alternates: {
    canonical: '/about',
  },
}

function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

export default async function AboutPage() {
  const [aboutContent, homeContent, doctorsResult, clinicInfo] = await Promise.all([
    getAboutContent(),
    getHomeContent(),
    getMedicalTeam({ limit: 12 }),
    getClinicInfo(),
  ])

  const storyImageUrl = getMediaUrl(aboutContent?.storyImage)
  const doctors = doctorsResult.docs
  const coreValues = aboutContent?.coreValues || []
  const strengths = homeContent?.whyChooseItems || []

  // Extract structured sections from experienceNarrative (Lexical richText) with zero duplication
  const narrativeSections = extractSectionsFromLexical(aboutContent?.experienceNarrative)

  const philosophySection =
    narrativeSections['ourphilosophy'] ||
    Object.values(narrativeSections).find((s) => s.title.toLowerCase().includes('philosophy'))

  const keysToSuccessSection =
    narrativeSections['keystooursuccess'] ||
    narrativeSections['keystosuccess'] ||
    Object.values(narrativeSections).find((s) => s.title.toLowerCase().includes('success'))

  const rdSection =
    narrativeSections['researchdevelopment'] ||
    narrativeSections['research'] ||
    Object.values(narrativeSections).find(
      (s) => s.title.toLowerCase().includes('research') || s.title.toLowerCase().includes('development')
    )

  const humanCapitalSection =
    narrativeSections['humancapital'] ||
    Object.values(narrativeSections).find((s) => s.title.toLowerCase().includes('human'))

  return (
    <div className="bg-[#f5f5f5] text-[#36302f] min-h-screen selection:bg-[#b58a48] selection:text-white">
      {/* Editorial Chapter Navigation (Desktop Rail & Mobile Bar) */}
      <ChapterNav />

      {/* =========================================================================
          PROLOGUE / HERO SECTION — CINEMATIC EDITORIAL INTRO
          Surface: Deep Brand Abstract Texture
          ========================================================================= */}
      <section
        id="chapter-prologue"
        className="surface-deep-abstract relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-[#e1c38c]/20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#36302f]/80 via-transparent to-[#36302f]/95 pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#e1c38c]/30 text-xs font-castelar tracking-[0.25em] text-[#e1c38c] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#e1c38c]" />
              <span>{clinicInfo?.clinicName || 'John Sevo Clinics'}</span>
            </div>

            {aboutContent?.storyTitle ? (
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-americana font-bold text-[#f5f5f5] leading-[1.08] tracking-tight">
                {aboutContent.storyTitle}
              </h1>
            ) : null}

            {aboutContent?.storySummary ? (
              <p className="font-perpetua text-xl sm:text-2xl text-[#f5f5f5]/85 leading-relaxed max-w-2xl pt-2">
                {aboutContent.storySummary}
              </p>
            ) : aboutContent?.positioning ? (
              <p className="font-perpetua text-xl sm:text-2xl text-[#f5f5f5]/85 leading-relaxed max-w-2xl pt-2">
                {aboutContent.positioning}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 01 — A WORD FROM THE FOUNDER
          Surface: Clean Content Surface (bg-white)
          Composition: Asymmetrical Portrait + Large Typographic Quote
          ========================================================================= */}
      {aboutContent?.founderQuote ? (
        <section
          id="chapter-founder"
          className="section surface-content border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-3xl mb-12">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block mb-3">
                Founder&apos;s Message
              </span>
              {aboutContent.founderTitle ? (
                <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                  {aboutContent.founderTitle}
                </h2>
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Founder Portrait Frame */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#b1957b]/30 aspect-[4/5] bg-[#faf6f0] group">
                  <Image
                    src={storyImageUrl || '/images/hero-doctor.webp'}
                    alt={aboutContent.founderName || ''}
                    fill
                    priority
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#36302f]/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    {aboutContent.founderName ? (
                      <h3 className="font-americana text-xl sm:text-2xl font-bold text-[#f5f5f5]">
                        {aboutContent.founderName}
                      </h3>
                    ) : null}
                    {aboutContent.founderRole ? (
                      <p className="font-castelar text-xs tracking-widest text-[#e1c38c] uppercase">
                        {aboutContent.founderRole}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Editorial Quote Block */}
              <div className="lg:col-span-7 space-y-8">
                <div className="text-[#b58a48]/20 select-none">
                  <Quote className="w-20 h-20 -mb-6" />
                </div>

                <blockquote className="font-perpetua text-2xl sm:text-3xl lg:text-4xl text-[#36302f] leading-snug italic font-normal">
                  &ldquo;{aboutContent.founderQuote}&rdquo;
                </blockquote>

                {(aboutContent.founderName || aboutContent.founderRole) && (
                  <div className="pt-6 border-t border-[rgba(54,48,47,0.1)] flex items-center justify-between">
                    <div>
                      {aboutContent.founderName ? (
                        <p className="font-americana text-lg font-bold text-[#36302f]">
                          {aboutContent.founderName}
                        </p>
                      ) : null}
                      {aboutContent.founderRole ? (
                        <p className="font-perpetua text-sm text-[#8e6e4f] tracking-wide">
                          {aboutContent.founderRole}
                        </p>
                      ) : null}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#faf6f0] border border-[#b58a48]/20 flex items-center justify-center text-[#b58a48]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* =========================================================================
          CHAPTER 02 — THE PHILOSOPHY
          Surface: Soft Neutral (bg-[#f7f2ec])
          Composition: Typography-Led Editorial Statement & Narrative
          ========================================================================= */}
      {philosophySection ? (
        <section
          id="chapter-philosophy"
          className="section surface-soft-neutral border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block">
                Our Philosophy
              </span>

              {philosophySection.title ? (
                <h2 className="text-3xl sm:text-5xl font-americana font-bold text-[#36302f] leading-tight">
                  {philosophySection.title}
                </h2>
              ) : null}

              {philosophySection.paragraphs.length > 0 && (
                <div className="pt-4">
                  <p className="font-perpetua text-2xl sm:text-3xl lg:text-3xl text-[#36302f] leading-relaxed italic max-w-3xl mx-auto">
                    &ldquo;{philosophySection.paragraphs[0]}&rdquo;
                  </p>
                </div>
              )}

              {philosophySection.paragraphs.length > 1 && (
                <>
                  <div className="w-24 h-0.5 bg-[#b58a48]/40 mx-auto my-6" />
                  <div className="space-y-4 max-w-2xl mx-auto text-left">
                    {philosophySection.paragraphs.slice(1).map((p, idx) => (
                      <p key={idx} className="font-perpetua text-lg text-[#5a5350] leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* =========================================================================
          CHAPTER 03 — ABOUT JOHN SEVO CLINICS
          Surface: Warm Brand Tint (bg-[#ede5dc])
          Composition: Image-Led History + Foundation Milestones
          ========================================================================= */}
      {(aboutContent?.storyContent || storyImageUrl) && (
        <section
          id="chapter-clinics"
          className="section surface-warm-tint border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-3xl mb-12">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block mb-3">
                About Our Clinics
              </span>
              {aboutContent?.storyTitle ? (
                <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                  {aboutContent.storyTitle}
                </h2>
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                {aboutContent?.storyContent && (
                  <div className="font-perpetua text-lg sm:text-xl text-[#4a4340] leading-relaxed space-y-4">
                    <RichText data={aboutContent.storyContent} />
                  </div>
                )}
              </div>

              {/* Framed Clinic Image */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#b1957b]/40 relative aspect-[4/3] bg-[#faf6f0] group">
                  <Image
                    src={storyImageUrl || '/images/clinic-reception.webp'}
                    alt={aboutContent?.storyTitle || ''}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#36302f]/70 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 04 — THE VISION
          Surface: Deep Brand Surface (surface-deep-abstract / bg-[#36302f])
          Composition: Immersive High-Contrast Cinematic Statement
          ========================================================================= */}
      {aboutContent?.vision && (
        <section
          id="chapter-vision"
          className="section surface-deep-abstract border-b border-[#e1c38c]/20 relative py-20 lg:py-28"
        >
          <div className="container relative z-10">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-castelar text-xs tracking-[0.25em] text-[#e1c38c] uppercase">
                  Our Vision
                </span>
                <div className="h-px w-16 bg-[#e1c38c]/40" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-americana font-bold text-[#f5f5f5] leading-tight">
                The Vision
              </h2>

              <p className="font-perpetua text-2xl sm:text-3xl lg:text-4xl text-[#f5f5f5]/90 leading-relaxed font-light pt-2">
                &ldquo;{aboutContent.vision}&rdquo;
              </p>

              <div className="pt-2 text-xs font-castelar tracking-widest text-[#e1c38c] uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#e1c38c]" />
                <span>Strategic Horizon</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 05 — THE MISSION
          Surface: Light Neutral (bg-[#fdfcf9])
          Composition: Distinct Scale, Warm Bordered Editorial Card
          ========================================================================= */}
      {aboutContent?.mission && (
        <section
          id="chapter-mission"
          className="section surface-light-neutral border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-4xl space-y-6">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block">
                Our Mission
              </span>

              <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                The Mission
              </h2>

              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(54,48,47,0.1)] shadow-md space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#eee5d8] flex items-center justify-center text-[#b58a48]">
                  <Heart className="w-6 h-6" />
                </div>

                <p className="font-perpetua text-2xl sm:text-3xl text-[#36302f] leading-relaxed">
                  {aboutContent.mission}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 06 — CORE VALUES
          Surface: Soft Brand-Tinted (bg-[#faf6f0])
          Composition: Interactive Editorial System (Active Showcase + Selector Rail)
          ========================================================================= */}
      {coreValues.length > 0 && (
        <section
          id="chapter-values"
          className="section surface-soft-neutral border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-3xl mb-12">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block mb-3">
                Our Core Values
              </span>
              {aboutContent?.valuesTitle ? (
                <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                  {aboutContent.valuesTitle}
                </h2>
              ) : null}
            </div>

            <CoreValuesInteractive values={coreValues} />
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 07 — STRENGTHS
          Surface: Clean Content Surface (bg-white)
          Source: Home.whyChooseItems (Single Source of Truth, Zero Duplication)
          Composition: Oversized Typographic Numerals (01-09) + Thin Separators
          ========================================================================= */}
      {strengths.length > 0 && (
        <section
          id="chapter-strengths"
          className="section surface-content border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-3xl mb-14">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block mb-3">
                Our Strengths
              </span>
              {homeContent?.whyChooseTitle ? (
                <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                  {homeContent.whyChooseTitle}
                </h2>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {strengths.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="p-8 rounded-3xl bg-[#faf6f0]/60 border border-[rgba(54,48,47,0.08)] shadow-sm hover:shadow-md hover:bg-white transition-all space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-3xl font-bold text-[#b1957b]/60 group-hover:text-[#b58a48] transition-colors block">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <h3 className="font-americana font-bold text-xl text-[#36302f]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-perpetua text-base text-[#5a5350] leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-[rgba(54,48,47,0.06)] flex items-center justify-end">
                    <Sparkles className="w-3.5 h-3.5 text-[#b58a48] opacity-60 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 08 — KEYS TO SUCCESS
          Surface: Deep Brand Surface (bg-[#2b2524] text-white)
          Composition: The Integrated Formula / Equation Flow
          ========================================================================= */}
      {keysToSuccessSection && (
        <section
          id="chapter-success"
          className="section bg-[#2b2524] text-white border-b border-[#e1c38c]/15 relative py-20 lg:py-28"
        >
          <div className="container">
            <div className="max-w-3xl mb-12">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#e1c38c] uppercase block mb-3">
                Keys to Our Success
              </span>
              {keysToSuccessSection.title ? (
                <h2 className="text-3xl sm:text-5xl font-americana font-bold text-[#f5f5f5]">
                  {keysToSuccessSection.title}
                </h2>
              ) : null}
            </div>

            {keysToSuccessSection.paragraphs.length > 0 && (
              <KeysToSuccessInteractive
                equationText={keysToSuccessSection.paragraphs[0]}
                explanatoryParagraphs={keysToSuccessSection.paragraphs.slice(1)}
              />
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 09 — RESEARCH & DEVELOPMENT
          Surface: Soft Neutral (bg-[#f7f2ec])
          Composition: Clinical Precision & Digital Workflows Focus
          ========================================================================= */}
      {rdSection && (
        <section
          id="chapter-rd"
          className="section surface-soft-neutral border-b border-[rgba(54,48,47,0.08)] relative"
        >
          <div className="container">
            <div className="max-w-3xl mb-12">
              <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block mb-3">
                Research &amp; Development
              </span>
              {rdSection.title ? (
                <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                  {rdSection.title}
                </h2>
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                {rdSection.paragraphs.map((p, idx) => (
                  <p key={idx} className="font-perpetua text-lg sm:text-xl text-[#4a4340] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Treatment Environment Imagery */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-[rgba(54,48,47,0.1)] relative aspect-[4/3] bg-[#faf6f0]">
                  <Image
                    src="/images/booking-chair.webp"
                    alt={rdSection.title || ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#36302f]/70 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHAPTER 10 — HUMAN CAPITAL
          Surface: Light Neutral (bg-[#fdfcf9])
          Composition: Narrative Statement + Verified Doctors Collection Grid
          ========================================================================= */}
      <section
        id="chapter-team"
        className="section surface-light-neutral border-b border-[rgba(54,48,47,0.08)] relative"
      >
        <div className="container">
          <div className="max-w-3xl mb-12">
            <span className="font-castelar text-xs tracking-[0.25em] text-[#b58a48] uppercase block mb-3">
              Specialized Medical Team
            </span>
            {humanCapitalSection?.title ? (
              <h2 className="text-3xl sm:text-4xl font-americana font-bold text-[#36302f]">
                {humanCapitalSection.title}
              </h2>
            ) : null}

            {humanCapitalSection?.paragraphs && humanCapitalSection.paragraphs.length > 0 && (
              <p className="font-perpetua text-xl text-[#5a5350] leading-relaxed mt-4">
                {humanCapitalSection.paragraphs[0]}
              </p>
            )}
          </div>

          {/* Doctors Grid from CMS */}
          {doctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
              <p className="font-perpetua text-[#706865] text-base leading-relaxed">
                Medical team credentials and specialist profiles are currently being updated in our clinical directory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => {
                const photoUrl = getMediaUrl(doctor.photo)
                return (
                  <div
                    key={doctor.id}
                    className="card bg-white rounded-3xl overflow-hidden border border-[rgba(54,48,47,0.08)] shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="relative aspect-[4/5] bg-[#faf6f0] overflow-hidden">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={doctor.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#b58a48]">
                          <Award className="w-16 h-16 opacity-30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#36302f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        {doctor.title && (
                          <span className="font-castelar text-[10px] tracking-wider text-[#b58a48] uppercase block mb-1">
                            {doctor.title}
                          </span>
                        )}
                        <h3 className="font-americana font-bold text-xl text-[#36302f]">
                          {doctor.name}
                        </h3>
                      </div>

                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div className="pt-3 border-t border-[rgba(54,48,47,0.06)] space-y-1">
                          {doctor.qualifications.map((q, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#706865]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#8e6e4f] flex-shrink-0" />
                              <span>{q.degree}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 11 — POSITIONING (BRAND FINALE)
          Surface: Deep Brand Finale (surface-deep-abstract)
          Composition: High-Impact Typography Statement & Consultation CTA
          ========================================================================= */}
      {aboutContent?.positioning ? (
        <section
          id="chapter-positioning"
          className="section surface-deep-abstract border-b border-[#e1c38c]/20 relative py-24 lg:py-32 overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#36302f] via-transparent to-[#36302f]/80 pointer-events-none" />

          <div className="container relative z-10 max-w-4xl mx-auto space-y-8">
            <span className="font-castelar text-xs tracking-[0.3em] text-[#e1c38c] uppercase block">
              Strategic Positioning &amp; Promise
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-americana font-bold text-[#f5f5f5] leading-tight max-w-3xl mx-auto">
              {aboutContent.positioning}
            </h2>

            <div className="w-20 h-0.5 bg-[#e1c38c]/50 mx-auto" />

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn inline-flex items-center gap-3 rounded-full bg-[#b58a48] text-white hover:bg-[#c69a58] py-4 px-8 text-sm font-semibold tracking-wider uppercase transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="btn inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f5f5f5] border border-white/20 py-4 px-8 text-sm font-semibold tracking-wider uppercase transition-all"
              >
                <span>Our Services</span>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
