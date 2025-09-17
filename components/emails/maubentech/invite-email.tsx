import { Html, Head, Body, Container, Section, Text, Hr, Link } from "@react-email/components";

interface InviteEmailProps {
	data: {
		fullName: string;
		email: string;
		linkIdentifier: string;
		isVip: boolean;
	};
	siteUrl?: string;
}

export function MaubenTechInviteEmail({ data, siteUrl = "https://yourdomain.com" }: InviteEmailProps) {
	const rsvpLink = `${siteUrl}/${data.linkIdentifier}`;

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
							You're Invited!
						</Text>

						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							Join us for an exclusive evening of elegance, impact, and innovation
						</Text>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						{/* Greeting */}
						<Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "20px" }}>Dear {data.fullName},</Text>

						<Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "20px", lineHeight: "1.6" }}>
							We are delighted to invite you to the MaubenTech Roots Corporate Cocktail & Fundraiser Evening. This exclusive event brings together
							visionaries, innovators, and supporters who share our commitment to empowering African youth through technology and digital
							innovation.
						</Text>

						{/* VIP Notice */}
						{data.isVip && (
							<Section
								style={{
									backgroundColor: "#fef3c7",
									border: "2px solid #CA8A04",
									borderRadius: "8px",
									padding: "20px",
									margin: "20px 0",
									textAlign: "center",
								}}>
								<Text style={{ fontSize: "18px", color: "#92400e", fontWeight: "bold", margin: "0 0 10px 0" }}>🌟 VIP Invitation 🌟</Text>
								<Text style={{ fontSize: "14px", color: "#92400e", margin: "0" }}>
									You have guest privileges - you may bring up to 1 guest to this exclusive event.
								</Text>
							</Section>
						)}

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

						{/* RSVP Call to Action */}
						<Section style={{ textAlign: "center", margin: "30px 0" }}>
							<Text style={{ fontSize: "18px", color: "#1f2937", fontWeight: "bold", marginBottom: "20px" }}>
								Please RSVP using your exclusive invitation link:
							</Text>

							<Link
								href={rsvpLink}
								style={{
									backgroundColor: "#CA8A04",
									color: "#FFFFFF",
									padding: "15px 30px",
									borderRadius: "8px",
									textDecoration: "none",
									fontWeight: "bold",
									fontSize: "16px",
									display: "inline-block",
								}}>
								RSVP Now
							</Link>

							<Text style={{ fontSize: "14px", color: "#6b7280", marginTop: "15px" }}>
								Or copy and paste this link: <br />
								<Link href={rsvpLink} style={{ color: "#CA8A04", wordBreak: "break-all" }}>
									{rsvpLink}
								</Link>
							</Text>
						</Section>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						{/* About the Event */}
						<Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "20px", lineHeight: "1.6" }}>
							Join us for an evening of meaningful connections, inspiring conversations, and the opportunity to make a lasting impact on the
							future of African youth in technology. Your presence will help us continue our mission of bridging the digital divide and creating
							opportunities for the next generation of innovators.
						</Text>

						{/* Footer Message */}
						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							We look forward to celebrating with you!
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
