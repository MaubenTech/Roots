import { Html, Head, Body, Container, Section, Text, Img, Hr, Link } from "@react-email/components";

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

export function RSVPConfirmationEmail({ data }: RSVPConfirmationEmailProps) {
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
							RSVP Confirmation
						</Text>

						<Text
							style={{
								fontSize: "18px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							Thank you for confirming your attendance!
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

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
							<strong style={{ color: "#B8860B" }}>Dress Code:</strong> Elegant Corporate Fit
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* RSVP Details */}
						<Text
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								color: "#2C3E2D",
								marginBottom: "20px",
							}}>
							Your RSVP Details
						</Text>

						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#6B8E23" }}>Name:</strong> {data.fullName}
						</Text>
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#6B8E23" }}>Email:</strong> {data.email}
						</Text>
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#6B8E23" }}>Phone:</strong> {data.phone}
						</Text>
						{data.company && (
							<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
								<strong style={{ color: "#6B8E23" }}>Company:</strong> {data.company}
							</Text>
						)}
						<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
							<strong style={{ color: "#6B8E23" }}>Attending:</strong> {data.attending === "yes" ? "Yes" : "No"}
						</Text>
						{data.hasGuests === "yes" && (
							<Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
								<strong style={{ color: "#6B8E23" }}>Guests:</strong> {data.guestCount} guest(s)
							</Text>
						)}

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* Footer */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							We look forward to seeing you at this exclusive evening of elegance, connection, and impact!
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
