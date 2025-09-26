import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
  {/* Favicon (single source) */}
  <link rel="icon" href="/favicon.ico" />
  <link rel="shortcut icon" href="/favicon.ico" />
  {/* Optional: theme color for mobile UI */}
  <meta name="theme-color" content="#8b4513" />
  {/* Removed references to missing apple-touch and PNG size icons to avoid 404 requests */}
        
        {/* Font Preconnections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
