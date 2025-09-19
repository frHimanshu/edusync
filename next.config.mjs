/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // For demo mode, we'll use regular build instead of static export
  // to avoid issues with dynamic routes and API routes
  ...(process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && {
    // Remove static export to fix build issues
    // output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  // Environment-specific configurations
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Student Management System',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
}

export default nextConfig
