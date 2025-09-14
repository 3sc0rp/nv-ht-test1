/**
 * README (Menu Page Refactor)
 * - Performance: next/image, memoized filters/search, reduced-motion support, no window/document on server.
 * - Accessibility: landmarks, skip link, keyboard shortcuts, ARIA labels, focus rings.
 * - SEO: canonical + hreflang, Open Graph, JSON-LD for Restaurant/Menu/MenuItem.
 * - i18n/RTL: language switcher updates html[lang|dir]; full RTL-aware layout; getText helper.
 * - How to extend: add translations/items where existing objects are defined; counts and JSON-LD update automatically.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Menu, X, Globe, Filter, Phone, Search, Clock, Star, MapPin, Facebook, Instagram, MessageCircle, ChefHat, ChevronDown, ChevronRight, Home, Utensils, Info, Camera, Calendar, Users, ExternalLink, Share2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { LANGUAGES, getText as tGet, updateDocumentLanguage, generateHreflangAlternates } from '../lib/i18n'
import { useLanguage } from '../contexts/LanguageContext'
import { useReducedMotion } from '../lib/menu/useReducedMotion'
import { generateMenuJsonLD } from '../lib/menu/jsonld'

import Footer from '../components/Footer'
import Header from '../components/Header'



const FullMenuPage = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentSection, setCurrentSection] = useState('menu')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOrderModal, setShowOrderModal] = useState(false)
  const reducedMotion = useReducedMotion()

  // Use shared language config
  const languages = LANGUAGES

  // Handle order online navigation
  const handleOrderOnline = () => {
    setShowOrderModal(true)
  }

  // Handle delivery platform selection
  const handleDeliveryPlatform = (platform) => {
    try {
      let url = ''
      switch (platform) {
        case 'ubereats':
          url = 'https://www.ubereats.com/store/nature-village-restaurant/dR5RyEoLXtarbrxoIn-nqw'
          break
        case 'doordash':
          url = 'https://www.doordash.com/store/nature-village-restaurant-suwanee-28955148/36933361/'
          break
        case 'slice':
          url = 'https://slicelife.com/restaurants/ga/suwanee/30024/nature-village-restaurant/menu'
          break
        default:
          url = 'https://your-online-ordering-url.com'
      }
      window.open(url, '_blank', 'noopener,noreferrer')
      setShowOrderModal(false)
    } catch (error) {
      console.error('Error opening delivery platform:', error)
    }
  }

  // Enhanced scroll effects with error handling
  useEffect(() => {
    try {
      const handleScroll = () => {
        if (typeof window !== 'undefined') {
          setIsScrolled(window.scrollY > 20);
        }
      };
      
      if (typeof window !== 'undefined') {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }
    } catch (error) {
      console.error('Error setting up scroll handler:', error);
    }
  }, []);

  // Handle component mounting with error handling
  useEffect(() => {
    try {
      setIsMounted(true);
    } catch (error) {
      console.error('Error during component mounting:', error);
    }
  }, []);

  // Enhanced keyboard shortcuts with error handling
  useEffect(() => {
    try {
      const handleKeyDown = (event) => {
        // Escape to close language dropdown
        if (event.key === 'Escape') {
          setShowLanguageDropdown(false);
          setIsMenuOpen(false);
        }
        
        // Ctrl/Cmd + K to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          try {
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) {
              searchInput.focus();
            }
          } catch (error) {
            console.warn('Could not focus search input:', error);
          }
        }
        
        // Ctrl/Cmd + / to clear search
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
          event.preventDefault();
          setSearchTerm('');
        }
      };

      if (typeof document !== 'undefined') {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    } catch (error) {
      console.error('Error setting up keyboard shortcuts:', error);
    }
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown]);

  // Sync language with query param and handle document attributes safely
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const qpLang = typeof router.query.lang === 'string' ? router.query.lang : undefined;
      if (qpLang && languages[qpLang]) {
        setLanguage(qpLang);
        updateDocumentLanguage(qpLang);
      } else {
        updateDocumentLanguage(language);
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }, [router.query.lang, language, isMounted]);

  // Navigation handler for menu page
  const scrollToSection = useCallback((sectionId) => {
    try {
      // Handle order online button
      if (sectionId === 'orderOnline') {
        handleOrderOnline();
        return;
      }
      
      // Handle navigation to other pages
      if (sectionId === 'home') {
        router.push({ pathname: '/', query: { lang: language } });
        return;
      }
      if (sectionId === 'menu') {
        // Already on menu page, scroll to top (guard against SSR)
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (sectionId === 'reservations') {
        router.push({ pathname: '/reservations', query: { lang: language } });
        return;
      }
      if (sectionId === 'catering') {
        router.push({ pathname: '/catering', query: { lang: language } });
        return;
      }
      if (sectionId === 'admin') {
        router.push({ pathname: '/admin', query: { lang: language } });
        return;
      }
      if (sectionId === 'about' || sectionId === 'gallery' || sectionId === 'visit') {
        router.push({ pathname: '/', query: { lang: language }, hash: sectionId });
        return;
      }

      setCurrentSection(sectionId);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error handling navigation:', error);
    }
  }, [router, language]);

  // Privacy Policy handler
  const handlePrivacyClick = useCallback(() => {
    // For now, scroll to footer - you can later add a dedicated privacy page
    scrollToSection('footer');
  }, [scrollToSection]);

  // Terms of Service handler
  const handleTermsClick = useCallback(() => {
    // For now, scroll to footer - you can later add a dedicated terms page
    scrollToSection('footer');
  }, [scrollToSection]);

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

  // Helper functions
  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  const rtlClass = (ltrClass, rtlClass = '') => {
    return isRTL ? rtlClass : ltrClass;
  };

  // Enhanced getText function that handles multilingual objects with Russian/Hindi fallbacks
  const getText = useCallback((textObj, fallbackKey = '') => {
    // First try the standard getText function
    let result = tGet(textObj, language, fallbackKey);
    
    // If we get 'Translation missing' for Russian or Hindi, try to provide a basic fallback
    if (result === 'Translation missing' && (language === 'ru' || language === 'hi') && textObj && typeof textObj === 'object') {
      // If we have English text, use it as fallback for Russian/Hindi
      if (textObj.en) {
        result = textObj.en;
      }
    }
    
    return result;
  }, [language]);

  // Enhanced carousel state management with viewport tracking
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(1024); // Default fallback
  const [isMobile, setIsMobile] = useState(false);

  // Middle Eastern pattern SVG for decorative elements
  const MiddleEasternPattern = () => (
    <svg className="absolute opacity-5 w-full h-full" viewBox="0 0 400 400">
      <defs>
        <pattern id="middleEasternPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#8B4513"/>
          <polygon points="25,5 45,25 25,45 5,25" fill="#D2B48C"/>
          <circle cx="25" cy="25" r="8" fill="#6B8E23"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#middleEasternPattern)"/>
    </svg>
  );

  // Enhanced dish data with more properties - INTERNATIONALIZED
  // Curated selection of featured dishes from the complete menu for the carousel
  const dishes = useMemo(() => [
    { 
      id: 1701, 
      name: {
        en: 'Parda Biryani',
        ar: 'برياني برده',
        fa: 'برانی پرده',
        ku: 'برانیی پەردە',
        tr: 'Perde Biryani',
        ur: 'پردہ بریانی',
        kmr: 'Bîryanî ya Perde',
        es: 'Biryani Parda',
        ru: 'Парда Бирьяни',
        hi: 'परदा बिरयानी',
        sq: 'Parda Biryani',
        fr: 'Biryani Parda',
        de: 'Parda Biryani',
        bn: 'পরদা বিরিয়ানি',
        ko: '파르다 비리야니',
        bs: 'Parda Biryani',
        zh: '帕尔达比尔亚尼'
      }, 
      category: {
        en: 'Specialty',
        ar: 'أطباق مميزة',
        fa: 'غذاهای ویژه',
        ku: 'خۆراکی تایبەتی',
        tr: 'Özel Yemekler',
        ur: 'خصوصی ڈشز',
        kmr: 'Xwarinên Taybet',
        es: 'Especialidad',
        ru: 'Фирменные блюда',
        hi: 'विशेष व्यंजन',
        sq: 'Specialitetet',
        fr: 'Spécialités',
        de: 'Spezialitäten',
        bn: 'বিশেষত্ব',
        ko: '특선요리',
        bs: 'Specijalitet',
        zh: '特色菜'
      }, 
      placeholder: 'biryani', 
      imageUrl: '/pbiryani.jpg',
      description: {
        en: 'Traditional layered rice dish with aromatic spices and tender meat',
        ar: 'طبق أرز طبقي تقليدي بالتوابل العطرية واللحم الطري',
        fa: 'غذای سنتی برنج لایه‌ای با ادویه‌جات معطر و گوشت نرم',
        ku: 'خۆراکی نەریتی برنجی چینە چینە لەگەڵ بەهاراتی بۆنخۆش و گۆشتی نەرم',
        tr: 'Aromatik baharat ve yumuşak etle geleneksel katmanlı pirinç yemeği',
        ur: 'خوشبودار مصالحوں اور نرم گوشت کے ساتھ روایتی تہدار چاول کا کھانا',
        kmr: 'Xwarinê kevneşopî ya brincê çîndar bi baharatên bêhnxweş û goştê nerm',
        es: 'Plato tradicional de arroz en capas con especias aromáticas y carne tierna',
        ru: 'Традиционное слоёное рисовое блюдо с ароматными специями и нежным мясом',
        hi: 'सुगंधित मसालों और नरम मांस के साथ पारंपरिक परतदार चावल का व्यंजन',
        sq: 'Pjatë tradicionale orizi me shtresa me erëza aromatike dhe mish të butë',
        fr: 'Plat traditionnel de riz en couches avec des épices aromatiques et de la viande tendre',
        de: 'Traditionelles Schichtreisgericht mit aromatischen Gewürzen und zartem Fleisch',
        bn: 'সুগন্ধি মশলা এবং কোমল মাংসের সাথে ঐতিহ্যবাহী স্তরযুক্ত ভাতের খাবার',
        ko: '향긋한 향신료와 부드러운 고기를 넣은 전통적인 층층이 쌓은 쌀 요리',
        bs: 'Tradicionalno jelo od rižo sa aromatskim začinima i nježnim mesom u slojevima',
        zh: '传统分层米饭配芳香香料和嫩肉'
      },
      color: '#FF6B6B'
    },
    { 
      id: 1802, 
      name: {
        en: 'Mahshi Kabab',
        ar: 'كباب محشي',
        fa: 'کباب محشی',
        ku: 'کەبابی پڕکراوە',
        tr: 'Mahşi Kebap',
        ur: 'محشی کباب',
        kmr: 'Kebaba Dagirtî',
        es: 'Mahshi Kabab',
        ru: 'Махши Кебаб',
        hi: 'महशी कबाब',
        sq: 'Mahshi Kabab',
        fr: 'Kebab Mahshi',
        de: 'Mahshi Kebab',
        bn: 'মাহশি কাবাব',
        ko: '마시 카밥'
      }, 
      category: {
        en: 'Grill',
        ar: 'مشاوي',
        fa: 'کباب و گریل',
        ku: 'پلێتەری گرێل',
        tr: 'Izgara Tabaklar',
        ur: 'گرل پلیٹرز',
        kmr: 'Platerên Grill',
        es: 'Parrilla',
        ru: 'Гриль',
        hi: 'ग्रिल प्लेटर',
        sq: 'Pjatat e Grilit',
        fr: 'Plats Grillés',
        de: 'Grillgerichte',
        bn: 'গ্রিল',
        ko: '그릴'
      }, 
      placeholder: 'kebab', 
      imageUrl: '/mkabab.jpg',
      description: {
        en: 'Beef and lamb kabab flavored with garlic, spicy peppers, and parsley',
        ar: 'كباب لحم بقر وخروف منكه بالثوم والفلفل الحار والبقدونس',
        fa: 'کباب گوشت گاو و بره با طعم سیر، فلفل تند و جعفری',
        ku: 'کەبابی گۆشتی گا و بەرخ بە تامی سیر، بیبەری تەند و جەعدە',
        tr: 'Sarımsak, acı biber ve maydanozla tatlandırılmış dana ve kuzu kebap',
        ur: 'لہسن، تیز مرچ اور دھنیے سے ذائقہ دار گائے اور بھیڑ کا کباب',
        kmr: 'Kebaba goştê ga û berxî ya bi sîr, biberên tûj û şînî hatiye tamdar kirin',
        es: 'Kabab de carne de res y cordero sazonado con ajo, pimientos picantes y perejil',
        ru: 'Кебаб из говядины и баранины с чесноком, острым перцем и петрушкой',
        hi: 'लहसुन, तेज़ मिर्च और अजमोद के साथ गोमांस और भेड़ के बच्चे का कबाब',
        sq: 'Kabab viçi dhe deleje me shije hudhra, speca të egos dhe majdanoz',
        fr: 'Kebab de bœuf et d\'agneau assaisonné à l\'ail, aux piments forts et au persil',
        de: 'Rind- und Lamm-Kebab gewürzt mit Knoblauch, scharfen Paprika und Petersilie',
        bn: 'রসুন, ঝাল মরিচ এবং পার্সলে দিয়ে তৈরি গরু ও মেষের কাবাব',
        ko: '마늘, 매운 고추, 파슬리로 양념한 소고기와 양고기 카밥'
      },
      color: '#A0522D'
    },
    { 
      id: 1001, 
      name: {
        en: 'Hummus',
        ar: 'حمص',
        fa: 'حمص',
        ku: 'حومس',
        tr: 'Humus',
        ur: 'حمص',
        kmr: 'Humus',
        es: 'Hummus',
        ru: 'Хумус',
        hi: 'हम्मुस',
        sq: 'Humus',
        fr: 'Houmous',
        de: 'Hummus',
        bn: 'হুমুস',
        ko: '후무스'
      }, 
      category: {
        en: 'Appetizer',
        ar: 'مقبلات',
        fa: 'پیش‌غذا',
        ku: 'خۆراکی پێش‌خواردن',
        tr: 'Başlangıç',
        ur: 'سٹارٹر',
        kmr: 'Destpêk',
        es: 'Aperitivo',
        ru: 'Закуски',
        hi: 'स्टार्टर',
        sq: 'Aperitivë',
        fr: 'Apéritifs',
        de: 'Vorspeisen',
        bn: 'ক্ষুধাবর্ধক',
        ko: '애피타이저'
      }, 
      placeholder: 'hummus', 
      imageUrl: '/hummus.jpg',
      description: {
        en: 'Creamy chickpea dip with tahini, olive oil, and warm pita bread',
        ar: 'غموس الحمص الكريمي مع الطحينة وزيت الزيتون والخبز الدافئ',
        fa: 'دیپ خامه‌ای نخود با طحینه، روغن زیتون و نان پیتای گرم',
        ku: 'دیپی کرێمی نۆک لەگەڵ تەحینە، زەیتی زەیتوون و نانی پیتای گەرم',
        tr: 'Tahin, zeytinyağı ve sıcak pide ile kremalı nohut ezme',
        ur: 'تاہینی، زیتون کا تیل اور گرم پیٹا بریڈ کے ساتھ کریمی چنے کا ڈپ',
        kmr: 'Dîpa krêmî ya noyan bi tahînî, zeyta zeytûnê û nanê pita yê germ',
        es: 'Salsa cremosa de garbanzos con tahini, aceite de oliva y pan pita caliente',
        ru: 'Кремовая закуска из нута с тахини, оливковым маслом и тёплой питой',
        hi: 'तिल का पेस्ट, जैतून का तेल और गर्म पीटा ब्रेड के साथ मलाईदार चने का डिप',
        sq: 'Sos kremoz me groftha me tahini, vaj ulliri dhe bukë pita të ngrohtë',
        fr: 'Dip crémeux aux pois chiches avec tahini, huile d\'olive et pain pita chaud',
        de: 'Cremiger Kichererbsen-Dip mit Tahini, Olivenöl und warmem Pita-Brot'
      },
      color: '#D2B48C'
    },
    { 
      id: 2201, 
      name: {
        en: 'Baklava',
        ar: 'بقلاوة',
        fa: 'باقلوا',
        ku: 'بەقلاوا',
        tr: 'Baklava',
        ur: 'بقلاوہ',
        kmr: 'Beqlawa',
        es: 'Baklava',
        ru: 'Баклава',
        hi: 'बकलावा',
        sq: 'Bakllava',
        fr: 'Baklava',
        de: 'Baklava',
        bn: 'বাকলাভা',
        ko: '바클라바'
      }, 
      category: {
        en: 'Dessert',
        ar: 'حلويات',
        fa: 'دسر',
        ku: 'شیرینی',
        tr: 'Tatlı',
        ur: 'میٹھا',
        kmr: 'Şîrînî',
        es: 'Postre',
        ru: 'Десерты',
        hi: 'मिठाई',
        sq: 'Ëmbëlsira',
        fr: 'Desserts',
        de: 'Desserts',
        bn: 'মিষ্টান্ন',
        ko: '디저트'
      }, 
      placeholder: 'baklava', 
      imageUrl: '/baklava.jpg',
      description: {
        en: 'Sweet pastry with layers of nuts and honey in delicate phyllo',
        ar: 'معجنات حلوة مع طبقات من المكسرات والعسل في عجينة فيلو الرقيقة',
        fa: 'شیرینی خمیری با لایه‌هایی از آجیل و عسل در فیلوی ظریف',
        ku: 'شیرینییەکی خەمیری لەگەڵ چینە چینە گوێز و هەنگوین لە فیلۆی ناسک',
        tr: 'İnce yufka içinde fındık ve bal katmanları ile tatlı hamur işi',
        ur: 'نازک فیلو میں گری اور شہد کی تہوں کے ساتھ میٹھی پیسٹری',
        kmr: 'Pîrokek şîrîn bi çînên gûz û hingivê di fîloya nazik de',
        es: 'Dulce hojaldre con capas de nueces y miel en delicada masa filo',
        ru: 'Сладкое пирожное со слоями орехов и мёда в нежном тесте фило',
        hi: 'नाजुक फिलो में नट्स और शहद की परतों के साथ मीठी पेस्ट्री',
        sq: 'Ëmbëlsirë me shtresa arrash dhe mjaltë në brumë delikat fillo',
        fr: 'Pâtisserie sucrée avec des couches de noix et de miel dans une délicate pâte phyllo',
        de: 'Süßes Gebäck mit Nuss- und Honigschichten in zartem Phyllo-Teig',
        bn: 'সূক্ষ্ম ফিলো পেস্ট্রিতে বাদাম এবং মধুর স্তর সহ মিষ্টি পেস্ট্রি',
        ko: '섬세한 필로 페이스트리에 견과류와 꿀이 층층이 들어간 달콤한 페이스트리'
      },
      color: '#DEB887'
    },
    { 
      id: 1201, 
      name: {
        en: 'Chicken Shawarma Sandwich',
        ar: 'ساندويش شاورما الدجاج',
        fa: 'ساندویچ شاورما مرغ',
        ku: 'ساندویچی شاوەرمای مریشک',
        tr: 'Tavuk Döner Sandviç',
        ur: 'چکن شاورما سینڈوچ',
        kmr: 'Sandwîça Şawermaya Mirîşk',
        es: 'Sándwich de Shawarma de Pollo',
        ru: 'Сэндвич с шавармой из курицы',
        hi: 'चिकन शावरमा सैंडविच',
        sq: 'Sandwich Shawarma Pule',
        fr: 'Sandwich Shawarma au Poulet',
        de: 'Hähnchen Schawarma Sandwich',
        bn: 'চিকেন শাওয়ারমা স্যান্ডউইচ',
        ko: '치킨 샤와르마 샌드위치'
      }, 
      category: {
        en: 'Sandwich',
        ar: 'سندويش',
        fa: 'ساندویچ',
        ku: 'ساندویچ',
        tr: 'Sandviç',
        ur: 'سینڈوچ',
        kmr: 'Sandwîç',
        es: 'Sándwich',
        ru: 'Сэндвич',
        hi: 'सैंडविच',
        sq: 'Sandwich',
        fr: 'Sandwich',
        de: 'Sandwich',
        bn: 'স্যান্ডউইচ',
        ko: '샌드위치'
      }, 
      placeholder: 'shawarma', 
      imageUrl: '/chk.jpg',
      description: {
        en: 'Tender marinated chicken wrapped in fresh pita with vegetables and sauce',
        ar: 'دجاج متبل طري ملفوف في خبز البيتا الطازج مع الخضروات والصلصة',
        fa: 'مرغ مزه‌دار نرم پیچیده در نان پیتای تازه با سبزیجات و سس',
        ku: 'مریشکی نەرمی تامدراو لە نانی پیتای تازە پێچراوەتەوە لەگەڵ سەوزە و سۆس',
        tr: 'Taze pidede sebze ve sosla sarılmış yumuşak marine tavuk',
        ur: 'تازہ پیٹا میں سبزیوں اور ساس کے ساتھ لپیٹا گیا نرم میرینیٹ چکن',
        kmr: 'Mirîşkê nerm ê marînekirî di nanê pita yê taze de bi sebze û soşê hatiye pêçandin',
        es: 'Pollo marinado tierno envuelto en pita fresca con verduras y salsa',
        ru: 'Нежная маринованная курица, завёrнутая в свежую питу с овощами и соусом',
        hi: 'सब्जियों और सॉस के साथ ताजा पीटा में लपेटा गया नर्म मैरिनेटेड चिकन',
        sq: 'Pulë e butë e marinuar e mbështjellë në pita të freskët me perime dhe salcë',
        fr: 'Poulet mariné tendre enroulé dans du pain pita frais avec des légumes et de la sauce',
        de: 'Zartes mariniertes Hähnchen in frischem Pita mit Gemüse und Sauce',
        bn: 'তাজা পিটা রুটিতে সবজি এবং সস সহ মোড়ানো নরম ম্যারিনেটেড চিকেন',
        ko: '신선한 피타 빵에 야채와 소스와 함께 감싼 부드러운 양념 치킨'
      },
      color: '#FFD93D'
    },
    { 
      id: 2104, 
      name: {
        en: 'Karak Chai',
        ar: 'شاي كرك',
        fa: 'چای کرک',
        ku: 'چایی کەرەک',
        tr: 'Karak Çayı',
        ur: 'کرک چائے',
        kmr: 'Çaya Karak',
        es: 'Té Karak',
        ru: 'Карак чай',
        hi: 'करक चाय',
        sq: 'Çaj Karak',
        fr: 'Thé Karak',
        de: 'Karak Tee',
        bn: 'কারাক চা',
        ko: '카라크 차이'
      }, 
      category: {
        en: 'Hot Drinks',
        ar: 'المشروبات الساخنة',
        fa: 'نوشیدنی‌های گرم',
        ku: 'خواردنەوەکانی گەرەم',
        tr: 'Sıcak İçecekler',
        ur: 'گرم مشروبات',
        kmr: 'Vexwarinên Germ',
        es: 'Bebidas Calientes',
        ru: 'Горячие напитки',
        hi: 'पेय (गर्म)',
        sq: 'Pije (të Nxehta)',
        fr: 'Boissons Chaudes',
        de: 'Heiße Getränke',
        bn: 'গরম পানীয়',
        ko: '뜨거운 음료'
      }, 
      placeholder: 'tea', 
      imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop',
      description: {
        en: 'Spiced tea with milk and cardamom, a traditional Middle Eastern favorite',
        ar: 'شاي بالتوابل مع الحليب والهيل، مفضل تقليدي من الشرق الأوسط',
        fa: 'چای ادویه‌دار با شیر و هل، محبوب سنتی خاورمیانه',
        ku: 'چایی بەهاراتدار لەگەڵ شیر و هەڵ، خۆشەویستی نەریتی ڕۆژهەڵاتی ناوین',
        tr: 'Süt ve kakule ile baharatlı çay, geleneksel Orta Doğu favorisi',
        ur: 'دودھ اور الائچی کے ساتھ مصالحہ دار چائے، روایتی مشرق وسطیٰ کی پسندیدہ',
        kmr: 'Çaya baharatdar bi şîr û hêl, hezkirina kevneşopî ya Rojhilatê Navîn',
        es: 'Té especiado con leche y cardamomo, un favorito tradicional de Oriente Medio',
        ru: 'Пряный чай с молоком и кардамоном, традиционный ближневосточный фаворит',
        hi: 'दूध और इलायची के साथ मसालेदार चाय, एक पारंपरिक मध्य पूर्वी पसंदीदा',
        sq: 'Çaj me erëza me qumësht dhe hil, një e preferuar tradicionale e Lindjes së Mesme',
        fr: 'Thé épicé au lait et à la cardamome, un favori traditionnel du Moyen-Orient',
        de: 'Gewürztee mit Milch und Kardamom, ein traditioneller Favorit des Nahen Ostens',
        bn: 'দুধ এবং এলাচ সহ মশলাযুক্ত চা, একটি ঐতিহ্যবাহী মধ্যপ্রাচ্যের প্রিয়',
        ko: '우유와 카다몬이 들어간 향신료 차, 전통적인 중동의 인기 음료'
      },
      color: '#8B4513'
    }
  ], []); // Remove language dependency to prevent dish array regeneration

  // Enhanced auto-rotation with optimized timing and error handling
  useEffect(() => {
    if (isCarouselPaused || !isAutoPlaying || reducedMotion) return;
    
    try {
      const interval = setInterval(() => {
        setCurrentDishIndex((prev) => (prev + 1) % dishes.length);
      }, 5000); // Improved 5-second timing for better viewing experience

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error in carousel auto-rotation:', error);
    }
  }, [dishes.length, isCarouselPaused, isAutoPlaying, reducedMotion]);

  // Respect prefers-reduced-motion by disabling autoplay
  useEffect(() => {
    if (reducedMotion) {
      setIsAutoPlaying(false)
    }
  }, [reducedMotion])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setCurrentDishIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
          break;
        case 'ArrowRight':
          event.preventDefault();
          setCurrentDishIndex((prev) => (prev + 1) % dishes.length);
          break;
        case ' ':
          event.preventDefault();
          setIsAutoPlaying(prev => !prev);
          break;
        case 'Home':
          event.preventDefault();
          setCurrentDishIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentDishIndex(dishes.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dishes.length]);

  // Viewport tracking for responsive carousel behavior with error handling
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const updateViewport = () => {
        if (typeof window !== 'undefined') {
          const width = window.innerWidth;
          setViewportWidth(width);
          setIsMobile(width < 768);
        }
      };

      updateViewport();
      
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
      }
    } catch (error) {
      console.error('Error setting up viewport tracking:', error);
    }
  }, [isMounted]);

  // Premium touch gestures with momentum, haptic feedback and velocity detection
  const [touchVelocity, setTouchVelocity] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(null);
  
  const handleTouchStart = useCallback((e) => {
    try {
      setTouchEnd(null);
      setTouchStart(e.targetTouches?.[0]?.clientX || null);
      setTouchStartTime(Date.now());
      setTouchVelocity(0);
    } catch (error) {
      console.warn('Touch start error:', error);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    try {
      const currentX = e.targetTouches?.[0]?.clientX || null;
      setTouchEnd(currentX);
      
      // Calculate velocity for momentum-based navigation
      if (touchStart && currentX && touchStartTime) {
        const deltaX = touchStart - currentX;
        const deltaTime = Date.now() - touchStartTime;
        const velocity = Math.abs(deltaX / deltaTime);
        setTouchVelocity(velocity);
      }
    } catch (error) {
      console.warn('Touch move error:', error);
    }
  }, [touchStart, touchStartTime]);

  const handleTouchEnd = useCallback(() => {
    try {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const absDistance = Math.abs(distance);
      
      // Dynamic threshold based on velocity for smoother experience
      const baseThreshold = 50;
      const velocityMultiplier = Math.min(touchVelocity * 30, 30);
      const threshold = Math.max(baseThreshold - velocityMultiplier, 20);
      
      const isLeftSwipe = distance > threshold;
      const isRightSwipe = distance < -threshold;

      // Haptic feedback for iOS devices
      if ((isLeftSwipe || isRightSwipe) && !isTransitioning) {
        try {
          if (navigator.vibrate) navigator.vibrate(25);
          if (window.navigator.vibrate) window.navigator.vibrate(25);
        } catch (e) {}
      }

      if (isLeftSwipe && !isTransitioning) {
        setCurrentDishIndex((prev) => (prev + 1) % dishes.length);
      } else if (isRightSwipe && !isTransitioning) {
        setCurrentDishIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
      }
    } catch (error) {
      console.warn('Touch end error:', error);
    } finally {
      setTouchStart(null);
      setTouchEnd(null);
      setTouchVelocity(0);
      setTouchStartTime(null);
    }
  }, [touchStart, touchEnd, dishes.length, isTransitioning, touchVelocity, touchStartTime]);

  // Enhanced smooth transition handler with faster horizontal movement
  const navigateTo = useCallback((index) => {
    if (isTransitioning || index < 0 || index >= dishes.length) return;
    
    setIsTransitioning(true);
    setCurrentDishIndex(index);
    
    // Faster, snappier timing for immediate feedback
    setTimeout(() => setIsTransitioning(false), 200); // Much faster animation timing
  }, [isTransitioning, dishes.length]);

  // Carousel auto-play controls
  const pauseCarousel = useCallback(() => setIsCarouselPaused(true), []);
  const resumeCarousel = useCallback(() => setIsCarouselPaused(false), []);
  const toggleAutoPlay = useCallback(() => setIsAutoPlaying(prev => !prev), []);

  // Dynamic background color based on active dish with fallback
  const activeDishColor = useMemo(() => {
    const currentDish = dishes[currentDishIndex];
    return currentDish?.color || '#F59E0B';
  }, [currentDishIndex, dishes]);

  // Memoized visible dishes calculation for performance
  const visibleDishes = useMemo(() => {
    if (!dishes.length) return [];
    
    return Array.from({ length: 5 }, (_, i) => {
      const dishIndex = (currentDishIndex - 2 + i + dishes.length) % dishes.length;
      const dish = dishes[dishIndex];
      
      if (!dish) return null; // Safety check
      
      const isActive = i === 2; // Center position is active
      const isAdjacent = i === 1 || i === 3; // Adjacent to center
      
      // Enhanced 3D transform calculations with smoother curves
      const distanceFromCenter = Math.abs(i - 2);
      const rotateY = isActive ? 0 : (i - 2) * (isMobile ? 8 : 12); // Increased rotation for more dramatic effect
      const translateZ = isActive ? (isMobile ? 15 : 25) : isAdjacent ? (isMobile ? 8 : 12) : (isMobile ? -5 : -8); // Enhanced depth perception
      
      // Add smooth curve-based positioning for more natural movement
      const curvePosition = Math.cos((i - 2) * Math.PI / 6) * (isMobile ? 20 : 30);
      
      return {
        dish,
        dishIndex,
        isActive,
        isAdjacent,
        rotateY,
        translateZ,
        position: i,
        curvePosition // Add curve-based positioning for smoother arcs
      };
    }).filter(Boolean); // Remove null entries
  }, [currentDishIndex, dishes, isMobile]);

  const translations = {
    en: { 
      title: 'A World of Flavors on One Menu', 
      subtitle: 'Taste tradition, discover variety, and explore our most loved dishes.',
      restaurantBadge: 'Authentic Middle Eastern Restaurant',
      loading: 'Loading...',
      searchPlaceholder: 'Search dishes...',
      noResults: 'No dishes found matching your search.',
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
      filters: { 
        all: 'All Items', 
        appetizers: 'Appetizers', 
        salads: 'Salads', 
        sandwich_platter: 'Sandwich & Platter', 
        naan: 'Naan', 
        grill: 'Grill Platters', 
        specialty: 'Specialty Dishes', 
        kids: "Kid's Menu", 
        ko: '키즈 메뉴', 
        sides: 'Sides', 
        drinks_cold: 'Drinks (Cold)', 
        drinks_hot: 'Drinks (Hot)', 
        soup: 'Soups', 
        dessert: 'Desserts', 
        popular: 'Most Popular' 
      },
      addProtein: 'Add Protein',
      servingFor: 'Serving for',
      variants: {
        sandwich: 'Sandwich',
        platter: 'Platter',
        singleScoop: 'Single Scoop'
      },
      stats: {
        dishes: 'Delicious Dishes',
        categories: 'Diverse Categories',
        languages: 'Global Languages'
      },
      popularSectionTitle: 'Our Most Popular Dishes',
      scrollDownText: 'Scroll down to explore menu',
      notice: 'Notice:',
      foodSafetyNotice: 'Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.',
      footer: {
        description: 'Bringing the authentic flavors and warm hospitality of the Middle East to your table. Every dish is a celebration of our rich cultural heritage and culinary excellence.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        openDaily: 'SUN - THU: 12 AM - 10 PM\nFRI - SAT: 12 AM - 11 PM',
        copyright: '© 2025 Nature Village Kurdish Restaurant. All rights reserved.',
        poweredBy: 'Powered by',
        blunari: 'Blunari AI'
      }
    },
    ku: { 
      title: 'گەشتی خۆراکی ئێمە', 
      subtitle: 'تامە ڕەسەنەکان بدۆزەرەوە کە بە خۆشەویستی و نەریت دروستکراون',
      restaurantBadge: 'چێشتخانەی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست',
      loading: 'بارکردن...',
      searchPlaceholder: 'گەڕان بۆ خۆراک...',
      noResults: 'هیچ خۆراکێک نەدۆزرایەوە.',
      nav: {
        home: 'ماڵەوە',
        menu: 'مێنیو',
        about: 'دەربارەمان',
        gallery: 'وێنەکان',
        visit: 'سەردانمان بکە',
        reservations: 'حجزکردن',
        catering: 'خزمەتگوزاری',
        orderOnline: 'داواکاری'
      },
      filters: { 
        all: 'هەموو', 
        appetizers: 'خۆراکی پێش‌خواردن', 
        salads: 'لەواشەکان', 
        sandwich_platter: 'ساندویچ و پلێتەر', 
        naan: 'نان', 
        grill: 'پلێتەری گرێل', 
        specialty: 'خۆراکی تایبەتی', 
        kids: 'مێنیوی منداڵان', 
        sides: 'لاوەکی', 
        drinks_cold: 'خواردنەوەکان (سارد)', 
        drinks_hot: 'خواردنەوەکان (گەرەم)', 
        soup: 'شۆربە', 
        dessert: 'شیرینی', 
        popular: 'بەناوبانگترین' 
      },
      addProtein: 'پرۆتین زیادبکە',
      servingFor: 'بۆ',
      variants: {
        sandwich: 'ساندویچ',
        platter: 'پلێتەر',
        singleScoop: 'یەک گۆپکە'
      },
      stats: {
        dishes: 'خواردنی خۆش',
        categories: 'جۆرە جیاوازەکان',
        languages: 'زمانی جیهانی'
      },
      popularSectionTitle: 'بەناوبانگترین خۆراکەکانمان',
      scrollDownText: 'بۆ گەڕان لە مێنیو بەرەو خوارەوە بچۆ',
      footer: {
        description: 'تامە ڕەسەنەکان و میوانداری گەرمی ڕۆژهەڵاتی ناوەڕاست بۆ مێزەکەتان دەهێنین. هەر خۆراکێک ئاهەنگێکە بۆ میراتی دەوڵەمەندی کولتوریمان و باشی ئاشپەزییەکەمان.',
        quickLinks: 'بەستەری خێرا',
        contactInfo: 'زانیاری پەیوەندی',
        privacy: 'سیاسەتی تایبەتایەتی',
        terms: 'مەرجەکانی خزمەتگوزاری',
        openDaily: 'یەکشەممە - پێنجشەممە: ١٢ شەو - ١٠ شەو\nهەینی - شەممە: ١٢ شەو - ١١ شەو',
        copyright: '© ٢٠٢٥ چێشتخانەی کوردی گوندی سروشت. هەموو مافەکان پارێزراون.',
        poweredBy: 'پشتگیری کراو لەلایەن',
        blunari: 'بلوناری ',
        notice: 'ئاگاداریی:',
        foodSafetyNotice: 'خواردنی گۆشتی خاو یان کەم لێنراو، بالندە، خواردنی دەریا، شەکرۆک یان هێلکە دەتوانێت مەترسی نەخۆشی خواردن زیاد بکات، بەتایبەتی ئەگەر دۆخی تەندروستی تایبەتت هەبێت.'
      }
    },
    ar: { 
      title: 'رحلتنا الطهوية', 
      subtitle: 'اكتشف النكهات الأصيلة المُحضرة بشغف وتقليد',
      restaurantBadge: 'مطعم شرق أوسطي أصيل',
      loading: 'جاري التحميل...',
      searchPlaceholder: 'البحث عن الأطباق...',
      noResults: 'لم يتم العثور على أطباق مطابقة لبحثك.',
      nav: {
        home: 'الرئيسية',
        menu: 'القائمة',
        about: 'عنا',
        gallery: 'المعرض',
        visit: 'زورونا',
        reservations: 'الحجوزات',
        catering: 'التموين',
        orderOnline: 'اطلب'
      },
      filters: { 
        all: 'الكل', 
        appetizers: 'مقبلات', 
        salads: 'سلطات', 
        sandwich_platter: 'سندويش وصحن', 
        naan: 'نان', 
        grill: 'مشاوي', 
        specialty: 'أطباق مميزة', 
        kids: 'قائمة الأطفال', 
        sides: 'الأطباق الجانبية', 
        drinks_cold: 'المشروبات (باردة)', 
        drinks_hot: 'المشروبات (ساخنة)', 
        soup: 'شوربات', 
        dessert: 'حلويات', 
        popular: 'الأكثر شهرة' 
      },
      addProtein: 'إضافة بروتين',
      servingFor: 'يكفي لـ',
      variants: {
        sandwich: 'سندويش',
        platter: 'صحن',
        singleScoop: 'كرة واحدة'
      },
      stats: {
        dishes: 'أطباق شهية',
        categories: 'تصنيفات متنوعة',
        languages: 'لغات عالمية'
      },
      popularSectionTitle: 'أطباقنا الأكثر شهرة',
      scrollDownText: 'مرر لأسفل لاستكشاف القائمة',
      footer: {
        description: 'نقدم النكهات الأصيلة والضيافة الدافئة من الشرق الأوسط إلى طاولتك. كل طبق هو احتفال بتراثنا الثقافي الغني وتميزنا في الطهي.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        openDaily: 'الأحد - الخميس: ١٢ صباحاً - ١٠ مساءً\nالجمعة - السبت: ١٢ صباحاً - ١١ مساءً',
        copyright: '© ٢٠٢٥ مطعم قرية الطبيعة الكردي. جميع الحقوق محفوظة.',
        poweredBy: 'مدعوم بـ',
        blunari: 'بلوناري الذكي',
        notice: 'تنبيه:',
        foodSafetyNotice: 'قد يؤدي تناول اللحوم أو الدواجن أو المأكولات البحرية أو الرخويات أو البيض النيئة أو غير المطبوخة جيداً إلى زيادة خطر الإصابة بأمراض منقولة بالغذاء، خاصة إذا كنت تعاني من حالات طبية معينة.'
      }
    },
    fa: { 
      title: 'سفر آشپزی ما', 
      subtitle: 'طعم‌های اصیل ساخته شده با عشق و سنت را کشف کنید',
      restaurantBadge: 'رستوران اصیل خاورمیانه',
      loading: 'در حال بارگذاری...',
      searchPlaceholder: 'جستجوی غذاها...',
      noResults: 'هیچ غذایی با جستجوی شما یافت نشد.',
      nav: {
        home: 'خانه',
        menu: 'منو',
        about: 'درباره ما',
        gallery: 'گالری',
        visit: 'بازدید از ما',
        reservations: 'رزرو',
        catering: 'پذیرایی',
        orderOnline: 'سفارش'
      },
      filters: { 
        all: 'همه موارد', 
        appetizers: 'پیش‌غذاها', 
        salads: 'سالادها', 
        sandwich_platter: 'ساندویچ و پلاتر', 
        naan: 'نان', 
        grill: 'کباب و گریل', 
        specialty: 'غذاهای ویژه', 
        kids: 'منوی کودکان', 
        sides: 'غذاهای جانبی', 
        drinks_cold: 'نوشیدنی‌ها (سرد)', 
        drinks_hot: 'نوشیدنی‌ها (گرم)', 
        soup: 'سوپ‌ها', 
        dessert: 'دسرها', 
        popular: 'محبوب‌ترین' 
      },
      addProtein: 'اضافه کردن پروتین',
      servingFor: 'برای',
      variants: {
        sandwich: 'ساندویچ',
        platter: 'پلاتر',
        singleScoop: 'یک اسکوپ'
      },
      stats: {
        dishes: 'غذاهای لذیذ',
        categories: 'دسته‌های متنوع',
        languages: 'زبان‌های جهانی'
      },
      popularSectionTitle: 'محبوب‌ترین غذاهای ما',
      scrollDownText: 'برای کاوش منو پایین بروید',
      footer: {
        description: 'طعم‌های اصیل و مهمان‌نوازی گرم خاورمیانه را به میز شما می‌آوریم. هر غذا جشنی از میراث فرهنگی غنی و تعالی آشپزی ماست.',
        quickLinks: 'لینک‌های سریع',
        contactInfo: 'اطلاعات تماس',
        privacy: 'سیاست حریم خصوصی',
        terms: 'شرایط خدمات',
        openDaily: 'یکشنبه - پنج‌شنبه: ۱۲ شب - ۱۰ شب\nجمعه - شنبه: ۱۲ شب - ۱۱ شب',
        copyright: '© ۲۰۲۵ رستوران کردی دهکده طبیعت. تمام حقوق محفوظ است.',
        poweredBy: 'قدرت گرفته از',
        blunari: 'بلوناری هوشمند',
        notice: 'هشدار:',
        foodSafetyNotice: 'مصرف گوشت خام یا کم پخت، طیور، غذاهای دریایی، صدف یا تخم مرغ ممکن است خطر ابتلا به بیماری‌های غذایی را افزایش دهد، به ویژه اگر شرایط پزشکی خاصی داشته باشید.'
      }
    },
    tr: { 
      title: 'Mutfak Yolculuğumuz', 
      subtitle: 'Tutku ve gelenekle hazırlanmış otantik lezzetleri keşfedin',
      restaurantBadge: 'Otantik Orta Doğu Restoranı',
      loading: 'Yükleniyor...',
      searchPlaceholder: 'Yemek ara...',
      noResults: 'Aramanızla eşleşen yemek bulunamadı.',
      nav: {
        home: 'Ana Sayfa',
        menu: 'Menü',
        about: 'Hakkımızda',
        gallery: 'Galeri',
        visit: 'Ziyaret Edin',
        reservations: 'Rezervasyonlar',
        catering: 'Catering',
        orderOnline: 'Sipariş'
      },
      filters: { 
        all: 'Tümü', 
        appetizers: 'Başlangıçlar', 
        salads: 'Salatalar', 
        sandwich_platter: 'Sandviç & Tabak', 
        naan: 'Naan', 
        grill: 'Izgara Tabaklar', 
        specialty: 'Özel Yemekler', 
        kids: 'Çocuk Menüsü', 
        sides: 'Garnitürler', 
        drinks_cold: 'İçecekler (Soğuk)', 
        drinks_hot: 'İçecekler (Sıcak)', 
        soup: 'Çorbalar', 
        dessert: 'Tatlılar', 
        popular: 'En Popüler' 
      },
      addProtein: 'Protein Ekle',
      servingFor: 'Kişilik',
      variants: {
        sandwich: 'Sandviç',
        platter: 'Tabak',
        singleScoop: 'Tek Top'
      },
      stats: {
        dishes: 'Lezzetli Yemek',
        categories: 'Çeşitli Kategori',
        languages: 'Küresel Dil'
      },
      popularSectionTitle: 'En Popüler Yemeklerimiz',
      scrollDownText: 'Menüyü keşfetmek için aşağı kaydırın',
      footer: {
        description: 'Orta Doğu\'nun özgün lezzetlerini ve sıcak misafirperverliğini masanıza getiriyoruz. Her yemek zengin kültürel mirasımızın ve mutfak mükemmelliğimizin bir kutlamasıdır.',
        quickLinks: 'Hızlı Bağlantılar',
        contactInfo: 'İletişim Bilgileri',
        privacy: 'Gizlilik Politikası',
        terms: 'Hizmet Şartları',
        openDaily: 'Pazar - Perşembe: 12:00 - 22:00\nCuma - Cumartesi: 12:00 - 23:00',
        copyright: '© 2025 Nature Village Kürt Restoranı. Tüm hakları saklıdır.',
        poweredBy: 'Destekçisi',
        blunari: 'Blunari Akıllı',
        notice: 'Uyarı:',
        foodSafetyNotice: 'Çiğ veya az pişmiş et, kümes hayvanları, deniz ürünleri, kabuklu deniz ürünleri veya yumurta tüketmek, özellikle belirli tıbbi durumlarınız varsa, gıda kaynaklı hastalık riskinizi artırabilir.'
      }
    },
    ur: { 
      title: 'ہمارا پکوان کا سفر', 
      subtitle: 'جذبے اور روایت سے تیار کردہ اصل ذائقوں کو دریافت کریں',
      restaurantBadge: 'اصل مشرق وسطیٰ ریستوران',
      loading: 'لوڈ ہو رہا ہے...',
      searchPlaceholder: 'ڈش تلاش کریں...',
      noResults: 'آپ کی تلاش سے کوئی ڈش نہیں ملی۔',
      nav: {
        home: 'ہوم',
        menu: 'مینیو',
        about: 'ہمارے بارے میں',
        gallery: 'گیلری',
        visit: 'ہمیں ملیں',
        reservations: 'بکنگ',
        catering: 'کیٹرنگ',
        orderOnline: 'آرڈر'
      },
      filters: { 
        all: 'سب', 
        appetizers: 'سٹارٹرز', 
        salads: 'سلادز', 
        sandwich_platter: 'سینڈوچ اور پلیٹر', 
        naan: 'نان', 
        grill: 'گرل پلیٹرز', 
        specialty: 'خصوصی ڈشز', 
        kids: 'بچوں کا مینیو', 
        sides: 'سائیڈ ڈشز', 
        drinks_cold: 'مشروبات (سرد)', 
        drinks_hot: 'مشروبات (گرم)', 
        soup: 'سوپس', 
        dessert: 'میٹھائیاں', 
        popular: 'سب سے مقبول' 
      },
      addProtein: 'پروٹین شامل کریں',
      servingFor: 'کے لیے',
      variants: {
        sandwich: 'سینڈوچ',
        platter: 'پلیٹر',
        singleScoop: 'ایک اسکوپ'
      },
      stats: {
        dishes: 'لذیذ ڈشز',
        categories: 'مختلف اقسام',
        languages: 'عالمی زبانیں'
      },
      popularSectionTitle: 'ہمارے سب سے مقبول کھانے',
      scrollDownText: 'مینو دیکھنے کے لیے نیچے سکرول کریں',
      footer: {
        description: 'ہم مشرق وسطیٰ کے اصل ذائقے اور گرم مہمان نوازی آپ کے میز تک لاتے ہیں۔ ہر کھانا ہماری بھرپور ثقافتی ورثے اور کھانا پکانے کی مہارت کا جشن ہے۔',
        quickLinks: 'فوری روابط',
        contactInfo: 'رابطہ کی معلومات',
        privacy: 'پرائیویسی پالیسی',
        terms: 'خدمات کی شرائط',
        openDaily: 'اتوار - جمعرات: 12 بجے - 10 بجے\nجمعہ - ہفتہ: 12 بجے - 11 بجے',
        copyright: '© 2025 Nature Village کرد ریسٹورنٹ۔ تمام حقوق محفوظ ہیں۔',
        poweredBy: 'تعاون یافتہ',
        blunari: 'Blunari سمارٹ',
        notice: 'نوٹس:',
        foodSafetyNotice: 'کچے یا کم پکے ہوئے گوشت، مرغی، سمندری غذا، شیلفش یا انڈے کا استعمال آپ کو فوڈ بورن بیماری کا خطرہ بڑھا سکتا ہے، خاص طور پر اگر آپ کو کوئی مخصوص طبی حالات ہیں۔'
      }
    },
    kmr: { 
      title: 'Rêwîtiya Aşpêjiya Me', 
      subtitle: 'Tamên orijînal ên bi hez û nerdî hatine çêkirin keşf bikin',
      restaurantBadge: 'Xwaringeha Rojhilatê Navîn a Resen',
      loading: 'Tê barkirin...',
      searchPlaceholder: 'Li xwarinan bigerin...',
      noResults: 'Tu xwarineke li gor lêgerîna te nehat dîtin.',
      nav: {
        home: 'Mal',
        menu: 'Menû',
        about: 'Der barê me de',
        gallery: 'Gallerî',
        visit: 'Serdana me bikin',
        reservations: 'Rezervasyon',
        catering: 'Xizmetguzarî',
        orderOnline: 'Sîpariş'
      },
      filters: { 
        all: 'Hemû', 
        appetizers: 'Destpêk', 
        salads: 'Salatan', 
        sandwich_platter: 'Sandwîç û Plater', 
        naan: 'Nan', 
        grill: 'Platerên Grill', 
        specialty: 'Xwarinên Taybet', 
        kids: 'Menûya Zarokan', 
        sides: 'Xwarinên Alî', 
        drinks_cold: 'Vexwarin (Sarî)', 
        drinks_hot: 'Vexwarin (Germ)', 
        soup: 'Şorbeyên', 
        dessert: 'Şîrînî', 
        popular: 'Herî Bilind' 
      },
      addProtein: 'Protein Zêde Bike',
      servingFor: 'Ji bo',
      variants: {
        sandwich: 'Sandwîç',
        platter: 'Plater',
        singleScoop: 'Yek Top'
      },
      stats: {
        dishes: 'Xwarinên Xweş',
        categories: 'Kategoriyên Cûda',
        languages: 'Zimanên Cîhanî'
      },
      popularSectionTitle: 'Xwarinên Me yên Herî Populer',
      scrollDownText: 'Ji bo keşfkirina menûyê berbi jêr ve biçin',
      footer: {
        description: 'Em tamên resen û mêvandariya germ a Rojhilata Navîn diînin li masaya we. Her xwarineke pîrozbahiyek e ji mîrata me ya dewlemend a çandî û helbesta aşpêjiyê.',
        quickLinks: 'Girêdanên Bilez',
        contactInfo: 'Agahiyên Têkiliyê',
        privacy: 'Siyaseta Nehêniyê',
        terms: 'Mercên Karûbarê',
        openDaily: 'Yekşem - Pêncşem: 12:00 - 22:00\nÎn - Şem: 12:00 - 23:00',
        copyright: '© 2025 Xwaringeha Kurdî ya Gundê Xwezayê. Hemû maf parastî ne.',
        poweredBy: 'Destekkirî bi',
        blunari: 'Blunari Smart',
        notice: 'Hişyarî:',
        foodSafetyNotice: 'Xwarina goştê xav an kêm pijandî, teyrê, xwarinên deryayê, qerekên deryayê an hêkan dikare xetera nexweşiya xwarinê zêde bike, bi taybetî heke rewşên bijîjkî yên taybet hebe.'
      }
    },
    bn: { 
      title: 'এক মেনুতে বিশ্বের স্বাদ', 
      subtitle: 'ঐতিহ্যের স্বাদ নিন, বৈচিত্র্য আবিষ্কার করুন এবং আমাদের সবচেয়ে প্রিয় খাবারগুলি অন্বেষণ করুন।',
      restaurantBadge: 'খাঁটি মধ্যপ্রাচ্যীয় রেস্তোরাঁ',
      loading: 'লোড হচ্ছে...',
      searchPlaceholder: 'খাবার খুঁজুন...',
      noResults: 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো খাবার পাওয়া যায়নি।',
      nav: {
        home: 'হোম',
        menu: 'মেনু',
        about: 'আমাদের সম্পর্কে',
        gallery: 'গ্যালারি',
        visit: 'আমাদের দেখুন',
        reservations: 'সংরক্ষণ',
        catering: 'ক্যাটারিং',
        orderOnline: 'অর্ডার'
      },
      filters: { 
        all: 'সকল আইটেম', 
        appetizers: 'ক্ষুধাবর্ধক', 
        salads: 'সালাদ', 
        sandwich_platter: 'স্যান্ডউইচ ও প্ল্যাটার', 
        naan: 'নান', 
        grill: 'গ্রিল প্ল্যাটার', 
        specialty: 'বিশেষ খাবার', 
        kids: 'বাচ্চাদের মেনু', 
        sides: 'সাইড ডিশ', 
        drinks_cold: 'পানীয় (ঠান্ডা)', 
        drinks_hot: 'পানীয় (গরম)', 
        soup: 'স্যুপ', 
        dessert: 'ডেজার্ট', 
        popular: 'সবচেয়ে জনপ্রিয়' 
      },
      addProtein: 'প্রোটিন যোগ করুন',
      servingFor: 'পরিবেশনা',
      variants: {
        sandwich: 'স্যান্ডউইচ',
        platter: 'প্ল্যাটার',
        singleScoop: 'একক স্কুপ'
      },
      stats: {
        dishes: 'সুস্বাদু খাবার',
        categories: 'বৈচিত্র্যময় বিভাগ',
        languages: 'বৈশ্বিক ভাষা'
      },
      popularSectionTitle: 'আমাদের সবচেয়ে জনপ্রিয় খাবার',
      scrollDownText: 'মেনু অন্বেষণ করতে নিচে স্ক্রল করুন',
      footer: {
        description: 'আপনার টেবিলে খাঁটি মধ্যপ্রাচ্যীয় স্বাদ এবং উষ্ণ আতিথেয়তা নিয়ে আসা। প্রতিটি খাবার আমাদের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য এবং রন্ধনসম্পর্কীয় উৎকর্ষতার উদযাপন।',
        quickLinks: 'দ্রুত লিংক',
        contactInfo: 'যোগাযোগের তথ্য',
        privacy: 'গোপনীয়তা নীতি',
        terms: 'ব্যবহারের শর্তাবলী',
        openDaily: 'রবি - বৃহস্পতি: ১২:০০ - ২২:০০\nশুক্র - শনি: ১২:০০ - ২৩:০০',
        copyright: '© ২০২৫ নেচার ভিলেজ রেস্তোরাঁ। সর্বস্বত্ব সংরক্ষিত।',
        poweredBy: 'চালিত',
        blunari: 'ব্লুনারি স্মার্ট',
        notice: 'বিজ্ঞপ্তি:',
        foodSafetyNotice: 'কাঁচা বা কম রান্না করা মাংস, মুরগি, সামুদ্রিক খাবার, শেলফিশ বা ডিম খাওয়া আপনার খাদ্যজনিত অসুস্থতার ঝুঁকি বাড়াতে পারে, বিশেষ করে যদি আপনার নির্দিষ্ট চিকিৎসা অবস্থা থাকে।'
      }
    },
    ko: { 
      title: '하나의 메뉴에 담긴 세계의 맛', 
      subtitle: '전통을 맛보고, 다양성을 발견하며, 가장 사랑받는 요리를 탐험해보세요.',
      restaurantBadge: '정통 중동 레스토랑',
      loading: '로딩 중...',
      searchPlaceholder: '요리 검색...',
      noResults: '검색 조건에 맞는 요리를 찾을 수 없습니다.',
      nav: {
        home: '홈',
        menu: '메뉴',
        about: '소개',
        gallery: '갤러리',
        visit: '방문하기',
        reservations: '예약',
        catering: '케이터링',
        orderOnline: '주문'
      },
      filters: { 
        all: '전체 메뉴', 
        appetizers: '전채요리', 
        salads: '샐러드', 
        sandwich_platter: '샌드위치 & 플래터', 
        naan: '난', 
        grill: '그릴 플래터', 
        specialty: '특선 요리', 
        kids: '키즈 메뉴', 
        sides: '사이드 메뉴', 
        drinks_cold: '음료 (차가운)', 
        drinks_hot: '음료 (뜨거운)', 
        soup: '수프', 
        dessert: '디저트', 
        popular: '인기 메뉴' 
      },
      addProtein: '단백질 추가',
      servingFor: '인분',
      variants: {
        sandwich: '샌드위치',
        platter: '플래터',
        singleScoop: '싱글 스쿱'
      },
      stats: {
        dishes: '맛있는 요리',
        categories: '다양한 카테고리',
        languages: '글로벌 언어'
      },
      popularSectionTitle: '가장 인기 있는 요리',
      description: '정통 중동 맛과 따뜻한 환대를 당신의 테이블로 가져다드립니다. 모든 요리는 우리의 풍부한 문화유산과 요리 전통의 축하입니다.',
      quickLinks: '빠른 링크',
      contactInfo: '연락처 정보',
      privacy: '개인정보 처리방침',
      terms: '이용약관',
      openDaily: '일 - 목: 12:00 - 22:00\n금 - 토: 12:00 - 23:00',
      copyright: '© 2025 네이처 빌리지 레스토랑. 모든 권리 보유.',
      poweredBy: '개발',
      blunari: '블루나리 스마트',
      notice: '주의:',
      foodSafetyNotice: '날것이나 덜 익힌 육류, 가금류, 해산물, 조개류 또는 계란을 섭취하면 특정 질병이 있는 경우 특히 식중독 위험이 증가할 수 있습니다.'
    },
    ru: {
      title: 'Наше кулинарное путешествие',
      subtitle: 'Откройте для себя подлинные вкусы, приготовленные с любовью и традициями',
      restaurantBadge: 'Подлинный ближневосточный ресторан',
      loading: 'Загрузка...',
      searchPlaceholder: 'Поиск блюд...',
      noResults: 'Блюд, соответствующих вашему поиску, не найдено.',
      nav: {
        home: 'Домой',
        menu: 'Меню',
        about: 'О нас',
        gallery: 'Галерея',
        visit: 'Посетить',
        reservations: 'Бронирование',
        catering: 'Кейтеринг',
        orderOnline: 'Заказ'
      },
      filters: {
        all: 'Все блюда',
        appetizers: 'Закуски',
        salads: 'Салаты',
        sandwich_platter: 'Сэндвич и блюдо',
        naan: 'Наан',
        grill: 'Гриль',
        specialty: 'Фирменные блюда',
        kids: 'Детское меню',
        sides: 'Гарниры',
        drinks_cold: 'Холодные напитки',
        drinks_hot: 'Горячие напитки',
        soup: 'Супы',
        dessert: 'Десерты',
        popular: 'Популярные'
      },
      addProtein: 'Добавить белок',
      servingFor: 'Порций',
      variants: {
        sandwich: 'Сэндвич',
        platter: 'Блюдо',
        singleScoop: 'Одна порция'
      },
      stats: {
        dishes: 'Вкусные блюда',
        categories: 'Различные категории',
        languages: 'Мировые языки'
      },
      popularSectionTitle: 'Наши самые популярные блюда',
      scrollDownText: 'Прокрутите вниз, чтобы изучить меню',
      footer: {
        description: 'Мы привносим подлинные вкусы и теплое гостеприимство Ближнего Востока за ваш стол. Каждое блюдо - это праздник нашего богатого культурного наследия и кулинарного мастерства.',
        quickLinks: 'Быстрые ссылки',
        contactInfo: 'Контактная информация',
        privacy: 'Политика конфиденциальности',
        terms: 'Условия обслуживания',
        openDaily: 'ВС - ЧТ: 12:00 - 22:00\nПТ - СБ: 12:00 - 23:00',
        copyright: '© 2025 Курдский ресторан Природная деревня. Все права защищены.',
        poweredBy: 'При поддержке',
        blunari: 'Blunari AI',
        notice: 'Внимание:',
        foodSafetyNotice: 'Употребление сырого или недоваренного мяса, птицы, морепродуктов, моллюсков или яиц может увеличить риск пищевого отравления, особенно при наличии определенных заболеваний.'
      }
    },
    hi: {
      title: 'हमारी पाक यात्रा',
      subtitle: 'प्रेम और परंपरा से बने प्रामाणिक स्वादों की खोज करें',
      restaurantBadge: 'प्रामाणिक मध्य पूर्वी रेस्टोरेंट',
      loading: 'लोड हो रहा है...',
      searchPlaceholder: 'व्यंजन खोजें...',
      noResults: 'आपकी खोज से मेल खाने वाले व्यंजन नहीं मिले।',
      nav: {
        home: 'होम',
        menu: 'मेन्यू',
        about: 'हमारे बारे में',
        gallery: 'गैलरी',
        visit: 'हमसे मिलें',
        reservations: 'बुकिंग',
        catering: 'कैटरिंग',
        orderOnline: 'ऑर्डर'
      },
      filters: {
        all: 'सभी व्यंजन',
        appetizers: 'स्टार्टर',
        salads: 'सलाद',
        sandwich_platter: 'सैंडविच और प्लेटर',
        naan: 'नान',
        grill: 'ग्रिल प्लेटर',
        specialty: 'विशेष व्यंजन',
        kids: 'बच्चों का मेन्यू',
        sides: 'साइड डिश',
        drinks_cold: 'पेय (ठंडा)',
        drinks_hot: 'पेय (गर्म)',
        soup: 'सूप',
        dessert: 'मिठाई',
        popular: 'लोकप्रिय'
      },
      addProtein: 'प्रोटीन जोड़ें',
      servingFor: 'व्यक्तियों के लिए',
      variants: {
        sandwich: 'सैंडविच',
        platter: 'प्लेटर',
        singleScoop: 'एक स्कूप'
      },
      stats: {
        dishes: 'स्वादिष्ट व्यंजन',
        categories: 'विभिन्न श्रेणियां',
        languages: 'विश्व भाषाएं'
      },
      popularSectionTitle: 'हमारे सबसे लोकप्रिय व्यंजन',
      scrollDownText: 'मेन्यू देखने के लिए नीचे स्क्रॉल करें',
      footer: {
        description: 'हम आपकी मेज पर मध्य पूर्व के प्रामाणिक स्वाद और गर्म आतिथ्य लाते हैं। हर व्यंजन हमारी समृद्ध सांस्कृतिक विरासत और पाक कौशल का उत्सव है।',
        quickLinks: 'त्वरित लिंक',
        contactInfo: 'संपर्क जानकारी',
        privacy: 'गोपनीयता नीति',
        terms: 'सेवा की शर्तें',
        openDaily: 'रवि - गुरु: 12:00 - 22:00\nशुक्र - शनि: 12:00 - 23:00',
        copyright: '© 2025 नेचर विलेज कुर्दी रेस्टोरेंट। सभी अधिकार सुरक्षित।',
        poweredBy: 'द्वारा संचालित',
        blunari: 'Blunari AI',
        notice: 'सूचना:',
        foodSafetyNotice: 'कच्चे या अधपके मांस, मुर्गी, समुद्री भोजन, शेलफिश या अंडे का सेवन आपको खाद्य जनित बीमारी का खतरा बढ़ा सकता है, विशेष रूप से यदि आपको कुछ चिकित्सा स्थितियां हैं।'
      }
    },
    es: {
      title: 'Nuestro viaje culinario',
      subtitle: 'Descubre sabores auténticos preparados con amor y tradición',
      restaurantBadge: 'Auténtico Restaurante de Oriente Medio',
      loading: 'Cargando...',
      searchPlaceholder: 'Buscar platos...',
      noResults: 'No se encontraron platos que coincidan con su búsqueda.',
      nav: {
        home: 'Inicio',
        menu: 'Menú',
        about: 'Acerca de',
        gallery: 'Galería',
        visit: 'Visítanos',
        reservations: 'Reservas',
        catering: 'Catering',
        orderOnline: 'Ordenar'
      },
      filters: {
        all: 'Todos los artículos',
        appetizers: 'Aperitivos',
        salads: 'Ensaladas',
        sandwich_platter: 'Sándwich y Platillo',
        naan: 'Naan',
        grill: 'Platillos a la Parrilla',
        specialty: 'Platos Especiales',
        kids: 'Menú Infantil',
        sides: 'Acompañamientos',
        drinks_cold: 'Bebidas (Frías)',
        drinks_hot: 'Bebidas (Calientes)',
        soup: 'Sopas',
        dessert: 'Postres',
        popular: 'Más Popular'
      },
      addProtein: 'Añadir Proteína',
      servingFor: 'Para',
      variants: {
        sandwich: 'Sándwich',
        platter: 'Platillo',
        singleScoop: 'Una Bola'
      },
      stats: {
        dishes: 'Platos Deliciosos',
        categories: 'Categorías Diversas',
        languages: 'Idiomas Globales'
      },
      popularSectionTitle: 'Nuestros Platos Más Populares',
      scrollDownText: 'Desplázate hacia abajo para explorar el menú',
      footer: {
        description: 'Llevamos los sabores auténticos y la cálida hospitalidad de Oriente Medio a tu mesa. Cada plato es una celebración de nuestro rico patrimonio cultural y excelencia culinaria.',
        quickLinks: 'Enlaces Rápidos',
        contactInfo: 'Información de Contacto',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
        openDaily: 'DOM - JUE: 12:00 - 22:00\nVIE - SÁB: 12:00 - 23:00',
        copyright: '© 2025 Restaurante Nature Village. Todos los derechos reservados.',
        poweredBy: 'Desarrollado por',
        blunari: 'Blunari AI',
        notice: 'Aviso:',
        foodSafetyNotice: 'Consumir carnes, aves, mariscos, moluscos o huevos crudos o poco cocidos puede aumentar su riesgo de enfermedades transmitidas por alimentos, especialmente si tiene ciertas condiciones médicas.'
      }
    },
    sq: {
      title: 'Udhëtimi Ynë Kulinar',
      subtitle: 'Zbuloni shije autentike të përgatitura me dashuri dhe traditë',
      restaurantBadge: 'Restorant Autentik i Lindjes së Mesme',
      loading: 'Po ngarkohet...',
      searchPlaceholder: 'Kërko ushqime...',
      noResults: 'Nuk u gjetën ushqime që përputhen me kërkimin tuaj.',
      nav: {
        home: 'Kreu',
        menu: 'Meny',
        about: 'Rreth Nesh',
        gallery: 'Galeria',
        visit: 'Na Vizitoni',
        reservations: 'Rezervime',
        catering: 'Katering',
        orderOnline: 'Porosit'
      },
      filters: {
        all: 'Të Gjitha',
        appetizers: 'Aperitivë',
        salads: 'Sallatat',
        sandwich_platter: 'Sandwich dhe Pjatë',
        naan: 'Naan',
        grill: 'Pjatat e Grilit',
        specialty: 'Specialitetet',
        kids: 'Menyja e Fëmijëve',
        sides: 'Anësor',
        drinks_cold: 'Pije (të Ftohta)',
        drinks_hot: 'Pije (të Nxehta)',
        soup: 'Supa',
        dessert: 'Ëmbëlsira',
        popular: 'Më të Popullarit'
      },
      addProtein: 'Shto Proteinë',
      servingFor: 'Për',
      variants: {
        sandwich: 'Sandwich',
        platter: 'Pjatë',
        singleScoop: 'Një Topth'
      },
      stats: {
        dishes: 'Ushqime të Shijshme',
        categories: 'Kategori të Ndryshme',
        languages: 'Gjuhë Globale'
      },
      popularSectionTitle: 'Ushqimet Tona Më të Popullarit',
      scrollDownText: 'Lëviz poshtë për të eksploruar menynë',
      footer: {
        description: 'Sjellim shijet autentike dhe mikpritjen e ngrohtë të Lindjes së Mesme në tryezën tuaj. Çdo ushqim është një festë e trashëgimisë sonë kulturore dhe shkëlqimit kulinar.',
        quickLinks: 'Lidhje të Shpejta',
        contactInfo: 'Informacione Kontakti',
        privacy: 'Politika e Privatësisë',
        terms: 'Kushtet e Shërbimit',
        openDaily: 'E DI - E EN: 12:00 - 22:00\nE PR - E SH: 12:00 - 23:00',
        copyright: '© 2025 Restorant Kurd Nature Village. Të gjitha të drejtat e rezervuara.',
        poweredBy: 'Mundësuar nga',
        blunari: 'Blunari AI',
        notice: 'Njoftim:',
        foodSafetyNotice: 'Konsumimi i mishit të papjekur ose të pakuar plotësisht, shpendëve, ushqimeve të detit, krustaceve ose vezëve mund të rrisë rrezikun tuaj nga sëmundjet e ushqimit, veçanërisht nëse keni kushte të caktuara mjekësore.'
      }
    },
    fr: { 
      title: 'Un Monde de Saveurs sur un Seul Menu', 
      subtitle: 'Goûtez la tradition, découvrez la variété et explorez nos plats les plus appréciés.',
      restaurantBadge: 'Restaurant Authentique du Moyen-Orient',
      loading: 'Chargement...',
      searchPlaceholder: 'Rechercher des plats...',
      noResults: 'Aucun plat trouvé correspondant à votre recherche.',
      nav: {
        home: 'Accueil',
        menu: 'Menu',
        about: 'À Propos',
        gallery: 'Galerie',
        visit: 'Nous Visiter',
        reservations: 'Réservations',
        catering: 'Traiteur',
        orderOnline: 'Commander'
      },
      filters: { 
        all: 'Tous les Articles', 
        appetizers: 'Apéritifs', 
        salads: 'Salades', 
        sandwich_platter: 'Sandwich et Plateau', 
        naan: 'Naan', 
        grill: 'Grillades', 
        specialty: 'Spécialités', 
        kids: "Menu Enfants", 
        sides: 'Accompagnements', 
        drinks_cold: 'Boissons (Fraîches)', 
        drinks_hot: 'Boissons (Chaudes)', 
        soup: 'Soupes', 
        dessert: 'Desserts', 
        popular: 'Plus Populaires' 
      },
      addProtein: 'Ajouter Protéine',
      servingFor: 'Pour',
      variants: {
        sandwich: 'Sandwich',
        platter: 'Plateau',
        singleScoop: 'Une Boule'
      },
      stats: {
        dishes: 'Plats Délicieux',
        categories: 'Catégories Diverses',
        languages: 'Langues Mondiales'
      },
      popularSectionTitle: 'Nos Plats les Plus Populaires',
      scrollDownText: 'Faites défiler vers le bas pour explorer le menu',
      footer: {
        description: 'Apporter les saveurs authentiques et l\'hospitalité chaleureuse du Moyen-Orient à votre table. Chaque plat est une célébration de notre riche patrimoine culturel et de notre excellence culinaire.',
        quickLinks: 'Liens Rapides',
        contactInfo: 'Informations de Contact',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions de Service',
        openDaily: 'DIM - JEU: 12h00 - 22h00\nVEN - SAM: 12h00 - 23h00',
        copyright: '© 2025 Restaurant Nature Village. Tous droits réservés.',
        poweredBy: 'Propulsé par',
        blunari: 'Blunari IA',
        notice: 'Avis:',
        foodSafetyNotice: 'La consommation de viandes, volailles, fruits de mer, crustacés ou œufs crus ou insuffisamment cuits peut augmenter votre risque de maladie d\'origine alimentaire, surtout si vous avez certaines conditions médicales.'
      }
    },
    de: { 
      title: 'Eine Welt voller Geschmäcker auf einer Speisekarte', 
      subtitle: 'Schmecken Sie Tradition, entdecken Sie Vielfalt und erkunden Sie unsere beliebtesten Gerichte.',
      restaurantBadge: 'Authentisches Nahöstliches Restaurant',
      loading: 'Laden...',
      searchPlaceholder: 'Gerichte suchen...',
      noResults: 'Keine Gerichte gefunden, die Ihrer Suche entsprechen.',
      nav: {
        home: 'Startseite',
        menu: 'Speisekarte',
        about: 'Über Uns',
        gallery: 'Galerie',
        visit: 'Besuchen Sie Uns',
        reservations: 'Reservierungen',
        catering: 'Catering',
        orderOnline: 'Bestellen'
      },
      filters: { 
        all: 'Alle Gerichte', 
        appetizers: 'Vorspeisen', 
        salads: 'Salate', 
        sandwich_platter: 'Sandwich & Platte', 
        naan: 'Naan', 
        grill: 'Grillplatten', 
        specialty: 'Spezialitäten', 
        kids: "Kindermenü", 
        sides: 'Beilagen', 
        drinks_cold: 'Getränke (Kalt)', 
        drinks_hot: 'Getränke (Heiß)', 
        soup: 'Suppen', 
        dessert: 'Desserts', 
        popular: 'Am Beliebtesten' 
      },
      addProtein: 'Protein Hinzufügen',
      servingFor: 'Für',
      variants: {
        sandwich: 'Sandwich',
        platter: 'Platte',
        singleScoop: 'Eine Kugel'
      },
      stats: {
        dishes: 'Köstliche Gerichte',
        categories: 'Vielfältige Kategorien',
        languages: 'Globale Sprachen'
      },
      popularSectionTitle: 'Unsere Beliebtesten Gerichte',
      scrollDownText: 'Scrollen Sie nach unten, um die Speisekarte zu erkunden',
      footer: {
        description: 'Authentische nahöstliche Aromen und warme Gastfreundschaft an Ihren Tisch bringen. Jedes Gericht ist eine Feier unseres reichen kulturellen Erbes und kulinarischer Exzellenz.',
        quickLinks: 'Schnelle Links',
        contactInfo: 'Kontaktinformationen',
        privacy: 'Datenschutzrichtlinie',
        terms: 'Nutzungsbedingungen',
        openDaily: 'SO - DO: 12:00 - 22:00\nFR - SA: 12:00 - 23:00',
        copyright: '© 2025 Nature Village Restaurant. Alle Rechte vorbehalten.',
        poweredBy: 'Powered by',
        blunari: 'Blunari KI',
        notice: 'Hinweis:',
        foodSafetyNotice: 'Der Verzehr von rohem oder ungenügend gegartem Fleisch, Geflügel, Meeresfrüchten, Schalentieren oder Eiern kann Ihr Risiko für lebensmittelbedingte Krankheiten erhöhen, insbesondere wenn Sie bestimmte Krankheiten haben.'
      }
    }
  }

  // Complete menu items with full translations - Nature's Village Menu
  const menuItems = useMemo(() => [
    // APPETIZERS
    { 
      id: 1001, 
      name: { 
        en: 'Hummus',
        ar: 'حمص',
        fa: 'حمص',
        ku: 'حممس',
        tr: 'Humus',
        ur: 'حمص',
        kmr: 'Humus',
        es: 'Hummus',
        fr: 'Houmous',
        de: 'Hummus',
        ru: 'Хумус',
        hi: 'हम्मुस',
        sq: 'Humus',
        bn: 'হুমুস',
        ko: '후무스'
      }, 
      description: { 
        en: 'A classic Levantine dip made from mashed chickpeas, tahini, olive oil, lemon juice and garlic.',
        ar: 'غموس شامي كلاسيكي مصنوع من الحمص المهروس والطحينة وزيت الزيتون وعصير الليمون والثوم.',
        fa: 'یک دیپ کلاسیک شامی از نخود له شده، طحینی، روغن زیتون، آب لیمو و سیر.',
        ku: 'دیپێکی کلاسیکی شامی لە نۆکی کوتراو، تەحینی، زەیتی زەیتوون، شیری لیمۆ و سیر.',
        tr: 'Ezilmiş nohut, tahin, zeytinyağı, limon suyu ve sarımsaktan yapılan klasik Levanten mezesi.',
        ur: 'چنے، تل کا پیسٹ، زیتون کا تیل، لیموں کا رس اور لہسن سے بنا کلاسک شامی ڈپ۔',
        kmr: 'Mezeyeke klasîk ya Şamî ku ji kurskotan, tahînî, zeyta zeytûnê, ava lîmonê û sîr tê çêkirin.',
        es: 'Una salsa clásica levantina hecha de garbanzos machacados, tahini, aceite de oliva, jugo de limón y ajo.',
        fr: 'Une trempette classique levantine à base de pois chiches écrasés, tahini, huile d\'olive, jus de citron et ail.',
        de: 'Ein klassischer levantinischer Dip aus zerdrückten Kichererbsen, Tahini, Olivenöl, Zitronensaft und Knoblauch.',
        ru: 'Классическая левантийская закуска из измельченного нута, тахини, оливкового масла, лимонного сока и чеснока.',
        hi: 'मसले हुए छोले, तिल का पेस्ट, जैतून का तेल, नींबू का रस और लहसुन से बना क्लासिक लेवेंटाइन डिप।',
        sq: 'Një sos klasik levantinas i bërë nga grofthat e shtypur, tahini, vaj ulliri, lëng limoni dhe hudhra.',
        bn: 'ছোলা, তাহিনি, জলপাই তেল, লেবুর রস এবং রসুন দিয়ে তৈরি ক্লাসিক লেভান্টাইন ডিপ।',
        ko: '으깬 병아리콩, 타히니, 올리브 오일, 레몬 주스, 마늘로 만든 클래식한 레반트 딥입니다.'
      }, 
      price: '$8.99', 
      category: 'appetizers', 
      popular: true, 
      image: '/Hummus.jpg',
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1002, 
      name: { 
        en: 'Baba Ghanoush',
        ar: 'بابا غنوج',
        fa: 'بابا غنوش',
        ku: 'بابا غنوش',
        tr: 'Babaganuş',
        ur: 'بابا غنوش',
        kmr: 'Baba Ganuş',
        es: 'Baba Ghanoush',
        ru: 'Баба Гануш',
        hi: 'बाबा गनूश',
        sq: 'Baba Ghanoush',
        fr: 'Baba Ganouch',
        de: 'Baba Ghanoush',
        bn: 'বাবা গানুশ',
        ko: '바바 가누시'
      }, 
      description: { 
        en: 'This Levantine dip, made from roasted eggplant, yogurt, tahini, garlic, lemon juice, is a delicious addition to any meal.',
        ar: 'هذا الغموس الشامي المصنوع من الباذنجان المشوي واللبن والطحينة والثوم وعصير الليمون، إضافة لذيذة لأي وجبة.',
        fa: 'این دیپ شامی که از بادمجان کبابی، ماست، طحینی، سیر و آب لیمو تهیه می‌شود، افزوده‌ای خوشمزه به هر وعده غذایی است.',
        ku: 'ئەم دیپە شامییە لە بادەمجانی برژاو، ماست، تەحینی، سیر و شیری لیمۆ دروستکراوە، زیادکردنێکی خۆشە بۆ هەر ژەمێک.',
        tr: 'Közlenmiş patlıcan, yoğurt, tahin, sarımsak ve limon suyundan yapılan bu Levanten mezesi, her öğüne lezzetli bir katkıdır.',
        ur: 'یہ شامی ڈپ جو بھنے ہوئے بینگن، دہی، تل کا پیسٹ، لہسن اور لیموں کے رس سے بنایا گیا ہے، کسی بھی کھانے کے ساتھ لذیذ اضافہ ہے۔',
        kmr: 'Ev mezena Şamî ya ku ji bacanê şewitî, mastê, tahînî, sîr û ava lîmonê tê çêkirin, zêdekirinek xweş e ji bo her xwarinê.',
        es: 'Esta salsa levantina, hecha de berenjena asada, yogur, tahini, ajo y jugo de limón, es una deliciosa adición a cualquier comida.',
        fr: 'Cette trempette levantine, faite d\'aubergine grillée, yaourt, tahini, ail et jus de citron, est un délicieux accompagnement à tout repas.',
        de: 'Dieser levantinische Dip aus gerösteter Aubergine, Joghurt, Tahini, Knoblauch und Zitronensaft ist eine köstliche Ergänzung zu jeder Mahlzeit.',
        ru: 'Эта левантийская закуска из жареных баклажанов, йогурта, тахини, чеснока и лимонного сока - вкусное дополнение к любому блюду.',
        hi: 'भुने हुए बैंगन, दही, तिल का पेस्ट, लहसुन और नींबू के रस से बना यह लेवेंटाइन डिप किसी भी भोजन के साथ स्वादिष्ट जोड़ है।',
        sq: 'Kjo salcë levantinase, e bërë nga patëllxhani i pjekur, kosi, tahini, hudhra dhe lëngu i limonit, është një shtesë e shijshme për çdo vakt.',
        bn: 'ভাজা বেগুন, দই, তাহিনি, রসুন এবং লেবুর রস দিয়ে তৈরি এই লেভান্টাইন ডিপ যেকোনো খাবারের সাথে সুস্বাদু সংযোজন।',
        ko: '구운 가지, 요거트, 타히니, 마늘, 레몬 주스로 만든 이 레반트 딥은 어떤 식사에도 맛있는 추가 요리입니다.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian', 'vegan'], 
      image: '/Baba Ghanoush.jpg' 
    },
    { 
      id: 1004, 
      name: { 
        en: 'Kibbeh',
        ar: 'كبة',
        fa: 'کبه',
        ku: 'کبه',
        tr: 'Kibbeh',
        ur: 'کبہ',
        kmr: 'Kibbeh',
        es: 'Kibbeh',
        ru: 'Кеббе',
        hi: 'किब्बेह',
        sq: 'Kibbeh',
        fr: 'Kibbeh',
        de: 'Kibbeh',
        bn: 'কিবেহ',
        ko: '키베'
      }, 
      description: { 
        en: 'A Middle Eastern classic with a crispy outer shell made from finely ground rice and spices, encasing a flavorful minced meat filling (beef, peas, carrot, almonds, raisins). Fried to perfection, Kibbeh adds a rich aroma and unique taste to your dining experience.',
        ar: 'كلاسيكية شرق أوسطية بقشرة خارجية مقرمشة مصنوعة من الأرز المطحون ناعماً والبهارات، تحتوي على حشوة لحم مفروم نكهة (لحم البقر، البازلاء، الجزر، اللوز، الزبيب). مقلية إلى الكمال، الكبة تضيف رائحة غنية وطعم فريد لتجربة تناول الطعام.',
        fa: 'یک کلاسیک خاورمیانه‌ای با پوسته بیرونی ترد از برنج آسیاب شده و ادویه‌جات، حاوی گوشت چرخ کرده طعم‌دار (گوشت گاو، نخود فرنگی، هویج، بادام، کشمش). سرخ شده تا کمال، کبه عطر غنی و طعم منحصر به فرد به تجربه غذایی شما می‌افزاید.',
        ku: 'کلاسیکێکی ڕۆژهەڵاتی ناوەڕاست بە قاڵبێکی دەرەوەی ترسکە لە برنجی وردکراو و بەهارات، دەوری گۆشتی وردکراوی بەتام (گۆشتی گا، نۆک، گەزەر، بادەم، کشمیش) دەگرێت. بە تەواوی سوورکراوە، کبه بۆنێکی دەوڵەمەند و تامێکی ناوازە زیاد دەکات بۆ ئەزموونی خواردنت.',
        tr: 'İnce öğütülmüş pirinç ve baharatlardan yapılan çıtır dış kabuğu olan, lezzetli kıyma doldurulmuş (dana eti, bezelye, havuç, badem, kuru üzüm) Orta Doğu klasiği. Mükemmelliğe kadar kızartılan Kibbeh, yemek deneyiminize zengin bir aroma ve eşsiz bir tat katıyor.',
        ur: 'باریک پسے ہوئے چاول اور مصالحوں سے بنا کرسپی بیرونی خول کے ساتھ مشرق وسطیٰ کا کلاسک، جس میں ذائقہ دار قیمہ (بیف، مٹر، گاجر، بادام، کشمش) بھرا ہوا ہے۔ کمال تک تلا ہوا، کبہ آپ کے کھانے کے تجربے میں بھرپور خوشبو اور منفرد ذائقہ شامل کرتا ہے۔',
        kmr: 'Klasîkeke Rojhilatê Navîn bi kabrikek derve yê çitir ku ji brincê xweş hatî hêsandin û baharatan hatî çêkirin, ku goştê hûrkirî yê bi tam (goştê ga, nok, gêzer, badem, tirî) tê de hatiye dagirtin. Heta bi temamî hatiye sorkirin, Kibbeh bêhnek dewlemend û tamek bêhempa li ser ezmûna xwarinê zêde dike.',
        es: 'Un clásico de Medio Oriente con una cáscara exterior crujiente hecha de arroz finamente molido y especias, envolviendo un relleno de carne picada sabrosa (carne de res, guisantes, zanahoria, almendras, pasas). Frita a la perfección, el Kibbeh añade un aroma rico y sabor único a tu experiencia gastronómica.',
        ru: 'Классическое ближневосточное блюдо с хрустящей внешней оболочкой из мелко молотого риса и специй, с начинкой из ароматного рубленого мяса (говядина, горошек, морковь, миндаль, изюм). Жаренное до совершенства, кеббе добавляет богатый аромат и уникальный вкус к вашему обеду.',
        hi: 'बारीक पिसे चावल और मसालों से बना कुरकुरा बाहरी आवरण के साथ मध्य पूर्वी क्लासिक, जिसमें स्वादिष्ट कीमा (बीफ, मटर, गाजर, बादाम, किशमिश) भरा होता है। पूर्णता तक तला गया, किब्बेह आपके भोजन के अनुभव में समृद्ध सुगंध और अनूठा स्वाद जोड़ता है।',
        sq: 'Një klasik i Lindjes së Mesme me një lëvore të jashtme të krisur e bërë nga orizi i bluar imët dhe erëza, që mban një mbushje mishi të grirë plot shije (viç, bizele, karrota, bajame, rrush i thatë). E skuqur në përsosmëri, Kibbeh-i shton një aromë të pasur dhe shije të veçantë në përvojën tuaj të ngrënies.',
        fr: 'Un classique du Moyen-Orient avec une coquille extérieure croustillante faite de riz finement moulu et d\'épices, renfermant une farce de viande hachée savoureuse (bœuf, petits pois, carotte, amandes, raisins secs). Frit à la perfection, le Kibbeh ajoute un arôme riche et un goût unique à votre expérience culinaire.',
        de: 'Ein nahöstlicher Klassiker mit knuspriger äußerer Hülle aus fein gemahlenem Reis und Gewürzen, gefüllt mit würzigem Hackfleisch (Rindfleisch, Erbsen, Karotten, Mandeln, Rosinen). Perfekt frittiert verleiht Kibbeh Ihrem kulinarischen Erlebnis ein reiches Aroma und einen einzigartigen Geschmack.',
        bn: 'সূক্ষ্ম ভাত এবং মশলা দিয়ে তৈরি খাস্তা বাইরের খোসা সহ মধ্যপ্রাচ্যের ক্লাসিক, যাতে সুস্বাদু কীমা ভর্তি (গরুর মাংস, মটর, গাজর, বাদাম, কিশমিশ) রয়েছে। নিখুঁতভাবে ভাজা, কিবেহ আপনার খাবারের অভিজ্ঞতায় সমৃদ্ধ সুগন্ধ এবং অনন্য স্বাদ যোগ করে।',
        ko: '잘게 간 쌀과 향신료로 만든 바삭한 외피에 맛있는 다진 고기 속(소고기, 완두콩, 당근, 아몬드, 건포도)이 들어간 중동의 클래식 요리입니다. 완벽하게 튀긴 키베는 당신의 식사 경험에 풍부한 향과 독특한 맛을 더합니다.'
      }, 
      price: '$10.99', 
      category: 'appetizers', 
      popular: true, 
      image: '/Kibbeh.jpg',
      tags: [] 
    },
    { 
      id: 1005, 
      name: { 
        en: 'Falafels',
        ar: 'فلافل',
        fa: 'فلافل',
        ku: 'فەلەفڵ',
        tr: 'Falafel',
        ur: 'فلافل',
        kmr: 'Falafel',
        es: 'Falafel',
        ru: 'Фалафель',
        hi: 'फलाफेल',
        fr: 'Falafels',
        de: 'Falafels',
        bn: 'ফালাফেল',
        ko: '팔라펠'
      }, 
      description: { 
        en: 'Consisting of chickpea patties seasoned with aromatic spices and fried to a golden, crispy exterior, and served with hummus and a drizzle of olive oil, this delightful snack adds a delicious touch to your dining experience.',
        ar: 'يتكون من أقراص الحمص المتبلة بالتوابل العطرية والمقلية إلى لون ذهبي مقرمش من الخارج، ويُقدم مع الحمص ورذاذ من زيت الزيتون، هذه الوجبة الخفيفة اللذيذة تضيف لمسة لذيذة لتجربة تناول الطعام.',
        fa: 'شامل کتلت‌های نخود طعم‌دار شده با ادویه‌جات معطر و سرخ شده تا بیرون طلایی و ترد، و با حمص و قطره‌ای از روغن زیتون سرو می‌شود، این تنقلات لذیذ لمسه‌ای خوشمزه به تجربه غذایی شما می‌افزاید.',
        ku: 'پێکهاتووە لە پەتی نۆک کە بە بەهاراتی بۆنخۆش تامدراوە و سوورکراوە بۆ دەرەوەیەکی ئاڵتوونی و ترسکە، و لەگەڵ حممس و دڵۆپەیەک زەیتی زەیتوون خراوەتە سەر، ئەم خۆراکە خۆشە لمسەیەکی خۆش زیاد دەکات بۆ ئەزموونی خواردنت.',
        tr: 'Aromatik baharatlarla tatlandırılmış ve altın sarısı, çıtır bir dış kısım elde edene kadar kızartılmış nohut köftelerinden oluşur ve humus ile bir tutam zeytinyağı ile servis edilir, bu lezzetli atıştırmalık yemek deneyiminize lezzetli bir dokunuş katıyor.',
        ur: 'خوشبودار مصالحوں کے ساتھ ذائقہ دار چنے کے پیٹی پر مشتمل ہے اور سنہری، کرسپی بیرونی حصے تک تلا جاتا ہے، اور حمص اور زیتون کے تیل کے چھڑکاؤ کے ساتھ پیش کیا جاتا ہے، یہ لذیذ اسنیک آپ کے کھانے کے تجربے میں ایک لذیذ ٹچ شامل کرتا ہے۔',
        kmr: 'Ji pelên kurskotinê pêk tê ku bi baharatên bêhnxweş hatine tatdarkirin û heta dereke zêrîn û çitir hatine sorkirin, û bi humusê û tiliyeke zeyta zeytûnê tê peşkêşkirin, ev xwarinê xweş lêdanek tatdar li ser ezmûna xwarinê zêde dike.',
        es: 'Consiste en hamburguesas de garbanzos sazonadas con especias aromáticas y fritas hasta obtener un exterior dorado y crujiente, y se sirve con hummus y un chorrito de aceite de oliva, esta deliciosa botana añade un toque delicioso a tu experiencia gastronómica.',
        ru: 'Состоит из котлеток из нута, приправленных ароматными специями и обжаренных до золотистой, хрустящей корочки, и подается с хумусом и сбрызгивается оливковым маслом, эта восхитительная закуска добавляет вкусный штрих к вашему обеду.',
        hi: 'सुगंधित मसालों के साथ स्वादिष्ट चने की पैटी से बना और सुनहरा, कुरकुरा बाहरी हिस्सा बनने तक तला गया, और हम्मुस और जैतून के तेल की फुहार के साथ परोसा जाता है, यह स्वादिष्ट नाश्ता आपके भोजन के अनुभव में एक स्वादिष्ट स्पर्श जोड़ता है।',
        sq: 'Përbëhet nga patate gronosh të kondimentuara me erëza aromatike dhe të skuqura deri në një të jashtme të artë dhe të krisur, dhe shërbehet me humus dhe një spërkatje vaji ulliri, kjo meze e shijshme shton një prekje të shijshme në përvojën tuaj të të ngrënit.',
        fr: 'Composé de galettes de pois chiches assaisonnées aux épices aromatiques et frites jusqu\'à obtenir un extérieur doré et croustillant, et servi avec du houmous et un filet d\'huile d\'olive, cette délicieuse collation ajoute une touche savoureuse à votre expérience culinaire.',
        de: 'Besteht aus Kichererbsen-Bällchen, die mit aromatischen Gewürzen gewürzt und zu einer goldenen, knusprigen Außenhaut frittiert werden, und serviert mit Hummus und einem Schuss Olivenöl, dieser köstliche Snack verleiht Ihrem kulinarischen Erlebnis eine delikate Note.',
        bn: 'সুগন্ধি মশলা দিয়ে তৈরি ছোলার প্যাটি এবং সোনালী, খাস্তা বাইরের অংশ পর্যন্ত ভাজা, এবং হুমুস এবং জলপাই তেলের ছিটা দিয়ে পরিবেশিত, এই সুস্বাদু স্ন্যাক আপনার খাবারের অভিজ্ঞতায় একটি সুস্বাদু স্পর্শ যোগ করে।',
        ko: '향신료로 양념한 병아리콩 패티를 황금빛 바삭한 겉면이 될 때까지 튀기고, 후무스와 올리브 오일 뿌림과 함께 제공되는 이 맛있는 스낵은 당신의 식사 경험에 맛있는 터치를 더합니다.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian', 'vegan'], 
      image: '/Falafels.jpg' 
    },
    { 
      id: 1006, 
      name: { 
        en: "Nature's Garden",
        ar: 'حديقة الطبيعة',
        fa: 'باغ طبیعت',
        ku: 'باخی سروشت',
        tr: 'Doğanın Bahçesi',
        ur: 'فطرت کا باغ',
        kmr: 'Baxçeya Xwezayê',
        es: 'Jardín de la Naturaleza',
        ru: 'Сад природы',
        hi: 'प्रकृति का बगीचा',
        sq: 'Kopshti i Natyrës',
        fr: 'Jardin de la Nature',
        de: 'Natur-Garten',
        bn: 'প্রকৃতির বাগান',
        ko: '자연의 정원'
      }, 
      description: { 
        en: 'A light and nutritious savory dip is made with a base of yogurt, garlic and aromatic spices, and it is topped with dried tomatoes, fresh thyme, walnuts, mint, Kalamata olives and olive oil.',
        ar: 'غموس خفيف ومغذي مصنوع على أساس اللبن والثوم والتوابل العطرة، ومزين بالطماطم المجففة والزعتر الطازج والجوز والنعناع وزيتون كالاماتا وزيت الزيتون.',
        fa: 'یک دیپ خوشمزه سبک و مغذی با پایه ماست، سیر و ادویه‌های معطر تهیه شده و با گوجه خشک، آویشن تازه، گردو، نعنا، زیتون کالاماتا و روغن زیتون تزئین شده است.',
        ku: 'دیپێکی سوک و پێویست بە بنەمای ماست، سیر و بۆنخۆشکەری دروستکراوە و بە تەماتەی وشککراو، جەعدەی تازە، گوێز، پونگ، زەیتونی کالاماتا و زەیتی زەیتوون ڕازێنراوەتەوە.',
        tr: 'Yoğurt, sarımsak ve aromatik baharatlar bazında hazırlanan hafif ve besleyici lezzetli meze, kurutulmuş domates, taze kekik, ceviz, nane, Kalamata zeytini ve zeytinyağı ile süslenir.',
        ur: 'دہی، لہسن اور خوشبودار مصالحے کی بنیاد پر بنایا گیا ہلکا اور غذائیت سے بھرپور مزیدار ڈپ، جو خشک ٹماٹر، تازہ اجوائن، اخروٹ، پودینہ، کالاماٹا زیتون اور زیتون کے تیل سے سجایا گیا ہے۔',
        kmr: 'Mezeyeke sivik û pêwîst ku li ser bingehek mastê, sîr û baharan tê çêkirin û bi firangoşên ziwa, sîrînkê taze, gihok, pûng, zeytûnên Kalamata û zeyta zeytûnê tê xemilandin.',
        es: 'Una salsa ligera y nutritiva hecha con una base de yogur, ajo y especias aromáticas, y está cubierta con tomates secos, tomillo fresco, nueces, menta, aceitunas Kalamata y aceite de oliva.',
        ru: 'Лёгкая и питательная пикантная закуска на основе йогурта, чеснока и ароматных специй, украшенная вялеными томатами, свежим тимьяном, грецкими орехами, мятой, оливками каламата и оливковым маслом.',
        hi: 'दही, लहसुन और सुगंधित मसालों के आधार पर बना हल्का और पौष्टिक स्वादिष्ट डिप, जो सूखे टमाटर, ताज़ा अजवाइन, अखरोट, पुदीना, कलामाटा जैतून और जैतून के तेल से सजाया गया है।',
        sq: 'Një sos i lehtë dhe ushqyes i bërë me një bazë kosi, hudhra dhe erëza aromatike, dhe është mbuluar me domate të thata, rigon të freskët, arra, mendër, ullinj Kalamata dhe vaj ulliri.',
        fr: 'Une trempette légère et nutritive préparée avec une base de yaourt, ail et épices aromatiques, et garnie de tomates séchées, thym frais, noix, menthe, olives Kalamata et huile d\'olive.',
        de: 'Ein leichter und nahrhafter würziger Dip auf Basis von Joghurt, Knoblauch und aromatischen Gewürzen, garniert mit getrockneten Tomaten, frischem Thymian, Walnüssen, Minze, Kalamata-Oliven und Olivenöl.',
        bn: 'দই, রসুন এবং সুগন্ধি মশলার ভিত্তিতে তৈরি একটি হালকা এবং পুষ্টিকর স্বাদযুক্ত ডিপ, যা শুকনো টমেটো, তাজা থাইম, আখরোট, পুদিনা, কালামাতা জলপাই এবং জলপাই তেল দিয়ে সাজানো।',
        ko: '요거트, 마늘, 향신료를 베이스로 한 가볍고 영양가 있는 맛있는 딥으로, 말린 토마토, 신선한 타임, 호두, 민트, 칼라마타 올리브, 올리브 오일로 토핑됩니다.'
      }, 
      price: '$10.99', 
      category: 'appetizers', 
      image: '/Nature\'s Garden.jpg',
      tags: ['vegetarian'] 
    },
    { 
      id: 1007, 
      name: { 
        en: 'Borek',
        ar: 'بوريك',
        fa: 'بورک',
        ku: 'بۆرک',
        tr: 'Börek',
        ur: 'بورک',
        kmr: 'Borek',
        es: 'Borek',
        ru: 'Борек',
        hi: 'बोरेक',
        sq: 'Byrek',
        fr: 'Börek',
        de: 'Börek',
        bn: 'বোরেক',
        ko: '보렉'
      }, 
      description: { 
        en: 'Handmade beef börek is crafted with a rich filling (beef, peas, carrot) and served with a special sauce. This delicious börek, with its crispy pastry and unique sauce, leaves an unforgettable taste on the palate.',
        ar: 'البوريك اللحم البقري المصنوع يدوياً مصنوع بحشوة غنية (لحم البقر، البازلاء، الجزر) ويُقدم مع صلصة خاصة. هذا البوريك اللذيذ، بمعجنه المقرمش وصلصته الفريدة، يترك طعماً لا ينسى على الحنك.',
        fa: 'بورک گوشت گاو دستساز با پر کردن غنی (گوشت گاو، نخود فرنگی، هویج) ساخته شده و با سس مخصوص سرو می‌شود. این بورک لذیذ با خمیر ترد و سس منحصر به فردش طعمی فراموش‌نشدنی روی کام می‌گذارد.',
        ku: 'بۆرکی گۆشتی گای دەستکرد بە پڕکردنەوەیەکی دەوڵەمەند (گۆشتی گا، نۆک، گەزەر) دروستکراوە و لەگەڵ سۆسێکی تایبەت خراوەتە سەر. ئەم بۆرکە خۆشە، بە هەویرە ترسکەکەی و سۆسە ناوازەکەی، تامێکی لەبیرنەکراو لەسەر مل جێدەهێڵێت.',
        tr: 'El yapımı dana böreği zengin iç harçla (dana eti, bezelye, havuç) hazırlanır ve özel sosla servis edilir. Çıtır hamuru ve eşsiz sosuyla bu lezzetli börek damakta unutulmaz bir tat bırakır.',
        ur: 'ہاتھ سے بنا بیف بورک بھرپور بھرائی (بیف، مٹر، گاجر) کے ساتھ تیار کیا جاتا ہے اور خاص ساس کے ساتھ پیش کیا جاتا ہے۔ یہ لذیذ بورک اپنی کرسپی پیسٹری اور منفرد ساس کے ساتھ تالو پر ناقابل فراموش ذائقہ چھوڑتا ہے۔',
        kmr: 'Boreka goştê ga ya bi dest çêkirî bi dagirtineke dewlemend (goştê ga, nok, gêzer) hatiye amade kirin û bi soşeke taybetî tê peşkêşkirin. Ev boreka bi tam, bi hêvîrê xwe yê çitir û soşa xwe ya bêhempa, tamek jibîrnekirin li ser devê dimîne.',
        es: 'El börek de carne de res hecho a mano se elabora con un relleno rico (carne de res, guisantes, zanahoria) y se sirve con una salsa especial. Este delicioso börek, con su masa crujiente y salsa única, deja un sabor inolvidable en el paladar.',
        ru: 'Домашний говяжий бёрек изготавливается с богатой начинкой (говядина, горошек, морковь) и подается со специальным соусом. Этот вкусный бёрек с хрустящим тестом и уникальным соусом оставляет незабываемый вкус на небе.',
        hi: 'हस्तनिर्मित बीफ बोरेक समृद्ध भराव (बीफ, मटर, गाजर) के साथ बनाया जाता है और विशेष सॉस के साथ परोसा जाता है। यह स्वादिष्ट बोरेक अपनी कुरकुरी पेस्ट्री और अनोखी सॉस के साथ तालु पर अविस्मरणीय स्वाद छोड़ता है।',
        sq: 'Byreku i viçit i bërë me dorë është përgatitur me një mbushje të pasur (viç, bizele, karrota) dhe shërbehet me një salcë të veçantë. Ky byrek i shijshëm, me brumë të krisur dhe salcë të veçantë, lë një shije të paharrueshme në qiell të gojës.',
        fr: 'Le börek de bœuf fait main est préparé avec une garniture riche (bœuf, petits pois, carotte) et servi avec une sauce spéciale. Ce délicieux börek, avec sa pâte croustillante et sa sauce unique, laisse un goût inoubliable en bouche.',
        de: 'Handgemachter Rind-börek wird mit einer reichhaltigen Füllung (Rindfleisch, Erbsen, Karotten) zubereitet und mit einer besonderen Sauce serviert. Dieser köstliche börek hinterlässt mit seinem knusprigen Teig und seiner einzigartigen Sauce einen unvergesslichen Geschmack am Gaumen.',
        bn: 'হস্তনির্মিত গরুর মাংসের বোরেক সমৃদ্ধ ভর্তা (গরুর মাংস, মটর, গাজর) দিয়ে তৈরি এবং বিশেষ সস দিয়ে পরিবেশিত। এই সুস্বাদু বোরেক, তার খাস্তা পেস্ট্রি এবং অনন্য সস দিয়ে তালুতে অবিস্মরণীয় স্বাদ রেখে যায়।',
        ko: '수제 쇠고기 보렉은 풍부한 속 재료(쇠고기, 완두콩, 당근)로 만들어지며 특별한 소스와 함께 제공됩니다. 바삭한 페이스트리와 독특한 소스가 있는 이 맛있는 보렉은 입맛에 잊을 수 없는 맛을 남깁니다.'
      }, 
      price: '$10.99', 
      category: 'appetizers', 
      tags: [], 
      image: '/Borek.jpg' 
    },
    { 
      id: 1008, 
      name: { 
        en: 'Appetizers Combo',
        ar: 'كومبو المقبلات',
        fa: 'کمبو پیش‌غذا',
        ku: 'کۆمبۆی خۆراکی پێش‌خواردن',
        tr: 'Meze Kombosı',
        ur: 'ایپیٹائزر کمبو',
        kmr: 'Komboa Destpêkan',
        es: 'Combo de Aperitivos',
        ru: 'Комбо из закусок',
        hi: 'ऐपेटाइज़र कॉम्बो',
        sq: 'Kombinim Aperitivësh',
        fr: 'Combo d\'Apéritifs',
        de: 'Vorspeisen-Kombination',
        bn: 'ক্ষুধাবর্ধক কম্বো',
        ko: '전채 콤보'
      }, 
      description: { 
        en: 'This platter brings together three (hummus, baba ghanoush, nature\'s garden) of the most beloved mezze flavors from the Middle East, along with delicious falafel balls. With its elegant presentation and magnificent aromas, it will add a delightful touch to your table.',
        ar: 'يجمع هذا الطبق ثلاثة (حمص، بابا غنوج، حديقة الطبيعة) من أحب نكهات المزة من الشرق الأوسط، إلى جانب كرات الفلافل اللذيذة. بعرضه الأنيق وروائحه الرائعة، سيضيف لمسة رائعة إلى طاولتك.',
        fa: 'این بشقاب سه (حمص، بابا غنوش، باغ طبیعت) طعم محبوب مزه از خاورمیانه را به همراه توپ‌های فلافل لذیذ گرد هم می‌آورد. با ارائه شیک و عطرهای شکوهمندش لمسه‌ای لذت‌بخش به میز شما اضافه خواهد کرد.',
        ku: 'ئەم قاپە سێ (حممس، بابا غنوش، باخی سروشت) لە خۆشترین تامی مەزەی ڕۆژهەڵاتی ناوەڕاست کۆدەکاتەوە، لەگەڵ تۆپی فەلەفڵی خۆش. بە پێشکەشکردنی جوان و بۆنە شکۆدارەکانی، لمسەیەکی خۆش زیاد دەکات بۆ مێزەکەت.',
        tr: 'Bu tabak, lezzetli falafel toplarıyla birlikte Orta Doğu\'nun en sevilen üç (humus, babaganuş, doğanın bahçesi) meze lezzetini bir araya getiriyor. Zarif sunumu ve muhteşem aromalarıyla masanıza keyifli bir dokunuş katacak.',
        ur: 'یہ پلیٹر مشرق وسطیٰ کے تین سب سے محبوب مزے کے ذائقوں (حمص، بابا غنوش، فطرت کا باغ) کو لذیذ فلافل بالز کے ساتھ اکٹھا کرتا ہے۔ اپنی خوبصورت پریزنٹیشن اور شاندار خوشبوؤں کے ساتھ، یہ آپ کی میز میں خوشگوار ٹچ شامل کرے گا۔',
        kmr: 'Ev qabê sê tamên mezeyên herî dilxwaz ên Rojhilatê Navîn (humus, baba ganuş, baxçeya xwezayê), digel topên falafel ên bi tam, kom dike. Bi pêşkêşkirina xwe ya xweş û bêhnên xwe yên ecêb, dê lêdanek xweş li ser masaya we zêde bike.',
        es: 'Esta fuente reúne tres (hummus, baba ghanoush, jardín de la naturaleza) de los sabores de meze más queridos del Medio Oriente, junto con deliciosas bolas de falafel. Con su elegante presentación y magníficos aromas, añadirá un toque delicioso a tu mesa.',
        ru: 'Это блюдо объединяет три самых любимых вкуса мезе с Ближнего Востока (хумус, баба гануш, сад природы) вместе с вкусными шариками фалафель. С элегантной подачей и великолепными ароматами, оно добавит восхитительный штрих к вашему столу.',
        hi: 'यह प्लेटर मध्य पूर्व के तीन सबसे प्रिय मेज़े स्वादों (हम्मुस, बाबा गनूश, प्रकृति का बगीचा) को स्वादिष्ट फलाफेल बॉल्स के साथ मिलाता है। अपनी सुंदर प्रस्तुति और शानदार सुगंध के साथ, यह आपकी मेज़ पर एक आनंददायक स्पर्श जोड़ेगा।',
        sq: 'Kjo pjatë bashkon tre (humus, baba ghanoush, kopshti i natyrës) nga shijët më të dashura të mezes nga Lindja e Mesme, së bashku me topat e shijshme të falafelit. Me prezantimin e saj elegant dhe aromat e shkëlqyera, do të shtojë një prekje të këndshme në tryezën tuaj.',
        fr: 'Cette assiette rassemble trois (houmous, baba ghanoush, jardin de la nature) des saveurs de mezze les plus appréciées du Moyen-Orient, accompagnées de délicieuses boulettes de falafel. Avec sa présentation élégante et ses arômes magnifiques, elle ajoutera une touche délicieuse à votre table.',
        de: 'Diese Platte vereint drei (Hummus, Baba Ghanoush, Natur-Garten) der beliebtesten Mezze-Geschmäcker aus dem Nahen Osten zusammen mit köstlichen Falafel-Bällchen. Mit ihrer eleganten Präsentation und herrlichen Aromen verleiht sie Ihrem Tisch eine wunderbare Note.',
        bn: 'এই প্লেটারটি মধ্যপ্রাচ্যের সবচেয়ে প্রিয় তিনটি মেজে স্বাদ (হুমুস, বাবা গানুশ, প্রকৃতির বাগান) সুস্বাদু ফালাফেল বলের সাথে একত্রিত করে। তার মার্জিত উপস্থাপনা এবং চমৎকার সুগন্ধের সাথে, এটি আপনার টেবিলে একটি আনন্দদায়ক স্পর্শ যোগ করবে।',
        ko: '이 플래터는 맛있는 팔라펠 볼과 함께 중동에서 가장 사랑받는 세 가지 메제 맛(후무스, 바바 가누시, 자연의 정원)을 한데 모았습니다. 우아한 프레젠테이션과 훌륭한 향기로 당신의 테이블에 즐거운 터치를 더할 것입니다.'
      }, 
      price: '$24.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian'], 
      image: '/Appetizers Combo.jpg' 
    },

    // SOUPS
    { 
      id: 1201, 
      name: { 
        en: 'Lentil Soup',
        ar: 'شوربة العدس',
        fa: 'سوپ عدس',
        ku: 'شۆربەی نیسک',
        tr: 'Mercimek Çorbası',
        ur: 'مسور کا سوپ',
        kmr: 'Şorba Masûrkan',
        es: 'Sopa de Lentejas',
        ru: 'Чечевичный суп',
        hi: 'दाल का सूप',
        sq: 'Supë Thjerrash',
        fr: 'Soupe aux Lentilles',
        de: 'Linsensuppe',
        bn: 'মসুর ডালের স্যুপ',
        ko: '렌틸 수프'
      }, 
      description: { 
        en: 'A hearty and nutritious soup made with red lentils, onions, carrots, potatoes, and a blend of aromatic spices.',
        ar: 'شوربة شهية ومغذية مصنوعة من العدس الأحمر والبصل والجزر والبطاطس ومزيج من التوابل العطرية.',
        fa: 'سوپ مقوی و مغذی از عدس قرمز، پیاز، هویج، سیب‌زمینی و ترکیبی از ادویه‌جات معطر.',
        ku: 'شۆربەیەکی بەهێز و بەتوانا لە نیسکی سوور، پیاز، گەزەر، پەتاتە و تێکەڵەیەک لە بەهاراتی بۆنخۆش.',
        tr: 'Kırmızı mercimek, soğan, havuç, patates ve aromatik baharat karışımı ile yapılan tok tutucu ve besleyici çorba.',
        ur: 'سرخ مسور، پیاز، گاجر، آلو اور خوشبودار مصالحوں کے مرکب سے بنا ہردل عزیز اور غذائیت سے بھرپور سوپ۔',
        kmr: 'Şorbayek xwêş û xwînbar ku ji masûrkên sor, pîvaz, gizer, kartol û tevahiya baharatên bêhnxweş tê çêkirin.',
        es: 'Una sopa sustanciosa y nutritiva hecha con lentejas rojas, cebollas, zanahorias, papas y una mezcla de especias aromáticas.',
        ru: 'Сытный и питательный суп из красной чечевицы, лука, моркови, картофеля и смеси ароматных специй.',
        hi: 'लाल मसूर, प्याज, गाजर, आलू और सुगंधित मसालों के मिश्रण से बना पौष्टिक और भरपूर सूप।',
        sq: 'Një supë e bollshme dhe ushqyese e bërë me thjerrëza të kuqe, qepë, karrota, patate dhe një përzierje erëzash aromatike.',
        fr: 'Une soupe nourrissante et nutritive préparée avec des lentilles rouges, des oignons, des carottes, des pommes de terre et un mélange d\'épices aromatiques.',
        de: 'Eine herzhafte und nahrhafte Suppe aus roten Linsen, Zwiebeln, Karotten, Kartoffeln und einer aromatischen Gewürzmischung.',
        bn: 'লাল মসুর ডাল, পেঁয়াজ, গাজর, আলু এবং সুগন্ধি মশলার মিশ্রণ দিয়ে তৈরি একটি হৃদ্যগ্রাহী এবং পুষ্টিকর স্যুপ।',
        ko: '적렌틸, 양파, 당근, 감자, 향긋한 향신료 믹스로 만든 든든하고 영양가 있는 수프입니다.'
      }, 
      image: '/Lentil Soup.jpg',
      price: '$7.99', 
      category: 'soup', 
      popular: true, 
      tags: ['vegetarian', 'vegan'] 
    },

    // SANDWICH & PLATTER
    { 
      id: 1301, 
      name: { 
        en: 'Iraqi Guss Platter',
        ar: 'طبق الگوس العراقي',
        fa: 'پلاتر گوس عراقی',
        ku: 'پلێتەری گووسی عێراقی',
        tr: 'Irak Guss Tabağı',
        ur: 'عراقی گس پلیٹر',
        kmr: 'Plata Gûsê Îraqî',
        es: 'Plato Guss Iraquí',
        ru: 'Иракское блюдо Гусс',
        hi: 'इराकी गुस प्लेटर',
        sq: 'Pjatë Guss Irakiane',
        fr: 'Plateau Guss Irakien',
        de: 'Irakische Guss-Platte',
        bn: 'ইরাকি গুস প্লেটার',
        ko: '이라크 구스 플래터'
      }, 
      description: { 
        en: 'Thinly sliced, seasoned beef, served with saffron rice, sumac onions and fresh salad.',
        ar: 'لحم بقر مقطع رقيقاً ومتبل، يُقدم مع أرز الزعفران وبصل السماق وسلطة طازجة.',
        fa: 'گوشت گاو نازک برش و طعم‌دار شده، با برنج زعفرانی، پیاز سماق و سالاد تازه سرو می‌شود.',
        ku: 'گۆشتی گای باریک پارچەکراو و تامدراو، لەگەڵ برنجی زەعفەران، پیازی سەماق و سالادی تازە.',
        tr: 'İnce dilimlenmiş, baharatlanmış sığır eti, safran pilavı, sumak soğanı ve taze salata ile servis edilir.',
        ur: 'باریک کٹا، مصالحہ دار بیف، زعفران چاول، سماق پیاز اور تازہ سلاد کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Goştê ga yê zok perçe û bi baharatan, bi brincê zefranî, pîvazên sumaqî û salatayek taze tê peşkêşkirin.',
        es: 'Carne de res finamente rebanada y sazonada, servida con arroz de azafrán, cebollas sumac y ensalada fresca.',
        ru: 'Тонко нарезанная, приправленная говядина, подается с шафрановым рисом, луком сумах и свежим салатом.',
        hi: 'पतली कटी, मसालेदार बीफ, केसर चावल, सुमाक प्याज और ताज़ा सलाद के साथ परोसा जाता है।',
        sq: 'Viç i prerë hollë, i erëzuar, i shërbyer me oriz me shafran, qepë sumak dhe sallatë të freskët.',
        fr: 'Bœuf finement tranché et assaisonné, servi avec du riz au safran, des oignons sumac et une salade fraîche.',
        de: 'Dünn geschnittenes, gewürztes Rindfleisch, serviert mit Safranreis, Sumach-Zwiebeln und frischem Salat.',
        bn: 'পাতলা করে কাটা, মশলাযুক্ত গরুর মাংস, জাফরান ভাত, সুমাক পেঁয়াজ এবং তাজা সালাদ দিয়ে পরিবেশিত।',
        ko: '얇게 썬 양념 쇠고기로, 사프란 쌀, 수막 양파, 신선한 샐러드와 함께 제공됩니다.'
      }, 
      image: '/Iraqi Guss Platter.jpg',
      price: '$19.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1301.5, 
      name: { 
        en: 'Iraqi Guss Wrap',
        ar: 'لفافة الگوس العراقي',
        fa: 'راپ گوس عراقی',
        ku: 'ڕاپی گووسی عێراقی',
        tr: 'Irak Guss Sarması',
        ur: 'عراقی گس ریپ',
        kmr: 'Pêçana Gûsê Îraqî',
        es: 'Wrap Guss Iraquí',
        ru: 'Иракская лепешка Гусс',
        hi: 'इराकी गुस रैप',
        sq: 'Wrap Guss Irakian',
        fr: 'Wrap Guss Irakien',
        de: 'Irakischer Guss-Wrap',
        bn: 'ইরাকি গুস র‍্যাপ',
        ko: '이라크 구스 랩'
      }, 
      description: { 
        en: 'Thinly sliced, seasoned beef, tahini sauce, onion, lettuce, tomato and cucumber. Served with a fresh salad or fries upon request.',
        ar: 'لحم بقر مقطع رقيقاً ومتبل، صلصة الطحينة، بصل، خس، طماطم وخيار. يُقدم مع سلطة طازجة أو بطاطس مقلية عند الطلب.',
        fa: 'گوشت گاو نازک برش و طعم‌دار شده، سس طحینه، پیاز، کاهو، گوجه‌فرنگی و خیار. با سالاد تازه یا سیب‌زمینی سرخ‌کرده در صورت درخواست سرو می‌شود.',
        ku: 'گۆشتی گای باریک پارچەکراو و تامدراو، سۆسی تاحینی، پیاز، خس، تەماتە و خیار. لەگەڵ سالادی تازە یان پەتاتەی سوورکراو بەپێی داواکاری.',
        tr: 'İnce dilimlenmiş, baharatlanmış sığır eti, tahin sosu, soğan, marul, domates ve salatalık. Talep üzerine taze salata veya patates kızartması ile servis edilir.',
        ur: 'باریک کٹا، مصالحہ دار بیف، طحینی ساس، پیاز، لیٹس، ٹماٹر اور کھیرا۔ درخواست پر تازہ سلاد یا فرائز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Goştê ga yê zok perçe û bi baharatan, soşa tahinê, pîvaz, salata kesk, firangoş û xiyar. Li ser daxwazê bi salatayek taze an kartolên sor tê peşkêşkirin.',
        es: 'Carne de res finamente rebanada y sazonada, salsa tahini, cebolla, lechuga, tomate y pepino. Se sirve con ensalada fresca o papas fritas bajo petición.',
        ru: 'Тонко нарезанная, приправленная говядина, соус тахини, лук, салат, помидор и огурец. Подается со свежим салатом или картофелем фри по запросу.',
        hi: 'पतली कटी, मसालेदार बीफ, तहिनी सॉस, प्याज, सलाद पत्ता, टमाटर और खीरा। अनुरोध पर ताज़ा सलाद या फ्राइज़ के साथ परोसा जाता है।',
        sq: 'Viç i prerë hollë, i erëzuar, salcë tahini, qepë, marule, domate dhe kastravec. Shërbehet me sallatë të freskët ose patate të skuqura sipas kërkesës.',
        fr: 'Bœuf finement tranché et assaisonné, sauce tahini, oignon, laitue, tomate et concombre. Servi avec une salade fraîche ou des frites sur demande.',
        de: 'Dünn geschnittenes, gewürztes Rindfleisch, Tahini-Sauce, Zwiebel, Kopfsalat, Tomate und Gurke. Auf Wunsch mit frischem Salat oder Pommes frites serviert.',
        bn: 'পাতলা করে কাটা, মশলাযুক্ত গরুর মাংস, তাহিনি সস, পেঁয়াজ, লেটুস, টমেটো এবং শসা। অনুরোধে তাজা সালাদ বা ফ্রাইজ দিয়ে পরিবেশিত।',
        ko: '얇게 썬 양념 쇠고기, 타히니 소스, 양파, 상추, 토마토, 오이가 들어갑니다. 요청 시 신선한 샐러드나 감자튀김과 함께 제공됩니다.'
      }, 
      image: '/Iraqi Guss Wrap.jpg',
      price: '$17.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1302, 
      name: { 
        en: 'Chicken Platter',
        ar: 'طبق الدجاج',
        fa: 'پلاتر مرغ',
        ku: 'پلێتەری مریشک',
        tr: 'Tavuk Tabağı',
        ur: 'چکن پلیٹر',
        kmr: 'Plata Mirîşkê',
        es: 'Plato de Pollo',
        ru: 'Куриное блюдо',
        hi: 'चिकन प्लेटर',
        sq: 'Pjatë Pule',
        fr: 'Plateau de Poulet',
        de: 'Hähnchen-Platte',
        bn: 'চিকেন প্লেটার',
        ko: '치킨 플래터'
      }, 
      description: { 
        en: 'Thinly sliced, seasoned chicken, served with saffron rice, sumac onions and fresh salad.',
        ar: 'دجاج مقطع رقيقاً ومتبل، يُقدم مع أرز الزعفران وبصل السماق وسلطة طازجة.',
        fa: 'مرغ نازک برش و طعم‌دار شده، با برنج زعفرانی، پیاز سماق و سالاد تازه سرو می‌شود.',
        ku: 'مریشکی باریک پارچەکراو و تامدراو، لەگەڵ برنجی زەعفەران، پیازی سەماق و سالادی تازە.',
        tr: 'İnce dilimlenmiş, baharatlanmış tavuk, safran pilavı, sumak soğanı ve taze salata ile servis edilir.',
        ur: 'باریک کٹا، مصالحہ دار چکن، زعفران چاول، سماق پیاز اور تازہ سلاد کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mirîşkê zok perçe û bi baharatan, bi brincê zefranî, pîvazên sumaqî û salatayek taze tê peşkêşkirin.',
        es: 'Pollo finamente rebanado y sazonado, servido con arroz de azafrán, cebollas sumac y ensalada fresca.',
        ru: 'Тонко нарезанная, приправленная курица, подается с шафрановым рисом, луком сумах и свежим салатом.',
        hi: 'पतली कटी, मसालेदार चिकन, केसर चावल, सुमाक प्याज और ताज़ा सलाद के साथ परोसा जाता है।',
        sq: 'Pulë e prerë hollë, e erëzuar, e shërbyer me oriz me shafran, qepë sumak dhe sallatë të freskët.',
        fr: 'Poulet finement tranché et assaisonné, servi avec du riz au safran, des oignons sumac et une salade fraîche.',
        de: 'Dünn geschnittenes, gewürztes Hähnchen, serviert mit Safranreis, Sumach-Zwiebeln und frischem Salat.',
        bn: 'পাতলা করে কাটা, মশলাযুক্ত চিকেন, জাফরান ভাত, সুমাক পেঁয়াজ এবং তাজা সালাদ দিয়ে পরিবেশিত।',
        ko: '얇게 썬 양념 치킨을 사프란 쌀, 수막 양파, 신선한 샐러드와 함께 제공합니다.'
      }, 
      image: '/Chicken Platter.jpg',
      price: '$18.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1302.5, 
      name: { 
        en: 'Chicken Wrap',
        ar: 'لفافة الدجاج',
        fa: 'راپ مرغ',
        ku: 'ڕاپی مریشک',
        tr: 'Tavuk Sarması',
        ur: 'چکن ریپ',
        kmr: 'Şerpêça Mirîşkê',
        es: 'Wrap de Pollo',
        ru: 'Куриный рол',
        hi: 'चिकन रैप',
        sq: 'Wrap Pule',
        fr: 'Wrap au Poulet',
        de: 'Hähnchen-Wrap',
        bn: 'চিকেন র‍্যাপ',
        ko: '치킨 랩'
      }, 
      description: { 
        en: 'Sliced, seasoned chicken, tahini sauce, onion, lettuce, tomato and cucumber. Served with a fresh salad or fries upon request.',
        ar: 'دجاج مقطع ومتبل، صلصة الطحينة، بصل، خس، طماطم وخيار. يُقدم مع سلطة طازجة أو بطاطس مقلية حسب الطلب.',
        fa: 'مرغ برش شده و طعم‌دار، سس طحینه، پیاز، کاهو، گوجه و خیار. با سالاد تازه یا سیب‌زمینی سرخ‌کرده بر اساس درخواست سرو می‌شود.',
        ku: 'مریشکی پارچەکراو و تامدراو، سۆسی تەحینە، پیاز، خەس، تەماتە و خیار. لەگەڵ سالادی تازە یان پەتاتەی سوورکراو بەپێی داواکاری دەخرێتە بەردەست.',
        tr: 'Dilimlenmiş, baharatlanmış tavuk, tahin sosu, soğan, marul, domates ve salatalık. İsteğe bağlı olarak taze salata veya patates kızartması ile servis edilir.',
        ur: 'کٹا ہوا، مصالحہ دار چکن، طحینی ساس، پیاز، لیٹس، ٹماٹر اور کھیرا۔ درخواست پر تازہ سلاد یا فرائز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mirîşkê parçekirî û bi baharatan, sosê tahinî, pîvaz, xes, firengtiyê û khiyar. Bi daxwazê bi salatayek taze an patatesên sorandî tê peşkêşkirin.',
        es: 'Pollo en rodajas y sazonado, salsa tahini, cebolla, lechuga, tomate y pepino. Servido con ensalada fresca o papas fritas bajo petición.',
        ru: 'Нарезанная, приправленная курица, соус тахини, лук, салат, помидор и огурец. Подается со свежим салатом или картофелем фри по запросу.',
        hi: 'कटा हुआ, मसालेदार चिकन, तहिनी सॉस, प्याज, सलाद पत्ता, टमाटर और खीरा। अनुरोध पर ताज़ा सलाद या फ्राइज़ के साथ परोसा जाता है।',
        sq: 'Pulë e prerë, e erëzuar, salcë tahini, qepë, marule, domate dhe kastravec. Shërbehet me sallatë të freskët ose patate të skuqura sipas kërkesës.',
        fr: 'Poulet tranché et assaisonné, sauce tahini, oignon, laitue, tomate et concombre. Servi avec une salade fraîche ou des frites sur demande.',
        de: 'Geschnittenes, gewürztes Hähnchen, Tahini-Sauce, Zwiebel, Kopfsalat, Tomate und Gurke. Auf Wunsch mit frischem Salat oder Pommes frites serviert.',
        bn: 'কাটা, মশলাযুক্ত চিকেন, তাহিনি সস, পেঁয়াজ, লেটুস, টমেটো এবং শসা। অনুরোধে তাজা সালাদ বা ফ্রাইজ দিয়ে পরিবেশিত।',
        ko: '썬 양념 치킨, 타히니 소스, 양파, 상추, 토마토, 오이가 들어갑니다. 요청 시 신선한 샐러드나 감자튀김과 함께 제공됩니다.'
      }, 
      image: '/Chicken Wrap.jpg',
      price: '$16.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1303, 
      name: { 
        en: 'Falafels Platter',
        ar: 'طبق الفلافل',
        fa: 'پلاتر فلافل',
        ku: 'پلێتەری فەلەفڵ',
        tr: 'Falafel Tabağı',
        ur: 'فلافل پلیٹر',
        kmr: 'Plata Falafelan',
        es: 'Plato de Falafel',
        ru: 'Блюдо фалафель',
        hi: 'फलाफेल प्लेटर',
        sq: 'Pjatë Falafel',
        fr: 'Plateau de Falafels',
        de: 'Falafels-Platte',
        bn: 'ফালাফেল প্লেটার',
        ko: '팔라펠 플래터'
      }, 
      description: { 
        en: 'Special chef made crispy falafel balls served with hummus, fresh salad and sumac onions.',
        ar: 'كرات فلافل مقرمشة خاصة من صنع الشيف تُقدم مع الحمص والسلطة الطازجة وبصل السماق.',
        fa: 'کوفته‌های فلافل ترد مخصوص سرآشپز با حمص، سالاد تازه و پیاز سماق سرو می‌شود.',
        ku: 'گۆڵەی فەلەفڵی ترسکەی تایبەتی دروستکراوی سەرچێشت لەگەڵ حومس، سالادی تازە و پیازی سەماق.',
        tr: 'Şefin özel yapımı çıtır falafel topları humus, taze salata ve sumak soğanı ile servis edilir.',
        ur: 'شیف کے خاص بنائے ہوئے کرسپی فلافل بالز حمص، تازہ سلاد اور سماق پیاز کے ساتھ پیش کیے جاتے ہیں۔',
        kmr: 'Giloyên falafel ên çitir ên taybet ên çêker bi humus, salatayek taze û pîvazên sumaqî tên peşkêşkirin.',
        es: 'Bolas de falafel crujientes especiales del chef servidas con hummus, ensalada fresca y cebollas sumac.',
        ru: 'Специальные хрустящие шарики фалафель от шеф-повара, подаются с хумусом, свежим салатом и луком сумах.',
        hi: 'शेफ के विशेष कुरकुरे फलाफेल बॉल्स हम्मस, ताज़ा सलाद और सुमाक प्याज के साथ परोसे जाते हैं।',
        sq: 'Topat e veçantë të falafeli të krisura të shefit të shërbyer me hummus, sallatë të freskët dhe qepë sumak.',
        fr: 'Boulettes de falafel croustillantes spéciales du chef servies avec houmous, salade fraîche et oignons sumac.',
        de: 'Spezielle knusprige Falafel-Bällchen vom Küchenchef, serviert mit Hummus, frischem Salat und Sumach-Zwiebeln.',
        bn: 'শেফের বিশেষ তৈরি খাস্তা ফালাফেল বল হুমুস, তাজা সালাদ এবং সুমাক পেঁয়াজ দিয়ে পরিবেশিত।',
        ko: '셰프가 특별히 만든 바삭한 팔라펠 볼을 후무스, 신선한 샐러드, 수막 양파와 함께 제공합니다.'
      }, 
      image: '/Falafel Platter.jpg',
      price: '$17.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1303.5, 
      name: { 
        en: 'Falafel Wrap',
        ar: 'لفافة الفلافل',
        fa: 'راپ فلافل',
        ku: 'ڕاپی فەلەفڵ',
        tr: 'Falafel Sarması',
        ur: 'فلافل ریپ',
        kmr: 'Şerpêça Falafela',
        es: 'Wrap de Falafel',
        ru: 'Рол с фалафель',
        hi: 'फलाफेल रैप',
        sq: 'Wrap Falafel',
        fr: 'Wrap aux Falafels',
        de: 'Falafel-Wrap',
        bn: 'ফালাফেল র‍্যাপ',
        ko: '팔라펠 랩'
      }, 
      description: { 
        en: 'Special chef made crispy falafel balls wrapped in soft pita bread with hummus, onion, lettuce, tomato and cucumber. Served with a fresh salad or fries upon request.',
        ar: 'كرات فلافل مقرمشة خاصة من صنع الشيف ملفوفة في خبز البيتا الناعم مع الحمص والبصل والخس والطماطم والخيار. تُقدم مع سلطة طازجة أو بطاطس مقلية حسب الطلب.',
        fa: 'کوفته‌های فلافل ترد مخصوص سرآشپز در نان پیتای نرم پیچیده شده با حمص، پیاز، کاهو، گوجه و خیار. با سالاد تازه یا سیب‌زمینی سرخ‌کرده بر اساس درخواست سرو می‌شود.',
        ku: 'گۆڵەی فەلەفڵی ترسکەی تایبەتی دروستکراوی سەرچێشت لە نانی پیتای نەرم پێچراوەتەوە لەگەڵ حومس، پیاز، خەس، تەماتە و خیار. لەگەڵ سالادی تازە یان پەتاتەی سوورکراو بەپێی داواکاری دەخرێتە بەردەست.',
        tr: 'Şefin özel yapımı çıtır falafel topları yumuşak pita ekmeği içinde humus, soğan, marul, domates ve salatalık ile sarılmış. İsteğe bağlı olarak taze salata veya patates kızartması ile servis edilir.',
        ur: 'شیف کے خاص بنائے ہوئے کرسپی فلافل بالز نرم پیٹا بریڈ میں حمص، پیاز، لیٹس، ٹماٹر اور کھیرے کے ساتھ لپیٹے گئے۔ درخواست پر تازہ سلاد یا فرائز کے ساتھ پیش کیے جاتے ہیں۔',
        kmr: 'Giloyên falafel ên çitir ên taybet ên çêker di nanê pita yê nerm de bi humus, pîvaz, xes, firengtiyê û khiyar hatine pêçandin. Bi daxwazê bi salatayek taze an patatesên sorandî tên peşkêşkirin.',
        es: 'Bolas de falafel crujientes especiales del chef envueltas en pan pita suave con hummus, cebolla, lechuga, tomate y pepino. Servido con ensalada fresca o papas fritas bajo petición.',
        ru: 'Специальные хрустящие шарики фалафель от шеф-повара, завернутые в мягкую пита-лепешку с хумусом, луком, салатом, помидором и огурцом. Подается со свежим салатом или картофелем фри по запросу.',
        hi: 'शेफ के विशेष कुरकुरे फलाफेल बॉल्स नरम पीटा ब्रेड में हम्मस, प्याज, सलाद पत्ता, टमाटर और खीरे के साथ लपेटे गए। अनुरोध पर ताज़ा सलाद या फ्राइज़ के साथ परोसे जाते हैं।',
        sq: 'Topat e veçantë të falafeli të krisura të shefit të mbështjella në bukë pita të butë me hummus, qepë, marule, domate dhe kastravec. Shërbehet me sallatë të freskët ose patate të skuqura sipas kërkesës.',
        fr: 'Boulettes de falafel croustillantes spéciales du chef enroulées dans du pain pita moelleux avec houmous, oignon, laitue, tomate et concombre. Servi avec une salade fraîche ou des frites sur demande.',
        de: 'Spezielle knusprige Falafel-Bällchen vom Küchenchef in weiches Pita-Brot eingewickelt mit Hummus, Zwiebel, Kopfsalat, Tomate und Gurke. Auf Wunsch mit frischem Salat oder Pommes frites serviert.',
        bn: 'শেফের বিশেষ তৈরি খাস্তা ফালাফেল বল নরম পিটা রুটিতে হুমুস, পেঁয়াজ, লেটুস, টমেটো এবং শসা দিয়ে মোড়ানো। অনুরোধে তাজা সালাদ বা ফ্রাইজ দিয়ে পরিবেশিত।',
        ko: '셰프가 특별히 만든 바삭한 팔라펠 볼을 부드러운 피타 빵에 후무스, 양파, 상추, 토마토, 오이와 함께 감쌌습니다. 요청 시 신선한 샐러드나 감자튀김과 함께 제공됩니다.'
      }, 
      image: '/Falafel Wrap.jpg',
      price: '$15.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1304, 
      name: { 
        en: 'Lahmacun',
        ar: 'لحم بعجين',
        fa: 'لحم عجین',
        ku: 'لەحمەعەجین',
        tr: 'Lahmacun',
        ur: 'لحم عجین',
        kmr: 'Lahmacun',
        es: 'Lahmacun',
        ru: 'Лахмаджун',
        hi: 'लहमाकुन',
        sq: 'Lahmacun',
        fr: 'Lahmacun',
        de: 'Lahmacun',
        bn: 'লাহমাকুন',
        ko: '라흐마쿤'
      }, 
      description: { 
        en: 'A traditional dish, made with a thin dough topped with a flavorful mixture of minced beef and lamb, onions, bell peppers, tomatoes, and spices, is served with tomatoes, lettuce, lemon and sumac onions.',
        ar: 'طبق تقليدي، مصنوع من عجينة رقيقة مغطاة بخليط لذيذ من لحم البقر والضأن المفروم والبصل والفلفل الحلو والطماطم والتوابل، يُقدم مع الطماطم والخس والليمون وبصل السماق.',
        fa: 'غذای سنتی، از خمیر نازک درست شده که با مخلوط طعم‌داری از گوشت چرخ‌کرده گاو و بره، پیاز، فلفل دلمه‌ای، گوجه و ادویه‌جات پوشانده شده، با گوجه، کاهو، لیمو و پیاز سماق سرو می‌شود.',
        ku: 'خۆراکێکی نەریتی، لە هەویرێکی باریک دروستکراوە کە بە تێکەڵەیەکی تامدارەوە لە گۆشتی گا و بەرخی هاڕاو، پیاز، بیبەری شیرین، تەماتە و بەهاراتەوە داپۆشراوە، لەگەڵ تەماتە، خەس، لیمۆ و پیازی سەماق دەخرێتە بەردەست.',
        tr: 'İnce hamur üzerine kıyma, soğan, biber, domates ve baharatlardan oluşan lezzetli karışımla kaplanmış geleneksel bir yemek, domates, marul, limon ve sumak soğanı ile servis edilir.',
        ur: 'ایک روایتی ڈش، باریک آٹے سے بنایا گیا جس پر بیف اور لیمب کے قیمے، پیاز، شملہ مرچ، ٹماٹر اور مصالحوں کا ذائقہ دار مکسچر ڈالا گیا ہے، ٹماٹر، لیٹس، لیموں اور سماق پیاز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Xwarineke kevneşopî, ji hevîrê zirav hatiye çêkirin ku bi tevliheviyeke tam a goştê ga û berê hişyayî, pîvaz, biberê şîrîn, firengtiyê û baharatan hatiye dapoşîn, bi firengtiyê, xes, lîmon û pîvazên sumaqî tê peşkêşkirin.',
        es: 'Un plato tradicional, hecho con masa fina cubierta con una mezcla sabrosa de carne picada de res y cordero, cebollas, pimientos, tomates y especias, se sirve con tomates, lechuga, limón y cebollas sumac.',
        ru: 'Традиционное блюдо из тонкого теста, покрытого ароматной смесью из рубленой говядины и баранины, лука, болгарского перца, помидоров и специй, подается с помидорами, салатом, лимоном и луком сумах.',
        hi: 'एक पारंपरिक व्यंजन, पतले आटे से बना जिसके ऊपर कीमा बीफ और लैम्ब, प्याज, शिमला मिर्च, टमाटर और मसालों का स्वादिष्ट मिश्रण डाला गया है, टमाटर, सलाद पत्ता, नींबू और सुमाक प्याज के साथ परोसा जाता है।',
        sq: 'Një pjatë tradicionale, e bërë me brumë të hollë e mbuluar me një përzierje të shijshme të mishit të grirë të viçit dhe të deles, qepës, speca të ëmbël, domatet dhe erëza, shërbehet me domate, marule, limon dhe qepë sumak.',
        fr: 'Un plat traditionnel, fait avec une pâte fine recouverte d\'un mélange savoureux de bœuf et d\'agneau hachés, d\'oignons, de poivrons, de tomates et d\'épices, servi avec des tomates, de la laitue, du citron et des oignons sumac.',
        de: 'Ein traditionelles Gericht aus dünnem Teig, belegt mit einer würzigen Mischung aus Hackfleisch von Rind und Lamm, Zwiebeln, Paprika, Tomaten und Gewürzen, serviert mit Tomaten, Kopfsalat, Zitrone und Sumach-Zwiebeln.',
        bn: 'একটি ঐতিহ্যবাহী খাবার, পাতলা ময়দা দিয়ে তৈরি যার উপরে গরু ও ভেড়ার কীমা, পেঁয়াজ, ক্যাপসিকাম, টমেটো এবং মশলার সুস্বাদু মিশ্রণ দেওয়া, টমেটো, লেটুস, লেবু এবং সুমাক পেঁয়াজ দিয়ে পরিবেশিত।',
        ko: '얇은 반죽 위에 다진 쇠고기와 양고기, 양파, 피망, 토마토, 향신료의 맛있는 혼합물을 올린 전통 요리로, 토마토, 상추, 레몬, 수막 양파와 함께 제공됩니다.'
      }, 
      image: '/Lahmacun.jpg',
      price: '$17.99', 
      category: 'sandwich_platter', 
      popular: false, 
      tags: [] 
    },

    // NAAN
    { 
      id: 1401, 
      name: { 
        en: 'Hawrami Naan',
        ar: 'نان هەورامی',
        fa: 'نان هورامی',
        ku: 'نانی هەورامی',
        tr: 'Hewrami Naan',
        ur: 'حورامی نان',
        kmr: 'Nanê Hewramî',
        es: 'Naan Hawrami',
        ru: 'Нан Хаврами',
        hi: 'हवरामी नान',
        sq: 'Naan Hawrami',
        fr: 'Naan Hawrami',
        de: 'Hawrami Naan',
        bn: 'হাওরামি নান',
        ko: '하와라미 난'
      }, 
      description: { 
        en: 'A delightful flatbread originating from Hawraman.',
        ar: 'خبز مسطح رائع منشؤه من هەورامان.',
        fa: 'نان تختی لذیذ منشأ گرفته از هورامان.',
        ku: 'نانێکی خۆش کە لە هەورامانەوە سەرچاوەی گرتووە.',
        tr: 'Hawraman kökenli nefis düz ekmek.',
        ur: 'حورامان سے نکلی ہوئی لذیذ چپاتی۔',
        kmr: 'Nanê tekane yê xweş ku ji Hewramanê tê.',
        es: 'Un delicioso pan plano originario de Hawraman.',
        ru: 'Восхитительная лепешка родом из Хаврамана.',
        hi: 'हवरामान से आने वाली स्वादिष्ट फ्लैटब्रेड।',
        sq: 'Një bukë e shkëlqyer që vjen nga Hawramani.',
        fr: 'Un délicieux pain plat originaire du Hawraman.',
        de: 'Ein köstliches Fladenbrot aus Hawraman.',
        bn: 'হাওরামান থেকে উৎপন্ন একটি সুস্বাদু ফ্ল্যাটব্রেড।',
        ko: '하와라만에서 유래한 맛있는 플랫브레드입니다.'
      }, 
      image: '/Hawrami Naan.jpg',
      price: '$2.99', 
      category: 'naan', 
      popular: true, 
      tags: ['vegetarian'] 
    },
    { 
      id: 1403, 
      name: { 
        en: 'Sesame Kulera',
        ar: 'كوليرا السمسم',
        fa: 'کولرا کنجدی',
        ku: 'کولێرای کونجیت',
        tr: 'Susamlı Kulera',
        ur: 'تل کا کولیرا',
        kmr: 'Kulera Kincî',
        es: 'Kulera de Sésamo',
        ru: 'Кулера с кунжутом',
        hi: 'तिल कुलेरा',
        sq: 'Kulera me Susam',
        fr: 'Kulera au Sésame',
        de: 'Sesam-Kulera',
        bn: 'তিল কুলেরা',
        ko: '참깨 쿨레라'
      }, 
      description: { 
        en: 'A type of flatbread made without the need for extensive kneading, known for its simplicity and soft, chewy texture.',
        ar: 'نوع من الخبز المسطح مصنوع بدون الحاجة لعجن مكثف، معروف ببساطته وملمسه الناعم والمطاطي.',
        fa: 'نوعی نان تخت که بدون نیاز به ورز گسترده ساخته می‌شود، به دلیل سادگی و بافت نرم و چسبناکش شناخته شده.',
        ku: 'جۆرێک لە نانی تەخت کە بەبێ پێویستی بە هەویرکردنی بەرفراوان دروستدەکرێت، بە سادەیی و دەمامکی نەرم و چەقەڵییەوە ناسراوە.',
        tr: 'Kapsamlı yoğurmaya ihtiyaç duymadan yapılan bir tür düz ekmek, sadeliği ve yumuşak, çiğnenebilir dokusuyla bilinir.',
        ur: 'ایک قسم کی چپاتی جو وسیع گوندھنے کی ضرورت کے بغیر بنائی جاتی ہے، اپنی سادگی اور نرم، چپچپاہٹ کے لیے مشہور۔',
        kmr: 'Cureyeke nanê tekane ku bêyî hewcedariya hevşandinê tê çêkirin, bi sadebûna xwe û tekstura xwe ya nerm û girêdayî tê nasîn.',
        es: 'Un tipo de pan plano hecho sin necesidad de amasado extenso, conocido por su simplicidad y textura suave y masticable.',
        ru: 'Тип лепешки, приготовленной без необходимости обширного замешивания, известной своей простотой и мягкой, жевательной текстурой.',
        hi: 'व्यापक गूंधने की आवश्यकता के बिना बनाई गई फ्लैटब्रेड का एक प्रकार, जो अपनी सादगी और नरम, चबाने योग्य बनावट के लिए जानी जाती है।',
        sq: 'Një lloj buke e sheshtë e bërë pa nevojën e brumorjes së gjerë, e njohur për thjeshtësinë dhe teksturën e saj të butë dhe të ngjashme.',
        fr: 'Un type de pain plat fait sans besoin de pétrissage extensif, connu pour sa simplicité et sa texture douce et moelleuse.',
        de: 'Eine Art Fladenbrot, das ohne ausgiebiges Kneten hergestellt wird, bekannt für seine Einfachheit und weiche, zähe Textur.',
        bn: 'একধরনের ফ্ল্যাটব্রেড যা ব্যাপক মেখানোর প্রয়োজন ছাড়াই তৈরি, এর সরলতা এবং নরম, চিবানো যায় এমন গঠনের জন্য পরিচিত।',
        ko: '광범위한 반죽 없이 만든 플랫브레드의 한 종류로, 단순함과 부드럽고 쫄깃한 식감으로 유명합니다.'
      }, 
      price: '$3.99', 
      category: 'naan', 
      image: '/Sesame Kulera.jpg',
      tags: ['vegetarian'] 
    },

    // SPECIALTY DISHES
    { 
      id: 1701, 
      name: { 
        en: 'Middle Eastern Style Parda Biryani',
        ar: 'برياني پاردا على الطريقة الشرق أوسطية',
        fa: 'پرده بریانی به سبک خاورمیانه',
        ku: 'پەردە بریانی بە شێوەی ڕۆژهەڵاتی ناوەڕاست',
        tr: 'Orta Doğu Tarzı Perde Biryani',
        ur: 'مشرق وسطیٰ طرز پردہ بریانی',
        kmr: 'Perde Biryani ya Rojhilatê Navîn',
        es: 'Parda Biryani Estilo Medio Oriente',
        ru: 'Парда Бирьяни в ближневосточном стиле',
        hi: 'मध्य पूर्वी शैली परदा बिरयानी',
        sq: 'Parda Biryani Stili i Lindjes së Mesme',
        fr: 'Biryani Parda Style Moyen-Orient',
        de: 'Parda Biryani im nahöstlichen Stil',
        bn: 'মধ্যপ্রাচ্যীয় স্টাইল পরদা বিরিয়ানি',
        ko: '중동식 파르다 비리야니'
      }, 
      description: { 
        en: 'A rich Middle Eastern dish of spiced rice, prepared with tender slow-cooked beef, raisins, almonds, peas, and potatoes, encased in a delicate layer of pastry and baked to perfection, is served with a fresh salad on the side.',
        ar: 'طبق شرق أوسطي غني من الأرز المتبل، محضر مع لحم البقر المطبوخ ببطء والكشمش واللوز والبازلاء والبطاطس، مغلف بطبقة رقيقة من العجين ومخبوز إلى الكمال، يُقدم مع سلطة طازجة على الجانب.',
        fa: 'غذای غنی خاورمیانه‌ای از برنج طعم‌دار، با گوشت گاو نرم و آهسته پخت، کشمش، بادام، نخود فرنگی و سیب‌زمینی تهیه شده، در لایه‌ای ظریف از خمیر پوشانده و تا کمال پخته شده، با سالاد تازه در کنار سرو می‌شود.',
        ku: 'خۆراکێکی دەوڵەمەندی ڕۆژهەڵاتی ناوەڕاست لە برنجی تامدراو، لەگەڵ گۆشتی گای نەرم و هێواش لێنراو، کشمیش، بادەم، نۆک و پەتاتە ئامادەکراوە، لە چینێکی نازکی هەویردا پێچراوەتەوە و بە تەواوی نانکراوە، لەگەڵ سالادی تازە لە لاتەنیشتەوە خراوەتە سەر.',
        tr: 'Yumuşak yavaş pişmiş dana eti, kuru üzüm, badem, bezelye ve patatesle hazırlanmış baharatlı pirinçten oluşan zengin Orta Doğu yemeği, ince hamur tabakası ile kaplanmış ve mükemmelliğe kadar pişirilmiştir, yan tarafta taze salata ile servis edilir.',
        ur: 'مصالحہ دار چاول کا بھرپور مشرق وسطیٰ کا کھانا، نرم آہستہ پکے ہوئے گائے کے گوشت، کشمش، بادام، مٹر اور آلو کے ساتھ تیار کیا گیا، آٹے کی نازک تہ میں لپیٹا اور کمال تک پکایا گیا، ساتھ میں تازہ سلاد کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Xwarineke dewlemend a Rojhilatê Navîn a brincê bi baharatan, bi goştê ga yê nerm û hêdî pijandin, kişmîşan, behîvan, nokan û kartolan hatiye amade kirin, di çîneke hevîrê nazik de hatiye pêçandin û heta bi temamî hatiye pijandin, bi salatayek taze li kêleka tê peşkêşkirin.',
        es: 'Un rico plato de Oriente Medio de arroz especiado, preparado con carne de res tierna cocida lentamente, pasas, almendras, guisantes y patatas, envuelto en una delicada capa de masa y horneado a la perfección, se sirve con una ensalada fresca al lado.',
        ru: 'Богатое ближневосточное блюдо из пряного риса с нежной медленно тушёной говядиной, изюмом, миндалём, горошком и картофелем, завёрнутое в тонкий слой теста и запечённое до совершенства, подаётся со свежим салатом.',
        hi: 'मसालेदार चावल का समृद्ध मध्य पूर्वी व्यंजन, नरम धीमी पकी गाय के मांस, किशमिश, बादाम, मटर और आलू के साथ तैयार, नाजुक आटे की परत में लपेटा और परफेक्शन तक बेक किया गया, साइड में ताजा सलाद के साथ परोसा जाता है।',
        sq: 'Një pjatë i pasur lindor i mesëm i orizit të erëzuar, i përgatitur me viç të butë të gatuar ngadalë, rrush të thatë, bajame, bizele dhe patate, i mbështjellë në një shtresë delikate brumi dhe i pjekur në përsosmëri, shërbehet me sallatë të freskët në krah.',
        fr: 'Un plat riche du Moyen-Orient de riz épicé, préparé avec du bœuf tendre cuit lentement, des raisins secs, des amandes, des petits pois et des pommes de terre, enrobé dans une délicate couche de pâte et cuit à la perfection, servi avec une salade fraîche en accompagnement.',
        de: 'Ein reichhaltiges nahöstliches Gericht aus gewürztem Reis, zubereitet mit zartem, langsam gegartem Rindfleisch, Rosinen, Mandeln, Erbsen und Kartoffeln, umhüllt von einer zarten Teigschicht und zur Perfektion gebacken, serviert mit einem frischen Salat als Beilage.',
        bn: 'মশলাযুক্ত ভাতের একটি সমৃদ্ধ মধ্যপ্রাচ্যীয় খাবার, নরম ধীরে রান্না করা গরুর মাংস, কিশমিশ, বাদাম, মটর এবং আলু দিয়ে তৈরি, সূক্ষ্ম পেস্ট্রি স্তরে মোড়ানো এবং নিখুঁতভাবে বেক করা, পাশে তাজা সালাদ দিয়ে পরিবেশিত।',
        ko: '부드럽고 천천히 익힌 쇠고기, 건포도, 아몬드, 완두콩, 감자로 준비한 향신료 쌀의 풍부한 중동 요리로, 섬세한 페이스트리 층에 싸여 완벽하게 구워져 옆에 신선한 샐러드와 함께 제공됩니다.'
      }, 
      image: '/Middle Eastern Style Parda Biryani.jpg',
      price: '$23.99', 
      category: 'specialty', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1702, 
      name: { 
        en: 'Quzi',
        ar: 'قوزي',
        fa: 'قوزی',
        ku: 'قوزی',
        tr: 'Kuzi',
        ur: 'قوزی',
        kmr: 'Qûzî',
        es: 'Quzi',
        ru: 'Кузи',
        hi: 'क़ुज़ी',
        sq: 'Quzi',
        fr: 'Quzi',
        de: 'Quzi',
        bn: 'কুজি',
        ko: '쿠지'
      }, 
      description: { 
        en: 'A traditional Iraqi dish made with saffron rice and lamb shank, topped with special tomato sauce, and garnished with toasted almonds and fresh parsley, offers a unique culinary experience.',
        ar: 'طبق عراقي تقليدي مصنوع من أرز الزعفران وساق الخروف، مغطى بصلصة الطماطم الخاصة، ومزين باللوز المحمص والبقدونس الطازج، يقدم تجربة طهي فريدة.',
        fa: 'غذای سنتی عراقی از برنج زعفرانی و ساق بره، با سس مخصوص گوجه فرنگی پوشانده شده و با بادام برشته و جعفری تازه تزیین شده، تجربه‌ای منحصر به فرد آشپزی ارائه می‌دهد.',
        ku: 'خۆراکێکی نەریتی عێراقی لە برنجی زەعفەران و قاچی بەرخ دروستکراوە، بە سۆسی تایبەتی تەماتە داپۆشراوە، و بە بادەمی برژاو و جەعدەی تازە ڕازاوەتەوە، ئەزموونێکی بێ وێنەی چێژ لە خۆراک پێشکەش دەکات.',
        tr: 'Safran pirinci ve kuzu kemiği ile yapılan geleneksel Irak yemeği, özel domates sosu ile kaplanmış ve kavrulmuş badem ile taze maydanoz ile süslenmiş, benzersiz bir mutfak deneyimi sunar.',
        ur: 'زعفرانی چاول اور بھیڑ کی ہڈی سے بنا روایتی عراقی کھانا، خاص ٹماٹر کی چٹنی سے ڈھکا ہوا، اور بھنے ہوئے بادام اور تازہ دھنیے سے سجایا گیا، ایک منفرد کھانے کا تجربہ پیش کرتا ہے۔',
        kmr: 'Xwarineke kevneşopî ya Îraqî ku ji brincê zefranî û hestiyê berxî hatiye çêkirin, bi sosê taybet a firengtiyê hatiye dapoşîn û bi behîvên şewitî û şînîyê taze hatiye xemilandin, ezmûnek bêhemta xwarinê pêşkêş dike.',
        es: 'Un plato tradicional iraquí hecho con arroz de azafrán y jarrete de cordero, cubierto con salsa especial de tomate y adornado con almendras tostadas y perejil fresco, ofrece una experiencia culinaria única.',
        ru: 'Традиционное иракское блюдо из шафранового риса с бараньей голенью, покрытое специальным томатным соусом и украшенное жареным миндалём и свежей петрушкой, предлагает уникальный кулинарный опыт.',
        hi: 'केसर चावल और भेड़ की टांग से बना पारंपरिक इराकी व्यंजन, विशेष टमाटर की चटनी से ढका हुआ और भुने हुए बादाम और ताज़े अजमोद से सजाया गया, एक अनूठा पाक अनुभव प्रदान करता है।',
        sq: 'Një pjatë tradicional irakian i bërë me oriz me shafran dhe kërci qengji, i mbuluar me salcë speciale domatesh dhe i zbukuruar me bajame të pjekura dhe majdanoz të freskët, ofron një përvojë kulinare unike.',
        fr: 'Un plat traditionnel irakien préparé avec du riz au safran et du jarret d\'agneau, recouvert de sauce tomate spéciale et garni d\'amandes grillées et de persil frais, offre une expérience culinaire unique.',
        de: 'Ein traditionelles irakisches Gericht aus Safranreis und Lammhaxe, mit spezieller Tomatensauce überzogen und mit gerösteten Mandeln und frischer Petersilie garniert, bietet ein einzigartiges kulinarisches Erlebnis.',
        bn: 'জাফরান ভাত এবং ভেড়ার মাংসের হাড় দিয়ে তৈরি ঐতিহ্যবাহী ইরাকি খাবার, বিশেষ টমেটো সস দিয়ে ঢাকা এবং ভাজা বাদাম ও তাজা পার্সলে দিয়ে সাজানো, একটি অনন্য রন্ধনশৈলীর অভিজ্ঞতা প্রদান করে।',
        ko: '사프란 쌀과 양 정강이로 만든 전통 이라크 요리로, 특별한 토마토 소스로 덮고 구운 아몬드와 신선한 파슬리로 장식하여 독특한 요리 경험을 제공합니다.'
      }, 
      image: '/Quzi.jpg',
      price: '$26.99', 
      category: 'specialty', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1703, 
      name: { 
        en: 'Mandi',
        ar: 'مندي',
        fa: 'مندی',
        ku: 'مەندی',
        tr: 'Mendi',
        ur: 'مندی',
        kmr: 'Mendî',
        es: 'Mandi',
        ru: 'Манди',
        hi: 'मंडी',
        sq: 'Mandi',
        fr: 'Mandi',
        de: 'Mandi',
        bn: 'মান্দি',
        ko: '만디'
      }, 
      description: { 
        en: 'A traditional Yemeni dish made with Mandi rice and chicken. The half chicken is served on a bed of rice and topped with fresh parsley. It is accompanied by special sauces.',
        ar: 'طبق يمني تقليدي مصنوع من أرز المندي والدجاج. يُقدم نصف الدجاج على فراش من الأرز ويُزين بالبقدونس الطازج. يُرافقه صلصات خاصة.',
        fa: 'غذای سنتی یمنی از برنج مندی و مرغ. نیمی از مرغ روی بستری از برنج سرو شده و با جعفری تازه تزیین شده. با سس‌های مخصوص همراه است.',
        ku: 'خۆراکێکی نەریتی یەمەنی لە برنجی مەندی و مریشک. نیوەی مریشکەکە لەسەر جێگەیەکی برنج دەخرێتە بەردەست و بە جەعدەی تازە ڕازاوەتەوە. لەگەڵ سۆسە تایبەتەکانەوە هاتووە.',
        tr: 'Mandi pirinci ve tavukla yapılan geleneksel Yemen yemeği. Yarım tavuk pirinç yatağı üzerinde servis edilir ve taze maydanoz ile süslenir. Özel soslar eşlik eder.',
        ur: 'مندی چاول اور چکن سے بنا روایتی یمنی کھانا۔ آدھا چکن چاول کے بستر پر پیش کیا جاتا ہے اور تازہ دھنیے سے سجایا جاتا ہے۔ خاص ساسز کے ساتھ آتا ہے۔',
        kmr: 'Xwarineke kevneşopî ya Yemenî ku ji brincê mendî û mirîşkê hatiye çêkirin. Nîvê mirîşkê li ser rûberê brincê tê peşkêşkirin û bi şînîyê taze tê xemilandin. Bi soşên taybet re tê.',
        es: 'Un plato tradicional yemení hecho con arroz Mandi y pollo. El medio pollo se sirve sobre una cama de arroz y se cubre con perejil fresco. Se acompaña con salsas especiales.',
        ru: 'Традиционное йеменское блюдо из риса манди с курицей. Половина курицы подается на подушке из риса и украшается свежей петрушкой. Подается со специальными соусами.',
        hi: 'मंडी चावल और चिकन के साथ बनाया गया पारंपरिक यमनी व्यंजन। आधा चिकन चावल के बिस्तर पर परोसा जाता है और ताज़े अजमोद से सजाया जाता है। विशेष सॉस के साथ परोसा जाता है।',
        sq: 'Një pjatë tradicional jemenas i bërë me oriz Mandi dhe pulë. Gjysma e pulës shërbehet mbi një shtrat orizi dhe zbukurohet me majdanoz të freskët. Shoqërohet me salca speciale.',
        fr: 'Un plat traditionnel yéménite préparé avec du riz Mandi et du poulet. La demi-portion de poulet est servie sur un lit de riz et garnie de persil frais. Il est accompagné de sauces spéciales.',
        de: 'Ein traditionelles jemenitisches Gericht aus Mandi-Reis und Hähnchen. Das halbe Hähnchen wird auf einem Reisbett serviert und mit frischer Petersilie garniert. Wird mit speziellen Saucen begleitet.',
        bn: 'মান্দি ভাত এবং চিকেন দিয়ে তৈরি ঐতিহ্যবাহী ইয়েমেনি খাবার। অর্ধেক চিকেন ভাতের বিছানায় পরিবেশিত এবং তাজা পার্সলে দিয়ে সাজানো। বিশেষ সস দিয়ে পরিবেশিত।',
        ko: '만디 쌀과 치킨으로 만든 전통 예멘 요리입니다. 반마리 치킨이 쌀 위에 제공되며 신선한 파슬리로 토핑됩니다. 특별한 소스와 함께 제공됩니다.'
      }, 
      image: '/Mandi.jpg',
      price: '$23.99', 
      category: 'specialty', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1705, 
      name: { 
        en: 'Village Qaliya',
        ar: 'قالية القرية',
        fa: 'قلیه روستایی',
        ku: 'قەلیەی گوند',
        tr: 'Köy Kalesi',
        ur: 'ولیج قالیہ',
        kmr: 'Qaliyeya Gund',
        es: 'Qaliya de la Aldea',
        fr: 'Qaliya du Village',
        ru: 'Деревенская Калия',
        hi: 'विलेज क़लिया',
        sq: 'Qaliya e Fshatit',
        fr: 'Qaliya du Village',
        de: 'Dorf Qaliya',
        bn: 'ভিলেজ কালিয়া',
        ko: '빌리지 칼리야'
      }, 
      description: { 
        en: 'This traditional Kurdish dish is made from tender slow-cooked beef blended with caramelized onions, garlic, tomato sauce, a signature mix of spices, and a touch of date syrup. It is served with saffron rice, representing a refined fusion of traditional depth and modern elegance.',
        ar: 'هذا الطبق الكردي التقليدي مصنوع من لحم البقر الطري المطبوخ ببطء ممزوج مع البصل المكرمل والثوم وصلصة الطماطم ومزيج مميز من التوابل ولمسة من دبس التمر. يُقدم مع أرز الزعفران، ويمثل مزيجاً راقياً من العمق التقليدي والأناقة الحديثة.',
        fa: 'این غذای سنتی کردی از گوشت گاو نرم و آهسته پخت با پیاز کاراملی، سیر، سس گوجه فرنگی، ترکیب مخصوص ادویه‌جات و لمسی از شیره خرما تهیه شده. با برنج زعفرانی سرو می‌شود که ترکیبی شیک از عمق سنتی و ظرافت مدرن را نشان می‌دهد.',
        ku: 'ئەم خۆراکە نەریتیە کوردییە لە گۆشتی گای نەرم و هێواش لێنراو دروستکراوە کە لەگەڵ پیازی شەکرکراو، سیر، سۆسی تەماتە، تێکەڵەیەکی تایبەت لە بەهارات، و دەستێکی شلەمی خورماوە تێکەڵکراوە. لەگەڵ برنجی زەعفەران دەخرێتە بەردەست، کە نوێنەرایەتی تێکەڵەیەکی فێنک لە قووڵایی نەریتی و شکۆمەندی نوێ دەکات.',
        tr: 'Bu geleneksel Kürt yemeği, karamelize soğan, sarımsak, domates sosu, özel baharat karışımı ve bir dokunuş hurma pekmezi ile harmanlanan yumuşak yavaş pişmiş dana etinden yapılır. Safran pirinci ile servis edilir ve geleneksel derinlik ile modern zarafetin rafine bir füzyonunu temsil eder.',
        ur: 'یہ روایتی کردی ڈش نرم آہستہ پکے ہوئے گائے کے گوشت سے بنایا گیا ہے جو کیرامل پیاز، لہسن، ٹماٹر کی چٹنی، مخصوص مصالحوں کا مکسچر، اور کھجور کے شربت کے ٹچ کے ساتھ ملایا گیا ہے۔ یہ زعفرانی چاول کے ساتھ پیش کیا جاتا ہے، جو روایتی گہرائی اور جدید خوبصورتی کا بہترین امتزاج پیش کرتا ہے۔',
        kmr: 'Ev xwarina kevneşopî ya Kurdî ji goştê ga yê nerm û hêdî pijandin hatiye çêkirin ku bi pîvazên şirînkirî, sîr, sosê firengtiyê, tevahiya baharatên taybet û hesteke şilemê xurmadiyan hatiye tevlîhevkirin. Bi brincê zefranî tê peşkêşkirin û nûneriya tevlîhevkirina fînk a kûrahiya kevneşopî û xweşbîniya nûjen dike.',
        es: 'Este plato tradicional kurdo está hecho de carne de res tierna cocida lentamente mezclada con cebollas caramelizadas, ajo, salsa de tomate, una mezcla característica de especias y un toque de jarabe de dátiles. Se sirve con arroz de azafrán, representando una fusión refinada de profundidad tradicional y elegancia moderna.',
        ru: 'Это традиционное курдское блюдо готовится из нежной медленно тушёной говядины, смешанной с карамелизированным луком, чесноком, томатным соусом, фирменной смесью специй и каплей финикового сиропа. Подаётся с шафрановым рисом, представляя изысканное слияние традиционной глубины и современной элегантности.',
        hi: 'यह पारंपरिक कुर्दी व्यंजन नरम धीमी पकी गाय के मांस से बनाया गया है जो कैरामेलाइज़्ड प्याज, लहसुन, टमाटर सॉस, मसालों के विशेष मिश्रण और खजूर के सिरप के स्पर्श के साथ मिलाया गया है। केसर चावल के साथ परोसा जाता है, जो पारंपरिक गहराई और आधुनिक भव्यता का परिष्कृत संयोजन दर्शाता है।',
        sq: 'Kjo pjatë tradicionale kurde është bërë nga viç i butë i gatuar ngadalë i përzier me qepë karamelizuara, hudhra, salcë domatesh, një përzierje karakteristike erëzash dhe një prekje të shirupit të hurmave. Shërbehet me oriz me shafran, duke përfaqësuar një përzierje të rafinuar të thellësisë tradicionale dhe elegancës moderne.',
        fr: 'Ce plat traditionnel kurde est fait de bœuf tendre cuit lentement mélangé avec des oignons caramélisés, de l\'ail, de la sauce tomate, un mélange signature d\'épices et une touche de sirop de dattes. Il est servi avec du riz au safran, représentant une fusion raffinée de profondeur traditionnelle et d\'élégance moderne.',
        de: 'Dieses traditionelle kurdische Gericht wird aus zartem, langsam gegartem Rindfleisch zubereitet, das mit karamellisierten Zwiebeln, Knoblauch, Tomatensauce, einer charakteristischen Gewürzmischung und einem Hauch Dattelsirup vermischt wird. Es wird mit Safranreis serviert und stellt eine raffinierte Fusion aus traditioneller Tiefe und moderner Eleganz dar.',
        bn: 'এই ঐতিহ্যবাহী কুর্দি খাবার নরম ধীরে রান্না করা গরুর মাংস দিয়ে তৈরি যা ক্যারামেলাইজড পেঁয়াজ, রসুন, টমেটো সস, মশলার বিশেষ মিশ্রণ এবং খেজুরের সিরাপের স্পর্শ দিয়ে মিশ্রিত। জাফরান ভাত দিয়ে পরিবেশিত, যা ঐতিহ্যবাহী গভীরতা এবং আধুনিক কমনীয়তার পরিশীলিত সংমিশ্রণ।',
        ko: '이 전통적인 쿠르드 요리는 캐러멜화된 양파, 마늘, 토마토 소스, 시그니처 향신료 믹스, 대추 시럽 터치와 함께 블렌딩된 부드럽고 천천히 익힌 쇠고기로 만들어집니다. 사프란 쌀과 함께 제공되어 전통적인 깊이와 현대적인 우아함의 세련된 융합을 나타냅니다.'
      }, 
      image: '/Village Qaliya.jpg',
      price: '$24.99', 
      category: 'specialty', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1706, 
      name: { 
        en: 'Butter Shrimp',
        ar: 'جمبري بالزبدة',
        fa: 'میگوی کرهای',
        ku: 'میگۆی کەرە',
        tr: 'Tereyağlı Karides',
        ur: 'بٹر شرمپ',
        kmr: 'Mîgoyê Tereya',
        es: 'Camarones con Mantequilla',
        ru: 'Креветки в масле',
        hi: 'बटर श्रिम्प',
        sq: 'Karkaleca me Gjalpë',
        fr: 'Crevettes au Beurre',
        de: 'Butter-Garnelen',
        bn: 'বাটার চিংড়ি',
        ko: '버터 새우'
      }, 
      description: { 
        en: 'Sautéed shrimp with butter, mushrooms, tomatoes, red pepper flakes and garlic, and served with a side of saffron rice, makes a delicious meal.',
        ar: 'جمبري مقلي مع الزبدة والفطر والطماطم ورقائق الفلفل الأحمر والثوم، ويُقدم مع جانب من أرز الزعفران، يصنع وجبة لذيذة.',
        fa: 'میگوی تفت داده شده با کره، قارچ، گوجه فرنگی، پولک فلفل قرمز و سیر، و با برنج زعفرانی در کنار سرو می‌شود، غذای خوشمزه‌ای می‌سازد.',
        ku: 'میگۆی ساتێ کراو لەگەڵ کەرە، قارچ، تەماتە، پەڕەی فلفەلی سوور و سیر، و لەگەڵ لایەنێک لە برنجی زەعفەران خراوەتە بەردەست، خۆراکێکی خۆش دروست دەکات.',
        tr: 'Tereyağı, mantar, domates, kırmızı biber pul biber ve sarımsakla sote edilmiş karides, safran pirinci garnitürü ile servis edilir, lezzetli bir yemek yapar.',
        ur: 'مکھن، مشروم، ٹماٹر، سرخ مرچ کے فلیکس اور لہسن کے ساتھ بھنا ہوا جھینگا، اور زعفرانی چاول کے ساتھ پیش کیا جاتا ہے، ایک لذیذ کھانا بناتا ہے۔',
        kmr: 'Mîgoyên bi tereya, karkûşk, firengtiyê, berikên biberê sor û sîr hatine sotekirî, û bi aliyekî brincê zefranî tên peşkêşkirin, xwarineke bi tam dirust dike.',
        es: 'Camarones salteados con mantequilla, champiñones, tomates, hojuelas de pimiento rojo y ajo, y servidos con un lado de arroz de azafrán, hace una comida deliciosa.',
        ru: 'Креветки, обжаренные с маслом, грибами, помидорами, хлопьями красного перца и чесноком, подаются с гарниром из шафранового риса, составляют вкусное блюдо.',
        hi: 'मक्खन, मशरूम, टमाटर, लाल मिर्च के फ्लेक्स और लहसुन के साथ भुने हुए झींगे, और केसर चावल के साथ परोसे जाते हैं, एक स्वादिष्ट भोजन बनाते हैं।',
        sq: 'Karkaleca të skuqura me gjalpë, kërpudha, domate, biskota speca të kuq dhe hudhra, dhe shërbehet me një anë orizi me shafran, bën një vakt të shijshëm.',
        fr: 'Crevettes sautées au beurre, champignons, tomates, flocons de poivron rouge et ail, et servies avec un accompagnement de riz au safran, font un repas délicieux.',
        de: 'Garnelen sautiert mit Butter, Champignons, Tomaten, roten Pfefferflocken und Knoblauch, serviert mit einer Beilage aus Safranreis, macht eine köstliche Mahlzeit.',
        bn: 'মাখন, মাশরুম, টমেটো, লাল মরিচের ফ্লেক্স এবং রসুন দিয়ে ভাজা চিংড়ি, এবং জাফরান ভাত দিয়ে পরিবেশিত, একটি সুস্বাদু খাবার তৈরি করে।',
        ko: '버터, 마시룸, 토마토, 고춧가루, 마늘로 볶은 새우를 사프란 라이스와 함께 제공하여 맛있는 식사를 만듭니다.'
      }, 
      image: '/Butter Shrimp.jpg',
      price: '$23.99', 
      category: 'specialty', 
      popular: false, 
      tags: [] 
    },
    { 
      id: 1708, 
      name: { 
        en: 'Lamb Leg Special (2-Day Notice Required)',
        ar: 'ساق الخروف الخاص (يتطلب إشعار مسبق لمدة يومين)',
        fa: 'ویژه ساق بره (نیاز به اطلاع ۲ روزه)',
        ku: 'تایبەتی قاچی بەرخ (پێویستی بە ئاگاداری ٢ ڕۆژە)',
        tr: 'Kuzu But Özel (2 Günlük Ön Bildirim Gerekli)',
        ur: 'لیمب لیگ خاص (2 دن کی پیشگی اطلاع درکار)',
        kmr: 'Qijika Berxê Taybet (Agahdarina 2 Rojî Pêwîst e)',
        es: 'Pierna de Cordero Especial (Se Requiere Aviso de 2 Días)',
        ru: 'Специальная баранья нога (требуется уведомление за 2 дня)',
        hi: 'लैम्ब लेग स्पेशल (2 दिन की पूर्व सूचना आवश्यक)',
        sq: 'Kofshë Qengji Speciale (Kërkohet Njoftim 2 Ditë Paraprakisht)',
        fr: 'Gigot d\'Agneau Spécial (Préavis de 2 Jours Requis)',
        de: 'Lammkeule Spezial (2 Tage Voranmeldung Erforderlich)',
        bn: 'ল্যাম্ব লেগ স্পেশাল (২ দিনের পূর্ব নোটিশ প্রয়োজন)',
        ko: '양다리 스페셜 (2일 전 예약 필요)'
      }, 
      description: { 
        en: 'This dish features tender, fall-off-the-bone lamb shank, slow-roasted for 8 hours, and is served with two varieties of rice (saffron and biryani), fresh salad, tzatziki sauce, spicy sauce, and our special mild white sauce, along with an appetizers combo and sesame kulera, serving 10 people.',
        ar: 'يتميز هذا الطبق بساق الخروف الطرية التي تقع من العظم، محمصة ببطء لمدة 8 ساعات، ويُقدم مع نوعين من الأرز (الزعفران والبرياني)، والسلطة الطازجة، وصلصة التزاتزيكي، والصلصة الحارة، وصلصتنا البيضاء الخفيفة الخاصة، مع مجموعة المقبلات وكوليرا السمسم، لخدمة 10 أشخاص.',
        fa: 'این غذا شامل ساق بره نرم و از استخوان جدا شونده است که به مدت ۸ ساعت آهسته برشته شده و با دو نوع برنج (زعفرانی و بریانی)، سالاد تازه، سس تزاتزیکی، سس تند و سس سفید ملایم مخصوص ما همراه با ترکیب پیش غذا و کولرای کنجد سرو می‌شود و برای ۱۰ نفر کافی است.',
        ku: 'ئەم خۆراکە تایبەتمەندی قاچی بەرخی نەرم و لە ئێسکەوە کەوتووە، بۆ ماوەی ٨ کاتژمێر بە هێواشی برژاوە، و لەگەڵ دوو جۆری برنج (زەعفەران و بریانی)، سالادی تازە، سۆسی تزاتزیکی، سۆسی تەند، و سۆسی سپی نەرمی تایبەتمان لەگەڵ تێکەڵی پێشخۆراک و کولێرای کنجد دەخرێتە بەردەست، بۆ ١٠ کەس.',
        tr: 'Bu yemek kemikten düşen yumuşak kuzu kemiği içerir, 8 saat yavaş kavrulmuş ve iki çeşit pirinç (safran ve biryani), taze salata, tzatziki sosu, baharatlı sos ve özel hafif beyaz sosumuzla birlikte meze kombinasyonu ve susam kulera ile 10 kişilik servis edilir.',
        ur: 'یہ ڈش نرم، ہڈی سے گرنے والی بھیڑ کی ٹانگ پر مشتمل ہے، 8 گھنٹے تک آہستہ بھنی گئی، اور دو قسم کے چاول (زعفران اور بریانی)، تازہ سلاد، تزاتزیکی ساس، تیز ساس، اور ہماری خاص ہلکی سفید ساس کے ساتھ اپیٹائزر کومبو اور تل کولیرا کے ساتھ پیش کی جاتی ہے، 10 لوگوں کو پیش کرتی ہے۔',
        kmr: 'Ev xwarin qijika berxê nerm û ji hestiyê ketî dihewîne, 8 demjimêr hêdî şewitî, û bi du cure brincê (zefran û biryani), salatayek taze, sosê tzatziki, sosê tûj û sosê spî yê nerm ê me yê taybet bi tevahiya mezeyên û kulera kundurmê re ji bo 10 kesan tê peşkêşkirin.',
        es: 'Este plato presenta pierna de cordero tierna que se desprende del hueso, asada lentamente durante 8 horas, y se sirve con dos variedades de arroz (azafrán y biryani), ensalada fresca, salsa tzatziki, salsa picante y nuestra salsa blanca suave especial, junto con una combinación de aperitivos y kulera de sésamo, sirviendo a 10 personas.',
        ru: 'Это блюдо включает нежную, отваливающуюся от кости баранью ногу, медленно жареную в течение 8 часов, подается с двумя видами риса (шафранный и бирьяни), свежим салатом, соусом дзадзики, острым соусом и нашим специальным мягким белым соусом, вместе с комбо закусок и кунжутной кулерой, на 10 человек.',
        hi: 'इस व्यंजन में नरम, हड्डी से गिरने वाली भेड़ की टांग है, जो 8 घंटे तक धीमी आंच पर भुनी गई है, और दो प्रकार के चावल (केसर और बिरयानी), ताजा सलाद, त्ज़त्ज़िकी सॉस, तीखी सॉस, और हमारी विशेष हल्की सफेद सॉस के साथ एपेटाइज़र कॉम्बो और तिल कुलेरा के साथ परोसा जाता है, 10 लोगों को परोसता है।',
        sq: 'Kjo pjatë përmban kofshë qengji të butë që bie nga kocka, e pjekur ngadalë për 8 orë, dhe shërbehet me dy lloje orizi (me shafran dhe biryani), sallatë të freskët, salcë tzatziki, salcë djegëse dhe salcën tonë speciale të bardhë të butë, së bashku me një kombinim hapësirash dhe kulera me susam, duke shërbyer 10 persona.',
        fr: 'Ce plat présente un gigot d\'agneau tendre qui tombe de l\'os, rôti lentement pendant 8 heures, et est servi avec deux variétés de riz (safran et biryani), salade fraîche, sauce tzatziki, sauce épicée et notre sauce blanche douce spéciale, accompagné d\'un combo d\'apéritifs et de kulera au sésame, servant 10 personnes.',
        de: 'Dieses Gericht zeigt zarte, vom Knochen fallende Lammkeule, 8 Stunden langsam geröstet, und wird mit zwei Reissorten (Safran und Biryani), frischem Salat, Tzatziki-Sauce, scharfer Sauce und unserer speziellen milden weißen Sauce zusammen mit einer Vorspeisen-Kombination und Sesam-Kulera serviert, für 10 Personen.',
        bn: 'এই পদে রয়েছে নরম, হাড় থেকে পড়ে যাওয়া মেষশাবকের পা, ৮ ঘন্টা ধীরে ভাজা, এবং দুই ধরনের ভাত (জাফরান এবং বিরিয়ানি), তাজা সালাদ, তাজাতজিকি সস, ঝাল সস এবং আমাদের বিশেষ হালকা সাদা সস দিয়ে ক্ষুধাবর্ধক কম্বো এবং তিল কুলেরা সহ পরিবেশিত, ১০ জনের জন্য।',
        ko: '이 요리는 8시간 동안 천천히 구워서 뼈에서 떨어지는 부드러운 양 정강이가 특징이며, 두 종류의 쌀(사프란과 비리야니), 신선한 샐러드, 짜지키 소스, 매운 소스, 특별한 마일드 화이트 소스와 함께 전채 콤보와 참깨 쿨레라와 함께 제공되어 10명이 드실 수 있습니다.'
      }, 
      image: '/Lamb Leg Special.jpg',
      price: '$499.00', 
      category: 'specialty', 
      popular: false, 
      tags: ['special-order', 'large-group'] 
    },

    // GRILL PLATTER SPECIALTIES
    { 
      id: 1801, 
      name: { 
        en: 'Erbil Shish Kabab',
        ar: 'شيش كباب أربيل',
        fa: 'شیش کباب اربیل',
        ku: 'شیش کەبابی هەولێر',
        tr: 'Erbil Şiş Kebap',
        ur: 'اربیل شیش کباب',
        kmr: 'Şîş Kebaba Hewlêr',
        es: 'Shish Kebab de Erbil',
        fr: 'Shish Kebab d\'Erbil',
        ru: 'Эрбильский шиш-кебаб',
        hi: 'एर्बिल शीश कबाब',
        sq: 'Shish Kabab Erbil',
        bn: 'এরবিল শিশ কাবাব',
        ko: '에르빌 시시 카밥'
      }, 
      description: { 
        en: 'A kabab made with a mix of lamb and beef, grilled to perfection. It is served with saffron rice, fresh salad, sumac onions and grilled tomato.',
        ar: 'كباب مصنوع من خليط من لحم الخروف ولحم البقر، مشوي إلى الكمال. يُقدم مع أرز الزعفران وسلطة طازجة وبصل السماق والطماطم المشوية.',
        fa: 'کبابی از ترکیب گوشت بره و گاو، تا کمال کباب شده. با برنج زعفرانی، سالاد تازه، پیاز سماق و گوجه فرنگی کبابی سرو می‌شود.',
        ku: 'کەبابێک لە تێکەڵی گۆشتی بەرخ و گا، بە تەواوی گرێلکراوە. لەگەڵ برنجی زەعفەران، سالادی تازە، پیازی سوماق و تەماتەی گرێلکراو خراوەتە سەر.',
        tr: 'Kuzu ve dana eti karışımından yapılan, mükemmelliğe kadar ızgara edilmiş kebap. Safran pirinci, taze salata, sumak soğanı ve ızgara domatesle servis edilir.',
        ur: 'بھیڑ اور گائے کے گوشت کے مکسچر سے بنا کباب، کمال تک گرل کیا گیا۔ زعفرانی چاول، تازہ سلاد، سماق پیاز اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji tevahiya goştê berx û ga hatiye çêkirin, heta bi temamî hatiye grîlkirin. Bi brincê zefranî, salata taze, pîvazê sumaq û firengtiya grîlkirî tê peşkêşkirin.',
        es: 'Un kebab hecho con una mezcla de cordero y carne de res, asado a la perfección. Se sirve con arroz de azafrán, ensalada fresca, cebollas de sumac y tomate a la parrilla.',
        fr: 'Un kebab fait avec un mélange d\'agneau et de bœuf, grillé à la perfection. Il est servi avec du riz au safran, salade fraîche, oignons au sumac et tomate grillée.',
        ru: 'Кебаб из смеси баранины и говядины, приготовленный на гриле до совершенства. Подается с шафрановым рисом, свежим салатом, луком с сумаком и жареным помидором.',
        hi: 'भेड़ के बच्चे और गाय के मांस के मिश्रण से बना कबाब, पूर्णता तक ग्रिल किया गया। केसर चावल, ताजा सलाद, सुमाक प्याज और ग्रिल्ड टमाटर के साथ परोसा जाता है।',
        sq: 'Një kabab i bërë me një përzierje mishi qengjishi dhe viçi, i pjekur në skarë deri në përsosmëri. Shërbehet me oriz me shafran, sallatë të freskët, qepë sumak dhe domate në skarë.',
        de: 'Ein Kebab aus einer Mischung von Lamm- und Rindfleisch, perfekt gegrillt. Serviert mit Safranreis, frischem Salat, Sumak-Zwiebeln und gegrillter Tomate.',
        bn: 'মেষশাবক এবং গরুর মাংসের মিশ্রণে তৈরি কাবাব, নিখুঁততা পর্যন্ত গ্রিল করা। জাফরান ভাত, তাজা সালাদ, সুমাক পেঁয়াজ এবং গ্রিল করা টমেটোর সাথে পরিবেশিত।',
        ko: '양고기와 소고기를 섞어 만든 카밥으로, 완벽하게 구워집니다. 사프란 쌀, 신선한 샐러드, 수막 양파, 구운 토마토와 함께 제공됩니다.'
      }, 
      price: '$23.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Erbil Shish Kabab.jpg' 
    },
    { 
      id: 1802, 
      name: { 
        en: 'Mahshi Kabab',
        ar: 'كباب محشي',
        fa: 'کباب محشی',
        ku: 'کەبابی پڕکراوە',
        tr: 'Mahşi Kebap',
        ur: 'محشی کباب',
        kmr: 'Kebaba Dagirtî',
        es: 'Kebab Mahshi',
        ru: 'Махши кебаб',
        hi: 'महशी कबाब',
        sq: 'Kabab Mahshi',
        fr: 'Kebab Mahshi',
        bn: 'মাহশী কাবাব',
        ko: '마시 카밥'
      }, 
      description: { 
        en: 'A kabab made with beef and lamb, flavored with garlic, spicy peppers and parsley. It is served with fresh salad, saffron rice, sumac onions and grilled tomato.',
        ar: 'كباب مصنوع من لحم البقر والخروف، منكه بالثوم والفلفل الحار والبقدونس. يُقدم مع سلطة طازجة وأرز الزعفران وبصل السماق والطماطم المشوية.',
        fa: 'کبابی از گوشت گاو و بره، با سیر، فلفل تند و جعفری طعم‌دار شده. با سالاد تازه، برنج زعفرانی، پیاز سماق و گوجه فرنگی کبابی سرو می‌شود.',
        ku: 'کەبابێک لە گۆشتی گا و بەرخ، بە سیر، بیبەری تەند و جەعدە تامدراوە. لەگەڵ سالادی تازە، برنجی زەعفەران، پیازی سوماق و تەماتەی گرێلکراو خراوەتە سەر.',
        tr: 'Dana ve kuzu etinden yapılan, sarımsak, acı biber ve maydanozla tatlandırılmış kebap. Taze salata, safran pirinci, sumak soğanı ve ızgara domatesle servis edilir.',
        ur: 'گائے اور بھیڑ کے گوشت سے بنا کباب، لہسن، تیز مرچ اور دھنیے سے ذائقہ دار۔ تازہ سلاد، زعفرانی چاول، سماق پیاز اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji goştê ga û berxî hatiye çêkirin, bi sîr, biberên tûj û şînî hatiye tamdar kirin. Bi salata taze, brincê zefranî, pîvazê sumaq û firengtiya grîlkirî tê peşkêşkirin.',
        es: 'Un kebab hecho con carne de res y cordero, sazonado con ajo, pimientos picantes y perejil. Se sirve con ensalada fresca, arroz de azafrán, cebollas de sumac y tomate a la parrilla.',
        ru: 'Кебаб из говядины и баранины, приправленный чесноком, острым перцем и петрушкой. Подается со свежим салатом, шафрановым рисом, луком с сумахом и жареным помидором.',
        hi: 'गाय और भेड़ के बच्चे के मांस से बना कबाब, लहसुन, तेज़ मिर्च और अजमोद के साथ स्वादिष्ट। ताजा सलाद, केसर चावल, सुमाक प्याज और ग्रिल्ड टमाटर के साथ परोसा जाता है।',
        sq: 'Një kabab i bërë me viç dhe qengj, i shijësuar me hudhra, spec të rrëmbyeshëm dhe majdanoz. Shërbehet me sallatë të freskët, oriz me shafran, qepë sumak dhe domate në skarë.',
        fr: 'Un kebab fait avec du bœuf et de l\'agneau, assaisonné à l\'ail, aux piments forts et au persil. Servi avec une salade fraîche, du riz au safran, des oignons au sumac et une tomate grillée.',
        de: 'Ein Kebab aus Rind- und Lammfleisch, gewürzt mit Knoblauch, scharfen Paprika und Petersilie. Serviert mit frischem Salat, Safranreis, Sumak-Zwiebeln und gegrillter Tomate.',
        bn: 'গরু এবং মেষশাবকের মাংস দিয়ে তৈরি কাবাব, রসুন, ঝাল মরিচ এবং পার্সলে দিয়ে স্বাদযুক্ত। তাজা সালাদ, জাফরান ভাত, সুমাক পেঁয়াজ এবং গ্রিল করা টমেটোর সাথে পরিবেশিত।',
        ko: '소고기와 양고기로 만든 카밥으로, 마늘, 매운 고추, 파슬리로 맛을 냅니다. 신선한 샐러드, 사프란 라이스, 수막 양파, 구운 토마토와 함께 제공됩니다.'
      }, 
      price: '$23.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Mahshi Kabab.jpg'
    },
    { 
      id: 1803, 
      name: { 
        en: 'Chicken Kabab',
        ar: 'كباب الدجاج',
        fa: 'کباب مرغ',
        ku: 'کەبابی مریشک',
        tr: 'Tavuk Kebap',
        ur: 'چکن کباب',
        kmr: 'Kebaba Mirîşk',
        es: 'Kebab de Pollo',
        ru: 'Куриный кебаб',
        hi: 'चिकन कबाब',
        sq: 'Kabab Pule',
        fr: 'Kebab de Poulet',
        bn: 'চিকেন কাবাব',
        ko: '치킨 카밥'
      }, 
      description: { 
        en: 'Marinated chicken with spices, tomatoes, bell peppers, parsley, and onions is served with saffron rice, fresh salad, sumac onions, and grilled tomato.',
        ar: 'دجاج متبل بالتوابل والطماطم والفلفل الأخضر والبقدونس والبصل يُقدم مع أرز الزعفران وسلطة طازجة وبصل السماق والطماطم المشوية.',
        fa: 'مرغ مزه‌دار شده با ادویه‌جات، گوجه فرنگی، فلفل دلمه‌ای، جعفری و پیاز با برنج زعفرانی، سالاد تازه، پیاز سماق و گوجه فرنگی کبابی سرو می‌شود.',
        ku: 'مریشکی تامدراو بە بەهارات، تەماتە، بیبەری شیرین، جەعدە و پیاز لەگەڵ برنجی زەعفەران، سالادی تازە، پیازی سوماق و تەماتەی گرێلکراو خراوەتە سەر.',
        tr: 'Baharat, domates, dolmalık biber, maydanoz ve soğanla marine edilmiş tavuk, safran pirinci, taze salata, sumak soğanı ve ızgara domatesle servis edilir.',
        ur: 'مصالحوں، ٹماٹر، شملہ مرچ، دھنیا اور پیاز کے ساتھ میرینیٹ چکن زعفرانی چاول، تازہ سلاد، سماق پیاز اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mirîşkê bi baharatan, firangoşan, biberên şîrîn, şînî û pîvazan hatiye marînekirin, bi brincê zefranî, salata taze, pîvazê sumaq û firengtiya grîlkirî tê peşkêşkirin.',
        es: 'Pollo marinado con especias, tomates, pimientos morrones, perejil y cebollas se sirve con arroz de azafrán, ensalada fresca, cebollas de sumac y tomate a la parrilla.',
        ru: 'Маринованная курица со специями, томатами, болгарским перцем, петрушкой и луком подается с шафрановым рисом, свежим салатом, луком с сумахом и жареным помидором.',
        hi: 'मसालों, टमाटर, शिमला मिर्च, अजमोद और प्याज के साथ मैरिनेट चिकन केसर चावल, ताजा सलाद, सुमाक प्याज और ग्रिल्ड टमाटर के साथ परोसा जाता है।',
        sq: 'Pulë e marinuar me erëza, domate, spec të ëmbël, majdanoz dhe qepë shërbehet me oriz me shafran, sallatë të freskët, qepë sumak dhe domate në skarë.',
        fr: 'Poulet mariné aux épices, tomates, poivrons, persil et oignons est servi avec riz au safran, salade fraîche, oignons au sumac et tomate grillée.',
        de: 'Mariniertes Hähnchen mit Gewürzen, Tomaten, Paprika, Petersilie und Zwiebeln wird mit Safranreis, frischem Salat, Sumak-Zwiebeln und gegrillter Tomate serviert.',
        bn: 'মসলা, টমেটো, বেল মরিচ, পার্সলে এবং পেঁয়াজ দিয়ে মেরিনেটেড চিকেন জাফরান ভাত, তাজা সালাদ, সুমাক পেঁয়াজ এবং গ্রিল করা টমেটোর সাথে পরিবেশিত।',
        ko: '향신료, 토마토, 피망, 파슬리, 양파로 양념한 치킨을 사프란 라이스, 신선한 샐러드, 수막 양파, 구운 토마토와 함께 제공합니다.'
      }, 
      price: '$22.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Chicken Kabab.jpg' 
    },
    { 
      id: 1804, 
      name: { 
        en: 'Cökertme Kabab',
        ar: 'كباب چوكرتمه',
        fa: 'کباب چوکرتمه',
        ku: 'کەبابی چۆکەرتمە',
        tr: 'Cökertme Kebap',
        ur: 'چوکرتمے کباب',
        kmr: 'Kebaba Çokertme',
        es: 'Kebab Cökertme',
        ru: 'Чекертме кебаб',
        hi: 'चोकरत्मे कबाब',
        sq: 'Kabab Cökertme',
        fr: 'Kebab Cökertme',
        de: 'Cökertme-Kebab',
        bn: 'চোকার্তমে কাবাব',
        ko: '쵸케르트메 카밥'
      }, 
      description: { 
        en: 'Eggplant with yogurt and garlic, topped with thinly sliced beef pieces, is served with shoestring potatoes and special tomato sauce.',
        ar: 'باذنجان مع اللبن والثوم، مغطى بقطع لحم البقر المقطعة رقيقاً، يُقدم مع البطاطس الشعرية وصلصة الطماطم الخاصة.',
        fa: 'بادمجان با ماست و سیر، روکش شده با تکه‌های نازک گوشت گاو، با سیب‌زمینی نخی و سس گوجه فرنگی مخصوص سرو می‌شود.',
        ku: 'بادەمجان لەگەڵ مۆست و سیر، بە پارچە باریکەکانی گۆشتی گا داپۆشراوە، لەگەڵ پەتاتەی تەلی و سۆسی تەماتەی تایبەت خراوەتە سەر.',
        tr: 'Yoğurt ve sarımsaklı patlıcan, ince dilimlenmiş dana eti parçalarıyla kaplanmış, tel patates ve özel domates sosuyla servis edilir.',
        ur: 'دہی اور لہسن کے ساتھ بینگن، باریک کٹے ہوئے گائے کے گوشت کے ٹکڑوں سے ڈھکا ہوا، شو سٹرنگ آلو اور خاص ٹماٹر ساس کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Bacanê bi mast û sîr, bi perçeyên zok ên goştê ga hatiye daxuyandin, bi kartolên tel û soşa tomata taybet tê peşkêşkirin.',
        es: 'Berenjena con yogur y ajo, cubierta con trozos de carne de res finamente rebanados, se sirve con papas en hilos y salsa de tomate especial.',
        ru: 'Баклажан с йогуртом и чесноком, покрытый тонко нарезанными кусочками говядины, подается с картофелем фри и специальным томатным соусом.',
        hi: 'दही और लहसुन के साथ बैंगन, बारीक कटे हुए गोमांस के टुकड़ों से ढका हुआ, शूस्ट्रिंग आलू और विशेष टमाटर सॉस के साथ परोसा जाता है।',
        sq: 'Patëllxhan me kos dhe hudhra, i mbuluar me copa të holla mishi viçi, shërbehet me patate në fije dhe salcë të veçantë domatesh.',
        fr: 'Aubergine au yaourt et à l\'ail, garnie de fines tranches de bœuf, servie avec des pommes de terre allumettes et une sauce tomate spéciale.',
        de: 'Aubergine mit Joghurt und Knoblauch, belegt mit dünn geschnittenen Rindfleischstücken, serviert mit Schusterkartoffeln und spezieller Tomatensauce.',
        bn: 'দই এবং রসুনের সাথে বেগুন, পাতলা কাটা গরুর মাংসের টুকরা দিয়ে ঢাকা, শুস্ট্রিং আলু এবং বিশেষ টমেটো সসের সাথে পরিবেশিত।',
        ko: '요거트와 마늘을 넣은 가지 위에 얇게 썬 소고기 조각을 올리고, 실감자와 특제 토마토 소스와 함께 제공됩니다.'
      }, 
      price: '$25.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Cokertme Kabab.jpg' 
    },
    { 
      id: 1805, 
      name: { 
        en: 'Wings',
        ar: 'أجنحة',
        fa: 'بال‌ها',
        ku: 'باڵەکان',
        tr: 'Kanatlar',
        ur: 'ونگز',
        kmr: 'Balên',
        es: 'Alitas',
        ru: 'Крылышки',
        hi: 'विंग्स',
        sq: 'Krahët',
        fr: 'Ailes',
        bn: 'উইংস',
        ko: '윙스'
      }, 
      description: { 
        en: 'Grilled wings, a flavor sensation that will delight your taste buds, are served with aromatic saffron rice, fresh green salad, sumac-seasoned onions, and grilled tomato. Don\'t miss out on this delectable combination!',
        ar: 'أجنحة مشوية، إحساس بالنكهة سيسعد براعم التذوق لديك، تُقدم مع أرز الزعفران العطري وسلطة خضراء طازجة وبصل متبل بالسماق والطماطم المشوية. لا تفوت هذا المزيج اللذيذ!',
        fa: 'بال‌های کبابی، احساس طعمی که ذائقه شما را خوشحال می‌کند، با برنج زعفرانی معطر، سالاد سبز تازه، پیاز طعم‌دار شده با سماق و گوجه فرنگی کبابی سرو می‌شود. این ترکیب لذیذ را از دست ندهید!',
        ku: 'باڵە گرێلکراوەکان، هەستێکی تامە کە ذائقەکەت خۆش دەکات، لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی سەوزی تازە، پیازی بە سوماق تامدراو و تەماتەی گرێلکراو خراوەتە سەر. ئەم تێکەڵە خۆشە لەدەست مەدە!',
        tr: 'Izgara kanatlar, damak zevkinizi memnun edecek bir lezzet hissi, aromatik safran pirinci, taze yeşil salata, sumakla baharatlanmış soğan ve ızgara domatesle servis edilir. Bu lezzetli kombinasyonu kaçırmayın!',
        ur: 'گرل شدہ ونگز، ایک ذائقہ کا احساس جو آپ کے ذائقہ کو خوش کرے گا، خوشبودار زعفرانی چاول، تازہ سبز سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے۔ اس لذیذ امتزاج کو مت چھوڑیں!',
        kmr: 'Balên grîlkirî, hesteke tamê ku dê dilê we şad bike, bi brincê zefranî yê bêhnxweş، salata kesk a taze، pîvazên bi sumaq hatine tamdar kirin û firengtiya grîlkirî tê peşkêşkirin. Vê tevahiya xweş ji dest nedin!',
        es: 'Alitas a la parrilla, una sensación de sabor que deleitará tu paladar, se sirven con arroz aromático de azafrán, ensalada verde fresca, cebollas sazonadas con sumac y tomate a la parrilla. ¡No te pierdas esta deliciosa combinación!',
        ru: 'Крылышки на гриле, вкусовое ощущение, которое порадует ваши вкусовые рецепторы, подаются с ароматным шафрановым рисом, свежим зеленым салатом, луком, приправленным сумахом, и жареным помидором. Не упустите эту восхитительную комбинацию!',
        hi: 'ग्रिल्ड विंग्स, एक स्वाद की संवेदना जो आपकी स्वाद कलियों को प्रसन्न करेगी, सुगंधित केसर चावल, ताजे हरे सलाद, सुमाक-मसालेदार प्याज और ग्रिल्ड टमाटर के साथ परोसा जाता है। इस स्वादिष्ट संयोजन को न चूकें!',
        sq: 'Krahët në skarë, një përvojë shije që do të kënaqë shijet tuaja, shërbehet me oriz aromatik me shafran, sallatë të gjelbër të freskët, qepë të erëzuara me sumak dhe domate në skarë. Mos e humbni këtë kombinim të shijshëm!',
        fr: 'Ailes grillées, une sensation gustative qui ravira vos papilles, servies avec du riz aromatique au safran, salade verte fraîche, oignons assaisonnés au sumac et tomate grillée. Ne manquez pas cette délicieuse combinaison!',
        de: 'Gegrillte Flügel, ein Geschmackserlebnis, das Ihre Geschmacksnerven erfreuen wird, werden mit aromatischem Safranreis, frischem grünem Salat, mit Sumak gewürzten Zwiebeln und gegrillter Tomate serviert. Lassen Sie sich diese köstliche Kombination nicht entgehen!',
        bn: 'গ্রিল করা উইংস, একটি স্বাদের অনুভূতি যা আপনার স্বাদ কোরকদের আনন্দিত করবে, সুগন্ধি জাফরান ভাত, তাজা সবুজ সালাদ, সুমাক-মসলাযুক্ত পেঁয়াজ এবং গ্রিল করা টমেটোর সাথে পরিবেশিত। এই সুস্বাদু সমন্বয়টি মিস করবেন না!',
        ko: '구운 윙스는 당신의 미각을 즐겁게 할 맛의 감각으로, 향긋한 사프란 라이스, 신선한 녹색 샐러드, 수막 양념 양파, 구운 토마토와 함께 제공됩니다. 이 맛있는 조합을 놓치지 마세요!'
      }, 
      price: '$19.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Grilled Wings Platter.jpg' 
    },
    { 
      id: 1806, 
      name: { 
        en: 'Beef Tikka',
        ar: 'تيكا لحم البقر',
        fa: 'تیکای گوشت گاو',
        ku: 'تیکای گۆشتی گا',
        tr: 'Dana Tikka',
        ur: 'بیف ٹکہ',
        kmr: 'Tîkka Goştê Ga',
        es: 'Tikka de Res',
        ru: 'Тикка из говядины',
        hi: 'बीफ टिक्का',
        sq: 'Tikka Viçi',
        fr: 'Tikka de Bœuf',
        bn: 'বিফ টিক্কা',
        ko: '소고기 티카'
      }, 
      description: { 
        en: 'Beef tikka, the perfect choice for meat lovers, is paired with aromatic saffron rice, fresh salad, sumac-seasoned onions, and grilled tomato. It creates an unforgettable taste experience. Don\'t miss out on this unique flavor!',
        ar: 'تيكا لحم البقر، الخيار المثالي لمحبي اللحوم، مقترن مع أرز الزعفران العطري وسلطة طازجة وبصل متبل بالسماق والطماطم المشوية. يخلق تجربة طعم لا تُنسى. لا تفوت هذه النكهة الفريدة!',
        fa: 'تیکای گوشت گاو، انتخاب کاملی برای عاشقان گوشت، با برنج زعفرانی معطر، سالاد تازه، پیاز طعم‌دار شده با سماق و گوجه فرنگی کبابی همراه است. تجربه طعم فراموش‌نشدنی ایجاد می‌کند. این طعم منحصر به فرد را از دست ندهید!',
        ku: 'تیکای گۆشتی گا، هەڵبژاردەیەکی تەواو بۆ خۆشەویستانی گۆشت، لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی تازە، پیازی بە سوماق تامدراو و تەماتەی گرێلکراو هاوبەشە. ئەزموونێکی تامی لەبیرنەکراو دروست دەکات. ئەم تامە ناوازەیە لەدەست مەدە!',
        tr: 'Dana tikka, et severler için mükemmel seçim, aromatik safran pirinci, taze salata, sumakla baharatlanmış soğan ve ızgara domatesle eşleştirilmiştir. Unutulmaz bir tat deneyimi yaratır. Bu eşsiz lezzeti kaçırmayın!',
        ur: 'بیف ٹکہ، گوشت کے شائقین کے لیے بہترین انتخاب، خوشبودار زعفرانی چاول، تازہ سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ ٹماٹر کے ساتھ جوڑا گیا ہے۔ یہ ناقابل فراموش ذائقہ کا تجربہ بناتا ہے۔ اس منفرد ذائقے کو مت چھوڑیں!',
        kmr: 'Tîkka goştê ga, hilbijartinek temam ji bo hezkiranê goştê, bi brincê zefranî yê bêhnxweş، salata taze، pîvazên bi sumaq hatine tamdar kirin û firengtiya grîlkirî re tê hevalbend kirin. Ezmûnek tamê jibîrnekirin çêdike. Vê tamê bêhempa ji dest nedin!',
        es: 'Tikka de res, la elección perfecta para los amantes de la carne, se combina con arroz aromático de azafrán, ensalada fresca, cebollas sazonadas con sumac y tomate a la parrilla. Crea una experiencia de sabor inolvidable. ¡No te pierdas este sabor único!',
        ru: 'Тикка из говядины, идеальный выбор для любителей мяса, сочетается с ароматным шафрановым рисом, свежим салатом, луком с сумахом и жареным помидором. Создаёт незабываемый вкусовой опыт. Не упустите этот уникальный вкус!',
        hi: 'बीफ टिक्का, मांस प्रेमियों के लिए बेहतरीन विकल्प, सुगंधित केसर चावल, ताजे सलाद, सुमाक मसालेदार प्याज और ग्रिल्ड टमाटर के साथ जोड़ा गया है। यह अविस्मरणीय स्वाद अनुभव बनाता है। इस अनूठे स्वाद को मत छोड़ें!',
        sq: 'Tikka viçi, zgjidhja perfekte për dashamirët e mishit, është çiftuar me oriz aromatik me shafran, sallatë të freskët, qepë të erëzuara me sumak dhe domate në skarë. Krijon një përvojë shije të paharrushme. Mos e humbni këtë shije unike!',
        fr: 'Tikka de bœuf, le choix parfait pour les amateurs de viande, est accompagné de riz aromatique au safran, salade fraîche, oignons assaisonnés au sumac et tomate grillée. Il crée une expérience gustative inoubliable. Ne manquez pas cette saveur unique !',
        de: 'Rind-Tikka, die perfekte Wahl für Fleischliebhaber, wird mit aromatischem Safranreis, frischem Salat, mit Sumak gewürzten Zwiebeln und gegrillter Tomate kombiniert. Es schafft ein unvergessliches Geschmackserlebnis. Lassen Sie sich diesen einzigartigen Geschmack nicht entgehen!',
        bn: 'বিফ টিক্কা, মাংসপ্রেমীদের জন্য নিখুঁত পছন্দ, সুগন্ধি জাফরান ভাত, তাজা সালাদ, সুমাক-মসলাযুক্ত পেঁয়াজ এবং গ্রিল করা টমেটোর সাথে জোড়া। এটি একটি অবিস্মরণীয় স্বাদের অভিজ্ঞতা তৈরি করে। এই অনন্য স্বাদটি মিস করবেন না!',
        ko: '고기 애호가들을 위한 완벽한 선택인 소고기 티카는 향긋한 사프란 쌀, 신선한 샐러드, 수막 양념 양파, 구운 토마토와 함께 제공됩니다. 잊을 수 없는 맛의 경험을 만들어냅니다. 이 독특한 맛을 놓치지 마세요!'
      }, 
      price: '$23.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Beef Tikka.jpg' 
    },
    { 
      id: 1807, 
      name: { 
        en: 'Chicken Tikka',
        ar: 'تيكا الدجاج',
        fa: 'تیکه مرغ',
        ku: 'تیکای مریشک',
        tr: 'Tavuk Tikka',
        ur: 'چکن ٹکہ',
        kmr: 'Tîkka Mirîşk',
        es: 'Tikka de Pollo',
        ru: 'Куриная тикка',
        hi: 'चिकन टिक्का',
        sq: 'Tikka Pule',
        fr: 'Tikka de Poulet',
        bn: 'চিকেন টিক্কা',
        ko: '치킨 티카'
      }, 
      description: { 
        en: 'This dish offers a flavorful experience! It is served with aromatic saffron rice, fresh salad, sumac-seasoned onions, and grilled tomato. Bon appétit!',
        ar: 'يقدم هذا الطبق تجربة نكهة! يُقدم مع أرز الزعفران العطري وسلطة طازجة وبصل متبل بالسماق والطماطم المشوية. بالهناء والشفاء!',
        fa: 'این غذا تجربه طعم‌داری ارائه می‌دهد! با برنج زعفرانی معطر، سالاد تازه، پیاز طعم‌دار شده با سماق و گوجه فرنگی کبابی سرو می‌شود. نوش جان!',
        ku: 'ئەم خۆراکە ئەزموونێکی تامدار پێشکەش دەکات! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی تازە، پیازی بە سوماق تامدراو و تەماتەی گرێلکراو خراوەتە سەر. خۆش بیت!',
        tr: 'Bu yemek lezzetli bir deneyim sunar! Aromatik safran pirinci, taze salata, sumakla baharatlanmış soğan ve ızgara domatesle servis edilir. Afiyet olsun!',
        ur: 'یہ ڈش ایک ذائقہ دار تجربہ فراہم کرتا ہے! خوشبودار زعفرانی چاول، تازہ سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے۔ مزے سے کھائیں!',
        kmr: 'Ev xwarin ezmûnek bi tam pêşkêş dike! Bi brincê zefranî yê bêhnxweş، salata taze، pîvazên bi sumaq hatine tamdar kirin û firengtiya grîlkirî tê peşkêşkirin. Biçe ser!',
        es: '¡Este plato ofrece una experiencia sabrosa! Se sirve con arroz aromático de azafrán, ensalada fresca, cebollas sazonadas con sumac y tomate a la parrilla. ¡Buen provecho!',
        ru: 'Это блюдо предлагает ароматный опыт! Подаётся с пряным шафрановым рисом, свежим салатом, луком с сумахом и жареным помидором. Приятного аппетита!',
        hi: 'यह व्यंजन एक स्वादिष्ट अनुभव प्रदान करता है! सुगंधित केसर चावल, ताजे सलाद, सुमाक मसालेदार प्याज और ग्रिल्ड टमाटर के साथ परोसा जाता है। स्वादिष्ट भोजन करें!',
        sq: 'Ky pjatë ofron një përvojë të shijshme! Shërbehet me oriz aromatik me shafran, sallatë të freskët, qepë të erëzuara me sumak dhe domate në skarë. Ju bëftë mirë!',
        fr: 'Ce plat offre une expérience savoureuse ! Il est servi avec du riz aromatique au safran, salade fraîche, oignons assaisonnés au sumac et tomate grillée. Bon appétit !',
        de: 'Dieses Gericht bietet ein geschmackvolles Erlebnis! Es wird mit aromatischem Safranreis, frischem Salat, mit Sumak gewürzten Zwiebeln und gegrillter Tomate serviert. Guten Appetit!',
        bn: 'এই পদটি একটি স্বাদযুক্ত অভিজ্ঞতা প্রদান করে! সুগন্ধি জাফরান ভাত, তাজা সালাদ, সুমাক-মসলাযুক্ত পেঁয়াজ এবং গ্রিল করা টমেটোর সাথে পরিবেশিত। শুভ খাবার!',
        ko: '이 요리는 풍미로운 경험을 제공합니다! 향긋한 사프란 라이스, 신선한 샐러드, 수막 양념 양파, 구운 토마토와 함께 제공됩니다. 맛있게 드세요!'
      }, 
      price: '$21.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Chicken Tikka.jpg' 
    },
    { 
      id: 1808, 
      name: { 
        en: 'Lamb Tikka',
        ar: 'تيكا لحم الخروف',
        fa: 'تیکای گوشت بره',
        ku: 'تیکای گۆشتی بەرخ',
        tr: 'Kuzu Tikka',
        ur: 'لیمب ٹکہ',
        kmr: 'Tîkka Goştê Berx',
        es: 'Tikka de Cordero',
        ru: 'Тикка из баранины',
        hi: 'लैम्ब टिक्का',
        sq: 'Tikka Qengjishi',
        fr: 'Tikka d\'Agneau',
        bn: 'ল্যাম্ব টিক্কা',
        ko: '양고기 티카'
      }, 
      description: { 
        en: 'Tender lamb cubes, marinated in spices and grilled on skewers, are served with sumac-marinated onions, fresh salad, saffron rice, and grilled tomato.',
        ar: 'مكعبات لحم الخروف الطرية، متبلة بالتوابل ومشوية على الأسياخ، تُقدم مع البصل المتبل بالسماق والسلطة الطازجة وأرز الزعفران والطماطم المشوية.',
        fa: 'مکعب‌های نرم گوشت بره، در ادویه‌جات مزه‌دار شده و روی سیخ کباب شده، با پیاز مزه‌دار شده با سماق، سالاد تازه، برنج زعفرانی و گوجه فرنگی کبابی سرو می‌شود.',
        ku: 'چوارگۆشەی گۆشتی بەرخی نەرم، بە بەهارات تامدراو و لەسەر سیخ گرێلکراو، لەگەڵ پیازی بە سوماق تامدراو، سالادی تازە، برنجی زەعفەران و تەماتەی گرێلکراو خراوەتە سەر.',
        tr: 'Baharatlarla marine edilmiş ve şişte ızgarada pişirilen yumuşak kuzu küpleri, sumakla marine edilmiş soğan, taze salata, safran pirinci ve ızgara domatesle servis edilir.',
        ur: 'نرم بھیڑ کے ٹکڑے، مصالحوں میں میرینیٹ کر کے سیخوں پر گرل کیے گئے، سماق میں میرینیٹ شدہ پیاز، تازہ سلاد، زعفرانی چاول اور گرل شدہ ٹماٹر کے ساتھ پیش کیے جاتے ہیں۔',
        kmr: 'Parçeyên goştê berxê nerm, bi baharatan hatine marînekirin û li ser şîşan hatine grîlkirin, bi pîvazên bi sumaq hatine marînekirin, salata taze, brincê zefranî û firengtiya grîlkirî tên peşkêşkirin.',
        es: 'Cubos tiernos de cordero, marinados en especias y asados en brochetas, se sirven con cebollas marinadas en sumac, ensalada fresca, arroz de azafrán y tomate a la parrilla.',
        ru: 'Нежные кубики баранины, маринованные в специях и приготовленные на шампурах, подаются с луком, маринованным в сумахе, свежим салатом, шафрановым рисом и жареным помидором.',
        hi: 'मसालों में मैरिनेट किए गए और सीखों पर ग्रिल किए गए नरम भेड़ के टुकड़े, सुमाक-मैरिनेट प्याज, ताजे सलाद, केसर चावल और ग्रिल्ड टमाटर के साथ परोसे जाते हैं।',
        sq: 'Kuba të buta qengjishi, të marinuar me erëza dhe të pjekura në skarë në shpuza, shërbehet me qepë të marinuar me sumak, sallatë të freskët, oriz me shafran dhe domate në skarë.',
        fr: 'Cubes tendres d\'agneau, marinés aux épices et grillés sur des brochettes, sont servis avec des oignons marinés au sumac, salade fraîche, riz au safran et tomate grillée.',
        de: 'Zarte Lammwürfel, in Gewürzen mariniert und auf Spießen gegrillt, werden mit in Sumak marinierten Zwiebeln, frischem Salat, Safranreis und gegrillter Tomate serviert.',
        bn: 'নরম মেষশাবকের কিউব, মসলায় মেরিনেট করা এবং শিকে গ্রিল করা, সুমাক-মেরিনেট করা পেঁয়াজ, তাজা সালাদ, জাফরান ভাত এবং গ্রিল করা টমেটোর সাথে পরিবেশিত।',
        ko: '향신료에 절여 꼬치에 구운 부드러운 양고기 큐브를, 수막에 절인 양파, 신선한 샐러드, 사프란 쌀, 구운 토마토와 함께 제공합니다.'
      }, 
      price: '$23.99', 
      category: 'grill', 
      popular: false, 
      tags: [],
      image: '/Lamb Tikka.jpg'
    },

    // NATURE'S VILLAGE SPECIAL PLATTER
    { 
      id: 1809, 
      name: { 
        en: "Nature's Village Special Platter",
        ar: 'طبق قرية الطبيعة الخاص',
        fa: 'پلاتر مخصوص روستای طبیعت',
        ku: 'پلێتەری تایبەتی گوندی سروشت',
        tr: 'Doğa Köyü Özel Tabağı',
        ur: 'نیچرز ولیج اسپیشل پلیٹر',
        kmr: 'Plata Taybet a Gundê Xwezayê',
        es: 'Platillo Especial de Nature Village',
        ru: 'Особое блюдо деревни природы',
        hi: 'नेचर विलेज स्पेशल प्लैटर',
        sq: 'Pjatë Speciale Nature Village',
        fr: 'Plateau Spécial Nature Village',
        de: 'Nature Village Spezial Platte',
        bn: 'নেচার ভিলেজ স্পেশাল প্লেটার',
        ko: '네이처 빌리지 스페셜 플래터'
      }, 
      description: { 
        en: 'An extraordinary feast featuring our signature grilled specialties: tender Erbil kabab, flavorful Mahshi kabab, succulent beef tikka, perfectly seasoned chicken tikka, crispy grilled wings, and aromatic chicken kabab. Served with two exquisite rice varieties - fragrant saffron rice and spiced biryani - alongside sumac-marinated onions, fresh garden salad, and char-grilled tomatoes. A true celebration of Middle Eastern culinary artistry!',
        ar: 'وليمة استثنائية تضم تخصصاتنا المشوية المميزة: كباب أربيل الطري، كباب محشي بالنكهات، تيكا لحم البقر العصيرة، تيكا الدجاج المتبلة بإتقان، أجنحة مشوية مقرمشة، وكباب الدجاج العطر. يُقدم مع نوعين رائعين من الأرز - أرز الزعفران العطر والبرياني المتبل - إلى جانب البصل المتبل بالسماق، سلطة الحديقة الطازجة، والطماطم المشوية بالفحم. احتفال حقيقي بفن الطهي الشرق أوسطي!',
        fa: 'ضیافتی فوق‌العاده با تخصص‌های کبابی ممتاز ما: کباب اربیل لذیذ، کباب محشی پرطعم، تیکای گوشت گاو آبدار، تیکای مرغ کاملاً ادویه‌دار، بال‌های کبابی ترد، و کباب مرغ معطر. با دو نوع برنج عالی سرو می‌شود - برنج زعفرانی خوشبو و بریانی ادویه‌دار - همراه با پیاز مزه‌دار شده با سماق، سالاد باغی تازه و گوجه فرنگی‌های کبابی زغالی. جشن واقعی هنر آشپزی خاورمیانه!',
        ku: 'خوانێکی نایاب کە تەرکیبە لە کەبابە تایبەتەکانمان: کەبابی هەولێری نەرم، کەبابی پڕکراوەی خۆشتام، تیکای گۆشتی گای ئاوەدار، تیکای مریشکی بەباشی تامدراو، باڵی گرێلکراوی ترشەکراو، و کەبابی مریشکی بۆنخۆش. لەگەڵ دوو جۆری برنجی نایابدا دەخرێتەڕوو - برنجی زەعفەرانی بۆنخۆش و بریانی تامدراو - لەگەڵ پیازی بە سوماق تامدراو، سالادی باخچەی تازە و تەماتەی خەڵووزی گرێلکراو. ئاهەنگێکی ڕاستەقینەی هونەری چێشتی ڕۆژهەڵاتی ناوەڕاست!',
        tr: 'Özel ızgara lezzetlerimizden oluşan olağanüstü bir ziyafet: yumuşacık Erbil kebabı, lezzetli Mahşi kebabı, sulu dana tikka, mükemmel baharatlanmış tavuk tikka, çıtır ızgara kanatlar ve kokulu tavuk kebabı. İki nefis pirinç çeşidiyle servis edilir - kokulu safran pilavı ve baharatlı biryani - sumakla marine edilmiş soğan, taze bahçe salatası ve közlenmiş domateslerle birlikte. Orta Doğu mutfak sanatının gerçek bir kutlaması!',
        ur: 'ہماری خصوصی گرل اسپیشلٹیز کی ایک غیر معمولی دعوت: نرم اربیل کباب، ذائقہ دار محشی کباب، رسیلا بیف ٹکہ، بہترین مصالحہ دار چکن ٹکہ، کرسپی گرل شدہ ونگز، اور خوشبودار چکن کباب۔ دو عمدہ چاول کی اقسام کے ساتھ پیش کیا جاتا ہے - خوشبودار زعفرانی چاول اور مصالحہ دار بریانی - سماق میں میرینیٹ پیاز، تازہ باغیچے کا سلاد، اور چارکول گرل شدہ ٹماٹر کے ساتھ۔ مشرق وسطیٰ کے کھانے کی فن کاری کا حقیقی جشن!',
        kmr: 'Ziyafetek awarte ya bi taybetmendiyên me yên grîlkirî: Kebaba Hewlêrê ya nerm, Kebaba Dagirtî ya bi tam, Tîkka Goştê Ga ya şîrîn, Tîkka Mirîşk a bi baharatan, Balên Grîlkirî yên qerîş û Kebaba Mirîşk a bêhnxweş. Bi du cureyên brincê yên xweş tê pêşkêşkirin - brinca zefranî ya bêhnxweş û biryani ya bi baharatan - digel pîvazên bi sumaq marînekirî, salata baxçê ya taze û firengtiyên bi komirayî grîlkirî. Pîrozkirina rastîn a hunerê xwarinê ya Rojhilata Navîn!',
        es: 'Un festín extraordinario con nuestras especialidades a la parrilla: tierno kebab de Erbil, sabroso kebab Mahshi, suculento tikka de res, tikka de pollo perfectamente sazonado, alitas crujientes a la parrilla y aromático kebab de pollo. Servido con dos exquisitas variedades de arroz - fragante arroz con azafrán y biryani especiado - junto con cebollas marinadas en sumac, ensalada fresca de jardín y tomates carbonizados. ¡Una verdadera celebración del arte culinario de Medio Oriente!',
        ru: 'Необыкновенный пир с нашими фирменными блюдами на гриле: нежный кебаб Эрбиль, ароматный кебаб Махши, сочная говяжья тикка, идеально приправленная куриная тикка, хрустящие крылышки на гриле и ароматный куриный кебаб. Подается с двумя изысканными сортами риса - ароматным шафрановым рисом и пряным бирьяни - вместе с луком, маринованным в сумахе, свежим садовым салатом и жареными на углях помидорами. Настоящее празднование ближневосточного кулинарного искусства!',
        hi: 'हमारी विशेष ग्रिल्ड खासियतों के साथ एक असाधारण दावत: कोमल एर्बिल कबाब, स्वादिष्ट महशी कबाब, रसदार बीफ टिक्का, बेहतरीन मसालों वाला चिकन टिक्का, कुरकुरे ग्रिल्ड विंग्स, और सुगंधित चिकन कबाब। दो उत्कृष्ट चावल की किस्मों के साथ परोसा जाता है - सुगंधित केसर चावल और मसालेदार बिरयानी - सुमाक-मैरिनेटेड प्याज, ताजा बगीचे का सलाद, और कोयले पर भुने टमाटर के साथ। मध्य पूर्वी पाक कला की एक सच्ची उत्सव!',
        sq: 'Një gosti e jashtëzakonshme me specialitetet tona të reja në skarë: kabab Erbil i butë, kabab Mahshi i shijshëm, tikka viçi i lagësht, tikka pule e përsosur me erëza, krahë të kërcëlluar në skarë dhe kabab pule aromatik. Serviret me dy lloje orizi të shkëlqyer - oriz me shafran të parfumuar dhe biryani me erëza - së bashku me qepë të marinuar me sumak, sallatë të freskët kopshti dhe domate të thekura në qymyr. Një festim i vërtetë i artit kulinar të Lindjes së Mesme!',
        fr: 'Un festin extraordinaire mettant en vedette nos spécialités grillées: tendre kebab d\'Erbil, savoureux kebab Mahshi, succulent tikka de bœuf, tikka de poulet parfaitement assaisonné, ailes grillées croustillantes et kebab de poulet aromatique. Servi avec deux variétés de riz exquises - riz au safran parfumé et biryani épicé - accompagné d\'oignons marinés au sumac, salade fraîche du jardin et tomates grillées au charbon. Une véritable célébration de l\'art culinaire du Moyen-Orient!',
        de: 'Ein außergewöhnliches Festmahl mit unseren charakteristischen Grillspezialitäten: zartes Erbil-Kebab, geschmackvolles Mahshi-Kebab, saftiges Rind-Tikka, perfekt gewürztes Hähnchen-Tikka, knusprige gegrillte Flügel und aromatisches Hähnchen-Kebab. Serviert mit zwei exquisiten Reissorten - duftendem Safranreis und gewürztem Biryani - zusammen mit in Sumak marinierten Zwiebeln, frischem Gartensalat und über Kohlenfeuer gegrillten Tomaten. Eine wahre Feier der nahöstlichen Kochkunst!',
        bn: 'আমাদের বিশেষ গ্রিল করা খাদ্যগুলির সাথে একটি অসাধারণ ভোজ: নরম এরবিল কাবাব, স্বাদযুক্ত মাহশী কাবাব, রসালো বিফ টিক্কা, নিখুঁতভাবে মসলাযুক্ত চিকেন টিক্কা, কুড়কুড়ে গ্রিল করা উইংস এবং সুগন্ধি চিকেন কাবাব। দুটি চমৎকার ভাতের জাত দিয়ে পরিবেশিত - সুগন্ধি জাফরান ভাত এবং মসলাযুক্ত বিরিয়ানি - সুমাক-মেরিনেট করা পেঁয়াজ, তাজা বাগানের সালাদ এবং কয়লায় গ্রিল করা টমেটোর সাথে। মধ্যপ্রাচ্যের রন্ধনশিল্পের একটি প্রকৃত উদযাপন!',
        ko: '우리의 시그니처 그릴 스페셜티로 구성된 특별한 잔치: 부드러운 어빌 카밥, 풍미로운 마시 카밥, 육즙이 풍부한 비프 티카, 완벽하게 양념된 치킨 티카, 바삭한 구운 윙스, 향긋한 치킨 카밥. 두 가지 훌륭한 쌀 요리와 함께 제공됩니다 - 향긋한 사프란 라이스와 향신료 비리야니 - 수막에 절인 양파, 신선한 정원 샐러드, 숯불에 구운 토마토와 함께. 중동 요리 예술의 진정한 축제입니다!'
      }, 
      price: '$69.99', // Base price for serving2, variants will override
      category: 'grill', 
      popular: true, 
      tags: ['feast', 'sharing', 'signature'],
      variants: [
        {
          id: 'serving2',
          label: {
            en: 'Serving For 2',
            ar: 'يخدم شخصين',
            fa: 'برای ۲ نفر',
            ku: 'بۆ ۲ کەس',
            tr: '2 Kişilik',
            ur: '۲ افراد کے لیے',
            kmr: 'Ji bo 2 kesan',
            es: 'Para 2 Personas',
            ru: 'На 2 человека',
            hi: '2 लोगों के लिए',
            sq: 'Për 2 Persona',
            fr: 'Pour 2 Personnes',
            de: 'Für 2 Personen',
            bn: '২ জনের জন্য',
            ko: '2인분'
          },
          price: '$69.99'
        },
        {
          id: 'serving4',
          label: {
            en: 'Serving For 4',
            ar: 'يخدم أربعة أشخاص',
            fa: 'برای ۴ نفر',
            ku: 'بۆ ۴ کەس',
            tr: '4 Kişilik',
            ur: '۴ افراد کے لیے',
            kmr: 'Ji bo 4 kesan',
            es: 'Para 4 Personas',
            ru: 'На 4 человека',
            hi: '4 लोगों के लिए',
            sq: 'Për 4 Persona',
            fr: 'Pour 4 Personnes',
            de: 'Für 4 Personen',
            bn: '৪ জনের জন্য',
            ko: '4인분'
          },
          price: '$119.99'
        }
      ],
      image: '/Nature\'s Village Special Platter (2 People).jpg'
    },

    // LAMB CHOPS
    { 
      id: 1810, 
      name: { 
        en: 'Lamb Chops',
        ar: 'ريش الخروف',
        fa: 'کتلت بره',
        ku: 'پەرێنی بەرخ',
        tr: 'Kuzu Pirzola',
        ur: 'لیمب چاپس',
        kmr: 'Perrê Berx',
        es: 'Chuletas de Cordero',
        ru: 'Бараньи отбивные',
        bn: 'ল্যাম্ব চপস',
        hi: 'लैम्ब चॉप्स',
        sq: 'Kotoleta Qengjishi',
        fr: 'Côtelettes d\'Agneau',
        de: 'Lammkoteletts',
        ko: '양갈비'
      }, 
      description: { 
        en: 'Marinated with special spices and perfectly cooked, and served with aromatic saffron rice or creamy mashed potatoes (upon request), fresh salad, sumac-seasoned onions, and grilled tomato, it creates an unforgettable taste.',
        ar: 'متبلة بالتوابل الخاصة ومطبوخة بشكل مثالي، وتُقدم مع أرز الزعفران العطر أو البطاطس المهروسة الكريمية (عند الطلب)، سلطة طازجة، بصل متبل بالسماق، وطماطم مشوية، مما يخلق طعماً لا يُنسى.',
        fa: 'با ادویه‌های مخصوص مزه‌دار شده و به طور کامل پخته شده، و با برنج زعفرانی معطر یا پوره سیب‌زمینی خامه‌ای (در صورت درخواست)، سالاد تازه، پیاز مزه‌دار شده با سماق، و گوجه فرنگی کبابی سرو می‌شود، طعمی فراموش‌نشدنی ایجاد می‌کند.',
        ku: 'بە بەهاراتی تایبەت تامدراوە و بە تەواوی لێنراوە، و لەگەڵ برنجی زەعفەرانی بۆنخۆش یا پەتاتەی وردکراوی کریمی (لە داواکاری) دا، سالادی تازە، پیازی بە سوماق تامدراو، و تەماتەی گرێلکراوەوە دەخرێتەڕوو، تامێکی لەبیرنەکراو دروست دەکات.',
        tr: 'Özel baharatlarla marine edilmiş ve mükemmel şekilde pişirilmiş, kokulu safran pilavı veya kremalı patates püresi (talep üzerine), taze salata, sumakla baharatlanmış soğan ve ızgara domatesle servis edilir, unutulmaz bir lezzet yaratır.',
        ur: 'خاص مصالحوں سے میرینیٹ کیا گیا اور بہترین طریقے سے پکایا گیا، اور خوشبودار زعفرانی چاول یا کریمی میش کیے ہوئے آلو (درخواست پر)، تازہ سلاد، سماق کے ساتھ نمکین پیاز، اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے، یہ ایک ناقابل فراموش ذائقہ بناتا ہے۔',
        kmr: 'Bi baharatên taybet hatiye marînekirin û bi temamî hatiye pijandin, û bi brinca zefranî ya bêhnxweş an jî patatesên şêranî yên qurm (li gor daxwazê), salata taze, pîvazên bi sumaq baharatkirî û firengtiyên grîlkirî tê pêşkêşkirin, tamek ji bîr nayê çêdike.',
        es: 'Marinadas con especias especiales y perfectamente cocinadas, y servidas con arroz de azafrán aromático o puré de papas cremoso (bajo pedido), ensalada fresca, cebollas sazonadas con sumac y tomate a la parrilla, crea un sabor inolvidable.',
        ru: 'Маринованные в специальных специях и идеально приготовленные, подаются с ароматным шафрановым рисом или сливочным картофельным пюре (по запросу), свежим салатом, луком, приправленным сумахом, и жареными помидорами, создавая незабываемый вкус.',
        hi: 'विशेष मसालों में मैरिनेट किया गया और पूर्ण रूप से पकाया गया, और सुगंधित केसर चावल या मलाईदार मैश्ड आलू (अनुरोध पर), ताजा सलाद, सुमाक-मसालेदार प्याज, और ग्रिल्ड टमाटर के साथ परोसा जाता है, यह एक अविस्मरणीय स्वाद बनाता है।',
        sq: 'I marinuar me erëza të veçanta dhe i gatuar në mënyrë të përsosur, dhe i shërbyer me oriz me shafran aromatik ose pure patate me krem (me kërkesë), sallatë të freskët, qepë të aromizuara me sumak dhe domate të pjekura në skarë, krijon një shije të paharrueshme.',
        fr: 'Marinées avec des épices spéciales et parfaitement cuites, et servies avec du riz au safran aromatique ou de la purée de pommes de terre crémeuse (sur demande), une salade fraîche, des oignons assaisonnés au sumac et une tomate grillée, cela crée un goût inoubliable.',
        de: 'Mit besonderen Gewürzen mariniert und perfekt gegart, serviert mit aromatischem Safranreis oder cremigem Kartoffelpüree (auf Anfrage), frischem Salat, mit Sumak gewürzten Zwiebeln und gegrillten Tomaten, schafft es einen unvergesslichen Geschmack.',
        bn: 'বিশেষ মসলা দিয়ে মেরিনেট করা এবং নিখুঁতভাবে রান্না করা, এবং সুগন্ধি জাফরান ভাত বা ক্রিমি ম্যাশড আলু (অনুরোধের ভিত্তিতে), তাজা সালাদ, সুমাক-মসলাযুক্ত পেঁয়াজ এবং গ্রিল করা টমেটো দিয়ে পরিবেশিত, এটি একটি অবিস্মরণীয় স্বাদ তৈরি করে।',
        ko: '특별한 향신료로 양념하고 완벽하게 조리되어, 향긋한 사프란 라이스 또는 크리미한 으깬 감자(요청 시), 신선한 샐러드, 수막 양념 양파, 구운 토마토와 함께 제공되어 잊을 수 없는 맛을 만들어냅니다.'
      }, 
      price: '$38.99', 
      category: 'grill', 
      popular: false, 
      tags: ['signature', 'premium'],
      image: '/Lamb Chops.jpg'
    },

    // GRILLED SHRIMP PLATTER
    { 
      id: 1811, 
      name: { 
        en: 'Grilled Shrimp Platter',
        ar: 'طبق الجمبري المشوي',
        fa: 'پلاتر میگوی کبابی',
        ku: 'پلێتەری شەیتانی گرێلکراو',
        tr: 'Izgara Karides Tabağı',
        ur: 'گرل شرمپ پلیٹر',
        kmr: 'Plata Şêşmalên Grîlkirî',
        es: 'Plato de Camarones a la Parrilla',
        ru: 'Блюдо из креветок на гриле',
        hi: 'ग्रिल्ड श्रिम्प प्लैटर',
        sq: 'Pjatë Karkaleci të Pjekur në Skarë',
        fr: 'Plateau de Crevettes Grillées',
        de: 'Gegrillte Garnelen Platte',
        bn: 'গ্রিল করা চিংড়ি প্লেটার',
        ko: '구운 새우 플래터'
      }, 
      description: { 
        en: 'Marinated grilled shrimp served with sumac-marinated onions, fresh salad, aromatic saffron rice or creamy mashed potatoes (upon request) and grilled tomato.',
        ar: 'جمبري مشوي متبل يُقدم مع بصل متبل بالسماق، سلطة طازجة، أرز الزعفران العطر أو البطاطس المهروسة الكريمية (عند الطلب) وطماطم مشوية.',
        fa: 'میگوی کبابی مزه‌دار شده با پیاز مزه‌دار شده با سماق، سالاد تازه، برنج زعفرانی معطر یا پوره سیب‌زمینی خامه‌ای (در صورت درخواست) و گوجه فرنگی کبابی سرو می‌شود.',
        ku: 'مەیگووی گرێلکراوی تامدراو لەگەڵ پیازی بە سوماق تامدراو، سالادی تازە، برنجی زەعفەرانی بۆنخۆش یا پەتاتەی وردکراوی کریمی (لە داواکاری) و تەماتەی گرێلکراوەوە دەخرێتەڕوو.',
        tr: 'Marine edilmiş ızgara karides, sumakla marine edilmiş soğan, taze salata, kokulu safran pilavı veya kremalı patates püresi (talep üzerine) ve ızgara domatesle servis edilir.',
        ur: 'میرینیٹ شدہ گرل جھینگا سماق میں میرینیٹ پیاز، تازہ سلاد، خوشبودار زعفرانی چاول یا کریمی میش کیے ہوئے آلو (درخواست پر) اور گرل شدہ ٹماٹر کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Şevekên grîlkirî yên marînekirî bi pîvazên bi sumaq marînekirî, salata taze, brinca zefranî ya bêhnxweş an jî patatesên şêranî yên qurm (li gor daxwazê) û firengtiyên grîlkirî tên pêşkêşkirin.',
        es: 'Camarones a la parrilla marinados servidos con cebollas marinadas en sumac, ensalada fresca, arroz de azafrán aromático o puré de papas cremoso (bajo pedido) y tomate a la parrilla.',
        ru: 'Маринованные жареные креветки подаются с луком, маринованным в сумахе, свежим салатом, ароматным шафрановым рисом или сливочным картофельным пюре (по запросу) и жареными помидорами.',
        hi: 'मैरिनेट किए गए ग्रिल्ड झींगे सुमाक-मैरिनेटेड प्याज, ताजा सलाद, सुगंधित केसर चावल या मलाईदार मैश्ड आलू (अनुरोध पर) और ग्रिल्ड टमाटर के साथ परोसे जाते हैं।',
        sq: 'Karkaleca të marinuara në skarë të shërbyer me qepë të marinuara me sumak, sallatë të freskët, oriz me shafran aromatik ose pure patate me krem (me kërkesë) dhe domate të pjekura në skarë.',
        fr: 'Crevettes grillées marinées servies avec des oignons marinés au sumac, une salade fraîche, du riz au safran aromatique ou de la purée de pommes de terre crémeuse (sur demande) et une tomate grillée.',
        de: 'Marinierte gegrillte Garnelen serviert mit in Sumak marinierten Zwiebeln, frischem Salat, aromatischem Safranreis oder cremigem Kartoffelpüree (auf Anfrage) und gegrillten Tomaten.',
        bn: 'মেরিনেট করা গ্রিল চিংড়ি সুমাক-মেরিনেট করা পেঁয়াজ, তাজা সালাদ, সুগন্ধি জাফরান ভাত বা ক্রিমি ম্যাশড আলু (অনুরোধের ভিত্তিতে) এবং গ্রিল করা টমেটো দিয়ে পরিবেশিত।',
        ko: '양념한 구운 새우를 수막에 절인 양파, 신선한 샐러드, 향긋한 사프란 라이스 또는 크리미한 으깬 감자(요청 시), 구운 토마토와 함께 제공합니다.'
      }, 
      price: '$22.99', 
      category: 'grill', 
      popular: false, 
      tags: ['seafood', 'grilled'],
      image: '/Grilled Shrimp Platter.jpg'
    },

    // GRILLED BRANZINO PLATTER
    { 
      id: 1812, 
      name: { 
        en: 'Grilled Branzino Platter',
        ar: 'طبق البرانزينو المشوي',
        fa: 'پلاتر برانزینوی کبابی',
        ku: 'پلێتەری برانزینۆی گرێلکراو',
        tr: 'Izgara Levrek Tabağı',
        ur: 'گرل شدہ برانزینو پلیٹر',
        kmr: 'Plata Branzino Grîlkirî',
        es: 'Plato de Branzino a la Parrilla',
        ru: 'Блюдо из жареного сибаса',
        hi: 'ग्रिल्ड ब्रान्ज़िनो प्लैटर',
        sq: 'Pjatë Branzino në Skarë',
        fr: 'Plateau de Bar Grillé',
        de: 'Gegrillte Wolfsbarsch Platte',
        bn: 'গ্রিল করা ব্রানজিনো প্লেটার',
        ko: '구운 브란지노 플래터'
      }, 
      description: { 
        en: 'Grilled European sea bass fillets, served with sumac-marinated onions, fresh salad, grilled tomato, grilled lemon, and creamy mashed potatoes, is a delightful choice.',
        ar: 'فيليه سمك القاروس الأوروبي المشوي، يُقدم مع بصل متبل بالسماق، سلطة طازجة، طماطم مشوية، ليمون مشوي، وبطاطس مهروسة كريمية، خيار مبهج.',
        fa: 'فیله ماهی سی باس اروپایی کبابی، با پیاز مزه‌دار شده با سماق، سالاد تازه، گوجه فرنگی کبابی، لیمو کبابی، و پوره سیب‌زمینی خامه‌ای سرو می‌شود، انتخابی لذت‌بخش است.',
        ku: 'فیلێی ماسی سی باسی ئەوروپی گرێلکراو، لەگەڵ پیازی بە سوماق تامدراو، سالادی تازە، تەماتەی گرێلکراو، لیمۆی گرێلکراو، و پەتاتەی وردکراوی کریمیەوە دەخرێتەڕوو، هەڵبژاردەیەکی دڵخۆشکەرە.',
        tr: 'Izgara Avrupa levrek filetoları, sumakla marine edilmiş soğan, taze salata, ızgara domates, ızgara limon ve kremalı patates püresiyle servis edilir, keyifli bir seçimdir.',
        ur: 'گرل شدہ یورپی سی باس فلیٹس، سماق میں میرینیٹ پیاز، تازہ سلاد، گرل شدہ ٹماٹر، گرل شدہ لیموں، اور کریمی میش کیے ہوئے آلو کے ساتھ پیش کیا جاتا ہے، یہ ایک خوشگوار انتخاب ہے۔',
        kmr: 'Filetoên masîyê denizê yê Ewropî yên grîlkirî, bi pîvazên bi sumaq marînekirî, salata taze, firengtiya grîlkirî, lîmona grîlkirî û patatesên şêranî yên qurm tên pêşkêşkirin, bijartinek dilxweş e.',
        es: 'Filetes de lubina europea a la parrilla, servidos con cebollas marinadas en sumac, ensalada fresca, tomate a la parrilla, limón a la parrilla y puré de papas cremoso, es una opción deliciosa.',
        ru: 'Филе европейского морского окуня на гриле, подается с луком, маринованным в сумахе, свежим салатом, жареными помидорами, жареным лимоном и сливочным картофельным пюре - восхитительный выбор.',
        hi: 'ग्रिल्ड यूरोपीय सी बास फिलेट्स, सुमाक-मैरिनेटेड प्याज, ताजा सलाद, ग्रिल्ड टमाटर, ग्रिल्ड नींबू, और मलाईदार मैश्ड आलू के साथ परोसा जाता है, यह एक आनंददायक विकल्प है।',
        sq: 'Fileto levrek evropian të pjekur në skarë, të shërbyer me qepë të marinuara me sumak, sallatë të freskët, domate të pjekura në skarë, limon të pjekur në skarë dhe pure patate me krem, është një zgjedhje e këndshme.',
        fr: 'Filets de bar européen grillés, servis avec des oignons marinés au sumac, une salade fraîche, une tomate grillée, un citron grillé et une purée de pommes de terre crémeuse, c\'est un choix délicieux.',
        de: 'Gegrillte europäische Wolfsbarsch-Filets, serviert mit in Sumak marinierten Zwiebeln, frischem Salat, gegrillten Tomaten, gegrillter Zitrone und cremigem Kartoffelpüree, ist eine köstliche Wahl.',
        bn: 'গ্রিল করা ইউরোপীয় সি বাস ফিললেট, সুমাক-মেরিনেট করা পেঁয়াজ, তাজা সালাদ, গ্রিল করা টমেটো, গ্রিল করা লেবু এবং ক্রিমি ম্যাশড আলু দিয়ে পরিবেশিত, এটি একটি সুস্বাদু পছন্দ।',
        ko: '구운 유럽산 바다농어 필레를 수막에 절인 양파, 신선한 샐러드, 구운 토마토, 구운 레몬, 크리미한 으깬 감자와 함께 제공하는 맛있는 선택입니다.'
      }, 
      price: '$37.99', 
      category: 'grill', 
      popular: false, 
      tags: ['seafood', 'premium', 'european'],
      image: '/Grilled Branzino Platter.jpg'
    },

    // VEGGIE PLATTER
    { 
      id: 1709, 
      name: { 
        en: 'Veggie Platter',
        ar: 'طبق الخضار',
        fa: 'پلاتر سبزیجات',
        ku: 'پلێتەری سەوزە',
        tr: 'Sebze Tabağı',
        ur: 'ویجی پلیٹر',
        kmr: 'Plata Sebzan',
        es: 'Plato de Verduras',
        ru: 'Овощное блюдо',
        hi: 'वेजी प्लैटर',
        sq: 'Pjatë Perimesh',
        fr: 'Plateau de Légumes',
        de: 'Gemüse Platte',
        bn: 'ভেজি প্লেটার',
        ko: '베지 플래터'
      }, 
      description: { 
        en: 'This dish features a stir-fried medley of broccoli, carrots, green beans, onion, snap peas, celery, red bell pepper, and white chestnuts, topped with basil, olive oil, and garlic sauce. It is served with saffron rice, tomato sauce, and mild and hot sauces.',
        ar: 'يتميز هذا الطبق بخليط مقلي من البروكلي والجزر والفاصولياء الخضراء والبصل وبازلاء الثلج والكرفس والفلفل الأحمر الحلو والكستناء البيضاء، مغطى بالريحان وزيت الزيتون وصلصة الثوم. يُقدم مع أرز الزعفران وصلصة الطماطم والصلصات المعتدلة والحارة.',
        fa: 'این غذا شامل مخلوطی از کلم بروکلی، هویج، لوبیا سبز، پیاز، نخود فرنگی، کرفس، فلفل قرمز شیرین و شاه بلوط سفید سرخ شده، با ریحان، روغن زیتون و سس سیر تزین شده است. با برنج زعفرانی، سس گوجه فرنگی و سس‌های ملایم و تند سرو می‌شود.',
        ku: 'ئەم خواردنە تێکەڵەیەکی سورکراوە لە بروکلی، گەزەر، لووبیا سەوز، پیاز، نۆکی کەڵەم، کرفس، فەلفەڵی سوور شیرین و گوێزی سپیەوە پێکهاتووە، بە ڕەیحان، زەیتی زەیتوون و سۆسی سیر ڕازاوەتەوە. لەگەڵ برنجی زەعفەران، سۆسی تەماتە و سۆسی ملایم و تووندەوە دەخرێتەڕوو.',
        tr: 'Bu yemek brokoli, havuç, yeşil fasulye, soğan, bezelye, kereviz, kırmızı biber ve beyaz kestane karışımından oluşur, fesleğen, zeytinyağı ve sarımsak sosuyla servis edilir. Safran pilavı, domates sosu ve acılı-acısız soslarla birlikte sunulur.',
        ur: 'یہ ڈش بروکولی، گاجر، ہری پھلیاں، پیاز، مٹر، اجوائن، سرخ شملہ مرچ، اور سفید بادام کا تلا ہوا مکسچر ہے، جس پر تلسی، زیتون کا تیل اور لہسن کی چٹنی ڈالی جاتی ہے۔ یہ زعفرانی چاول، ٹماٹر کی چٹنی، اور ہلکی اور تیز چٹنیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Ev xwarinê tevlîheviya sebzeyan a hate sorîn e ku ji brokolî, gizer, fasûlye kesk, pîvaz, nokê, kerevîz, bibirê sor û qestaneyên spî pêk tê, bi rêhan, zeyta zeytûnê û sosê sîrê hatiye xemilandin. Bi brinca zefranî, sosê firingiyê û sosên hênik û tûj re tê pêşkêşkirin.',
        es: 'Este plato presenta una mezcla salteada de brócoli, zanahorias, judías verdes, cebolla, guisantes, apio, pimiento rojo y castañas blancas, cubierto con albahaca, aceite de oliva y salsa de ajo. Se sirve con arroz de azafrán, salsa de tomate y salsas suaves y picantes.',
        ru: 'Это блюдо представляет жареную смесь брокколи, моркови, стручковой фасоли, лука, гороха, сельдерея, красного болгарского перца и белых каштанов, заправленную базиликом, оливковым маслом и чесночным соусом. Подается с шафрановым рисом, томатным соусом и мягкими и острыми соусами.',
        hi: 'यह डिश ब्रोकली, गाजर, हरी फलियां, प्याज, मटर, अजवाइन, लाल शिमला मिर्च, और सफेद बादाम का तला हुआ मिश्रण है, जिस पर तुलसी, जैतून का तेल और लहसुन की चटनी डाली जाती है। यह केसर चावल, टमाटर की चटनी, और हल्की और तेज चटनी के साथ परोसा जाता है।',
        sq: 'Kjo pjatë përmban një përzierje të skuqur brokoli, karrota, bishtaja të gjelbra, qepë, bizele, sellino, speca të kuq dhe gështenja të bardha, e mbuluar me borzilok, vaj ulliri dhe salcë hudhra. Shërbehet me oriz me shafran, salcë domatesh dhe salca të buta dhe të forta.',
        fr: 'Ce plat présente un mélange sauté de brocoli, carottes, haricots verts, oignon, pois mange-tout, céleri, poivron rouge et châtaignes blanches, garni de basilic, huile d\'olive et sauce à l\'ail. Il est servi avec du riz au safran, de la sauce tomate et des sauces douces et épicées.',
        de: 'Dieses Gericht besteht aus einer gebratenen Mischung aus Brokkoli, Karotten, grünen Bohnen, Zwiebeln, Zuckerschoten, Sellerie, roter Paprika und weißen Kastanien, garniert mit Basilikum, Olivenöl und Knoblauchsauce. Es wird mit Safranreis, Tomatensauce und milden und scharfen Saucen serviert.',
        bn: 'এই খাবারে ব্রোকলি, গাজর, সবুজ বিন, পেঁয়াজ, স্ন্যাপ মটর, সেলারি, লাল ক্যাপসিকাম এবং সাদা চেস্টনাটের ভাজা মিশ্রণ রয়েছে, তুলসী, অলিভ অয়েল এবং রসুনের সস দিয়ে সাজানো। এটি জাফরান ভাত, টমেটো সস এবং মৃদু ও ঝাল সস দিয়ে পরিবেশিত হয়।',
        ko: '이 요리는 브로콜리, 당근, 녹두, 양파, 스냅피, 셀러리, 빨간 피망, 하얀 밤을 볶은 혼합물로, 바질, 올리브 오일, 마늘 소스를 곁들였습니다. 사프란 라이스, 토마토 소스, 순한 소스와 매운 소스와 함께 제공됩니다.'
      }, 
      price: '$19.99', 
      category: 'grill', 
      popular: false, 
      tags: ['vegetarian', 'healthy', 'grilled'],
      image: '/Veggie Platter.jpg'
    },

    // KID'S MENU
    { 
      id: 1902, 
      name: { 
        en: 'Chicken Tenders',
        ar: 'أصابع الدجاج',
        fa: 'تندر مرغ',
        ku: 'تەندەری مریشک',
        tr: 'Tavuk Şerit',
        ur: 'چکن ٹینڈرز',
        kmr: 'Tenderên Mirîşk',
        es: 'Tiras de Pollo',
        ru: 'Куриные полоски',
        hi: 'चिकन टेंडर',
        sq: 'Shirita Pule',
        fr: 'Filets de Poulet Tendres',
        de: 'Hähnchen-Streifen',
        bn: 'চিকেন টেন্ডার',
        ko: '치킨 텐더'
      }, 
      description: { 
        en: 'Tender strips of chicken breast, breaded and fried to crispy golden brown, are served with your choice of dipping sauces.',
        ar: 'شرائح طرية من صدر الدجاج، مغطاة بالخبز ومقلية حتى اللون الذهبي المقرمش، تُقدم مع صلصات الغمس من اختيارك.',
        fa: 'نوارهای نرم سینه مرغ، آرد شده و سرخ شده تا رنگ طلایی ترد، با سس‌های انتخابی شما سرو می‌شود.',
        ku: 'پارچە نەرمەکانی سنگی مریشک، نانکراو و سوورکراوە تا ڕەنگی زێڕینی ترسکە، لەگەڵ سۆسەکانی دڵخوازت بۆ خستنە ناوەوە دەخرێنەڕوو.',
        tr: 'Tavuk göğsünün yumuşak şeritleri, galeta unu ile kaplanmış ve çıtır altın sarısı renkte kızartılmış, seçtiğiniz daldırma soslarıyla servis edilir.',
        ur: 'چکن بریسٹ کی نرم پٹیاں، بریڈ کر کے کرسپی سنہری بھورے رنگ میں تلی گئی، آپ کی پسند کے ڈپنگ ساس کے ساتھ پیش کی جاتی ہیں۔',
        kmr: 'Perçeyên nerm ên sînga mirîşk, bi nanê hatine kirin û hatine sortin heta rengê zêrîn ê çitir, bi sosên ku tu dibijêrî ji bo navxistinê tên pêşkêşkirin.',
        es: 'Tiras tiernas de pechuga de pollo, empanizadas y fritas hasta un dorado crujiente, se sirven con las salsas para remojar de tu elección.',
        ru: 'Нежные полоски куриной грудки в панировке, обжаренные до золотисто-коричневого хрустящего цвета, подаются с соусами на ваш выбор.',
        hi: 'चिकन ब्रेस्ट की नरम पट्टियां, ब्रेड और कुरकुरी सुनहरी भूरे रंग में तली हुई, आपकी पसंद की डिपिंग सॉस के साथ परोसी जाती हैं।',
        sq: 'Shirita të buta të gjoksit të pulës, të mbuluar me bukë dhe të skuqura në ngjyrë të artë të krisur, shërbehet me salcat tuaja të zgjedhura për zhytje.',
        fr: 'Lanières tendres de poitrine de poulet, panées et frites jusqu\'à un doré croustillant, servies avec vos sauces de trempage au choix.',
        de: 'Zarte Streifen von Hühnerbrust, paniert und zu goldbrauner Knusprigkeit frittiert, werden mit Ihren gewählten Dip-Saucen serviert.',
        bn: 'চিকেন ব্রেস্টের নরম স্ট্রিপ, ব্রেড করা এবং কুড়কুড়ে সোনালি বাদামী রঙে ভাজা, আপনার পছন্দের ডিপিং সস দিয়ে পরিবেশিত।',
        ko: '치킨 브레스트의 부드러운 스트립을 빵가루로 입혀서 바삭한 황금빛 갈색으로 튀겨, 원하는 디핑 소스와 함께 제공됩니다.'
      }, 
      price: '$9.49', 
      category: 'kids', 
      popular: true, 
      image: '/Chicken Tenders.jpg',
      tags: []
    },
    { 
      id: 1903, 
      name: { 
        en: 'Fries',
        ar: 'بطاطس مقلية',
        fa: 'سیب‌زمینی سرخ‌کردنی',
        ku: 'پەتاتەی سوورکراو',
        tr: 'Patates Kızartması',
        ur: 'فرائیز',
        kmr: 'Kartolên Sorkirî',
        es: 'Papas Fritas',
        ru: 'Картофель фри',
        hi: 'फ्रेंच फ्राइज़',
        sq: 'Patate të Skuqura',
        fr: 'Frites',
        de: 'Pommes',
        bn: 'ফ্রাইজ',
        ko: '감자튀김'
      }, 
      description: { 
        en: 'Crispy, golden-brown potato fries, seasoned to perfection and served hot.',
        ar: 'بطاطس مقلية ذهبية مقرمشة، متبلة بشكل مثالي وتُقدم ساخنة.',
        fa: 'سیب‌زمینی سرخ‌شده طلایی و ترد، با طعم کامل و داغ سرو می‌شود.',
        ku: 'پەتاتەی سوورکراوی ترسکەی زێڕین، بە تەواوی تامدراو و گەرم خراوەتە سەر.',
        tr: 'Çıtır, altın sarısı patates kızartması, mükemmel baharatlanmış ve sıcak servis edilir.',
        ur: 'کرسپی، سنہرے بھورے آلو فرائیز، مکمل طور پر سیزن کیے گئے اور گرم پیش کیے گئے۔',
        kmr: 'Kartolên sorkirî yên çitir û zêrîn, bi temamî hatine tamdar kirin û germ tê peşkêşkirin.',
        es: 'Papas fritas crujientes y doradas, sazonadas a la perfección y servidas calientes.',
        ru: 'Хрустящий золотисто-коричневый картофель фри, приправленный до совершенства и поданный горячим.',
        hi: 'कुरकुरे, सुनहरे-भूरे आलू फ्राइज़, पूर्णता से सीज़न किए गए और गर्म परोसे गए।',
        sq: 'Patate të krisura me ngjyrë të artë, të erëzuara në përsosmëri dhe të shërbyera të nxehta.',
        fr: 'Frites croustillantes et dorées, parfaitement assaisonnées et servies chaudes.',
        de: 'Knusprige, goldbraune Kartoffelpommes, perfekt gewürzt und heiß serviert.',
        bn: 'কুড়কুড়ে, সোনালি-বাদামী আলুর ফ্রাই, নিখুঁততার সাথে মসলা দেওয়া এবং গরম পরিবেশিত।',
        ko: '바삭하고 황금빛 갈색의 감자튀김으로, 완벽하게 양념되어 뜨겁게 제공됩니다.'
      }, 
      price: '$6.99', 
      category: 'kids', 
      popular: true, 
      image: '/Fries.jpg',
      tags: []
    },
    { 
      id: 1901, 
      name: { 
        en: 'Erbil Shish Kabab',
        ar: 'شيش كباب أربيل',
        fa: 'شیش کباب اربیل',
        ku: 'شیش کەبابی هەولێر',
        tr: 'Erbil Şiş Kebab',
        ur: 'اربیل شیش کباب',
        kmr: 'Şişê Hewlêrê',
        es: 'Shish Kebab de Erbil',
        ru: 'Шиш-кебаб Эрбиль',
        hi: 'एर्बिल शीश कबाब',
        sq: 'Shish Kabab Erbil',
        fr: 'Brochette d\'Erbil',
        de: 'Erbil Spiess-Kebab',
        bn: 'এরবিল শিশ কাবাব',
        ko: '어빌 시시 카밥',
        kmr: 'Şîş Kebabê Hewlêrê',
        es: 'Shish Kabab de Erbil',
        ru: 'Шиш-кебаб Эрбиль',
        hi: 'एर्बिल शीश कबाब',
        sq: 'Shish Kabab Erbil',
        fr: 'Brochette Erbil',
        de: 'Erbil Spießbraten',
        bn: 'এরবিল শিশ কাবাব',
        ko: '어빌 시시 카밥'
      }, 
      description: { 
        en: 'This dish features mildly spiced mini beef kabab skewers specially prepared for kids, served with creamy mashed potatoes.',
        ar: 'يتميز هذا الطبق بأسياخ كباب اللحم البقري الصغيرة المتبلة بشكل معتدل والمحضرة خصيصاً للأطفال، تُقدم مع البطاطس المهروسة الكريمية.',
        fa: 'این غذا شامل سیخ‌های کباب گوشت گاو کوچک با طعم ملایم است که مخصوص کودکان تهیه شده و با پوره سیب‌زمینی خامه‌ای سرو می‌شود.',
        ku: 'ئەم خواردنە سیخەکانی کەبابی گۆشتی گای بچووکی بە تامی ملایم دەگرێتەوە کە بە تایبەتی بۆ منداڵان ئامادەکراوە، لەگەڵ پەتاتەی وردکراوی کریمیەوە دەخرێتەڕوو.',
        tr: 'Bu yemek, çocuklar için özel olarak hazırlanmış hafif baharatlı mini sığır et şiş kebapları içerir ve kremalı patates püresiyle servis edilir.',
        ur: 'یہ ڈش ہلکے مسالے والے چھوٹے بیف کباب کے سیخوں پر مشتمل ہے جو خاص طور پر بچوں کے لیے تیار کیے گئے ہیں، کریمی میش کیے ہوئے آلو کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Ev xwarinê şîşên kebabê goştê gayê yên piçûk ên bi tatê hênik ê ji bo zarokan bi taybetî hatine amadekirin dihewîne, bi patatesên şêranî yên qurm re tê pêşkêşkirin.',
        es: 'Este plato presenta mini brochetas de carne de res ligeramente especiadas, especialmente preparadas para niños, servidas con puré de papas cremoso.',
        ru: 'Это блюдо включает слегка приправленные мини-шашлыки из говядины, специально приготовленные для детей, подаются с кремовым картофельным пюре.',
        hi: 'यह डिश में हल्के मसाले वाले मिनी बीफ कबाब स्किवर हैं जो विशेष रूप से बच्चों के लिए तैयार किए गए हैं, मलाईदार मैश किए गए आलू के साथ परोसे जाते हैं।',
        sq: 'Kjo pjatë përmban shishqebap të vegjël viçi me erëza të buta të përgatitura posaçërisht për fëmijë, të shërbyer me pure patate me krem.',
        fr: 'Ce plat présente des mini-brochettes de bœuf légèrement épicées spécialement préparées pour les enfants, servies avec une purée de pommes de terre crémeuse.',
        de: 'Dieses Gericht bietet mild gewürzte Mini-Rindfleisch-Kebab-Spieße, die speziell für Kinder zubereitet werden, serviert mit cremigem Kartoffelpüree.',
        bn: 'এই পদে হালকা মসলাযুক্ত মিনি বিফ কাবাব স্কিউয়ার রয়েছে যা বিশেষভাবে শিশুদের জন্য প্রস্তুত করা হয়, ক্রিমি ম্যাশড আলুর সাথে পরিবেশিত।',
        ko: '이 요리는 아이들을 위해 특별히 준비된 부드럽게 양념한 미니 소고기 카밥 꼬치로, 크리미한 으깬 감자와 함께 제공됩니다.'
      }, 
      price: '$16.99', 
      category: 'kids', 
      popular: false, 
      image: '/kids/Kids Erbil Shish Kabab.jpg',
      tags: ['beef', 'kabab']
    },
    { 
      id: 1904, 
      name: { 
        en: 'Chicken Kabab',
        ar: 'كباب الدجاج',
        fa: 'کباب مرغ',
        ku: 'کەبابی مریشک',
        tr: 'Tavuk Kebab',
        ur: 'چکن کباب',
        kmr: 'Kebabê Mirîşk',
        es: 'Kabab de Pollo',
        ru: 'Куриный кебаб',
        hi: 'चिकन कबाब',
        sq: 'Kebab Pule',
        fr: 'Brochette de Poulet',
        de: 'Hähnchen-Kebab',
        bn: 'চিকেন কাবাব',
        ko: '치킨 카밥'
      }, 
      description: { 
        en: 'Mildly spiced mini chicken kabab skewers specially prepared for kids, served with creamy mashed potatoes.',
        ar: 'أسياخ كباب الدجاج الصغيرة المتبلة بشكل معتدل والمحضرة خصيصاً للأطفال، تُقدم مع البطاطس المهروسة الكريمية.',
        fa: 'سیخ‌های کباب مرغ کوچک با طعم ملایم که مخصوص کودکان تهیه شده و با پوره سیب‌زمینی خامه‌ای سرو می‌شود.',
        ku: 'سیخەکانی کەبابی مریشکی بچووکی بە تامی ملایم کە بە تایبەتی بۆ منداڵان ئامادەکراوە، لەگەڵ پەتاتەی وردکراوی کریمیەوە دەخرێتەڕوو.',
        tr: 'Çocuklar için özel olarak hazırlanmış hafif baharatlı mini tavuk kebap şişleri, kremalı patates püresiyle servis edilir.',
        ur: 'ہلکے مسالے والے چھوٹے چکن کباب کے سیخ جو خاص طور پر بچوں کے لیے تیار کیے گئے ہیں، کریمی میش کیے ہوئے آلو کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Şîşên kebabê mirîşk ên piçûk ên bi tatê hênik ê ji bo zarokan bi taybetî hatine amadekirin, bi patatesên şêranî yên qurm re tên pêşkêşkirin.',
        es: 'Mini brochetas de pollo ligeramente especiadas, especialmente preparadas para niños, servidas con puré de papas cremoso.',
        ru: 'Слегка приправленные мини-шашлыки из курицы, специально приготовленные для детей, подаются с кремовым картофельным пюре.',
        hi: 'हल्के मसाले वाले मिनी चिकन कबाब स्किवर जो विशेष रूप से बच्चों के लिए तैयार किए गए हैं, मलाईदार मैश किए गए आलू के साथ परोसे जाते हैं।',
        sq: 'Shishqebap të vegjël pule me erëza të buta të përgatitura posaçërisht për fëmijë, të shërbyer me pure patate me krem.',
        fr: 'Mini-brochettes de poulet légèrement épicées spécialement préparées pour les enfants, servies avec une purée de pommes de terre crémeuse.',
        de: 'Mild gewürzte Mini-Hähnchen-Kebab-Spieße, die speziell für Kinder zubereitet werden, serviert mit cremigem Kartoffelpüree.',
        bn: 'হালকা মসলাযুক্ত মিনি চিকেন কাবাব স্কিউয়ার যা বিশেষভাবে শিশুদের জন্য প্রস্তুত করা হয়, ক্রিমি ম্যাশড আলুর সাথে পরিবেশিত।',
        ko: '아이들을 위해 특별히 준비된 부드럽게 양념한 미니 치킨 카밥 꼬치로, 크리미한 으깬 감자와 함께 제공됩니다.'
      }, 
      price: '$15.99', 
      category: 'kids', 
      popular: false, 
      image: '/kids/Kids Chicken Kabab.jpg',
      tags: ['chicken', 'kabab']
    },

    // SIDES
    { 
      id: 1905, 
      name: { 
        en: 'Saffron Rice',
        ar: 'أرز بالزعفران',
        fa: 'برنج زعفرانی',
        ku: 'برنجی زەعفەران',
        tr: 'Safran Pilavı',
        ur: 'زعفرانی چاول',
        kmr: 'Brinca Zefranî',
        es: 'Arroz con Azafrán',
        ru: 'Шафрановый рис',
        hi: 'केसर चावल',
        sq: 'Oriz me Shafran',
        fr: 'Riz au Safran',
        de: 'Safranreis',
        bn: 'জাফরান ভাত',
        ko: '사프란 라이스'
      }, 
      price: '$3.99', 
      category: 'sides', 
      popular: false, 
      tags: ['rice', 'saffron', 'vegetarian']
    },
    { 
      id: 1906, 
      name: { 
        en: 'Creamy Mashed Potatoes',
        ar: 'البطاطس المهروسة الكريمية',
        fa: 'پوره سیب‌زمینی خامه‌ای',
        ku: 'پەتاتەی وردکراوی کریمی',
        tr: 'Kremalı Patates Püresi',
        ur: 'کریمی میش کیے ہوئے آلو',
        kmr: 'Patatesên Şêranî yên Qurm',
        es: 'Puré de Papas Cremoso',
        ru: 'Кремовое картофельное пюре',
        hi: 'मलाईदार मैश्ड आलू',
        sq: 'Pure Patate me Krem',
        fr: 'Purée de Pommes de Terre Crémeuse',
        de: 'Cremiges Kartoffelpüree',
        bn: 'ক্রিমি ম্যাশড আলু',
        ko: '크리미한 으깬 감자'
      }, 
      price: '$6.99', 
      category: 'sides', 
      popular: false, 
      tags: ['potato', 'vegetarian', 'creamy']
    },
    { 
      id: 1907, 
      name: { 
        en: 'Fries',
        ar: 'بطاطس مقلية',
        fa: 'سیب‌زمینی سرخ‌کردنی',
        ku: 'پەتاتەی سوورکراو',
        tr: 'Patates Kızartması',
        ur: 'فرائیز',
        kmr: 'Kartolên Sorkirî',
        es: 'Papas Fritas',
        ru: 'Картофель фри',
        hi: 'फ्रेंच फ्राइज़',
        sq: 'Patate të Skuqura',
        fr: 'Frites',
        de: 'Pommes Frites',
        bn: 'ফ্রাইজ',
        ko: '프렌치 프라이'
      }, 
      price: '$6.99', 
      category: 'sides', 
      popular: true, 
      tags: ['potato', 'fried'],
      imageUrl: '/Fries.jpg' 
    },
    { 
      id: 1908, 
      name: { 
        en: 'Side Salad',
        ar: 'سلطة جانبية',
        fa: 'سالاد کنارى',
        ku: 'سالادی لاوەکی',
        tr: 'Yan Salata',
        ur: 'سائیڈ سلاد',
        kmr: 'Salata Alî',
        es: 'Ensalada de Acompañamiento',
        ru: 'Салат гарнир',
        hi: 'साइड सलाद',
        sq: 'Sallatë Anësore',
        fr: 'Salade d\'Accompagnement',
        de: 'Beilagensalat',
        bn: 'সাইড সালাদ',
        ko: '사이드 샐러드'
      }, 
      price: '$7.99', 
      category: 'sides', 
      popular: false, 
      tags: ['salad', 'fresh', 'vegetarian'],
      imageUrl: '/Greek Salad.jpg' 
    },

    // DRINKS (COLD)
    { 
      id: 2001, 
      name: { 
        en: 'Water',
        ar: 'ماء',
        fa: 'آب',
        ku: 'ئاو',
        tr: 'Su',
        ur: 'پانی',
        kmr: 'Av',
        es: 'Agua',
        ru: 'Вода',
        hi: 'पानी',
        sq: 'Ujë',
        fr: 'Eau',
        de: 'Wasser',
        bn: 'পানি',
        ko: '물'
      }, 
      description: { 
        en: 'Fresh bottled water.',
        ar: 'مياه معبأة طازجة.',
        fa: 'آب بطری تازه.',
        ku: 'ئاوی تازەی بۆتڵکراو.',
        tr: 'Taze şişe suyu.',
        ur: 'تازہ بوتل کا پانی۔',
        kmr: 'Ava şûşekirî ya taze.',
        es: 'Agua embotellada fresca.',
        ru: 'Свежая бутилированная вода.',
        hi: 'ताज़ा बोतलबंद पानी।',
        sq: 'Ujë i freskët në shishe.',
        fr: 'Eau embouteillée fraîche.',
        de: 'Frisches Flaschenwasser.',
        bn: 'তাজা বোতলজাত পানি।',
        ko: '신선한 생수.'
      }, 
      price: '$1.49', 
      category: 'drinks_cold', 
      tags: [] 
    },
    { 
      id: 2002, 
      name: { 
        en: 'Sparkling Water',
        ar: 'مياه فوارة',
        fa: 'آب گازدار',
        ku: 'ئاوی گازدار',
        tr: 'Soda',
        ur: 'چمکتا پانی',
        kmr: 'Ava Gazdar',
        es: 'Agua Gasificada',
        ru: 'Газированная вода',
        hi: 'स्पार्कलिंग वॉटर',
        sq: 'Ujë me Gaz',
        fr: 'Eau Pétillante',
        de: 'Sprudelwasser',
        bn: 'স্পার্কলিং ওয়াটার',
        ko: '탄산수'
      }, 
      description: { 
        en: 'Refreshing sparkling water.',
        ar: 'مياه فوارة منعشة.',
        fa: 'آب گازدار خنک‌کننده.',
        ku: 'ئاوی گازداری ئارامبەخش.',
        tr: 'Ferahlatıcı soda.',
        ur: 'تروتازہ چمکتا پانی۔',
        kmr: 'Ava gazdar a vedişe.',
        es: 'Agua gasificada refrescante.',
        ru: 'Освежающая газированная вода.',
        hi: 'ताज़गी देने वाला स्पार्कलिंग वॉटर।',
        sq: 'Ujë me gaz freskues.',
        fr: 'Eau pétillante rafraîchissante.',
        de: 'Erfrischendes Mineralwasser.',
        bn: 'সতেজকারী স্পার্কলিং ওয়াটার।',
        ko: '시원한 탄산수.'
      }, 
      price: '$3.99', 
      category: 'drinks_cold', 
      tags: [] 
    },
    { 
      id: 2003, 
      name: { 
        en: 'Soda',
        ar: 'مشروب غازي',
        fa: 'نوشابه',
        ku: 'خواردنەوەی گازدار',
        tr: 'Gazlı İçecek',
        ur: 'سوڈا',
        kmr: 'Vexwarinê Gazdar',
        es: 'Refresco',
        ru: 'Газировка',
        hi: 'सोडा',
        sq: 'Pije me Gaz',
        fr: 'Soda',
        de: 'Limonade',
        bn: 'সোডা',
        ko: '탄산음료'
      }, 
      description: { 
        en: 'Choice of Coke, Diet Coke, Coke Zero, Sprite, Fanta, Ginger Ale, or Minute Maid.',
        ar: 'اختيار من كوكا كولا، دايت كوك، كوك زيرو، سبرايت، فانتا، جنجر ايل، أو مينيت مايد.',
        fa: 'انتخاب از کوکا کولا، دایت کوک، کوک زرو، اسپرایت، فانتا، زنجبیل ایل یا مینیت مید.',
        ku: 'هەڵبژاردن لە کۆکا کۆلا، دایەت کۆک، کۆک زیرۆ، سپرایت، فانتا، زەنجەفیل ئەیل، یان مینت مەید.',
        tr: 'Kola, Diyet Kola, Kola Zero, Sprite, Fanta, Ginger Ale veya Minute Maid seçimi.',
        ur: 'کوک، ڈائٹ کوک، کوک زیرو، سپرائٹ، فانٹا، جنجر ایل یا منٹ میڈ کا انتخاب۔',
        kmr: 'Hilbijartina Koke, Diet Koke, Koke Zero, Sprite, Fanta, Ginger Ale, an Minute Maid.',
        es: 'Elección de Coca Cola, Coca Cola Light, Coca Cola Zero, Sprite, Fanta, Ginger Ale o Minute Maid.',
        ru: 'Выбор из Кока-Колы, Диет-Коки, Кока-Кола Зеро, Спрайта, Фанты, Имбирного эля или Минут Мейд.',
        hi: 'कोक, डाइट कोक, कोक जीरो, स्प्राइट, फैंटा, जिंजर एले या मिनट मेड का विकल्प।',
        sq: 'Zgjidhje ndërmjet Koka Kola, Diet Koka, Koka Zero, Sprite, Fanta, Ginger Ale ose Minute Maid.',
        fr: 'Choix de Coca-Cola, Coca Light, Coca Zéro, Sprite, Fanta, Ginger Ale ou Minute Maid.',
        de: 'Auswahl aus Coca Cola, Diet Coke, Coke Zero, Sprite, Fanta, Ginger Ale oder Minute Maid.',
        bn: 'কোক, ডায়েট কোক, কোক জিরো, স্প্রাইট, ফ্যান্টা, জিঞ্জার অ্যাল বা মিনিট মেইড এর পছন্দ।',
        ko: '콜라, 다이어트 콜라, 콜라 제로, 스프라이트, 판타, 진저 에일 또는 미닛 메이드 중 선택.'
      }, 
      price: '$2.99', 
      category: 'drinks_cold', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 2004, 
      name: { 
        en: 'Erbil Yogurt Drink',
        ar: 'مشروب اللبن أربيل',
        fa: 'نوشیدنی ماست اربیل',
        ku: 'خواردنەوەی مۆستی هەولێر',
        tr: 'Erbil Yoğurt İçeceği',
        ur: 'اربیل یوگرٹ ڈرنک',
        kmr: 'Vexwarinê Mastê Hewlêr',
        es: 'Bebida de Yogur de Erbil',
        ru: 'Йогуртный напиток Эрбиль',
        hi: 'एर्बिल योगर्ट ड्रिंक',
        sq: 'Pije Kosi Erbil',
        fr: 'Boisson au Yaourt d\'Erbil',
        de: 'Erbil Joghurt-Getränk',
        bn: 'এরবিল দই পানীয়',
        ko: '어빌 요거트 드링크'
      }, 
      description: { 
        en: 'Traditional yogurt drink from Erbil.',
        ar: 'مشروب لبن تقليدي من أربيل.',
        fa: 'نوشیدنی سنتی ماست از اربیل.',
        ku: 'خواردنەوەی مۆستی نەریتی لە هەولێرەوە.',
        tr: 'Erbil\'den geleneksel yoğurt içeceği.',
        ur: 'اربیل سے روایتی یوگرٹ ڈرنک۔',
        kmr: 'Vexwarinê mastê kevneşopî ji Hewlêrê.',
        es: 'Bebida tradicional de yogur de Erbil.',
        ru: 'Традиционный йогуртовый напиток из Эрбиля.',
        hi: 'एर्बिल से पारंपरिक दही का पेय।',
        sq: 'Pije tradicionale kosi nga Erbil.',
        fr: 'Boisson traditionnelle au yaourt d\'Erbil.',
        de: 'Traditionelles Joghurtgetränk aus Erbil.',
        bn: 'এরবিল থেকে ঐতিহ্যবাহী দই পানীয়।',
        ko: '에르빌의 전통 요거트 음료.'
      }, 
      price: '$3.99', 
      category: 'drinks_cold', 
      image: '/Erbil Yogurt Drink.jpg',
      tags: [] 
    },
    { 
      id: 2005, 
      name: { 
        en: 'House Special Mint Lemonade',
        ar: 'عصير الليمون بالنعناع الخاص بالمنزل',
        fa: 'لیموناد نعنایی ویژه خانه',
        ku: 'شەربەتی لیمۆی نعناعی تایبەتی ماڵەوە',
        tr: 'Ev Özel Nane Limonatası',
        ur: 'گھر کی خاص پودینہ لیمونیڈ',
        kmr: 'Limonataya Pûngê ya Taybet a Malê',
        es: 'Limonada de Menta Especial de la Casa',
        ru: 'Фирменный мятный лимонад',
        hi: 'हाउस स्पेशल मिंट लेमोनेड',
        sq: 'Limonadë Mendhe Speciale e Shtëpisë',
        fr: 'Limonade à la Menthe Spécialité Maison',
        de: 'Haus-Spezial Minz-Limonade',
        bn: 'হাউস স্পেশাল মিন্ট লেমোনেড',
        ko: '하우스 스페셜 민트 레모네이드',
        sq: 'Limonadë me Mente Speciale e Shtëpisë',
        fr: 'Limonade à la Menthe Spéciale Maison',
        de: 'Hausgemachte Spezial-Minz-Limonade',
        bn: 'হাউস স্পেশাল পুদিনা লেমোনেড',
        ko: '하우스 스페셜 민트 레모네이드'
      }, 
      price: '$4.99', 
      category: 'drinks_cold', 
      popular: false, 
      tags: ['mint', 'lemon', 'refreshing'],
      image: '/House Special Mint Lemonade.jpg' 
    },

    // DRINKS (HOT)
    { 
      id: 2101, 
      name: { 
        en: 'Arabic Coffee',
        ar: 'قهوة عربية',
        fa: 'قهوه عربی',
        ku: 'قاوەی عەرەبی',
        tr: 'Arap Kahvesi',
        ur: 'عربی کافی',
        kmr: 'Qehweya Erebî',
        es: 'Café Árabe',
        ru: 'Арабский кофе',
        hi: 'अरबी कॉफी',
        sq: 'Kafe Arabe',
        fr: 'Café Arabe',
        de: 'Arabischer Kaffee',
        bn: 'আরবি কফি',
        ko: '아라비아 커피'
      }, 
      description: { 
        en: 'Traditional Arabic coffee with cardamom.',
        ar: 'قهوة عربية تقليدية مع الهيل.',
        fa: 'قهوه عربی سنتی با هل.',
        ku: 'قاوەی عەرەبی نەریتی لەگەڵ هەڵ.',
        tr: 'Kakule ile geleneksel Arap kahvesi.',
        ur: 'الائچی کے ساتھ روایتی عربی کافی۔',
        kmr: 'Qehweya Erebî ya kevneşopî bi hêl.',
        es: 'Café árabe tradicional con cardamomo.',
        ru: 'Традиционный арабский кофе с кардамоном.',
        hi: 'इलायची के साथ पारंपरिक अरबी कॉफी।',
        sq: 'Kafe tradicionale arabe me hil.',
        fr: 'Café arabe traditionnel à la cardamome.',
        de: 'Traditioneller arabischer Kaffee mit Kardamom.',
        bn: 'এলাচের সাথে ঐতিহ্যবাহী আরবি কফি।',
        ko: '카다몬이 들어간 전통 아라비아 커피.'
      }, 
      price: '$3.49', 
      category: 'drinks_hot', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 2102, 
      name: { 
        en: 'Kurdish Qazwan Coffee',
        ar: 'قهوة كردية قزوان',
        fa: 'قهوه کردی قزوان',
        ku: 'قاوەی کوردی قەزوان',
        tr: 'Kürt Qazwan Kahvesi',
        ur: 'کردی قزوان کافی',
        kmr: 'Qehweya Kurdî Qazwan',
        es: 'Café Kurdo Qazwan',
        ru: 'Курдский кофе Казван',
        hi: 'कुर्दी काज़वान कॉफी',
        sq: 'Kafe Kurde Qazwan',
        fr: 'Café Kurde Qazwan',
        de: 'Kurdischer Qazwan Kaffee',
        bn: 'কুর্দি কাজওয়ান কফি',
        ko: '쿠르드 카즈완 커피'
      }, 
      description: { 
        en: 'Traditional Kurdish coffee blend.',
        ar: 'خليط قهوة كردية تقليدية.',
        fa: 'ترکیب سنتی قهوه کردی.',
        ku: 'تێکەڵەی نەریتی قاوەی کوردی.',
        tr: 'Geleneksel Kürt kahve karışımı.',
        ur: 'روایتی کردی کافی کا ملاپ۔',
        kmr: 'Tevahiya kevneşopî ya qehweya Kurdî.',
        es: 'Mezcla tradicional de café kurdo.',
        ru: 'Традиционная курдская кофейная смесь.',
        hi: 'पारंपरिक कुर्दी कॉफी मिश्रण।',
        sq: 'Përzierje tradicionale kafe kurde.',
        fr: 'Mélange traditionnel de café kurde.',
        de: 'Traditionelle kurdische Kaffeemischung.',
        bn: 'ঐতিহ্যবাহী কুর্দি কফি মিশ্রণ।',
        ko: '전통 쿠르드 커피 블렌드.'
      }, 
      price: '$3.49', 
      category: 'drinks_hot', 
      tags: [] 
    },
    { 
      id: 2103, 
      name: { 
        en: 'Turkish Pistachio Coffee',
        ar: 'قهوة تركية بالفستق',
        fa: 'قهوه ترکی با پسته',
        ku: 'قاوەی تورکی لەگەڵ فستق',
        tr: 'Türk Fıstıklı Kahve',
        ur: 'ترکی پستے کی کافی',
        kmr: 'Qehweya Tirkî bi Fistiq',
        es: 'Café Turco con Pistacho',
        ru: 'Турецкий кофе с фисташками',
        hi: 'तुर्की पिस्ता कॉफी',
        sq: 'Kafe Turke me Fistik',
        fr: 'Café Turc à la Pistache',
        de: 'Türkischer Pistazienkaffee',
        bn: 'তুর্কি পেস্তা কফি',
        ko: '터키 피스타치오 커피'
      }, 
      description: { 
        en: 'Turkish coffee with pistachio flavor.',
        ar: 'قهوة تركية بنكهة الفستق.',
        fa: 'قهوه ترکی با طعم پسته.',
        ku: 'قاوەی تورکی بە تامی فستق.',
        tr: 'Fıstık aromalı Türk kahvesi.',
        ur: 'پستے کے ذائقے والی ترکی کافی۔',
        kmr: 'Qehweya Tirkî bi tama fistiqê.',
        es: 'Café turco con sabor a pistacho.',
        ru: 'Турецкий кофе со вкусом фисташки.',
        hi: 'फिस्ते के स्वाद वाली तुर्की कॉफी।',
        sq: 'Kafe turke me shije fistiku.',
        fr: 'Café turc au goût de pistache.',
        de: 'Türkischer Kaffee mit Pistaziengeschmack.',
        bn: 'পেস্তার স্বাদযুক্ত তুর্কি কফি।',
        ko: '피스타치오 맛 터키 커피.'
      }, 
      price: '$3.49', 
      category: 'drinks_hot', 
      tags: [] 
    },
    { 
      id: 2104, 
      name: { 
        en: 'Karak Chai',
        ar: 'شاي كرك',
        fa: 'چای کرک',
        ku: 'چایی کەرەک',
        tr: 'Karak Çayı',
        ur: 'کرک چائے',
        kmr: 'Çaya Karak',
        es: 'Té Karak',
        ru: 'Карак чай',
        hi: 'करक चाय',
        sq: 'Çaj Karak',
        fr: 'Thé Karak',
        de: 'Karak Tee',
        bn: 'কারাক চা',
        ko: '카라크 차이'
      }, 
      description: { 
        en: 'Spiced tea with milk and cardamom.',
        ar: 'شاي بالتوابل مع الحليب والهيل.',
        fa: 'چای ادویه‌دار با شیر و هل.',
        ku: 'چایی بەهاراتدار لەگەڵ شیر و هەڵ.',
        tr: 'Süt ve kakule ile baharatlı çay.',
        ur: 'دودھ اور الائچی کے ساتھ مصالحہ دار چائے۔',
        kmr: 'Çaya baharatdar bi şîr û hêl.',
        es: 'Té especiado con leche y cardamomo.',
        ru: 'Пряный чай с молоком и кардамоном.',
        hi: 'दूध और इलायची के साथ मसालेदार चाय।',
        sq: 'Çaj me erëza me qumësht dhe hil.',
        fr: 'Thé épicé au lait et à la cardamome.',
        de: 'Gewürztee mit Milch und Kardamom.',
        bn: 'দুধ এবং এলাচের সাথে মসলাযুক্ত চা।',
        ko: '우유와 카다몬이 들어간 향신료 차.'
      }, 
      price: '$2.99', 
      category: 'drinks_hot', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 2105, 
      name: { 
        en: 'Persian Tea',
        ar: 'شاي فارسي',
        fa: 'چای فارسی',
        ku: 'چایی فارسی',
        tr: 'Fars Çayı',
        ur: 'فارسی چائے',
        kmr: 'Çaya Farsî',
        es: 'Té Persa',
        ru: 'Персидский чай',
        hi: 'फारसी चाय',
        sq: 'Çaj Persi',
        fr: 'Thé Persan',
        de: 'Persischer Tee',
        bn: 'পারস্য চা',
        ko: '페르시아 차',
        ku: 'چایی فارسی',
        tr: 'Fars Çayı',
        ur: 'فارسی چائے',
        kmr: 'Çaya Farsî',
        es: 'Té Persa',
        ru: 'Персидский чай',
        hi: 'फारसी चाय',
        sq: 'Çaj Persian',
        fr: 'Thé Persan',
        bn: 'ফার্সি চা',
        ko: '페르시아 차'
      }, 
      description: { 
        en: 'Traditional Persian black tea.',
        ar: 'شاي أسود فارسي تقليدي.',
        fa: 'چای سیاه سنتی فارسی.',
        ku: 'چایی ڕەشی نەریتی فارسی.',
        tr: 'Geleneksel Fars siyah çayı.',
        ur: 'روایتی فارسی کالی چائے۔',
        kmr: 'Çaya reş a kevneşopî ya Farsî.',
        es: 'Té negro tradicional persa.',
        ru: 'Традиционный персидский чёрный чай.',
        hi: 'पारंपरिक फारसी काली चाय।',
        sq: 'Çaj i zi tradicional persian.',
        fr: 'Thé noir persan traditionnel.',
        de: 'Traditioneller persischer schwarzer Tee.',
        bn: 'ঐতিহ্যবাহী ফার্সি কালো চা।',
        ko: '전통 페르시아 홍차.'
      }, 
      price: '$2.49', 
      category: 'drinks_hot', 
      tags: [] 
    },

    // DESSERTS
    { 
      id: 2201, 
      name: { 
        en: 'Baklava',
        ar: 'بقلاوة',
        fa: 'باقلوا',
        ku: 'بەقلاوا',
        tr: 'Baklava',
        ur: 'بقلاوہ',
        kmr: 'Beqlawa',
        es: 'Baklava',
        ru: 'Баклава',
        hi: 'बकलावा',
        sq: 'Bakllava',
        fr: 'Baklava',
        bn: 'বাকলাভা',
        ko: '바클라바'
      }, 
      description: { 
        en: 'A sweet pastry with layers of nuts and honey.',
        ar: 'معجنات حلوة مع طبقات من المكسرات والعسل.',
        fa: 'شیرینی خمیری با لایه‌هایی از آجیل و عسل.',
        ku: 'شیرینییەکی خەمیری لەگەڵ چینە چینە گوێز و هەنگوین.',
        tr: 'Fındık ve bal katmanları ile tatlı hamur işi.',
        ur: 'گری اور شہد کی تہوں کے ساتھ میٹھی پیسٹری۔',
        kmr: 'Pîrokek şîrîn bi çînên gûz û hingivê.',
        es: 'Dulce hojaldre con capas de nueces y miel.',
        ru: 'Сладкое пирожное со слоями орехов и мёда.',
        hi: 'नट्स और शहद की परतों के साथ मीठी पेस्ट्री।',
        sq: 'Ëmbëlsirë me shtresa arrash dhe mjalti.',
        fr: 'Pâtisserie sucrée aux couches de noix et de miel.',
        de: 'Süßes Gebäck mit Nuss- und Honigschichten.',
        bn: 'বাদাম এবং মধুর স্তর সহ মিষ্টি পেস্ট্রি।',
        ko: '견과류와 꿀이 층층이 들어간 달콤한 페이스트리.'
      }, 
      price: '$7.99', 
      category: 'dessert', 
      popular: true, 
      image: '/baklava.jpg',
      tags: [] 
    },
    { 
      id: 2206, 
      name: { 
        en: 'Baklava w/ Saffron Ice Cream',
        ar: 'بقلاوة مع آيس كريم الزعفران',
        fa: 'باقلوا با بستنی زعفرانی',
        ku: 'بەقلاوا لەگەڵ بەستەنی زەعفەران',
        tr: 'Safran Dondurmalu Baklava',
        ur: 'زعفران آئس کریم کے ساتھ بقلاوہ',
        kmr: 'Beqlawa bi Qeşa Zeferanî',
        es: 'Baklava con Helado de Azafrán',
        ru: 'Баклава с шафрановым мороженым',
        hi: 'केसर आइस क्रीम के साथ बकलावा',
        sq: 'Bakllava me Akullore Shafrani',
        fr: 'Baklava avec Glace au Safran',
        de: 'Baklava mit Safran-Eis',
        bn: 'জাফরান আইসক্রিম সহ বাকলাভা',
        ko: '사프란 아이스크림을 곁들인 바클라바'
      }, 
      description: { 
        en: 'Traditional baklava served with aromatic saffron ice cream.',
        ar: 'بقلاوة تقليدية تُقدم مع آيس كريم الزعفران العطري.',
        fa: 'باقلوای سنتی همراه با بستنی معطر زعفرانی.',
        ku: 'بەقلاوای نەریتی لەگەڵ بەستەنی بۆنخۆشی زەعفەران.',
        tr: 'Aromatik safran dondurması ile servis edilen geleneksel baklava.',
        ur: 'خوشبودار زعفران آئس کریم کے ساتھ روایتی بقلاوہ۔',
        kmr: 'Beqlawa kevneşopî bi qeşa bêhnxweş a zeferanî.',
        es: 'Baklava tradicional servido con helado aromático de azafrán.',
        ru: 'Традиционная баклава с ароматным шафрановым мороженым.',
        hi: 'सुगंधित केसर आइस क्रीम के साथ पारंपरिक बकलावा।',
        sq: 'Bakllava tradicionale e shërbyer me akullore aromatike shafrani.',
        fr: 'Baklava traditionnel servi avec une glace au safran aromatique.',
        de: 'Traditionelle Baklava serviert mit aromatischem Safran-Eis.',
        bn: 'সুগন্ধি জাফরান আইসক্রিমের সাথে ঐতিহ্যবাহী বাকলাভা।',
        ko: '향긋한 사프란 아이스크림과 함께 제공되는 전통 바클라바.'
      }, 
      price: '$10.99', 
      category: 'dessert', 
      image: '/Baklava with Saffron Ice Cream.jpg',
      tags: [] 
    },
    { 
      id: 2202, 
      name: { 
        en: 'Tiramisu',
        ar: 'تيراميسو',
        fa: 'تیرامیسو',
        ku: 'تیرامیسو',
        tr: 'Tiramisu',
        ur: 'تیرامیسو',
        kmr: 'Tiramisu',
        es: 'Tiramisú',
        ru: 'Тирамису',
        hi: 'तिरामिसू',
        sq: 'Tiramisu',
        fr: 'Tiramisu',
        bn: 'তিরামিসু',
        ko: '티라미수'
      }, 
      description: { 
        en: 'Sweetened whipped cream and a rich mascarpone.',
        ar: 'كريمة مخفوقة محلاة وماسكاربوني غني.',
        fa: 'خامه فرم زده شیرین شده و ماسکارپونه غنی.',
        ku: 'کرێمی لێدراوی شیرین و ماسکارپۆنێی دەوڵەمەند.',
        tr: 'Tatlandırılmış krem şanti ve zengin mascarpone.',
        ur: 'میٹھا وہپڈ کریم اور بھرپور ماسکارپونے۔',
        kmr: 'Krêma şîrîn a lêdayî û maskarponeya dewlemend.',
        es: 'Crema dulce batida y rico mascarpone.',
        ru: 'Сладкие взбитые сливки и богатый маскарпоне.',
        hi: 'मीठी व्हिप्ड क्रीम और समृद्ध मस्कारपोने।',
        sq: 'Krem i rrugur i ëmbël dhe mascarpone e pasur.',
        fr: 'Crème fouettée sucrée et mascarpone riche.',
        de: 'Gesüßte Schlagsahne und reichhaltiger Mascarpone.',
        bn: 'মিষ্টি হুইপড ক্রিম এবং সমৃদ্ধ মাসকারপোনে।',
        ko: '달콤한 휘핑크림과 진한 마스카르포네.'
      }, 
      price: '$6.99', 
      category: 'dessert', 
      popular: true, 
      image: '/Tiramisu.jpg',
      tags: [] 
    },
    { 
      id: 2203, 
      name: { 
        en: 'Khash Khash',
        ar: 'خاش خاش',
        fa: 'خاش خاش',
        ku: 'خاش خاش',
        tr: 'Haş Haş',
        ur: 'خاش خاش',
        kmr: 'Xaş Xaş',
        es: 'Xash Xash',
        ru: 'Хаш Хаш',
        hi: 'खाश खाश',
        sq: 'Khash Khash',
        fr: 'Khash Khash',
        bn: 'খাশ খাশ',
        ko: '카시 카시'
      }, 
      description: { 
        en: 'A delicious dessert with layers of cream and crunchy vermicelli.',
        ar: 'حلوى لذيذة مع طبقات من الكريمة والشعيرية المقرمشة.',
        fa: 'دسری خوشمزه با لایه‌هایی از خامه و ورمیشل ترد.',
        ku: 'شیرینییەکی خۆشتام لەگەڵ چینە چینە کرێم و ڤێرمیشێلی ترسکە.',
        tr: 'Krema katmanları ve çıtır şehriye ile lezzetli tatlı.',
        ur: 'کریم اور کرنچی ورمیسیلی کی تہوں کے ساتھ لذیذ میٹھا۔',
        kmr: 'Şîrîniyeke bi tam bi çînên krêmê û vermîşelî yê çitir.',
        es: 'Postre delicioso con capas de crema y fideos crujientes.',
        ru: 'Восхитительный десерт со слоями крема и хрустящей вермишели.',
        hi: 'क्रीम और कुरकुरे वर्मीसेली की परतों के साथ स्वादिष्ट मिठाई।',
        sq: 'Ëmbëlsirë e shijshme me shtresa kremi dhe makarona të krisura.',
        fr: 'Dessert délicieux avec des couches de crème et de vermicelles croquants.',
        de: 'Köstliches Dessert mit Schichten aus Sahne und knuspriger Fadennudeln.',
        bn: 'ক্রিম এবং কুড়কুড়ে ভার্মিসেলির স্তর সহ সুস্বাদু মিষ্টি।',
        ko: '크림과 바삭한 버미첼리가 층층이 들어간 맛있는 디저트.'
      }, 
      price: '$6.99', 
      category: 'dessert', 
      image: '/Khash Khash.jpg',
      tags: [] 
    },
    { 
      id: 2204, 
      name: { 
        en: 'Oven Rice Pudding',
        ar: 'مهلبية الأرز بالفرن',
        fa: 'شیر برنج فر',
        ku: 'مەحلەبی برنجی فڕن',
        tr: 'Fırın Sütlaç',
        ur: 'اوون رائس پڈنگ',
        kmr: 'Pudînga Brincê ya Firînê',
        es: 'Pudín de Arroz al Horno',
        ru: 'Печёный рисовый пудинг',
        hi: 'ओवन राइस पुडिंग',
        sq: 'Puding Orizi në Furrë',
        fr: 'Pudding de Riz au Four',
        bn: 'ওভেন রাইস পুডিং',
        ko: '오븐 쌀 푸딩'
      }, 
      description: { 
        en: 'Creamy Middle Eastern milk pudding.',
        ar: 'مهلبية حليب كريمية من الشرق الأوسط.',
        fa: 'پودینگ شیر خامه‌ای خاورمیانه.',
        ku: 'مەحلەبی شیری کرێمی ڕۆژهەڵاتی ناوین.',
        tr: 'Kremalı Orta Doğu süt tatlısı.',
        ur: 'کریمی مشرق وسطیٰ کا دودھ پڈنگ۔',
        kmr: 'Pudînga şîrê krêmî ya Rojhilatê Navîn.',
        es: 'Pudín cremoso de leche del Medio Oriente.',
        ru: 'Кремовый ближневосточный молочный пудинг.',
        hi: 'क्रीमी मध्य पूर्वी दूध पुडिंग।',
        sq: 'Puding kremoz qumështi i Lindjes së Mesme.',
        fr: 'Pudding lacté crémeux du Moyen-Orient.',
        de: 'Cremiger nahöstlicher Milchpudding.',
        bn: 'ক্রিমি মধ্যপ্রাচ্যের দুধের পুডিং।',
        ko: '크림 같은 중동 우유 푸딩.'
      }, 
      price: '$6.99', 
      category: 'dessert', 
      image: '/Oven Rice Pudding.jpg',
      tags: [] 
    },
    { 
      id: 2205, 
      name: { 
        en: 'Ice Cream',
        ar: 'آيس كريم',
        fa: 'بستنی',
        ku: 'بەستەنی',
        tr: 'Dondurma',
        ur: 'آئس کریم',
        kmr: 'Qeşa',
        es: 'Helado',
        ru: 'Мороженое',
        hi: 'आइस क्रीम',
        sq: 'Akullore',
        fr: 'Glace',
        de: 'Eis',
        bn: 'আইসক্রিম',
        ko: '아이스크림'
      }, 
      description: { 
        en: 'Choose from 3 flavors: Strawberry, Chocolate, Vanilla.',
        ar: 'اختر من 3 نكهات: فراولة، شوكولاتة، فانيليا.',
        fa: 'از ۳ طعم انتخاب کنید: توت‌فرنگی، شکلات، وانیل.',
        ku: 'لە ٣ تامە هەڵبژێرە: فرۆولا، شۆکولات، ڤانیلیا.',
        tr: '3 aromadan seçin: Çilek, Çikolata, Vanilya.',
        ur: '3 ذائقوں میں سے انتخاب کریں: اسٹرابیری، چاکلیٹ، ونیلا۔',
        kmr: 'Ji 3 taman hilbijêre: Çilek, Çîkolata, Vanîlya.',
        es: 'Elige entre 3 sabores: Fresa, Chocolate, Vainilla.',
        ru: 'Выберите из 3 вкусов: Клубника, Шоколад, Ваниль.',
        hi: '3 स्वादों में से चुनें: स्ट्रॉबेरी, चॉकलेट, वेनिला।',
        sq: 'Zgjidhni nga 3 shijet: Luleshtrydhe, Çokollatë, Vanilë.',
        fr: 'Choisissez parmi 3 parfums : Fraise, Chocolat, Vanille.',
        de: 'Wählen Sie aus 3 Geschmacksrichtungen: Erdbeere, Schokolade, Vanille.',
        bn: '৩টি স্বাদ থেকে বেছে নিন: স্ট্রবেরি, চকলেট, ভ্যানিলা।',
        ko: '3가지 맛 중에서 선택하세요: 딸기, 초콜릿, 바닐라.'
      }, 
      price: '$2.99', 
      category: 'dessert', 
      popular: true, 
      image: '/Saffron Ice Cream.jpg',
      tags: [], 
      variants: ['singleScoop'],
      servingFor: { singleScoop: '1' } 
    },
    { 
      id: 2207, 
      name: { 
        en: 'Pistachio Cake',
        ar: 'كعكة الفستق',
        fa: 'کیک پسته',
        ku: 'کێکی فیستق',
        tr: 'Antep Fıstıklı Kek',
        ur: 'پستہ کیک',
        kmr: 'Kêka Fistiqê',
        es: 'Pastel de Pistacho',
        ru: 'Фисташковый торт',
        hi: 'पिस्ता केक',
        sq: 'Tortë me Pistacio',
        fr: 'Gâteau à la Pistache',
        de: 'Pistazien-Kuchen',
        bn: 'পেস্তা কেক',
        ko: '피스타치오 케이크'
      }, 
      description: { 
        en: 'Moist and flavorful cake made with premium pistachios.',
        ar: 'كعكة رطبة ولذيذة مصنوعة من الفستق الممتاز.',
        fa: 'کیک مرطوب و خوشمزه تهیه شده با پسته درجه یک.',
        ku: 'کێکێکی نەمی خۆشتام دروستکراو لە فیستقی باش.',
        tr: 'Premium Antep fıstığı ile yapılmış nemli ve lezzetli kek.',
        ur: 'اعلیٰ قسم کے پستے سے بنا نمدار اور لذیذ کیک۔',
        kmr: 'Kêka nem û bi tam a bi fistiqên kalîteyê pêk hatî.',
        es: 'Pastel húmedo y sabroso hecho con pistachos premium.',
        ru: 'Влажный и ароматный торт из отборных фисташек.',
        hi: 'प्रीमियम पिस्ता से बना नम और स्वादिष्ट केक।',
        sq: 'Tortë e lagësht dhe e shijshme e bërë me pistacio premium.',
        fr: 'Gâteau moelleux et savoureux aux pistaches premium.',
        de: 'Saftiger und aromatischer Kuchen aus Premium-Pistazien.',
        bn: 'প্রিমিয়াম পেস্তা দিয়ে তৈরি আর্দ্র এবং স্বাদযুক্ত কেক।',
        ko: '프리미엄 피스타치오로 만든 촉촉하고 맛있는 케이크.'
      }, 
      price: '$7.99', 
      category: 'dessert', 
      image: '/Pistachio Cake.jpg',
      tags: [] 
    },
    { 
      id: 2208, 
      name: { 
        en: 'Saffron Ice Cream (One Scoop)',
        ar: 'آيس كريم الزعفران (كرة واحدة)',
        fa: 'بستنی زعفرانی (یک اسکوپ)',
        ku: 'بەستەنی زەعفەران (یەک گۆپکە)',
        tr: 'Safran Dondurmasi (Tek Top)',
        ur: 'زعفران آئس کریم (ایک اسکوپ)',
        kmr: 'Qeşa Zeferanî (Yek Gop)',
        es: 'Helado de Azafrán (Una Bola)',
        ru: 'Шафрановое мороженое (Один шарик)',
        hi: 'केसर आइस क्रीम (एक स्कूप)',
        sq: 'Akullore Shafrani (Një Top)',
        fr: 'Glace au Safran (Une Boule)',
        de: 'Safran-Eis (Eine Kugel)',
        bn: 'জাফরান আইসক্রিম (এক স্কুপ)',
        ko: '사프란 아이스크림 (한 스쿱)',
        kmr: 'Qeşa Zeferanî (Yek Gop)',
        es: 'Helado de Azafrán (Una Bola)',
        ru: 'Шафрановое мороженое (Один шарик)',
        hi: 'केसर आइस क्रीम (एक स्कूप)',
        sq: 'Akullore Shafrani (Një Top)',
        fr: 'Glace au Safran (Une Boule)',
        de: 'Safran-Eis (Eine Kugel)',
        bn: 'জাফরান আইসক্রিম (এক স্কুপ)',
        ko: '사프란 아이스크림 (한 스쿱)'
      }, 
      description: { 
        en: 'Premium saffron-flavored ice cream, rich and aromatic.',
        ar: 'آيس كريم بنكهة الزعفران الممتاز، غني وعطري.',
        fa: 'بستنی طعم زعفران درجه یک، غنی و معطر.',
        ku: 'بەستەنی تامی زەعفەرانی باش، دەوڵەمەند و بۆنخۆش.',
        tr: 'Premium safran aromalı dondurma, zengin ve aromatik.',
        ur: 'اعلیٰ قسم کا زعفران ذائقہ آئس کریم، بھرپور اور خوشبودار۔',
        kmr: 'Qeşa bi tama zeferanî ya kalîteyê, dewlemend û bêhnxweş.',
        es: 'Helado premium con sabor a azafrán, rico y aromático.',
        ru: 'Премиальное шафрановое мороженое, насыщенное и ароматное.',
        hi: 'प्रीमियम केसर स्वाद आइस क्रीम, समृद्ध और सुगंधित।',
        sq: 'Akullore premium me shije shafrani, e pasur dhe aromatike.',
        fr: 'Glace premium au safran, riche et aromatique.',
        de: 'Premium Safran-Eis, reichhaltig und aromatisch.',
        bn: 'প্রিমিয়াম জাফরান-স্বাদযুক্ত আইসক্রিম, সমৃদ্ধ এবং সুগন্ধি।',
        ko: '프리미엄 사프란 맛 아이스크림, 풍부하고 향긋합니다.'
      }, 
      price: '$4.99', 
      category: 'dessert', 
      image: '/Saffron Ice Cream.jpg',
      tags: [] 
    },
    { 
      id: 2209, 
      name: { 
        en: 'Saffron Ice Cream (Two Scoops)',
        ar: 'آيس كريم الزعفران (كرتان)',
        fa: 'بستنی زعفرانی (دو اسکوپ)',
        ku: 'بەستەنی زەعفەران (دوو گۆپکە)',
        tr: 'Safran Dondurmasi (İki Top)',
        ur: 'زعفران آئس کریم (دو اسکوپ)',
        kmr: 'Qeşa Zeferanî (Du Gop)',
        es: 'Helado de Azafrán (Dos Bolas)',
        ru: 'Шафрановое мороженое (Два шарика)',
        hi: 'केसर आइस क्रीम (दो स्कूप)',
        sq: 'Akullore Shafrani (Dy Topa)',
        fr: 'Glace au Safran (Deux Boules)',
        de: 'Safran-Eis (Zwei Kugeln)',
        bn: 'জাফরান আইসক্রিম (দুই স্কুপ)',
        ko: '사프란 아이스크림 (두 스쿱)'
      }, 
      description: { 
        en: 'Double serving of our premium saffron-flavored ice cream.',
        ar: 'حصة مضاعفة من آيس كريم الزعفران الممتاز.',
        fa: 'سرو دوتایی از بستنی طعم زعفران درجه یک ما.',
        ku: 'پشکی دووانەی بەستەنی تامی زەعفەرانی باشمان.',
        tr: 'Premium safran aromalı dondurmamızın çift porsiyonu.',
        ur: 'ہماری اعلیٰ قسم کی زعفران آئس کریم کا ڈبل سرونگ۔',
        kmr: 'Porsiyone duanî ya qeşa me ya bi tama zeferanî ya kalîteyê.',
        es: 'Doble porción de nuestro helado premium de azafrán.',
        ru: 'Двойная порция нашего премиального шафранового мороженого.',
        hi: 'हमारी प्रीमियम केसर आइस क्रीम की दोहरी सर्विंग।',
        sq: 'Pjesë e dyfishtë e akullorës sonë premium me shije shafrani.',
        fr: 'Double portion de notre glace premium au safran.',
        de: 'Doppelte Portion unseres Premium Safran-Eises.',
        bn: 'আমাদের প্রিমিয়াম জাফরান আইসক্রিমের দ্বিগুণ পরিবেশন।',
        ko: '우리의 프리미엄 사프란 아이스크림의 더블 서빙.'
      }, 
      price: '$8.99', 
      category: 'dessert', 
      image: '/Saffron Ice Cream.jpg',
      tags: [] 
    },

    // SALADS
    { 
      id: 1101, 
      name: { 
        en: 'Greek Salad',
        ar: 'سلطة يونانية',
        fa: 'سالاد یونانی',
        ku: 'سالادی یۆنانی',
        tr: 'Yunan Salatası',
        ur: 'یونانی سلاد',
        kmr: 'Salata Yewnanî',
        es: 'Ensalada Griega',
        ru: 'Греческий салат',
        hi: 'ग्रीक सलाद',
        sq: 'Sallatë Greke',
        fr: 'Salade Grecque',
        de: 'Griechischer Salat',
        bn: 'গ্রিক সালাদ',
        ko: '그리스 샐러드'
      }, 
      description: { 
        en: 'A classic Greek salad made with spring mix, tomatoes, cucumbers, onions, Kalamata olives, Feta cheese and Greek vinaigrette.',
        ar: 'سلطة يونانية كلاسيكية مصنوعة من خليط الربيع، الطماطم، الخيار، البصل، زيتون كالاماتا، جبن الفيتا وتتبيلة يونانية.',
        fa: 'سالاد یونانی کلاسیک از مخلوط بهاری، گوجه‌فرنگی، خیار، پیاز، زیتون کالاماتا، پنیر فتا و سس یونانی.',
        ku: 'سالادی یۆنانی کلاسیک لە تێکەڵی بەهار، تەماتە، خیار، پیاز، زەیتونی کالاماتا، پەنیری فیتا و سۆسی یۆنانی.',
        tr: 'Bahar karışımı, domates, salatalık, soğan, Kalamata zeytini, Feta peyniri ve Yunan soslu klasik Yunan salatası.',
        ur: 'بہار کے مرکب، ٹماٹر، کھیرا، پیاز، کالاماٹا زیتون، فیٹا چیز اور یونانی ڈریسنگ سے بنا کلاسک یونانی سلاد۔',
        kmr: 'Salatayek Yewnanî ya klasîk ku ji tevahiya biharê, firangoş, xiyar, pîvaz, zeytûnên Kalamata, penîrê Feta û soşa Yewnanî tê çêkirin.',
        es: 'Ensalada griega clásica hecha con mezcla primaveral, tomates, pepinos, cebolla, aceitunas Kalamata, queso Feta y vinagreta griega.',
        ru: 'Классический греческий салат из весенней смеси, помидоров, огурцов, лука, оливок каламата, сыра фета и греческой заправки.',
        hi: 'स्प्रिंग मिक्स, टमाटर, खीरे, प्याज, कलामाटा जैतून, फेटा चीज़ और ग्रीक विनैग्रेट से बना क्लासिक ग्रीक सलाद।',
        sq: 'Sallatë klasike greke e bërë me përzierje pranverore, domate, kastravec, qepë, ullinj Kalamata, djathë Feta dhe vinegretë greke.',
        fr: 'Salade grecque classique préparée avec mélange printanier, tomates, concombres, oignons, olives Kalamata, fromage Feta et vinaigrette grecque.',
        de: 'Klassischer griechischer Salat mit Frühlings-Mix, Tomaten, Gurken, Zwiebeln, Kalamata-Oliven, Feta-Käse und griechischer Vinaigrette.',
        bn: 'স্প্রিং মিক্স, টমেটো, শসা, পেঁয়াজ, কালামাটা অলিভ, ফেটা চিজ এবং গ্রিক ভিনাইগ্রেট দিয়ে তৈরি ক্লাসিক গ্রিক সালাদ।',
        ko: '스프링 믹스, 토마토, 오이, 양파, 칼라마타 올리브, 페타 치즈, 그리스 비네그레트로 만든 클래식 그리스 샐러드입니다.'
      }, 
      image: '/Greek Salad.jpg',
      price: '$14.99', 
      category: 'salads', 
      popular: true, 
      tags: ['vegetarian'], 
      addOns: { 
        title: { 
          en: 'Add Protein',
          ar: 'إضافة بروتين',
          fa: 'اضافه کردن پروتین',
          ku: 'پرۆتین زیادبکە',
          tr: 'Protein Ekle',
          ur: 'پروٹین شامل کریں',
          kmr: 'Protein Zêde Bike',
          es: 'Agregar Proteína',
          ru: 'Добавить белок',
          hi: 'प्रोटीन जोड़ें',
          sq: 'Shto Proteinë',
          fr: 'Ajouter des Protéines',
          de: 'Protein hinzufügen',
          bn: 'প্রোটিন যোগ করুন'
        }, 
        options: [ 
          { name: { en: 'Beef', ar: 'لحم بقر', fa: 'گوشت گاو', ku: 'گۆشتی گا', tr: 'Dana Eti', ur: 'گائے کا گوشت', kmr: 'Goştê Ga', es: 'Carne de Res', ru: 'Говядина', hi: 'गोमांस', sq: 'Mish Viqi', fr: 'Bœuf', de: 'Rindfleisch' }, price: '$9.99' }, 
          { name: { en: 'Chicken', ar: 'دجاج', fa: 'مرغ', ku: 'مریشک', tr: 'Tavuk', ur: 'چکن', kmr: 'Mirîşk', es: 'Pollo', ru: 'Курица', hi: 'चिकन', sq: 'Pulë', fr: 'Poulet', de: 'Hähnchen' }, price: '$8.99' }, 
          { name: { en: 'Falafel', ar: 'فلافل', fa: 'فلافل', ku: 'فەلەفڵ', tr: 'Falafel', ur: 'فلافل', kmr: 'Falafel', es: 'Falafel', ru: 'Фалафель', hi: 'फلाफेल' }, price: '$4.99' }, 
          { name: { en: 'Shrimp', ar: 'روبيان', fa: 'میگو', ku: 'میگۆ', tr: 'Karides', ur: 'جھینگا', kmr: 'Mîgo', es: 'Camarones', ru: 'Креветки', hi: 'झींगा', sq: 'Karkaleca', fr: 'Crevettes', de: 'Garnelen' }, price: '$6.99' } 
        ] 
      } 
    },
    { 
      id: 1102, 
      name: { 
        en: 'Fattoush Salad',
        ar: 'سلطة فتوش',
        fa: 'سالاد فتوش',
        ku: 'سالادی فەتووش',
        tr: 'Fattuş Salatası',
        ur: 'فتوش سلاد',
        kmr: 'Salata Fetûş',
        es: 'Ensalada Fattoush',
        ru: 'Салат Фаттуш',
        hi: 'फत्तूश सलाद',
        sq: 'Sallatë Fattoush',
        fr: 'Salade Fattoush',
        de: 'Fattoush Salat',
        bn: 'ফাতুশ সালাদ',
        ko: '파투시 샐러드'
      }, 
      description: { 
        en: 'A delicious Middle Eastern salad made with lettuce, tomatoes, cucumbers, bell peppers, fresh mint, parsley, crispy pita bread, and pomegranate molasses dressing.',
        ar: 'سلطة شرق أوسطية لذيذة مصنوعة من الخس والطماطم والخيار والفلفل الحلو والنعناع الطازج والبقدونس وخبز البيتا المقرمش وصلصة دبس الرمان.',
        fa: 'سالاد لذیذ خاورمیانه‌ای از کاهو، گوجه‌فرنگی، خیار، فلفل دلمه‌ای، نعنای تازه، جعفری، نان پیتای ترد و سس انار.',
        ku: 'سالادێکی خۆشی ڕۆژهەڵاتی ناوەڕاست لە خس، تەماتە، خیار، بیبەری شیرین، پونگی تازە، جەعدە، نانی پیتای ترسکە و سۆسی هەنار.',
        tr: 'Marul, domates, salatalık, dolma biberi, taze nane, maydanoz, çıtır pita ekmeği ve nar ekşisi sosuyla yapılan lezzetli Orta Doğu salatası.',
        ur: 'لیٹوس، ٹماٹر، کھیرا، بیل پیپرز، تازہ پودینہ، دھنیا، کرسپی پیٹا بریڈ اور انار کے شیرے کی ڈریسنگ سے بنا لذیذ مشرق وسطیٰ کا سلاد۔',
        kmr: 'Salatayek bi tam a Rojhilatê Navîn ku ji salata kesk, firangoş, xiyar, biberên şîrîn, pûngê taze, şînî, nanê pita yê çitir û soşa henarê tê çêkirin.',
        es: 'Una deliciosa ensalada del Medio Oriente hecha con lechuga, tomates, pepinos, pimientos morrones, menta fresca, perejil, pan pita crujiente y aderezo de melaza de granada.',
        ru: 'Вкусный ближневосточный салат из салата, помидоров, огурцов, болгарского перца, свежей мяты, петрушки, хрустящего хлеба пита и заправки из гранатовой патоки.',
        hi: 'सलाद पत्ता, टमाटर, खीरे, बेल पेपर, ताज़ा पुदीना, अजमोद, कुरकुरी पीटा ब्रेड और अनार के शीरे की ड्रेसिंग से बना स्वादिष्ट मध्य पूर्वी सलाद।',
        sq: 'Sallatë e shijshme lindjes së mesme e bërë me marule, domate, kastravec, spec të ëmbël, mendër të freskët, majdanoz, bukë pita të krisur dhe salcë melase shege.',
        fr: 'Une délicieuse salade du Moyen-Orient préparée avec laitue, tomates, concombres, poivrons doux, menthe fraîche, persil, pain pita croustillant et vinaigrette à la mélasse de grenade.',
        de: 'Ein köstlicher nahöstlicher Salat aus Kopfsalat, Tomaten, Gurken, Paprika, frischer Minze, Petersilie, knusprigem Pita-Brot und Granatapfelmelasse-Dressing.',
        bn: 'লেটুস, টমেটো, শসা, বেল পেপার, তাজা পুদিনা, পার্সলে, কুরকুরে পিটা ব্রেড এবং ডালিমের মোলাসেস ড্রেসিং দিয়ে তৈরি সুস্বাদু মধ্যপ্রাচ্যের সালাদ।',
        ko: '상추, 토마토, 오이, 피망, 신선한 민트, 파슬리, 바삭한 피타 빵, 석류 당밀 드레싱으로 만든 맛있는 중동 샐러드입니다.'
      }, 
      image: '/Fattoush Salad.jpg',
      price: '$14.99', 
      category: 'salads', 
      popular: true, 
      image: '/Fattoush Salad.jpg',
      tags: ['vegetarian', 'vegan'], 
      addOns: { 
        title: { 
          en: 'Add Protein',
          ar: 'إضافة بروتين',
          fa: 'اضافه کردن پروتین',
          ku: 'پرۆتین زیادبکە',
          tr: 'Protein Ekle',
          ur: 'پروٹین شامل کریں',
          kmr: 'Protein Zêde Bike',
          es: 'Agregar Proteína',
          ru: 'Добавить белок',
          hi: 'प्रोटीन जोड़ें',
          sq: 'Shto Proteinë',
          fr: 'Ajouter des Protéines',
          de: 'Protein hinzufügen'
        }, 
        options: [ 
          { name: { en: 'Beef', ar: 'لحم بقر', fa: 'گوشت گاو', ku: 'گۆشتی گا', tr: 'Dana Eti', ur: 'گائے کا گوشت', kmr: 'Goştê Ga', es: 'Carne de Res', ru: 'Говядина', hi: 'गोमांस', sq: 'Mish Viqi', fr: 'Bœuf', de: 'Rindfleisch' }, price: '$9.99' }, 
          { name: { en: 'Chicken', ar: 'دجاج', fa: 'مرغ', ku: 'مریشک', tr: 'Tavuk', ur: 'چکن', kmr: 'Mirîşk', es: 'Pollo', ru: 'Курица', hi: 'चिकन', sq: 'Pulë', fr: 'Poulet', de: 'Hähnchen' }, price: '$8.99' }, 
          { name: { en: 'Shrimp', ar: 'روبيان', fa: 'میگو', ku: 'میگۆ', tr: 'Karides', ur: 'جھینگا', kmr: 'Mîgo', es: 'Camarones', ru: 'Креветки', hi: 'झींगा', sq: 'Karkaleca', fr: 'Crevettes', de: 'Garnelen' }, price: '$6.99' }, 
          { name: { en: 'Falafel', ar: 'فلافل', fa: 'فلافل', ku: 'فەلەفڵ', tr: 'Falafel', ur: 'فلافل', kmr: 'Falafel', es: 'Falafel', ru: 'Фалафель', hi: 'फलाफेल', sq: 'Falafel', fr: 'Falafel', de: 'Falafel' }, price: '$5.99' } 
        ] 
      } 
    },
    { 
      id: 1103, 
      name: { 
        en: 'Shwan Salad',
        ar: 'سلطة شيوان',
        fa: 'سالاد شیوان',
        ku: 'سالادی شیوان',
        tr: 'Şivan Salatası',
        ur: 'شیوان سلاد',
        kmr: 'Salata Şîvan',
        es: 'Ensalada Shivan',
        ru: 'Салат Шиван',
        hi: 'शिवान सलाद',
        sq: 'Sallatë Shiwan',
        fr: 'Salade Shiwan',
        de: 'Shwan Salat',
        bn: 'শিওয়ান সালাদ',
        ko: '시완 샐러드'
      }, 
      description: { 
        en: 'A refreshing Turkish salad made with tomatoes, cucumbers, green peppers, onions, parsley, and walnuts, seasoned with olive oil and lemon juice.',
        ar: 'سلطة تركية منعشة مصنوعة من الطماطم والخيار والفلفل الأخضر والبصل والبقدونس والجوز، متبلة بزيت الزيتون وعصير الليمون.',
        fa: 'سالاد ترکی تازه‌کننده از گوجه‌فرنگی، خیار، فلفل سبز، پیاز، جعفری و گردو، با روغن زیتون و آب لیمو طعم‌دار شده.',
        ku: 'سالادێکی ترکی ئارامبەخش لە تەماتە، خیار، بیبەری سەوز، پیاز، جەعدە و گوێز، بە زەیتی زەیتوون و شیری لیمۆ تامدراوە.',
        tr: 'Domates, salatalık, yeşil biber, soğan, maydanoz ve cevizle yapılan, zeytinyağı ve limon suyuyla tatlandırılmış ferahlatıcı Türk salatası.',
        ur: 'ٹماٹر، کھیرا، ہری مرچ، پیاز، دھنیا اور اخروٹ سے بنا تازگی بخش ترک سلاد، زیتون کے تیل اور لیموں کے رس سے ذائقہ دار۔',
        kmr: 'Salatayek Tirkî ya vevişandî ku ji firangoş, xiyar, biberê kesk, pîvaz, şînî û gihokan tê çêkirin, bi zeyta zeytûnê û ava lîmonê tatdar dike.',
        es: 'Una refrescante ensalada turca hecha con tomates, pepinos, pimientos verdes, cebollas, perejil y nueces, sazonada con aceite de oliva y jugo de limón.',
        ru: 'Освежающий турецкий салат из помидоров, огурцов, зелёного перца, лука, петрушки и грецких орехов, заправленный оливковым маслом и лимонным соком.',
        hi: 'टमाटर, खीरे, हरी मिर्च, प्याज, अजमोद और अखरोट से बना तरोताजा तुर्की सलाद, जैतून के तेल और नींबू के रस से सीज़न किया गया।',
        sq: 'Sallatë turke freskuese e bërë me domate, kastravec, spec të gjelbër, qepë, majdanoz dhe arrë, e këndelur me vaj ulliri dhe lëng limoni.',
        fr: 'Une salade turque rafraîchissante préparée avec tomates, concombres, poivrons verts, oignons, persil et noix, assaisonnée à l\'huile d\'olive et au jus de citron.',
        de: 'Ein erfrischender türkischer Salat aus Tomaten, Gurken, grünen Paprika, Zwiebeln, Petersilie und Walnüssen, gewürzt mit Olivenöl und Zitronensaft.',
        bn: 'টমেটো, শসা, সবুজ মরিচ, পেঁয়াজ, পার্সলে এবং আখরোট দিয়ে তৈরি সতেজকারী তুর্কি সালাদ, অলিভ অয়েল এবং লেবুর রস দিয়ে মসলাযুক্ত।',
        ko: '토마토, 오이, 피망, 양파, 파슬리, 호두로 만든 상쾌한 터키식 샐러드로, 올리브 오일과 레몬 주스로 양념합니다.'
      }, 
      image: '/Shwan Salad.jpg',
      price: '$14.99', 
      category: 'salads', 
      tags: ['vegetarian', 'vegan'], 
      addOns: { 
        title: { 
          en: 'Add Protein',
          ar: 'إضافة بروتين',
          fa: 'اضافه کردن پروتین',
          ku: 'پرۆتین زیادبکە',
          tr: 'Protein Ekle',
          ur: 'پروٹین شامل کریں',
          kmr: 'Protein Zêde Bike',
          es: 'Agregar Proteína',
          ru: 'Добавить белок',
          hi: 'प्रोटीन जोड़ें',
          sq: 'Shto Proteinë',
          fr: 'Ajouter des Protéines',
          de: 'Protein hinzufügen'
        }, 
        options: [ 
          { name: { en: 'Beef', ar: 'لحم بقر', fa: 'گوشت گاو', ku: 'گۆشتی گا', tr: 'Dana Eti', ur: 'گائے کا گوشت', kmr: 'Goştê Ga', es: 'Carne de Res', ru: 'Говядина', hi: 'गोमांस', sq: 'Mish Viqi', fr: 'Bœuf', de: 'Rindfleisch' }, price: '$9.99' }, 
          { name: { en: 'Chicken', ar: 'دجاج', fa: 'مرغ', ku: 'مریشک', tr: 'Tavuk', ur: 'چکن', kmr: 'Mirîşk', es: 'Pollo', ru: 'Курица', hi: 'चिकन', sq: 'Pulë', fr: 'Poulet', de: 'Hähnchen' }, price: '$8.99' }, 
          { name: { en: 'Shrimp', ar: 'روبيان', fa: 'میگو', ku: 'میگۆ', tr: 'Karides', ur: 'جھینگا', kmr: 'Mîgo', es: 'Camarones', ru: 'Креветки', hi: 'झींगा', sq: 'Karkaleca', fr: 'Crevettes', de: 'Garnelen' }, price: '$6.99' }, 
          { name: { en: 'Falafel', ar: 'فلافل', fa: 'فلافل', ku: 'فەلەفڵ', tr: 'Falafel', ur: 'فلافل', kmr: 'Falafel', es: 'Falafel', ru: 'Фалафель', hi: 'फलाफेल', sq: 'Falafel', fr: 'Falafel', de: 'Falafel' }, price: '$5.99' } 
        ] 
      } 
    },
    { 
      id: 1104, 
      name: { 
        en: 'Tabbouleh Salad',
        ar: 'سلطة التبولة',
        fa: 'سالاد تبوله',
        ku: 'سالادی تەبووله',
        tr: 'Tabbouleh Salatası',
        ur: 'تبولہ سلاد',
        kmr: 'Salata Tabbouleh',
        es: 'Ensalada Tabbouleh',
        ru: 'Салат Табуле',
        hi: 'तब्बूलेह सलाद',
        sq: 'Sallatë Tabbouleh',
        fr: 'Salade Tabbouleh',
        de: 'Tabbouleh-Salat',
        bn: 'তাবুলেহ সালাদ',
        ko: '타불레 샐러드'
      }, 
      description: { 
        en: 'A Levantine salad of finely chopped parsley, soaked extra fine bulgur, tomatoes, mint, onion, and scallions, seasoned with olive oil, lemon juice, salt and black pepper.',
        ar: 'سلطة شامية من البقدونس المفروم ناعماً، البرغل الناعم المنقوع، الطماطم، النعناع، البصل، والبصل الأخضر، متبلة بزيت الزيتون وعصير الليمون والملح والفلفل الأسود.',
        fa: 'سالاد شامی از جعفری ریز خرد شده، برغول بسیار نرم خیسانده شده، گوجه‌فرنگی، نعنا، پیاز و پیازچه، طعم‌دار شده با روغن زیتون، آب لیمو، نمک و فلفل سیاه.',
        ku: 'سالادێکی شامی لە جەعدەی وردکراو، برغولی نەرمی خیسکراو، تەماتە، پونگ، پیاز و پیازی سەوز، تامدراو بە زەیتی زەیتوون، شیری لیمۆ، خوێ و بیبەری ڕەش.',
        tr: 'İnce doğranmış maydanoz, ıslatılmış çok ince bulgur, domates, nane, soğan ve yeşil soğan ile yapılan Levanten salatası, zeytinyağı, limon suyu, tuz ve karabiber ile baharatlanmış.',
        ur: 'باریک کٹے ہوئے دھنیا، بھگوئے ہوئے انتہائی باریک دلیا، ٹماٹر، پودینہ، پیاز اور ہری پیاز کا شامی سلاد، زیتون کا تیل، لیموں کا رس، نمک اور کالی مرچ سے ذائقہ دار بنایا گیا۔',
        kmr: 'Salatayek Şamî ya ku ji şînî bixuber, bulgurê gelek nazik ê avkirî, firangoş, pûng, pîvaz û pîvazên kesk, bi zeyta zeytûnê, ava lîmonê, xwê û biberê reş tê çêkirin.',
        es: 'Ensalada levantina de perejil finamente picado, bulgur extrafino remojado, tomates, menta, cebolla y cebolletas, sazonada con aceite de oliva, jugo de limón, sal y pimienta negra.',
        ru: 'Левантийский салат из мелко нарезанной петрушки, замоченного сверхмелкого булгура, помидоров, мяты, лука и зелёного лука, приправленный оливковым маслом, лимонным соком, солью и чёрным перцем.',
        hi: 'बारीक कटी हुई अजमोद, भिगोई हुई अतिरिक्त बारीक दलिया, टमाटर, पुदीना, प्याज और हरी प्याज का लेवेंटाइन सलाद, जैतून के तेल, नींबू के रस, नमक और काली मिर्च से स्वादिष्ट बनाया गया।',
        sq: 'Sallatë levantinase me majdanoz të grirë imët, bulgur shumë të hollë të lagur, domate, mendër, qepë dhe qepë të gjelbër, e kondimentuar me vaj ulliri, lëng limoni, kripë dhe piper të zi.',
        fr: 'Salade levantine de persil finement haché, boulgour extra-fin trempé, tomates, menthe, oignon et échalotes, assaisonnée avec huile d\'olive, jus de citron, sel et poivre noir.',
        de: 'Levantinischer Salat aus fein gehackter Petersilie, eingeweichtem extra-feinem Bulgur, Tomaten, Minze, Zwiebeln und Frühlingszwiebeln, gewürzt mit Olivenöl, Zitronensaft, Salz und schwarzem Pfeffer.',
        bn: 'সূক্ষ্ম কাটা পার্সলে, ভেজানো অতি সূক্ষ্ম বুলগুর, টমেটো, পুদিনা, পেঁয়াজ এবং স্কালিয়ন দিয়ে তৈরি লেভান্তাইন সালাদ, অলিভ অয়েল, লেবুর রস, লবণ এবং কালো মরিচ দিয়ে মসলাযুক্ত।',
        ko: '잘게 다진 파슬리, 불린 극세 불구르, 토마토, 민트, 양파, 파로 만든 레반트 샐러드로, 올리브 오일, 레몬 주스, 소금, 후춧가루로 양념했습니다.'
      }, 
      image: '/Tabbouleh Salad.jpg',
      price: '$14.99', 
      category: 'salads', 
      tags: ['vegetarian', 'vegan'], 
      addOns: { 
        title: { 
          en: 'Add Protein',
          ar: 'إضافة بروتين',
          fa: 'اضافه کردن پروتین',
          ku: 'پرۆتین زیادبکە',
          tr: 'Protein Ekle',
          ur: 'پروٹین شامل کریں',
          kmr: 'Protein Zêde Bike',
          es: 'Agregar Proteína',
          ru: 'Добавить белок',
          hi: 'प्रोटीन जोड़ें',
          sq: 'Shto Proteinë',
          fr: 'Ajouter des Protéines',
          de: 'Protein hinzufügen'
        }, 
        options: [ 
          { name: { en: 'Beef', ar: 'لحم بقر', fa: 'گوشت گاو', ku: 'گۆشتی گا', tr: 'Dana Eti', ur: 'گائے کا گوشت', kmr: 'Goştê Ga', es: 'Carne de Res', ru: 'Говядina', hi: 'गोमांस', sq: 'Mish Viqi', fr: 'Bœuf', de: 'Rindfleisch' }, price: '$9.99' }, 
          { name: { en: 'Chicken', ar: 'دجاج', fa: 'مرغ', ku: 'مریشک', tr: 'Tavuk', ur: 'چکن', kmr: 'Mirîşk', es: 'Pollo', ru: 'Курица', hi: 'चिकन', sq: 'Pulë', fr: 'Poulet', de: 'Hähnchen' }, price: '$8.99' }, 
          { name: { en: 'Shrimp', ar: 'روبيان', fa: 'میگو', ku: 'میگۆ', tr: 'Karides', ur: 'جھینگا', kmr: 'Mîgo', es: 'Camarones', ru: 'Креветки', hi: 'झींगा', sq: 'Karkaleca', fr: 'Crevettes', de: 'Garnelen' }, price: '$6.99' }, 
          { name: { en: 'Falafel', ar: 'فلافل', fa: 'فلافل', ku: 'فەلەفڵ', tr: 'Falafel', ur: 'فلافل', kmr: 'Falafel', es: 'Falafel', ru: 'Фалафель', hi: 'फलाफेल', sq: 'Falafel', fr: 'Falafel', de: 'Falafel' }, price: '$5.99' } 
        ] 
      } 
    },
    // Note: Removed duplicate entries to prevent data inconsistencies
  ], []) // Empty dependency array since menu items are static

  const t = translations[language] || translations.en

  // Helper function to normalize category values consistently - MOVED BEFORE validateMenuData
  const normalizeCategory = useCallback((category) => {
    if (typeof category === 'string') {
      return category;
    }
    if (typeof category === 'object' && category !== null && category.en) {
      // Map display names to filter keys
      const categoryMappings = {
        'Appetizers': 'appetizers',
        'Appetizer': 'appetizers', // Handle both singular and plural
        'Salads': 'salads',
        'Soups': 'soup',
        'Soup': 'soup', // Handle both singular and plural
        'Sandwich & Platter': 'sandwich_platter',
        'Sandwich': 'sandwich_platter', // Handle sandwich variants
        'Naan': 'naan',
        'Specialty': 'specialty',
        'Grill': 'grill',
        'Kid\'s Menu': 'kids',
        'Sides': 'sides',
        'Drinks (Cold)': 'drinks_cold',
        'Drinks (Hot)': 'drinks_hot',
        'Hot Drinks': 'drinks_hot', // Handle variant
        'Desserts': 'dessert',
        'Dessert': 'dessert' // Handle both singular and plural
      };
      
      const mappedCategory = categoryMappings[category.en];
      
      if (mappedCategory) {
        return mappedCategory;
      }
      
      // If no mapping found, fallback to lowercase normalized version
      return category.en?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'other';
    }
    return 'other'; // Fallback for invalid categories
  }, []);

  // Development-only validation function with error handling
  const validateMenuData = useCallback(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    try {
      console.group('🔍 Menu Data Validation & Filter Testing');
      
      // Check for duplicate IDs
      const ids = menuItems.map(item => item.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        console.warn('⚠️ Duplicate menu item IDs found:', [...new Set(duplicateIds)]);
      }
      
      // Check total items
      console.log(`📊 Total menu items: ${menuItems.length}`);
      
      // Validate categories and test all filters
      const categoryCounts = {};
      const invalidItems = [];
      
      menuItems.forEach((item, index) => {
        // Validate required fields
        if (!item.id || !item.name || !item.category) {
          invalidItems.push({ 
            index, 
            item: item.name?.en || `Item ${index}`, 
            issue: 'Missing required fields (id, name, or category)' 
          });
          return;
        }
        
        const normalizedCategory = normalizeCategory(item?.category);
        
        if (!normalizedCategory || normalizedCategory === 'other') {
          invalidItems.push({ 
            index, 
            item: item.name?.en || `Item ${index}`, 
            category: item?.category,
            issue: 'Invalid category' 
          });
        }
        
        categoryCounts[normalizedCategory] = (categoryCounts[normalizedCategory] || 0) + 1;
      });
      
      console.log('📈 Category distribution:', categoryCounts);
      
      // Test each filter
      const availableFilters = Object.keys(t.filters).filter(key => !['all', 'popular'].includes(key));
      console.log('🧪 Testing filters:');
      
      availableFilters.forEach(filterKey => {
        const expectedCount = categoryCounts[filterKey] || 0;
        const actualFilteredItems = menuItems.filter(item => 
          normalizeCategory(item?.category) === filterKey
        );
        const actualCount = actualFilteredItems.length;
        
        const status = expectedCount === actualCount ? '✅' : '❌';
        console.log(`${status} ${filterKey}: Expected ${expectedCount}, Got ${actualCount}`);
        
        if (expectedCount !== actualCount) {
          console.warn(`❌ Filter "${filterKey}" mismatch!`, {
            expected: expectedCount,
            actual: actualCount,
            items: actualFilteredItems.map(item => ({ 
              name: item.name?.en, 
              category: item?.category,
              normalized: normalizeCategory(item?.category)
            }))
          });
        }
      });
      
      if (invalidItems.length > 0) {
        console.warn('⚠️ Items with issues:', invalidItems);
      }
      
      // Check if all filter keys have corresponding items
      const missingCategories = availableFilters.filter(filter => !categoryCounts[filter]);
      
      if (missingCategories.length > 0) {
        console.warn('⚠️ Filters with no items:', missingCategories);
      } else {
        console.log('✅ All filters have corresponding menu items');
      }
      
      console.groupEnd();
    } catch (error) {
      console.error('Error during menu data validation:', error);
    }
  }, [menuItems, normalizeCategory, t.filters]);

  // Run validation in development
  useEffect(() => {
    validateMenuData();
  }, [validateMenuData]);

  // Memoized filtered menu items for performance with search functionality and error handling
  const filteredMenuItems = useMemo(() => {
    try {
      // Safety check for menuItems array
      if (!Array.isArray(menuItems) || menuItems.length === 0) {
        console.warn('Menu items array is empty or invalid');
        return [];
      }

      let filteredItems = menuItems.filter(item => {
        // Safety checks for item structure
        if (!item || typeof item !== 'object') {
          console.warn('Invalid menu item found:', item);
          return false;
        }
        
        // Check for required fields
        if (!item.id || !item.name || !item.category) {
          console.warn('Menu item missing required fields:', item);
          return false;
        }
        
        return true;
      });
      
      // Apply category filter
      if (activeFilter === 'popular') {
        filteredItems = filteredItems.filter(item => item?.popular === true);
      } else if (activeFilter !== 'all') {
        filteredItems = filteredItems.filter(item => {
          const normalizedCategory = normalizeCategory(item?.category);
          return normalizedCategory === activeFilter;
        });
      }
      
      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filteredItems = filteredItems.filter(item => {
          try {
            const itemName = getText(item.name) || '';
            const itemDescription = getText(item.description || {}) || '';
            const itemTags = Array.isArray(item.tags) ? item.tags.join(' ') : '';
            
            const searchContent = `${itemName} ${itemDescription} ${itemTags}`.toLowerCase();
            return searchContent.includes(searchLower);
          } catch (error) {
            console.warn('Error processing item for search:', item, error);
            return false;
          }
        });
      }
      
      return filteredItems;
    } catch (error) {
      console.error('Error filtering menu items:', error);
      return [];
    }
  }, [activeFilter, searchTerm, menuItems, getText, normalizeCategory]);

  const getTagTranslation = useCallback((tag) => {
    const tagTranslations = {
      vegetarian: {
        en: '🌱 Vegetarian',
        ar: '🌱 نباتي',
        fa: '🌱 گیاهی',
        ku: '🌱 ڕووەکی',
        tr: '🌱 Vejetaryen',
        ur: '🌱 سبزی خور',
        kmr: '🌱 Nebatî',
        es: '🌱 Vegetariano',
        ru: '🌱 Вегетарианский',
        hi: '🌱 शाकाहारी'
      },
      vegan: {
        en: '🌿 Vegan',
        ar: '🌿 نباتي صرف',
        fa: '🌿 وگان',
        ku: '🌿 ڕووەکی ڕەها',
        tr: '🌿 Vegan',
        ur: '🌿 ویگن',
        kmr: '🌿 Vegan',
        es: '🌿 Vegano',
        ru: '🌿 Веганский',
        hi: '🌿 वीगन'
      },
      spicy: {
        en: '🌶️ Spicy',
        ar: '🌶️ حار',
        fa: '🌶️ تند',
        ku: '🌶️ تیژ',
        tr: '🌶️ Acılı',
        ur: '🌶️ تیز',
        kmr: '🌶️ Tûj',
        es: '🌶️ Picante',
        ru: '🌶️ Острый',
        hi: '🌶️ मसालेदार'
      },
      sweet: {
        en: '🍯 Sweet',
        ar: '🍯 حلو',
        fa: '🍯 شیرین',
        ku: '🍯 شیرین',
        tr: '🍯 Tatlı',
        ur: '🍯 میٹھا',
        kmr: '🍯 Şîrîn',
        es: '🍯 Dulce',
        ru: '🍯 Сладкий',
        hi: '🍯 मीठा'
      },
      traditional: {
        en: '🏛️ Traditional',
        ar: '🏛️ تقليدي',
        fa: '🏛️ سنتی',
        ku: '🏛️ نەریتی',
        tr: '🏛️ Geleneksel',
        ur: '🏛️ روایتی',
        kmr: '🏛️ Kevneşopî',
        es: '🏛️ Tradicional',
        ru: '🏛️ Традиционный',
        hi: '🏛️ पारंपरिक'
      },
      grilled: {
        en: '🔥 Grilled',
        ar: '🔥 مشوي',
        fa: '🔥 کبابی',
        ku: '🔥 برژاو',
        tr: '🔥 Izgara',
        ur: '🔥 گرل شدہ',
        kmr: '🔥 Şewitî',
        es: '🔥 A la Parrilla',
        ru: '🔥 Гриль',
        hi: '🔥 ग्रिल्ड'
      },
      fried: {
        en: '🍳 Fried',
        ar: '🍳 مقلي',
        fa: '🍳 سرخ شده',
        ku: '🍳 سووتراو',
        tr: '🍳 Kızartılmış',
        ur: '🍳 تلا ہوا',
        kmr: '🍳 Sorkirî',
        es: '🍳 Frito',
        ru: '🍳 Жареный',
        hi: '🍳 तली हुई'
      }
    };
    
    return tagTranslations[tag] ? getText(tagTranslations[tag]) : tag;
  }, [getText]);

  // Helper functions for carousel SVG icons
  const getSVGGradient = useCallback((placeholder) => {
    const gradients = {
      salmon: 'bg-gradient-to-br from-pink-400 to-orange-500',
      salad: 'bg-gradient-to-br from-green-400 to-emerald-500',
      steak: 'bg-gradient-to-br from-red-500 to-amber-600',
      pasta: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      cake: 'bg-gradient-to-br from-pink-400 to-purple-500',
      wings: 'bg-gradient-to-br from-orange-400 to-red-500',
      curry: 'bg-gradient-to-br from-yellow-500 to-orange-600',
      tacos: 'bg-gradient-to-br from-green-400 to-yellow-500',
      smoothie: 'bg-gradient-to-br from-purple-400 to-pink-500',
      bread: 'bg-gradient-to-br from-amber-400 to-orange-500'
    };
    return gradients[placeholder] || 'bg-gradient-to-br from-amber-400 to-orange-500';
  }, []);

  const getSVGIcon = useCallback((placeholder, size = 40) => {
    const iconClass = "text-white drop-shadow-sm";
    const icons = {
      salmon: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="50" cy="50" rx="35" ry="20" fill="currentColor" opacity="0.4"/>
          <ellipse cx="45" cy="50" rx="25" ry="15" fill="currentColor" opacity="0.6"/>
          <polygon points="75,50 85,40 85,60" fill="currentColor" opacity="0.8"/>
          <circle cx="40" cy="45" r="3" fill="currentColor"/>
          <path d="M25 45 Q35 40 25 50 Q35 55 25 50" fill="currentColor" opacity="0.6"/>
        </svg>
      ),
      salad: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <circle cx="50" cy="55" r="30" fill="currentColor" opacity="0.3"/>
          <circle cx="40" cy="40" r="8" fill="currentColor" opacity="0.7"/>
          <circle cx="60" cy="45" r="6" fill="currentColor" opacity="0.8"/>
          <circle cx="50" cy="65" r="5" fill="currentColor" opacity="0.6"/>
          <circle cx="35" cy="60" r="4" fill="currentColor" opacity="0.5"/>
          <circle cx="65" cy="60" r="7" fill="currentColor" opacity="0.7"/>
        </svg>
      ),
      steak: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="50" cy="50" rx="30" ry="25" fill="currentColor" opacity="0.4"/>
          <ellipse cx="50" cy="50" rx="25" ry="20" fill="currentColor" opacity="0.6"/>
          <path d="M30 40 Q50 35 70 40 Q70 60 50 65 Q30 60 30 40" fill="currentColor" opacity="0.8"/>
          <circle cx="45" cy="45" r="2" fill="currentColor"/>
          <circle cx="55" cy="50" r="2" fill="currentColor"/>
        </svg>
      ),
      pasta: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <path d="M30 30 Q50 20 70 30 Q65 50 50 60 Q35 50 30 30" fill="currentColor" opacity="0.4"/>
          <path d="M35 35 Q50 25 65 35 Q60 50 50 55 Q40 50 35 35" fill="currentColor" opacity="0.6"/>
          <circle cx="50" cy="45" r="15" fill="currentColor" opacity="0.3"/>
          <path d="M40 40 Q50 35 60 40" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M42 50 Q50 45 58 50" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
      cake: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <rect x="25" y="40" width="50" height="35" rx="5" fill="currentColor" opacity="0.4"/>
          <rect x="30" y="45" width="40" height="25" rx="3" fill="currentColor" opacity="0.6"/>
          <rect x="35" y="50" width="30" height="15" rx="2" fill="currentColor" opacity="0.8"/>
          <circle cx="45" cy="35" r="3" fill="currentColor"/>
          <circle cx="55" cy="35" r="3" fill="currentColor"/>
          <path d="M40 30 Q50 25 60 30" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
      wings: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="45" cy="50" rx="20" ry="12" fill="currentColor" opacity="0.4"/>
          <ellipse cx="55" cy="50" rx="20" ry="12" fill="currentColor" opacity="0.4"/>
          <ellipse cx="45" cy="50" rx="15" ry="8" fill="currentColor" opacity="0.6"/>
          <ellipse cx="55" cy="50" rx="15" ry="8" fill="currentColor" opacity="0.6"/>
          <circle cx="40" cy="47" r="2" fill="currentColor"/>
          <circle cx="60" cy="47" r="2" fill="currentColor"/>
        </svg>
      ),
      curry: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <circle cx="50" cy="55" r="25" fill="currentColor" opacity="0.3"/>
          <circle cx="50" cy="55" r="20" fill="currentColor" opacity="0.5"/>
          <circle cx="45" cy="50" r="3" fill="currentColor" opacity="0.8"/>
          <circle cx="55" cy="52" r="4" fill="currentColor" opacity="0.7"/>
          <circle cx="50" cy="60" r="2" fill="currentColor" opacity="0.9"/>
          <path d="M35 45 Q50 40 65 45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
        </svg>
      ),
      tacos: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <path d="M30 60 Q50 40 70 60 Q50 70 30 60" fill="currentColor" opacity="0.4"/>
          <path d="M35 58 Q50 45 65 58 Q50 65 35 58" fill="currentColor" opacity="0.6"/>
          <circle cx="45" cy="55" r="2" fill="currentColor"/>
          <circle cx="55" cy="55" r="2" fill="currentColor"/>
          <circle cx="50" cy="52" r="1.5" fill="currentColor"/>
        </svg>
      ),
      smoothie: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <rect x="35" y="35" width="30" height="40" rx="5" fill="currentColor" opacity="0.3"/>
          <rect x="38" y="38" width="24" height="34" rx="3" fill="currentColor" opacity="0.5"/>
          <circle cx="50" cy="45" r="8" fill="currentColor" opacity="0.7"/>
          <circle cx="45" cy="55" r="4" fill="currentColor" opacity="0.6"/>
          <circle cx="55" cy="60" r="3" fill="currentColor" opacity="0.8"/>
          <rect x="45" y="25" width="10" height="10" rx="2" fill="currentColor" opacity="0.4"/>
        </svg>
      ),
      bread: (
        <svg width={size} height={size} viewBox="0 0 100 100" className={iconClass}>
          <ellipse cx="50" cy="55" rx="25" ry="15" fill="currentColor" opacity="0.4"/>
          <ellipse cx="50" cy="50" rx="20" ry="12" fill="currentColor" opacity="0.6"/>
          <circle cx="45" cy="48" r="2" fill="currentColor" opacity="0.8"/>
          <circle cx="55" cy="50" r="2" fill="currentColor" opacity="0.8"/>
          <circle cx="50" cy="45" r="1.5" fill="currentColor" opacity="0.7"/>
        </svg>
      )
    };
    return icons[placeholder] || icons.bread;
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            {!reducedMotion && (
              <>
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto" aria-hidden="true"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-orange-400 rounded-full animate-ping mx-auto" aria-hidden="true"></div>
              </>
            )}
            {reducedMotion && (
              <div className="w-16 h-16 border-4 border-amber-300 rounded-full mx-auto" aria-hidden="true"></div>
            )}
          </div>
          <div className="text-2xl font-serif text-amber-800">{translations[language]?.loading || 'Loading...'}</div>
          <div className="text-sm text-amber-600">Preparing your culinary journey...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Nature Village - {t.title}</title>
        <meta name="description" content={t.subtitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#92400e" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content={language} />
        <meta name="keywords" content="Kurdish restaurant, Middle Eastern food, authentic cuisine, nature village, traditional recipes" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Nature Village - ${t.title}`} />
        <meta property="og:description" content={t.subtitle} />
        <meta property="og:site_name" content="Nature Village Restaurant" />
        {/* Canonical and hreflang */}
        {(() => {
          const baseCanonical = 'https://naturevillagerestaurant.com/menu'
          const canonicalHref = language === 'en' ? baseCanonical : `${baseCanonical}?lang=${language}`
          const alternates = generateHreflangAlternates(baseCanonical)
          return (
            <>
              <link rel="canonical" href={canonicalHref} />
              {alternates.map(alt => (
                <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
              ))}
              <link rel="alternate" hrefLang="x-default" href={baseCanonical} />
              <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(generateMenuJsonLD(
                    // Build sections grouped by category (excluding 'all'/'popular')
                    Object.entries(t.filters)
                      .filter(([key]) => key !== 'all' && key !== 'popular')
                      .map(([key]) => ({
                        category: key,
                        items: menuItems.filter(mi => mi.category === key)
                      })),
                    language
                  ))
                }}
              />
            </>
          )
        })()}
      </Head>

      {/* Skip to main content for accessibility */}
      <a href="#main-content" 
         className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-amber-600 text-white px-4 py-2 z-50 rounded-br-md transition-all">
        Skip to main content
      </a>

      {/* Enhanced Custom CSS for Smooth Carousel Animations and Hero Effects */}
      <style jsx>{`
        @keyframes carousel-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
        }
        
        @keyframes carousel-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.5); }
        }
        
        @keyframes spring-bounce {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-0.5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(8px) rotate(-1deg); }
          66% { transform: translateY(-6px) rotate(0.5deg); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes bounce-x {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(4px); }
        }

        @keyframes carousel-progress {
          0% { stroke-dashoffset: 100.53; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

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
        
        .carousel-active {
          animation: carousel-float 3s ease-in-out infinite, carousel-glow 2s ease-in-out infinite;
        }
        
        .carousel-transitioning {
          animation: spring-bounce 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .motion-blur-sm {
          filter: blur(0.5px);
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-bounce-x {
          animation: bounce-x 2s ease-in-out infinite;
        }
        
        /* Enhanced 3D perspective */
        .carousel-container {
          perspective: 1500px;
          perspective-origin: center center;
        }
        
        /* Smooth hardware acceleration */
        .dish-circle {
          transform-style: preserve-3d;
          will-change: transform, filter, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
      <div className="min-h-screen bg-white pt-20 sm:pt-24" style={{ direction: languages[language]?.dir || 'ltr' }}>
        <Header currentPage="menu" />

        {/* Rest of the menu page content */}
        <main id="main-content" className="relative" role="main">
          {/* Enhanced Premium Hero Section */}
          <div className="relative bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white overflow-hidden">
            {/* Advanced Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='20' cy='20' r='15'/%3E%3Ccircle cx='80' cy='80' r='20'/%3E%3Ccircle cx='80' cy='20' r='10'/%3E%3Ccircle cx='20' cy='80' r='12'/%3E%3Cpath d='M50 20 L80 50 L50 80 L20 50 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>

            {/* Dynamic Floating Elements */}
            {!reducedMotion && (
              <>
                <div className="absolute top-16 left-8 sm:left-16 w-20 h-20 sm:w-32 sm:h-32 bg-amber-400/20 rounded-full blur-2xl animate-float" aria-hidden="true"></div>
                <div className="absolute bottom-16 right-8 sm:right-16 w-24 h-24 sm:w-40 sm:h-40 bg-orange-400/15 rounded-full blur-2xl animate-float-delayed" aria-hidden="true"></div>
                <div className="absolute top-1/3 right-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-400/10 rounded-full blur-xl animate-pulse-slow" aria-hidden="true"></div>
                <div className="absolute bottom-1/3 left-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-red-400/15 rounded-full blur-xl animate-bounce-slow" aria-hidden="true"></div>
              </>
            )}

            {/* Hero Content Container - Enhanced spacing and layout */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 min-h-[85vh] flex flex-col justify-center">
              <div className={`w-full ${isRTL ? 'text-center' : 'text-center'} space-y-6 sm:space-y-8 md:space-y-12`}>
                
                {/* Restaurant Badge */}
                <div className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                  <span className="text-xs sm:text-sm font-semibold text-amber-200 tracking-wide uppercase">
                    {t.restaurantBadge || 'Authentic Middle Eastern Restaurant'}
                  </span>
                </div>

                {/* Enhanced Main Title Section */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold leading-[0.85] tracking-tighter">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-200 animate-gradient-x drop-shadow-lg">
                      {t.title}
                    </span>
                  </h1>
                  
                  {/* Enhanced Subtitle */}
                  <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-100/90 leading-relaxed font-light tracking-wide drop-shadow-sm">
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                {/* Enhanced Statistics Section with better design */}
                <div className="pt-6 sm:pt-8 md:pt-12">
                  <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto" role="list" aria-label="Menu statistics">
                    
                    {/* Dishes Count */}
                    <div className="text-center group transition-all duration-500 hover:scale-110 hover:rotate-1" role="listitem">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg group-hover:shadow-xl group-hover:bg-white/15 transition-all duration-300">
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-300 group-hover:text-amber-200 transition-colors mb-2 font-mono">
                          {menuItems.length}<span className="text-sm sm:text-base md:text-lg align-top">+</span>
                        </div>
                        <div className="text-xs sm:text-sm md:text-base text-amber-200/80 font-semibold tracking-wide">
                          {t.stats?.dishes || 'Delicious Dishes'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Categories Count */}
                    <div className="text-center group transition-all duration-500 hover:scale-110 hover:-rotate-1" role="listitem">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg group-hover:shadow-xl group-hover:bg-white/15 transition-all duration-300">
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-300 group-hover:text-orange-200 transition-colors mb-2 font-mono">
                          {Object.keys(t.filters).length - 2}
                        </div>
                        <div className="text-xs sm:text-sm md:text-base text-orange-200/80 font-semibold tracking-wide">
                          {t.stats?.categories || 'Diverse Categories'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Languages Count */}
                    <div className="text-center group transition-all duration-500 hover:scale-110 hover:rotate-1" role="listitem">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg group-hover:shadow-xl group-hover:bg-white/15 transition-all duration-300">
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors mb-2 font-mono">
                          10
                        </div>
                        <div className="text-xs sm:text-sm md:text-base text-yellow-200/80 font-semibold tracking-wide">
                          {t.stats?.languages || 'Global Languages'}
                        </div>
                      </div>
                    </div>
                  </div>
                  

                </div>

                {/* Enhanced Popular Dishes Carousel Section */}
                <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 px-2 sm:px-4">
                  {/* Section Header with keyboard shortcuts info */}
                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3 sm:mb-4">
                      {t.popularSectionTitle || 'Our Most Popular Dishes'}
                    </h2>
                    <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full mb-4"></div>
                    
                    {/* Keyboard shortcuts info */}
                    <div className="flex justify-center items-center gap-4 text-xs sm:text-sm text-amber-200/80 font-medium">
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←→</kbd>
                        Navigate
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd>
                        Play/Pause
                      </span>
                    </div>
                  </div>

                  <div 
                    className="carousel-container relative flex justify-center items-center mb-6 sm:mb-8 overflow-hidden"
                    onMouseEnter={pauseCarousel}
                    onMouseLeave={resumeCarousel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="region"
                    aria-label="Popular dishes carousel"
                    aria-live="polite"
                    style={{
                      width: '100%',
                      minWidth: '320px',
                      maxWidth: '100vw',
                      overflow: 'visible',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  >
                    {/* Card-based carousel container - fully responsive with improved mobile and table protection */}
                    <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="relative min-h-[420px] sm:min-h-[440px] md:min-h-[460px] lg:min-h-[480px] flex items-center justify-center">
                        {/* Single card display with enhanced transitions */}
                        {dishes.map((dish, index) => {
                          const isActive = index === currentDishIndex;
                          const translateX = isActive ? '0' : index < currentDishIndex ? '-120%' : '120%';
                          const rotateY = isActive ? '0deg' : index < currentDishIndex ? '-15deg' : '15deg';
                          const blur = isActive ? '0px' : '2px';
                          const brightness = isActive ? '1' : '0.7';

                          return (
                            <div
                              key={`dish-card-${dish.id}`}
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                                isActive 
                                  ? 'opacity-100 scale-100 z-20 pointer-events-auto' 
                                  : 'opacity-0 scale-95 z-10 pointer-events-none'
                              } ${isTransitioning ? 'motion-blur-sm' : ''}`}
                              style={{
                                transform: `translateX(${translateX}) rotateY(${rotateY})`,
                                filter: `blur(${blur}) brightness(${brightness})`,
                              }}
                            >
                            {/* Enhanced dish card with improved mobile design, stronger borders, and parallax effects */}
                            <div 
                              className="bg-gradient-to-br from-white via-white to-amber-50/30 backdrop-blur-md rounded-2xl sm:rounded-3xl lg:rounded-3xl shadow-2xl border-4 overflow-hidden transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-3xl relative will-change-transform w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto group"
                              style={{ 
                                borderColor: `${dish.color}70`,
                                boxShadow: `0 25px 50px -12px ${dish.color}40, 0 8px 25px -8px ${dish.color}30, 0 0 0 3px ${dish.color}25, inset 0 1px 0 rgba(255,255,255,0.8)`,
                                minHeight: '420px',
                                height: 'auto',
                                maxWidth: '100%',
                                overflow: 'visible'
                              }}
                            >
                              {/* Premium background pattern with improved borders */}
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-50/20 to-orange-50/30"></div>
                              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
                              
                              <div className="relative z-10 flex flex-col sm:flex-row min-h-full">
                                {/* Left side - Enhanced Image section with proper borders and placement */}
                                <div className="w-full sm:w-2/5 h-64 sm:h-[350px] lg:h-[400px] relative overflow-hidden flex-shrink-0 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl lg:rounded-l-3xl group-hover:scale-105 transition-transform duration-700">
                                  {dish.imageUrl ? (
                                    <div className="relative w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl lg:rounded-l-3xl overflow-hidden">
                                      <Image
                                        src={dish.imageUrl}
                                        alt={getText(dish.name)}
                                        className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                                        fill
                                        sizes="(max-width: 640px) 100vw, 40vw"
                                        priority={index === 0}
                                        onError={(e) => {
                                          console.warn(`Failed to load image for item ${dish.id}:`, dish.imageUrl);
                                          e.currentTarget.style.display = 'none';
                                        }}
                                        onLoad={(e) => {
                                          e.currentTarget.parentElement.classList.remove('animate-pulse');
                                        }}
                                      />
                                      {/* Loading shimmer effect */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
                                    </div>
                                  ) : (
                                    <div 
                                      className={`w-full h-full ${getSVGGradient(dish.placeholder)} flex items-center justify-center transition-all duration-500 ease-out rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl lg:rounded-l-3xl`}
                                    >
                                      {getSVGIcon(dish.placeholder, 64)}
                                    </div>
                                  )}
                                  
                                  {/* Image overlay gradient for better text contrast */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white/10"></div>
                                  
                                  {/* Popular badge - minimal design */}
                                  <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium shadow-md z-10">
                                    {language === 'ar' ? 'مشهور' :
                                     language === 'fa' ? 'محبوب' :
                                     language === 'ku' ? 'بەناوبانگ' :
                                     language === 'tr' ? 'Popüler' :
                                     language === 'ur' ? 'مقبول' :
                                     language === 'kmr' ? 'Populer' :
                                     'Popular'}
                                  </div>
                                </div>
                                
                                {/* Right side - Enhanced Content with micro-interactions */}
                                <div className="w-full sm:w-3/5 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center flex-grow">
                                  {/* Dish category badge with enhanced styling */}
                                  <div className="mb-4 sm:mb-6 transform transition-all duration-500 group-hover:translate-x-1">
                                    <span 
                                      className="inline-block px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold text-white shadow-lg border-2 border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
                                      style={{ 
                                        background: `linear-gradient(135deg, ${dish.color}90, ${dish.color}70)`,
                                      }}
                                    >
                                      {getText(dish.category)}
                                    </span>
                                  </div>
                                  
                                  {/* Dish name - enhanced with subtle animations and better contrast */}
                                  <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8 font-serif transform transition-all duration-500 group-hover:translate-x-1 text-gray-800 ${language === 'ar' || language === 'fa' || language === 'ur' ? 'text-right' : ''}`}>
                                    {getText(dish.name)}
                                  </h3>
                                  
                                  {/* Description with enhanced readability and animation */}
                                  <p className={`leading-relaxed text-base sm:text-lg lg:text-xl font-medium line-clamp-3 sm:line-clamp-4 mb-6 sm:mb-8 transform transition-all duration-500 delay-100 group-hover:translate-x-1 text-gray-700 ${language === 'ar' || language === 'fa' || language === 'ur' ? 'text-right' : ''}`}>
                                    {getText(dish.description)}
                                  </p>

                                  {/* Additional details with icons */}
                                  <div className={`flex items-center justify-start gap-4 text-sm font-medium transform transition-all duration-500 delay-200 group-hover:translate-x-1 text-gray-600 ${language === 'ar' || language === 'fa' || language === 'ur' ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span>Fresh ingredients</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <span>Top rated</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        })}
                        
                        {/* Enhanced Navigation arrows with improved styling and feedback */}
                        <button
                          className="absolute -left-12 sm:-left-20 lg:-left-28 xl:-left-36 2xl:-left-44 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-white to-white/95 hover:from-amber-50 hover:to-white backdrop-blur-sm rounded-full p-3 sm:p-4 lg:p-5 shadow-2xl border-2 border-amber-200/60 hover:border-amber-300/80 transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-30 group will-change-transform touch-manipulation hover:shadow-amber-200/50"
                          onClick={() => navigateTo((currentDishIndex - 1 + dishes.length) % dishes.length)}
                          disabled={isTransitioning}
                          aria-label={`Previous dish: ${getText(dishes[(currentDishIndex - 1 + dishes.length) % dishes.length].name)}`}
                          title="Previous dish (← Arrow Key)"
                          style={{
                            minWidth: '52px',
                            minHeight: '52px'
                          }}
                        >
                          <svg width="20" height="20" className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" className="text-amber-600 group-hover:text-amber-700 group-active:text-amber-800 transition-all duration-200"/>
                          </svg>
                          {/* Hover effect indicator */}
                          <div className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-amber-400/10 transition-all duration-300"></div>
                        </button>
                        
                        <button
                          className="absolute -right-12 sm:-right-20 lg:-right-28 xl:-right-36 2xl:-right-44 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-white to-white/95 hover:from-amber-50 hover:to-white backdrop-blur-sm rounded-full p-3 sm:p-4 lg:p-5 shadow-2xl border-2 border-amber-200/60 hover:border-amber-300/80 transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-30 group will-change-transform touch-manipulation hover:shadow-amber-200/50"
                          onClick={() => navigateTo((currentDishIndex + 1) % dishes.length)}
                          disabled={isTransitioning}
                          aria-label={`Next dish: ${getText(dishes[(currentDishIndex + 1) % dishes.length].name)}`}
                          title="Next dish (→ Arrow Key)"
                          style={{
                            minWidth: '52px',
                            minHeight: '52px'
                          }}
                        >
                          <svg width="20" height="20" className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" className="text-amber-600 group-hover:text-amber-700 group-active:text-amber-800 transition-all duration-200"/>
                          </svg>
                          {/* Hover effect indicator */}
                          <div className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-amber-400/10 transition-all duration-300"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Navigation indicators with progress and better visual feedback */}
                  <div className="flex justify-center mt-16 sm:mt-8 lg:mt-12 mb-4 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                      {/* Auto-play toggle button */}
                      <button
                        onClick={toggleAutoPlay}
                        className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-all duration-300 mr-1 group touch-manipulation"
                        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                        title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                      >
                        {isAutoPlaying ? (
                          <svg className="w-3 h-3 text-amber-300 group-hover:text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-amber-300 group-hover:text-amber-200 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      {/* Progress indicators */}
                      {dishes.map((_, index) => (
                        <button
                          key={`enhanced-indicator-${index}`}
                          onClick={() => navigateTo(index)}
                          className={cn(
                            "relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-300 will-change-transform hover:scale-110 touch-manipulation group",
                            index === currentDishIndex
                              ? "bg-amber-500/25 scale-110 shadow-lg" 
                              : "bg-transparent hover:bg-amber-400/15 scale-100"
                          )}
                          aria-label={`Go to ${getText(dishes[index].name)} slide (${index + 1} of ${dishes.length})`}
                          title={getText(dishes[index].name)}
                        >
                          {/* Progress ring */}
                          <div className="absolute inset-0 rounded-full">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 28 28">
                              <circle
                                cx="14"
                                cy="14"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                className="text-amber-300/30"
                              />
                              {index === currentDishIndex && isAutoPlaying && (
                                <circle
                                  cx="14"
                                  cy="14"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  fill="none"
                                  strokeDasharray="62.8"
                                  className="text-amber-400"
                                  style={{
                                    strokeDashoffset: "62.8",
                                    animation: index === currentDishIndex && isAutoPlaying ? 'carousel-progress 5s linear infinite' : 'none'
                                  }}
                                />
                              )}
                            </svg>
                          </div>

                          {/* Center dot */}
                          <div
                            className={cn(
                              "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 relative z-10",
                              index === currentDishIndex
                                ? "bg-amber-400 scale-125 shadow-lg ring-1 ring-amber-300/50" 
                                : "bg-amber-300/70 group-hover:bg-amber-400/90 scale-100"
                            )}
                          />
                        </button>
                      ))}

                      {/* Slide counter - more compact */}
                      <div className="ml-0.5 px-1.5 py-0.5 bg-amber-500/20 rounded-full flex-shrink-0">
                        <span className="text-xs font-medium text-amber-200 whitespace-nowrap">
                          {currentDishIndex + 1}/{dishes.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Scroll Indicator with better UX */}
                <div className="pt-6 sm:pt-8 pb-4 sm:pb-6">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-bounce" aria-hidden="true">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-amber-300 transition-colors hover:text-amber-200" 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-200 font-medium tracking-wide">
                      {t.scrollDownText || 'Scroll down to explore menu'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced waves animation at bottom of hero */}
            <div className="absolute bottom-0 left-0 w-full">
              <svg className="w-full h-8 sm:h-12 md:h-16 text-white transform rotate-180" 
                   preserveAspectRatio="none" 
                   viewBox="0 0 1200 120" 
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                      fill="currentColor"></path>
              </svg>
            </div>
          </div>

          {/* Enhanced Menu Section with improved UX */}
          <div className="bg-white relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          {/* Enhanced Search Bar with better accessibility */}
          <div className="mb-8 sm:mb-12">
            <div className="max-w-lg mx-auto relative">
              <label htmlFor="menu-search" className="sr-only">
                {t.searchPlaceholder}
              </label>
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="w-5 h-5 text-amber-500" aria-hidden="true" />
              </div>
              <input
                id="menu-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoComplete="off"
                role="searchbox"
                aria-label={t.searchPlaceholder}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-amber-900 placeholder-amber-500`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-amber-500 hover:text-amber-700 transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Filters with Statistics and Accessibility */}
          <div className={`flex flex-wrap ${isRTL ? 'justify-end' : 'justify-center'} gap-3 sm:gap-4 mb-12 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl`}
               role="tablist" 
               aria-label="Menu category filters">
            {Object.entries(t.filters).map(([key, label]) => {
              const count = key === 'all' 
                ? menuItems.length 
                : key === 'popular' 
                  ? menuItems.filter(item => item.popular).length
                  : menuItems.filter(item => normalizeCategory(item.category) === key).length;
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  role="tab"
                  aria-selected={activeFilter === key}
                  aria-controls="menu-items-grid"
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    activeFilter === key 
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transform scale-105 ring-2 ring-amber-400 ring-opacity-50' 
                      : 'bg-white text-amber-800 hover:bg-amber-50 hover:shadow-md border border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  <span>{label}</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeFilter === key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {count}
                  </span>
                  {activeFilter === key && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Enhanced Menu Grid with improved accessibility and error handling */}
          <div id="menu-items-grid" 
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16"
               role="tabpanel"
               aria-labelledby="menu-filters"
               aria-live="polite"
               aria-busy={filteredMenuItems.length === 0 && searchTerm ? 'true' : 'false'}>
            {filteredMenuItems.map(item => {
              // Safety check for item
              if (!item || !item.id) {
                console.warn('Invalid menu item:', item);
                return null;
              }
              
              return (
                <article key={item.id} 
                         className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2">
                  <div className="relative overflow-hidden">
                    {item.image && (
                      <Image
                           src={item.image}
                           alt={`${getText(item.name)}${item.description ? ` - ${getText(item.description)}` : ''}`}
                           className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
                           width={600}
                           height={576}
                           sizes="(max-width: 1024px) 100vw, 33vw"
                           onError={(e) => {
                             console.warn(`Failed to load image for item ${item.id}:`, item.image);
                             e.currentTarget.style.display = 'none';
                           }}
                      />
                    )}
                    {item.popular && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                           aria-label="Popular item">
                        ⭐ {t.filters.popular}
                      </div>
                    )}
                    {/* Enhanced hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className={`${isRTL ? 'text-right' : 'text-left'} p-6`}>
                    <h3 className="text-xl font-serif font-bold text-amber-800 mb-2 group-hover:text-amber-900 transition-colors">
                      {getText(item.name)}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {getText(item.description)}
                      </p>
                    )}
                    
                    {/* Tags with error handling */}
                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mb-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        {item.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {getTagTranslation(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Handle variants with error handling */}
                    {Array.isArray(item.variants) && item.variants.length > 0 ? (
                      <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-3 mb-2 flex-wrap`}>
                        {item.variants.map((variant, i) => (
                          <span key={i} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-2 rounded-full text-sm font-semibold hover:bg-amber-100 transition-colors">
                            {getText(variant.label) || 'Variant'}: {variant.price || 'N/A'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-2`}>
                        <span className="text-2xl font-bold text-amber-600">{item.price || 'Price TBD'}</span>
                      </div>
                    )}
                    
                    {/* Handle add-ons with error handling */}
                    {item.addOns && item.addOns.title && Array.isArray(item.addOns.options) && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-amber-800 mb-2 text-sm">
                          {getText(item.addOns.title)}
                        </div>
                        <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                          {item.addOns.options.map((option, idx) => (
                            <span key={idx} className="bg-white text-amber-700 border border-amber-200 px-2 py-1 rounded-full text-xs hover:bg-amber-50 transition-colors">
                              {getText(option.name) || 'Option'} {option.price || ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-2 mt-4 pt-4 border-t border-gray-100`}>
                      <button 
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-all duration-200 group"
                        aria-label={`Add ${getText(item.name)} to favorites`}
                      >
                        <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => {
                          try {
                            if (typeof navigator !== 'undefined' && navigator.share) {
                              navigator.share({
                                title: getText(item.name),
                                text: getText(item.description) || '',
                                url: window.location.href
                              });
                            }
                          } catch (error) {
                            console.warn('Share failed:', error);
                          }
                        }}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-all duration-200 group"
                        aria-label={`Share ${getText(item.name)}`}
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            }).filter(Boolean)}
          </div>
          
          {/* Enhanced Empty State */}
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                  {searchTerm ? (
                    <Search className="w-12 h-12 text-amber-400" />
                  ) : (
                    <Filter className="w-12 h-12 text-amber-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">
                  {searchTerm ? (
                    t.noResults
                  ) : (
                    language === 'ar' ? 'لا توجد عناصر في هذه الفئة' :
                    language === 'fa' ? 'موردی در این دسته یافت نشد' :
                    language === 'ku' ? 'هیچ شتێک لەم جۆرە نییە' :
                    language === 'tr' ? 'Bu kategoride öğe bulunamadı' :
                    language === 'ur' ? 'اس کیٹگری میں کوئی آئٹم نہیں ملا' :
                    language === 'kmr' ? 'Di vê kategoriyê de tiştek nehat dîtin' :
                    'No items found in this category'
                  )}
                </h3>
                {searchTerm && (
                  <div className="space-y-4">
                    <p className="text-amber-600">
                      {language === 'ar' ? 'جرب البحث بكلمات مختلفة أو تصفح الفئات' :
                       language === 'fa' ? 'با کلمات مختلف جستجو کنید یا دسته‌ها را مرور کنید' :
                       language === 'ku' ? 'بە وشەی جیاواز بگەڕێ یان جۆرەکان ببینە' :
                       language === 'tr' ? 'Farklı kelimelerle arayın veya kategorilere göz atın' :
                       language === 'ur' ? 'مختلف الفاظ سے تلاش کریں یا کیٹگریز دیکھیں' :
                       language === 'kmr' ? 'Bi gotinên cuda bigerin an jî kategorîyan bibînin' :
                       'Try searching with different words or browse categories'}
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
                    >
                      {language === 'ar' ? 'مسح البحث' :
                       language === 'fa' ? 'پاک کردن جستجو' :
                       language === 'ku' ? 'گەڕان پاک بکەرەوە' :
                       language === 'tr' ? 'Aramayı Temizle' :
                       language === 'ur' ? 'تلاش صاف کریں' :
                       language === 'kmr' ? 'Lêgerînê Paqij Bike' :
                       'Clear Search'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
          </div>
        </main>
        
        {/* Food Safety Notice */}
        <div className="bg-amber-50 border-t border-amber-200 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">{t.footer?.notice || t.notice}</span> {t.footer?.foodSafetyNotice || t.foodSafetyNotice}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
  {/* Shared Footer */}
  <Footer />

        {/* Order Online Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Order Online</h3>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6 text-center">
                  Choose your preferred delivery platform for pickup or delivery
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleDeliveryPlatform('ubereats')}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Uber Eats
                  </button>
                  
                  <button
                    onClick={() => handleDeliveryPlatform('doordash')}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    DoorDash
                  </button>
                  
                  <button
                    onClick={() => handleDeliveryPlatform('slice')}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Slice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to top button */}
        {isScrolled && (
          <button
            onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
        </div>
    </>
  )
}

export default FullMenuPage



