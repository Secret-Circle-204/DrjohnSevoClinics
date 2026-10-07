import { chromium } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const artifactDir = 'C:/Users/TUF A15/.gemini/antigravity-ide/brain/9c478e73-8c25-4f01-8435-6aaa608533db'

async function run() {
  const browser = await chromium.launch({ headless: true })

  // 1. Desktop Homepage Services Section (1440x900)
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const desktopPage = await desktopContext.newPage()
  await desktopPage.goto('http://localhost:3000/#services', { waitUntil: 'networkidle' })
  await desktopPage.waitForTimeout(1000)

  // Hide fixed header temporarily so element bounding box is not obscured in isolated screenshots
  await desktopPage.evaluate(() => {
    const h = document.querySelector('header')
    if (h) h.style.display = 'none'
  })

  const servicesSection = desktopPage.locator('#services')
  if ((await servicesSection.count()) > 0) {
    await servicesSection.screenshot({ path: path.join(artifactDir, 'services_home_desktop.png') })
    console.log('Saved services_home_desktop.png')
  }

  // 2. Tablet Homepage Services Section (768x1024)
  const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 } })
  const tabletPage = await tabletContext.newPage()
  await tabletPage.goto('http://localhost:3000/#services', { waitUntil: 'networkidle' })
  await tabletPage.waitForTimeout(1000)

  await tabletPage.evaluate(() => {
    const h = document.querySelector('header')
    if (h) h.style.display = 'none'
  })

  const tabletServices = tabletPage.locator('#services')
  if ((await tabletServices.count()) > 0) {
    await tabletServices.screenshot({ path: path.join(artifactDir, 'services_home_tablet.png') })
    console.log('Saved services_home_tablet.png')
  }

  // 3. Mobile Homepage Services Section (390x844) with Touch Support
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  })
  const mobilePage = await mobileContext.newPage()
  await mobilePage.goto('http://localhost:3000/#services', { waitUntil: 'networkidle' })
  await mobilePage.waitForTimeout(1000)

  await mobilePage.evaluate(() => {
    const h = document.querySelector('header')
    if (h) h.style.display = 'none'
  })

  const mobileServices = mobilePage.locator('#services')
  if ((await mobileServices.count()) > 0) {
    await mobileServices.screenshot({ path: path.join(artifactDir, 'services_home_mobile.png') })
    console.log('Saved services_home_mobile.png')

    // Perform horizontal swipe gesture (slide 1 -> slide 2)
    const imgBox = await mobileServices.locator('img').first().boundingBox()
    if (imgBox) {
      const startX = imgBox.x + imgBox.width * 0.8
      const startY = imgBox.y + imgBox.height * 0.5
      const endX = imgBox.x + imgBox.width * 0.2

      await mobilePage.mouse.move(startX, startY)
      await mobilePage.mouse.down()
      await mobilePage.mouse.move(endX, startY, { steps: 10 })
      await mobilePage.mouse.up()

      await mobilePage.waitForTimeout(600)

      await mobilePage.waitForTimeout(600)
      await mobileServices.screenshot({ path: path.join(artifactDir, 'services_home_mobile_swiped.png') })
      console.log('Saved services_home_mobile_swiped.png')
    }
  }

  // 4. Desktop Services Catalog Page (1440x900)
  const catalogPage = await desktopContext.newPage()
  await catalogPage.goto('http://localhost:3000/services', { waitUntil: 'networkidle' })
  await catalogPage.waitForTimeout(1000)
  await catalogPage.screenshot({ path: path.join(artifactDir, 'services_catalog_desktop.png'), fullPage: false })
  console.log('Saved services_catalog_desktop.png')

  // 5. Desktop Service Detail Page - Implants (1440x900)
  const detailPage = await desktopContext.newPage()
  await detailPage.goto('http://localhost:3000/services/implants', { waitUntil: 'networkidle' })
  await detailPage.waitForTimeout(1000)
  await detailPage.screenshot({ path: path.join(artifactDir, 'services_detail_desktop.png'), fullPage: false })
  console.log('Saved services_detail_desktop.png')

  // 6. Mobile Service Detail Page - Implants (390x844)
  const mobileDetailPage = await mobileContext.newPage()
  await mobileDetailPage.goto('http://localhost:3000/services/implants', { waitUntil: 'networkidle' })
  await mobileDetailPage.waitForTimeout(1000)
  await mobileDetailPage.screenshot({ path: path.join(artifactDir, 'services_detail_mobile.png'), fullPage: false })
  console.log('Saved services_detail_mobile.png')

  await browser.close()
  console.log('--- ALL SCREENSHOTS CAPTURED CLEANLY ---')
  process.exit(0)
}

run().catch((err) => {
  console.error('Screenshot error:', err)
  process.exit(1)
})
