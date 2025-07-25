"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Trash2, Edit, MoreHorizontal, Download, TestTube } from "lucide-react";
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

	// Test data cleanup
	const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
	const [isCleaningUp, setIsCleaningUp] = useState(false);

	useEffect(() => {
		// Check if user is already authenticated
		const token = localStorage.getItem("admin_token");
		if (token) {
			verifyToken(token);
		} else {
			setIsCheckingAuth(false);
		}
	}, []);

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

	const fetchRSVPs = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("admin_token");
			const response = await fetch("/api/admin/rsvps", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				const allRsvps = data.rsvps || [];

				// Separate production and test RSVPs
				const productionRsvps = allRsvps.filter((rsvp: RSVP) => !rsvp.is_test);
				const testRsvpsData = allRsvps.filter((rsvp: RSVP) => rsvp.is_test);

				setRsvps(productionRsvps);
				setTestRsvps(testRsvpsData);
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

	const renderRSVPTable = (data: RSVP[], isTest = false) => (
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
								</div>
							</td>
							<td className="px-4 py-3 font-medium">{rsvp.full_name}</td>
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
										<Button variant="ghost" className="h-8 w-8 p-0">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleEditClick(rsvp)}>
											<Edit className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
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
				<div className="p-8 text-center text-gray-500">No RSVPs yet. The data will appear here once people start submitting the form.</div>
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
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="production">Production RSVPs ({rsvps.length})</TabsTrigger>
							<TabsTrigger value="test" className="relative">
								Test RSVPs ({testRsvps.length}){testRsvps.length > 0 && <TestTube size={16} className="ml-2 text-orange-500" />}
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
		</div>
	);
}
