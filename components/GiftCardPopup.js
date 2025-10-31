import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';

const GiftCardPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, isRTL } = useLanguage();

  // Show popup on first visit or after 24 hours
  useEffect(() => {
    const lastShown = localStorage.getItem('giftCardPopupLastShown');
    const now = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (!lastShown || now - parseInt(lastShown) > oneDayInMs) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('giftCardPopupLastShown', new Date().getTime().toString());
  };

  const translations = {
    en: {
      title: 'Gift Cards Now Available!',
      subtitle: 'Share the taste of tradition',
      description: 'Treat your loved ones to an authentic Middle Eastern dining experience. Our gift cards are perfect for any occasion!',
      close: 'Close',
      callUs: 'Call us at'
    },
    ku: {
      title: 'کارتی دیاری ئێستا بەردەستە!',
      subtitle: 'تامی نەریتی هاوبەش بکە',
      description: 'ئەزیزەکانت بە ئەزموونی خواردنی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست ڕێزدار بکە. کارتەکانی دیاریمان تەواو بۆ هەر بۆنەیەک!',
      close: 'داخستن',
      callUs: 'پەیوەندی بکە بە'
    },
    ar: {
      title: 'بطاقات الهدايا متوفرة الآن!',
      subtitle: 'شارك طعم التقليد',
      description: 'قدم لأحبائك تجربة طعام شرق أوسطية أصيلة. بطاقات الهدايا لدينا مثالية لأي مناسبة!',
      close: 'إغلاق',
      callUs: 'اتصل بنا على'
    },
    fa: {
      title: 'کارت‌های هدیه اکنون در دسترس است!',
      subtitle: 'طعم سنت را به اشتراک بگذارید',
      description: 'عزیزان خود را با تجربه غذای اصیل خاورمیانه پذیرایی کنید. کارت‌های هدیه ما برای هر مناسبتی عالی هستند!',
      close: 'بستن',
      callUs: 'با ما تماس بگیرید'
    },
    tr: {
      title: 'Hediye Kartları Artık Mevcut!',
      subtitle: 'Gelenek tadını paylaşın',
      description: 'Sevdiklerinizi otantik bir Orta Doğu yemek deneyimiyle ödüllendirin. Hediye kartlarımız her durum için mükemmeldir!',
      close: 'Kapat',
      callUs: 'Bizi arayın'
    },
    es: {
      title: '¡Tarjetas de Regalo Ahora Disponibles!',
      subtitle: 'Comparte el sabor de la tradición',
      description: '¡Regala a tus seres queridos una auténtica experiencia gastronómica de Oriente Medio. Nuestras tarjetas de regalo son perfectas para cualquier ocasión!',
      close: 'Cerrar',
      callUs: 'Llámenos al'
    },
    ur: {
      title: 'گفٹ کارڈز اب دستیاب ہیں!',
      subtitle: 'روایت کا ذائقہ بانٹیں',
      description: 'اپنے پیاروں کو مشرق وسطیٰ کے مستند کھانے کے تجربے سے نوازیں۔ ہمارے گفٹ کارڈز ہر موقع کے لیے بہترین ہیں!',
      close: 'بند کریں',
      callUs: 'ہمیں کال کریں'
    },
    kmr: {
      title: 'Kartên Diyariyê Niha Berdest in!',
      subtitle: 'Tama nerîtê parve bikin',
      description: 'Hezkiriyên xwe bi ezmûna xwarinê ya resen a Rojhilatê Navîn rizgar bikin. Kartên diyariyê me ji bo her rewşê guncav in!',
      close: 'Bigire',
      callUs: 'Bi me re têkilî daynin'
    },
    ru: {
      title: 'Подарочные карты теперь доступны!',
      subtitle: 'Поделитесь вкусом традиций',
      description: 'Порадуйте своих близких аутентичным ближневосточным ужином. Наши подарочные карты идеальны для любого случая!',
      close: 'Закрыть',
      callUs: 'Звоните нам'
    },
    hi: {
      title: 'गिफ्ट कार्ड अब उपलब्ध हैं!',
      subtitle: 'परंपरा का स्वाद साझा करें',
      description: 'अपने प्रियजनों को प्रामाणिक मध्य पूर्वी भोजन अनुभव से खुश करें। हमारे गिफ्ट कार्ड किसी भी अवसर के लिए एकदम सही हैं!',
      close: 'बंद करें',
      callUs: 'हमें कॉल करें'
    },
    sq: {
      title: 'Kartat e Dhuratave Tani të Disponueshme!',
      subtitle: 'Ndani shijen e traditës',
      description: 'Trajtoni të dashurit tuaj me një përvojë autentike të darkës së Lindjes së Mesme. Kartat tona të dhuratave janë të përsosura për çdo rast!',
      close: 'Mbyll',
      callUs: 'Na telefononi në'
    },
    fr: {
      title: 'Cartes Cadeaux Maintenant Disponibles!',
      subtitle: 'Partagez le goût de la tradition',
      description: 'Offrez à vos proches une expérience culinaire authentique du Moyen-Orient. Nos cartes cadeaux sont parfaites pour toute occasion!',
      close: 'Fermer',
      callUs: 'Appelez-nous au'
    },
    de: {
      title: 'Geschenkkarten Jetzt Verfügbar!',
      subtitle: 'Teilen Sie den Geschmack der Tradition',
      description: 'Verwöhnen Sie Ihre Lieben mit einem authentischen nahöstlichen Esserlebnis. Unsere Geschenkkarten sind perfekt für jeden Anlass!',
      close: 'Schließen',
      callUs: 'Rufen Sie uns an'
    },
    bn: {
      title: 'গিফট কার্ড এখন উপলব্ধ!',
      subtitle: 'ঐতিহ্যের স্বাদ ভাগ করুন',
      description: 'আপনার প্রিয়জনদের খাঁটি মধ্যপ্রাচ্যের খাবারের অভিজ্ঞতা উপহার দিন। আমাদের গিফট কার্ড যেকোনো অনুষ্ঠানের জন্য নিখুঁত!',
      close: 'বন্ধ করুন',
      callUs: 'আমাদের কল করুন'
    },
    ko: {
      title: '기프트 카드 이제 구매 가능!',
      subtitle: '전통의 맛을 나누세요',
      description: '사랑하는 사람들에게 정통 중동 식사 경험을 선물하세요. 우리의 기프트 카드는 모든 행사에 완벽합니다!',
      close: '닫기',
      callUs: '전화주세요'
    },
    bs: {
      title: 'Poklon Kartice Sada Dostupne!',
      subtitle: 'Podijelite ukus tradicije',
      description: 'Počastite svoje najmilije autentičnim iskustvom bliskoistočne kuhinje. Naše poklon kartice su savršene za svaku priliku!',
      close: 'Zatvori',
      callUs: 'Pozovite nas na'
    },
    zh: {
      title: '礼品卡现已推出！',
      subtitle: '分享传统的味道',
      description: '用正宗的中东美食体验款待您的亲人。我们的礼品卡适合任何场合！',
      close: '关闭',
      callUs: '致电我们'
    },
    ro: {
      title: 'Carduri Cadou Acum Disponibile!',
      subtitle: 'Împărtășiți gustul tradiției',
      description: 'Răsfățați-vă cei dragi cu o experiență autentică culinară din Orientul Mijlociu. Cardurile noastre cadou sunt perfecte pentru orice ocazie!',
      close: 'Închide',
      callUs: 'Sunați-ne la'
    },
    uk: {
      title: 'Подарункові картки тепер доступні!',
      subtitle: 'Поділіться смаком традицій',
      description: 'Порадуйте своїх близьких автентичною близькосхідною вечерею. Наші подарункові картки ідеальні для будь-якої нагоди!',
      close: 'Закрити',
      callUs: 'Телефонуйте нам'
    },
    vi: {
      title: 'Thẻ Quà Tặng Hiện Đã Có!',
      subtitle: 'Chia sẻ hương vị truyền thống',
      description: 'Tặng người thân yêu trải nghiệm ẩm thực Trung Đông chính thống. Thẻ quà tặng của chúng tôi hoàn hảo cho mọi dịp!',
      close: 'Đóng',
      callUs: 'Gọi cho chúng tôi'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative ${
                isRTL ? 'rtl' : 'ltr'
              }`}
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                aria-label={t.close}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-8 sm:px-8 sm:py-10 rounded-t-2xl text-center">
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 px-2">
                  {t.title}
                </h2>
                <p className="text-base sm:text-lg text-white/90 px-2">
                  {t.subtitle}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 leading-relaxed px-2">
                  {t.description}
                </p>

                {/* Gift Card Image with Enhanced Shadow */}
                <div className="mb-6 sm:mb-8 px-2">
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] transition-shadow duration-300">
                    <Image
                      src="/nv-wide.png"
                      alt="Nature Village Gift Card"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center px-2">
                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    {t.close}
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 px-2">
                  <p>
                    {t.callUs}{' '}
                    <a href="tel:4703501019" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                      (470) 350-1019
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GiftCardPopup;
