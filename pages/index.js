import NatureVillageWebsite from '../components/NatureVillageWebsite'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Nature Village - Kurdish Restaurant | Authentic Kurdish Cuisine</title>
        <meta name="description" content="Experience authentic Kurdish flavors at Nature Village. Traditional family recipes, warm hospitality, and cultural heritage. Powered by Blunari's MenuIQ technology." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://naturevillage.vercel.app" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Nature Village",
              "image": "https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp",
              "description": "Authentic Kurdish restaurant serving traditional cuisine with modern presentation",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Kurdistan Street",
                "addressLocality": "City Center",
                "addressRegion": "State",
                "postalCode": "12345"
              },
              "telephone": "+1-555-123-4567",
              "openingHours": [
                "Mo-Th 11:00-22:00",
                "Fr-Sa 11:00-23:00", 
                "Su 12:00-21:00"
              ],
              "servesCuisine": "Kurdish",
              "priceRange": "$$"
            })
          }}
        />
      </Head>
      <NatureVillageWebsite />
    </>
  )
}