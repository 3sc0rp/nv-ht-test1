import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Clock, Mail } from 'lucide-react';
import { LANGUAGES, getText } from '../lib/i18n';
import { useLanguage } from '../contexts/LanguageContext';

const KurdishPattern = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-20">
    <defs>
      <pattern id="kurdish-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="currentColor" />
        <path d="M10 10 L30 30 M30 10 L10 30" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#kurdish-pattern)" />
  </svg>
);

const Footer = () => {
  const { language, isRTL } = useLanguage();

  // Footer translations
  const getFooterText = (key) => {
    const footerTranslations = {
      en: {
        description: 'Bringing the authentic flavors and warm hospitality of the Middle East to your table. Every dish is a celebration of our rich cultural heritage and culinary excellence.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        openDaily: 'SUN - THU: 12 PM - 10 PM\nFRI - SAT: 12 PM - 11 PM',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copyright: '© 2025 Nature Village Kurdish Restaurant. All rights reserved.',
        poweredBy: 'Powered by',
        blunari: 'Blunari',
        home: 'Home',
        menu: 'Menu',
        reservations: 'Reservations',
        catering: 'Catering',
        gallery: 'Gallery'
      },
      ku: {
        description: 'تامە ڕەسەنەکان و پێشوازی گەرمی ڕۆژهەڵاتی ناوەڕاست بۆ مێزەکەتان دەهێنین. هەر خۆراکێک ئاهەنگێکە بۆ میراتی دەوڵەمەند و باشی چێشتلێنانمان.',
        quickLinks: 'بەستەرە خێراکان',
        contactInfo: 'زانیاری پەیوەندی',
        openDaily: 'یەکشەممە - پێنجشەممە: ١٢ - ١٠ شەو\nهەینی - شەممە: ١٢ - ١١ شەو',
        privacy: 'سیاسەتی تایبەتمەندی',
        terms: 'مەرجەکانی خزمەتگوزاری',
        copyright: '© ٢٠٢٥ چێشتخانەی کوردی Nature Village. هەموو مافەکان پارێزراون.',
        poweredBy: 'پشتگیری لەلایەن',
        blunari: 'Blunari',
        home: 'ماڵەوە',
        menu: 'مێنیو',
        reservations: 'حجز میز',
        catering: 'کەیتەرینگ',
        gallery: 'وێنەکان'
      },
      ar: {
        description: 'نجلب النكهات الأصيلة والضيافة الدافئة من الشرق الأوسط إلى طاولتك. كل طبق احتفال بتراثنا الثقافي الغني وتميزنا الطهوي.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        openDaily: 'الأحد - الخميس: ١٢ ظهراً - ١٠ مساءً\nالجمعة - السبت: ١٢ ظهراً - ١١ مساءً',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        copyright: '© ٢٠٢٥ مطعم نيتشر فيلاج الكردي. جميع الحقوق محفوظة.',
        poweredBy: 'مدعوم من',
        blunari: 'Blunari',
        home: 'الرئيسية',
        menu: 'القائمة',
        reservations: 'الحجوزات',
        catering: 'الضيافة',
        gallery: 'المعرض'
      },
      fa: {
        description: 'طعم‌های اصیل و مهمان‌نوازی گرم خاورمیانه را به میز شما می‌آوریم. هر غذا جشنی از میراث فرهنگی غنی و برتری آشپزی ما است.',
        quickLinks: 'لینک‌های سریع',
        contactInfo: 'اطلاعات تماس',
        openDaily: 'یکشنبه - پنج‌شنبه: ١٢ - ١٠ شب\nجمعه - شنبه: ١٢ - ١١ شب',
        privacy: 'سیاست حریم خصوصی',
        terms: 'شرایط خدمات',
        copyright: '© ٢٠٢٥ رستوران کردی Nature Village. تمامی حقوق محفوظ است.',
        poweredBy: 'قدرت گرفته از',
        blunari: 'Blunari',
        home: 'خانه',
        menu: 'منو',
        reservations: 'رزرو میز',
        catering: 'کیترینگ',
        gallery: 'گالری'
      },
      tr: {
        description: 'Orta Doğu\'nun otantik lezzetlerini ve sıcak misafirperverliğini masanıza getiriyoruz. Her yemek, zengin kültürel mirasımızın ve mutfak mükemmelliğimizin bir kutlamasıdır.',
        quickLinks: 'Hızlı Bağlantılar',
        contactInfo: 'İletişim Bilgileri',
        openDaily: 'PAZ - PER: 12:00 - 22:00\nCUM - CTS: 12:00 - 23:00',
        privacy: 'Gizlilik Politikası',
        terms: 'Hizmet Şartları',
        copyright: '© 2025 Nature Village Kürt Restoranı. Tüm hakları saklıdır.',
        poweredBy: 'Destekleyen',
        blunari: 'Blunari',
        home: 'Ana Sayfa',
        menu: 'Menü',
        reservations: 'Rezervasyon',
        catering: 'Catering',
        gallery: 'Galeri'
      },
      sq: {
        description: 'Ku kuzina kurde takohet me natyrën. Sillim shijet autentike dhe mikpritjen e ngrohtë të Lindjes së Mesme në tavolinën tuaj. Çdo pjatë është një festim i trashëgimisë sonë të pasur kulturore dhe përsosmërisë kulinarë.',
        quickLinks: 'Lidhje të Shpejta',
        contactInfo: 'Informacioni i Kontaktit',
        openDaily: 'DI - ENJ: 12:00 - 22:00\nPRE - SHT: 12:00 - 23:00',
        privacy: 'Politika e Privatësisë',
        terms: 'Kushtet e Shërbimit',
        copyright: '© 2025 Nature Village Restorant Kurd. Të gjitha të drejtat e rezervuara.',
        poweredBy: 'Fuqizuar nga',
        blunari: 'Blunari',
        home: 'Kreu',
        menu: 'Meny',
        reservations: 'Rezervime',
        catering: 'Katering',
        gallery: 'Galeria'
      },
      ur: {
        description: 'مشرق وسطیٰ کے اصل ذائقے اور گرم مہمان نوازی آپ کی میز تک لا رہے ہیں۔ ہر کھانا ہماری بھرپور ثقافتی ورثے اور پاک فن کی بہترین مثال ہے۔',
        quickLinks: 'فوری لنکس',
        contactInfo: 'رابطہ کی معلومات',
        openDaily: 'اتوار - جمعرات: ١٢ دوپہر - ١٠ رات\nجمعہ - ہفتہ: ١٢ دوپہر - ١١ رات',
        privacy: 'پرائیویسی پالیسی',
        terms: 'خدمات کی شرائط',
        copyright: '© ٢٠٢٥ نیچر ولیج کردی ریسٹورنٹ۔ تمام حقوق محفوظ ہیں۔',
        poweredBy: 'تعاون',
        blunari: 'Blunari',
        home: 'ہوم',
        menu: 'مینو',
        reservations: 'بکنگز',
        catering: 'کیٹرنگ',
        gallery: 'گیلری'
      },
      kmr: {
        description: 'Tamên resen û mêvandariya germ a Rojhilata Navîn tînin ser maseyê we. Her xwarinê pîrozbahiya çanda me ya dewlemend û başiya çêştlênanê ye.',
        quickLinks: 'Girêdanên Bilez',
        contactInfo: 'Agahdariya Têkiliyê',
        openDaily: 'YEK - PÊN: 12:00 - 22:00\nÎN - ŞEM: 12:00 - 23:00',
        privacy: 'Polîtîkaya Tixûbariyê',
        terms: 'Şertên Xizmetê',
        copyright: '© 2025 Xwaringeha Kurdî ya Nature Village. Hemû maf parastî ne.',
        poweredBy: 'Piştgirî ji aliyê',
        blunari: 'Blunari',
        home: 'Destpêk',
        menu: 'Menû',
        reservations: 'Rezervasyon',
        catering: 'Catering',
        gallery: 'Galerî'
      },
      ru: {
        description: 'Приносим аутентичные вкусы и теплое гостеприимство Ближнего Востока к вашему столу. Каждое блюдо - это праздник нашего богатого культурного наследия и кулинарного мастерства.',
        quickLinks: 'Быстрые ссылки',
        contactInfo: 'Контактная информация',
        openDaily: 'ВС - ЧТ: 12:00 - 22:00\nПТ - СБ: 12:00 - 23:00',
        privacy: 'Политика конфиденциальности',
        terms: 'Условия обслуживания',
        copyright: '© 2025 Курдский ресторан Nature Village. Все права защищены.',
        poweredBy: 'Работает на',
        blunari: 'Blunari',
        home: 'Главная',
        menu: 'Меню',
        reservations: 'Бронирование',
        catering: 'Кейтеринг',
        gallery: 'Галерея'
      },
      es: {
        description: 'Llevando los sabores auténticos y la cálida hospitalidad del Medio Oriente a tu mesa. Cada plato es una celebración de nuestro rico patrimonio cultural y excelencia culinaria.',
        quickLinks: 'Enlaces Rápidos',
        contactInfo: 'Información de Contacto',
        openDaily: 'DOM - JUE: 12:00 PM - 10:00 PM\nVIE - SÁB: 12:00 PM - 11:00 PM',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
        copyright: '© 2025 Restaurante Nature Village. Todos los derechos reservados.',
        poweredBy: 'Desarrollado por',
        blunari: 'Blunari',
        home: 'Inicio',
        menu: 'Menú',
        reservations: 'Reservas',
        catering: 'Catering',
        gallery: 'Galería'
      },
      hi: {
        description: 'कुर्दिस्तान के प्रामाणिक स्वाद और गर्मजोशी भरी मेहमाननवाजी को आपकी मेज तक ला रहे हैं। हर पकवान हमारी समृद्ध सांस्कृतिक विरासत और पाक कला की उत्कृष्टता का उत्सव है।',
        quickLinks: 'त्वरित लिंक',
        contactInfo: 'संपर्क जानकारी',
        openDaily: 'रवि - गुरु: 12:00 - 22:00\nशुक्र - शनि: 12:00 - 23:00',
        privacy: 'गोपनीयता नीति',
        terms: 'सेवा की शर्तें',
        copyright: '© 2025 Nature Village कुर्द रेस्तरां। सर्वाधिकार सुरक्षित।',
        poweredBy: 'संचालित',
        blunari: 'Blunari',
        home: 'होम',
        menu: 'मेनू',
        reservations: 'आरक्षण',
        catering: 'केटरिंग',
        gallery: 'गैलरी'
      }
    };

    return footerTranslations[language]?.[key] || footerTranslations.en[key] || key;
  };

  // Navigation items for footer
  const navigationItems = [
    { key: 'home', href: '/' },
    { key: 'menu', href: '/menu' },
    { key: 'reservations', href: '/reservations' },
    { key: 'catering', href: '/catering' },
    { key: 'gallery', href: '/gallery' }
  ];

  // Helper functions
  const rtlClass = (ltrClass, rtlClass) => isRTL ? rtlClass : ltrClass;
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  const handlePrivacyClick = () => {
    // For now, scroll to footer - you can later add a dedicated privacy page
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleTermsClick = () => {
    // For now, scroll to footer - you can later add a dedicated terms page
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleBlunariClick = () => {
    window.open('https://blunari.ai', '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8', rtlClass('text-left', 'text-right'))}>
          {/* Company Info */}
          <div className="sm:col-span-2">
            <div className={cn('flex items-center mb-4', isRTL && 'flex-row-reverse')}>
              <img 
                src="https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp" 
                alt="Nature Village Logo" 
                className={cn('w-10 h-10 sm:w-12 sm:h-12 object-contain', rtlClass('mr-3', 'ml-3'))}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h3 className="text-xl sm:text-2xl font-serif font-bold">Nature Village</h3>
            </div>
            <p className="text-amber-200 mb-6 leading-relaxed text-sm sm:text-base">
              {getFooterText('description')}
            </p>
            <div className={cn('flex space-x-4', isRTL && 'space-x-reverse')}>
              <a 
                href="https://www.facebook.com/profile.php?id=61579243538732" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-200 hover:text-white transition-colors p-2 hover:bg-amber-700 rounded-full"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a 
                href="https://www.instagram.com/naturevillageatl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-200 hover:text-white transition-colors p-2 hover:bg-amber-700 rounded-full"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {getFooterText('quickLinks')}
            </h4>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>
                    <button className="text-amber-200 hover:text-white transition-colors text-sm block">
                      {getFooterText(item.key)}
                    </button>
                  </Link>
                </li>
              ))}
              <li>
                <button 
                  onClick={handlePrivacyClick}
                  className="text-amber-200 hover:text-white transition-colors text-sm block"
                >
                  {getFooterText('privacy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleTermsClick}
                  className="text-amber-200 hover:text-white transition-colors text-sm block"
                >
                  {getFooterText('terms')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {getFooterText('contactInfo')}
            </h4>
            <div className="space-y-2 text-amber-200 text-sm">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div>302 Satellite Blvd NE STE 125,</div>
                  <div>Suwanee, GA 30024</div>
                </div>
              </div>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="tel:+14703501019" className="hover:text-white transition-colors">
                  (470) 350-1019
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="mailto:naturevillage2024@gmail.com" className="hover:text-white transition-colors">
                  naturevillage2024@gmail.com
                </a>
              </p>
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div>{getFooterText('openDaily').split('\n')[0]}</div>
                  <div>{getFooterText('openDaily').split('\n')[1]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-amber-200 text-sm text-center sm:text-left">
              {getFooterText('copyright')}
            </p>
            <div className="flex items-center space-x-2 text-amber-300 text-sm">

              <span className="opacity-80">{getFooterText('poweredBy')}</span>
              <button 
                onClick={handleBlunariClick}
                className="group flex items-center space-x-1.5 hover:text-white transition-all duration-300 font-semibold bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-500/30 px-3 py-1.5 rounded-lg border border-amber-600/30 hover:border-amber-500/50 hover:scale-105 transform"
                aria-label="Visit Blunari website"
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                </svg>
                <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent font-bold">
                  Blunari
                </span>
                <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-5">
        <KurdishPattern />
      </div>
    </footer>
  );
};

export default Footer;
