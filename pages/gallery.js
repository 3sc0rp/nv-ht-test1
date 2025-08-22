import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  ArrowLeft,
  Clock,
  Phone as PhoneIcon,
  Camera
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';

const GalleryPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Under Maintenance',
      subtitle: 'Photo Gallery',
      message: 'We are currently updating our photo gallery to showcase our latest experiences.',
      expectedTime: 'Expected to be back online soon.',
      backToHome: 'Back to Home',
      contact: 'For more information, please call us at',
      phone: '(470) 350-1019'
    },
    ku: {
      title: 'لە ژێر چاکسازیدایە',
      subtitle: 'گاڵەری وێنەکان',
      message: 'ئێمە لە ئێستادا گاڵەری وێنەکانمان نوێ دەکەینەوە بۆ پیشاندانی تازەترین ئەزموونەکانمان.',
      expectedTime: 'بە زوویی دەگەڕێتەوە.',
      backToHome: 'گەڕانەوە بۆ ماڵەوە',
      contact: 'بۆ زانیاری زیاتر، تکایە پەیوەندیمان پێوە بکەن',
      phone: '(470) 350-1019'
    },
    ar: {
      title: 'تحت الصيانة',
      subtitle: 'معرض الصور',
      message: 'نحن نقوم حالياً بتحديث معرض الصور لعرض أحدث تجاربنا.',
      expectedTime: 'متوقع العودة قريباً.',
      backToHome: 'العودة للرئيسية',
      contact: 'لمزيد من المعلومات، يرجى الاتصال بنا على',
      phone: '(470) 350-1019'
    },
    fa: {
      title: 'در حال تعمیر',
      subtitle: 'گالری عکس',
      message: 'ما در حال حاضر گالری عکس خود را برای نمایش جدیدترین تجربیات خود به‌روزرسانی می‌کنیم.',
      expectedTime: 'به زودی برمی‌گردیم.',
      backToHome: 'بازگشت به خانه',
      contact: 'برای اطلاعات بیشتر، لطفاً با ما تماس بگیرید',
      phone: '(470) 350-1019'
    },
    tr: {
      title: 'Bakım Altında',
      subtitle: 'Fotoğraf Galerisi',
      message: 'En son deneyimlerimizi sergilemek için fotoğraf galerimizi güncelliyoruz.',
      expectedTime: 'Yakında tekrar online olacak.',
      backToHome: 'Ana Sayfaya Dön',
      contact: 'Daha fazla bilgi için lütfen bizi arayın',
      phone: '(470) 350-1019'
    },
    es: {
      title: 'En Mantenimiento',
      subtitle: 'Galería de Fotos',
      message: 'Actualmente estamos actualizando nuestra galería de fotos para mostrar nuestras experiencias más recientes.',
      expectedTime: 'Esperamos estar de vuelta en línea pronto.',
      backToHome: 'Volver al Inicio',
      contact: 'Para más información, por favor llámenos al',
      phone: '(470) 350-1019'
    },
    ur: {
      title: 'دیکھ بھال میں',
      subtitle: 'تصاویر کی گیلری',
      message: 'ہم اپنے جدید ترین تجربات دکھانے کے لیے اپنی تصاویر کی گیلری کو اپڈیٹ کر رہے ہیں۔',
      expectedTime: 'جلد ہی واپس آئیں گے۔',
      backToHome: 'گھر واپس جائیں',
      contact: 'مزید معلومات کے لیے، براہ کرم ہمیں کال کریں',
      phone: '(470) 350-1019'
    },
    kmr: {
      title: 'Di Bin Nerîna De',
      subtitle: 'Galeriya Wêneyan',
      message: 'Em niha galeriya wêneyan nû dikin da ku pêşandana ezmûnên me yên herî nû bidin.',
      expectedTime: 'Zû dê vegere online.',
      backToHome: 'Vegere Malê',
      contact: 'Ji bo zêdetir agahiyan, ji kerema xwe bi me re têkiliyê daynin',
      phone: '(470) 350-1019'
    },
    ru: {
      title: 'На обслуживании',
      subtitle: 'Фотогалерея',
      message: 'Мы обновляем нашу фотогалерею, чтобы показать наши последние впечатления.',
      expectedTime: 'Скоро вернемся в онлайн.',
      backToHome: 'Вернуться домой',
      contact: 'Для получения дополнительной информации, пожалуйста, звоните нам',
      phone: '(470) 350-1019'
    },
    hi: {
      title: 'रखरखाव में',
      subtitle: 'फोटो गैलरी',
      message: 'हम अपने नवीनतम अनुभवों को दिखाने के लिए अपनी फोटो गैलरी को अपडेट कर रहे हैं।',
      expectedTime: 'जल्द ही वापस ऑनलाइन आएंगे।',
      backToHome: 'होम पर वापस जाएं',
      contact: 'अधिक जानकारी के लिए, कृपया हमें कॉल करें',
      phone: '(470) 350-1019'
    },
    sq: {
      title: 'Në Mirëmbajtje',
      subtitle: 'Galeria e Fotografive',
      message: 'Aktualisht po përditësojmë galerinë tonë të fotografive për të shfaqur përvojat tona më të reja.',
      expectedTime: 'Presim të jemi të disponueshëm përsëri së shpejti.',
      backToHome: 'Kthehu në Kreu',
      contact: 'Për më shumë informacion, ju lutemi na telefononi në',
      phone: '(470) 350-1019'
    },
    fr: {
      title: 'En Maintenance',
      subtitle: 'Galerie Photo',
      message: 'Nous mettons actuellement à jour notre galerie photo pour présenter nos dernières expériences.',
      expectedTime: 'Nous espérons être de nouveau en ligne bientôt.',
      backToHome: 'Retour à l\'Accueil',
      contact: 'Pour plus d\'informations, veuillez nous appeler au',
      phone: '(470) 350-1019'
    },
    de: {
      title: 'Wartungsarbeiten',
      subtitle: 'Fotogalerie',
      message: 'Wir aktualisieren derzeit unsere Fotogalerie, um unsere neuesten Erlebnisse zu präsentieren.',
      expectedTime: 'Wir erwarten, bald wieder online zu sein.',
      backToHome: 'Zurück zur Startseite',
      contact: 'Für weitere Informationen rufen Sie uns bitte an unter',
      phone: '(470) 350-1019'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <>
      <Head>
        <title>{t.title} - {t.subtitle} - Nature Village Middle Eastern Restaurant</title>
        <meta name="description" content="Nature Village photo gallery is temporarily under maintenance. We'll be back online soon!" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header currentPage="gallery" />

        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Camera className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-serif font-bold mb-2">{t.title}</h1>
                <p className="text-amber-100">{t.subtitle}</p>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center space-x-2 text-amber-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Temporary Maintenance</span>
                  </div>

                  <p className="text-lg text-gray-700">{t.message}</p>
                  <p className="text-gray-600">{t.expectedTime}</p>

                  {/* Contact Information */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
                    <p className="text-gray-700 mb-2">{t.contact}</p>
                    <a 
                      href="tel:4703501019"
                      className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold text-lg transition-colors"
                    >
                      <PhoneIcon className="w-5 h-5" />
                      <span>{t.phone}</span>
                    </a>
                  </div>

                  {/* Back to Home Button */}
                  <div className="pt-4">
                    <Link href="/">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg ${
                          isRTL ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>{t.backToHome}</span>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default GalleryPage;
