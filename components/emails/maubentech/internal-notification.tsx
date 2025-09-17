import { Html, Head, Body, Container, Section, Text, Hr } from "@react-email/components";

interface InternalNotificationEmailProps {
	data: {
		fullName: string;
		email: string;
		phone: string;
		company?: string;
		attending: string;
		hasGuests?: string;
		guestCount?: number;
		donation?: string;
		isVip?: boolean;
		linkIdentifier?: string;
	};
}

export function MaubenTechInternalNotificationEmail({ data }: InternalNotificationEmailProps) {
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

						<Text
							style={{
								fontSize: "24px",
								fontWeight: "bold",
								color: "#1f2937",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							New RSVP Received
						</Text>

						<Text
							style={{
								fontSize: "16px",
								color: "#4b5563",
								textAlign: "center",
								marginBottom: "30px",
							}}>
							Corporate Cocktail & Fundraiser Evening
						</Text>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						{/* RSVP Details */}
						<Section style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Name:</span> {data.fullName}
							</Text>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Email:</span> {data.email}
							</Text>
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Phone:</span> {data.phone}
							</Text>
							{data.company && (
								<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Company:</span> {data.company}
								</Text>
							)}
							<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
								<span style={{ fontWeight: "600", color: "#CA8A04" }}>Attending:</span> {data.attending === "yes" ? "Yes" : "No"}
							</Text>
							{data.hasGuests === "yes" && (
								<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Bringing Guests:</span> {data.guestCount} guest(s)
								</Text>
							)}
							{data.donation && (
								<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Interested in Donation:</span>{" "}
									{data.donation === "yes" ? "Yes" : "No"}
								</Text>
							)}
							{data.isVip !== undefined && (
								<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Guest Privileges:</span> {data.isVip ? "Yes (VIP)" : "No"}
								</Text>
							)}
							{data.linkIdentifier && (
								<Text style={{ fontSize: "14px", color: "#4b5563", marginBottom: "0", lineHeight: "1.5" }}>
									<span style={{ fontWeight: "600", color: "#CA8A04" }}>Link ID:</span> {data.linkIdentifier.substring(0, 8)}...
								</Text>
							)}
						</Section>

						<Hr style={{ borderColor: "#CA8A04", margin: "30px 0", borderWidth: "2px" }} />

						<Text
							style={{
								fontSize: "14px",
								color: "#6b7280",
								textAlign: "center",
							}}>
							RSVP submitted at {new Date().toLocaleString()}
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
