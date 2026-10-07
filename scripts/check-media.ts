import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function checkMedia() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'media',
    limit: 50,
  })
  console.log('Media in Payload:', res.totalDocs)
  res.docs.forEach((m) => {
    console.log(`- [${m.id}] ${m.filename} (${m.mimeType})`)
  })
  process.exit(0)
}

checkMedia().catch((e) => {
  console.error(e)
  process.exit(1)
})
