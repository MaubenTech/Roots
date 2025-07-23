"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	const scrollToRSVP = () => {
		if (document.getElementById("rsvp-form")) {
			document.getElementById("rsvp-form")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		} else if (document.getElementById("exclusive-event-section")) {
			document.getElementById("exclusive-event-section")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		} else if (document.getElementById("invalid-link-section")) {
			document.getElementById("invalid-link-section")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	return (
		<section className="relative min-h-screen flex items-center justify-center px-4 py-20">
			<div className="max-w-4xl mx-auto text-center">
				<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
					<Image src="/images/logo.png" alt="MaubenTech Root Logo" width={200} height={200} className="mx-auto mb-8" />
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-4xl md:text-6xl font-bold text-[#2C3E2D] mb-6 leading-tight">
					Join Us for an Evening of <span className="text-[#B8860B]">Elegance</span>, <span className="text-[#6B8E23]">Impact</span> &{" "}
					<span className="text-[#2C3E2D]">Innovation</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="text-xl md:text-2xl text-[#5D4E37] mb-12 max-w-3xl mx-auto leading-relaxed">
					A Corporate Cocktail & Fundraiser Evening Empowering African Youth in Tech
				</motion.p>

				<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
					<Button
						onClick={scrollToRSVP}
						className="bg-[#6B8E23] hover:bg-[#5A7A1F] text-white px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
						RSVP Now
					</Button>
				</motion.div>
			</div>

			{/* Decorative elements */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.1 }}
				transition={{ duration: 2, delay: 1 }}
				className="absolute top-20 left-10 w-32 h-32 bg-[#6B8E23] rounded-full blur-3xl"
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.1 }}
				transition={{ duration: 2, delay: 1.5 }}
				className="absolute bottom-20 right-10 w-40 h-40 bg-[#B8860B] rounded-full blur-3xl"
			/>
		</section>
	);
}
