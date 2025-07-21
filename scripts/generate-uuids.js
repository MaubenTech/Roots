/**
 * Utility script to generate random UUIDs for link identifiers
 * This script is for reference only and not meant to be executed directly
 */

function generateUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// Generate VIP UUIDs
console.log("VIP UUIDs:");
for (let i = 0; i < 20; i++) {
	console.log(generateUUID());
}

// Generate Regular UUIDs
console.log("\nRegular UUIDs:");
for (let i = 0; i < 30; i++) {
	console.log(generateUUID());
}

// Generate Test UUIDs
console.log("\nTest UUIDs:");
console.log("VIP Test:");
for (let i = 0; i < 3; i++) {
	console.log(`test-${generateUUID()}`);
}
console.log("Regular Test:");
for (let i = 0; i < 3; i++) {
	console.log(`test-${generateUUID()}`);
}
