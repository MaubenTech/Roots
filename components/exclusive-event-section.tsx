"use client";

import { motion } from "framer-motion";
import { Lock, Star, Users, Calendar } from "lucide-react";

export default function ExclusiveEventSection() {
	return (
		<section className="py-20 px-4 bg-white">
			<div className="max-w-4xl mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="mb-12">
					<div className="bg-[#6B8E23] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
						<Lock size={40} className="text-white" />
					</div>

					<h2 className="text-4xl md:text-5xl font-bold text-[#2C3E2D] mb-6">Exclusive Invitation-Only Event</h2>

					<p className="text-xl text-[#5D4E37] mb-8 leading-relaxed">
						This Corporate Cocktail & Fundraiser Evening is an exclusive, invitation-only event for selected partners, stakeholders, and supporters
						of MaubenTech Roots.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}
						className="bg-[#F5F1E8] rounded-2xl p-6">
						<Star size={48} className="text-[#B8860B] mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-[#2C3E2D] mb-3">Premium Experience</h3>
						<p className="text-[#5D4E37]">An evening of elegance with carefully curated experiences for our valued community</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="bg-[#F5F1E8] rounded-2xl p-6">
						<Users size={48} className="text-[#6B8E23] mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-[#2C3E2D] mb-3">Limited Attendance</h3>
						<p className="text-[#5D4E37]">Intimate gathering ensuring meaningful connections and impactful conversations</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						viewport={{ once: true }}
						className="bg-[#F5F1E8] rounded-2xl p-6">
						<Calendar size={48} className="text-[#2C3E2D] mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-[#2C3E2D] mb-3">Special Occasion</h3>
						<p className="text-[#5D4E37]">A unique opportunity to support African youth in technology and innovation</p>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="bg-[#2C3E2D] rounded-3xl p-8 text-white">
					<h3 className="text-2xl font-bold mb-4">Interested in Future Events?</h3>
					<p className="text-lg mb-6 opacity-90">
						Stay connected with MaubenTech to learn about upcoming events and opportunities to support our mission of empowering African youth
						through technology.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="https://maubentech.com/contact"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300">
							Contact Us
						</a>
						<a
							href="https://maubentech.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-transparent border-2 border-white hover:bg-white hover:text-[#2C3E2D] text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300">
							Learn More
						</a>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
