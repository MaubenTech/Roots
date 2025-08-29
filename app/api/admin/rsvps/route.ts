import { type NextRequest, NextResponse } from "next/server";
import { Database } from "sqlite3";
import { verify } from "jsonwebtoken";
import path from "path";

const dbPath = path.join(process.cwd(), "rsvp.db");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}

function getDatabase() {
	return new Database(dbPath);
}

async function getAllRSVPs() {
	return new Promise<any[]>((resolve, reject) => {
		const db = getDatabase();

		db.all(
			`SELECT r.*, li.uuid as link_uuid, li.is_vip, 
          CASE WHEN li.uuid LIKE 'test-%' THEN 1 ELSE 0 END as is_test
   FROM rsvps r
   JOIN link_identifiers li ON r.link_identifier_id = li.id
   ORDER BY r.created_at DESC`,
			(err, rows) => {
				if (err) {
					console.error("Database query error:", err);
					reject(err);
				} else {
					resolve(rows);
				}
			}
		);

		db.close();
	});
}

// Add new function to get hidden RSVPs
async function getHiddenRSVPs() {
	return new Promise<any[]>((resolve, reject) => {
		const db = getDatabase();

		db.all(
			`SELECT r.*, li.uuid as link_uuid, li.is_vip, 
          CASE WHEN li.uuid LIKE 'test-%' THEN 1 ELSE 0 END as is_test
   FROM rsvps r
   JOIN link_identifiers li ON r.link_identifier_id = li.id
   WHERE r.is_hidden = 1 AND li.uuid NOT LIKE 'test-%'
   ORDER BY r.created_at DESC`,
			(err, rows) => {
				if (err) {
					console.error("Database query error:", err);
					reject(err);
				} else {
					resolve(rows);
				}
			}
		);

		db.close();
	});
}

export async function GET(request: NextRequest) {
	try {
		// Verify authentication
		const authHeader = request.headers.get("authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.substring(7);

		try {
			const decoded = verify(token, JWT_SECRET!) as any; // Non-null assertion operator

			if (!decoded.admin) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		} catch (jwtError) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		// Check if requesting hidden RSVPs
		const url = new URL(request.url);
		const includeHidden = url.searchParams.get("includeHidden") === "true";

		if (includeHidden) {
			// Return hidden RSVPs
			const hiddenRsvps = await getHiddenRSVPs();
			return NextResponse.json({ rsvps: hiddenRsvps, type: "hidden" });
		}

		// Fetch regular RSVPs if authenticated
		const allRsvps = await getAllRSVPs();

		// Separate production and test RSVPs, excluding hidden ones
		const productionRsvps = allRsvps.filter((rsvp: any) => !rsvp.is_test && !rsvp.is_hidden);
		const testRsvps = allRsvps.filter((rsvp: any) => rsvp.is_test);

		return NextResponse.json({
			rsvps: productionRsvps,
			testRsvps,
			type: "regular",
		});
	} catch (error) {
		console.error("Error fetching RSVPs:", error);
		return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
	}
}
