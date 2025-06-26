/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable additional hosts for Server Actions during development
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',   // local dev
        '*.app.github.dev',
        '*.vercel.app', // Codespaces / tunnel proxy
      ],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
