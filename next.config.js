const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false, // Enable in dev for testing
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... (existing config)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: '*.arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'www.marketbeat.com',
      },
      {
        protocol: 'https',
        hostname: 'magiceden-launchpad.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: '*.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'bafybeif3ef6migxwcxj6lvpyzhilpp3qz64pqzytnmscq2v6bbwck64zku.ipfs.nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.nftstorage.link',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
  },
}

module.exports = withPWA(nextConfig)

