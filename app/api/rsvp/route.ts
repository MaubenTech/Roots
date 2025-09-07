import { type NextRequest, NextResponse } from "next/server";
import { Database } from "sqlite3";
import path from "path";
import { Resend } from "resend";
import { RSVPConfirmationEmail } from "@/components/emails/rsvp-confirmation";
import { InternalNotificationEmail } from "@/components/emails/internal-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize SQLite database
const dbPath = path.join(process.cwd(), "rsvp.db");

// Create database connection
function getDatabase() {
	return new Database(dbPath);
}

// Get link identifier data
async function getLinkIdentifier(identifier: string) {
	return new Promise<any>((resolve, reject) => {
		const db = getDatabase();

		db.get("SELECT * FROM link_identifiers WHERE uuid = ?", [identifier], (err, row) => {
			if (err) {
				console.error("Database query error:", err);
				reject(err);
			} else {
				resolve(row);
			}
		});

		db.close();
	});
}

// Check if RSVP exists for link identifier
async function checkExistingRSVPByLink(linkId: number) {
	return new Promise<any>((resolve, reject) => {
		const db = getDatabase();

		db.get("SELECT * FROM rsvps WHERE link_identifier_id = ? ORDER BY created_at DESC LIMIT 1", [linkId], (err, row) => {
			if (err) {
				console.error("Database query error:", err);
				reject(err);
			} else {
				resolve(row);
			}
		});

		db.close();
	});
}

// Update existing RSVP
async function updateRSVPByLink(linkId: number, data: any) {
	return new Promise<void>((resolve, reject) => {
		const db = getDatabase();

		db.run(
			`UPDATE rsvps SET 
        full_name = ?, email = ?, phone = ?, company = ?, attending = ?, 
        has_guests = ?, guest_count = ?, donation = ?, 
        created_at = CURRENT_TIMESTAMP
      WHERE link_identifier_id = ?`,
			[
				data.fullName,
				data.email,
				data.phone,
				data.company || "",
				data.attending,
				data.hasGuests || "",
				data.guestCount || 0,
				data.donation || "",
				linkId,
			],
			(err) => {
				if (err) {
					console.error("Database update error:", err);
					reject(err);
				} else {
					console.log("RSVP updated successfully for link ID:", linkId);
					resolve();
				}
			}
		);

		db.close();
	});
}

// Insert new RSVP data
async function insertRSVPWithLink(data: any, linkId: number, isHidden = false) {
	return new Promise<void>((resolve, reject) => {
		const db = getDatabase();

		db.run(
			`INSERT INTO rsvps (
        full_name, email, phone, company, attending, 
        has_guests, guest_count, donation, link_identifier_id, is_hidden
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.fullName,
				data.email,
				data.phone,
				data.company || "",
				data.attending,
				data.hasGuests || "",
				data.guestCount || 0,
				data.donation || "",
				linkId,
				isHidden ? 1 : 0,
			],
			function (err) {
				if (err) {
					console.error("Database insert error:", err);
					reject(err);
				} else {
					console.log("RSVP inserted successfully with ID:", this.lastID);
					resolve();
				}
			}
		);

		db.close();
	});
}

export async function POST(request: NextRequest) {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.fullName || !data.email || !data.phone || !data.attending || !data.linkIdentifier) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Get link identifier data
		const linkData = await getLinkIdentifier(data.linkIdentifier);
		if (!linkData) {
			return NextResponse.json({ error: "Invalid link identifier" }, { status: 400 });
		}

		// Validate guest count for non-VIP links
		if (!linkData.is_vip && data.hasGuests === "yes" && data.guestCount > 0) {
			return NextResponse.json(
				{
					error: "Guest privileges are only available for VIP invitations",
				},
				{ status: 400 }
			);
		}

		// Validate guest count limit for VIP links
		if (linkData.is_vip && data.hasGuests === "yes" && data.guestCount > 1) {
			return NextResponse.json(
				{
					error: "Maximum of 1 guest allowed per VIP attendee",
				},
				{ status: 400 }
			);
		}

		// Check if RSVP already exists for this link
		const existingRSVP = await checkExistingRSVPByLink(linkData.id);

		if (existingRSVP) {
			// Update existing RSVP
			await updateRSVPByLink(linkData.id, data);
		} else {
			// Insert new RSVP
			await insertRSVPWithLink(data, linkData.id);
		}

		// Send confirmation email to user
		if (data.attending === "yes") {
			try {
				await resend.emails.send({
					from: "MaubenTech Roots <noreply@maubentech.com>",
					to: [data.email],
					subject: "RSVP Confirmation - Corporate Cocktail & Fundraiser Evening",
					react: RSVPConfirmationEmail({ data }),
				});
				console.log("Confirmation email sent successfully to:", data.email);
			} catch (emailError) {
				console.error("Error sending confirmation email:", emailError);
			}

			// Send internal notification
			try {
				await resend.emails.send({
					from: "RSVP System <noreply@maubentech.com>",
					to: ["events@maubentech.com"], // Replace with actual internal email
					subject: `${existingRSVP ? "Updated" : "New"} ${linkData.is_vip ? "VIP " : ""}RSVP Received - Corporate Cocktail Evening`,
					react: InternalNotificationEmail({
						data: {
							...data,
							isVip: linkData.is_vip,
							linkIdentifier: data.linkIdentifier,
						},
					}),
				});
				console.log("Internal notification sent successfully");
			} catch (emailError) {
				console.error("Error sending internal notification:", emailError);
			}
		} else if (data.attending === "no") {
			// Send confirmation email for "no" responses too
			try {
				await resend.emails.send({
					from: "MaubenTech Roots <noreply@maubentech.com>",
					to: [data.email],
					subject: "Thank you for your response - Corporate Cocktail & Fundraiser Evening",
					react: RSVPConfirmationEmail({ data }),
				});
				console.log("Response confirmation email sent successfully to:", data.email);
			} catch (emailError) {
				console.error("Error sending response confirmation email:", emailError);
			}
		}

		return NextResponse.json({
			success: true,
			message: existingRSVP ? "RSVP updated successfully" : "RSVP submitted successfully",
			isUpdate: !!existingRSVP,
		});
	} catch (error) {
		console.error("RSVP submission error:", error);
		return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
	}
}
