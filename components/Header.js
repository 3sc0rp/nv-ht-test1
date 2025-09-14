import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Menu, X, Globe, Facebook, Instagram, ChefHat, ChevronDown, ChevronRight,
  Home, Utensils, Info, Camera, MapPin, Calendar, Users, Phone, ExternalLink, Share2
} from 'lucide-react';
import { LANGUAGES, getText, updateDocumentLanguage } from '../lib/i18n';
import { useLanguage } from '../contexts/LanguageContext';

const Header = ({ currentPage = '' }) => {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navigationItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'menu', label: 'Menu', href: '/menu' },
    { key: 'about', label: 'About Us', href: '/#about' },
    { key: 'gallery', label: 'Gallery', href: '/gallery' },
    { key: 'visit', label: 'Visit Us', href: '/#visit' },
    { key: 'reservations', label: 'Reservations', href: '/reservations' },
    { key: 'catering', label: 'Catering', href: '/catering' }
  ];

  // Get navigation translations
  const getNavText = (key) => {
    const navTranslations = {
      en: {
        home: 'Home',
        menu: 'Menu', 
        about: 'About Us',
        gallery: 'Gallery',
        visit: 'Visit Us',
        reservations: 'Reservations',
        catering: 'Catering',
        orderOnline: 'Order Online'
      },
      ku: {
        home: 'ماڵەوە',
        menu: 'مێنیو',
        about: 'دەربارەمان',
        gallery: 'وێنەکان',
        visit: 'سەردانمان بکە',
        reservations: 'حجز میز',
        catering: 'کەیتەرینگ',
        orderOnline: 'داواکاری ئۆنلاین'
      },
      ar: {
        home: 'الرئيسية',
        menu: 'القائمة',
        about: 'معلومات عنا',
        gallery: 'المعرض',
        visit: 'زورونا',
        reservations: 'الحجوزات',
        catering: 'الضيافة',
        orderOnline: 'اطلب أونلاين'
      },
      fa: {
        home: 'خانه',
        menu: 'منو',
        about: 'درباره ما',
        gallery: 'گالری',
        visit: 'ما را ببینید',
        reservations: 'رزرو میز',
        catering: 'کیترینگ',
        orderOnline: 'سفارش آنلاین'
      },
      tr: {
        home: 'Ana Sayfa',
        menu: 'Menü',
        about: 'Hakkımızda',
        gallery: 'Galeri',
        visit: 'Bizi Ziyaret Edin',
        reservations: 'Rezervasyon',
        catering: 'Catering',
        orderOnline: 'Online Sipariş'
      },
      es: {
        home: 'Inicio',
        menu: 'Menú',
        about: 'Nosotros',
        gallery: 'Galería',
        visit: 'Visítanos',
        reservations: 'Reservas',
        catering: 'Catering',
        orderOnline: 'Pedido en Línea'
      },
      fr: {
        home: 'Accueil',
        menu: 'Menu',
        about: 'À Propos',
        gallery: 'Galerie',
        visit: 'Nous Visiter',
        reservations: 'Réservations',
        catering: 'Traiteur',
        orderOnline: 'Commander en Ligne'
      },
      sq: {
        home: 'Kreu',
        menu: 'Meny',
        about: 'Rreth Nesh',
        gallery: 'Galeria',
        visit: 'Na Vizitoni',
        reservations: 'Rezervime',
        catering: 'Katering',
        orderOnline: 'Porosit Online'
      },
      ur: {
        home: 'ہوم',
        menu: 'مینو',
        about: 'ہمارے بارے میں',
        gallery: 'گیلری',
        visit: 'ہمیں ملیں',
        reservations: 'بکنگز',
        catering: 'کیٹرنگ',
        orderOnline: 'آن لائن آرڈر'
      },
      kmr: {
        home: 'Destpêk',
        menu: 'Menû',
        about: 'Der barê me de',
        gallery: 'Galeri',
        visit: 'Me bibînin',
        reservations: 'Rezervasyon',
        catering: 'Catering',
        orderOnline: 'Siparîşa Online'
      },
      de: {
        home: 'Startseite',
        menu: 'Speisekarte',
        about: 'Über Uns',
        gallery: 'Galerie',
        visit: 'Besuchen Sie Uns',
        reservations: 'Reservierungen',
        catering: 'Catering',
        orderOnline: 'Online Bestellen'
      },
      bn: {
        home: 'হোম',
        menu: 'মেনু',
        about: 'আমাদের সম্পর্কে',
        gallery: 'গ্যালারি',
        visit: 'আমাদের দেখুন',
        reservations: 'সংরক্ষণ',
        catering: 'ক্যাটারিং',
        orderOnline: 'অনলাইন অর্ডার'
      },
      ko: {
        home: '홈',
        menu: '메뉴',
        about: '회사 소개',
        gallery: '갤러리',
        visit: '방문하기',
        reservations: '예약',
        catering: '케이터링',
        orderOnline: '온라인 주문'
      },
      bs: {
        home: 'Početna',
        menu: 'Meni',
        about: 'O nama',
        gallery: 'Galerija',
        visit: 'Posjetite nas',
        reservations: 'Rezervacije',
        catering: 'Catering',
        orderOnline: 'Naruči online'
      },
      zh: {
        home: '首页',
        menu: '菜单',
        about: '关于我们',
        gallery: '图库',
        visit: '访问我们',
        reservations: '预订',
        catering: '餐饮服务',
        orderOnline: '在线订购'
      },
      ro: {
        home: 'Acasă',
        menu: 'Meniu',
        about: 'Despre Noi',
        gallery: 'Galerie',
        visit: 'Vizitează-ne',
        reservations: 'Rezervări',
        catering: 'Catering',
        orderOnline: 'Comandă Online'
      }
    };

    return navTranslations[language]?.[key] || navTranslations.en[key];
  };

  // Helper for RTL classes
  const rtlClass = (ltrClass, rtlClass) => isRTL ? rtlClass : ltrClass;
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  // Handle order online
  const handleOrderOnline = () => {
    // You can customize this based on your order system
    window.open('https://slicelife.com/restaurants/ga/suwanee/30024/nature-village-restaurant/menu', '_blank');
  };

  return (
    <>
      <style jsx>{`
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
      <nav className={cn(
        'fixed top-0 w-full z-50 border-b-2 border-amber-200 transition-all duration-300',
        isScrolled ? 'bg-white shadow-xl py-2' : 'bg-white/95 backdrop-blur-md shadow-lg py-4'
      )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('flex items-center justify-between h-16', isRTL && 'flex-row-reverse')}>
          {/* Logo Section */}
          <Link href="/">
            <div className={cn('flex items-center flex-shrink-0 cursor-pointer', isRTL && 'flex-row-reverse')}>
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
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
            <nav className={cn('flex items-center justify-center space-x-1', isRTL && 'space-x-reverse')} role="navigation" aria-label="Main navigation">
              <div className={cn('flex items-center space-x-1', isRTL && 'space-x-reverse')}>
                {navigationItems.map((item) => (
                  <Link key={item.key} href={item.href}>
                    <button
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                        'whitespace-nowrap relative group',
                        currentPage === item.key || (currentPage === '' && item.key === 'home')
                          ? 'bg-amber-800 text-white shadow-lg' 
                          : 'text-amber-800 hover:bg-amber-100 hover:text-amber-900'
                      )}
                      aria-current={currentPage === item.key ? 'page' : undefined}
                    >
                      {getNavText(item.key)}
                      {currentPage !== item.key && (
                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                      )}
                    </button>
                  </Link>
                ))}
                
                {/* Order Online CTA Button */}
                <button
                  onClick={handleOrderOnline}
                  className={cn(
                    'flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                    isRTL && 'space-x-reverse'
                  )}
                  aria-label={getNavText('orderOnline')}
                >
                  <ChefHat className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium text-xs uppercase tracking-wide whitespace-nowrap">{getNavText('orderOnline')}</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Social Media Links */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            <a 
              href="https://www.facebook.com/profile.php?id=61579243538732" 
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

          {/* Language Toggle & Mobile Menu */}
          <div className={cn('flex items-center space-x-3 flex-shrink-0', isRTL && 'space-x-reverse')}>
            {/* Order Online Button for Mobile - Hidden since it's in burger menu */}
            {/* <button
              onClick={handleOrderOnline}
              className={cn(
                'lg:hidden flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                isRTL && 'space-x-reverse'
              )}
              aria-label={getNavText('orderOnline')}
            >
              <ChefHat className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline font-medium text-xs uppercase tracking-wide whitespace-nowrap">{getNavText('orderOnline')}</span>
            </button> */}

            {/* Language Selector */}
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

                <span className="text-base" aria-hidden="true">
                  {LANGUAGES[language]?.flag || '🌐'}
                </span>
                <span className="font-medium text-xs uppercase tracking-wide">
                  {language.toUpperCase()}
                </span>
              </button>

              {showLanguageDropdown && (
                <div className={cn(
                  'absolute mt-1 w-44 bg-white rounded-lg shadow-lg border border-amber-200 z-[9999] overflow-hidden',
                  isRTL ? 'right-0' : 'left-0',
                  'max-h-72 overflow-y-auto'
                )}>
                  {Object.entries(LANGUAGES).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setShowLanguageDropdown(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2.5 hover:bg-amber-50 transition-colors duration-150 flex items-center space-x-2.5 text-sm',
                        isRTL && 'space-x-reverse text-right',
                        !isRTL && 'text-left',
                        language === code ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:text-amber-800'
                      )}
                    >

                      <span className="text-base mr-2">{config.flag}</span>
                      <span>{config.name}</span>
                      {language === code && (
                        <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full"></div>
                      )}

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

        {/* Mobile Navigation */}
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
                {navigationItems.map((item, index) => (
                  <Link key={item.key} href={item.href}>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'group relative flex items-center justify-between px-5 py-4 rounded-xl text-amber-800 hover:text-amber-900 transition-all duration-300 font-medium text-lg border border-transparent',
                        'hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-200/50 hover:shadow-md hover:scale-[1.02]',
                        'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2',
                        currentPage === item.key && 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border-amber-300/50 shadow-sm scale-[1.02]'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="flex items-center">
                        {/* Add navigation icons */}
                        {item.key === 'home' && <Home className="w-5 h-5 mr-3 opacity-70" />}
                        {item.key === 'menu' && <Utensils className="w-5 h-5 mr-3 opacity-70" />}
                        {item.key === 'about' && <Info className="w-5 h-5 mr-3 opacity-70" />}
                        {item.key === 'gallery' && <Camera className="w-5 h-5 mr-3 opacity-70" />}
                        {item.key === 'visit' && <MapPin className="w-5 h-5 mr-3 opacity-70" />}
                        {item.key === 'reservations' && <Calendar className="w-5 h-5 mr-3 opacity-70" />}
                        {item.key === 'catering' && <Users className="w-5 h-5 mr-3 opacity-70" />}
                        {getNavText(item.key)}
                      </span>
                      <ChevronRight className={cn(
                        'w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1',
                        isRTL && 'rotate-180'
                      )} />
                      
                      {/* Active indicator */}
                      {currentPage === item.key && (
                        <div className={cn(
                          'absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full',
                          isRTL ? 'right-0' : 'left-0'
                        )}></div>
                      )}
                    </button>
                  </Link>
                ))}
                
                {/* Enhanced Mobile Order Online Button */}
                <div className="mt-6 pt-4 border-t border-amber-200/70">
                  <a
                    href="https://order.online/store/nature-village-restaurant-atlanta-627533"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="group relative w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <ChefHat className="w-6 h-6 group-hover:animate-bounce" />
                    <span className="relative z-10">Order</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                  </a>
                </div>

                {/* Enhanced Mobile Language Selector */}
                <div className="mt-6 pt-6 border-t border-amber-200/70">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      {language === 'ar' ? 'اللغة' :
                       language === 'ku' ? 'زمان' :
                       language === 'fa' ? 'زبان' :
                       language === 'tr' ? 'Dil' :
                       language === 'es' ? 'Idioma' :
                       language === 'sq' ? 'Gjuha' :
                       language === 'ur' ? 'زبان' :
                       language === 'kmr' ? 'Ziman' :
                       language === 'ru' ? 'Язык' :
                       language === 'hi' ? 'भाषा' :
                       language === 'de' ? 'Sprache' :
                       language === 'bn' ? 'ভাষা' :
                       language === 'ko' ? '언어' :
                       'Language'}
                    </h3>
                    <span className="text-sm text-amber-600 font-medium px-3 py-1 bg-amber-100 rounded-full">
                      {language.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(LANGUAGES).map(([code, lang], index) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code);
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
                            {code === 'es' && '🇪🇸'}
                            {code === 'sq' && '🇦🇱'}
                            {code === 'ur' && '🇵🇰'}
                            {code === 'kmr' && '⭐'}
                            {code === 'ru' && '🇷🇺'}
                            {code === 'hi' && '🇮🇳'}
                            {code === 'de' && '🇩🇪'}
                            {code === 'bn' && '🇧🇩'}
                            {code === 'ko' && '🇰🇷'}
                            {code === 'bs' && '🇧🇦'}
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
                    href="tel:4703501019" 
                    className="group relative w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                    aria-label="Call us at (470) 350-1019"
                  >
                    <Phone className="w-5 h-5 group-hover:animate-pulse" />
                    <span>(470) 350-1019</span>
                  </a>
                </div>

                {/* Additional mobile menu footer */}
                <div className="mt-8 pt-6 border-t border-amber-200/70">
                  <div className="flex items-center justify-center space-x-6">
                    <a 
                      href="https://www.facebook.com/profile.php?id=61579243538732" 
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
    </>
  );
};

export default Header;
