import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReservationsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Make a Reservation',
      subtitle: 'Book Your Table',
      description: 'Reserve your table at Nature Village Restaurant and experience authentic Middle Eastern cuisine.',
      pageTitle: 'Reservations - Nature Village Restaurant',
      pageDescription: 'Book a table at Nature Village Restaurant. Easy online reservations for authentic Middle Eastern dining experience.',
    },
    ku: {
      title: 'حجزکردن',
      subtitle: 'میزەکەت حجز بکە',
      description: 'میزەکەت لە چێشتخانەی گوندی سروشت حجز بکە و تامی خۆراکی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست بکە.',
      pageTitle: 'حجزکردن - چێشتخانەی گوندی سروشت',
      pageDescription: 'میزێک لە چێشتخانەی گوندی سروشت حجز بکە. حجزکردنی ئۆنلاین بۆ ئەزموونی خواردنی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست.',
    },
    ar: {
      title: 'احجز طاولة',
      subtitle: 'احجز طاولتك',
      description: 'احجز طاولتك في مطعم قرية الطبيعة واستمتع بالمأكولات الشرق أوسطية الأصيلة.',
      pageTitle: 'الحجوزات - مطعم قرية الطبيعة',
      pageDescription: 'احجز طاولة في مطعم قرية الطبيعة. حجوزات سهلة عبر الإنترنت لتجربة طعام شرق أوسطي أصيل.',
    },
    fa: {
      title: 'رزرو میز',
      subtitle: 'میز خود را رزرو کنید',
      description: 'میز خود را در رستوران دهکده طبیعت رزرو کنید و غذای اصیل خاورمیانه را تجربه کنید.',
      pageTitle: 'رزرو - رستوران دهکده طبیعت',
      pageDescription: 'میز در رستوران دهکده طبیعت رزرو کنید. رزرو آنلاین آسان برای تجربه غذای اصیل خاورمیانه.',
    },
    tr: {
      title: 'Rezervasyon Yapın',
      subtitle: 'Masanızı Ayırtın',
      description: 'Nature Village Restaurant\'ta masanızı ayırtın ve otantik Orta Doğu mutfağını deneyimleyin.',
      pageTitle: 'Rezervasyonlar - Nature Village Restaurant',
      pageDescription: 'Nature Village Restaurant\'ta masa rezervasyonu yapın. Otantik Orta Doğu yemek deneyimi için kolay online rezervasyon.',
    },
    es: {
      title: 'Hacer una Reserva',
      subtitle: 'Reserve su Mesa',
      description: 'Reserve su mesa en Nature Village Restaurant y experimente la auténtica cocina de Oriente Medio.',
      pageTitle: 'Reservas - Nature Village Restaurant',
      pageDescription: 'Reserve una mesa en Nature Village Restaurant. Reservas en línea fáciles para una auténtica experiencia gastronómica de Oriente Medio.',
    },
    ur: {
      title: 'ریزرویشن کریں',
      subtitle: 'اپنی میز بک کریں',
      description: 'نیچر ولیج ریستوراں میں اپنی میز بک کریں اور مشرق وسطیٰ کے مستند کھانے کا تجربہ کریں۔',
      pageTitle: 'ریزرویشن - نیچر ولیج ریستوراں',
      pageDescription: 'نیچر ولیج ریستوراں میں میز بک کریں۔ مستند مشرق وسطیٰ کے کھانے کے تجربے کے لیے آسان آن لائن ریزرویشن۔',
    },
    kmr: {
      title: 'Rezervasyon Bikin',
      subtitle: 'Masaya Xwe Rezerve Bikin',
      description: 'Masaya xwe li Nature Village Restaurant rezerve bikin û xwarina resen a Rojhilatê Navîn biceribînin.',
      pageTitle: 'Rezervasyon - Nature Village Restaurant',
      pageDescription: 'Li Nature Village Restaurant masayê rezerve bikin. Rezervasyona online hêsan ji bo ezmûna xwarinê ya resen a Rojhilatê Navîn.',
    },
    ru: {
      title: 'Забронировать столик',
      subtitle: 'Забронируйте ваш столик',
      description: 'Забронируйте столик в ресторане Nature Village и насладитесь аутентичной ближневосточной кухней.',
      pageTitle: 'Бронирование - Ресторан Nature Village',
      pageDescription: 'Забронируйте столик в ресторане Nature Village. Простое онлайн-бронирование для аутентичного ближневосточного ужина.',
    },
    hi: {
      title: 'आरक्षण करें',
      subtitle: 'अपनी मेज़ बुक करें',
      description: 'नेचर विलेज रेस्तरां में अपनी मेज़ बुक करें और प्रामाणिक मध्य पूर्वी व्यंजनों का अनुभव करें।',
      pageTitle: 'आरक्षण - नेचर विलेज रेस्तरां',
      pageDescription: 'नेचर विलेज रेस्तरां में एक मेज़ बुक करें। प्रामाणिक मध्य पूर्वी भोजन अनुभव के लिए आसान ऑनलाइन आरक्षण।',
    },
    sq: {
      title: 'Bëni një Rezervim',
      subtitle: 'Rezervoni Tavolinën Tuaj',
      description: 'Rezervoni tavolinën tuaj në Nature Village Restaurant dhe përjetoni kuzhinën autentike të Lindjes së Mesme.',
      pageTitle: 'Rezervimet - Nature Village Restaurant',
      pageDescription: 'Rezervoni një tavolinë në Nature Village Restaurant. Rezervime të lehta online për një përvojë autentike gatuese të Lindjes së Mesme.',
    },
    fr: {
      title: 'Faire une Réservation',
      subtitle: 'Réservez votre Table',
      description: 'Réservez votre table au Nature Village Restaurant et découvrez la cuisine authentique du Moyen-Orient.',
      pageTitle: 'Réservations - Nature Village Restaurant',
      pageDescription: 'Réservez une table au Nature Village Restaurant. Réservations en ligne faciles pour une expérience culinaire authentique du Moyen-Orient.',
    },
    de: {
      title: 'Reservierung vornehmen',
      subtitle: 'Reservieren Sie Ihren Tisch',
      description: 'Reservieren Sie Ihren Tisch im Nature Village Restaurant und erleben Sie authentische nahöstliche Küche.',
      pageTitle: 'Reservierungen - Nature Village Restaurant',
      pageDescription: 'Reservieren Sie einen Tisch im Nature Village Restaurant. Einfache Online-Reservierungen für authentisches nahöstliches Speiseerlebnis.',
    },
    bn: {
      title: 'একটি সংরক্ষণ করুন',
      subtitle: 'আপনার টেবিল বুক করুন',
      description: 'নেচার ভিলেজ রেস্তোরাঁয় আপনার টেবিল সংরক্ষণ করুন এবং খাঁটি মধ্যপ্রাচ্যের খাবারের অভিজ্ঞতা নিন।',
      pageTitle: 'সংরক্ষণ - নেচার ভিলেজ রেস্তোরাঁ',
      pageDescription: 'নেচার ভিলেজ রেস্তোরাঁয় একটি টেবিল বুক করুন। খাঁটি মধ্যপ্রাচ্যের খাবারের অভিজ্ঞতার জন্য সহজ অনলাইন সংরক্ষণ।',
    },
    ko: {
      title: '예약하기',
      subtitle: '테이블 예약',
      description: 'Nature Village 레스토랑에서 테이블을 예약하고 정통 중동 요리를 경험하세요.',
      pageTitle: '예약 - Nature Village 레스토랑',
      pageDescription: 'Nature Village 레스토랑에서 테이블을 예약하세요. 정통 중동 식사 경험을 위한 쉬운 온라인 예약.',
    },
    ro: {
      title: 'Faceți o Rezervare',
      subtitle: 'Rezervați Masa',
      description: 'Rezervați masa la Nature Village Restaurant și experimentați bucătăria autentică din Orientul Mijlociu.',
      pageTitle: 'Rezervări - Nature Village Restaurant',
      pageDescription: 'Rezervați o masă la Nature Village Restaurant. Rezervări online ușoare pentru o experiență autentică culinară din Orientul Mijlociu.',
    },
    uk: {
      title: 'Забронювати столик',
      subtitle: 'Забронюйте ваш столик',
      description: 'Забронюйте столик у ресторані Nature Village та насолодіться автентичною близькосхідною кухнею.',
      pageTitle: 'Бронювання - Ресторан Nature Village',
      pageDescription: 'Забронюйте столик у ресторані Nature Village. Просте онлайн-бронювання для автентичної близькосхідної вечері.',
    },
    vi: {
      title: 'Đặt Bàn',
      subtitle: 'Đặt Bàn Của Bạn',
      description: 'Đặt bàn tại Nhà hàng Nature Village và trải nghiệm ẩm thực Trung Đông chính thống.',
      pageTitle: 'Đặt Bàn - Nhà hàng Nature Village',
      pageDescription: 'Đặt bàn tại Nhà hàng Nature Village. Đặt bàn trực tuyến dễ dàng cho trải nghiệm ẩm thực Trung Đông chính thống.',
    },
  };

  const t = translations[language] || translations.en;

  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t.pageTitle} />
        <meta property="og:description" content={t.pageDescription} />
        <meta property="og:type" content="website" />
      </Head>

      <Header currentPage="reservations" />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className={`text-center mb-12 ${isRTL ? 'rtl' : 'ltr'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-amber-600 mb-2">
              {t.subtitle}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          {/* Blunari Booking Widget Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div id="reservation-widget-container" className="w-full" style={{ minHeight: '800px' }}>
              {/* Blunari Booking Widget */}
              <iframe
                src="https://app.blunari.ai/public-widget/book/nature-village?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzbHVnIjoibmF0dXJlLXZpbGxhZ2UiLCJjb25maWdWZXJzaW9uIjoiMi4wIiwidGltZXN0YW1wIjoxNzYwNjUzNTA4LCJ3aWRnZXRUeXBlIjoiYm9va2luZyIsImV4cCI6MTc2MDY1NzEwOCwiaWF0IjoxNzYwNjUzNTA4fQ.NjY1NDAxMjI2MTJkNGU2NDVmMmQ0MDY5NGU3OTRkNTk1ZjJhMDIyMzYyMDQ1OTE0NzYyOTQ1MjY0ZTdkMDQzYQ"
                width="100%"
                height="800"
                frameBorder="0"
                style={{ border: 'none', display: 'block', minHeight: '800px' }}
                title="Blunari Booking Widget"
                loading="eager"
                sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="payment; geolocation"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                {language === 'ar' ? 'الهاتف' : language === 'ku' ? 'تەلەفۆن' : language === 'fa' ? 'تلفن' : 'Phone'}
              </h3>
              <a href="tel:4703501019" className="text-amber-600 hover:text-amber-700">
                (470) 350-1019
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                {language === 'ar' ? 'ساعات العمل' : language === 'ku' ? 'کاتی کارکردن' : language === 'fa' ? 'ساعات کاری' : 'Hours'}
              </h3>
              <p className="text-gray-600 text-sm">
                Sun-Thu: 12PM-10PM<br />
                Fri-Sat: 12PM-11PM
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                {language === 'ar' ? 'الموقع' : language === 'ku' ? 'شوێن' : language === 'fa' ? 'مکان' : 'Location'}
              </h3>
              <p className="text-gray-600 text-sm">
                302 Satellite Blvd NE<br />
                Suwanee, GA 30024
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ReservationsPage;
