import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
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
      learnMore: 'Learn More',
      getGiftCard: 'Get Gift Card',
      close: 'Close'
    },
    ku: {
      title: 'کارتی دیاری ئێستا بەردەستە!',
      subtitle: 'تامی نەریتی هاوبەش بکە',
      description: 'ئەزیزەکانت بە ئەزموونی خواردنی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست ڕێزدار بکە. کارتەکانی دیاریمان تەواو بۆ هەر بۆنەیەک!',
      learnMore: 'زانیاری زیاتر',
      getGiftCard: 'کارتی دیاری وەربگرە',
      close: 'داخستن'
    },
    ar: {
      title: 'بطاقات الهدايا متوفرة الآن!',
      subtitle: 'شارك طعم التقليد',
      description: 'قدم لأحبائك تجربة طعام شرق أوسطية أصيلة. بطاقات الهدايا لدينا مثالية لأي مناسبة!',
      learnMore: 'معرفة المزيد',
      getGiftCard: 'احصل على بطاقة الهدايا',
      close: 'إغلاق'
    },
    fa: {
      title: 'کارت‌های هدیه اکنون در دسترس است!',
      subtitle: 'طعم سنت را به اشتراک بگذارید',
      description: 'عزیزان خود را با تجربه غذای اصیل خاورمیانه پذیرایی کنید. کارت‌های هدیه ما برای هر مناسبتی عالی هستند!',
      learnMore: 'اطلاعات بیشتر',
      getGiftCard: 'دریافت کارت هدیه',
      close: 'بستن'
    },
    tr: {
      title: 'Hediye Kartları Artık Mevcut!',
      subtitle: 'Gelenek tadını paylaşın',
      description: 'Sevdiklerinizi otantik bir Orta Doğu yemek deneyimiyle ödüllendirin. Hediye kartlarımız her durum için mükemmeldir!',
      learnMore: 'Daha Fazla Bilgi',
      getGiftCard: 'Hediye Kartı Al',
      close: 'Kapat'
    },
    es: {
      title: '¡Tarjetas de Regalo Ahora Disponibles!',
      subtitle: 'Comparte el sabor de la tradición',
      description: '¡Regala a tus seres queridos una auténtica experiencia gastronómica de Oriente Medio. Nuestras tarjetas de regalo son perfectas para cualquier ocasión!',
      learnMore: 'Más Información',
      getGiftCard: 'Obtener Tarjeta de Regalo',
      close: 'Cerrar'
    },
    ur: {
      title: 'گفٹ کارڈز اب دستیاب ہیں!',
      subtitle: 'روایت کا ذائقہ بانٹیں',
      description: 'اپنے پیاروں کو مشرق وسطیٰ کے مستند کھانے کے تجربے سے نوازیں۔ ہمارے گفٹ کارڈز ہر موقع کے لیے بہترین ہیں!',
      learnMore: 'مزید جانیں',
      getGiftCard: 'گفٹ کارڈ حاصل کریں',
      close: 'بند کریں'
    },
    kmr: {
      title: 'Kartên Diyariyê Niha Berdest in!',
      subtitle: 'Tama nerîtê parve bikin',
      description: 'Hezkiriyên xwe bi ezmûna xwarinê ya resen a Rojhilatê Navîn rizgar bikin. Kartên diyariyê me ji bo her rewşê guncav in!',
      learnMore: 'Bêtir Bizanin',
      getGiftCard: 'Karta Diyariyê Bistînin',
      close: 'Bigire'
    },
    ru: {
      title: 'Подарочные карты теперь доступны!',
      subtitle: 'Поделитесь вкусом традиций',
      description: 'Порадуйте своих близких аутентичным ближневосточным ужином. Наши подарочные карты идеальны для любого случая!',
      learnMore: 'Узнать больше',
      getGiftCard: 'Получить подарочную карту',
      close: 'Закрыть'
    },
    hi: {
      title: 'गिफ्ट कार्ड अब उपलब्ध हैं!',
      subtitle: 'परंपरा का स्वाद साझा करें',
      description: 'अपने प्रियजनों को प्रामाणिक मध्य पूर्वी भोजन अनुभव से खुश करें। हमारे गिफ्ट कार्ड किसी भी अवसर के लिए एकदम सही हैं!',
      learnMore: 'और जानें',
      getGiftCard: 'गिफ्ट कार्ड प्राप्त करें',
      close: 'बंद करें'
    },
    sq: {
      title: 'Kartat e Dhuratave Tani të Disponueshme!',
      subtitle: 'Ndani shijen e traditës',
      description: 'Trajtoni të dashurit tuaj me një përvojë autentike të darkës së Lindjes së Mesme. Kartat tona të dhuratave janë të përsosura për çdo rast!',
      learnMore: 'Mësoni më shumë',
      getGiftCard: 'Merrni Kartën e Dhuratës',
      close: 'Mbyll'
    },
    fr: {
      title: 'Cartes Cadeaux Maintenant Disponibles!',
      subtitle: 'Partagez le goût de la tradition',
      description: 'Offrez à vos proches une expérience culinaire authentique du Moyen-Orient. Nos cartes cadeaux sont parfaites pour toute occasion!',
      learnMore: 'En savoir plus',
      getGiftCard: 'Obtenir une Carte Cadeau',
      close: 'Fermer'
    },
    de: {
      title: 'Geschenkkarten Jetzt Verfügbar!',
      subtitle: 'Teilen Sie den Geschmack der Tradition',
      description: 'Verwöhnen Sie Ihre Lieben mit einem authentischen nahöstlichen Esserlebnis. Unsere Geschenkkarten sind perfekt für jeden Anlass!',
      learnMore: 'Mehr erfahren',
      getGiftCard: 'Geschenkkarte erhalten',
      close: 'Schließen'
    },
    bn: {
      title: 'গিফট কার্ড এখন উপলব্ধ!',
      subtitle: 'ঐতিহ্যের স্বাদ ভাগ করুন',
      description: 'আপনার প্রিয়জনদের খাঁটি মধ্যপ্রাচ্যের খাবারের অভিজ্ঞতা উপহার দিন। আমাদের গিফট কার্ড যেকোনো অনুষ্ঠানের জন্য নিখুঁত!',
      learnMore: 'আরও জানুন',
      getGiftCard: 'গিফট কার্ড পান',
      close: 'বন্ধ করুন'
    },
    ko: {
      title: '기프트 카드 이제 구매 가능!',
      subtitle: '전통의 맛을 나누세요',
      description: '사랑하는 사람들에게 정통 중동 식사 경험을 선물하세요. 우리의 기프트 카드는 모든 행사에 완벽합니다!',
      learnMore: '더 알아보기',
      getGiftCard: '기프트 카드 받기',
      close: '닫기'
    },
    bs: {
      title: 'Poklon Kartice Sada Dostupne!',
      subtitle: 'Podijelite ukus tradicije',
      description: 'Počastite svoje najmilije autentičnim iskustvom bliskoistočne kuhinje. Naše poklon kartice su savršene za svaku priliku!',
      learnMore: 'Saznajte više',
      getGiftCard: 'Nabavite Poklon Karticu',
      close: 'Zatvori'
    },
    zh: {
      title: '礼品卡现已推出！',
      subtitle: '分享传统的味道',
      description: '用正宗的中东美食体验款待您的亲人。我们的礼品卡适合任何场合！',
      learnMore: '了解更多',
      getGiftCard: '获取礼品卡',
      close: '关闭'
    },
    ro: {
      title: 'Carduri Cadou Acum Disponibile!',
      subtitle: 'Împărtășiți gustul tradiției',
      description: 'Răsfățați-vă cei dragi cu o experiență autentică culinară din Orientul Mijlociu. Cardurile noastre cadou sunt perfecte pentru orice ocazie!',
      learnMore: 'Aflați mai multe',
      getGiftCard: 'Obțineți Card Cadou',
      close: 'Închide'
    },
    uk: {
      title: 'Подарункові картки тепер доступні!',
      subtitle: 'Поділіться смаком традицій',
      description: 'Порадуйте своїх близьких автентичною близькосхідною вечерею. Наші подарункові картки ідеальні для будь-якої нагоди!',
      learnMore: 'Дізнатися більше',
      getGiftCard: 'Отримати подарункову картку',
      close: 'Закрити'
    },
    vi: {
      title: 'Thẻ Quà Tặng Hiện Đã Có!',
      subtitle: 'Chia sẻ hương vị truyền thống',
      description: 'Tặng người thân yêu trải nghiệm ẩm thực Trung Đông chính thống. Thẻ quà tặng của chúng tôi hoàn hảo cho mọi dịp!',
      learnMore: 'Tìm hiểu thêm',
      getGiftCard: 'Nhận Thẻ Quà Tặng',
      close: 'Đóng'
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative ${
                isRTL ? 'rtl' : 'ltr'
              }`}
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label={t.close}
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Header with Gift Icon */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-8 pb-6 rounded-t-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Gift className="w-64 h-64 transform rotate-12" />
                </div>
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-block mb-4"
                  >
                    <Gift className="w-16 h-16 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    {t.title}
                  </h2>
                  <p className="text-xl text-amber-100">
                    {t.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-700 text-lg text-center mb-8">
                  {t.description}
                </p>

                {/* Gift Card Mockup */}
                <div className="mb-8">
                  <motion.div
                    initial={{ rotateY: -10 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative mx-auto max-w-md"
                    style={{ perspective: '1000px' }}
                  >
                    <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-4 border-white rounded-full translate-x-20 translate-y-20"></div>
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <Gift className="w-10 h-10" />
                          <span className="text-sm font-semibold tracking-wider">GIFT CARD</span>
                        </div>

                        <div className="text-center mb-6">
                          <h3 className="text-2xl md:text-3xl font-bold mb-2">
                            Nature Village
                          </h3>
                          <p className="text-amber-100 text-sm">
                            {language === 'ar' ? 'مطعم كردي' : 
                             language === 'ku' ? 'چێشتخانەی کوردی' :
                             language === 'fa' ? 'رستوران کردی' :
                             'Kurdish Restaurant'}
                          </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                          <p className="text-sm mb-1 text-amber-100">
                            {language === 'ar' ? 'القيمة' :
                             language === 'ku' ? 'بڕ' :
                             language === 'fa' ? 'مقدار' :
                             language === 'tr' ? 'Değer' :
                             language === 'es' ? 'Valor' :
                             language === 'ur' ? 'قیمت' :
                             language === 'ru' ? 'Сумма' :
                             language === 'hi' ? 'मूल्य' :
                             language === 'fr' ? 'Valeur' :
                             language === 'de' ? 'Wert' :
                             language === 'zh' ? '金额' :
                             'Amount'}
                          </p>
                          <p className="text-4xl font-bold">$50</p>
                        </div>

                        <div className="mt-6 text-center text-xs text-amber-100">
                          <p>Valid at all locations • No expiration</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:4703501019"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    <Gift className="w-5 h-5" />
                    {t.getGiftCard}
                  </a>
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all"
                  >
                    {t.close}
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>
                    {language === 'ar' ? 'اتصل بنا على' :
                     language === 'ku' ? 'پەیوەندی بکە بە' :
                     language === 'fa' ? 'با ما تماس بگیرید' :
                     language === 'tr' ? 'Bizi arayın' :
                     language === 'es' ? 'Llámenos al' :
                     language === 'ur' ? 'ہمیں کال کریں' :
                     language === 'ru' ? 'Звоните нам' :
                     language === 'hi' ? 'हमें कॉल करें' :
                     language === 'fr' ? 'Appelez-nous au' :
                     language === 'de' ? 'Rufen Sie uns an' :
                     language === 'zh' ? '致电我们' :
                     'Call us at'}{' '}
                    <a href="tel:4703501019" className="text-amber-600 hover:text-amber-700 font-semibold">
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
