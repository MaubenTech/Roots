"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Shirt, Users } from "lucide-react";

const eventDetails = [
	{
		icon: Calendar,
		label: "Date",
		value: "Saturday, March 15th, 2025",
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
		value: "The Grand Ballroom, Victoria Island, Lagos",
		color: "text-[#2C3E2D]",
	},
	{
		icon: Shirt,
		label: "Dress Code",
		value: "Corporate Fit That Bangs",
		color: "text-[#B8860B]",
	},
	{
		icon: Users,
		label: "Guest Policy",
		value: "Maximum 1 guest per attendee",
		color: "text-[#2C3E2D]",
	},
];

export default function EventDetails() {
	return (
		<section className="py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-4xl md:text-5xl font-bold text-center text-[#2C3E2D] mb-16">
					Event Details
				</motion.h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{eventDetails.map((detail, index) => (
						<motion.div
							key={detail.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<div className={`${detail.color} mb-4`}>
								<detail.icon size={48} />
							</div>
							<h3 className="text-xl font-semibold text-[#2C3E2D] mb-2">
								{detail.label}
							</h3>
							<p className="text-[#5D4E37] text-lg leading-relaxed">
								{detail.value}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
