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

// Initialize database table
async function initializeDatabase() {
	return new Promise<void>((resolve, reject) => {
		const db = getDatabase();

		db.serialize(() => {
			db.run(
				`
        CREATE TABLE IF NOT EXISTS rsvps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          company TEXT,
          attending TEXT NOT NULL,
          has_guests TEXT,
          guest_count INTEGER DEFAULT 0,
          donation TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
				(err) => {
					if (err) {
						console.error("Database initialization error:", err);
						reject(err);
					} else {
						console.log("Database initialized successfully");
						resolve();
					}
				}
			);
		});

		db.close();
	});
}

// Check if RSVP exists for email
async function checkExistingRSVP(email: string) {
	return new Promise<any>((resolve, reject) => {
		const db = getDatabase();

		db.get(
			"SELECT * FROM rsvps WHERE email = ? ORDER BY created_at DESC LIMIT 1",
			[email],
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

// Update existing RSVP
async function updateRSVP(email: string, data: any) {
	return new Promise<void>((resolve, reject) => {
		const db = getDatabase();

		db.run(
			`UPDATE rsvps SET 
        full_name = ?, phone = ?, company = ?, attending = ?, 
        has_guests = ?, guest_count = ?, donation = ?, 
        created_at = CURRENT_TIMESTAMP
      WHERE email = ?`,
			[
				data.fullName,
				data.phone,
				data.company || "",
				data.attending,
				data.hasGuests || "",
				data.guestCount || 0,
				data.donation || "",
				email,
			],
			(err) => {
				if (err) {
					console.error("Database update error:", err);
					reject(err);
				} else {
					console.log("RSVP updated successfully for email:", email);
					resolve();
				}
			}
		);

		db.close();
	});
}

// Insert new RSVP data
async function insertRSVP(data: any) {
	return new Promise<void>((resolve, reject) => {
		const db = getDatabase();

		db.run(
			`INSERT INTO rsvps (
        full_name, email, phone, company, attending, 
        has_guests, guest_count, donation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.fullName,
				data.email,
				data.phone,
				data.company || "",
				data.attending,
				data.hasGuests || "",
				data.guestCount || 0,
				data.donation || "",
			],
			function (err) {
				if (err) {
					console.error("Database insert error:", err);
					reject(err);
				} else {
					console.log(
						"RSVP inserted successfully with ID:",
						this.lastID
					);
					resolve();
				}
			}
		);

		db.close();
	});
}

export async function POST(request: NextRequest) {
	try {
		// Initialize database first
		await initializeDatabase();

		const data = await request.json();

		// Validate required fields
		if (!data.fullName || !data.email || !data.phone || !data.attending) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Validate guest count limit
		if (data.hasGuests === "yes" && data.guestCount > 1) {
			return NextResponse.json(
				{
					error: "Maximum of 1 guest allowed per attendee",
				},
				{ status: 400 }
			);
		}

		// Check if RSVP already exists
		const existingRSVP = await checkExistingRSVP(data.email);

		if (existingRSVP) {
			// Update existing RSVP
			await updateRSVP(data.email, data);
		} else {
			// Insert new RSVP
			await insertRSVP(data);
		}

		// Send confirmation email to user
		if (data.attending === "yes") {
			try {
				await resend.emails.send({
					from: "MaubenTech Roots <events@maubentech.com>",
					to: [data.email],
					subject:
						"RSVP Confirmation - Corporate Cocktail & Fundraiser Evening",
					react: RSVPConfirmationEmail({ data }),
				});
			} catch (emailError) {
				console.error("Error sending confirmation email:", emailError);
			}

			// Send internal notification
			try {
				await resend.emails.send({
					from: "RSVP System <info@maubentech.com>",
					to: ["events@maubentech.com"], // Replace with actual internal email
					subject: `${existingRSVP ? "Updated" : "New"} RSVP Received - Corporate Cocktail Evening`,
					react: InternalNotificationEmail({ data }),
				});
			} catch (emailError) {
				console.error(
					"Error sending internal notification:",
					emailError
				);
			}
		}

		return NextResponse.json({
			success: true,
			message: existingRSVP
				? "RSVP updated successfully"
				: "RSVP submitted successfully",
			isUpdate: !!existingRSVP,
		});
	} catch (error) {
		console.error("RSVP submission error:", error);
		return NextResponse.json(
			{ error: "Failed to submit RSVP" },
			{ status: 500 }
		);
	}
}
