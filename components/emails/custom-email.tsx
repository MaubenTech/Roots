import { Html, Head, Body, Container, Section, Text, Img, Hr, Link } from "@react-email/components";

interface CustomEmailProps {
	data: {
		fullName: string;
		email: string;
	};
	subject: string;
	message: string;
}

export function CustomEmail({ data, subject, message }: CustomEmailProps) {
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
								marginBottom: "30px",
							}}>
							{subject}
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

						{/* Custom Message */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								marginBottom: "30px",
								lineHeight: "1.6",
								whiteSpace: "pre-wrap",
							}}>
							{message}
						</Text>

						<Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

						{/* Footer */}
						<Text
							style={{
								fontSize: "16px",
								color: "#5D4E37",
								textAlign: "center",
								marginBottom: "20px",
							}}>
							Best regards,
							<br />
							The MaubenTech Roots Team
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
