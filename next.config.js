/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // This creates the 'out' folder
  trailingSlash: true,
  images: {
    unoptimized: true      // Important for shared hosting
  },
  reactStrictMode: false
}

module.exports = nextConfig
