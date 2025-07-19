/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	experimental: {
		outputFileTracingRoot: undefined,
	},
	// Disable image optimization for shared hosting
	images: {
		unoptimized: true,
	},
	// Set base path if your addon domain is in a subdirectory
	// basePath: '/subdirectory', // Uncomment and modify if needed

	// Environment variables for production
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
