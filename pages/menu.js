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

  // Enhanced getText function that handles multilingual objects
  const getText = useCallback((textObj, fallbackKey = '') => {
    const result = tGet(textObj, language, fallbackKey);
    // console.log('getText:', textObj, 'lang:', language, 'result:', result); // Debug log
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
        kmr: 'Bîryanî ya Perde'
      }, 
      category: {
        en: 'Specialty',
        ar: 'أطباق مميزة',
        fa: 'غذاهای ویژه',
        ku: 'خۆراکی تایبەتی',
        tr: 'Özel Yemekler',
        ur: 'خصوصی ڈشز',
        kmr: 'Xwarinên Taybet'
      }, 
      placeholder: 'biryani', 
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=200&fit=crop',
      description: {
        en: 'Traditional layered rice dish with aromatic spices and tender meat',
        ar: 'طبق أرز طبقي تقليدي بالتوابل العطرية واللحم الطري',
        fa: 'غذای سنتی برنج لایه‌ای با ادویه‌جات معطر و گوشت نرم',
        ku: 'خۆراکی نەریتی برنجی چینە چینە لەگەڵ بەهاراتی بۆنخۆش و گۆشتی نەرم',
        tr: 'Aromatik baharat ve yumuşak etle geleneksel katmanlı pirinç yemeği',
        ur: 'خوشبودار مصالحوں اور نرم گوشت کے ساتھ روایتی تہدار چاول کا کھانا',
        kmr: 'Xwarinê kevneşopî ya brincê çîndar bi baharatên bêhnxweş û goştê nerm'
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
        kmr: 'Kebaba Dagirtî'
      }, 
      category: {
        en: 'Grill',
        ar: 'مشاوي',
        fa: 'کباب و گریل',
        ku: 'پلێتەری گرێل',
        tr: 'Izgara Tabaklar',
        ur: 'گرل پلیٹرز',
        kmr: 'Platerên Grill'
      }, 
      placeholder: 'kebab', 
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop',
      description: {
        en: 'Beef and lamb kabab flavored with garlic, spicy peppers, and parsley',
        ar: 'كباب لحم بقر وخروف منكه بالثوم والفلفل الحار والبقدونس',
        fa: 'کباب گوشت گاو و بره با طعم سیر، فلفل تند و جعفری',
        ku: 'کەبابی گۆشتی گا و بەرخ بە تامی سیر، بیبەری تەند و جەعدە',
        tr: 'Sarımsak, acı biber ve maydanozla tatlandırılmış dana ve kuzu kebap',
        ur: 'لہسن، تیز مرچ اور دھنیے سے ذائقہ دار گائے اور بھیڑ کا کباب',
        kmr: 'Kebaba goştê ga û berxî ya bi sîr, biberên tûj û şînî hatiye tamdar kirin'
      },
      color: '#A0522D'
    },
    { 
      id: 1301, 
      name: {
        en: 'Margherita Pizza',
        ar: 'بيتزا مارغريتا',
        fa: 'پیتزا مارگاریتا',
        ku: 'پیتزای مارگەریتا',
        tr: 'Margherita Pizza',
        ur: 'مارگاریٹا پیزا',
        kmr: 'Pizza Margherita'
      }, 
      category: {
        en: 'Pizza',
        ar: 'بيتزا',
        fa: 'پیتزا',
        ku: 'پیتزا',
        tr: 'Pizza',
        ur: 'پیزا',
        kmr: 'Pizza'
      }, 
      placeholder: 'pizza', 
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
      description: {
        en: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
        ar: 'بيتزا إيطالية كلاسيكية مع موزاريلا طازجة وطماطم وريحان',
        fa: 'پیتزا کلاسیک ایتالیایی با موتزارلا تازه، گوجه و ریحان',
        ku: 'پیتزای ئیتاڵی کلاسیک لەگەڵ موزارێلای تازە، تەماتە و ڕێحان',
        tr: 'Taze mozzarella, domates ve fesleğenle klasik İtalyan pizzası',
        ur: 'تازہ موزاریلا، ٹماٹر اور تلسی کے ساتھ کلاسک اطالوی پیزا',
        kmr: 'Pizza Îtalî ya klasîk bi mozzarellaya taze, firangoş û rêhanê'
      },
      color: '#FF8C42'
    },
    { 
      id: 1001, 
      name: {
        en: 'Hummus with Pita',
        ar: 'حمص مع الخبز',
        fa: 'حمص با نان پیتا',
        ku: 'حومس لەگەڵ نانی پیتا',
        tr: 'Pide ile Humus',
        ur: 'پیٹا کے ساتھ حمص',
        kmr: 'Humus bi Nanê Pita'
      }, 
      category: {
        en: 'Appetizer',
        ar: 'مقبلات',
        fa: 'پیش‌غذا',
        ku: 'خۆراکی پێش‌خواردن',
        tr: 'Başlangıç',
        ur: 'سٹارٹر',
        kmr: 'Destpêk'
      }, 
      placeholder: 'hummus', 
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      description: {
        en: 'Creamy chickpea dip with tahini, olive oil, and warm pita bread',
        ar: 'غموس الحمص الكريمي مع الطحينة وزيت الزيتون والخبز الدافئ',
        fa: 'دیپ خامه‌ای نخود با طحینه، روغن زیتون و نان پیتای گرم',
        ku: 'دیپی کرێمی نۆک لەگەڵ تەحینە، زەیتی زەیتوون و نانی پیتای گەرم',
        tr: 'Tahin, zeytinyağı ve sıcak pide ile kremalı nohut ezme',
        ur: 'تاہینی، زیتون کا تیل اور گرم پیٹا بریڈ کے ساتھ کریمی چنے کا ڈپ',
        kmr: 'Dîpa krêmî ya noyan bi tahînî, zeyta zeytûnê û nanê pita yê germ'
      },
      color: '#D2B48C'
    },
    { 
      id: 1501, 
      name: {
        en: 'Grilled Salmon',
        ar: 'سلمون مشوي',
        fa: 'ماهی سالمون کبابی',
        ku: 'ماسی سەلمۆنی گرێلکراو',
        tr: 'Izgara Somon',
        ur: 'گرل شدہ سالمن',
        kmr: 'Salmûnê Grîlkirî'
      }, 
      category: {
        en: 'Fish',
        ar: 'سمك',
        fa: 'ماهی',
        ku: 'ماسی',
        tr: 'Balık',
        ur: 'مچھلی',
        kmr: 'Masî'
      }, 
      placeholder: 'salmon', 
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      description: {
        en: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon',
        ar: 'سلمون الأطلسي الطازج مشوي إلى الكمال مع الأعشاب والليمون',
        fa: 'ماهی سالمون اطلس تازه که با گیاهان و لیمو به کمال کباب شده',
        ku: 'ماسی سەلمۆنی ئەتڵەسی تازە بە گیا و لیمۆ بە تەواوی گرێلکراو',
        tr: 'Otlar ve limonla mükemmelliğe kadar ızgara edilmiş taze Atlantik somonu',
        ur: 'جڑی بوٹیوں اور لیموں کے ساتھ کمال تک گرل کیا گیا تازہ اٹلانٹک سالمن',
        kmr: 'Salmûnê Atlantîkê taze bi gîha û lîmonê heta bi temamî hatiye grîlkirin'
      },
      color: '#FF6B6B'
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
        kmr: 'Beqlawa'
      }, 
      category: {
        en: 'Dessert',
        ar: 'حلويات',
        fa: 'دسر',
        ku: 'شیرینی',
        tr: 'Tatlı',
        ur: 'میٹھا',
        kmr: 'Şîrînî'
      }, 
      placeholder: 'baklava', 
      imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop',
      description: {
        en: 'Sweet pastry with layers of nuts and honey in delicate phyllo',
        ar: 'معجنات حلوة مع طبقات من المكسرات والعسل في عجينة فيلو الرقيقة',
        fa: 'شیرینی خمیری با لایه‌هایی از آجیل و عسل در فیلوی ظریف',
        ku: 'شیرینییەکی خەمیری لەگەڵ چینە چینە گوێز و هەنگوین لە فیلۆی ناسک',
        tr: 'İnce yufka içinde fındık ve bal katmanları ile tatlı hamur işi',
        ur: 'نازک فیلو میں گری اور شہد کی تہوں کے ساتھ میٹھی پیسٹری',
        kmr: 'Pîrokek şîrîn bi çînên gûz û hingivê di fîloya nazik de'
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
        kmr: 'Sandwîça Şawermaya Mirîşk'
      }, 
      category: {
        en: 'Sandwich',
        ar: 'سندويش',
        fa: 'ساندویچ',
        ku: 'ساندویچ',
        tr: 'Sandviç',
        ur: 'سینڈوچ',
        kmr: 'Sandwîç'
      }, 
      placeholder: 'shawarma', 
      imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=200&fit=crop',
      description: {
        en: 'Tender marinated chicken wrapped in fresh pita with vegetables and sauce',
        ar: 'دجاج متبل طري ملفوف في خبز البيتا الطازج مع الخضروات والصلصة',
        fa: 'مرغ مزه‌دار نرم پیچیده در نان پیتای تازه با سبزیجات و سس',
        ku: 'مریشکی نەرمی تامدراو لە نانی پیتای تازە پێچراوەتەوە لەگەڵ سەوزە و سۆس',
        tr: 'Taze pidede sebze ve sosla sarılmış yumuşak marine tavuk',
        ur: 'تازہ پیٹا میں سبزیوں اور ساس کے ساتھ لپیٹا گیا نرم میرینیٹ چکن',
        kmr: 'Mirîşkê nerm ê marînekirî di nanê pita yê taze de bi sebze û soşê hatiye pêçandin'
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
        kmr: 'Çaya Karak'
      }, 
      category: {
        en: 'Hot Drinks',
        ar: 'المشروبات الساخنة',
        fa: 'نوشیدنی‌های گرم',
        ku: 'خواردنەوەکانی گەرەم',
        tr: 'Sıcak İçecekler',
        ur: 'گرم مشروبات',
        kmr: 'Vexwarinên Germ'
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
        kmr: 'Çaya baharatdar bi şîr û hêl, hezkirina kevneşopî ya Rojhilatê Navîn'
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
      }, 3500); // Slightly faster rotation for better engagement with larger circles

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
      restaurantBadge: 'Authentic Kurdish Restaurant',
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
        pizza: 'Pizza', 
        fish: 'Fish', 
        grill: 'Grill Platters', 
        specialty: 'Specialty Dishes', 
        kids: "Kid's Menu", 
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
      restaurantBadge: 'چێشتخانەی ڕەسەنی کوردی',
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
        pizza: 'پیتزا', 
        fish: 'ماسی', 
        grill: 'پلێتەری گرێل', 
        specialty: 'خۆراکی تایبەتی', 
        kids: 'مێنیوی منداڵان', 
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
        blunari: 'بلوناری ئای ئای'
      }
    },
    ar: { 
      title: 'رحلتنا الطهوية', 
      subtitle: 'اكتشف النكهات الأصيلة المُحضرة بشغف وتقليد',
      restaurantBadge: 'مطعم أصيل كردي',
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
        pizza: 'بيتزا', 
        fish: 'سمك', 
        grill: 'مشاوي', 
        specialty: 'أطباق مميزة', 
        kids: 'قائمة الأطفال', 
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
        blunari: 'بلوناري الذكي'
      }
    },
    fa: { 
      title: 'سفر آشپزی ما', 
      subtitle: 'طعم‌های اصیل ساخته شده با عشق و سنت را کشف کنید',
      restaurantBadge: 'رستوران اصیل کردی',
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
        pizza: 'پیتزا', 
        fish: 'ماهی', 
        grill: 'کباب و گریل', 
        specialty: 'غذاهای ویژه', 
        kids: 'منوی کودکان', 
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
        blunari: 'بلوناری هوشمند'
      }
    },
    tr: { 
      title: 'Mutfak Yolculuğumuz', 
      subtitle: 'Tutku ve gelenekle hazırlanmış otantik lezzetleri keşfedin',
      restaurantBadge: 'Otantik Kürt Restoranı',
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
        pizza: 'Pizza', 
        fish: 'Balık', 
        grill: 'Izgara Tabaklar', 
        specialty: 'Özel Yemekler', 
        kids: 'Çocuk Menüsü', 
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
        blunari: 'Blunari Akıllı'
      }
    },
    ur: { 
      title: 'ہمارا پکوان کا سفر', 
      subtitle: 'جذبے اور روایت سے تیار کردہ اصل ذائقوں کو دریافت کریں',
      restaurantBadge: 'اصل کرد ریستوران',
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
        pizza: 'پیزا', 
        fish: 'مچھلی', 
        grill: 'گرل پلیٹرز', 
        specialty: 'خصوصی ڈشز', 
        kids: 'بچوں کا مینیو', 
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
        blunari: 'Blunari سمارٹ'
      }
    },
    kmr: { 
      title: 'Rêwîtiya Aşpêjiya Me', 
      subtitle: 'Tamên orijînal ên bi hez û nerdî hatine çêkirin keşf bikin',
      restaurantBadge: 'Xwaringeha Kurd a Resen',
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
        pizza: 'Pizza', 
        fish: 'Masî', 
        grill: 'Platerên Grill', 
        specialty: 'Xwarinên Taybet', 
        kids: 'Menûya Zarokan', 
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
        blunari: 'Blunari Smart'
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
        kmr: 'Humus'
      }, 
      description: { 
        en: 'A classic Middle Eastern dip made from mashed chickpeas, tahini, olive oil, lemon juice, and garlic.',
        ar: 'غموس شرق أوسطي كلاسيكي مصنوع من الحمص المهروس والطحينة وزيت الزيتون وعصير الليمون والثوم.',
        fa: 'یک دیپ کلاسیک خاورمیانه‌ای از نخود له شده، طحینی، روغن زیتون، آب لیمو و سیر.',
        ku: 'دیپێکی کلاسیکی ڕۆژهەڵاتی ناوەڕاست لە نۆکی کوتراو، تەحینی، زەیتی زەیتوون، شیری لیمۆ و سیر.',
        tr: 'Ezilmiş nohut, tahin, zeytinyağı, limon suyu ve sarımsaktan yapılan klasik Orta Doğu mezesi.',
        ur: 'چنے، تل کا پیسٹ، زیتون کا تیل، لیموں کا رس اور لہسن سے بنا کلاسک مشرق وسطیٰ کا ڈپ۔',
        kmr: 'Mezeyeke klasîk ya Rojhilatê Navîn ku ji kurskotan, tahînî, zeyta zeytûnê, ava lîmonê û sîr tê çêkirin.'
      }, 
      price: '$8.50', 
      category: 'appetizers', 
      popular: true, 
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
        kmr: 'Baba Ganuş'
      }, 
      description: { 
        en: 'A Kurdish dip made from roasted eggplant, roasted tomatoes, peppers, fresh onions, parsley, mint, and pomegranate molasses dressing.',
        ar: 'غموس كردي مصنوع من الباذنجان المشوي والطماطم المشوية والفلفل والبصل الطازج والبقدونس والنعناع وصلصة دبس الرمان.',
        fa: 'یک دیپ کردی از بادمجان کبابی، گوجه کبابی، فلفل، پیاز تازه، جعفری، نعنا و سس انار.',
        ku: 'دیپێکی کوردی لە بادەمجانی برژاو، تەماتەی برژاو، بیبەر، پیازی تازە، جەعدە، پونگ و سۆسی هەنار.',
        tr: 'Közlenmiş patlıcan, közlenmiş domates, biber, taze soğan, maydanoz, nane ve nar ekşisi sosundan yapılan Kürt mezesi.',
        ur: 'بھنے ہوئے بینگن، بھنے ہوئے ٹماٹر، مرچ، تازہ پیاز، دھنیا، پودینہ اور انار کے شیرے سے بنا کردش ڈپ۔',
        kmr: 'Mezeyeke Kurdî ya ku ji bacanê şewitî, firangoşê şewitî, biber, pîvazên taze, şînî, pûng û soşa henarê tê çêkirin.'
      }, 
      price: '$8.50', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1003, 
      name: { 
        en: 'Cool Bulgur Garden',
        ar: 'حديقة البرغل الباردة',
        fa: 'باغ برغل خنک',
        ku: 'باخچەی بورگولی ساردەوە',
        tr: 'Soğuk Bulgur Bahçesi',
        ur: 'ٹھنڈا بلغور گارڈن',
        kmr: 'Baxçeya Bulgur ya Sar'
      }, 
      description: { 
        en: 'A light and nutritious dip made with yogurt, bulgur, tahini, lemon juice, and iceberg lettuce.',
        ar: 'غموس خفيف ومغذي مصنوع من الزبادي والبرغل والطحينة وعصير الليمون وخس الجبل الجليدي.',
        fa: 'یک دیپ سبک و مغذی از ماست، برغل، طحینی، آب لیمو و کاهو یخی.',
        ku: 'دیپێکی سووک و بەهێز لە مۆست، بورگول، تەحینی، شیری لیمۆ و خسی قەڵەمی.',
        tr: 'Yoğurt, bulgur, tahin, limon suyu ve buzdolabı marulundan yapılan hafif ve besleyici meze.',
        ur: 'دہی، بلغور، تل کا پیسٹ، لیموں کا رس اور آئس برگ لیٹس سے بنا ہلکا اور غذائیت سے بھرپور ڈپ۔',
        kmr: 'Mezeyeke sivik û xwînmaye ku ji mastê, bulgur, tahînî, ava lîmonê û salata qelemî tê çêkirin.'
      }, 
      price: '$8.50', 
      category: 'appetizers', 
      tags: ['vegetarian'] 
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
        kmr: 'Kibbeh'
      }, 
      description: { 
        en: 'A Middle Eastern classic with a crispy outer shell made from finely ground rice and spices, encasing a flavorful minced meat filling. Fried to perfection, Kibbeh adds a rich aroma and unique taste to your dining experience.',
        ar: 'كلاسيكية شرق أوسطية بقشرة خارجية مقرمشة مصنوعة من الأرز المطحون ناعماً والبهارات، تحتوي على حشوة لحم مفروم نكهة. مقلية إلى الكمال، الكبة تضيف رائحة غنية وطعم فريد لتجربة تناول الطعام.',
        fa: 'یک کلاسیک خاورمیانه‌ای با پوسته بیرونی ترد از برنج آسیاب شده و ادویه‌جات، حاوی گوشت چرخ کرده طعم‌دار. سرخ شده تا کمال، کبه عطر غنی و طعم منحصر به فرد به تجربه غذایی شما می‌افزاید.',
        ku: 'کلاسیکێکی ڕۆژهەڵاتی ناوەڕاست بە قاڵبێکی دەرەوەی ترسکە لە برنجی وردکراو و بەهارات، دەوری گۆشتی وردکراوی بەتام دەگرێت. بە تەواوی سوورکراوە، کبه بۆنێکی دەوڵەمەند و تامێکی ناوازە زیاد دەکات بۆ ئەزموونی خواردنت.',
        tr: 'İnce öğütülmüş pirinç ve baharatlardan yapılan çıtır dış kabuğu olan, lezzetli kıyma doldurulmuş Orta Doğu klasiği. Mükemmelliğe kadar kızartılan Kibbeh, yemek deneyiminize zengin bir aroma ve eşsiz bir tat katıyor.',
        ur: 'باریک پسے ہوئے چاول اور مصالحوں سے بنا کرسپی بیرونی خول کے ساتھ مشرق وسطیٰ کا کلاسک، جس میں ذائقہ دار قیمہ بھرا ہوا ہے۔ کمال تک تلا ہوا، کبہ آپ کے کھانے کے تجربے میں بھرپور خوشبو اور منفرد ذائقہ شامل کرتا ہے۔',
        kmr: 'Klasîkeke Rojhilatê Navîn bi kabrikek derve yê çitir ku ji brincê xweş hatî hêsandin û baharatan hatî çêkirin, ku goştê hûrkirî yê bi tam tê de hatiye dagirtin. Heta bi temamî hatiye sorkirin, Kibbeh bêhnek dewlemend û tamek bêhempa li ser ezmûna xwarinê zêde dike.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
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
        kmr: 'Falafel'
      }, 
      description: { 
        en: 'Consists of chickpea patties seasoned with aromatic spices and fried to a golden, crispy exterior. Served with fresh greens and a drizzle of olive oil. This delightful snack adds a delicious touch to your dining experience.',
        ar: 'يتكون من أقراص الحمص المتبلة بالتوابل العطرية والمقلية إلى لون ذهبي مقرمش من الخارج. يُقدم مع الخضروات الطازجة ورذاذ من زيت الزيتون. هذه الوجبة الخفيفة اللذيذة تضيف لمسة لذيذة لتجربة تناول الطعام.',
        fa: 'شامل کتلت‌های نخود طعم‌دار شده با ادویه‌جات معطر و سرخ شده تا بیرون طلایی و ترد. با سبزیجات تازه و قطره‌ای از روغن زیتون سرو می‌شود. این تنقلات لذیذ لمسه‌ای خوشمزه به تجربه غذایی شما می‌افزاید.',
        ku: 'پێکهاتووە لە پەتی نۆک کە بە بەهاراتی بۆنخۆش تامدراوە و سوورکراوە بۆ دەرەوەیەکی ئاڵتوونی و ترسکە. لەگەڵ سەوزەی تازە و دڵۆپەیەک زەیتی زەیتوون خراوەتە سەر. ئەم خۆراکە خۆشە لمسەیەکی خۆش زیاد دەکات بۆ ئەزموونی خواردنت.',
        tr: 'Aromatik baharatlarla tatlandırılmış ve altın sarısı, çıtır bir dış kısım elde edene kadar kızartılmış nohut köftelerinden oluşur. Taze yeşillikler ve bir tutam zeytinyağı ile servis edilir. Bu lezzetli atıştırmalık, yemek deneyiminize lezzetli bir dokunuş katıyor.',
        ur: 'خوشبودار مصالحوں کے ساتھ ذائقہ دار چنے کے پیٹی پر مشتمل ہے اور سنہری، کرسپی بیرونی حصے تک تلا جاتا ہے۔ تازہ سبزیوں اور زیتون کے تیل کے چھڑکاؤ کے ساتھ پیش کیا جاتا ہے۔ یہ لذیذ اسنیک آپ کے کھانے کے تجربے میں ایک لذیذ ٹچ شامل کرتا ہے۔',
        kmr: 'Ji pelên kurskotinê pêk tê ku bi baharatên bêhnxweş hatine tatdarkirin û heta dereke zêrîn û çitir hatine sorkirin. Bi sebzeyên taze û tiliyeke zeyta zeytûnê tê peşkêşkirin. Ev xwarinê xweş lêdanek tatdar li ser ezmûna xwarinê zêde dike.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1006, 
      name: { 
        en: "Nature's Blend",
        ar: 'خليط الطبيعة',
        fa: 'ترکیب طبیعت',
        ku: 'تێکەڵی سروشت',
        tr: 'Doğanın Karışımı',
        ur: 'فطرت کا مرکب',
        kmr: 'Tevahiya Xwezayê'
      }, 
      description: { 
        en: 'A savory dip made with dried tomatoes, fresh thyme, walnuts, white, and olive oil.',
        ar: 'غموس مالح مصنوع من الطماطم المجففة والزعتر الطازج والجوز والأبيض وزيت الزيتون.',
        fa: 'یک دیپ خوشمزه از گوجه خشک، آویشن تازه، گردو، سفید و روغن زیتون.',
        ku: 'دیپێکی خۆش لە تەماتەی وشککراو، جەعدەی تازە، گوێز، سپی و زەیتی زەیتوون.',
        tr: 'Kurutulmuş domates, taze kekik, ceviz, beyaz ve zeytinyağından yapılan lezzetli meze.',
        ur: 'خشک ٹماٹر، تازہ جعفری، اخروٹ، سفید اور زیتون کے تیل سے بنا مزیدار ڈپ۔',
        kmr: 'Mezeyeke bi tam ku ji firangoşên ziwa, sîrînkê taze, gihok, spî û zeyta zeytûnê tê çêkirin.'
      }, 
      price: '$8.99', 
      category: 'appetizers', 
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
        kmr: 'Borek'
      }, 
      description: { 
        en: 'Handmade Beef Borek is crafted with a rich filling and served with a special sauce. This delicious borek, with its crispy pastry and unique sauce, Leaves an unforgettable taste on the palate.',
        ar: 'البوريك اللحم البقري المصنوع يدوياً مصنوع بحشوة غنية ويُقدم مع صلصة خاصة. هذا البوريك اللذيذ، بمعجنه المقرمش وصلصته الفريدة، يترك طعماً لا ينسى على الحنك.',
        fa: 'بورک گوشت گاو دستساز با پر کردن غنی ساخته شده و با سس مخصوص سرو می‌شود. این بورک لذیذ با خمیر ترد و سس منحصر به فردش طعمی فراموش‌نشدنی روی کام می‌گذارد.',
        ku: 'بۆرکی گۆشتی گای دەستکرد بە پڕکردنەوەیەکی دەوڵەمەند دروستکراوە و لەگەڵ سۆسێکی تایبەت خراوەتە سەر. ئەم بۆرکە خۆشە، بە هەویرە ترسکەکەی و سۆسە ناوازەکەی، تامێکی لەبیرنەکراو لەسەر مل جێدەهێڵێت.',
        tr: 'El yapımı Dana Böreği zengin iç harçla hazırlanır ve özel sosla servis edilir. Çıtır hamuru ve eşsiz sosuyla bu lezzetli börek damakta unutulmaz bir tat bırakır.',
        ur: 'ہاتھ سے بنا بیف بورک بھرپور بھرائی کے ساتھ تیار کیا جاتا ہے اور خاص ساس کے ساتھ پیش کیا جاتا ہے۔ یہ لذیذ بورک اپنی کرسپی پیسٹری اور منفرد ساس کے ساتھ تالو پر ناقابل فراموش ذائقہ چھوڑتا ہے۔',
        kmr: 'Boreka Goştê Ga ya bi dest çêkirî bi dagirtineke dewlemend hatiye amade kirin û bi soşeke taybetî tê peşkêşkirin. Ev boreka bi tam, bi hêvîrê xwe yê çitir û soşa xwe ya bêhempa, tamek jibîrnekirin li ser devê dimîne.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      tags: [] 
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
        kmr: 'Komboa Destpêkan'
      }, 
      description: { 
        en: 'This platter brings together four of the most beloved mezze flavors from the Middle East, along with delicious falafel pastries. With its elegant presentation and magnificent aromas, it will add a delightful touch to your table.',
        ar: 'يجمع هذا الطبق أربعة من أحب نكهات المزة من الشرق الأوسط، إلى جانب فطائر الفلافل اللذيذة. بعرضه الأنيق وروائحه الرائعة، سيضيف لمسة رائعة إلى طاولتك.',
        fa: 'این بشقاب چهار طعم محبوب مزه از خاورمیانه را به همراه شیرینی‌های فلافل لذیذ گرد هم می‌آورد. با ارائه شیک و عطرهای شکوهمندش لمسه‌ای لذت‌بخش به میز شما اضافه خواهد کرد.',
        ku: 'ئەم قاپە چوار لە خۆشترین تامی مەزەی ڕۆژهەڵاتی ناوەڕاست کۆدەکاتەوە، لەگەڵ شیرینی فەلەفڵی خۆش. بە پێشکەشکردنی جوان و بۆنە شکۆدارەکانی، لمسەیەکی خۆش زیاد دەکات بۆ مێزەکەت.',
        tr: 'Bu tabak, lezzetli falafel hamur işleriyle birlikte Orta Doğu\'nun en sevilen dört meze lezzetini bir araya getiriyor. Zarif sunumu ve muhteşem aromalarıyla masanıza keyifli bir dokunuş katacak.',
        ur: 'یہ پلیٹر مشرق وسطیٰ کے چار سب سے محبوب مزے کے ذائقوں کو لذیذ فلافل پیسٹری کے ساتھ اکٹھا کرتا ہے۔ اپنی خوبصورت پریزنٹیشن اور شاندار خوشبوؤں کے ساتھ، یہ آپ کی میز میں خوشگوار ٹچ شامل کرے گا۔',
        kmr: 'Ev qabê çar tamên mezeyên herî dilxwaz ên Rojhilatê Navîn, digel şîrîniyên falafel ên bi tam, kom dike. Bi pêşkêşkirina xwe ya xweş û bêhnên xwe yên ecêb, dê lêdanek xweş li ser masaya we zêde bike.'
      }, 
      price: '$25.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian'] 
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
        kmr: 'Şorba Masûrkan'
      }, 
      description: { 
        en: 'A hearty and nutritious soup made with red lentils, onions, carrots, potatoes, and a blend of spices.',
        ar: 'شوربة شهية ومغذية مصنوعة من العدس الأحمر والبصل والجزر والبطاطس ومزيج من التوابل.',
        fa: 'سوپ مقوی و مغذی از عدس قرمز، پیاز، هویج، سیب‌زمینی و ترکیبی از ادویه‌جات.',
        ku: 'شۆربەیەکی بەهێز و بەتوانا لە نیسکی سوور، پیاز، گەزەر، پەتاتە و تێکەڵەیەک لە بەهارات.',
        tr: 'Kırmızı mercimek, soğan, havuç, patates ve baharat karışımı ile yapılan tok tutucu ve besleyici çorba.',
        ur: 'سرخ مسور، پیاز، گاجر، آلو اور مصالحوں کے مرکب سے بنا ہردل عزیز اور غذائیت سے بھرپور سوپ۔',
        kmr: 'Şorbayek xwêş û xwînbar ku ji masûrkên sor, pîvaz, gizer, kartol û tevahiya baharatan tê çêkirin.'
      }, 
      price: '$6.99', 
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
        kmr: 'Plata Gûsê Îraqî'
      }, 
      description: { 
        en: 'Beef wrap, thinly sliced and seasoned. Served with a fresh salad or fries upon choice.',
        ar: 'لفافة لحم البقر، مقطعة رقيقاً ومتبلة. تُقدم مع سلطة طازجة أو بطاطس مقلية حسب الاختيار.',
        fa: 'راپ گوشت گاو، نازک برش و طعم‌دار شده. با سالاد تازه یا سیب‌زمینی سرخ‌کرده به انتخاب سرو می‌شود.',
        ku: 'ڕاپی گۆشتی گا، بە باریکی پارچەپارچە و تامدراو. لەگەڵ سالادی تازە یان پەتاتەی سوورکراو بەپێی هەڵبژاردن.',
        tr: 'İnce dilimlenmiş ve baharatlanmış sığır eti sarması. Seçiminize göre taze salata veya patates kızartması ile servis edilir.',
        ur: 'باریک کٹا اور مصالحہ دار بیف ریپ۔ آپ کی پسند کے مطابق تازہ سلاد یا فرائز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Pêçankên goştê ga yên zok perçe û bi baharatan. Li gorî bijartina we bi salatayek taze an kartolên sor tê peşkêşkirin.'
      }, 
      price: { sandwich: '$15.99', platter: '$17.99' }, 
      category: 'sandwich_platter', 
      popular: true, 
      tags: [], 
      variants: ['sandwich', 'platter'] 
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
        kmr: 'Plata Mirîşkê'
      }, 
      description: { 
        en: 'Sliced, seasoned chicken wrap. Served with a side salad or fries upon choice.',
        ar: 'لفافة دجاج مقطعة ومتبلة. تُقدم مع سلطة جانبية أو بطاطس مقلية حسب الاختيار.',
        fa: 'راپ مرغ برش و طعم‌دار شده. با سالاد کناری یا سیب‌زمینی سرخ‌کرده به انتخاب سرو می‌شود.',
        ku: 'ڕاپی مریشکی پارچەپارچە و تامدراو. لەگەڵ سالادی لاتەنیشت یان پەتاتەی سوورکراو بەپێی هەڵبژاردن.',
        tr: 'Dilimlenmiş, baharatlanmış tavuk sarması. Seçiminize göre yan salata veya patates kızartması ile servis edilir.',
        ur: 'کٹا ہوا، مصالحہ دار چکن ریپ۔ آپ کی پسند کے مطابق سائیڈ سلاد یا فرائز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Pêçankên mirîşkê yên perçe û bi baharatan. Li gorî bijartina we bi salatayek kêlek an kartolên sor tê peşkêşkirin.'
      }, 
      price: { sandwich: '$14.99', platter: '$16.99' }, 
      category: 'sandwich_platter', 
      popular: true, 
      tags: [], 
      variants: ['sandwich', 'platter'] 
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
        kmr: 'Plata Falafelan'
      }, 
      description: { 
        en: 'Special chef made crispy falafel balls. Wrapped in soft pita bread, with fresh vegetables.',
        ar: 'كرات فلافل مقرمشة خاصة من صنع الشيف. ملفوفة في خبز البيتا الناعم، مع خضروات طازجة.',
        fa: 'کوفته‌های فلافل ترد مخصوص سرآشپز. در نان پیتای نرم پیچیده، با سبزیجات تازه.',
        ku: 'گۆڵەی فەلەفڵی ترسکەی تایبەتی دروستکراوی سەرچێشت. پێچراوەتەوە لە نانی پیتای نەرم، لەگەڵ سەوزەی تازە.',
        tr: 'Şefin özel yapımı çıtır falafel topları. Yumuşak pita ekmeği içinde taze sebzelerle sarılmış.',
        ur: 'شیف کے خاص بنائے ہوئے کرسپی فلافل بالز۔ نرم پیٹا بریڈ میں لپیٹے ہوئے، تازہ سبزیوں کے ساتھ۔',
        kmr: 'Giloyên falafel ên çitir ên taybet ên çêker. Di nanê pita yê nerm de pêçandî, bi sebzeyên taze.'
      }, 
      price: { sandwich: '$14.99', platter: '$16.99' }, 
      category: 'sandwich_platter', 
      popular: true, 
      tags: ['vegetarian', 'vegan'], 
      variants: ['sandwich', 'platter'] 
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
        kmr: 'Nanê Hewramî'
      }, 
      description: { 
        en: 'A delightful flatbread originating from Hawraman, traditionally baked to perfection and served warm.',
        ar: 'خبز مسطح رائع منشؤه من هەورامان، مخبوز تقليدياً إلى الكمال ويُقدم دافئاً.',
        fa: 'نان تختی لذیذ منشأ گرفته از هورامان، به طور سنتی تا کمال پخته شده و گرم سرو می‌شود.',
        ku: 'نانێکی خۆش کە لە هەورامانەوە سەرچاوەی گرتووە، بە شێوەی نەریتی بە تەواوی نانکراوە و گەرم خراوەتە سەر.',
        tr: 'Hawraman kökenli, geleneksel olarak mükemmelliğe kadar pişirilmiş ve sıcak servis edilen nefis düz ekmek.',
        ur: 'حورامان سے نکلی ہوئی لذیذ چپاتی، روایتی طور پر کمال تک پکائی گئی اور گرم پیش کی گئی۔',
        kmr: 'Nanê tekane yê xweş ku ji Hewramanê tê, bi awayê kevneşopî heta bi temamî hatiye pijandin û germ tê peşkêşkirin.'
      }, 
      price: '$2.99', 
      category: 'naan', 
      popular: true, 
      tags: ['vegetarian'] 
    },
    { 
      id: 1402, 
      name: { 
        en: 'Samoon',
        ar: 'صمون',
        fa: 'صمون',
        ku: 'سەموون',
        tr: 'Samun',
        ur: 'صمون',
        kmr: 'Samûn'
      }, 
      description: { 
        en: 'A delicious Middle Eastern bread, known for its soft and slightly chewy texture, often enjoyed with a variety of savory and sweet toppings.',
        ar: 'خبز شرق أوسطي لذيذ، معروف بملمسه الناعم والمطاطي قليلاً، غالباً ما يُستمتع به مع مجموعة متنوعة من الإضافات المالحة والحلوة.',
        fa: 'نان لذیذ خاورمیانه‌ای، به دلیل بافت نرم و کمی چسبناکش شناخته شده، اغلب با انواع روکش‌های شور و شیرین لذت برده می‌شود.',
        ku: 'نانێکی خۆشی ڕۆژهەڵاتی ناوەڕاست، بە دەمامکی نەرم و کەمێک چەقەڵی ناسراوە، زۆرجار لەگەڵ جۆراوجۆری رووپۆشی شۆر و شیرین چێژی لێوەردەگرێت.',
        tr: 'Yumuşak ve hafif çiğnenebilir dokusuyla tanınan lezzetli Orta Doğu ekmeği, genellikle çeşitli tuzlu ve tatlı soslarla keyifle yenir.',
        ur: 'لذیذ مشرق وسطیٰ کی روٹی، اپنی نرم اور ہلکی چپچپاہٹ کے لیے مشہور، اکثر مختلف نمکین اور میٹھے ٹاپنگز کے ساتھ لطف اٹھایا جاتا ہے۔',
        kmr: 'Nanê Rojhilatê Navîn ê bi tam, ku bi tekstura xwe ya nerm û kêm girêdayî nas dike, pir caran bi cûrbecûr sosên şor û şîrîn tê xwarin.'
      }, 
      price: '$2.99', 
      category: 'naan', 
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
        kmr: 'Kulera Kincî'
      }, 
      description: { 
        en: 'A type of flatbread made without the need for extensive kneading, known for its simplicity and soft, chewy texture.',
        ar: 'نوع من الخبز المسطح مصنوع بدون الحاجة لعجن مكثف، معروف ببساطته وملمسه الناعم والمطاطي.',
        fa: 'نوعی نان تخت که بدون نیاز به ورز گسترده ساخته می‌شود، به دلیل سادگی و بافت نرم و چسبناکش شناخته شده.',
        ku: 'جۆرێک لە نانی تەخت کە بەبێ پێویستی بە هەویرکردنی بەرفراوان دروستدەکرێت، بە سادەیی و دەمامکی نەرم و چەقەڵییەوە ناسراوە.',
        tr: 'Kapsamlı yoğurmaya ihtiyaç duymadan yapılan bir tür düz ekmek, sadeliği ve yumuşak, çiğnenebilir dokusuyla bilinir.',
        ur: 'ایک قسم کی چپاتی جو وسیع گوندھنے کی ضرورت کے بغیر بنائی جاتی ہے، اپنی سادگی اور نرم، چپچپاہٹ کے لیے مشہور۔',
        kmr: 'Cureyeke nanê tekane ku bêyî hewcedariya hevşandinê tê çêkirin, bi sadebûna xwe û tekstura xwe ya nerm û girêdayî tê nasîn.'
      }, 
      price: '$3.99', 
      category: 'naan', 
      tags: ['vegetarian'] 
    },

    // PIZZA
    { 
      id: 1501, 
      name: { 
        en: 'Margherita Pizza',
        ar: 'بيتزا مارغيريتا',
        fa: 'پیتزا مارگریتا',
        ku: 'پیتزای مارگەریتا',
        tr: 'Margherita Pizza',
        ur: 'مارگیریٹا پیزا',
        kmr: 'Pizza Margherita'
      }, 
      description: { 
        en: 'A classic Italian pizza topped with fresh mozzarella cheese, aromatic basil, and flavorful tomato sauce. The thin and crispy crust is lightly brushed with olive oil.',
        ar: 'بيتزا إيطالية كلاسيكية مغطاة بجبن الموزاريلا الطازج والريحان العطري وصلصة الطماطم النكهة. القشرة الرقيقة والمقرمشة مدهونة قليلاً بزيت الزيتون.',
        fa: 'پیتزای کلاسیک ایتالیایی با پنیر موزارلا تازه، ریحان معطر و سس گوجه طعم‌دار. خمیر نازک و ترد کمی با روغن زیتون برس شده.',
        ku: 'پیتزایەکی کلاسیکی ئیتاڵی بە پەنیری موزارێلای تازە، ڕەیحانی بۆنخۆش و سۆسی تەماتەی خۆش. قاڵبە باریک و ترسکەکە بە کەمێک زەیتی زەیتوون بەرسکراوە.',
        tr: 'Taze mozzarella peyniri, aromatik fesleğen ve lezzetli domates sosuyla kaplanmış klasik İtalyan pizzası. İnce ve çıtır hamur zeytinyağı ile hafifçe fırçalanmıştır.',
        ur: 'تازہ موزاریلا چیز، خوشبودار تلسی اور ذائقہ دار ٹماٹر ساس کے ساتھ کلاسک اطالوی پیزا۔ پتلا اور کرسپی کرسٹ ہلکا سا زیتون کے تیل سے برش کیا گیا ہے۔',
        kmr: 'Pizzayek Îtalî ya klasîk ku bi penîrê mozzarella yê taze, reyhanê bêhnxweş û soşa firangoşê ya bi tam hatiye daxuyandin. Hevîrê zok û çitir bi zeyta zeytûnê kêm hatiye firçekirin.'
      }, 
      price: '$13.99', 
      category: 'pizza', 
      popular: true, 
      tags: ['vegetarian'] 
    },
    { 
      id: 1502, 
      name: { 
        en: 'Kabab Pizza',
        ar: 'بيتزا الكباب',
        fa: 'پیتزا کباب',
        ku: 'پیتزای کەباب',
        tr: 'Kebap Pizza',
        ur: 'کباب پیزا',
        kmr: 'Pizza Kebab'
      }, 
      description: { 
        en: 'A savory pizza topped with thin slices of beef kabab, special sauce, iceberg lettuce, onions, cucumbers, and tomatoes. The crispy crust provides a perfect base for this fresh and flavorful combination.',
        ar: 'بيتزا مالحة مغطاة بشرائح رقيقة من كباب اللحم البقري وصلصة خاصة وخس الجبل الجليدي والبصل والخيار والطماطم. القشرة المقرمشة توفر قاعدة مثالية لهذا المزيج الطازج واللذيذ.',
        fa: 'پیتزای خوشمزه با برش‌های نازک کباب گوشت گاو، سس مخصوص، کاهو یخی، پیاز، خیار و گوجه‌فرنگی. خمیر ترد پایه‌ای عالی برای این ترکیب تازه و طعم‌دار فراهم می‌کند.',
        ku: 'پیتزایەکی خۆش بە پارچە باریکەکانی کەبابی گۆشتی گا، سۆسی تایبەت، خسی قەڵەمی، پیاز، خیار و تەماتە. قاڵبە ترسکەکە بنکەیەکی تەواو دابین دەکات بۆ ئەم تێکەڵە تازە و خۆشە.',
        tr: 'İnce dana kebap dilimleri, özel sos, buzdolabı marulu, soğan, salatalık ve domatesle kaplanmış lezzetli pizza. Çıtır hamur, bu taze ve lezzetli kombinasyon için mükemmel bir taban sağlar.',
        ur: 'بیف کباب کے پتلے ٹکڑوں، خاص ساس، آئس برگ لیٹس، پیاز، کھیرا اور ٹماٹر کے ساتھ لذیذ پیزا۔ کرسپی کرسٹ اس تازہ اور ذائقہ دار امتزاج کے لیے بہترین بیس فراہم کرتا ہے۔',
        kmr: 'Pizzayek bi tam ku bi perçeyên zok ên kebabê goştê ga, soşa taybet, salata qelemî, pîvaz, xiyar û firangoşan hatiye daxuyandin. Hevîrê çitir bingeheke temam ji bo vê tevahiya taze û bi tam peyda dike.'
      }, 
      price: '$16.99', 
      category: 'pizza', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 1503, 
      name: { 
        en: 'Chicken Pizza',
        ar: 'بيتزا الدجاج',
        fa: 'پیتزا مرغ',
        ku: 'پیتزای مریشک',
        tr: 'Tavuk Pizza',
        ur: 'چکن پیزا',
        kmr: 'Pizza Mirîşk'
      }, 
      description: { 
        en: 'A delightful pizza featuring tender chicken slices, special sauce, iceberg lettuce, onions, cucumbers, and tomatoes. The crispy crust enhances the fresh and savory flavors of this dish.',
        ar: 'بيتزا رائعة تحتوي على شرائح دجاج طرية وصلصة خاصة وخس الجبل الجليدي والبصل والخيار والطماطم. القشرة المقرمشة تعزز النكهات الطازجة والمالحة لهذا الطبق.',
        fa: 'پیتزای لذیذ با برش‌های نرم مرغ، سس مخصوص، کاهو یخی، پیاز، خیار و گوجه‌فرنگی. خمیر ترد طعم‌های تازه و خوشمزه این غذا را تقویت می‌کند.',
        ku: 'پیتزایەکی خۆش بە پارچە نەرمەکانی مریشک، سۆسی تایبەت، خسی قەڵەمی، پیاز، خیار و تەماتە. قاڵبە ترسکەکە تامە تازە و خۆشەکانی ئەم خۆراکە بەهێز دەکات.',
        tr: 'Yumuşak tavuk dilimleri, özel sos, buzdolabı marulu, soğan, salatalık ve domatesli keyifli pizza. Çıtır hamur, bu yemeğin taze ve lezzetli tatlarını artırır.',
        ur: 'نرم چکن کے ٹکڑوں، خاص ساس، آئس برگ لیٹس، پیاز، کھیرا اور ٹماٹر کے ساتھ لذیذ پیزا۔ کرسپی کرسٹ اس ڈش کے تازہ اور لذیذ ذائقوں کو بڑھاتا ہے۔',
        kmr: 'Pizzayek xweş bi perçeyên nerm ên mirîşk, soşa taybet, salata qelemî, pîvaz, xiyar û firangoşan. Hevîrê çitir tamên taze û xweş ên vê xwarinê zêde dike.'
      }, 
      price: '$15.99', 
      category: 'pizza', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 1504, 
      name: { 
        en: 'Lahmacun',
        ar: 'لحم بعجين',
        fa: 'لحم عجین',
        ku: 'لەحمەعەجین',
        tr: 'Lahmacun',
        ur: 'لحم عجین',
        kmr: 'Lahmacun'
      }, 
      description: { 
        en: 'A traditional dish made with a thin dough topped with a flavorful mixture of minced meat, onions, peppers, tomatoes, and spices. Served with lettuce, sumac onions, and lemon on the side.',
        ar: 'طبق تقليدي مصنوع من عجينة رقيقة مغطاة بخليط نكهة من اللحم المفروم والبصل والفلفل والطماطم والتوابل. يُقدم مع الخس وبصل السماق والليمون على الجانب.',
        fa: 'غذای سنتی با خمیر نازک روکش شده با مخلوط طعم‌دار گوشت چرخ کرده، پیاز، فلفل، گوجه‌فرنگی و ادویه‌جات. با کاهو، پیاز سماق و لیمو در کنار سرو می‌شود.',
        ku: 'خۆراکێکی نەریتی بە هەویری باریک کە بە تێکەڵەیەکی خۆشی گۆشتی وردکراو، پیاز، بیبەر، تەماتە و بەهارات داپۆشراوە. لەگەڵ خس، پیازی سوماق و لیمۆ لە لاتەنیشتەوە خراوەتە سەر.',
        tr: 'Kıyma, soğan, biber, domates ve baharat karışımı ile kaplanmış ince hamurdan yapılan geleneksel yemek. Marul, sumak soğanı ve limon ile yan tarafta servis edilir.',
        ur: 'پتلے آٹے سے بنا روایتی کھانا جس پر قیمہ، پیاز، مرچ، ٹماٹر اور مصالحوں کا ذائقہ دار مکسچر لگایا جاتا ہے۔ لیٹس، سماق پیاز اور لیموں کے ساتھ ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Xwarineke kevneşopî ku bi hevîreke zok hatiye çêkirin û bi tevahiyek bi tam a goştê hûrkirî, pîvaz, biber, firangoş û baharatan hatiye daxuyandin. Bi salata kesk, pîvazê sumaq û lîmonê li kêleka tê peşkêşkirin.'
      }, 
      price: '$15.99', 
      category: 'pizza', 
      tags: [] 
    },
    { 
      id: 1505, 
      name: { 
        en: 'Boat',
        ar: 'قارب',
        fa: 'قایق',
        ku: 'بەلەم',
        tr: 'Tekne',
        ur: 'کشتی',
        kmr: 'Keştî'
      }, 
      description: { 
        en: 'A pizza with a boat-shaped crust. Topped with cheese, sauce, and various ingredients. It\'s presented in a unique boat shape and often garnished with a variety of toppings.',
        ar: 'بيتزا بقشرة على شكل قارب. مغطاة بالجبن والصلصة ومكونات مختلفة. تُقدم في شكل قارب فريد وغالباً ما تُزين بمجموعة متنوعة من الإضافات.',
        fa: 'پیتزایی با خمیر قایقی شکل. با پنیر، سس و مواد مختلف روکش شده. به شکل قایق منحصر به فرد ارائه می‌شود و اغلب با انواع روکش تزیین می‌شود.',
        ku: 'پیتزایەک بە قاڵبی شێوەی بەلەم. بە پەنیر، سۆس و پێکهاتە جۆراوجۆرەکان داپۆشراوە. بە شێوەی بەلەمی ناوازە پێشکەش دەکرێت و زۆرجار بە جۆراوجۆری رووپۆش ڕازاوەتەوە.',
        tr: 'Tekne şeklinde hamurlu pizza. Peynir, sos ve çeşitli malzemelerle kaplanır. Eşsiz bir tekne şeklinde sunulur ve genellikle çeşitli soslarla süslenir.',
        ur: 'کشتی کی شکل والے کرسٹ کے ساتھ پیزا۔ چیز، ساس اور مختلف اجزاء کے ساتھ ٹاپ کیا گیا۔ یہ منفرد کشتی کی شکل میں پیش کیا جاتا ہے اور اکثر مختلف ٹاپنگز سے سجایا جاتا ہے۔',
        kmr: 'Pizzayek bi hevîreke wekî keştî. Bi penîr, soş û maddeyên cûrbecûr hatiye daxuyandin. Bi şêweya keştîyeke bêhempa tê peşkêşkirin û pir caran bi cûrbecûr sosên hatiye xemilandin.'
      }, 
      price: { kabab: '$16.99', chicken: '$15.99' }, 
      category: 'pizza', 
      tags: [], 
      variants: ['kabab', 'chicken'] 
    },
    { 
      id: 1506, 
      name: { 
        en: 'Veggie Pizza',
        ar: 'بيتزا الخضار',
        fa: 'پیتزا سبزیجات',
        ku: 'پیتزای سەوزە',
        tr: 'Sebzeli Pizza',
        ur: 'ویجی پیزا',
        kmr: 'Pizza Sebzeyan'
      }, 
      description: { 
        en: 'A delectable pizza loaded with an assortment of fresh, colorful vegetables and your choice of cheese, perfect for veggie lovers.',
        ar: 'بيتزا لذيذة محملة بتشكيلة من الخضروات الطازجة الملونة واختيارك من الجبن، مثالية لمحبي الخضار.',
        fa: 'پیتزای لذیذ پر از انواع سبزیجات تازه و رنگارنگ و پنیر انتخابی شما، عالی برای عاشقان سبزیجات.',
        ku: 'پیتزایەکی خۆش پڕ لە جۆراوجۆری سەوزەی تازە و ڕەنگاوڕەنگ و پەنیری هەڵبژاردەت، تەواو بۆ خۆشەویستانی سەوزە.',
        tr: 'Taze, renkli sebze çeşitleri ve seçtiğiniz peynirle dolu nefis pizza, sebze severler için mükemmel.',
        ur: 'تازہ، رنگین سبزیوں کی اقسام اور آپ کی پسند کے چیز سے بھرا لذیذ پیزا، سبزی پسندوں کے لیے بہترین۔',
        kmr: 'Pizzayek bi tam ku bi cûrbecûr sebzeyên taze û rengîn û penîrê vebijêrka te hatiye barkirî, ji bo hezkiriyanê sebzeyan temam.'
      }, 
      price: '$14.99', 
      category: 'pizza', 
      tags: ['vegetarian'] 
    },

    // FISH
    { 
      id: 1601, 
      name: { 
        en: 'Masgouf',
        ar: 'مسكوف',
        fa: 'مسکوف',
        ku: 'مەسگووف',
        tr: 'Mesguf',
        ur: 'مسگوف',
        kmr: 'Mesgûf'
      }, 
      description: { 
        en: 'Our special Iraqi style fish, marinated with a blend of spices, then slow-cooked to perfection over an open flame. (*Must be ordered a day before visit.)',
        ar: 'سمكنا العراقي الخاص، متبل بمزيج من التوابل، ثم مطبوخ ببطء إلى الكمال على نار مفتوحة. (*يجب طلبه قبل يوم من الزيارة.)',
        fa: 'ماهی مخصوص عراقی ما، با ترکیبی از ادویه‌جات مزه‌دار شده، سپس روی شعله آزاد به آرامی تا کمال پخته شده. (*باید یک روز قبل از بازدید سفارش داده شود.)',
        ku: 'ماسی تایبەتی عێراقیمان، بە تێکەڵەیەک لە بەهارات تامدراوە، پاشان بە هێواشی بەسەر ئاگری کراوەدا بە تەواوی لێنراوە. (*دەبێت ڕۆژێک پێش سەردان داوا بکرێت.)',
        tr: 'Baharat karışımı ile marine edilmiş özel Irak tarzı balığımız, ardından açık ateşte mükemmelliğe kadar yavaş pişirilmiş. (*Ziyaretten bir gün önce sipariş edilmelidir.)',
        ur: 'ہماری خاص عراقی طرز کی مچھلی، مصالحوں کے مرکب سے میرینیٹ کی گئی، پھر کھلی آگ پر آہستہ آہستہ کمال تک پکائی گئی۔ (*دورے سے ایک دن پہلے آرڈر کرنا ضروری ہے۔)',
        kmr: 'Masîyê me yê taybet ê şêwaza Îraqî, bi tevahiyek baharatan hatiye marînekirin, paşê li ser agirê vekirî hêdî hêdî heta bi temamî hatiye pijandin. (*Divê rojek berî serdanê were siparişkirin.)'
      }, 
      price: { serving2: '$39.99', serving4: '$74.99' }, 
      category: 'fish', 
      popular: true, 
      tags: [], 
      variants: ['serving2', 'serving4'],
      servingFor: { serving2: '2', serving4: '4' } 
    },

    // SPECIALTY DISHES
    { 
      id: 1701, 
      name: { 
        en: 'Parda Biryani',
        ar: 'برياني پاردا',
        fa: 'پرده بریانی',
        ku: 'پەردە بریانی',
        tr: 'Perde Biryani',
        ur: 'پردہ بریانی',
        kmr: 'Perde Biryani'
      }, 
      description: { 
        en: 'A rich dish of spiced rice, prepared with beef, dried grapes, almonds, peas, and potatoes, encased in a delicate layer of pastry and baked to perfection. Served with a fresh salad on the side.',
        ar: 'طبق غني من الأرز المتبل، محضر مع لحم البقر والعنب المجفف واللوز والبازلاء والبطاطس، مغلف بطبقة رقيقة من العجين ومخبوز إلى الكمال. يُقدم مع سلطة طازجة على الجانب.',
        fa: 'غذای غنی از برنج طعم‌دار، با گوشت گاو، کشمش، بادام، نخود فرنگی و سیب‌زمینی تهیه شده، در لایه‌ای ظریف از خمیر پوشانده و تا کمال پخته شده. با سالاد تازه در کنار سرو می‌شود.',
        ku: 'خۆراکێکی دەوڵەمەند لە برنجی تامدراو، لەگەڵ گۆشتی گا، ترێی وشککراو، بادەم، نۆک و پەتاتە ئامادەکراوە، لە چینێکی نازکی هەویردا پێچراوەتەوە و بە تەواوی نانکراوە. لەگەڵ سالادی تازە لە لاتەنیشتەوە خراوەتە سەر.',
        tr: 'Dana eti, kuru üzüm, badem, bezelye ve patatesle hazırlanmış baharatlı pirinçten oluşan zengin yemek, ince hamur tabakası ile kaplanmış ve mükemmelliğe kadar pişirilmiştir. Yan tarafta taze salata ile servis edilir.',
        ur: 'مصالحہ دار چاول کا بھرپور کھانا، گائے کا گوشت، خشک انگور، بادام، مٹر اور آلو کے ساتھ تیار کیا گیا، آٹے کی نازک تہ میں لپیٹا اور کمال تک پکایا گیا۔ ساتھ میں تازہ سلاد کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Xwarineke dewlemend a brincê bi baharatan, bi goştê ga, tiriyên ziwa, behîvan, nokan û kartolan hatiye amade kirin, di çîneke hevîrê nazik de hatiye pêçandin û heta bi temamî hatiye pijandin. Bi salatayek taze li kêleka tê peşkêşkirin.'
      }, 
      price: '$21.99', 
      category: 'specialty', 
      popular: true, 
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
        kmr: 'Qûzî'
      }, 
      description: { 
        en: 'A traditional Middle Eastern dish made with saffron rice and lamb, garnished with toasted almonds and fresh parsley.',
        ar: 'طبق شرق أوسطي تقليدي مصنوع من أرز الزعفران والخروف، مزين باللوز المحمص والبقدونس الطازج.',
        fa: 'غذای سنتی خاورمیانه‌ای از برنج زعفرانی و گوشت بره، با بادام برشته و جعفری تازه تزیین شده.',
        ku: 'خۆراکێکی نەریتی ڕۆژهەڵاتی ناوەڕاست لە برنجی زەعفەران و گۆشتی بەرخ، بە بادەمی برژاو و جەعدەی تازە ڕازاوەتەوە.',
        tr: 'Safran pirinci ve kuzu eti ile yapılan geleneksel Orta Doğu yemeği, kavrulmuş badem ve taze maydanoz ile süslenmiştir.',
        ur: 'زعفرانی چاول اور بھیڑ کے گوشت سے بنا روایتی مشرق وسطیٰ کا کھانا، بھنے ہوئے بادام اور تازہ دھنیے سے سجایا گیا۔',
        kmr: 'Xwarineke kevneşopî ya Rojhilatê Navîn ku ji brincê zefranî û goştê berxî hatiye çêkirin, bi behîvên şewitî û şînîyê taze hatiye xemilandin.'
      }, 
      price: '$24.99', 
      category: 'specialty', 
      popular: true, 
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
        kmr: 'Mendî'
      }, 
      description: { 
        en: 'A traditional Middle Eastern dish made with spiced rice and chicken. The chicken is cooked with the rice and topped with fresh parsley before serving. It is accompanied by special sauces.',
        ar: 'طبق شرق أوسطي تقليدي مصنوع من الأرز المتبل والدجاج. يُطبخ الدجاج مع الأرز ويُزين بالبقدونس الطازج قبل التقديم. يُرافقه صلصات خاصة.',
        fa: 'غذای سنتی خاورمیانه‌ای از برنج طعم‌دار و مرغ. مرغ با برنج پخته شده و قبل از سرو با جعفری تازه تزیین می‌شود. با سس‌های مخصوص همراه است.',
        ku: 'خۆراکێکی نەریتی ڕۆژهەڵاتی ناوەڕاست لە برنجی تامدراو و مریشک. مریشکەکە لەگەڵ برنجەکە لێدەنرێت و پێش خستنەسەر بە جەعدەی تازە ڕازاوەتەوە. لەگەڵ سۆسە تایبەتەکانەوە هاتووە.',
        tr: 'Baharatlı pirinç ve tavukla yapılan geleneksel Orta Doğu yemeği. Tavuk pirinçle birlikte pişirilir ve servis etmeden önce taze maydanoz ile süslenir. Özel soslar eşlik eder.',
        ur: 'مصالحہ دار چاول اور چکن سے بنا روایتی مشرق وسطیٰ کا کھانا۔ چکن چاول کے ساتھ پکایا جاتا ہے اور پیش کرنے سے پہلے تازہ دھنیے سے سجایا جاتا ہے۔ خاص ساسز کے ساتھ آتا ہے۔',
        kmr: 'Xwarineke kevneşopî ya Rojhilatê Navîn ku ji brincê bi baharatan û mirîşkê hatiye çêkirin. Mirîşk bi brincê re tê pijandin û berî peşkêşkirinê bi şînîyê taze tê xemilandin. Bi soşên taybet re tê.'
      }, 
      price: '$21.99', 
      category: 'specialty', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 1704, 
      name: { 
        en: 'Nature Kabab',
        ar: 'كباب الطبيعة',
        fa: 'کباب طبیعت',
        ku: 'کەبابی سروشت',
        tr: 'Doğa Kebabı',
        ur: 'نیچر کباب',
        kmr: 'Kebaba Xwezayê'
      }, 
      description: { 
        en: 'Roasted eggplant, cheddar cheese and garlic. Served with grilled kabab and fresh spices.',
        ar: 'باذنجان محمص وجبن الشيدر والثوم. يُقدم مع الكباب المشوي والتوابل الطازجة.',
        fa: 'بادمجان کبابی، پنیر چدار و سیر. با کباب گریل شده و ادویه‌های تازه سرو می‌شود.',
        ku: 'بادەمجانی برژاو، پەنیری چیدار و سیر. لەگەڵ کەبابی گرێلکراو و بەهاراتی تازە خراوەتە سەر.',
        tr: 'Közlenmiş patlıcan, çedar peyniri ve sarımsak. Izgara kebap ve taze baharatlarla servis edilir.',
        ur: 'بھنا ہوا بینگن، چیڈر چیز اور لہسن۔ گرل شدہ کباب اور تازہ مصالحوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Bacanê şewitî, penîrê çedar û sîr. Bi kebaba grîlkirî û baharatên taze tê peşkêşkirin.'
      }, 
      price: '$25.99', 
      category: 'specialty', 
      tags: [] 
    },
    { 
      id: 1705, 
      name: { 
        en: 'Qaliya',
        ar: 'قالية',
        fa: 'قلیه',
        ku: 'قەلیە',
        tr: 'Kale',
        ur: 'قالیہ',
        kmr: 'Qaliye'
      }, 
      description: { 
        en: 'A traditional stew made with beef and onions, simmered with rich spices and a savory sauce. The dish features a deep flavor resulting from the blend of beef and aromatic onions.',
        ar: 'طبق يخنة تقليدي مصنوع من لحم البقر والبصل، مطبوخ على نار هادئة مع توابل غنية وصلصة مالحة. يتميز الطبق بنكهة عميقة ناتجة عن مزيج لحم البقر والبصل العطري.',
        fa: 'خورشت سنتی از گوشت گاو و پیاز، با ادویه‌جات غنی و سس خوشمزه آرام پخت. این غذا طعم عمیقی از ترکیب گوشت گاو و پیاز معطر دارد.',
        ku: 'خۆراکێکی نەریتی لە گۆشتی گا و پیاز، لەگەڵ بەهاراتی دەوڵەمەند و سۆسێکی خۆش بە هێواشی کوڵاوە. خۆراکەکە تامێکی قووڵی هەیە کە لە تێکەڵی گۆشتی گا و پیازی بۆنخۆشەوە دێت.',
        tr: 'Dana eti ve soğanla yapılan geleneksel güveç, zengin baharatlar ve lezzetli sosla pişirilmiştir. Yemek, dana eti ve aromatik soğan karışımından kaynaklanan derin bir lezzete sahiptir.',
        ur: 'گائے کا گوشت اور پیاز سے بنا روایتی سٹو، بھرپور مصالحوں اور لذیذ ساس کے ساتھ آہستہ پکایا گیا۔ یہ ڈش گائے کے گوشت اور خوشبودار پیاز کے امتزاج سے گہرا ذائقہ رکھتا ہے۔',
        kmr: 'Xwarineke kevneşopî ku ji goştê ga û pîvazan hatiye çêkirin, bi baharatên dewlemend û soşeke bi tam hêdî hatiye pijandin. Xwarin ji tevahiya goştê ga û pîvazên bêhnxweş tameke kûr heye.'
      }, 
      price: '$22.99', 
      category: 'specialty', 
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
        kmr: 'Mîgoyê Tereya'
      }, 
      description: { 
        en: 'Shrimp sautéed with butter, mushrooms and garlic. Served with special spicy seasoning.',
        ar: 'جمبري مقلي مع الزبدة والفطر والثوم. يُقدم مع تتبيلة حارة خاصة.',
        fa: 'میگو با کره، قارچ و سیر تفت داده شده. با چاشنی تند مخصوص سرو می‌شود.',
        ku: 'میگۆ لەگەڵ کەرە، قارچ و سیر ساتێ کراوە. لەگەڵ چێشتکردنی تەند و تایبەت خراوەتە سەر.',
        tr: 'Tereyağı, mantar ve sarımsakla sote edilmiş karides. Özel baharatlı lezzet verici ile servis edilir.',
        ur: 'مکھن، مشروم اور لہسن کے ساتھ بھنا ہوا جھینگا۔ خاص مسالہ دار ذائقہ کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mîgo bi tereya, karkûşk û sîr hatiye sotekirî. Bi baharateke taybet a tûj tê peşkêşkirin.'
      }, 
      price: '$22.99', 
      category: 'specialty', 
      tags: [] 
    },
    { 
      id: 1707, 
      name: { 
        en: 'Village Carnival',
        ar: 'كرنفال القرية',
        fa: 'کارناوال روستا',
        ku: 'کارنیڤاڵی گوند',
        tr: 'Köy Karnavalı',
        ur: 'ولیج کارنیول',
        kmr: 'Karnavala Gund'
      }, 
      description: { 
        en: 'This best stew is a dish made with carefully selected fresh vegetables and tender pieces of meat. Slowly cooked to perfection. Served with aromatic saffron rice. It creates a memorable and satisfying dining experience.',
        ar: 'هذا الطبق الأفضل هو طبق مصنوع من خضروات طازجة مختارة بعناية وقطع لحم طرية. مطبوخ ببطء إلى الكمال. يُقدم مع أرز الزعفران العطري. يخلق تجربة طعام لا تُنسى ومُرضية.',
        fa: 'این بهترین خورشت غذایی است که با سبزیجات تازه به دقت انتخاب شده و تکه‌های نرم گوشت درست شده. آهسته تا کمال پخته شده. با برنج زعفرانی معطر سرو می‌شود. تجربه غذایی فراموش‌نشدنی و رضایت‌بخش ایجاد می‌کند.',
        ku: 'ئەم باشترین خۆراکە خۆراکێکە کە بە سەوزەی تازەی بە وردی هەڵبژێردراو و پارچە نەرمەکانی گۆشت دروستکراوە. بە هێواشی بە تەواوی لێنراوە. لەگەڵ برنجی زەعفەرانی بۆنخۆش خراوەتە سەر. ئەزموونێکی خواردنی لەبیرنەکراو و دڵخۆشکەر دروست دەکات.',
        tr: 'Bu en iyi güveç, özenle seçilmiş taze sebzeler ve yumuşak et parçalarıyla yapılan bir yemektir. Mükemmelliğe kadar yavaş pişirilmiştir. Aromatik safran pirinci ile servis edilir. Unutulmaz ve tatmin edici bir yemek deneyimi yaratır.',
        ur: 'یہ بہترین سٹو ایک ڈش ہے جو احتیاط سے منتخب کردہ تازہ سبزیوں اور گوشت کے نرم ٹکڑوں سے بنائی گئی ہے۔ آہستہ آہستہ کمال تک پکائی گئی۔ خوشبودار زعفرانی چاول کے ساتھ پیش کی جاتی ہے۔ یہ ایک یادگار اور اطمینان بخش کھانے کا تجربہ بناتا ہے۔',
        kmr: 'Ev xwaştrîn xwarin xwarineke ku bi sebzeyên taze yên bi baldarî hatine hilbijartin û perçeyên nerm ên goştî hatiye çêkirin. Hêdî hêdî heta bi temamî hatiye pijandin. Bi brincê zefranî yê bêhnxweş tê peşkêşkirin. Ezmûnek xwarinê ya jibîrnekirin û şaykirin çêdike.'
      }, 
      price: '$23.99', 
      category: 'specialty', 
      popular: true, 
      tags: [] 
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
        kmr: 'Şîş Kebaba Hewlêr'
      }, 
      description: { 
        en: 'A kabab made with a mix of lamb and beef, grilled to perfection. It is served with saffron rice, seasonal salad, sumac onions, and grilled vegetables.',
        ar: 'كباب مصنوع من خليط من لحم الخروف ولحم البقر، مشوي إلى الكمال. يُقدم مع أرز الزعفران وسلطة موسمية وبصل السماق والخضروات المشوية.',
        fa: 'کبابی از ترکیب گوشت بره و گاو، تا کمال کباب شده. با برنج زعفرانی، سالاد فصلی، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'کەبابێک لە تێکەڵی گۆشتی بەرخ و گا، بە تەواوی گرێلکراوە. لەگەڵ برنجی زەعفەران، سالادی وەرزی، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Kuzu ve dana eti karışımından yapılan, mükemmelliğe kadar ızgara edilmiş kebap. Safran pirinci, mevsim salatası, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'بھیڑ اور گائے کے گوشت کے مکسچر سے بنا کباب، کمال تک گرل کیا گیا۔ زعفرانی چاول، موسمی سلاد، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji tevahiya goştê berx û ga hatiye çêkirin, heta bi temamî hatiye grîlkirin. Bi brincê zefranî, salata werzeya, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.'
      }, 
      price: '$21.99', 
      category: 'grill', 
      popular: true, 
      tags: [] 
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
        kmr: 'Kebaba Dagirtî'
      }, 
      description: { 
        en: 'A kabab made with beef and lamb, flavored with garlic, spicy peppers, and parsley. It is served with a seasonal salad, saffron rice, sumac onions, and grilled vegetables.',
        ar: 'كباب مصنوع من لحم البقر والخروف، منكه بالثوم والفلفل الحار والبقدونس. يُقدم مع سلطة موسمية وأرز الزعفران وبصل السماق والخضروات المشوية.',
        fa: 'کبابی از گوشت گاو و بره، با سیر، فلفل تند و جعفری طعم‌دار شده. با سالاد فصلی، برنج زعفرانی، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'کەبابێک لە گۆشتی گا و بەرخ، بە سیر، بیبەری تەند و جەعدە تامدراوە. لەگەڵ سالادی وەرزی، برنجی زەعفەران، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Dana ve kuzu etinden yapılan, sarımsak, acı biber ve maydanozla tatlandırılmış kebap. Mevsim salatası, safran pirinci, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'گائے اور بھیڑ کے گوشت سے بنا کباب، لہسن، تیز مرچ اور دھنیے سے ذائقہ دار۔ موسمی سلاد، زعفرانی چاول، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji goştê ga û berxî hatiye çêkirin, bi sîr, biberên tûj û şînî hatiye tamdar kirin. Bi salata werzeya, brincê zefranî, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.'
      }, 
      price: '$21.99', 
      category: 'grill', 
      popular: true, 
      tags: [] 
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
        kmr: 'Kebaba Mirîşk'
      }, 
      description: { 
        en: 'Marinated chicken with spices, dried tomatoes, parsley, and fresh onions. Served with saffron rice, a mixed greens salad, sumac onions, and grilled vegetables.',
        ar: 'دجاج متبل بالتوابل والطماطم المجففة والبقدونس والبصل الطازج. يُقدم مع أرز الزعفران وسلطة الخضروات المختلطة وبصل السماق والخضروات المشوية.',
        fa: 'مرغ مزه‌دار شده با ادویه‌جات، گوجه خشک، جعفری و پیاز تازه. با برنج زعفرانی، سالاد سبزیجات مخلوط، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'مریشکی تامدراو بە بەهارات، تەماتەی وشک، جەعدە و پیازی تازە. لەگەڵ برنجی زەعفەران، سالادی سەوزەی تێکەڵ، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Baharat, kurutulmuş domates, maydanoz ve taze soğanla marine edilmiş tavuk. Safran pirinci, karışık yeşil salata, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'مصالحوں، خشک ٹماٹر، دھنیا اور تازہ پیاز کے ساتھ میرینیٹ چکن۔ زعفرانی چاول، ملے جلے سبزیوں کے سلاد، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mirîşkê bi baharatan, firangoşên ziwa, şînî û pîvazên taze hatiye marînekirin. Bi brincê zefranî, salata sebzeyên tevlihev, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.'
      }, 
      price: '$20.99', 
      category: 'grill', 
      popular: true, 
      tags: [] 
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
        kmr: 'Kebaba Çokertme'
      }, 
      description: { 
        en: 'Eggplant with yogurt topped with carefully prepared pita bread, thinly sliced rib eye pieces. Served with shoestring potatoes and special sauce.',
        ar: 'باذنجان مع اللبن مغطى بخبز البيتا المحضر بعناية، قطع الضلع الرقيقة. يُقدم مع البطاطس الشعرية وصلصة خاصة.',
        fa: 'بادمجان با ماست روکش شده با نان پیتای به دقت آماده شده، تکه‌های نازک ریب آی. با سیب‌زمینی نخی و سس مخصوص سرو می‌شود.',
        ku: 'بادەمجان لەگەڵ مۆست بە نانی پیتای بە وردی ئامادەکراو داپۆشراوە، پارچە باریکەکانی چاو ڕەشەوە. لەگەڵ پەتاتەی تەلی و سۆسی تایبەت خراوەتە سەر.',
        tr: 'Özenle hazırlanmış pita ekmeği ile kaplı yoğurtlu patlıcan, ince dilimlenmiş kaburga eti parçaları. Kıymalı patates ve özel sosla servis edilir.',
        ur: 'دہی کے ساتھ بینگن جس پر احتیاط سے تیار کیا گیا پیٹا بریڈ، باریک کٹے ہوئے ریب آئی کے ٹکڑے۔ شو سٹرنگ آلو اور خاص ساس کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Bacanê bi mastê ku bi nanê pita yê bi baldarî hatiye amade kirin hatiye daxuyandin, perçeyên zok ên çavreşê. Bi kartolên tel û soşa taybet tê peşkêşkirin.'
      }, 
      price: '$24.99', 
      category: 'grill', 
      tags: [] 
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
        kmr: 'Balên'
      }, 
      description: { 
        en: 'Grilled Wings a flavor sensation that will delight your taste buds! Served with aromatic saffron rice, fresh green salad, sumac-seasoned onions, and a medley of grilled vegetables. Don\'t miss out on this delectable combination!',
        ar: 'أجنحة مشوية إحساس بالنكهة سيسعد براعم التذوق لديك! تُقدم مع أرز الزعفران العطري وسلطة خضراء طازجة وبصل متبل بالسماق ومزيج من الخضروات المشوية. لا تفوت هذا المزيج اللذيذ!',
        fa: 'بال‌های کبابی احساس طعمی که ذائقه شما را خوشحال می‌کند! با برنج زعفرانی معطر، سالاد سبز تازه، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی سرو می‌شود. این ترکیب لذیذ را از دست ندهید!',
        ku: 'باڵە گرێلکراوەکان هەستێکی تامە کە ذائقەکەت خۆش دەکات! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی سەوزی تازە، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو خراوەتە سەر. ئەم تێکەڵە خۆشە لەدەست مەدە!',
        tr: 'Izgara Kanatlar damak zevkinizi memnun edecek bir lezzet hissi! Aromatik safran pirinci, taze yeşil salata, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile servis edilir. Bu lezzetli kombinasyonu kaçırmayın!',
        ur: 'گرل شدہ ونگز ایک ذائقہ کا احساس جو آپ کے ذائقہ کو خوش کرے گا! خوشبودار زعفرانی چاول، تازہ سبز سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ پیش کیا جاتا ہے۔ اس لذیذ امتزاج کو مت چھوڑیں!',
        kmr: 'Balên Grîlkirî hesteke tamê ku dê dilê we şad bike! Bi brincê zefranî yê bêhnxweş, salata kesk a taze, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî tê peşkêşkirin. Vê tevahiya xweş ji dest nedin!'
      }, 
      price: '$16.99', 
      category: 'grill', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 1806, 
      name: { 
        en: 'Beef Ribeye Tikka',
        ar: 'تيكا ريب آي لحم البقر',
        fa: 'تیکه ریب آی گوشت گاو',
        ku: 'تیکای ڕیب ئایی گۆشتی گا',
        tr: 'Dana Ribeye Tikka',
        ur: 'بیف ریب آئی ٹکہ',
        kmr: 'Tîkka Rîb Ayê Goştê Ga'
      }, 
      description: { 
        en: 'Beef Ribeye Tikka is the perfect choice for meat lovers! Paired with aromatic saffron rice, seasonal salad, sumac-seasoned onions, and a medley of grilled vegetables, it creates an unforgettable taste experience. Don\'t miss out on this unique flavor!',
        ar: 'تيكا ريب آي لحم البقر هو الخيار المثالي لمحبي اللحوم! مقترن مع أرز الزعفران العطري وسلطة موسمية وبصل متبل بالسماق ومزيج من الخضروات المشوية، يخلق تجربة طعم لا تُنسى. لا تفوت هذه النكهة الفريدة!',
        fa: 'تیکه ریب آی گوشت گاو انتخاب کاملی برای عاشقان گوشت! همراه با برنج زعفرانی معطر، سالاد فصلی، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی، تجربه طعم فراموش‌نشدنی ایجاد می‌کند. این طعم منحصر به فرد را از دست ندهید!',
        ku: 'تیکای ڕیب ئایی گۆشتی گا هەڵبژاردەیەکی تەواوە بۆ خۆشەویستانی گۆشت! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی وەرزی، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو، ئەزموونێکی تامی لەبیرنەکراو دروست دەکات. ئەم تامە ناوازەیە لەدەست مەدە!',
        tr: 'Dana Ribeye Tikka et severler için mükemmel seçim! Aromatik safran pirinci, mevsim salatası, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile eşleştirilmiş, unutulmaz bir tat deneyimi yaratır. Bu eşsiz lezzeti kaçırmayın!',
        ur: 'بیف ریب آئی ٹکہ گوشت کے شائقین کے لیے بہترین انتخاب! خوشبودار زعفرانی چاول، موسمی سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ، یہ ناقابل فراموش ذائقہ کا تجربہ بناتا ہے۔ اس منفرد ذائقے کو مت چھوڑیں!',
        kmr: 'Tîkka Rîb Ayê Goştê Ga hilbijartinek temam e ji bo hezkiranê goştê! Bi brincê zefranî yê bêhnxweş, salata werzeya, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî, ezmûnek tamê jibîrnekirin çêdike. Vê tamê bêhempa ji dest nedin!'
      }, 
      price: '$22.99', 
      category: 'grill', 
      popular: true, 
      tags: [] 
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
        kmr: 'Tîkka Mirîşk'
      }, 
      description: { 
        en: 'This dish offers a flavorful experience! Served with aromatic saffron rice, seasonal salad, sumac-seasoned onions, and a medley of grilled vegetables, it creates an unforgettable taste.',
        ar: 'يقدم هذا الطبق تجربة نكهة! يُقدم مع أرز الزعفران العطري وسلطة موسمية وبصل متبل بالسماق ومزيج من الخضروات المشوية، يخلق طعماً لا يُنسى.',
        fa: 'این غذا تجربه طعم‌داری ارائه می‌دهد! با برنج زعفرانی معطر، سالاد فصلی، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی سرو می‌شود، طعم فراموش‌نشدنی ایجاد می‌کند.',
        ku: 'ئەم خۆراکە ئەزموونێکی تامدار پێشکەش دەکات! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی وەرزی، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو خراوەتە سەر، تامێکی لەبیرنەکراو دروست دەکات.',
        tr: 'Bu yemek lezzetli bir deneyim sunar! Aromatik safran pirinci, mevsim salatası, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile servis edilir, unutulmaz bir tat yaratır.',
        ur: 'یہ ڈش ایک ذائقہ دار تجربہ فراہم کرتا ہے! خوشبودار زعفرانی چاول، موسمی سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ پیش کیا جاتا ہے، یہ ناقابل فراموش ذائقہ بناتا ہے۔',
        kmr: 'Ev xwarin ezmûnek bi tam pêşkêş dike! Bi brincê zefranî yê bêhnxweş, salata werzeya, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî tê peşkêşkirin, tamek jibîrnekirin çêdike.'
      }, 
      price: '$19.99', 
      category: 'grill', 
      tags: [] 
    },
    { 
      id: 1808, 
      name: { 
        en: 'Lamb Chops',
        ar: 'قطع لحم الخروف',
        fa: 'تکه‌های گوشت بره',
        ku: 'پارچەکانی گۆشتی بەرخ',
        tr: 'Kuzu Pirzola',
        ur: 'لیمب چاپس',
        kmr: 'Perçeyên Goştê Berx'
      }, 
      description: { 
        en: 'Marinated with special spices and perfectly cooked! Served with aromatic saffron rice, seasonal salad, sumac-seasoned onions, and a medley of grilled vegetables, it creates an unforgettable taste.',
        ar: 'متبل بتوابل خاصة ومطبوخ بشكل مثالي! يُقدم مع أرز الزعفران العطري وسلطة موسمية وبصل متبل بالسماق ومزيج من الخضروات المشوية، يخلق طعماً لا يُنسى.',
        fa: 'با ادویه‌جات مخصوص مزه‌دار شده و به کمال پخته شده! با برنج زعفرانی معطر، سالاد فصلی، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی سرو می‌شود، طعم فراموش‌نشدنی ایجاد می‌کند.',
        ku: 'بە بەهاراتی تایبەت تامدراوە و بە تەواوی لێنراوە! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی وەرزی، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو خراوەتە سەر، تامێکی لەبیرنەکراو دروست دەکات.',
        tr: 'Özel baharatlarla marine edilmiş ve mükemmel pişirilmiş! Aromatik safran pirinci, mevsim salatası, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile servis edilir, unutulmaz bir tat yaratır.',
        ur: 'خاص مصالحوں سے میرینیٹ اور بہترین طریقے سے پکایا گیا! خوشبودار زعفرانی چاول، موسمی سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ پیش کیا جاتا ہے، یہ ناقابل فراموش ذائقہ بناتا ہے۔',
        kmr: 'Bi baharatên taybet hatiye marînekirin û bi temamî hatiye pijandin! Bi brincê zefranî yê bêhnxweş, salata werzeya, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî tê peşkêşkirin, tamek jibîrnekirin çêdike.'
      }, 
      price: '$36.99', 
      category: 'grill', 
      popular: true, 
      tags: [] 
    },
    { 
      id: 1809, 
      name: { 
        en: "Nature's Village Special Platter",
        ar: 'طبق قرية الطبيعة الخاص',
        fa: 'پلاتر مخصوص روستای طبیعت',
        ku: 'پلێتەری تایبەتی گوندی سروشت',
        tr: 'Doğa Köyü Özel Tabağı',
        ur: 'نیچرز ولیج اسپیشل پلیٹر',
        kmr: 'Plata Taybet a Gundê Xwezayê'
      }, 
      description: { 
        en: 'Special Platter Mixed Grill.',
        ar: 'طبق خاص مشويات مختلطة.',
        fa: 'پلاتر مخصوص گریل مخلوط.',
        ku: 'پلێتەری تایبەتی گرێلی تێکەڵ.',
        tr: 'Özel Tabak Karışık Izgara.',
        ur: 'اسپیشل پلیٹر مکسڈ گرل۔',
        kmr: 'Plata Taybet Grîla Tevlihev.'
      }, 
      price: { serving2: '$69.99', serving4: '$105.99' }, 
      category: 'grill', 
      popular: true, 
      tags: [], 
      variants: ['serving2', 'serving4'],
      servingFor: { serving2: '2', serving4: '4' } 
    },

    // KID'S MENU
    { 
      id: 1901, 
      name: { 
        en: "Kid's Pizza",
        ar: 'بيتزا الأطفال',
        fa: 'پیتزای کودکان',
        ku: 'پیتزای منداڵان',
        tr: 'Çocuk Pizzası',
        ur: 'بچوں کا پیزا',
        kmr: 'Pizza Zarokan'
      }, 
      description: { 
        en: 'Thin crust pizza made for kids.',
        ar: 'بيتزا رقيقة القاعدة مصنوعة للأطفال.',
        fa: 'پیتزای نازک مخصوص کودکان.',
        ku: 'پیتزای نازک بۆ منداڵان دروستکراوە.',
        tr: 'Çocuklar için yapılmış ince hamur pizza.',
        ur: 'بچوں کے لیے بنایا گیا پتلا پیزا۔',
        kmr: 'Pizza nazik a ji bo zarokan hatiye çêkirin.'
      }, 
      price: '$10.99', 
      category: 'kids', 
      tags: [] 
    },
    { 
      id: 1902, 
      name: { 
        en: 'Chicken Tenders',
        ar: 'أصابع الدجاج',
        fa: 'تندر مرغ',
        ku: 'تەندەری مریشک',
        tr: 'Tavuk Şerit',
        ur: 'چکن ٹینڈرز',
        kmr: 'Tenderên Mirîşk'
      }, 
      description: { 
        en: 'Tender strips of chicken breast, breaded and fried to a crispy golden brown. Served with your choice of dipping sauces.',
        ar: 'شرائح طرية من صدر الدجاج، مغطاة بالخبز ومقلية حتى اللون الذهبي المقرمش. تُقدم مع صلصات الغمس من اختيارك.',
        fa: 'نوارهای نرم سینه مرغ، آرد شده و سرخ شده تا رنگ طلایی ترد. با سس‌های انتخابی شما سرو می‌شود.',
        ku: 'پارچە نەرمەکانی سنگی مریشک، نانکراو و سوورکراوە تا ڕەنگی زێڕینی ترسکە. لەگەڵ سۆسەکانی دڵخوازت بۆ خستنە ناوەوە خراوەتە سەر.',
        tr: 'Tavuk göğsünün yumuşak şeritleri, galeta unu ile kaplanmış ve çıtır altın sarısı renkte kızartılmış. Seçtiğiniz soslarla servis edilir.',
        ur: 'چکن بریسٹ کی نرم پٹیاں، بریڈ کر کے سنہری بھورے رنگ میں کرسپی تک تلی گئی۔ آپ کی پسند کے ڈپنگ ساس کے ساتھ پیش کی جاتی ہے۔',
        kmr: 'Perçeyên nerm ên sînga mirîşk, bi nanê hatine kirin û hatine sortin heta rengê zêrîn ê çitir. Bi soşên ku tu dibijêrî ji bo navxistinê tê peşkêşkirin.'
      }, 
      price: '$8.99', 
      category: 'kids', 
      popular: true, 
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
        kmr: 'Kartolên Sorkirî'
      }, 
      description: { 
        en: 'Crispy, golden-brown potato fries, seasoned to perfection and served hot.',
        ar: 'بطاطس مقلية ذهبية مقرمشة، متبلة بشكل مثالي وتُقدم ساخنة.',
        fa: 'سیب‌زمینی سرخ‌شده طلایی و ترد، با طعم کامل و داغ سرو می‌شود.',
        ku: 'پەتاتەی سوورکراوی ترسکەی زێڕین، بە تەواوی تامدراو و گەرم خراوەتە سەر.',
        tr: 'Çıtır, altın sarısı patates kızartması, mükemmel baharatlanmış ve sıcak servis edilir.',
        ur: 'کرسپی، سنہرے بھورے آلو فرائیز، مکمل طور پر سیزن کیے گئے اور گرم پیش کیے گئے۔',
        kmr: 'Kartolên sorkirî yên çitir û zêrîn, bi temamî hatine tamdar kirin û germ tê peşkêşkirin.'
      }, 
      price: '$6.99', 
      category: 'kids', 
      popular: true, 
      tags: [] 
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
        kmr: 'Av'
      }, 
      description: { 
        en: 'Fresh bottled water.',
        ar: 'مياه معبأة طازجة.',
        fa: 'آب بطری تازه.',
        ku: 'ئاوی تازەی بۆتڵکراو.',
        tr: 'Taze şişe suyu.',
        ur: 'تازہ بوتل کا پانی۔',
        kmr: 'Ava şûşekirî ya taze.'
      }, 
      price: '$1.50', 
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
        kmr: 'Ava Gazdar'
      }, 
      description: { 
        en: 'Refreshing sparkling water.',
        ar: 'مياه فوارة منعشة.',
        fa: 'آب گازدار خنک‌کننده.',
        ku: 'ئاوی گازداری ئارامبەخش.',
        tr: 'Ferahlatıcı soda.',
        ur: 'تروتازہ چمکتا پانی۔',
        kmr: 'Ava gazdar a vedişe.'
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
        kmr: 'Vexwarinê Gazdar'
      }, 
      description: { 
        en: 'Choice of Coke, Diet Coke, Coke Zero, Sprite, Fanta, or Minute Maid.',
        ar: 'اختيار من كوكا كولا، دايت كوك، كوك زيرو، سبرايت، فانتا، أو مينيت مايد.',
        fa: 'انتخاب از کوکا کولا، دایت کوک، کوک زرو، اسپرایت، فانتا یا مینیت مید.',
        ku: 'هەڵبژاردن لە کۆکا کۆلا، دایەت کۆک، کۆک زیرۆ، سپرایت، فانتا، یان مینت مەید.',
        tr: 'Kola, Diyet Kola, Kola Zero, Sprite, Fanta veya Minute Maid seçimi.',
        ur: 'کوک، ڈائٹ کوک، کوک زیرو، سپرائٹ، فانٹا یا منٹ میڈ کا انتخاب۔',
        kmr: 'Hilbijartina Koke, Diet Koke, Koke Zero, Sprite, Fanta, an Minute Maid.'
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
        kmr: 'Vexwarinê Mastê Hewlêr'
      }, 
      description: { 
        en: 'Traditional yogurt drink from Erbil.',
        ar: 'مشروب لبن تقليدي من أربيل.',
        fa: 'نوشیدنی سنتی ماست از اربیل.',
        ku: 'خواردنەوەی مۆستی نەریتی لە هەولێرەوە.',
        tr: 'Erbil\'den geleneksel yoğurt içeceği.',
        ur: 'اربیل سے روایتی یوگرٹ ڈرنک۔',
        kmr: 'Vexwarinê mastê kevneşopî ji Hewlêrê.'
      }, 
      price: '$3.99', 
      category: 'drinks_cold', 
      tags: [] 
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
        kmr: 'Qehweya Erebî'
      }, 
      description: { 
        en: 'Traditional Arabic coffee with cardamom.',
        ar: 'قهوة عربية تقليدية مع الهيل.',
        fa: 'قهوه عربی سنتی با هل.',
        ku: 'قاوەی عەرەبی نەریتی لەگەڵ هەڵ.',
        tr: 'Kakule ile geleneksel Arap kahvesi.',
        ur: 'الائچی کے ساتھ روایتی عربی کافی۔',
        kmr: 'Qehweya Erebî ya kevneşopî bi hêl.'
      }, 
      price: '$2.99', 
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
        kmr: 'Qehweya Kurdî Qazwan'
      }, 
      description: { 
        en: 'Traditional Kurdish coffee blend.',
        ar: 'خليط قهوة كردية تقليدية.',
        fa: 'ترکیب سنتی قهوه کردی.',
        ku: 'تێکەڵەی نەریتی قاوەی کوردی.',
        tr: 'Geleneksel Kürt kahve karışımı.',
        ur: 'روایتی کردی کافی کا ملاپ۔',
        kmr: 'Tevahiya kevneşopî ya qehweya Kurdî.'
      }, 
      price: '$3.50', 
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
        kmr: 'Qehweya Tirkî bi Fistiq'
      }, 
      description: { 
        en: 'Turkish coffee with pistachio flavor.',
        ar: 'قهوة تركية بنكهة الفستق.',
        fa: 'قهوه ترکی با طعم پسته.',
        ku: 'قاوەی تورکی بە تامی فستق.',
        tr: 'Fıstık aromalı Türk kahvesi.',
        ur: 'پستے کے ذائقے والی ترکی کافی۔',
        kmr: 'Qehweya Tirkî bi tama fistiqê.'
      }, 
      price: '$3.50', 
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
        kmr: 'Çaya Karak'
      }, 
      description: { 
        en: 'Spiced tea with milk and cardamom.',
        ar: 'شاي بالتوابل مع الحليب والهيل.',
        fa: 'چای ادویه‌دار با شیر و هل.',
        ku: 'چایی بەهاراتدار لەگەڵ شیر و هەڵ.',
        tr: 'Süt ve kakule ile baharatlı çay.',
        ur: 'دودھ اور الائچی کے ساتھ مصالحہ دار چائے۔',
        kmr: 'Çaya baharatdar bi şîr û hêl.'
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
        kmr: 'Çaya Farsî'
      }, 
      description: { 
        en: 'Traditional Persian black tea.',
        ar: 'شاي أسود فارسي تقليدي.',
        fa: 'چای سیاه سنتی فارسی.',
        ku: 'چایی ڕەشی نەریتی فارسی.',
        tr: 'Geleneksel Fars siyah çayı.',
        ur: 'روایتی فارسی کالی چائے۔',
        kmr: 'Çaya reş a kevneşopî ya Farsî.'
      }, 
      price: '$2.50', 
      category: 'drinks_hot', 
      tags: [] 
    },
    { 
      id: 2106, 
      name: { 
        en: 'Green Tea',
        ar: 'شاي أخضر',
        fa: 'چای سبز',
        ku: 'چایی سەوز',
        tr: 'Yeşil Çay',
        ur: 'سبز چائے',
        kmr: 'Çaya Kesk'
      }, 
      description: { 
        en: 'Fresh green tea with antioxidants.',
        ar: 'شاي أخضر طازج مع مضادات الأكسدة.',
        fa: 'چای سبز تازه با آنتی‌اکسیدان.',
        ku: 'چایی سەوزی تازە لەگەڵ دژە ئۆکسیدان.',
        tr: 'Antioksidan içeren taze yeşil çay.',
        ur: 'اینٹی آکسیڈنٹ کے ساتھ تازہ سبز چائے۔',
        kmr: 'Çaya kesk a taze bi antîoksîdanan.'
      }, 
      price: '$2.50', 
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
        kmr: 'Beqlawa'
      }, 
      description: { 
        en: 'A sweet pastry with layers of nuts and honey.',
        ar: 'معجنات حلوة مع طبقات من المكسرات والعسل.',
        fa: 'شیرینی خمیری با لایه‌هایی از آجیل و عسل.',
        ku: 'شیرینییەکی خەمیری لەگەڵ چینە چینە گوێز و هەنگوین.',
        tr: 'Fındık ve bal katmanları ile tatlı hamur işi.',
        ur: 'گری اور شہد کی تہوں کے ساتھ میٹھی پیسٹری۔',
        kmr: 'Pîrokek şîrîn bi çînên gûz û hingivê.'
      }, 
      price: '$6.99', 
      category: 'dessert', 
      popular: true, 
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
        kmr: 'Tiramisu'
      }, 
      description: { 
        en: 'Sweetened whipped cream and a rich mascarpone.',
        ar: 'كريمة مخفوقة محلاة وماسكاربوني غني.',
        fa: 'خامه فرم زده شیرین شده و ماسکارپونه غنی.',
        ku: 'کرێمی لێدراوی شیرین و ماسکارپۆنێی دەوڵەمەند.',
        tr: 'Tatlandırılmış krem şanti ve zengin mascarpone.',
        ur: 'میٹھا وہپڈ کریم اور بھرپور ماسکارپونے۔',
        kmr: 'Krêma şîrîn a lêdayî û maskarponeya dewlemend.'
      }, 
      price: '$5.99', 
      category: 'dessert', 
      popular: true, 
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
        kmr: 'Xaş Xaş'
      }, 
      description: { 
        en: 'A delicious dessert with layers of cream and crunchy vermicelli.',
        ar: 'حلوى لذيذة مع طبقات من الكريمة والشعيرية المقرمشة.',
        fa: 'دسری خوشمزه با لایه‌هایی از خامه و ورمیشل ترد.',
        ku: 'شیرینییەکی خۆشتام لەگەڵ چینە چینە کرێم و ڤێرمیشێلی ترسکە.',
        tr: 'Krema katmanları ve çıtır şehriye ile lezzetli tatlı.',
        ur: 'کریم اور کرنچی ورمیسیلی کی تہوں کے ساتھ لذیذ میٹھا۔',
        kmr: 'Şîrîniyeke bi tam bi çînên krêmê û vermîşelî yê çitir.'
      }, 
      price: '$5.99', 
      category: 'dessert', 
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
        kmr: 'Pudînga Brincê ya Firînê'
      }, 
      description: { 
        en: 'Creamy Middle Eastern milk pudding.',
        ar: 'مهلبية حليب كريمية من الشرق الأوسط.',
        fa: 'پودینگ شیر خامه‌ای خاورمیانه.',
        ku: 'مەحلەبی شیری کرێمی ڕۆژهەڵاتی ناوین.',
        tr: 'Kremalı Orta Doğu süt tatlısı.',
        ur: 'کریمی مشرق وسطیٰ کا دودھ پڈنگ۔',
        kmr: 'Pudînga şîrê krêmî ya Rojhilatê Navîn.'
      }, 
      price: '$5.99', 
      category: 'dessert', 
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
        kmr: 'Qeşa'
      }, 
      description: { 
        en: 'Choose from 3 flavors: Strawberry, Chocolate, Vanilla.',
        ar: 'اختر من 3 نكهات: فراولة، شوكولاتة، فانيليا.',
        fa: 'از ۳ طعم انتخاب کنید: توت‌فرنگی، شکلات، وانیل.',
        ku: 'لە ٣ تامە هەڵبژێرە: فرۆولا، شۆکولات، ڤانیلیا.',
        tr: '3 aromadan seçin: Çilek, Çikolata, Vanilya.',
        ur: '3 ذائقوں میں سے انتخاب کریں: اسٹرابیری، چاکلیٹ، ونیلا۔',
        kmr: 'Ji 3 taman hilbijêre: Çilek, Çîkolata, Vanîlya.'
      }, 
      price: '$2.99', 
      category: 'dessert', 
      popular: true, 
      tags: [], 
      variants: ['singleScoop'],
      servingFor: { singleScoop: '1' } 
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
        kmr: 'Salata Yewnanî'
      }, 
      description: { 
        en: 'A classic Greek salad made with tomatoes, cucumbers, green peppers, onions, olives, feta cheese, mixed greens, and olive oil.',
        ar: 'سلطة يونانية كلاسيكية مصنوعة من الطماطم والخيار والفلفل الأخضر والبصل والزيتون وجبن الفيتا والخضروات المختلطة وزيت الزيتون.',
        fa: 'سالاد یونانی کلاسیک از گوجه‌فرنگی، خیار، فلفل سبز، پیاز، زیتون، پنیر فتا، سبزیجات مخلوط و روغن زیتون.',
        ku: 'سالادی یۆنانی کلاسیک لە تەماتە، خیار، بیبەری سەوز، پیاز، زەیتوون، پەنیری فیتا، سەوزەی تێکەڵ و زەیتی زەیتوون.',
        tr: 'Domates, salatalık, yeşil biber, soğan, zeytin, feta peyniri, karışık yeşillikler ve zeytinyağı ile yapılan klasik Yunan salatası.',
        ur: 'ٹماٹر، کھیرا، ہری مرچ، پیاز، زیتون، فیٹا چیز، ملے جلے سبزیجات اور زیتون کے تیل سے بنا کلاسک یونانی سلاد۔',
        kmr: 'Salatayek Yewnanî ya klasîk ku ji firangoş, xiyar, biberê kesk, pîvaz, zeytûn, penîrê feta, sebzeyên tevlihev û zeyta zeytûnê tê çêkirin.'
      }, 
      price: '$13.99', 
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
          kmr: 'Protein Zêde Bike'
        }, 
        options: [ 
          { name: { en: 'Beef', ar: 'لحم بقر', fa: 'گوشت گاو', ku: 'گۆشتی گا', tr: 'Dana Eti', ur: 'گائے کا گوشت', kmr: 'Goştê Ga' }, price: '$7.99' }, 
          { name: { en: 'Chicken', ar: 'دجاج', fa: 'مرغ', ku: 'مریشک', tr: 'Tavuk', ur: 'چکن', kmr: 'Mirîşk' }, price: '$6.99' }, 
          { name: { en: 'Falafel', ar: 'فلافل', fa: 'فلافل', ku: 'فەلەفڵ', tr: 'Falafel', ur: 'فلافل', kmr: 'Falafel' }, price: '$4.99' }, 
          { name: { en: 'Shrimp', ar: 'روبيان', fa: 'میگو', ku: 'میگۆ', tr: 'Karides', ur: 'جھینگا', kmr: 'Mîgo' }, price: '$5.99' } 
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
        kmr: 'Salata Fetûş'
      }, 
      description: { 
        en: 'A delicious Middle Eastern salad made with lettuce, tomatoes, cucumbers, green peppers, fresh mint, parsley, crispy pita bread, and pomegranate molasses dressing.',
        ar: 'سلطة شرق أوسطية لذيذة مصنوعة من الخس والطماطم والخيار والفلفل الأخضر والنعناع الطازج والبقدونس وخبز البيتا المقرمش وصلصة دبس الرمان.',
        fa: 'سالاد لذیذ خاورمیانه‌ای از کاهو، گوجه‌فرنگی، خیار، فلفل سبز، نعنای تازه، جعفری، نان پیتای ترد و سس انار.',
        ku: 'سالادێکی خۆشی ڕۆژهەڵاتی ناوەڕاست لە خس، تەماتە، خیار، بیبەری سەوز، پونگی تازە، جەعدە، نانی پیتای ترسکە و سۆسی هەنار.',
        tr: 'Marul, domates, salatalık, yeşil biber, taze nane, maydanoz, çıtır pita ekmeği ve nar ekşisi sosuyla yapılan lezzetli Orta Doğu salatası.',
        ur: 'لیٹوس، ٹماٹر، کھیرا، ہری مرچ، تازہ پودینہ، دھنیا، کرسپی پیٹا بریڈ اور انار کے شیرے کی ڈریسنگ سے بنا لذیذ مشرق وسطیٰ کا سلاد۔',
        kmr: 'Salatayek bi tam a Rojhilatê Navîn ku ji salata kesk, firangoş, xiyar, biberê kesk, pûngê taze, şînî, nanê pita yê çitir û soşa henarê tê çêkirin.'
      }, 
      price: '$13.99', 
      category: 'salads', 
      popular: true, 
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1103, 
      name: { 
        en: 'Shiwan Salad',
        ar: 'سلطة شيوان',
        fa: 'سالاد شیوان',
        ku: 'سالادی شیوان',
        tr: 'Şivan Salatası',
        ur: 'شیوان سلاد',
        kmr: 'Salata Şîvan'
      }, 
      description: { 
        en: 'A refreshing Turkish salad made with tomatoes, cucumbers, green peppers, onions, parsley, and walnuts, seasoned with olive oil and lemon juice.',
        ar: 'سلطة تركية منعشة مصنوعة من الطماطم والخيار والفلفل الأخضر والبصل والبقدونس والجوز، متبلة بزيت الزيتون وعصير الليمون.',
        fa: 'سالاد ترکی تازه‌کننده از گوجه‌فرنگی، خیار، فلفل سبز، پیاز، جعفری و گردو، با روغن زیتون و آب لیمو طعم‌دار شده.',
        ku: 'سالادێکی ترکی ئارامبەخش لە تەماتە، خیار، بیبەری سەوز، پیاز، جەعدە و گوێز، بە زەیتی زەیتوون و شیری لیمۆ تامدراوە.',
        tr: 'Domates, salatalık, yeşil biber, soğan, maydanoz ve cevizle yapılan, zeytinyağı ve limon suyuyla tatlandırılmış ferahlatıcı Türk salatası.',
        ur: 'ٹماٹر، کھیرا، ہری مرچ، پیاز، دھنیا اور اخروٹ سے بنا تازگی بخش ترک سلاد، زیتون کے تیل اور لیموں کے رس سے ذائقہ دار۔',
        kmr: 'Salatayek Tirkî ya vevişandî ku ji firangoş, xiyar, biberê kesk, pîvaz, şînî û gihokan tê çêkirin, bi zeyta zeytûnê û ava lîmonê tatdar dike.'
      }, 
      price: '$13.99', 
      category: 'salads', 
      tags: ['vegetarian', 'vegan'] 
    },
    { 
      id: 1104, 
      name: { 
        en: 'Suwanee Salad',
        ar: 'سلطة سواني',
        fa: 'سالاد سوانی',
        ku: 'سالادی سووانی',
        tr: 'Suwanee Salatası',
        ur: 'سوانی سلاد',
        kmr: 'Salata Suwanee'
      }, 
      description: { 
        en: 'A vibrant and refreshing dish crafted with fresh, colorful ingredients. This includes leafy beets, tomatoes, bell peppers, cucumbers, onions, and seasonal fruits. This rich combination appeals to both the eye and the palate.',
        ar: 'طبق نابض بالحياة ومنعش مصنوع من مكونات طازجة وملونة. يشمل الشمندر الورقي والطماطم والفلفل الحلو والخيار والبصل والفواكه الموسمية. هذا المزيج الغني يروق للعين والحنك.',
        fa: 'غذایی پر جنب و جوش و تازه‌کننده با مواد تازه و رنگارنگ. شامل چغندر برگ، گوجه‌فرنگی، فلفل دلمه‌ای، خیار، پیاز و میوه‌های فصلی. این ترکیب غنی هم چشم و هم کام را جذب می‌کند.',
        ku: 'خۆراکێکی گیانەوەر و ئارامبەخش لە پێکهاتە تازە و ڕەنگاوڕەنگەکان دروستکراوە. ئەمەش بریتییە لە چوکوندری گەڵا، تەماتە، بیبەری شیرین، خیار، پیاز و میوەی وەرزی. ئەم تێکەڵە دەوڵەمەندە هەم چاو و هەم مل سەرسام دەکات.',
        tr: 'Taze, renkli malzemelerle hazırlanmış canlı ve ferahlatıcı bir yemek. Yapraklı pancar, domates, dolmalık biber, salatalık, soğan ve mevsim meyvelerini içerir. Bu zengin kombinasyon hem göze hem de damağa hitap eder.',
        ur: 'تازہ، رنگین اجزاء کے ساتھ تیار کیا گیا ایک متحرک اور تازگی بخش پکوان۔ اس میں پتوں والا چقندر، ٹماٹر، شملہ مرچ، کھیرا، پیاز اور موسمی پھل شامل ہیں۔ یہ بھرپور امتزاج آنکھ اور ذائقہ دونوں کو اپیل کرتا ہے۔',
        kmr: 'Xwarineke geş û vevedî ku bi maddeyên taze û rengîn hatiye amade kirin. Ev jî pancarên pelî, firangoş, biberên şîrîn, xiyar, pîvaz û firehên werzeya vedihewîne. Ev tevahiya dewlemend hem çav û hem dev dişibîne.'
      }, 
      price: '$14.99', 
      category: 'salads', 
      tags: ['vegetarian', 'vegan'] 
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
        'Pizza': 'pizza',
        'Fish': 'fish',
        'Specialty': 'specialty',
        'Grill': 'grill',
        'Kid\'s Menu': 'kids',
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
        kmr: '🌱 Nebatî'
      },
      vegan: {
        en: '🌿 Vegan',
        ar: '🌿 نباتي صرف',
        fa: '🌿 وگان',
        ku: '🌿 ڕووەکی ڕەها',
        tr: '🌿 Vegan',
        ur: '🌿 ویگن',
        kmr: '🌿 Vegan'
      },
      spicy: {
        en: '🌶️ Spicy',
        ar: '🌶️ حار',
        fa: '🌶️ تند',
        ku: '🌶️ تیژ',
        tr: '🌶️ Acılı',
        ur: '🌶️ تیز',
        kmr: '🌶️ Tûj'
      },
      sweet: {
        en: '🍯 Sweet',
        ar: '🍯 حلو',
        fa: '🍯 شیرین',
        ku: '🍯 شیرین',
        tr: '🍯 Tatlı',
        ur: '🍯 میٹھا',
        kmr: '🍯 Şîrîn'
      },
      traditional: {
        en: '🏛️ Traditional',
        ar: '🏛️ تقليدي',
        fa: '🏛️ سنتی',
        ku: '🏛️ نەریتی',
        tr: '🏛️ Geleneksel',
        ur: '🏛️ روایتی',
        kmr: '🏛️ Kevneşopî'
      },
      grilled: {
        en: '🔥 Grilled',
        ar: '🔥 مشوي',
        fa: '🔥 کبابی',
        ku: '🔥 برژاو',
        tr: '🔥 Izgara',
        ur: '🔥 گرل شدہ',
        kmr: '🔥 Şewitî'
      },
      fried: {
        en: '🍳 Fried',
        ar: '🍳 مقلي',
        fa: '🍳 سرخ شده',
        ku: '🍳 سووتراو',
        tr: '🍳 Kızartılmış',
        ur: '🍳 تلا ہوا',
        kmr: '🍳 Sorkirî'
      }
    }
    
    return tagTranslations[tag] ? getText(tagTranslations[tag]) : tag
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
                    {t.restaurantBadge || 'Authentic Kurdish Restaurant'}
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
                          7
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
                  {/* Section Header */}
                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3 sm:mb-4">
                      {t.popularSectionTitle || 'Our Most Popular Dishes'}
                    </h2>
                    <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
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
                        {/* Single card display */}
                        {dishes.map((dish, index) => (
                          <div
                            key={`dish-card-${dish.id}`}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                              index === currentDishIndex 
                                ? 'opacity-100 scale-100 z-20 pointer-events-auto' 
                                : 'opacity-0 scale-95 z-10 pointer-events-none'
                            } ${isTransitioning ? 'motion-blur-sm' : ''}`}
                            style={{
                              transform: index === currentDishIndex ? 'translateX(0)' : 
                                        index < currentDishIndex ? 'translateX(-100%)' : 'translateX(100%)',
                            }}
                          >
                            {/* Enhanced dish card with improved mobile design, stronger borders, and table protection */}
                            <div 
                              className="bg-gradient-to-br from-white via-white to-amber-50/30 backdrop-blur-md rounded-2xl sm:rounded-3xl lg:rounded-3xl shadow-2xl border-4 overflow-hidden transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-3xl relative will-change-transform w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"
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
                                {/* Left side - Image (full width on mobile, 30% on larger screens) */}
                                <div className="w-full sm:w-2/5 h-56 sm:h-auto sm:min-h-full relative overflow-hidden flex-shrink-0 border-b-2 sm:border-b-0 sm:border-r-2" style={{ borderColor: `${dish.color}30` }}>
                                  {dish.imageUrl ? (
                                    <Image
                                      src={dish.imageUrl}
                                      alt={getText(dish.name)}
                                      className="w-full h-full object-cover transition-all duration-500 ease-out hover:scale-110"
                                      width={600}
                                      height={400}
                                      sizes="(max-width: 640px) 100vw, 40vw"
                                      priority={index === 0}
                                      onError={(e) => {
                                        console.warn(`Failed to load image for item ${dish.id}:`, dish.imageUrl);
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div 
                                      className={`w-full h-full ${getSVGGradient(dish.placeholder)} flex items-center justify-center transition-all duration-500 ease-out`}
                                    >
                                      {getSVGIcon(dish.placeholder, 64)}
                                    </div>
                                  )}
                                  
                                  {/* Image overlay gradient for better text contrast */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white/10"></div>
                                  
                                  {/* Popular badge - repositioned for mobile */}
                                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg z-10 border-2 border-white/30">
                                    ⭐ {language === 'ar' ? 'مشهور' :
                                         language === 'fa' ? 'محبوب' :
                                         language === 'ku' ? 'بەناوبانگ' :
                                         language === 'tr' ? 'Popüler' :
                                         language === 'ur' ? 'مقبول' :
                                         language === 'kmr' ? 'Populer' :
                                         'Popular'}
                                  </div>
                                </div>
                                
                                {/* Right side - Content (full width on mobile, 70% on larger screens) */}
                                <div className="w-full sm:w-3/5 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center flex-grow">
                                  {/* Dish category badge */}
                                  <div className="mb-4 sm:mb-6">
                                    <span 
                                      className="inline-block px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold text-white shadow-lg border-2 border-white/20"
                                      style={{ 
                                        background: `linear-gradient(135deg, ${dish.color}90, ${dish.color}70)`,
                                      }}
                                    >
                                      {getText(dish.category)}
                                    </span>
                                  </div>
                                  
                                  {/* Dish name - responsive typography */}
                                  {/* Dish name - enhanced responsive typography with improved mobile styling */}
                                  <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8 font-serif ${language === 'ar' || language === 'fa' || language === 'ur' ? 'text-right' : ''}`}
                                      style={{ color: dish.color }}>
                                    {getText(dish.name)}
                                  </h3>
                                  
                                  {/* Description - enhanced mobile readability */}
                                  <p className={`leading-relaxed text-base sm:text-lg lg:text-xl font-medium line-clamp-3 sm:line-clamp-4 mb-4 sm:mb-6 ${language === 'ar' || language === 'fa' || language === 'ur' ? 'text-right' : ''}`}
                                     style={{ color: dish.color }}>
                                    {getText(dish.description)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Navigation arrows - positioned extremely far from carousel cards for maximum safety */}
                        <button
                          className="absolute -left-12 sm:-left-20 lg:-left-28 xl:-left-36 2xl:-left-44 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full p-2.5 sm:p-3 lg:p-4 shadow-lg sm:shadow-xl border border-amber-200/60 hover:border-amber-300/70 transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-30 group will-change-transform touch-manipulation"
                          onClick={() => navigateTo((currentDishIndex - 1 + dishes.length) % dishes.length)}
                          disabled={isTransitioning}
                          aria-label="Previous dish"
                          style={{
                            minWidth: '44px',
                            minHeight: '44px'
                          }}
                        >
                          <svg width="16" height="16" className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" className="text-amber-600 group-hover:text-amber-700 transition-colors duration-200"/>
                          </svg>
                        </button>
                        
                        <button
                          className="absolute -right-12 sm:-right-20 lg:-right-28 xl:-right-36 2xl:-right-44 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full p-2.5 sm:p-3 lg:p-4 shadow-lg sm:shadow-xl border border-amber-200/60 hover:border-amber-300/70 transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-30 group will-change-transform touch-manipulation"
                          onClick={() => navigateTo((currentDishIndex + 1) % dishes.length)}
                          disabled={isTransitioning}
                          aria-label="Next dish"
                          style={{
                            minWidth: '44px',
                            minHeight: '44px'
                          }}
                        >
                          <svg width="16" height="16" className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" className="text-amber-600 group-hover:text-amber-700 transition-colors duration-200"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation indicators for card carousel - positioned much lower with increased spacing */}
                  <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20 xl:mt-24 mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {dishes.map((_, index) => (
                        <button
                          key={`card-indicator-${index}`}
                          onClick={() => navigateTo(index)}
                          className={cn(
                            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 will-change-transform hover:scale-110 touch-manipulation",
                            index === currentDishIndex
                              ? "bg-amber-500/20 scale-110" 
                              : "bg-transparent hover:bg-amber-400/10 scale-100"
                          )}
                          aria-label={`Go to ${getText(dishes[index].name)} card`}
                        >
                          <div
                            className={cn(
                              "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300",
                              index === currentDishIndex
                                ? "bg-amber-500 scale-125 shadow-lg ring-2 ring-amber-300/50" 
                                : "bg-amber-300/60 hover:bg-amber-400/80 scale-100"
                            )}
                          />
                        </button>
                      ))}
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
                           className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                           width={600}
                           height={320}
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


