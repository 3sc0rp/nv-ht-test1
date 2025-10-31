import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Phone } from 'lucide-react';
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
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* Backdrop with refined blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.3 }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`bg-white rounded-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)] max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative ${
                isRTL ? 'rtl' : 'ltr'
              }`}
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Refined */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-200 group"
                aria-label={t.close}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </motion.button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[95vh] sm:max-h-[90vh] scrollbar-hide">
                {/* Header - Minimal design */}
                <div className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white px-6 py-6 sm:px-8 sm:py-7">
                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="mb-3"
                    >
                      <Gift className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
                      style={{ 
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {t.title}
                    </motion.h2>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-7 leading-relaxed max-w-sm mx-auto"
                  >
                    {t.description}
                  </motion.p>

                  {/* Gift Card Image - Enhanced presentation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mb-6 sm:mb-7"
                  >
                    <div className="relative group">
                      {/* Glow effect on hover */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                      
                      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] group-hover:shadow-[0_24px_70px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 ring-1 ring-black/5">
                        <Image
                          src="/nv-wide.png"
                          alt="Nature Village Gift Card"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          priority
                          quality={95}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button - Refined */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="text-center mb-5 sm:mb-6"
                  >
                    <button
                      onClick={handleClose}
                      className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-semibold px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow border border-gray-200 hover:border-gray-300"
                    >
                      {t.close}
                    </button>
                  </motion.div>

                  {/* Contact Info - Refined */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-full">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.callUs}</span>
                      <a 
                        href="tel:4703501019" 
                        className="text-amber-600 hover:text-amber-700 font-semibold transition-colors hover:underline decoration-2 underline-offset-2"
                      >
                        (470) 350-1019
                      </a>
                    </div>
                  </motion.div>
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
