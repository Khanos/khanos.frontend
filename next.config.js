/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fillmurray.com',
      },
    ],
  },
}

module.exports = nextConfig
