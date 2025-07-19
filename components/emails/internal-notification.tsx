import { Html, Head, Body, Container, Section, Text, Hr } from "@react-email/components"

interface InternalNotificationEmailProps {
  data: {
    fullName: string
    email: string
    phone: string
    company?: string
    attending: string
    hasGuests?: string
    guestCount?: number
    donation?: string
  }
}

export function InternalNotificationEmail({ data }: InternalNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#F5F1E8", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Section style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "40px" }}>
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#2C3E2D",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              New RSVP Received
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#5D4E37",
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              Corporate Cocktail & Fundraiser Evening
            </Text>

            <Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

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
                <strong style={{ color: "#6B8E23" }}>Bringing Guests:</strong> {data.guestCount} guest(s)
              </Text>
            )}
            {data.donation && (
              <Text style={{ fontSize: "16px", color: "#5D4E37", marginBottom: "10px" }}>
                <strong style={{ color: "#6B8E23" }}>Interested in Donation:</strong>{" "}
                {data.donation === "yes" ? "Yes" : "No"}
              </Text>
            )}

            <Hr style={{ borderColor: "#6B8E23", margin: "30px 0" }} />

            <Text
              style={{
                fontSize: "14px",
                color: "#5D4E37",
                textAlign: "center",
              }}
            >
              RSVP submitted at {new Date().toLocaleString()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
