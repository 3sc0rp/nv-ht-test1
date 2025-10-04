import NatureVillageWebsite from '../components/NatureVillageWebsite'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Nature Village Restaurant | Authentic Middle Eastern Cuisine</title>
        <meta name="description" content="Experience authentic Middle Eastern flavors at Nature Village. Traditional family recipes, warm hospitality, and cultural heritage. Powered by Blunari's MenuIQ technology." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://naturevillagerestaurant.com" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Nature Village",
              "image": "https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp",
              "description": "Authentic Middle Eastern restaurant serving traditional cuisine with modern presentation",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "302 Satellite Blvd NE STE 125",
                "addressLocality": "Suwanee",
                "addressRegion": "GA",
                "postalCode": "30024"
              },
              "telephone": "+1-470-350-1019",
              "openingHours": [
                "Mo-Th 12:00-22:00",
                "Fr-Sa 12:00-23:00", 
                "Su 12:00-22:00"
              ],
              "servesCuisine": "Middle Eastern",
              "priceRange": "$$"
            })
          }}
        />
      </Head>
      <NatureVillageWebsite />
    </>
  )
}
