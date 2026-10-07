import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Doctors } from './collections/Doctors'
import { Categories } from './collections/Categories'
import { BlogPosts } from './collections/BlogPosts'
import { YouTubeVideos } from './collections/YouTubeVideos'
import { Inquiries } from './collections/Inquiries'
import { Clients } from './collections/Clients'
import { Appointments } from './collections/Appointments'
import { FollowUps } from './collections/FollowUps'
import { Consultations } from './collections/Consultations'
import { Reports } from './collections/Reports'
import { EmailOutbox } from './collections/EmailOutbox'
import { Transformations } from './collections/Transformations'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Home } from './globals/Home'
import { About } from './globals/About'
import { ClinicInfo } from './globals/ClinicInfo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [Home, About, ClinicInfo],
  collections: [
    Users,
    Media,
    Services,
    Doctors,
    Categories,
    BlogPosts,
    YouTubeVideos,
    Inquiries,
    Clients,
    Appointments,
    FollowUps,
    Consultations,
    Reports,
    EmailOutbox,
    Transformations,
  ],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.FROM_EMAIL || '',
    defaultFromName: process.env.FROM_NAME || 'Dr. John Sevo Dental Clinic',
    skipVerify: !process.env.SMTP_USER || process.env.NODE_ENV === 'test',
    transportOptions: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD || '',
          }
        : undefined,
    },
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
