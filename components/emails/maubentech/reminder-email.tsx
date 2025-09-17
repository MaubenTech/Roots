import { Html, Head, Body, Container, Section, Text, Hr, Link } from "@react-email/components";

interface ReminderEmailProps {
	data: {
		fullName: string;
		email: string;
		attending?: string;
	};
}

export function MaubenTechReminderEmail({ data }: ReminderEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={{ backgroundColor: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
				<Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
					<Section
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "12px",
							padding: "40px",
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
						}}>
						{/* Header with MaubenTech branding */}
						<Section
							style={{
								textAlign: "center",
								marginBottom: "30px",
								padding: "20px",
								backgroundColor: "#1f2937",
								borderRadius: "8px",
							}}>
							<Text
								style={{
									fontSize: "28px",
									fontWeight: "bold",
									color: "#FFFFFF",
									margin: "0 0 10px 0",
								}}>
								MaubenTech
							</Text>
							<Text
								style={{
									fontSize: "14px",
									color: "#CA8A04",
									margin: "0",
									fontWeight: "600",
								}}>
								Building the Future of Software
							</Text>
						</Section>

						{/* Main Content */}
						<Text
							style={{
								fontSize: "24px",
								fontWeight: "bold",
								color: "#1f2937",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							Event Reminder
						</Text>

						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							Don't forget about our upcoming event!
						</Text>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						{/* Greeting */}
						<Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "20px" }}>Dear {data.fullName},</Text>

						<Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "20px", lineHeight: "1.6" }}>
							This is a friendly reminder about the MaubenTech Roots Corporate Cocktail & Fundraiser Evening.
							{data.attending === "yes" ? " We're excited to see you there!" : " We hope you can still join us if your plans have changed."}
						</Text>

						{/* Event Details */}
						<Section style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
							<Text
								style={{
									fontSize: "18px",
									fontWeight: "bold",
									color: "#1f2937",
									marginBottom: "15px",
								}}>
								Event Details
							</Text>

							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Event:</span> Corporate Cocktail & Fundraiser Evening
							</Text>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Date:</span> Saturday, August 30th, 2025
							</Text>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Time:</span> 4:00 PM
							</Text>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Venue:</span> Oladipo Diya St, Durumi 900103, Abuja by Smokey house
							</Text>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "0", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Dress Code:</span> Corporate Fit That Bangs
							</Text>
						</Section>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						{/* Call to Action */}
						<Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "20px", lineHeight: "1.6" }}>
							Join us for an evening of elegance, meaningful connections, and impactful conversations as we work together to empower African youth
							through technology and innovation.
						</Text>

						{/* Footer Message */}
						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							We look forward to seeing you there!
						</Text>

						{/* Contact Footer */}
						<Section style={{ textAlign: "center", padding: "20px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
							<Text
								style={{
									fontSize: "14px",
									color: "#6b7280",
									marginBottom: "10px",
								}}>
								For any questions, please contact us at{" "}
								<Link href="mailto:events@maubentech.com" style={{ color: "#CA8A04", textDecoration: "none", fontWeight: "600" }}>
									events@maubentech.com
								</Link>
							</Text>
							<Text
								style={{
									fontSize: "12px",
									color: "#9ca3af",
									margin: "0",
								}}>
								© 2025 MaubenTech. Building software that actually solves problems.
							</Text>
						</Section>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
