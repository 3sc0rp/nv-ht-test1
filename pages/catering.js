import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  ArrowLeft,
  Clock,
  Phone as PhoneIcon,
  ChefHat
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';

const CateringPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Under Maintenance',
      subtitle: 'Catering Services',
      message: 'We are currently updating our catering system to serve you better.',
      expectedTime: 'Expected to be back online soon.',
      backToHome: 'Back to Home',
      contact: 'For immediate catering inquiries, please call us at',
      phone: '(470) 350-1019'
    },
    ku: {
      title: 'لە ژێر چاکسازیدایە',
      subtitle: 'خزمەتگوزاری قوناغکردن',
      message: 'ئێمە لە ئێستادا سیستەمی کەیتەرینگمان نوێ دەکەینەوە بۆ ئەوەی باشتر خزمەتتان بکەین.',
      expectedTime: 'بە زوویی دەگەڕێتەوە.',
      backToHome: 'گەڕانەوە بۆ ماڵەوە',
      contact: 'بۆ پرسیاری کەیتەرینگ، تکایە پەیوەندیمان پێوە بکەن',
      phone: '(470) 350-1019'
    },
    ar: {
      title: 'تحت الصيانة',
      subtitle: 'خدمات التقديم',
      message: 'نحن نقوم حالياً بتحديث نظام التقديم لخدمتكم بشكل أفضل.',
      expectedTime: 'متوقع العودة قريباً.',
      backToHome: 'العودة للرئيسية',
      contact: 'لاستفسارات التقديم الفورية، يرجى الاتصال بنا على',
      phone: '(470) 350-1019'
    },
    fa: {
      title: 'در حال تعمیر',
      subtitle: 'خدمات پذیرایی',
      message: 'ما در حال حاضر سیستم پذیرایی خود را برای خدمات بهتر به شما به‌روزرسانی می‌کنیم.',
      expectedTime: 'به زودی برمی‌گردیم.',
      backToHome: 'بازگشت به خانه',
      contact: 'برای سؤالات فوری پذیرایی، لطفاً با ما تماس بگیرید',
      phone: '(470) 350-1019'
    },
    tr: {
      title: 'Bakım Altında',
      subtitle: 'Catering Hizmetleri',
      message: 'Size daha iyi hizmet verebilmek için catering sistemimizi güncelliyoruz.',
      expectedTime: 'Yakında tekrar online olacak.',
      backToHome: 'Ana Sayfaya Dön',
      contact: 'Acil catering sorularınız için lütfen bizi arayın',
      phone: '(470) 350-1019'
    },
    es: {
      title: 'En Mantenimiento',
      subtitle: 'Servicios de Catering',
      message: 'Actualmente estamos actualizando nuestro sistema de catering para servirle mejor.',
      expectedTime: 'Esperamos estar de vuelta en línea pronto.',
      backToHome: 'Volver al Inicio',
      contact: 'Para consultas inmediatas de catering, por favor llámenos al',
      phone: '(470) 350-1019'
    },
    ur: {
      title: 'دیکھ بھال میں',
      subtitle: 'کیٹرنگ سروسز',
      message: 'ہم آپ کو بہتر خدمات فراہم کرنے کے لیے اپنے کیٹرنگ سسٹم کو اپڈیٹ کر رہے ہیں۔',
      expectedTime: 'جلد ہی واپس آئیں گے۔',
      backToHome: 'گھر واپس جائیں',
      contact: 'فوری کیٹرنگ استفسارات کے لیے، براہ کرم ہمیں کال کریں',
      phone: '(470) 350-1019'
    },
    kmr: {
      title: 'Di Bin Nerîna De',
      subtitle: 'Xizmetên Catering',
      message: 'Em niha sîstema catering nû dikin da ku we baştir xizmetê bikin.',
      expectedTime: 'Zû dê vegere online.',
      backToHome: 'Vegere Malê',
      contact: 'Ji bo pirsên catering ya bilez, ji kerema xwe bi me re têkiliyê daynin',
      phone: '(470) 350-1019'
    },
    ru: {
      title: 'На обслуживании',
      subtitle: 'Кейтеринг услуги',
      message: 'Мы обновляем нашу систему кейтеринга, чтобы лучше обслуживать вас.',
      expectedTime: 'Скоро вернемся в онлайн.',
      backToHome: 'Вернуться домой',
      contact: 'По срочным вопросам кейтеринга, пожалуйста, звоните нам',
      phone: '(470) 350-1019'
    },
    hi: {
      title: 'रखरखाव में',
      subtitle: 'कैटरिंग सेवाएं',
      message: 'हम आपको बेहतर सेवा देने के लिए अपना कैटरिंग सिस्टम अपडेट कर रहे हैं।',
      expectedTime: 'जल्द ही वापस ऑनलाइन आएंगे।',
      backToHome: 'होम पर वापस जाएं',
      contact: 'तत्काल कैटरिंग पूछताछ के लिए, कृपया हमें कॉल करें',
      phone: '(470) 350-1019'
    },
    sq: {
      title: 'Në Mirëmbajtje',
      subtitle: 'Shërbimet e Kateringut',
      message: 'Aktualisht po përditësojmë sistemin tonë të kateringut për t\'ju shërbejmë më mirë.',
      expectedTime: 'Presim të jemi të disponueshëm përsëri së shpejti.',
      backToHome: 'Kthehu në Kreu',
      contact: 'Për pyetje të menjëhershme për katering, ju lutemi na telefononi në',
      phone: '(470) 350-1019'
    },
    fr: {
      title: 'En Maintenance',
      subtitle: 'Services de Traiteur',
      message: 'Nous mettons actuellement à jour notre système de traiteur pour mieux vous servir.',
      expectedTime: 'Nous espérons être de nouveau en ligne bientôt.',
      backToHome: 'Retour à l\'Accueil',
      contact: 'Pour des demandes urgentes de traiteur, veuillez nous appeler au',
      phone: '(470) 350-1019'
    },
    de: {
      title: 'Wartungsarbeiten',
      subtitle: 'Catering-Services',
      message: 'Wir aktualisieren derzeit unser Catering-System, um Sie besser bedienen zu können.',
      expectedTime: 'Wir erwarten, bald wieder online zu sein.',
      backToHome: 'Zurück zur Startseite',
      contact: 'Für dringende Catering-Anfragen rufen Sie uns bitte an unter',
      phone: '(470) 350-1019'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <>
      <Head>
        <title>{t.title} - {t.subtitle} - Nature Village Middle Eastern Restaurant</title>
        <meta name="description" content="Nature Village catering services are temporarily under maintenance. We'll be back online soon!" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header currentPage="catering" />

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
                  <ChefHat className="w-8 h-8 text-white" />
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

export default CateringPage;
