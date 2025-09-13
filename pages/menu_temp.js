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
        de: 'Parda Biryani'
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
        de: 'Spezialitäten'
      }, 
      placeholder: 'biryani', 
      imageUrl: '/pbiryani.png',
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
        de: 'Traditionelles Schichtreisgericht mit aromatischen Gewürzen und zartem Fleisch'
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
        de: 'Mahshi Kebab'
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
        de: 'Grillgerichte'
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
        de: 'Rind- und Lamm-Kebab gewürzt mit Knoblauch, scharfen Paprika und Petersilie'
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
        kmr: 'Pizza Margherita',
        es: 'Pizza Margherita',
        ru: 'Пицца Маргарита',
        hi: 'मार्गेरिटा पिज्जा',
        sq: 'Pica Margherita',
        fr: 'Pizza Margherita',
        de: 'Margherita Pizza'
      }, 
      category: {
        en: 'Pizza',
        ar: 'بيتزا',
        fa: 'پیتزا',
        ku: 'پیتزا',
        tr: 'Pizza',
        ur: 'پیزا',
        kmr: 'Pizza',
        es: 'Pizza',
        ru: 'Пицца',
        hi: 'पिज्जा',
        sq: 'Pica',
        fr: 'Pizza',
        de: 'Pizza'
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
        kmr: 'Pizza Îtalî ya klasîk bi mozzarellaya taze, firangoş û rêhanê',
        es: 'Pizza italiana clásica con mozzarella fresca, tomates y albahaca',
        ru: 'Классическая итальянская пицца со свежей моцареллой, помидорами и базиликом',
        hi: 'ताज़ा मोज़ेरेला, टमाटर और तुलसी के साथ क्लासिक इतालवी पिज्जा',
        sq: 'Pica klasike italiane me mozzarella të freskët, domate dhe borzilok',
        fr: 'Pizza italienne classique avec mozzarella fraîche, tomates et basilic',
        de: 'Klassische italienische Pizza mit frischer Mozzarella, Tomaten und Basilikum'
      },
      color: '#FF8C42'
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
        de: 'Hummus'
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
        de: 'Vorspeisen'
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
        de: 'Baklava'
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
        de: 'Desserts'
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
        de: 'Süßes Gebäck mit Nuss- und Honigschichten in zartem Phyllo-Teig'
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
        de: 'Hähnchen-Schawarma-Sandwich'
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
        de: 'Sandwich'
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
        de: 'Zartes mariniertes Hähnchen in frischem Pita mit Gemüse und Sauce'
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
        de: 'Karak Tee'
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
        de: 'Heiße Getränke'
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
        de: 'Gewürztee mit Milch und Kardamom, ein traditioneller Favorit des Nahen Ostens'
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
        pizza: 'Пицца',
        fish: 'Рыба',
        grill: 'Гриль',
        specialty: 'Фирменные блюда',
        kids: 'Детское меню',
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
        blunari: 'Blunari AI'
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
        pizza: 'पिज्जा',
        fish: 'मछली',
        grill: 'ग्रिल प्लेटर',
        specialty: 'विशेष व्यंजन',
        kids: 'बच्चों का मेन्यू',
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
        blunari: 'Blunari AI'
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
        pizza: 'Pizza',
        fish: 'Pescado',
        grill: 'Platillos a la Parrilla',
        specialty: 'Platos Especiales',
        kids: 'Menú Infantil',
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
        blunari: 'Blunari AI'
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
        pizza: 'Pica',
        fish: 'Peshk',
        grill: 'Pjatat e Grilit',
        specialty: 'Specialitetet',
        kids: 'Menyja e Fëmijëve',
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
        blunari: 'Blunari AI'
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
        pizza: 'Pizza', 
        fish: 'Poisson', 
        grill: 'Grillades', 
        specialty: 'Spécialités', 
        kids: "Menu Enfants", 
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
        blunari: 'Blunari IA'
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
        pizza: 'Pizza', 
        fish: 'Fisch', 
        grill: 'Grillplatten', 
        specialty: 'Spezialitäten', 
        kids: "Kindermenü", 
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
        blunari: 'Blunari KI'
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
        sq: 'Humus'
      }, 
      description: { 
        en: 'A classic Levantine dip made from mashed chickpeas, tahini, olive oil, lemon juice and garlic.',
        ar: 'غموس شامي كلاسيكي مصنوع من الحمص المهروس والطحينة وزيت الزيتون وعصير الليمون والثوم.',
        fa: 'یک دیپ کلاسیک شامی از نخود له شده، طحینی، روغن زیتون، آب لیمو و سیر.',
        ku: 'دیپێکی کلاسیکی شامی لە نۆکی کوتراو، تەحینی، زەیتی زەیتوون، شیری لیمۆ و سیر.',
        tr: 'Ezilmiş nohut, tahin, zeytinyağı, limon suyu ve sarımsaktan yapılan klasik Levant mezesi.',
        ur: 'چنے، تل کا پیسٹ، زیتون کا تیل، لیموں کا رس اور لہسن سے بنا کلاسک شامی ڈپ۔',
        kmr: 'Mezeyeke klasîk ya Şamî ku ji kurskotan, tahînî, zeyta zeytûnê, ava lîmonê û sîr tê çêkirin.',
        es: 'Una salsa clásica levantina hecha de garbanzos machacados, tahini, aceite de oliva, jugo de limón y ajo.',
        fr: 'Une trempette levantine classique à base de pois chiches écrasés, tahini, huile d\'olive, jus de citron et ail.',
        de: 'Ein klassischer levantinischer Dip aus zerdrückten Kichererbsen, Tahini, Olivenöl, Zitronensaft und Knoblauch.',
        ru: 'Классическая левантийская закуска из измельченного нута, тахини, оливкового масла, лимонного сока и чеснока.',
        hi: 'मसले हुए छोले, तिल का पेस्ट, जैतून का तेल, नींबू का रस और लहसुन से बना क्लासिक लेवंतीन डिप।',
        sq: 'Një sos klasik levantinë i bërë nga grofthat e shtypur, tahini, vaj ulliri, lëng limoni dhe hudhra.'
      }, 
      price: '$8.99', 
      category: 'appetizers', 
      popular: true, 
      available: true,
      allergens: ['sesame'],
      nutritionalInfo: {
        calories: 280,
        protein: 12,
        carbs: 24,
        fat: 18,
        fiber: 8
      },
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],      tags: ['customer-favorite', 'healthy', 'traditional', 'sharing'],
      image: '/hummus.jpg'
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
        de: 'Baba Ghanoush'
      }, 
      description: { 
        en: 'This Levantine dip, made from roasted eggplant, yogurt, tahini, garlic, lemon juice, is a delicious addition to any meal.',
        ar: 'هذا الغموس الشامي، المصنوع من الباذنجان المشوي واللبن والطحينة والثوم وعصير الليمون، إضافة لذيذة لأي وجبة.',
        fa: 'این دیپ شامی، از بادمجان کبابی، ماست، طحینی، سیر، آب لیمو، افزودنی لذیذی به هر وعده غذایی است.',
        ku: 'ئەم دیپە شامییە، لە بادەمجانی برژاو، مۆست، تەحینی، سیر، شیری لیمۆ، زیادکردنێکی خۆشە بۆ هەر ژەمێک.',
        tr: 'Közlenmiş patlıcan, yoğurt, tahin, sarımsak, limon suyundan yapılan bu Levant mezesi, her yemeğe lezzetli bir katkıdır.',
        ur: 'بھنے ہوئے بینگن، دہی، تل کا پیسٹ، لہسن، لیموں کے رس سے بنا یہ شامی ڈپ، کسی بھی کھانے کے لیے لذیذ اضافہ ہے۔',
        kmr: 'Ev mezeyê Şamî, ku ji bacanê şewitî, mast, tahînî, sîr, ava lîmonê hatiye çêkirin, lêzêdekirinek xweş e ji bo her xwarinê.',
        es: 'Esta salsa levantina, hecha de berenjena asada, yogur, tahini, ajo, jugo de limón, es una deliciosa adición a cualquier comida.',
        ru: 'Эта левантийская закуска из жареных баклажанов, йогурта, тахини, чеснока, лимонного сока - вкусное дополнение к любой еде.',
        hi: 'भुने हुए बैंगन, दही, तिल का पेस्ट, लहसुन, नींबू के रस से बना यह लेवंतीन डिप, किसी भी भोजन के लिए स्वादिष्ट अतिरिक्त है।',
        sq: 'Kjo salcë levantinë, e bërë nga patëllxhanë të pjekura, kos, tahini, hudhra, lëng limoni, është një shtesë e shijshme për çdo vakt.',
        fr: 'Cette trempette levantine, faite d\'aubergines grillées, yaourt, tahini, ail, jus de citron, est un délicieux ajout à tout repas.',
        de: 'Dieser levantinische Dip aus gerösteten Auberginen, Joghurt, Tahini, Knoblauch, Zitronensaft ist eine köstliche Ergänzung zu jeder Mahlzeit.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
      available: true,
      allergens: ['none'],
      nutritionalInfo: {
        calories: 240,
        protein: 6,
        carbs: 18,
        fat: 16,
        fiber: 12
      },
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],      tags: ['smoky', 'authentic', 'healthy', 'sharing'],
      image: '/Baba Ghanoush.jpg'
    },
    { 
      id: 1003, 
      name: { 
        en: "Nature's Garden",
        ar: 'حديقة الطبيعة',
        fa: 'باغ طبیعت',
        ku: 'باخچەی سروشت',
        tr: 'Doğa Bahçesi',
        ur: 'فطرت کا باغ',
        kmr: 'Baxçeya Xwezayê',
        es: 'Jardín de la Naturaleza',
        ru: 'Сад природы',
        hi: 'प्रकृति का बाग',
        sq: 'Kopshti i Natyrës',
        fr: 'Jardin de la Nature',
        de: 'Natur-Garten'
      }, 
      description: { 
        en: 'A light and nutritious savory dip is made with a base of yogurt, garlic and aromatic spices, and it is topped with dried tomatoes, fresh thyme, walnuts, mint, Kalamata olives and olive oil.',
        ar: 'غموس مالح خفيف ومغذي مصنوع بقاعدة من الزبادي والثوم والتوابل العطرة، ومزين بالطماطم المجففة والزعتر الطازج والجوز والنعناع وزيتون كالاماتا وزيت الزيتون.',
        fa: 'دیپ خوشمزه سبک و مغذی با پایه ماست، سیر و ادویه‌های معطر ساخته شده و با گوجه خشک، آویشن تازه، گردو، نعنا، زیتون کالاماتا و روغن زیتون تزیین شده.',
        ku: 'دیپێکی خۆش و سووک و بەهێز بە بنەڕەتی مۆست و سیر و بەهاراتی بۆنخۆش دروستکراوە، و بە تەماتەی وشک و جەعدەی تازە و گوێز و پونگ و زەیتونی کالاماتا و زەیتی زەیتوون ڕازاوەتەوە.',
        tr: 'Yoğurt, sarımsak ve aromatik baharatlarla yapılan hafif ve besleyici lezzetli meze, kurutulmuş domates, taze kekik, ceviz, nane, Kalamata zeytini ve zeytinyağı ile süslenmiştir.',
        ur: 'ہلکا اور غذائیت سے بھرپور لذیذ ڈپ دہی، لہسن اور خوشبودار مصالحوں کی بنیاد پر بنایا گیا ہے، اور اسے خشک ٹماٹر، تازہ جعفری، اخروٹ، پودینہ، کالاماتا زیتون اور زیتون کے تیل سے سجایا گیا ہے۔',
        kmr: 'Mezeyeke sivik û xwînmaye û bi tam ku bi bingeha mast, sîr û baharatên bêhnxweş hatiye çêkirin, û bi firangoşên ziwa, sîrînkê taze, gihoz, pûng, zeytûnên Kalamata û zeyta zeytûnê hatiye xemilandin.',
        es: 'Una salsa sabrosa ligera y nutritiva hecha con base de yogur, ajo y especias aromáticas, cubierta con tomates secos, tomillo fresco, nueces, menta, aceitunas Kalamata y aceite de oliva.',
        ru: 'Легкая и питательная пикантная закуска на основе йогурта, чеснока и ароматных специй, украшенная вялеными томатами, свежим тимьяном, грецкими орехами, мятой, оливками каламата и оливковым маслом.',
        hi: 'दही, लहसुन और सुगंधित मसालों के आधार से बना हल्का और पौष्टिक स्वादिष्ट डिप, सूखे टमाटर, ताज़ी अजवाइन, अखरोट, पुदीना, कालामाता जैतून और जैतून के तेल से सजाया गया।',
        sq: 'Një salcë e lehtë dhe ushqyese e shijshme e bërë me bazë kosi, hudhre dhe erëza aromatike, dhe është e mbuluar me domate të thata, rigon të freskët, arra, mendër, ullinj Kalamata dhe vaj ulliri.',
        fr: 'Une trempette savoureuse légère et nutritive à base de yaourt, ail et épices aromatiques, garnie de tomates séchées, thym frais, noix, menthe, olives de Kalamata et huile d\'olive.',
        de: 'Ein leichter und nahrhafter würziger Dip auf Basis von Joghurt, Knoblauch und aromatischen Gewürzen, garniert mit getrockneten Tomaten, frischem Thymian, Walnüssen, Minze, Kalamata-Oliven und Olivenöl.'
      }, 
      price: '$10.99', 
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
        kmr: 'Kibbeh',
        es: 'Kibbeh',
        ru: 'Кеббе',
        hi: 'किब्बेह',
        sq: 'Kibbeh',
        fr: 'Kibbeh',
        de: 'Kibbeh'
      }, 
      description: { 
        en: 'A Middle Eastern classic with a crispy outer shell made from finely ground rice and spices, encasing a flavorful minced meat filling. Fried to perfection, Kibbeh adds a rich aroma and unique taste to your dining experience.',
        ar: 'كلاسيكية شرق أوسطية بقشرة خارجية مقرمشة مصنوعة من الأرز المطحون ناعماً والبهارات، تحتوي على حشوة لحم مفروم نكهة. مقلية إلى الكمال، الكبة تضيف رائحة غنية وطعم فريد لتجربة تناول الطعام.',
        fa: 'یک کلاسیک خاورمیانه‌ای با پوسته بیرونی ترد از برنج آسیاب شده و ادویه‌جات، حاوی گوشت چرخ کرده طعم‌دار. سرخ شده تا کمال، کبه عطر غنی و طعم منحصر به فرد به تجربه غذایی شما می‌افزاید.',
        ku: 'کلاسیکێکی ڕۆژهەڵاتی ناوەڕاست بە قاڵبێکی دەرەوەی ترسکە لە برنجی وردکراو و بەهارات، دەوری گۆشتی وردکراوی بەتام دەگرێت. بە تەواوی سوورکراوە، کبه بۆنێکی دەوڵەمەند و تامێکی ناوازە زیاد دەکات بۆ ئەزموونی خواردنت.',
        tr: 'İnce öğütülmüş pirinç ve baharatlardan yapılan çıtır dış kabuğu olan, lezzetli kıyma doldurulmuş Orta Doğu klasiği. Mükemmelliğe kadar kızartılan Kibbeh, yemek deneyiminize zengin bir aroma ve eşsiz bir tat katıyor.',
        ur: 'باریک پسے ہوئے چاول اور مصالحوں سے بنا کرسپی بیرونی خول کے ساتھ مشرق وسطیٰ کا کلاسک، جس میں ذائقہ دار قیمہ بھرا ہوا ہے۔ کمال تک تلا ہوا، کبہ آپ کے کھانے کے تجربے میں بھرپور خوشبو اور منفرد ذائقہ شامل کرتا ہے۔',
        kmr: 'Klasîkeke Rojhilatê Navîn bi kabrikek derve yê çitir ku ji brincê xweş hatî hêsandin û baharatan hatî çêkirin, ku goştê hûrkirî yê bi tam tê de hatiye dagirtin. Heta bi temamî hatiye sorkirin, Kibbeh bêhnek dewlemend û tamek bêhempa li ser ezmûna xwarinê zêde dike.',
        es: 'Un clásico de Medio Oriente con una cáscara exterior crujiente hecha de arroz finamente molido y especias, envolviendo un relleno de carne picada sabrosa. Frita a la perfección, el Kibbeh añade un aroma rico y sabor único a tu experiencia gastronómica.',
        ru: 'Классическое ближневосточное блюдо с хрустящей внешней оболочкой из мелко молотого риса и специй, с начинкой из ароматного рубленого мяса. Жаренное до совершенства, кеббе добавляет богатый аромат и уникальный вкус к вашему обеду.',
        hi: 'बारीक पिसे चावल और मसालों से बना कुरकुरा बाहरी आवरण के साथ मध्य पूर्वी क्लासिक, जिसमें स्वादिष्ट कीमा भरा होता है। पूर्णता तक तला गया, किब्बेह आपके भोजन के अनुभव में समृद्ध सुगंध और अनूठा स्वाद जोड़ता है।',
        sq: 'Një klasik i Lindjes së Mesme me një lëvore të jashtme të krisur e bërë nga orizi i bluar imët dhe erëza, që mban një mbushje mishi të grirë plot shije. E skuqur në përsosmëri, Kibbeh-i shton një aromë të pasur dhe shije të veçantë në përvojën tuaj të ngrënies.',
        fr: 'Un classique du Moyen-Orient avec une coquille extérieure croustillante faite de riz finement moulu et d\'épices, renfermant une farce de viande hachée savoureuse. Frit à la perfection, le Kibbeh ajoute un arôme riche et un goût unique à votre expérience culinaire.',
        de: 'Ein nahöstlicher Klassiker mit knuspriger äußerer Hülle aus fein gemahlenem Reis und Gewürzen, gefüllt mit würzigem Hackfleisch. Perfekt frittiert verleiht Kibbeh Ihrem kulinarischen Erlebnis ein reiches Aroma und einen einzigartigen Geschmack.'
      }, 
      price: '$10.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['traditional', 'crispy', 'chef-special', 'authentic'],
      nutritionalInfo: {
        calories: 380,
        protein: '16g',
        carbs: '28g', 
        fat: '22g',
        fiber: '4g'
      },
      allergens: ['Gluten', 'Sesame'],
      dietaryTags: ['Halal'],      image: '/Kibbeh.jpg',
      available: true
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
        de: 'Falafels'
      }, 
      description: { 
        en: 'Consists of chickpea patties seasoned with aromatic spices and fried to a golden, crispy exterior. Served with fresh greens and a drizzle of olive oil. This delightful snack adds a delicious touch to your dining experience.',
        ar: 'يتكون من أقراص الحمص المتبلة بالتوابل العطرية والمقلية إلى لون ذهبي مقرمش من الخارج. يُقدم مع الخضروات الطازجة ورذاذ من زيت الزيتون. هذه الوجبة الخفيفة اللذيذة تضيف لمسة لذيذة لتجربة تناول الطعام.',
        fa: 'شامل کتلت‌های نخود طعم‌دار شده با ادویه‌جات معطر و سرخ شده تا بیرون طلایی و ترد. با سبزیجات تازه و قطره‌ای از روغن زیتون سرو می‌شود. این تنقلات لذیذ لمسه‌ای خوشمزه به تجربه غذایی شما می‌افزاید.',
        ku: 'پێکهاتووە لە پەتی نۆک کە بە بەهاراتی بۆنخۆش تامدراوە و سوورکراوە بۆ دەرەوەیەکی ئاڵتوونی و ترسکە. لەگەڵ سەوزەی تازە و دڵۆپەیەک زەیتی زەیتوون خراوەتە سەر. ئەم خۆراکە خۆشە لمسەیەکی خۆش زیاد دەکات بۆ ئەزموونی خواردنت.',
        tr: 'Aromatik baharatlarla tatlandırılmış ve altın sarısı, çıtır bir dış kısım elde edene kadar kızartılmış nohut köftelerinden oluşur. Taze yeşillikler ve bir tutam zeytinyağı ile servis edilir. Bu lezzetli atıştırmalık, yemek deneyiminize lezzetli bir dokunuş katıyor.',
        ur: 'خوشبودار مصالحوں کے ساتھ ذائقہ دار چنے کے پیٹی پر مشتمل ہے اور سنہری، کرسپی بیرونی حصے تک تلا جاتا ہے۔ تازہ سبزیوں اور زیتون کے تیل کے چھڑکاؤ کے ساتھ پیش کیا جاتا ہے۔ یہ لذیذ اسنیک آپ کے کھانے کے تجربے میں ایک لذیذ ٹچ شامل کرتا ہے۔',
        kmr: 'Ji pelên kurskotinê pêk tê ku bi baharatên bêhnxweş hatine tatdarkirin û heta dereke zêrîn û çitir hatine sorkirin. Bi sebzeyên taze û tiliyeke zeyta zeytûnê tê peşkêşkirin. Ev xwarinê xweş lêdanek tatdar li ser ezmûna xwarinê zêde dike.',
        es: 'Consiste en hamburguesas de garbanzos sazonadas con especias aromáticas y fritas hasta obtener un exterior dorado y crujiente. Se sirve con verduras frescas y un chorrito de aceite de oliva. Esta deliciosa botana añade un toque delicioso a tu experiencia gastronómica.',
        ru: 'Состоит из котлеток из нута, приправленных ароматными специями и обжаренных до золотистой, хрустящей корочки. Подается со свежей зеленью и сбрызгивается оливковым маслом. Эта восхитительная закуска добавляет вкусный штрих к вашему обеду.',
        hi: 'सुगंधित मसालों के साथ स्वादिष्ट चने की पैटी से बना और सुनहरा, कुरकुरा बाहरी हिस्सा बनने तक तला गया। ताज़ी हरियाली और जैतून के तेल की फुहार के साथ परोसा जाता है। यह स्वादिष्ट नाश्ता आपके भोजन के अनुभव में एक स्वादिष्ट स्पर्श जोड़ता है।',
        sq: 'Përbëhet nga patate gronosh të kondimentuara me erëza aromatike dhe të skuqura deri në një të jashtme të artë dhe të krisur. Shërbehet me gjelbërimore të freskëta dhe një spërkatje vaji ulliri. Kjo meze e shijshme shton një prekje të shijshme në përvojën tuaj të të ngrënit.',
        fr: 'Composé de galettes de pois chiches assaisonnées aux épices aromatiques et frites jusqu\'à obtenir un extérieur doré et croustillant. Servi avec des légumes verts frais et un filet d\'huile d\'olive. Cette délicieuse collation ajoute une touche savoureuse à votre expérience culinaire.',
        de: 'Besteht aus Kichererbsen-Bällchen, die mit aromatischen Gewürzen gewürzt und zu einer goldenen, knusprigen Außenhaut frittiert werden. Serviert mit frischem Grün und einem Schuss Olivenöl. Dieser köstliche Snack verleiht Ihrem kulinarischen Erlebnis eine delikate Note.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian', 'vegan'],
      nutritionalInfo: {
        calories: 320,
        protein: '14g',
        carbs: '35g', 
        fat: '16g',
        fiber: '8g'
      },
      allergens: ['Sesame'],
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],      image: '/Falafels.jpg',
      available: true
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
        kmr: 'Tevahiya Xwezayê',
        es: 'Mezcla de la Naturaleza',
        ru: 'Смесь природы',
        hi: 'प्रकृति का मिश्रण',
        sq: 'Përzierja e Natyrës',
        fr: 'Mélange de la Nature',
        de: 'Natur-Mischung'
      }, 
      description: { 
        en: 'A savory dip made with dried tomatoes, fresh thyme, walnuts, white, and olive oil.',
        ar: 'غموس مالح مصنوع من الطماطم المجففة والزعتر الطازج والجوز والأبيض وزيت الزيتون.',
        fa: 'یک دیپ خوشمزه از گوجه خشک، آویشن تازه، گردو، سفید و روغن زیتون.',
        ku: 'دیپێکی خۆش لە تەماتەی وشککراو، جەعدەی تازە، گوێز، سپی و زەیتی زەیتوون.',
        tr: 'Kurutulmuş domates, taze kekik, ceviz, beyaz ve zeytinyağından yapılan lezzetli meze.',
        ur: 'خشک ٹماٹر، تازہ جعفری، اخروٹ، سفید اور زیتون کے تیل سے بنا مزیدار ڈپ۔',
        kmr: 'Mezeyeke bi tam ku ji firangoşên ziwa, sîrînkê taze, gihok, spî û zeyta zeytûnê tê çêkirin.',
        es: 'Una salsa sabrosa hecha con tomates secos, tomillo fresco, nueces, blanco y aceite de oliva.',
        ru: 'Пикантная закуска из вяленых томатов, свежего тимьяна, грецких орехов, белого и оливкового масла.',
        hi: 'सूखे टमाटर, ताज़ा अजवाइन, अखरोट, सफेद और जैतून के तेल से बना स्वादिष्ट डिप।',
        sq: 'Një sos i shijshëm i bërë me domate të thata, rigon të freskët, arra, e bardhë dhe vaj ulliri.',
        fr: 'Une trempette savoureuse préparée avec des tomates séchées, du thym frais, des noix, du blanc et de l\'huile d\'olive.',
        de: 'Ein würziger Dip aus getrockneten Tomaten, frischem Thymian, Walnüssen, Weiß und Olivenöl.'
      }, 
      price: '$8.99', 
      category: 'appetizers', 
      tags: ['seasonal', 'summer-special', 'fresh-herbs', 'garden-fresh'],
      seasonal: {
        available: ['spring', 'summer'],
        note: 'Best enjoyed with fresh summer herbs'
      },
      nutritionalInfo: {
        calories: 320,
        protein: '8g',
        carbs: '12g',
        fat: '28g',
        fiber: '4g'
      },
      allergens: ['Nuts'],
      dietaryTags: ['Vegetarian', 'Gluten-Free'],      image: '/Nature\'s Blend.jpg',
      available: true 
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
        de: 'Börek'
      }, 
      description: { 
        en: 'Turkish pastry stuffed with either four cheeses or spinach, herbs and cheese.',
        ar: 'معجنات تركية محشوة إما بأربعة أنواع من الجبن أو بالسبانخ والأعشاب والجبن.',
        fa: 'شیرینی ترکی پر شده با چهار نوع پنیر یا اسفناج، سبزیجات و پنیر.',
        ku: 'خواردنی تورکی پڕ لە چوار جۆری پەنیر یان ئیسپیناخ و گیاکان و پەنیر.',
        tr: 'Dört çeşit peynir veya ıspanak, otlar ve peynir ile doldurulmuş Türk böreği.',
        ur: 'ترکی پیسٹری جو یا تو چار قسم کے پنیر سے بھری ہے یا پالک، جڑی بوٹیوں اور پنیر سے۔',
        kmr: 'Xwarineka Tirkî ku bi çar cûreyên penîr an jî bi spenax, giya û penîr tê dagirtin.',
        es: 'Pastelería turca rellena con cuatro quesos o espinacas, hierbas y queso.',
        ru: 'Турецкая выпечка с начинкой из четырех сыров или шпината, трав и сыра.',
        hi: 'तुर्की पेस्ट्री जो चार प्रकार के पनीर या पालक, जड़ी-बूटियों और पनीर से भरी है।',
        sq: 'Pastiçeri turke e mbushur me katër lloje djathash ose spinaq, bimë dhe djathë.',
        fr: 'Pâtisserie turque farcie de quatre fromages ou d\'épinards, herbes et fromage.',
        de: 'Türkisches Gebäck gefüllt mit vier Käsesorten oder Spinat, Kräutern und Käse.'
      }, 
      price: '$10.99', 
      category: 'appetizers', 
      tags: ['traditional', 'crispy', 'savory', 'handmade', 'turkish', 'popular'],
      nutritionalInfo: {
        calories: 420,
        protein: '18g',
        carbs: '32g', 
        fat: '25g',
        fiber: '3g'
      },
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      dietaryTags: ['Halal'],      image: '/Borek.jpg',
      available: true
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
        de: 'Vorspeisen-Kombination'
      }, 
      description: { 
        en: 'This platter brings together four of the most beloved mezze flavors from the Middle East, along with delicious falafel pastries. With its elegant presentation and magnificent aromas, it will add a delightful touch to your table.',
        ar: 'يجمع هذا الطبق أربعة من أحب نكهات المزة من الشرق الأوسط، إلى جانب فطائر الفلافل اللذيذة. بعرضه الأنيق وروائحه الرائعة، سيضيف لمسة رائعة إلى طاولتك.',
        fa: 'این بشقاب چهار طعم محبوب مزه از خاورمیانه را به همراه شیرینی‌های فلافل لذیذ گرد هم می‌آورد. با ارائه شیک و عطرهای شکوهمندش لمسه‌ای لذت‌بخش به میز شما اضافه خواهد کرد.',
        ku: 'ئەم قاپە چوار لە خۆشترین تامی مەزەی ڕۆژهەڵاتی ناوەڕاست کۆدەکاتەوە، لەگەڵ شیرینی فەلەفڵی خۆش. بە پێشکەشکردنی جوان و بۆنە شکۆدارەکانی، لمسەیەکی خۆش زیاد دەکات بۆ مێزەکەت.',
        tr: 'Bu tabak, lezzetli falafel hamur işleriyle birlikte Orta Doğu\'nun en sevilen dört meze lezzetini bir araya getiriyor. Zarif sunumu ve muhteşem aromalarıyla masanıza keyifli bir dokunuş katacak.',
        ur: 'یہ پلیٹر مشرق وسطیٰ کے چار سب سے محبوب مزے کے ذائقوں کو لذیذ فلافل پیسٹری کے ساتھ اکٹھا کرتا ہے۔ اپنی خوبصورت پریزنٹیشن اور شاندار خوشبوؤں کے ساتھ، یہ آپ کی میز میں خوشگوار ٹچ شامل کرے گا۔',
        kmr: 'Ev qabê çar tamên mezeyên herî dilxwaz ên Rojhilatê Navîn, digel şîrîniyên falafel ên bi tam, kom dike. Bi pêşkêşkirina xwe ya xweş û bêhnên xwe yên ecêb, dê lêdanek xweş li ser masaya we zêde bike.',
        es: 'Esta fuente reúne cuatro de los sabores de meze más queridos del Medio Oriente, junto con deliciosos pasteles de falafel. Con su elegante presentación y magníficos aromas, añadirá un toque delicioso a tu mesa.',
        ru: 'Это блюдо объединяет четыре самых любимых вкуса мезе с Ближнего Востока вместе с вкусной фалафельной выпечкой. С элегантной подачей и великолепными ароматами, оно добавит восхитительный штрих к вашему столу.',
        hi: 'यह प्लेटर मध्य पूर्व के चार सबसे प्रिय मेज़े स्वादों को स्वादिष्ट फलाफेल पेस्ट्री के साथ मिलाता है। अपनी सुंदर प्रस्तुति और शानदार सुगंध के साथ, यह आपकी मेज़ पर एक आनंददायक स्पर्श जोड़ेगा।',
        sq: 'Kjo pjatë bashkon katër nga shijët më të dashura të mezes nga Lindja e Mesme, së bashku me ëmbëlsira të shijshme falafeli. Me prezantimin e saj elegant dhe aromat e shkëlqyera, do të shtojë një prekje të këndshme në tryezën tuaj.',
        fr: 'Cette assiette rassemble quatre des saveurs de mezze les plus appréciées du Moyen-Orient, accompagnées de délicieuses pâtisseries falafel. Avec sa présentation élégante et ses arômes magnifiques, elle ajoutera une touche délicieuse à votre table.',
        de: 'Diese Platte vereint vier der beliebtesten Mezze-Geschmäcker aus dem Nahen Osten zusammen mit köstlichen Falafel-Gebäckstücken. Mit ihrer eleganten Präsentation und herrlichen Aromen verleiht sie Ihrem Tisch eine wunderbare Note.'
      }, 
      price: '$24.99', 
      category: 'appetizers', 
      popular: true, 
      tags: ['vegetarian'],
      nutritionalInfo: {
        calories: 680,
        protein: '24g',
        carbs: '58g', 
        fat: '38g',
        fiber: '12g'
      },
      allergens: ['Sesame', 'Tahini'],
      dietaryTags: ['Vegetarian', 'Vegan', 'Halal'],      image: '/Appetizers Combo.jpg',
      available: true
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
        hi: 'मसूर का सूप',
        sq: 'Supë Thjerrash',
        fr: 'Soupe de Lentilles',
        de: 'Linsensuppe'
      }, 
      description: { 
        en: 'A hearty and nutritious soup made with red lentils, onions, carrots, potatoes, and a blend of spices.',
        ar: 'شوربة شهية ومغذية مصنوعة من العدس الأحمر والبصل والجزر والبطاطس ومزيج من التوابل.',
        fa: 'سوپ مقوی و مغذی از عدس قرمز، پیاز، هویج، سیب‌زمینی و ترکیبی از ادویه‌جات.',
        ku: 'شۆربەیەکی بەهێز و بەتوانا لە نیسکی سوور، پیاز، گەزەر، پەتاتە و تێکەڵەیەک لە بەهارات.',
        tr: 'Kırmızı mercimek, soğan, havuç, patates ve baharat karışımı ile yapılan tok tutucu ve besleyici çorba.',
        ur: 'سرخ مسور، پیاز، گاجر، آلو اور مصالحوں کے مرکب سے بنا ہردل عزیز اور غذائیت سے بھرپور سوپ۔',
        kmr: 'Şorbayek xwêş û xwînbar ku ji masûrkên sor, pîvaz, gizer, kartol û tevahiya baharatan tê çêkirin.',
        es: 'Una sopa sustanciosa y nutritiva hecha con lentejas rojas, cebollas, zanahorias, papas y una mezcla de especias.',
        ru: 'Сытный и питательный суп из красной чечевицы, лука, моркови, картофеля и смеси специй.',
        hi: 'लाल मसूर, प्याज, गाजर, आलू और मसालों के मिश्रण से बना पौष्टिक और भरपूर सूप।',
        sq: 'Një supë e bollshme dhe ushqyese e bërë me thjerrëza të kuqe, qepë, karrota, patate dhe një përzierje erëzash.',
        fr: 'Une soupe nourrissante et nutritive préparée avec des lentilles rouges, des oignons, des carottes, des pommes de terre et un mélange d\'épices.',
        de: 'Eine herzhafte und nahrhafte Suppe aus roten Linsen, Zwiebeln, Karotten, Kartoffeln und einer Gewürzmischung.'
      }, 
      price: '$6.99', 
      category: 'soup', 
      popular: true, 
      tags: ['vegetarian', 'vegan'],
      nutritionalInfo: {
        calories: 220,
        protein: '12g',
        carbs: '38g', 
        fat: '3g',
        fiber: '8g'
      },
      allergens: [],
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],      image: '/Lentil Soup.jpg',
      available: true
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
        de: 'Irakische Guss-Platte'
      }, 
      description: { 
        en: 'Beef wrap, thinly sliced and seasoned. Served with a fresh salad or fries upon choice.',
        ar: 'لفافة لحم البقر، مقطعة رقيقاً ومتبلة. تُقدم مع سلطة طازجة أو بطاطس مقلية حسب الاختيار.',
        fa: 'راپ گوشت گاو، نازک برش و طعم‌دار شده. با سالاد تازه یا سیب‌زمینی سرخ‌کرده به انتخاب سرو می‌شود.',
        ku: 'ڕاپی گۆشتی گا، بە باریکی پارچەپارچە و تامدراو. لەگەڵ سالادی تازە یان پەتاتەی سوورکراو بەپێی هەڵبژاردن.',
        tr: 'İnce dilimlenmiş ve baharatlanmış sığır eti sarması. Seçiminize göre taze salata veya patates kızartması ile servis edilir.',
        ur: 'باریک کٹا اور مصالحہ دار بیف ریپ۔ آپ کی پسند کے مطابق تازہ سلاد یا فرائز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Pêçankên goştê ga yên zok perçe û bi baharatan. Li gorî bijartina we bi salatayek taze an kartolên sor tê peşkêşkirin.',
        es: 'Wrap de carne de res, finamente rebanada y sazonada. Se sirve con ensalada fresca o papas fritas a su elección.',
        ru: 'Говяжья лепешка, тонко нарезанная и приправленная. Подается со свежим салатом или картофелем фри по выбору.',
        hi: 'बीफ रैप, पतली कटी और मसालेदार। ताज़ा सलाद या फ्राइज़ के साथ आपकी पसंद पर परोसा जाता है।',
        sq: 'Wrap viçi, i prerë hollë dhe i erëzuar. Shërbehet me sallatë të freskët ose patate të skuqura sipas zgjedhjes.',
        fr: 'Wrap de bœuf, finement tranché et assaisonné. Servi avec une salade fraîche ou des frites selon votre choix.',
        de: 'Rind-Wrap, dünn geschnitten und gewürzt. Serviert mit frischem Salat oder Pommes frites nach Ihrer Wahl.'
      }, 
      price: { sandwich: '$15.99', platter: '$17.99' }, 
      variants: {
        sandwich: 15.99,
        platter: 17.99
      },
      category: 'sandwich_platter', 
      popular: true, 
      available: true,
      allergens: ['gluten'],
      nutritionalInfo: {
        calories: 520,
        protein: 28,
        carbs: 42,
        fat: 24,
        fiber: 6
      },
      dietaryTags: [],      tags: ['iraqi', 'specialty', 'traditional', 'protein-rich', 'street-food'],
      image: '/Iraqi Guss Wrap.jpg', 
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
        kmr: 'Plata Mirîşkê',
        es: 'Plato de Pollo',
        ru: 'Куриное блюдо',
        hi: 'चिकन प्लेटर',
        sq: 'Pjatë Pule',
        fr: 'Plateau de Poulet',
        de: 'Hähnchen-Platte'
      }, 
      description: { 
        en: 'Sliced, seasoned chicken wrap. Served with a side salad or fries upon choice.',
        ar: 'لفافة دجاج مقطعة ومتبلة. تُقدم مع سلطة جانبية أو بطاطس مقلية حسب الاختيار.',
        fa: 'راپ مرغ برش و طعم‌دار شده. با سالاد کناری یا سیب‌زمینی سرخ‌کرده به انتخاب سرو می‌شود.',
        ku: 'ڕاپی مریشکی پارچەپارچە و تامدراو. لەگەڵ سالادی لاتەنیشت یان پەتاتەی سوورکراو بەپێی هەڵبژاردن.',
        tr: 'Dilimlenmiş, baharatlanmış tavuk sarması. Seçiminize göre yan salata veya patates kızartması ile servis edilir.',
        ur: 'کٹا ہوا، مصالحہ دار چکن ریپ۔ آپ کی پسند کے مطابق سائیڈ سلاد یا فرائز کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Pêçankên mirîşkê yên perçe û bi baharatan. Li gorî bijartina we bi salatayek kêlek an kartolên sor tê peşkêşkirin.',
        es: 'Wrap de pollo rebanado y sazonado. Se sirve con ensalada de acompañamiento o papas fritas a su elección.',
        ru: 'Куриная лепешка, нарезанная и приправленная. Подается с гарниром из салата или картофеля фри по выбору.',
        hi: 'कटा हुआ, मसालेदार चिकन रैप। साइड सलाद या फ्राइज़ के साथ आपकी पसंद पर परोसा जाता है।',
        sq: 'Wrap pule i prerë dhe i erëzuar. Shërbehet me sallatë anësore ose patate të skuqura sipas zgjedhjes.',
        fr: 'Wrap de poulet tranché et assaisonné. Servi avec une salade d\'accompagnement ou des frites selon votre choix.',
        de: 'Geschnittener, gewürzter Hähnchen-Wrap. Serviert mit Beilagensalat oder Pommes frites nach Ihrer Wahl.'
      }, 
      price: { sandwich: '$14.99', platter: '$16.99' }, 
      category: 'sandwich_platter', 
      popular: true, 
      tags: ['grilled', 'seasoned', 'hearty', 'customizable', 'fresh'], 
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
        kmr: 'Plata Falafelan',
        es: 'Plato de Falafel',
        ru: 'Блюдо фалафель',
        hi: 'फलाफेल प्लेटर',
        sq: 'Pjatë Falafel',
        fr: 'Plateau de Falafels',
        de: 'Falafels-Platte'
      }, 
      description: { 
        en: 'Special chef made crispy falafel balls. Wrapped in soft pita bread, with fresh vegetables.',
        ar: 'كرات فلافل مقرمشة خاصة من صنع الشيف. ملفوفة في خبز البيتا الناعم، مع خضروات طازجة.',
        fa: 'کوفته‌های فلافل ترد مخصوص سرآشپز. در نان پیتای نرم پیچیده، با سبزیجات تازه.',
        ku: 'گۆڵەی فەلەفڵی ترسکەی تایبەتی دروستکراوی سەرچێشت. پێچراوەتەوە لە نانی پیتای نەرم، لەگەڵ سەوزەی تازە.',
        tr: 'Şefin özel yapımı çıtır falafel topları. Yumuşak pita ekmeği içinde taze sebzelerle sarılmış.',
        ur: 'شیف کے خاص بنائے ہوئے کرسپی فلافل بالز۔ نرم پیٹا بریڈ میں لپیٹے ہوئے، تازہ سبزیوں کے ساتھ۔',
        kmr: 'Giloyên falafel ên çitir ên taybet ên çêker. Di nanê pita yê nerm de pêçandî, bi sebzeyên taze.',
        es: 'Bolas de falafel crujientes especiales del chef. Envueltas en pan pita suave, con vegetales frescos.',
        ru: 'Специальные хрустящие шарики фалафель от шеф-повара. Завернутые в мягкую пита-лепешку со свежими овощами.',
        hi: 'शेफ के विशेष कुरकुरे फलाफेल बॉल्स। नरम पिटा ब्रेड में लपेटे गए, ताज़ी सब्जियों के साथ।',
        sq: 'Topat e veçantë të falafeli të krisura të shefit. Të mbështjella në bukë pita të butë, me perime të freskëta.',
        fr: 'Boulettes de falafel croustillantes spéciales du chef. Enroulées dans du pain pita moelleux, avec des légumes frais.',
        de: 'Spezielle knusprige Falafel-Bällchen vom Küchenchef. In weiches Pita-Brot eingewickelt, mit frischen Gemüse.'
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
        kmr: 'Nanê Hewramî',
        es: 'Naan Hawrami',
        ru: 'Нан Хаврами',
        hi: 'हवरामी नान',
        sq: 'Naan Hawrami',
        fr: 'Naan Hawrami',
        de: 'Hawrami Naan'
      }, 
      description: { 
        en: 'A delightful flatbread originating from Hawraman, traditionally baked to perfection and served warm.',
        ar: 'خبز مسطح رائع منشؤه من هەورامان، مخبوز تقليدياً إلى الكمال ويُقدم دافئاً.',
        fa: 'نان تختی لذیذ منشأ گرفته از هورامان، به طور سنتی تا کمال پخته شده و گرم سرو می‌شود.',
        ku: 'نانێکی خۆش کە لە هەورامانەوە سەرچاوەی گرتووە، بە شێوەی نەریتی بە تەواوی نانکراوە و گەرم خراوەتە سەر.',
        tr: 'Hawraman kökenli, geleneksel olarak mükemmelliğe kadar pişirilmiş ve sıcak servis edilen nefis düz ekmek.',
        ur: 'حورامان سے نکلی ہوئی لذیذ چپاتی، روایتی طور پر کمال تک پکائی گئی اور گرم پیش کی گئی۔',
        kmr: 'Nanê tekane yê xweş ku ji Hewramanê tê, bi awayê kevneşopî heta bi temamî hatiye pijandin û germ tê peşkêşkirin.',
        es: 'Un delicioso pan plano originario de Hawraman, tradicionalmente horneado a la perfección y servido caliente.',
        ru: 'Восхитительная лепешка родом из Хаврамана, традиционно выпеченная до совершенства и подаваемая тёплой.',
        hi: 'हवरामान से आने वाली स्वादिष्ट फ्लैटब्रेड, पारंपरिक रूप से पूर्णता तक पकी हुई और गर्म परोसी जाती है।',
        sq: 'Një bukë e shkëlqyer që vjen nga Hawramani, tradicionalisht e pjekur në përsosmëri dhe e shërbyer e ngrohtë.',
        fr: 'Un délicieux pain plat originaire du Hawraman, traditionnellement cuit à la perfection et servi chaud.',
        de: 'Ein köstliches Fladenbrot aus Hawraman, traditionell zur Perfektion gebacken und warm serviert.'
      }, 
      price: '$2.99', 
      category: 'naan', 
      popular: true, 
      tags: ['vegetarian'],
      nutritionalInfo: {
        calories: 180,
        protein: '6g',
        carbs: '35g', 
        fat: '2g',
        fiber: '2g'
      },
      allergens: ['Gluten'],
      dietaryTags: ['Vegetarian', 'Halal'],      image: '/Hawrami Naan.jpg',
      available: true
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
        kmr: 'Samûn',
        es: 'Samun',
        ru: 'Самун',
        hi: 'समून',
        sq: 'Samun',
        fr: 'Samoon',
        de: 'Samoon'
      }, 
      description: { 
        en: 'A delicious Middle Eastern bread, known for its soft and slightly chewy texture, often enjoyed with a variety of savory and sweet toppings.',
        ar: 'خبز شرق أوسطي لذيذ، معروف بملمسه الناعم والمطاطي قليلاً، غالباً ما يُستمتع به مع مجموعة متنوعة من الإضافات المالحة والحلوة.',
        fa: 'نان لذیذ خاورمیانه‌ای، به دلیل بافت نرم و کمی چسبناکش شناخته شده، اغلب با انواع روکش‌های شور و شیرین لذت برده می‌شود.',
        ku: 'نانێکی خۆشی ڕۆژهەڵاتی ناوەڕاست، بە دەمامکی نەرم و کەمێک چەقەڵی ناسراوە، زۆرجار لەگەڵ جۆراوجۆری رووپۆشی شۆر و شیرین چێژی لێوەردەگرێت.',
        tr: 'Yumuşak ve hafif çiğnenebilir dokusuyla tanınan lezzetli Orta Doğu ekmeği, genellikle çeşitli tuzlu ve tatlı soslarla keyifle yenir.',
        ur: 'لذیذ مشرق وسطیٰ کی روٹی، اپنی نرم اور ہلکی چپچپاہٹ کے لیے مشہور، اکثر مختلف نمکین اور میٹھے ٹاپنگز کے ساتھ لطف اٹھایا جاتا ہے۔',
        kmr: 'Nanê Rojhilatê Navîn ê bi tam, ku bi tekstura xwe ya nerm û kêm girêdayî nas dike, pir caran bi cûrbecûr sosên şor û şîrîn tê xwarin.',
        es: 'Un delicioso pan del Medio Oriente, conocido por su textura suave y ligeramente masticable, a menudo disfrutado con una variedad de aderezos salados y dulces.',
        ru: 'Восхитительный ближневосточный хлеб, известный своей мягкой и слегка жевательной текстурой, часто употребляется с различными солёными и сладкими добавками.',
        hi: 'स्वादिष्ट मध्य पूर्वी रोटी, जो अपनी नरम और थोड़ी चबाने वाली बनावट के लिए जानी जाती है, अक्सर विभिन्न नमकीन और मीठे टॉपिंग्स के साथ आनंद ली जाती है।',
        sq: 'Një bukë e shijshme e Lindjes së Mesme, e njohur për teksturën e saj të butë dhe pak të ngjashme, shpesh e shijohet me një larmi garniturash të kripura dhe të ëmbla.',
        fr: 'Un délicieux pain du Moyen-Orient, connu pour sa texture tendre et légèrement moelleuse, souvent apprécié avec diverses garnitures salées et sucrées.',
        de: 'Ein köstliches nahöstliches Brot, bekannt für seine weiche und leicht zähe Textur, oft mit einer Vielfalt von herzhaften und süßen Belägen genossen.'
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
        kmr: 'Kulera Kincî',
        es: 'Kulera de Sésamo',
        ru: 'Кулера с кунжутом',
        hi: 'तिल कुलेरा',
        sq: 'Kulera me Susam',
        fr: 'Kulera au Sésame',
        de: 'Sesam-Kulera'
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
        de: 'Eine Art Fladenbrot, das ohne ausgiebiges Kneten hergestellt wird, bekannt für seine Einfachheit und weiche, zähe Textur.'
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
        kmr: 'Pizza Margherita',
        es: 'Pizza Margherita',
        ru: 'Пицца Маргарита',
        hi: 'मार्गेरिता पिज़्ज़ा',
        sq: 'Pica Margherita',
        fr: 'Pizza Margherita',
        de: 'Margherita Pizza'
      }, 
      description: { 
        en: 'A classic Italian pizza topped with fresh mozzarella cheese, aromatic basil, and flavorful tomato sauce. The thin and crispy crust is lightly brushed with olive oil.',
        ar: 'بيتزا إيطالية كلاسيكية مغطاة بجبن الموزاريلا الطازج والريحان العطري وصلصة الطماطم النكهة. القشرة الرقيقة والمقرمشة مدهونة قليلاً بزيت الزيتون.',
        fa: 'پیتزای کلاسیک ایتالیایی با پنیر موزارلا تازه، ریحان معطر و سس گوجه طعم‌دار. خمیر نازک و ترد کمی با روغن زیتون برس شده.',
        ku: 'پیتزایەکی کلاسیکی ئیتاڵی بە پەنیری موزارێلای تازە، ڕەیحانی بۆنخۆش و سۆسی تەماتەی خۆش. قاڵبە باریک و ترسکەکە بە کەمێک زەیتی زەیتوون بەرسکراوە.',
        tr: 'Taze mozzarella peyniri, aromatik fesleğen ve lezzetli domates sosuyla kaplanmış klasik İtalyan pizzası. İnce ve çıtır hamur zeytinyağı ile hafifçe fırçalanmıştır.',
        ur: 'تازہ موزاریلا چیز، خوشبودار تلسی اور ذائقہ دار ٹماٹر ساس کے ساتھ کلاسک اطالوی پیزا۔ پتلا اور کرسپی کرسٹ ہلکا سا زیتون کے تیل سے برش کیا گیا ہے۔',
        kmr: 'Pizzayek Îtalî ya klasîk ku bi penîrê mozzarella yê taze, reyhanê bêhnxweş û soşa firangoşê ya bi tam hatiye daxuyandin. Hevîrê zok û çitir bi zeyta zeytûnê kêm hatiye firçekirin.',
        es: 'Una pizza italiana clásica cubierta con queso mozzarella fresco, albahaca aromática y salsa de tomate sabrosa. La masa delgada y crujiente está ligeramente pincelada con aceite de oliva.',
        ru: 'Классическая итальянская пицца с свежей моцареллой, ароматным базиликом и вкусным томатным соусом. Тонкое и хрустящее тесто слегка смазано оливковым маслом.',
        hi: 'ताज़ा मोज़ाज़ेला चीज़, सुगंधित तुलसी और स्वादिष्ट टमाटर सॉस के साथ क्लासिक इतालवी पिज़्ज़ा। पतला और कुरकुरा क्रस्ट हल्का सा जैतून के तेल से ब्रश किया गया है।',
        sq: 'Një pica klasike italiane e mbuluar me djathë mozzarella të freskët, borzilok aromatik dhe salcë domatesh të shijshme. Brumi i hollë dhe i krisur është i lyer lehtë me vaj ulliri.',
        fr: 'Une pizza italienne classique garnie de mozzarella fraîche, basilic aromatique et sauce tomate savoureuse. La pâte fine et croustillante est légèrement badigeonnée d\'huile d\'olive.',
        de: 'Eine klassische italienische Pizza mit frischem Mozzarella-Käse, aromatischem Basilikum und geschmackvoller Tomatensoße. Der dünne und knusprige Teig ist leicht mit Olivenöl bestrichen.'
      }, 
      price: '$13.99', 
      category: 'pizza', 
      popular: true, 
      tags: ['vegetarian'],
      nutritionalInfo: {
        calories: 380,
        protein: '16g',
        carbs: '48g', 
        fat: '14g',
        fiber: '3g'
      },
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Vegetarian', 'Halal'],      image: '/pizza.jpg',
      available: true
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
        kmr: 'Pizza Kebab',
        es: 'Pizza Kebab',
        ru: 'Пицца с кебабом',
        hi: 'कबाब पिज़्ज़ा',
        sq: 'Pica Kabab',
        fr: 'Pizza Kebab',
        de: 'Kebab Pizza'
      }, 
      description: { 
        en: 'A savory pizza topped with thin slices of beef kabab, special sauce, iceberg lettuce, onions, cucumbers, and tomatoes. The crispy crust provides a perfect base for this fresh and flavorful combination.',
        ar: 'بيتزا مالحة مغطاة بشرائح رقيقة من كباب اللحم البقري وصلصة خاصة وخس الجبل الجليدي والبصل والخيار والطماطم. القشرة المقرمشة توفر قاعدة مثالية لهذا المزيج الطازج واللذيذ.',
        fa: 'پیتزای خوشمزه با برش‌های نازک کباب گوشت گاو، سس مخصوص، کاهو یخی، پیاز، خیار و گوجه‌فرنگی. خمیر ترد پایه‌ای عالی برای این ترکیب تازه و طعم‌دار فراهم می‌کند.',
        ku: 'پیتزایەکی خۆش بە پارچە باریکەکانی کەبابی گۆشتی گا، سۆسی تایبەت، خسی قەڵەمی، پیاز، خیار و تەماتە. قاڵبە ترسکەکە بنکەیەکی تەواو دابین دەکات بۆ ئەم تێکەڵە تازە و خۆشە.',
        tr: 'İnce dana kebap dilimleri, özel sos, buzdolabı marulu, soğan, salatalık ve domatesle kaplanmış lezzetli pizza. Çıtır hamur, bu taze ve lezzetli kombinasyon için mükemmel bir taban sağlar.',
        ur: 'بیف کباب کے پتلے ٹکڑوں، خاص ساس، آئس برگ لیٹس، پیاز، کھیرا اور ٹماٹر کے ساتھ لذیذ پیزا۔ کرسپی کرسٹ اس تازہ اور ذائقہ دار امتزاج کے لیے بہترین بیس فراہم کرتا ہے۔',
        kmr: 'Pizzayek bi tam ku bi perçeyên zok ên kebabê goştê ga, soşa taybet, salata qelemî, pîvaz, xiyar û firangoşan hatiye daxuyandin. Hevîrê çitir bingeheke temam ji bo vê tevahiya taze û bi tam peyda dike.',
        es: 'Una pizza sabrosa cubierta con rebanadas finas de kebab de res, salsa especial, lechuga iceberg, cebollas, pepinos y tomates. La masa crujiente proporciona una base perfecta para esta combinación fresca y sabrosa.',
        ru: 'Пряная пицца с тонкими ломтиками говяжьего кебаба, специальным соусом, салатом айсберг, луком, огурцами и помидорами. Хрустящее тесто обеспечивает идеальную основу для этой свежей и вкусной комбинации.',
        hi: 'पतले बीफ कबाब के टुकड़ों, विशेष सॉस, आइसबर्ग लेट्यूस, प्याज़, खीरा और टमाटर के साथ स्वादिष्ट पिज़्ज़ा। कुरकुरा क्रस्ट इस ताज़े और स्वादिष्ट संयोजन के लिए एक बेहतरीन आधार प्रदान करता है।',
        sq: 'Një pica e shijshme e mbuluar me copa të holla kebabi viçi, salcë të veçantë, sallatë ajsberg, qepë, kastravec dhe domate. Brumi i krisur siguron një bazë perfekte për këtë kombinim të freskët dhe plot shije.',
        fr: 'Une pizza savoureuse garnie de fines tranches de kebab de bœuf, sauce spéciale, laitue iceberg, oignons, concombres et tomates. La pâte croustillante fournit une base parfaite pour cette combinaison fraîche et savoureuse.',
        de: 'Eine herzhafte Pizza mit dünnen Rind-Kebab-Scheiben, spezieller Sauce, Eisbergsalat, Zwiebeln, Gurken und Tomaten. Der knusprige Teig bietet eine perfekte Basis für diese frische und geschmackvolle Kombination.'
      }, 
      price: '$16.99', 
      category: 'pizza', 
      popular: true, 
      tags: ['meat-lovers', 'savory', 'fresh-toppings', 'crispy', 'specialty'],
      nutritionalInfo: {
        calories: 520,
        protein: '28g',
        carbs: '52g', 
        fat: '22g',
        fiber: '4g'
      },
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Halal'],      image: '/mkabab.jpg',
      available: true
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
        kmr: 'Pizza Mirîşk',
        es: 'Pizza de Pollo',
        ru: 'Пицца с курицей',
        hi: 'चिकन पिज़्ज़ा',
        sq: 'Pica Pule',
        fr: 'Pizza au Poulet'
      }, 
      description: { 
        en: 'A delightful pizza featuring tender chicken slices, special sauce, iceberg lettuce, onions, cucumbers, and tomatoes. The crispy crust enhances the fresh and savory flavors of this dish.',
        ar: 'بيتزا رائعة تحتوي على شرائح دجاج طرية وصلصة خاصة وخس الجبل الجليدي والبصل والخيار والطماطم. القشرة المقرمشة تعزز النكهات الطازجة والمالحة لهذا الطبق.',
        fa: 'پیتزای لذیذ با برش‌های نرم مرغ، سس مخصوص، کاهو یخی، پیاز، خیار و گوجه‌فرنگی. خمیر ترد طعم‌های تازه و خوشمزه این غذا را تقویت می‌کند.',
        ku: 'پیتزایەکی خۆش بە پارچە نەرمەکانی مریشک، سۆسی تایبەت، خسی قەڵەمی، پیاز، خیار و تەماتە. قاڵبە ترسکەکە تامە تازە و خۆشەکانی ئەم خۆراکە بەهێز دەکات.',
        tr: 'Yumuşak tavuk dilimleri, özel sos, buzdolabı marulu, soğan, salatalık ve domatesli keyifli pizza. Çıtır hamur, bu yemeğin taze ve lezzetli tatlarını artırır.',
        ur: 'نرم چکن کے ٹکڑوں، خاص ساس، آئس برگ لیٹس، پیاز، کھیرا اور ٹماٹر کے ساتھ لذیذ پیزا۔ کرسپی کرسٹ اس ڈش کے تازہ اور لذیذ ذائقوں کو بڑھاتا ہے۔',
        kmr: 'Pizzayek xweş bi perçeyên nerm ên mirîşk, soşa taybet, salata qelemî, pîvaz, xiyar û firangoşan. Hevîrê çitir tamên taze û xweş ên vê xwarinê zêde dike.',
        es: 'Una pizza deliciosa con rebanadas tiernas de pollo, salsa especial, lechuga iceberg, cebollas, pepinos y tomates. La masa crujiente realza los sabores frescos y sabrosos de este plato.',
        ru: 'Восхитительная пицца с нежными кусочками курицы, специальным соусом, салатом айсберг, луком, огурцами и помидорами. Хрустящая корочка подчеркивает свежие и пикантные вкусы этого блюда.',
        hi: 'नरम चिकन के टुकड़ों, विशेष सॉस, आइसबर्ग लेटस, प्याज़, खीरा और टमाटर के साथ स्वादिष्ट पिज़्ज़ा। कुरकुरा क्रस्ट इस व्यंजन के ताज़े और स्वादिष्ट स्वाद को बढ़ाता है।',
        sq: 'Një pica e mrekullueshme me copa të buta pule, salcë të veçantë, sallatë ajsberg, qepë, kastravec dhe domate. Brumi i krisur thekson shijët e freskëta dhe të shijshme të këtij pjati.',
        fr: 'Une pizza délicieuse avec des tranches tendres de poulet, sauce spéciale, laitue iceberg, oignons, concombres et tomates. La pâte croustillante rehausse les saveurs fraîches et savoureuses de ce plat.',
        de: 'Eine köstliche Pizza mit zarten Hähnchenscheiben, spezieller Sauce, Eisbergsalat, Zwiebeln, Gurken und Tomaten. Der knusprige Boden unterstreicht die frischen und herzhaften Aromen dieses Gerichts.'
      }, 
      price: '$15.99', 
      category: 'pizza', 
      popular: true, 
      tags: ['customer-favorite', 'protein-rich', 'fresh-toppings', 'crispy'],
      nutritionalInfo: {
        calories: 450,
        protein: '26g',
        carbs: '50g', 
        fat: '16g',
        fiber: '4g'
      },
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Halal'],      image: '/chk.jpg',
      available: true
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
        kmr: 'Lahmacun',
        es: 'Lahmacun',
        ru: 'Лахмаджун',
        hi: 'लहमाजुन',
        sq: 'Lahmacun',
        fr: 'Lahmacun'
      }, 
      description: { 
        en: 'A traditional dish made with a thin dough topped with a flavorful mixture of minced meat, onions, peppers, tomatoes, and spices. Served with lettuce, sumac onions, and lemon on the side.',
        ar: 'طبق تقليدي مصنوع من عجينة رقيقة مغطاة بخليط نكهة من اللحم المفروم والبصل والفلفل والطماطم والتوابل. يُقدم مع الخس وبصل السماق والليمون على الجانب.',
        fa: 'غذای سنتی با خمیر نازک روکش شده با مخلوط طعم‌دار گوشت چرخ کرده، پیاز، فلفل، گوجه‌فرنگی و ادویه‌جات. با کاهو، پیاز سماق و لیمو در کنار سرو می‌شود.',
        ku: 'خۆراکێکی نەریتی بە هەویری باریک کە بە تێکەڵەیەکی خۆشی گۆشتی وردکراو، پیاز، بیبەر، تەماتە و بەهارات داپۆشراوە. لەگەڵ خس، پیازی سوماق و لیمۆ لە لاتەنیشتەوە خراوەتە سەر.',
        tr: 'Kıyma, soğan, biber, domates ve baharat karışımı ile kaplanmış ince hamurdan yapılan geleneksel yemek. Marul, sumak soğanı ve limon ile yan tarafta servis edilir.',
        ur: 'پتلے آٹے سے بنا روایتی کھانا جس پر قیمہ، پیاز، مرچ، ٹماٹر اور مصالحوں کا ذائقہ دار مکسچر لگایا جاتا ہے۔ لیٹس، سماق پیاز اور لیموں کے ساتھ ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Xwarineke kevneşopî ku bi hevîreke zok hatiye çêkirin û bi tevahiyek bi tam a goştê hûrkirî, pîvaz, biber, firangoş û baharatan hatiye daxuyandin. Bi salata kesk, pîvazê sumaq û lîmonê li kêleka tê peşkêşkirin.',
        es: 'Un plato tradicional hecho con masa delgada cubierta con una mezcla sabrosa de carne picada, cebollas, pimientos, tomates y especias. Se sirve con lechuga, cebollas con sumac y limón a un lado.',
        ru: 'Традиционное блюдо из тонкого теста, покрытое ароматной смесью из рубленого мяса, лука, перца, помидоров и специй. Подается с салатом, луком с сумахом и лимоном.',
        hi: 'पतले आटे से बना पारंपरिक व्यंजन जिस पर कीमा, प्याज़, मिर्च, टमाटर और मसालों का स्वादिष्ट मिश्रण लगाया गया है। सलाद, सुमाक प्याज़ और नींबू के साथ परोसा जाता है।',
        sq: 'Një pjatë tradicionale e bërë me brumë të hollë të mbuluar me një përzierje të shijshme mishi të grirë, qepë, spec, domate dhe erëza. Shërbehet me sallatë, qepë sumak dhe limon në krah.',
        fr: 'Un plat traditionnel fait avec une pâte fine garnie d\'un mélange savoureux de viande hachée, oignons, poivrons, tomates et épices. Servi avec salade, oignons au sumac et citron à côté.',
        de: 'Ein traditionelles Gericht aus dünnem Teig, belegt mit einer würzigen Mischung aus Hackfleisch, Zwiebeln, Paprika, Tomaten und Gewürzen. Serviert mit Salat, Sumach-Zwiebeln und Zitrone als Beilage.'
      }, 
      price: '$15.99', 
      category: 'pizza', 
      tags: ['traditional', 'thin-crust', 'spicy', 'middle-eastern', 'authentic'],
      nutritionalInfo: {
        calories: 420,
        protein: '22g',
        carbs: '45g', 
        fat: '16g',
        fiber: '3g'
      },
      allergens: ['Gluten'],
      dietaryTags: ['Halal'],      image: '/Lahmacun.jpg',
      available: true
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
        kmr: 'Keştî',
        es: 'Barco',
        ru: 'Лодка',
        hi: 'नौका',
        sq: 'Varkë',
        fr: 'Barque'
      }, 
      description: { 
        en: 'A pizza with a boat-shaped crust. Topped with cheese, sauce, and various ingredients. It\'s presented in a unique boat shape and often garnished with a variety of toppings.',
        ar: 'بيتزا بقشرة على شكل قارب. مغطاة بالجبن والصلصة ومكونات مختلفة. تُقدم في شكل قارب فريد وغالباً ما تُزين بمجموعة متنوعة من الإضافات.',
        fa: 'پیتزایی با خمیر قایقی شکل. با پنیر، سس و مواد مختلف روکش شده. به شکل قایق منحصر به فرد ارائه می‌شود و اغلب با انواع روکش تزیین می‌شود.',
        ku: 'پیتزایەک بە قاڵبی شێوەی بەلەم. بە پەنیر، سۆس و پێکهاتە جۆراوجۆرەکان داپۆشراوە. بە شێوەی بەلەمی ناوازە پێشکەش دەکرێت و زۆرجار بە جۆراوجۆری رووپۆش ڕازاوەتەوە.',
        tr: 'Tekne şeklinde hamurlu pizza. Peynir, sos ve çeşitli malzemelerle kaplanır. Eşsiz bir tekne şeklinde sunulur ve genellikle çeşitli soslarla süslenir.',
        ur: 'کشتی کی شکل والے کرسٹ کے ساتھ پیزا۔ چیز، ساس اور مختلف اجزاء کے ساتھ ٹاپ کیا گیا۔ یہ منفرد کشتی کی شکل میں پیش کیا جاتا ہے اور اکثر مختلف ٹاپنگز سے سجایا جاتا ہے۔',
        kmr: 'Pizzayek bi hevîreke wekî keştî. Bi penîr, soş û maddeyên cûrbecûr hatiye daxuyandin. Bi şêweya keştîyeke bêhempa tê peşkêşkirin û pir caran bi cûrbecûr sosên hatiye xemilandin.',
        es: 'Una pizza con masa en forma de barco. Cubierta con queso, salsa y varios ingredientes. Se presenta en una forma única de barco y a menudo se adorna con una variedad de aderezos.',
        ru: 'Пицца с корочкой в форме лодки. Покрыта сыром, соусом и различными ингредиентами. Подается в уникальной форме лодки и часто украшается разнообразными начинками.',
        hi: 'नाव के आकार की क्रस्ट वाला पिज़्ज़ा। चीज़, सॉस और विभिन्न सामग्री के साथ टॉप किया गया। यह अनोखे नाव के आकार में पेश किया जाता है और अक्सर विभिन्न टॉपिंग्स से सजाया जाता है।',
        sq: 'Një pica me brumë në formë varke. E mbuluar me djathë, salcë dhe përbërës të ndryshëm. Paraqitet në një formë unike varke dhe shpesh zbukurohet me një larmi garniturash.',
        fr: 'Une pizza avec une pâte en forme de bateau. Garnie de fromage, sauce et divers ingrédients. Présentée dans une forme unique de bateau et souvent décorée avec une variété de garnitures.',
        de: 'Eine Pizza mit bootsförmigem Teig. Belegt mit Käse, Sauce und verschiedenen Zutaten. Wird in einzigartiger Bootsform präsentiert und oft mit vielfältigen Belägen garniert.'
      }, 
      price: { kabab: '$16.99', chicken: '$15.99' }, 
      category: 'pizza', 
      tags: ['unique-shape', 'boat-style', 'specialty', 'sharing', 'Instagram-worthy'],
      nutritionalInfo: {
        calories: 520,
        protein: '28g',
        carbs: '48g',
        fat: '22g',
        fiber: '4g'
      },
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      dietaryTags: ['Halal'],      image: '/kpizza.jpg',
      available: true,
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
        kmr: 'Pizza Sebzeyan',
        es: 'Pizza Vegetal',
        ru: 'Овощная пицца',
        hi: 'वेजी पिज़्ज़ा',
        sq: 'Pica Perimesh',
        fr: 'Pizza aux Légumes'
      }, 
      description: { 
        en: 'A delectable pizza loaded with an assortment of fresh, colorful vegetables and your choice of cheese, perfect for veggie lovers.',
        ar: 'بيتزا لذيذة محملة بتشكيلة من الخضروات الطازجة الملونة واختيارك من الجبن، مثالية لمحبي الخضار.',
        fa: 'پیتزای لذیذ پر از انواع سبزیجات تازه و رنگارنگ و پنیر انتخابی شما، عالی برای عاشقان سبزیجات.',
        ku: 'پیتزایەکی خۆش پڕ لە جۆراوجۆری سەوزەی تازە و ڕەنگاوڕەنگ و پەنیری هەڵبژاردەت، تەواو بۆ خۆشەویستانی سەوزە.',
        tr: 'Taze, renkli sebze çeşitleri ve seçtiğiniz peynirle dolu nefis pizza, sebze severler için mükemmel.',
        ur: 'تازہ، رنگین سبزیوں کی اقسام اور آپ کی پسند کے چیز سے بھرا لذیذ پیزا، سبزی پسندوں کے لیے بہترین۔',
        kmr: 'Pizzayek bi tam ku bi cûrbecûr sebzeyên taze û rengîn û penîrê vebijêrka te hatiye barkirî, ji bo hezkiriyanê sebzeyan temam.',
        es: 'Una pizza deliciosa cargada con un surtido de vegetales frescos y coloridos y queso de tu elección, perfecta para los amantes de las verduras.',
        ru: 'Восхитительная пицца с ассортиментом свежих, красочных овощей и сыром на ваш выбор, идеальна для любителей овощей.',
        hi: 'ताज़ी, रंगीन सब्जियों की एक श्रृंखला और आपकी पसंद के चीज़ से भरा स्वादिष्ट पिज़्ज़ा, सब्जी प्रेमियों के लिए बिल्कुल सही।',
        sq: 'Një pica e shijshme e mbushur me një përzierje perimesh të freskëta dhe me ngjyra dhe djathë sipas zgjedhjes suaj, perfekte për dashamirët e perimeve.',
        fr: 'Une pizza délicieuse chargée d\'un assortiment de légumes frais et colorés avec le fromage de votre choix, parfaite pour les amateurs de légumes.',
        de: 'Eine köstliche Pizza beladen mit einer Auswahl frischer, bunter Gemüsesorten und Käse Ihrer Wahl, perfekt für Gemüseliebhaber.'
      }, 
      price: '$14.99', 
      category: 'pizza', 
      tags: ['vegetarian'],
      nutritionalInfo: {
        calories: 390,
        protein: '18g',
        carbs: '44g',
        fat: '15g',
        fiber: '6g'
      },
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Vegetarian', 'Halal'],      image: '/Veggie Platter.jpg',
      available: true 
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
        kmr: 'Mesgûf',
        es: 'Masgouf',
        ru: 'Масгуф',
        hi: 'मसगूफ',
        sq: 'Masgouf',
        fr: 'Masgouf'
      }, 
      description: { 
        en: 'Our special Iraqi style fish, marinated with a blend of spices, then slow-cooked to perfection over an open flame. (*Must be ordered a day before visit.)',
        ar: 'سمكنا العراقي الخاص، متبل بمزيج من التوابل، ثم مطبوخ ببطء إلى الكمال على نار مفتوحة. (*يجب طلبه قبل يوم من الزيارة.)',
        fa: 'ماهی مخصوص عراقی ما، با ترکیبی از ادویه‌جات مزه‌دار شده، سپس روی شعله آزاد به آرامی تا کمال پخته شده. (*باید یک روز قبل از بازدید سفارش داده شود.)',
        ku: 'ماسی تایبەتی عێراقیمان، بە تێکەڵەیەک لە بەهارات تامدراوە، پاشان بە هێواشی بەسەر ئاگری کراوەدا بە تەواوی لێنراوە. (*دەبێت ڕۆژێک پێش سەردان داوا بکرێت.)',
        tr: 'Baharat karışımı ile marine edilmiş özel Irak tarzı balığımız, ardından açık ateşte mükemmelliğe kadar yavaş pişirilmiş. (*Ziyaretten bir gün önce sipariş edilmelidir.)',
        ur: 'ہماری خاص عراقی طرز کی مچھلی، مصالحوں کے مرکب سے میرینیٹ کی گئی، پھر کھلی آگ پر آہستہ آہستہ کمال تک پکائی گئی۔ (*دورے سے ایک دن پہلے آرڈر کرنا ضروری ہے۔)',
        kmr: 'Masîyê me yê taybet ê şêwaza Îraqî, bi tevahiyek baharatan hatiye marînekirin, paşê li ser agirê vekirî hêdî hêdî heta bi temamî hatiye pijandin. (*Divê rojek berî serdanê were siparişkirin.)',
        es: 'Nuestro pescado especial estilo iraquí, marinado con una mezcla de especias, luego cocido lentamente a la perfección sobre llama abierta. (*Debe pedirse un día antes de la visita.)',
        ru: 'Наша фирменная рыба в иракском стиле, маринованная в смеси специй, затем медленно приготовленная до совершенства на открытом огне. (*Должна быть заказана за день до визита.)',
        hi: 'हमारी विशेष इराकी स्टाइल मछली, मसालों के मिश्रण से मैरिनेट की गई, फिर खुली आग पर धीरे-धीरे पूर्णता तक पकाई गई। (*यात्रा से एक दिन पहले ऑर्डर करना आवश्यक है।)',
        sq: 'Peshku ynë special në stil irakian, i marinuar me një përzierje erërash, pastaj i gatuar ngadalë deri në përsosmëri mbi një flakë të hapur. (*Duhet porositur një ditë para vizitës.)',
        fr: 'Notre poisson spécial de style irakien, mariné dans un mélange d\'épices, puis cuit lentement à la perfection sur flamme ouverte. (*Doit être commandé un jour avant la visite.)',
        de: 'Unser spezieller Fisch im irakischen Stil, mariniert mit einer Gewürzmischung, dann langsam zur Perfektion über offener Flamme gegart. (*Muss einen Tag vor dem Besuch bestellt werden.)'
      }, 
      price: { serving2: '$39.99', serving4: '$74.99' }, 
      category: 'fish', 
      popular: true, 
      tags: ['iraqi-specialty', 'flame-grilled', 'marinated', 'advance-order', 'traditional'], 
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
        kmr: 'Perde Biryani',
        es: 'Parda Biryani',
        ru: 'Парда Бирьяни',
        hi: 'परदा बिरयानी',
        sq: 'Parda Biryani',
        fr: 'Biryani Parda'
      }, 
      description: { 
        en: 'A rich dish of spiced rice, prepared with beef, dried grapes, almonds, peas, and potatoes, encased in a delicate layer of pastry and baked to perfection. Served with a fresh salad on the side.',
        ar: 'طبق غني من الأرز المتبل، محضر مع لحم البقر والعنب المجفف واللوز والبازلاء والبطاطس، مغلف بطبقة رقيقة من العجين ومخبوز إلى الكمال. يُقدم مع سلطة طازجة على الجانب.',
        fa: 'غذای غنی از برنج طعم‌دار، با گوشت گاو، کشمش، بادام، نخود فرنگی و سیب‌زمینی تهیه شده، در لایه‌ای ظریف از خمیر پوشانده و تا کمال پخته شده. با سالاد تازه در کنار سرو می‌شود.',
        ku: 'خۆراکێکی دەوڵەمەند لە برنجی تامدراو، لەگەڵ گۆشتی گا، ترێی وشککراو، بادەم، نۆک و پەتاتە ئامادەکراوە، لە چینێکی نازکی هەویردا پێچراوەتەوە و بە تەواوی نانکراوە. لەگەڵ سالادی تازە لە لاتەنیشتەوە خراوەتە سەر.',
        tr: 'Dana eti, kuru üzüm, badem, bezelye ve patatesle hazırlanmış baharatlı pirinçten oluşan zengin yemek, ince hamur tabakası ile kaplanmış ve mükemmelliğe kadar pişirilmiştir. Yan tarafta taze salata ile servis edilir.',
        ur: 'مصالحہ دار چاول کا بھرپور کھانا، گائے کا گوشت، خشک انگور، بادام، مٹر اور آلو کے ساتھ تیار کیا گیا، آٹے کی نازک تہ میں لپیٹا اور کمال تک پکایا گیا۔ ساتھ میں تازہ سلاد کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Xwarineke dewlemend a brincê bi baharatan, bi goştê ga, tiriyên ziwa, behîvan, nokan û kartolan hatiye amade kirin, di çîneke hevîrê nazik de hatiye pêçandin û heta bi temamî hatiye pijandin. Bi salatayek taze li kêleka tê peşkêşkirin.',
        es: 'Un plato rico de arroz especiado, preparado with carne de res, uvas pasas, almendras, guisantes y patatas, envuelto en una delicada capa de masa y horneado a la perfección. Servido con una ensalada fresca al lado.',
        ru: 'Богатое блюдо из пряного риса с говядиной, сушёным виноградом, миндалём, горошком и картофелем, завёрнутое в тонкий слой теста и запечённое до совершенства. Подаётся со свежим салатом.',
        hi: 'मसालेदार चावल का समृद्ध व्यंजन, गाय के मांस, सूखे अंगूर, बादाम, मटर और आलू के साथ तैयार, नाजुक आटे की परत में लपेटा और परफेक्शन तक बेक किया गया। साइड में ताजा सलाद के साथ परोसा जाता है।',
        sq: 'Një pjatë i pasur orizi të erëzuar, i përgatitur me viç, rrush të thatë, bajame, bizele dhe patate, i mbështjellë në një shtresë delikate brumi dhe i pjekur në përsosmëri. Shërbehet me sallatë të freskët në krah.',
        fr: 'Un plat riche de riz épicé, préparé avec du bœuf, des raisins secs, des amandes, des petits pois et des pommes de terre, enrobé dans une délicate couche de pâte et cuit à la perfection. Servi avec une salade fraîche en accompagnement.',
        de: 'Ein reichhaltiges Gericht aus gewürztem Reis, zubereitet mit Rindfleisch, getrockneten Weintrauben, Mandeln, Erbsen und Kartoffeln, umhüllt von einer zarten Teigschicht und zur Perfektion gebacken. Serviert mit einem frischen Salat als Beilage.'
      }, 
      price: '$21.99', 
      category: 'specialty', 
      popular: true, 
      tags: ['signature-dish', 'traditional', 'festive', 'aromatic', 'chef-special'],
      nutritionalInfo: {
        calories: 680,
        protein: '32g',
        carbs: '85g',
        fat: '18g',
        fiber: '5g'
      },
      allergens: ['Gluten', 'Nuts', 'Dairy'],
      dietaryTags: ['Halal'],      seasonal: {
        available: ['autumn', 'winter'],
        note: 'Perfect for special occasions and celebrations'
      },
      image: '/pbiryani.png',
      available: true 
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
        fr: 'Quzi'
      }, 
      description: { 
        en: 'A traditional Middle Eastern dish made with saffron rice and lamb, garnished with toasted almonds and fresh parsley.',
        ar: 'طبق شرق أوسطي تقليدي مصنوع من أرز الزعفران والخروف، مزين باللوز المحمص والبقدونس الطازج.',
        fa: 'غذای سنتی خاورمیانه‌ای از برنج زعفرانی و گوشت بره، با بادام برشته و جعفری تازه تزیین شده.',
        ku: 'خۆراکێکی نەریتی ڕۆژهەڵاتی ناوەڕاست لە برنجی زەعفەران و گۆشتی بەرخ، بە بادەمی برژاو و جەعدەی تازە ڕازاوەتەوە.',
        tr: 'Safran pirinci ve kuzu eti ile yapılan geleneksel Orta Doğu yemeği, kavrulmuş badem ve taze maydanoz ile süslenmiştir.',
        ur: 'زعفرانی چاول اور بھیڑ کے گوشت سے بنا روایتی مشرق وسطیٰ کا کھانا، بھنے ہوئے بادام اور تازہ دھنیے سے سجایا گیا۔',
        kmr: 'Xwarineke kevneşopî ya Rojhilatê Navîn ku ji brincê zefranî û goştê berxî hatiye çêkirin, bi behîvên şewitî û şînîyê taze hatiye xemilandin.',
        es: 'Un plato tradicional del Medio Oriente hecho con arroz de azafrán y cordero, adornado con almendras tostadas y perejil fresco.',
        ru: 'Традиционное ближневосточное блюдо из шафранового риса с бараниной, украшенное жареным миндалём и свежей петрушкой.',
        hi: 'केसर चावल और भेड़ के बच्चे के साथ बनाया गया पारंपरिक मध्य पूर्वी व्यंजन, भुने हुए बादाम और ताज़े अजमोद से सजाया गया।',
        sq: 'Një pjatë tradicional lindor i mesëm i bërë me oriz me shafran dhe qengj, i zbukuruar me bajame të pjekura dhe majdanoz të freskët.',
        fr: 'Un plat traditionnel du Moyen-Orient préparé avec du riz au safran et de l\'agneau, garni d\'amandes grillées et de persil frais.',
        de: 'Ein traditionelles nahöstliches Gericht aus Safranreis und Lamm, garniert mit gerösteten Mandeln und frischer Petersilie.'
      }, 
      price: '$24.99', 
      category: 'specialty', 
      popular: true, 
      tags: ['lamb', 'saffron-rice', 'traditional', 'middle-eastern', 'celebration'],
      nutritionalInfo: {
        calories: 720,
        protein: '38g',
        carbs: '65g',
        fat: '28g',
        fiber: '4g'
      },
      allergens: ['Nuts'],
      dietaryTags: ['Halal'],      image: '/Quzi.jpg',
      available: true 
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
        fr: 'Mandi'
      }, 
      description: { 
        en: 'A traditional Middle Eastern dish made with spiced rice and chicken. The chicken is cooked with the rice and topped with fresh parsley before serving. It is accompanied by special sauces.',
        ar: 'طبق شرق أوسطي تقليدي مصنوع من الأرز المتبل والدجاج. يُطبخ الدجاج مع الأرز ويُزين بالبقدونس الطازج قبل التقديم. يُرافقه صلصات خاصة.',
        fa: 'غذای سنتی خاورمیانه‌ای از برنج طعم‌دار و مرغ. مرغ با برنج پخته شده و قبل از سرو با جعفری تازه تزیین می‌شود. با سس‌های مخصوص همراه است.',
        ku: 'خۆراکێکی نەریتی ڕۆژهەڵاتی ناوەڕاست لە برنجی تامدراو و مریشک. مریشکەکە لەگەڵ برنجەکە لێدەنرێت و پێش خستنەسەر بە جەعدەی تازە ڕازاوەتەوە. لەگەڵ سۆسە تایبەتەکانەوە هاتووە.',
        tr: 'Baharatlı pirinç ve tavukla yapılan geleneksel Orta Doğu yemeği. Tavuk pirinçle birlikte pişirilir ve servis etmeden önce taze maydanoz ile süslenir. Özel soslar eşlik eder.',
        ur: 'مصالحہ دار چاول اور چکن سے بنا روایتی مشرق وسطیٰ کا کھانا۔ چکن چاول کے ساتھ پکایا جاتا ہے اور پیش کرنے سے پہلے تازہ دھنیے سے سجایا جاتا ہے۔ خاص ساسز کے ساتھ آتا ہے۔',
        kmr: 'Xwarineke kevneşopî ya Rojhilatê Navîn ku ji brincê bi baharatan û mirîşkê hatiye çêkirin. Mirîşk bi brincê re tê pijandin û berî peşkêşkirinê bi şînîyê taze tê xemilandin. Bi soşên taybet re tê.',
        es: 'Un plato tradicional de Medio Oriente hecho con arroz especiado y pollo. El pollo se cocina con el arroz y se cubre con perejil fresco antes de servir. Se acompaña con salsas especiales.',
        ru: 'Традиционное ближневосточное блюдо из пряного риса с курицей. Курица готовится вместе с рисом и перед подачей украшается свежей петрушкой. Подается со специальными соусами.',
        hi: 'मसालेदार चावल और चिकन के साथ बनाया गया पारंपरिक मध्य पूर्वी व्यंजन। चिकन को चावल के साथ पकाया जाता है और परोसने से पहले ताज़े अजमोद से सजाया जाता है। विशेष सॉस के साथ परोसा जाता है।',
        sq: 'Një pjatë tradicional lindor i mesëm i bërë me oriz të erëzuar dhe pulë. Pulja gatuhet me oriz dhe para se të shërbehet zbukurohet me majdanoz të freskët. Shoqërohet me salca speciale.',
        fr: 'Un plat traditionnel du Moyen-Orient préparé avec du riz épicé et du poulet. Le poulet est cuit avec le riz et garni de persil frais avant le service. Il est accompagné de sauces spéciales.',
        de: 'Ein traditionelles nahöstliches Gericht aus gewürztem Reis und Hähnchen. Das Hähnchen wird mit dem Reis gekocht und vor dem Servieren mit frischer Petersilie garniert. Wird mit speziellen Saucen begleitet.'
      }, 
      price: '$21.99', 
      category: 'specialty', 
      popular: true, 
      tags: ['spicy', 'aromatic', 'traditional', 'one-pot'],
      nutritionalInfo: {
        calories: 650,
        protein: '35g',
        carbs: '68g',
        fat: '18g',
        fiber: '3g'
      },
      allergens: [],
      dietaryTags: ['Halal'],      image: '/Mandi.jpg',
      available: true 
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
        kmr: 'Kebaba Xwezayê',
        es: 'Kebab Natural',
        ru: 'Натуральный кебаб',
        hi: 'प्रकृति कबाब',
        sq: 'Kabab Natyror',
        fr: 'Kebab Naturel'
      }, 
      description: { 
        en: 'Roasted eggplant, cheddar cheese and garlic. Served with grilled kabab and fresh spices.',
        ar: 'باذنجان محمص وجبن الشيدر والثوم. يُقدم مع الكباب المشوي والتوابل الطازجة.',
        fa: 'بادمجان کبابی، پنیر چدار و سیر. با کباب گریل شده و ادویه‌های تازه سرو می‌شود.',
        ku: 'بادەمجانی برژاو، پەنیری چیدار و سیر. لەگەڵ کەبابی گرێلکراو و بەهاراتی تازە خراوەتە سەر.',
        tr: 'Közlenmiş patlıcan, çedar peyniri ve sarımsak. Izgara kebap ve taze baharatlarla servis edilir.',
        ur: 'بھنا ہوا بینگن، چیڈر چیز اور لہسن۔ گرل شدہ کباب اور تازہ مصالحوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Bacanê şewitî, penîrê çedar û sîr. Bi kebaba grîlkirî û baharatên taze tê peşkêşkirin.',
        es: 'Berenjena asada, queso cheddar y ajo. Servido con kebab a la parrilla y especias frescas.',
        ru: 'Жареный баклажан, сыр чеддер и чеснок. Подаётся с грильованным кебабом и свежими специями.',
        hi: 'भुना हुआ बैंगन, चेडर चीज़ और लहसुन। ग्रिल्ड कबाब और ताजे मसालों के साथ परोसा जाता है।',
        sq: 'Patëllxhan i pjekur, djathë çedar dhe hudhra. Shërbehet me kabab në skarë dhe erëza të freskëta.',
        fr: 'Aubergine grillée, fromage cheddar et ail. Servi avec kebab grillé et épices fraîches.',
        de: 'Geröstete Aubergine, Cheddar-Käse und Knoblauch. Serviert mit gegrilltem Kebab und frischen Gewürzen.'
      }, 
      price: '$25.99', 
      category: 'specialty', 
      tags: ['roasted-eggplant', 'cheddar', 'garlic', 'grilled-kabab', 'unique'],
      nutritionalInfo: {
        calories: 580,
        protein: '34g',
        carbs: '12g',
        fat: '42g',
        fiber: '8g'
      },
      allergens: ['Dairy'],
      dietaryTags: ['Halal'],      image: '/mkabab.jpg',
      available: true 
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
        kmr: 'Qaliye',
        es: 'Qaliya',
        fr: 'Qaliya',
        ru: 'Калия',
        hi: 'क़लिया',
        sq: 'Qaliya'
      }, 
      description: { 
        en: 'A traditional stew made with beef and onions, simmered with rich spices and a savory sauce. The dish features a deep flavor resulting from the blend of beef and aromatic onions.',
        ar: 'طبق يخنة تقليدي مصنوع من لحم البقر والبصل، مطبوخ على نار هادئة مع توابل غنية وصلصة مالحة. يتميز الطبق بنكهة عميقة ناتجة عن مزيج لحم البقر والبصل العطري.',
        fa: 'خورشت سنتی از گوشت گاو و پیاز، با ادویه‌جات غنی و سس خوشمزه آرام پخت. این غذا طعم عمیقی از ترکیب گوشت گاو و پیاز معطر دارد.',
        ku: 'خۆراکێکی نەریتی لە گۆشتی گا و پیاز، لەگەڵ بەهاراتی دەوڵەمەند و سۆسێکی خۆش بە هێواشی کوڵاوە. خۆراکەکە تامێکی قووڵی هەیە کە لە تێکەڵی گۆشتی گا و پیازی بۆنخۆشەوە دێت.',
        tr: 'Dana eti ve soğanla yapılan geleneksel güveç, zengin baharatlar ve lezzetli sosla pişirilmiştir. Yemek, dana eti ve aromatik soğan karışımından kaynaklanan derin bir lezzete sahiptir.',
        ur: 'گائے کا گوشت اور پیاز سے بنا روایتی سٹو، بھرپور مصالحوں اور لذیذ ساس کے ساتھ آہستہ پکایا گیا۔ یہ ڈش گائے کے گوشت اور خوشبودار پیاز کے امتزاج سے گہرا ذائقہ رکھتا ہے۔',
        kmr: 'Xwarineke kevneşopî ku ji goştê ga û pîvazan hatiye çêkirin, bi baharatên dewlemend û soşeke bi tam hêdî hatiye pijandin. Xwarin ji tevahiya goştê ga û pîvazên bêhnxweş tameke kûr heye.',
        es: 'Un guisado tradicional hecho con carne de res y cebollas, cocido a fuego lento con especias ricas y salsa sabrosa. El plato presenta un sabor profundo resultante de la mezcla de carne de res y cebollas aromáticas.',
        fr: 'Un ragoût traditionnel fait avec du bœuf et des oignons, mijoté avec des épices riches et une sauce savoureuse. Le plat offre une saveur profonde résultant du mélange de bœuf et d\'oignons aromatiques.',
        ru: 'Традиционное рагу из говядины и лука, тушёное с богатыми специями и пикантным соусом. Блюдо имеет глубокий вкус от сочетания говядины и ароматного лука.',
        hi: 'गाय के मांस और प्याज से बना पारंपरिक स्ट्यू, समृद्ध मसालों और स्वादिष्ट सॉस के साथ धीमी आंच पर पकाया गया। यह व्यंजन गाय के मांस और सुगंधित प्याज के मिश्रण से गहरा स्वाद प्रदान करता है।',
        sq: 'Një tavë tradicionale e bërë me viç dhe qepë, e zier me erëza të pasura dhe salcë të shijshme. Pjati ka një shije të thellë që vjen nga përzierja e viçit dhe qepës aromatike.',
        de: 'Ein traditioneller Eintopf aus Rindfleisch und Zwiebeln, langsam gegart mit reichhaltigen Gewürzen und einer würzigen Sauce. Das Gericht zeichnet sich durch einen tiefen Geschmack aus der Mischung von Rindfleisch und aromatischen Zwiebeln aus.'
      }, 
      price: '$22.99', 
      category: 'specialty', 
      tags: ['traditional-stew', 'beef', 'onions', 'rich-flavors', 'comfort-food'],
      nutritionalInfo: {
        calories: 580,
        protein: '42g',
        carbs: '18g', 
        fat: '36g',
        fiber: '3g'
      },
      allergens: [],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Village Qaliya.jpg',
      available: true
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
        fr: 'Crevettes au Beurre'
      }, 
      description: { 
        en: 'Shrimp sautéed with butter, mushrooms and garlic. Served with special spicy seasoning.',
        ar: 'جمبري مقلي مع الزبدة والفطر والثوم. يُقدم مع تتبيلة حارة خاصة.',
        fa: 'میگو با کره، قارچ و سیر تفت داده شده. با چاشنی تند مخصوص سرو می‌شود.',
        ku: 'میگۆ لەگەڵ کەرە، قارچ و سیر ساتێ کراوە. لەگەڵ چێشتکردنی تەند و تایبەت خراوەتە سەر.',
        tr: 'Tereyağı, mantar ve sarımsakla sote edilmiş karides. Özel baharatlı lezzet verici ile servis edilir.',
        ur: 'مکھن، مشروم اور لہسن کے ساتھ بھنا ہوا جھینگا۔ خاص مسالہ دار ذائقہ کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mîgo bi tereya, karkûşk û sîr hatiye sotekirî. Bi baharateke taybet a tûj tê peşkêşkirin.',
        es: 'Camarones salteados con mantequilla, champiñones y ajo. Servidos con sazón picante especial.',
        ru: 'Креветки, обжаренные с маслом, грибами и чесноком. Подаются со специальной острой приправой.',
        hi: 'मक्खन, मशरूम और लहसुन के साथ भुने हुए झींगे। विशेष मसालेदार सीज़निंग के साथ परोसा जाता है।',
        sq: 'Karkaleca të skuqura me gjalpë, kërpudha dhe hudhra. Shërbehet me erëzim të veçantë pikant.',
        de: 'Garnelen sautiert mit Butter, Champignons und Knoblauch. Serviert mit spezieller würziger Gewürzmischung.'
      }, 
      price: '$22.99', 
      category: 'specialty', 
      tags: ['seafood', 'butter-garlic', 'mushrooms', 'sauteed', 'spicy'],
      nutritionalInfo: {
        calories: 340,
        protein: '28g',
        carbs: '8g', 
        fat: '22g',
        fiber: '1g'
      },
      allergens: ['Shellfish', 'Dairy'],
      dietaryTags: ['Gluten-Free'],      image: '/Butter Shrimp.jpg',
      available: true
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
        kmr: 'Karnavala Gund',
        es: 'Carnaval del Pueblo',
        ru: 'Деревенский карнавал',
        hi: 'गांव कार्निवल',
        sq: 'Karnaval Fshati',
        fr: 'Carnaval du Village'
      }, 
      description: { 
        en: 'This best stew is a dish made with carefully selected fresh vegetables and tender pieces of meat. Slowly cooked to perfection. Served with aromatic saffron rice. It creates a memorable and satisfying dining experience.',
        ar: 'هذا الطبق الأفضل هو طبق مصنوع من خضروات طازجة مختارة بعناية وقطع لحم طرية. مطبوخ ببطء إلى الكمال. يُقدم مع أرز الزعفران العطري. يخلق تجربة طعام لا تُنسى ومُرضية.',
        fa: 'این بهترین خورشت غذایی است که با سبزیجات تازه به دقت انتخاب شده و تکه‌های نرم گوشت درست شده. آهسته تا کمال پخته شده. با برنج زعفرانی معطر سرو می‌شود. تجربه غذایی فراموش‌نشدنی و رضایت‌بخش ایجاد می‌کند.',
        ku: 'ئەم باشترین خۆراکە خۆراکێکە کە بە سەوزەی تازەی بە وردی هەڵبژێردراو و پارچە نەرمەکانی گۆشت دروستکراوە. بە هێواشی بە تەواوی لێنراوە. لەگەڵ برنجی زەعفەرانی بۆنخۆش خراوەتە سەر. ئەزموونێکی خواردنی لەبیرنەکراو و دڵخۆشکەر دروست دەکات.',
        tr: 'Bu en iyi güveç, özenle seçilmiş taze sebzeler ve yumuşak et parçalarıyla yapılan bir yemektir. Mükemmelliğe kadar yavaş pişirilmiştir. Aromatik safran pirinci ile servis edilir. Unutulmaz ve tatmin edici bir yemek deneyimi yaratır.',
        ur: 'یہ بہترین سٹو ایک ڈش ہے جو احتیاط سے منتخب کردہ تازہ سبزیوں اور گوشت کے نرم ٹکڑوں سے بنائی گئی ہے۔ آہستہ آہستہ کمال تک پکائی گئی۔ خوشبودار زعفرانی چاول کے ساتھ پیش کی جاتی ہے۔ یہ ایک یادگار اور اطمینان بخش کھانے کا تجربہ بناتا ہے۔',
        kmr: 'Ev xwaştrîn xwarin xwarineke ku bi sebzeyên taze yên bi baldarî hatine hilbijartin û perçeyên nerm ên goştî hatiye çêkirin. Hêdî hêdî heta bi temamî hatiye pijandin. Bi brincê zefranî yê bêhnxweş tê peşkêşkirin. Ezmûnek xwarinê ya jibîrnekirin û şaykirin çêdike.',
        es: 'Este mejor guisado es un plato hecho con verduras frescas cuidadosamente seleccionadas y trozos tiernos de carne. Cocinado lentamente a la perfección. Servido con arroz aromático de azafrán. Crea una experiencia gastronómica memorable y satisfactoria.',
        ru: 'Это лучшее рагу - блюдо, приготовленное из тщательно отобранных свежих овощей и нежных кусочков мяса. Медленно приготовленное до совершенства. Подаётся с ароматным шафрановым рисом. Создаёт незабываемый и удовлетворительный кулинарный опыт.',
        hi: 'यह सबसे बेहतरीन स्ट्यू एक व्यंजन है जो सावधानी से चुनी गई ताजी सब्जियों और मांस के कोमल टुकड़ों से बनाया गया है। धीरे-धीरे परफेक्शन तक पकाया गया। सुगंधित केसर चावल के साथ परोसा जाता है। यह एक अविस्मरणीय और संतुष्टजनक भोजन अनुभव बनाता है।',
        sq: 'Kjo tavë më e mira është një pjatë i bërë me perime të freskëta të zgjedhura me kujdes dhe copa të buta mishi. E gatuar ngadalë deri në përsosmëri. Shërbehet me oriz aromatik me shafran. Krijon një përvojë kulinare të paharrueshme dhe kënaqëse.',
        de: 'Dieser beste Eintopf ist ein Gericht aus sorgfältig ausgewähltem frischen Gemüse und zarten Fleischstücken. Langsam zu Perfektion gegart. Serviert mit aromatischem Safranreis. Schafft ein unvergessliches und zufriedenstellendes Speiseerlebnis.'
      }, 
      price: '$23.99', 
      category: 'specialty', 
      popular: true, 
      tags: ['signature-stew', 'fresh-vegetables', 'tender-meat', 'saffron-rice', 'memorable'],
      nutritionalInfo: {
        calories: 620,
        protein: '35g',
        carbs: '48g',
        fat: '28g',
        fiber: '7g'
      },
      allergens: [],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/carnival.jpg',
      available: true 
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
        sq: 'Shish Kabab Erbil'
      }, 
      description: { 
        en: 'A kabab made with a mix of lamb and beef, grilled to perfection. It is served with saffron rice, seasonal salad, sumac onions, and grilled vegetables.',
        ar: 'كباب مصنوع من خليط من لحم الخروف ولحم البقر، مشوي إلى الكمال. يُقدم مع أرز الزعفران وسلطة موسمية وبصل السماق والخضروات المشوية.',
        fa: 'کبابی از ترکیب گوشت بره و گاو، تا کمال کباب شده. با برنج زعفرانی، سالاد فصلی، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'کەبابێک لە تێکەڵی گۆشتی بەرخ و گا، بە تەواوی گرێلکراوە. لەگەڵ برنجی زەعفەران، سالادی وەرزی، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Kuzu ve dana eti karışımından yapılan, mükemmelliğe kadar ızgara edilmiş kebap. Safran pirinci, mevsim salatası, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'بھیڑ اور گائے کے گوشت کے مکسچر سے بنا کباب، کمال تک گرل کیا گیا۔ زعفرانی چاول، موسمی سلاد، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji tevahiya goştê berx û ga hatiye çêkirin, heta bi temamî hatiye grîlkirin. Bi brincê zefranî, salata werzeya, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.',
        es: 'Un kebab hecho con una mezcla de cordero y carne de res, asado a la perfección. Se sirve con arroz de azafrán, ensalada de temporada, cebollas de sumac y verduras a la parrilla.',
        fr: 'Un kebab fait avec un mélange d\'agneau et de bœuf, grillé à la perfection. Il est servi avec du riz au safran, salade de saison, oignons au sumac et légumes grillés.',
        ru: 'Кебаб из смеси баранины и говядины, приготовленный на гриле до совершенства. Подается с шафрановым рисом, сезонным салатом, луком с сумаком и овощами на гриле.',
        hi: 'भेड़ के बच्चे और गाय के मांस के मिश्रण से बना कबाब, पूर्णता तक ग्रिल किया गया। केसर चावल, मौसमी सलाद, सुमाक प्याज और ग्रिल्ड सब्जियों के साथ परोसा जाता है।',
        sq: 'Një kabab i bërë me një përzierje mishi qengjishi dhe viçi, i pjekur në skarë deri në përsosmëri. Shërbehet me oriz me shafran, sallatë sezoni, qepë sumak dhe perime në skarë.',
        de: 'Ein Kebab aus einer Mischung von Lamm- und Rindfleisch, perfekt gegrillt. Serviert mit Safranreis, saisonalem Salat, Sumak-Zwiebeln und gegrilltem Gemüse.'
      }, 
      price: '$21.99', 
      category: 'grill', 
      popular: true, 
      tags: ['mixed-meat', 'lamb-beef', 'saffron-rice', 'grilled-perfection', 'traditional'],
      nutritionalInfo: {
        calories: 620,
        protein: '48g',
        carbs: '35g', 
        fat: '32g',
        fiber: '4g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Erbil Shish Kabab.jpg',
      available: true
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
        fr: 'Kebab Mahshi'
      }, 
      description: { 
        en: 'A kabab made with beef and lamb, flavored with garlic, spicy peppers, and parsley. It is served with a seasonal salad, saffron rice, sumac onions, and grilled vegetables.',
        ar: 'كباب مصنوع من لحم البقر والخروف، منكه بالثوم والفلفل الحار والبقدونس. يُقدم مع سلطة موسمية وأرز الزعفران وبصل السماق والخضروات المشوية.',
        fa: 'کبابی از گوشت گاو و بره، با سیر، فلفل تند و جعفری طعم‌دار شده. با سالاد فصلی، برنج زعفرانی، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'کەبابێک لە گۆشتی گا و بەرخ، بە سیر، بیبەری تەند و جەعدە تامدراوە. لەگەڵ سالادی وەرزی، برنجی زەعفەران، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Dana ve kuzu etinden yapılan, sarımsak, acı biber ve maydanozla tatlandırılmış kebap. Mevsim salatası, safran pirinci, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'گائے اور بھیڑ کے گوشت سے بنا کباب، لہسن، تیز مرچ اور دھنیے سے ذائقہ دار۔ موسمی سلاد، زعفرانی چاول، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji goştê ga û berxî hatiye çêkirin, bi sîr, biberên tûj û şînî hatiye tamdar kirin. Bi salata werzeya, brincê zefranî, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.',
        es: 'Un kebab hecho con carne de res y cordero, sazonado con ajo, pimientos picantes y perejil. Se sirve con ensalada de temporada, arroz de azafrán, cebollas de sumac y verduras a la parrilla.',
        ru: 'Кебаб из говядины и баранины, приправленный чесноком, острым перцем и петрушкой. Подается с сезонным салатом, шафрановым рисом, луком с сумахом и овощами на гриле.',
        hi: 'गाय और भेड़ के बच्चे के मांस से बना कबाब, लहसुन, तेज़ मिर्च और अजमोद के साथ स्वादिष्ट। मौसमी सलाद, केसर चावल, सुमाक प्याज और ग्रिल्ड सब्जियों के साथ परोसा जाता है।',
        sq: 'Një kabab i bërë me viç dhe qengj, i shijësuar me hudhra, spec të rrëmbyeshëm dhe majdanoz. Shërbehet me sallatë sezoni, oriz me shafran, qepë sumak dhe perime në skarë.',
        fr: 'Un kebab fait avec du bœuf et de l\'agneau, assaisonné à l\'ail, aux piments forts et au persil. Servi avec une salade de saison, du riz au safran, des oignons au sumac et des légumes grillés.',
        de: 'Ein Kebab aus Rind- und Lammfleisch, gewürzt mit Knoblauch, scharfen Paprika und Petersilie. Serviert mit saisonalem Salat, Safranreis, Sumak-Zwiebeln und gegrilltem Gemüse.'
      }, 
      price: '$21.99', 
      category: 'grill', 
      popular: true, 
      tags: ['stuffed-kabab', 'mixed-meat', 'spicy', 'garlic', 'herb-seasoned'],
      nutritionalInfo: {
        calories: 650,
        protein: '45g',
        carbs: '38g', 
        fat: '35g',
        fiber: '4g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal'],      image: '/Mahshi Kabab.jpg',
      available: true
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
        fr: 'Kebab de Poulet'
      }, 
      description: { 
        en: 'Marinated chicken with spices, dried tomatoes, parsley, and fresh onions. Served with saffron rice, a mixed greens salad, sumac onions, and grilled vegetables.',
        ar: 'دجاج متبل بالتوابل والطماطم المجففة والبقدونس والبصل الطازج. يُقدم مع أرز الزعفران وسلطة الخضروات المختلطة وبصل السماق والخضروات المشوية.',
        fa: 'مرغ مزه‌دار شده با ادویه‌جات، گوجه خشک، جعفری و پیاز تازه. با برنج زعفرانی، سالاد سبزیجات مخلوط، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'مریشکی تامدراو بە بەهارات، تەماتەی وشک، جەعدە و پیازی تازە. لەگەڵ برنجی زەعفەران، سالادی سەوزەی تێکەڵ، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Baharat, kurutulmuş domates, maydanoz ve taze soğanla marine edilmiş tavuk. Safran pirinci, karışık yeşil salata, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'مصالحوں، خشک ٹماٹر، دھنیا اور تازہ پیاز کے ساتھ میرینیٹ چکن۔ زعفرانی چاول، ملے جلے سبزیوں کے سلاد، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Mirîşkê bi baharatan, firangoşên ziwa, şînî û pîvazên taze hatiye marînekirin. Bi brincê zefranî, salata sebzeyên tevlihev, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.',
        es: 'Pollo marinado con especias, tomates secos, perejil y cebollas frescas. Servido con arroz de azafrán, ensalada de verduras mixtas, cebollas de sumac y verduras a la parrilla.',
        ru: 'Маринованная курица со специями, вялеными томатами, петрушкой и свежим луком. Подается с шафрановым рисом, салатом из смешанной зелени, луком с сумахом и овощами на гриле.',
        hi: 'मसालों, सूखे टमाटर, अजमोद और ताजे प्याज के साथ मैरिनेट चिकन। केसर चावल, मिक्स्ड ग्रीन्स सलाद, सुमाक प्याज और ग्रिल्ड सब्जियों के साथ परोसा जाता है।',
        sq: 'Pulë e marinuar me erëza, domate të thata, majdanoz dhe qepë të freskëta. Shërbehet me oriz me shafran, sallatë me gjelbërimore të përziera, qepë sumak dhe perime të pjekura në skarë.',
        fr: 'Poulet mariné aux épices, tomates séchées, persil et oignons frais. Servi avec riz au safran, salade de verdures mélangées, oignons au sumac et légumes grillés.',
        de: 'Mariniertes Hähnchen mit Gewürzen, getrockneten Tomaten, Petersilie und frischen Zwiebeln. Serviert mit Safranreis, gemischtem Blattsalat, Sumak-Zwiebeln und gegrilltem Gemüse.'
      }, 
      price: '$20.99', 
      category: 'grill', 
      popular: true, 
      tags: ['marinated-chicken', 'herbs', 'dried-tomatoes', 'grilled', 'healthy'],
      nutritionalInfo: {
        calories: 580,
        protein: '42g',
        carbs: '35g', 
        fat: '28g',
        fiber: '3g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Chicken Kabab.jpg',
      available: true
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
        ru: 'Чокертме кебаб',
        hi: 'चोकर्तमे कबाब',
        sq: 'Kabab Cökertme',
        fr: 'Kebab Cökertme'
      }, 
      description: { 
        en: 'Eggplant with yogurt topped with carefully prepared pita bread, thinly sliced rib eye pieces. Served with shoestring potatoes and special sauce.',
        ar: 'باذنجان مع اللبن مغطى بخبز البيتا المحضر بعناية، قطع الضلع الرقيقة. يُقدم مع البطاطس الشعرية وصلصة خاصة.',
        fa: 'بادمجان با ماست روکش شده با نان پیتای به دقت آماده شده، تکه‌های نازک ریب آی. با سیب‌زمینی نخی و سس مخصوص سرو می‌شود.',
        ku: 'بادەمجان لەگەڵ مۆست بە نانی پیتای بە وردی ئامادەکراو داپۆشراوە، پارچە باریکەکانی چاو ڕەشەوە. لەگەڵ پەتاتەی تەلی و سۆسی تایبەت خراوەتە سەر.',
        tr: 'Özenle hazırlanmış pita ekmeği ile kaplı yoğurtlu patlıcan, ince dilimlenmiş kaburga eti parçaları. Kıymalı patates ve özel sosla servis edilir.',
        ur: 'دہی کے ساتھ بینگن جس پر احتیاط سے تیار کیا گیا پیٹا بریڈ، باریک کٹے ہوئے ریب آئی کے ٹکڑے۔ شو سٹرنگ آلو اور خاص ساس کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Bacanê bi mastê ku bi nanê pita yê bi baldarî hatiye amade kirin hatiye daxuyandin, perçeyên zok ên çavreşê. Bi kartolên tel û soşa taybet tê peşkêşkirin.',
        es: 'Berenjena con yogur cubierta con pan pita cuidadosamente preparado, trozos de costilla finamente rebanados. Servido con papas en hilos y salsa especial.',
        ru: 'Баклажан с йогуртом, покрытый тщательно приготовленным лавашом, тонко нарезанными кусочками рибай. Подается с картофелем фри и специальным соусом.',
        hi: 'सावधानीपूर्वक तैयार पीटा ब्रेड के साथ दही के साथ बैंगन, बारीक कटे हुए रिब आई के टुकड़े। शूस्ट्रिंग आलू और विशेष सॉस के साथ परोसा जाता है।',
        sq: 'Patëllxhan me kos i mbuluar me bukë pita të përgatitur me kujdes, copa të holla mishi riba. Shërbehet me patate në fije dhe salcë të veçantë.',
        fr: 'Aubergine au yaourt recouverte de pain pita soigneusement préparé, avec de fines tranches de côte de bœuf. Servie avec des pommes de terre allumettes et une sauce spéciale.',
        de: 'Aubergine mit Joghurt, überzogen mit sorgfältig zubereitetem Pita-Brot und dünn geschnittenen Rib-Eye-Stücken. Serviert mit Schusterkartoffeln und spezieller Sauce.'
      }, 
      price: '$24.99', 
      category: 'grill', 
      tags: ['eggplant-yogurt', 'pita-topped', 'ribeye', 'unique-combination', 'special-sauce'],
      nutritionalInfo: {
        calories: 720,
        protein: '38g',
        carbs: '45g', 
        fat: '42g',
        fiber: '6g'
      },
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Halal'],      image: '/Cokertme Kabab.jpg',
      available: true
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
        fr: 'Ailes'
      }, 
      description: { 
        en: 'Grilled Wings a flavor sensation that will delight your taste buds! Served with aromatic saffron rice, fresh green salad, sumac-seasoned onions, and a medley of grilled vegetables. Don\'t miss out on this delectable combination!',
        ar: 'أجنحة مشوية إحساس بالنكهة سيسعد براعم التذوق لديك! تُقدم مع أرز الزعفران العطري وسلطة خضراء طازجة وبصل متبل بالسماق ومزيج من الخضروات المشوية. لا تفوت هذا المزيج اللذيذ!',
        fa: 'بال‌های کبابی احساس طعمی که ذائقه شما را خوشحال می‌کند! با برنج زعفرانی معطر، سالاد سبز تازه، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی سرو می‌شود. این ترکیب لذیذ را از دست ندهید!',
        ku: 'باڵە گرێلکراوەکان هەستێکی تامە کە ذائقەکەت خۆش دەکات! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی سەوزی تازە، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو خراوەتە سەر. ئەم تێکەڵە خۆشە لەدەست مەدە!',
        tr: 'Izgara Kanatlar damak zevkinizi memnun edecek bir lezzet hissi! Aromatik safran pirinci, taze yeşil salata, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile servis edilir. Bu lezzetli kombinasyonu kaçırmayın!',
        ur: 'گرل شدہ ونگز ایک ذائقہ کا احساس جو آپ کے ذائقہ کو خوش کرے گا! خوشبودار زعفرانی چاول، تازہ سبز سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ پیش کیا جاتا ہے۔ اس لذیذ امتزاج کو مت چھوڑیں!',
        kmr: 'Balên Grîlkirî hesteke tamê ku dê dilê we şad bike! Bi brincê zefranî yê bêhnxweş, salata kesk a taze, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî tê peşkêşkirin. Vê tevahiya xweş ji dest nedin!',
        es: '¡Alitas a la parrilla, una sensación de sabor que deleitará tu paladar! Servidas con arroz aromático de azafrán, ensalada verde fresca, cebollas sazonadas con sumac y una mezcla de verduras a la parrilla. ¡No te pierdas esta deliciosa combinación!',
        ru: 'Крылышки на гриле - это вкусовое ощущение, которое порадует ваши вкусовые рецепторы! Подаются с ароматным шафрановым рисом, свежим зеленым салатом, луком, приправленным сумахом, и смесью овощей на гриле. Не упустите эту восхитительную комбинацию!',
        hi: 'ग्रिल्ड विंग्स एक स्वाद की संवेदना जो आपकी स्वाद कलियों को प्रसन्न करेगी! सुगंधित केसर चावल, ताजे हरे सलाद, सुमाक-मसालेदार प्याज और ग्रिल्ड सब्जियों के मेडली के साथ परोसा जाता है। इस स्वादिष्ट संयोजन को न चूकें!',
        sq: 'Krahët në skarë janë një përvojë shije që do të kënaqë shijet tuaja! Shërbehet me oriz aromatik me shafran, sallatë të gjelbër të freskët, qepë të erëzuara me sumak dhe një përzierje perimesh në skarë. Mos e humbni këtë kombinim të shijshëm!',
        de: 'Gegrillte Flügel sind ein Geschmackserlebnis, das Ihre Geschmacksnerven erfreuen wird! Serviert mit aromatischem Safranreis, frischem grünem Salat, mit Sumak gewürzten Zwiebeln und einer Mischung aus gegrilltem Gemüse. Lassen Sie sich diese köstliche Kombination nicht entgehen!'
      }, 
      price: '$16.99', 
      category: 'grill', 
      popular: true, 
      tags: ['grilled-wings', 'finger-food', 'savory', 'crispy', 'crowd-pleaser'],
      nutritionalInfo: {
        calories: 520,
        protein: '38g',
        carbs: '32g',
        fat: '26g',
        fiber: '3g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Grilled Wings Platter.jpg',
      available: true 
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
        kmr: 'Tîkka Rîb Ayê Goştê Ga',
        es: 'Tikka de Ribeye de Res',
        ru: 'Тикка из говяжьей рибай',
        hi: 'बीफ रिबाई टिक्का',
        sq: 'Tikka Ribeye Viçi',
        fr: 'Tikka de Côte de Bœuf'
      }, 
      description: { 
        en: 'Beef Ribeye Tikka is the perfect choice for meat lovers! Paired with aromatic saffron rice, seasonal salad, sumac-seasoned onions, and a medley of grilled vegetables, it creates an unforgettable taste experience. Don\'t miss out on this unique flavor!',
        ar: 'تيكا ريب آي لحم البقر هو الخيار المثالي لمحبي اللحوم! مقترن مع أرز الزعفران العطري وسلطة موسمية وبصل متبل بالسماق ومزيج من الخضروات المشوية، يخلق تجربة طعم لا تُنسى. لا تفوت هذه النكهة الفريدة!',
        fa: 'تیکه ریب آی گوشت گاو انتخاب کاملی برای عاشقان گوشت! همراه با برنج زعفرانی معطر، سالاد فصلی، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی، تجربه طعم فراموش‌نشدنی ایجاد می‌کند. این طعم منحصر به فرد را از دست ندهید!',
        ku: 'تیکای ڕیب ئایی گۆشتی گا هەڵبژاردەیەکی تەواوە بۆ خۆشەویستانی گۆشت! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی وەرزی، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو، ئەزموونێکی تامی لەبیرنەکراو دروست دەکات. ئەم تامە ناوازەیە لەدەست مەدە!',
        tr: 'Dana Ribeye Tikka et severler için mükemmel seçim! Aromatik safran pirinci, mevsim salatası, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile eşleştirilmiş, unutulmaz bir tat deneyimi yaratır. Bu eşsiz lezzeti kaçırmayın!',
        ur: 'بیف ریب آئی ٹکہ گوشت کے شائقین کے لیے بہترین انتخاب! خوشبودار زعفرانی چاول، موسمی سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ، یہ ناقابل فراموش ذائقہ کا تجربہ بناتا ہے۔ اس منفرد ذائقے کو مت چھوڑیں!',
        kmr: 'Tîkka Rîb Ayê Goştê Ga hilbijartinek temam e ji bo hezkiranê goştê! Bi brincê zefranî yê bêhnxweş, salata werzeya, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî, ezmûnek tamê jibîrnekirin çêdike. Vê tamê bêhempa ji dest nedin!',
        es: '¡El Tikka de Ribeye de Res es la elección perfecta para los amantes de la carne! Combinado con arroz aromático de azafrán, ensalada de temporada, cebollas sazonadas con sumac y una mezcla de verduras a la parrilla, crea una experiencia de sabor inolvidable. ¡No te pierdas este sabor único!',
        ru: 'Тикка из говяжьей рибай - идеальный выбор для любителей мяса! В сочетании с ароматным шафрановым рисом, сезонным салатом, луком с сумахом и ассорти из овощей гриль создаёт незабываемый вкусовой опыт. Не упустите этот уникальный вкус!',
        hi: 'बीफ रिबाई टिक्का मांस प्रेमियों के लिए बेहतरीन विकल्प है! सुगंधित केसर चावल, सीज़नल सलाद, सुमाक मसालेदार प्याज और ग्रिल्ड सब्जियों के साथ मिलकर यह अविस्मरणीय स्वाद अनुभव बनाता है। इस अनूठे स्वाद को मत छोड़ें!',
        sq: 'Tikka Ribeye Viçi është zgjidhja perfekte për dashamirët e mishit! E shoqëruar me oriz aromatik me shafran, sallatë sezoni, qepë të përshkruara me sumak dhe një përzierje perimesh në skarë, krijon një përvojë shije të paharrushme. Mos e humbni këtë shije unike!',
        fr: 'Le Tikka de Côte de Bœuf est le choix parfait pour les amateurs de viande ! Accompagné de riz au safran aromatique, salade de saison, oignons assaisonnés au sumac et un mélange de légumes grillés, il crée une expérience gustative inoubliable. Ne manquez pas cette saveur unique !',
        de: 'Das Rind-Ribeye-Tikka ist die perfekte Wahl für Fleischliebhaber! Kombiniert mit aromatischem Safranreis, saisonalem Salat, mit Sumak gewürzten Zwiebeln und einer Mischung aus gegrilltem Gemüse schafft es ein unvergessliches Geschmackserlebnis. Lassen Sie sich diesen einzigartigen Geschmack nicht entgehen!'
      }, 
      price: '$22.99', 
      category: 'grill', 
      popular: true, 
      tags: ['ribeye-beef', 'premium-cut', 'meat-lovers', 'tender', 'juicy'],
      nutritionalInfo: {
        calories: 750,
        protein: '52g',
        carbs: '28g',
        fat: '45g',
        fiber: '3g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Beef Tikka.jpg',
      available: true 
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
        fr: 'Tikka de Poulet'
      }, 
      description: { 
        en: 'This dish offers a flavorful experience! Served with aromatic saffron rice, seasonal salad, sumac-seasoned onions, and a medley of grilled vegetables, it creates an unforgettable taste.',
        ar: 'يقدم هذا الطبق تجربة نكهة! يُقدم مع أرز الزعفران العطري وسلطة موسمية وبصل متبل بالسماق ومزيج من الخضروات المشوية، يخلق طعماً لا يُنسى.',
        fa: 'این غذا تجربه طعم‌داری ارائه می‌دهد! با برنج زعفرانی معطر، سالاد فصلی، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی سرو می‌شود، طعم فراموش‌نشدنی ایجاد می‌کند.',
        ku: 'ئەم خۆراکە ئەزموونێکی تامدار پێشکەش دەکات! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی وەرزی، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو خراوەتە سەر، تامێکی لەبیرنەکراو دروست دەکات.',
        tr: 'Bu yemek lezzetli bir deneyim sunar! Aromatik safran pirinci, mevsim salatası, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile servis edilir, unutulmaz bir tat yaratır.',
        ur: 'یہ ڈش ایک ذائقہ دار تجربہ فراہم کرتا ہے! خوشبودار زعفرانی چاول، موسمی سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ پیش کیا جاتا ہے، یہ ناقابل فراموش ذائقہ بناتا ہے۔',
        kmr: 'Ev xwarin ezmûnek bi tam pêşkêş dike! Bi brincê zefranî yê bêhnxweş, salata werzeya, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî tê peşkêşkirin, tamek jibîrnekirin çêdike.',
        es: '¡Este plato ofrece una experiencia sabrosa! Servido con arroz aromático de azafrán, ensalada de temporada, cebollas sazonadas con sumac y una mezcla de verduras a la parrilla, crea un sabor inolvidable.',
        ru: 'Это блюдо предлагает ароматный опыт! Подаётся с пряным шафрановым рисом, сезонным салатом, луком с сумахом и ассорти овощей гриль, создавая незабываемый вкус.',
        hi: 'यह व्यंजन एक स्वादिष्ट अनुभव प्रदान करता है! सुगंधित केसर चावल, सीज़नल सलाद, सुमाक मसालेदार प्याज और ग्रिल्ड सब्जियों के साथ परोसा जाता है, जो अविस्मरणीय स्वाद बनाता है।',
        sq: 'Ky pjatë ofron një përvojë të shijshme! E shërbyer me oriz aromatik me shafran, sallatë sezoni, qepë të përshkruara me sumak dhe një përzierje perimesh në skarë, krijon shije të paharrushme.',
        fr: 'Marinées avec des épices spéciales et parfaitement cuites ! Servies avec du riz au safran aromatique, salade de saison, oignons assaisonnés au sumac et un mélange de légumes grillés, elles créent un goût inoubliable.',
        de: 'Dieses Gericht bietet ein geschmackvolles Erlebnis! Serviert mit aromatischem Safranreis, saisonalem Salat, mit Sumak gewürzten Zwiebeln und einer Mischung aus gegrilltem Gemüse, schafft es einen unvergesslichen Geschmack.'
      }, 
      price: '$19.99', 
      category: 'grill', 
      tags: ['chicken-tikka', 'tender', 'flavorful', 'spiced', 'aromatic'],
      nutritionalInfo: {
        calories: 540,
        protein: '45g',
        carbs: '32g',
        fat: '24g',
        fiber: '3g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Chicken Tikka.jpg',
      available: true 
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
        kmr: 'Perçeyên Goştê Berx',
        es: 'Chuletas de Cordero',
        ru: 'Бараньи отбивные',
        hi: 'लैम्ब चॉप्स',
        sq: 'Kotoletë Qengjishi',
        fr: 'Côtelettes d\'Agneau'
      }, 
      description: { 
        en: 'Marinated with special spices and perfectly cooked! Served with aromatic saffron rice, seasonal salad, sumac-seasoned onions, and a medley of grilled vegetables, it creates an unforgettable taste.',
        ar: 'متبل بتوابل خاصة ومطبوخ بشكل مثالي! يُقدم مع أرز الزعفران العطري وسلطة موسمية وبصل متبل بالسماق ومزيج من الخضروات المشوية، يخلق طعماً لا يُنسى.',
        fa: 'با ادویه‌جات مخصوص مزه‌دار شده و به کمال پخته شده! با برنج زعفرانی معطر، سالاد فصلی، پیاز طعم‌دار شده با سماق و ترکیبی از سبزیجات کبابی سرو می‌شود، طعم فراموش‌نشدنی ایجاد می‌کند.',
        ku: 'بە بەهاراتی تایبەت تامدراوە و بە تەواوی لێنراوە! لەگەڵ برنجی زەعفەرانی بۆنخۆش، سالادی وەرزی، پیازی بە سوماق تامدراو و تێکەڵەیەک لە سەوزەی گرێلکراو خراوەتە سەر، تامێکی لەبیرنەکراو دروست دەکات.',
        tr: 'Özel baharatlarla marine edilmiş ve mükemmel pişirilmiş! Aromatik safran pirinci, mevsim salatası, sumakla baharatlanmış soğan ve ızgara sebze karışımı ile servis edilir, unutulmaz bir tat yaratır.',
        ur: 'خاص مصالحوں سے میرینیٹ اور بہترین طریقے سے پکایا گیا! خوشبودار زعفرانی چاول، موسمی سلاد، سماق سے ذائقہ دار پیاز اور گرل شدہ سبزیوں کے ملاپ کے ساتھ پیش کیا جاتا ہے، یہ ناقابل فراموش ذائقہ بناتا ہے۔',
        kmr: 'Bi baharatên taybet hatiye marînekirin û bi temamî hatiye pijandin! Bi brincê zefranî yê bêhnxweş, salata werzeya, pîvazên bi sumaq hatine tamdar kirin û tevahiyek sebzeyên grîlkirî tê peşkêşkirin, tamek jibîrnekirin çêdike.',
        es: '¡Marinadas con especias especiales y cocinadas a la perfección! Servidas con arroz de azafrán aromático, ensalada de temporada, cebollas sazonadas con sumac y una mezcla de verduras a la parrilla, crea un sabor inolvidable.',
        ru: 'Маринованы в особых специях и идеально приготовлены! Подаются с ароматным шафрановым рисом, сезонным салатом, луком с сумахом и ассорти овощей гриль, создавая незабываемый вкус.',
        hi: 'विशेष मसालों से मैरिनेट और पूर्णता से पकाया गया! सुगंधित केसर चावल, सीज़नल सलाद, सुमाक मसालेदार प्याज और ग्रिल्ड सब्जियों के साथ परोसा जाता है, जो अविस्मरणीय स्वाद बनाता है।',
        sq: 'Të marinuar me erëza speciale dhe të gatuara në përsosmëri! Të shërbyera me oriz aromatik me shafran, sallatë sezoni, qepë të përshkruara me sumak dhe një përzierje perimesh në skarë, krijon shije të paharrushme.',
        de: 'Mit speziellen Gewürzen mariniert und perfekt gegart! Serviert mit aromatischem Safranreis, saisonalem Salat, mit Sumak gewürzten Zwiebeln und einer Mischung aus gegrilltem Gemüse, schafft es einen unvergesslichen Geschmack.'
      }, 
      price: '$36.99', 
      category: 'grill', 
      popular: true, 
      tags: ['lamb-chops', 'premium', 'marinated', 'grilled-perfection', 'tender'],
      nutritionalInfo: {
        calories: 750,
        protein: '55g',
        carbs: '40g', 
        fat: '42g',
        fiber: '4g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal', 'Gluten-Free'],      image: '/Lamb Chops.jpg',
      available: true
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
        kmr: 'Plata Taybet a Gundê Xwezayê',
        es: 'Platillo Especial de Nature Village',
        ru: 'Особое блюдо деревни природы',
        hi: 'नेचर विलेज स्पेशल प्लैटर',
        sq: 'Pjatë Speciale Nature Village',
        fr: 'Plateau Spécial Nature Village'
      }, 
      description: { 
        en: 'Special Platter Mixed Grill.',
        ar: 'طبق خاص مشويات مختلطة.',
        fa: 'پلاتر مخصوص گریل مخلوط.',
        ku: 'پلێتەری تایبەتی گرێلی تێکەڵ.',
        tr: 'Özel Tabak Karışık Izgara.',
        ur: 'اسپیشل پلیٹر مکسڈ گرل۔',
        kmr: 'Plata Taybet Grîla Tevlihev.',
        es: 'Platillo Especial de Parrilla Mixta.',
        ru: 'Особое блюдо из смешанного гриля.',
        hi: 'स्पेशल प्लेटर मिक्स्ड ग्रिल।',
        sq: 'Pjatë Speciale Skarë të Përzier.',
        fr: 'Plateau Spécial Grillades Mixtes.',
        de: 'Spezialplatte Gemischter Grill.'
      }, 
      price: { serving2: '$69.99', serving4: '$105.99' }, 
      category: 'grill', 
      popular: true, 
      tags: ['special-platter', 'mixed-grill', 'sharing', 'variety', 'feast'], 
      variants: ['serving2', 'serving4'],
      servingFor: { serving2: '2', serving4: '4' },
      nutritionalInfo: {
        calories: 850,
        protein: '65g',
        carbs: '45g', 
        fat: '48g',
        fiber: '5g'
      },
      allergens: ['Sesame', 'Dairy'],
      dietaryTags: ['Halal'],      image: '/Nature\'s Village Special Platter (2 People).jpg',
      available: true
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
        kmr: 'Pizza Zarokan',
        es: 'Pizza para Niños',
        ru: 'Детская пицца',
        hi: 'बच्चों का पिज्जा',
        sq: 'Pica për Fëmijë',
        fr: 'Pizza pour Enfants'
      }, 
      description: { 
        en: 'Thin crust pizza made for kids.',
        ar: 'بيتزا رقيقة القاعدة مصنوعة للأطفال.',
        fa: 'پیتزای نازک مخصوص کودکان.',
        ku: 'پیتزای نازک بۆ منداڵان دروستکراوە.',
        tr: 'Çocuklar için yapılmış ince hamur pizza.',
        ur: 'بچوں کے لیے بنایا گیا پتلا پیزا۔',
        kmr: 'Pizza nazik a ji bo zarokan hatiye çêkirin.',
        es: 'Pizza de masa fina hecha para niños.',
        ru: 'Тонкая пицца, специально приготовленная для детей.',
        hi: 'बच्चों के लिए बनाया गया पतला पिज्जा।',
        sq: 'Pica me brumë të hollë e bërë për fëmijë.',
        fr: 'Pizza à pâte fine spécialement préparée pour les enfants.',
        de: 'Dünne Pizzateig-Pizza, speziell für Kinder gemacht.'
      }, 
      price: '$10.99', 
      category: 'kids', 
      tags: ['kid-friendly', 'thin-crust', 'simple', 'small-size'],
      nutritionalInfo: {
        calories: 280,
        protein: '12g',
        carbs: '35g', 
        fat: '10g',
        fiber: '2g'
      },
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Vegetarian', 'Halal'],      image: '/kpizza.jpg',
      available: true
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
        kmr: 'Tenderên Mirîşk',
        es: 'Tiras de Pollo',
        ru: 'Куриные полоски',
        hi: 'चिकन टेंडर',
        sq: 'Shirita Pule'
      }, 
      description: { 
        en: 'Tender strips of chicken breast, breaded and fried to a crispy golden brown. Served with your choice of dipping sauces.',
        ar: 'شرائح طرية من صدر الدجاج، مغطاة بالخبز ومقلية حتى اللون الذهبي المقرمش. تُقدم مع صلصات الغمس من اختيارك.',
        fa: 'نوارهای نرم سینه مرغ، آرد شده و سرخ شده تا رنگ طلایی ترد. با سس‌های انتخابی شما سرو می‌شود.',
        ku: 'پارچە نەرمەکانی سنگی مریشک، نانکراو و سوورکراوە تا ڕەنگی زێڕینی ترسکە. لەگەڵ سۆسەکانی دڵخوازت بۆ خستنە ناوەوە خراوەتە سەر.',
        tr: 'Tavuk göğsünün yumuşak şeritleri, galeta unu ile kaplanmış ve çıtır altın sarısı renkte kızartılmış. Seçtiğiniz soslarla servis edilir.',
        ur: 'چکن بریسٹ کی نرم پٹیاں، بریڈ کر کے سنہری بھورے رنگ میں کرسپی تک تلی گئی۔ آپ کی پسند کے ڈپنگ ساس کے ساتھ پیش کی جاتی ہے۔',
        kmr: 'Perçeyên nerm ên sînga mirîşk, bi nanê hatine kirin û hatine sortin heta rengê zêrîn ê çitir. Bi soşên ku tu dibijêrî ji bo navxistinê tê peşkêşkirin.',
        es: 'Tiras tiernas de pechuga de pollo, empanizadas y fritas hasta un dorado crujiente. Servidas con las salsas para remojar de tu elección.',
        ru: 'Нежные полоски куриной грудки в панировке, обжаренные до золотисто-коричневого хрустящего цвета. Подается с соусами на ваш выбор.',
        hi: 'चिकन ब्रेस्ट की नरम पट्टियां, ब्रेड और तली हुई कुरकुरी सुनहरी भूरे रंग की। आपकी पसंद की डिपिंग सॉस के साथ परोसा जाता है।',
        sq: 'Shirita të buta mishi gjoksi pule, të mbuluar me bukë dhe të skuqura në ngjyrë të artë të krisur. Shërbehet me salcat tuaja të zgjedhura për zhytje.',
        de: 'Zarte Streifen von Hühnerbrust, paniert und zu goldbrauner Knusprigkeit frittiert. Serviert mit Ihren gewählten Dip-Saucen.'
      }, 
      price: '$8.99', 
      category: 'kids', 
      popular: true, 
      tags: ['crispy', 'breaded', 'kid-favorite', 'tender-chicken', 'finger-food'],
      nutritionalInfo: {
        calories: 220,
        protein: '18g',
        carbs: '12g',
        fat: '12g',
        fiber: '1g'
      },
      allergens: ['Gluten', 'Eggs'],
      dietaryTags: ['Halal'],      image: '/Chicken Tenders.jpg',
      available: true 
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
        fr: 'Frites'
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
        de: 'Knusprige, goldbraune Kartoffelpommes, perfekt gewürzt und heiß serviert.'
      }, 
      price: '$6.99', 
      category: 'kids', 
      popular: true, 
      tags: ['crispy', 'golden', 'kid-favorite', 'side-dish', 'classic'],
      nutritionalInfo: {
        calories: 320,
        protein: '4g',
        carbs: '45g', 
        fat: '14g',
        fiber: '4g'
      },
      allergens: [],
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],      image: '/Fries.jpg',
      available: true
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
        sq: 'Ujë'
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
        de: 'Frisches Flaschenwasser.'
      }, 
      price: '$1.50', 
      category: 'drinks_cold', 
      tags: ['refreshing', 'hydrating', 'pure', 'essential'],
      nutritionalInfo: {
        calories: 0,
        protein: '0g',
        carbs: '0g', 
        fat: '0g',
        fiber: '0g'
      },
      allergens: [],
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],      image: '/hero.mp4', // Placeholder: water bottle image needed
      available: true
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
        fr: 'Eau Pétillante'
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
        de: 'Erfrischendes Mineralwasser.'
      }, 
      price: '$3.99', 
      category: 'drinks_cold', 
      tags: ['sparkling', 'refreshing', 'bubbly', 'mineral'],
      nutritionalInfo: {
        calories: 0,
        protein: '0g',
        carbs: '0g',
        fat: '0g',
        fiber: '0g'
      },
      allergens: [],
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],      image: '/hero.mp4', // Placeholder: sparkling water image needed
      available: true 
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
        ru: 'Газировka',
        hi: 'सोडा',
        sq: 'Pije me Gaz',
        fr: 'Soda'
      }, 
      description: { 
        en: 'Choice of Coke, Diet Coke, Coke Zero, Sprite, Fanta, or Minute Maid.',
        ar: 'اختيار من كوكا كولا، دايت كوك، كوك زيرو، سبرايت، فانتا، أو مينيت مايد.',
        fa: 'انتخاب از کوکا کولا، دایت کوک، کوک زرو، اسپرایت، فانتا یا مینیت مید.',
        ku: 'هەڵبژاردن لە کۆکا کۆلا، دایەت کۆک، کۆک زیرۆ، سپرایت، فانتا، یان مینت مەید.',
        tr: 'Kola, Diyet Kola, Kola Zero, Sprite, Fanta veya Minute Maid seçimi.',
        ur: 'کوک، ڈائٹ کوک، کوک زیرو، سپرائٹ، فانٹا یا منٹ میڈ کا انتخاب۔',
        kmr: 'Hilbijartina Koke, Diet Koke, Koke Zero, Sprite, Fanta, an Minute Maid.',
        es: 'Elección de Coca Cola, Coca Cola Light, Coca Cola Zero, Sprite, Fanta o Minute Maid.',
        ru: 'Выбор из Кока-Колы, Диет-Коки, Кока-Кола Зеро, Спрайта, Фанты или Минут Мейд.',
        hi: 'कोक, डाइट कोक, कोक जीरो, स्प्राइट, फैंटा या मिनट मेड का विकल्प।',
        sq: 'Zgjidhje ndërmjet Koka Kola, Diet Koka, Koka Zero, Sprite, Fanta ose Minute Maid.',
        fr: 'Choix de Coca-Cola, Coca Light, Coca Zéro, Sprite, Fanta ou Minute Maid.',
        de: 'Auswahl aus Coca Cola, Diet Coke, Coke Zero, Sprite, Fanta oder Minute Maid.'
      }, 
      price: '$2.99', 
      category: 'drinks_cold', 
      popular: true, 
      tags: ['fizzy', 'variety', 'classic', 'sweet', 'carbonated'],
      nutritionalInfo: {
        calories: 140,
        protein: '0g',
        carbs: '39g',
        fat: '0g',
        fiber: '0g'
      },
      allergens: [],
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],      image: '/hero.mp4', // Placeholder: soda image needed
      available: true 
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
        ru: 'Йогуртовый напиток из Эрбиля',
        hi: 'एर्बिल दही का पेय',
        sq: 'Pije Kosi Erbil',
        fr: 'Boisson au Yaourt d\'Erbil'
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
        de: 'Traditionelles Joghurtgetränk aus Erbil.'
      }, 
      price: '$3.99', 
      category: 'drinks_cold', 
      tags: ['traditional', 'yogurt-based', 'erbil-specialty', 'protein-rich', 'refreshing'],
      nutritionalInfo: {
        calories: 120,
        protein: '8g',
        carbs: '15g', 
        fat: '3g',
        fiber: '0g'
      },
      allergens: ['Dairy'],
      dietaryTags: ['Vegetarian', 'Halal'],      image: '/Erbil Yogurt Drink.jpg',
      available: true
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
        fr: 'Café Arabe'
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
        de: 'Traditioneller arabischer Kaffee mit Kardamom.'
      }, 
      price: '$2.99', 
      category: 'drinks_hot', 
      popular: true, 
      tags: ['traditional', 'arabic', 'cardamom', 'aromatic', 'authentic'] 
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
        fr: 'Café Kurde Qazwan'
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
        de: 'Traditionelle kurdische Kaffeemischung.'
      }, 
      price: '$3.50', 
      category: 'drinks_hot', 
      tags: ['traditional', 'kurdish', 'coffee-blend', 'cultural', 'specialty'] 
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
        fr: 'Café Turc à la Pistache'
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
        de: 'Türkischer Kaffee mit Pistaziengeschmack.'
      }, 
      price: '$3.50', 
      category: 'drinks_hot', 
      tags: ['turkish', 'pistachio-flavor', 'specialty-coffee', 'nutty', 'unique'] 
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
        fr: 'Thé Karak'
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
        de: 'Gewürztee mit Milch und Kardamom.'
      }, 
      price: '$2.99', 
      category: 'drinks_hot', 
      popular: true, 
      tags: ['spiced-tea', 'milk-tea', 'cardamom', 'comforting', 'creamy'] 
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
        sq: 'Çaj Persian',
        fr: 'Thé Persan'
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
        de: 'Traditioneller persischer schwarzer Tee.'
      }, 
      price: '$2.50', 
      category: 'drinks_hot', 
      tags: ['traditional', 'persian', 'black-tea', 'authentic'] 
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
        kmr: 'Çaya Kesk',
        es: 'Té Verde',
        ru: 'Зелёный чай',
        hi: 'हरी चाय',
        sq: 'Çaj i Gjelbër',
        fr: 'Thé Vert'
      }, 
      description: { 
        en: 'Fresh green tea with antioxidants.',
        ar: 'شاي أخضر طازج مع مضادات الأكسدة.',
        fa: 'چای سبز تازه با آنتی‌اکسیدان.',
        ku: 'چایی سەوزی تازە لەگەڵ دژە ئۆکسیدان.',
        tr: 'Antioksidan içeren taze yeşil çay.',
        ur: 'اینٹی آکسیڈنٹ کے ساتھ تازہ سبز چائے۔',
        kmr: 'Çaya kesk a taze bi antîoksîdanan.',
        es: 'Té verde fresco con antioxidantes.',
        ru: 'Свежий зелёный чай с антиоксидантами.',
        hi: 'एंटीऑक्सिडेंट के साथ ताज़ी हरी चाय।',
        sq: 'Çaj i gjelbër i freskët me antioksidantë.',
        fr: 'Thé vert frais aux antioxydants.',
        de: 'Frischer grüner Tee mit Antioxidantien.'
      }, 
      price: '$2.50', 
      category: 'drinks_hot', 
      tags: ['healthy', 'antioxidants', 'green-tea', 'fresh'] 
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
        fr: 'Baklava'
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
        de: 'Süßes Gebäck mit Nuss- und Honigschichten.'
      }, 
      price: '$6.99', 
      category: 'dessert', 
      popular: true, 
      tags: ['traditional', 'middle-eastern', 'honey', 'nuts', 'layered-pastry'],
      nutritionalInfo: {
        calories: 320,
        protein: '6g',
        carbs: '42g', 
        fat: '15g',
        fiber: '2g'
      },
      allergens: ['Gluten', 'Nuts', 'Dairy'],
      dietaryTags: ['Vegetarian'],      image: '/baklava.jpg',
      available: true
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
        fr: 'Tiramisu'
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
        de: 'Gesüßte Schlagsahne und reichhaltiger Mascarpone.'
      }, 
      price: '$5.99', 
      category: 'dessert', 
      popular: true, 
      tags: ['italian', 'coffee-flavored', 'creamy', 'mascarpone', 'elegant'],
      nutritionalInfo: {
        calories: 280,
        protein: '5g',
        carbs: '28g', 
        fat: '18g',
        fiber: '1g'
      },
      allergens: ['Gluten', 'Dairy', 'Eggs', 'Alcohol'],
      dietaryTags: ['Vegetarian'],      image: '/Tiramisu.jpg',
      available: true
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
        fr: 'Khash Khash'
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
        de: 'Köstliches Dessert mit Schichten aus Sahne und knuspriger Fadennudeln.'
      }, 
      price: '$5.99', 
      category: 'dessert', 
      tags: ['layered-dessert', 'cream', 'crispy-noodles', 'middle-eastern', 'texture-contrast'] 
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
        fr: 'Pudding de Riz au Four'
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
        de: 'Cremiger nahöstlicher Milchpudding.'
      }, 
      price: '$5.99', 
      category: 'dessert', 
      tags: ['rice-pudding', 'oven-baked', 'creamy', 'middle-eastern', 'comforting'] 
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
        fr: 'Glace'
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
        de: 'Wählen Sie aus 3 Geschmacksrichtungen: Erdbeere, Schokolade, Vanille.'
      }, 
      price: '$2.99', 
      category: 'dessert', 
      popular: true, 
      tags: ['cold-dessert', 'variety-flavors', 'classic', 'refreshing', 'kid-friendly'], 
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
        kmr: 'Salata Yewnanî',
        es: 'Ensalada Griega',
        ru: 'Греческий салат',
        hi: 'ग्रीक सलाद',
        sq: 'Sallatë Greke',
        fr: 'Salade Grecque'
      }, 
      description: { 
        en: 'A classic Greek salad made with tomatoes, cucumbers, green peppers, onions, olives, feta cheese, mixed greens, and olive oil.',
        ar: 'سلطة يونانية كلاسيكية مصنوعة من الطماطم والخيار والفلفل الأخضر والبصل والزيتون وجبن الفيتا والخضروات المختلطة وزيت الزيتون.',
        fa: 'سالاد یونانی کلاسیک از گوجه‌فرنگی، خیار، فلفل سبز، پیاز، زیتون، پنیر فتا، سبزیجات مخلوط و روغن زیتون.',
        ku: 'سالادی یۆنانی کلاسیک لە تەماتە، خیار، بیبەری سەوز، پیاز، زەیتوون، پەنیری فیتا، سەوزەی تێکەڵ و زەیتی زەیتوون.',
        tr: 'Domates, salatalık, yeşil biber, soğan, zeytin, feta peyniri, karışık yeşillikler ve zeytinyağı ile yapılan klasik Yunan salatası.',
        ur: 'ٹماٹر، کھیرا، ہری مرچ، پیاز، زیتون، فیٹا چیز، ملے جلے سبزیجات اور زیتون کے تیل سے بنا کلاسک یونانی سلاد۔',
        kmr: 'Salatayek Yewnanî ya klasîk ku ji firangoş, xiyar, biberê kesk, pîvaz, zeytûn, penîrê feta, sebzeyên tevlihev û zeyta zeytûnê tê çêkirin.',
        es: 'Ensalada griega clásica hecha con tomates, pepinos, pimiento verde, cebolla, aceitunas, queso feta, verduras mixtas y aceite de oliva.',
        ru: 'Классический греческий салат из помидоров, огурцов, зелёного перца, лука, оливок, сыра фета, смешанной зелени и оливкового масла.',
        hi: 'टमाटर, खीरे, हरी मिर्च, प्याज, जैतून, फेटा चीज़, मिश्रित साग और जैतून के तेल से बना क्लासिक ग्रीक सलाद।',
        sq: 'Sallatë klasike greke e bërë me domate, kastravec, spec të gjelbër, qepë, ullinj, djathë feta, gjelbrim të përzier dhe vaj ulliri.',
        fr: 'Salade grecque classique préparée avec tomates, concombres, poivrons verts, oignons, olives, fromage feta, salade mélangée et huile d\'olive.',
        de: 'Klassischer griechischer Salat mit Tomaten, Gurken, grünen Paprika, Zwiebeln, Oliven, Feta-Käse, gemischten Blättern und Olivenöl.'
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
          { name: { en: 'Beef', ar: 'لحم بقر', fa: 'گوشت گاو', ku: 'گۆشتی گا', tr: 'Dana Eti', ur: 'گائے کا گوشت', kmr: 'Goştê Ga', es: 'Carne de Res', ru: 'Говядина', hi: 'गोमांस' }, price: '$7.99' }, 
          { name: { en: 'Chicken', ar: 'دجاج', fa: 'مرغ', ku: 'مریشک', tr: 'Tavuk', ur: 'چکن', kmr: 'Mirîşk', es: 'Pollo', ru: 'Курица', hi: 'चिकन' }, price: '$6.99' }, 
          { name: { en: 'Falafel', ar: 'فلافل', fa: 'فلافل', ku: 'فەلەفڵ', tr: 'Falafel', ur: 'فلافل', kmr: 'Falafel', es: 'Falafel', ru: 'Фалафель', hi: 'फلाफेल' }, price: '$4.99' }, 
          { name: { en: 'Shrimp', ar: 'روبيان', fa: 'میگو', ku: 'میگۆ', tr: 'Karides', ur: 'جھینگا', kmr: 'Mîgo', es: 'Camarones', ru: 'Креветки', hi: 'झींगا' }, price: '$5.99' } 
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
        fr: 'Salade Fattoush'
      }, 
      description: { 
        en: 'A delicious Middle Eastern salad made with lettuce, tomatoes, cucumbers, green peppers, fresh mint, parsley, crispy pita bread, and pomegranate molasses dressing.',
        ar: 'سلطة شرق أوسطية لذيذة مصنوعة من الخس والطماطم والخيار والفلفل الأخضر والنعناع الطازج والبقدونس وخبز البيتا المقرمش وصلصة دبس الرمان.',
        fa: 'سالاد لذیذ خاورمیانه‌ای از کاهو، گوجه‌فرنگی، خیار، فلفل سبز، نعنای تازه، جعفری، نان پیتای ترد و سس انار.',
        ku: 'سالادێکی خۆشی ڕۆژهەڵاتی ناوەڕاست لە خس، تەماتە، خیار، بیبەری سەوز، پونگی تازە، جەعدە، نانی پیتای ترسکە و سۆسی هەنار.',
        tr: 'Marul, domates, salatalık, yeşil biber, taze nane, maydanoz, çıtır pita ekmeği ve nar ekşisi sosuyla yapılan lezzetli Orta Doğu salatası.',
        ur: 'لیٹوس، ٹماٹر، کھیرا، ہری مرچ، تازہ پودینہ، دھنیا، کرسپی پیٹا بریڈ اور انار کے شیرے کی ڈریسنگ سے بنا لذیذ مشرق وسطیٰ کا سلاد۔',
        kmr: 'Salatayek bi tam a Rojhilatê Navîn ku ji salata kesk, firangoş, xiyar, biberê kesk, pûngê taze, şînî, nanê pita yê çitir û soşa henarê tê çêkirin.',
        es: 'Una deliciosa ensalada del Medio Oriente hecha con lechuga, tomates, pepinos, pimientos verdes, menta fresca, perejil, pan pita crujiente y aderezo de melaza de granada.',
        ru: 'Вкусный ближневосточный салат из салата, помидоров, огурцов, зелёного перца, свежей мяты, петрушки, хрустящего хлеба пита и заправки из гранатовой патоки.',
        hi: 'सलाद पत्ता, टमाटर, खीरे, हरी मिर्च, ताज़ा पुदीना, अजमोद, कुरकुरी पीटा ब्रेड और अनार के शीरे की ड्रेसिंग से बना स्वादिष्ट मध्य पूर्वी सलाद।',
        sq: 'Sallatë e shijshme lindjes së mesme e bërë me marule, domate, kastravec, spec të gjelbër, mendër të freskët, majdanoz, bukë pita të krisur dhe salcë melase shege.',
        fr: 'Une délicieuse salade du Moyen-Orient préparée avec laitue, tomates, concombres, poivrons verts, menthe fraîche, persil, pain pita croustillant et vinaigrette à la mélasse de grenade.',
        de: 'Ein köstlicher nahöstlicher Salat aus Kopfsalat, Tomaten, Gurken, grünen Paprika, frischer Minze, Petersilie, knusprigem Pita-Brot und Granatapfelmelasse-Dressing.'
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
        kmr: 'Salata Şîvan',
        es: 'Ensalada Shivan',
        ru: 'Салат Шиван',
        hi: 'शिवान सलाद',
        sq: 'Sallatë Shiwan',
        fr: 'Salade Shiwan'
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
        de: 'Ein erfrischender türkischer Salat aus Tomaten, Gurken, grünen Paprika, Zwiebeln, Petersilie und Walnüssen, gewürzt mit Olivenöl und Zitronensaft.'
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
        kmr: 'Salata Suwanee',
        es: 'Ensalada Suwanee',
        ru: 'Салат Сувани',
        hi: 'सुवानी सलाद',
        sq: 'Sallatë Suwanee',
        fr: 'Salade Suwanee'
      }, 
      description: { 
        en: 'A vibrant and refreshing dish crafted with fresh, colorful ingredients. This includes leafy beets, tomatoes, bell peppers, cucumbers, onions, and seasonal fruits. This rich combination appeals to both the eye and the palate.',
        ar: 'طبق نابض بالحياة ومنعش مصنوع من مكونات طازجة وملونة. يشمل الشمندر الورقي والطماطم والفلفل الحلو والخيار والبصل والفواكه الموسمية. هذا المزيج الغني يروق للعين والحنك.',
        fa: 'غذایی پر جنب و جوش و تازه‌کننده با مواد تازه و رنگارنگ. شامل چغندر برگ، گوجه‌فرنگی، فلفل دلمه‌ای، خیار، پیاز و میوه‌های فصلی. این ترکیب غنی هم چشم و هم کام را جذب می‌کند.',
        ku: 'خۆراکێکی گیانەوەر و ئارامبەخش لە پێکهاتە تازە و ڕەنگاوڕەنگەکان دروستکراوە. ئەمەش بریتییە لە چوکوندری گەڵا، تەماتە، بیبەری شیرین، خیار، پیاز و میوەی وەرزی. ئەم تێکەڵە دەوڵەمەندە هەم چاو و هەم مل سەرسام دەکات.',
        tr: 'Taze, renkli malzemelerle hazırlanmış canlı ve ferahlatıcı bir yemek. Yapraklı pancar, domates, dolmalık biber, salatalık, soğan ve mevsim meyvelerini içerir. Bu zengin kombinasyon hem göze hem de damağa hitap eder.',
        ur: 'تازہ، رنگین اجزاء کے ساتھ تیار کیا گیا ایک متحرک اور تازگی بخش پکوان۔ اس میں پتوں والا چقندر، ٹماٹر، شملہ مرچ، کھیرا، پیاز اور موسمی پھل شامل ہیں۔ یہ بھرپور امتزاج آنکھ اور ذائقہ دونوں کو اپیل کرتا ہے۔',
        kmr: 'Xwarineke geş û vevedî ku bi maddeyên taze û rengîn hatiye amade kirin. Ev jî pancarên pelî, firangoş, biberên şîrîn, xiyar, pîvaz û firehên werzeya vedihewîne. Ev tevahiya dewlemend hem çav û hem dev dişibîne.',
        es: 'Un plato vibrante y refrescante elaborado con ingredientes frescos y coloridos. Incluye remolachas de hoja, tomates, pimientos morrones, pepinos, cebollas y frutas de temporada. Esta rica combinación atrae tanto a la vista como al paladar.',
        ru: 'Яркое и освежающее блюдо, приготовленное из свежих, красочных ингредиентов. Включает листовую свеклу, помидоры, сладкий перец, огурцы, лук и сезонные фрукты. Эта богатая комбинация привлекает как глаз, так и вкус.',
        hi: 'ताज़ी, रंगबिरंगी सामग्री के साथ बनाया गया एक जीवंत और ताज़गी भरा व्यंजन। इसमें पत्तेदार चुकंदर, टमाटर, शिमला मिर्च, खीरे, प्याज और मौसमी फल शामिल हैं। यह समृद्ध संयोजन आंख और तालू दोनों को आकर्षित करता है।',
        sq: 'Pjatë gjallëruese dhe freskuese e përgatitur me përbërës të freskët dhe me ngjyra. Përfshin panxhar me gjethe, domate, spec kambanë, kastravec, qepë dhe fruta sezoni. Kjo kombinim i pasur tërheq edhe syrin edhe shijen.',
        fr: 'Un plat vibrant et rafraîchissant préparé avec des ingrédients frais et colorés. Comprend betteraves à feuilles, tomates, poivrons doux, concombres, oignons et fruits de saison. Cette riche combinaison plaît à l\'œil comme au palais.',
        de: 'Ein lebendiges und erfrischendes Gericht aus frischen, bunten Zutaten. Enthält Blatt-Rote-Bete, Tomaten, Paprika, Gurken, Zwiebeln und saisonale Früchte. Diese reichhaltige Kombination spricht sowohl das Auge als auch den Gaumen an.'
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

  // Performance optimization: Create search index for faster filtering
  const searchIndex = useMemo(() => {
    const index = new Map();
    menuItems.forEach(item => {
      if (item && item.id) {
        const searchableText = [
          getText(item.name) || '',
          getText(item.description || {}) || '',
          ...(Array.isArray(item.tags) ? item.tags : []),
          ...(Array.isArray(item.dietaryTags) ? item.dietaryTags : []),
          item.category || ''
        ].join(' ').toLowerCase();
        index.set(item.id, searchableText);
      }
    });
    return index;
  }, [menuItems, getText]);

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
                                <div className="w-full sm:w-2/5 h-56 sm:h-96 lg:h-[420px] relative overflow-hidden flex-shrink-0 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl lg:rounded-l-3xl group-hover:scale-105 transition-transform duration-700">
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

                    {/* Nutritional Information */}
                    {item.nutritionalInfo && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">ℹ</span>
                          </div>
                          <span className="text-sm font-semibold text-blue-800">
                            {language === 'ar' ? 'معلومات التغذية' :
                             language === 'fa' ? 'اطلاعات تغذیه‌ای' :
                             language === 'ku' ? 'زانیاری خۆراک' :
                             language === 'tr' ? 'Beslenme Bilgileri' :
                             language === 'ur' ? 'غذائی معلومات' :
                             language === 'kmr' ? 'Agahiyên Xurek' :
                             language === 'es' ? 'Información Nutricional' :
                             language === 'ru' ? 'Пищевая ценность' :
                             language === 'hi' ? 'पोषण संबंधी जानकारी' :
                             language === 'sq' ? 'Informacioni Ushqyes' :
                             language === 'fr' ? 'Informations Nutritionnelles' :
                             language === 'de' ? 'Nährwertangaben' :
                             'Nutritional Information'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                          {item.nutritionalInfo.calories && (
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-semibold text-blue-700">{item.nutritionalInfo.calories}</div>
                              <div className="text-blue-600">
                                {language === 'ar' ? 'سعرة' :
                                 language === 'fa' ? 'کالری' :
                                 language === 'ku' ? 'کالۆری' :
                                 language === 'tr' ? 'Kalori' :
                                 language === 'ur' ? 'کیلوری' :
                                 language === 'kmr' ? 'Kalorî' :
                                 language === 'es' ? 'Calorías' :
                                 language === 'ru' ? 'ккал' :
                                 language === 'hi' ? 'कैलोरी' :
                                 language === 'sq' ? 'Kalori' :
                                 language === 'fr' ? 'Calories' :
                                 language === 'de' ? 'Kalorien' :
                                 'Calories'}
                              </div>
                            </div>
                          )}
                          {item.nutritionalInfo.protein && (
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-semibold text-blue-700">{item.nutritionalInfo.protein}</div>
                              <div className="text-blue-600">
                                {language === 'ar' ? 'بروتين' :
                                 language === 'fa' ? 'پروتئین' :
                                 language === 'ku' ? 'پرۆتین' :
                                 language === 'tr' ? 'Protein' :
                                 language === 'ur' ? 'پروٹین' :
                                 language === 'kmr' ? 'Protein' :
                                 language === 'es' ? 'Proteína' :
                                 language === 'ru' ? 'Белок' :
                                 language === 'hi' ? 'प्रोटीन' :
                                 language === 'sq' ? 'Proteina' :
                                 language === 'fr' ? 'Protéines' :
                                 language === 'de' ? 'Protein' :
                                 'Protein'}
                              </div>
                            </div>
                          )}
                          {item.nutritionalInfo.carbs && (
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-semibold text-blue-700">{item.nutritionalInfo.carbs}</div>
                              <div className="text-blue-600">
                                {language === 'ar' ? 'كربوهيدرات' :
                                 language === 'fa' ? 'کربوهیدرات' :
                                 language === 'ku' ? 'کاربۆهایدرات' :
                                 language === 'tr' ? 'Karbonhidrat' :
                                 language === 'ur' ? 'کاربوہائیڈریٹ' :
                                 language === 'kmr' ? 'Karbohîdrat' :
                                 language === 'es' ? 'Carbohidratos' :
                                 language === 'ru' ? 'Углеводы' :
                                 language === 'hi' ? 'कार्बोहाइड्रेट' :
                                 language === 'sq' ? 'Karbohidrate' :
                                 language === 'fr' ? 'Glucides' :
                                 language === 'de' ? 'Kohlenhydrate' :
                                 'Carbs'}
                              </div>
                            </div>
                          )}
                          {item.nutritionalInfo.fat && (
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-semibold text-blue-700">{item.nutritionalInfo.fat}</div>
                              <div className="text-blue-600">
                                {language === 'ar' ? 'دهون' :
                                 language === 'fa' ? 'چربی' :
                                 language === 'ku' ? 'چەوری' :
                                 language === 'tr' ? 'Yağ' :
                                 language === 'ur' ? 'چکنائی' :
                                 language === 'kmr' ? 'Rûn' :
                                 language === 'es' ? 'Grasa' :
                                 language === 'ru' ? 'Жиры' :
                                 language === 'hi' ? 'वसा' :
                                 language === 'sq' ? 'Yndyrë' :
                                 language === 'fr' ? 'Lipides' :
                                 language === 'de' ? 'Fett' :
                                 'Fat'}
                              </div>
                            </div>
                          )}
                          {item.nutritionalInfo.fiber && (
                            <div className="text-center bg-white rounded p-2">
                              <div className="font-semibold text-blue-700">{item.nutritionalInfo.fiber}</div>
                              <div className="text-blue-600">
                                {language === 'ar' ? 'ألياف' :
                                 language === 'fa' ? 'فیبر' :
                                 language === 'ku' ? 'فایبەر' :
                                 language === 'tr' ? 'Lif' :
                                 language === 'ur' ? 'فائبر' :
                                 language === 'kmr' ? 'Fîber' :
                                 language === 'es' ? 'Fibra' :
                                 language === 'ru' ? 'Клетчатка' :
                                 language === 'hi' ? 'फाइबर' :
                                 language === 'sq' ? 'Fibër' :
                                 language === 'fr' ? 'Fibres' :
                                 language === 'de' ? 'Ballaststoffe' :
                                 'Fiber'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Allergen Information */}
                    {Array.isArray(item.allergens) && item.allergens.length > 0 && (
                      <div className="mb-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <span className="text-sm font-semibold text-red-800">
                            {language === 'ar' ? 'تحذير من المواد المسببة للحساسية' :
                             language === 'fa' ? 'هشدار آلرژن' :
                             language === 'ku' ? 'ئاگاداری هەستیاری' :
                             language === 'tr' ? 'Alerjen Uyarısı' :
                             language === 'ur' ? 'الرجی کی تنبیہ' :
                             language === 'kmr' ? 'Hişyariya Alerjîk' :
                             language === 'es' ? 'Advertencia de Alérgenos' :
                             language === 'ru' ? 'Предупреждение об аллергенах' :
                             language === 'hi' ? 'एलर्जी चेतावनी' :
                             language === 'sq' ? 'Paralajmërim Alergjeni' :
                             language === 'fr' ? 'Avertissement Allergènes' :
                             language === 'de' ? 'Allergen-Warnung' :
                             'Allergen Warning'}
                          </span>
                        </div>
                        <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                          {item.allergens.map((allergen, allergenIndex) => (
                            <span key={allergenIndex} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dietary Tags */}
                    {Array.isArray(item.dietaryTags) && item.dietaryTags.length > 0 && (
                      <div className="mb-3">
                        <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                          {item.dietaryTags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                              {tag === 'Vegetarian' ? 
                                (language === 'ar' ? 'نباتي' :
                                 language === 'fa' ? 'گیاهخوار' :
                                 language === 'ku' ? 'گیاخۆر' :
                                 language === 'tr' ? 'Vejetaryen' :
                                 language === 'ur' ? 'سبزی خور' :
                                 language === 'kmr' ? 'Nebatî' :
                                 language === 'es' ? 'Vegetariano' :
                                 language === 'ru' ? 'Вегетарианский' :
                                 language === 'hi' ? 'शाकाहारी' :
                                 language === 'sq' ? 'Vegjetarian' :
                                 language === 'fr' ? 'Végétarien' :
                                 language === 'de' ? 'Vegetarisch' : 'Vegetarian') :
                               tag === 'Vegan' ?
                                (language === 'ar' ? 'نباتي صرف' :
                                 language === 'fa' ? 'وگان' :
                                 language === 'ku' ? 'ڤیگان' :
                                 language === 'tr' ? 'Vegan' :
                                 language === 'ur' ? 'ویگن' :
                                 language === 'kmr' ? 'Vegan' :
                                 language === 'es' ? 'Vegano' :
                                 language === 'ru' ? 'Веганский' :
                                 language === 'hi' ? 'वीगन' :
                                 language === 'sq' ? 'Vegan' :
                                 language === 'fr' ? 'Végan' :
                                 language === 'de' ? 'Vegan' : 'Vegan') :
                               tag === 'Gluten-Free' ?
                                (language === 'ar' ? 'خالي من الغلوتين' :
                                 language === 'fa' ? 'بدون گلوتن' :
                                 language === 'ku' ? 'بەبێ گلۆتین' :
                                 language === 'tr' ? 'Glutensiz' :
                                 language === 'ur' ? 'گلوٹن فری' :
                                 language === 'kmr' ? 'Bê Gluten' :
                                 language === 'es' ? 'Sin Gluten' :
                                 language === 'ru' ? 'Без глютена' :
                                 language === 'hi' ? 'ग्लूटेन मुक्त' :
                                 language === 'sq' ? 'Pa Gluten' :
                                 language === 'fr' ? 'Sans Gluten' :
                                 language === 'de' ? 'Glutenfrei' : 'Gluten-Free') :
                               tag === 'Halal' ?
                                (language === 'ar' ? 'حلال' :
                                 language === 'fa' ? 'حلال' :
                                 language === 'ku' ? 'حەلال' :
                                 language === 'tr' ? 'Helal' :
                                 language === 'ur' ? 'حلال' :
                                 language === 'kmr' ? 'Helal' :
                                 language === 'es' ? 'Halal' :
                                 language === 'ru' ? 'Халяль' :
                                 language === 'hi' ? 'हलाल' :
                                 language === 'sq' ? 'Halal' :
                                 language === 'fr' ? 'Halal' :
                                 language === 'de' ? 'Halal' : 'Halal') : tag}
                            </span>
                          ))}
                        </div>
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



