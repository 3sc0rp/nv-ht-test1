import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Menu, X, MapPin, Phone, Clock, Star, Filter, Globe, Facebook, Instagram, ChefHat, Users, Calendar, Award, ChevronRight, Home, Utensils, Info, Camera, ExternalLink, Share2, ChevronDown, Grid, Heart, Eye, Share, ZoomIn, Download } from 'lucide-react';
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
  
  // Enhanced Gallery State Variables
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryView, setGalleryView] = useState('grid'); // 'grid' or 'masonry'
  
  // Live Restaurant Status State
  const [restaurantStatus, setRestaurantStatus] = useState({
    isOpen: true,
    busyLevel: 'medium', // 'low', 'medium', 'high', 'very-high'
    waitTime: '15-20',
    nextClosing: '10:00 PM',
    deliveryTime: '25-35'
  });
  
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
    
    // Simulate live status updates
    const updateRestaurantStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // Determine if restaurant is open (12 PM - 10 PM Sunday-Thursday, 12 PM - 11 PM Friday-Saturday)
      const isWeekend = day === 5 || day === 6; // Friday or Saturday
      const closingHour = isWeekend ? 23 : 22; // 11 PM or 10 PM
      const isOpen = hour >= 12 && hour < closingHour;
      
      // Simulate busy levels based on time and day
      let busyLevel = 'low';
      let waitTime = '5-10';
      let deliveryTime = '20-25';
      
      if (isOpen) {
        // Peak hours logic
        if ((hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21)) {
          // Lunch and dinner rush
          if (isWeekend) {
            busyLevel = Math.random() > 0.3 ? 'very-high' : 'high';
            waitTime = busyLevel === 'very-high' ? '45-60' : '30-40';
            deliveryTime = busyLevel === 'very-high' ? '45-55' : '35-45';
          } else {
            busyLevel = Math.random() > 0.5 ? 'high' : 'medium';
            waitTime = busyLevel === 'high' ? '25-35' : '15-25';
            deliveryTime = busyLevel === 'high' ? '35-45' : '25-35';
          }
        } else if (hour >= 15 && hour <= 17) {
          // Afternoon lull
          busyLevel = 'low';
          waitTime = '5-10';
          deliveryTime = '20-25';
        } else {
          // Regular hours
          busyLevel = 'medium';
          waitTime = '15-20';
          deliveryTime = '25-35';
        }
      }
      
      const nextClosing = isWeekend ? '11:00 PM' : '10:00 PM';
      
      setRestaurantStatus({
        isOpen,
        busyLevel,
        waitTime,
        nextClosing,
        deliveryTime
      });
    };
    
    // Initial status update
    updateRestaurantStatus();
    
    // Update status every 2 minutes
    const statusInterval = setInterval(updateRestaurantStatus, 120000);
    
    return () => clearInterval(statusInterval);
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

  // Enhanced Gallery Data Structure
  const galleryImages = useMemo(() => [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      alt: { en: 'Elegant Restaurant Interior', ku: 'ناوەوەی چێشتخانەی جوان', ar: 'داخل المطعم الأنيق' },
      category: 'atmosphere',
      tags: ['interior', 'ambiance', 'dining'],
      likes: 127,
      featured: true,
      story: {
        en: 'Our warm and inviting dining space reflects Kurdish hospitality',
        ku: 'شوێنی خواردنی گەرم و بانگهێشتکارمان ڕەنگدانەوەی میوانداری کوردی دەکات'
      }
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
      alt: { en: 'Authentic Kurdish Kebab', ku: 'کەبابی ڕەسەنی کوردی', ar: 'كباب كردي أصيل' },
      category: 'dishes',
      tags: ['kebab', 'grilled', 'signature'],
      likes: 245,
      featured: true,
      story: {
        en: 'Hand-crafted kebabs using traditional Kurdish spices and techniques',
        ku: 'کەبابی دەستکرد بە بەکارهێنانی بەهارات و تەکنیکی نەریتی کوردی'
      }
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      alt: { en: 'Fresh Hummus with Pita', ku: 'حومسی تازە لەگەڵ نانی پیتا', ar: 'حمص طازج مع الخبز' },
      category: 'dishes',
      tags: ['hummus', 'appetizer', 'vegetarian'],
      likes: 189,
      featured: false,
      story: {
        en: 'Creamy hummus made fresh daily with tahini and olive oil',
        ku: 'حومسی کرێمی کە ڕۆژانە بە تەحینە و زەیتی زەیتوون تازە دروست دەکرێت'
      }
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      alt: { en: 'Traditional Kurdish Platter', ku: 'پلێتەری نەریتی کوردی', ar: 'طبق كردي تقليدي' },
      category: 'dishes',
      tags: ['traditional', 'mixed', 'authentic'],
      likes: 156,
      featured: true,
      story: {
        en: 'A celebration of Kurdish culinary heritage in one beautiful platter',
        ku: 'ئاهەنگێک بۆ میراتی چێشتلێنانی کوردی لە یەک پلێتەری جوان'
      }
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      alt: { en: 'Kurdish Vegetable Medley', ku: 'تێکەڵەی سەوزەی کوردی', ar: 'خليط الخضار الكردي' },
      category: 'dishes',
      tags: ['vegetables', 'healthy', 'colorful'],
      likes: 134,
      featured: false,
      story: {
        en: 'Fresh seasonal vegetables prepared with Kurdish herbs and spices',
        ku: 'سەوزەی وەرزیی تازە کە بە گیا و بەهاراتی کوردی ئامادە کراوە'
      }
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
      alt: { en: 'Traditional Baklava', ku: 'بەقڵاوای نەریتی', ar: 'بقلاوة تقليدية' },
      category: 'desserts',
      tags: ['baklava', 'sweet', 'pastry'],
      likes: 201,
      featured: true,
      story: {
        en: 'Delicate layers of phyllo pastry filled with nuts and sweetened with honey',
        ku: 'چینە چینە فیلۆی ناسک پڕکراو لە گوێز و بە هەنگوین شیرین کراوە'
      }
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
      alt: { en: 'Kurdish Dolma', ku: 'دۆڵمەی کوردی', ar: 'دولمة كردية' },
      category: 'dishes',
      tags: ['dolma', 'stuffed', 'traditional'],
      likes: 178,
      featured: false,
      story: {
        en: 'Grape leaves stuffed with rice, herbs, and spices - a family recipe',
        ku: 'گەڵای مێو پڕکراو لە برنج و گیا و بەهارات - ڕێسەتێکی خێزانی'
      }
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
      alt: { en: 'Hearty Kurdish Soup', ku: 'شۆربەی بەهێزی کوردی', ar: 'حساء كردي مغذي' },
      category: 'dishes',
      tags: ['soup', 'comfort', 'warm'],
      likes: 143,
      featured: false,
      story: {
        en: 'Warming soup made with traditional Kurdish ingredients and love',
        ku: 'شۆربەی گەرمکەرەوە کە بە پێکهاتەی نەریتی کوردی و خۆشەویستی دروست کراوە'
      }
    }
  ], []);

  // Gallery Categories
  const galleryCategories = useMemo(() => ({
    all: { en: 'All Photos', ku: 'هەموو وێنەکان', ar: 'جميع الصور', icon: Grid },
    dishes: { en: 'Signature Dishes', ku: 'خۆراکی تایبەت', ar: 'الأطباق المميزة', icon: ChefHat },
    atmosphere: { en: 'Restaurant Atmosphere', ku: 'کەشوهەوای چێشتخانە', ar: 'أجواء المطعم', icon: Home },
    desserts: { en: 'Sweet Treats', ku: 'شیرینی', ar: 'الحلويات', icon: Heart }
  }), []);

  // Filter functionality
  const filteredGalleryImages = useMemo(() => {
    let filtered = galleryImages;
    
    // Filter by category
    if (galleryFilter !== 'all') {
      filtered = filtered.filter(image => image.category === galleryFilter);
    }
    
    return filtered;
  }, [galleryImages, galleryFilter]);

  // Lightbox functionality
  const openLightbox = useCallback((image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Social sharing functionality
  const shareImage = useCallback(async (image) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${image.alt.en} - Nature Village Restaurant`,
          text: image.story.en,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  }, []);

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
        makeReservation: 'Make Reservation',
        getDirections: 'Get Directions'
      },
      footer: {
        description: 'Bringing the authentic flavors and warm hospitality of Kurdistan to your table. Every dish is a celebration of our rich cultural heritage and culinary excellence.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        followUs: 'Follow Us',
        openDaily: 'SUN - THU: 12 AM - 10 PM\nFRI - SAT: 12 AM - 11 PM',
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
      celebration: {
        title: 'Celebrate Your Special Moments',
        subtitle: 'Make your birthdays, anniversaries, and special occasions unforgettable with authentic Kurdish hospitality',
        birthday: {
          title: 'Birthday Celebrations',
          tagline: 'Make it a day to remember',
          feature1: 'Complimentary birthday cake & candles',
          feature2: 'Traditional Kurdish birthday songs',
          feature3: 'Professional photo memories',
          feature4: 'Special birthday decorations',
          special: 'Perfect for birthday parties of all sizes'
        },
        anniversary: {
          title: 'Anniversary Dinners',
          tagline: 'Celebrate your love story',
          feature1: 'Romantic table setup with roses',
          feature2: 'Complimentary dessert for two',
          feature3: 'Candlelit dining experience',
          feature4: 'Personalized anniversary card',
          special: '25+ years together? Special surprise awaits!'
        },
        cta: {
          title: 'Ready to Celebrate?',
          subtitle: 'Let us make your special day extraordinary with authentic Kurdish hospitality and unforgettable flavors',
          reserve: 'Call for special reservation'
        }
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
        makeReservation: 'جێگە حیجازکردن',
        getDirections: 'ڕێنمایی وەربگرە'
      },
      footer: {
        description: 'هێنانی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان بۆ مێزەکەتان. هەر خۆراکێک ئاهەنگێکە بۆ میراتی دەوڵەمەند و باشی چێشتلێنانمان.',
        quickLinks: 'لینکە خێراکان',
        contactInfo: 'زانیاری پەیوەندی',
        followUs: 'شوێنمان بکەون',
        openDaily: 'یەکشەممە - پێنجشەممە: ١٢:٠٠ ی بەیانی - ١٠:٠٠ ی شەو\nهەینی - شەممە: ١٢:٠٠ ی بەیانی - ١١:٠٠ ی شەو',
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
      celebration: {
        title: 'ئاهەنگەکانتان لێرە بگێڕن',
        subtitle: 'ڕۆژە تایبەتەکانتان وەک ڕۆژی لەدایکبوون و ساڵیادەکان لەگەڵ میوانداری کوردی نەویست بکەن',
        birthday: {
          title: 'ئاهەنگی ڕۆژی لەدایکبوون',
          tagline: 'ڕۆژێک بیکەن بەیادماوی',
          feature1: 'کەیکی ڕۆژی لەدایکبوون و مۆمەکان بەخۆڕایی',
          feature2: 'گۆرانی نەریتی کوردی بۆ ڕۆژی لەدایکبوون',
          feature3: 'وێنەگرتنی پیشەیی بۆ یادگارییەکان',
          feature4: 'ڕازاندنەوەی تایبەت بۆ ڕۆژی لەدایکبوون',
          special: 'کۆمەڵی ڕۆژی لەدایکبوون ٦+ کەس ١٥٪ داشکاندن'
        },
        anniversary: {
          title: 'نانی شەو ساڵیاد',
          tagline: 'چیرۆکی خۆشەویستیتان ئاهەنگ بکەن',
          feature1: 'ڕێکخستنی مێزی خۆشەویستی لەگەڵ گوڵ',
          feature2: 'شیرینی بەخۆڕایی بۆ دوو کەس',
          feature3: 'ئەزموونی نانخواردن لەگەڵ مۆم',
          feature4: 'کارتی ساڵیاد تایبەتی',
          special: '٢٥+ ساڵ پێکەوە؟ سەرپرایزی تایبەت چاوەڕوانتانە!'
        },
        cta: {
          title: 'ئامادەن بۆ ئاهەنگ؟',
          subtitle: 'ڕای لێبدەن ڕۆژی تایبەتتان بکەینە نائاسایی لەگەڵ میوانداری کوردی و تامە نەویستەکان',
          reserve: 'پەیوەندی بکەن بۆ حیجازی تایبەت'
        }
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
        makeReservation: 'احجز طاولة',
        getDirections: 'احصل على الاتجاهات'
      },
      footer: {
        description: 'نجلب النكهات الأصيلة والضيافة الدافئة من كردستان إلى طاولتك. كل طبق احتفال بتراثنا الثقافي الغني وتميزنا الطهوي.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        followUs: 'تابعونا',
        openDaily: 'الأحد - الخميس: ١٢:٠٠ ص - ١٠:٠٠ م\nالجمعة - السبت: ١٢:٠٠ ص - ١١:٠٠ م',
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
      celebration: {
        title: 'احتفل بلحظاتك الخاصة',
        subtitle: 'اجعل أعياد ميلادك وذكرياتك السنوية والمناسبات الخاصة لا تُنسى مع الضيافة الكردية الأصيلة',
        birthday: {
          title: 'احتفالات أعياد الميلاد',
          tagline: 'اجعلها يوماً لا يُنسى',
          feature1: 'كعكة عيد ميلاد مجانية مع الشموع',
          feature2: 'أغاني عيد ميلاد كردية تقليدية',
          feature3: 'ذكريات التصوير الاحترافي',
          feature4: 'زينة عيد ميلاد خاصة',
          special: 'مجموعات أعياد الميلاد ٦+ أشخاص خصم ١٥٪'
        },
        anniversary: {
          title: 'عشاء الذكرى السنوية',
          tagline: 'احتفل بقصة حبك',
          feature1: 'إعداد طاولة رومانسية مع الورود',
          feature2: 'حلوى مجانية لشخصين',
          feature3: 'تجربة طعام على ضوء الشموع',
          feature4: 'بطاقة ذكرى سنوية شخصية',
          special: '٢٥+ سنة معاً؟ مفاجأة خاصة تنتظركم!'
        },
        cta: {
          title: 'مستعد للاحتفال؟',
          subtitle: 'دعنا نجعل يومك الخاص استثنائياً مع الضيافة الكردية الأصيلة والنكهات التي لا تُنسى',
          reserve: 'اتصل للحجز الخاص'
        }
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
        makeReservation: 'رزرو میز',
        getDirections: 'مسیریابی'
      },
      footer: {
        description: 'طعم‌های اصیل و مهمان‌نوازی گرم کردستان را به میز شما می‌آوریم.',
        quickLinks: 'لینک‌های سریع',
        contactInfo: 'اطلاعات تماس',
        followUs: 'ما را دنبال کنید',
        openDaily: 'یکشنبه - پنج‌شنبه: ۱۲:۰۰ ظهر - ۱۰:۰۰ شب\nجمعه - شنبه: ۱۲:۰۰ ظهر - ۱۱:۰۰ شب',
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
        makeReservation: 'Rezervasyon Yap',
        getDirections: 'Yol Tarifi Al'
      },
      footer: {
        description: 'Kürdistan\'ın otantik lezzetlerini ve sıcak misafirperverliğini masanıza getiriyoruz.',
        quickLinks: 'Hızlı Bağlantılar',
        contactInfo: 'İletişim Bilgileri',
        followUs: 'Bizi Takip Edin',
        openDaily: 'PAZAR - PERŞEMBE: 12:00 - 22:00\nCUMA - CUMARTESİ: 12:00 - 23:00',
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
        makeReservation: 'بکنگ کریں',
        getDirections: 'راستہ حاصل کریں'
      },
      footer: {
        description: 'کردستان کے اصل ذائقے اور گرم مہمان نوازی آپ کی میز تک لا رہے ہیں۔',
        quickLinks: 'فوری لنکس',
        contactInfo: 'رابطے کی معلومات',
        followUs: 'ہمیں فالو کریں',
        openDaily: 'اتوار - جمعرات: ۱۲:۰۰ دوپہر - ۱۰:۰۰ رات\nجمعہ - ہفتہ: ۱۲:۰۰ دوپہر - ۱۱:۰۰ رات',
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
        makeReservation: 'Rezervasyon Bikin',
        getDirections: 'Rê Bistînin'
      },
      footer: {
        description: 'Tamên resen û mêvandariya germ a Kurdistanê tînin ser maseyê we.',
        quickLinks: 'Lînkên Bilez',
        contactInfo: 'Agahiyên Têkiliyê',
        followUs: 'Şopa Me Bikin',
        openDaily: 'YEKŞEM - PÊNCŞEM: 12:00 - 22:00\nÎN - ŞEMÎ: 12:00 - 23:00',
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
      if (sectionId === 'gallery') {
        router.push({ pathname: '/gallery', query: { lang: language } });
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

  // Privacy Policy handler
  const handlePrivacyClick = useCallback(() => {
    // For now, scroll to footer - you can later add a dedicated privacy page
    scrollToSection('footer');
  }, []);

  // Terms of Service handler
  const handleTermsClick = useCallback(() => {
    // For now, scroll to footer - you can later add a dedicated terms page
    scrollToSection('footer');
  }, []);

  // Online order handler
  const handleOrderOnline = useCallback(() => {
    setShowOrderModal(true);
  }, []);

  // Delivery platform handlers
  const handleUberEats = useCallback(() => {
    try {
      // Uber Eats restaurant URL for Nature Village Restaurant
      window.open('https://www.ubereats.com/store/nature-village-restaurant/dR5RyEoLXtarbrxoIn-nqw', '_blank', 'noopener,noreferrer');
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error opening Uber Eats:', error);
    }
  }, []);

  const handleDoorDash = useCallback(() => {
    try {
      // DoorDash restaurant URL for Nature Village Restaurant
      window.open('https://www.doordash.com/store/nature-village-restaurant-suwanee-28955148/36933361/', '_blank', 'noopener,noreferrer');
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error opening DoorDash:', error);
    }
  }, []);

  const handleSlice = useCallback(() => {
    try {
      // Slice restaurant URL for Nature Village Restaurant
      window.open('https://slicelife.com/restaurants/ga/suwanee/30024/nature-village-restaurant/menu', '_blank', 'noopener,noreferrer');
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

  // Live status helper functions
  const getBusyLevelText = useCallback((level) => {
    const busyTexts = {
      en: {
        low: 'Not busy',
        medium: 'Moderately busy',
        high: 'Busy',
        'very-high': 'Very busy'
      },
      ku: {
        low: 'قەرەباڵغی نییە',
        medium: 'قەرەباڵغی مامناوەند',
        high: 'قەرەباڵغی',
        'very-high': 'زۆر قەرەباڵغی'
      },
      ar: {
        low: 'غير مزدحم',
        medium: 'مزدحم قليلاً',
        high: 'مزدحم',
        'very-high': 'مزدحم جداً'
      }
    };
    return busyTexts[language]?.[level] || busyTexts.en[level] || 'Unknown';
  }, [language]);

  const getBusyLevelColor = useCallback((level) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100', 
      high: 'text-orange-600 bg-orange-100',
      'very-high': 'text-red-600 bg-red-100'
    };
    return colors[level] || colors.medium;
  }, []);

  const getStatusIcon = useCallback((isOpen, busyLevel) => {
    if (!isOpen) return '🔴';
    switch (busyLevel) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'very-high': return '🔴';
      default: return '🟡';
    }
  }, []);

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
        
        /* Celebration title animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Floating animation for celebration elements */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Slow spin animation */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Custom utility classes */
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
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
                href="https://www.facebook.com/profile.php?id=61553675771574" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/naturevillageatl" 
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
                        href="https://www.facebook.com/profile.php?id=61553675771574" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-3 rounded-full text-amber-700 hover:text-white hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Follow us on Facebook"
                      >
                        <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      </a>
                      <a 
                        href="https://www.instagram.com/naturevillageatl" 
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
      <section id="home" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.4)',
            }}
          >
            <source src="/hero.mp4" type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
              style={{
                backgroundImage: 'linear-gradient(rgba(139, 69, 19, 0.4), rgba(139, 69, 19, 0.6)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop")'
              }}
            />
          </video>
          
          {/* Additional overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
        </div>
        
        {/* Background Pattern (subtle overlay) */}
        <div className="absolute inset-0 opacity-10">
          <KurdishPattern />
        </div>
        
        <div className={cn('relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 mt-16', rtlClass('', 'text-right'))}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-2xl">
            {t.hero?.title || 'Nature Village'}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light mb-4 text-amber-100">
            {t.hero?.subtitle || 'A Taste of Kurdistan in Every Bite'}
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed text-amber-50">
            {t.hero?.description || 'Experience authentic Kurdish flavors in a warm, traditional setting.'}
          </p>
          
          {/* Enhanced Mobile CTAs - Reorganized Layout */}
          <div className="flex flex-col gap-3 items-center justify-center">
            {/* Top row - Menu and Reservation buttons side by side */}
            <div className="flex flex-row gap-3 items-center justify-center">
              <button 
                onClick={() => scrollToSection('menu')}
                className="group w-28 sm:w-auto bg-transparent border-2 border-amber-400/80 text-amber-200 hover:bg-amber-400/10 hover:border-amber-300 hover:text-amber-100 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Menu</span>
              </button>
              
              <button 
                onClick={() => router.push('/reservations')}
                className="group w-28 sm:w-auto bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white hover:text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Reserve</span>
              </button>
            </div>
            
            {/* Bottom row - Call Now button */}
            <button 
              onClick={() => window.open('tel:+1234567890', '_self')}
              className="group w-28 sm:w-auto bg-transparent border-2 border-green-400/80 text-green-200 hover:bg-green-400/10 hover:border-green-300 hover:text-green-100 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Call Now</span>
            </button>
          </div>
        </div>
        
        {/* Minimal Status Indicator - Bottom */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
            <div className="flex items-center gap-1.5 text-xs text-white">
              <span className="text-xs">{getStatusIcon(restaurantStatus.isOpen, restaurantStatus.busyLevel)}</span>
              <span className="font-medium">
                {restaurantStatus.isOpen ? (
                  <span className="text-green-400">Open</span>
                ) : (
                  <span className="text-red-400">Closed</span>
                )}
              </span>
              {restaurantStatus.isOpen && (
                <>
                  <span className="text-white/50">•</span>
                  <span className="text-white/80">{restaurantStatus.nextClosing}</span>
                </>
              )}
            </div>
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

      {/* About Us Section - Clean & Mobile-Friendly */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <KurdishPattern />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clean Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-amber-700 font-medium text-sm">Our Story</span>
              <Star className="w-4 h-4 text-amber-500 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              {t.about?.title || 'About Nature Village'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bringing authentic Kurdish flavors and warm hospitality to our community
            </p>
          </div>
          
          {/* Main Content - Simple Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
            {/* Image Side - Left on desktop */}
            <div className="order-1">
              <div className="relative">
                <div className="aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="/team.jpg"
                    alt="Nature Village restaurant team"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Simple decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-amber-400 rounded-full opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-6 h-6 bg-orange-400 rounded-full opacity-30"></div>
              </div>
            </div>
            
            {/* Content Side - Right on desktop */}
            <div className="order-2">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t.about?.story1 || 'Nature Village is dedicated to bringing you the authentic flavors of Kurdish cuisine in a warm and welcoming atmosphere where every guest feels like family.'}
                </p>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  {t.about?.story2 || 'Our chefs are passionate about preparing traditional Kurdish dishes using the finest ingredients and time-honored cooking techniques that celebrate our rich culinary heritage.'}
                </p>
                
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <p className="text-amber-800 italic font-medium">
                    "Every dish is crafted with care and served with the warmth of Kurdish hospitality."
                  </p>
                </div>
              </div>
              
              {/* Simple Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Expert Chefs</h4>
                  <p className="text-sm text-gray-600">Authentic Kurdish cuisine</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-orange-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fresh Ingredients</h4>
                  <p className="text-sm text-gray-600">Quality sourced daily</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-red-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Warm Service</h4>
                  <p className="text-sm text-gray-600">Kurdish hospitality</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clean Statistics */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">1000+</div>
                <div className="text-sm font-medium text-gray-700">Happy Customers</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">50+</div>
                <div className="text-sm font-medium text-gray-700">Authentic Dishes</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">4.8★</div>
                <div className="text-sm font-medium text-gray-700">Customer Rating</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">100%</div>
                <div className="text-sm font-medium text-gray-700">Fresh Ingredients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrate Your Special Moments Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {/* Top Curve */}
        <div className="absolute top-0 left-0 w-full h-20 z-10">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            <path 
              d="M0,0 C300,80 600,80 900,40 C1050,20 1150,40 1200,60 L1200,0 Z" 
              fill="white"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
        {/* Video Background */}
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/bday.mp4" type="video/mp4" />
          </video>
          {/* Elegant Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
          {/* Dynamic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-amber-900/20 animate-pulse"></div>
        </div>

        {/* Floating Celebration Elements - positioned to avoid text overlap */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          <div className="absolute top-16 left-8 text-3xl opacity-20 animate-float" style={{animationDelay: '0s'}}>🎈</div>
          <div className="absolute top-32 right-16 text-2xl opacity-30 animate-float" style={{animationDelay: '2s'}}>🎊</div>
          <div className="absolute bottom-40 left-1/6 text-xl opacity-40 animate-float" style={{animationDelay: '4s'}}>✨</div>
          <div className="absolute bottom-24 right-1/4 text-2xl opacity-25 animate-float" style={{animationDelay: '1s'}}>🌟</div>
          <div className="absolute top-1/4 left-3/4 text-xl opacity-20 animate-float" style={{animationDelay: '3s'}}>💫</div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <span className="text-4xl">�</span>
            </div>
            
            <div className="relative">
              {/* Decorative top line */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              
              <h2 className="relative text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
                <span className="relative inline-block">
                  {/* Subtle glow effect behind text */}
                  <span className="absolute inset-0 text-white/10 blur-lg -z-10">{t.celebration?.title || 'Celebrate Your Special Moments'}</span>
                  
                  {/* Main text with elegant styling */}
                  <span className="relative z-10 text-white drop-shadow-lg">
                    {(t.celebration?.title || 'Celebrate Your Special Moments').split(' ').map((word, index) => (
                      <span 
                        key={index} 
                        className="inline-block mr-3 hover:scale-105 transition-transform duration-300 opacity-0 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text"
                        style={{
                          animationDelay: `${index * 300}ms`,
                          animation: 'fadeInUp 0.8s ease-out forwards'
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                  
                  {/* Subtle sparkles - positioned away from text */}
                  <span className="absolute -top-6 -right-8 text-amber-300 text-xl animate-pulse opacity-70 hidden sm:block">✨</span>
                  <span className="absolute -bottom-6 -left-8 text-amber-300 text-lg animate-pulse opacity-50 hidden sm:block" style={{animationDelay: '1s'}}>✨</span>
                </span>
              </h2>
              
              {/* Decorative bottom line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent"></div>
            </div>
            
            <p className="text-sm lg:text-base text-white/80 max-w-2xl mx-auto">
              {t.celebration?.subtitle || 'Make your birthdays, anniversaries, and special occasions unforgettable with authentic Kurdish hospitality'}
            </p>
          </div>

          {/* Enhanced Celebration Options - Optimized for 80vh */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4">
              {/* Birthday Celebrations */}
              <div className="group text-center transform hover:scale-105 transition-all duration-500">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-500 overflow-hidden">
                  {/* Floating particles inside card - positioned in corners away from text */}
                  <div className="absolute top-3 right-3 text-amber-300 text-xs opacity-40 animate-float hidden sm:block">🎈</div>
                  <div className="absolute bottom-3 left-3 text-yellow-300 text-xs opacity-30 animate-float hidden sm:block" style={{animationDelay: '1s'}}>✨</div>
                  
                  {/* Enhanced icon with glow */}
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-2xl opacity-20 scale-150"></div>
                    <div className="relative text-4xl lg:text-5xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter drop-shadow-2xl">🎂</div>
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-white mb-2 group-hover:text-amber-200 transition-colors duration-300">
                    {t.celebration?.birthday?.title || 'Birthday Celebrations'}
                  </h3>
                  <p className="text-white/70 mb-4 text-base italic">
                    {t.celebration?.birthday?.tagline || 'Make it a day to remember'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-amber-300">🎈</span>
                      <span className="text-xs">{t.celebration?.birthday?.feature1 || 'Complimentary birthday cake & candles'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-amber-300">🎵</span>
                      <span className="text-xs">{t.celebration?.birthday?.feature2 || 'Traditional Kurdish birthday songs'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-amber-300">📸</span>
                      <span className="text-xs">{t.celebration?.birthday?.feature3 || 'Professional photo memories'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-amber-300">🎁</span>
                      <span className="text-xs">{t.celebration?.birthday?.feature4 || 'Special birthday decorations'}</span>
                    </div>
                  </div>
                  
                  <div className="relative bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-2 border border-amber-400/30 group-hover:border-amber-400/60 transition-all duration-300 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <p className="relative text-amber-200 font-medium group-hover:text-amber-100 transition-colors duration-300 text-xs">
                      <span className="text-yellow-300">🌟 </span>
                      {t.celebration?.birthday?.special || 'Perfect for birthday parties of all sizes'}
                      <span className="text-yellow-300"> 🌟</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Anniversary Celebrations */}
              <div className="group text-center transform hover:scale-105 transition-all duration-500">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-rose-400/50 transition-all duration-500 overflow-hidden">
                  {/* Floating particles inside card */}
                  <div className="absolute top-4 right-4 text-rose-300 text-sm opacity-50 animate-float" style={{animationDelay: '0.5s'}}>🌹</div>
                  <div className="absolute bottom-6 left-6 text-pink-300 text-xs opacity-40 animate-float" style={{animationDelay: '1.5s'}}>💕</div>
                  
                  {/* Enhanced icon with glow */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 scale-150"></div>
                    <div className="relative text-5xl lg:text-6xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter drop-shadow-2xl">�</div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-3 group-hover:text-rose-200 transition-colors duration-300">
                    {t.celebration?.anniversary?.title || 'Anniversary Dinners'}
                  </h3>
                  <p className="text-white/70 mb-6 text-lg italic">
                    {t.celebration?.anniversary?.tagline || 'Celebrate your love story'}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-rose-300">🌹</span>
                      <span className="text-sm">{t.celebration?.anniversary?.feature1 || 'Romantic table setup with roses'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-rose-300">🥂</span>
                      <span className="text-sm">{t.celebration?.anniversary?.feature2 || 'Complimentary dessert for two'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-rose-300">🕯️</span>
                      <span className="text-sm">{t.celebration?.anniversary?.feature3 || 'Candlelit dining experience'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      <span className="text-rose-300">💌</span>
                      <span className="text-sm">{t.celebration?.anniversary?.feature4 || 'Personalized anniversary card'}</span>
                    </div>
                  </div>
                  
                  <div className="relative bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-2xl p-3 border border-rose-400/30 group-hover:border-rose-400/60 transition-all duration-300 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <p className="relative text-rose-200 font-medium group-hover:text-rose-100 transition-colors duration-300 text-sm">
                      <span className="text-pink-300">💖 </span>
                      {t.celebration?.anniversary?.special || '25+ years together? Special surprise awaits!'}
                      <span className="text-pink-300"> 💖</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Other Celebrations Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="group text-center p-5 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-2xl lg:text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎓</div>
                </div>
                <div className="text-white font-medium group-hover:text-amber-200 transition-colors duration-300 text-sm">Graduations</div>
              </div>
              <div className="group text-center p-5 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-2xl lg:text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">💍</div>
                </div>
                <div className="text-white font-medium group-hover:text-pink-200 transition-colors duration-300 text-sm">Engagements</div>
              </div>
              <div className="group text-center p-5 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-2xl lg:text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">👨‍👩‍👧‍👦</div>
                </div>
                <div className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300 text-sm">Family Reunions</div>
              </div>
              <div className="group text-center p-5 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-green-400/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-2xl lg:text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎄</div>
                </div>
                <div className="text-white font-medium group-hover:text-green-200 transition-colors duration-300 text-sm">Holidays</div>
              </div>
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-3xl blur-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 border border-white/20 backdrop-blur-lg">
                {/* Floating particles around CTA - positioned in safe corners */}
                <div className="absolute top-3 left-3 text-amber-300 text-sm opacity-25 animate-float hidden sm:block">✨</div>
                <div className="absolute top-3 right-3 text-orange-300 text-sm opacity-30 animate-float hidden sm:block" style={{animationDelay: '1s'}}>�</div>
                <div className="absolute bottom-3 left-3 text-yellow-300 text-xs opacity-20 animate-float hidden sm:block" style={{animationDelay: '2s'}}>💫</div>
                <div className="absolute bottom-3 right-3 text-red-300 text-xs opacity-25 animate-float hidden sm:block" style={{animationDelay: '0.5s'}}>✨</div>
                
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300">
                  {t.celebration?.cta?.title || 'Ready to Celebrate?'}
                </h3>
                <p className="text-white/80 mb-6 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
                  {t.celebration?.cta?.subtitle || 'Let us make your special day extraordinary with authentic Kurdish hospitality and unforgettable flavors'}
                </p>
                
                <div className="text-white text-lg lg:text-xl font-semibold">
                  📞 {t.celebration?.cta?.reserve || 'Call for special reservation'} 📞
                </div>
                
                <p className="text-white/60 text-sm mt-4 flex items-center justify-center gap-2">
                  <span className="text-amber-300">💡</span>
                  <span>Book 48 hours in advance for the best celebration experience</span>
                </p>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full h-20 z-10">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            <path 
              d="M0,120 C300,40 600,40 900,80 C1050,100 1150,80 1200,60 L1200,120 Z" 
              fill="white"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </section>

      {/* Customer Reviews Section - Enhanced */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-amber-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <KurdishPattern />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            {/* Google Badge */}
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-lg mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Google Reviews</span>
                <div className="flex items-center gap-1 ml-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">4.8</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-amber-800 mb-6">
              {t.reviews?.title || 'What Our Guests Say'}
            </h2>
            <p className="text-lg sm:text-xl text-amber-600 max-w-4xl mx-auto leading-relaxed">
              {t.reviews?.subtitle || 'Rated 4.8/5 stars by 572+ happy customers on Google Reviews'}
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-8 rounded-full"></div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-800">572+</div>
                <div className="text-sm sm:text-base text-amber-600 font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-800">4.8★</div>
                <div className="text-sm sm:text-base text-amber-600 font-medium">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-800">93%</div>
                <div className="text-sm sm:text-base text-amber-600 font-medium">5-Star Reviews</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Review 1 - Karen Cardenas - Featured Review */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden border border-amber-100">
              {/* Featured Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-bl-2xl text-xs font-bold">
                FEATURED
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-800">5.0</span>
                <span className="text-sm text-gray-500 ml-2">• 1 week ago</span>
              </div>
              
              <blockquote className="text-gray-800 text-base leading-relaxed mb-8 font-medium">
                {t.reviews?.review1?.text || '"I\'ve been coming here for about a year, and it\'s hands down my favorite restaurant! The food is authentic and absolutely delicious—every dish is full of flavor, the specialty teas and coffees are amazing, and the desserts are the perfect ending to any meal."'}
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {t.reviews?.review1?.name || 'Karen Cardenas'}
                  </div>
                  <div className="text-amber-600 text-sm font-medium">
                    {t.reviews?.review1?.location || 'Verified Google Review'}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Verified Purchase</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review 2 - Ruth Cornea */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden border border-green-100">
              {/* Local Guide Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Users className="w-3 h-3" />
                LOCAL GUIDE
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-800">5.0</span>
                <span className="text-sm text-gray-500 ml-2">• 2 months ago</span>
              </div>
              
              <blockquote className="text-gray-800 text-base leading-relaxed mb-8 font-medium">
                {t.reviews?.review2?.text || '"We had a wonderful time at Nature Village Restaurant tonight! Everything was absolutely perfect! The food, atmosphere, decor and service is all top notch. This is definitely our new favorite spot for authentic Middle Eastern cuisine."'}
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {t.reviews?.review2?.name || 'Ruth Cornea'}
                  </div>
                  <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    {t.reviews?.review2?.location || 'Local Guide • 29 reviews'}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Trusted Reviewer</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review 3 - Enhanced with Food Focus */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden border border-purple-100">
              {/* Dish Highlight */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ChefHat className="w-3 h-3" />
                QUZI LOVER
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-800">5.0</span>
                <span className="text-sm text-gray-500 ml-2">• Recent</span>
              </div>
              
              <blockquote className="text-gray-800 text-base leading-relaxed mb-8 font-medium">
                {t.reviews?.review3?.text || '"I ordered the Quzi, a rice and lamb dish, it was very filling and delicious. The pizza was of a good size filled with gyro meat, cheese and a nice sauce. The authentic Middle Eastern flavors really impressed me and my family!"'}
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {t.reviews?.review3?.name || 'Google Customer'}
                  </div>
                  <div className="text-purple-600 text-sm font-medium">
                    {t.reviews?.review3?.location || 'Verified Google Review'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Food Enthusiast</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Call to Action */}
          <div className="text-center mt-16 sm:mt-20">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 mb-4">
                Ready to Create Your Own 5-Star Experience?
              </h3>
              <p className="text-base sm:text-lg text-amber-700 mb-8 max-w-2xl mx-auto">
                {t.reviews?.cta || 'Join 572+ satisfied customers who love our authentic cuisine! Book your table today and taste the difference that authentic Kurdish hospitality makes.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => setCurrentSection('reservations')}
                  className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
                >
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{t.reviews?.ctaButton || 'Book Your Table Now'}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <a 
                  href="tel:+14703501019"
                  className="group bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-300 hover:border-amber-400 px-8 py-4 rounded-2xl text-base font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Call (470) 350-1019</span>
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-amber-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>4.8★ Google Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>572+ Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Family Owned</span>
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
                <span className="block">
                  {t.footer?.openDaily?.split('\n')[0] || 'SUN - THU: 12 AM - 10 PM'}
                </span>
                <span className="block">
                  {t.footer?.openDaily?.split('\n')[1] || 'FRI - SAT: 12 AM - 11 PM'}
                </span>
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
                302 Satellite Blvd NE STE 125<br />
                Suwanee, GA 30024<br />
                <button 
                  onClick={() => window.open('https://maps.app.goo.gl/4rmfzb2YM4Usx8CQ9', '_blank')}
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
                  (470) 350-1019
                </a>
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
                <a 
                  href="https://www.facebook.com/profile.php?id=61553675771574" 
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
                  <button 
                    onClick={handlePrivacyClick}
                    className="text-amber-200 hover:text-white transition-colors text-sm block"
                  >
                    {t.footer?.privacy || 'Privacy Policy'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleTermsClick}
                    className="text-amber-200 hover:text-white transition-colors text-sm block"
                  >
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
                <div className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div>{t.footer?.openDaily?.split('\n')[0] || 'SUN - THU: 12 AM - 10 PM'}</div>
                    <div>{t.footer?.openDaily?.split('\n')[1] || 'FRI - SAT: 12 AM - 11 PM'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-amber-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-amber-200 text-sm text-center sm:text-left">
                {t.footer?.copyright || '© 2025 Nature Village Kurdish Restaurant. All rights reserved.'}
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
          <div className="order-modal bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Order Online</h3>
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
              <p className="text-gray-600 mb-6 text-center">
                Choose your preferred delivery platform for pickup or delivery
              </p>
              
              {/* Delivery Platform Buttons */}
              <div className="space-y-3">
                {/* Uber Eats Button */}
                <button
                  onClick={handleUberEats}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Uber Eats
                </button>

                {/* DoorDash Button */}
                <button
                  onClick={handleDoorDash}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  DoorDash
                </button>

                {/* Slice Button */}
                <button
                  onClick={handleSlice}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Slice
                </button>
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