import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { getPostBySlug } from '@/repositories/blog'
import type { Media, Doctor } from '@/payload-types'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

export async function generateMetadata(props: BlogPostPageProps) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return { title: 'Post Not Found' }
  }
  return {
    title: `${post.title} — Dr. John Sevo Dental Clinic`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const imageUrl = getMediaUrl(post.featuredImage)
  const categoryName = typeof post.category === 'object' ? post.category?.name : null
  const author = typeof post.author === 'object' ? (post.author as Doctor) : null

  return (
    <article className="bg-[#fdfcf9] min-h-screen">
      {/* Article Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 border-b border-[rgba(54,48,47,0.08)]">
        <div className="mx-auto w-full max-w-4xl px-6 lg:px-8 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e6e4f] hover:text-[#b58a48] uppercase tracking-wider mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>

          <div className="space-y-4">
            {categoryName && (
              <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
                {categoryName}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-americana text-[#36302f] leading-[1.2] font-bold">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#706865] font-perpetua">
              {post.publishedAt && (
                <div className="flex items-center gap-1.5 text-[#8e6e4f]">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                </div>
              )}
              {author && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#8e6e4f]" />
                  <span>Written by Dr. {author.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body Section */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto w-full max-w-4xl px-6 lg:px-8">
          {imageUrl && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-[rgba(54,48,47,0.08)] relative aspect-[16/9] mb-12 bg-[#faf6f0]">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          )}

          {/* Lead Excerpt */}
          <div className="text-lg sm:text-xl font-perpetua text-[#36302f] font-medium leading-relaxed pb-8 border-b border-[rgba(54,48,47,0.08)] mb-8">
            {post.excerpt}
          </div>

          {/* Educational Content Area */}
          <div className="prose prose-lg max-w-none text-[#5a5350] font-perpetua leading-relaxed space-y-6">
            <p>
              Maintaining proper dental health requires an understanding of clinical preventative care and modern cosmetic methods. At Dr. John Sevo Dental Clinic, our medical team focuses on providing evidence-based patient guidance to empower informed decisions regarding oral aesthetics and health.
            </p>
            <p>
              For individual diagnosis and personalized treatment planning, we invite you to consult directly with our dental specialists.
            </p>
          </div>

          {/* Footer Back Link & Consultation CTA */}
          <div className="mt-16 pt-8 border-t border-[rgba(54,48,47,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e6e4f] hover:text-[#b58a48] uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>

            <Link
              href="/contact"
              className="btn rounded-xl bg-[#8e6e4f] text-white hover:bg-[#a27e5b] py-3 px-6 text-xs font-semibold shadow-sm transition-all"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
