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

		db.all("SELECT * FROM rsvps ORDER BY created_at DESC", (err, rows) => {
			if (err) {
				console.error("Database query error:", err);
				reject(err);
			} else {
				resolve(rows);
			}
		});

		db.close();
	});
}

export async function GET(request: NextRequest) {
	try {
		// Verify authentication
		const authHeader = request.headers.get("authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const token = authHeader.substring(7);

		try {
			const decoded = verify(token, JWT_SECRET!) as any; // Non-null assertion operator

			if (!decoded.admin) {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				);
			}
		} catch (jwtError) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}

		// Fetch RSVPs if authenticated
		const rsvps = await getAllRSVPs();
		return NextResponse.json({ rsvps });
	} catch (error) {
		console.error("Error fetching RSVPs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch RSVPs" },
			{ status: 500 }
		);
	}
}
