const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "rsvp.db");

console.log("Updating database schema...");

const db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.error("Error opening database:", err);
		return;
	}
	console.log("Connected to SQLite database");
});

// Read and execute the SQL file
const sqlFile = path.join(process.cwd(), "scripts", "create-link-identifiers.sql");
const sql = fs.readFileSync(sqlFile, "utf8");

// Split SQL statements and execute them
const statements = sql.split(";").filter((stmt) => stmt.trim().length > 0);

db.serialize(() => {
	statements.forEach((statement, index) => {
		db.run(statement + ";", (err) => {
			if (err) {
				console.error(`Error executing statement ${index + 1}:`, err);
			} else {
				console.log(`Statement ${index + 1} executed successfully`);
			}
		});
	});
});

db.close((err) => {
	if (err) {
		console.error("Error closing database:", err);
	} else {
		console.log("Database connection closed");
		console.log("Schema update completed!");
	}
});
