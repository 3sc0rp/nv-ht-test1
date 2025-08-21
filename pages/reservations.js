import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  ArrowLeft,
  Clock,
  Phone as PhoneIcon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReservationPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Under Maintenance',
      subtitle: 'Reservations System',
      message: 'We are currently updating our reservation system to serve you better.',
      expectedTime: 'Expected to be back online soon.',
      backToHome: 'Back to Home',
      contact: 'For immediate assistance, please call us at',
      phone: '(470) 350-1019'
    },
    ku: {
      title: 'لە ژێر چاکسازیدایە',
      subtitle: 'سیستەمی حیجازکردن',
      message: 'ئێمە لە ئێستادا سیستەمی حیجازکردنمان نوێ دەکەینەوە بۆ ئەوەی باشتر خزمەتتان بکەین.',
      expectedTime: 'بە زوویی دەگەڕێتەوە.',
      backToHome: 'گەڕانەوە بۆ ماڵەوە',
      contact: 'بۆ یارمەتی خێرا، تکایە پەیوەندیمان پێوە بکەن',
      phone: '(470) 350-1019'
    },
    ar: {
      title: 'تحت الصيانة',
      subtitle: 'نظام الحجوزات',
      message: 'نحن نقوم حالياً بتحديث نظام الحجوزات لخدمتكم بشكل أفضل.',
      expectedTime: 'متوقع العودة قريباً.',
      backToHome: 'العودة للرئيسية',
      contact: 'للمساعدة الفورية، يرجى الاتصال بنا على',
      phone: '(470) 350-1019'
    },
    fa: {
      title: 'در حال تعمیر',
      subtitle: 'سیستم رزرو',
      message: 'ما در حال حاضر سیستم رزرو خود را برای خدمات بهتر به شما به‌روزرسانی می‌کنیم.',
      expectedTime: 'به زودی برمی‌گردیم.',
      backToHome: 'بازگشت به خانه',
      contact: 'برای کمک فوری، لطفاً با ما تماس بگیرید',
      phone: '(470) 350-1019'
    },
    tr: {
      title: 'Bakım Altında',
      subtitle: 'Rezervasyon Sistemi',
      message: 'Size daha iyi hizmet verebilmek için rezervasyon sistemimizi güncelliyoruz.',
      expectedTime: 'Yakında tekrar online olacak.',
      backToHome: 'Ana Sayfaya Dön',
      contact: 'Acil yardım için lütfen bizi arayın',
      phone: '(470) 350-1019'
    },
    es: {
      title: 'En Mantenimiento',
      subtitle: 'Sistema de Reservas',
      message: 'Actualmente estamos actualizando nuestro sistema de reservas para servirle mejor.',
      expectedTime: 'Esperamos estar de vuelta en línea pronto.',
      backToHome: 'Volver al Inicio',
      contact: 'Para asistencia inmediata, por favor llámenos al',
      phone: '(470) 350-1019'
    },
    ur: {
      title: 'دیکھ بھال میں',
      subtitle: 'بکنگ سسٹم',
      message: 'ہم آپ کو بہتر خدمات فراہم کرنے کے لیے اپنے بکنگ سسٹم کو اپڈیٹ کر رہے ہیں۔',
      expectedTime: 'جلد ہی واپس آئیں گے۔',
      backToHome: 'گھر واپس جائیں',
      contact: 'فوری مدد کے لیے، براہ کرم ہمیں کال کریں',
      phone: '(470) 350-1019'
    },
    kmr: {
      title: 'Di Bin Nerîna De',
      subtitle: 'Sîstema Rezervasyonê',
      message: 'Em niha sîstema rezervasyona xwe nû dikin da ku we baştir xizmetê bikin.',
      expectedTime: 'Zû dê vegere online.',
      backToHome: 'Vegere Malê',
      contact: 'Ji bo alîkariya bilez, ji kerema xwe bi me re têkiliyê daynin',
      phone: '(470) 350-1019'
    },
    ru: {
      title: 'На обслуживании',
      subtitle: 'Система бронирования',
      message: 'Мы обновляем нашу систему бронирования, чтобы лучше обслуживать вас.',
      expectedTime: 'Скоро вернемся в онлайн.',
      backToHome: 'Вернуться домой',
      contact: 'Для немедленной помощи, пожалуйста, позвоните нам',
      phone: '(470) 350-1019'
    },
    hi: {
      title: 'रखरखाव में',
      subtitle: 'बुकिंग सिस्टम',
      message: 'हम आपको बेहतर सेवा देने के लिए अपना बुकिंग सिस्टम अपडेट कर रहे हैं।',
      expectedTime: 'जल्द ही वापस ऑनलाइन आएंगे।',
      backToHome: 'होम पर वापस जाएं',
      contact: 'तत्काल सहायता के लिए, कृपया हमें कॉल करें',
      phone: '(470) 350-1019'
    }
  };

  const t = translations[language];

  return (
    <>
      <Head>
        <title>{t.title} - {t.subtitle} - Nature Village Middle Eastern Restaurant</title>
        <meta name="description" content="Nature Village reservation system is temporarily under maintenance. We'll be back online soon!" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header currentPage="reservations" />

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
                  <Wrench className="w-8 h-8 text-white" />
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

export default ReservationPage;
