/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'images.unsplash.com',
      'naturevillagerestaurant.com'
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