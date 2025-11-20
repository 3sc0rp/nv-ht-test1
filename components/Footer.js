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
        openDaily: 'MON - THU: 11:30 AM - 9:30 PM\nFRI: 11:30 AM - 10:30 PM\nSAT: 12:00 PM - 10:30 PM\nSUN: 12:00 PM - 9:30 PM',
        kitchenNote: '* Kitchen closes 30 minutes before closing time',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copyright: '© 2025 Nature Village Middle Eastern Restaurant. All rights reserved.',
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
        openDaily: 'دووشەممە - پێنجشەممە: ١١:٣٠ی بەیانی - ٩:٣٠ی شەو\nهەینی: ١١:٣٠ی بەیانی - ١٠:٣٠ی شەو\nشەممە: ١٢:٠٠ی نیوەڕۆ - ١٠:٣٠ی شەو\nیەکشەممە: ١٢:٠٠ی نیوەڕۆ - ٩:٣٠ی شەو',
        kitchenNote: '* چێشتخانە ٣٠ خولەک پێش کاتی داخستن دادەخرێت',
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
        openDaily: 'الاثنين - الخميس: ١١:٣٠ صباحاً - ٩:٣٠ مساءً\nالجمعة: ١١:٣٠ صباحاً - ١٠:٣٠ مساءً\nالسبت: ١٢:٠٠ ظهراً - ١٠:٣٠ مساءً\nالأحد: ١٢:٠٠ ظهراً - ٩:٣٠ مساءً',
        kitchenNote: '* يغلق المطبخ قبل ٣٠ دقيقة من وقت الإغلاق',
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
        openDaily: 'دوشنبه - پنج‌شنبه: ١١:٣٠ صبح - ٩:٣٠ شب\nجمعه: ١١:٣٠ صبح - ١٠:٣٠ شب\nشنبه: ١٢:٠٠ ظهر - ١٠:٣٠ شب\nیکشنبه: ١٢:٠٠ ظهر - ٩:٣٠ شب',
        kitchenNote: '* آشپزخانه ٣٠ دقیقه قبل از زمان بسته شدن تعطیل می‌شود',
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
        openDaily: 'PZT - PER: 11:30 - 21:30\nCUM: 11:30 - 22:30\nCTS: 12:00 - 22:30\nPAZ: 12:00 - 21:30',
        kitchenNote: '* Mutfak kapanış saatinden 30 dakika önce kapanır',
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
        openDaily: 'HËN - ENJ: 11:30 - 21:30\nPRE: 11:30 - 22:30\nSHT: 12:00 - 22:30\nDI: 12:00 - 21:30',
        kitchenNote: '* Kuzhina mbyllet 30 minuta para orarit të mbylljes',
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
      fr: {
        description: 'Apportant les saveurs authentiques et la chaleureuse hospitalité du Moyen-Orient à votre table. Chaque plat est une célébration de notre riche héritage culturel et de notre excellence culinaire.',
        quickLinks: 'Liens Rapides',
        contactInfo: 'Informations de Contact',
        openDaily: 'LUN - JEU: 11H30 - 21H30\nVEN: 11H30 - 22H30\nSAM: 12H00 - 22H30\nDIM: 12H00 - 21H30',
        kitchenNote: '* La cuisine ferme 30 minutes avant l\'heure de fermeture',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions de Service',
        copyright: '© 2025 Restaurant Kurde Nature Village. Tous droits réservés.',
        poweredBy: 'Propulsé par',
        blunari: 'Blunari',
        home: 'Accueil',
        menu: 'Menu',
        reservations: 'Réservations',
        catering: 'Traiteur',
        gallery: 'Galerie'
      },
      ur: {
        description: 'مشرق وسطیٰ کے اصل ذائقے اور گرم مہمان نوازی آپ کی میز تک لا رہے ہیں۔ ہر کھانا ہماری بھرپور ثقافتی ورثے اور پاک فن کی بہترین مثال ہے۔',
        quickLinks: 'فوری لنکس',
        contactInfo: 'رابطہ کی معلومات',
        openDaily: 'پیر - جمعرات: ١١:٣٠ صبح - ٩:٣٠ رات\nجمعہ: ١١:٣٠ صبح - ١٠:٣٠ رات\nہفتہ: ١٢:٠٠ دوپہر - ١٠:٣٠ رات\nاتوار: ١٢:٠٠ دوپہر - ٩:٣٠ رات',
        kitchenNote: '* کچن بند ہونے سے ٣٠ منٹ پہلے بند ہو جاتا ہے',
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
        openDaily: 'DUŞ - PÊN: 11:30 - 21:30\nÎN: 11:30 - 22:30\nŞEM: 12:00 - 22:30\nYEK: 12:00 - 21:30',
        kitchenNote: '* Xwarinxane 30 xulek berî dema girtinê tê girtin',
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
        openDaily: 'ПН - ЧТ: 11:30 - 21:30\nПТ: 11:30 - 22:30\nСБ: 12:00 - 22:30\nВС: 12:00 - 21:30',
        kitchenNote: '* Кухня закрывается за 30 минут до закрытия',
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
        openDaily: 'LUN - JUE: 11:30 AM - 9:30 PM\nVIE: 11:30 AM - 10:30 PM\nSÁB: 12:00 PM - 10:30 PM\nDOM: 12:00 PM - 9:30 PM',
        kitchenNote: '* La cocina cierra 30 minutos antes del horario de cierre',
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
        openDaily: 'सोम - गुरु: 11:30 - 21:30\nशुक्र: 11:30 - 22:30\nशनि: 12:00 - 22:30\nरवि: 12:00 - 21:30',
        kitchenNote: '* रसोई बंद होने से 30 मिनट पहले बंद हो जाती है',
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
      },
      de: {
        description: 'Wir bringen die authentischen Aromen und warme Gastfreundschaft des Nahen Ostens an Ihren Tisch. Jedes Gericht ist eine Feier unseres reichen kulturellen Erbes und kulinarischen Könnens.',
        quickLinks: 'Schnelle Links',
        contactInfo: 'Kontaktinformationen',
        openDaily: 'MO - DO: 11:30 - 21:30\nFR: 11:30 - 22:30\nSA: 12:00 - 22:30\nSO: 12:00 - 21:30',
        kitchenNote: '* Die Küche schließt 30 Minuten vor Geschäftsschluss',
        privacy: 'Datenschutzrichtlinie',
        terms: 'Nutzungsbedingungen',
        copyright: '© 2025 Nature Village Kurdisches Restaurant. Alle Rechte vorbehalten.',
        poweredBy: 'Unterstützt von',
        blunari: 'Blunari',
        home: 'Startseite',
        menu: 'Speisekarte',
        reservations: 'Reservierungen',
        catering: 'Catering',
        gallery: 'Galerie'
      },
      bn: {
        description: 'আপনার টেবিলে খাঁটি মধ্যপ্রাচ্যীয় স্বাদ এবং উষ্ণ আতিথেয়তা নিয়ে আসা। প্রতিটি খাবার আমাদের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য এবং রন্ধনসম্পর্কীয় উৎকর্ষতার উদযাপন।',
        quickLinks: 'দ্রুত লিংক',
        contactInfo: 'যোগাযোগের তথ্য',
        openDaily: 'সোম - বৃহস্পতি: ১১:৩০ - ২১:৩০\nশুক্র: ১১:৩০ - ২২:৩০\nশনি: ১২:০০ - ২২:৩০\nরবি: ১২:০০ - ২১:৩০',
        kitchenNote: '* রান্নাঘর বন্ধ হওয়ার ৩০ মিনিট আগে বন্ধ হয়ে যায়',
        privacy: 'গোপনীয়তা নীতি',
        terms: 'ব্যবহারের শর্তাবলী',
        copyright: '© ২০২৫ নেচার ভিলেজ রেস্তোরাঁ। সর্বস্বত্ব সংরক্ষিত।',
        poweredBy: 'চালিত',
        blunari: 'ব্লুনারি',
        home: 'হোম',
        menu: 'মেনু',
        reservations: 'সংরক্ষণ',
        catering: 'ক্যাটারিং',
        gallery: 'গ্যালারি'
      },
      ko: {
        description: '중동의 정통 맛과 따뜻한 환대를 여러분의 식탁으로 가져다 드립니다. 모든 요리는 우리의 풍부한 문화 유산과 요리 우수성의 축하입니다.',
        quickLinks: '빠른 링크',
        contactInfo: '연락처 정보',
        openDaily: '월 - 목: 11:30 - 21:30\n금: 11:30 - 22:30\n토: 12:00 - 22:30\n일: 12:00 - 21:30',
        kitchenNote: '* 주방은 마감 30분 전에 문을 닫습니다',
        privacy: '개인정보 처리방침',
        terms: '서비스 약관',
        copyright: '© 2025 네이처 빌리지 레스토랑. 모든 권리 보유.',
        poweredBy: '개발',
        blunari: '블루나리',
        home: '홈',
        menu: '메뉴',
        reservations: '예약',
        catering: '케이터링',
        gallery: '갤러리'
      },
      bs: {
        description: 'Donosimo autentične okuse i toplu gostoljubivost Bliskog istoka na vaš sto. Svako jelo je proslava našeg bogatog kulturnog naslijeđa i kulinarskog izvrsnosti.',
        quickLinks: 'Brzi linkovi',
        contactInfo: 'Kontakt informacije',
        openDaily: 'PON - ČET: 11:30 - 21:30\nPET: 11:30 - 22:30\nSUB: 12:00 - 22:30\nNED: 12:00 - 21:30',
        kitchenNote: '* Kuhinja se zatvara 30 minuta prije zatvaranja',
        privacy: 'Politika privatnosti',
        terms: 'Uslovi korištenja',
        copyright: '© 2025 Nature Village restoran. Sva prava zadržana.',
        poweredBy: 'Pokretano od',
        blunari: 'Blunari',
        home: 'Početna',
        menu: 'Meni',
        reservations: 'Rezervacije',
        catering: 'Catering',
        gallery: 'Galerija'
      },
      zh: {
        description: '我们将中东地区的正宗美味和温馨好客带到您的餐桌上。每一道菜品都是对我们丰富文化遗产和烹饪精髓的庆祝。',
        quickLinks: '快捷链接',
        contactInfo: '联系信息',
        openDaily: '周一 - 周四: 11:30 - 21:30\n周五: 11:30 - 22:30\n周六: 12:00 - 22:30\n周日: 12:00 - 21:30',
        kitchenNote: '* 厨房在打烊前30分钟关闭',
        privacy: '隐私政策',
        terms: '使用条款',
        copyright: '© 2025 自然村餐厅。保留所有权利。',
        poweredBy: '技术支持',
        blunari: 'Blunari',
        home: '首页',
        menu: '菜单',
        reservations: '预订',
        catering: '餐饮服务',
        gallery: '图库'
      },
      ro: {
        description: 'Aducem gusturile autentice și ospitalitatea caldă din Orientul Mijlociu la masa ta. Fiecare fel de mâncare este o sărbătoare a moștenirii noastre culturale bogate și a excelenței culinare.',
        quickLinks: 'Link-uri Rapide',
        contactInfo: 'Informații de Contact',
        openDaily: 'LUN - JOI: 11:30 - 21:30\nVIN: 11:30 - 22:30\nSÂM: 12:00 - 22:30\nDUM: 12:00 - 21:30',
        kitchenNote: '* Bucătăria se închide cu 30 de minute înainte de ora de închidere',
        privacy: 'Politica de Confidențialitate',
        terms: 'Termeni și Condiții',
        copyright: '© 2025 Restaurantul Nature Village. Toate drepturile rezervate.',
        poweredBy: 'Powered by',
        blunari: 'Blunari',
        home: 'Acasă',
        menu: 'Meniu',
        reservations: 'Rezervări',
        catering: 'Catering',
        gallery: 'Galerie'
      },
      uk: {
        description: 'Ми приносимо автентичні смаки та теплу гостинність Близького Сходу до вашого столу. Кожна страва - це святкування нашої багатої культурної спадщини та кулінарної досконалості.',
        quickLinks: 'Швидкі посилання',
        contactInfo: 'Контактна інформація',
        openDaily: 'ПН - ЧТ: 11:30 - 21:30\nПТ: 11:30 - 22:30\nСБ: 12:00 - 22:30\nНД: 12:00 - 21:30',
        kitchenNote: '* Кухня закривається за 30 хвилин до закриття',
        privacy: 'Політика конфіденційності',
        terms: 'Умови використання',
        copyright: '© 2025 Ресторан Nature Village. Всі права захищені.',
        poweredBy: 'Powered by',
        blunari: 'Blunari',
        home: 'Головна',
        menu: 'Меню',
        reservations: 'Бронювання',
        catering: 'Кейтеринг',
        gallery: 'Галерея'
      },
      vi: {
        description: 'Chúng tôi mang đến hương vị chính thống và lòng hiếu khách ấm áp của Trung Đông đến bàn ăn của bạn. Mỗi món ăn là một lễ kỷ niệm di sản văn hóa phong phú và sự xuất sắc trong ẩm thực của chúng tôi.',
        quickLinks: 'Liên kết nhanh',
        contactInfo: 'Thông tin liên hệ',
        openDaily: 'T2 - T5: 11:30 - 21:30\nT6: 11:30 - 22:30\nT7: 12:00 - 22:30\nCN: 12:00 - 21:30',
        kitchenNote: '* Nhà bếp đóng cửa trước 30 phút so với giờ đóng cửa',
        privacy: 'Chính sách bảo mật',
        terms: 'Điều khoản và điều kiện',
        copyright: '© 2025 Nhà hàng Nature Village. Tất cả quyền được bảo lưu.',
        poweredBy: 'Powered by',
        blunari: 'Blunari',
        home: 'Trang chủ',
        menu: 'Thực đơn',
        reservations: 'Đặt bàn',
        catering: 'Dịch vụ tiệc',
        gallery: 'Thư viện ảnh'
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
                  <div>{getFooterText('openDaily').split('\n')[2]}</div>
                  <div>{getFooterText('openDaily').split('\n')[3]}</div>
                  <div className="mt-2 text-xs text-amber-300 italic">
                    {getFooterText('kitchenNote')}
                  </div>
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
