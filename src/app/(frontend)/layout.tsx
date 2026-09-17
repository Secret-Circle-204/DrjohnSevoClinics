import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getClinicInfo } from '@/repositories/clinic'
import './styles.css'

export const metadata = {
  description: 'Dr. John Sevo Dental Clinic — Advanced Dental Care & Aesthetics',
  title: 'Dr. John Sevo Dental Clinic',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const clinicInfo = await getClinicInfo()

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col surface-light-neutral text-deep-brown selection:bg-[var(--color-primary-gold)] selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer clinicInfo={clinicInfo} />
      </body>
    </html>
  )
}
