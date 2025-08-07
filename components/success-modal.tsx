"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export default function SuccessModal({ isOpen, onClose, data }: SuccessModalProps) {
  const handleClose = () => {
    onClose()
    // Store a flag in sessionStorage to indicate we should scroll after reload
    sessionStorage.setItem("scrollToRSVP", "true")
    // Reload the page
    window.location.reload()
  }

  // Check if we should scroll to RSVP form after page load
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem("scrollToRSVP")
    if (shouldScroll === "true") {
      // Remove the flag
      sessionStorage.removeItem("scrollToRSVP")
      // Scroll to RSVP form with a slight delay to ensure page is fully loaded
      setTimeout(() => {
        const rsvpElement = document.getElementById("rsvp-form")
        if (rsvpElement) {
          rsvpElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 1000)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </Button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                className="mb-6"
              >
                <CheckCircle size={80} className="text-[#6B8E23] mx-auto" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-[#2C3E2D] mb-4"
              >
                Thank You for Your RSVP!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-[#5D4E37] mb-6 leading-relaxed"
              >
                We've recorded your response and will get in touch shortly. A confirmation email has been sent to{" "}
                <span className="font-semibold text-[#6B8E23]">{data?.email}</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  onClick={handleClose}
                  className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-8 py-3 rounded-full font-semibold"
                >
                  Close
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
