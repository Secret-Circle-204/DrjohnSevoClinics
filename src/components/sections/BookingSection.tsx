"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Calendar as CalendarIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { submitInquiryAction } from '@/app/(frontend)/actions/inquiries'
import type { Service } from '@/payload-types'

interface BookingSectionProps {
  availableServices?: Service[]
  ctaHeadline?: string | null
  ctaSubtitle?: string | null
}

export function BookingSection({
  availableServices = [],
  ctaHeadline,
  ctaSubtitle,
}: BookingSectionProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening' | ''>('')
  const [message, setMessage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus(null)

    const serviceId = selectedService && !isNaN(Number(selectedService))
      ? Number(selectedService)
      : undefined

    const res = await submitInquiryAction({
      fullName,
      email,
      phone,
      service: serviceId,
      preferredDate: selectedDate ? selectedDate.toISOString() : undefined,
      preferredTime: preferredTime ? preferredTime : undefined,
      message: message || undefined,
    })

    setIsSubmitting(false)
    setSubmissionStatus({
      success: res.success,
      message: res.message,
    })

    if (res.success) {
      setFullName('')
      setEmail('')
      setPhone('')
      setSelectedService('')
      setSelectedDate(undefined)
      setPreferredTime('')
      setMessage('')
    }
  }

  return (
    <section id="booking" className="section bg-[#f7f2ec] border-t border-b border-[rgba(54,48,47,0.08)] relative overflow-hidden">
      {/* Subtle Logo Watermark Background */}
      <div className="absolute left-0 bottom-0 -translate-x-1/4 translate-y-1/4 pointer-events-none opacity-15 select-none z-0">
        <Image
          src="/logos/logo-watermark-opacity-39.svg"
          alt=""
          width={450}
          height={500}
          className="w-[380px] h-auto object-contain"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-castelar text-xs tracking-[0.22em] text-[#b58a48] uppercase block">
              Appointment Inquiry
            </span>

            {ctaHeadline ? (
              <h2 className="text-3xl sm:text-4xl font-perpetua font-bold text-[#36302f] leading-tight">
                {ctaHeadline}
              </h2>
            ) : null}

            {ctaSubtitle ? (
              <p className="text-[#5a5350] font-perpetua text-base sm:text-lg leading-relaxed">
                {ctaSubtitle}
              </p>
            ) : null}
          </div>

          {/* Right Booking Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[rgba(54,48,47,0.08)] shadow-xl">
              {submissionStatus?.success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#faf6f0] border border-[#b58a48]/30 flex items-center justify-center mx-auto text-[#b58a48]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-perpetua font-bold text-[#36302f]">
                    Request Received
                  </h3>
                  <p className="text-sm text-[#706865] max-w-md mx-auto leading-relaxed">
                    {submissionStatus.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmissionStatus(null)}
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl border border-[rgba(54,48,47,0.15)] text-xs font-semibold text-[#5a5350] hover:text-[#36302f] hover:bg-[#faf6f0] transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submissionStatus && !submissionStatus.success && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{submissionStatus.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullname" className="block text-xs font-semibold text-[#5a5350] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-[rgba(54,48,47,0.15)] focus:border-[#b58a48] focus:outline-none focus:ring-1 focus:ring-[#b58a48] text-sm text-[#36302f] bg-[#fcfbf9] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#5a5350] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-[rgba(54,48,47,0.15)] focus:border-[#b58a48] focus:outline-none focus:ring-1 focus:ring-[#b58a48] text-sm text-[#36302f] bg-[#fcfbf9] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-[#5a5350] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-[rgba(54,48,47,0.15)] focus:border-[#b58a48] focus:outline-none focus:ring-1 focus:ring-[#b58a48] text-sm text-[#36302f] bg-[#fcfbf9] transition-colors"
                      />
                    </div>

                    {/* Service selection */}
                    <div>
                      <label htmlFor="service-trigger" className="block text-xs font-semibold text-[#5a5350] mb-1.5">
                        Service
                      </label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger
                          id="service-trigger"
                          className="w-full h-11 px-3.5 rounded-xl border border-[rgba(54,48,47,0.15)] bg-[#fcfbf9] text-sm text-[#36302f] focus:ring-1 focus:ring-[#b58a48] focus:border-[#b58a48] focus:outline-none"
                        >
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[rgba(54,48,47,0.1)] rounded-xl shadow-xl z-50">
                          {availableServices && availableServices.length > 0 ? (
                            availableServices.map((svc) => (
                              <SelectItem
                                key={svc.id}
                                value={String(svc.id)}
                                className="hover:bg-[#faf6f0] focus:bg-[#faf6f0] cursor-pointer"
                              >
                                {svc.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled className="text-neutral-400">
                              No services currently available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5a5350] mb-1.5">
                        Preferred Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "w-full h-11 px-3.5 rounded-xl border border-[rgba(54,48,47,0.15)] bg-[#fcfbf9] text-sm text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-[#b58a48] focus:border-[#b58a48]",
                              !selectedDate && "text-[#706865]"
                            )}
                          >
                            <span>{selectedDate ? format(selectedDate, 'MM/dd/yyyy') : 'mm/dd/yyyy'}</span>
                            <CalendarIcon className="w-4 h-4 text-[#8e6e4f] opacity-80" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white border border-[rgba(54,48,47,0.1)] rounded-2xl shadow-xl z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="rounded-2xl"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-[#8e6e4f] text-white hover:bg-[#a27e5b] text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Book Appointment</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
