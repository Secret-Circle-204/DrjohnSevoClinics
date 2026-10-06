import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface ClinicLogoProps {
  className?: string
  variant?:
    | 'default'
    | 'emblem-only'
    | 'text-only'
    | 'full-dark-text'
    | 'light'
    | 'light-vertecal'
    | 'badge'
  height?: number
  clinicName?: string | null
}

export function ClinicLogo({ className = '', variant = 'default', height = 70, clinicName }: ClinicLogoProps) {
  // Determine which SVG asset to load based on variant
  let src = '/logos/logo-gold-dark-text.svg'
  let aspectRatio = 80.97 / 104.87 // ≈ 0.772

  if (variant === 'emblem-only') {
    src = '/logos/logo-emblem-gold.svg'
    aspectRatio = 80.97 / 83 // ≈ 0.975
  } else if (variant === 'text-only') {
    src = '/logos/logo-gold-dark-text-only.svg'
    aspectRatio = 81 / 16.5 // ≈ 4.909
  } else if (variant === 'light') {
    src = '/logos/logo-gold-and-wihte.svg'
    aspectRatio = 80.97 / 104.87
  } else if (variant === 'light-vertecal') {
    src = '/logos/logo-gold-and-wihte-vertecal.svg'
    aspectRatio = 270.1 / 95.3 // Exact SVG viewBox 0 0 270.1 95.3
  } else if (variant === 'badge') {
    src = '/logos/logo-with-grediant-brown-bg.svg'
    aspectRatio = 149.76 / 167.04
  }

  const width = Math.round(height * aspectRatio)

  return (
    <Link
      href="/"
      aria-label={clinicName ? `${clinicName} Home` : 'Home'}
      className={`inline-flex items-center justify-center no-underline group transition-transform duration-200 hover:scale-105 ${className}`}
    >
      <Image
        src={src}
        alt={clinicName || ''}
        width={width}
        height={height}
        priority
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain transition-transform duration-300"
      />
    </Link>
  )
}
