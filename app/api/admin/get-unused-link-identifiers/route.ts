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

// Get unused link identifiers
async function getUnusedLinkIdentifiers() {
	return new Promise<Array<{ uuid: string; tracking_number: number; is_vip: boolean }>>((resolve, reject) => {
		const db = getDatabase();

		db.all(
			`SELECT li.uuid, li.tracking_number, li.is_vip 
       FROM link_identifiers li 
       LEFT JOIN rsvps r ON li.id = r.link_identifier_id 
       WHERE r.id IS NULL 
       ORDER BY li.tracking_number ASC`,
			(err, rows: Array<{ uuid: string; tracking_number: number; is_vip: boolean }>) => {
				if (err) {
					console.error("Database query error:", err);
					reject(err);
				} else {
					resolve(rows || []);
				}
			}
		);

		db.close();
	});
}

export async function GET(request: NextRequest) {
	try {
		// Verify admin authentication
		if (!verifyAdmin(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const unusedLinkIdentifiers = await getUnusedLinkIdentifiers();

		return NextResponse.json({
			success: true,
			linkIdentifiers: unusedLinkIdentifiers,
		});
	} catch (error) {
		console.error("Error fetching unused link identifiers:", error);
		return NextResponse.json({ error: "Failed to fetch unused link identifiers" }, { status: 500 });
	}
}
