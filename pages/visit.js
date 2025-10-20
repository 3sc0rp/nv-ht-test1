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
      sunThu: 'SUN - THU: 12 PM - 10 PM',
      friSat: 'FRI - SAT: 12 PM - 11 PM',
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
      sunThu: 'یەکشەممە - پێنجشەممە: ١٢ی نیوەڕۆ - ١٠ی شەو',
      friSat: 'هەینی - شەممە: ١٢ی نیوەڕۆ - ١١ی شەو',
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
      sunThu: 'الأحد - الخميس: 12 ظهراً - 10 مساءً',
      friSat: 'الجمعة - السبت: 12 ظهراً - 11 مساءً',
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
      sunThu: 'یکشنبه - پنجشنبه: 12 ظهر - 10 شب',
      friSat: 'جمعه - شنبه: 12 ظهر - 11 شب',
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
      sunThu: 'PAZ - PER: 12:00 - 22:00',
      friSat: 'CUM - CTS: 12:00 - 23:00',
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
      sunThu: 'DOM - JUE: 12 PM - 10 PM',
      friSat: 'VIE - SÁB: 12 PM - 11 PM',
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
      sunThu: 'اتوار - جمعرات: دوپہر 12 - رات 10',
      friSat: 'جمعہ - ہفتہ: دوپہر 12 - رات 11',
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
      sunThu: 'YEK - PÊN: 12 NR - 10 ŞV',
      friSat: 'ÎN - ŞEM: 12 NR - 11 ŞV',
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
      sunThu: 'ВС - ЧТ: 12:00 - 22:00',
      friSat: 'ПТ - СБ: 12:00 - 23:00',
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
      sunThu: 'रवि - गुरु: दोपहर 12 - रात 10',
      friSat: 'शुक्र - शनि: दोपहर 12 - रात 11',
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
      sunThu: 'DIE - ENJ: 12 MD - 10 PM',
      friSat: 'PRE - SHT: 12 MD - 11 PM',
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
      sunThu: 'DIM - JEU: 12h - 22h',
      friSat: 'VEN - SAM: 12h - 23h',
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
      sunThu: 'SO - DO: 12:00 - 22:00',
      friSat: 'FR - SA: 12:00 - 23:00',
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
      sunThu: 'রবি - বৃহ: দুপুর 12 - রাত 10',
      friSat: 'শুক্র - শনি: দুপুর 12 - রাত 11',
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
      sunThu: '일 - 목: 오후 12시 - 오후 10시',
      friSat: '금 - 토: 오후 12시 - 오후 11시',
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
      sunThu: 'NED - ČET: 12:00 - 22:00',
      friSat: 'PET - SUB: 12:00 - 23:00',
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
      sunThu: '周日 - 周四: 中午12点 - 晚上10点',
      friSat: '周五 - 周六: 中午12点 - 晚上11点',
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
      sunThu: 'DUM - JOI: 12:00 - 22:00',
      friSat: 'VIN - SÂM: 12:00 - 23:00',
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
      sunThu: 'НД - ЧТ: 12:00 - 22:00',
      friSat: 'ПТ - СБ: 12:00 - 23:00',
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
      sunThu: 'CN - T5: 12 PM - 10 PM',
      friSat: 'T6 - T7: 12 PM - 11 PM',
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

      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className={`text-center mb-12 sm:mb-16 ${isRTL ? 'rtl' : 'ltr'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-800 mb-4">
              {t.title}
            </h1>
            <p className="text-xl sm:text-2xl text-amber-600 mb-6">
              {t.subtitle}
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          {/* Main Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Opening Hours */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-amber-100">
              <div className="text-center">
                <Clock className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-800 mb-6">
                  {t.openingHours}
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="text-lg font-medium">{t.sunThu}</p>
                  <p className="text-lg font-medium">{t.friSat}</p>
                  <p className="text-amber-600 font-bold text-lg mt-4">{t.sevenDays}</p>
                  <p className="text-sm text-amber-700 italic mt-4 pt-4 border-t border-amber-100">
                    {t.kitchenNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-amber-100">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-800 mb-6">
                  {t.address}
                </h3>
                <div className="space-y-2 text-gray-700 mb-6">
                  <p className="text-lg">{t.location}</p>
                  <p className="text-lg">{t.city}</p>
                </div>
                <button
                  onClick={() => window.open('https://maps.app.goo.gl/4rmfzb2YM4Usx8CQ9', '_blank')}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md"
                >
                  <Navigation className="w-5 h-5" />
                  {t.getDirections}
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-amber-100">
              <div className="text-center">
                <Phone className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-800 mb-6">
                  {t.contactInfo}
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">{t.phone}:</p>
                  <a
                    href="tel:4703501019"
                    className="inline-flex items-center gap-2 text-2xl font-bold text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    (470) 350-1019
                  </a>
                  <div className="pt-4">
                    <a
                      href="tel:4703501019"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md"
                    >
                      <Phone className="w-5 h-5" />
                      {t.callUs}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-white rounded-2xl p-4 shadow-xl mb-12 border border-amber-100">
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.8756284919326!2d-84.07346492376583!3d34.01619721925604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5a2e8e0c0e0e0%3A0x0!2s302%20Satellite%20Blvd%20NE%20STE%20125%2C%20Suwanee%2C%20GA%2030024!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/reservations'}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-5 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl"
            >
              <Calendar className="w-6 h-6" />
              {t.makeReservation}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VisitUsPage;
