import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Clock, Star, Filter, Globe, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const NatureVillageWebsite = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [activeFilter, setActiveFilter] = useState('popular');
  const router = useRouter();
  useEffect(() => {
    const qpLang = typeof router.query.lang === 'string' ? router.query.lang : undefined;
    if (qpLang && languages[qpLang]) {
      setLanguage(qpLang);
      document.documentElement.setAttribute('dir', languages[qpLang].dir);
      document.documentElement.lang = qpLang;
    } else {
      document.documentElement.setAttribute('dir', languages[language].dir);
      document.documentElement.lang = language;
    }
  }, [router.query.lang]);

  const handleLanguageChange = (next) => {
    setLanguage(next);
    document.documentElement.setAttribute('dir', languages[next].dir);
    document.documentElement.lang = next;
    const url = { pathname: router.pathname, query: { ...router.query, lang: next } };
    router.replace(url, undefined, { shallow: true });
  };

  // Language options
  const languages = {
    en: { name: 'English', code: 'en', dir: 'ltr' },
    ku: { name: 'کوردی', code: 'ku', dir: 'rtl' },
    ar: { name: 'العربية', code: 'ar', dir: 'rtl' },
    fa: { name: 'فارسی', code: 'fa', dir: 'rtl' },
    tr: { name: 'Türkçe', code: 'tr', dir: 'ltr' },
    ur: { name: 'اردو', code: 'ur', dir: 'rtl' },
    kmr: { name: 'Kurdî (Kurmancî)', code: 'kmr', dir: 'ltr' }
  };

  // Kurdish pattern SVG for decorative elements
  const KurdishPattern = () => (
    <svg className="absolute opacity-10" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <pattern id="kurdishPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#8B4513"/>
          <polygon points="25,5 45,25 25,45 5,25" fill="#D2B48C"/>
          <circle cx="25" cy="25" r="8" fill="#6B8E23"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#kurdishPattern)"/>
    </svg>
  );

  // Sample menu data with MenuIQ integration placeholder
  const menuItems = [
    {
      id: 1,
      name: {
        en: 'Kebab-e Kubideh',
        ku: 'کەباب کوبیده',
        ar: 'كباب كوبيده'
      },
      description: {
        en: 'Traditional ground lamb kebab with aromatic spices, served with basmati rice and grilled tomatoes',
        ku: 'کەبابی نەریتی لە گۆشتی بەرخی هاڕاو لەگەڵ بۆنوبێرینی جۆراوجۆر، لەگەڵ برنجی باسماتی و تەماتەی برژاو',
        ar: 'كباب لحم الخروف المفروم التقليدي مع التوابل العطرة، يُقدم مع أرز البسمتي والطماطم المشوية'
      },
      price: '$18.99',
      category: 'traditional',
      popular: true,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=200&fit=crop',
      tags: ['spicy', 'grilled']
    },
    {
      id: 2,
      name: {
        en: 'Dolma',
        ku: 'دۆڵمە',
        ar: 'دولمة'
      },
      description: {
        en: 'Grape leaves stuffed with rice, herbs, and spices - a Kurdish family recipe',
        ku: 'گەڵای مێو پڕکراو لە برنج و ڕووەک و بۆنوبێرین - ڕیسەتی خێزانی کوردی',
        ar: 'أوراق العنب محشوة بالأرز والأعشاب والتوابل - وصفة عائلية كردية'
      },
      price: '$14.99',
      category: 'vegan',
      popular: false,
      image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=300&h=200&fit=crop',
      tags: ['vegetarian', 'traditional']
    },
    {
      id: 3,
      name: {
        en: 'Yaprakh',
        ku: 'یاپراخ',
        ar: 'يبرق'
      },
      description: {
        en: 'Cabbage rolls filled with rice, meat, and Kurdish spices in tomato sauce',
        ku: 'لەتی کەلەرم پڕکراو لە برنج و گۆشت و بۆنوبێرینی کوردی لە سۆسی تەماتە',
        ar: 'لفائف الملفوف محشوة بالأرز واللحم والتوابل الكردية في صلصة الطماطم'
      },
      price: '$16.99',
      category: 'traditional',
      popular: true,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
      tags: ['comfort food']
    },
    {
      id: 4,
      name: {
        en: 'Ash-e Reshteh',
        ku: 'ئاشی ڕەشتە',
        ar: 'آش رشتة'
      },
      description: {
        en: 'Hearty Kurdish noodle soup with beans, herbs, and yogurt',
        ku: 'شۆربای ڕەشتەی کوردی لەگەڵ لۆبیا و ڕووەک و ماست',
        ar: 'حساء الشعيرية الكردي المغذي مع الفاصولياء والأعشاب واللبن'
      },
      price: '$12.99',
      category: 'soup',
      popular: false,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop',
      tags: ['soup', 'comfort food']
    },
    {
      id: 5,
      name: {
        en: 'Khorak-e Bademjan',
        ku: 'خۆراکی بادەمجان',
        ar: 'خوراك الباذنجان'
      },
      description: {
        en: 'Slow-cooked eggplant stew with tomatoes and Kurdish herbs',
        ku: 'خۆراکی بادەمجانی هێواش لێنراو لەگەڵ تەماتە و ڕووەکی کوردی',
        ar: 'يخنة الباذنجان المطبوخة ببطء مع الطماطم والأعشاب الكردية'
      },
      price: '$15.99',
      category: 'vegan',
      popular: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      tags: ['vegan', 'stew']
    },
    {
      id: 6,
      name: {
        en: 'Baklava Kurdistan',
        ku: 'بەقڵاوای کوردستان',
        ar: 'بقلاوة كردستان'
      },
      description: {
        en: 'Traditional Kurdish baklava with pistachios and rose water',
        ku: 'بەقڵاوای نەریتی کوردی لەگەڵ فستق و ئاوی گوڵ',
        ar: 'بقلاوة كردية تقليدية بالفستق وماء الورد'
      },
      price: '$8.99',
      category: 'dessert',
      popular: true,
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop',
      tags: ['sweet', 'traditional']
    }
  ];

  const translations = {
    en: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        about: 'About Us',
        gallery: 'Gallery',
        visit: 'Visit Us',
        reservations: 'Reservations',
        catering: 'Catering'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'A Taste of Kurdistan in Every Bite',
        description: 'Experience authentic Kurdish flavors in a warm, traditional setting where every dish tells a story of our rich cultural heritage.',
        cta1: 'View Menu',
        cta2: 'Make Reservation'
      },
      menu: {
        title: 'Our Menu',
        subtitle: 'Powered by MenuIQ - AI-Enhanced Dining Experience',
        filters: {
          all: 'All Items',
          traditional: 'Traditional',
          vegan: 'Vegan & Vegetarian',
          popular: 'Most Popular'
        },
        viewFull: 'View Full Menu'
      },
      about: {
        title: 'Our Story',
        content: 'Nature Village was born from a dream to share the authentic flavors and warm hospitality of Kurdistan with the world. Our family recipes have been passed down through generations, each dish crafted with love and respect for our cultural traditions.',
        experience: 'Years Experience',
        recipes: 'Traditional Recipes'
      },
      gallery: {
        title: 'Gallery',
        subtitle: 'A visual journey through our culinary heritage'
      },
      visit: {
        title: 'Visit Us',
        subtitle: 'Find us in the heart of the city',
        hours: 'Hours',
        contact: 'Contact',
        address: 'Address',
        phone: 'Phone',
        whatsapp: 'WhatsApp',
        makeReservation: 'Make Reservation',
        whatsappUs: 'WhatsApp Us'
      },
      footer: {
        description: 'Bringing the authentic flavors and warm hospitality of Kurdistan to your table. Every dish is a celebration of our rich cultural heritage.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Info',
        openDaily: 'Open Daily 11:00 AM',
        poweredBy: 'Powered by',
        copyright: '© 2024 Nature Village Kurdish Restaurant. All rights reserved.'
      },
      featured: {
        title: 'Featured Dishes',
        subtitle: 'Discover our most beloved Kurdish specialties, crafted with traditional recipes and modern presentation'
      },
    },
    ku: {
      nav: {
        home: 'ماڵەوە',
        menu: 'خۆراک',
        about: 'دەربارەمان',
        gallery: 'وێنەکان',
        visit: 'سەردانمان بکەن',
        reservations: 'جێگە حیجازکردن',
        catering: 'کاتەرینگ'
      },
      hero: {
        title: 'گوندی سروشت',
        subtitle: 'تامی کوردستان لە هەر پارووەکدا',
        description: 'تامی ڕەسەنی کوردی بچێژن لە ژینگەیەکی گەرم و نەریتیدا کە هەر خۆراکێک چیرۆکی دەوڵەمەندی کولتووری میراتمان دەگێڕێتەوە.',
        cta1: 'بینینی خۆراک',
        cta2: 'جێگە حیجازکردن'
      },
      menu: {
        title: 'خۆراکەکانمان',
        subtitle: 'بە MenuIQ هێزدراو - ئەزموونی خۆراک لەگەڵ زیرەکی دەستکرد',
        filters: {
          all: 'هەموو ئایتەمەکان',
          traditional: 'نەریتی',
          vegan: 'ڕووەکی و ڤێگان',
          popular: 'بەناوبانگترین'
        },
        viewFull: 'بینینی هەموو خۆراکەکان'
      },
      about: {
        title: 'چیرۆکەکەمان',
        content: 'گوندی سروشت لە خەونێکەوە لەدایک بووە بۆ هاوبەشکردنی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان لەگەڵ جیهان. ڕیسەتەکانی خێزانەکەمان لە نەوەیەکەوە بۆ نەوەیەک دراونەتەوە، هەر خۆراکێک بە خۆشەویستی و ڕێزگرتن لە نەریتە کولتوورییەکانمان دروست دەکرێت.',
        experience: 'ساڵ ئەزموون',
        recipes: 'ڕیسەتی نەریتی'
      },
      gallery: {
        title: 'گالەری',
        subtitle: 'گەشتێکی بینایی بە میراتی چێشتلێنانمان'
      },
      visit: {
        title: 'سەردانمان بکەن',
        subtitle: 'لە دڵی شارەکە بمانبینەوە',
        hours: 'کاتەکان',
        contact: 'پەیوەندی',
        address: 'ناونیشان',
        phone: 'تەلەفۆن',
        whatsapp: 'واتساپ',
        makeReservation: 'جێگە حیجازکردن',
        whatsappUs: 'واتساپمان بکە'
      },
      footer: {
        description: 'هێنانی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان بۆ مێزەکەتان. هەر خۆراکێک ئاهەنگگێڕانی دەوڵەمەندی کولتووری میراتمانە.',
        quickLinks: 'لینکە خێراکان',
        contactInfo: 'زانیاری پەیوەندی',
        openDaily: 'ڕۆژانە کراوەیە کاتژمێر ١١:٠٠ی بەیانی',
        poweredBy: 'هێزی لەلایەن',
        copyright: '© ٢٠٢٤ گوندی سروشت چێشتخانەی کوردی. هەموو مافەکان پارێزراون.'
      },
      featured: {
        title: 'خۆراکی نمایشکراو',
        subtitle: 'خۆراکە خۆشەویستەکانی کوردی بناسە، لەگەڵ ڕیسەتی نەریتی و پێشکەشکردنی نوێ دروستکراون'
      }
    },
    ar: {
      nav: {
        home: 'الرئيسية',
        menu: 'القائمة',
        about: 'من نحن',
        gallery: 'المعرض',
        visit: 'زورونا',
        reservations: 'الحجوزات',
        catering: 'خدمات الطعام'
      },
      hero: {
        title: 'قرية الطبيعة',
        subtitle: 'طعم كردستان في كل قضمة',
        description: 'اختبر النكهات الكردية الأصيلة في جو دافئ وتقليدي حيث يحكي كل طبق قصة من تراثنا الثقافي الغني.',
        cta1: 'عرض القائمة',
        cta2: 'حجز طاولة'
      },
      menu: {
        title: 'قائمتنا',
        subtitle: 'مدعوم بـ MenuIQ - تجربة طعام محسّنة بالذكاء الاصطناعي',
        filters: {
          all: 'جميع الأطباق',
          traditional: 'تقليدي',
          vegan: 'نباتي ونباتي صرف',
          popular: 'الأكثر شهرة'
        },
        viewFull: 'عرض القائمة الكاملة'
      },
      about: {
        title: 'قصتنا',
        content: 'وُلدت قرية الطبيعة من حلم مشاركة النكهات الأصيلة والضيافة الدافئة لكردستان مع العالم. وصفات عائلتنا تُورث عبر الأجيال، كل طبق يُحضر بحب واحترام لتقاليدنا الثقافية.',
        experience: 'سنوات خبرة',
        recipes: 'وصفات تقليدية'
      },
      gallery: {
        title: 'المعرض',
        subtitle: 'رحلة بصرية عبر تراثنا الطهوي'
      },
      visit: {
        title: 'زورونا',
        subtitle: 'اعثر علينا في قلب المدينة',
        hours: 'ساعات العمل',
        contact: 'اتصل بنا',
        address: 'العنوان',
        phone: 'الهاتف',
        whatsapp: 'واتساب',
        makeReservation: 'احجز طاولة',
        whatsappUs: 'راسلنا على واتساب'
      },
      footer: {
        description: 'نجلب النكهات الأصيلة والضيافة الدافئة من كردستان إلى طاولتك. كل طبق هو احتفال بتراثنا الثقافي الغني.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        openDaily: 'مفتوح يومياً الساعة ١١:٠٠ صباحاً',
        poweredBy: 'مدعوم من',
        copyright: '© ٢٠٢٤ قرية الطبيعة مطعم كردي. جميع الحقوق محفوظة.'
      },
      featured: {
        title: 'الأطباق المميزة',
        subtitle: 'اكتشف أحب الأطباق الكردية لدينا، المحضرة بوصفات تقليدية وعرض عصري'
      }
    },
    fa: {
      nav: { home: 'خانه', menu: 'منو', about: 'درباره ما', gallery: 'گالری', visit: 'دیدار از ما', reservations: 'رزرو', catering: 'کترینگ' },
      hero: { title: 'روستای طبیعت', subtitle: 'طعم کردستان در هر لقمه', description: 'طعم‌های اصیل کردی را در فضایی گرم و سنتی تجربه کنید؛ هر بشقاب روایت‌گر میراث فرهنگی ماست.', cta1: 'مشاهده منو', cta2: 'رزرو میز' },
      menu: { title: 'منوی ما', subtitle: 'با MenuIQ - تجربه غذا با هوش مصنوعی', filters: { all: 'همه موارد', traditional: 'سنتی', vegan: 'گیاهی و وجترین', popular: 'محبوب‌ترین' }, viewFull: 'مشاهده منوی کامل' },
      about: { title: 'داستان ما', content: 'روستای طبیعت با رویای به‌اشتراک‌گذاری طعم‌های اصیل و مهمان‌نوازی گرم کردستان با جهان شکل گرفت.', experience: 'سال تجربه', recipes: 'دستورهای سنتی' },
      gallery: { title: 'گالری', subtitle: 'سفر تصویری در میراث آشپزی ما' },
      visit: { title: 'دیدار از ما', subtitle: 'ما را در قلب شهر پیدا کنید', hours: 'ساعات کاری', contact: 'ارتباط', address: 'نشانی', phone: 'تلفن', whatsapp: 'واتس‌اپ', makeReservation: 'رزرو میز', whatsappUs: 'در واتس‌اپ پیام دهید' },
      footer: { description: 'طعم‌های اصیل و مهمان‌نوازی گرم کردستان را به میز شما می‌آوریم.', quickLinks: 'لینک‌های سریع', contactInfo: 'اطلاعات تماس', openDaily: 'روزانه از ساعت ۱۱:۰۰ باز است', poweredBy: 'قدرت گرفته از', copyright: '© 2024 رستوران کردی روستای طبیعت. همه حقوق محفوظ است.' },
      featured: { title: 'غذاهای ویژه', subtitle: 'محبوب‌ترین غذاهای کردی ما' }
    },
    tr: {
      nav: { home: 'Ana Sayfa', menu: 'Menü', about: 'Hakkımızda', gallery: 'Galeri', visit: 'Bizi Ziyaret Edin', reservations: 'Rezervasyon', catering: 'Catering' },
      hero: { title: 'Nature Village', subtitle: 'Her Lokmada Kürdistan’ın Tadı', description: 'Sıcak ve geleneksel bir ortamda, her tabakta zengin kültürel mirasımızın hikâyesini anlatan özgün Kürt lezzetleri.', cta1: 'Menüyü Görüntüle', cta2: 'Rezervasyon Yap' },
      menu: { title: 'Menümüz', subtitle: 'MenuIQ ile güçlendirildi', filters: { all: 'Tüm Ürünler', traditional: 'Geleneksel', vegan: 'Vegan & Vejetaryen', popular: 'En Popüler' }, viewFull: 'Tüm Menüyü Gör' },
      about: { title: 'Hikayemiz', content: 'Nature Village, Kürdistan’ın özgün lezzetlerini ve sıcak misafirperverliğini dünyayla paylaşma hayaliyle doğdu.', experience: 'Yıl Deneyim', recipes: 'Geleneksel Tarifler' },
      gallery: { title: 'Galeri', subtitle: 'Mutfak mirasımıza görsel bir yolculuk' },
      visit: { title: 'Bizi Ziyaret Edin', subtitle: 'Şehrin kalbinde bizi bulun', hours: 'Saatler', contact: 'İletişim', address: 'Adres', phone: 'Telefon', whatsapp: 'WhatsApp', makeReservation: 'Rezervasyon Yap', whatsappUs: 'WhatsApp’tan Yazın' },
      footer: { description: 'Kürdistan’ın özgün lezzetlerini ve sıcak misafirperverliğini masanıza getiriyoruz.', quickLinks: 'Hızlı Bağlantılar', contactInfo: 'İletişim Bilgileri', openDaily: 'Her gün 11:00 Açık', poweredBy: 'Altyapı:', copyright: '© 2024 Nature Village Kürt Restoranı. Tüm hakları saklıdır.' },
      featured: { title: 'Öne Çıkan Yemekler', subtitle: 'En sevilen Kürt lezzetlerimizi keşfedin' }
    },
    ur: {
      nav: { home: 'ہوم', menu: 'مینیو', about: 'ہمارے بارے میں', gallery: 'گیلری', visit: 'ہم سے ملیں', reservations: 'بکنگ', catering: 'کیٹرنگ' },
      hero: { title: 'نیچر ولیج', subtitle: 'ہر نوالے میں کردستان کا ذائقہ', description: 'روایتی اور گرم ماحول میں خالص کرد ذائقوں کا تجربہ کریں جہاں ہر ڈش ہماری ثقافتی میراث کی کہانی سناتی ہے۔', cta1: 'مینیو دیکھیں', cta2: 'میز بُک کریں' },
      menu: { title: 'ہمارا مینیو', subtitle: 'MenuIQ کے ساتھ بہتر بنایا گیا', filters: { all: 'تمام آئٹمز', traditional: 'روایتی', vegan: 'ویگن و ویجیٹرین', popular: 'سب سے مقبول' }, viewFull: 'مکمل مینیو دیکھیں' },
      about: { title: 'ہماری کہانی', content: 'نیچر ولیج کا مقصد کردستان کے خالص ذائقے اور گرم میزبانی کو دنیا تک پہنچانا ہے۔', experience: 'سالہ تجربہ', recipes: 'روایتی تراکیب' },
      gallery: { title: 'گیلری', subtitle: 'ہماری کھانوں کی میراث کا بصری سفر' },
      visit: { title: 'ہم سے ملیں', subtitle: 'شہر کے مرکز میں ہمیں تلاش کریں', hours: 'اوقات', contact: 'رابطہ', address: 'پتہ', phone: 'فون', whatsapp: 'واٹس ایپ', makeReservation: 'میز بُک کریں', whatsappUs: 'واٹس ایپ پر رابطہ کریں' },
      footer: { description: 'ہم کردستان کے خالص ذائقے اور گرم میزبانی آپ کی میز تک لاتے ہیں۔', quickLinks: 'فوری روابط', contactInfo: 'رابطہ کی معلومات', openDaily: 'روزانہ 11:00 بجے سے کھلا', poweredBy: 'طاقت ور بنائے گئے', copyright: '© 2024 نیچر ولیج کرد ریستوراں۔ تمام حقوق محفوظ ہیں۔' },
      featured: { title: 'نمایاں ڈشز', subtitle: 'ہماری پسندیدہ کرد خاص ڈشز دریافت کریں' }
    },
    kmr: {
      nav: { home: 'Mal', menu: 'Menû', about: 'Derbarê Me', gallery: 'Galerî', visit: 'Me Sêr Bikin', reservations: 'Rezervasyon', catering: 'Catering' },
      hero: { title: 'Gundê Sînor (Nature Village)', subtitle: 'Sewiya Kurdistanê di her lokmeyê de', description: 'Di atmosferêk germ û kevnebûyî de xwendevan têkçûnên rastîn ên kurdî biceribînin; her xwarinek çîroka mirasa me ya çandî dibe.', cta1: 'Menû Bibîne', cta2: 'Maseyeke Rezerve Bike' },
      menu: { title: 'Menûya Me', subtitle: 'Bi MenuIQ hêzdar kirî', filters: { all: 'Hemû Hêmber', traditional: 'Kevnebûyî', vegan: 'Vegan û Wejetaryen', popular: 'Herî Bilind' }, viewFull: 'Hemû Menûyê Bibîne' },
      about: { title: 'Çîroka Me', content: 'Nature Village bi xuyakirina daxuyaniya têkçûnên rastîn ên Kurdistanê û mêvanperweriya germ ji bo cîhanê hatiye afirandin.', experience: 'Salên Tecrûbe', recipes: 'Recepeyên Kevnebûyî' },
      gallery: { title: 'Galerî', subtitle: 'Geroka dîtbarî di mirasê xwarinê de' },
      visit: { title: 'Me Sêr Bikin', subtitle: 'Em li navenda bajarê ne', hours: 'Demjimêr', contact: 'Têkiliye', address: 'Navnîşan', phone: 'Telefûn', whatsapp: 'WhatsApp', makeReservation: 'Rezerve Bike', whatsappUs: 'Li ser WhatsApp binivîse' },
      footer: { description: 'Em têkçûnên rastîn ên Kurdistanê û mêvanperweriyê li ser maseya we dihênin.', quickLinks: 'Girêdanên Lez', contactInfo: 'Agahiyên Têkiliyê', openDaily: 'Her roj di 11:00 ê nava rojan de vekirî ye', poweredBy: 'Bi hêza', copyright: '© 2024 Nature Village, Xwarinxaneyê Kurdî. Hemû maf parastî ye.' },
      featured: { title: 'Xwarinên Taybet', subtitle: 'Xasiyên me yên herî hez şûnde nas bikin' }
    }
  };

  const t = translations[language] || translations.en;
  const getText = (obj) => (obj && (obj[language] || obj.en)) || '';

  const scrollToSection = (sectionId) => {
    // Check if it's a page navigation
    if (sectionId === 'reservations') {
      router.push('/reservations');
      return;
    }
    if (sectionId === 'catering') {
      router.push('/catering');
      return;
    }
    if (sectionId === 'menu') {
      router.push({ pathname: '/menu', query: { lang: language } });
      return;
    }

    setCurrentSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredMenuItems = activeFilter === 'all' 
    ? menuItems 
    : activeFilter === 'popular' 
    ? menuItems.filter(item => item.popular)
    : menuItems.filter(item => item.category === activeFilter);

  const isRTL = languages[language].dir === 'rtl';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp" 
                alt="Nature Village Restaurant Logo" 
                className="w-12 h-12 mr-3 object-contain"
              />
              <div className="text-2xl font-serif font-bold text-amber-800">
                Nature Village
                <div className="text-xs text-amber-600 font-sans">Kurdish Restaurant</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {Object.entries(t.nav).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentSection === key
                        ? 'bg-amber-800 text-white'
                        : 'text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-transparent text-amber-800 hover:text-amber-600 font-medium text-sm border-none outline-none cursor-pointer pr-6"
                  style={{ direction: languages[language].dir }}
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <option key={code} value={code} className="bg-white text-amber-800">
                      {lang.name}
                    </option>
                  ))}
                </select>
                <Globe className="w-4 h-4 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none text-amber-800" />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-amber-800 hover:text-amber-600"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-amber-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {Object.entries(t.nav).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className="block px-3 py-2 text-base font-medium text-amber-800 hover:bg-amber-100 w-full text-left"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <KurdishPattern />
        </div>
        
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 69, 19, 0.4), rgba(139, 69, 19, 0.6)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop")'
          }}
        />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4" style={{ direction: languages[language].dir }}>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-shadow-lg text-center">
            {t.hero.title}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 text-amber-100 text-center">
            {t.hero.subtitle}
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-amber-50 text-center">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('menu')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              {t.hero.cta1}
            </button>
            <button 
              onClick={() => router.push('/reservations')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              {t.hero.cta2}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Dishes Preview */}
      <section className="py-20 bg-white" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-amber-800 mb-4">{t.featured.title}</h2>
            <p className="text-xl text-amber-600 max-w-2xl mx-auto">{t.featured.subtitle}</p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.filter(item => item.popular).slice(0, 3).map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105">
                <img 
                  src={item.image} 
                  alt={getText(item.name)}
                  className="w-full h-48 object-cover"
                />
                <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: languages[language].dir }}>
                  <h3 className="text-xl font-serif font-bold text-amber-800 mb-2">{getText(item.name)}</h3>
                  <p className="text-gray-700 mb-4">{getText(item.description)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-amber-800 mb-4">{t.menu.title}</h2>
            <p className="text-lg text-amber-600 mb-2">{t.menu.subtitle}</p>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          {/* Menu Filters (Only Most Popular on Homepage) */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'popular'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {t.menu.filters.popular}
            </button>
          </div>

          {/* View Full Menu Button */}
          <div className="text-center mb-12">
            <button 
              onClick={() => router.push({ pathname: '/menu', query: { lang: language } })}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              {t.menu.viewFull}
            </button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={getText(item.name)}
                    className="w-full h-48 object-cover"
                  />
                  {item.popular && (
                    <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {language === 'ar' ? 'شائع' : language === 'ku' ? 'ناوداری' : 'Popular'}
                    </div>
                  )}
                </div>
                <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: languages[language].dir }}>
                  <h3 className="text-xl font-serif font-bold text-amber-800 mb-1">{getText(item.name)}</h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{getText(item.description)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      {language === 'ar' ? 'أضف للسلة' : language === 'ku' ? 'بیخە سەپەت' : 'Add to Cart'}
                    </button>
                  </div>
                  <div className={`flex gap-1 mt-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    {item.tags.map((tag) => (
                      <span key={tag} className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={isRTL ? 'order-2' : 'order-1'}>
              <h2 className="text-4xl font-serif font-bold text-amber-800 mb-6">{t.about.title}</h2>
              <div className="w-24 h-1 bg-amber-600 mb-8"></div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {t.about.content}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600 mb-2">15+</div>
                  <div className="text-amber-800 font-medium">{t.about.experience}</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
                  <div className="text-amber-800 font-medium">{t.about.recipes}</div>
                </div>
              </div>
            </div>
            <div className={isRTL ? 'order-1' : 'order-2'}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
                  alt="Traditional Kurdish cooking"
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-amber-50 to-orange-100" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-amber-800 mb-4">{t.gallery.title}</h2>
            <p className="text-lg text-amber-600">{t.gallery.subtitle}</p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop'
            ].map((src, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all">
                <img 
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-4">
            {language === 'ar' ? 'جاهز للاستمتاع بتجربة طعام أصيلة؟' : 
             language === 'ku' ? 'ئامادەیت بۆ تامکردنی ئەزموونی خۆراکی ڕەسەن؟' : 
             'Ready to Experience Authentic Kurdish Flavors?'}
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            {language === 'ar' ? 'احجز طاولتك اليوم أو استفسر عن خدمات الطعام الخاصة بنا' : 
             language === 'ku' ? 'ئەمڕۆ جێگەکەت حیجاز بکە یان دەربارەی کاتەرینگەکانمان پرسیار بکە' : 
             'Book your table today or inquire about our catering services'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
            <button 
              onClick={() => router.push('/reservations')}
              className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {language === 'ar' ? 'احجز طاولة' : 
                 language === 'ku' ? 'جێگە حیجازکردن' : 
                 'Book a Table'}
              </span>
            </button>
            <button 
              onClick={() => router.push('/catering')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>
                {language === 'ar' ? 'خدمات الطعام' : 
                 language === 'ku' ? 'کاتەرینگ' : 
                 'Catering Services'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section id="visit" className="py-20 bg-white" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-amber-800 mb-4">{t.visit.title}</h2>
            <p className="text-lg text-amber-600">{t.visit.subtitle}</p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className={isRTL ? 'order-2' : 'order-1'}>
              <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === 'ar' ? 'تكامل الخريطة التفاعلية' : 
                     language === 'ku' ? 'نەخشەی کارلێکەری تێکەڵکردن' : 
                     'Interactive Map Integration'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {language === 'ar' ? 'عنصر نائب لخرائط جوجل' : 
                     language === 'ku' ? 'جێگرەوەی نەخشەی گووگڵ' : 
                     'Google Maps Embed Placeholder'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className={`space-y-8 ${isRTL ? 'order-1' : 'order-2'}`}>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl">
                <h3 className="text-2xl font-serif font-bold text-amber-800 mb-6">{t.visit.contact}</h3>
                <div className="space-y-4">
                  <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <MapPin className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-800">{t.visit.address}</p>
                      <p className="text-gray-700">123 Kurdistan Street, City Center, State 12345</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Phone className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-800">{t.visit.phone}</p>
                      <p className="text-gray-700">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <MessageCircle className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-800">{t.visit.whatsapp}</p>
                      <p className="text-gray-700">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl">
                <h3 className="text-2xl font-serif font-bold text-amber-800 mb-6">{t.visit.hours}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">
                      {language === 'ar' ? 'الإثنين - الخميس' : 
                       language === 'ku' ? 'دووشەممە - پێنجشەممە' : 
                       'Monday - Thursday'}
                    </span>
                    <span className="text-gray-700">11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">
                      {language === 'ar' ? 'الجمعة - السبت' : 
                       language === 'ku' ? 'هەینی - شەممە' : 
                       'Friday - Saturday'}
                    </span>
                    <span className="text-gray-700">11:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-medium">
                      {language === 'ar' ? 'الأحد' : 
                       language === 'ku' ? 'یەکشەممە' : 
                       'Sunday'}
                    </span>
                    <span className="text-gray-700">12:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    window.open('https://wa.me/15551234567', '_blank');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.visit.whatsappUs}</span>
                </button>
                <button 
                  onClick={() => router.push('/reservations')}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
                >
                  {t.visit.makeReservation}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12" style={{ direction: languages[language].dir }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img 
                  src="https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp" 
                  alt="Nature Village Logo" 
                  className={`w-12 h-12 object-contain ${isRTL ? 'ml-3' : 'mr-3'}`}
                />
                <h3 className="text-2xl font-serif font-bold">Nature Village</h3>
              </div>
              <p className="text-amber-200 mb-6 leading-relaxed">
                {t.footer.description}
              </p>
              <div className={`flex space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <button className="text-amber-200 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </button>
                <button className="text-amber-200 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </button>
                <button className="text-amber-200 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
              <div className="space-y-2">
                {Object.entries(t.nav).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key)}
                    className="block text-amber-200 hover:text-white transition-colors"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.contactInfo}</h4>
              <div className="space-y-2 text-amber-200">
                <p className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <MapPin className="w-4 h-4" />
                  <span>123 Kurdistan Street</span>
                </p>
                <p className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </p>
                <p className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Clock className="w-4 h-4" />
                  <span>{t.footer.openDaily}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-amber-200 text-sm">
              {t.footer.copyright}
            </div>
            <div className={`flex items-center space-x-4 mt-4 md:mt-0 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-transparent text-amber-200 hover:text-white font-medium text-sm border-none outline-none cursor-pointer pr-6"
                  style={{ direction: languages[language].dir }}
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <option key={code} value={code} className="bg-amber-900 text-amber-200">
                      {lang.name}
                    </option>
                  ))}
                </select>
                <Globe className="w-4 h-4 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none text-amber-200" />
              </div>
              <div className="text-amber-200 text-sm">
                {t.footer.poweredBy} <span className="font-semibold text-white">Blunari</span> & MenuIQ
              </div>
              {/* Admin Link - Hidden */}
              <button 
                onClick={() => router.push('/admin')}
                className="text-amber-800 hover:text-amber-600 text-xs opacity-50 hover:opacity-100 transition-opacity"
                title="Admin Access"
              >
                •
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* WhatsApp Button */}
        <button 
          onClick={() => {
            window.open('https://wa.me/15551234567', '_blank');
          }}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
          title="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        
        {/* Reservations Button */}
        <button 
          onClick={() => router.push('/reservations')}
          className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
          title="Make Reservation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        {/* Catering Button */}
        <button 
          onClick={() => router.push('/catering')}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
          title="Catering Services"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NatureVillageWebsite;