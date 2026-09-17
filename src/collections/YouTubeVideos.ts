import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrStaff, isPublicActive } from '../access/rbac'

export const YouTubeVideos: CollectionConfig = {
  slug: 'youtube-videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'isActive'],
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
      label: 'Video Title',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      label: 'YouTube Video URL',
      admin: {
        description: 'Full YouTube watch link (e.g. https://www.youtube.com/watch?v=...)',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom Thumbnail Cover (Optional)',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Topic Category',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Visible on Website',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
