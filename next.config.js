/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    PROFILES: process.env.PROFILES,
  }
}

module.exports = nextConfig
