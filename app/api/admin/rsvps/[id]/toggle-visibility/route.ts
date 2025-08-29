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

// Toggle RSVP visibility
async function toggleRSVPVisibility(id: string, isHidden: boolean) {
	return new Promise<boolean>((resolve, reject) => {
		const db = getDatabase();

		db.run("UPDATE rsvps SET is_hidden = ? WHERE id = ?", [isHidden ? 1 : 0, id], function (err) {
			if (err) {
				console.error("Database update error:", err);
				reject(err);
			} else {
				console.log(`RSVP visibility updated. Rows affected: ${this.changes}`);
				resolve(this.changes > 0);
			}
		});

		db.close();
	});
}

// POST endpoint to toggle visibility
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		// Verify admin authentication
		if (!verifyAdmin(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = params;
		const { isHidden } = await request.json();

		if (!id) {
			return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
		}

		if (typeof isHidden !== "boolean") {
			return NextResponse.json({ error: "isHidden must be a boolean" }, { status: 400 });
		}

		const updated = await toggleRSVPVisibility(id, isHidden);

		if (updated) {
			return NextResponse.json({
				success: true,
				message: `RSVP ${isHidden ? "hidden" : "shown"} successfully`,
			});
		} else {
			return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error toggling RSVP visibility:", error);
		return NextResponse.json({ error: "Failed to toggle RSVP visibility" }, { status: 500 });
	}
}
