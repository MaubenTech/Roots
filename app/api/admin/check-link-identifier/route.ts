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

// Check if link identifier exists
async function checkLinkIdentifierExists(uuid: string) {
	return new Promise<any>((resolve, reject) => {
		const db = getDatabase();

		db.get("SELECT id, uuid, is_vip, tracking_number FROM link_identifiers WHERE uuid = ?", [uuid], (err, row) => {
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

export async function POST(request: NextRequest) {
	try {
		// Verify admin authentication
		if (!verifyAdmin(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { linkIdentifier } = await request.json();

		if (!linkIdentifier) {
			return NextResponse.json({ error: "Link identifier is required" }, { status: 400 });
		}

		const existingLink = await checkLinkIdentifierExists(linkIdentifier);

		return NextResponse.json({
			exists: !!existingLink,
			linkData: existingLink || null,
		});
	} catch (error) {
		console.error("Error checking link identifier:", error);
		return NextResponse.json({ error: "Failed to check link identifier" }, { status: 500 });
	}
}
