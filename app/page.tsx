"use client"

import { useState } from "react"
import HeroSection from "@/components/hero-section"
import EventDetails from "@/components/event-details"
import AboutSection from "@/components/about-section"
import RSVPForm from "@/components/rsvp-form"
import SuccessModal from "@/components/success-modal"

export default function HomePage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)

  const handleRSVPSuccess = (data: any) => {
    setSubmittedData(data)
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <HeroSection />
      <EventDetails />
      <AboutSection />
      <RSVPForm onSuccess={handleRSVPSuccess} />

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} data={submittedData} />
    </div>
  )
}
