"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Shirt, Users } from "lucide-react"

interface EventDetailsProps {
  isVip?: boolean
  hasLinkIdentifier?: boolean
}

export default function EventDetails({ isVip = false, hasLinkIdentifier = false }: EventDetailsProps) {
  const eventDetails = [
    {
      icon: Calendar,
      label: "Date",
      value: "Saturday, August 30th, 2025",
      color: "text-[#B8860B]",
    },
    {
      icon: Clock,
      label: "Time",
      value: "4:00 PM",
      color: "text-[#6B8E23]",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: "Oladipo Diya St, Durumi 900103, Abuja by Smokey house",
      color: "text-[#2C3E2D]",
    },
    {
      icon: Shirt,
      label: "Dress Code",
      value: "Corporate Fit That Bangs",
      color: "text-[#B8860B]",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-[#2C3E2D] mb-16"
        >
          Event Details
        </motion.h2>

        {/* Main event details - always 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventDetails.map((detail, index) => (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`${detail.color} mb-4`}>
                <detail.icon size={48} />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E2D] mb-2">{detail.label}</h3>
              <p className="text-[#5D4E37] text-lg leading-relaxed">{detail.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Guest Policy - only show for VIP users with proper responsive centering */}
        {hasLinkIdentifier && isVip && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="md:col-span-2 lg:col-start-2 lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-[#2C3E2D] mb-4 flex justify-center">
                    <Users size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2C3E2D] mb-2 text-center">Guest Policy</h3>
                  <p className="text-[#5D4E37] text-lg leading-relaxed text-center">Maximum 1 guest per attendee</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
