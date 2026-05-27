/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  allowedDevOrigins: ['http://127.0.0.1:*', 'http://localhost:*'],
}

module.exports = nextConfig
