import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function textToLexical(paragraphs: { text: string; heading?: boolean }[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => {
        if (p.heading) {
          return {
            type: 'heading',
            tag: 'h3',
            format: '' as const,
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: p.text,
                version: 1,
              },
            ],
          }
        }
        return {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: p.text,
              version: 1,
            },
          ],
        }
      }),
    },
  }
}

const rawServices = [
  {
    title: 'Scaling & Polishing',
    slug: 'scaling-and-polishing',
    shortDescription:
      'A professional cleaning procedure to eliminate stubborn plaque, tartar, and surface stains that routine brushing misses.',
    patientBenefit:
      'Protects against gum disease, freshens breath, and restores your natural, healthy shine.',
    iconName: 'Sparkles',
    order: 1,
    imageSource: 'scaling-and-polishing.jpg',
    paragraphs: [
      { text: 'Clinical Overview & Preventative Hygiene', heading: true },
      {
        text: 'Scaling & Polishing forms the core of preventative oral healthcare. Our specialized dental hygienists utilize advanced ultrasonic scalers to painlessly break down calculus deposits above and below the gumline.',
      },
      { text: 'Clinical Procedure', heading: true },
      {
        text: 'The session begins with ultrasonic debridement to safely remove hardened tartar. Next, fine hand curettes are used for micro-contouring around enamel margins. Finally, an airflow prophylaxis paste is applied to polish enamel surfaces, lifting stubborn stains from coffee, tea, and daily life while creating a glassy surface resistant to new bacterial adherence.',
      },
      { text: 'Long-Term Oral Health Impact', heading: true },
      {
        text: 'Regular scaling and polishing every six months arrests early gingivitis, reduces inflammatory gum markers, and safeguards against irreversible periodontal bone loss.',
      },
    ],
  },
  {
    title: 'Teeth Whitening',
    slug: 'teeth-whitening',
    shortDescription:
      'Advanced cosmetic whitening treatments designed to safely lift deep-set stains caused by coffee, tea, aging, or lifestyle habits.',
    patientBenefit:
      'Instantly brightens your smile and boosts your confidence with a quick, noninvasive procedure.',
    iconName: 'Smile',
    order: 2,
    imageSource: 'teeth-whitening.jpg',
    paragraphs: [
      { text: 'Cosmetic Brilliance with Enamel Protection', heading: true },
      {
        text: 'Our in-clinic whitening protocols combine medical-grade hydrogen peroxide formulations with controlled phototherapy light activation to penetrate micro-porosities in tooth enamel and break down chromogen molecules.',
      },
      { text: 'The In-Office Experience', heading: true },
      {
        text: 'Before whitening, a protective gingival barrier is placed to shield sensitive gum tissues. The specialized whitening gel is applied in controlled 15-minute cycles, actively dissolving deep organic pigments without stripping enamel minerals. Desensitizing potassium nitrate and fluoride agents are applied immediately afterward to ensure a comfortable recovery.',
      },
      { text: 'Noticeable Results', heading: true },
      {
        text: 'Patients achieve between 4 to 8 shades of lightening in a single clinical visit, providing a natural, radiant smile with zero enamel degradation.',
      },
    ],
  },
  {
    title: 'Implants',
    slug: 'implants',
    shortDescription:
      'The gold standard in permanent tooth replacement, utilizing a biocompatible titanium post topped with a custom crown to replace missing roots and teeth.',
    patientBenefit:
      'Looks, feels, and functions completely naturally while protecting your underlying jawbone structure.',
    iconName: 'Award',
    order: 3,
    imageSource: 'implants.jpg',
    paragraphs: [
      { text: 'Permanent Tooth Replacement & Osseointegration', heading: true },
      {
        text: 'Dental implants provide the most biologically compatible and durable solution for missing teeth. By replacing the tooth root with a medical-grade titanium or zirconia fixture, implants stimulate jawbone density and prevent bone resorption.',
      },
      { text: 'Precision Guided Surgical Placement', heading: true },
      {
        text: 'Using 3D CBCT digital imaging and computer-guided surgical guides, Dr. John Sevo meticulously positions each implant fixture with sub-millimeter precision. After osseointegration, a custom abutment and monolithic zirconia crown are secured, perfectly matching surrounding natural dentition in shade, translucency, and bite geometry.',
      },
      { text: 'Lifetime Longevity', heading: true },
      {
        text: 'With proper oral hygiene and routine maintenance, dental implants offer a 98% clinical success rate and can serve as a lifelong replacement for natural teeth.',
      },
    ],
  },
  {
    title: 'Restorative Treatment',
    slug: 'restorative-treatment',
    shortDescription:
      'Precision repair for decayed, chipped, or fractured teeth using durable, tooth-colored materials that blend seamlessly into your smile.',
    patientBenefit:
      'Stops decay progression, restores full chewing function, and preserves your natural tooth structure.',
    iconName: 'ShieldCheck',
    order: 4,
    imageSource: 'restorative-treatment.jpg',
    paragraphs: [
      { text: 'Micro-Invasive Restorative Dentistry', heading: true },
      {
        text: 'Our restorative philosophy prioritizes preserving healthy natural tooth structure. We utilize state-of-the-art adhesive technology and multi-layered nano-hybrid composite resins to reconstruct damaged enamel and dentin.',
      },
      { text: 'Seamless Aesthetic Integration', heading: true },
      {
        text: 'Carrying out restoration under rubber dam isolation ensures zero moisture contamination. Resin shades are layered incrementally, mimicking natural dentin opacity and enamel translucency. The final restoration is carved with anatomical cusp contours and polished to a lifelike luster.',
      },
      { text: 'Functional Recovery', heading: true },
      {
        text: 'Restored teeth immediately regain full masticatory strength, thermal stability, and complete protection against secondary bacterial ingress.',
      },
    ],
  },
  {
    title: 'Crowns and Bridges',
    slug: 'crowns-and-bridges',
    shortDescription:
      'Custom-crafted protective caps (crowns) to strengthen weakened teeth, or fixed prosthetics (bridges) to bridge the gap left by missing teeth.',
    patientBenefit:
      'Restores bite alignment, protects vulnerable teeth, and prevents surrounding teeth from shifting.',
    iconName: 'Layers',
    order: 5,
    imageSource: 'crowns-and-bridges.jpg',
    paragraphs: [
      { text: 'Fixed Prosthodontics & Structural Protection', heading: true },
      {
        text: 'When a tooth is severely cracked, worn, or structurally compromised following endodontic treatment, full-coverage crowns provide 360-degree reinforcement. Fixed bridges anchor to adjacent prepared teeth or implants to seamlessly bridge edentulous gaps.',
      },
      { text: 'Digital Scanning & Monolithic Zirconia', heading: true },
      {
        text: 'We eliminate uncomfortable impression trays by utilizing intraoral digital scanners. High-resolution 3D optical scans are sent to premier dental laboratories for precision CAD/CAM milling of ultra-strong monolithic zirconia or E.max lithium disilicate.',
      },
      { text: 'Perfect Fit and Occlusion', heading: true },
      {
        text: 'Crowns and bridges are permanently bonded with dual-cure resin cements, restoring natural occlusal harmony, speech phonetics, and chewing comfort.',
      },
    ],
  },
  {
    title: 'Root Canal Treatment',
    slug: 'root-canal-treatment',
    shortDescription:
      'A gentle endodontic procedure that removes infected or inflamed pulp from inside the tooth, thoroughly cleans the canal, and seals it.',
    patientBenefit:
      'Instantly relieves severe tooth pain, clears infection, and saves your natural tooth from extraction.',
    iconName: 'Shield',
    order: 6,
    imageSource: 'root-canal-treatment.jpg',
    paragraphs: [
      { text: 'Modern Endodontics & Tooth Preservation', heading: true },
      {
        text: 'A common misconception is that root canals are painful; in modern dentistry, they are the very procedure that eliminates severe pain. When deep bacterial caries reach the pulp chamber, endodontic therapy saves the natural tooth root.',
      },
      { text: 'Rotary Instrumentation & Laser Disinfection', heading: true },
      {
        text: 'Under profound local anesthesia and dental dam isolation, our specialists employ flexible nickel-titanium rotary files and apex locators to trace and debride complex canal anatomy. Irrigating solutions and ultrasonic agitation sterilize the root canal system to zero bacterial load.',
      },
      { text: 'Biocompatible Hermetic Seal', heading: true },
      {
        text: 'Canals are obturated with warm biocompatible gutta-percha and bioceramic sealers, providing a hermetic seal that prevents reinfection and extends the tooth lifespan for decades.',
      },
    ],
  },
  {
    title: 'Surgical and Non-Surgical Extractions',
    slug: 'extractions',
    shortDescription:
      'Safe and gentle removal of teeth when they are severely damaged, decayed, impacted (such as wisdom teeth), or crowding the mouth.',
    patientBenefit:
      'Eliminates chronic discomfort, stops infection spread, and paves the way for healthier future alignment.',
    iconName: 'Clock',
    order: 7,
    imageSource: 'extractions.jpg',
    paragraphs: [
      { text: 'Gentle Oral Surgery & Atraumatic Techniques', heading: true },
      {
        text: 'When a tooth is non-restorable due to severe trauma, unrestorable fracture, or problematic impaction (such as third molars), our oral surgery protocols prioritize bone preservation and patient comfort.',
      },
      { text: 'Minimally Invasive Atraumatic Extraction', heading: true },
      {
        text: 'Using micro-periotomes and piezoelectric surgical instruments, teeth are gently luxated and sectioned without damaging the delicate surrounding buccal bone plate. This atraumatic approach dramatically accelerates healing and preserves bone contours for future implant placement.',
      },
      { text: 'Post-Operative Recovery Protocols', heading: true },
      {
        text: 'Patients receive platelet-rich fibrin (PRF) socket preservation when indicated, alongside detailed post-operative guidance to ensure comfortable, swelling-free recovery within days.',
      },
    ],
  },
  {
    title: 'Removable Dentures',
    slug: 'removable-dentures',
    shortDescription:
      'Custom-designed full or partial removable appliances crafted to replace multiple missing teeth and restore facial volume.',
    patientBenefit:
      'Offers a reliable, comfortable, and cost-effective solution to regain full speaking and eating capabilities.',
    iconName: 'Smile',
    order: 8,
    imageSource: 'removable-dentures.jpg',
    paragraphs: [
      { text: 'Removable Prosthetics & Facial Aesthetics', heading: true },
      {
        text: 'For patients missing multiple teeth or full arches, modern removable dentures provide functional mastication and crucial structural support for the lips and facial musculature, reversing sunken facial appearance.',
      },
      { text: 'Precision Custom Fabrication', heading: true },
      {
        text: 'Through detailed dynamic jaw registration and anatomical border molding, our prosthodontists design lightweight acrylic or cobalt-chromium framework dentures that fit the unique contours of the oral mucosa with maximum stability.',
      },
      { text: 'Implant-Retained Overdentures', heading: true },
      {
        text: 'We also offer implant-supported overdentures (locator attachments), providing locked-in snap stability that eliminates slipping, adhesive pastes, and speech impairment.',
      },
    ],
  },
  {
    title: 'Pediatric Dentistry',
    slug: 'pediatric-dentistry',
    shortDescription:
      'Specialized, gentle, and fun dental care tailored specifically for infants, children, and teenagers to protect their growing smiles.',
    patientBenefit:
      'Builds early positive habits, prevents early childhood cavities, and monitors proper jaw and permanent tooth development.',
    iconName: 'HeartHandshake',
    order: 9,
    imageSource: 'pediatric-dentistry.jpg',
    paragraphs: [
      { text: 'Child-Centered Care in a Comforting Environment', heading: true },
      {
        text: 'Building positive associations with the dentist during childhood sets the foundation for lifelong oral health. Our clinic provides a welcoming, anxiety-free setting designed to make young patients feel relaxed and valued.',
      },
      { text: 'Preventative Pediatric Protocols', heading: true },
      {
        text: 'Treatments include gentle dental exams, mineralizing fluoride varnish applications, and protective dental sealants that coat the deep grooves of newly erupted molars to shield against cavity-causing bacteria.',
      },
      { text: 'Developmental Growth Guidance', heading: true },
      {
        text: 'We closely monitor jaw arch development, primary tooth shedding sequences, and emerging orthodontic needs to guide growing smiles toward healthy, harmonious alignment.',
      },
    ],
  },
  {
    title: 'Braces',
    slug: 'braces',
    shortDescription:
      'Time-tested traditional orthodontic solutions utilizing high-quality metal or ceramic brackets and wires to correct bite issues and straighten teeth.',
    patientBenefit:
      'Corrects complex misalignments for a beautifully balanced smile and long-term oral health.',
    iconName: 'Zap',
    order: 10,
    imageSource: 'braces.jpg',
    paragraphs: [
      { text: 'Comprehensive Orthodontic Realignment', heading: true },
      {
        text: 'Orthodontics goes beyond aesthetics; properly aligned teeth prevent abnormal enamel wear, alleviate temporomandibular joint (TMJ) strain, and make daily oral hygiene significantly easier.',
      },
      { text: 'Advanced Bracket Systems', heading: true },
      {
        text: 'We utilize low-profile self-ligating metal brackets and tooth-colored polycrystalline ceramic brackets. Coupled with thermal nickel-titanium archwires that activate at body temperature, forces are applied gently and continuously, reducing patient soreness.',
      },
      { text: 'Treatment Predictability', heading: true },
      {
        text: 'Our orthodontic specialists oversee each milestone with personalized adjustments, transforming complex crowding, spacing, and crossbites into a symmetrical, confident smile.',
      },
    ],
  },
  {
    title: 'Invisalign',
    slug: 'invisalign',
    shortDescription:
      'A modern, virtually invisible orthodontic system using a series of clear, removable aligners to straighten teeth discreetly.',
    patientBenefit:
      'Completely removable for easy eating and cleaning, offering a sleek, metal-free aesthetic.',
    iconName: 'Eye',
    order: 11,
    imageSource: 'invisalign.jpg',
    paragraphs: [
      { text: 'Discreet Orthodontic Innovation', heading: true },
      {
        text: 'Invisalign represents the cutting edge of adult and teen orthodontics. Utilizing custom-manufactured SmartTrack medical-grade thermoplastic aligners, teeth are gently nudged into position without brackets or wires.',
      },
      { text: '3D ClinCheck Digital Treatment Plan', heading: true },
      {
        text: 'Your journey starts with a high-definition 3D digital scan. Using proprietary ClinCheck software, Dr. John Sevo maps out the exact movement of every individual tooth, allowing you to preview your projected final smile before treatment even begins.',
      },
      { text: 'Freedom and Lifestyle Flexibility', heading: true },
      {
        text: 'Aligners are removed during meals and daily brushing, meaning zero dietary restrictions and optimal gum health throughout your entire orthodontic transformation.',
      },
    ],
  },
]

async function seed() {
  console.log('--- SEEDING REAL CLINIC SERVICES ---')
  const payload = await getPayload({ config: configPromise })

  // 1. Process and upload real clinic images
  const mediaMap = new Map<string, number>()

  for (const s of rawServices) {
    if (!s.imageSource) continue
    if (mediaMap.has(s.imageSource)) continue

    const candidatePaths = [
      path.join(projectRoot, 'public', 'images', 'services', s.imageSource),
      path.join(projectRoot, 'public', 'images', s.imageSource),
      path.join(projectRoot, 'media', s.imageSource),
    ]

    const foundPath = candidatePaths.find((p) => fs.existsSync(p))
    if (!foundPath) {
      console.log(`Image not found on disk: ${s.imageSource}, skipping upload.`)
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(foundPath)
      const ext = path.extname(foundPath).toLowerCase()
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'

      // Check if media with same filename already exists
      const existingMedia = await payload.find({
        collection: 'media',
        where: {
          filename: { equals: path.basename(foundPath) },
        },
        limit: 1,
      })

      if (existingMedia.docs.length > 0) {
        mediaMap.set(s.imageSource, existingMedia.docs[0].id)
        console.log(`Existing media found for ${s.imageSource}: ID ${existingMedia.docs[0].id}`)
      } else {
        const createdMedia = await (payload.create as any)({
          collection: 'media',
          data: {
            alt: `${s.title} - Dr. John Sevo Dental Clinic`,
          },
          file: {
            data: fileBuffer,
            name: path.basename(foundPath),
            mimetype: mimeType,
            size: fileBuffer.length,
          },
        })
        mediaMap.set(s.imageSource, createdMedia.id)
        console.log(`Uploaded new media for ${s.imageSource}: ID ${createdMedia.id}`)
      }
    } catch (err) {
      console.error(`Failed to upload media for ${s.imageSource}:`, err)
    }
  }

  // 2. Insert or update services
  for (const s of rawServices) {
    const existing = await payload.find({
      collection: 'services',
      where: {
        slug: { equals: s.slug },
      },
      limit: 1,
    })

    const mediaId = s.imageSource ? mediaMap.get(s.imageSource) : undefined
    const lexicalContent = textToLexical(s.paragraphs)

    const serviceData = {
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      patientBenefit: s.patientBenefit,
      description: lexicalContent,
      iconName: s.iconName,
      order: s.order,
      isActive: true,
      featuredImage: mediaId || undefined,
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data: serviceData,
      })
      console.log(`Updated service: ${s.title}`)
    } else {
      await payload.create({
        collection: 'services',
        data: serviceData,
      })
      console.log(`Created service: ${s.title}`)
    }
  }

  console.log('--- ALL 11 SERVICES SEEDED SUCCESSFULLY ---')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Fatal seeding error:', err)
  process.exit(1)
})
