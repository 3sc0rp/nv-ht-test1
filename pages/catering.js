import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';

const CateringPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Catering Services',
      subtitle: 'Perfect for Your Special Events',
      description: 'Let us cater your next event with authentic Middle Eastern cuisine. From intimate gatherings to large celebrations.',
      pageTitle: 'Catering Services - Nature Village Restaurant',
      pageDescription: 'Professional catering services for all occasions. Authentic Middle Eastern cuisine for your events, parties, and celebrations.',
    },
    ku: {
      title: 'خزمەتگوزاری کەیتەرینگ',
      subtitle: 'تەواو بۆ بۆنە تایبەتەکانتان',
      description: 'با ئێمە بۆنەی داهاتووتان بە خۆراکی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست ئامادە بکەین. لە کۆبوونەوەی نزیکەوە تا ئاهەنگە گەورەکان.',
      pageTitle: 'خزمەتگوزاری کەیتەرینگ - چێشتخانەی گوندی سروشت',
      pageDescription: 'خزمەتگوزاری پیشەیی کەیتەرینگ بۆ هەموو بۆنەکان. خۆراکی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست بۆ بۆنە، پارتی و ئاهەنگەکانتان.',
    },
    ar: {
      title: 'خدمات التقديم',
      subtitle: 'مثالي لمناسباتك الخاصة',
      description: 'دعنا نقدم حفلتك القادمة بالمأكولات الشرق أوسطية الأصيلة. من التجمعات الحميمة إلى الاحتفالات الكبيرة.',
      pageTitle: 'خدمات التقديم - مطعم قرية الطبيعة',
      pageDescription: 'خدمات تقديم احترافية لجميع المناسبات. المأكولات الشرق أوسطية الأصيلة لفعالياتك وحفلاتك واحتفالاتك.',
    },
    fa: {
      title: 'خدمات پذیرایی',
      subtitle: 'عالی برای رویدادهای خاص شما',
      description: 'اجازه دهید رویداد بعدی شما را با غذای اصیل خاورمیانه برگزار کنیم. از گردهمایی‌های صمیمی تا جشن‌های بزرگ.',
      pageTitle: 'خدمات پذیرایی - رستوران دهکده طبیعت',
      pageDescription: 'خدمات پذیرایی حرفه‌ای برای تمام مناسبات. غذای اصیل خاورمیانه برای رویدادها، مهمانی‌ها و جشن‌های شما.',
    },
    tr: {
      title: 'Catering Hizmetleri',
      subtitle: 'Özel Etkinlikleriniz İçin Mükemmel',
      description: 'Bir sonraki etkinliğinizi otantik Orta Doğu mutfağı ile sunalım. Samimi toplantılardan büyük kutlamalara kadar.',
      pageTitle: 'Catering Hizmetleri - Nature Village Restaurant',
      pageDescription: 'Tüm durumlar için profesyonel catering hizmetleri. Etkinlikleriniz, partileriniz ve kutlamalarınız için otantik Orta Doğu mutfağı.',
    },
    es: {
      title: 'Servicios de Catering',
      subtitle: 'Perfecto para Sus Eventos Especiales',
      description: 'Permítanos atender su próximo evento con auténtica cocina de Oriente Medio. Desde reuniones íntimas hasta grandes celebraciones.',
      pageTitle: 'Servicios de Catering - Nature Village Restaurant',
      pageDescription: 'Servicios profesionales de catering para todas las ocasiones. Cocina auténtica de Oriente Medio para sus eventos, fiestas y celebraciones.',
    },
    ur: {
      title: 'کیٹرنگ سروسز',
      subtitle: 'آپ کی خاص تقریبات کے لیے بہترین',
      description: 'ہمیں اپنی اگلی تقریب میں مستند مشرق وسطیٰ کے کھانے کے ساتھ خدمات فراہم کرنے دیں۔ قریبی اجتماعات سے لے کر بڑی تقریبات تک۔',
      pageTitle: 'کیٹرنگ سروسز - نیچر ولیج ریستوراں',
      pageDescription: 'تمام مواقع کے لیے پیشہ ورانہ کیٹرنگ سروسز۔ آپ کی تقریبات، پارٹیوں اور جشن کے لیے مستند مشرق وسطیٰ کا کھانا۔',
    },
    kmr: {
      title: 'Xizmetên Catering',
      subtitle: 'Bêkêmasî ji bo Bûyerên Taybet',
      description: 'Bila em bûyera we ya paşîn bi xwarina resen a Rojhilatê Navîn pêşkêş bikin. Ji civînên nêzîk heya şahiyên mezin.',
      pageTitle: 'Xizmetên Catering - Nature Village Restaurant',
      pageDescription: 'Xizmetên catering ên profesyonel ji bo hemû derfetan. Xwarina resen a Rojhilatê Navîn ji bo bûyer, partî û şahiyên we.',
    },
    ru: {
      title: 'Кейтеринг услуги',
      subtitle: 'Идеально для ваших особых мероприятий',
      description: 'Позвольте нам организовать ваше следующее мероприятие с аутентичной ближневосточной кухней. От интимных встреч до больших торжеств.',
      pageTitle: 'Кейтеринг услуги - Ресторан Nature Village',
      pageDescription: 'Профессиональные кейтеринг услуги для любых случаев. Аутентичная ближневосточная кухня для ваших мероприятий, вечеринок и празднований.',
    },
    hi: {
      title: 'कैटरिंग सेवाएं',
      subtitle: 'आपके विशेष कार्यक्रमों के लिए सही',
      description: 'हमें अपने अगले कार्यक्रम को प्रामाणिक मध्य पूर्वी व्यंजनों के साथ कैटर करने दें। अंतरंग समारोहों से लेकर बड़े उत्सवों तक।',
      pageTitle: 'कैटरिंग सेवाएं - नेचर विलेज रेस्तरां',
      pageDescription: 'सभी अवसरों के लिए पेशेवर कैटरिंग सेवाएं। आपके कार्यक्रमों, पार्टियों और उत्सवों के लिए प्रामाणिक मध्य पूर्वी व्यंजन।',
    },
    sq: {
      title: 'Shërbimet e Kateringut',
      subtitle: 'I Përsosur për Ngjarjet Tuaja të Veçanta',
      description: 'Lejojmë të kujdesemi për ngjarjen tuaj të ardhshme me kuzhinë autentike të Lindjes së Mesme. Nga takimet intime deri te festimet e mëdha.',
      pageTitle: 'Shërbimet e Kateringut - Nature Village Restaurant',
      pageDescription: 'Shërbime profesionale kateringu për të gjitha rastet. Kuzhinë autentike e Lindjes së Mesme për ngjarjet, festat dhe festimet tuaja.',
    },
    fr: {
      title: 'Services de Traiteur',
      subtitle: 'Parfait pour Vos Événements Spéciaux',
      description: 'Laissez-nous organiser votre prochain événement avec une cuisine authentique du Moyen-Orient. Des rassemblements intimes aux grandes célébrations.',
      pageTitle: 'Services de Traiteur - Nature Village Restaurant',
      pageDescription: 'Services de traiteur professionnels pour toutes les occasions. Cuisine authentique du Moyen-Orient pour vos événements, fêtes et célébrations.',
    },
    de: {
      title: 'Catering-Services',
      subtitle: 'Perfekt für Ihre besonderen Veranstaltungen',
      description: 'Lassen Sie uns Ihre nächste Veranstaltung mit authentischer nahöstlicher Küche catern. Von intimen Zusammenkünften bis zu großen Feiern.',
      pageTitle: 'Catering-Services - Nature Village Restaurant',
      pageDescription: 'Professionelle Catering-Services für alle Anlässe. Authentische nahöstliche Küche für Ihre Veranstaltungen, Partys und Feiern.',
    },
    bn: {
      title: 'ক্যাটারিং সেবা',
      subtitle: 'আপনার বিশেষ অনুষ্ঠানের জন্য নিখুঁত',
      description: 'আমাদের আপনার পরবর্তী ইভেন্টটি খাঁটি মধ্যপ্রাচ্যের খাবারের সাথে পরিবেশন করতে দিন। ঘনিষ্ঠ সমাবেশ থেকে বড় উদযাপন পর্যন্ত।',
      pageTitle: 'ক্যাটারিং সেবা - নেচার ভিলেজ রেস্তোরাঁ',
      pageDescription: 'সকল উপলক্ষের জন্য পেশাদার ক্যাটারিং সেবা। আপনার ইভেন্ট, পার্টি এবং উদযাপনের জন্য খাঁটি মধ্যপ্রাচ্যের খাবার।',
    },
    ko: {
      title: '케이터링 서비스',
      subtitle: '특별한 행사를 위한 완벽한 선택',
      description: '정통 중동 요리로 다음 이벤트를 케이터링하게 해주세요. 소규모 모임부터 대규모 축하 행사까지.',
      pageTitle: '케이터링 서비스 - Nature Village 레스토랑',
      pageDescription: '모든 행사를 위한 전문 케이터링 서비스. 이벤트, 파티 및 축하 행사를 위한 정통 중동 요리.',
    }
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

      <Header currentPage="catering" />

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

          {/* Blunari Catering Widget Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div id="catering-widget-container" className="w-full" style={{ minHeight: '800px' }}>
              {/* Blunari Catering Widget */}
              <iframe
                src="https://app.blunari.ai/public-widget/catering/nature-village?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzbHVnIjoibmF0dXJlLXZpbGxhZ2UiLCJjb25maWdWZXJzaW9uIjoiMi4wIiwidGltZXN0YW1wIjoxNzYwNjU0MTc4LCJ3aWRnZXRUeXBlIjoiY2F0ZXJpbmciLCJleHAiOjE3NjA2NTc3NzgsImlhdCI6MTc2MDY1NDE3OH0.NTU3ZjdkMDYyNjcxMmQwNTY4NzEyZTA1NTM2MDdhMDM3Zjc2MDc1YTA5NTgyYzQzMDQ0ZjI4MDEwMDYwN2QwNw"
                width="100%"
                height="800"
                frameBorder="0"
                style={{ border: 'none', display: 'block', minHeight: '800px' }}
                title="Blunari Catering Booking Widget"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
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
                {language === 'ar' ? 'البريد الإلكتروني' : language === 'ku' ? 'ئیمەیل' : language === 'fa' ? 'ایمیل' : 'Email'}
              </h3>
              <a href="mailto:catering@naturevillage.com" className="text-amber-600 hover:text-amber-700 text-sm">
                catering@naturevillage.com
              </a>
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

export default CateringPage;
