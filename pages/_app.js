import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Nature Village - Kurdish Restaurant</title>
        <meta name="description" content="Experience authentic Kurdish flavors at Nature Village. Traditional recipes, warm hospitality, and cultural heritage in every dish." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Kurdish restaurant, Middle Eastern food, traditional cuisine, halal food, Kurdistan, authentic flavors" />
        <meta property="og:title" content="Nature Village - Kurdish Restaurant" />
        <meta property="og:description" content="A Taste of Kurdistan in Every Bite" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}