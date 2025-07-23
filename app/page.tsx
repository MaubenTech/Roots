"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HeroSection from "@/components/hero-section";
import EventDetails from "@/components/event-details";
import AboutSection from "@/components/about-section";
import RSVPForm from "@/components/rsvp-form";
import SuccessModal from "@/components/success-modal";
import ExclusiveEventSection from "@/components/exclusive-event-section";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function HomePage() {
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [submittedData, setSubmittedData] = useState<any>(null);
	const [linkIdentifier, setLinkIdentifier] = useState<string | null>(null);
	const [linkData, setLinkData] = useState<any>(null);
	const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const searchParams = useSearchParams();

	useEffect(() => {
		// Get link identifier from URL path
		const pathSegments = window.location.pathname.split("/").filter(Boolean);
		const identifier = pathSegments[0] || null;

		if (identifier && identifier !== "admin") {
			setLinkIdentifier(identifier);
			validateLinkIdentifier(identifier);
		} else {
			setIsLoading(false);
		}
	}, []);

	const validateLinkIdentifier = async (identifier: string) => {
		try {
			const response = await fetch("/api/link-identifier/validate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ identifier }),
			});

			const data = await response.json();

			if (response.ok && data.valid) {
				setIsValidLink(true);
				setLinkData(data.linkData);
			} else {
				setIsValidLink(false);
			}
		} catch (error) {
			console.error("Error validating link identifier:", error);
			setIsValidLink(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRSVPSuccess = (data: any) => {
		setSubmittedData(data);
		setShowSuccessModal(true);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23] mx-auto mb-4"></div>
					<p className="text-[#5D4E37]">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F5F1E8]">
			{/* Navigation Header */}
			<nav className="bg-white shadow-sm border-b border-[#6B8E23]/20">
				<div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
					<div className="text-xl font-bold text-[#2C3E2D]">MaubenTech Roots</div>
					<Button
						onClick={() => window.open("https://maubentech.com", "_blank")}
						variant="outline"
						className="border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23] hover:text-white">
						Visit MaubenTech.com
						<ExternalLink className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</nav>

			<HeroSection />
			<EventDetails isVip={Boolean(linkData?.is_vip)} hasLinkIdentifier={Boolean(linkIdentifier && isValidLink)} />
			<AboutSection />

			{/* Show RSVP form only if valid link identifier */}
			{linkIdentifier && isValidLink && linkData ? (
				<RSVPForm onSuccess={handleRSVPSuccess} linkIdentifier={linkIdentifier} isVip={linkData.is_vip} existingRSVP={linkData.existingRSVP} />
			) : linkIdentifier && isValidLink === false ? (
				<section id="invalid-link-section" className="py-20 px-4 bg-white">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl font-bold text-red-600 mb-4">Invalid Invitation Link</h2>
						<p className="text-lg text-[#5D4E37]">The invitation link you used is not valid or has expired.</p>
					</div>
				</section>
			) : (
				<ExclusiveEventSection />
			)}

			<SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} data={submittedData} />
		</div>
	);
}
