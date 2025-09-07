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
	return new Promise<boolean>((resolve, reject) => {
		const db = getDatabase();

		db.get("SELECT id FROM link_identifiers WHERE uuid = ?", [uuid], (err, row) => {
			if (err) {
				console.error("Database query error:", err);
				reject(err);
			} else {
				resolve(!!row);
			}
		});

		db.close();
	});
}

// Create new link identifier
async function createLinkIdentifier(uuid: string, isVip: boolean, isHidden: boolean) {
	return new Promise<number>((resolve, reject) => {
		const db = getDatabase();

		// Get the next tracking number
		db.get(
			"SELECT MAX(tracking_number) as max_tracking FROM link_identifiers WHERE tracking_number < 1000",
			(err, row: { max_tracking?: number } | undefined) => {
				if (err) {
					console.error("Error getting max tracking number:", err);
					reject(err);
					return;
				}

				const nextTrackingNumber = (row?.max_tracking || 0) + 1;

				// Insert link identifier
				db.run(
					"INSERT INTO link_identifiers (tracking_number, uuid, is_vip, is_test, is_hidden) VALUES (?, ?, ?, 0, ?)",
					[nextTrackingNumber, uuid, isVip ? 1 : 0, isHidden ? 1 : 0],
					function (err) {
						if (err) {
							console.error("Database insert error:", err);
							reject(err);
						} else {
							console.log(`Link identifier created with ID: ${this.lastID}, Tracking: ${nextTrackingNumber}`);
							resolve(this.lastID);
						}
					}
				);
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

		const { linkIdentifier, isVip, isHidden } = await request.json();

		if (!linkIdentifier) {
			return NextResponse.json({ error: "Link identifier is required" }, { status: 400 });
		}

		// Check if link identifier already exists
		const exists = await checkLinkIdentifierExists(linkIdentifier);
		if (exists) {
			return NextResponse.json({ error: "Link identifier already exists in database" }, { status: 400 });
		}

		// Create the link identifier
		const linkId = await createLinkIdentifier(linkIdentifier, isVip || false, isHidden || false);

		return NextResponse.json({
			success: true,
			message: "Link identifier created successfully",
			linkId,
			linkIdentifier,
			isVip: isVip || false,
			isHidden: isHidden || false,
		});
	} catch (error) {
		console.error("Error creating link identifier:", error);
		return NextResponse.json({ error: "Failed to create link identifier" }, { status: 500 });
	}
}
