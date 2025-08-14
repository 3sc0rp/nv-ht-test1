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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}