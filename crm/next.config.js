/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'anima-uploads.s3.amazonaws.com',
        port: '',
        pathname: '/projects/**',
      },
      {
        protocol: 'https',
        hostname: 'home-services-app.s3.amazonaws.com',
        port: '',
        pathname: '/profile-pictures/**',
      },
      {
        protocol: 'https',
        hostname: 'home-services-app.s3.amazonaws.com',
        port: '',
        pathname: '/lead-photos/**',
      },
    ],
  },
}

module.exports = nextConfig
