import '../styles/globals.css'
import Head from 'next/head'
import { LanguageProvider } from '../contexts/LanguageContext'

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <title>Nature Village - Middle Eastern Restaurant</title>
        <meta name="description" content="Experience authentic Middle Eastern flavors at Nature Village. Traditional recipes, warm hospitality, and cultural heritage in every dish." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Middle Eastern restaurant, Middle Eastern food, traditional cuisine, halal food, authentic flavors" />
        <meta property="og:title" content="Nature Village - Middle Eastern Restaurant" />
        <meta property="og:description" content="A Taste of Middle East in Every Bite" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}