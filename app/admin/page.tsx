"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Trash2, Edit, MoreHorizontal, Download, TestTube, Mail, Send, Plus, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RSVP {
	id: number;
	full_name: string;
	email: string;
	phone: string;
	company: string;
	attending: string;
	has_guests: string;
	guest_count: number;
	donation: string;
	created_at: string;
	link_identifier_id: number;
	link_uuid: string;
	is_vip: boolean;
	is_test: boolean;
	is_hidden?: boolean;
}

interface EmailRecipient {
	fullName: string;
	email: string;
	phone?: string;
	company?: string;
}

interface UnusedLinkIdentifier {
	uuid: string;
	tracking_number: number;
	is_vip: boolean;
}

export default function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [rsvps, setRsvps] = useState<RSVP[]>([]);
	const [testRsvps, setTestRsvps] = useState<RSVP[]>([]);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("production");

	// Delete functionality
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [rsvpToDelete, setRsvpToDelete] = useState<RSVP | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Edit functionality
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [rsvpToEdit, setRsvpToEdit] = useState<RSVP | null>(null);
	const [editFormData, setEditFormData] = useState({
		full_name: "",
		email: "",
		phone: "",
		company: "",
		attending: "",
		has_guests: "",
		guest_count: 0,
		donation: "",
	});
	const [isUpdating, setIsUpdating] = useState(false);

	// Add these new state variables after the existing ones
	const [hiddenRsvps, setHiddenRsvps] = useState<RSVP[]>([]);
	const [showingHidden, setShowingHidden] = useState(false);
	const [isToggling, setIsToggling] = useState<string | null>(null);

	// Test data cleanup
	const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
	const [isCleaningUp, setIsCleaningUp] = useState(false);

	// Email functionality
	const [emailDialogOpen, setEmailDialogOpen] = useState(false);
	const [emailRSVP, setEmailRSVP] = useState<RSVP | null>(null);
	const [emailType, setEmailType] = useState("");
	const [customSubject, setCustomSubject] = useState("");
	const [customMessage, setCustomMessage] = useState("");
	const [isSendingEmail, setIsSendingEmail] = useState(false);

	// General email functionality
	const [generalEmailDialogOpen, setGeneralEmailDialogOpen] = useState(false);
	const [generalEmailType, setGeneralEmailType] = useState("");
	const [generalCustomSubject, setGeneralCustomSubject] = useState("");
	const [generalCustomMessage, setGeneralCustomMessage] = useState("");
	const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([{ fullName: "", email: "" }]);
	const [isSendingGeneralEmail, setIsSendingGeneralEmail] = useState(false);

	// Invite email specific fields
	const [inviteLinkIdentifier, setInviteLinkIdentifier] = useState("");
	const [inviteIsVip, setInviteIsVip] = useState(false);
	const [inviteSiteUrl, setInviteSiteUrl] = useState("https://roots.maubentech.com");
	const [isCheckingLinkIdentifier, setIsCheckingLinkIdentifier] = useState(false);
	const [linkIdentifierError, setLinkIdentifierError] = useState("");

	// Add to the existing state for general emails
	const [inviteIsHidden, setInviteIsHidden] = useState(false);

	// New state for link identifier selection
	const [linkIdentifierMode, setLinkIdentifierMode] = useState<"new" | "existing">("new");
	const [unusedLinkIdentifiers, setUnusedLinkIdentifiers] = useState<UnusedLinkIdentifier[]>([]);
	const [selectedExistingLinkId, setSelectedExistingLinkId] = useState("");
	const [isLoadingUnusedLinks, setIsLoadingUnusedLinks] = useState(false);

	// WhatsApp state variables
	const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
	const [whatsappRecipient, setWhatsappRecipient] = useState({ fullName: "", phone: "" });
	const [whatsappLinkIdentifier, setWhatsappLinkIdentifier] = useState("");
	const [whatsappIsVip, setWhatsappIsVip] = useState(false);
	const [whatsappIsHidden, setWhatsappIsHidden] = useState(false);
	const [whatsappSiteUrl, setWhatsappSiteUrl] = useState("https://roots.maubentech.com");
	const [whatsappLinkMode, setWhatsappLinkMode] = useState<"new" | "existing">("new");
	const [whatsappSelectedExistingLinkId, setWhatsappSelectedExistingLinkId] = useState("");
	const [whatsappLinkIdentifierError, setWhatsappLinkIdentifierError] = useState("");
	const [isCheckingWhatsappLinkIdentifier, setIsCheckingWhatsappLinkIdentifier] = useState(false);

	useEffect(() => {
		// Check if user is already authenticated
		const token = localStorage.getItem("admin_token");
		if (token) {
			verifyToken(token);
		} else {
			setIsCheckingAuth(false);
		}
	}, []);

	useEffect(() => {
		if (activeTab === "hidden" && !showingHidden) {
			fetchRSVPs(true);
		}
	}, [activeTab]);

	const verifyToken = async (token: string) => {
		try {
			const response = await fetch("/api/admin/verify", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				setIsAuthenticated(true);
				fetchRSVPs();
			} else {
				// Token is invalid, remove it
				localStorage.removeItem("admin_token");
				setIsAuthenticated(false);
			}
		} catch (error) {
			console.error("Token verification failed:", error);
			localStorage.removeItem("admin_token");
			setIsAuthenticated(false);
		} finally {
			setIsCheckingAuth(false);
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoggingIn(true);
		setLoginError("");

		try {
			const response = await fetch("/api/admin/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password }),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("admin_token", data.token);
				setIsAuthenticated(true);
				setPassword("");
				fetchRSVPs();
			} else {
				setLoginError(data.error || "Invalid password");
			}
		} catch (error) {
			console.error("Login error:", error);
			setLoginError("Login failed. Please try again.");
		} finally {
			setIsLoggingIn(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("admin_token");
		setIsAuthenticated(false);
		setRsvps([]);
		setTestRsvps([]);
	};

	const fetchRSVPs = async (includeHidden = false) => {
		setLoading(true);
		try {
			const token = localStorage.getItem("admin_token");
			const url = includeHidden ? "/api/admin/rsvps?includeHidden=true" : "/api/admin/rsvps";

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();

				if (data.type === "hidden") {
					setHiddenRsvps(data.rsvps || []);
					setShowingHidden(true);
				} else {
					const allRsvps = data.rsvps || [];
					const testRsvpsData = data.testRsvps || [];

					setRsvps(allRsvps);
					setTestRsvps(testRsvpsData);
					setShowingHidden(false);
				}
			} else {
				// If fetch fails due to auth, logout
				if (response.status === 401) {
					handleLogout();
				}
			}
		} catch (error) {
			console.error("Error fetching RSVPs:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchUnusedLinkIdentifiers = async () => {
		setIsLoadingUnusedLinks(true);
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch("/api/admin/get-unused-link-identifiers", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUnusedLinkIdentifiers(data.linkIdentifiers || []);
			} else {
				console.error("Failed to fetch unused link identifiers");
				setUnusedLinkIdentifiers([]);
			}
		} catch (error) {
			console.error("Error fetching unused link identifiers:", error);
			setUnusedLinkIdentifiers([]);
		} finally {
			setIsLoadingUnusedLinks(false);
		}
	};

	const handleDeleteClick = (rsvp: RSVP) => {
		setRsvpToDelete(rsvp);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!rsvpToDelete) return;

		setIsDeleting(true);
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch(`/api/admin/rsvps/${rsvpToDelete.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				// Remove from local state
				if (rsvpToDelete.is_test) {
					setTestRsvps((prev) => prev.filter((r) => r.id !== rsvpToDelete.id));
				} else {
					setRsvps((prev) => prev.filter((r) => r.id !== rsvpToDelete.id));
				}
				setDeleteDialogOpen(false);
				setRsvpToDelete(null);
			} else {
				alert("Failed to delete RSVP. Please try again.");
			}
		} catch (error) {
			console.error("Error deleting RSVP:", error);
			alert("Failed to delete RSVP. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEditClick = (rsvp: RSVP) => {
		setRsvpToEdit(rsvp);
		setEditFormData({
			full_name: rsvp.full_name,
			email: rsvp.email,
			phone: rsvp.phone,
			company: rsvp.company || "",
			attending: rsvp.attending,
			has_guests: rsvp.has_guests || "",
			guest_count: rsvp.guest_count || 0,
			donation: rsvp.donation || "",
		});
		setEditDialogOpen(true);
	};

	const handleEditFormChange = (field: string, value: string | number) => {
		setEditFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleUpdateRSVP = async () => {
		if (!rsvpToEdit) return;

		setIsUpdating(true);
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch(`/api/admin/rsvps/${rsvpToEdit.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(editFormData),
			});

			if (response.ok) {
				// Update local state
				const updatedRSVP = {
					...rsvpToEdit,
					...editFormData,
					created_at: new Date().toISOString(),
				};

				if (rsvpToEdit.is_test) {
					setTestRsvps((prev) => prev.map((r) => (r.id === rsvpToEdit.id ? updatedRSVP : r)));
				} else {
					setRsvps((prev) => prev.map((r) => (r.id === rsvpToEdit.id ? updatedRSVP : r)));
				}
				setEditDialogOpen(false);
				setRsvpToEdit(null);
			} else {
				alert("Failed to update RSVP. Please try again.");
			}
		} catch (error) {
			console.error("Error updating RSVP:", error);
			alert("Failed to update RSVP. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleCleanupTestData = async () => {
		setIsCleaningUp(true);
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch("/api/admin/cleanup-test-data", {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				setTestRsvps([]);
				setCleanupDialogOpen(false);
				alert("Test data cleaned up successfully!");
			} else {
				alert("Failed to cleanup test data. Please try again.");
			}
		} catch (error) {
			console.error("Error cleaning up test data:", error);
			alert("Failed to cleanup test data. Please try again.");
		} finally {
			setIsCleaningUp(false);
		}
	};

	const exportToCSV = (data: RSVP[], filename: string) => {
		const headers = ["Name", "Email", "Phone", "Company", "Attending", "Guests", "Guest Count", "Donation", "Guest Privileges", "Link ID", "Date"];
		const csvContent = [
			headers.join(","),
			...data.map((rsvp) =>
				[
					`"${rsvp.full_name}"`,
					`"${rsvp.email}"`,
					`"${rsvp.phone}"`,
					`"${rsvp.company || ""}"`,
					rsvp.attending,
					rsvp.has_guests || "",
					rsvp.guest_count,
					rsvp.donation || "",
					rsvp.is_vip ? "Yes" : "No",
					rsvp.link_uuid,
					new Date(rsvp.created_at).toLocaleDateString(),
				].join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const handleSendEmail = async () => {
		if (!emailRSVP || !emailType) return;

		setIsSendingEmail(true);
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch("/api/admin/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					rsvpId: emailRSVP.id,
					emailType,
					customSubject: emailType === "custom" ? customSubject : undefined,
					customMessage: emailType === "custom" ? customMessage : undefined,
				}),
			});

			if (response.ok) {
				const result = await response.json();
				alert(result.message);
				setEmailDialogOpen(false);
				setEmailRSVP(null);
				setEmailType("");
				setCustomSubject("");
				setCustomMessage("");
			} else {
				const error = await response.json();
				alert(`Failed to send email: ${error.error}`);
			}
		} catch (error) {
			console.error("Error sending email:", error);
			alert("Failed to send email. Please try again.");
		} finally {
			setIsSendingEmail(false);
		}
	};

	const handleEmailClick = (rsvp: RSVP) => {
		setEmailRSVP(rsvp);
		setEmailDialogOpen(true);
	};

	// General email functions
	const handleGeneralEmailClick = () => {
		setGeneralEmailDialogOpen(true);
		// Reset invite-specific state
		setLinkIdentifierMode("new");
		setInviteLinkIdentifier("");
		setSelectedExistingLinkId("");
		setInviteIsVip(false);
		setInviteIsHidden(false);
		setLinkIdentifierError("");
	};

	const addRecipient = () => {
		setEmailRecipients([...emailRecipients, { fullName: "", email: "" }]);
	};

	const removeRecipient = (index: number) => {
		if (emailRecipients.length > 1) {
			setEmailRecipients(emailRecipients.filter((_, i) => i !== index));
		}
	};

	const updateRecipient = (index: number, field: keyof EmailRecipient, value: string) => {
		const updated = [...emailRecipients];
		updated[index] = { ...updated[index], [field]: value };
		setEmailRecipients(updated);
	};

	const checkLinkIdentifier = async (identifier: string) => {
		if (!identifier.trim()) {
			setLinkIdentifierError("");
			return;
		}

		setIsCheckingLinkIdentifier(true);
		setLinkIdentifierError("");

		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch("/api/admin/check-link-identifier", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ linkIdentifier: identifier }),
			});

			if (response.ok) {
				const result = await response.json();
				if (result.exists) {
					setLinkIdentifierError("This link identifier already exists in the database");
				}
			}
		} catch (error) {
			console.error("Error checking link identifier:", error);
			setLinkIdentifierError("Error checking link identifier");
		} finally {
			setIsCheckingLinkIdentifier(false);
		}
	};

	const handleToggleVisibility = async (rsvp: RSVP, makeHidden: boolean) => {
		setIsToggling(rsvp.id.toString());
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch(`/api/admin/rsvps/${rsvp.id}/toggle-visibility`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ isHidden: makeHidden }),
			});

			if (response.ok) {
				// Remove from current list
				if (makeHidden) {
					// Remove from main production RSVPs
					setRsvps((prev) => prev.filter((r) => r.id !== rsvp.id));
					// If showing hidden, add to hidden list
					if (showingHidden) {
						setHiddenRsvps((prev) => [{ ...rsvp, is_hidden: true }, ...prev]);
					}
				} else {
					// Remove from hidden RSVPs
					setHiddenRsvps((prev) => prev.filter((r) => r.id !== rsvp.id));
					// Add back to main production if not showing hidden
					if (!showingHidden) {
						setRsvps((prev) => [{ ...rsvp, is_hidden: false }, ...prev]);
					}
				}
			} else {
				alert("Failed to toggle RSVP visibility. Please try again.");
			}
		} catch (error) {
			console.error("Error toggling RSVP visibility:", error);
			alert("Failed to toggle RSVP visibility. Please try again.");
		} finally {
			setIsToggling(null);
		}
	};

	const handleSendGeneralEmail = async () => {
		if (!generalEmailType || emailRecipients.length === 0) return;

		// Validate recipients
		const validRecipients = emailRecipients.filter((r) => r.fullName.trim() && r.email.trim());
		if (validRecipients.length === 0) {
			alert("Please add at least one valid recipient with name and email");
			return;
		}

		// Special validation for invite emails
		if (generalEmailType === "invite") {
			if (linkIdentifierMode === "new") {
				if (!inviteLinkIdentifier.trim()) {
					alert("Link identifier is required for invite emails");
					return;
				}
				if (linkIdentifierError) {
					alert("Please fix the link identifier error before sending");
					return;
				}
			} else {
				if (!selectedExistingLinkId) {
					alert("Please select an existing link identifier");
					return;
				}
			}
		}

		setIsSendingGeneralEmail(true);
		try {
			const token = localStorage.getItem("admin_token");

			// Determine the link identifier to use
			let linkIdentifierToUse = "";
			let isVipToUse = inviteIsVip;

			if (generalEmailType === "invite") {
				if (linkIdentifierMode === "new") {
					linkIdentifierToUse = inviteLinkIdentifier;
				} else {
					// Find the selected existing link identifier
					const selectedLink = unusedLinkIdentifiers.find((link) => link.uuid === selectedExistingLinkId);
					if (selectedLink) {
						linkIdentifierToUse = selectedLink.uuid;
						isVipToUse = selectedLink.is_vip; // Use the VIP status from the existing link
					}
				}
			}

			const response = await fetch("/api/admin/send-general-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					emailType: generalEmailType,
					recipients: validRecipients,
					customSubject: generalEmailType === "custom" ? generalCustomSubject : undefined,
					customMessage: generalEmailType === "custom" ? generalCustomMessage : undefined,
					linkIdentifier: generalEmailType === "invite" ? linkIdentifierToUse : undefined,
					isVip: generalEmailType === "invite" ? isVipToUse : undefined,
					isHidden: generalEmailType === "invite" ? inviteIsHidden : undefined,
					siteUrl: generalEmailType === "invite" ? inviteSiteUrl : undefined,
					useExistingLink: generalEmailType === "invite" && linkIdentifierMode === "existing",
				}),
			});

			if (response.ok) {
				const result = await response.json();
				alert(result.message);
				if (result.errors && result.errors.length > 0) {
					console.error("Email errors:", result.errors);
				}

				// Reset form
				setGeneralEmailDialogOpen(false);
				setGeneralEmailType("");
				setGeneralCustomSubject("");
				setGeneralCustomMessage("");
				setEmailRecipients([{ fullName: "", email: "" }]);
				setInviteLinkIdentifier("");
				setSelectedExistingLinkId("");
				setInviteIsVip(false);
				setInviteIsHidden(false);
				setInviteSiteUrl("https://roots.maubentech.com");
				setLinkIdentifierError("");
				setLinkIdentifierMode("new");
				setUnusedLinkIdentifiers([]);
			} else {
				const error = await response.json();
				alert(`Failed to send emails: ${error.error}`);
			}
		} catch (error) {
			console.error("Error sending general emails:", error);
			alert("Failed to send emails. Please try again.");
		} finally {
			setIsSendingGeneralEmail(false);
		}
	};

	// WhatsApp functions
	const handleWhatsappInviteClick = () => {
		setWhatsappDialogOpen(true);
		// Reset state
		setWhatsappLinkMode("new");
		setWhatsappLinkIdentifier("");
		setWhatsappSelectedExistingLinkId("");
		setWhatsappIsVip(false);
		setWhatsappIsHidden(false);
		setWhatsappLinkIdentifierError("");
		setWhatsappRecipient({ fullName: "", phone: "" });
		setUnusedLinkIdentifiers([]);
	};

	const checkWhatsappLinkIdentifier = async (identifier: string) => {
		if (!identifier.trim()) {
			setWhatsappLinkIdentifierError("");
			return;
		}

		setIsCheckingWhatsappLinkIdentifier(true);
		setWhatsappLinkIdentifierError("");

		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch("/api/admin/check-link-identifier", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ linkIdentifier: identifier }),
			});

			if (response.ok) {
				const result = await response.json();
				if (result.exists) {
					setWhatsappLinkIdentifierError("This link identifier already exists in the database");
				}
			}
		} catch (error) {
			console.error("Error checking link identifier:", error);
			setWhatsappLinkIdentifierError("Error checking link identifier");
		} finally {
			setIsCheckingWhatsappLinkIdentifier(false);
		}
	};

	const generateWhatsappMessage = () => {
		// Determine the link identifier to use
		let linkIdentifierToUse = "";
		let isVipToUse = whatsappIsVip;

		if (whatsappLinkMode === "new") {
			linkIdentifierToUse = whatsappLinkIdentifier;
		} else {
			// Find the selected existing link identifier
			const selectedLink = unusedLinkIdentifiers.find((link) => link.uuid === whatsappSelectedExistingLinkId);
			if (selectedLink) {
				linkIdentifierToUse = selectedLink.uuid;
				isVipToUse = selectedLink.is_vip;
			}
		}

		const rsvpLink = `${whatsappSiteUrl}/${linkIdentifierToUse}`;

		const message = `🌟 *You're Invited!* 🌟

Hi ${whatsappRecipient.fullName}!

We are delighted to invite you to the *MaubenTech Roots Corporate Cocktail & Fundraiser Evening* - an exclusive event bringing together visionaries, innovators, and supporters who share our commitment to empowering African youth through technology.

📅 *Event Details:*
• *Date:* Saturday, August 30th, 2025
• *Time:* 4:00 PM
• *Venue:* Oladipo Diya St, Durumi 900103, Abuja by Smokey house
• *Dress Code:* Corporate Fit That Bangs

${isVipToUse ? "🎖️ *VIP Invitation* - You have guest privileges and may bring up to 1 guest to this exclusive event." : ""}

Join us for an evening of elegance, meaningful connections, and the opportunity to make a lasting impact on the future of African youth in technology.

*Please RSVP using your exclusive invitation link:*
${rsvpLink}

We look forward to celebrating with you!

Best regards,
The MaubenTech Roots Team

For questions: events@maubentech.com`;

		return message;
	};

	const handleSendWhatsappInvite = async () => {
		if (!whatsappRecipient.fullName.trim() || !whatsappRecipient.phone.trim()) {
			alert("Please enter both full name and phone number");
			return;
		}

		// Validate link identifier
		if (whatsappLinkMode === "new") {
			if (!whatsappLinkIdentifier.trim()) {
				alert("Link identifier is required");
				return;
			}
			if (whatsappLinkIdentifierError) {
				alert("Please fix the link identifier error before proceeding");
				return;
			}
		} else {
			if (!whatsappSelectedExistingLinkId) {
				alert("Please select an existing link identifier");
				return;
			}
		}

		try {
			// Create link identifier if needed
			if (whatsappLinkMode === "new") {
				const token = localStorage.getItem("admin_token");
				const response = await fetch("/api/admin/create-link-identifier", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						linkIdentifier: whatsappLinkIdentifier,
						isVip: whatsappIsVip,
						isHidden: whatsappIsHidden,
					}),
				});

				if (!response.ok) {
					const error = await response.json();
					alert(`Failed to create link identifier: ${error.error}`);
					return;
				}
			}

			// Generate WhatsApp message
			const message = generateWhatsappMessage();

			// Format phone number for WhatsApp (remove any non-digits and add country code if needed)
			const phoneNumber = whatsappRecipient.phone.replace(/\D/g, "");

			// If phone doesn't start with country code, you might want to add a default one
			// For now, we'll use the number as provided

			// Create WhatsApp URL
			const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

			// Open WhatsApp
			window.open(whatsappUrl, "_blank");

			// Close dialog
			setWhatsappDialogOpen(false);

			// Reset form
			setWhatsappRecipient({ fullName: "", phone: "" });
			setWhatsappLinkIdentifier("");
			setWhatsappSelectedExistingLinkId("");
			setWhatsappIsVip(false);
			setWhatsappIsHidden(false);
			setWhatsappLinkIdentifierError("");
			setWhatsappLinkMode("new");
			setUnusedLinkIdentifiers([]);

			alert("WhatsApp opened with invitation message. Please send the message to complete the invitation.");
		} catch (error) {
			console.error("Error preparing WhatsApp invite:", error);
			alert("Failed to prepare WhatsApp invite. Please try again.");
		}
	};

	const renderRSVPTable = (data: RSVP[], isTest = false, isHidden = false) => (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead className="bg-[#6B8E23] text-white">
					<tr>
						<th className="px-4 py-3 text-left">Guest Privileges</th>
						<th className="px-4 py-3 text-left">Name</th>
						<th className="px-4 py-3 text-left">Email</th>
						<th className="px-4 py-3 text-left">Phone</th>
						<th className="px-4 py-3 text-left">Company</th>
						<th className="px-4 py-3 text-left">Attending</th>
						<th className="px-4 py-3 text-left">Guests</th>
						<th className="px-4 py-3 text-left">Donation</th>
						<th className="px-4 py-3 text-left">Link ID</th>
						<th className="px-4 py-3 text-left">Date</th>
						<th className="px-4 py-3 text-left">Actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map((rsvp, index) => (
						<tr key={rsvp.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
							<td className="px-4 py-3">
								<div className="flex items-center gap-2">
									{rsvp.is_vip ? (
										<span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Yes</span>
									) : (
										<span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">No</span>
									)}
									{isTest && <TestTube size={14} className="text-orange-500" />}
									{isHidden && (
										<span title="Hidden RSVP">
											<EyeOff size={14} className="text-purple-500" />
										</span>
									)}
								</div>
							</td>
							<td className="px-4 py-3">{rsvp.full_name}</td>
							<td className="px-4 py-3">{rsvp.email}</td>
							<td className="px-4 py-3">{rsvp.phone}</td>
							<td className="px-4 py-3">{rsvp.company || "-"}</td>
							<td className="px-4 py-3">
								<span
									className={`px-2 py-1 rounded-full text-xs font-semibold ${
										rsvp.attending === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
									}`}>
									{rsvp.attending === "yes" ? "Yes" : "No"}
								</span>
							</td>
							<td className="px-4 py-3">{rsvp.has_guests === "yes" ? `${rsvp.guest_count} guests` : "No guests"}</td>
							<td className="px-4 py-3">
								<span
									className={`px-2 py-1 rounded-full text-xs font-semibold ${
										rsvp.donation === "yes" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
									}`}>
									{rsvp.donation === "yes" ? "Yes" : "No"}
								</span>
							</td>
							<td className="px-4 py-3">
								<code className="text-xs bg-gray-100 px-2 py-1 rounded">{rsvp.link_uuid.substring(0, 8)}...</code>
							</td>
							<td className="px-4 py-3">{new Date(rsvp.created_at).toLocaleDateString()}</td>
							<td className="px-4 py-3">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0" disabled={isToggling === rsvp.id.toString()}>
											{isToggling === rsvp.id.toString() ? (
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6B8E23]"></div>
											) : (
												<MoreHorizontal className="h-4 w-4" />
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleEditClick(rsvp)}>
											<Edit className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleEmailClick(rsvp)}>
											<Mail className="mr-2 h-4 w-4" />
											Send Email
										</DropdownMenuItem>
										{!isTest && (
											<DropdownMenuItem
												onClick={() => handleToggleVisibility(rsvp, !isHidden)}
												className={isHidden ? "text-green-600 focus:text-green-600" : "text-purple-600 focus:text-purple-600"}>
												{isHidden ? (
													<>
														<Eye className="mr-2 h-4 w-4" />
														Show in Main
													</>
												) : (
													<>
														<EyeOff className="mr-2 h-4 w-4" />
														Hide from Main
													</>
												)}
											</DropdownMenuItem>
										)}
										<DropdownMenuItem onClick={() => handleDeleteClick(rsvp)} className="text-red-600 focus:text-red-600">
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{data.length === 0 && (
				<div className="p-8 text-center text-gray-500">
					{isHidden ? "No hidden RSVPs found." : "No RSVPs yet. The data will appear here once people start submitting the form."}
				</div>
			)}
		</div>
	);

	// Show loading spinner while checking authentication
	if (isCheckingAuth) {
		return (
			<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23] mx-auto mb-4"></div>
					<p className="text-[#5D4E37]">Checking authentication...</p>
				</div>
			</div>
		);
	}

	// Login Form
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
				<div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
					<div className="text-center mb-8">
						<div className="bg-[#6B8E23] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<Lock size={32} className="text-white" />
						</div>
						<h1 className="text-2xl font-bold text-[#2C3E2D] mb-2">Admin Access</h1>
						<p className="text-[#5D4E37]">Enter password to access RSVP dashboard</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-6">
						<div>
							<Label htmlFor="password" className="text-[#2C3E2D] font-semibold mb-2 block">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12 pr-12"
									placeholder="Enter admin password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5D4E37] hover:text-[#2C3E2D]">
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						{loginError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{loginError}</div>}

						<Button
							type="submit"
							disabled={isLoggingIn || !password}
							className="w-full bg-[#6B8E23] hover:bg-[#5A7A1F] text-white h-12 font-semibold rounded-full disabled:opacity-50">
							{isLoggingIn ? "Signing In..." : "Sign In"}
						</Button>
					</form>

					<div className="mt-6 text-center text-sm text-[#5D4E37]">
						<p>Default password: MaubenTech2025!</p>
						<p className="text-xs mt-1">(Change this in production)</p>
					</div>
				</div>
			</div>
		);
	}

	// Admin Dashboard
	return (
		<div className="min-h-screen bg-[#F5F1E8] p-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-[#2C3E2D]">RSVP Admin Dashboard</h1>
						<p className="text-[#5D4E37] mt-2">MaubenTech Roots Corporate Cocktail Evening</p>
					</div>
					<div className="flex gap-4">
						<Button onClick={handleWhatsappInviteClick} className="bg-green-600 hover:bg-green-700 text-white">
							<Send className="mr-2 h-4 w-4" />
							Send WhatsApp Invite
						</Button>
						<Button onClick={handleGeneralEmailClick} className="bg-[#B8860B] hover:bg-[#A0750A] text-white">
							<Send className="mr-2 h-4 w-4" />
							Send General Emails
						</Button>
						<Button onClick={handleLogout} variant="outline" className="border-[#6B8E23] text-[#6B8E23] bg-transparent">
							Logout
						</Button>
					</div>
				</div>

				{loading ? (
					<div className="bg-white rounded-lg shadow-lg p-8 text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B8E23] mx-auto mb-4"></div>
						<p className="text-[#5D4E37]">Loading RSVPs...</p>
					</div>
				) : (
					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="production">Production RSVPs ({rsvps.length})</TabsTrigger>
							<TabsTrigger value="test" className="relative">
								Test RSVPs ({testRsvps.length}){testRsvps.length > 0 && <TestTube size={16} className="ml-2 text-orange-500" />}
							</TabsTrigger>
							<TabsTrigger value="hidden" className="relative">
								Hidden RSVPs ({hiddenRsvps.length}){hiddenRsvps.length > 0 && <EyeOff size={16} className="ml-2 text-purple-500" />}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="production" className="space-y-6">
							<div className="bg-white rounded-lg shadow-lg overflow-hidden">
								<div className="p-6 bg-[#F5F1E8] border-b">
									<div className="flex justify-between items-center mb-4">
										<h2 className="text-xl font-semibold text-[#2C3E2D]">Production RSVPs</h2>
										<Button
											onClick={() => exportToCSV(rsvps, `maubentech-rsvps-production-${new Date().toISOString().split("T")[0]}.csv`)}
											className="bg-[#6B8E23] hover:bg-[#5A7A1F]">
											<Download className="mr-2 h-4 w-4" />
											Export CSV
										</Button>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-[#2C3E2D]">{rsvps.length}</div>
											<div className="text-[#5D4E37] text-sm">Total RSVPs</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">{rsvps.filter((r) => r.attending === "yes").length}</div>
											<div className="text-[#5D4E37] text-sm">Attending</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-amber-600">{rsvps.filter((r) => r.is_vip).length}</div>
											<div className="text-[#5D4E37] text-sm">With Guest Privileges</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-[#6B8E23]">{rsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0)}</div>
											<div className="text-[#5D4E37] text-sm">Total Guests</div>
										</div>
									</div>
								</div>
								{renderRSVPTable(rsvps)}
							</div>
						</TabsContent>

						<TabsContent value="test" className="space-y-6">
							<div className="bg-white rounded-lg shadow-lg overflow-hidden">
								<div className="p-6 bg-orange-50 border-b border-orange-200">
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center gap-2">
											<TestTube size={20} className="text-orange-500" />
											<h2 className="text-xl font-semibold text-[#2C3E2D]">Test RSVPs</h2>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => exportToCSV(testRsvps, `maubentech-rsvps-test-${new Date().toISOString().split("T")[0]}.csv`)}
												className="bg-orange-500 hover:bg-orange-600"
												disabled={testRsvps.length === 0}>
												<Download className="mr-2 h-4 w-4" />
												Export Test CSV
											</Button>
											<Button onClick={() => setCleanupDialogOpen(true)} variant="destructive" disabled={testRsvps.length === 0}>
												<Trash2 className="mr-2 h-4 w-4" />
												Cleanup Test Data
											</Button>
										</div>
									</div>
									<div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-4">
										<p className="text-orange-800 text-sm">
											<strong>⚠️ Test Environment:</strong> This section contains test RSVPs that should be removed before going live. Use
											the "Cleanup Test Data" button to remove all test entries when ready for production.
										</p>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-orange-600">{testRsvps.length}</div>
											<div className="text-[#5D4E37] text-sm">Test RSVPs</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">{testRsvps.filter((r) => r.attending === "yes").length}</div>
											<div className="text-[#5D4E37] text-sm">Test Attending</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-amber-600">{testRsvps.filter((r) => r.is_vip).length}</div>
											<div className="text-[#5D4E37] text-sm">Test Guest Privileges</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-[#6B8E23]">
												{testRsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0)}
											</div>
											<div className="text-[#5D4E37] text-sm">Test Guests</div>
										</div>
									</div>
								</div>
								{renderRSVPTable(testRsvps, true)}
							</div>
						</TabsContent>

						<TabsContent value="hidden" className="space-y-6">
							<div className="bg-white rounded-lg shadow-lg overflow-hidden">
								<div className="p-6 bg-purple-50 border-b border-purple-200">
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center gap-2">
											<EyeOff size={20} className="text-purple-500" />
											<h2 className="text-xl font-semibold text-[#2C3E2D]">Hidden RSVPs</h2>
										</div>
										<div className="flex gap-2">
											<Button onClick={() => fetchRSVPs(true)} variant="outline" className="border-purple-500 text-purple-600">
												<Eye className="mr-2 h-4 w-4" />
												{showingHidden ? "Refresh" : "Show Hidden"}
											</Button>
											<Button
												onClick={() =>
													exportToCSV(hiddenRsvps, `maubentech-rsvps-hidden-${new Date().toISOString().split("T")[0]}.csv`)
												}
												className="bg-purple-500 hover:bg-purple-600"
												disabled={hiddenRsvps.length === 0}>
												<Download className="mr-2 h-4 w-4" />
												Export Hidden CSV
											</Button>
										</div>
									</div>
									<div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mb-4">
										<p className="text-purple-800 text-sm">
											<strong>ℹ️ Hidden RSVPs:</strong> These are production RSVPs that have been hidden from the main production view.
											They are still valid RSVPs and count towards your event totals, but are kept separate for organizational purposes.
										</p>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-purple-600">{hiddenRsvps.length}</div>
											<div className="text-[#5D4E37] text-sm">Hidden RSVPs</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">{hiddenRsvps.filter((r) => r.attending === "yes").length}</div>
											<div className="text-[#5D4E37] text-sm">Hidden Attending</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-amber-600">{hiddenRsvps.filter((r) => r.is_vip).length}</div>
											<div className="text-[#5D4E37] text-sm">Hidden Guest Privileges</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-[#6B8E23]">
												{hiddenRsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0)}
											</div>
											<div className="text-[#5D4E37] text-sm">Hidden Guests</div>
										</div>
									</div>
								</div>
								{showingHidden && renderRSVPTable(hiddenRsvps, false, true)}
							</div>
						</TabsContent>
					</Tabs>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete RSVP</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete the RSVP for <strong className="text-[#2C3E2D]">{rsvpToDelete?.full_name}</strong>? This action
							cannot be undone.
							<br />
							<br />
							<span className="text-sm text-[#5D4E37]">Note: After deletion, this link identifier will be available for new RSVPs.</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Test Data Cleanup Dialog */}
			<AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cleanup Test Data</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove all test RSVPs and test link identifiers? This action cannot be undone.
							<br />
							<br />
							<span className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
								<strong>⚠️ Production Warning:</strong> Only do this when you're ready to go live with the production system.
							</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleCleanupTestData} disabled={isCleaningUp} className="bg-orange-600 hover:bg-orange-700">
							{isCleaningUp ? "Cleaning up..." : "Cleanup Test Data"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Edit RSVP Dialog */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit RSVP</DialogTitle>
						<DialogDescription>Update the RSVP details for {rsvpToEdit?.full_name}</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
						<div>
							<Label htmlFor="edit-name" className="text-[#2C3E2D] font-semibold mb-2 block">
								Full Name *
							</Label>
							<Input
								id="edit-name"
								value={editFormData.full_name}
								onChange={(e) => handleEditFormChange("full_name", e.target.value)}
								className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
							/>
						</div>

						<div>
							<Label htmlFor="edit-email" className="text-[#2C3E2D] font-semibold mb-2 block">
								Email *
							</Label>
							<Input
								id="edit-email"
								type="email"
								value={editFormData.email}
								onChange={(e) => handleEditFormChange("email", e.target.value)}
								className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
							/>
						</div>

						<div>
							<Label htmlFor="edit-phone" className="text-[#2C3E2D] font-semibold mb-2 block">
								Phone *
							</Label>
							<Input
								id="edit-phone"
								value={editFormData.phone}
								onChange={(e) => handleEditFormChange("phone", e.target.value)}
								className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
							/>
						</div>

						<div>
							<Label htmlFor="edit-company" className="text-[#2C3E2D] font-semibold mb-2 block">
								Company
							</Label>
							<Input
								id="edit-company"
								value={editFormData.company}
								onChange={(e) => handleEditFormChange("company", e.target.value)}
								className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
							/>
						</div>

						<div className="md:col-span-2">
							<Label className="text-[#2C3E2D] font-semibold mb-4 block">Attending *</Label>
							<RadioGroup
								value={editFormData.attending}
								onValueChange={(value) => handleEditFormChange("attending", value)}
								className="flex gap-6">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="yes" id="edit-attending-yes" />
									<Label htmlFor="edit-attending-yes">Yes</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="no" id="edit-attending-no" />
									<Label htmlFor="edit-attending-no">No</Label>
								</div>
							</RadioGroup>
						</div>

						{editFormData.attending === "yes" && rsvpToEdit?.is_vip && (
							<>
								<div className="md:col-span-2">
									<Label className="text-[#2C3E2D] font-semibold mb-4 block">Bringing Guests?</Label>
									<RadioGroup
										value={editFormData.has_guests}
										onValueChange={(value) => handleEditFormChange("has_guests", value)}
										className="flex gap-6">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="yes" id="edit-guests-yes" />
											<Label htmlFor="edit-guests-yes">Yes</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="no" id="edit-guests-no" />
											<Label htmlFor="edit-guests-no">No</Label>
										</div>
									</RadioGroup>
								</div>

								{editFormData.has_guests === "yes" && (
									<div>
										<Label htmlFor="edit-guest-count" className="text-[#2C3E2D] font-semibold mb-2 block">
											Number of Guests (Max 1)
										</Label>
										<Input
											id="edit-guest-count"
											type="number"
											min="0"
											max="1"
											value={editFormData.guest_count === 0 ? "" : editFormData.guest_count}
											onChange={(e) => {
												const value = e.target.value;
												if (value === "" || value === "0") {
													handleEditFormChange("guest_count", 0);
												} else {
													const numValue = Number.parseInt(value);
													if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
														handleEditFormChange("guest_count", numValue);
													}
												}
											}}
											onKeyDown={(e) => {
												// Prevent entering numbers greater than 1
												if (e.key >= "2" && e.key <= "9") {
													e.preventDefault();
												}
												// Allow backspace, delete, tab, escape, enter
												if (
													[8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
													// Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
													(e.keyCode === 65 && e.ctrlKey === true) ||
													(e.keyCode === 67 && e.ctrlKey === true) ||
													(e.keyCode === 86 && e.ctrlKey === true) ||
													(e.keyCode === 88 && e.ctrlKey === true)
												) {
													return;
												}
												// Ensure that it is a number and stop the keypress
												if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
													e.preventDefault();
												}
											}}
											className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
											placeholder="0"
										/>
									</div>
								)}
							</>
						)}

						{editFormData.attending === "yes" && (
							<div className="md:col-span-2">
								<Label className="text-[#2C3E2D] font-semibold mb-4 block">Interested in Donation?</Label>
								<RadioGroup
									value={editFormData.donation}
									onValueChange={(value) => handleEditFormChange("donation", value)}
									className="flex gap-6">
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="yes" id="edit-donation-yes" />
										<Label htmlFor="edit-donation-yes">Yes</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="no" id="edit-donation-no" />
										<Label htmlFor="edit-donation-no">No</Label>
									</div>
								</RadioGroup>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setEditDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateRSVP}
							disabled={isUpdating || !editFormData.full_name || !editFormData.email || !editFormData.phone}
							className="bg-[#6B8E23] hover:bg-[#5A7A1F]">
							{isUpdating ? "Updating..." : "Update RSVP"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Email Dialog */}
			<Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Send Email</DialogTitle>
						<DialogDescription>
							Send an email to {emailRSVP?.full_name} ({emailRSVP?.email})
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						<div>
							<Label className="text-[#2C3E2D] font-semibold mb-4 block">Email Type</Label>
							<RadioGroup value={emailType} onValueChange={setEmailType} className="space-y-3">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="confirmation" id="email-confirmation" />
									<Label htmlFor="email-confirmation" className="flex-1">
										<div>
											<div className="font-medium">RSVP Confirmation</div>
											<div className="text-sm text-gray-500">Send the standard RSVP confirmation email</div>
										</div>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="reminder" id="email-reminder" />
									<Label htmlFor="email-reminder" className="flex-1">
										<div>
											<div className="font-medium">Event Reminder</div>
											<div className="text-sm text-gray-500">Send a reminder about the upcoming event</div>
										</div>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="custom" id="email-custom" />
									<Label htmlFor="email-custom" className="flex-1">
										<div>
											<div className="font-medium">Custom Message</div>
											<div className="text-sm text-gray-500">Send a custom email with your own subject and message</div>
										</div>
									</Label>
								</div>
							</RadioGroup>
						</div>

						{emailType === "custom" && (
							<>
								<div>
									<Label htmlFor="custom-subject" className="text-[#2C3E2D] font-semibold mb-2 block">
										Subject *
									</Label>
									<Input
										id="custom-subject"
										value={customSubject}
										onChange={(e) => setCustomSubject(e.target.value)}
										className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
										placeholder="Enter email subject"
									/>
								</div>

								<div>
									<Label htmlFor="custom-message" className="text-[#2C3E2D] font-semibold mb-2 block">
										Message *
									</Label>
									<textarea
										id="custom-message"
										value={customMessage}
										onChange={(e) => setCustomMessage(e.target.value)}
										className="w-full min-h-[120px] p-3 border border-[#6B8E23] rounded-md focus:border-[#B8860B] focus:ring-[#B8860B] focus:ring-1 focus:outline-none resize-vertical"
										placeholder="Enter your custom message..."
									/>
									<p className="text-sm text-gray-500 mt-1">
										This message will be sent to {emailRSVP?.full_name} with the MaubenTech branding.
									</p>
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSendEmail}
							disabled={isSendingEmail || !emailType || (emailType === "custom" && (!customSubject || !customMessage))}
							className="bg-[#6B8E23] hover:bg-[#5A7A1F]">
							{isSendingEmail ? "Sending..." : "Send Email"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* General Email Dialog */}
			<Dialog open={generalEmailDialogOpen} onOpenChange={setGeneralEmailDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Send General Emails</DialogTitle>
						<DialogDescription>Send emails to multiple recipients using existing templates</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						{/* Email Type Selection */}
						<div>
							<Label className="text-[#2C3E2D] font-semibold mb-4 block">Email Type</Label>
							<RadioGroup value={generalEmailType} onValueChange={setGeneralEmailType} className="space-y-3">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="invite" id="general-invite" />
									<Label htmlFor="general-invite" className="flex-1">
										<div>
											<div className="font-medium">Send Invitations</div>
											<div className="text-sm text-gray-500">Send invitation emails with unique RSVP links</div>
										</div>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="confirmation" id="general-confirmation" />
									<Label htmlFor="general-confirmation" className="flex-1">
										<div>
											<div className="font-medium">RSVP Confirmation</div>
											<div className="text-sm text-gray-500">Send RSVP confirmation emails</div>
										</div>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="reminder" id="general-reminder" />
									<Label htmlFor="general-reminder" className="flex-1">
										<div>
											<div className="font-medium">Event Reminder</div>
											<div className="text-sm text-gray-500">Send event reminder emails</div>
										</div>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="internal" id="general-internal" />
									<Label htmlFor="general-internal" className="flex-1">
										<div>
											<div className="font-medium">Internal Notification</div>
											<div className="text-sm text-gray-500">Send internal notification style emails</div>
										</div>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="custom" id="general-custom" />
									<Label htmlFor="general-custom" className="flex-1">
										<div>
											<div className="font-medium">Custom Message</div>
											<div className="text-sm text-gray-500">Send custom emails with your own subject and message</div>
										</div>
									</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Invite-specific fields */}
						{generalEmailType === "invite" && (
							<div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 className="font-semibold text-[#2C3E2D]">Invitation Settings</h4>

								{/* Link Identifier Mode Selection */}
								<div>
									<Label className="text-[#2C3E2D] font-semibold mb-4 block">Link Identifier Option</Label>
									<RadioGroup
										value={linkIdentifierMode}
										onValueChange={(value: "new" | "existing") => {
											setLinkIdentifierMode(value);
											if (value === "existing") {
												fetchUnusedLinkIdentifiers();
												setInviteLinkIdentifier("");
												setLinkIdentifierError("");
											} else {
												setSelectedExistingLinkId("");
												setUnusedLinkIdentifiers([]);
											}
										}}
										className="flex gap-6">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="new" id="link-mode-new" />
											<Label htmlFor="link-mode-new">Create New Link Identifier</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="existing" id="link-mode-existing" />
											<Label htmlFor="link-mode-existing">Use Existing Unused Link</Label>
										</div>
									</RadioGroup>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{linkIdentifierMode === "new" ? (
										<div>
											<Label htmlFor="invite-link-identifier" className="text-[#2C3E2D] font-semibold mb-2 block">
												New Link Identifier *
											</Label>
											<Input
												id="invite-link-identifier"
												value={inviteLinkIdentifier}
												onChange={(e) => {
													setInviteLinkIdentifier(e.target.value);
													if (e.target.value.trim()) {
														checkLinkIdentifier(e.target.value.trim());
													} else {
														setLinkIdentifierError("");
													}
												}}
												className={`border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] ${
													linkIdentifierError ? "border-red-500" : ""
												}`}
												placeholder="e.g., unique-invite-123"
											/>
											{isCheckingLinkIdentifier && <p className="text-sm text-blue-600 mt-1">Checking availability...</p>}
											{linkIdentifierError && <p className="text-sm text-red-600 mt-1">{linkIdentifierError}</p>}
											<p className="text-sm text-gray-500 mt-1">This will be used to create the unique RSVP link for the invitee</p>
										</div>
									) : (
										<div>
											<Label htmlFor="existing-link-select" className="text-[#2C3E2D] font-semibold mb-2 block">
												Select Existing Link *
											</Label>
											<Select value={selectedExistingLinkId} onValueChange={setSelectedExistingLinkId} disabled={isLoadingUnusedLinks}>
												<SelectTrigger className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]">
													<SelectValue placeholder={isLoadingUnusedLinks ? "Loading..." : "Select a link identifier"} />
												</SelectTrigger>
												<SelectContent>
													{unusedLinkIdentifiers.length === 0 ? (
														<SelectItem value="no-links" disabled>
															No unused link identifiers available
														</SelectItem>
													) : (
														unusedLinkIdentifiers.map((link) => (
															<SelectItem key={link.uuid} value={link.uuid}>
																<div className="flex items-center gap-2">
																	<span>{link.uuid}</span>
																	<span className="text-xs text-gray-500">(#{link.tracking_number})</span>
																	{link.is_vip && (
																		<span className="px-1 py-0.5 rounded text-xs bg-amber-100 text-amber-800">VIP</span>
																	)}
																</div>
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
											<p className="text-sm text-gray-500 mt-1">
												Choose from existing link identifiers that haven't been used for RSVPs yet
											</p>
										</div>
									)}

									<div>
										<Label htmlFor="invite-site-url" className="text-[#2C3E2D] font-semibold mb-2 block">
											Site URL
										</Label>
										<Input
											id="invite-site-url"
											value={inviteSiteUrl}
											onChange={(e) => setInviteSiteUrl(e.target.value)}
											className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
											placeholder="https://roots.maubentech.com"
										/>
										<p className="text-sm text-gray-500 mt-1">The base URL for the RSVP link</p>
									</div>
								</div>

								{linkIdentifierMode === "new" && (
									<div>
										<Label className="text-[#2C3E2D] font-semibold mb-4 block">Invitation Type</Label>
										<RadioGroup
											value={inviteIsVip ? "vip" : "regular"}
											onValueChange={(value) => setInviteIsVip(value === "vip")}
											className="flex gap-6">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="regular" id="invite-regular" />
												<Label htmlFor="invite-regular">Regular Invitation</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="vip" id="invite-vip" />
												<Label htmlFor="invite-vip">VIP Invitation (with guest privileges)</Label>
											</div>
										</RadioGroup>
									</div>
								)}

								{linkIdentifierMode === "existing" && selectedExistingLinkId && (
									<div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
										<p className="text-blue-800 text-sm">
											<strong>Selected Link:</strong> {selectedExistingLinkId}
											{unusedLinkIdentifiers.find((link) => link.uuid === selectedExistingLinkId)?.is_vip && (
												<span className="ml-2 px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">VIP Invitation</span>
											)}
										</p>
									</div>
								)}

								<div>
									<Label className="text-[#2C3E2D] font-semibold mb-4 block">RSVP Visibility</Label>
									<RadioGroup
										value={inviteIsHidden ? "hidden" : "visible"}
										onValueChange={(value) => setInviteIsHidden(value === "hidden")}
										className="flex gap-6">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="visible" id="invite-visible" />
											<Label htmlFor="invite-visible">Show in main production RSVPs</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="hidden" id="invite-hidden" />
											<Label htmlFor="invite-hidden">Hide from main production RSVPs</Label>
										</div>
									</RadioGroup>
									<p className="text-sm text-gray-500 mt-2">
										Hidden RSVPs are still production RSVPs but won't appear in the main production list. Use this for internal invitations
										or special categories.
									</p>
								</div>
							</div>
						)}

						{/* Custom email fields */}
						{generalEmailType === "custom" && (
							<>
								<div>
									<Label htmlFor="general-custom-subject" className="text-[#2C3E2D] font-semibold mb-2 block">
										Subject *
									</Label>
									<Input
										id="general-custom-subject"
										value={generalCustomSubject}
										onChange={(e) => setGeneralCustomSubject(e.target.value)}
										className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
										placeholder="Enter email subject"
									/>
								</div>

								<div>
									<Label htmlFor="general-custom-message" className="text-[#2C3E2D] font-semibold mb-2 block">
										Message *
									</Label>
									<textarea
										id="general-custom-message"
										value={generalCustomMessage}
										onChange={(e) => setGeneralCustomMessage(e.target.value)}
										className="w-full min-h-[120px] p-3 border border-[#6B8E23] rounded-md focus:border-[#B8860B] focus:ring-[#B8860B] focus:ring-1 focus:outline-none resize-vertical"
										placeholder="Enter your custom message..."
									/>
								</div>
							</>
						)}

						{/* Recipients */}
						<div>
							<div className="flex justify-between items-center mb-4">
								<Label className="text-[#2C3E2D] font-semibold">Recipients *</Label>
								<Button
									type="button"
									onClick={addRecipient}
									variant="outline"
									size="sm"
									className="border-[#6B8E23] text-[#6B8E23] bg-transparent">
									<Plus className="mr-2 h-4 w-4" />
									Add Recipient
								</Button>
							</div>

							<div className="space-y-4 max-h-60 overflow-y-auto">
								{emailRecipients.map((recipient, index) => (
									<div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
										<div>
											<Label htmlFor={`recipient-name-${index}`} className="text-sm font-medium mb-1 block">
												Full Name *
											</Label>
											<Input
												id={`recipient-name-${index}`}
												value={recipient.fullName}
												onChange={(e) => updateRecipient(index, "fullName", e.target.value)}
												className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
												placeholder="John Doe"
											/>
										</div>

										<div>
											<Label htmlFor={`recipient-email-${index}`} className="text-sm font-medium mb-1 block">
												Email *
											</Label>
											<Input
												id={`recipient-email-${index}`}
												type="email"
												value={recipient.email}
												onChange={(e) => updateRecipient(index, "email", e.target.value)}
												className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
												placeholder="john@example.com"
											/>
										</div>

										<div>
											<Label htmlFor={`recipient-phone-${index}`} className="text-sm font-medium mb-1 block">
												Phone
											</Label>
											<Input
												id={`recipient-phone-${index}`}
												value={recipient.phone || ""}
												onChange={(e) => updateRecipient(index, "phone", e.target.value)}
												className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
												placeholder="+1234567890"
											/>
										</div>

										<div className="flex items-end">
											<Button
												type="button"
												onClick={() => removeRecipient(index)}
												variant="outline"
												size="sm"
												className="border-red-300 text-red-600 hover:bg-red-50"
												disabled={emailRecipients.length === 1}>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setGeneralEmailDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSendGeneralEmail}
							disabled={
								isSendingGeneralEmail ||
								!generalEmailType ||
								emailRecipients.filter((r) => r.fullName.trim() && r.email.trim()).length === 0 ||
								(generalEmailType === "custom" && (!generalCustomSubject || !generalCustomMessage)) ||
								(generalEmailType === "invite" && linkIdentifierMode === "new" && (!inviteLinkIdentifier.trim() || !!linkIdentifierError)) ||
								(generalEmailType === "invite" && linkIdentifierMode === "existing" && !selectedExistingLinkId)
							}
							className="bg-[#6B8E23] hover:bg-[#5A7A1F]">
							{isSendingGeneralEmail ? "Sending..." : "Send Emails"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* WhatsApp Dialog */}
			<Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Send WhatsApp Invitation</DialogTitle>
						<DialogDescription>Create and send an invitation via WhatsApp</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						{/* Recipient Information */}
						<div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
							<h4 className="font-semibold text-[#2C3E2D]">Recipient Information</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="whatsapp-name" className="text-[#2C3E2D] font-semibold mb-2 block">
										Full Name *
									</Label>
									<Input
										id="whatsapp-name"
										value={whatsappRecipient.fullName}
										onChange={(e) => setWhatsappRecipient((prev) => ({ ...prev, fullName: e.target.value }))}
										className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<Label htmlFor="whatsapp-phone" className="text-[#2C3E2D] font-semibold mb-2 block">
										Phone Number *
									</Label>
									<Input
										id="whatsapp-phone"
										value={whatsappRecipient.phone}
										onChange={(e) => setWhatsappRecipient((prev) => ({ ...prev, phone: e.target.value }))}
										className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
										placeholder="+234XXXXXXXXXX"
									/>
									<p className="text-sm text-gray-500 mt-1">Include country code (e.g., +234 for Nigeria)</p>
								</div>
							</div>
						</div>

						{/* Link Identifier Settings */}
						<div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
							<h4 className="font-semibold text-[#2C3E2D]">Invitation Settings</h4>

							{/* Link Identifier Mode Selection */}
							<div>
								<Label className="text-[#2C3E2D] font-semibold mb-4 block">Link Identifier Option</Label>
								<RadioGroup
									value={whatsappLinkMode}
									onValueChange={(value: "new" | "existing") => {
										setWhatsappLinkMode(value);
										if (value === "existing") {
											fetchUnusedLinkIdentifiers();
											setWhatsappLinkIdentifier("");
											setWhatsappLinkIdentifierError("");
										} else {
											setWhatsappSelectedExistingLinkId("");
											setUnusedLinkIdentifiers([]);
										}
									}}
									className="flex gap-6">
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="new" id="whatsapp-link-mode-new" />
										<Label htmlFor="whatsapp-link-mode-new">Create New Link Identifier</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="existing" id="whatsapp-link-mode-existing" />
										<Label htmlFor="whatsapp-link-mode-existing">Use Existing Unused Link</Label>
									</div>
								</RadioGroup>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{whatsappLinkMode === "new" ? (
									<div>
										<Label htmlFor="whatsapp-link-identifier" className="text-[#2C3E2D] font-semibold mb-2 block">
											New Link Identifier *
										</Label>
										<Input
											id="whatsapp-link-identifier"
											value={whatsappLinkIdentifier}
											onChange={(e) => {
												setWhatsappLinkIdentifier(e.target.value);
												if (e.target.value.trim()) {
													checkWhatsappLinkIdentifier(e.target.value.trim());
												} else {
													setWhatsappLinkIdentifierError("");
												}
											}}
											className={`border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] ${
												whatsappLinkIdentifierError ? "border-red-500" : ""
											}`}
											placeholder="e.g., whatsapp-invite-123"
										/>
										{isCheckingWhatsappLinkIdentifier && <p className="text-sm text-blue-600 mt-1">Checking availability...</p>}
										{whatsappLinkIdentifierError && <p className="text-sm text-red-600 mt-1">{whatsappLinkIdentifierError}</p>}
										<p className="text-sm text-gray-500 mt-1">This will be used to create the unique RSVP link</p>
									</div>
								) : (
									<div>
										<Label htmlFor="whatsapp-existing-link-select" className="text-[#2C3E2D] font-semibold mb-2 block">
											Select Existing Link *
										</Label>
										<Select
											value={whatsappSelectedExistingLinkId}
											onValueChange={setWhatsappSelectedExistingLinkId}
											disabled={isLoadingUnusedLinks}>
											<SelectTrigger className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]">
												<SelectValue placeholder={isLoadingUnusedLinks ? "Loading..." : "Select a link identifier"} />
											</SelectTrigger>
											<SelectContent>
												{unusedLinkIdentifiers.length === 0 ? (
													<SelectItem value="no-links" disabled>
														No unused link identifiers available
													</SelectItem>
												) : (
													unusedLinkIdentifiers.map((link) => (
														<SelectItem key={link.uuid} value={link.uuid}>
															<div className="flex items-center gap-2">
																<span>{link.uuid}</span>
																<span className="text-xs text-gray-500">(#{link.tracking_number})</span>
																{link.is_vip && (
																	<span className="px-1 py-0.5 rounded text-xs bg-amber-100 text-amber-800">VIP</span>
																)}
															</div>
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
										<p className="text-sm text-gray-500 mt-1">Choose from existing link identifiers that haven't been used yet</p>
									</div>
								)}

								<div>
									<Label htmlFor="whatsapp-site-url" className="text-[#2C3E2D] font-semibold mb-2 block">
										Site URL
									</Label>
									<Input
										id="whatsapp-site-url"
										value={whatsappSiteUrl}
										onChange={(e) => setWhatsappSiteUrl(e.target.value)}
										className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B]"
										placeholder="https://roots.maubentech.com"
									/>
									<p className="text-sm text-gray-500 mt-1">The base URL for the RSVP link</p>
								</div>
							</div>

							{whatsappLinkMode === "new" && (
								<div>
									<Label className="text-[#2C3E2D] font-semibold mb-4 block">Invitation Type</Label>
									<RadioGroup
										value={whatsappIsVip ? "vip" : "regular"}
										onValueChange={(value) => setWhatsappIsVip(value === "vip")}
										className="flex gap-6">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="regular" id="whatsapp-invite-regular" />
											<Label htmlFor="whatsapp-invite-regular">Regular Invitation</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="vip" id="whatsapp-invite-vip" />
											<Label htmlFor="whatsapp-invite-vip">VIP Invitation (with guest privileges)</Label>
										</div>
									</RadioGroup>
								</div>
							)}

							{whatsappLinkMode === "existing" && whatsappSelectedExistingLinkId && (
								<div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
									<p className="text-blue-800 text-sm">
										<strong>Selected Link:</strong> {whatsappSelectedExistingLinkId}
										{unusedLinkIdentifiers.find((link) => link.uuid === whatsappSelectedExistingLinkId)?.is_vip && (
											<span className="ml-2 px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">VIP Invitation</span>
										)}
									</p>
								</div>
							)}

							<div>
								<Label className="text-[#2C3E2D] font-semibold mb-4 block">RSVP Visibility</Label>
								<RadioGroup
									value={whatsappIsHidden ? "hidden" : "visible"}
									onValueChange={(value) => setWhatsappIsHidden(value === "hidden")}
									className="flex gap-6">
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="visible" id="whatsapp-invite-visible" />
										<Label htmlFor="whatsapp-invite-visible">Show in main production RSVPs</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="hidden" id="whatsapp-invite-hidden" />
										<Label htmlFor="whatsapp-invite-hidden">Hide from main production RSVPs</Label>
									</div>
								</RadioGroup>
								<p className="text-sm text-gray-500 mt-2">Hidden RSVPs won't appear in the main production list but are still valid RSVPs.</p>
							</div>
						</div>

						{/* Preview Message */}
						{whatsappRecipient.fullName && (whatsappLinkIdentifier || whatsappSelectedExistingLinkId) && (
							<div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
								<h4 className="font-semibold text-[#2C3E2D]">Message Preview</h4>
								<div className="bg-white p-4 rounded-lg border max-h-60 overflow-y-auto">
									<pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{generateWhatsappMessage()}</pre>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setWhatsappDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSendWhatsappInvite}
							disabled={
								!whatsappRecipient.fullName.trim() ||
								!whatsappRecipient.phone.trim() ||
								(whatsappLinkMode === "new" && (!whatsappLinkIdentifier.trim() || !!whatsappLinkIdentifierError)) ||
								(whatsappLinkMode === "existing" && !whatsappSelectedExistingLinkId)
							}
							className="bg-green-600 hover:bg-green-700 text-white">
							Open WhatsApp
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
