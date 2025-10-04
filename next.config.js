/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'naturevillagerestaurant.com',
        port: '',
        pathname: '/**',
      }
    ],
    unoptimized: false,
    formats: ['image/webp', 'image/avif']
  },
  i18n: {
    locales: ['en', 'ku', 'ar', 'fa', 'tr', 'ur', 'kmr'],
    defaultLocale: 'en',
    localeDetection: false
  },
  trailingSlash: true,
}

module.exports = nextConfig