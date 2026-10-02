import React from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

export interface RichTextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  className?: string
}

/**
 * Universal Lexical RichText Renderer.
 * Bridges Payload CMS Lexical JSON structures into branded semantic HTML.
 */
export function RichText({ data, className = '' }: RichTextProps) {
  if (!data || !data.root) return null

  return (
    <div className={`prose prose-lg max-w-none text-[#5a5350] font-perpetua leading-relaxed ${className}`}>
      <LexicalRichText data={data} />
    </div>
  )
}
