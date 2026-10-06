import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Play, Video, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { getBlogPosts, getCategories, getYouTubeVideos, extractYouTubeVideoId } from '@/repositories/blog'
import type { BlogPost, Category, YoutubeVideo, Media, Doctor } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Blog & Clinical Insights',
  description: 'Educational articles, clinical insights, and patient guide videos from our dental specialists.',
  alternates: {
    canonical: '/blog',
  },
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

function getMediaUrl(media?: number | Media | null): string | null {
  if (typeof media === 'object' && media?.url) {
    return media.url
  }
  return null
}

export default async function BlogPage(props: BlogPageProps) {
  const searchParams = await props.searchParams
  const categorySlug = searchParams?.category
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage

  const [categories, postsResult, videosResult] = await Promise.all([
    getCategories(),
    getBlogPosts({
      categorySlug,
      page: validPage,
      limit: 6,
    }),
    getYouTubeVideos({
      categorySlug,
      limit: 4,
    }),
  ])

  const posts = postsResult.docs
  const videos = videosResult.docs

  return (
    <div className="bg-[#fdfcf9] min-h-screen">
      {/* Page Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f7f2ec] to-[#eee5dc] pt-12 pb-16 border-b border-[rgba(54,48,47,0.08)]">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              Articles & Guides
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-americana text-[#36302f] leading-[1.15] font-bold">
              Dental Education & Media
            </h1>
          </div>

          {/* Category Filter Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-8">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !categorySlug
                    ? 'bg-[#8e6e4f] text-white shadow-sm'
                    : 'bg-white text-[#5a5350] border border-[rgba(54,48,47,0.12)] hover:border-[#b58a48]'
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    categorySlug === cat.slug
                      ? 'bg-[#8e6e4f] text-white shadow-sm'
                      : 'bg-white text-[#5a5350] border border-[rgba(54,48,47,0.12)] hover:border-[#b58a48]'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Educational Articles Section */}
      <section className="section py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-perpetua font-bold text-[#36302f]">
              Featured Articles
            </h2>
            <span className="text-xs font-perpetua text-[#706865]">
              Showing {posts.length} of {postsResult.totalDocs} articles
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
              <p className="font-perpetua text-[#706865] text-base leading-relaxed">
                Educational dental articles are currently being prepared by our specialists. Please check back shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: BlogPost) => {
                  const imageUrl = getMediaUrl(post.featuredImage)
                  const categoryName = typeof post.category === 'object' ? post.category?.name : null
                  const author = typeof post.author === 'object' ? (post.author as Doctor) : null

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="card bg-white rounded-3xl overflow-hidden border border-[rgba(54,48,47,0.08)] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-[#faf6f0] overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#b58a48]/30">
                              <Tag className="w-12 h-12" />
                            </div>
                          )}
                          {categoryName && (
                            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {categoryName}
                            </span>
                          )}
                        </div>

                        <div className="p-6 space-y-3">
                          {post.publishedAt && (
                            <div className="flex items-center gap-1.5 text-xs text-[#8e6e4f] font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                            </div>
                          )}
                          <h3 className="font-americana font-bold text-xl text-[#36302f] group-hover:text-[#b58a48] transition-colors leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-sm font-perpetua text-[#706865] leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 border-t border-[rgba(54,48,47,0.06)] mt-4 flex items-center justify-between text-xs font-semibold text-[#8e6e4f]">
                        <span>{author ? `By Dr. ${author.name}` : 'Read Full Article'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Real Bounded Pagination */}
              {postsResult.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-[rgba(54,48,47,0.08)]">
                  {postsResult.hasPrevPage && (
                    <Link
                      href={`/blog?page=${validPage - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className="px-5 py-2.5 rounded-xl border border-[rgba(54,48,47,0.15)] text-xs font-semibold text-[#5a5350] hover:text-[#36302f] hover:bg-[#faf6f0] transition-colors"
                    >
                      Previous Page
                    </Link>
                  )}
                  <span className="text-xs font-perpetua text-[#706865]">
                    Page {postsResult.page} of {postsResult.totalPages}
                  </span>
                  {postsResult.hasNextPage && (
                    <Link
                      href={`/blog?page=${validPage + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className="px-5 py-2.5 rounded-xl border border-[rgba(54,48,47,0.15)] text-xs font-semibold text-[#5a5350] hover:text-[#36302f] hover:bg-[#faf6f0] transition-colors"
                    >
                      Next Page
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Clinical Video Gallery Section */}
      <section className="section bg-[#f7f2ec] border-t border-[rgba(54,48,47,0.08)] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-[#8e6e4f] text-white flex items-center justify-center shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="font-castelar text-[10px] tracking-[0.2em] text-[#b58a48] uppercase block">
                Video Library
              </span>
              <h2 className="text-2xl sm:text-3xl font-perpetua font-bold text-[#36302f]">
                Patient Video Guides
              </h2>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[rgba(54,48,47,0.08)] shadow-sm text-center max-w-lg mx-auto">
              <p className="font-perpetua text-[#706865] text-base leading-relaxed">
                Our clinical video series is currently being produced. Certified video presentations will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((vid: YoutubeVideo) => {
                const videoId = extractYouTubeVideoId(vid.youtubeUrl)
                const thumbUrl = getMediaUrl(vid.thumbnail) || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null)

                return (
                  <a
                    key={vid.id}
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card bg-white rounded-2xl overflow-hidden border border-[rgba(54,48,47,0.08)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-video bg-black/10 overflow-hidden">
                      {thumbUrl && (
                        <Image
                          src={thumbUrl}
                          alt={vid.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#b58a48] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-perpetua font-bold text-base text-[#36302f] line-clamp-2 group-hover:text-[#b58a48] transition-colors">
                        {vid.title}
                      </h4>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
