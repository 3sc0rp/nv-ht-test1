import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Phone, Clock, Calendar, Navigation } from 'lucide-react';

const VisitUsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Visit Us',
      subtitle: 'Find us in the heart of the city',
      pageTitle: 'Visit Us - Nature Village Restaurant',
      pageDescription: 'Visit Nature Village Restaurant at 302 Satellite Blvd NE, Suwanee, GA. Open 7 days a week for authentic Middle Eastern dining.',
      openingHours: 'Opening Hours',
      address: 'Address',
      contactInfo: 'Contact Information',
      getDirections: 'Get Directions',
      phone: 'Phone',
      monThu: 'MON - THU: 11:30 AM - 9:30 PM',
      fri: 'FRI: 11:30 AM - 10:30 PM',
      sat: 'SAT: 12:00 PM - 10:30 PM',
      sun: 'SUN: 12:00 PM - 9:30 PM',
      sevenDays: '7 Days a Week',
      kitchenNote: '* Kitchen closes 30 minutes before closing time',
      makeReservation: 'Make Reservation',
      callUs: 'Call Us',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    ku: {
      title: 'سەردانمان بکە',
      subtitle: 'لە دڵی شارەکە بمانبینەوە',
      pageTitle: 'سەردانمان بکە - چێشتخانەی گوندی سروشت',
      pageDescription: 'سەردانی چێشتخانەی گوندی سروشت بکە لە 302 Satellite Blvd NE، Suwanee، GA. کراوەیە ٧ ڕۆژی هەفتە.',
      openingHours: 'کاتی کارکردن',
      address: 'ناونیشان',
      contactInfo: 'زانیاری پەیوەندی',
      getDirections: 'ڕێگا وەربگرە',
      phone: 'تەلەفۆن',
      monThu: 'دووشەممە - پێنجشەممە: ١١:٣٠ی بەیانی - ٩:٣٠ی شەو',
      fri: 'هەینی: ١١:٣٠ی بەیانی - ١٠:٣٠ی شەو',
      sat: 'شەممە: ١٢:٠٠ی نیوەڕۆ - ١٠:٣٠ی شەو',
      sun: 'یەکشەممە: ١٢:٠٠ی نیوەڕۆ - ٩:٣٠ی شەو',
      sevenDays: '٧ ڕۆژی هەفتە',
      kitchenNote: '* چێشتخانە ٣٠ خولەک پێش کاتی داخستن دادەخرێت',
      makeReservation: 'حجزکردن',
      callUs: 'پەیوەندیمان پێوە بکە',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    ar: {
      title: 'زورونا',
      subtitle: 'اعثر علينا في قلب المدينة',
      pageTitle: 'زورونا - مطعم قرية الطبيعة',
      pageDescription: 'قم بزيارة مطعم قرية الطبيعة في 302 Satellite Blvd NE، Suwanee، GA. مفتوح 7 أيام في الأسبوع.',
      openingHours: 'ساعات العمل',
      address: 'العنوان',
      contactInfo: 'معلومات الاتصال',
      getDirections: 'احصل على الاتجاهات',
      phone: 'الهاتف',
      monThu: 'الاثنين - الخميس: ١١:٣٠ صباحاً - ٩:٣٠ مساءً',
      fri: 'الجمعة: ١١:٣٠ صباحاً - ١٠:٣٠ مساءً',
      sat: 'السبت: ١٢:٠٠ ظهراً - ١٠:٣٠ مساءً',
      sun: 'الأحد: ١٢:٠٠ ظهراً - ٩:٣٠ مساءً',
      sevenDays: '7 أيام في الأسبوع',
      kitchenNote: '* يغلق المطبخ قبل 30 دقيقة من وقت الإغلاق',
      makeReservation: 'احجز طاولة',
      callUs: 'اتصل بنا',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    fa: {
      title: 'ما را ببینید',
      subtitle: 'ما را در قلب شهر بیابید',
      pageTitle: 'ما را ببینید - رستوران دهکده طبیعت',
      pageDescription: 'از رستوران دهکده طبیعت در 302 Satellite Blvd NE، Suwanee، GA دیدن کنید. 7 روز هفته باز است.',
      openingHours: 'ساعات کاری',
      address: 'آدرس',
      contactInfo: 'اطلاعات تماس',
      getDirections: 'دریافت مسیر',
      phone: 'تلفن',
      monThu: 'دوشنبه - پنج‌شنبه: ١١:٣٠ صبح - ٩:٣٠ شب',
      fri: 'جمعه: ١١:٣٠ صبح - ١٠:٣٠ شب',
      sat: 'شنبه: ١٢:٠٠ ظهر - ١٠:٣٠ شب',
      sun: 'یکشنبه: ١٢:٠٠ ظهر - ٩:٣٠ شب',
      sevenDays: '7 روز هفته',
      kitchenNote: '* آشپزخانه 30 دقیقه قبل از بسته شدن تعطیل می‌شود',
      makeReservation: 'رزرو میز',
      callUs: 'با ما تماس بگیرید',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    tr: {
      title: 'Bizi Ziyaret Edin',
      subtitle: 'Bizi şehrin kalbinde bulun',
      pageTitle: 'Bizi Ziyaret Edin - Nature Village Restaurant',
      pageDescription: '302 Satellite Blvd NE, Suwanee, GA\'daki Nature Village Restaurant\'ı ziyaret edin. Haftanın 7 günü açık.',
      openingHours: 'Çalışma Saatleri',
      address: 'Adres',
      contactInfo: 'İletişim Bilgileri',
      getDirections: 'Yol Tarifi Al',
      phone: 'Telefon',
      monThu: 'PZT - PER: 11:30 - 21:30',
      fri: 'CUM: 11:30 - 22:30',
      sat: 'CTS: 12:00 - 22:30',
      sun: 'PAZ: 12:00 - 21:30',
      sevenDays: 'Haftanın 7 Günü',
      kitchenNote: '* Mutfak kapanış saatinden 30 dakika önce kapanır',
      makeReservation: 'Rezervasyon Yap',
      callUs: 'Bizi Arayın',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    es: {
      title: 'Visítanos',
      subtitle: 'Encuéntranos en el corazón de la ciudad',
      pageTitle: 'Visítanos - Nature Village Restaurant',
      pageDescription: 'Visita Nature Village Restaurant en 302 Satellite Blvd NE, Suwanee, GA. Abierto 7 días a la semana.',
      openingHours: 'Horario de Apertura',
      address: 'Dirección',
      contactInfo: 'Información de Contacto',
      getDirections: 'Obtener Direcciones',
      phone: 'Teléfono',
      monThu: 'LUN - JUE: 11:30 AM - 9:30 PM',
      fri: 'VIE: 11:30 AM - 10:30 PM',
      sat: 'SÁB: 12:00 PM - 10:30 PM',
      sun: 'DOM: 12:00 PM - 9:30 PM',
      sevenDays: '7 Días a la Semana',
      kitchenNote: '* La cocina cierra 30 minutos antes del cierre',
      makeReservation: 'Hacer Reserva',
      callUs: 'Llámanos',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    ur: {
      title: 'ہمیں ملیں',
      subtitle: 'شہر کے قلب میں ہمیں تلاش کریں',
      pageTitle: 'ہمیں ملیں - نیچر ولیج ریستوراں',
      pageDescription: '302 Satellite Blvd NE، Suwanee، GA میں نیچر ولیج ریستوراں ملاحظہ کریں۔ ہفتے کے 7 دن کھلا۔',
      openingHours: 'کھلنے کا وقت',
      address: 'پتہ',
      contactInfo: 'رابطہ کی معلومات',
      getDirections: 'سمت حاصل کریں',
      phone: 'فون',
      monThu: 'پیر - جمعرات: 11:30 صبح - 9:30 رات',
      fri: 'جمعہ: 11:30 صبح - 10:30 رات',
      sat: 'ہفتہ: 12:00 دوپہر - 10:30 رات',
      sun: 'اتوار: 12:00 دوپہر - 9:30 رات',
      sevenDays: 'ہفتے کے 7 دن',
      kitchenNote: '* کچن بند ہونے سے 30 منٹ پہلے بند ہو جاتی ہے',
      makeReservation: 'بکنگ کریں',
      callUs: 'ہمیں کال کریں',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    kmr: {
      title: 'Me bibînin',
      subtitle: 'Me li dilê bajêr bibînin',
      pageTitle: 'Me bibînin - Nature Village Restaurant',
      pageDescription: 'Li 302 Satellite Blvd NE, Suwanee, GA Nature Village Restaurant serdana bikin. 7 rojên hefteyê vekirî ye.',
      openingHours: 'Demên Vekrê',
      address: 'Navnîşan',
      contactInfo: 'Agahiya Têkiliyê',
      getDirections: 'Rê Bistînin',
      phone: 'Telefon',
      monThu: 'DUŞ - PÊN: 11:30 - 21:30',
      fri: 'ÎN: 11:30 - 22:30',
      sat: 'ŞEM: 12:00 - 22:30',
      sun: 'YEK: 12:00 - 21:30',
      sevenDays: '7 Rojên Hefteyê',
      kitchenNote: '* Mutfax 30 deqîqe berî girtin tê girtin',
      makeReservation: 'Rezervasyon Bikin',
      callUs: 'Me Telefon Bikin',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    ru: {
      title: 'Посетите нас',
      subtitle: 'Найдите нас в самом сердце города',
      pageTitle: 'Посетите нас - Ресторан Nature Village',
      pageDescription: 'Посетите ресторан Nature Village по адресу 302 Satellite Blvd NE, Suwanee, GA. Открыто 7 дней в неделю.',
      openingHours: 'Часы работы',
      address: 'Адрес',
      contactInfo: 'Контактная информация',
      getDirections: 'Получить направления',
      phone: 'Телефон',
      monThu: 'ПН - ЧТ: 11:30 - 21:30',
      fri: 'ПТ: 11:30 - 22:30',
      sat: 'СБ: 12:00 - 22:30',
      sun: 'ВС: 12:00 - 21:30',
      sevenDays: '7 дней в неделю',
      kitchenNote: '* Кухня закрывается за 30 минут до закрытия',
      makeReservation: 'Забронировать',
      callUs: 'Позвоните нам',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    hi: {
      title: 'हमसे मिलें',
      subtitle: 'शहर के दिल में हमें खोजें',
      pageTitle: 'हमसे मिलें - नेचर विलेज रेस्तरां',
      pageDescription: '302 Satellite Blvd NE, Suwanee, GA में नेचर विलेज रेस्तरां पर जाएँ। सप्ताह के 7 दिन खुला।',
      openingHours: 'खुलने का समय',
      address: 'पता',
      contactInfo: 'संपर्क जानकारी',
      getDirections: 'दिशा-निर्देश प्राप्त करें',
      phone: 'फ़ोन',
      monThu: 'सोम - गुरु: 11:30 - 21:30',
      fri: 'शुक्र: 11:30 - 22:30',
      sat: 'शनि: 12:00 - 22:30',
      sun: 'रवि: 12:00 - 21:30',
      sevenDays: 'सप्ताह के 7 दिन',
      kitchenNote: '* रसोई बंद होने से 30 मिनट पहले बंद हो जाती है',
      makeReservation: 'आरक्षण करें',
      callUs: 'हमें कॉल करें',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    sq: {
      title: 'Na Vizitoni',
      subtitle: 'Na gjeni në zemër të qytetit',
      pageTitle: 'Na Vizitoni - Nature Village Restaurant',
      pageDescription: 'Vizitoni Nature Village Restaurant në 302 Satellite Blvd NE, Suwanee, GA. Hapur 7 ditë në javë.',
      openingHours: 'Orari i Hapjes',
      address: 'Adresa',
      contactInfo: 'Informacione Kontakti',
      getDirections: 'Merrni Udhëzimet',
      phone: 'Telefoni',
      monThu: 'HËN - ENJ: 11:30 - 21:30',
      fri: 'PRE: 11:30 - 22:30',
      sat: 'SHT: 12:00 - 22:30',
      sun: 'DIE: 12:00 - 21:30',
      sevenDays: '7 Ditë në Javë',
      kitchenNote: '* Kuzhina mbyllet 30 minuta para mbylljes',
      makeReservation: 'Bëni Rezervim',
      callUs: 'Na Telefononi',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    fr: {
      title: 'Nous Visiter',
      subtitle: 'Trouvez-nous au cœur de la ville',
      pageTitle: 'Nous Visiter - Nature Village Restaurant',
      pageDescription: 'Visitez le Nature Village Restaurant au 302 Satellite Blvd NE, Suwanee, GA. Ouvert 7 jours sur 7.',
      openingHours: 'Horaires d\'ouverture',
      address: 'Adresse',
      contactInfo: 'Coordonnées',
      getDirections: 'Obtenir l\'itinéraire',
      phone: 'Téléphone',
      monThu: 'LUN - JEU: 11h30 - 21h30',
      fri: 'VEN: 11h30 - 22h30',
      sat: 'SAM: 12h00 - 22h30',
      sun: 'DIM: 12h00 - 21h30',
      sevenDays: '7 jours sur 7',
      kitchenNote: '* La cuisine ferme 30 minutes avant l\'heure de fermeture',
      makeReservation: 'Réserver',
      callUs: 'Appelez-nous',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    de: {
      title: 'Besuchen Sie uns',
      subtitle: 'Finden Sie uns im Herzen der Stadt',
      pageTitle: 'Besuchen Sie uns - Nature Village Restaurant',
      pageDescription: 'Besuchen Sie das Nature Village Restaurant in 302 Satellite Blvd NE, Suwanee, GA. 7 Tage die Woche geöffnet.',
      openingHours: 'Öffnungszeiten',
      address: 'Adresse',
      contactInfo: 'Kontaktinformationen',
      getDirections: 'Wegbeschreibung',
      phone: 'Telefon',
      monThu: 'MO - DO: 11:30 - 21:30',
      fri: 'FR: 11:30 - 22:30',
      sat: 'SA: 12:00 - 22:30',
      sun: 'SO: 12:00 - 21:30',
      sevenDays: '7 Tage die Woche',
      kitchenNote: '* Die Küche schließt 30 Minuten vor Geschäftsschluss',
      makeReservation: 'Reservieren',
      callUs: 'Rufen Sie uns an',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    bn: {
      title: 'আমাদের দেখুন',
      subtitle: 'শহরের কেন্দ্রে আমাদের খুঁজুন',
      pageTitle: 'আমাদের দেখুন - নেচার ভিলেজ রেস্তোরাঁ',
      pageDescription: '302 Satellite Blvd NE, Suwanee, GA-তে নেচার ভিলেজ রেস্তোরাঁ দেখুন। সপ্তাহের 7 দিন খোলা।',
      openingHours: 'খোলার সময়',
      address: 'ঠিকানা',
      contactInfo: 'যোগাযোগের তথ্য',
      getDirections: 'দিকনির্দেশ পান',
      phone: 'ফোন',
      monThu: 'সোম - বৃহ: 11:30 - 21:30',
      fri: 'শুক্র: 11:30 - 22:30',
      sat: 'শনি: 12:00 - 22:30',
      sun: 'রবি: 12:00 - 21:30',
      sevenDays: 'সপ্তাহের 7 দিন',
      kitchenNote: '* রান্নাঘর বন্ধ হওয়ার 30 মিনিট আগে বন্ধ হয়',
      makeReservation: 'সংরক্ষণ করুন',
      callUs: 'আমাদের কল করুন',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    ko: {
      title: '방문하기',
      subtitle: '도심 속에서 저희를 찾아보세요',
      pageTitle: '방문하기 - Nature Village Restaurant',
      pageDescription: '302 Satellite Blvd NE, Suwanee, GA의 Nature Village Restaurant을 방문하세요. 주 7일 영업.',
      openingHours: '영업 시간',
      address: '주소',
      contactInfo: '연락처',
      getDirections: '길찾기',
      phone: '전화',
      monThu: '월 - 목: 11:30 - 21:30',
      fri: '금: 11:30 - 22:30',
      sat: '토: 12:00 - 22:30',
      sun: '일: 12:00 - 21:30',
      sevenDays: '주 7일 영업',
      kitchenNote: '* 주방은 마감 30분 전에 닫습니다',
      makeReservation: '예약하기',
      callUs: '전화하기',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    bs: {
      title: 'Posjetite nas',
      subtitle: 'Pronađite nas u srcu grada',
      pageTitle: 'Posjetite nas - Nature Village Restaurant',
      pageDescription: 'Posjetite Nature Village Restaurant na 302 Satellite Blvd NE, Suwanee, GA. Otvoreno 7 dana u sedmici.',
      openingHours: 'Radno Vrijeme',
      address: 'Adresa',
      contactInfo: 'Kontakt Informacije',
      getDirections: 'Dobij Upute',
      phone: 'Telefon',
      monThu: 'PON - ČET: 11:30 - 21:30',
      fri: 'PET: 11:30 - 22:30',
      sat: 'SUB: 12:00 - 22:30',
      sun: 'NED: 12:00 - 21:30',
      sevenDays: '7 Dana u Sedmici',
      kitchenNote: '* Kuhinja se zatvara 30 minuta prije zatvaranja',
      makeReservation: 'Rezerviši',
      callUs: 'Pozovite nas',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    zh: {
      title: '访问我们',
      subtitle: '在市中心找到我们',
      pageTitle: '访问我们 - Nature Village Restaurant',
      pageDescription: '访问位于302 Satellite Blvd NE, Suwanee, GA的Nature Village Restaurant。每周7天营业。',
      openingHours: '营业时间',
      address: '地址',
      contactInfo: '联系信息',
      getDirections: '获取路线',
      phone: '电话',
      monThu: '周一 - 周四: 11:30 - 21:30',
      fri: '周五: 11:30 - 22:30',
      sat: '周六: 12:00 - 22:30',
      sun: '周日: 12:00 - 21:30',
      sevenDays: '每周7天',
      kitchenNote: '* 厨房在关门前30分钟停止营业',
      makeReservation: '预订',
      callUs: '致电我们',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    ro: {
      title: 'Vizitează-ne',
      subtitle: 'Găsește-ne în inima orașului',
      pageTitle: 'Vizitează-ne - Nature Village Restaurant',
      pageDescription: 'Vizitați Nature Village Restaurant la 302 Satellite Blvd NE, Suwanee, GA. Deschis 7 zile pe săptămână.',
      openingHours: 'Program',
      address: 'Adresă',
      contactInfo: 'Informații Contact',
      getDirections: 'Obține Direcții',
      phone: 'Telefon',
      monThu: 'LUN - JOI: 11:30 - 21:30',
      fri: 'VIN: 11:30 - 22:30',
      sat: 'SÂM: 12:00 - 22:30',
      sun: 'DUM: 12:00 - 21:30',
      sevenDays: '7 Zile pe Săptămână',
      kitchenNote: '* Bucătăria se închide cu 30 de minute înainte de închidere',
      makeReservation: 'Rezervă',
      callUs: 'Sună-ne',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    uk: {
      title: 'Відвідайте нас',
      subtitle: 'Знайдіть нас у серці міста',
      pageTitle: 'Відвідайте нас - Ресторан Nature Village',
      pageDescription: 'Відвідайте ресторан Nature Village за адресою 302 Satellite Blvd NE, Suwanee, GA. Відкрито 7 днів на тиждень.',
      openingHours: 'Години роботи',
      address: 'Адреса',
      contactInfo: 'Контактна інформація',
      getDirections: 'Отримати маршрут',
      phone: 'Телефон',
      monThu: 'ПН - ЧТ: 11:30 - 21:30',
      fri: 'ПТ: 11:30 - 22:30',
      sat: 'СБ: 12:00 - 22:30',
      sun: 'НД: 12:00 - 21:30',
      sevenDays: '7 днів на тиждень',
      kitchenNote: '* Кухня закривається за 30 хвилин до закриття',
      makeReservation: 'Забронювати',
      callUs: 'Зателефонуйте нам',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
    },
    vi: {
      title: 'Thăm chúng tôi',
      subtitle: 'Tìm chúng tôi ở trung tâm thành phố',
      pageTitle: 'Thăm chúng tôi - Nhà hàng Nature Village',
      pageDescription: 'Ghé thăm Nhà hàng Nature Village tại 302 Satellite Blvd NE, Suwanee, GA. Mở cửa 7 ngày trong tuần.',
      openingHours: 'Giờ mở cửa',
      address: 'Địa chỉ',
      contactInfo: 'Thông tin liên hệ',
      getDirections: 'Lấy chỉ đường',
      phone: 'Điện thoại',
      monThu: 'T2 - T5: 11:30 - 21:30',
      fri: 'T6: 11:30 - 22:30',
      sat: 'T7: 12:00 - 22:30',
      sun: 'CN: 12:00 - 21:30',
      sevenDays: '7 Ngày trong tuần',
      kitchenNote: '* Bếp đóng cửa trước 30 phút',
      makeReservation: 'Đặt bàn',
      callUs: 'Gọi cho chúng tôi',
      location: '302 Satellite Blvd NE STE 125',
      city: 'Suwanee, GA 30024',
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

      <Header currentPage="visit" />

      <main className="min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.3)',
            }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient Overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-orange-900/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header with Glass Effect */}
            <div className={`text-center mb-16 sm:mb-20 ${isRTL ? 'rtl' : 'ltr'}`}>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl p-10 sm:p-16 border-2 border-white/30 shadow-2xl max-w-5xl mx-auto overflow-hidden group">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-orange-400/20 to-transparent rounded-full blur-3xl"></div>
                
                <div className="relative">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
                    {t.title}
                  </h1>
                  <p className="text-2xl sm:text-3xl text-amber-100 mb-8 drop-shadow-lg font-light tracking-wide">
                    {t.subtitle}
                  </p>
                  <div className="relative w-40 h-1.5 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300 to-transparent blur-sm"></div>
                    <div className="relative w-full h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

          {/* Main Information Cards with Glass Morphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Opening Hours */}
            <div className="group relative backdrop-blur-xl bg-white/15 rounded-3xl p-10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-white/40 hover:border-white/60 hover:scale-105 transform overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-center">
                <div className="relative mb-8">
                  <Clock className="w-16 h-16 text-white mx-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-lg">
                  {t.openingHours}
                </h3>
                <div className="space-y-3 text-white">
                  <p className="text-base font-bold tracking-wide drop-shadow-md">{t.monThu}</p>
                  <p className="text-base font-bold tracking-wide drop-shadow-md">{t.fri}</p>
                  <p className="text-base font-bold tracking-wide drop-shadow-md">{t.sat}</p>
                  <p className="text-base font-bold tracking-wide drop-shadow-md">{t.sun}</p>
                  <div className="relative my-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur opacity-40"></div>
                    <p className="relative text-white font-black text-xl bg-white/20 backdrop-blur-sm rounded-xl py-3 shadow-lg border border-white/30">{t.sevenDays}</p>
                  </div>
                  <div className="pt-6 mt-6 border-t-2 border-white/30">
                    <p className="text-sm text-amber-100 italic font-medium bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      {t.kitchenNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="group relative backdrop-blur-xl bg-white/15 rounded-3xl p-10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-white/40 hover:border-white/60 hover:scale-105 transform overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-center">
                <div className="relative mb-8">
                  <MapPin className="w-16 h-16 text-white mx-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-lg">
                  {t.address}
                </h3>
                <div className="space-y-2 text-white mb-8">
                  <p className="text-lg font-semibold drop-shadow-md">{t.location}</p>
                  <p className="text-lg font-semibold drop-shadow-md">{t.city}</p>
                </div>
                <button
                  onClick={() => window.open('https://maps.app.goo.gl/4rmfzb2YM4Usx8CQ9', '_blank')}
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:border-white/80 text-white px-9 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  <Navigation className="w-6 h-6" />
                  {t.getDirections}
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="group relative backdrop-blur-xl bg-white/15 rounded-3xl p-10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-white/40 hover:border-white/60 hover:scale-105 transform overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-center">
                <div className="relative mb-8">
                  <Phone className="w-16 h-16 text-white mx-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-lg">
                  {t.contactInfo}
                </h3>
                <div className="space-y-5">
                  <p className="text-white text-lg font-semibold drop-shadow-md">{t.phone}:</p>
                  <a
                    href="tel:4703501019"
                    className="inline-block text-3xl font-black text-white drop-shadow-lg hover:text-amber-200 transition-all transform hover:scale-105"
                  >
                    (470) 350-1019
                  </a>
                  <div className="pt-6">
                    <a
                      href="tel:4703501019"
                      className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:border-white/80 text-white px-9 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg text-lg"
                    >
                      <Phone className="w-6 h-6" />
                      {t.callUs}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed with Enhanced Styling */}
          <div className="relative backdrop-blur-xl bg-white/15 rounded-3xl p-8 shadow-2xl mb-16 border-2 border-white/40 overflow-hidden group">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.8756284919326!2d-84.07346492376583!3d34.01619721925604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5a2e8e0c0e0e0%3A0x0!2s302%20Satellite%20Blvd%20NE%20STE%20125%2C%20Suwanee%2C%20GA%2030024!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="550"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Call to Action with Enhanced Design */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/reservations'}
              className="inline-flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:border-white/80 text-white px-14 py-7 rounded-2xl text-2xl font-black transition-all transform hover:scale-105 shadow-lg"
            >
              <Calendar className="w-9 h-9 animate-pulse" />
              <span className="tracking-wide">{t.makeReservation}</span>
            </button>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VisitUsPage;
