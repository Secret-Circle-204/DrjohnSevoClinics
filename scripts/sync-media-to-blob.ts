import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { put } from '@vercel/blob'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const mediaDir = path.resolve(projectRoot, 'media')

async function syncMedia() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('Error: BLOB_READ_WRITE_TOKEN is required to sync media to Vercel Blob.')
    process.exit(1)
  }

  // Ensure pointing to Neon
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) {
    process.env.DATABASE_URI =
      'postgresql://neondb_owner:npg_XwCit8D9gAcN@ep-fragrant-dawn-b5tjfnw8-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require'
  }

  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'media',
    limit: 100,
    pagination: false,
  })

  console.log(`Found ${res.docs.length} media records in database. Starting upload to Vercel Blob...`)

  for (const doc of res.docs) {
    const filename = doc.filename
    if (!filename) continue

    const filePath = path.join(mediaDir, filename)
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found on disk: ${filename} (ID: ${doc.id})`)
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)
    console.log(`Uploading [${doc.id}] ${filename}...`)

    const blob = await put(filename, fileBuffer, {
      access: 'public',
      token,
      contentType: doc.mimeType || undefined,
    })

    console.log(`✓ Uploaded -> ${blob.url}`)

    // Update media document URL in Neon
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        url: blob.url,
        thumbnailURL: blob.url,
      } as any,
    })
  }

  console.log('✓ All media files uploaded to Vercel Blob and synchronized in Neon!')
  process.exit(0)
}

syncMedia().catch((err) => {
  console.error('Sync failed:', err)
  process.exit(1)
})
