import { Html, Head, Body, Container, Section, Text, Img, Hr, Link } from "@react-email/components";

interface InviteEmailProps {
	data: {
		fullName: string;
		email: string;
		linkIdentifier: string;
		isVip: boolean;
	};
	siteUrl?: string;
}

export function InviteEmail({ data, siteUrl = "https://yourdomain.com" }: InviteEmailProps) {
	const rsvpLink = `${siteUrl}/${data.linkIdentifier}`;

	return (
		<Html>
			<Head />
			<Body style={{ backgroundColor: "#F5F1E8", fontFamily: "Arial, sans-serif" }}>
				<Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
					<Section style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "40px" }}>
						{/* Logo */}
						<Section style={{ textAlign: "center", marginBottom: "30px" }}>
							<Img src="/images/logo.png" alt="MaubenTech Roots" width="120" height="120" style={{ margin: "0 auto" }} />
						</Section>

						{/* Header */}
						<Text
							style={{
								fontSize: "28px",
								fontWeight: "bold",
								color: "#2C3E2D",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							You're Invited!
						</Text>

						<Text
							style={{
								fontSize: "18px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							Join us for an exclusive evening of elegance, impact, and innovation
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* Greeting */}
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "20px" }}>Dear {data.fullName},</Text>

						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "20px", lineHeight: "1.6" }}>
							We are delighted to invite you to the MaubenTech Roots Corporate Cocktail & Fundraiser Evening. This exclusive event brings together
							visionaries, innovators, and supporters who share our commitment to empowering African youth through technology and digital
							innovation.
						</Text>

						{/* VIP Notice */}
						{data.isVip && (
							<Section
								style={{
									backgroundColor: "#FFF7E6",
									border: "2px solid #B8860B",
									borderRadius: "10px",
									padding: "20px",
									margin: "20px 0",
								}}>
								<Text style={{ fontSize: "16px", color: "#B8860B", fontWeight: "bold", textAlign: "center", margin: "0" }}>
									🌟 VIP Invitation 🌟
								</Text>
								<Text style={{ fontSize: "14px", color: "#5D4E37", textAlign: "center", margin: "10px 0 0 0" }}>
									You have guest privileges - you may bring up to 1 guest to this exclusive event.
								</Text>
							</Section>
						)}

						{/* Event Details */}
						<Text
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								color: "#2C3E2D",
								marginBottom: "20px",
							}}>
							Event Details
						</Text>

						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#B8860B" }}>Event:</strong> Corporate Cocktail & Fundraiser Evening
						</Text>
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#B8860B" }}>Date:</strong> Saturday, August 30th, 2025
						</Text>
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#B8860B" }}>Time:</strong> 4:00 PM
						</Text>
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#B8860B" }}>Venue:</strong> Oladipo Diya St, Durumi 900103, Abuja by Smokey house
						</Text>
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "20px" }}>
							<strong style={{ color: "#B8860B" }}>Dress Code:</strong> Corporate Fit That Bangs
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* RSVP Call to Action */}
						<Section style={{ textAlign: "center", margin: "30px 0" }}>
							<Text style={{ fontSize: "18px", color: "#2C3E2D", fontWeight: "bold", marginBottom: "20px" }}>
								Please RSVP using your exclusive invitation link:
							</Text>

							<Link
								href={rsvpLink}
								style={{
									backgroundColor: "#6B8E23",
									color: "#FFFFFF",
									padding: "15px 30px",
									borderRadius: "25px",
									textDecoration: "none",
									fontWeight: "bold",
									fontSize: "16px",
									display: "inline-block",
								}}>
								RSVP Now
							</Link>

							<Text style={{ fontSize: "14px", color: "#5D4E37", marginTop: "15px" }}>
								Or copy and paste this link: <br />
								<Link href={rsvpLink} style={{ color: "#6B8E23", wordBreak: "break-all" }}>
									{rsvpLink}
								</Link>
							</Text>
						</Section>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* About the Event */}
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "20px", lineHeight: "1.6" }}>
							Join us for an evening of meaningful connections, inspiring conversations, and the opportunity to make a lasting impact on the
							future of African youth in technology. Your presence will help us continue our mission of bridging the digital divide and creating
							opportunities for the next generation of innovators.
						</Text>

						{/* Footer */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							We look forward to celebrating with you!
						</Text>

						<Text
							style={{
								fontSize: "14px",
								color: "#5D4E37",
								textAlign: "center",
							}}>
							For any questions, please contact us at{" "}
							<Link href="mailto:events@maubentech.org" style={{ color: "#6B8E23" }}>
								events@maubentech.org
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
