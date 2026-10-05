import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function migrate() {
  console.log('--- STARTING BEFORE-AFTER TO TRANSFORMATIONS MIGRATION ---')
  const payload = await getPayload({ config: configPromise })

  // 1. Read existing Home global
  const home = await payload.findGlobal({
    slug: 'home',
    depth: 0,
  })

  const oldCases = (home as any)?.beforeAfterCases || []
  const oldCount = oldCases.length
  console.log(`Old case count in Home.beforeAfterCases: ${oldCount}`)

  if (oldCount === 0) {
    console.log('No cases found in Home.beforeAfterCases to migrate.')
    process.exit(0)
  }

  // 2. Check existing transformations collection
  const existingTransformations = await payload.find({
    collection: 'transformations' as any,
    limit: 100,
    depth: 0,
  })

  console.log(`Existing transformations in collection: ${existingTransformations.totalDocs}`)

  if (existingTransformations.totalDocs === 0) {
    console.log('Migrating cases into transformations collection...')
    for (let i = 0; i < oldCases.length; i++) {
      const c = oldCases[i]
      const beforeId = typeof c.beforeImage === 'object' ? c.beforeImage.id : c.beforeImage
      const afterId = typeof c.afterImage === 'object' ? c.afterImage.id : c.afterImage

      const created = await payload.create({
        collection: 'transformations' as any,
        data: {
          title: c.title,
          beforeImage: beforeId,
          afterImage: afterId,
          description: c.description || '',
          isFeatured: true,
          displayOrder: i,
        },
      })
      console.log(`Migrated case [${i + 1}/${oldCount}]: "${c.title}" -> ID: ${created.id}`)
    }
  } else {
    console.log('Transformations collection already has documents. Verifying migration integrity...')
  }

  // 3. Verification
  const verifiedTransformations = await payload.find({
    collection: 'transformations' as any,
    limit: 100,
    depth: 1,
    sort: 'displayOrder',
  })

  const newCount = verifiedTransformations.totalDocs
  console.log(`Migrated collection count: ${newCount}`)
  console.log(`Counts matched: ${oldCount === newCount ? 'YES' : 'NO'}`)

  if (oldCount !== newCount) {
    console.error(`FATAL: Count mismatch! Expected ${oldCount}, got ${newCount}`)
    process.exit(1)
  }

  // Sample verification: first, middle, last
  const first = verifiedTransformations.docs[0]
  const middle = verifiedTransformations.docs[Math.floor(newCount / 2)]
  const last = verifiedTransformations.docs[newCount - 1]

  console.log('--- SAMPLE VERIFICATION ---')
  console.log('First case:', {
    id: first.id,
    title: first.title,
    beforeImageId: typeof first.beforeImage === 'object' ? (first.beforeImage as any).id : first.beforeImage,
    afterImageId: typeof first.afterImage === 'object' ? (first.afterImage as any).id : first.afterImage,
    description: first.description,
  })

  console.log('Middle case:', {
    id: middle.id,
    title: middle.title,
    beforeImageId: typeof middle.beforeImage === 'object' ? (middle.beforeImage as any).id : middle.beforeImage,
    afterImageId: typeof middle.afterImage === 'object' ? (middle.afterImage as any).id : middle.afterImage,
    description: middle.description,
  })

  console.log('Last case:', {
    id: last.id,
    title: last.title,
    beforeImageId: typeof last.beforeImage === 'object' ? (last.beforeImage as any).id : last.beforeImage,
    afterImageId: typeof last.afterImage === 'object' ? (last.afterImage as any).id : last.afterImage,
    description: last.description,
  })

  console.log('--- MIGRATION & VERIFICATION COMPLETED SUCCESSFULLY ---')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
