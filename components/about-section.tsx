"use client"

import { motion } from "framer-motion"
import { Users, Code, Laptop, Heart } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Empowering Youth",
    description: "Supporting the next generation of African tech innovators",
  },
  {
    icon: Code,
    title: "Digital Training",
    description: "Providing comprehensive coding and tech skills development",
  },
  {
    icon: Laptop,
    title: "Access to Tools",
    description: "Ensuring underrepresented youth have access to technology",
  },
  {
    icon: Heart,
    title: "Community Impact",
    description: "Building a stronger, more inclusive tech ecosystem",
  },
]

export default function AboutSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E2D] mb-8">About MaubenTech Roots</h2>
          <p className="text-xl text-[#5D4E37] max-w-4xl mx-auto leading-relaxed">
            MaubenTech Roots is dedicated to empowering African youth through technology education, digital training,
            and providing access to tools that bridge the digital divide. Your presence at this evening will help
            support our mission to create opportunities for underrepresented youth in the tech industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-[#F5F1E8] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#6B8E23] transition-colors duration-300">
                <feature.icon
                  size={40}
                  className="text-[#6B8E23] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E2D] mb-4">{feature.title}</h3>
              <p className="text-[#5D4E37] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
