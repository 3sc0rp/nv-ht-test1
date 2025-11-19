import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const CateringPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to ezCater page
    window.location.href = 'https://www.ezcater.com/catering/pvt/nature-village-restaurant-3';
  }, []);

  return (
    <>
      <Head>
        <title>Catering - Nature Village Restaurant</title>
        <meta name="description" content="Professional catering services for all occasions. Authentic Middle Eastern cuisine for your events." />
        <meta httpEquiv="refresh" content="0; url=https://www.ezcater.com/catering/pvt/nature-village-restaurant-3" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Redirecting to Catering Services...</h1>
          <p className="text-gray-600">
            If you are not redirected automatically, please{' '}
            <a 
              href="https://www.ezcater.com/catering/pvt/nature-village-restaurant-3" 
              className="text-amber-600 hover:text-amber-700 underline"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default CateringPage;
