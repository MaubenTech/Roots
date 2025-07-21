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

// Delete all test data
async function cleanupTestData() {
	return new Promise<{ rsvpsDeleted: number; linksDeleted: number }>((resolve, reject) => {
		const db = getDatabase();

		db.serialize(() => {
			let rsvpsDeleted = 0;
			let linksDeleted = 0;

			// Delete RSVPs associated with test link identifiers
			db.run(
				`DELETE FROM rsvps WHERE link_identifier_id IN (
          SELECT id FROM link_identifiers WHERE uuid LIKE 'test-%'
        )`,
				function (err) {
					if (err) {
						console.error("Error deleting test RSVPs:", err);
						reject(err);
						return;
					}
					rsvpsDeleted = this.changes;
					console.log(`Deleted ${rsvpsDeleted} test RSVPs`);

					// Delete test link identifiers
					db.run("DELETE FROM link_identifiers WHERE uuid LIKE 'test-%'", function (err) {
						if (err) {
							console.error("Error deleting test link identifiers:", err);
							reject(err);
							return;
						}
						linksDeleted = this.changes;
						console.log(`Deleted ${linksDeleted} test link identifiers`);

						resolve({ rsvpsDeleted, linksDeleted });
					});
				}
			);
		});

		db.close();
	});
}

export async function DELETE(request: NextRequest) {
	try {
		// Verify admin authentication
		if (!verifyAdmin(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await cleanupTestData();

		return NextResponse.json({
			success: true,
			message: `Successfully cleaned up test data: ${result.rsvpsDeleted} RSVPs and ${result.linksDeleted} link identifiers deleted`,
			rsvpsDeleted: result.rsvpsDeleted,
			linksDeleted: result.linksDeleted,
		});
	} catch (error) {
		console.error("Error cleaning up test data:", error);
		return NextResponse.json({ error: "Failed to cleanup test data" }, { status: 500 });
	}
}
