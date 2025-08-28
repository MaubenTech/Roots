import { Html, Head, Body, Container, Section, Text, Img, Hr, Link } from "@react-email/components";

interface ReminderEmailProps {
	data: {
		fullName: string;
		email: string;
		attending?: string;
	};
}

export function ReminderEmail({ data }: ReminderEmailProps) {
	return (
		<Html>
			<Head />
			<Body
				style={{
					backgroundColor: "#F5F1E8",
					fontFamily: "Arial, sans-serif",
				}}>
				<Container
					style={{
						maxWidth: "600px",
						margin: "0 auto",
						padding: "20px",
					}}>
					<Section
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "20px",
							padding: "40px",
						}}>
						{/* Logo */}
						<Section
							style={{
								textAlign: "center",
								marginBottom: "30px",
							}}>
							<Img
								src="https://roots.maubentech.com/images/logo.png"
								alt="MaubenTech Roots"
								width="120"
								height="120"
								style={{ margin: "0 auto" }}
							/>
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
							Event Reminder
						</Text>

						<Text
							style={{
								fontSize: "18px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							Don't forget about our upcoming event!
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* Greeting */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "20px",
							}}>
							Dear {data.fullName},
						</Text>

						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "20px",
								lineHeight: "1.6",
							}}>
							This is a friendly reminder about the MaubenTech Roots Corporate Cocktail & Fundraiser Evening.
							{data.attending === "yes" ? " We're excited to see you there!" : " We hope you can still join us if your plans have changed."}
						</Text>

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

						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "10px",
							}}>
							<strong style={{ color: "#B8860B" }}>Event:</strong> Corporate Cocktail & Fundraiser Evening
						</Text>
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "10px",
							}}>
							<strong style={{ color: "#B8860B" }}>Date:</strong> Saturday, August 30th, 2025
						</Text>
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "10px",
							}}>
							<strong style={{ color: "#B8860B" }}>Time:</strong> 4:00 PM
						</Text>
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "10px",
							}}>
							<strong style={{ color: "#B8860B" }}>Venue:</strong> Oladipo Diya St, Durumi 900103, Abuja by Smokey house
						</Text>
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "20px",
							}}>
							<strong style={{ color: "#B8860B" }}>Dress Code:</strong> Elegant Corporate Attire
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* Call to Action */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "20px",
								lineHeight: "1.6",
							}}>
							Join us for an evening of elegance, meaningful connections, and impactful conversations as we work together to empower African youth
							through technology and innovation.
						</Text>

						{/* Footer */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							We look forward to seeing you there!
						</Text>

						<Text
							style={{
								fontSize: "14px",
								color: "#5D4E37",
								textAlign: "center",
							}}>
							For any questions, please contact us at{" "}
							<Link href="mailto:events@maubentech.com" style={{ color: "#6B8E23" }}>
								events@maubentech.com
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
