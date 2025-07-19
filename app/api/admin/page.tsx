"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

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
}

export default function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [rsvps, setRsvps] = useState<RSVP[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Check if user is already authenticated
		const token = localStorage.getItem("admin_token");
		if (token) {
			verifyToken(token);
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
				localStorage.removeItem("admin_token");
			}
		} catch (error) {
			localStorage.removeItem("admin_token");
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
			setLoginError("Login failed. Please try again.");
		} finally {
			setIsLoggingIn(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("admin_token");
		setIsAuthenticated(false);
		setRsvps([]);
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
			const data = await response.json();
			setRsvps(data.rsvps || []);
		} catch (error) {
			console.error("Error fetching RSVPs:", error);
		} finally {
			setLoading(false);
		}
	};

	const exportToCSV = () => {
		const headers = [
			"Name",
			"Email",
			"Phone",
			"Company",
			"Attending",
			"Guests",
			"Guest Count",
			"Donation",
			"Date",
		];
		const csvContent = [
			headers.join(","),
			...rsvps.map((rsvp) =>
				[
					`"${rsvp.full_name}"`,
					`"${rsvp.email}"`,
					`"${rsvp.phone}"`,
					`"${rsvp.company || ""}"`,
					rsvp.attending,
					rsvp.has_guests || "",
					rsvp.guest_count,
					rsvp.donation || "",
					new Date(rsvp.created_at).toLocaleDateString(),
				].join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `maubentech-rsvps-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	// Login Form
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
				<div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
					<div className="text-center mb-8">
						<div className="bg-[#6B8E23] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<Lock size={32} className="text-white" />
						</div>
						<h1 className="text-2xl font-bold text-[#2C3E2D] mb-2">
							Admin Access
						</h1>
						<p className="text-[#5D4E37]">
							Enter password to access RSVP dashboard
						</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-6">
						<div>
							<Label
								htmlFor="password"
								className="text-[#2C3E2D] font-semibold mb-2 block">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="border-[#6B8E23] focus:border-[#B8860B] focus:ring-[#B8860B] h-12 pr-12"
									placeholder="Enter admin password"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5D4E37] hover:text-[#2C3E2D]">
									{showPassword ? (
										<EyeOff size={20} />
									) : (
										<Eye size={20} />
									)}
								</button>
							</div>
						</div>

						{loginError && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
								{loginError}
							</div>
						)}

						<Button
							type="submit"
							disabled={isLoggingIn || !password}
							className="w-full bg-[#6B8E23] hover:bg-[#5A7A1F] text-white h-12 font-semibold rounded-full disabled:opacity-50">
							{isLoggingIn ? "Signing In..." : "Sign In"}
						</Button>
					</form>
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
						<h1 className="text-3xl font-bold text-[#2C3E2D]">
							RSVP Admin Dashboard
						</h1>
						<p className="text-[#5D4E37] mt-2">
							MaubenTech Roots Corporate Cocktail Evening
						</p>
					</div>
					<div className="flex gap-4">
						<Button
							onClick={exportToCSV}
							className="bg-[#6B8E23] hover:bg-[#5A7A1F]">
							Export to CSV
						</Button>
						<Button
							onClick={handleLogout}
							variant="outline"
							className="border-[#6B8E23] text-[#6B8E23] bg-transparent">
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
					<div className="bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="p-6 bg-[#F5F1E8] border-b">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-[#2C3E2D]">
										{rsvps.length}
									</div>
									<div className="text-[#5D4E37] text-sm">
										Total RSVPs
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{
											rsvps.filter(
												(r) => r.attending === "yes"
											).length
										}
									</div>
									<div className="text-[#5D4E37] text-sm">
										Attending
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-red-600">
										{
											rsvps.filter(
												(r) => r.attending === "no"
											).length
										}
									</div>
									<div className="text-[#5D4E37] text-sm">
										Not Attending
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-[#B8860B]">
										{rsvps.reduce(
											(sum, r) =>
												sum + (r.guest_count || 0),
											0
										)}
									</div>
									<div className="text-[#5D4E37] text-sm">
										Total Guests
									</div>
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-[#6B8E23] text-white">
									<tr>
										<th className="px-4 py-3 text-left">
											Name
										</th>
										<th className="px-4 py-3 text-left">
											Email
										</th>
										<th className="px-4 py-3 text-left">
											Phone
										</th>
										<th className="px-4 py-3 text-left">
											Company
										</th>
										<th className="px-4 py-3 text-left">
											Attending
										</th>
										<th className="px-4 py-3 text-left">
											Guests
										</th>
										<th className="px-4 py-3 text-left">
											Donation
										</th>
										<th className="px-4 py-3 text-left">
											Date
										</th>
									</tr>
								</thead>
								<tbody>
									{rsvps.map((rsvp, index) => (
										<tr
											key={rsvp.id}
											className={
												index % 2 === 0
													? "bg-gray-50"
													: "bg-white"
											}>
											<td className="px-4 py-3 font-medium">
												{rsvp.full_name}
											</td>
											<td className="px-4 py-3">
												{rsvp.email}
											</td>
											<td className="px-4 py-3">
												{rsvp.phone}
											</td>
											<td className="px-4 py-3">
												{rsvp.company || "-"}
											</td>
											<td className="px-4 py-3">
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${
														rsvp.attending === "yes"
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}>
													{rsvp.attending === "yes"
														? "Yes"
														: "No"}
												</span>
											</td>
											<td className="px-4 py-3">
												{rsvp.has_guests === "yes"
													? `${rsvp.guest_count} guests`
													: "No guests"}
											</td>
											<td className="px-4 py-3">
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${
														rsvp.donation === "yes"
															? "bg-blue-100 text-blue-800"
															: "bg-gray-100 text-gray-800"
													}`}>
													{rsvp.donation === "yes"
														? "Yes"
														: "No"}
												</span>
											</td>
											<td className="px-4 py-3">
												{new Date(
													rsvp.created_at
												).toLocaleDateString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{rsvps.length === 0 && (
							<div className="p-8 text-center text-gray-500">
								No RSVPs yet. The data will appear here once
								people start submitting the form.
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
