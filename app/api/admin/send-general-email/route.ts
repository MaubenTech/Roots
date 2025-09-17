import { type NextRequest, NextResponse } from "next/server";
import { Database } from "sqlite3";
import { verify } from "jsonwebtoken";
import path from "path";
import { Resend } from "resend";
import { RSVPConfirmationEmail } from "@/components/emails/rsvp-confirmation";
import { ReminderEmail } from "@/components/emails/reminder-email";
import { CustomEmail } from "@/components/emails/custom-email";
import { InviteEmail } from "@/components/emails/invite-email";
import { InternalNotificationEmail } from "@/components/emails/internal-notification";
import { MaubenTechRSVPConfirmationEmail } from "@/components/emails/maubentech/rsvp-confirmation";
import { MaubenTechReminderEmail } from "@/components/emails/maubentech/reminder-email";
import { MaubenTechCustomEmail } from "@/components/emails/maubentech/custom-email";
import { MaubenTechInviteEmail } from "@/components/emails/maubentech/invite-email";
import { MaubenTechInternalNotificationEmail } from "@/components/emails/maubentech/internal-notification";

const resend = new Resend(process.env.RESEND_API_KEY);
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
async function createLinkIdentifier(uuid: string, isVip: boolean, isHidden = false) {
	return new Promise<void>((resolve, reject) => {
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
					"INSERT INTO link_identifiers (tracking_number, uuid, is_vip) VALUES (?, ?, ?)",
					[nextTrackingNumber, uuid, isVip ? 1 : 0],
					function (err) {
						if (err) {
							console.error("Database insert error:", err);
							reject(err);
						} else {
							console.log(`Link identifier created with ID: ${this.lastID}, Tracking: ${nextTrackingNumber}`);

							// If this is a hidden invitation, we'll handle it when the RSVP is submitted
							// For now, just resolve the promise
							resolve();
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

		const formData = await request.formData();
		const emailType = formData.get("emailType") as string;
		const template = (formData.get("template") as string) || "roots";
		const recipientsJson = formData.get("recipients") as string;
		const customSubject = formData.get("customSubject") as string;
		const customMessage = formData.get("customMessage") as string;
		const linkIdentifier = formData.get("linkIdentifier") as string;
		const isVip = formData.get("isVip") === "true";
		const isHidden = formData.get("isHidden") === "true";
		const siteUrl = formData.get("siteUrl") as string;
		const useExistingLink = formData.get("useExistingLink") === "true";

		if (!emailType || !recipientsJson) {
			return NextResponse.json({ error: "Email type and recipients are required" }, { status: 400 });
		}

		let recipients;
		try {
			recipients = JSON.parse(recipientsJson);
		} catch (error) {
			return NextResponse.json({ error: "Invalid recipients format" }, { status: 400 });
		}

		if (!Array.isArray(recipients) || recipients.length === 0) {
			return NextResponse.json({ error: "Recipients must be a non-empty array" }, { status: 400 });
		}

		// Validate recipients format
		for (const recipient of recipients) {
			if (!recipient.email || !recipient.fullName) {
				return NextResponse.json({ error: "Each recipient must have email and fullName" }, { status: 400 });
			}
		}

		// Handle file attachments
		const attachments: any[] = [];
		const files = formData.getAll("attachments") as File[];

		for (const file of files) {
			if (file && file.size > 0) {
				const buffer = await file.arrayBuffer();
				attachments.push({
					filename: file.name,
					content: Buffer.from(buffer),
				});
			}
		}

		// Special handling for invite emails
		if (emailType === "invite") {
			if (!linkIdentifier) {
				return NextResponse.json({ error: "Link identifier is required for invite emails" }, { status: 400 });
			}

			// Only create new link identifier if not using existing one
			if (!useExistingLink) {
				// Check if link identifier already exists (only for new links)
				const exists = await checkLinkIdentifierExists(linkIdentifier);
				if (exists) {
					return NextResponse.json({ error: "Link identifier already exists in database" }, { status: 400 });
				}

				// Create the link identifier in database
				await createLinkIdentifier(linkIdentifier, isVip || false, isHidden || false);
			}
			// If using existing link, we don't need to create or check - it already exists and is unused
		}

		let emailSubject = "";
		let successCount = 0;
		let failureCount = 0;
		const errors: string[] = [];

		// Determine sender email based on template
		const fromEmail = template === "maubentech" ? "MaubenTech <noreply@maubentech.com>" : "MaubenTech Roots <events@maubentech.com>";

		// Send emails to all recipients
		for (const recipient of recipients) {
			try {
				let emailComponent = null;

				// Determine email type and content
				switch (emailType) {
					case "confirmation":
						emailSubject = "RSVP Confirmation - Corporate Cocktail & Fundraiser Evening";
						emailComponent =
							template === "maubentech"
								? MaubenTechRSVPConfirmationEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											phone: recipient.phone || "",
											company: recipient.company || "",
											attending: "yes", // Default for general emails
											hasGuests: "",
											guestCount: 0,
											donation: "",
										},
									})
								: RSVPConfirmationEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											phone: recipient.phone || "",
											company: recipient.company || "",
											attending: "yes", // Default for general emails
											hasGuests: "",
											guestCount: 0,
											donation: "",
										},
									});
						break;

					case "reminder":
						emailSubject = "Event Reminder - Corporate Cocktail & Fundraiser Evening";
						emailComponent =
							template === "maubentech"
								? MaubenTechReminderEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											attending: "yes", // Default for general emails
										},
									})
								: ReminderEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											attending: "yes", // Default for general emails
										},
									});
						break;

					case "internal":
						emailSubject = "Internal Notification - Corporate Cocktail & Fundraiser Evening";
						emailComponent =
							template === "maubentech"
								? MaubenTechInternalNotificationEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											phone: recipient.phone || "",
											company: recipient.company || "",
											attending: "yes",
											hasGuests: "",
											guestCount: 0,
											donation: "",
										},
									})
								: InternalNotificationEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											phone: recipient.phone || "",
											company: recipient.company || "",
											attending: "yes",
											hasGuests: "",
											guestCount: 0,
											donation: "",
										},
									});
						break;

					case "invite":
						emailSubject = `You're Invited - Corporate Cocktail & Fundraiser Evening${isVip ? " (VIP)" : ""}`;
						emailComponent =
							template === "maubentech"
								? MaubenTechInviteEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											linkIdentifier: linkIdentifier!,
											isVip: isVip || false,
										},
										siteUrl: siteUrl || "https://roots.maubentech.com",
									})
								: InviteEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
											linkIdentifier: linkIdentifier!,
											isVip: isVip || false,
										},
										siteUrl: siteUrl || "https://roots.maubentech.com",
									});
						break;

					case "custom":
						if (!customSubject || !customMessage) {
							errors.push(`Custom subject and message are required for ${recipient.email}`);
							failureCount++;
							continue;
						}
						emailSubject = customSubject;
						emailComponent =
							template === "maubentech"
								? MaubenTechCustomEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
										},
										subject: customSubject,
										message: customMessage,
									})
								: CustomEmail({
										data: {
											fullName: recipient.fullName,
											email: recipient.email,
										},
										subject: customSubject,
										message: customMessage,
									});
						break;

					default:
						errors.push(`Invalid email type for ${recipient.email}`);
						failureCount++;
						continue;
				}

				// Send email
				const emailOptions: any = {
					from: fromEmail,
					to: [recipient.email],
					subject: emailSubject,
					react: emailComponent,
				};

				// Add attachments if any
				if (attachments.length > 0) {
					emailOptions.attachments = attachments;
				}

				await resend.emails.send(emailOptions);

				console.log(`${emailType} email sent successfully to:`, recipient.email);
				successCount++;
			} catch (emailError) {
				console.error(`Error sending email to ${recipient.email}:`, emailError);
				errors.push(`Failed to send email to ${recipient.email}`);
				failureCount++;
			}
		}

		return NextResponse.json({
			success: true,
			message: `Email sending completed. ${successCount} successful, ${failureCount} failed.`,
			successCount,
			failureCount,
			errors: errors.length > 0 ? errors : undefined,
		});
	} catch (error) {
		console.error("Error in send general email route:", error);
		return NextResponse.json({ error: "Failed to process email request" }, { status: 500 });
	}
}
