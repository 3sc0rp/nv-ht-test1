import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Menu, X, MapPin, Phone, Clock, Star, Filter, Globe, Facebook, Instagram, Twitter, MessageCircle, ChefHat, Users, Calendar, Award, ChevronRight, Home, Utensils, Info, Camera, ExternalLink, Share2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';

const NatureVillageWebsite = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [activeFilter, setActiveFilter] = useState('popular');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const router = useRouter();

  // Language options with proper Unicode characters
  const languages = {
    en: { name: 'English', code: 'en', dir: 'ltr', flag: '🇺🇸' },
    ku: { name: 'کوردی', code: 'ku', dir: 'rtl', flag: 'ku' },
    ar: { name: 'العربية', code: 'ar', dir: 'rtl', flag: '🇸🇦' },
    fa: { name: 'فارسی', code: 'fa', dir: 'rtl', flag: '🇮🇷' },
    tr: { name: 'Türkçe', code: 'tr', dir: 'ltr', flag: '🇹🇷' },
    ur: { name: 'اردو', code: 'ur', dir: 'rtl', flag: '🇵🇰' },
    kmr: { name: 'Kurdî (Kurmanî)', code: 'kmr', dir: 'ltr', flag: 'ku' }
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle component mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
      if (showOrderModal && !event.target.closest('.order-modal')) {
        setShowOrderModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown, showOrderModal]);

  // Sync language with query param and handle document attributes safely
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const qpLang = typeof router.query.lang === 'string' ? router.query.lang : undefined;
      if (qpLang && languages[qpLang]) {
        setLanguage(qpLang);
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', languages[qpLang].dir);
          document.documentElement.lang = qpLang;
          document.body.style.fontFamily = languages[qpLang].dir === 'rtl' ? 
            '"Noto Sans Arabic", "Noto Sans", system-ui, -apple-system, sans-serif' : 
            '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif';
        }
      } else {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', languages[language].dir);
          document.documentElement.lang = language;
        }
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }, [router.query.lang, language, isMounted]);

  const handleLanguageChange = useCallback((next) => {
    try {
      if (!languages[next]) return;
      
      setLanguage(next);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', languages[next].dir);
        document.documentElement.lang = next;
        document.body.style.fontFamily = languages[next].dir === 'rtl' ? 
          '"Noto Sans Arabic", "Noto Sans", system-ui, -apple-system, sans-serif' : 
          '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif';
      }
      const url = { pathname: router.pathname, query: { ...router.query, lang: next } };
      router.replace(url, undefined, { shallow: true });
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [router]);

  // Kurdish pattern SVG for decorative elements
  const KurdishPattern = () => (
    <svg className="absolute opacity-5 w-full h-full" viewBox="0 0 400 400">
      <defs>
        <pattern id="kurdishPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#8B4513"/>
          <polygon points="25,5 45,25 25,45 5,25" fill="#D2B48C"/>
          <circle cx="25" cy="25" r="8" fill="#6B8E23"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#kurdishPattern)"/>
    </svg>
  );

  // Enhanced menu data with complete multilingual support
  const menuItems = [
    {
      id: 1,
      name: {
        en: 'Kebab-e Kubideh',
        ku: 'کەباب کوبیده',
        ar: 'كباب كوبیده',
        fa: 'کباب کوبیده',
        tr: 'Kebap Kubide',
        ur: 'کباب کوبیده',
        kmr: 'Kebab Kubîde'
      },
      description: {
        en: 'Traditional ground lamb kebab with aromatic spices, served with basmati rice and grilled tomatoes',
        ku: 'کەبابی نەریتی لە گۆشتی بەرخی هاڕاو لەگەڵ بۆنوبێرینی جۆراوجۆر، لەگەڵ برنجی باسماتی و تەماتەی برژاو',
        ar: 'كباب لحم الخروف المفروم التقليدي مع التوابل العطرة، يُقدم مع أرز البسمتي والطماطم المشوية',
        fa: 'کباب کوبیده سنتی از گوشت بره چرخ‌کرده با ادویه‌جات معطر، همراه با برنج باسماتی و گوجه کبابی',
        tr: 'Aromatik baharatlarla hazırlanmış geleneksel kıyma kebabı, basmati pilav ve ızgara domates ile servis edilir',
        ur: 'روایتی بھیڑ کے قیمے کا کباب خوشبودار مصالحوں کے ساتھ، باسمتی چاول اور گرل شدہ ٹماٹر کے ساتھ',
        kmr: 'Kebaba kevneşopî ya goştê berxê hêşkirî bi baharatên bêhnxweş, bi brincê basmati û firangoşên şewitî tê pêşkêşkirin'
      },
      price: '$18.99',
      category: 'traditional',
      popular: true,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop',
      tags: ['spicy', 'grilled']
    },
    {
      id: 2,
      name: {
        en: 'Dolma',
        ku: 'دۆڵمە',
        ar: 'دولمة',
        fa: 'دولمه',
        tr: 'Dolma',
        ur: 'دولمہ',
        kmr: 'Dolme'
      },
      description: {
        en: 'Grape leaves stuffed with rice, herbs, and spices - a Kurdish family recipe passed down for generations',
        ku: 'گەڵای مێو پڕکراو لە برنج و ڕووەک و بۆنوبێرین - ڕێسەتی خێزانی کوردی لە نەوەوە بۆ نەوە',
        ar: 'أوراق العنب محشوة بالأرز والأعشاب والتوابل - وصفة عائلية كردية تتوارث عبر الأجيال',
        fa: 'برگ انگور پر شده با برنج، سبزیجات و ادویه‌جات - دستور پخت خانوادگی کردی از نسل به نسل',
        tr: 'Pirinç, otlar ve baharatlarla doldurulmuş asma yaprağı - Nesilden nesile aktarılan Kürt aile tarifi',
        ur: 'انگور کے پتے چاول، جڑی بوٹیوں اور مصالحوں سے بھرے ہوئے - نسل در نسل کرد خاندانی نسخہ',
        kmr: 'Pelên mîyê dagirî bi brinc, riwekên taze û baharan - rûpela malbata Kurdî ya ji nifş bo nifş derbas dibe'
      },
      price: '$14.99',
      category: 'vegetarian',
      popular: false,
      image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&h=400&fit=crop',
      tags: ['vegetarian', 'traditional']
    },
    {
      id: 3,
      name: {
        en: 'Yaprakh',
        ku: 'یاپراخ',
        ar: 'یبرق',
        fa: 'یپرق',
        tr: 'Yaprak',
        ur: 'یپرق',
        kmr: 'Yaprax'
      },
      description: {
        en: 'Tender cabbage rolls filled with seasoned rice, meat, and Kurdish spices simmered in rich tomato sauce',
        ku: 'لەتی کەلەرمی نەرم پڕکراو لە برنج و گۆشت و بۆنوبێرینی کوردی لە سۆسی تەماتەی دەوڵەمەند',
        ar: 'لفائف الملفوف الطرية محشوة بالأرز المتبل واللحم والتوابل الكردية في صلصة الطماطم الغنية',
        fa: 'کلم پیچ نرم پر شده با برنج ادویه دار، گوشت و ادویه‌جات کردی در سس گوجه‌فرنگی غنی',
        tr: 'Baharatli pirinç, et ve Kürt baharatları ile doldurulmuş yumuşak lahana sarması, zengin domates sosunda',
        ur: 'نرم بند گوبھی کے رولز مصالحہ دار چاول، گوشت اور کرد مصالحوں سے بھرے، بھرپور ٹماٹر کی چٹنی میں',
        kmr: 'Pelên kelemê ya nerm dagirî bi brincê baharatî, goşt û baharatên Kurdî di soşa firangoşê ya dewlemend de'
      },
      price: '$16.99',
      category: 'traditional',
      popular: true,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop',
      tags: ['comfort food', 'traditional']
    },
    {
      id: 4,
      name: {
        en: 'Ash-e Reshteh',
        ku: 'ئاشی ڕەشتە',
        ar: 'آش رشته',
        fa: 'آش رشته',
        tr: 'Aş-i Reşte',
        ur: 'آش رشتہ',
        kmr: 'Aşê Reştê'
      },
      description: {
        en: 'Hearty Kurdish noodle soup with beans, fresh herbs, and creamy yogurt - perfect comfort food',
        ku: 'شۆربای ڕەشتەی کوردی مەزن لەگەڵ لۆبیا و ڕووەکی تازە و ماستی کرێمی - خۆراکی ئاسووەیی تەواو',
        ar: 'حساء الشعيرية الكردي المغذي مع الفاصولياء والأعشاب الطازجة واللبن الكريمي - طعام مريح مثالي',
        fa: 'سوپ رشته کردی مقوی با لوبیا، سبزیجات تازه و ماست کرمی - غذای راحتی عالی',
        tr: 'Fasulye, taze otlar ve kremalı yoğurt ile doyurucu Kürt şehriye çorbası - mükemmel rahatlık yemeği',
        ur: 'دالوں، تازہ جڑی بوٹیوں اور کریمی دہی کے ساتھ بھرپور کرد نوڈل سوپ - بہترین آرام دہ کھانا',
        kmr: 'Şorbaya reşteyê ya Kurdî ya mijûl bi fasûlyan, riwekên taze û mastê krêmî - xwarinê aram û tewaw'
      },
      price: '$12.99',
      category: 'soup',
      popular: false,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop',
      tags: ['soup', 'comfort food', 'vegetarian']
    },
    {
      id: 5,
      name: {
        en: 'Khorak-e Bademjan',
        ku: 'خۆراکی بادەمجان',
        ar: 'خوراك الباذنجان',
        fa: 'خوراک بادمجان',
        tr: 'Patlıcan Yemeği',
        ur: 'بینگن کا کھانا',
        kmr: 'Xwareka Bacanê'
      },
      description: {
        en: 'Slow-cooked eggplant stew with tomatoes, onions, and aromatic Kurdish herbs in olive oil',
        ku: 'خۆراکی بادەمجانی هێواش لێنراو لەگەڵ تەماتە و پیاز و ڕووەکی بۆندار کوردی لە زەیتی زەیتوون',
        ar: 'يخنة الباذنجان المطبوخة ببطء مع الطماطم والبصل والأعشاب الكردية العطرة في زيت الزيتون',
        fa: 'خوراک بادمجان آهسته پز با گوجه‌فرنگی، پیاز و سبزیجات معطر کردی در روغن زیتون',
        tr: 'Domates, soğan ve aromatik Kürt otları ile zeytinyağında yavaş pişirilmiş patlıcan yemeği',
        ur: 'ٹماٹر، پیاز اور خوشبودار کرد جڑی بوٹیوں کے ساتھ زیتون کے تیل میں آہستہ پکایا گیا بینگن کا سالن',
        kmr: 'Xwareka bacanê ya hêdî pijandin bi firangoş, pîvaz û riwekên bêhnxweş ên Kurdî di zeyta zeytûnê de'
      },
      price: '$15.99',
      category: 'vegan',
      popular: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      tags: ['vegan', 'stew', 'traditional']
    },
    {
      id: 6,
      name: {
        en: 'Baklava Kurdistan',
        ku: 'بەقڵاوای کوردستان',
        ar: 'بقلاوة كردستان',
        fa: 'باقلوای کردستان',
        tr: 'Kürdistan Baklavası',
        ur: 'کردستان بقلاوہ',
        kmr: 'Baklawaya Kurdistanê'
      },
      description: {
        en: 'Traditional Kurdish baklava with pistachios, walnuts, and rose water, layered in delicate phyllo pastry',
        ku: 'بەقڵاوای نەریتی کوردی لەگەڵ فستق و گوێز و ئاوی گوڵ، لە تەباقی نازکی فیلۆ',
        ar: 'بقلاوة كردية تقليدية بالفستق والجوز وماء الورد، مطبقة في عجين الفيلو الرقيق',
        fa: 'باقلوای سنتی کردی با پسته، گردو و گلاب، لایه‌بندی شده در خمیر نازک فیلو',
        tr: 'Fıstık, ceviz ve gül suyu ile geleneksel Kürt baklavası, ince yufka katmanlarında',
        ur: 'پستے، اخروٹ اور گلاب کے پانی کے ساتھ روایتی کرد بقلاوہ، نازک فلو پیسٹری میں تہہ دار',
        kmr: 'Baklawaya kevneşopî ya Kurdî bi fistiq, gûz û ava gulê, di qatên nazik ên fîloyê de'
      },
      price: '$8.99',
      category: 'dessert',
      popular: true,
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=400&fit=crop',
      tags: ['sweet', 'traditional']
    }
  ];

  // Complete translations object with comprehensive coverage
  const translations = {
    en: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        about: 'About Us',
        gallery: 'Gallery',
        visit: 'Visit Us',
        reservations: 'Reservations',
        catering: 'Catering',
        orderOnline: 'Order'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'A Taste of Kurdistan in Every Bite',
        description: 'Experience authentic Kurdish flavors in a warm, traditional setting where every dish tells a story of our rich cultural heritage and culinary traditions passed down through generations.',
        cta1: 'View Menu',
        cta2: 'Make Reservation'
      },
      menu: {
        title: 'Our Menu',
        subtitle: 'Powered by MenuIQ - AI-Enhanced Dining Experience',
        filters: {
          all: 'All Items',
          traditional: 'Traditional',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan',
          soup: 'Soups',
          dessert: 'Desserts',
          popular: 'Most Popular'
        },
        viewFull: 'View Full Menu',
        noItems: 'No items found in this category.'
      },
      about: {
        title: 'Our Story',
        content: 'Nature Village was born from a dream to share the authentic flavors and warm hospitality of Kurdistan with the world. Our family recipes have been passed down through generations, each dish crafted with love and respect for our cultural traditions. We source the finest ingredients and prepare every meal with the same care and attention that has defined Kurdish hospitality for centuries.',
        experience: 'Years Experience',
        recipes: 'Traditional Recipes',
        customers: 'Happy Customers',
        awards: 'Awards Won'
      },
      gallery: {
        title: 'Gallery',
        subtitle: 'A visual journey through our culinary heritage and restaurant atmosphere'
      },
      visit: {
        title: 'Visit Us',
        subtitle: 'Find us in the heart of the city',
        hours: 'Opening Hours',
        contact: 'Contact Information',
        address: 'Address',
        phone: 'Phone',
        whatsapp: 'WhatsApp',
        makeReservation: 'Make Reservation',
        whatsappUs: 'WhatsApp Us',
        getDirections: 'Get Directions'
      },
      footer: {
        description: 'Bringing the authentic flavors and warm hospitality of Kurdistan to your table. Every dish is a celebration of our rich cultural heritage and culinary excellence.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        followUs: 'Follow Us',
        openDaily: 'Open Daily 11:00 AM - 11:00 PM',
        poweredBy: 'Powered by',
        blunari: 'Blunari AI',
        copyright: `© ${new Date().getFullYear()} Nature Village Kurdish Restaurant. All rights reserved.`,
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      featured: {
        title: 'Featured Dishes',
        subtitle: 'Discover our most beloved Kurdish specialties, crafted with traditional recipes and modern presentation'
      },
      tags: {
        vegetarian: '🌱 Vegetarian',
        vegan: '🌿 Vegan',
        spicy: '🌶️ Spicy',
        sweet: '🍯 Sweet',
        traditional: '🏛️ Traditional',
        grilled: '🔥 Grilled',
        'comfort food': '🍲 Comfort Food',
        soup: '🍜 Soup',
        stew: '🥘 Stew'
      },
      addToCart: 'Add to Cart',
      loading: 'Loading...',
      error: 'Something went wrong. Please try again.',
      currency: '$'
    },
    ku: {
      nav: {
        home: 'ماڵەوە',
        menu: 'خۆراک',
        about: 'دەربارەمان',
        gallery: 'وێنەکان',
        visit: 'سەردانمان بکەن',
        reservations: 'جێگە حیجازکردن',
        catering: 'کاتەرینگ',
        orderOnline: 'داواکاری'
      },
      hero: {
        title: 'گوندی سروشت',
        subtitle: 'تامی کوردستان لە هەر پارووەکدا',
        description: 'تامی ڕەسەنی کوردی بچێژن لە ژینگەیەکی گەرم و نەریتیدا کە هەر خۆراکێک چیرۆکی دەوڵەمەندی کولتووری میراتمان و نەریتە چێشتلێنانەکانمان دەگێڕێتەوە کە لە نەوەوە بۆ نەوە دەردەچن.',
        cta1: 'بینینی خۆراک',
        cta2: 'جێگە حیجازکردن'
      },
      menu: {
        title: 'خۆراکەکانمان',
        subtitle: 'بە MenuIQ هێزدراو - ئەزموونی خۆراک لەگەڵ زیرەکی دەستکرد',
        filters: {
          all: 'هەموو ئایتەمەکان',
          traditional: 'نەریتی',
          vegetarian: 'ڕووەکی',
          vegan: 'ڤێگان',
          soup: 'شۆربە',
          dessert: 'شیرینی',
          popular: 'بەناوبانگترین'
        },
        viewFull: 'بینینی هەموو خۆراکەکان',
        noItems: 'هیچ ئایتەمێک لەم بەشەدا نەدۆزرایەوە.'
      },
      about: {
        title: 'چیرۆکەکەمان',
        content: 'گوندی سروشت لە خەونێکەوە لەدایک بووە بۆ هاوبەشکردنی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان لەگەڵ جیهان. ڕێسەتە خێزانییەکانمان لە نەوەوە بۆ نەوە دەردەچن، هەر خۆراکێک بە خۆشەویستی و ڕێزگرتن لە نەریتە کولتوورییەکانمان دروست دەکرێت.',
        experience: 'ساڵ ئەزموون',
        recipes: 'ڕێسەتی نەریتی',
        customers: 'کڕیاری دڵخۆش',
        awards: 'خەڵاتی بەدەستهێنراو'
      },
      gallery: {
        title: 'گالەری',
        subtitle: 'گەشتێکی بیناییی بە میراتی چێشتلێنانمان و کەشی چێشتخانەکەمان'
      },
      visit: {
        title: 'سەردانمان بکەن',
        subtitle: 'لە دڵی شارەکە بمانبینەوە',
        hours: 'کاتەکانی کردنەوە',
        contact: 'زانیاری پەیوەندی',
        address: 'ناونیشان',
        phone: 'تەلەفۆن',
        whatsapp: 'واتساپ',
        makeReservation: 'جێگە حیجازکردن',
        whatsappUs: 'واتساپمان بکە',
        getDirections: 'ڕێنمایی وەربگرە'
      },
      footer: {
        description: 'هێنانی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان بۆ مێزەکەتان. هەر خۆراکێک ئاهەنگێکە بۆ میراتی دەوڵەمەند و باشی چێشتلێنانمان.',
        quickLinks: 'لینکە خێراکان',
        contactInfo: 'زانیاری پەیوەندی',
        followUs: 'شوێنمان بکەون',
        openDaily: 'ڕۆژانە کراوەیە ١١:٠٠ی بەیانی - ١١:٠٠ی شەو',
        poweredBy: 'هێزی لەلایەن',
        blunari: 'بلوناری AI',
        copyright: `© ${new Date().getFullYear()} گوندی سروشت چێشتخانەی کوردی. هەموو مافەکان پارێزراون.`,
        privacy: 'سیاسەتی تایبەتی',
        terms: 'مەرجەکانی خزمەتگوزاری'
      },
      featured: {
        title: 'خۆراکی نمایشکراو',
        subtitle: 'خۆراکە خۆشەویستەکانی کوردی بناسە کە بە ڕێسەتی نەریتی و پێشکەشکردنی نوێ دروست کراون'
      },
      tags: {
        vegetarian: '🌱 ڕووەکی',
        vegan: '🌿 ڤێگان',
        spicy: '🌶️ تیژ',
        sweet: '🍯 شیرین',
        traditional: '🏛️ نەریتی',
        grilled: '🔥 برژاو',
        'comfort food': '🍲 خۆراکی ئاسووەیی',
        soup: '🍜 شۆربە',
        stew: '🥘 خۆراک'
      },
      addToCart: 'بیخە سەپەت',
      loading: 'بارکردن...',
      error: 'هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەوە.',
      currency: '$'
    },
    ar: {
      nav: {
        home: 'الرئيسية',
        menu: 'القائمة',
        about: 'من نحن',
        gallery: 'المعرض',
        visit: 'زورونا',
        reservations: 'الحجوزات',
        catering: 'خدمات الطعام',
        orderOnline: 'اطلب'
      },
      hero: {
        title: 'قرية الطبيعة',
        subtitle: 'طعم كردستان في كل قضمة',
        description: 'اختبر النكهات الكردية الأصيلة في جو دافئ وتقليدي حيث يحكي كل طبق قصة من تراثنا الثقافي الغني وتقاليدنا الطهوية التي تنتقل عبر الأجيال.',
        cta1: 'عرض القائمة',
        cta2: 'حجز طاولة'
      },
      menu: {
        title: 'قائمتنا',
        subtitle: 'مدعوم بـ MenuIQ - تجربة طعام محسّنة بالذكاء الاصطناعي',
        filters: {
          all: 'جميع الأطباق',
          traditional: 'تقليدي',
          vegetarian: 'نباتي',
          vegan: 'نباتي صرف',
          soup: 'الشوربات',
          dessert: 'الحلويات',
          popular: 'الأكثر شهرة'
        },
        viewFull: 'عرض القائمة الكاملة',
        noItems: 'لم يتم العثور على عناصر في هذه الفئة.'
      },
      about: {
        title: 'قصتنا',
        content: 'ولدت قرية الطبيعة من حلم مشاركة النكهات الأصيلة والضيافة الدافئة لكردستان مع العالم. وصفات عائلتنا تتوارث عبر الأجيال، كل طبق يُحضر بحب واحترام لتقاليدنا الثقافية.',
        experience: 'سنوات خبرة',
        recipes: 'وصفات تقليدية',
        customers: 'عملاء سعداء',
        awards: 'جوائز حاصلة عليها'
      },
      gallery: {
        title: 'المعرض',
        subtitle: 'رحلة بصرية عبر تراثنا الطهوي وأجواء مطعمنا'
      },
      visit: {
        title: 'زورونا',
        subtitle: 'اعثر علينا في قلب المدينة',
        hours: 'ساعات العمل',
        contact: 'معلومات الاتصال',
        address: 'العنوان',
        phone: 'الهاتف',
        whatsapp: 'واتساب',
        makeReservation: 'احجز طاولة',
        whatsappUs: 'راسلنا على واتساب',
        getDirections: 'احصل على الاتجاهات'
      },
      footer: {
        description: 'نجلب النكهات الأصيلة والضيافة الدافئة من كردستان إلى طاولتك. كل طبق احتفال بتراثنا الثقافي الغني وتميزنا الطهوي.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        followUs: 'تابعونا',
        openDaily: 'مفتوح يومياً ١١:٠٠ ص - ١١:٠٠ م',
        poweredBy: 'مدعوم من',
        blunari: 'بلوناري AI',
        copyright: `© ${new Date().getFullYear()} قرية الطبيعة مطعم كردي. جميع الحقوق محفوظة.`,
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة'
      },
      featured: {
        title: 'الأطباق المميزة',
        subtitle: 'اكتشف أحب الأطباق الكردية لدينا، المحضرة بوصفات تقليدية وعرض عصري'
      },
      tags: {
        vegetarian: '🌱 نباتي',
        vegan: '🌿 نباتي صرف',
        spicy: '🌶️ حار',
        sweet: '🍯 حلو',
        traditional: '🏛️ تقليدي',
        grilled: '🔥 مشوي',
        'comfort food': '🍲 طعام مريح',
        soup: '🍜 شوربة',
        stew: '🥘 يخنة'
      },
      addToCart: 'أضف للسلة',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
      currency: '$'
    },
    fa: {
      nav: {
        home: 'خانه',
        menu: 'منو',
        about: 'درباره ما',
        gallery: 'گالری',
        visit: 'بازدید از ما',
        reservations: 'رزرو',
        catering: 'کیترینگ',
        orderOnline: 'سفارش'
      },
      hero: {
        title: 'دهکده طبیعت',
        subtitle: 'طعم کردستان در هر لقمه',
        description: 'طعم‌های اصیل کردی را در محیطی گرم و سنتی تجربه کنید که هر غذا داستانی از میراث فرهنگی غنی و سنت‌های آشپزی ما می‌گوید.',
        cta1: 'مشاهده منو',
        cta2: 'رزرو میز'
      },
      menu: {
        title: 'منوی ما',
        subtitle: 'قدرت گرفته از MenuIQ - تجربه غذایی بهبود یافته با هوش مصنوعی',
        filters: {
          all: 'همه آیتم‌ها',
          traditional: 'سنتی',
          vegetarian: 'گیاهی',
          vegan: 'وگان',
          soup: 'سوپ‌ها',
          dessert: 'دسرها',
          popular: 'محبوب‌ترین'
        },
        viewFull: 'مشاهده منوی کامل',
        noItems: 'هیچ آیتمی در این دسته یافت نشد.'
      },
      about: {
        title: 'داستان ما',
        content: 'دهکده طبیعت از رویای به اشتراک گذاشتن طعم‌های اصیل و مهمان‌نوازی گرم کردستان با جهان متولد شد.',
        experience: 'سال تجربه',
        recipes: 'دستور پخت سنتی',
        customers: 'مشتری راضی',
        awards: 'جایزه کسب شده'
      },
      gallery: {
        title: 'گالری',
        subtitle: 'سفری بصری از میراث آشپزی و فضای رستوران ما'
      },
      visit: {
        title: 'بازدید از ما',
        subtitle: 'ما را در قلب شهر پیدا کنید',
        hours: 'ساعات کاری',
        contact: 'اطلاعات تماس',
        address: 'آدرس',
        phone: 'تلفن',
        whatsapp: 'واتساپ',
        makeReservation: 'رزرو میز',
        whatsappUs: 'واتساپ کنید',
        getDirections: 'مسیریابی'
      },
      footer: {
        description: 'طعم‌های اصیل و مهمان‌نوازی گرم کردستان را به میز شما می‌آوریم.',
        quickLinks: 'لینک‌های سریع',
        contactInfo: 'اطلاعات تماس',
        followUs: 'ما را دنبال کنید',
        openDaily: 'روزانه باز ۱۱:۰۰ صبح - ۱۱:۰۰ شب',
        poweredBy: 'قدرت گرفته از',
        blunari: 'بلوناری AI',
        copyright: `© ${new Date().getFullYear()} دهکده طبیعت رستوران کردی. تمام حقوق محفوظ است.`,
        privacy: 'سیاست حفظ حریم خصوصی',
        terms: 'شرایط خدمات'
      },
      featured: {
        title: 'غذاهای ویژه',
        subtitle: 'محبوب‌ترین غذاهای کردی ما را کشف کنید'
      },
      tags: {
        vegetarian: '🌱 گیاهی',
        vegan: '🌿 وگان',
        spicy: '🌶️ تند',
        sweet: '🍯 شیرین',
        traditional: '🏛️ سنتی',
        grilled: '🔥 کبابی',
        'comfort food': '🍲 غذای راحتی',
        soup: '🍜 سوپ',
        stew: '🥘 خورش'
      },
      addToCart: 'اضافه به سبد',
      loading: 'در حال بارگذاری...',
      error: 'خطایی رخ داد. لطفا دوباره تلاش کنید.',
      currency: '$'
    },
    tr: {
      nav: {
        home: 'Ana Sayfa',
        menu: 'Menü',
        about: 'Hakkımızda',
        gallery: 'Galeri',
        visit: 'Bizi Ziyaret Edin',
        reservations: 'Rezervasyon',
        catering: 'Catering',
        orderOnline: 'Sipariş'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'Her Lokmada Kürdistan Tadı',
        description: 'Otantik Kürt lezzetlerini sıcak, geleneksel bir ortamda deneyimleyin.',
        cta1: 'Menüyü Görüntüle',
        cta2: 'Rezervasyon Yap'
      },
      menu: {
        title: 'Menümüz',
        subtitle: 'MenuIQ tarafından desteklenir - AI Geliştirilmiş Yemek Deneyimi',
        filters: {
          all: 'Tüm Ürünler',
          traditional: 'Geleneksel',
          vegetarian: 'Vejetaryen',
          vegan: 'Vegan',
          soup: 'Çorbalar',
          dessert: 'Tatlılar',
          popular: 'En Popüler'
        },
        viewFull: 'Tam Menüyü Görüntüle',
        noItems: 'Bu kategoride ürün bulunamadı.'
      },
      about: {
        title: 'Hikayemiz',
        content: 'Nature Village, Kürdistan\'ın otantik lezzetlerini ve sıcak misafirperverliğini dünyayla paylaşma hayalinden doğdu.',
        experience: 'Yıl Deneyim',
        recipes: 'Geleneksel Tarif',
        customers: 'Mutlu Müşteri',
        awards: 'Kazanılan Ödül'
      },
      gallery: {
        title: 'Galeri',
        subtitle: 'Mutfak mirasımız ve restoran atmosferimizden görsel bir yolculuk'
      },
      visit: {
        title: 'Bizi Ziyaret Edin',
        subtitle: 'Şehrin kalbinde bizi bulun',
        hours: 'Açılış Saatleri',
        contact: 'İletişim Bilgileri',
        address: 'Adres',
        phone: 'Telefon',
        whatsapp: 'WhatsApp',
        makeReservation: 'Rezervasyon Yap',
        whatsappUs: 'WhatsApp ile Ulaşın',
        getDirections: 'Yol Tarifi Al'
      },
      footer: {
        description: 'Kürdistan\'ın otantik lezzetlerini ve sıcak misafirperverliğini masanıza getiriyoruz.',
        quickLinks: 'Hızlı Bağlantılar',
        contactInfo: 'İletişim Bilgileri',
        followUs: 'Bizi Takip Edin',
        openDaily: 'Her Gün Açık 11:00 - 23:00',
        poweredBy: 'Destekleyen',
        blunari: 'Blunari AI',
        copyright: `© ${new Date().getFullYear()} Nature Village Kürt Restoranı. Tüm hakları saklıdır.`,
        privacy: 'Gizlilik Politikası',
        terms: 'Hizmet Şartları'
      },
      featured: {
        title: 'Öne Çıkan Yemekler',
        subtitle: 'En sevilen Kürt lezzetlerimizi keşfedin'
      },
      tags: {
        vegetarian: '🌱 Vejetaryen',
        vegan: '🌿 Vegan',
        spicy: '🌶️ Acılı',
        sweet: '🍯 Tatlı',
        traditional: '🏛️ Geleneksel',
        grilled: '🔥 Izgara',
        'comfort food': '🍲 Ev Yemeği',
        soup: '🍜 Çorba',
        stew: '🥘 Güveç'
      },
      addToCart: 'Sepete Ekle',
      loading: 'Yükleniyor...',
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      currency: '$'
    },
    ur: {
      nav: {
        home: 'ہوم',
        menu: 'مینو',
        about: 'ہمارے بارے میں',
        gallery: 'گیلری',
        visit: 'ہمیں ملیں',
        reservations: 'بکنگ',
        catering: 'کیٹرنگ',
        orderOnline: 'آرڈر'
      },
      hero: {
        title: 'نیچر ولیج',
        subtitle: 'ہر لقمے میں کردستان کا ذائقہ',
        description: 'روایتی ماحول میں اصل کرد کھانوں کا تجربہ کریں۔',
        cta1: 'مینو دیکھیں',
        cta2: 'بکنگ کریں'
      },
      menu: {
        title: 'ہمارا مینو',
        subtitle: 'MenuIQ کی طاقت سے - AI بہتر کھانے کا تجربہ',
        filters: {
          all: 'تمام اشیاء',
          traditional: 'روایتی',
          vegetarian: 'سبزی خور',
          vegan: 'ویگن',
          soup: 'سوپ',
          dessert: 'میٹھائی',
          popular: 'مشہور ترین'
        },
        viewFull: 'مکمل مینو دیکھیں',
        noItems: 'اس کیٹگری میں کوئی آئٹم نہیں ملا۔'
      },
      about: {
        title: 'ہماری کہانی',
        content: 'نیچر ولیج کردستان کے اصل ذائقوں کو دنیا کے ساتھ بانٹنے کے خواب سے پیدا ہوا۔',
        experience: 'سال تجربہ',
        recipes: 'روایتی ترکیبیں',
        customers: 'خوش گاہک',
        awards: 'حاصل شدہ انعامات'
      },
      gallery: {
        title: 'گیلری',
        subtitle: 'ہماری کھانا پکانے کی میراث اور ریسٹوران کے ماحول کا بصری سفر'
      },
      visit: {
        title: 'ہمیں ملیں',
        subtitle: 'شہر کے دل میں ہمیں تلاش کریں',
        hours: 'کھلنے کا وقت',
        contact: 'رابطے کی معلومات',
        address: 'پتہ',
        phone: 'فون',
        whatsapp: 'واٹس ایپ',
        makeReservation: 'بکنگ کریں',
        whatsappUs: 'واٹس ایپ کریں',
        getDirections: 'راستہ حاصل کریں'
      },
      footer: {
        description: 'کردستان کے اصل ذائقے اور گرم مہمان نوازی آپ کی میز تک لا رہے ہیں۔',
        quickLinks: 'فوری لنکس',
        contactInfo: 'رابطے کی معلومات',
        followUs: 'ہمیں فالو کریں',
        openDaily: 'روزانہ کھلا ۱۱:۰۰ صبح - ۱۱:۰۰ رات',
        poweredBy: 'طاقت فراہم کنندہ',
        blunari: 'بلوناری AI',
        copyright: `© ${new Date().getFullYear()} نیچر ولیج کرد ریسٹوران۔ تمام حقوق محفوظ ہیں۔`,
        privacy: 'پرائیویسی پالیسی',
        terms: 'سروس کی شرائط'
      },
      featured: {
        title: 'خصوصی پکوان',
        subtitle: 'ہمارے مشہور کرد کھانوں کو دریافت کریں'
      },
      tags: {
        vegetarian: '🌱 سبزی خور',
        vegan: '🌿 ویگن',
        spicy: '🌶️ تیز',
        sweet: '🍯 میٹھا',
        traditional: '🏛️ روایتی',
        grilled: '🔥 گرل',
        'comfort food': '🍲 آرام دہ کھانا',
        soup: '🍜 سوپ',
        stew: '🥘 سالن'
      },
      addToCart: 'ٹوکری میں ڈالیں',
      loading: 'لوڈ ہو رہا ہے...',
      error: 'کچھ غلط ہوا۔ دوبارہ کوشش کریں۔',
      currency: '$'
    },
    kmr: {
      nav: {
        home: 'Malper',
        menu: 'Menû',
        about: 'Derbarê Me',
        gallery: 'Galerî',
        visit: 'Serdana Me Bikin',
        reservations: 'Rezervasyon',
        catering: 'Katering',
        orderOnline: 'Sifariş'
      },
      hero: {
        title: 'Gundê Xwezayê',
        subtitle: 'Di Her Qurçikê de Tama Kurdistanê',
        description: 'Tamên resen ên Kurdî di hawîrdorekî germ û kevneşopî de biceribînin.',
        cta1: 'Menûyê Bibînin',
        cta2: 'Rezervasyon Bikin'
      },
      menu: {
        title: 'Menûya Me',
        subtitle: 'Bi MenuIQ ve têk tê - Ezmûna Xwarinê ya Baştirkirî bi AI',
        filters: {
          all: 'Hemû Tişt',
          traditional: 'Kevneşopî',
          vegetarian: 'Riwekî',
          vegan: 'Vegan',
          soup: 'Şorbe',
          dessert: 'Şîrînî',
          popular: 'Herî Navdar'
        },
        viewFull: 'Menûya Tevayî Bibînin',
        noItems: 'Di vê kategoriyê de tu tişt nehat dîtin.'
      },
      about: {
        title: 'Çîroka Me',
        content: 'Gundê Xwezayê ji xewna parvekirina tamên resen û mêvandariya germ a Kurdistanê bi cîhanê re hate dayîn.',
        experience: 'Sal Ezmûn',
        recipes: 'Rêsetên Kevneşopî',
        customers: 'Xerîdarên Kêfxweş',
        awards: 'Xelatan Bi Dest Xistin'
      },
      gallery: {
        title: 'Galerî',
        subtitle: 'Rêwîtinek dîtbar di mîrata me ya çêkirina xwarinê û hawîrdora xwarinxaneyê de'
      },
      visit: {
        title: 'Serdana Me Bikin',
        subtitle: 'Li dilê bajêr me bibînin',
        hours: 'Demên Vebûnê',
        contact: 'Agahiyên Têkiliyê',
        address: 'Navnîşan',
        phone: 'Telefon',
        whatsapp: 'WhatsApp',
        makeReservation: 'Rezervasyon Bikin',
        whatsappUs: 'WhatsApp Bikin',
        getDirections: 'Rê Bistînin'
      },
      footer: {
        description: 'Tamên resen û mêvandariya germ a Kurdistanê tînin ser maseyê we.',
        quickLinks: 'Lînkên Bilez',
        contactInfo: 'Agahiyên Têkiliyê',
        followUs: 'Şopa Me Bikin',
        openDaily: 'Rojane Vekirî 11:00 - 23:00',
        poweredBy: 'Ji aliyê ve tê piştgirîkirin',
        blunari: 'Blunari AI',
        copyright: `© ${new Date().getFullYear()} Gundê Xwezayê Xwarinxaneya Kurdî. Hemû maf parastî ne.`,
        privacy: 'Polîtikaya Nihêniyê',
        terms: 'Mercên Karûbarê'
      },
      featured: {
        title: 'Xwarinên Taybetî',
        subtitle: 'Xwarinên Kurdî yên me ên herî dilxwaz nas bikin'
      },
      tags: {
        vegetarian: '🌱 Riwekî',
        vegan: '🌿 Vegan',
        spicy: '🌶️ Tûj',
        sweet: '🍯 Şîrîn',
        traditional: '🏛️ Kevneşopî',
        grilled: '🔥 Brijandin',
        'comfort food': '🍲 Xwarina Aramiyê',
        soup: '🍜 Şorbe',
        stew: '🥘 Xwarin'
      },
      addToCart: 'Li Sepetê Zêde Bike',
      loading: 'Tê barkirin...',
      error: 'Tiştek çewt çû. Ji kerema xwe dîsa biceribîne.',
      currency: '$'
    }
  };

  const t = translations[language] || translations.en;
  
  // Enhanced getText function with better error handling
  const getText = useCallback((obj) => {
    try {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'object' && obj !== null) {
        return obj[language] || obj.en || '';
      }
      return '';
    } catch (error) {
      console.error('Error getting text:', error);
      return '';
    }
  }, [language]);

  // Safe tag translation function
  const getTagTranslation = useCallback((tag) => {
    try {
      return t.tags?.[tag] || tag || '';
    } catch (error) {
      console.error('Error getting tag translation:', error);
      return tag || '';
    }
  }, [t.tags]);

  // Safe scroll to section function
  const scrollToSection = useCallback((sectionId) => {
    try {
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
      
      if (typeof document !== 'undefined') {
        const element = document.getElementById(sectionId);
        if (element) {
          const navHeight = 80; // Account for fixed nav
          const elementPosition = element.offsetTop - navHeight;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  }, [router, language]);

  // Enhanced filter function with comprehensive filtering
  const filteredMenuItems = useMemo(() => {
    try {
      if (!Array.isArray(menuItems)) return [];
      
      switch (activeFilter) {
        case 'all':
          return menuItems;
        case 'popular':
          return menuItems.filter(item => item?.popular === true);
        case 'traditional':
          return menuItems.filter(item => item?.category === 'traditional');
        case 'vegetarian':
          return menuItems.filter(item => item?.category === 'vegetarian' || item?.tags?.includes('vegetarian'));
        case 'vegan':
          return menuItems.filter(item => item?.category === 'vegan' || item?.tags?.includes('vegan'));
        case 'soup':
          return menuItems.filter(item => item?.category === 'soup' || item?.tags?.includes('soup'));
        case 'dessert':
          return menuItems.filter(item => item?.category === 'dessert');
        default:
          return menuItems.filter(item => item?.category === activeFilter);
      }
    } catch (error) {
      console.error('Error filtering menu items:', error);
      return [];
    }
  }, [activeFilter, menuItems]);

  const isRTL = languages[language]?.dir === 'rtl';

  // Safe WhatsApp handler
  const handleWhatsAppClick = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.open('https://wa.me/15551234567', '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  }, []);

  // Safe Blunari link handler
  const handleBlunariClick = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.open('https://blunari.ai', '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening Blunari link:', error);
    }
  }, []);

  // Online order handler
  const handleOrderOnline = useCallback(() => {
    setShowOrderModal(true);
  }, []);

  // Delivery platform handlers
  const handleUberEats = useCallback(() => {
    try {
      // Replace with your actual Uber Eats restaurant URL
      window.open('https://www.ubereats.com/store/nature-village', '_blank', 'noopener,noreferrer');
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error opening Uber Eats:', error);
    }
  }, []);

  const handleDoorDash = useCallback(() => {
    try {
      // Replace with your actual DoorDash restaurant URL
      window.open('https://www.doordash.com/store/nature-village', '_blank', 'noopener,noreferrer');
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error opening DoorDash:', error);
    }
  }, []);

  const handleSlice = useCallback(() => {
    try {
      // Replace with your actual Slice restaurant URL
      window.open('https://slicelife.com/restaurants/nature-village', '_blank', 'noopener,noreferrer');
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error opening Slice:', error);
    }
  }, []);

  // Simplified className helper function
  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  // RTL-aware className function
  const rtlClass = (ltrClass, rtlClass = '') => {
    return isRTL ? rtlClass : ltrClass;
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl font-serif text-amber-800">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* Mobile menu animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50" style={{ direction: languages[language]?.dir || 'ltr' }}>
      {/* Navigation */}
      <nav className={cn(
        'fixed top-0 w-full z-50 border-b-2 border-amber-200 transition-all duration-300',
        isScrolled ? 'bg-white shadow-xl py-2' : 'bg-white/95 backdrop-blur-md shadow-lg py-4'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn('flex items-center justify-between h-16', isRTL && 'flex-row-reverse')}>
            {/* Logo Section - Enhanced with accessibility */}
            <div className={cn('flex items-center flex-shrink-0', isRTL && 'flex-row-reverse')}>
              <img 
                src="https://naturevillagerestaurant.com/wp-content/uploads/2024/09/cropped-NatureVillage-Logo_circle-1222-2048x2048-1.webp" 
                alt="Nature Village Restaurant Logo" 
                className={cn('w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-200 hover:scale-105', rtlClass('mr-3', 'ml-3'))}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <div className="text-lg sm:text-2xl font-serif font-bold text-amber-800 transition-colors duration-200 hover:text-amber-700">Nature Village</div>
                <div className="text-xs text-amber-600 font-sans hidden sm:block">Restaurant</div>
              </div>
            </div>
            
            {/* Desktop Navigation - Enhanced with accessibility */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
              <nav className={cn('flex items-center justify-center space-x-1', isRTL && 'space-x-reverse')} role="navigation" aria-label="Main navigation">
                <div className={cn('flex items-center space-x-1', isRTL && 'space-x-reverse')}>
                  {Object.entries(t.nav || {})
                    .filter(([key]) => key !== 'orderOnline')
                    .map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => scrollToSection(key)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                        'whitespace-nowrap relative group',
                        currentSection === key 
                          ? 'bg-amber-800 text-white shadow-lg' 
                          : 'text-amber-800 hover:bg-amber-100 hover:text-amber-900'
                      )}
                      aria-current={currentSection === key ? 'page' : undefined}
                      tabIndex={0}
                    >
                      {value}
                      {currentSection !== key && (
                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                      )}
                    </button>
                  ))}
                  
                  {/* Order Online CTA Button */}
                  <button
                    onClick={handleOrderOnline}
                    className={cn(
                      'flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                      isRTL && 'space-x-reverse'
                    )}
                    aria-label={t.nav?.orderOnline || 'Order'}
                  >
                    <ChefHat className="w-4 h-4" aria-hidden="true" />
                    <span className="font-medium text-xs uppercase tracking-wide whitespace-nowrap">{t.nav?.orderOnline || 'Order'}</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Social Media Links - Minimal Design */}
            <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
              <a 
                href="https://facebook.com/naturevillagerestaurant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/naturevillagerestaurant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Language Toggle & Mobile Menu - Enhanced */}
            <div className={cn('flex items-center space-x-3 flex-shrink-0', isRTL && 'space-x-reverse')}>
              {/* Order Online Button for Mobile */}
              <button
                onClick={handleOrderOnline}
                className={cn(
                  'lg:hidden flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                  isRTL && 'space-x-reverse'
                )}
                aria-label={t.nav?.orderOnline || 'Order'}
              >
                <ChefHat className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-medium text-xs uppercase tracking-wide whitespace-nowrap">{t.nav?.orderOnline || 'Order'}</span>
              </button>

              {/* Language Selector - Minimal Design */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={cn(
                    'flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-amber-200 hover:border-amber-300 text-amber-800 hover:text-amber-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1',
                    isRTL && 'space-x-reverse'
                  )}
                  aria-expanded={showLanguageDropdown}
                  aria-haspopup="listbox"
                  aria-label="Select language"
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium text-xs uppercase tracking-wide">
                    {language === 'en' ? 'EN' :
                     language === 'ku' ? 'KU' :
                     language === 'ar' ? 'AR' :
                     language === 'fa' ? 'FA' :
                     language === 'tr' ? 'TR' :
                     language === 'ur' ? 'UR' :
                     'KMR'}
                  </span>
                </button>

                {showLanguageDropdown && (
                  <div className={cn(
                    'absolute mt-1 w-44 bg-white rounded-lg shadow-lg border border-amber-200 z-[9999] overflow-hidden',
                    isRTL ? 'right-0' : 'left-0',
                    'max-h-72 overflow-y-auto'
                  )}>
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'ku', name: 'کوردی' },
                      { code: 'ar', name: 'العربية' },
                      { code: 'fa', name: 'فارسی' },
                      { code: 'tr', name: 'Türkçe' },
                      { code: 'ur', name: 'اردو' },
                      { code: 'kmr', name: 'Kurmancî' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className={cn(
                          'w-full px-3 py-2.5 hover:bg-amber-50 transition-colors duration-150 flex items-center space-x-2.5 text-sm',
                          isRTL && 'space-x-reverse text-right',
                          !isRTL && 'text-left',
                          language === lang.code ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:text-amber-800'
                        )}
                      >
                        <div className={cn(
                          'w-1.5 h-1.5 rounded-full transition-colors duration-150',
                          language === lang.code ? 'bg-amber-500' : 'bg-gray-300'
                        )}></div>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-amber-800 hover:text-amber-600 p-2 rounded-md hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn" 
              onClick={() => setIsMenuOpen(false)}
            >
              <div 
                className={cn(
                  'absolute top-0 w-80 sm:w-96 h-screen min-h-screen bg-white shadow-2xl transform transition-all duration-500 ease-out border-r border-amber-200 flex flex-col',
                  isRTL ? 'right-0 animate-slideInRight' : 'left-0 animate-slideInLeft'
                )} 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Menu Header with enhanced design */}
                <div className="relative flex items-center justify-between p-6 border-b border-amber-200 bg-white shadow-sm flex-shrink-0">
                  <div className={cn('flex items-center', isRTL && 'flex-row-reverse')}>
                    <div className="relative">
                      <div className={cn('w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-md', rtlClass('mr-3', 'ml-3'))}>
                        <span className="text-white font-bold text-lg">N</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-serif font-bold text-amber-800">Nature Village</span>
                      <span className="text-xs text-amber-600 font-medium">Restaurant</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="relative p-3 rounded-full text-amber-800 hover:text-amber-900 hover:bg-amber-100/50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
                    <div className="absolute inset-0 rounded-full bg-amber-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                </div>

                {/* Mobile Menu Navigation with enhanced animations */}
                <nav className="flex flex-col py-6 px-4 space-y-1 overflow-y-auto flex-1 bg-white" role="navigation" aria-label="Mobile navigation">
                  {Object.entries(t.nav || {})
                    .filter(([key]) => key !== 'orderOnline')
                    .map(([key, value], index) => (
                    <button
                      key={key}
                      onClick={() => {
                        scrollToSection(key);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        'group relative flex items-center justify-between px-5 py-4 rounded-xl text-amber-800 hover:text-amber-900 transition-all duration-300 font-medium text-lg border border-transparent',
                        'hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-200/50 hover:shadow-md hover:scale-[1.02]',
                        'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2',
                        currentSection === key && 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border-amber-300/50 shadow-sm scale-[1.02]'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="flex items-center">
                        {/* Add navigation icons */}
                        {key === 'home' && <Home className="w-5 h-5 mr-3 opacity-70" />}
                        {key === 'menu' && <Utensils className="w-5 h-5 mr-3 opacity-70" />}
                        {key === 'about' && <Info className="w-5 h-5 mr-3 opacity-70" />}
                        {key === 'gallery' && <Camera className="w-5 h-5 mr-3 opacity-70" />}
                        {key === 'visit' && <MapPin className="w-5 h-5 mr-3 opacity-70" />}
                        {key === 'reservations' && <Calendar className="w-5 h-5 mr-3 opacity-70" />}
                        {key === 'catering' && <Users className="w-5 h-5 mr-3 opacity-70" />}
                        {value}
                      </span>
                      <ChevronRight className={cn(
                        'w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1',
                        isRTL && 'rotate-180'
                      )} />
                      
                      {/* Active indicator */}
                      {currentSection === key && (
                        <div className={cn(
                          'absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full',
                          isRTL ? 'right-0' : 'left-0'
                        )}></div>
                      )}
                    </button>
                  ))}
                  
                  {/* Enhanced Mobile Order Online Button */}
                  <div className="mt-6 pt-4 border-t border-amber-200/70">
                    <button
                      onClick={() => {
                        handleOrderOnline();
                        setIsMenuOpen(false);
                      }}
                      className="group relative w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <ChefHat className="w-6 h-6 group-hover:animate-bounce" />
                      <span className="relative z-10">{t.nav?.orderOnline || 'Order'}</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                    </button>
                  </div>

                  {/* Enhanced Mobile Language Selector */}
                  <div className="mt-6 pt-6 border-t border-amber-200/70">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Language
                      </h3>
                      <span className="text-sm text-amber-600 font-medium px-3 py-1 bg-amber-100 rounded-full">
                        {language.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(languages).map(([code, lang], index) => (
                        <button
                          key={code}
                          onClick={() => {
                            handleLanguageChange(code);
                            setIsMenuOpen(false);
                          }}
                          className={cn(
                            'group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1',
                            language === code 
                              ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border-amber-300 shadow-md scale-[1.05]' 
                              : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50 border-amber-200/50 hover:border-amber-300 hover:shadow-sm hover:scale-[1.02]'
                          )}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            {/* Add flag emojis for visual appeal */}
                            <span className="text-lg mr-2">
                              {code === 'en' && '🇺🇸'}
                              {code === 'ku' && '☀️'}
                              {code === 'ar' && '🌙'}
                              {code === 'fa' && '🇮🇷'}
                              {code === 'tr' && '🇹🇷'}
                              {code === 'ur' && '🇵🇰'}
                              {code === 'kmr' && '⭐'}
                            </span>
                            {lang.name}
                          </span>
                          
                          {/* Selection indicator */}
                          {language === code && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Phone Section with enhanced styling */}
                  <div className="mt-6 pt-6 border-t border-amber-200/70">
                    <a 
                      href="tel:4045554873" 
                      className="group relative w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                      aria-label="Call us at (404) 555-KURD"
                    >
                      <Phone className="w-5 h-5 group-hover:animate-pulse" />
                      <span>(404) 555-KURD</span>
                    </a>
                  </div>

                  {/* Additional mobile menu footer */}
                  <div className="mt-8 pt-6 border-t border-amber-200/70">
                    <div className="flex items-center justify-center space-x-6">
                      <a 
                        href="https://facebook.com/naturevillagerestaurant" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 rounded-full text-amber-700 hover:text-white hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Follow us on Facebook"
                      >
                        <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      </a>
                      <a 
                        href="https://instagram.com/naturevillagerestaurant" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 rounded-full text-amber-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Follow us on Instagram"
                      >
                        <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      </a>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: 'Nature Village Restaurant',
                              text: 'Check out this amazing restaurant!',
                              url: window.location.href,
                            });
                          }
                          setIsMenuOpen(false);
                        }}
                        className="group p-3 rounded-full text-amber-700 hover:text-white hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                        aria-label="Share restaurant"
                      >
                        <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
        
        <div className={cn('relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6', rtlClass('', 'text-right'))}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 drop-shadow-2xl">
            {t.hero?.title || 'Nature Village'}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light mb-8 text-amber-100">
            {t.hero?.subtitle || 'A Taste of Kurdistan in Every Bite'}
          </p>
          <p className="text-base sm:text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed text-amber-50">
            {t.hero?.description || 'Experience authentic Kurdish flavors in a warm, traditional setting.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => scrollToSection('menu')}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              {t.hero?.cta1 || 'View Menu'}
            </button>
            <button 
              onClick={() => router.push('/reservations')}
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              {t.hero?.cta2 || 'Make Reservation'}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Dishes Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-800 mb-4">
              {t.featured?.title || 'Featured Dishes'}
            </h2>
            <p className="text-lg sm:text-xl text-amber-600 max-w-3xl mx-auto">
              {t.featured?.subtitle || 'Discover our most beloved Kurdish specialties'}
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {menuItems.filter(item => item?.popular === true).slice(0, 3).map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={getText(item.name)}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className={cn('p-4 sm:p-6', rtlClass('text-left', 'text-right'))}>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-800 mb-2">
                    {getText(item.name)}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">
                    {getText(item.description)}
                  </p>
                  <div className={cn('flex justify-between items-center', isRTL && 'flex-row-reverse')}>
                    <span className="text-xl sm:text-2xl font-bold text-amber-600">{t.currency}{item.price.replace('$', '')}</span>
                    <div className={cn('flex items-center space-x-1 text-yellow-500', isRTL && 'space-x-reverse')}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
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
      <section id="menu" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-800 mb-4">
              {t.menu?.title || 'Our Menu'}
            </h2>
            <p className="text-base sm:text-lg text-amber-600 mb-2">
              {t.menu?.subtitle || 'Powered by MenuIQ'}
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          {/* Menu Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-12 justify-center">
            {Object.entries(t.menu?.filters || {}).map(([filterKey, filterLabel]) => (
              <button
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                className={cn(
                  'px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center space-x-1 sm:space-x-2',
                  isRTL && 'space-x-reverse',
                  activeFilter === filterKey 
                    ? 'bg-amber-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-amber-800 hover:bg-amber-100 hover:scale-105'
                )}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{filterLabel}</span>
              </button>
            ))}
          </div>

          {/* View Full Menu Button */}
          <div className="text-center mb-8 sm:mb-12">
            <button 
              onClick={() => router.push({ pathname: '/menu', query: { lang: language } })}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              {t.menu?.viewFull || 'View Full Menu'}
            </button>
          </div>

          {/* Menu Grid */}
          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={getText(item.name)}
                      className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop';
                      }}
                    />
                    {item.popular && (
                      <div className="absolute top-4 right-4 bg-amber-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        ⭐ {t.menu?.filters?.popular || 'Popular'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className={cn('p-4 sm:p-6', rtlClass('text-left', 'text-right'))}>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-800 mb-1">
                      {getText(item.name)}
                    </h3>
                    <p className="text-gray-700 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {getText(item.description)}
                    </p>
                    <div className={cn('flex justify-between items-center mb-3', isRTL && 'flex-row-reverse')}>
                      <span className="text-xl sm:text-2xl font-bold text-amber-600">{t.currency}{item.price.replace('$', '')}</span>
                      <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
                        {t.addToCart || 'Add to Cart'}
                      </button>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className={cn('flex gap-1 flex-wrap', rtlClass('justify-start', 'justify-end'))}>
                        {item.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {getTagTranslation(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-amber-600">{t.menu?.noItems || 'No items found in this category.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className={cn('order-2 lg:order-1', isRTL && 'lg:order-2')}>
              <img 
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
                alt="Kurdish Restaurant Interior"
                className="rounded-lg shadow-xl w-full h-64 sm:h-80 lg:h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop';
                }}
              />
            </div>
            <div className={cn('order-1 lg:order-2', isRTL && 'lg:order-1 text-right', !isRTL && 'text-left')}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-800 mb-6">
                {t.about?.title || 'Our Story'}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
                {t.about?.content || 'Nature Village was born from a dream to share authentic Kurdish flavors with the world.'}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-8">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-bold text-amber-600 mb-2">10K+</div>
                  <div className="text-sm sm:text-base text-gray-600">{t.about?.customers || 'Happy Customers'}</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-bold text-amber-600 mb-2">15+</div>
                  <div className="text-sm sm:text-base text-gray-600">{t.about?.awards || 'Awards Won'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Section */}
      <section id="visit" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-800 mb-4">
              {t.visit?.title || 'Visit Us'}
            </h2>
            <p className="text-lg sm:text-xl text-amber-600">
              {t.visit?.subtitle || 'Find us in the heart of the city'}
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4">
                {t.visit?.hours || 'Opening Hours'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t.footer?.openDaily || 'Open Daily 11:00 AM - 11:00 PM'}
                <br />
                <span className="text-amber-600 font-medium">7 Days a Week</span>
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4">
                {t.visit?.address || 'Address'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                123 Kurdistan Street<br />
                Downtown, City 12345<br />
                <button 
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                  className="text-amber-600 hover:text-amber-800 transition-colors mt-2 font-medium"
                >
                  {t.visit?.getDirections || 'Get Directions'}
                </button>
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg text-center hover:shadow-2xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <Phone className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4">
                {t.visit?.contact || 'Contact Information'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t.visit?.phone || 'Phone'}: 
                <a href="tel:+15551234567" className="text-amber-600 hover:text-amber-800 transition-colors ml-1">
                  (555) 123-4567
                </a>
                <br />
                <button 
                  onClick={handleWhatsAppClick}
                  className="text-amber-600 hover:text-amber-800 transition-colors mt-2 font-medium inline-flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {t.visit?.whatsappUs || 'WhatsApp Us'}
                </button>
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <button 
              onClick={() => router.push('/reservations')}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              {t.visit?.makeReservation || 'Make Reservation'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                {t.footer?.description || 'Bringing authentic Kurdish flavors to your table.'}
              </p>
              <div className={cn('flex space-x-4', isRTL && 'space-x-reverse')}>
                <button className="text-amber-200 hover:text-white transition-colors p-2 hover:bg-amber-700 rounded-full">
                  <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button className="text-amber-200 hover:text-white transition-colors p-2 hover:bg-amber-700 rounded-full">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button className="text-amber-200 hover:text-white transition-colors p-2 hover:bg-amber-700 rounded-full">
                  <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button 
                  onClick={handleWhatsAppClick}
                  className="text-amber-200 hover:text-white transition-colors p-2 hover:bg-amber-700 rounded-full"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t.footer?.quickLinks || 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                {Object.entries(t.nav || {}).map(([key, value]) => (
                  <li key={key}>
                    <button 
                      onClick={() => scrollToSection(key)}
                      className="text-amber-200 hover:text-white transition-colors text-sm block"
                    >
                      {value}
                    </button>
                  </li>
                ))}
                <li>
                  <button className="text-amber-200 hover:text-white transition-colors text-sm block">
                    {t.footer?.privacy || 'Privacy Policy'}
                  </button>
                </li>
                <li>
                  <button className="text-amber-200 hover:text-white transition-colors text-sm block">
                    {t.footer?.terms || 'Terms of Service'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t.footer?.contactInfo || 'Contact Information'}
              </h4>
              <div className="space-y-2 text-amber-200 text-sm">
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  123 Kurdistan Street<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Downtown, City 12345
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href="tel:+15551234567" className="hover:text-white transition-colors">
                    (555) 123-4567
                  </a>
                </p>
                <p className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  {t.footer?.openDaily || 'Open Daily 11:00 AM - 11:00 PM'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-amber-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-amber-200 text-sm text-center sm:text-left">
                {t.footer?.copyright || '© 2024 Nature Village Kurdish Restaurant. All rights reserved.'}
              </p>
              <div className="flex items-center space-x-2 text-amber-300 text-sm">
                <span>{t.footer?.poweredBy || 'Powered by'}</span>
                <button 
                  onClick={handleBlunariClick}
                  className="hover:text-white transition-colors font-medium underline decoration-dotted underline-offset-4"
                >
                  {t.footer?.blunari || 'Blunari AI'}
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

      {/* Scroll to top button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="order-modal bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Order Online</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">Choose your preferred delivery platform for pickup or delivery:</p>
                
                {/* Delivery Platform Buttons */}
                <div className="space-y-3">
                  {/* Uber Eats Button */}
                  <button
                    onClick={handleUberEats}
                    className={cn(
                      'w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                      isRTL && 'space-x-reverse'
                    )}
                  >
                    <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">UE</span>
                    </div>
                    <span className="font-medium text-sm">Uber Eats</span>
                  </button>

                  {/* DoorDash Button */}
                  <button
                    onClick={handleDoorDash}
                    className={cn(
                      'w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                      isRTL && 'space-x-reverse'
                    )}
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">DD</span>
                    </div>
                    <span className="font-medium text-sm">DoorDash</span>
                  </button>

                  {/* Slice Button */}
                  <button
                    onClick={handleSlice}
                    className={cn(
                      'w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                      isRTL && 'space-x-reverse'
                    )}
                  >
                    <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">SL</span>
                    </div>
                    <span className="font-medium text-sm">Slice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default NatureVillageWebsite;