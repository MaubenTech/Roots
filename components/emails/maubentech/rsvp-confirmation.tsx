import { Html, Head, Body, Container, Section, Text, Hr, Link, Img } from "@react-email/components";

interface RSVPConfirmationEmailProps {
	data: {
		fullName: string;
		email: string;
		phone: string;
		company?: string;
		attending: string;
		hasGuests?: string;
		guestCount?: number;
		donation?: string;
	};
}

export function MaubenTechRSVPConfirmationEmail({ data }: RSVPConfirmationEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={{ backgroundColor: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
				<Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
					{/* Logo */}
					<Section style={{ textAlign: "center", marginBottom: "20px" }}>
						<Img src="/images/maubentech-logo.png" alt="MaubenTech Logo" width="80" height="80" style={{ margin: "0 auto" }} />
					</Section>

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
							RSVP Confirmation
						</Text>

						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							{data.attending === "yes" ? "Thank you for confirming your attendance!" : "Thank you for your response!"}
						</Text>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

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

						{/* RSVP Details */}
						<Section style={{ backgroundColor: "#1f2937", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
							<Text
								style={{
									fontSize: "18px",
									fontWeight: "bold",
									color: "#FFFFFF",
									marginBottom: "15px",
								}}>
								Your RSVP Details
							</Text>

							<Text style={{ fontSize: "14px", color: "#e5e7eb", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Name:</span> {data.fullName}
							</Text>
							<Text style={{ fontSize: "14px", color: "#e5e7eb", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Email:</span> {data.email}
							</Text>
							<Text style={{ fontSize: "14px", color: "#e5e7eb", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Phone:</span> {data.phone}
							</Text>
							{data.company && (
								<Text style={{ fontSize: "14px", color: "#e5e7eb", marginBottom: "8px", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Company:</span> {data.company}
								</Text>
							)}
							<Text style={{ fontSize: "14px", color: "#e5e7eb", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Attending:</span> {data.attending === "yes" ? "Yes" : "No"}
							</Text>
							{data.hasGuests === "yes" && (
								<Text style={{ fontSize: "14px", color: "#e5e7eb", marginBottom: "0", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Guests:</span> {data.guestCount} guest(s)
								</Text>
							)}
						</Section>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						{/* Footer Message */}
						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "20px",
								lineHeight: "1.6",
							}}>
							{data.attending === "yes"
								? "We look forward to seeing you at this exclusive evening of elegance, connection, and impact!"
								: "We're sorry you can't make it this time. We hope to see you at future MaubenTech events!"}
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
								<Link href="mailto:info@maubentech.com" style={{ color: "#CA8A04", textDecoration: "none", fontWeight: "600" }}>
									info@maubentech.com
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
