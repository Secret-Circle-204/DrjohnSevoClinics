import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home' })
  const about = await payload.findGlobal({ slug: 'about' })
  console.log('=== VERIFYING DATABASE GLOBALS ===')
  console.log('home.heroTitle:', home?.heroTitle)
  console.log('home.whyChooseTitle:', home?.whyChooseTitle)
  console.log('about.storyTitle:', about?.storyTitle)
  console.log('about.founderTitle:', about?.founderTitle)
  console.log('about.valuesTitle:', about?.valuesTitle)
  console.log('==================================')
  process.exit(0)
}

check().catch((e) => {
  console.error(e)
  process.exit(1)
})
