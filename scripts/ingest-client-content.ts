import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

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

async function ingest() {
  console.log('--- STARTING CLIENT CONTENT INGESTION ---')
  const payload = await getPayload({ config: configPromise })

  // 1. Ingest Home Page Why Choose Us Reasons
  const whyChooseItems = [
    {
      title: 'Advanced Technology',
      description:
        'State-of-the-art equipment for precise, comfortable, and efficient treatments.',
      iconName: 'Cpu',
    },
    {
      title: 'Expert Team',
      description:
        'Highly skilled dental professionals dedicated to your individual oral health goals.',
      iconName: 'Award',
    },
    {
      title: 'Patient-Centric Comfort',
      description:
        'A warm, welcoming environment designed to eliminate dental anxiety.',
      iconName: 'Smile',
    },
    {
      title: 'Comprehensive Care',
      description:
        'Everything from routine preventative hygiene to advanced full-mouth restorations under one roof.',
      iconName: 'ShieldCheck',
    },
  ]

  // The 9 Real Clinical Strengths belonging to About
  const clinicalStrengths = [
    {
      title: 'Multidisciplinary Clinical Expertise',
      description:
        'A comprehensive team covering all dental specialties under one roof, ensuring integrated and accurate treatment planning.',
      iconName: 'Award',
    },
    {
      title: 'Advanced Diagnostic & Digital Technologies',
      description:
        'Equipped with state-of-the-art 3D imaging, digital scanners, and modern clinical tools for maximum precision and patient comfort.',
      iconName: 'Sparkles',
    },
    {
      title: 'Individualized Patient-First Care',
      description:
        'Every treatment plan is customized to each patient’s unique health profile, lifestyle goals, and aesthetic expectations.',
      iconName: 'Heart',
    },
    {
      title: 'Transparent Treatment Planning',
      description:
        'Clear, detailed explanations of clinical options, timelines, and costs so you can make confident, informed healthcare decisions.',
      iconName: 'FileText',
    },
    {
      title: 'Comprehensive Dental Services',
      description:
        'Full-spectrum oral healthcare from general dentistry and preventive care to complex surgical rehabilitation and cosmetic makeovers.',
      iconName: 'Layers',
    },
    {
      title: 'Continuous Professional Development',
      description:
        'Our clinical staff regularly trains in modern evidence-based techniques and global dental breakthroughs to maintain international standards.',
      iconName: 'GraduationCap',
    },
    {
      title: 'Strict Hospital-Grade Sterilization Protocols',
      description:
        'Uncompromising infection control standards and sterilization systems ensuring a safe, hygienic environment for every visit.',
      iconName: 'ShieldCheck',
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
      heroBadge: 'A Healthier Smile. A Brighter You.',
      heroTitle: 'Expert Dental Care for a Healthier, Happier You',
      heroSubtitle: 'Modern dentistry. Personalized care. A more confident you.',
      whyChooseTitle: 'Why Choose Us?',
      whyChooseItems,
      trustStats,
      ctaHeadline: 'Ready to Experience Exceptional Dental Care?',
      ctaSubtitle:
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
      text: 'Dr. John Sevo Dawod Clinics Group was established in 2013 with the vision of creating a trusted dental healthcare brand that combines professional expertise with modern dentistry.',
    },
    {
      text: 'Over the years, the group has continued to grow, expanding its presence while maintaining the same commitment to quality, patient care, and continuous development.',
    },
    {
      text: 'Our clinics provide a comprehensive range of dental services supported by modern equipment, digital technologies, and a professional dental team.',
    },
  ])

  const philosophyLexical = textToLexical([
    {
      text: 'Our philosophy is built around patient-centered dentistry. We believe that successful dental care combines clinical expertise, modern technology, precise diagnosis, continuous development, and genuine care for every patient. Every treatment plan is designed according to the individual needs, expectations, and long-term oral health of each patient.',
    },
  ])

  const keysToSuccessLexical = textToLexical([
    {
      text: 'Our success is built on several essential principles: Professional Expertise + Modern Technology  Continuous Development  Patient Trust  Teamwork.',
    },
    {
      text: 'We believe that technology alone does not create excellent dentistry. The real difference comes from combining advanced technology with experienced professionals, accurate diagnosis, proper treatment planning, and genuine patient care.',
    },
  ])

  const rdLexical = textToLexical([
    {
      text: 'We believe that dentistry is constantly evolving. Our approach is based on continuous learning and keeping up with developments in dental materials, clinical techniques, digital dentistry, diagnostic technologies, and modern treatment protocols. We continuously evaluate new technologies and techniques to determine how they can improve the quality, precision, efficiency, and patient experience within our clinics.',
    },
  ])

  const humanCapitalLexical = textToLexical([
    {
      text: 'Our team is one of the most important assets of Dr. John Sevo Dawod Clinics. We believe that investing in people is essential to delivering consistent and high-quality patient care. Our professional team works together across different dental specialties, supported by continuous education, clinical experience, teamwork, and a shared commitment to our patients.',
    },
  ])

  await payload.updateGlobal({
    slug: 'about',
    data: {
      storyTitle: 'About Dr. John Sevo Dawod Clinics',
      storySummary:
        'Dr. John Sevo Dawod Clinics Group was established in 2013 with the vision of creating a trusted dental healthcare brand that combines professional expertise with modern dentistry. Over the years, the group has continued to grow, expanding its presence while maintaining the same commitment to quality, patient care, and continuous development.',
      storyContent: storyLexical,
      founderTitle: 'A Word from the Founder',
      founderQuote:
        'Since the establishment of our first clinic in 2013, our goal has always been clear: to provide every patient with high-quality dental care in a professional, comfortable, and trustworthy environment.\n\nFor us, dentistry is not only about treating teeth; it is about understanding our patients, earning their trust, and creating healthy, confident smiles that last.\n\nWe continuously invest in modern dental technologies, advanced clinical techniques, and the development of our team to ensure that our patients receive care that meets the highest professional standards.',
      founderName: 'Dr. John Sevo Dawod',
      founderRole: 'Founder & Medical Director',
      mission:
        'To deliver high-quality, patient-centered dental care through clinical expertise, advanced technology, continuous education, and a commitment to safety, precision, and patient satisfaction.',
      vision:
        'To become one of the leading and most trusted dental healthcare groups in Egypt, recognized for clinical excellence, advanced technology, patient experience, and continuous innovation.',
      positioning:
        'Modern Dentistry. Professional Care. Trusted Experience.\n\nDr. John Sevo Dawod Clinics is positioned as a modern, professional dental healthcare group that combines clinical expertise with advanced technology and a strong focus on patient experience.\n\nOur goal is to create a dental environment where patients feel safe, understood, and confident throughout their treatment journey.',
      valuesTitle: 'Our Core Values',
      coreValues,
      philosophyContent: philosophyLexical,
      keysToSuccessContent: keysToSuccessLexical,
      keysToSuccessCulmination: 'Principles of Clinical Excellence',
      keysToSuccessPillars: [
        { title: 'Professional Expertise' },
        { title: 'Modern Technology' },
        { title: 'Continuous Development' },
        { title: 'Patient Trust' },
        { title: 'Teamwork' },
      ],
      strengthsTitle: 'Our Strengths',
      clinicalStrengths,
      rdContent: rdLexical,
      humanCapitalContent: humanCapitalLexical,
    },
  })
  console.log(
    '✓ About global updated successfully with real client pillars, founder quote, values, and narrative.',
  )

  console.log('Phase 11 Client Content Ingestion Complete!')
  process.exit(0)
}

ingest().catch((err) => {
  console.error('Ingestion error:', err)
  process.exit(1)
})
