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
        port: '',
        pathname: '**/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '**/**',
      },
    ],
  },
}

module.exports = nextConfig
