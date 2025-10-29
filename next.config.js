/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/apiic_admin',
    output: 'standalone', // optional but helps in production
    env: {
        API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_BASE_URL || 'http://localhost:3000/api'}/:path*`,
            },
        ]
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    // Handle font loading more gracefully
    optimizeFonts: true,
    // Skip font optimization during build if network issues
    skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
