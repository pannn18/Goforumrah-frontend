/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cf.bstatic.com', 
      'cf2.bstatic.com', 
      '1000logos.net', 
      'logos-world.net', 
      'w7.pngwing.com',
      'download.logo.wine', // ← TAMBAHKAN INI
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'goforumrah-api.illiyin.studio',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com',
        pathname: '/xdata/images/**',
      },
      {
        protocol: 'https',
        hostname: 'goforumrah.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logos.skyscnr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logowik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flightaware.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.flightaware.com',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Bypass SSL verification for development
  webpack: (config, { isServer }) => {
    if (isServer) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    return config
  },
}

module.exports = nextConfig