import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'services',
    limit: 50,
  })
  console.log('Services in Payload:', res.totalDocs)
  res.docs.forEach((s) => {
    console.log(`- ${s.title} (slug: ${s.slug}, active: ${s.isActive}, order: ${s.order})`)
  })
  process.exit(0)
}

check().catch((e) => {
  console.error(e)
  process.exit(1)
})
