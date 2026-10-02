'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export function CaseRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    title?: string
    description?: string
    beforeImage?: unknown
    afterImage?: unknown
  }>()
  const title = data?.title?.trim()
  const hasImages = Boolean(data?.beforeImage && data?.afterImage)
  return (
    <div className="flex items-center justify-between w-full py-1 pr-2">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#b58a48]/10 text-[#8e6e4f] text-xs font-bold font-mono">
          #{(rowNumber ?? 0) + 1}
        </span>
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900 text-sm">
            {title ? `Clinical Case: ${title}` : `Case #${(rowNumber ?? 0) + 1}`}
          </span>
          {data?.description ? (
            <span className="text-xs text-neutral-500 truncate max-w-sm">
              {data.description}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasImages ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ 2 Photos Attached
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Photos Pending
          </span>
        )}
      </div>
    </div>
  )
}

export function PillarRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string; iconName?: string }>()
  const title = data?.title?.trim()
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-neutral-800">
        {title ? `✨ ${title}` : `Pillar #${(rowNumber ?? 0) + 1}`}
      </span>
      {data?.iconName ? (
        <span className="text-xs text-[#b58a48] font-mono">[{data.iconName}]</span>
      ) : null}
    </div>
  )
}

export function TrustStatRowLabel() {
  const { data, rowNumber } = useRowLabel<{ value?: string; label?: string }>()
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-[#b58a48]">
        {data?.value || `Stat #${(rowNumber ?? 0) + 1}`}
      </span>
      {data?.label ? (
        <span className="text-sm font-medium text-neutral-700">&mdash; {data.label}</span>
      ) : null}
    </div>
  )
}

export function CoreValueRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string; description?: string }>()
  const title = data?.title?.trim()
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-neutral-800">
        {title ? `💎 ${title}` : `Value #${(rowNumber ?? 0) + 1}`}
      </span>
      {data?.description ? (
        <span className="text-xs text-neutral-500 truncate max-w-xs">&bull; {data.description}</span>
      ) : null}
    </div>
  )
}

export function PhoneRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; number?: string }>()
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-neutral-800">{data?.label || 'Telephone'}</span>
      {data?.number ? (
        <span className="text-xs text-neutral-600 font-mono">({data.number})</span>
      ) : (
        <span className="text-xs text-neutral-400">#{ (rowNumber ?? 0) + 1 }</span>
      )}
    </div>
  )
}

export function OpeningHoursRowLabel() {
  const { data, rowNumber } = useRowLabel<{ days?: string; hours?: string }>()
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-neutral-800">{data?.days || `Schedule #${(rowNumber ?? 0) + 1}`}</span>
      {data?.hours ? (
        <span className="text-xs text-[#b58a48] font-mono">[{data.hours}]</span>
      ) : null}
    </div>
  )
}

export function SocialLinkRowLabel() {
  const { data, rowNumber } = useRowLabel<{ platform?: string; url?: string }>()
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-neutral-800">{data?.platform || `Link #${(rowNumber ?? 0) + 1}`}</span>
      {data?.url ? (
        <span className="text-xs text-neutral-500 truncate max-w-xs">&bull; {data.url}</span>
      ) : null}
    </div>
  )
}

export function QualificationRowLabel() {
  const { data, rowNumber } = useRowLabel<{ degree?: string }>()
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-neutral-800">
        {data?.degree || `Qualification #${(rowNumber ?? 0) + 1}`}
      </span>
    </div>
  )
}
