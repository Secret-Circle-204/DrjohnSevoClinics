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
  globals: [
    Home,
    About,
    ClinicInfo,
  ],
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
  ],
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
  plugins: [],
})
