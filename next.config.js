/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'images.unsplash.com',
      'naturevillagerestaurant.com'
    ],
    unoptimized: true
  },
  i18n: {
    locales: ['en', 'ku', 'ar'],
    defaultLocale: 'en',
    localeDetection: false
  },
  trailingSlash: true,

}

module.exports = nextConfig