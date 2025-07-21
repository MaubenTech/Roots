import { type NextRequest, NextResponse } from "next/server";
import { Database } from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "rsvp.db");

function getDatabase() {
	return new Database(dbPath);
}

async function validateLinkIdentifier(identifier: string) {
	return new Promise<any>((resolve, reject) => {
		const db = getDatabase();

		db.get(
			`SELECT li.*, r.id as rsvp_id, r.full_name, r.email, r.phone, r.company, 
              r.attending, r.has_guests, r.guest_count, r.donation, r.created_at as rsvp_created_at
       FROM link_identifiers li
       LEFT JOIN rsvps r ON li.id = r.link_identifier_id
       WHERE li.uuid = ?`,
			[identifier],
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
		const { identifier } = await request.json();

		if (!identifier) {
			return NextResponse.json({ error: "Identifier is required" }, { status: 400 });
		}

		const linkData = await validateLinkIdentifier(identifier);

		if (!linkData) {
			return NextResponse.json({ valid: false, error: "Invalid link identifier" }, { status: 404 });
		}

		// Check if there's already an RSVP for this link
		const existingRSVP = linkData.rsvp_id
			? {
					id: linkData.rsvp_id,
					full_name: linkData.full_name,
					email: linkData.email,
					phone: linkData.phone,
					company: linkData.company,
					attending: linkData.attending,
					has_guests: linkData.has_guests,
					guest_count: linkData.guest_count,
					donation: linkData.donation,
					created_at: linkData.rsvp_created_at,
				}
			: null;

		return NextResponse.json({
			valid: true,
			linkData: {
				id: linkData.id,
				uuid: linkData.uuid,
				is_vip: Boolean(linkData.is_vip),
				is_test: linkData.uuid.startsWith("test-"), // Detect test by prefix
				existingRSVP,
			},
		});
	} catch (error) {
		console.error("Error validating link identifier:", error);
		return NextResponse.json({ error: "Validation failed" }, { status: 500 });
	}
}
