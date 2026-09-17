import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

export interface BeforeAfterCaseItem {
  title: string
  beforeImage: number | Media
  afterImage: number | Media
  description?: string | null
}

interface BeforeAfterSectionProps {
  cases?: BeforeAfterCaseItem[] | null
}

function getImageUrl(media: number | Media): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

export function BeforeAfterSection({ cases }: BeforeAfterSectionProps) {
  const validCases = cases?.filter(c => c && c.beforeImage && c.afterImage) || []

  return (
    <section id="results" className="section bg-[#fdfcf9] border-t border-b border-[rgba(54,48,47,0.08)]">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block mb-2">
            Clinical Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f]">
            Real Patient Transformations
          </h2>
          <p className="text-sm sm:text-base text-[#706865] mt-2 font-perpetua">
            Documented before and after results demonstrating our personalized dental artistry.
          </p>
        </div>

        {validCases.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
            <p className="font-perpetua text-[#706865] text-base leading-relaxed">
              Our clinical case gallery is being curated. Certified clinical transformations will be published here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validCases.map((item, idx) => {
              const beforeUrl = getImageUrl(item.beforeImage)
              const afterUrl = getImageUrl(item.afterImage)

              return (
                <div
                  key={idx}
                  className="card bg-white rounded-3xl overflow-hidden border border-[rgba(54,48,47,0.08)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="grid grid-cols-2 gap-1.5 p-3 bg-[#faf6f0]">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-[rgba(54,48,47,0.06)] bg-neutral-100">
                      {beforeUrl ? (
                        <Image
                          src={beforeUrl}
                          alt={`${item.title} - Before`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : null}
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider">
                        Before
                      </span>
                    </div>

                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#b58a48]/30 bg-neutral-100 ring-1 ring-[#b58a48]/20">
                      {afterUrl ? (
                        <Image
                          src={afterUrl}
                          alt={`${item.title} - After`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : null}
                      <span className="absolute bottom-2 left-2 bg-[#b58a48] text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
                        After
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-perpetua font-bold text-lg text-[#36302f] mb-1">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-xs text-[#706865] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
