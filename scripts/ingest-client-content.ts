import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textToLexical(paragraphs: { text: string; heading?: boolean }[]): any {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => {
        if (p.heading) {
          return {
            type: 'heading',
            tag: 'h3',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            children: [
              {
                mode: 'normal',
                text: p.text,
                type: 'text',
                style: '',
                detail: 0,
                format: 1, // bold
                version: 1,
              },
            ],
          }
        }
        return {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              mode: 'normal',
              text: p.text,
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
        }
      }),
    },
  }
}

async function ingest() {
  console.log('Starting Phase 11 Client Content Ingestion...')
  const payload = await getPayload({ config })

  // 1. Ingest Home Page Content
  const homeData = await payload.findGlobal({ slug: 'home' })

  const whyChooseItems = [
    {
      title: 'Advanced Dental Technologies',
      description:
        'Equipped with state-of-the-art diagnostic imaging, 3D digital scanning, and modern clinical equipment ensuring precision, safety, and optimal patient outcomes.',
      iconName: 'Sparkles',
    },
    {
      title: 'Comprehensive Multi-Disciplinary Care',
      description:
        'Providing a complete spectrum of dental specialties under one roof, from cosmetic smile design and dental implants to orthodontics and restorative dentistry.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Rigorous Sterilization & Safety Protocols',
      description:
        'Strict adherence to international multi-barrier infection control protocols, hospital-grade sterilization procedures, and uncompromising patient safety standards.',
      iconName: 'Shield',
    },
    {
      title: 'Painless & Gentle Clinical Approach',
      description:
        'Modern pain-management technologies, delicate clinical techniques, and compassionate communication designed to eliminate dental anxiety.',
      iconName: 'HeartHandshake',
    },
    {
      title: 'Transparent Treatment Planning',
      description:
        'Clear explanations, comprehensive diagnostic reviews, and collaborative treatment plans with absolute honesty and no unexpected surprises.',
      iconName: 'FileCheck',
    },
    {
      title: 'Personalized Aesthetic Excellence',
      description:
        'Custom-tailored smile designs harmonizing natural facial features with durable, authentic cosmetic dentistry.',
      iconName: 'Gem',
    },
    {
      title: 'Elite Medical Team & Specialization',
      description:
        'Highly qualified dental consultants and continuous professional training maintaining global clinical best practices.',
      iconName: 'Award',
    },
    {
      title: 'Comfort-Centered Clinical Environment',
      description:
        'A calming, modern clinic ambiance designed to make every step of your appointment serene, welcoming, and relaxed.',
      iconName: 'Smile',
    },
    {
      title: 'Long-Term Oral Wellness & Follow-Up',
      description:
        'Dedicated post-treatment follow-up and preventive guidance ensuring lasting clinical results and healthy smiles for years to come.',
      iconName: 'CheckCircle',
    },
  ]

  const trustStats = [
    {
      value: '100%',
      label: 'Sterilization & Safety',
      iconKey: 'shield' as const,
    },
    {
      value: 'Multi-Specialty',
      label: 'Comprehensive Care',
      iconKey: 'award' as const,
    },
    {
      value: 'State-of-the-Art',
      label: 'Digital Diagnostics',
      iconKey: 'star' as const,
    },
    {
      value: 'Personalized',
      label: 'Patient-First Focus',
      iconKey: 'heartHandshake' as const,
    },
  ]

  await payload.updateGlobal({
    slug: 'home',
    data: {
      heroBadge: homeData.heroBadge || 'A Healthier Smile. A Brighter You.',
      heroTitle: homeData.heroTitle || 'Expert Dental Care for a Healthier, Happier You',
      heroSubtitle: homeData.heroSubtitle || 'Modern dentistry. Personalized care. A more confident you.',
      whyChooseTitle: 'Our Strengths',
      whyChooseSubtitle: 'Why Patients Choose Dr. John Sevo Clinics',
      whyChooseItems,
      trustStats: homeData.trustStats && homeData.trustStats.length > 0 ? homeData.trustStats : trustStats,
      ctaHeadline: homeData.ctaHeadline || 'Ready to Experience Exceptional Dental Care?',
      ctaSubtitle:
        homeData.ctaSubtitle ||
        'Schedule your consultation today with Dr. John Sevo and begin your journey toward a healthy, radiant smile.',
    },
  })
  console.log('✓ Home global updated successfully with real client pillars.')

  // 2. Ingest About Page Content
  const coreValues = [
    {
      title: 'Patient First',
      description:
        "Every decision, treatment plan, and protocol begins with the patient's comfort, well-being, and individual needs at the heart of our practice.",
    },
    {
      title: 'Clinical Excellence',
      description:
        'We uphold the highest medical standards, precision, and clinical rigor across every dental discipline we offer.',
    },
    {
      title: 'Trust & Transparency',
      description:
        'Honest communication, transparent treatment options, and mutual trust form the cornerstone of every patient relationship.',
    },
    {
      title: 'Continuous Development',
      description:
        'We continuously upgrade our clinical knowledge, attend global conferences, and master modern dental breakthroughs.',
    },
    {
      title: 'Innovation',
      description:
        'Equipped with leading-edge digital dentistry, pain-free systems, and modern diagnostic technologies.',
    },
    {
      title: 'Teamwork',
      description:
        'A synchronized multidisciplinary team working together with shared passion and collective responsibility.',
    },
    {
      title: 'Integrity',
      description:
        "Uncompromising ethical standards, complete honesty, and genuine dedication to our patients' best interests.",
    },
  ]

  const storyLexical = textToLexical([
    {
      text: 'Dr. John Sevo Clinics represents a distinguished benchmark in advanced dentistry and oral aesthetics. Founded on the principles of medical excellence, ethical practice, and patient-centered hospitality, the clinic brings together top-tier dental specialists, state-of-the-art diagnostic and treatment equipment, and rigorous international sterilization standards to provide exceptional care under one roof.',
    },
    {
      text: 'Every smile tells a story, and our mission is to ensure every patient receives the precision, compassion, and clinical mastery required to achieve optimal oral health and natural facial harmony.',
    },
  ])

  const experienceLexical = textToLexical([
    { text: 'Our Philosophy', heading: true },
    {
      text: 'At Dr. John Sevo Clinics, we believe a confident smile begins with honest, precise, and compassionate care. Dentistry is not merely a clinical procedure — it is an art of enhancing confidence and an absolute commitment to improving quality of life. We integrate advanced clinical expertise with the latest dental technologies to deliver comprehensive, painless, and sustainable results.',
    },
    { text: 'Keys to Our Success', heading: true },
    {
      text: 'Our continued growth and patient trust stem from three enduring principles: unwavering clinical rigor, continuous investment in cutting-edge dental equipment, and building authentic, long-term relationships with every individual who entrusts us with their smile.',
    },
    { text: 'Research, Innovation & Human Capital', heading: true },
    {
      text: 'We maintain an active commitment to evidence-based dental practices, embracing digital dentistry workflows, 3D printing, and advanced biocompatible materials. Our multidisciplinary team undergoes continuous international training, ensuring our patients benefit from the latest worldwide advances in cosmetic and restorative dentistry.',
    },
  ])

  await payload.updateGlobal({
    slug: 'about',
    data: {
      storyTitle: 'About Dr. John Sevo Dawod Clinics',
      storySummary:
        'Dr. John Sevo Clinics represents a distinguished benchmark in advanced dentistry and oral aesthetics. Founded on the principles of medical excellence, ethical practice, and patient-centered hospitality, the clinic brings together top-tier dental specialists, state-of-the-art diagnostic and treatment equipment, and rigorous international sterilization standards to provide exceptional care under one roof.',
      storyContent: storyLexical,
      founderTitle: 'A Word from the Founder',
      founderQuote:
        'Since the beginning, our journey has been driven by a single purpose: to transform dental care from an intimidating experience into a journey of confidence, comfort, and real change.\n\nAt Dr. John Sevo Clinics, we believe every smile tells a story. That is why we are committed to providing the highest standards of quality, utilizing modern technology, and ensuring every patient receives the care, precision, and attention they deserve.\n\nOur goal has never been just treating teeth — it is about restoring smiles, renewing self-esteem, and building lasting relationships based on trust and excellence.\n\nThank you for choosing us to be a part of your smile.',
      founderName: 'Dr. John Sevo Dawod',
      founderRole: 'Founder & Medical Director',
      mission:
        'To provide comprehensive, state-of-the-art dental care with empathy, clinical precision, and the highest standards of safety and comfort — empowering our patients with healthy, beautiful smiles and renewed confidence through personalized treatment experiences.',
      vision:
        'To be the benchmark of excellence and the premier destination for advanced, aesthetic, and compassionate dentistry in the region, recognized for exceptional clinical outcomes, pioneering innovation, and an unwavering commitment to patient well-being.',
      positioning:
        'Modern Dentistry. Professional Care. Trusted Experience.\n\nPositioning Dr. John Sevo Clinics as a premier dental center offering advanced dental and cosmetic treatments with exceptional care and patient satisfaction.',
      valuesTitle: 'Our Core Values',
      coreValues,
      experienceNarrative: experienceLexical,
    },
  })
  console.log('✓ About global updated successfully with real client pillars, founder quote, values, and narrative.')

  console.log('Phase 11 Client Content Ingestion Complete!')
  process.exit(0)
}

ingest().catch((err) => {
  console.error('Ingestion error:', err)
  process.exit(1)
})
