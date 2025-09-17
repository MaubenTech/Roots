import { type NextRequest, NextResponse } from "next/server";
import { Database } from "sqlite3";
import { verify } from "jsonwebtoken";
import path from "path";
import { Resend } from "resend";
import { RSVPConfirmationEmail } from "@/components/emails/rsvp-confirmation";
import { ReminderEmail } from "@/components/emails/reminder-email";
import { CustomEmail } from "@/components/emails/custom-email";
import { MaubenTechRSVPConfirmationEmail } from "@/components/emails/maubentech/rsvp-confirmation";
import { MaubenTechReminderEmail } from "@/components/emails/maubentech/reminder-email";
import { MaubenTechCustomEmail } from "@/components/emails/maubentech/custom-email";

const resend = new Resend(process.env.RESEND_API_KEY);
const dbPath = path.join(process.cwd(), "rsvp.db");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}

function getDatabase() {
	return new Database(dbPath);
}

// Verify admin authentication
function verifyAdmin(request: NextRequest) {
	const authHeader = request.headers.get("authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return false;
	}

	const token = authHeader.substring(7);

	try {
		const decoded = verify(token, JWT_SECRET!) as any;
		return decoded.admin === true;
	} catch (error) {
		return false;
	}
}

// Get RSVP data by ID
async function getRSVPById(id: string) {
	return new Promise<any>((resolve, reject) => {
		const db = getDatabase();

		db.get(
			`SELECT r.*, li.uuid as link_uuid, li.is_vip, 
          CASE WHEN li.uuid LIKE 'test-%' THEN 1 ELSE 0 END as is_test
       FROM rsvps r
       JOIN link_identifiers li ON r.link_identifier_id = li.id
       WHERE r.id = ?`,
			[id],
			(err, row) => {
				if (err) {
					console.error("Database query error:", err);
					reject(err);
				} else {
					resolve(row);
				}
			}
		);

		db.close();
	});
}

export async function POST(request: NextRequest) {
	try {
		// Verify admin authentication
		if (!verifyAdmin(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { rsvpId, emailType, template = "roots", customSubject, customMessage } = await request.json();

		if (!rsvpId || !emailType) {
			return NextResponse.json({ error: "RSVP ID and email type are required" }, { status: 400 });
		}

		// Get RSVP data
		const rsvp = await getRSVPById(rsvpId);
		if (!rsvp) {
			return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
		}

		const emailData = {
			fullName: rsvp.full_name,
			email: rsvp.email,
			phone: rsvp.phone,
			company: rsvp.company,
			attending: rsvp.attending,
			hasGuests: rsvp.has_guests,
			guestCount: rsvp.guest_count,
			donation: rsvp.donation,
		};

		let emailSubject = "";
		let emailComponent = null;

		// Determine email type and content
		switch (emailType) {
			case "confirmation":
				emailSubject = "RSVP Confirmation - Corporate Cocktail & Fundraiser Evening";
				emailComponent = template === "maubentech" ? MaubenTechRSVPConfirmationEmail({ data: emailData }) : RSVPConfirmationEmail({ data: emailData });
				break;

			case "reminder":
				emailSubject = "Event Reminder - Corporate Cocktail & Fundraiser Evening";
				emailComponent = template === "maubentech" ? MaubenTechReminderEmail({ data: emailData }) : ReminderEmail({ data: emailData });
				break;

			case "custom":
				if (!customSubject || !customMessage) {
					return NextResponse.json(
						{
							error: "Custom subject and message are required for custom emails",
						},
						{ status: 400 }
					);
				}
				emailSubject = customSubject;
				emailComponent =
					template === "maubentech"
						? MaubenTechCustomEmail({
								data: emailData,
								subject: customSubject,
								message: customMessage,
							})
						: CustomEmail({
								data: emailData,
								subject: customSubject,
								message: customMessage,
							});
				break;

			default:
				return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
		}

		// Send email
		try {
			await resend.emails.send({
				from: "MaubenTech Roots <events@maubentech.com>",
				to: [rsvp.email],
				subject: emailSubject,
				react: emailComponent,
			});

			console.log(`${emailType} email sent successfully to:`, rsvp.email);

			return NextResponse.json({
				success: true,
				message: `${emailType.charAt(0).toUpperCase() + emailType.slice(1)} email sent successfully to ${rsvp.email}`,
			});
		} catch (emailError) {
			console.error("Error sending email:", emailError);
			return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error in send email route:", error);
		return NextResponse.json({ error: "Failed to process email request" }, { status: 500 });
	}
}
