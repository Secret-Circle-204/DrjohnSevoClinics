'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { loadMoreTransformationsAction } from '@/app/(frontend)/actions/transformations'

export interface BeforeAfterCaseItem {
  id?: number | string
  title: string
  beforeImage: number | Media
  afterImage: number | Media
  description?: string | null
  isFeatured?: boolean | null
  displayOrder?: number | null
}

export interface BeforeAfterPaginationMeta {
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage?: boolean
}

export interface BeforeAfterSectionProps {
  cases?: BeforeAfterCaseItem[] | null
  initialCases?: BeforeAfterCaseItem[] | null
  initialPagination?: BeforeAfterPaginationMeta
}

function getImageUrl(media: number | Media | undefined | null): string | null {
  if (!media) return null
  if (typeof media === 'object') {
    if (media.url) return media.url
    if (media.filename) return `/media/${media.filename}`
  }
  return null
}

/**
 * Transformation Theatre: Interactive Reveal Before & After Showcase
 *
 * Implements a world-class, photo-first clinical comparison experience:
 * - Single large interactive comparison theatre
 * - Unified Pointer Events (Mouse, Touch, Stylus) with drag-to-reveal
 * - Discrete keyboard accessibility (Arrow keys, Home, End)
 * - Micro-thumbnail case navigation rail for bounded visible window (Constitution Sections 11–14, 48, 55)
 * - User-driven bounded window pagination without full-page reloads and zero client-state accumulation
 * - Restrained editorial typography using official clinic brand tokens
 * - Backed by scalable Transformations Collection
 */
export function BeforeAfterSection({
  cases,
  initialCases,
  initialPagination,
}: BeforeAfterSectionProps) {
  // Strictly bounded client window: holds ONLY the current visible page (never accumulates)
  const [windowCases, setWindowCases] = useState<BeforeAfterCaseItem[]>(
    () => initialCases || cases || []
  )
  const [pagination, setPagination] = useState<BeforeAfterPaginationMeta>(
    () =>
      initialPagination || {
        totalDocs: (initialCases || cases || []).length,
        totalPages: 1,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
  )
  const [isLoadingWindow, setIsLoadingWindow] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const validCases = windowCases.filter((c) => c && c.beforeImage && c.afterImage)

  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isFading, setIsFading] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const currentCase = validCases[activeCaseIndex] || validCases[0]
  const beforeUrl = getImageUrl(currentCase?.beforeImage)
  const afterUrl = getImageUrl(currentCase?.afterImage)

  // Unified pointer position calculation
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  // Pointer event handlers (Mouse, Touch, Stylus unified)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return
      updatePosition(e.clientX)
    },
    [isDragging, updatePosition]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDragging) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          // Pointer capture may have already been released
        }
        setIsDragging(false)
      }
    },
    [isDragging]
  )

  // Keyboard accessibility handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setSliderPosition((prev) => Math.max(0, prev - 5))
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setSliderPosition((prev) => Math.min(100, prev + 5))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSliderPosition(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSliderPosition(100)
    }
  }, [])

  // Case selector transition
  const handleSelectCase = useCallback(
    (index: number) => {
      if (index === activeCaseIndex) return
      setIsFading(true)
      setTimeout(() => {
        setActiveCaseIndex(index)
        setSliderPosition(50)
        setIsFading(false)
      }, 150)
    },
    [activeCaseIndex]
  )

  // User-driven bounded window pagination handler (replaces visible window; never accumulates)
  const handleNavigateWindow = useCallback(
    async (targetPage: number) => {
      if (isLoadingWindow || targetPage < 1 || targetPage > pagination.totalPages) return
      setIsLoadingWindow(true)
      setIsFading(true)
      setLoadError(null)

      try {
        const res = await loadMoreTransformationsAction(targetPage, 6)
        if (res.docs && res.docs.length > 0) {
          // Bounded window: replace the visible cases completely so memory and DOM remain O(1)
          setWindowCases(res.docs as BeforeAfterCaseItem[])
          setPagination({
            totalDocs: res.totalDocs,
            totalPages: res.totalPages,
            page: res.page,
            hasNextPage: res.hasNextPage,
            hasPrevPage: res.hasPrevPage,
          })
          setActiveCaseIndex(0)
          setSliderPosition(50)
        }
      } catch {
        setLoadError('Unable to load clinical transformations for this window. Please try again.')
      } finally {
        setIsLoadingWindow(false)
        setIsFading(false)
      }
    },
    [isLoadingWindow, pagination.totalPages]
  )

  return (
    <section id="results" className="section bg-[#fdfcf9] border-t border-b border-[rgba(54,48,47,0.08)] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="font-castelar text-xs tracking-[0.24em] text-primary-gold uppercase block mb-2 font-bold">
            Clinical Artistry & Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-perpetua font-bold text-deep-brown tracking-tight">
            Real Patient Transformations
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-3 font-perpetua leading-relaxed">
            Documented clinical before and after results demonstrating precision dentistry and bespoke smile design.
          </p>
        </div>

        {validCases.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
            <p className="font-perpetua text-text-muted text-base leading-relaxed">
              Our clinical case gallery is being curated. Certified clinical transformations will be published here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* The Theatre Frame (Interactive Comparison Showcase) */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-label="Before and after comparison slider"
              aria-valuenow={Math.round(sliderPosition)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${Math.round(sliderPosition)}% revealed`}
              className={`relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden select-none bg-neutral-900 shadow-2xl border border-[rgba(54,48,47,0.12)] cursor-ew-resize touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold focus-visible:ring-offset-2 transition-opacity duration-200 ${
                isFading ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* 1. Base Layer: Before Treatment Image */}
              {beforeUrl && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={beforeUrl}
                    alt={`${currentCase.title} - Before treatment`}
                    fill
                    priority
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 1024px) 100vw, 1152px"
                  />
                </div>
              )}

              {/* 2. Reveal Layer: After Treatment Image (Clip-path driven) */}
              {afterUrl && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    transition: isDragging ? 'none' : 'clip-path 150ms ease-out',
                    willChange: isDragging ? 'clip-path' : 'auto',
                  }}
                >
                  <Image
                    src={afterUrl}
                    alt={`${currentCase.title} - After treatment`}
                    fill
                    priority
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 1024px) 100vw, 1152px"
                  />
                </div>
              )}

              {/* 3. Restrained Minimal Dividing Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white/95 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{
                  left: `${sliderPosition}%`,
                  transition: isDragging ? 'none' : 'left 150ms ease-out',
                  willChange: isDragging ? 'left' : 'auto',
                }}
              />

              {/* 4. Elegant Minimal Handle */}
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-deep-brown border-2 border-primary-gold text-light-gold shadow-xl flex items-center justify-center pointer-events-none select-none"
                style={{
                  left: `${sliderPosition}%`,
                  transition: isDragging ? 'none' : 'left 150ms ease-out',
                  willChange: isDragging ? 'left' : 'auto',
                }}
                aria-hidden="true"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold tracking-tighter opacity-90">
                  <span>‹</span>
                  <span className="w-0.5 h-2.5 bg-light-gold rounded-full" />
                  <span>›</span>
                </div>
              </div>

              {/* 5. Subtle Floating Status Badges */}
              <div
                className="absolute bottom-3.5 left-3.5 z-10 px-3 py-1 rounded-full text-[10px] sm:text-xs font-castelar tracking-widest uppercase bg-black/50 text-white/90 backdrop-blur-md border border-white/10 select-none pointer-events-none shadow-sm"
                aria-hidden="true"
              >
                Before
              </div>

              <div
                className="absolute bottom-3.5 right-3.5 z-10 px-3 py-1 rounded-full text-[10px] sm:text-xs font-castelar tracking-widest uppercase bg-primary-gold/90 text-white backdrop-blur-md border border-light-gold/30 select-none pointer-events-none shadow-sm font-semibold"
                aria-hidden="true"
              >
                After
              </div>
            </div>

            {/* Case Identity & Editorial Typography */}
            <div className="w-full mt-6 sm:mt-8 px-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[rgba(54,48,47,0.08)] pb-6">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="font-perpetua font-bold text-2xl sm:text-3xl text-deep-brown tracking-tight">
                    {currentCase.title}
                  </h3>
                </div>
                {currentCase.description ? (
                  <p className="font-perpetua text-sm sm:text-base text-text-muted leading-relaxed">
                    {currentCase.description}
                  </p>
                ) : null}
              </div>

              <div className="flex-shrink-0 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(54,48,47,0.05)] border border-[rgba(54,48,47,0.08)] font-castelar text-xs font-bold tracking-widest text-primary-gold uppercase">
                  <span>Case</span>
                  <span>{String((pagination.page - 1) * 6 + activeCaseIndex + 1).padStart(2, '0')}</span>
                  <span className="text-text-subtle font-normal">/</span>
                  <span className="text-text-subtle font-normal">
                    {String(pagination.totalDocs).padStart(2, '0')}
                  </span>
                </span>
              </div>
            </div>

            {/* Micro-Thumbnail Case Navigation Rail (Bounded Visible Window) */}
            {validCases.length > 1 && (
              <div className="w-full mt-6 flex flex-col items-center">
                <div
                  className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap max-w-full"
                  role="tablist"
                  aria-label="Clinical cases"
                >
                  {validCases.map((item, idx) => {
                    const isActive = idx === activeCaseIndex
                    const thumbUrl = getImageUrl(item.afterImage) || getImageUrl(item.beforeImage)
                    const itemCaseNumber = (pagination.page - 1) * 6 + idx + 1

                    return (
                      <button
                        key={item.id ?? idx}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={0}
                        onClick={() => handleSelectCase(idx)}
                        className={`group relative flex items-center gap-2.5 p-1.5 rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold cursor-pointer ${
                          isActive
                            ? 'border-primary-gold bg-primary-gold/10 shadow-md scale-105'
                            : 'border-[rgba(54,48,47,0.12)] bg-white hover:border-primary-gold/50 hover:bg-neutral-50 opacity-70 hover:opacity-100'
                        }`}
                        title={item.title}
                        aria-label={`View clinical case ${itemCaseNumber}: ${item.title}`}
                      >
                        {/* Micro-thumbnail */}
                        <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-[rgba(54,48,47,0.06)]">
                          {thumbUrl && (
                            <Image
                              src={thumbUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          )}
                          <span className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[8px] font-castelar font-bold bg-black/60 text-white backdrop-blur-xs">
                            {String(itemCaseNumber).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Title preview on larger screens */}
                        <div className="hidden md:flex flex-col text-left pr-2 max-w-[130px]">
                          <span className="text-xs font-perpetua font-bold text-deep-brown truncate leading-tight">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-text-muted uppercase tracking-wider font-castelar mt-0.5">
                            Case {String(itemCaseNumber).padStart(2, '0')}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* User-Driven Bounded Window Navigation (Strictly Viewport-Bounded DOM & State) */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  {pagination.hasPrevPage && (
                    <button
                      type="button"
                      onClick={() => handleNavigateWindow(pagination.page - 1)}
                      disabled={isLoadingWindow}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(54,48,47,0.15)] bg-white hover:bg-neutral-50 text-deep-brown font-castelar text-xs font-bold tracking-[0.14em] uppercase shadow-xs transition-all duration-200 disabled:opacity-40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold"
                      aria-label="View previous cases"
                    >
                      <span className="text-primary-gold font-bold">←</span>
                      <span>Previous Cases</span>
                    </button>
                  )}

                  {pagination.hasNextPage && (
                    <button
                      type="button"
                      onClick={() => handleNavigateWindow(pagination.page + 1)}
                      disabled={isLoadingWindow}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary-gold/50 bg-white hover:bg-primary-gold/10 hover:border-primary-gold text-deep-brown font-castelar text-xs font-bold tracking-[0.14em] uppercase shadow-xs transition-all duration-200 disabled:opacity-40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold"
                      aria-label="Explore next cases"
                    >
                      {isLoadingWindow ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
                          <span>Loading Window...</span>
                        </>
                      ) : (
                        <>
                          <span>Explore Next Cases</span>
                          <span className="text-primary-gold font-bold">→</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="font-perpetua text-xs text-text-muted">
                  Showing cases {(pagination.page - 1) * 6 + 1}–{(pagination.page - 1) * 6 + validCases.length} of {pagination.totalDocs} clinical transformations (Window {pagination.page} of {pagination.totalPages})
                </p>

                {loadError && (
                  <p className="font-perpetua text-xs text-red-600 mt-1">
                    {loadError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
