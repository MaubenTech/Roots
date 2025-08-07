"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, CheckCircle, Mail, Phone, Calendar } from "lucide-react"

interface RSVPFormProps {
  onSuccess: (data: any) => void
  linkIdentifier: string
  isVip: boolean
  existingRSVP?: any
}

export default function RSVPForm({ onSuccess, linkIdentifier, isVip, existingRSVP }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    attending: "",
    hasGuests: "",
    guestCount: "", // Change from 0 to empty string
    donation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExistingRSVP, setShowExistingRSVP] = useState(!!existingRSVP)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          guestCount: formData.guestCount === "" ? 0 : formData.guestCount,
          linkIdentifier,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onSuccess(formData)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit RSVP")
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      alert(`There was an error submitting your RSVP: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateRSVP = () => {
    setShowExistingRSVP(false)
    // Pre-fill form with existing data
    if (existingRSVP) {
      setFormData({
        fullName: existingRSVP.full_name || "",
        email: existingRSVP.email || "",
        phone: existingRSVP.phone || "",
        company: existingRSVP.company || "",
        attending: existingRSVP.attending || "",
        hasGuests: existingRSVP.has_guests || "",
        guestCount: existingRSVP.guest_count || "",
        donation: existingRSVP.donation || "",
      })
    }
  }

  return (
    <section id="rsvp-form" className="py-20 px-4 bg-[#F5F1E8]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E2D] mb-6">RSVP Now</h2>
          <p className="text-xl text-[#5D4E37]">Secure your spot at this exclusive evening of impact and innovation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          {/* Show existing RSVP message */}
          {showExistingRSVP && existingRSVP ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="mb-8"
              >
                <CheckCircle size={80} className="text-[#6B8E23] mx-auto mb-6" />
              </motion.div>

              <h3 className="text-3xl font-bold text-[#2C3E2D] mb-6">RSVP Already Recorded!</h3>

              <p className="text-lg text-[#5D4E37] mb-8">
                Thank you, <span className="font-semibold text-[#6B8E23]">{existingRSVP.full_name}</span>! We've already
                received your RSVP for the Corporate Cocktail & Fundraiser Evening.
              </p>

              <div className="bg-[#F5F1E8] rounded-2xl p-6 mb-8">
                <h4 className="text-xl font-semibold text-[#2C3E2D] mb-4">Your RSVP Details:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-[#6B8E23]" />
                    <div>
                      <p className="text-sm text-[#5D4E37]">Email</p>
                      <p className="font-medium text-[#2C3E2D]">{existingRSVP.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-[#6B8E23]" />
                    <div>
                      <p className="text-sm text-[#5D4E37]">Phone</p>
                      <p className="font-medium text-[#2C3E2D]">{existingRSVP.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#6B8E23]" />
                    <div>
                      <p className="text-sm text-[#5D4E37]">Attending</p>
                      <p className="font-medium text-[#2C3E2D]">{existingRSVP.attending === "yes" ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-[#6B8E23]" />
                    <div>
                      <p className="text-sm text-[#5D4E37]">Submitted</p>
                      <p className="font-medium text-[#2C3E2D]">
                        {new Date(existingRSVP.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {existingRSVP.has_guests === "yes" && (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-[#6B8E23]" />
                      <div>
                        <p className="text-sm text-[#5D4E37]">Guests</p>
                        <p className="font-medium text-[#2C3E2D]">{existingRSVP.guest_count} guest(s)</p>
                      </div>
                    </div>
                  )}
                  {existingRSVP.company && (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-[#6B8E23]" />
                      <div>
                        <p className="text-sm text-[#5D4E37]">Company</p>
                        <p className="font-medium text-[#2C3E2D]">{existingRSVP.company}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[#5D4E37]">
                  Need to make changes to your RSVP? Click the button below to update your response.
                </p>
                <Button
                  onClick={handleUpdateRSVP}
                  className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-8 py-3 rounded-full font-semibold"
                >
                  Update My RSVP
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Event Details:</strong> Saturday, March 15th, 2025 at 4:00 PM
                  <br />
                  The Grand Ballroom, Victoria Island, Lagos
                </p>
              </div>
            </div>
          ) : (
            /* Show RSVP Form */
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="fullName" className="text-[#2C3E2D] font-semibold mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12"
                    placeholder="Enter your full name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="email" className="text-[#2C3E2D] font-semibold mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="phone" className="text-[#2C3E2D] font-semibold mb-2 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12"
                    placeholder="Enter your phone number"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="company" className="text-[#2C3E2D] font-semibold mb-2 block">
                    Company/Organization
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12"
                    placeholder="Enter your company or organization"
                  />
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Label className="text-[#2C3E2D] font-semibold mb-4 block">Will you be attending? *</Label>
                  <RadioGroup
                    value={formData.attending}
                    onValueChange={(value) => handleInputChange("attending", value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="attending-yes" />
                      <Label htmlFor="attending-yes" className="text-[#5D4E37]">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="attending-no" />
                      <Label htmlFor="attending-no" className="text-[#5D4E37]">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>

                {formData.attending === "yes" && (
                  <>
                    {/* Only show guest options for VIP invitations */}
                    {isVip && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Label className="text-[#2C3E2D] font-semibold mb-4 block">
                            Will you be attending with a guest?
                          </Label>
                          <RadioGroup
                            value={formData.hasGuests}
                            onValueChange={(value) => handleInputChange("hasGuests", value)}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="guests-yes" />
                              <Label htmlFor="guests-yes" className="text-[#5D4E37]">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="guests-no" />
                              <Label htmlFor="guests-no" className="text-[#5D4E37]">
                                No
                              </Label>
                            </div>
                          </RadioGroup>
                        </motion.div>

                        {formData.hasGuests === "yes" && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Label htmlFor="guestCount" className="text-[#2C3E2D] font-semibold mb-2 block">
                              How many guests? (Maximum 1)
                            </Label>
                            <Input
                              id="guestCount"
                              type="number"
                              min="0"
                              max="1"
                              value={formData.guestCount}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === "") {
                                  handleInputChange("guestCount", "")
                                } else {
                                  const numValue = Number.parseInt(value)
                                  if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
                                    handleInputChange("guestCount", numValue)
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                // Prevent entering numbers greater than 1
                                if (e.key >= "2" && e.key <= "9") {
                                  e.preventDefault()
                                }
                                // Allow backspace, delete, tab, escape, enter, arrow keys
                                if (
                                  [
                                    "Backspace",
                                    "Delete",
                                    "Tab",
                                    "Escape",
                                    "Enter",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "ArrowUp",
                                    "ArrowDown",
                                  ].includes(e.key) ||
                                  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                  (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
                                ) {
                                  return
                                }
                                // Ensure that it is a number (0 or 1) and stop other keypresses
                                if (!/[01]/.test(e.key)) {
                                  e.preventDefault()
                                }
                              }}
                              className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12 max-w-xs"
                              placeholder="Enter number of guests"
                            />
                            <p className="text-sm text-[#5D4E37] mt-1">
                              You may bring a maximum of 1 guest to this exclusive event.
                            </p>
                          </motion.div>
                        )}
                      </>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <Label className="text-[#2C3E2D] font-semibold mb-4 block">
                        Would you like to make a donation to support our cause?
                      </Label>
                      <RadioGroup
                        value={formData.donation}
                        onValueChange={(value) => handleInputChange("donation", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="donation-yes" />
                          <Label htmlFor="donation-yes" className="text-[#5D4E37]">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="donation-no" />
                          <Label htmlFor="donation-no" className="text-[#5D4E37]">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </motion.div>
                  </>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.fullName || !formData.email || !formData.phone || !formData.attending
                  }
                  className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit RSVP"
                  )}
                </Button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
