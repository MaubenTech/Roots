import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "MaubenTech",
	description: "RSVP for Corporate Cocktail Evening",
	generator: "v0.dev",
	icons: {
		icon: "/images/logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
