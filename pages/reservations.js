import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Phone } from 'lucide-react';

const ReservationsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Reservations',
      callToReserve: 'Call to Reserve',
      phoneNumber: '470-350-1019',
      subtitle: 'We look forward to serving you',
      pageTitle: 'Reservations - Nature Village Restaurant',
      pageDescription: 'Call 470-350-1019 to reserve your table at Nature Village Restaurant for an authentic Middle Eastern dining experience.',
    },
    ku: {
      title: 'حجزکردن',
      callToReserve: 'پەیوەندی بکە بۆ حجزکردن',
      phoneNumber: '470-350-1019',
      subtitle: 'چاوەڕێی خزمەتکردنتانین',
      pageTitle: 'حجزکردن - چێشتخانەی گوندی سروشت',
      pageDescription: 'پەیوەندی بکە بە 470-350-1019 بۆ حجزکردنی میزەکەت لە چێشتخانەی گوندی سروشت.',
    },
    ar: {
      title: 'الحجوزات',
      callToReserve: 'اتصل للحجز',
      phoneNumber: '470-350-1019',
      subtitle: 'نتطلع إلى خدمتك',
      pageTitle: 'الحجوزات - مطعم قرية الطبيعة',
      pageDescription: 'اتصل على 470-350-1019 لحجز طاولتك في مطعم قرية الطبيعة.',
    },
    fa: {
      title: 'رزرو',
      callToReserve: 'برای رزرو تماس بگیرید',
      phoneNumber: '470-350-1019',
      subtitle: 'مشتاق خدمت به شما هستیم',
      pageTitle: 'رزرو - رستوران دهکده طبیعت',
      pageDescription: 'برای رزرو میز خود در رستوران دهکده طبیعت با 470-350-1019 تماس بگیرید.',
    },
    tr: {
      title: 'Rezervasyonlar',
      callToReserve: 'Rezervasyon için Arayın',
      phoneNumber: '470-350-1019',
      subtitle: 'Size hizmet etmeyi dört gözle bekliyoruz',
      pageTitle: 'Rezervasyonlar - Nature Village Restaurant',
      pageDescription: 'Nature Village Restaurant\'ta masa rezervasyonu için 470-350-1019\'u arayın.',
    },
    es: {
      title: 'Reservas',
      callToReserve: 'Llame para Reservar',
      phoneNumber: '470-350-1019',
      subtitle: 'Esperamos servirle',
      pageTitle: 'Reservas - Nature Village Restaurant',
      pageDescription: 'Llame al 470-350-1019 para reservar su mesa en Nature Village Restaurant.',
    },
    ur: {
      title: 'ریزرویشن',
      callToReserve: 'ریزرو کرنے کے لیے کال کریں',
      phoneNumber: '470-350-1019',
      subtitle: 'ہم آپ کی خدمت کے منتظر ہیں',
      pageTitle: 'ریزرویشن - نیچر ولیج ریستوراں',
      pageDescription: 'نیچر ولیج ریستوراں میں اپنی میز بک کرنے کے لیے 470-350-1019 پر کال کریں۔',
    },
    kmr: {
      title: 'Rezervasyon',
      callToReserve: 'Ji bo Rezervasyonê Telefon Bikin',
      phoneNumber: '470-350-1019',
      subtitle: 'Em li bendê ne ku ji we re xizmetê bikin',
      pageTitle: 'Rezervasyon - Nature Village Restaurant',
      pageDescription: 'Ji bo rezervasyona masaya xwe li Nature Village Restaurant 470-350-1019 telefon bikin.',
    },
    ru: {
      title: 'Бронирование',
      callToReserve: 'Позвоните для Бронирования',
      phoneNumber: '470-350-1019',
      subtitle: 'Мы с нетерпением ждем возможности обслужить вас',
      pageTitle: 'Бронирование - Ресторан Nature Village',
      pageDescription: 'Позвоните по номеру 470-350-1019, чтобы забронировать столик в ресторане Nature Village.',
    },
    hi: {
      title: 'आरक्षण',
      callToReserve: 'आरक्षण के लिए कॉल करें',
      phoneNumber: '470-350-1019',
      subtitle: 'हम आपकी सेवा करने के लिए तत्पर हैं',
      pageTitle: 'आरक्षण - नेचर विलेज रेस्तरां',
      pageDescription: 'नेचर विलेज रेस्तरां में अपनी मेज़ बुक करने के लिए 470-350-1019 पर कॉल करें।',
    },
    sq: {
      title: 'Rezervimet',
      callToReserve: 'Telefononi për Rezervim',
      phoneNumber: '470-350-1019',
      subtitle: 'Presim me padurim t\'ju shërbejmë',
      pageTitle: 'Rezervimet - Nature Village Restaurant',
      pageDescription: 'Telefononi 470-350-1019 për të rezervuar tavolinën tuaj në Nature Village Restaurant.',
    },
    fr: {
      title: 'Réservations',
      callToReserve: 'Appelez pour Réserver',
      phoneNumber: '470-350-1019',
      subtitle: 'Nous sommes impatients de vous servir',
      pageTitle: 'Réservations - Nature Village Restaurant',
      pageDescription: 'Appelez le 470-350-1019 pour réserver votre table au Nature Village Restaurant.',
    },
    de: {
      title: 'Reservierungen',
      callToReserve: 'Anrufen zum Reservieren',
      phoneNumber: '470-350-1019',
      subtitle: 'Wir freuen uns darauf, Sie zu bedienen',
      pageTitle: 'Reservierungen - Nature Village Restaurant',
      pageDescription: 'Rufen Sie 470-350-1019 an, um Ihren Tisch im Nature Village Restaurant zu reservieren.',
    },
    bn: {
      title: 'সংরক্ষণ',
      callToReserve: 'সংরক্ষণের জন্য কল করুন',
      phoneNumber: '470-350-1019',
      subtitle: 'আমরা আপনাকে সেবা দিতে উন্মুখ',
      pageTitle: 'সংরক্ষণ - নেচার ভিলেজ রেস্তোরাঁ',
      pageDescription: 'নেচার ভিলেজ রেস্তোরাঁয় আপনার টেবিল বুক করতে 470-350-1019 নম্বরে কল করুন।',
    },
    ko: {
      title: '예약',
      callToReserve: '예약을 위해 전화하세요',
      phoneNumber: '470-350-1019',
      subtitle: '여러분을 모시기를 기대합니다',
      pageTitle: '예약 - Nature Village 레스토랑',
      pageDescription: 'Nature Village 레스토랑 예약을 위해 470-350-1019로 전화하세요.',
    },
    bs: {
      title: 'Rezervacije',
      callToReserve: 'Pozovite za Rezervaciju',
      phoneNumber: '470-350-1019',
      subtitle: 'Radujemo se što ćemo vam služiti',
      pageTitle: 'Rezervacije - Nature Village Restaurant',
      pageDescription: 'Pozovite 470-350-1019 da rezervišete vaš sto u Nature Village Restaurant.',
    },
    zh: {
      title: '预订',
      callToReserve: '致电预订',
      phoneNumber: '470-350-1019',
      subtitle: '我们期待为您服务',
      pageTitle: '预订 - Nature Village Restaurant',
      pageDescription: '致电 470-350-1019 在 Nature Village Restaurant 预订您的座位。',
    },
    ro: {
      title: 'Rezervări',
      callToReserve: 'Sunați pentru Rezervare',
      phoneNumber: '470-350-1019',
      subtitle: 'Așteptăm cu nerăbdare să vă servim',
      pageTitle: 'Rezervări - Nature Village Restaurant',
      pageDescription: 'Sunați la 470-350-1019 pentru a rezerva masa la Nature Village Restaurant.',
    },
    uk: {
      title: 'Бронювання',
      callToReserve: 'Телефонуйте для Бронювання',
      phoneNumber: '470-350-1019',
      subtitle: 'Ми з нетерпінням чекаємо можливості обслужити вас',
      pageTitle: 'Бронювання - Ресторан Nature Village',
      pageDescription: 'Зателефонуйте за номером 470-350-1019, щоб забронювати столик у ресторані Nature Village.',
    },
    vi: {
      title: 'Đặt Bàn',
      callToReserve: 'Gọi để Đặt Bàn',
      phoneNumber: '470-350-1019',
      subtitle: 'Chúng tôi mong được phục vụ bạn',
      pageTitle: 'Đặt Bàn - Nhà hàng Nature Village',
      pageDescription: 'Gọi 470-350-1019 để đặt bàn tại Nhà hàng Nature Village.',
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

      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`text-center ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Decorative Top Border */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-full max-w-md"></div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 backdrop-blur-sm bg-opacity-95 border border-amber-100">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900 mb-6">
                {t.title}
              </h1>

              {/* Call to Reserve Text */}
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
                {t.callToReserve}
              </p>

              {/* Phone Number - Large and Interactive */}
              <a 
                href="tel:4703501019"
                className="group inline-flex items-center justify-center gap-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-3xl md:text-4xl lg:text-5xl py-6 px-10 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-8"
              >
                <Phone className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
                <span className="tracking-wide">{t.phoneNumber}</span>
              </a>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-amber-700 font-medium mt-8">
                {t.subtitle}
              </p>

              {/* Decorative Elements */}
              <div className="mt-12 flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-full max-w-md"></div>
            </div>

            {/* Additional Info - Location & Hours */}
            <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-amber-100">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  {language === 'ar' ? 'ساعات العمل' : language === 'ku' ? 'کاتی کارکردن' : language === 'fa' ? 'ساعات کاری' : language === 'tr' ? 'Çalışma Saatleri' : language === 'es' ? 'Horario' : language === 'ur' ? 'اوقات' : language === 'kmr' ? 'Demên Xebatê' : language === 'ru' ? 'Часы работы' : language === 'hi' ? 'समय' : language === 'sq' ? 'Orari' : language === 'fr' ? 'Horaires' : language === 'de' ? 'Öffnungszeiten' : language === 'bn' ? 'সময়' : language === 'ko' ? '영업시간' : language === 'bs' ? 'Radno Vrijeme' : language === 'zh' ? '营业时间' : language === 'ro' ? 'Program' : language === 'uk' ? 'Години роботи' : language === 'vi' ? 'Giờ làm việc' : 'Hours'}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Mon-Thu: 11:30AM-9:30PM<br />
                  Fri: 11:30AM-10:30PM<br />
                  Sat: 12:00PM-10:30PM<br />
                  Sun: 12:00PM-9:30PM
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-amber-100">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  {language === 'ar' ? 'الموقع' : language === 'ku' ? 'شوێن' : language === 'fa' ? 'مکان' : language === 'tr' ? 'Konum' : language === 'es' ? 'Ubicación' : language === 'ur' ? 'مقام' : language === 'kmr' ? 'Cih' : language === 'ru' ? 'Адрес' : language === 'hi' ? 'स्थान' : language === 'sq' ? 'Vendndodhja' : language === 'fr' ? 'Emplacement' : language === 'de' ? 'Standort' : language === 'bn' ? 'অবস্থান' : language === 'ko' ? '위치' : language === 'bs' ? 'Lokacija' : language === 'zh' ? '地址' : language === 'ro' ? 'Locație' : language === 'uk' ? 'Адреса' : language === 'vi' ? 'Địa điểm' : 'Location'}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  302 Satellite Blvd NE<br />
                  Suwanee, GA 30024
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ReservationsPage;
