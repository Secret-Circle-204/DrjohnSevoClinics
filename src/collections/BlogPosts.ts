import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrStaff, isPublicActive } from '../access/rbac'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'isActive'],
  },
  access: {
    read: isPublicActive,
    create: isAdminOrStaff,
    update: isAdminOrStaff,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Article Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
      label: 'Article Excerpt',
      admin: {
        description: 'Short summary for article cards and search snippets (max 300 chars).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Full Article Content',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Featured Cover Image',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Content Category',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'doctors',
      label: 'Author Doctor (Optional)',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publication Date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published on Website',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
