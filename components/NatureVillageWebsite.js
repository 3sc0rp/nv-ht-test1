import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, MapPin, Phone, Clock, Star, Filter, Globe, Facebook, Instagram, ChefHat, Users, Calendar, Award, ChevronRight, Home, Utensils, Info, Camera, ExternalLink, Share2, ChevronDown, Grid, Heart, Eye, Share, ZoomIn, Download, Truck, Shield } from 'lucide-react';
import { useRouter } from 'next/router';
import { LANGUAGES, getText, updateDocumentLanguage } from '../lib/i18n';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from './Footer';
import Header from './Header';
import GiftCardPopup from './GiftCardPopup';

const NatureVillageWebsite = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('popular');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Enhanced Gallery State Variables
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryView, setGalleryView] = useState('grid'); // 'grid' or 'masonry'
  
  // Live Restaurant Status State with Real Data Integration
  const [restaurantStatus, setRestaurantStatus] = useState({
    isOpen: false,
    busyLevel: 'low',
    nextClosing: '',
    nextOpening: '',
    currentTime: new Date(),
    liveData: false, // Indicates if using real data
    lastUpdated: null
  });

  // Configuration for real data sources
  const DATA_SOURCES = {
    // Google Places API for real-time business hours and popular times
    googlePlaces: {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
      placeId: process.env.NEXT_PUBLIC_RESTAURANT_PLACE_ID, // Your restaurant's Google Place ID
      enabled: false // Will be enabled when API keys are provided
    },
    
    // Yelp Fusion API for business info and busy times
    yelp: {
      apiKey: process.env.NEXT_PUBLIC_YELP_API_KEY,
      businessId: process.env.NEXT_PUBLIC_YELP_BUSINESS_ID,
      enabled: false
    },
    
    // Custom restaurant POS/management system webhook
    posSystem: {
      webhookUrl: process.env.NEXT_PUBLIC_POS_WEBHOOK_URL,
      apiKey: process.env.NEXT_PUBLIC_POS_API_KEY,
      enabled: false
    },
    
    // Real-time analytics from website traffic
    analytics: {
      enabled: true // This we can implement with client-side data
    }
  };

  // Check which data sources are available
  useEffect(() => {
    // Enable data sources based on available environment variables
    if (DATA_SOURCES.googlePlaces.apiKey && DATA_SOURCES.googlePlaces.placeId) {
      DATA_SOURCES.googlePlaces.enabled = true;
    }
    if (DATA_SOURCES.yelp.apiKey && DATA_SOURCES.yelp.businessId) {
      DATA_SOURCES.yelp.enabled = true;
    }
    if (DATA_SOURCES.posSystem.webhookUrl && DATA_SOURCES.posSystem.apiKey) {
      DATA_SOURCES.posSystem.enabled = true;
    }
  }, []);

  // Fetch real data from Google Places API
  const fetchGooglePlacesData = useCallback(async () => {
    if (!DATA_SOURCES.googlePlaces.enabled) return null;
    
    try {
      const response = await fetch('/api/restaurant-status/google-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: DATA_SOURCES.googlePlaces.placeId,
          apiKey: DATA_SOURCES.googlePlaces.apiKey
        })
      });
      
      const data = await response.json();
      return {
        isOpen: data.opening_hours?.open_now || false,
        hours: data.opening_hours?.weekday_text || [],
        busyTimes: data.popular_times || null,
        source: 'google-places'
      };
    } catch (error) {
      console.error('Google Places API error:', error);
      return null;
    }
  }, []);

  // Fetch data from Yelp API
  const fetchYelpData = useCallback(async () => {
    if (!DATA_SOURCES.yelp.enabled) return null;
    
    try {
      const response = await fetch('/api/restaurant-status/yelp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: DATA_SOURCES.yelp.businessId,
          apiKey: DATA_SOURCES.yelp.apiKey
        })
      });
      
      const data = await response.json();
      return {
        isOpen: data.is_open_now || false,
        hours: data.hours || [],
        source: 'yelp'
      };
    } catch (error) {
      console.error('Yelp API error:', error);
      return null;
    }
  }, []);

  // Fetch data from POS system
  const fetchPOSData = useCallback(async () => {
    if (!DATA_SOURCES.posSystem.enabled) return null;
    
    try {
      const response = await fetch(DATA_SOURCES.posSystem.webhookUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DATA_SOURCES.posSystem.apiKey}`,
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      return {
        isOpen: data.status === 'open',
        currentOrders: data.current_orders || 0,
        avgWaitTime: data.avg_wait_time || 0,
        busyLevel: data.busy_level || 'low',
        source: 'pos-system'
      };
    } catch (error) {
      console.error('POS System API error:', error);
      return null;
    }
  }, []);

  // Calculate busy level from real website analytics
  const calculateAnalyticsBusyLevel = useCallback(() => {
    if (typeof window === 'undefined') return 'low';
    
    // Get current website traffic indicators
    const currentVisitors = sessionStorage.getItem('currentVisitors') || '1';
    const pageViews = sessionStorage.getItem('pageViews') || '1';
    const orderClicks = sessionStorage.getItem('orderClicks') || '0';
    
    const visitors = parseInt(currentVisitors);
    const views = parseInt(pageViews);
    const clicks = parseInt(orderClicks);
    
    // Simple algorithm based on website activity
    let busyLevel = 'low';
    if (visitors > 10 || views > 50 || clicks > 5) {
      busyLevel = 'very-high';
    } else if (visitors > 5 || views > 25 || clicks > 2) {
      busyLevel = 'high';
    } else if (visitors > 2 || views > 10 || clicks > 0) {
      busyLevel = 'medium';
    }
    
    return busyLevel;
  }, []);

  // Main function to fetch and combine real data
  const fetchRealRestaurantData = useCallback(async () => {
    console.log('Fetching real restaurant data...');
    
    try {
      // Attempt to fetch from all available sources
      const [googleData, yelpData, posData] = await Promise.allSettled([
        fetchGooglePlacesData(),
        fetchYelpData(),
        fetchPOSData()
      ]);

      // Get analytics data
      const analyticsBusyLevel = calculateAnalyticsBusyLevel();
      
      let finalStatus = {
        isOpen: false,
        busyLevel: analyticsBusyLevel,
        nextClosing: '',
        nextOpening: '',
        currentTime: new Date(),
        liveData: false,
        lastUpdated: new Date(),
        dataSources: []
      };

      // Prioritize POS system data (most accurate)
      if (posData.status === 'fulfilled' && posData.value) {
        const pos = posData.value;
        finalStatus = {
          ...finalStatus,
          isOpen: pos.isOpen,
          busyLevel: pos.busyLevel,
          liveData: true,
          dataSources: [...finalStatus.dataSources, 'pos-system']
        };
        console.log('Using POS system data');
      }
      
      // Fallback to Google Places data
      else if (googleData.status === 'fulfilled' && googleData.value) {
        const google = googleData.value;
        finalStatus = {
          ...finalStatus,
          isOpen: google.isOpen,
          liveData: true,
          dataSources: [...finalStatus.dataSources, 'google-places']
        };
        console.log('Using Google Places data');
      }
      
      // Fallback to Yelp data
      else if (yelpData.status === 'fulfilled' && yelpData.value) {
        const yelp = yelpData.value;
        finalStatus = {
          ...finalStatus,
          isOpen: yelp.isOpen,
          liveData: true,
          dataSources: [...finalStatus.dataSources, 'yelp']
        };
        console.log('Using Yelp data');
      }
      
      // If no real data available, fall back to time-based logic
      if (!finalStatus.liveData) {
        console.log('No real data available, using time-based fallback');
        finalStatus = await getFallbackStatus();
      }

      return finalStatus;
      
    } catch (error) {
      console.error('Error fetching real restaurant data:', error);
      return await getFallbackStatus();
    }
  }, [fetchGooglePlacesData, fetchYelpData, fetchPOSData, calculateAnalyticsBusyLevel]);

  // Fallback to time-based calculation when no real data is available
  const getFallbackStatus = useCallback(async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + (currentMinute / 60);
    
    // Restaurant hours: 12:00 PM to 10:00 PM (Sun-Thu), 12:00 PM to 11:00 PM (Fri-Sat)
    const openingTime = 12.0;
    const day = now.getDay();
    const isWeekend = day === 5 || day === 6; // Friday or Saturday
    const closingTime = isWeekend ? 23.0 : 22.0;
    const isCurrentlyOpen = currentTime >= openingTime && currentTime < closingTime;
    
    let nextClosing = '';
    let nextOpening = '';
    
    if (isCurrentlyOpen) {
      nextClosing = isWeekend ? '11:00 PM' : '10:00 PM';
    } else if (currentTime < openingTime) {
      nextOpening = '12:00 PM';
    } else {
      nextOpening = '12:00 PM Tomorrow';
    }

    // Simple busy level based on time
    let busyLevel = 'low';
    if (isCurrentlyOpen) {
      if ((currentTime >= 12.0 && currentTime <= 14.0) || 
          (currentTime >= 18.0 && currentTime <= 20.0)) {
        busyLevel = 'high';
      } else if ((currentTime >= 11.0 && currentTime < 12.0) ||
                 (currentTime >= 14.0 && currentTime < 18.0) ||
                 (currentTime >= 20.0 && currentTime < 22.0)) {
        busyLevel = 'medium';
      }
    }

    return {
      isOpen: isCurrentlyOpen,
      busyLevel,
      nextClosing,
      nextOpening,
      currentTime: now,
      liveData: false,
      lastUpdated: new Date(),
      dataSources: ['time-based-fallback']
    };
  }, []);

  // Real-time restaurant status updates
  useEffect(() => {
    const updateRestaurantStatus = async () => {
      const status = await fetchRealRestaurantData();
      setRestaurantStatus(status);
    };

    // Update immediately
    updateRestaurantStatus();
    
    // Update every 2 minutes when using real data, every 5 minutes for fallback
    const updateInterval = DATA_SOURCES.googlePlaces.enabled || 
                          DATA_SOURCES.yelp.enabled || 
                          DATA_SOURCES.posSystem.enabled ? 120000 : 300000;
    
    const interval = setInterval(updateRestaurantStatus, updateInterval);
    
    return () => clearInterval(interval);
  }, [fetchRealRestaurantData]);
  
  const router = useRouter();

  // Get real-time status icon based on current status
  const getStatusIcon = useCallback((isOpen, busyLevel) => {
    if (!isOpen) return '🔴'; // Closed
    
    switch (busyLevel) {
      case 'low': return '🟢'; // Green - Low activity
      case 'medium': return '🟡'; // Yellow - Medium activity  
      case 'high': return '🟠'; // Orange - High activity
      case 'very-high': return '🔴'; // Red - Very high activity
      default: return '🟢';
    }
  }, []);

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
      
      // Calculate next opening time
      let nextOpening = '';
      if (!isOpen) {
        if (hour < 12) {
          nextOpening = '12:00 PM';
        } else {
          nextOpening = '12:00 PM Tomorrow';
        }
      }
      
      setRestaurantStatus({
        isOpen,
        busyLevel,
        waitTime,
        nextClosing,
        nextOpening,
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown]);

  // Sync language with query param and handle document attributes safely
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const qpLang = typeof router.query.lang === 'string' ? router.query.lang : undefined;
      if (qpLang && LANGUAGES[qpLang]) {
        setLanguage(qpLang);
        updateDocumentLanguage(qpLang);
      } else {
        updateDocumentLanguage(language);
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }, [router.query.lang, language, isMounted]);

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

  // Enhanced Gallery Data Structure
  const galleryImages = useMemo(() => [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      alt: { en: 'Elegant Restaurant Interior', ku: 'ناوەوەی چێشتخانەی جوان', ar: 'داخل المطعم الأنيق', es: 'Elegante Interior del Restaurante', sq: 'Interiori Elegant i Restorantit', fr: 'Intérieur Élégant du Restaurant', de: 'Elegantes Restaurant-Interieur', bn: 'মার্জিত রেস্তোরাঁর অভ্যন্তর' },
      category: 'atmosphere',
      tags: ['interior', 'ambiance', 'dining'],
      likes: 127,
      featured: true,
      story: {
        en: 'Our warm and inviting dining space reflects Middle Eastern hospitality',
        ku: 'شوێنی خواردنی گەرم و بانگهێشتکارمان ڕەنگدانەوەی میوانداری ڕۆژهەڵاتی ناوەڕاست دەکات',
        es: 'Nuestro espacio de comedor cálido y acogedor refleja la hospitalidad del Medio Oriente',
        sq: 'Hapësira jonë e ngrohtë dhe tërheqëse e të ngrënit reflekton mikpritjen e Lindjes së Mesme',
        fr: 'Notre espace de restauration chaleureux et accueillant reflète l\'hospitalité du Moyen-Orient',
        de: 'Unser warmer und einladender Speisebereich spiegelt die Gastfreundschaft des Nahen Ostens wider'
      }
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
      alt: { en: 'Authentic Middle Eastern Kebab', ku: 'کەبابی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست', ar: 'كباب شرق أوسطي أصيل', es: 'Auténtico Kebab del Medio Oriente', sq: 'Kabab Autentik i Lindjes së Mesme', fr: 'Kebab Authentique du Moyen-Orient', de: 'Authentischer Nahöstlicher Kebab', bn: 'খাঁটি মধ্যপ্রাচ্যীয় কাবাব' },
      category: 'dishes',
      tags: ['kebab', 'grilled', 'signature'],
      likes: 245,
      featured: true,
      story: {
        en: 'Hand-crafted kebabs using traditional Middle Eastern spices and techniques',
        ku: 'کەبابی دەستکرد بە بەکارهێنانی بەهارات و تەکنیکی نەریتی ڕۆژهەڵاتی ناوەڕاست',
        es: 'Kebabs hechos a mano usando especias y técnicas tradicionales del Medio Oriente',
        sq: 'Kabab të bërë me dorë duke përdorur erëza dhe teknika tradicionale të Lindjes së Mesme',
        fr: 'Kebabs faits à la main utilisant des épices et techniques traditionnelles du Moyen-Orient',
        de: 'Handgefertigte Kebabs mit traditionellen nahöstlichen Gewürzen und Techniken'
      }
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      alt: { en: 'Fresh Hummus with Pita', ku: 'حومسی تازە لەگەڵ نانی پیتا', ar: 'حمص طازج مع الخبز', es: 'Hummus Fresco con Pita', sq: 'Humus i Freskët me Pita', fr: 'Houmous Frais avec Pita', de: 'Frischer Hummus mit Pita', bn: 'পিতার সাথে তাজা হুমুস' },
      category: 'dishes',
      tags: ['hummus', 'appetizer', 'vegetarian'],
      likes: 189,
      featured: false,
      story: {
        en: 'Creamy hummus made fresh daily with tahini and olive oil',
        ku: 'حومسی کرێمی کە ڕۆژانە بە تەحینە و زەیتی زەیتوون تازە دروست دەکرێت',
        sq: 'Humus kremoz i bërë i freskët çdo ditë me tahini dhe vaj ulliri',
        fr: 'Houmous crémeux fait frais quotidiennement avec tahini et huile d\'olive',
        de: 'Cremiger Hummus, täglich frisch zubereitet mit Tahini und Olivenöl'
      }
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      alt: { en: 'Traditional Middle Eastern Platter', ku: 'پلێتەری نەریتی ڕۆژهەڵاتی ناوەڕاست', ar: 'طبق شرق أوسطي تقليدي', es: 'Plato Tradicional del Medio Oriente', sq: 'Pjatë Tradicionale e Lindjes së Mesme', fr: 'Plat Traditionnel du Moyen-Orient', de: 'Traditionelle Nahöstliche Platte', bn: 'ঐতিহ্যবাহী মধ্যপ্রাচ্যীয় প্ল্যাটার' },
      category: 'dishes',
      tags: ['traditional', 'mixed', 'authentic'],
      likes: 156,
      featured: true,
      story: {
        en: 'A celebration of Middle Eastern culinary heritage in one beautiful platter',
        ku: 'ئاهەنگێک بۆ میراتی چێشتلێنانی ڕۆژهەڵاتی ناوەڕاست لە یەک پلێتەری جوان',
        es: 'Una celebración del patrimonio culinario del Medio Oriente en un hermoso plato',
        sq: 'Një festim i trashëgimisë kulinarë të Lindjes së Mesme në një pjatë të bukur',
        fr: 'Une célébration du patrimoine culinaire du Moyen-Orient dans un magnifique plat',
        de: 'Eine Feier des nahöstlichen kulinarischen Erbes auf einer wunderschönen Platte'
      }
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      alt: { en: 'Middle Eastern Vegetable Medley', ku: 'تێکەڵەی سەوزەی ڕۆژهەڵاتی ناوەڕاست', ar: 'خليط الخضار الشرق أوسطي', es: 'Mezcla de Vegetales del Medio Oriente', sq: 'Përzierje Perimesh të Lindjes së Mesme', fr: 'Mélange de Légumes du Moyen-Orient', de: 'Nahöstliche Gemüse-Medley', bn: 'মধ্যপ্রাচ্যীয় সবজির মিশ্রণ' },
      category: 'dishes',
      tags: ['vegetables', 'healthy', 'colorful'],
      likes: 134,
      featured: false,
      story: {
        en: 'Fresh seasonal vegetables prepared with Middle Eastern herbs and spices',
        ku: 'سەوزەی وەرزیی تازە کە بە گیا و بەهاراتی ڕۆژهەڵاتی ناوەڕاست ئامادە کراوە',
        es: 'Verduras frescas de temporada preparadas con hierbas y especias del Medio Oriente',
        sq: 'Perime të freskëta stinore të përgatitura me bimë dhe erëza të Lindjes së Mesme',
        fr: 'Légumes frais de saison préparés avec des herbes et épices du Moyen-Orient',
        de: 'Frisches Saisongemüse zubereitet mit nahöstlichen Kräutern und Gewürzen'
      }
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
      alt: { en: 'Traditional Baklava', ku: 'بەقڵاوای نەریتی', ar: 'بقلاوة تقليدية', es: 'Baklava Tradicional', sq: 'Bakllava Tradicionale', fr: 'Baklava Traditionnel', de: 'Traditionelles Baklava', bn: 'ঐতিহ্যবাহী বাকলাভা' },
      category: 'desserts',
      tags: ['baklava', 'sweet', 'pastry'],
      likes: 201,
      featured: true,
      story: {
        en: 'Delicate layers of phyllo pastry filled with nuts and sweetened with honey',
        ku: 'چینە چینە فیلۆی ناسک پڕکراو لە گوێز و بە هەنگوین شیرین کراوە',
        es: 'Delicadas capas de masa filo rellenas de nueces y endulzadas con miel',
        sq: 'Shtresa delikate brumi fillo të mbushura me arra dhe të ëmbëlsuara me mjaltë',
        fr: 'Délicates couches de pâte phyllo remplies de noix et sucrées au miel',
        de: 'Zarte Schichten von Phyllo-Teig gefüllt mit Nüssen und mit Honig gesüßt'
      }
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
      alt: { en: 'Middle Eastern Dolma', ku: 'دۆڵمەی ڕۆژهەڵاتی ناوەڕاست', ar: 'دولمة شرق أوسطية', es: 'Dolma del Medio Oriente', sq: 'Dollma e Lindjes së Mesme', fr: 'Dolma du Moyen-Orient', de: 'Nahöstliche Dolma', bn: 'মধ্যপ্রাচ্যীয় দলমা' },
      category: 'dishes',
      tags: ['dolma', 'stuffed', 'traditional'],
      likes: 178,
      featured: false,
      story: {
        en: 'Grape leaves stuffed with rice, herbs, and spices - a family recipe',
        ku: 'گەڵای مێو پڕکراو لە برنج و گیا و بەهارات - ڕێسەتێکی خێزانی',
        es: 'Hojas de parra rellenas de arroz, hierbas y especias - una receta familiar',
        sq: 'Gjethe rrushi të mbushura me oriz, bimë dhe erëza - një recetë familjare',
        fr: 'Feuilles de vigne farcies au riz, herbes et épices - une recette familiale',
        de: 'Weinblätter gefüllt mit Reis, Kräutern und Gewürzen - ein Familienrezept'
      }
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
      alt: { en: 'Hearty Middle Eastern Soup', ku: 'شۆربەی بەهێزی ڕۆژهەڵاتی ناوەڕاست', ar: 'حساء شرق أوسطي مغذي', es: 'Sopa Sustanciosa del Medio Oriente', sq: 'Supë Ushqyese e Lindjes së Mesme', fr: 'Soupe Nourrissante du Moyen-Orient', de: 'Herzhafte Nahöstliche Suppe', bn: 'হৃদ্যগ্রাহী মধ্যপ্রাচ্যীয় স্যুপ' },
      category: 'dishes',
      tags: ['soup', 'comfort', 'warm'],
      likes: 143,
      featured: false,
      story: {
        en: 'Warming soup made with traditional Middle Eastern ingredients and love',
        ku: 'شۆربەی گەرمکەرەوە کە بە پێکهاتەی نەریتی ڕۆژهەڵاتی ناوەڕاست و خۆشەویستی دروست کراوە',
        es: 'Sopa reconfortante hecha con ingredientes tradicionales del Medio Oriente y amor',
        sq: 'Supë ngrohtëse e bërë me përbërës tradicionalë të Lindjes së Mesme dhe dashuri',
        fr: 'Soupe réchauffante faite avec des ingrédients traditionnels du Moyen-Orient et de l\'amour',
        de: 'Wärmende Suppe zubereitet mit traditionellen nahöstlichen Zutaten und Liebe'
      }
    }
  ], []);

  // Gallery Categories
  const galleryCategories = useMemo(() => ({
    all: { en: 'All Photos', ku: 'هەموو وێنەکان', ar: 'جميع الصور', es: 'Todas las Fotos', sq: 'Të Gjitha Fotografitë', fr: 'Toutes les Photos', de: 'Alle Fotos', bn: 'সকল ছবি', icon: Grid },
    dishes: { en: 'Signature Dishes', ku: 'خۆراکی تایبەت', ar: 'الأطباق المميزة', es: 'Platos Especiales', sq: 'Pjata Speciale', fr: 'Plats Signature', de: 'Signature-Gerichte', bn: 'বিশেষ খাবার', icon: ChefHat },
    atmosphere: { en: 'Restaurant Atmosphere', ku: 'کەشوهەوای چێشتخانە', ar: 'أجواء المطعم', es: 'Ambiente del Restaurante', sq: 'Atmosfera e Restorantit', fr: 'Atmosphère du Restaurant', de: 'Restaurant-Atmosphäre', bn: 'রেস্তোরাঁর পরিবেশ', icon: Home },
    desserts: { en: 'Sweet Treats', ku: 'شیرینی', ar: 'الحلويات', es: 'Dulces Delicias', sq: 'Ëmbëlsira të Shijshme', fr: 'Douceurs Sucrées', de: 'Süße Leckereien', bn: 'মিষ্টি খাবার', icon: Heart }
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
          title: `${getText(image.alt, language)} - Nature Village Restaurant`,
          text: getText(image.story, language),
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
  }, [language]);

  // Enhanced menu data with complete multilingual support
  const menuItems = [
    {
      id: 1502,
      name: {
        en: 'Quzi',
        ar: 'قوزي',
        fa: 'قوزی',
        ku: 'قووزی',
        tr: 'Quzi',
        ur: 'قوزی',
        kmr: 'Quzi',
        es: 'Quzi',
        sq: 'Quzi',
        fr: 'Quzi',
        de: 'Quzi',
        bn: 'কুজি',
        ko: '쿠지',
        bs: 'Quzi',
        zh: '库兹',
        ro: 'Quzi',
        uk: 'Кузі',
        vi: 'Quzi'
      },
      description: {
        en: 'A traditional Iraqi dish made with saffron rice and lamb shank, topped with special tomato sauce, and garnished with toasted almonds and fresh parsley, offers a unique culinary experience.',
        ar: 'طبق عراقي تقليدي مصنوع من أرز الزعفران وساق الخروف، مغطى بصلصة الطماطم الخاصة، ومزين باللوز المحمص والبقدونس الطازج، يقدم تجربة طهي فريدة.',
        fa: 'غذای سنتی عراقی تهیه شده با برنج زعفرانی و ساق بره، با سس مخصوص گوجه‌فرنگی پوشانده شده و با بادام برشته و جعفری تازه تزئین شده، تجربه‌ای منحصر به فرد آشپزی ارائه می‌دهد.',
        ku: 'خواردنێکی نەریتی عێراقی کە لە برنجی زەعفەران و قاچی بەرخ دروست کراوە، بە سۆسی تایبەتی تەماتە دانراوە و بە بادەمی برژاو و جەعدەی تازە ڕازاوەتەوە، ئەزموونێکی یەکجار جیاوازی چێشتلێنان پێشکەش دەکات.',
        tr: 'Safran pilavı ve kuzu kemiği ile yapılan geleneksel Irak yemeği, özel domates sosu ile kaplanmış ve kavrulmuş badem ve taze maydanoz ile süslenmiş, benzersiz bir mutfak deneyimi sunar.',
        ur: 'زعفرانی چاول اور بھیڑ کی ہڈی سے بنا روایتی عراقی کھانا، خاص ٹماٹر کی چٹنی سے ڈھکا ہوا، اور بھنے ہوئے بادام اور تازہ دھنیا سے سجایا گیا، ایک منفرد کھانے کا تجربہ پیش کرتا ہے۔',
        kmr: 'Xwarineke kevneşopî ya Iraqî ku bi brincê zefranî û hestiyê berx hatiye çêkirin, bi soşa taybet a firangoşan hatiye daxuyandin û bi bademên kavurî û rêhanên taze hatiye xemilandin, ezmûnek mutfaka bêhempa pêşkêş dike.',
        es: 'Un plato tradicional iraquí hecho con arroz de azafrán y jarrete de cordero, cubierto con salsa especial de tomate y adornado con almendras tostadas y perejil fresco, ofrece una experiencia culinaria única.',
        sq: 'Një pjatë tradicionale irakiane e bërë me oriz safrani dhe copë dele, e mbuluar me salcë speciale domatesh dhe e zbukuruar me bajame të pjekura dhe majdanoz të freskët, ofron një përvojë kulinare unike.',
        fr: 'Un plat irakien traditionnel fait avec du riz au safran et du jarret d\'agneau, garni de sauce tomate spéciale et décoré d\'amandes grillées et de persil frais, offre une expérience culinaire unique.',
        de: 'Ein traditionelles irakisches Gericht aus Safranreis und Lammhaxe, mit spezieller Tomatensauce überzogen und mit gerösteten Mandeln und frischer Petersilie garniert, bietet ein einzigartiges kulinarisches Erlebnis.',
        bn: 'জাফরানি চাল এবং ভেড়ার মাংস দিয়ে তৈরি একটি ঐতিহ্যবাহী ইরাকি খাবার, বিশেষ টমেটো সস দিয়ে পরিবেশিত এবং ভাজা বাদাম ও তাজা পার্সলে দিয়ে সাজানো, একটি অনন্য রান্নার অভিজ্ঞতা প্রদান করে।',
        ko: '사프란 쌀과 양 정강이로 만든 전통 이라크 요리로, 특별한 토마토 소스로 덮고 구운 아몬드와 신선한 파슬리로 장식하여 독특한 요리 경험을 제공합니다.',
        bs: 'Tradicionalno iračko jelo napravljeno sa šafranskim rižom i jagnještinom, prekriveno posebnim sosem od paradajza i ukrašeno pečenim bademima i svježim peršinom, pruža jedinstveno kulinarske iskustvo.',
        zh: '传统伊拉克菜肴，采用藏红花米饭和羊腿制作，淋上特制番茄酱，配以烤杏仁和新鲜欧芹装饰，提供独特的烹饪体验。',
        ro: 'Un fel tradițional irakian făcut cu orez cu șofran și pulpă de miel, acoperit cu sos special de roșii și garnisit cu migdale prăjite și pătrunjel proaspăt, oferă o experiență culinară unică.',
        uk: 'Традиційна іракська страва з шафранового рису та яглячої гомілки, політа спеціальним томатним соусом та прикрашена смаженим мигдалем і свіжою петрушкою, пропонує унікальний кулінарний досвід.',
        vi: 'Món ăn truyền thống Iraq làm từ cơm nghệ tây và chân cừu, phủ sốt cà chua đặc biệt và trang trí với hạnh nhân rang và rau mùi tây tươi, mang đến trải nghiệm ẩm thực độc đáo.'
      },
      price: '$26.99',
      category: 'specialty',
      popular: true,
      image: '/Quzi.jpg',
      tags: []
    },
    {
      id: 1707,
      name: {
        en: 'Grilled Branzino Platter',
        ar: 'طبق برانزينو مشوي',
        fa: 'بشقاب برانزینو کبابی',
        ku: 'پلێتەری برانزینۆی گرێلکراو',
        tr: 'Izgara Branzino Tabağı',
        ur: 'گرل شدہ برانزینو پلیٹر',
        kmr: 'Plata Branzino ya Grîlkirî',
        es: 'Plato de Branzino a la Parrilla',
        sq: 'Pjatë Branzino të Pjekur në Skarë',
        fr: 'Plateau de Branzino Grillé',
        de: 'Gegrillter Branzino-Teller',
        bn: 'গ্রিলড ব্রানজিনো প্ল্যাটার',
        ko: '구운 브란지노 플래터',
        bs: 'Pljeskavica Grilled Branzino',
        zh: '烤布兰齐诺拼盘',
        ro: 'Platou de Branzino la Grătar',
        uk: 'Плато гриль-бранзіно',
        vi: 'Đĩa cá Branzino nướng'
      },
      description: {
        en: 'Grilled European sea bass fillets, served with sumac-marinated onions, fresh salad, grilled tomato, grilled lemon, and creamy mashed potatoes, is a delightful choice.',
        ar: 'شرائح الباس البحري الأوروبي المشوية، تُقدم مع بصل متبل بالسماق، وسلطة طازجة، وطماطم مشوية، وليمون مشوي، وبطاطس مهروسة كريمية، خيار رائع.',
        fa: 'فیله‌های کبابی باس دریایی اروپایی، با پیاز مارینه شده با سماق، سالاد تازه، گوجه‌فرنگی کبابی، لیمو کبابی و سیب‌زمینی له‌شده خامه‌ای سرو می‌شود، انتخابی لذیذ است.',
        ku: 'فیلێی باسی دەریایی ئەوروپی گرێلکراو، لەگەڵ پیازی مارینەکراو بە سوماق، سالادی تازە، تەماتەی گرێلکراو، لیمۆی گرێلکراو و پەتاتەی کوتراوی کرێمی، هەڵبژاردەیەکی خۆش.',
        tr: 'Izgara Avrupa deniz levreği filetoları, sumak marine edilmiş soğan, taze salata, ızgara domates, ızgara limon ve kremalı patates püresi ile servis edilir, harika bir seçim.',
        ur: 'گرل شدہ یورپی سی باس فلیٹس، سماق میں میرینیٹ شدہ پیاز، تازہ سلاد، گرل شدہ ٹماٹر، گرل شدہ لیموں اور کریمی میشڈ آلو کے ساتھ پیش کیا جاتا ہے، ایک لذیذ انتخاب ہے۔',
        kmr: 'Filetoên masîyê deryayê Ewropî yên grîlkirî, bi pîvazên ku bi sumaq hatine marînekirin, salata taze, firangoşa grîlkirî, lîmoya grîlkirî û patateya kirêmî ya hişkirî tê peşkêşkirin, hilbijarineke dilxweş e.',
        es: 'Filetes de lubina europea a la parrilla, servidos con cebollas marinadas en sumac, ensalada fresca, tomate a la parrilla, limón a la parrilla y puré de papas cremoso, es una opción deliciosa.',
        sq: 'Feta levrek evropian të pjekur në skarë, të shërbyer me qepë të marinuara me sumak, sallatë të freskët, domate të pjekura në skarë, limon të pjekur në skarë dhe pure patate me krem, është një zgjedhje e këndshme.',
        fr: 'Filets de bar européen grillés, servis avec des oignons marinés au sumac, salade fraîche, tomate grillée, citron grillé et purée de pommes de terre crémeuse, c\'est un choix délicieux.',
        de: 'Gegrillte europäische Seebarschfilets, serviert mit Sumach-marinierten Zwiebeln, frischem Salat, gegrillten Tomaten, gegrillter Zitrone und cremigem Kartoffelpüree, ist eine köstliche Wahl.',
        bn: 'গ্রিলড ইউরোপীয় সি বাস ফিলেট, সুমাক-মারিনেটেড পেঁয়াজ, তাজা সালাদ, গ্রিলড টমেটো, গ্রিলড লেবু এবং ক্রিমি ম্যাশড আলু দিয়ে পরিবেশিত, এটি একটি আনন্দদায়ক পছন্দ।',
        ko: '구운 유럽산 바다농어 필레를 수막에 절인 양파, 신선한 샐러드, 구운 토마토, 구운 레몬, 크리미한 으깬 감자와 함께 제공하는 맛있는 선택입니다.',
        bs: 'Grilled evropski branzino fileti, posluženi sa lukom mariniranim u sumaku, svježom salatom, grilled paradajzom, grilled limunom i kremastim pireom od krompira, predstavljaju divnu opciju.',
        zh: '烤制欧洲鲈鱼片，配以漆树腌制洋葱、新鲜沙拉、烤番茄、烤柠檬和奶油土豆泥，是美妙的选择。',
        ro: 'File de branzino european la grătar, servite cu ceapă marinată în sumac, salată proaspătă, roșii la grătar, lămâie la grătar și piure de cartofi cremos, reprezintă o alegere delicioasă.',
        uk: 'Філе європейського морського окуня-гриль, подається з цибулею, маринованою в сумаку, свіжим салатом, грильованими помідорами, грільованим лимоном та вершковим картопляним пюре - це чудовий вибір.',
        vi: 'Phi lê cá chẻm châu Âu nướng, phục vụ cùng hành tây ướp sumac, salad tươi, cà chua nướng, chanh nướng và khoai tây nghiền kem, là một lựa chọn tuyệt vời.'
      },
      price: '$37.99',
      category: 'specialty',
      popular: true,
      image: '/Grilled Branzino Platter.jpg',
      tags: []
    },
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
        es: 'Shish Kabab de Erbil',
        sq: 'Shish Kabab Erbil',
        fr: 'Shish Kebab d\'Erbil',
        de: 'Erbil Shish Kebab',
        bn: 'এরবিল শিশ কাবাব',
        ko: '에르빌 시시 카밥',
        bs: 'Erbil Shish Kabab',
        zh: '埃尔比勒烤肉串',
        ro: 'Erbil Shish Kabab',
        uk: 'Ербіль шиш-кебаб',
        vi: 'Erbil Shish Kabab'
      },
      description: {
        en: 'A kabab made with a mix of lamb and beef, grilled to perfection. It is served with saffron rice, seasonal salad, sumac onions, and grilled vegetables.',
        ar: 'كباب مصنوع من خليط من لحم الخروف ولحم البقر، مشوي إلى الكمال. يُقدم مع أرز الزعفران وسلطة موسمية وبصل السماق والخضروات المشوية.',
        fa: 'کبابی از ترکیب گوشت بره و گاو، تا کمال کباب شده. با برنج زعفرانی، سالاد فصلی، پیاز سماق و سبزیجات کبابی سرو می‌شود.',
        ku: 'کەبابێک لە تێکەڵی گۆشتی بەرخ و گا، بە تەواوی گرێلکراوە. لەگەڵ برنجی زەعفەران، سالادی وەرزی، پیازی سوماق و سەوزەی گرێلکراو خراوەتە سەر.',
        tr: 'Kuzu ve dana eti karışımından yapılan, mükemmelliğe kadar ızgara edilmiş kebap. Safran pirinci, mevsim salatası, sumak soğanı ve ızgara sebzelerle servis edilir.',
        ur: 'بھیڑ اور گائے کے گوشت کے مکسچر سے بنا کباب، کمال تک گرل کیا گیا۔ زعفرانی چاول، موسمی سلاد، سماق پیاز اور گرل شدہ سبزیوں کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kebabek ku ji tevahiya goştê berx û ga hatiye çêkirin, heta bi temamî hatiye grîlkirin. Bi brincê zefranî, salata werzeya, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin.',
        es: 'Un kabab hecho con una mezcla de cordero y res, asado a la perfección. Se sirve con arroz de azafrán, ensalada de temporada, cebollas de sumac y verduras asadas.',
        sq: 'Një kabab i bërë me një përzierje dele dhe viçi, i pjekur në përsosuri. Shërbehet me oriz safrani, sallatë stinore, qepë sumaku dhe perime të pjekura në skarë.',
        fr: 'Un kebab fait avec un mélange d\'agneau et de bœuf, grillé à la perfection. Servi avec du riz au safran, salade de saison, oignons au sumac et légumes grillés.',
        de: 'Ein Kebab aus einer Mischung von Lamm und Rind, perfekt gegrillt. Serviert mit Safranreis, Salat der Saison, Sumach-Zwiebeln und gegrilltem Gemüse.',
        bn: 'ভেড়া এবং গরুর মাংসের মিশ্রণ দিয়ে তৈরি একটি কাবাব, নিখুঁতভাবে গ্রিল করা। জাফরানি চাল, মৌসুমি সালাদ, সুমাক পেঁয়াজ এবং গ্রিলড সবজি দিয়ে পরিবেশিত।',
        ko: '양고기와 소고기를 섞어 만든 카밥으로, 완벽하게 구워집니다. 사프란 쌀, 신선한 샐러드, 수막 양파, 구운 토마토와 함께 제공됩니다.',
        bs: 'Ćevapi od miješane janjetine i govedine, savršeno grillovan. Služi se sa šafranskim rižom, sezonskom salatom, sumak lukom i grillovanim povrćem.',
        zh: '由羊肉和牛肉混合制成的烤肉串，烤制完美。配以藏红花米饭、时令沙拉、漆树洋葱和烤蔬菜。',
        ro: 'Un kebab făcut din amestec de miel și vită, grătar la perfecție. Se servește cu orez cu șofran, salată de sezon, ceapă cu sumac și legume la grătar.',
        uk: 'Кебаб з суміші ягнятини та яловичини, ідеально приготований на грилі. Подається з шафрановим рисом, сезонним салатом, цибулею з сумаком та грільованими овочами.',
        vi: 'Kebab làm từ hỗn hợp thịt cừu và thịt bò, nướng hoàn hảo. Phục vụ với cơm nghệ tây, salad theo mùa, hành tây sumac và rau củ nướng.'
      },
      price: '$23.99',
      category: 'grill',
      popular: true,
      image: '/Ekabab.jpg',
      tags: []
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
        subtitle: 'A Taste of Middle East in Every Bite',
        description: 'Experience authentic Middle Eastern flavors in a warm, traditional setting where every dish tells a story of our rich cultural heritage and culinary traditions passed down through generations.',
        cta1: 'View Menu',
        cta2: 'Make Reservation'
      },
      menu: {
        title: 'Our Menu',
        subtitle: 'Powered by Blunari - Intelligent OS for Enhanced Dining Experience',
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

        badge: 'Our Story',
        subtitle: 'Bringing authentic Middle Eastern flavors and warm hospitality to our community',
        content: 'Nature Village was born from a dream to share the authentic flavors and warm hospitality of the Middle East with the world. Our family recipes have been passed down through generations, each dish crafted with love and respect for our cultural traditions. We source the finest ingredients and prepare every meal with the same care and attention that has defined Middle Eastern hospitality for centuries.',
        story1: 'Nature Village is dedicated to bringing you the authentic flavors of Middle Eastern cuisine in a warm and welcoming atmosphere where every guest feels like family.',
        story2: 'Our chefs are passionate about preparing traditional Middle Eastern dishes using the finest ingredients and time-honored cooking techniques that celebrate our rich culinary heritage.',
        quote: 'Every dish is crafted with care and served with the warmth of Middle Eastern hospitality.',
        experience: 'Years Experience',
        recipes: 'Traditional Recipes',
        customers: 'Happy Customers',
        awards: 'Awards Won',
        features: {
          chefs: {
            title: 'Expert Chefs',
            description: 'Authentic Middle Eastern cuisine'
          },
          ingredients: {
            title: 'Fresh Ingredients',
            description: 'Quality sourced daily'
          },
          service: {
            title: 'Warm Service',
            description: 'Middle Eastern hospitality'
          }
        },
        stats: {
          happyCustomers: 'Happy Customers',
          authenticDishes: 'Authentic Dishes',
          customerRating: 'Customer Rating',
          freshIngredients: 'Fresh Ingredients'
        }

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

      ui: {
        callNow: 'Call Now',
        call: 'Call',
        orderOnline: 'Order Online',
        restaurant: 'Restaurant',
        familyOwned: 'Family Owned',
        halalCertified: 'Halal Certified',
        googleReviews: 'Google Reviews',
        averageRating: 'Average Rating',
        fiveStarReviews: '5-Star Reviews',
        verifiedPurchase: 'Verified Purchase',
        trustedReviewer: 'Trusted Reviewer',
        foodEnthusiast: 'Food Enthusiast',
        menu: 'Menu',
        reserve: 'Reserve',
        weAreOpen: 'We\'re Open',
        currentlyClosed: 'Currently Closed',
        live: 'LIVE',
        until: 'Until',
        opens: 'Opens',
        activity: 'Activity'
      },
      reviews: {
        title: 'What Our Guests Say',
        subtitle: 'Rated 4.8/5 stars by 572+ happy customers on Google Reviews',
        cta: 'Join 572+ satisfied customers who love our authentic cuisine! Book your table today and taste the difference that authentic Middle Eastern hospitality makes.',
        ctaButton: 'Book Your Table Now',
        ctaTitle: 'Ready to Create Your Own 5-Star Experience?',
        trustIndicators: {
          googleRating: '4.8★ Google Rating',
          totalReviews: '572+ Reviews'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"I\'ve been coming here for about a year, and it\'s hands down my favorite restaurant! The food is authentic and absolutely delicious—every dish is full of flavor, the specialty teas and coffees are amazing, and the desserts are the perfect ending to any meal."',
          location: 'Verified Google Review',
          time: '1 week ago'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"We had a wonderful time at Nature Village Restaurant tonight! Everything was absolutely perfect! The food, atmosphere, decor and service is all top notch. This is definitely our new favorite spot for authentic Middle Eastern cuisine."',
          location: 'Local Guide • 29 reviews',
          time: '2 months ago'
        },
        review3: {
          name: 'Google Customer',
          text: '"I ordered the Quzi, a rice and lamb dish, it was very filling and delicious. The pizza was of a good size filled with gyro meat, cheese and a nice sauce. The authentic Middle Eastern flavors really impressed me and my family!"',
          location: 'Verified Google Review',
          time: 'Recent'
        },
        badges: {
          featured: 'FEATURED',
          localGuide: 'LOCAL GUIDE',
          quziLover: 'QUZI LOVER'
        }
      },


      featured: {
        title: 'Featured Dishes',
        subtitle: 'Discover our most beloved Middle Eastern specialties, crafted with traditional recipes and modern presentation'
      },
      celebration: {
        title: 'Celebrate Your Special Moments',
        subtitle: 'Make your birthdays, anniversaries, and special occasions unforgettable with authentic Middle Eastern hospitality',

        familyReunions: 'Family Reunions',
        graduations: 'Graduations',
        engagements: 'Engagements', 
        holidays: 'Holidays',
        birthday: {
          title: 'Birthday Celebrations',
          tagline: 'Sweet moments made special',
          feature1: 'Complimentary birthday dessert',
          feature2: 'Happy birthday song & wishes',
          feature3: 'Memorable dining experience',
          special: 'Perfect for celebrating another year of life'
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
          subtitle: 'Let us make your special day extraordinary with authentic Middle Eastern hospitality and unforgettable flavors',
          reserve: 'Call for special reservation',
          bookingAdvice: 'Book 48 hours in advance for the best celebration experience'
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

        reservations: 'جێگە حیجزکردن',

        catering: 'کاتەرینگ',
        orderOnline: 'داواکاری'
      },
      hero: {
        title: 'گوندی سروشت',
        subtitle: 'تامی ڕۆژهەڵاتی ناوەڕاست لە هەر پارووەکدا',
        description: 'تامی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست بچێژن لە ژینگەیەکی گەرم و نەریتیدا کە هەر خۆراکێک چیرۆکی دەوڵەمەندی کولتووری میراتمان و نەریتە چێشتلێنانەکانمان دەگێڕێتەوە کە لە نەوەوە بۆ نەوە دەردەچن.',
        cta1: 'بینینی خۆراک',
        cta2: 'جێگە حیجزکردن'

      },
      menu: {
        title: 'خۆراکەکانمان',
        subtitle: 'بە Blunari هێزدراو - سیستەمی زیرەک بۆ ئەزموونێکی باشتری خواردن',
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

        badge: 'چیرۆکەکەمان',
        subtitle: 'تامە ڕەسەنەکان و پێشوازی گەرمی ڕۆژهەڵاتی ناوەڕاست بۆ کۆمەڵگاکەمان دەهێنین',
        content: 'گوندی سروشت لە خەونێکەوە لەدایک بووە بۆ هاوبەشکردنی تامە ڕەسەنەکان و پێشوازی گەرمی ڕۆژهەڵاتی ناوەڕاست لەگەڵ جیهان. ڕێسەتە خێزانییەکانمان لە نەوەوە بۆ نەوە دەردەچن، هەر خۆراکێک بە خۆشەویستی و ڕێزگرتن لە نەریتە کولتوورییەکانمان دروست دەکرێت.',
        story1: 'گوندی سروشت بەرپرسە لە هێنانی تامە ڕەسەنەکانی چێشتی ڕۆژهەڵاتی ناوەڕاست لە کەشێکی گەرم و بەخێرهاتووەوە کە هەر میوانێک وەک خێزان هەست دەکات.',
        story2: 'چێشتلێنەرەکانمان دڵسۆزن لە ئامادەکردنی خۆراکە نەریتییەکانی ڕۆژهەڵاتی ناوەڕاست بە بەکارهێنانی باشترین پێکهاتەکان و تەکنیکە کۆنەکانی چێشتلێنان کە میراتی دەوڵەمەندی چێشتلێنانمان ئاهەنگ دەگێڕن.',
        quote: 'هەر خۆراکێک بە خەمخۆریەوە دروست دەکرێت و بە گەرمی پێشوازی کوردی پێشکەش دەکرێت.',
        experience: 'ساڵ ئەزموون',
        recipes: 'ڕێسەتی نەریتی',
        customers: 'کڕیاری دڵخۆش',
        awards: 'خەڵاتی بەدەستهێنراو',
        features: {
          chefs: {
            title: 'چێشتلێنەری پیشەیی',
            description: 'چێشتی ڕەسەنی کوردی'
          },
          ingredients: {
            title: 'پێکهاتە تازەکان',
            description: 'کوالیتی ڕۆژانە'
          },
          service: {
            title: 'خزمەتی گەرم',
            description: 'میوانداری کوردی'
          }
        },
        stats: {
          happyCustomers: 'کڕیاری دڵخۆش',
          authenticDishes: 'خۆراکی ڕەسەن',
          customerRating: 'هەڵسەنگاندنی کڕیار',
          freshIngredients: 'پێکهاتە تازەکان'
        }
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

        makeReservation: 'جێگە حیجزکردن',
        getDirections: 'ڕێنمایی وەربگرە'
      },

      ui: {
        callNow: 'ئێستا پەیوەندی بکە',
        call: 'پەیوەندی',
        orderOnline: 'داواکاری ئۆنلاین',
        restaurant: 'چێشتخانە',
        familyOwned: 'خاوەن خێزانی',
        halalCertified: 'بەڵگەنامەی حەلاڵ',
        googleReviews: 'پێداچوونەوەی گووگڵ',
        averageRating: 'ناوەندی هەڵسەنگاندن',
        fiveStarReviews: 'پێداچوونەوەی ٥ ئەستێرە',
        verifiedPurchase: 'کڕینی دڵنیاکراو',
        trustedReviewer: 'پێداچوونەوەی متمانەپێکراو',
        foodEnthusiast: 'حەزلێکەری خۆراک',
        menu: 'خۆراک',
        reserve: 'حیجزکردن',
        weAreOpen: 'کراوەین',
        currentlyClosed: 'ئێستا داخراوین',
        live: 'زیندوو',
        until: 'تا',
        opens: 'دەکرێتەوە'
      },
      reviews: {
        title: 'میوانەکانمان چی دەڵێن',
        subtitle: 'هەڵسەنگێنراوە ٤.٨/٥ ئەستێرە لەلایەن ٥٧٢+ کڕیاری دڵخۆشەوە لە پێداچوونەوەی گووگڵ',
        cta: 'بەشداری ٥٧٢+ کڕیاری ڕازی بکە کە حەزیان لە چێشتە ڕەسەنەکانمانە! ئەمڕۆ مێزەکەت حیجز بکە و جیاوازی میوانداری کوردی تام بکە.',
        ctaButton: 'ئێستا مێزەکەت حیجز بکە',
        ctaTitle: 'ئامادەیت ئەزموونی ٥ ئەستێرەی خۆت دروست بکەیت؟',
        trustIndicators: {
          googleRating: '٤.٨★ هەڵسەنگاندنی گووگڵ',
          totalReviews: '٥٧٢+ پێداچوونەوە'
        },
        review1: {
          name: 'کارین کاردیناس',
          text: '"نزیکەی ساڵێکە دێمە ئێرە، و بەبێ گومان چێشتخانەی دڵخوازمە! خۆراکەکان ڕەسەن و زۆر خۆشن—هەر خۆراکێک پڕە لە تام، چا و قاوە تایبەتەکان سەرسوڕهێنەرن، و شیرینییەکان کۆتایی تەواوی هەر ژەمێک دەخەنە سەر."',
          location: 'پێداچوونەوەی دڵنیاکراوی گووگڵ',
          time: '١ هەفتە لەمەوبەر'
        },
        review2: {
          name: 'ڕووس کۆڕنیا',
          text: '"ئەمشەو کاتێکی نایابمان لە چێشتخانەی گوندی سروشت بەسەربرد! هەموو شتێک تەواو تەواو بوو! خۆراک، کەش، ڕازاندنەوە و خزمەتگوزاری هەموویان لە ئاستی بەرزدان. ئەمە بەدڵنیاییەوە شوێنی نوێی دڵخوازمانە بۆ چێشتی ڕەسەنی ڕۆژهەڵاتی ناوەڕاست."',
          location: 'ڕێبەری ناوخۆیی • ٢٩ پێداچوونەوە',
          time: '٢ مانگ لەمەوبەر'
        },
        review3: {
          name: 'کڕیاری گووگڵ',
          text: '"کووزی داواکرد، خۆراکی برنج و گۆشتی بەرخ، زۆر تێر و خۆشبوو. پیتزاکە قەبارەیەکی باشی هەبوو پڕ لە گۆشتی گایرۆ، پەنیر و سۆسێکی خۆش. تامە ڕەسەنەکانی ڕۆژهەڵاتی ناوەڕاست من و خێزانەکەمی زۆر سەرسام کرد!"',
          location: 'پێداچوونەوەی دڵنیاکراوی گووگڵ',
          time: 'نوێ'
        },
        badges: {
          featured: 'نمایشکراو',
          localGuide: 'ڕێبەری ناوخۆیی',
          quziLover: 'حەزلێکەری کووزی'
        }
      },


      featured: {
        title: 'خۆراکی نمایشکراو',
        subtitle: 'خۆراکە خۆشەویستەکانی کوردی بناسە کە بە ڕێسەتی نەریتی و پێشکەشکردنی نوێ دروست کراون'
      },
      celebration: {
        title: 'ئاهەنگەکانتان لێرە بگێڕن',
        subtitle: 'ڕۆژە تایبەتەکانتان وەک ڕۆژی لەدایکبوون و ساڵیادەکان لەگەڵ میوانداری کوردی نەویست بکەن',

        familyReunions: 'کۆبوونەوەی خێزانی',
        birthday: {
          title: 'ئاهەنگی ڕۆژی لەدایکبوون',
          tagline: 'ساتە شیرینەکان تایبەت دەکەین',
          feature1: 'دەسەرت بەخۆڕایی بۆ ڕۆژی لەدایکبوون',
          feature2: 'گۆرانی ڕۆژی لەدایکبوون و داواکاری',
          feature3: 'ئەزموونی نانخواردنی یادماوی',
          special: 'باشترین بۆ ئاهەنگگێڕان بۆ ساڵێکی تر لە ژیان'
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

          reserve: 'پەیوەندی بکەن بۆ حیجزی تایبەت'

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
        subtitle: 'طعم الشرق الأوسط في كل قضمة',
        description: 'اختبر النكهات الشرق أوسطية الأصيلة في جو دافئ وتقليدي حيث يحكي كل طبق قصة من تراثنا الثقافي الغني وتقاليدنا الطهوية التي تنتقل عبر الأجيال.',
        cta1: 'عرض القائمة',
        cta2: 'حجز طاولة'
      },
      menu: {
        title: 'قائمتنا',
        subtitle: 'مدعوم بـ Blunari - نظام ذكي لتجربة طعام محسّنة',
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

        badge: 'قصتنا',
        subtitle: 'نجلب النكهات الشرق أوسطية الأصيلة والضيافة الدافئة إلى مجتمعنا',
        content: 'ولدت قرية الطبيعة من حلم مشاركة النكهات الأصيلة والضيافة الدافئة للشرق الأوسط مع العالم. وصفات عائلتنا تتوارث عبر الأجيال، كل طبق يُحضر بحب واحترام لتقاليدنا الثقافية.',
        story1: 'قرية الطبيعة مكرسة لتقديم النكهات الأصيلة للمطبخ الشرق أوسطي في جو دافئ ومرحب حيث يشعر كل ضيف وكأنه في بيته.',
        story2: 'طهاتنا شغوفون بإعداد الأطباق الشرق أوسطية التقليدية باستخدام أجود المكونات وتقنيات الطبخ العريقة التي تحتفي بتراثنا الطهوي الغني.',
        quote: 'كل طبق يُحضر بعناية ويُقدم بدفء الضيافة الشرق أوسطية.',
        experience: 'سنوات خبرة',
        recipes: 'وصفات تقليدية',
        customers: 'عملاء سعداء',
        awards: 'جوائز حاصلة عليها',
        features: {
          chefs: {
            title: 'طهاة خبراء',
            description: 'المطبخ الكردي الأصيل'
          },
          ingredients: {
            title: 'مكونات طازجة',
            description: 'جودة يومية مضمونة'
          },
          service: {
            title: 'خدمة دافئة',
            description: 'الضيافة الكردية'
          }
        },
        stats: {
          happyCustomers: 'عملاء سعداء',
          authenticDishes: 'أطباق أصيلة',
          customerRating: 'تقييم العملاء',
          freshIngredients: 'مكونات طازجة'
        }
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

      ui: {
        callNow: 'اتصل الآن',
        call: 'اتصل',
        orderOnline: 'اطلب أونلاين',
        restaurant: 'مطعم',
        familyOwned: 'مملوك عائلياً',
        halalCertified: 'معتمد حلال',
        googleReviews: 'مراجعات جوجل',
        averageRating: 'متوسط التقييم',
        fiveStarReviews: 'مراجعات ٥ نجوم',
        verifiedPurchase: 'شراء موثق',
        trustedReviewer: 'مراجع موثوق',
        foodEnthusiast: 'عاشق الطعام',
        menu: 'القائمة',
        reserve: 'احجز',
        weAreOpen: 'نحن مفتوحون',
        currentlyClosed: 'مغلق حالياً',
        live: 'مباشر',
        until: 'حتى',
        opens: 'يفتح'
      },
      reviews: {
        title: 'ماذا يقول ضيوفنا',
        subtitle: 'تم تقييمنا ٤.٨/٥ نجوم من قبل ٥٧٢+ عميل سعيد على مراجعات جوجل',
        cta: 'انضم إلى ٥٧٢+ عميل راضٍ يحبون مطبخنا الأصيل! احجز طاولتك اليوم وتذوق الفرق الذي تصنعه الضيافة الكردية الأصيلة.',
        ctaButton: 'احجز طاولتك الآن',
        ctaTitle: 'مستعد لخلق تجربة ٥ نجوم خاصة بك؟',
        trustIndicators: {
          googleRating: '٤.٨★ تقييم جوجل',
          totalReviews: '٥٧٢+ مراجعة'
        },
        review1: {
          name: 'كارين كاردناس',
          text: '"أتيت إلى هنا لحوالي عام، وهو بلا شك مطعمي المفضل! الطعام أصيل ولذيذ تماماً—كل طبق مليء بالنكهة، الشاي والقهوة المتخصصة مذهلة، والحلويات هي النهاية المثالية لأي وجبة."',
          location: 'مراجعة جوجل موثقة',
          time: 'منذ أسبوع واحد'
        },
        review2: {
          name: 'روث كورنيا',
          text: '"قضينا وقتاً رائعاً في مطعم قرية الطبيعة الليلة! كل شيء كان مثالياً تماماً! الطعام والأجواء والديكور والخدمة كلها من الدرجة الأولى. هذا بالتأكيد مكاننا المفضل الجديد للمأكولات الشرق أوسطية الأصيلة."',
          location: 'دليل محلي • ٢٩ مراجعة',
          time: 'منذ شهرين'
        },
        review3: {
          name: 'عميل جوجل',
          text: '"طلبت الكوزي، طبق الأرز واللحم، كان مشبعاً ولذيذاً جداً. البيتزا كانت بحجم جيد مليئة بلحم الجيرو والجبن وصلصة لذيذة. النكهات الشرق أوسطية الأصيلة أعجبتني وأعجبت عائلتي حقاً!"',
          location: 'مراجعة جوجل موثقة',
          time: 'حديث'
        },
        badges: {
          featured: 'مميز',
          localGuide: 'دليل محلي',
          quziLover: 'عاشق الكوزي'
        }
      },


      featured: {
        title: 'الأطباق المميزة',
        subtitle: 'اكتشف أحب الأطباق الكردية لدينا، المحضرة بوصفات تقليدية وعرض عصري'
      },
      celebration: {
        title: 'احتفل بلحظاتك الخاصة',
        subtitle: 'اجعل أعياد ميلادك وذكرياتك السنوية والمناسبات الخاصة لا تُنسى مع الضيافة الكردية الأصيلة',

        familyReunions: 'لقاءات العائلة',
        birthday: {
          title: 'احتفالات أعياد الميلاد',
          tagline: 'لحظات حلوة نجعلها مميزة',
          feature1: 'حلوى مجانية لعيد الميلاد',
          feature2: 'أغنية عيد ميلاد سعيد وتهاني',
          feature3: 'تجربة طعام لا تُنسى',
          special: 'مثالي للاحتفال بسنة أخرى من الحياة'
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
        subtitle: 'طعم خاورمیانه در هر لقمه',
        description: 'طعم‌های اصیل خاورمیانه را در محیطی گرم و سنتی تجربه کنید که هر غذا داستانی از میراث فرهنگی غنی و سنت‌های آشپزی ما می‌گوید.',
        cta1: 'مشاهده منو',
        cta2: 'رزرو میز'
      },
      menu: {
        title: 'منوی ما',
        subtitle: 'قدرت گرفته از Blunari - سیستم هوشمند برای تجربه غذایی بهبود یافته',
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

        badge: 'داستان ما',
        subtitle: 'طعم‌های اصیل خاورمیانه و مهمان‌نوازی گرم را به جامعه‌مان می‌آوریم',
        content: 'دهکده طبیعت از رویای به اشتراک گذاشتن طعم‌های اصیل و مهمان‌نوازی گرم خاورمیانه با جهان متولد شد.',
        story1: 'دهکده طبیعت متعهد به ارائه طعم‌های اصیل غذاهای خاورمیانه در فضایی گرم و دوستانه است که هر مهمان احساس خانوادگی بودن کند.',
        story2: 'آشپزهای ما علاقه‌مند به تهیه غذاهای سنتی خاورمیانه با استفاده از بهترین مواد اولیه و تکنیک‌های کهن آشپزی هستند که میراث غنی آشپزی ما را جشن می‌گیرد.',
        quote: 'هر غذا با دقت تهیه و با گرمای مهمان‌نوازی خاورمیانه سرو می‌شود.',
        experience: 'سال تجربه',
        recipes: 'دستور پخت سنتی',
        customers: 'مشتری راضی',
        awards: 'جایزه کسب شده',
        features: {
          chefs: {
            title: 'آشپزهای متخصص',
            description: 'غذاهای اصیل کردی'
          },
          ingredients: {
            title: 'مواد اولیه تازه',
            description: 'کیفیت روزانه تضمین شده'
          },
          service: {
            title: 'خدمات گرم',
            description: 'مهمان‌نوازی کردی'
          }
        },
        stats: {
          happyCustomers: 'مشتری راضی',
          authenticDishes: 'غذاهای اصیل',
          customerRating: 'امتیاز مشتریان',
          freshIngredients: 'مواد اولیه تازه'
        }
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

      ui: {
        callNow: 'همین حالا تماس بگیرید',
        orderOnline: 'سفارش آنلاین',
        restaurant: 'رستوران',
        familyOwned: 'خانوادگی',
        halalCertified: 'گواهی حلال',
        googleReviews: 'نظرات گوگل',
        averageRating: 'میانگین امتیاز',
        fiveStarReviews: 'نظرات ۵ ستاره',
        verifiedPurchase: 'خرید تأیید شده',
        trustedReviewer: 'نظردهنده موثق',
        foodEnthusiast: 'علاقه‌مند به غذا'
      },
      reviews: {
        title: 'مهمانان ما چه می‌گویند',
        subtitle: 'امتیاز ٤.٨/٥ ستاره توسط ٥٧٢+ مشتری خوشحال در نظرات گوگل',
        cta: 'به ٥٧٢+ مشتری راضی که عاشق غذاهای اصیل ما هستند بپیوندید! امروز میز خود را رزرو کنید و تفاوتی که مهمان‌نوازی اصیل کردی ایجاد می‌کند را بچشید.',
        ctaButton: 'همین حالا میز خود را رزرو کنید',
        ctaTitle: 'آماده ایجاد تجربه ٥ ستاره خود هستید؟',
        trustIndicators: {
          googleRating: '٤.٨★ امتیاز گوگل',
          totalReviews: '٥٧٢+ نظر'
        }
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

      currency: '$',
      celebration: {
        title: 'لحظات خاص خود را جشن بگیرید',
        subtitle: 'تولدها، سالگردها و مناسبات خاص خود را با مهمان‌نوازی کردی فراموش‌نشدنی کنید',
        familyReunions: 'گردهمایی خانوادگی',
        birthday: {
          title: 'جشن تولد',
          tagline: 'لحظات شیرین را خاص کنید',
          feature1: 'دسر رایگان تولد',
          feature2: 'آهنگ تولد و آرزوهای خوب',
          feature3: 'تجربه غذاخوری به‌یادماندنی',
          special: 'عالی برای جشن سال دیگری از زندگی'
        },
        anniversary: {
          title: 'شام سالگرد',
          tagline: 'داستان عشق خود را جشن بگیرید',
          feature1: 'چیدمان میز رمانتیک با گل رز',
          feature2: 'دسر رایگان برای دو نفر',
          feature3: 'تجربه غذاخوری در نور شمع',
          feature4: 'کارت سالگرد شخصی‌سازی شده',
          special: '۲۵+ سال با هم؟ سورپرایز ویژه در انتظار شماست!'
        },
        cta: {
          title: 'آماده برای جشن؟',
          subtitle: 'بگذارید روز خاص شما را با مهمان‌نوازی اصیل کردی و طعم‌های فراموش‌نشدنی فوق‌العاده کنیم',
          reserve: 'برای رزرو ویژه تماس بگیرید'
        }
      },
      ui: {
        menu: 'منو',
        reserve: 'رزرو',
        callNow: 'اکنون تماس بگیرید',
        call: 'تماس',
        weAreOpen: 'ما باز هستیم',
        currentlyClosed: 'در حال حاضر بسته',
        live: 'زنده',
        until: 'تا',
        opens: 'باز می‌شود'
      }
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
        subtitle: 'Her Lokmada Orta Doğu Tadı',
        description: 'Otantik Orta Doğu lezzetlerini sıcak, geleneksel bir ortamda deneyimleyin.',
        cta1: 'Menüyü Görüntüle',
        cta2: 'Rezervasyon Yap'
      },
      menu: {
        title: 'Menümüz',
        subtitle: 'Blunari tarafından desteklenir - Gelişmiş Yemek Deneyimi için Akıllı OS',
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

        badge: 'Hikayemiz',
        subtitle: 'Otantik Orta Doğu lezzetlerini ve sıcak misafirperverliği topluluğumuza getiriyoruz',
        content: 'Nature Village, Orta Doğu\'nun otantik lezzetlerini ve sıcak misafirperverliğini dünyayla paylaşma hayalinden doğdu.',
        story1: 'Nature Village, her misafirin kendini aile gibi hissettiği sıcak ve samimi bir atmosferde otantik Orta Doğu mutfağının lezzetlerini sunmaya kendini adamıştır.',
        story2: 'Aşçılarımız, zengin mutfak mirasımızı kutlayan en kaliteli malzemeler ve geleneksel pişirme teknikleri kullanarak geleneksel Orta Doğu yemekleri hazırlamaya tutkuyla bağlıdır.',
        quote: 'Her yemek özenle hazırlanır ve Orta Doğu misafirperverliğinin sıcaklığıyla sunulur.',
        experience: 'Yıl Deneyim',
        recipes: 'Geleneksel Tarif',
        customers: 'Mutlu Müşteri',
        awards: 'Kazanılan Ödül',
        features: {
          chefs: {
            title: 'Uzman Şefler',
            description: 'Otantik Kürt mutfağı'
          },
          ingredients: {
            title: 'Taze Malzemeler',
            description: 'Günlük kalite garantisi'
          },
          service: {
            title: 'Sıcak Hizmet',
            description: 'Kürt misafirperverliği'
          }
        },
        stats: {
          happyCustomers: 'Mutlu Müşteri',
          authenticDishes: 'Otantik Yemekler',
          customerRating: 'Müşteri Puanı',
          freshIngredients: 'Taze Malzemeler'
        }

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

        description: 'Kürdistan\'ın otantik lezzetlerini ve sıcak misafirperverliğini masanıza getiriyoruz. Her yemek, zengin kültürel mirasımızın ve mutfak mükemmelliğimizin bir kutlamasıdır.',

        

        quickLinks: 'Hızlı Bağlantılar',
        contactInfo: 'İletişim Bilgileri',
        followUs: 'Bizi Takip Edin',
        openDaily: 'PAZAR - PERŞEMBE: 12:00 - 22:00\nCUMA - CUMARTESİ: 12:00 - 23:00',
        kitchenNote: '* Mutfak kapanış saatinden 30 dakika önce kapanır',
        poweredBy: 'Destekleyen',
        blunari: 'Blunari',

        copyright: `© ${new Date().getFullYear()} Nature Village Kürt Restoranı. Tüm hakları saklıdır.`,
        privacy: 'Gizlilik Politikası',
        terms: 'Hizmet Şartları'
      },

      ui: {
        callNow: 'Şimdi Ara',
        orderOnline: 'Online Sipariş',
        restaurant: 'Restoran',
        familyOwned: 'Aile İşletmesi',
        halalCertified: 'Helal Sertifikalı',
        googleReviews: 'Google Yorumları',
        averageRating: 'Ortalama Puan',
        fiveStarReviews: '5 Yıldız Yorumlar',
        verifiedPurchase: 'Doğrulanmış Satın Alma',
        trustedReviewer: 'Güvenilir Yorumcu',
        foodEnthusiast: 'Yemek Tutkunu'
      },
      reviews: {
        title: 'Misafirlerimiz Ne Diyor',
        subtitle: 'Google Yorumlarında 572+ mutlu müşteri tarafından 4.8/5 yıldız puanlandı',
        cta: 'Otantik mutfağımızı seven 572+ memnun müşteriye katılın! Bugün masanızı ayırtın ve otantik Kürt misafirperverliğinin yarattığı farkı tadın.',
        ctaButton: 'Şimdi Masanızı Ayırtın',
        ctaTitle: 'Kendi 5 Yıldızlı Deneyiminizi Yaratmaya Hazır mısınız?',
        trustIndicators: {
          googleRating: '4.8★ Google Puanı',
          totalReviews: '572+ Yorum'
        }
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

      currency: '$',
      celebration: {
        title: 'Özel Anlarınızı Kutlayın',
        subtitle: 'Doğum günlerinizi, yıldönümlerinizi ve özel günlerinizi otantik Kürt misafirperverliği ile unutulmaz kılın',
        familyReunions: 'Aile Birleşmeleri',
        birthday: {
          title: 'Doğum Günü Kutlamaları',
          tagline: 'Tatlı anları özel kılın',
          feature1: 'Ücretsiz doğum günü tatlısı',
          feature2: 'Doğum günü şarkısı ve dilekler',
          feature3: 'Unutulmaz yemek deneyimi',
          special: 'Yaşamın bir yılını daha kutlamak için mükemmel'
        },
        anniversary: {
          title: 'Yıldönümü Yemekleri',
          tagline: 'Aşk hikayenizi kutlayın',
          feature1: 'Güller ile romantik masa düzeni',
          feature2: 'İki kişi için ücretsiz tatlı',
          feature3: 'Mum ışığında yemek deneyimi',
          feature4: 'Kişiselleştirilmiş yıldönümü kartı',
          special: '25+ yıl birlikte mi? Özel sürpriz sizi bekliyor!'
        },
        cta: {
          title: 'Kutlamaya Hazır mısınız?',
          subtitle: 'Özel gününüzü otantik Kürt misafirperverliği ve unutulmaz lezzetlerle olağanüstü kılalım',
          reserve: 'Özel rezervasyon için arayın'
        }
      },
      currency: '$',
      ui: {
        menu: 'Menü',
        reserve: 'Rezervasyon',
        callNow: 'Şimdi Ara',
        call: 'Ara',
        weAreOpen: 'Açığız',
        currentlyClosed: 'Şu anda Kapalı',
        live: 'Canlı',
        until: 'kadar',
        opens: 'Açılır'
      }

    },
    es: {
      nav: {
        home: 'Inicio',
        menu: 'Menú',
        about: 'Nosotros',
        gallery: 'Galería',
        visit: 'Visítanos',
        reservations: 'Reservas',
        catering: 'Catering',
        orderOnline: 'Pedido'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'Un Sabor del Medio Oriente en Cada Bocado',
        description: 'Experimenta los auténticos sabores del Medio Oriente en un ambiente cálido y tradicional donde cada plato cuenta la historia de nuestro rico patrimonio cultural y tradiciones culinarias transmitidas a través de generaciones.',
        cta1: 'Ver Menú',
        cta2: 'Hacer Reserva'
      },
      menu: {
        title: 'Nuestro Menú',
        subtitle: 'Impulsado por Blunari - OS Inteligente para Experiencia Gastronómica Mejorada',
        filters: {
          all: 'Todos los Platos',
          traditional: 'Tradicional',
          vegetarian: 'Vegetariano',
          vegan: 'Vegano',
          soup: 'Sopas',
          dessert: 'Postres',
          popular: 'Más Popular'
        },
        viewFull: 'Ver Menú Completo',
        noItems: 'No se encontraron artículos en esta categoría.'
      },
      about: {
        title: 'Nuestra Historia',
        badge: 'Nuestra Historia',
        subtitle: 'Trayendo sabores auténticos del Medio Oriente y cálida hospitalidad a nuestra comunidad',
        content: 'Nature Village nació de un sueño de compartir los sabores auténticos y la cálida hospitalidad del Medio Oriente con el mundo. Nuestras recetas familiares han sido transmitidas a través de generaciones, cada plato elaborado con amor y respeto por nuestras tradiciones culturales. Obtenemos los mejores ingredientes y preparamos cada comida con el mismo cuidado y atención que ha definido la hospitalidad del Medio Oriente durante siglos.',
        story1: 'Nature Village está dedicado a traerte los sabores auténticos de la cocina del Medio Oriente en un ambiente cálido y acogedor donde cada huésped se siente como familia.',
        story2: 'Nuestros chefs son apasionados de preparar platos tradicionales del Medio Oriente usando los mejores ingredientes y técnicas de cocina consagradas que celebran nuestro rico patrimonio culinario.',
        quote: 'Cada plato está elaborado con cuidado y servido con la calidez de la hospitalidad del Medio Oriente.',
        experience: 'Años de Experiencia',
        recipes: 'Recetas Tradicionales',
        customers: 'Clientes Satisfechos',
        awards: 'Premios Ganados',
        features: {
          chefs: {
            title: 'Chefs Expertos',
            description: 'Auténtica cocina del Medio Oriente'
          },
          ingredients: {
            title: 'Ingredientes Frescos',
            description: 'Calidad obtenida diariamente'
          },
          service: {
            title: 'Servicio Cálido',
            description: 'Hospitalidad del Medio Oriente'
          }
        },
        stats: {
          happyCustomers: 'Clientes Satisfechos',
          authenticDishes: 'Platos Auténticos',
          customerRating: 'Calificación de Cliente',
          freshIngredients: 'Ingredientes Frescos'
        }
      },
      gallery: {
        title: 'Galería',
        subtitle: 'Un viaje visual a través de nuestro patrimonio culinario y ambiente del restaurante'
      },
      visit: {
        title: 'Visítanos',
        subtitle: 'Encuéntranos en el corazón de la ciudad',
        hours: 'Horarios de Apertura',
        contact: 'Información de Contacto',
        address: 'Dirección',
        phone: 'Teléfono',
        makeReservation: 'Hacer Reserva',
        getDirections: 'Obtener Direcciones'
      },
      featured: {
        title: 'Platos Destacados',
        subtitle: 'Descubre nuestras especialidades del Medio Oriente más queridas, elaboradas con recetas tradicionales y presentación moderna'
      },
      celebration: {
        title: 'Celebra Tus Momentos Especiales',
        subtitle: 'Haz que tus cumpleaños, aniversarios y ocasiones especiales sean inolvidables con la auténtica hospitalidad del Medio Oriente',
        familyReunions: 'Reuniones Familiares',
        graduations: 'Graduaciones',
        engagements: 'Compromisos',
        holidays: 'Días Festivos',
        birthday: {
          title: 'Celebraciones de Cumpleaños',
          tagline: 'Momentos dulces hechos especiales',
          feature1: 'Postre de cumpleaños cortesía',
          feature2: 'Canción de cumpleaños y deseos',
          feature3: 'Experiencia gastronómica memorable',
          special: 'Perfecto para celebrar otro año de vida'
        },
        anniversary: {
          title: 'Cenas de Aniversario',
          tagline: 'Celebra tu historia de amor',
          feature1: 'Mesa romántica decorada con rosas',
          feature2: 'Postre cortesía para dos',
          feature3: 'Experiencia gastronómica a la luz de las velas',
          feature4: 'Tarjeta de aniversario personalizada',
          special: '¿25+ años juntos? ¡Una sorpresa especial te espera!'
        },
        cta: {
          title: '¿Listo para Celebrar?',
          subtitle: 'Permítenos hacer tu día especial extraordinario con auténtica hospitalidad del Medio Oriente y sabores inolvidables',
          reserve: 'Llama para reserva especial',
          bookingAdvice: 'Reserva con 48 horas de anticipación para la mejor experiencia de celebración'
        }
      },
      footer: {
        openDaily: 'DOM - JUE: 12:00 PM - 10:00 PM\nVIE - SÁB: 12:00 PM - 11:00 PM',
        poweredBy: 'Desarrollado por',
        blunari: 'Blunari',
        copyright: `© ${new Date().getFullYear()} Restaurante Nature Village. Todos los derechos reservados.`,
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio'
      },
      ui: {
        callNow: 'Llamar Ahora',
        call: 'Llamar',
        orderOnline: 'Pedido en Línea',
        restaurant: 'Restaurante',
        familyOwned: 'Propiedad Familiar',
        halalCertified: 'Certificado Halal',
        googleReviews: 'Reseñas de Google',
        averageRating: 'Calificación Promedio',
        fiveStarReviews: 'Reseñas de 5 Estrellas',
        verifiedPurchase: 'Compra Verificada',
        trustedReviewer: 'Reseñador Confiable',
        foodEnthusiast: 'Entusiasta de la Comida',
        menu: 'Menú',
        reserve: 'Reservar',
        weAreOpen: 'Estamos Abiertos',
        currentlyClosed: 'Actualmente Cerrado',
        live: 'EN VIVO',
        until: 'hasta',
        opens: 'Abre',
        activity: 'Actividad'
      },
      reviews: {
        title: 'Lo Que Dicen Nuestros Huéspedes',
        subtitle: 'Calificado 4.8/5 estrellas por 572+ clientes satisfechos en Google Reviews',
        cta: '¡Únete a 572+ clientes satisfechos que aman nuestra cocina auténtica! Reserva tu mesa hoy y prueba la diferencia que hace la auténtica hospitalidad del Medio Oriente.',
        ctaButton: 'Reserva Tu Mesa Ahora',
        ctaTitle: '¿Listo para Crear Tu Propia Experiencia de 5 Estrellas?',
        trustIndicators: {
          googleRating: '4.8★ Calificación Google',
          totalReviews: '572+ Reseñas'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"He estado viniendo aquí durante aproximadamente un año, ¡y sin duda es mi restaurante favorito! La comida es auténtica y absolutamente deliciosa: cada plato está lleno de sabor, los tés y cafés especiales son increíbles, y los postres son el final perfecto para cualquier comida."',
          location: 'Reseña Verificada de Google',
          time: 'hace 1 semana',
          badge: 'DESTACADO'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"¡Tuvimos un tiempo maravilloso en Nature Village Restaurant esta noche! ¡Todo estuvo absolutamente perfecto! La comida, el ambiente, la decoración y el servicio son de primera calidad. Este es definitivamente nuestro nuevo lugar favorito para cocina auténtica del Medio Oriente."',
          location: 'Guía Local • 29 reseñas',
          time: 'hace 2 meses',
          badge: 'Reseñador Confiable'
        },
        review3: {
          name: 'Cliente de Google',
          text: '"Pedí el Quzi, un plato de arroz y cordero, era muy abundante y delicioso. La pizza era de buen tamaño llena de carne de gyro, queso y una salsa deliciosa. ¡Los sabores auténticos del Medio Oriente realmente me impresionaron a mí y a mi familia!"',
          location: 'Reseña Verificada de Google',
          time: 'Reciente',
          badge: 'AMANTE DEL QUZI'
        },
        badges: {
          featured: 'DESTACADO',
          localGuide: 'GUÍA LOCAL',
          quziLover: 'AMANTE DEL QUZI'
        }
      }
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
        subtitle: 'ہر لقمے میں مشرق وسطیٰ کا ذائقہ',
        description: 'روایتی ماحول میں اصل مشرق وسطیٰ کھانوں کا تجربہ کریں۔',
        cta1: 'مینو دیکھیں',
        cta2: 'بکنگ کریں'
      },
      menu: {
        title: 'ہمارا مینو',
        subtitle: 'Blunari کی طاقت سے - بہتر کھانے کے تجربے کے لیے ذہین OS',
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

        badge: 'ہماری کہانی',
        subtitle: 'اصل مشرق وسطیٰ کے ذائقے اور گرم مہمان نوازی ہماری کمیونٹی میں لا رہے ہیں',
        content: 'نیچر ولیج مشرق وسطیٰ کے اصل ذائقوں کو دنیا کے ساتھ بانٹنے کے خواب سے پیدا ہوا۔',
        story1: 'نیچر ولیج مشرق وسطیٰ کے کھانوں کے اصل ذائقے گرم اور خوش آمدید ماحول میں فراہم کرنے کے لیے وقف ہے جہاں ہر مہمان خاندان کی طرح محسوس کرتا ہے۔',
        story2: 'ہمارے شیف بہترین اجزاء اور روایتی پکانے کی تکنیکوں کا استعمال کرتے ہوئے روایتی مشرق وسطیٰ کے پکوان تیار کرنے میں پرجوش ہیں جو ہماری بھرپور پاک ورثے کا جشن مناتے ہیں۔',
        quote: 'ہر پکوان احتیاط سے تیار کیا جاتا ہے اور مشرق وسطیٰ کی مہمان نوازی کی گرمجوشی کے ساتھ پیش کیا جاتا ہے۔',
        experience: 'سال تجربہ',
        recipes: 'روایتی ترکیبیں',
        customers: 'خوش گاہک',
        awards: 'حاصل شدہ انعامات',
        features: {
          chefs: {
            title: 'ماہر شیف',
            description: 'اصل کردی کھانے'
          },
          ingredients: {
            title: 'تازہ اجزاء',
            description: 'روزانہ معیار کی ضمانت'
          },
          service: {
            title: 'گرم خدمات',
            description: 'کردی مہمان نوازی'
          }
        },
        stats: {
          happyCustomers: 'خوش گاہک',
          authenticDishes: 'اصل پکوان',
          customerRating: 'گاہکوں کی درجہ بندی',
          freshIngredients: 'تازہ اجزاء'
        }

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

        description: 'کردستان کے اصل ذائقے اور گرم مہمان نوازی آپ کی میز تک لا رہے ہیں۔ ہر کھانا ہماری بھرپور ثقافتی ورثے اور پاک فن کی بہترین مثال ہے۔',

        quickLinks: 'فوری لنکس',
        contactInfo: 'رابطے کی معلومات',
        followUs: 'ہمیں فالو کریں',
        openDaily: 'اتوار - جمعرات: ۱۲:۰۰ دوپہر - ۱۰:۰۰ رات\nجمعہ - ہفتہ: ۱۲:۰۰ دوپہر - ۱۱:۰۰ رات',
        poweredBy: 'طاقت فراہم کنندہ',

        blunari: 'بلوناری',

        copyright: `© ${new Date().getFullYear()} نیچر ولیج کرد ریسٹوران۔ تمام حقوق محفوظ ہیں۔`,
        privacy: 'پرائیویسی پالیسی',
        terms: 'سروس کی شرائط'
      },

      ui: {
        callNow: 'ابھی کال کریں',
        orderOnline: 'آن لائن آرڈر',
        restaurant: 'ریسٹوران',
        familyOwned: 'خاندانی ملکیت',
        halalCertified: 'حلال سرٹیفائیڈ',
        googleReviews: 'گوگل ریویوز',
        averageRating: 'اوسط درجہ بندی',
        fiveStarReviews: '۵ ستارہ ریویوز',
        verifiedPurchase: 'تصدیق شدہ خریداری',
        trustedReviewer: 'قابل اعتماد جائزہ کار',
        foodEnthusiast: 'کھانے کا شوقین'
      },
      reviews: {
        title: 'ہمارے مہمان کیا کہتے ہیں',
        subtitle: 'گوگل ریویوز پر ٥٧٢+ خوش گاہکوں کی جانب سے ٤.٨/٥ ستاروں کی درجہ بندی',
        cta: '٥٧٢+ مطمئن گاہکوں میں شامل ہوں جو ہمارے اصل کھانوں سے محبت کرتے ہیں! آج اپنی میز بک کریں اور اصل کردی مہمان نوازی کا فرق چکھیں۔',
        ctaButton: 'ابھی اپنی میز بک کریں',
        ctaTitle: 'اپنا ٥ ستارہ تجربہ بنانے کے لیے تیار ہیں؟',
        trustIndicators: {
          googleRating: '٤.٨★ گوگل ریٹنگ',
          totalReviews: '٥٧٢+ ریویوز'
        }
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

      currency: '$',
      celebration: {
        title: 'اپنے خاص لمحات منائیں',
        subtitle: 'اپنے سالگرہ، برسی اور خاص مواقع کو اصل کردی مہمان نوازی کے ساتھ یادگار بنائیں',
        familyReunions: 'خاندانی اجتماع',
        birthday: {
          title: 'سالگرہ کی تقریبات',
          tagline: 'میٹھے لمحات کو خاص بنائیں',
          feature1: 'مفت سالگرہ کا میٹھا',
          feature2: 'سالگرہ کا گانا اور نیک خواہشات',
          feature3: 'یادگار کھانے کا تجربہ',
          special: 'زندگی کے ایک اور سال کے جشن کے لیے بہترین'
        },
        anniversary: {
          title: 'برسی کا کھانا',
          tagline: 'اپنی محبت کی کہانی منائیں',
          feature1: 'گلاب کے ساتھ رومانٹک میز کا انتظام',
          feature2: 'دو افراد کے لیے مفت میٹھا',
          feature3: 'موم بتی کی روشنی میں کھانے کا تجربہ',
          feature4: 'ذاتی برسی کا کارڈ',
          special: '۲۵+ سال ساتھ؟ خاص سرپرائز آپ کا انتظار کر رہا ہے!'
        },
        cta: {
          title: 'جشن کے لیے تیار؟',
          subtitle: 'آئیے آپ کے خاص دن کو اصل کردی مہمان نوازی اور یادگار ذائقوں کے ساتھ غیر معمولی بنائیں',
          reserve: 'خاص بکنگ کے لیے کال کریں'
        }
      },
      currency: '$',
      ui: {
        menu: 'مینو',
        reserve: 'بکنگ',
        callNow: 'اب کال کریں',
        call: 'کال',
        weAreOpen: 'ہم کھلے ہیں',
        currentlyClosed: 'فی الوقت بند',
        live: 'زندہ',
        until: 'تک',
        opens: 'کھلتا ہے'
      }
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
        subtitle: 'Di Her Qurçikê de Tama Rojhilatê Navîn',
        description: 'Tamên resen ên Rojhilatê Navîn di hawîrdorekî germ û kevneşopî de biceribînin.',
        cta1: 'Menûyê Bibînin',
        cta2: 'Rezervasyon Bikin'
      },
      menu: {
        title: 'Menûya Me',
        subtitle: 'Bi Blunari ve têk tê - Sîstema Zîrek ji bo Ezmûna Xwarinê ya Baştirkirî',
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

        badge: 'Çîroka Me',
        subtitle: 'Tamên resen ên Kurdî û mêvandariya germ bo civata me tînin',
        content: 'Gundê Xwezayê ji xewna parvekirina tamên resen û mêvandariya germ a Rojhilata Navîn bi cîhanê re hate dayîn.',
        story1: 'Gundê Xwezayê ji bo pêşkêşkirina tamên resen ên xwarinên Kurdî di hawîrdorekî germ û bi xêrhatin de ku her mêvan wek malbat hîs bike, xwe terxan kiriye.',
        story2: 'Aşpêjên me bi dilsozî xwarinên kevneşopî yên Kurdî bi karanîna çêtirîn pêkhate û teknîkên kevneşopî yên çêkirina xwarinê amade dikin ku mîrata dewlemend a çêşt lênanê pîroz dikin.',
        quote: 'Her xwarinê bi baldarî tê amade kirin û bi germiya mêvandariya Kurdî tê pêşkêş kirin.',
        experience: 'Sal Ezmûn',
        recipes: 'Rêsetên Kevneşopî',
        customers: 'Xerîdarên Kêfxweş',
        awards: 'Xelatan Bi Dest Xistin',
        features: {
          chefs: {
            title: 'Aşpêjên Pispor',
            description: 'Xwarinên resen ên Kurdî'
          },
          ingredients: {
            title: 'Pêkhateyen Taze',
            description: 'Kalîteya rojane garantî'
          },
          service: {
            title: 'Karûbarê Germ',
            description: 'Mêvandariya Kurdî'
          }
        },
        stats: {
          happyCustomers: 'Xerîdarên Kêfxweş',
          authenticDishes: 'Xwarinên Resen',
          customerRating: 'Nirxandina Xerîdaran',
          freshIngredients: 'Pêkhateyen Taze'
        }

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

        description: 'Tamên resen û mêvandariya germ a Rojhilata Navîn tînin ser maseyê we. Her xwarinê pîrozbahiya çanda me ya dewlemend û başiya çêştlênanê ye.',

        

        quickLinks: 'Lînkên Bilez',
        contactInfo: 'Agahiyên Têkiliyê',
        followUs: 'Şopa Me Bikin',
        openDaily: 'YEKŞEM - PÊNCŞEM: 12:00 - 22:00\nÎN - ŞEMÎ: 12:00 - 23:00',
        poweredBy: 'Ji aliyê ve tê piştgirîkirin',

        blunari: 'Blunari',

        copyright: `© ${new Date().getFullYear()} Gundê Xwezayê Xwarinxaneya Kurdî. Hemû maf parastî ne.`,
        privacy: 'Polîtikaya Nihêniyê',
        terms: 'Mercên Karûbarê'
      },

      ui: {
        callNow: 'Niha Bang Bike',
        orderOnline: 'Sîparîşa Onlîne',
        restaurant: 'Xwarinxane',
        familyOwned: 'Xwedîtiya Malbatê',
        googleReviews: 'Nirxandinên Google',
        averageRating: 'Nirxandina Navîn',
        fiveStarReviews: 'Nirxandinên 5 Stêrk',
        verifiedPurchase: 'Kirîna Piştrastkî',
        trustedReviewer: 'Nirxandêrê Muteber',
        foodEnthusiast: 'Hezkara Xwarinê'
      },
      reviews: {
        title: 'Mêvanên Me Çi Dibêjin',
        subtitle: 'Li ser Google Reviews ji aliyê 572+ xerîdarên kêfxweş ve 4.8/5 stêrk hate nirxandin',
        cta: 'Beşdarî 572+ xerîdarên razî bibin ku evîna xwarinên me ên resen dikin! Îro maseyê xwe rezerve bikin û cûdahiya ku mêvandariya resen a Kurdî çêdike tam bikin.',
        ctaButton: 'Niha Maseyê Xwe Rezerve Bikin',
        ctaTitle: 'Amade ne ku ezmûna xwe ya 5 stêrk çêbikin?',
        trustIndicators: {
          googleRating: '4.8★ Nirxandina Google',
          totalReviews: '572+ Nirxandin'
        }
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

      currency: '$',
      celebration: {
        title: 'Demên Xwe ên Taybetî Pîroz Bikin',
        subtitle: 'Rojên welidînê, salvegera û bûyerên xwe ên taybetî bi mêvandariya resen a Kurdî bîrneketî bikin',
        familyReunions: 'Civîna Malbatê',
        birthday: {
          title: 'Pîrozbahiya Rojên Welidînê',
          tagline: 'Demên şîrîn taybetî bikin',
          feature1: 'Şîrîniya rojê welidînê belaş',
          feature2: 'Strana rojê welidînê û xwezî',
          feature3: 'Ezmûna xwarinê ya bîrneketî',
          special: 'Ji bo pîrozbahiya salekî din ê jiyanê bêhempa ye'
        },
        anniversary: {
          title: 'Şîvên Salvegerê',
          tagline: 'Çîroka evîna xwe pîroz bikin',
          feature1: 'Maseya evîndarî bi gulan',
          feature2: 'Şîrînî belaş ji bo du kesan',
          feature3: 'Ezmûna xwarinê di ronahiya mumê de',
          feature4: 'Karta salvegerê ya kesane',
          special: '25+ sal bi hev re? Sürprîzek taybetî li bendê we ye!'
        },
        cta: {
          title: 'Ji bo Pîrozbahiyê Amade ne?',
          subtitle: 'Bila roja we ya taybetî bi mêvandariya resen a Kurdî û tamên bîrneketî awarte bikin',
          reserve: 'Ji bo rezervasyona taybetî bang bikin'
        }
      },
      ui: {
        menu: 'Menû',
        reserve: 'Rezervasyon',
        callNow: 'Niha Bang Bikin',
        call: 'Bang Bikin',
        weAreOpen: 'Em Vekirî Ne',
        currentlyClosed: 'Niha Girtî ye',
        live: 'Zindî',
        until: 'heta',
        opens: 'Vedibe'
      }
    },
    ru: {
      nav: {
        home: 'Главная',
        menu: 'Меню',
        about: 'О нас',
        gallery: 'Галерея',
        visit: 'Посетить нас',
        reservations: 'Бронирование',
        catering: 'Кейтеринг',
        orderOnline: 'Заказать'
      },
      hero: {
        title: 'Природная Деревня',
        subtitle: 'Вкус Курдистана в каждом кусочке',
        description: 'Попробуйте подлинные курдские вкусы в теплой, традиционной обстановке, где каждое блюдо рассказывает историю нашего богатого культурного наследия и кулинарных традиций, передаваемых из поколения в поколение.',
        cta1: 'Посмотреть меню',
        cta2: 'Забронировать стол'
      },
      menu: {
        title: 'Наше меню',
        subtitle: 'Работает на Blunari - Интеллектуальная ОС для улучшенного опыта питания',
        filters: {
          all: 'Все блюда',
          traditional: 'Традиционные',
          vegetarian: 'Вегетарианские',
          vegan: 'Веганские',
          soup: 'Супы',
          dessert: 'Десерты',
          popular: 'Самые популярные'
        },
        viewFull: 'Посмотреть полное меню',
        noItems: 'В этой категории ничего не найдено.'
      },
      about: {
        title: 'Наша история',
        badge: 'Наша история',
        subtitle: 'Приносим подлинные курдские вкусы и теплое гостеприимство в наше сообщество',
        content: 'Природная Деревня родилась из мечты поделиться подлинными вкусами и теплым гостеприимством Курдистана с миром.',
        story1: 'Природная Деревня посвящена предоставлению вам подлинных вкусов курдской кухни в теплой и гостеприимной атмосфере, где каждый гость чувствует себя как дома.',
        story2: 'Наши повара увлечены приготовлением традиционных курдских блюд, используя лучшие ингредиенты и проверенные временем техники приготовления, которые празднуют наше богатое кулинарное наследие.',
        quote: 'Каждое блюдо готовится с заботой и подается с теплотой курдского гостеприимства.',
        experience: 'Лет опыта',
        recipes: 'Традиционные рецепты',
        customers: 'Довольные клиенты',
        awards: 'Полученные награды',
        features: {
          chefs: {
            title: 'Опытные повара',
            description: 'Подлинная курдская кухня'
          },
          ingredients: {
            title: 'Свежие ингредиенты',
            description: 'Ежедневное качество гарантировано'
          },
          service: {
            title: 'Теплое обслуживание',
            description: 'Курдское гостеприимство'
          }
        },
        stats: {
          happyCustomers: 'Довольные клиенты',
          authenticDishes: 'Подлинные блюда',
          customerRating: 'Рейтинг клиентов',
          freshIngredients: 'Свежие ингредиенты'
        }
      },
      gallery: {
        title: 'Галерея',
        subtitle: 'Визуальное путешествие по нашему кулинарному наследию и атмосфере ресторана'
      },
      visit: {
        title: 'Посетите нас',
        subtitle: 'Найдите нас в центре города',
        hours: 'Часы работы',
        contact: 'Контактная информация',
        address: 'Адрес',
        phone: 'Телефон',
        makeReservation: 'Забронировать стол',
        getDirections: 'Получить направления'
      },
      footer: {
        description: 'Приносим подлинные вкусы и теплое гостеприимство Курдистана к вашему столу. Каждое блюдо - это праздник нашего богатого культурного наследия и кулинарного мастерства.',
        quickLinks: 'Быстрые ссылки',
        contactInfo: 'Контактная информация',
        followUs: 'Следите за нами',
        openDaily: 'ВС - ЧТ: 12:00 - 22:00\nПТ - СБ: 12:00 - 23:00',
        poweredBy: 'При поддержке',
        blunari: 'Blunari',
        copyright: `© ${new Date().getFullYear()} Ресторан курдской кухни Природная Деревня. Все права защищены.`,
        privacy: 'Политика конфиденциальности',
        terms: 'Условия обслуживания'
      },
      ui: {
        callNow: 'Позвонить сейчас',
        orderOnline: 'Заказать онлайн',
        restaurant: 'Ресторан',
        familyOwned: 'Семейный бизнес',
        googleReviews: 'Отзывы Google',
        averageRating: 'Средний рейтинг',
        fiveStarReviews: '5-звездочные отзывы',
        verifiedPurchase: 'Подтвержденная покупка',
        trustedReviewer: 'Доверенный рецензент',
        foodEnthusiast: 'Любитель еды'
      },
      reviews: {
        title: 'Что говорят наши гости',
        subtitle: 'Оценка 4.8/5 звезд от 572+ довольных клиентов в отзывах Google',
        cta: 'Присоединяйтесь к 572+ довольным клиентам, которые любят нашу подлинную кухню! Забронируйте столик сегодня и почувствуйте разницу, которую создает подлинное курдское гостеприимство.',
        ctaButton: 'Забронировать столик сейчас',
        ctaTitle: 'Готовы создать свой собственный 5-звездочный опыт?',
        trustIndicators: {
          googleRating: '4.8★ Рейтинг Google',
          totalReviews: '572+ отзыва'
        },
        review1: {
          name: 'Карен Карденас',
          text: '"Я хожу сюда уже около года, и это определенно мой любимый ресторан! Еда аутентичная и абсолютно вкусная—каждое блюдо полно вкуса, фирменные чаи и кофе потрясающие, а десерты - идеальное завершение любой трапезы."',
          location: 'Подтвержденный отзыв Google',
          time: '1 неделю назад'
        },
        review2: {
          name: 'Рут Корнеа',
          text: '"Мы замечательно провели время в ресторане Природная Деревня сегодня вечером! Все было абсолютно идеально! Еда, атмосфера, декор и обслуживание - все на высшем уровне. Это определенно наше новое любимое место для аутентичной ближневосточной кухни."',
          location: 'Местный гид • 29 отзывов',
          time: '2 месяца назад'
        },
        review3: {
          name: 'Клиент Google',
          text: '"Я заказал Кузи, блюдо из риса и баранины, оно было очень сытным и вкусным. Пицца была хорошего размера, наполненная мясом гиро, сыром и приятным соусом. Аутентичные ближневосточные вкусы действительно впечатлили меня и мою семью!"',
          location: 'Подтвержденный отзыв Google',
          time: 'Недавно'
        },
        badges: {
          featured: 'РЕКОМЕНДУЕМЫЙ',
          localGuide: 'МЕСТНЫЙ ГИД',
          quziLover: 'ЛЮБИТЕЛЬ КУЗИ'
        }
      },
      featured: {
        title: 'Рекомендуемые блюда',
        subtitle: 'Откройте для себя наши самые любимые курдские деликатесы, приготовленные по традиционным рецептам с современной подачей'
      },
      celebration: {
        title: 'Отпразднуйте свои особенные моменты',
        subtitle: 'Сделайте свои дни рождения, годовщины и особые случаи незабываемыми с подлинным курдским гостеприимством',
        familyReunions: 'Семейные встречи',
        birthday: {
          title: 'Празднование дня рождения',
          tagline: 'Сделайте сладкие моменты особенными',
          feature1: 'Бесплатный десерт на день рождения',
          feature2: 'Песня с днем рождения и пожелания',
          feature3: 'Незабываемый обеденный опыт',
          special: 'Идеально для празднования еще одного года жизни'
        },
        anniversary: {
          title: 'Юбилейные ужины',
          tagline: 'Отпразднуйте свою историю любви',
          feature1: 'Романтическая сервировка стола с розами',
          feature2: 'Бесплатный десерт на двоих',
          feature3: 'Ужин при свечах',
          feature4: 'Персонализированная юбилейная открытка',
          special: '25+ лет вместе? Особый сюрприз ждет вас!'
        },
        cta: {
          title: 'Готовы праздновать?',
          subtitle: 'Позвольте нам сделать ваш особенный день необычайным с подлинным курдским гостеприимством и незабываемыми вкусами',
          reserve: 'Звоните для особого бронирования'
        }
      },
      tags: {
        vegetarian: '🌱 Вегетарианское',
        vegan: '🌿 Веганское',
        spicy: '🌶️ Острое',
        sweet: '🍯 Сладкое',
        traditional: '🏛️ Традиционное',
        grilled: '🔥 Гриль',
        'comfort food': '🍲 Домашняя еда',
        soup: '🍜 Суп',
        stew: '🥘 Тушеное'
      },
      addToCart: 'Добавить в корзину',
      loading: 'Загрузка...',
      error: 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
      currency: '$',
      ui: {
        menu: 'Меню',
        reserve: 'Бронирование',
        callNow: 'Звоните сейчас',
        call: 'Звонить',
        weAreOpen: 'Мы открыты',
        currentlyClosed: 'Сейчас закрыто',
        live: 'Прямой эфир',
        until: 'до',
        opens: 'Откроется'
      }
    },
    hi: {
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
      hero: {
        title: 'नेचर विलेज',
        subtitle: 'हर निवाले में कुर्दिस्तान का स्वाद',
        description: 'एक गर्म, पारंपरिक माहौल में प्रामाणिक कुर्दी स्वादों का अनुभव करें जहाँ हर व्यंजन हमारी समृद्ध सांस्कृतिक विरासत और पीढ़ियों से चली आ रही पाक परंपराओं की कहानी कहता है।',
        cta1: 'मेन्यू देखें',
        cta2: 'टेबल बुक करें'
      },
      menu: {
        title: 'हमारा मेन्यू',
        subtitle: 'Blunari द्वारा संचालित - बेहतर भोजन अनुभव के लिए बुद्धिमान OS',
        filters: {
          all: 'सभी व्यंजन',
          traditional: 'पारंपरिक',
          vegetarian: 'शाकाहारी',
          vegan: 'वीगन',
          soup: 'सूप',
          dessert: 'मिठाई',
          popular: 'सबसे लोकप्रिय'
        },
        viewFull: 'पूरा मेन्यू देखें',
        noItems: 'इस श्रेणी में कोई आइटम नहीं मिला।'
      },
      about: {
        title: 'हमारी कहानी',
        badge: 'हमारी कहानी',
        subtitle: 'हमारे समुदाय में प्रामाणिक कुर्दी स्वाद और गर्म आतिथ्य ला रहे हैं',
        content: 'नेचर विलेज कुर्दिस्तान के प्रामाणिक स्वादों और गर्म आतिथ्य को दुनिया के साथ साझा करने के सपने से जन्मा था।',
        story1: 'नेचर विलेज एक गर्म और स्वागत करने वाले माहौल में कुर्दी व्यंजनों के प्रामाणिक स्वाद प्रदान करने के लिए समर्पित है जहाँ हर मेहमान परिवार की तरह महसूस करता है।',
        story2: 'हमारे शेफ बेहतरीन सामग्री और समय-परीक्षित खाना पकाने की तकनीकों का उपयोग करके पारंपरिक कुर्दी व्यंजन तैयार करने के लिए उत्साहित हैं जो हमारी समृद्ध पाक विरासत का जश्न मनाते हैं।',
        quote: 'हर व्यंजन सावधानी से तैयार किया जाता है और कुर्दी आतिथ्य की गर्मजोशी के साथ परोसा जाता है।',
        experience: 'वर्षों का अनुभव',
        recipes: 'पारंपरिक व्यंजन',
        customers: 'खुश ग्राहक',
        awards: 'प्राप्त पुरस्कार',
        features: {
          chefs: {
            title: 'विशेषज्ञ शेफ',
            description: 'प्रामाणिक कुर्दी व्यंजन'
          },
          ingredients: {
            title: 'ताज़ी सामग्री',
            description: 'दैनिक गुणवत्ता की गारंटी'
          },
          service: {
            title: 'गर्म सेवा',
            description: 'कुर्दी आतिथ्य'
          }
        },
        stats: {
          happyCustomers: 'खुश ग्राहक',
          authenticDishes: 'प्रामाणिक व्यंजन',
          customerRating: 'ग्राहक रेटिंग',
          freshIngredients: 'ताज़ी सामग्री'
        }
      },
      gallery: {
        title: 'गैलरी',
        subtitle: 'हमारी पाक विरासत और रेस्टोरेंट के माहौल की एक दृश्य यात्रा'
      },
      visit: {
        title: 'हमसे मिलें',
        subtitle: 'शहर के केंद्र में हमें खोजें',
        hours: 'खुलने का समय',
        contact: 'संपर्क जानकारी',
        address: 'पता',
        phone: 'फोन',
        makeReservation: 'टेबल बुक करें',
        getDirections: 'दिशा निर्देश प्राप्त करें'
      },
      footer: {
        description: 'कुर्दिस्तान के प्रामाणिक स्वाद और गर्म आतिथ्य आपकी मेज तक लाते हैं। हर व्यंजन हमारी समृद्ध सांस्कृतिक विरासत और पाक उत्कृष्टता का उत्सव है।',
        quickLinks: 'त्वरित लिंक',
        contactInfo: 'संपर्क जानकारी',
        followUs: 'हमें फॉलो करें',
        openDaily: 'रवि - गुरु: 12:00 - 22:00\nशुक्र - शनि: 12:00 - 23:00',
        poweredBy: 'द्वारा संचालित',
        blunari: 'Blunari',
        copyright: `© ${new Date().getFullYear()} नेचर विलेज कुर्दी रेस्टोरेंट। सभी अधिकार सुरक्षित।`,
        privacy: 'गोपनीयता नीति',
        terms: 'सेवा की शर्तें'
      },
      ui: {
        callNow: 'अभी कॉल करें',
        orderOnline: 'ऑनलाइन ऑर्डर',
        restaurant: 'रेस्टोरेंट',
        familyOwned: 'पारिवारिक स्वामित्व',
        googleReviews: 'Google समीक्षाएं',
        averageRating: 'औसत रेटिंग',
        fiveStarReviews: '5-स्टार समीक्षाएं',
        verifiedPurchase: 'सत्यापित खरीदारी',
        trustedReviewer: 'विश्वसनीय समीक्षक',
        foodEnthusiast: 'भोजन प्रेमी'
      },
      reviews: {
        title: 'हमारे मेहमान क्या कहते हैं',
        subtitle: 'Google समीक्षाओं में 572+ खुश ग्राहकों द्वारा 4.8/5 स्टार रेटेड',
        cta: '572+ संतुष्ट ग्राहकों में शामिल हों जो हमारे प्रामाणिक व्यंजनों से प्यार करते हैं! आज अपनी टेबल बुक करें और प्रामाणिक कुर्दी आतिथ्य के अंतर का स्वाद लें।',
        ctaButton: 'अभी अपनी टेबल बुक करें',
        ctaTitle: 'अपना खुद का 5-स्टार अनुभव बनाने के लिए तैयार हैं?',
        trustIndicators: {
          googleRating: '4.8★ Google रेटिंग',
          totalReviews: '572+ समीक्षाएं'
        },
        review1: {
          name: 'करेन कार्डेनास',
          text: '"मैं लगभग एक साल से यहाँ आ रहा हूँ, और यह निश्चित रूप से मेरा पसंदीदा रेस्टोरेंट है! खाना प्रामाणिक और बिल्कुल स्वादिष्ट है—हर व्यंजन स्वाद से भरपूर है, विशेष चाय और कॉफी अद्भुत हैं, और मिठाइयाँ किसी भी भोजन का सही अंत हैं।"',
          location: 'सत्यापित Google समीक्षा',
          time: '1 सप्ताह पहले'
        },
        review2: {
          name: 'रूथ कॉर्निया',
          text: '"आज रात हमने नेचर विलेज रेस्टोरेंट में अद्भुत समय बिताया! सब कुछ बिल्कुल सही था! खाना, माहौल, सजावट और सेवा सब कुछ शीर्ष स्तर का था। यह निश्चित रूप से प्रामाणिक मध्य पूर्वी व्यंजनों के लिए हमारी नई पसंदीदा जगह है।"',
          location: 'स्थानीय गाइड • 29 समीक्षाएं',
          time: '2 महीने पहले'
        },
        review3: {
          name: 'Google ग्राहक',
          text: '"मैंने कुज़ी ऑर्डर की, एक चावल और मेमने की डिश, यह बहुत भरपेट और स्वादिष्ट थी। पिज़्ज़ा अच्छे साइज़ का था जो गायरो मीट, चीज़ और एक अच्छी सॉस से भरा हुआ था। प्रामाणिक मध्य पूर्वी स्वादों ने मुझे और मेरे परिवार को वास्तव में प्रभावित किया!"',
          location: 'सत्यापित Google समीक्षा',
          time: 'हाल ही में'
        },
        badges: {
          featured: 'फीचर्ड',
          localGuide: 'स्थानीय गाइड',
          quziLover: 'कुज़ी प्रेमी'
        }
      },
      featured: {
        title: 'विशेष व्यंजन',
        subtitle: 'हमारे सबसे प्रिय कुर्दी विशेषताओं की खोज करें, पारंपरिक व्यंजनों और आधुनिक प्रस्तुति के साथ तैयार'
      },
      celebration: {
        title: 'अपने विशेष क्षणों का जश्न मनाएं',
        subtitle: 'अपने जन्मदिन, सालगिरह और विशेष अवसरों को प्रामाणिक कुर्दी आतिथ्य के साथ अविस्मरणीय बनाएं',
        familyReunions: 'पारिवारिक मिलन',
        birthday: {
          title: 'जन्मदिन समारोह',
          tagline: 'मीठे पलों को विशेष बनाएं',
          feature1: 'मुफ्त जन्मदिन मिठाई',
          feature2: 'जन्मदिन का गाना और शुभकामनाएं',
          feature3: 'यादगार भोजन अनुभव',
          special: 'जीवन के एक और वर्ष के जश्न के लिए बिल्कुल सही'
        },
        anniversary: {
          title: 'सालगिरह डिनर',
          tagline: 'अपनी प्रेम कहानी का जश्न मनाएं',
          feature1: 'गुलाब के साथ रोमांटिक टेबल सेटअप',
          feature2: 'दो के लिए मुफ्त मिठाई',
          feature3: 'मोमबत्ती की रोशनी में भोजन अनुभव',
          feature4: 'व्यक्तिगत सालगिरह कार्ड',
          special: '25+ साल साथ? विशेष आश्चर्य आपका इंतजार कर रहा है!'
        },
        cta: {
          title: 'जश्न मनाने के लिए तैयार?',
          subtitle: 'हमें प्रामाणिक कुर्दी आतिथ्य और अविस्मरणीय स्वादों के साथ आपका विशेष दिन असाधारण बनाने दें',
          reserve: 'विशेष बुकिंग के लिए कॉल करें'
        }
      },
      tags: {
        vegetarian: '🌱 शाकाहारी',
        vegan: '🌿 वीगन',
        spicy: '🌶️ मसालेदार',
        sweet: '🍯 मीठा',
        traditional: '🏛️ पारंपरिक',
        grilled: '🔥 ग्रिल्ड',
        'comfort food': '🍲 आरामदायक भोजन',
        soup: '🍜 सूप',
        stew: '🥘 स्टू'
      },
      addToCart: 'कार्ट में जोड़ें',
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हुआ। कृपया फिर से कोशिश करें।',
      currency: '₹',
      ui: {
        menu: 'मेन्यू',
        reserve: 'बुकिंग',
        callNow: 'अभी कॉल करें',
        call: 'कॉल करें',
        weAreOpen: 'हम खुले हैं',
        currentlyClosed: 'अभी बंद है',
        live: 'लाइव',
        until: 'तक',
        opens: 'खुलता है'
      }
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
        subtitle: 'Di Her Qurçikê de Tama Rojhilatê Navîn',
        description: 'Tamên resen ên Rojhilatê Navîn di hawîrdorekî germ û kevneşopî de biceribînin.',
        cta1: 'Menûyê Bibînin',
        cta2: 'Rezervasyon Bikin'
      },
      menu: {
        title: 'Menûya Me',
        subtitle: 'Bi Blunari ve têk tê - Sîstema Zîrek ji bo Ezmûna Xwarinê ya Baştirkirî',
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

        badge: 'Çîroka Me',
        subtitle: 'Tamên resen ên Kurdî û mêvandariya germ bo civata me tînin',
        content: 'Gundê Xwezayê ji xewna parvekirina tamên resen û mêvandariya germ a Rojhilata Navîn bi cîhanê re hate dayîn.',
        story1: 'Gundê Xwezayê ji bo pêşkêşkirina tamên resen ên xwarinên Kurdî di hawîrdorekî germ û bi xêrhatin de ku her mêvan wek malbat hîs bike, xwe terxan kiriye.',
        story2: 'Aşpêjên me bi dilsozî xwarinên kevneşopî yên Kurdî bi karanîna çêtirîn pêkhate û teknîkên kevneşopî yên çêkirina xwarinê amade dikin ku mîrata dewlemend a çêşt lênanê pîroz dikin.',
        quote: 'Her xwarinê bi baldarî tê amade kirin û bi germiya mêvandariya Kurdî tê pêşkêş kirin.',
        experience: 'Sal Ezmûn',
        recipes: 'Rêsetên Kevneşopî',
        customers: 'Xerîdarên Kêfxweş',
        awards: 'Xelatan Bi Dest Xistin',
        features: {
          chefs: {
            title: 'Aşpêjên Pispor',
            description: 'Xwarinên resen ên Kurdî'
          },
          ingredients: {
            title: 'Pêkhateyen Taze',
            description: 'Kalîteya rojane garantî'
          },
          service: {
            title: 'Karûbarê Germ',
            description: 'Mêvandariya Kurdî'
          }
        },
        stats: {
          happyCustomers: 'Xerîdarên Kêfxweş',
          authenticDishes: 'Xwarinên Resen',
          customerRating: 'Nirxandina Xerîdaran',
          freshIngredients: 'Pêkhateyen Taze'
        }

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

        description: 'Tamên resen û mêvandariya germ a Rojhilata Navîn tînin ser maseyê we. Her xwarinê pîrozbahiya çanda me ya dewlemend û başiya çêştlênanê ye.',

        

        quickLinks: 'Lînkên Bilez',
        contactInfo: 'Agahiyên Têkiliyê',
        followUs: 'Şopa Me Bikin',
        openDaily: 'YEKŞEM - PÊNCŞEM: 12:00 - 22:00\nÎN - ŞEMÎ: 12:00 - 23:00',
        poweredBy: 'Ji aliyê ve tê piştgirîkirin',

        blunari: 'Blunari',

        copyright: `© ${new Date().getFullYear()} Gundê Xwezayê Xwarinxaneya Kurdî. Hemû maf parastî ne.`,
        privacy: 'Polîtikaya Nihêniyê',
        terms: 'Mercên Karûbarê'
      },

      ui: {
        callNow: 'Niha Bang Bike',
        orderOnline: 'Sîparîşa Onlîne',
        restaurant: 'Xwarinxane',
        familyOwned: 'Xwedîtiya Malbatê',
        googleReviews: 'Nirxandinên Google',
        averageRating: 'Nirxandina Navîn',
        fiveStarReviews: 'Nirxandinên 5 Stêrk',
        verifiedPurchase: 'Kirîna Piştrastkî',
        trustedReviewer: 'Nirxandêrê Muteber',
        foodEnthusiast: 'Hezkara Xwarinê'
      },
      reviews: {
        title: 'Mêvanên Me Çi Dibêjin',
        subtitle: 'Li ser Google Reviews ji aliyê 572+ xerîdarên kêfxweş ve 4.8/5 stêrk hate nirxandin',
        cta: 'Beşdarî 572+ xerîdarên razî bibin ku evîna xwarinên me ên resen dikin! Îro maseyê xwe rezerve bikin û cûdahiya ku mêvandariya resen a Kurdî çêdike tam bikin.',
        ctaButton: 'Niha Maseyê Xwe Rezerve Bikin',
        ctaTitle: 'Amade ne ku ezmûna xwe ya 5 stêrk çêbikin?',
        trustIndicators: {
          googleRating: '4.8★ Nirxandina Google',
          totalReviews: '572+ Nirxandin'
        }
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

      currency: '$',
      celebration: {
        title: 'Demên Xwe ên Taybetî Pîroz Bikin',
        subtitle: 'Rojên welidînê, salvegera û bûyerên xwe ên taybetî bi mêvandariya resen a Kurdî bîrneketî bikin',
        familyReunions: 'Civîna Malbatê',
        birthday: {
          title: 'Pîrozbahiya Rojên Welidînê',
          tagline: 'Demên şîrîn taybetî bikin',
          feature1: 'Şîrîniya rojê welidînê belaş',
          feature2: 'Strana rojê welidînê û xwezî',
          feature3: 'Ezmûna xwarinê ya bîrneketî',
          special: 'Ji bo pîrozbahiya salekî din ê jiyanê bêhempa ye'
        },
        anniversary: {
          title: 'Şîvên Salvegerê',
          tagline: 'Çîroka evîna xwe pîroz bikin',
          feature1: 'Maseya evîndarî bi gulan',
          feature2: 'Şîrînî belaş ji bo du kesan',
          feature3: 'Ezmûna xwarinê di ronahiya mumê de',
          feature4: 'Karta salvegerê ya kesane',
          special: '25+ sal bi hev re? Sürprîzek taybetî li bendê we ye!'
        },
        cta: {
          title: 'Ji bo Pîrozbahiyê Amade ne?',
          subtitle: 'Bila roja we ya taybetî bi mêvandariya resen a Kurdî û tamên bîrneketî awarte bikin',
          reserve: 'Ji bo rezervasyona taybetî bang bikin'
        }
      }
    },
    fr: {
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
      hero: {
        title: 'Nature Village',
        subtitle: 'Saveurs du Moyen-Orient à Chaque Bouchée',
        description: 'Découvrez les saveurs authentiques du Moyen-Orient dans une ambiance chaleureuse et traditionnelle où chaque plat raconte l\'histoire de notre riche héritage culturel et des traditions culinaires transmises de génération en génération.',
        cta1: 'Voir le Menu',
        cta2: 'Réserver'
      },
      menu: {
        title: 'Notre Menu',
        subtitle: 'Propulsé par Blunari - OS Intelligent pour une Expérience Culinaire Améliorée',
        filters: {
          all: 'Tous les Articles',
          traditional: 'Traditionnel',
          vegetarian: 'Végétarien',
          vegan: 'Végétalien',
          soup: 'Soupes',
          appetizer: 'Apéritifs',
          main: 'Plats Principaux',
          dessert: 'Desserts',
          beverage: 'Boissons',
          kebab: 'Kebabs',
          rice: 'Riz',
          bread: 'Pains',
          salad: 'Salades',
          seafood: 'Fruits de Mer',
          hot: 'Plats Chauds',
          cold: 'Plats Froids',
          spicy: 'Épicé',
          mild: 'Doux',
          popular: 'Plus Populaires'
        },
        viewFull: 'Voir le Menu Complet',
        noItems: 'Aucun article trouvé dans cette catégorie.',
        cta: 'Commander Maintenant'
      },
      about: {
        title: 'Notre Histoire',
        badge: 'Notre Histoire',
        subtitle: 'Apporter les saveurs authentiques du Moyen-Orient et une hospitalité chaleureuse à notre communauté',
        content: 'Nature Village est né d\'un rêve de partager les saveurs authentiques et l\'hospitalité chaleureuse du Moyen-Orient avec le monde. Nos recettes familiales se transmettent de génération en génération, chaque plat préparé avec amour et respect pour nos traditions culturelles. Nous nous approvisionnons en ingrédients de la plus haute qualité et préparons chaque repas avec le même soin et la même attention qui définissent l\'hospitalité du Moyen-Orient depuis des siècles.',
        story1: 'Nature Village se consacre à vous apporter les saveurs authentiques de la cuisine du Moyen-Orient dans une atmosphère chaleureuse et accueillante où chaque invité se sent comme en famille.',
        story2: 'Nos chefs sont passionnés par la préparation de plats traditionnels du Moyen-Orient utilisant les meilleurs ingrédients et des techniques de cuisson ancestrales qui célèbrent notre riche patrimoine culinaire.',
        quote: 'Chaque plat est préparé avec soin et servi avec la chaleur de l\'hospitalité du Moyen-Orient.',
        experience: 'Années d\'Expérience',
        recipes: 'Recettes Traditionnelles',
        customers: 'Clients Satisfaits',
        awards: 'Prix Remportés',
        features: {
          chefs: {
            title: 'Chefs Experts',
            description: 'Cuisine authentique du Moyen-Orient'
          },
          ingredients: {
            title: 'Ingrédients Frais',
            description: 'Qualité garantie quotidiennement'
          },
          service: {
            title: 'Service Chaleureux',
            description: 'Hospitalité du Moyen-Orient'
          }
        },
        stats: {
          happyCustomers: 'Clients Satisfaits',
          authenticDishes: 'Plats Authentiques',
          customerRating: 'Évaluation Clients',
          freshIngredients: 'Ingrédients Frais'
        }
      },
      gallery: {
        title: 'Galerie',
        subtitle: 'Un voyage visuel à travers notre patrimoine culinaire et l\'atmosphère de notre restaurant'
      },
      visit: {
        title: 'Nous Visiter',
        subtitle: 'Trouvez-nous au cœur de la ville',
        hours: 'Heures d\'Ouverture',
        contact: 'Informations de Contact',
        address: 'Adresse',
        phone: 'Téléphone',
        makeReservation: 'Faire une Réservation',
        getDirections: 'Obtenir des Directions'
      },
      ui: {
        callNow: 'Appeler Maintenant',
        call: 'Appeler',
        orderOnline: 'Commander en Ligne',
        restaurant: 'Restaurant',
        familyOwned: 'Entreprise Familiale',
        halalCertified: 'Certifié Halal',
        googleReviews: 'Avis Google',
        averageRating: 'Note Moyenne',
        fiveStarReviews: 'Avis 5 Étoiles',
        verifiedPurchase: 'Achat Vérifié',
        trustedReviewer: 'Évaluateur de Confiance',
        foodEnthusiast: 'Amateur de Cuisine',
        menu: 'Menu',
        reserve: 'Réserver',
        weAreOpen: 'Nous Sommes Ouverts',
        currentlyClosed: 'Actuellement Fermé',
        live: 'EN DIRECT',
        until: 'Jusqu\'à',
        opens: 'Ouvre',
        activity: 'Activité'
      },
      reviews: {
        title: 'Ce Que Disent Nos Invités',
        subtitle: 'Noté 4,8/5 étoiles par plus de 572 clients satisfaits sur les Avis Google',
        cta: 'Rejoignez plus de 572 clients satisfaits qui adorent notre cuisine authentique ! Réservez votre table dès aujourd\'hui et goûtez la différence que fait l\'hospitalité authentique du Moyen-Orient.',
        ctaButton: 'Réservez Votre Table Maintenant',
        ctaTitle: 'Prêt à Créer Votre Propre Expérience 5 Étoiles ?',
        trustIndicators: {
          googleRating: '4,8★ Note Google',
          totalReviews: '+572 Avis'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"Je viens ici depuis environ un an, et c\'est sans conteste mon restaurant préféré ! La nourriture est authentique et absolument délicieuse—chaque plat est plein de saveurs, les thés et cafés de spécialité sont incroyables, et les desserts sont la fin parfaite de tout repas."',
          location: 'Avis Google Vérifié',
          time: 'Il y a 1 semaine'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"Nous avons passé un moment merveilleux au Restaurant Nature Village ce soir ! Tout était absolument parfait ! La nourriture, l\'atmosphère, la décoration et le service sont tous de premier ordre. C\'est définitivement notre nouveau lieu préféré pour la cuisine authentique du Moyen-Orient."',
          location: 'Guide Local • 29 avis',
          time: 'Il y a 2 mois'
        },
        review3: {
          name: 'Client Google',
          text: '"J\'ai commandé le Quzi, un plat de riz et d\'agneau, c\'était très copieux et délicieux. La pizza était de bonne taille remplie de viande gyro, fromage et une belle sauce. Les saveurs authentiques du Moyen-Orient ont vraiment impressionné ma famille et moi !"',
          location: 'Avis Google Vérifié',
          time: 'Récent'
        },
        badges: {
          featured: 'EN VEDETTE',
          localGuide: 'GUIDE LOCAL',
          quziLover: 'AMATEUR DE QUZI'
        }
      },
      featured: {
        title: 'Plats Vedettes',
        subtitle: 'Découvrez nos spécialités du Moyen-Orient les plus appréciées, préparées avec des recettes traditionnelles et une présentation moderne'
      },
      celebration: {
        title: 'Célébrez Vos Moments Spéciaux',
        subtitle: 'Rendez vos anniversaires, anniversaires de mariage et occasions spéciales inoubliables avec une authentique hospitalité du Moyen-Orient',

        familyReunions: 'Réunions de Famille',
        graduations: 'Remises de Diplômes',
        engagements: 'Fiançailles', 
        holidays: 'Fêtes',
        birthday: {
          title: 'Célébrations d\'Anniversaire',
          tagline: 'Des moments doux rendus spéciaux',
          feature1: 'Dessert d\'anniversaire offert',
          feature2: 'Chanson d\'anniversaire et vœux',
          feature3: 'Expérience de dîner mémorable',
          special: 'Parfait pour célébrer une année de plus de vie'
        },
        anniversary: {
          title: 'Dîners d\'Anniversaire de Mariage',
          tagline: 'Célébrez votre histoire d\'amour',
          feature1: 'Configuration de table romantique avec roses',
          feature2: 'Dessert offert pour deux',
          feature3: 'Expérience de dîner aux chandelles',
          feature4: 'Carte d\'anniversaire personnalisée',
          special: '25+ ans ensemble ? Une surprise spéciale vous attend !'
        },
        cta: {
          title: 'Prêt à Célébrer ?',
          subtitle: 'Laissez-nous rendre votre journée spéciale extraordinaire avec une authentique hospitalité du Moyen-Orient et des saveurs inoubliables',
          reserve: 'Appelez pour une réservation spéciale',
          bookingAdvice: 'Réservez 48 heures à l\'avance pour la meilleure expérience de célébration'
        }
      },
      footer: {
        description: 'Apporter les saveurs authentiques du Kurdistan et une hospitalité chaleureuse à votre table. Chaque repas est un témoignage de notre riche patrimoine culturel et de notre excellence culinaire.',
        quickLinks: 'Liens Rapides',
        contactInfo: 'Informations de Contact',
        followUs: 'Suivez-Nous',
        openDaily: 'Dimanche - Jeudi : 12h00 - 22h00\nVendredi - Samedi : 12h00 - 23h00',
        poweredBy: 'Propulsé par',
        blunari: 'Blunari',
        copyright: `© ${new Date().getFullYear()} Restaurant Nature Village. Tous droits réservés.`,
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation'
      }
    },
    sq: {
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
      hero: {
        title: 'Nature Village',
        subtitle: 'Shija e Lindjes së Mesme në Çdo Kafshim',
        description: 'Përjetoni shijet autentike të Lindjes së Mesme në një ambient të ngrohtë dhe tradicional ku çdo pjatë tregon historinë e trashëgimisë sonë të pasur kulturore dhe tradicionaleve të gatimit të trashëguara gjatë brezave.',
        cta1: 'Shiko Menynë',
        cta2: 'Bëj Rezervim'
      },
      menu: {
        title: 'Menya Jonë',
        subtitle: 'Fuqizuar nga Blunari - OS Inteligjente për Përvojë të Përmirësuar Gatuese',
        filters: {
          all: 'Të Gjitha Artikujt',
          traditional: 'Tradicionale',
          vegetarian: 'Vegjetariane',
          vegan: 'Vegane',
          soup: 'Supa',
          dessert: 'Ëmbëlsira',
          popular: 'Më të Popullarizuarat'
        },
        viewFull: 'Shiko Menynë e Plotë',
        noItems: 'Nuk u gjetën artikuj në këtë kategori.'
      },
      about: {
        title: 'Historia Jonë',
        badge: 'Historia Jonë',
        subtitle: 'Sillim shijet autentike të Lindjes së Mesme dhe mikpritjen e ngrohtë në komunitetin tonë',
        content: 'Nature Village lindi nga ëndërra për të ndarë shijet autentike dhe mikpritjen e ngrohtë të Lindjes së Mesme me botën. Recetat e familjes sonë janë trashëguar përmes brezave, çdo pjatë e përgatitur me dashuri dhe respekt për traditat tona kulturore.',
        story1: 'Nature Village është i përkushtuar në sjelljen e shijeve autentike të kuzhinës së Lindjes së Mesme në një atmosferë të ngrohtë dhe të mirëpritur ku çdo mysafir ndjehet si në familje.',
        story2: 'Kuzhinierët tanë janë të pasionuar për përgatitjen e pjatave tradicionale të Lindjes së Mesme duke përdorur përbërësit më të mirë dhe teknikat e gatimit me tradita që kremtojnë trashëgiminë tonë të pasur kulinarë.',
        quote: 'Çdo pjatë përgatitet me kujdes dhe shërbehet me ngrohtësinë e mikpritjes së Lindjes së Mesme.',
        experience: 'Vite Përvojë',
        recipes: 'Receta Tradicionale',
        customers: 'Klientë të Lumtur',
        awards: 'Çmime të Fituara',
        features: {
          chefs: {
            title: 'Kuzhinierë Ekspertë',
            description: 'Kuzhinë autentike kurde'
          },
          ingredients: {
            title: 'Përbërës të Freskët',
            description: 'Cilësi e garantuar çdo ditë'
          },
          service: {
            title: 'Shërbim i Ngrohtë',
            description: 'Mikpritja kurde'
          }
        },
        stats: {
          happyCustomers: 'Klientë të Lumtur',
          authenticDishes: 'Pjata Autentike',
          customerRating: 'Vlerësimi i Klientëve',
          freshIngredients: 'Përbërës të Freskët'
        }
      },
      gallery: {
        title: 'Galeria',
        subtitle: 'Një udhëtim vizual përmes trashëgimisë sonë kulinarë dhe atmosferës së restorantit'
      },
      visit: {
        title: 'Na Vizitoni',
        subtitle: 'Na gjeni në zemër të qytetit',
        hours: 'Orari i Punës',
        contact: 'Informacioni i Kontaktit',
        address: 'Adresa',
        phone: 'Telefoni',
        makeReservation: 'Bëj Rezervim',
        getDirections: 'Merr Udhëzimet'
      },
      ui: {
        callNow: 'Thirr Tani',
        call: 'Thirr',
        orderOnline: 'Porosit Online',
        restaurant: 'Restorant',
        familyOwned: 'I Zotëruar nga Familja',
        halalCertified: 'I Certifikuar Halal',
        googleReviews: 'Vlerësimet e Google',
        averageRating: 'Vlerësimi Mesatar',
        fiveStarReviews: 'Vlerësime 5 Yje',
        verifiedPurchase: 'Blerje e Verifikuar',
        trustedReviewer: 'Recensues i Besuar',
        foodEnthusiast: 'Entuziast i Ushqimit',
        menu: 'Meny',
        reserve: 'Rezervo',
        weAreOpen: 'Jemi të Hapur',
        currentlyClosed: 'Aktualisht i Mbyllur',
        live: 'DREJTPËRDREJT',
        until: 'Deri',
        opens: 'Hapet',
        activity: 'Aktiviteti'
      },
      reviews: {
        title: 'Çfarë Thonë Mysafirët Tanë',
        subtitle: 'Vlerësuar 4.8/5 yje nga 572+ klientë të kënaqur në Vlerësimet e Google',
        cta: 'Bashkohuni me 572+ klientët e kënaqur që e duan kuzhinën tonë autentike! Rezervoni tavolinën tuaj sot dhe shijoni ndryshimin që bën mikpritja autentike kurde.',
        ctaButton: 'Rezervo Tavolinën Tënde Tani',
        ctaTitle: 'Gati të Krijoni Përvojën Tuaj 5 Yje?',
        trustIndicators: {
          googleRating: '4.8★ Vlerësimi i Google',
          totalReviews: '572+ Vlerësime'
        },
        review1: {
          name: 'Albana Krasniqi',
          text: '"Kam rreth një vit që vij këtu, dhe pa dyshim është restoranti im i preferuar! Ushqimi është autentik dhe absolutisht i shijshëm—çdo pjatë është plot shije, çajet dhe kafet speciale janë mahnitëse, dhe ëmbëlsirat janë përfundimi perfekt për çdo vakt."',
          location: 'Vlerësim i Verifikuar i Google',
          time: '1 javë më parë'
        },
        review2: {
          name: 'Arben Hoxha',
          text: '"Kaluam një kohë të mrekullueshme në Restoranti Nature Village sonte! Gjithçka ishte absolutisht perfekte! Ushqimi, atmosfera, dekori dhe shërbimi janë të gjitha në nivelin më të lartë. Ky është definitivisht vendi ynë i ri i preferuar për kuzhinën autentike të Lindjes së Mesme."',
          location: 'Udhëzues Lokal • 29 vlerësime',
          time: '2 muaj më parë'
        },
        review3: {
          name: 'Flutura Berisha',
          text: '"Porosita Quzi-n, një pjatë orizi dhe mish deleje, ishte shumë i ngopshëm dhe i shijshëm. Pizza ishte me madhësi të mirë e mbushur me mish gyro, djathë dhe salcë të mirë. Shijet autentike të Lindjes së Mesme vërtet na mahnitën mua dhe familjen time!"',
          location: 'Vlerësim i Verifikuar i Google',
          time: 'Së fundmi'
        },
        badges: {
          featured: 'I VEÇUAR',
          localGuide: 'UDHËZUES LOKAL',
          quziLover: 'DASHNOR I QUZI-T'
        }
      },
      featured: {
        title: 'Pjata të Veçanta',
        subtitle: 'Zbuloni specialitetet tona më të dashura kurde, të përgatitura me receta tradicionale dhe prezantim modern'
      },
      celebration: {
        title: 'Festoni Momentet Tuaja të Veçanta',
        subtitle: 'Bëjini ditëlindjet, përvjetorët dhe rastet e veçanta tuaja të paharrueshme me mikpritjen autentike kurde',
        familyReunions: 'Tubime Familjare',
        graduations: 'Diplomime',
        engagements: 'Fejesa', 
        holidays: 'Festa',
        birthday: {
          title: 'Festime Ditëlindjesh',
          tagline: 'Momente të ëmbla bëhen të veçanta',
          feature1: 'Ëmbëlsirë falas ditëlindjeje',
          feature2: 'Kënga e ditëlindjes dhe urime',
          feature3: 'Përvojë e paharrueshme ngrënieje',
          special: 'Perfekte për festimin e një viti tjetër jete'
        },
        anniversary: {
          title: 'Darka Përvjetorësh',
          tagline: 'Festoni historinë tuaj të dashurisë',
          feature1: 'Përcaktim romantik tavoline me trëndafila',
          feature2: 'Ëmbëlsirë falas për dy',
          feature3: 'Përvojë ngrënieje me qiri',
          feature4: 'Kartë përvjetori e personalizuar',
          special: '25+ vjet së bashku? Një surprizë e veçantë ju pret!'
        },
        cta: {
          title: 'Gati të Festoni?',
          subtitle: 'Na lejoni ta bëjmë ditën tuaj të veçantë të jashtëzakonshme me mikpritjen autentike kurde dhe shijet e paharrueshme',
          reserve: 'Thirrni për rezervim të veçantë',
          bookingAdvice: 'Rezervoni 48 orë përpara për përvojën më të mirë të festimit'
        }
      },
      tags: {
        vegetarian: '🌱 Vegjetariane',
        vegan: '🌿 Vegane',
        spicy: '🌶️ Djegëse',
        sweet: '🍯 E Ëmbël',
        traditional: '🏛️ Tradicionale',
        grilled: '🔥 në Skarë',
        'comfort food': '🍲 Ushqim Rehatues',
        soup: '🍜 Supë',
        stew: '🥘 Speca'
      },
      addToCart: 'Shto në Shportë',
      loading: 'Duke u ngarkuar...',
      error: 'Ndodhi një gabim. Ju lutemi provoni përsëri.',
      currency: '$'
    },
    de: {
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
      hero: {
        title: 'Nature Village',
        subtitle: 'Nahöstliche Aromen in jedem Bissen',
        description: 'Erleben Sie die authentischen Aromen des Nahen Ostens in einer warmen und traditionellen Atmosphäre, wo jedes Gericht die Geschichte unseres reichen kulturellen Erbes und der kulinarischen Traditionen erzählt, die über Generationen weitergegeben wurden.',
        cta1: 'Speisekarte Ansehen',
        cta2: 'Reservieren'
      },
      menu: {
        title: 'Unsere Speisekarte',
        subtitle: 'Powered by Blunari - Intelligentes OS für verbessertes kulinarisches Erlebnis',
        filters: {
          all: 'Alle Gerichte',
          traditional: 'Traditionell',
          vegetarian: 'Vegetarisch',
          vegan: 'Vegan',
          soup: 'Suppen',
          appetizer: 'Vorspeisen',
          main: 'Hauptgerichte',
          dessert: 'Desserts',
          beverage: 'Getränke',
          kebab: 'Kebabs',
          rice: 'Reis',
          bread: 'Brot',
          salad: 'Salate',
          seafood: 'Meeresfrüchte',
          hot: 'Warme Gerichte',
          cold: 'Kalte Gerichte',
          spicy: 'Scharf',
          mild: 'Mild',
          popular: 'Am Beliebtesten'
        },
        viewFull: 'Vollständige Speisekarte Ansehen',
        noItems: 'Keine Gerichte in dieser Kategorie gefunden.',
        cta: 'Jetzt Bestellen'
      },
      about: {
        title: 'Unsere Geschichte',
        badge: 'Unsere Geschichte',
        subtitle: 'Wir bringen authentische nahöstliche Aromen und warme Gastfreundschaft in unsere Gemeinschaft',
        content: 'Nature Village entstand aus dem Traum, authentische Aromen und warme Gastfreundschaft des Nahen Ostens mit der Welt zu teilen. Unsere Familienrezepte werden über Generationen weitergegeben, jedes Gericht wird mit Liebe und Respekt für unsere kulturellen Traditionen zubereitet. Wir verwenden nur Zutaten höchster Qualität und bereiten jede Mahlzeit mit der gleichen Sorgfalt und Aufmerksamkeit zu, die seit Jahrhunderten die nahöstliche Gastfreundschaft definiert.',
        story1: 'Nature Village widmet sich der Bereitstellung authentischer nahöstlicher Küche in einer warmen und einladenden Atmosphäre, in der sich jeder Gast wie zu Hause fühlt.',
        story2: 'Unsere Köche sind leidenschaftlich bei der Zubereitung traditioneller nahöstlicher Gerichte mit den besten Zutaten und jahrhundertealten Kochtechniken, die unser reiches kulinarisches Erbe feiern.',
        quote: 'Jedes Gericht wird mit Sorgfalt zubereitet und mit der Wärme nahöstlicher Gastfreundschaft serviert.',
        experience: 'Jahre Erfahrung',
        recipes: 'Traditionelle Rezepte',
        customers: 'Zufriedene Kunden',
        awards: 'Auszeichnungen Erhalten',
        features: {
          chefs: {
            title: 'Erfahrene Köche',
            description: 'Authentische nahöstliche Küche'
          },
          ingredients: {
            title: 'Frische Zutaten',
            description: 'Täglich garantierte Qualität'
          },
          service: {
            title: 'Herzlicher Service',
            description: 'Nahöstliche Gastfreundschaft'
          }
        },
        stats: {
          happyCustomers: 'Zufriedene Kunden',
          authenticDishes: 'Authentische Gerichte',
          customerRating: 'Kundenbewertung',
          freshIngredients: 'Frische Zutaten'
        }
      },
      gallery: {
        title: 'Galerie',
        subtitle: 'Eine visuelle Reise durch unsere kulinarische Kunst',
        viewAll: 'Alle Bilder Anzeigen',
        close: 'Schließen',
        previous: 'Zurück',
        next: 'Weiter',
        share: 'Teilen'
      },
      visit: {
        title: 'Besuchen Sie Uns',
        subtitle: 'Erleben Sie authentische nahöstliche Gastfreundschaft im Herzen der Stadt',
        address: 'Adresse',
        phone: 'Telefon',
        hours: 'Öffnungszeiten',
        getDirections: 'Route Anzeigen',
        callNow: 'Jetzt Anrufen',
        openingHours: {
          monday: 'Montag',
          tuesday: 'Dienstag',
          wednesday: 'Mittwoch',
          thursday: 'Donnerstag',
          friday: 'Freitag',
          saturday: 'Samstag',
          sunday: 'Sonntag',
          closed: 'Geschlossen'
        }
      },
      ui: {
        menu: 'Menü',
        reserve: 'Reservieren',
        callNow: 'Jetzt Anrufen',
        call: 'Anrufen',
        weAreOpen: 'Wir haben geöffnet',
        currentlyClosed: 'Derzeit geschlossen',
        live: 'LIVE',
        until: 'Bis',
        opens: 'Öffnet',
        activity: 'Aktivität'
      },
      reviews: {
        title: 'Was Unsere Gäste Sagen',
        subtitle: 'Bewertet mit 4.8/5 Sternen von über 572 zufriedenen Kunden auf Google-Bewertungen',
        cta: 'Schließen Sie sich über 572 zufriedenen Kunden an, die unsere authentische Küche lieben! Reservieren Sie heute Ihren Tisch und erleben Sie den Unterschied, den authentische nahöstliche Gastfreundschaft macht.',
        ctaButton: 'Ihren Tisch Jetzt Reservieren',
        ctaTitle: 'Bereit, Ihr 5-Sterne-Erlebnis zu Schaffen?',
        trustIndicators: {
          googleRating: '4.8★ Google-Bewertung',
          totalReviews: '572+ Bewertungen'
        },
        review1: {
          name: 'Anna Mueller',
          text: '"Ich komme seit etwa einem Jahr hierher, und es ist zweifellos mein Lieblingsrestaurant! Das Essen ist authentisch und absolut köstlich - jedes Gericht steckt voller Geschmack, die speziellen Tees und Kaffees sind erstaunlich, und die Desserts sind der perfekte Abschluss jeder Mahlzeit."',
          location: 'Verifizierte Google-Bewertung',
          time: 'Vor 1 Woche'
        },
        review2: {
          name: 'Klaus Weber',
          text: '"Wir hatten heute Abend eine wunderbare Zeit im Restaurant Nature Village! Alles war absolut perfekt! Das Essen, die Atmosphäre, die Dekoration und der Service sind alle auf höchstem Niveau. Das ist definitiv unser neuer Lieblingsort für authentische nahöstliche Küche."',
          location: 'Lokaler Guide • 29 Bewertungen',
          time: 'Vor 2 Monaten'
        },
        review3: {
          name: 'Petra Richter',
          text: '"Ich bestellte Quzi, ein Reis- und Lammgericht, es war sehr sättigend und lecker. Die Pizza war gut bemessen und mit Gyro-Fleisch, Käse und guter Sauce gefüllt. Die authentischen nahöstlichen Aromen haben mich und meine Familie wirklich begeistert!"',
          location: 'Verifizierte Google-Bewertung',
          time: 'Kürzlich'
        },
        badges: {
          featured: 'EMPFOHLEN',
          localGuide: 'LOKALER GUIDE',
          quziLover: 'QUZI-LIEBHABER'
        }
      },
      featured: {
        title: 'Empfohlene Gerichte',
        subtitle: 'Entdecken Sie unsere beliebtesten nahöstlichen Spezialitäten, zubereitet mit traditionellen Rezepten und moderner Präsentation'
      },
      celebration: {
        title: 'Feiern Sie Ihre Besonderen Momente',
        subtitle: 'Machen Sie Ihre Geburtstage, Jahrestage und besonderen Anlässe unvergesslich mit authentischer nahöstlicher Gastfreundschaft',
        familyReunions: 'Familientreffen',
        graduations: 'Abschlussfeiern',
        engagements: 'Verlobungen', 
        holidays: 'Feiertage',
        birthday: {
          title: 'Geburtstagsfeiern',
          tagline: 'Süße Momente werden besonders gemacht',
          feature1: 'Kostenloses Geburtstags-Dessert',
          feature2: 'Geburtstagslied und Wünsche',
          feature3: 'Unvergessliches Esserlebnis',
          special: 'Perfekt zum Feiern eines weiteren Lebensjahres'
        },
        anniversary: {
          title: 'Jubiläums-Dinner',
          tagline: 'Feiern Sie Ihre Liebesgeschichte',
          feature1: 'Romantische Tischgestaltung mit Rosen',
          feature2: 'Kostenloses Dessert für zwei',
          feature3: 'Kerzenlicht-Dinner-Erlebnis',
          feature4: 'Personalisierte Jubiläumskarte',
          special: '25+ Jahre zusammen? Eine besondere Überraschung wartet!'
        },
        cta: {
          title: 'Bereit zu Feiern?',
          subtitle: 'Lassen Sie uns Ihren besonderen Tag mit authentischer nahöstlicher Gastfreundschaft und unvergesslichen Aromen außergewöhnlich machen',
          reserve: 'Für spezielle Reservierung anrufen',
          bookingAdvice: 'Buchen Sie 48 Stunden im Voraus für das beste Feiererlebnis'
        }
      },
      tags: {
        vegetarian: '🌱 Vegetarisch',
        vegan: '🌿 Vegan',
        spicy: '🌶️ Scharf',
        sweet: '🍯 Süß',
        traditional: '🏛️ Traditionell',
        grilled: '🔥 Gegrillt',
        'comfort food': '🍲 Hausmannskost',
        soup: '🍜 Suppe',
        stew: '🥘 Eintopf'
      },
      addToCart: 'In den Warenkorb',
      loading: 'Laden...',
      error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
      currency: '$',
      footer: {
        description: 'Authentische nahöstliche Aromen und warme Gastfreundschaft an Ihren Tisch bringen. Jedes Gericht ist eine Feier unseres reichen kulturellen Erbes und kulinarischer Exzellenz.',
        quickLinks: 'Schnelle Links',
        contactInfo: 'Kontaktinformationen',
        followUs: 'Folgen Sie Uns',
        openDaily: 'Sonntag - Donnerstag: 12:00 - 22:00\nFreitag - Samstag: 12:00 - 23:00',
        poweredBy: 'Powered by',
        blunari: 'Blunari',
        copyright: `© ${new Date().getFullYear()} Nature Village Restaurant. Alle Rechte vorbehalten.`,
        privacy: 'Datenschutzrichtlinie',
        terms: 'Nutzungsbedingungen'
      }
    },
    bn: {
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
      hero: {
        title: 'নেচার ভিলেজ',
        subtitle: 'প্রতিটি কামড়ে মধ্যপ্রাচ্যের স্বাদ',
        description: 'উষ্ণ, ঐতিহ্যবাহী পরিবেশে খাঁটি মধ্যপ্রাচ্যীয় স্বাদের অভিজ্ঞতা নিন যেখানে প্রতিটি খাবার আমাদের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য এবং প্রজন্মের পর প্রজন্ম ধরে চলে আসা রন্ধনসম্পর্কীয় ঐতিহ্যের গল্প বলে।',
        cta1: 'মেনু দেখুন',
        cta2: 'সংরক্ষণ করুন'
      },
      menu: {
        title: 'আমাদের মেনু',
        subtitle: 'Blunari দ্বারা চালিত - উন্নত ডাইনিং অভিজ্ঞতার জন্য বুদ্ধিমান OS',
        filters: {
          all: 'সকল আইটেম',
          traditional: 'ঐতিহ্যবাহী',
          vegetarian: 'নিরামিষ',
          vegan: 'ভেগান',
          soup: 'স্যুপ',
          dessert: 'ডেজার্ট',
          popular: 'সবচেয়ে জনপ্রিয়'
        },
        viewFull: 'সম্পূর্ণ মেনু দেখুন',
        noItems: 'এই বিভাগে কোনো আইটেম পাওয়া যায়নি।'
      },
      about: {
        title: 'আমাদের গল্প',
        badge: 'আমাদের গল্প',
        subtitle: 'আমাদের সম্প্রদায়ে খাঁটি মধ্যপ্রাচ্যীয় স্বাদ এবং উষ্ণ আতিথেয়তা নিয়ে আসা',
        content: 'নেচার ভিলেজ একটি স্বপ্ন থেকে জন্ম নিয়েছে বিশ্বের সাথে মধ্যপ্রাচ্যের খাঁটি স্বাদ এবং উষ্ণ আতিথেয়তা ভাগাভাগি করার। আমাদের পারিবারিক রেসিপিগুলি প্রজন্মের পর প্রজন্ম ধরে চলে এসেছে, প্রতিটি খাবার ভালোবাসা এবং আমাদের সাংস্কৃতিক ঐতিহ্যের প্রতি সম্মানের সাথে তৈরি। আমরা সেরা উপাদান সংগ্রহ করি এবং প্রতিটি খাবার একই যত্ন এবং মনোযোগ দিয়ে প্রস্তুত করি যা শতাব্দী ধরে মধ্যপ্রাচ্যীয় আতিথেয়তাকে সংজ্ঞায়িত করেছে।',
        story1: 'নেচার ভিলেজ আপনার কাছে মধ্যপ্রাচ্যীয় রন্ধনশৈলীর খাঁটি স্বাদ নিয়ে আসতে প্রতিশ্রুতিবদ্ধ একটি উষ্ণ এবং স্বাগত পরিবেশে যেখানে প্রতিটি অতিথি পরিবারের মতো অনুভব করে।',
        story2: 'আমাদের শেফরা ঐতিহ্যবাহী মধ্যপ্রাচ্যীয় খাবার প্রস্তুত করতে আগ্রহী যা আমাদের সমৃদ্ধ রন্ধনসম্পর্কীয় ঐতিহ্য উদযাপন করে এমন সেরা উপাদান এবং সময়-সম্মানিত রান্নার কৌশল ব্যবহার করে।',
        quote: 'প্রতিটি খাবার যত্নের সাথে তৈরি এবং মধ্যপ্রাচ্যীয় আতিথেয়তার উষ্ণতার সাথে পরিবেশিত।',
        experience: 'বছরের অভিজ্ঞতা',
        recipes: 'ঐতিহ্যবাহী রেসিপি',
        customers: 'খুশি গ্রাহক',
        awards: 'পুরস্কার জিতেছে',
        features: {
          chefs: {
            title: 'বিশেষজ্ঞ শেফ',
            description: 'খাঁটি মধ্যপ্রাচ্যীয় রন্ধনশৈলী'
          },
          ingredients: {
            title: 'তাজা উপাদান',
            description: 'প্রতিদিন মানসম্পন্ন সংগ্রহ'
          },
          service: {
            title: 'উষ্ণ সেবা',
            description: 'মধ্যপ্রাচ্যীয় আতিথেয়তা'
          }
        },
        stats: {
          happyCustomers: 'খুশি গ্রাহক',
          authenticDishes: 'খাঁটি খাবার',
          customerRating: 'গ্রাহক রেটিং',
          freshIngredients: 'তাজা উপাদান'
        }
      },
      gallery: {
        title: 'আমাদের গ্যালারি',
        subtitle: 'আমাদের খাবার এবং পরিবেশের একটি দৃশ্যমান যাত্রা',
        categories: {
          all: 'সকল ছবি',
          dishes: 'বিশেষ খাবার',
          atmosphere: 'রেস্তোরাঁর পরিবেশ',
          desserts: 'মিষ্টি খাবার'
        },
        viewMore: 'আরো দেখুন',
        loading: 'লোড হচ্ছে...'
      },
      visit: {
        title: 'আমাদের দেখুন',
        subtitle: 'আমাদের উষ্ণ এবং আমন্ত্রণমূলক স্থানে আসুন',
        address: 'ঠিকানা',
        hours: 'খোলার সময়',
        contact: 'যোগাযোগ',
        directions: 'দিকনির্দেশনা পান',
        call: 'কল করুন',
        weekdays: 'রবি - বৃহস্পতি',
        weekends: 'শুক্র - শনি',
        closed: 'বন্ধ',
        phone: '(470) 639-8696',
        addressText: '৩৪৭৫ লসন ব্লভিডি, সুওয়ানি, GA ৩০০২৪',
        status: {
          open: 'এখন খোলা',
          closed: 'এখন বন্ধ',
          closing: 'শীঘ্রই বন্ধ',
          opening: 'শীঘ্রই খোলা'
        },
        busyLevel: {
          low: 'ব্যস্ত নয়',
          medium: 'মাঝারি',
          high: 'ব্যস্ত',
          'very-high': 'খুব ব্যস্ত'
        }
      },
      catering: {
        title: 'ক্যাটারিং সেবা',
        subtitle: 'আপনার বিশেষ অনুষ্ঠানের জন্য খাঁটি মধ্যপ্রাচ্যীয় স্বাদ',
        description: 'আমাদের ব্যাপক ক্যাটারিং সেবার সাথে আপনার অনুষ্ঠানকে অবিস্মরণীয় করে তুলুন। আমরা ছোট সমাবেশ থেকে বড় উৎসব পর্যন্ত সবকিছুর জন্য খাঁটি মধ্যপ্রাচ্যীয় খাবার সরবরাহ করি।',
        features: {
          title: 'কেন আমাদের ক্যাটারিং বেছে নিবেন?',
          items: [
            'প্রতিটি খাবার তাজা প্রস্তুত',
            'ডায়েটারি প্রয়োজনীয়তার জন্য কাস্টমাইজেশন',
            'পেশাদার ডেলিভারি এবং সেটআপ',
            'প্রতিযোগিতামূলক মূল্য',
            'অভিজ্ঞ ক্যাটারিং দল'
          ]
        },
        contact: 'আজই যোগাযোগ করুন',
        phone: '(470) 639-8696'
      },
      footer: {
        description: 'আপনার টেবিলে খাঁটি মধ্যপ্রাচ্যীয় স্বাদ এবং উষ্ণ আতিথেয়তা নিয়ে আসা। প্রতিটি খাবার আমাদের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য এবং রন্ধনসম্পর্কীয় উৎকর্ষতার উদযাপন।',
        quickLinks: 'দ্রুত লিংক',
        contactInfo: 'যোগাযোগের তথ্য',
        followUs: 'আমাদের অনুসরণ করুন',
        openDaily: 'রবি - বৃহস্পতি: ১২:০০ - ২২:০০\nশুক্র - শনি: ১২:০০ - ২৩:০০',
        poweredBy: 'চালিত',
        blunari: 'ব্লুনারি',
        copyright: `© ${new Date().getFullYear()} নেচার ভিলেজ রেস্তোরাঁ। সর্বস্বত্ব সংরক্ষিত।`,
        privacy: 'গোপনীয়তা নীতি',
        terms: 'ব্যবহারের শর্তাবলী'
      },
      ui: {
        callNow: 'এখনই কল করুন',
        call: 'কল',
        orderOnline: 'অনলাইন অর্ডার',
        restaurant: 'রেস্তোরাঁ',
        familyOwned: 'পারিবারিক মালিকানাধীন',
        halalCertified: 'হালাল সার্টিফাইড',
        googleReviews: 'গুগল রিভিউ',
        averageRating: 'গড় রেটিং',
        fiveStarReviews: '৫-স্টার রিভিউ',
        verifiedPurchase: 'যাচাইকৃত ক্রয়',
        trustedReviewer: 'বিশ্বস্ত রিভিউয়ার',
        foodEnthusiast: 'খাবার উৎসাহী',
        menu: 'মেনু',
        reserve: 'সংরক্ষণ',
        bookTable: 'টেবিল বুক করুন',
        viewMenu: 'মেনু দেখুন',
        makeReservation: 'সংরক্ষণ করুন',
        openStatus: 'এখন খোলা',
        closedStatus: 'এখন বন্ধ',
        busyStatus: 'ব্যস্ততার মাত্রা',
        activity: 'কার্যকলাপ',
        until: 'পর্যন্ত',
        quiteBusy: 'বেশ ব্যস্ত',
        weAreOpen: 'আমরা খোলা',
        currentlyClosed: 'বর্তমানে বন্ধ',
        live: 'লাইভ',
        opens: 'খোলে'
      },
      status: {
        weAreOpen: 'আমরা খোলা',
        until: 'পর্যন্ত',
        activity: 'কার্যকলাপ',
        busy: 'ব্যস্ত',
        quiteBusy: 'বেশ ব্যস্ত'
      },
      featuredDishes: {
        title: 'বিশেষ খাবার',
        subtitle: 'আমাদের সবচেয়ে প্রিয় মধ্যপ্রাচ্যীয় বিশেষত্ব আবিষ্কার করুন'
      },
      reviews: {
        title: 'আমাদের অতিথিরা কী বলেন',
        subtitle: 'গুগল রিভিউতে ৫৭২+ খুশি গ্রাহকদের দ্বারা ৪.৮/৫ স্টার রেট করা হয়েছে',
        happyCustomers: 'খুশি গ্রাহক',
        averageRating: 'গড় রেটিং',
        fiveStarReviews: '৫-স্টার রিভিউ',
        ctaTitle: 'আপনার নিজস্ব ৫-স্টার অভিজ্ঞতা তৈরি করতে প্রস্তুত?',
        ctaSubtitle: '৫৭২+ সন্তুষ্ট গ্রাহকদের সাথে যোগ দিন যারা আমাদের খাঁটি রন্ধনশৈলী পছন্দ করেন! আজই আপনার টেবিল বুক করুন এবং খাঁটি মধ্যপ্রাচ্যীয় আতিথেয়তার পার্থক্য অনুভব করুন।',
        bookNow: 'এখনই টেবিল বুক করুন',
        callNow: '(৪৭০) ৩৫০-১০১৯ এ কল করুন',
        ctaButton: 'এখনই আপনার টেবিল বুক করুন',
        trustIndicators: {
          googleRating: '৪.৮★ গুগল রেটিং',
          totalReviews: '৫৭২+ রিভিউ'
        }
      },
      celebration: {
        title: 'আপনার বিশেষ মুহূর্তগুলি উদযাপন করুন',
        subtitle: 'খাঁটি মধ্যপ্রাচ্যীয় আতিথেয়তার সাথে আপনার জন্মদিন, বার্ষিকী এবং বিশেষ অনুষ্ঠানগুলিকে অবিস্মরণীয় করে তুলুন',
        familyReunions: 'পারিবারিক পুনর্মিলন',
        graduations: 'স্নাতক',
        engagements: 'বাগদান',
        holidays: 'ছুটির দিন',
        birthday: {
          title: 'জন্মদিন উদযাপন',
          tagline: 'মিষ্টি মুহূর্তগুলিকে বিশেষ করে তোলা',
          feature1: 'বিনামূল্যে জন্মদিনের ডেজার্ট',
          feature2: 'জন্মদিনের গান এবং শুভেচ্ছা',
          feature3: 'স্মরণীয় ডাইনিং অভিজ্ঞতা',
          special: 'জীবনের আরেকটি বছর উদযাপনের জন্য নিখুঁত'
        },
        anniversary: {
          title: 'বার্ষিকী ডিনার',
          tagline: 'আপনার ভালোবাসার গল্প উদযাপন করুন',
          feature1: 'গোলাপের সাথে রোমান্টিক টেবিল সেটআপ',
          feature2: 'দুজনের জন্য বিনামূল্যে ডেজার্ট',
          feature3: 'মোমবাতির আলোয় ডাইনিং অভিজ্ঞতা',
          feature4: 'ব্যক্তিগতকৃত বার্ষিকী কার্ড',
          special: '২৫+ বছর একসাথে? বিশেষ সারপ্রাইজ অপেক্ষা করছে!'
        },
        cta: {
          title: 'উদযাপন করতে প্রস্তুত?',
          subtitle: 'আমাদের খাঁটি মধ্যপ্রাচ্যীয় আতিথেয়তা এবং অবিস্মরণীয় স্বাদের সাথে আপনার বিশেষ দিনটিকে অসাধারণ করে তুলুন',
          reserve: 'বিশেষ সংরক্ষণের জন্য কল করুন',
          bookingAdvice: 'সেরা উদযাপনের অভিজ্ঞতার জন্য ৪৮ ঘন্টা আগে বুক করুন'
        }
      },
      featured: {
        title: 'বিশেষ খাবার',
        subtitle: 'আমাদের সবচেয়ে প্রিয় মধ্যপ্রাচ্যীয় বিশেষত্ব আবিষ্কার করুন'
      },
      tags: {
        'signature dish': '🌟 বিশেষ খাবার',
        vegetarian: '🌱 নিরামিষ',
        vegan: '🌿 ভেগান',
        'gluten-free': '🌾 গ্লুটেন মুক্ত',
        spicy: '🌶️ ঝাল',
        'chef special': '👨‍🍳 শেফের বিশেষ',
        popular: '⭐ জনপ্রিয়',
        'house favorite': '❤️ ঘরের প্রিয়',
        traditional: '🏛️ ঐতিহ্যবাহী',
        'comfort food': '🍲 আরামদায়ক খাবার',
        soup: '🍜 স্যুপ',
        stew: '🥘 স্ট্যু'
      },
      addToCart: 'কার্টে যোগ করুন',
      loading: 'লোড হচ্ছে...',
      error: 'কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      currency: '$'
    },
    ko: {
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
      hero: {
        title: '네이처 빌리지',
        subtitle: '한 입마다 중동의 맛',
        description: '따뜻하고 전통적인 분위기에서 정통 중동 요리를 경험하세요. 모든 요리는 우리의 풍부한 문화 유산과 대대로 전해내려온 요리 전통의 이야기를 담고 있습니다.',
        cta1: '메뉴 보기',
        cta2: '예약하기'
      },
      menu: {
        title: '메뉴',
        subtitle: 'Blunari 기반 - 향상된 다이닝 경험을 위한 인텔리전트 OS',
        filters: {
          all: '전체 메뉴',
          traditional: '전통 요리',
          vegetarian: '채식',
          vegan: '비건',
          soup: '스프',
          dessert: '디저트',
          popular: '인기 메뉴'
        },
        viewFull: '전체 메뉴 보기',
        noItems: '이 카테고리에서 찾은 항목이 없습니다.'
      },
      about: {
        title: '우리 이야기',
        badge: '우리 이야기',
        subtitle: '정통 중동 요리와 따뜻한 환대를 지역사회에 전하기',
        content: '네이처 빌리지는 중동의 정통 맛과 따뜻한 환대를 세상과 나누고자 하는 꿈에서 시작되었습니다. 우리 가족의 레시피는 대대로 전해내려왔으며, 모든 요리는 우리 문화 전통에 대한 사랑과 존경으로 만들어집니다. 최고의 재료를 사용하고 수 세기 동안 중동 환대의 전통을 정의해온 세심한 관심과 배려로 모든 식사를 준비합니다.',
        story1: '네이처 빌리지는 모든 손님이 가족처럼 느껴지는 따뜻하고 환영하는 분위기에서 정통 중동 요리의 맛을 전해드리는 데 전념하고 있습니다.',
        story2: '우리 셰프들은 우리의 풍부한 요리 유산을 기념하는 최고의 재료와 전통적인 요리 기법을 사용하여 전통 중동 요리를 준비하는 데 열정을 쏟고 있습니다.',
        quote: '모든 요리는 정성으로 만들어지고 중동 환대의 따뜻함으로 제공됩니다.',
        experience: '년 경험',
        recipes: '전통 레시피',
        customers: '만족한 고객',
        awards: '수상 경력',
        features: {
          chefs: {
            title: '전문 셰프',
            description: '정통 중동 요리'
          },
          ingredients: {
            title: '신선한 재료',
            description: '매일 엄선된 품질'
          },
          service: {
            title: '따뜻한 서비스',
            description: '중동식 환대'
          }
        },
        stats: {
          happyCustomers: '만족한 고객',
          authenticDishes: '정통 요리',
          customerRating: '고객 평점',
          freshIngredients: '신선한 재료'
        }
      },
      gallery: {
        title: '갤러리',
        subtitle: '우리의 요리 유산과 레스토랑 분위기를 시각적으로 둘러보세요'
      },
      visit: {
        title: '방문하기',
        subtitle: '도심 한복판에서 저희를 만나보세요',
        hours: '영업시간',
        contact: '연락처',
        address: '주소',
        phone: '전화',
        makeReservation: '예약하기',
        getDirections: '길찾기'
      },
      ui: {
        callNow: '지금 전화',
        call: '전화',
        orderOnline: '온라인 주문',
        restaurant: '레스토랑',
        familyOwned: '가족 운영',
        halalCertified: '할랄 인증',
        googleReviews: '구글 리뷰',
        averageRating: '평균 평점',
        fiveStarReviews: '5성 리뷰',
        verifiedPurchase: '검증된 구매',
        trustedReviewer: '신뢰할 수 있는 리뷰어',
        foodEnthusiast: '음식 애호가',
        menu: '메뉴',
        reserve: '예약',
        weAreOpen: '영업 중',
        currentlyClosed: '현재 휴무',
        live: '라이브',
        until: '까지',
        opens: '오픈',
        activity: '활동'
      },
      reviews: {
        title: '고객 후기',
        subtitle: '구글 리뷰에서 572명 이상의 만족한 고객들이 4.8/5점으로 평가',
        cta: '정통 요리를 사랑하는 572명 이상의 만족한 고객들과 함께하세요! 오늘 테이블을 예약하고 정통 중동 환대가 만드는 차이를 맛보세요.',
        ctaButton: '지금 테이블 예약하기',
        ctaTitle: '나만의 5성급 경험을 만들 준비가 되셨나요?',
        trustIndicators: {
          googleRating: '4.8★ 구글 평점',
          totalReviews: '572+ 리뷰'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"약 1년 동안 이곳에 오고 있는데, 정말 제가 가장 좋아하는 레스토랑입니다! 음식이 정통이고 정말 맛있어요—모든 요리가 풍미가 가득하고, 특별한 차와 커피가 훌륭하며, 디저트는 어떤 식사든 완벽하게 마무리해줍니다."',
          location: '검증된 구글 리뷰',
          time: '1주 전'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"오늘 밤 네이처 빌리지 레스토랑에서 멋진 시간을 보냈습니다! 모든 것이 정말 완벽했어요! 음식, 분위기, 장식, 서비스 모든 것이 최고 수준입니다. 정통 중동 요리를 위한 새로운 즐겨찾는 장소가 될 것 같아요."',
          location: '로컬 가이드 • 29개 리뷰',
          time: '2개월 전'
        },
        review3: {
          name: '구글 고객',
          text: '"쿠지라는 밥과 양고기 요리를 주문했는데, 정말 든든하고 맛있었습니다. 피자는 자이로 고기, 치즈, 좋은 소스로 가득 찬 적당한 크기였어요. 정통 중동 요리의 맛이 저와 제 가족에게 정말 인상적이었습니다!"',
          location: '검증된 구글 리뷰',
          time: '최근'
        },
        badges: {
          featured: '특별 추천',
          localGuide: '로컬 가이드',
          quziLover: '쿠지 애호가'
        }
      },
      featured: {
        title: '추천 요리',
        subtitle: '전통 레시피와 현대적 프레젠테이션으로 만든 가장 사랑받는 중동 특선 요리를 만나보세요'
      },
      celebration: {
        title: '특별한 순간을 축하하세요',
        subtitle: '정통 중동 환대로 생일, 기념일, 특별한 날을 잊을 수 없게 만드세요',
        familyReunions: '가족 모임',
        graduations: '졸업식',
        engagements: '약혼식',
        holidays: '명절',
        birthday: {
          title: '생일 축하',
          tagline: '달콤한 순간을 특별하게',
          feature1: '무료 생일 디저트',
          feature2: '생일 축하 노래와 축하 인사',
          feature3: '기억에 남는 식사 경험',
          special: '또 다른 해를 축하하기에 완벽한 곳'
        },
        anniversary: {
          title: '기념일 만찬',
          tagline: '당신의 사랑 이야기를 축하하세요',
          feature1: '장미와 함께하는 로맨틱 테이블 세팅',
          feature2: '2인용 무료 디저트',
          feature3: '촛불이 켜진 식사 경험',
          feature4: '개인 맞춤 기념일 카드',
          special: '25년 이상 함께하셨나요? 특별한 서프라이즈가 기다립니다!'
        },
        cta: {
          title: '축하할 준비가 되셨나요?',
          subtitle: '정통 중동 환대와 잊을 수 없는 맛으로 특별한 날을 더욱 특별하게 만들어드리겠습니다',
          reserve: '특별 예약 전화',
          bookingAdvice: '최고의 축하 경험을 위해 48시간 전에 예약하세요'
        }
      },
      tags: {
        vegetarian: '🌱 채식',
        vegan: '� 비건',
        spicy: '🌶️ 매운맛',
        sweet: '🍯 달콤함',
        traditional: '🏛️ 전통',
        grilled: '🔥 구이',
        'comfort food': '🍲 컴포트 푸드',
        soup: '🍜 스프',
        stew: '🥘 스튜'
      },
      addToCart: '장바구니에 추가',
      loading: '로딩 중...',
      error: '문제가 발생했습니다. 다시 시도해주세요.',
      currency: '$'
    },
    bs: {
      nav: {
        home: 'Početna',
        menu: 'Meni',
        about: 'O nama',
        gallery: 'Galerija',
        visit: 'Posjetite nas',
        reservations: 'Rezervacije',
        catering: 'Catering',
        orderOnline: 'Naručite'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'Okus Bliskog istoka u svakom zalogaju',
        description: 'Doživite autentične okuse Bliskog istoka u toplom, tradicionalnom ambijentu gdje svako jelo priča priču o našem bogatom kulturnom naslijeđu i kulinarskim tradicijama prenošenim kroz generacije.',
        cta1: 'Pogledaj meni',
        cta2: 'Rezerviši mjesto'
      },
      menu: {
        title: 'Naš meni',
        subtitle: 'Pokretano od Blunari - Inteligentni OS za poboljšano iskustvo objedovanja',
        filters: {
          all: 'Svi proizvodi',
          traditional: 'Tradicionalno',
          vegetarian: 'Vegetarijanski',
          vegan: 'Veganski',
          soup: 'Supe',
          dessert: 'Deserti',
          popular: 'Najpopularniji'
        },
        viewFull: 'Pogledaj cijeli meni',
        noItems: 'Nema stavki u ovoj kategoriji.'
      },
      about: {
        title: 'Naša priča',
        badge: 'Naša priča',
        subtitle: 'Donosimo autentične okuse Bliskog istoka i toplu gostoljubivost našoj zajednici',
        content: 'Nature Village je rođen iz sna da podijelimo autentične okuse i toplu gostoljubivost Bliskog istoka sa svijetom. Naši porodični recepti prenošeni su kroz generacije, svako jelo pripravljeno s ljubavlju i poštovanjem naših kulturnih tradicija. Nabavljamo najkvalitetnije sastojke i pripremamo svaki obrok s istom pažnjom i brigom koja definiše gostoljubivost Bliskog istoka stoljećima.',
        story1: 'Nature Village posvećen je donošenju autentičnih okusa kuhinje Bliskog istoka u toplom i dobrodošlom ambijentu gdje se svaki gost osjeća kao porodica.',
        story2: 'Naši kuvari strastveno pripremaju tradicionalna jela Bliskog istoka koristenajkvalitetnije sastojke i vremenom provjerene tehnike kuvanja koje slave naše bogato kulinarske naslijeđe.',
        quote: 'Svako jelo je pripravljeno s pažnjom i služeno s toplinom gostoljubivosti Bliskog istoka.',
        experience: 'godine iskustva',
        recipes: 'tradicionalni recepti',
        customers: 'zadovoljni kupci',
        awards: 'osvojene nagrade',
        features: {
          chefs: {
            title: 'Stručni kuvari',
            description: 'Autentična kuhinja Bliskog istoka'
          },
          ingredients: {
            title: 'Svježi sastojci',
            description: 'Kvaliteta nabavljena dnevno'
          },
          service: {
            title: 'Topla usluga',
            description: 'Gostoljubivost Bliskog istoka'
          }
        },
        stats: {
          happyCustomers: 'zadovoljni kupci',
          authenticDishes: 'autentična jela',
          customerRating: 'ocjena kupaca',
          freshIngredients: 'svježi sastojci'
        }
      },
      gallery: {
        title: 'Galerija',
        subtitle: 'Vizuelno putovanje kroz naše kulinarske naslijeđe i atmosferu restorana'
      },
      visit: {
        title: 'Posjetite nas',
        subtitle: 'Pronađite nas u srcu grada',
        hours: 'Radno vrijeme',
        contact: 'Kontakt informacije',
        address: 'Adresa',
        phone: 'Telefon',
        makeReservation: 'Rezerviši',
        getDirections: 'Upute za dolazak'
      },
      ui: {
        callNow: 'Pozovi sada',
        call: 'Pozovi',
        orderOnline: 'Naruči online',
        restaurant: 'Restoran',
        familyOwned: 'Porodični restoran',
        halalCertified: 'Halal certificiran',
        googleReviews: 'Google recenzije',
        averageRating: 'Prosječna ocjena',
        fiveStarReviews: '5-zvjezdane recenzije',
        verifiedPurchase: 'Potvrđena kupovina',
        trustedReviewer: 'Povjerljiv recenzent',
        foodEnthusiast: 'Ljubitelj hrane',
        menu: 'Meni',
        reserve: 'Rezerviši',
        weAreOpen: 'Otvoreni smo',
        currentlyClosed: 'Trenutno zatvoreni',
        live: 'UŽIVO',
        until: 'do',
        opens: 'otvara',
        activity: 'aktivnost'
      },
      reviews: {
        title: 'Što naši gosti kažu',
        subtitle: 'Ocjena 4.8/5 zvjezdica od 572+ zadovoljnih kupaca na Google recenzijama',
        cta: 'Pridružite se sa 572+ zadovoljnih kupaca koji vole našu autentičnu kuhinju! Rezervirajte svoj stol danas i okušajte razliku koju pravi autentična gostoljubivost Bliskog istoka.',
        ctaButton: 'Rezerviraj stol sada',
        ctaTitle: 'Spremni za kreiranje vlastitog 5-zvjezdanog iskustva?',
        trustIndicators: {
          googleRating: '4.8★ Google ocjena',
          totalReviews: '572+ recenzije'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"Dolazim ovdje već godinu dana i to je definitivno moj omiljeni restoran! Hrana je autentična i apsolutno ukusna—svako jelo je puno okusa, specijalni čajevi i kafe su nevjerojatn, a deserti su savršen završetak bilo kojeg obroka."',
          location: 'Potvrđena Google recenzija',
          time: 'prije 1 sedmicu'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"Večeras smo se divno proveli u Nature Village restoranu! Sve je bilo apsolutno savršeno! Hrana, atmosfera, dekor i usluga su sve na vrhunskom nivou. Ovo je definitivno naše novo omiljeno mjesto za autentičnu kuhinju Bliskog istoka."',
          location: 'Lokalni vodič • 29 recenzija',
          time: 'prije 2 mjeseca'
        },
        review3: {
          name: 'Google kupac',
          text: '"Naručio sam Quzi, jelo od riže i janjetine, bilo je vrlo zasitno i ukusno. Pizza je bila dobre veličine puna mesa giros, sira i lijepog sosa. Autentični okusi Bliskog istoka stvarno su impresionirali mene i moju porodicu!"',
          location: 'Potvrđena Google recenzija',
          time: 'nedavno'
        },
        badges: {
          featured: 'ISTAKNUTO',
          localGuide: 'LOKALNI VODIČ',
          quziLover: 'LJUBITELJ QUZI'
        }
      },
      featured: {
        title: 'Istaknuta jela',
        subtitle: 'Otkrijte naša najvoljenija jela Bliskog istoka, pripremljena tradicionalnim receptima i modernom prezentacijom'
      },
      celebration: {
        title: 'Proslavite svoje posebne trenutke',
        subtitle: 'Učinite svoje rođendane, godišnjice i posebne prilike nezaboravnim autentičnom gostoljubivošću Bliskog istoka',
        familyReunions: 'Porodični okupljanja',
        graduations: 'Diplomiranja',
        engagements: 'Verenice',
        holidays: 'Praznici',
        birthday: {
          title: 'Proslava rođendana',
          tagline: 'Slatki trenuci učinjeni posebnima',
          feature1: 'Besplatni rođendanski desert',
          feature2: 'Pesma srećan rođendan i čestitke',
          feature3: 'Nezaboravno iskustvo objedovanja',
          special: 'Savršeno za proslavu još jedne godine života'
        },
        anniversary: {
          title: 'Godišnjice večere',
          tagline: 'Proslavite svoju priču ljubavi',
          feature1: 'Romantičan stol s ružama',
          feature2: 'Besplatni desert za dvoje',
          feature3: 'Večera pri svijećama',
          feature4: 'Personalizovana čestitka za godišnjicu',
          special: '25+ godina zajedno? Posebno iznenađenje vas čeka!'
        },
        cta: {
          title: 'Spremni za proslavu?',
          subtitle: 'Dozvolite nam da vaš poseban dan učinimo izuzetnim autentičnom gostoljubivošću Bliskog istoka i nezaboravnim okusima',
          reserve: 'Pozovite za posebnu rezervaciju',
          bookingAdvice: 'Rezervirajte 48 sati unaprijed za najbolje iskustvo proslave'
        }
      },
      tags: {
        vegetarian: '🌱 Vegetarijanski',
        vegan: '🌿 Veganski',
        spicy: '🌶️ Ljut',
        sweet: '🍯 Sladak',
        traditional: '🏛️ Tradicionalan',
        grilled: '🔥 Na žaru',
        'comfort food': '🍲 Comfort hrana',
        soup: '🍜 Supa',
        stew: '🥘 Gulaš'
      },
      addToCart: 'Dodaj u korpu',
      loading: 'Učitava...',
      error: 'Dogodila se greška. Molimo pokušajte ponovo.',
      currency: '$'
    },
    zh: {
      nav: {
        home: '首页',
        menu: '菜单',
        about: '关于我们',
        gallery: '图库',
        visit: '访问我们',
        reservations: '预订',
        catering: '餐饮服务',
        orderOnline: '在线订购'
      },
      hero: {
        title: 'Nature Village',
        subtitle: '每一口都是中东风味',
        description: '在温馨传统的环境中体验正宗的中东美味，每一道菜品都诉说着我们丰富的文化遗产和代代相传的烹饪传统故事。',
        cta1: '查看菜单',
        cta2: '预订座位'
      },
      menu: {
        title: '我们的菜单',
        subtitle: '由 Blunari 提供支持 - 智能操作系统，提升用餐体验',
        filters: {
          all: '全部',
          traditional: '传统',
          vegetarian: '素食',
          vegan: '纯素',
          soup: '汤类',
          dessert: '甜品',
          popular: '最受欢迎'
        },
        viewFull: '查看完整菜单',
        noItems: '此类别中没有项目。'
      },
      about: {
        title: '我们的故事',
        badge: '我们的故事',
        subtitle: '将正宗的中东风味和温馨的热情好客带给我们的社区',
        content: 'Nature Village 诞生于与世界分享正宗中东风味和温馨热情好客的梦想。我们的家族食谱代代相传，每一道菜都以爱心和对文化传统的尊重精心制作。我们采购最优质的食材，以几个世纪以来定义中东热情好客的同样关怀和细致态度准备每一餐。',
        story1: 'Nature Village 致力于在温馨宜人的环境中带来正宗的中东美食，让每位客人都感受到家的温暖。',
        story2: '我们的厨师们热情地使用最优质的食材和经过时间考验的烹饪技术准备传统中东菜肴，庆祝我们丰富的烹饪传承。',
        quote: '每一道菜都精心制作，以中东热情好客的温暖服务。',
        experience: '年经验',
        recipes: '传统食谱',
        customers: '满意客户',
        awards: '获得奖项',
        features: {
          chefs: {
            title: '专业厨师',
            description: '正宗中东美食'
          },
          ingredients: {
            title: '新鲜食材',
            description: '每日采购的优质食材'
          },
          service: {
            title: '温馨服务',
            description: '中东式热情好客'
          }
        },
        stats: {
          happyCustomers: '满意客户',
          authenticDishes: '正宗菜肴',
          customerRating: '客户评分',
          freshIngredients: '新鲜食材'
        }
      },
      gallery: {
        title: '图库',
        subtitle: '通过我们的烹饪传承和餐厅氛围进行视觉之旅'
      },
      visit: {
        title: '访问我们',
        subtitle: '在市中心找到我们',
        hours: '营业时间',
        contact: '联系信息',
        address: '地址',
        phone: '电话',
        makeReservation: '预订',
        getDirections: '获取路线'
      },
      ui: {
        callNow: '立即致电',
        call: '致电',
        orderOnline: '在线订购',
        restaurant: '餐厅',
        familyOwned: '家族经营',
        halalCertified: '清真认证',
        googleReviews: 'Google 评论',
        averageRating: '平均评分',
        fiveStarReviews: '5星评论',
        verifiedPurchase: '已验证购买',
        trustedReviewer: '信任评论者',
        foodEnthusiast: '美食爱好者',
        menu: '菜单',
        reserve: '预订',
        weAreOpen: '我们营业中',
        currentlyClosed: '目前关闭',
        live: '实时',
        until: '直到',
        opens: '开放',
        activity: '活动'
      },
      reviews: {
        title: '我们的客人怎么说',
        subtitle: 'Google 评论中 572+ 满意客户给出 4.8/5 星评分',
        cta: '加入 572+ 喜爱我们正宗美食的满意客户！今天就预订您的餐桌，品尝正宗中东热情好客的不同之处。',
        ctaButton: '立即预订餐桌',
        ctaTitle: '准备好创造您自己的 5 星体验了吗？',
        trustIndicators: {
          googleRating: '4.8★ Google 评分',
          totalReviews: '572+ 评论'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"我来这里已经一年了，这绝对是我最喜欢的餐厅！食物正宗且绝对美味——每一道菜都充满风味，特色茶和咖啡令人惊叹，甜点是任何一餐的完美结尾。"',
          location: '已验证 Google 评论',
          time: '1周前'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"今晚我们在 Nature Village 餐厅度过了美好的时光！一切都绝对完美！食物、氛围、装饰和服务都是一流的。这绝对是我们新的最爱，提供正宗的中东美食。"',
          location: '本地向导 • 29 条评论',
          time: '2个月前'
        },
        review3: {
          name: 'Google 客户',
          text: '"我点了 Quzi，一道米饭和羊肉菜，非常饱腹且美味。披萨大小适中，里面满是旋转烤肉、奶酪和美味的酱汁。正宗的中东风味真的给我和我的家人留下了深刻印象！"',
          location: '已验证 Google 评论',
          time: '最近'
        },
        badges: {
          featured: '特色',
          localGuide: '本地向导',
          quziLover: 'QUZI 爱好者'
        }
      },
      featured: {
        title: '特色菜肴',
        subtitle: '发现我们最受喜爱的中东特色菜，以传统食谱和现代呈现方式制作'
      },
      celebration: {
        title: '庆祝您的特殊时刻',
        subtitle: '以正宗的中东热情好客让您的生日、周年纪念和特殊场合难忘',
        familyReunions: '家庭聚会',
        graduations: '毕业典礼',
        engagements: '订婚',
        holidays: '节假日',
        birthday: {
          title: '生日庆祝',
          tagline: '让甜蜜时刻变得特别',
          feature1: '免费生日甜点',
          feature2: '生日歌和祝贺',
          feature3: '难忘的用餐体验',
          special: '庆祝人生又一年的完美选择'
        },
        anniversary: {
          title: '周年纪念晚餐',
          tagline: '庆祝您的爱情故事',
          feature1: '玫瑰花浪漫餐桌布置',
          feature2: '双人免费甜点',
          feature3: '烛光晚餐',
          feature4: '个性化周年纪念祝贺',
          special: '25+ 年在一起？特别惊喜等着您！'
        },
        cta: {
          title: '准备庆祝了吗？',
          subtitle: '让我们以正宗的中东热情好客和难忘的风味让您的特殊日子变得非凡',
          reserve: '致电预订特殊场合',
          bookingAdvice: '请提前 48 小时预订以获得最佳庆祝体验'
        }
      },
      tags: {
        vegetarian: '🌱 素食',
        vegan: '🌿 纯素',
        spicy: '🌶️ 辣',
        sweet: '🍯 甜',
        traditional: '🏛️ 传统',
        grilled: '🔥 烧烤',
        'comfort food': '🍲 舒适食物',
        soup: '🍜 汤',
        stew: '🥘 炖菜'
      },
      addToCart: '加入购物车',
      loading: '加载中...',
      error: '发生错误。请重试。',
      currency: '¥'
    },
    ro: {
      nav: {
        home: 'Acasă',
        menu: 'Meniu',
        about: 'Despre Noi',
        gallery: 'Galerie',
        visit: 'Vizitează-ne',
        reservations: 'Rezervări',
        catering: 'Catering',
        orderOnline: 'Comandă Online'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'Gustul Orientului Mijlociu în fiecare înghițitură',
        description: 'Experimentează gusturile autentice din Orientul Mijlociu într-un ambient cald și tradițional, unde fiecare fel de mâncare spune o poveste despre moștenirea noastră culturală bogată și tradițiile culinare transmise prin generații.',
        cta1: 'Vezi Meniul',
        cta2: 'Rezervă o Masă'
      },
      menu: {
        title: 'Meniul Nostru',
        subtitle: 'Powered by Blunari - OS Inteligent pentru Experiență Culinară Îmbunătățită',
        filters: {
          all: 'Toate',
          traditional: 'Tradițional',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan',
          soup: 'Supe',
          dessert: 'Deserturi',
          popular: 'Populare'
        },
        viewFull: 'Vezi Meniul Complet',
        noItems: 'Nu există articole în această categorie.'
      },
      about: {
        title: 'Povestea Noastră',
        badge: 'Povestea Noastră',
        subtitle: 'Aducem gusturile autentice din Orientul Mijlociu și ospitalitatea caldă comunității noastre',
        content: 'Nature Village s-a născut din visul de a împărtăși gusturile autentice și ospitalitatea caldă din Orientul Mijlociu cu lumea. Rețetele noastre de familie au fost transmise prin generații, fiecare fel de mâncare fiind pregătit cu dragoste și respect pentru tradițiile noastre culturale. Ne aprovizionăm cu cele mai bune ingrediente și pregătim fiecare masă cu aceeași grijă și atenție care definește ospitalitatea din Orientul Mijlociu de secole.',
        story1: 'Nature Village se dedică aducerii gusturilor autentice din bucătăria Orientului Mijlociu într-un ambient cald și primitor unde fiecare oaspete se simte ca în familie.',
        story2: 'Bucătarii noștri pregătesc cu pasiune felurile tradiționale din Orientul Mijlociu folosind cele mai bune ingrediente și tehnici de gătit dovedite în timp care celebrează moștenirea noastră culinară bogată.',
        quote: 'Fiecare fel de mâncare este pregătit cu grijă și servit cu căldura ospitalității din Orientul Mijlociu.',
        experience: 'ani de experiență',
        recipes: 'rețete tradiționale',
        customers: 'clienți mulțumiți',
        awards: 'premii câștigate',
        features: {
          chefs: {
            title: 'Bucătari Experți',
            description: 'Bucătărie autentică din Orientul Mijlociu'
          },
          ingredients: {
            title: 'Ingrediente Proaspete',
            description: 'Calitate aprovizionată zilnic'
          },
          service: {
            title: 'Serviciu Cald',
            description: 'Ospitalitate din Orientul Mijlociu'
          }
        },
        stats: {
          happyCustomers: 'clienți mulțumiți',
          authenticDishes: 'feluri autentice',
          customerRating: 'rating clienți',
          freshIngredients: 'ingrediente proaspete'
        }
      },
      gallery: {
        title: 'Galerie',
        subtitle: 'O călătorie vizuală prin moștenirea noastră culinară și atmosfera restaurantului'
      },
      visit: {
        title: 'Vizitează-ne',
        subtitle: 'Găsește-ne în inima orașului',
        hours: 'Program de Lucru',
        contact: 'Informații de Contact',
        address: 'Adresă',
        phone: 'Telefon',
        makeReservation: 'Rezervă',
        getDirections: 'Indicații'
      },
      ui: {
        callNow: 'Sună Acum',
        call: 'Sună',
        orderOnline: 'Comandă Online',
        restaurant: 'Restaurant',
        familyOwned: 'Deținut de Familie',
        halalCertified: 'Certificat Halal',
        googleReviews: 'Recenzii Google',
        averageRating: 'Rating Mediu',
        fiveStarReviews: 'Recenzii 5 Stele',
        verifiedPurchase: 'Cumpărătură Verificată',
        trustedReviewer: 'Recenzor de Încredere',
        foodEnthusiast: 'Entuziast Culinar',
        menu: 'Meniu',
        reserve: 'Rezervă',
        weAreOpen: 'Suntem Deschiși',
        currentlyClosed: 'Momentan Închis',
        live: 'LIVE',
        until: 'până la',
        opens: 'deschide',
        activity: 'activitate'
      },
      reviews: {
        title: 'Ce Spun Oaspeții Noștri',
        subtitle: 'Evaluat cu 4.8/5 stele de către 572+ clienți mulțumiți pe recenziile Google',
        cta: 'Alătură-te celor 572+ clienți mulțumiți care iubesc bucătăria noastră autentică! Rezervă masa astăzi și simte diferența pe care o face ospitalitatea autentică din Orientul Mijlociu.',
        ctaButton: 'Rezervă Masa Acum',
        ctaTitle: 'Gata să îți creezi propria experiență de 5 stele?',
        trustIndicators: {
          googleRating: 'Rating Google 4.8★',
          totalReviews: '572+ recenzii'
        },
        review1: {
          name: 'Karen Cardenas',
          text: '"Vin aici de un an și este cu siguranță restaurantul meu preferat! Mâncarea este autentică și absolut delicioasă—fiecare fel este plin de aromă, ceaiurile și cafelele speciale sunt uimitoare, iar deserturile sunt sfârșitul perfect pentru orice masă."',
          location: 'Recenzie Google Verificată',
          time: 'acum 1 săptămână'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"Am avut o seară minunată la restaurantul Nature Village în această seară! Totul a fost absolut perfect! Mâncarea, atmosfera, decorul și serviciul sunt toate de top. Acesta este cu siguranță noul nostru loc preferat pentru bucătărie autentică din Orientul Mijlociu."',
          location: 'Ghid Local • 29 recenzii',
          time: 'acum 2 luni'
        },
        review3: {
          name: 'Client Google',
          text: '"Am comandat Quzi, un fel de orez și carne de miel, a fost foarte hrănitor și delicios. Pizza a fost de mărime bună plină cu carne gyros, brânză și un sos minunat. Gusturile autentice din Orientul Mijlociu ne-au impresionat cu adevărat pe mine și familia mea!"',
          location: 'Recenzie Google Verificată',
          time: 'recent'
        },
        badges: {
          featured: 'RECOMANDAT',
          localGuide: 'GHID LOCAL',
          quziLover: 'IUBITOR QUZI'
        }
      },
      featured: {
        title: 'Feluri Recomandate',
        subtitle: 'Descoperă specialitățile noastre preferate din Orientul Mijlociu, pregătite cu rețete tradiționale și prezentare modernă'
      },
      celebration: {
        title: 'Sărbătorește Momentele Tale Speciale',
        subtitle: 'Fă-ți zilele de naștere, aniversări și ocazii speciale memorabile cu ospitalitatea autentică din Orientul Mijlociu',
        familyReunions: 'Reuniuni de Familie',
        graduations: 'Absolviri',
        engagements: 'Logodne',
        holidays: 'Sărbători',
        birthday: {
          title: 'Sărbătoare de Ziua de Naștere',
          tagline: 'Momentele dulci făcute speciale',
          feature1: 'Desert gratuit de ziua de naștere',
          feature2: 'Cântec de ziua de naștere și felicitări',
          feature3: 'Experiență de luat masa memorabilă',
          special: 'Perfect pentru sărbătorirea unui an în plus de viață'
        },
        anniversary: {
          title: 'Cina de Aniversare',
          tagline: 'Sărbătorește povestea ta de dragoste',
          feature1: 'Masă romantică cu trandafiri',
          feature2: 'Desert gratuit pentru doi',
          feature3: 'Cina la lumina lumânărilor',
          feature4: 'Felicitare personalizată de aniversare',
          special: '25+ ani împreună? O surpriză specială te așteaptă!'
        },
        cta: {
          title: 'Gata să Sărbătorești?',
          subtitle: 'Lasă-ne să îți facem ziua specială extraordinară cu ospitalitatea autentică din Orientul Mijlociu și gusturi memorabile',
          reserve: 'Sună pentru Rezervare Specială',
          bookingAdvice: 'Rezervă cu 48 de ore în avans pentru cea mai bună experiență de sărbătoare'
        }
      },
      tags: {
        vegetarian: '🌱 Vegetarian',
        vegan: '🌿 Vegan',
        spicy: '🌶️ Picant',
        sweet: '🍯 Dulce',
        traditional: '🏛️ Tradițional',
        grilled: '🔥 La Grătar',
        'comfort food': '🍲 Mâncare de Casă',
        soup: '🍜 Supă',
        stew: '🥘 Tocană'
      },
      addToCart: 'Adaugă în Coș',
      loading: 'Se încarcă...',
      error: 'A apărut o eroare. Te rugăm să încerci din nou.',
      currency: '$'
    },
    uk: {
      nav: {
        home: 'Головна',
        menu: 'Меню',
        about: 'Про нас',
        gallery: 'Галерея',
        visit: 'Відвідайте нас',
        reservations: 'Бронювання',
        catering: 'Кейтеринг',
        orderOnline: 'Замовити онлайн'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'Смак Близького Сходу в кожному ковтку',
        description: 'Відчуйте справжні смаки Близького Сходу в теплій та традиційній атмосфері, де кожна страва розповідає історію про нашу багату культурну спадщину та кулінарні традиції, передані через покоління.',
        cta1: 'Переглянути меню',
        cta2: 'Забронювати столик'
      },
      menu: {
        title: 'Наше меню',
        subtitle: 'Powered by Blunari - Інтелектуальна ОС для покращеного кулінарного досвіду',
        filters: {
          all: 'Все',
          traditional: 'Традиційне',
          vegetarian: 'Вегетаріанське',
          vegan: 'Веганське',
          soup: 'Супи',
          dessert: 'Десерти',
          popular: 'Популярне'
        },
        viewFull: 'Переглянути повне меню',
        noItems: 'У цій категорії немає страв.'
      },
      about: {
        title: 'Наша історія',
        badge: 'Наша історія',
        subtitle: 'Ми приносимо справжні смаки Близького Сходу та теплу гостинність нашій спільноті',
        content: 'Nature Village народився з мрії поділитися справжніми смаками та теплою гостинністю Близького Сходу зі світом. Наші сімейні рецепти передавалися через покоління, кожна страва готується з любовʼю та повагою до наших культурних традицій. Ми використовуємо найкращі інгредієнти та готуємо кожну страву з тією ж турботою та увагою, що визначає гостинність Близького Сходу протягом століть.',
        story1: 'Nature Village присвячує себе приведенню справжніх смаків кухні Близького Сходу в теплу та привітну атмосферу, де кожен гість почувається як у родині.',
        story2: 'Наші кухарі з пристрастю готують традиційні страви Близького Сходу, використовуючи найкращі інгредієнти та перевірені часом техніки приготування, що святкують нашу багату кулінарну спадщину.',
        quote: 'Кожна страва готується з турботою та подається з теплом гостинності Близького Сходу.',
        experience: 'років досвіду',
        recipes: 'традиційних рецептів',
        customers: 'задоволених клієнтів',
        awards: 'отриманих нагород',
        features: {
          chefs: {
            title: 'Майстерні кухарі',
            description: 'Наші досвідчені кухарі приносять автентичні смаки прямо до вашого столу'
          },
          ingredients: {
            title: 'Свіжі інгредієнти',
            description: 'Ми використовуємо лише найкращі, найсвіжіші інгредієнти у всіх наших стравах'
          },
          atmosphere: {
            title: 'Тепла атмосфера',
            description: 'Насолоджуйтеся нашою затишною та привітною атмосферою, ідеальною для сімʼї та друзів'
          }
        }
      },
      reviews: {
        title: 'Що кажуть наші гості',
        subtitle: 'Справжні відгуки від наших цінних клієнтів',
        review1: {
          name: 'Клієнт Google',
          text: '"Їжа була надзвичайно смачною! Ми замовили Мезе Комбо та Грільовану Дораду. Обслуговування було відмінним, а атмосфера дуже затишною. Ми обовʼязково повернемося знову!"',
          location: 'Підтверджений відгук Google',
          time: '1 тиждень тому'
        },
        review2: {
          name: 'Рут Корнеа',
          text: '"Ми чудово провели час у ресторані Nature Village сьогодні ввечері! Все було абсолютно ідеально! Їжа, атмосфера, декор та обслуговування - все на найвищому рівні. Це точно наше нове улюблене місце для автентичної кухні Близького Сходу."',
          location: 'Місцевий гід • 29 відгуків',
          time: '2 місяці тому'
        },
        review3: {
          name: 'Клієнт Google',
          text: '"Я замовив Кузі, страву з рису та ягнятини, вона була дуже ситною та смачною. Піца була хорошого розміру, наповнена мʼясом гіро, сиром та приємним соусом. Справжні смаки Близького Сходу дійсно вразили мене та мою родину!"',
          location: 'Підтверджений відгук Google',
          time: 'Нещодавно'
        },
        badges: {
          featured: 'РЕКОМЕНДОВАНО',
          localGuide: 'МІСЦЕВИЙ ГІД',
          quziLover: 'ЛЮБИТЕЛЬ КУЗІ'
        }
      },
      featured: {
        title: 'Рекомендовані страви',
        subtitle: 'Відкрийте для себе наші найулюбленіші курдські делікатеси, приготовані за традиційними рецептами з сучасною подачею'
      },
      celebration: {
        title: 'Святкуйте свої особливі моменти',
        subtitle: 'Зробіть свої дні народження, річниці та особливі випадки незабутніми з справжньою курдською гостинністю',
        familyReunions: 'Сімейні зустрічі',
        holidays: 'Свята',
        birthday: {
          title: 'Святкування дня народження',
          tagline: 'Солодкі моменти стають особливими',
          feature1: 'Безкоштовний десерт на день народження',
          feature2: 'Пісня з днем народження та побажання',
          feature3: 'Незабутній досвід обіду',
          special: 'Ідеально для святкування ще одного року життя'
        },
        anniversary: {
          title: 'Річничні вечері',
          tagline: 'Святкуйте свою історію кохання',
          feature1: 'Романтична сервіровка столу з трояндами',
          feature2: 'Безкоштовний десерт на двох',
          feature3: 'Вечеря при свічках',
          feature4: 'Персоналізована річнична листівка',
          special: '25+ років разом? Особливий сюрприз чекає на вас!'
        },
        cta: {
          title: 'Готові святкувати?',
          subtitle: 'Дозвольте нам зробити ваш особливий день надзвичайним зі справжньою гостинністю Близького Сходу та незабутніми смаками',
          reserve: 'Дзвоніть для особливого бронювання',
          bookingAdvice: 'Бронюйте за 48 годин наперед для найкращого святкового досвіду'
        }
      },
      tags: {
        vegetarian: '🌱 Вегетаріанське',
        vegan: '🌿 Веганське',
        spicy: '🌶️ Гостре',
        sweet: '🍯 Солодке',
        traditional: '🏛️ Традиційне',
        grilled: '🔥 На грилі',
        'comfort food': '🍲 Домашня їжа',
        soup: '🍜 Суп',
        stew: '🥘 Тушковане'
      },
      addToCart: 'Додати в кошик',
      loading: 'Завантаження...',
      error: 'Сталася помилка. Будь ласка, спробуйте ще раз.',
      currency: '$'
    },
    vi: {
      nav: {
        home: 'Trang chủ',
        menu: 'Thực đơn',
        about: 'Về chúng tôi',
        gallery: 'Thư viện ảnh',
        visit: 'Ghé thăm',
        reservations: 'Đặt bàn',
        catering: 'Dịch vụ tiệc',
        orderOnline: 'Đặt hàng trực tuyến'
      },
      hero: {
        title: 'Nature Village',
        subtitle: 'Hương vị Trung Đông trong từng ngụm',
        description: 'Trải nghiệm hương vị chính thống của Trung Đông trong không gian ấm áp và truyền thống, nơi mỗi món ăn kể câu chuyện về di sản văn hóa phong phú và truyền thống ẩm thực được truyền qua nhiều thế hệ.',
        cta1: 'Xem thực đơn',
        cta2: 'Đặt bàn'
      },
      menu: {
        title: 'Thực đơn của chúng tôi',
        subtitle: 'Powered by Blunari - Hệ điều hành thông minh cho trải nghiệm ẩm thực nâng cao',
        filters: {
          all: 'Tất cả',
          traditional: 'Truyền thống',
          vegetarian: 'Chay',
          vegan: 'Thuần chay',
          soup: 'Súp',
          dessert: 'Tráng miệng',
          popular: 'Phổ biến'
        },
        viewFull: 'Xem thực đơn đầy đủ',
        noItems: 'Không có món nào trong danh mục này.'
      },
      about: {
        title: 'Câu chuyện của chúng tôi',
        badge: 'Câu chuyện của chúng tôi',
        subtitle: 'Chúng tôi mang đến hương vị chính thống của Trung Đông và lòng hiếu khách ấm áp cho cộng đồng',
        content: 'Nature Village ra đời từ giấc mơ chia sẻ hương vị chính thống và lòng hiếu khách ấm áp của Trung Đông với thế giới. Các công thức gia đình của chúng tôi đã được truyền qua nhiều thế hệ, mỗi món ăn được chuẩn bị với tình yêu và sự tôn trọng đối với truyền thống văn hóa của chúng tôi. Chúng tôi tìm nguồn những nguyên liệu tốt nhất và chuẩn bị từng bữa ăn với sự chăm sóc và chú ý tương tự đã định nghĩa lòng hiếu khách Trung Đông trong nhiều thế kỷ.',
        story1: 'Nature Village cống hiến để mang đến hương vị chính thống của ẩm thực Trung Đông trong không gian ấm áp và chào đón nơi mỗi khách hàng cảm thấy như ở nhà.',
        story2: 'Các đầu bếp của chúng tôi đam mê chuẩn bị các món ăn truyền thống Trung Đông bằng những nguyên liệu tốt nhất và kỹ thuật nấu ăn đã được kiểm chứng theo thời gian để tôn vinh di sản ẩm thực phong phú của chúng tôi.',
        quote: 'Mỗi món ăn được chuẩn bị với sự chăm sóc và phục vụ với sự ấm áp của lòng hiếu khách Trung Đông.',
        experience: 'năm kinh nghiệm',
        recipes: 'công thức truyền thống',
        customers: 'khách hàng hài lòng',
        awards: 'giải thưởng đạt được',
        features: {
          chefs: {
            title: 'Đầu bếp bậc thầy',
            description: 'Các đầu bếp kinh nghiệm của chúng tôi mang đến hương vị chính thống ngay tại bàn của bạn'
          },
          ingredients: {
            title: 'Nguyên liệu tươi',
            description: 'Chúng tôi chỉ sử dụng những nguyên liệu tốt nhất, tươi nhất trong tất cả các món ăn'
          },
          atmosphere: {
            title: 'Không gian ấm áp',
            description: 'Tận hưởng không gian ấm cúng và chào đón của chúng tôi, hoàn hảo cho gia đình và bạn bè'
          }
        }
      },
      reviews: {
        title: 'Khách hàng nói gì về chúng tôi',
        subtitle: 'Đánh giá thực từ những khách hàng quý giá của chúng tôi',
        review1: {
          name: 'Khách hàng Google',
          text: '"Đồ ăn cực kỳ ngon! Chúng tôi đã gọi Meze Combo và Cá Branzino Nướng. Dịch vụ tuyệt vời và không gian rất ấm cúng. Chúng tôi chắc chắn sẽ quay lại!"',
          location: 'Đánh giá Google đã xác thực',
          time: '1 tuần trước'
        },
        review2: {
          name: 'Ruth Cornea',
          text: '"Chúng tôi đã có một thời gian tuyệt vời tại nhà hàng Nature Village tối nay! Mọi thứ đều hoàn hảo! Đồ ăn, không gian, trang trí và dịch vụ - tất cả đều ở mức cao nhất. Đây chắc chắn là địa điểm ưa thích mới của chúng tôi cho ẩm thực Trung Đông chính thống."',
          location: 'Hướng dẫn viên địa phương • 29 đánh giá',
          time: '2 tháng trước'
        },
        review3: {
          name: 'Khách hàng Google',
          text: '"Tôi đã gọi Quzi, món ăn với cơm và thịt cừu, rất thịnh soạn và ngon. Pizza có kích thước tốt, đầy thịt gyro, phô mai và nước sốt ngon. Hương vị Trung Đông chính thống thực sự ấn tượng tôi và gia đình!"',
          location: 'Đánh giá Google đã xác thực',
          time: 'Gần đây'
        },
        badges: {
          featured: 'NỔI BẬT',
          localGuide: 'HƯỚNG DẪN VIÊN ĐỊA PHƯƠNG',
          quziLover: 'NGƯỜI YÊU QUZI'
        }
      },
      featured: {
        title: 'Món ăn nổi bật',
        subtitle: 'Khám phá những món ngon yêu thích nhất của chúng tôi, được chuẩn bị theo công thức truyền thống với cách trình bày hiện đại'
      },
      celebration: {
        title: 'Kỷ niệm những khoảnh khắc đặc biệt',
        subtitle: 'Làm cho sinh nhật, kỷ niệm và những dịp đặc biệt của bạn trở nên khó quên với lòng hiếu khách Kurdish chính thống',
        familyReunions: 'Tụ họp gia đình',
        holidays: 'Ngày lễ',
        birthday: {
          title: 'Tiệc sinh nhật',
          tagline: 'Những khoảnh khắc ngọt ngào trở nên đặc biệt',
          feature1: 'Tráng miệng miễn phí cho sinh nhật',
          feature2: 'Hát chúc mừng sinh nhật và lời chúc',
          feature3: 'Trải nghiệm ăn uống đáng nhớ',
          special: 'Hoàn hảo để kỷ niệm thêm một năm cuộc đời'
        },
        anniversary: {
          title: 'Bữa tối kỷ niệm',
          tagline: 'Kỷ niệm câu chuyện tình yêu của bạn',
          feature1: 'Bàn ăn lãng mạn với hoa hồng',
          feature2: 'Tráng miệng miễn phí cho hai người',
          feature3: 'Bữa tối dưới ánh nến',
          feature4: 'Thiệp kỷ niệm cá nhân hóa',
          special: '25+ năm bên nhau? Một bất ngờ đặc biệt đang chờ bạn!'
        },
        cta: {
          title: 'Sẵn sàng kỷ niệm?',
          subtitle: 'Hãy để chúng tôi làm cho ngày đặc biệt của bạn trở nên phi thường với lòng hiếu khách Trung Đông chính thống và hương vị khó quên',
          reserve: 'Gọi để đặt bàn đặc biệt',
          bookingAdvice: 'Đặt trước 48 giờ để có trải nghiệm kỷ niệm tốt nhất'
        }
      },
      tags: {
        vegetarian: '🌱 Chay',
        vegan: '🌿 Thuần chay',
        spicy: '🌶️ Cay',
        sweet: '🍯 Ngọt',
        traditional: '🏛️ Truyền thống',
        grilled: '🔥 Nướng',
        'comfort food': '🍲 Món ăn gia đình',
        soup: '🍜 Súp',
        stew: '🥘 Hầm'
      },
      addToCart: 'Thêm vào giỏ',
      loading: 'Đang tải...',
      error: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      currency: '$'
    }
  };

  const t = translations[language || 'en'] || translations.en;
  
  // Enhanced getText function with better error handling
  const getLocalText = useCallback((obj) => {
    try {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'object' && obj !== null) {
        return obj[language || 'en'] || obj.en || '';
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

  // Online order handler - redirects directly to Slice
  const handleOrderOnline = useCallback(() => {
    try {
      window.open('https://slicelife.com/restaurants/ga/suwanee/30024/nature-village-restaurant/menu', '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening Slice:', error);
    }
  }, []);

  // Delivery platform handlers
  const handleUberEats = useCallback(() => {
    try {
      // Uber Eats restaurant URL for Nature Village Restaurant
      window.open('https://www.ubereats.com/store/nature-village-restaurant/dR5RyEoLXtarbrxoIn-nqw', '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening Uber Eats:', error);
    }
  }, []);

  const handleDoorDash = useCallback(() => {
    try {
      // DoorDash restaurant URL for Nature Village Restaurant
      window.open('https://www.doordash.com/store/nature-village-restaurant-suwanee-28955148/36933361/', '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening DoorDash:', error);
    }
  }, []);

  const handleSlice = useCallback(() => {
    try {
      // Slice restaurant URL for Nature Village Restaurant
      window.open('https://slicelife.com/restaurants/ga/suwanee/30024/nature-village-restaurant/menu', '_blank', 'noopener,noreferrer');
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
        medium: 'Moderate',
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
      },
      es: {
        low: 'No ocupado',
        medium: 'Moderadamente ocupado',
        high: 'Ocupado',
        'very-high': 'Muy ocupado'
      },
      sq: {
        low: 'Pak Njerëz',
        medium: 'Mesatar',
        high: 'Shumë Njerëz',
        'very-high': 'Tepër Plot'
      },
      bn: {
        low: 'ব্যস্ত নয়',
        medium: 'মাঝারি',
        high: 'ব্যস্ত',
        'very-high': 'খুব ব্যস্ত'
      }
    };
    return busyTexts[language || 'en']?.[level] || busyTexts.en[level] || 'Unknown';
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

  const getBusyStatusDescription = useCallback((level) => {
    const statusDescriptions = {
      en: {
        low: 'Perfect time to visit',
        medium: 'Moderate crowd',
        high: 'Quite busy',
        'very-high': 'Very busy period'
      },
      ku: {
        low: 'کاتی باش بۆ سەردان',
        medium: 'قەرەباڵغی مامناوەند',
        high: 'زۆر قەرەباڵغی',
        'very-high': 'کاتی زۆر قەرەباڵغی'
      },
      ar: {
        low: 'وقت مثالي للزيارة',
        medium: 'ازدحام معتدل',
        high: 'مزدحم نوعا ما',
        'very-high': 'فترة مزدحمة جدا'
      },
      es: {
        low: 'Momento perfecto para visitar',
        medium: 'Multitud moderada',
        high: 'Bastante ocupado',
        'very-high': 'Período muy ocupado'
      }
    };
    return statusDescriptions[language || 'en']?.[level] || statusDescriptions.en[level] || '';
  }, [language]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl font-serif text-amber-800">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <>
      <GiftCardPopup />
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50" style={{ direction: LANGUAGES[language || 'en']?.dir || 'ltr' }}>
      <Header currentPage="home" />
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
          <MiddleEasternPattern />
        </div>
        
        <div className={cn('relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 mt-16', rtlClass('', 'text-right'))}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-2xl">
            {t.hero?.title || 'Nature Village'}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light mb-4 text-amber-100">
            {t.hero?.subtitle || 'A Taste of Middle East in Every Bite'}
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed text-amber-50">
            {t.hero?.description || 'Experience authentic Middle Eastern flavors in a warm, traditional setting.'}
          </p>
          
          {/* Enhanced Mobile CTAs - Reorganized Layout */}
          <div className="flex flex-col gap-3 items-center justify-center">
            {/* Top row - Menu and Reservation buttons side by side */}
            <div className="flex flex-row gap-3 items-center justify-center">
              <button 
                onClick={() => scrollToSection('menu')}
                className="group bg-transparent border-2 border-amber-400/80 text-amber-200 hover:bg-amber-400/10 hover:border-amber-300 hover:text-amber-100 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-colors duration-200 flex items-center justify-center gap-1.5 min-h-[48px] min-w-[150px]"
              >
                <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.ui?.menu || 'Menu'}</span>
              </button>
              
              <button 
                onClick={() => router.push('/reservations')}
                className="group bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white hover:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-colors duration-200 flex items-center justify-center gap-1.5 min-h-[48px] min-w-[150px]"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.ui?.reserve || 'Reserve'}</span>
              </button>
            </div>
            
            {/* Bottom row - Call Now & Order buttons (mobile emphasis) */}
            <div className="flex flex-row gap-3">
              <button 
                onClick={() => window.open('tel:4703501019', '_self')}
                className="group bg-transparent border-2 border-green-400/80 text-green-200 hover:bg-green-400/10 hover:border-green-300 hover:text-green-100 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-colors duration-200 flex items-center justify-center gap-1.5 min-h-[48px] min-w-[150px]"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.ui?.callNow || 'Call Now'}</span>
              </button>
              <button
                onClick={() => window.open('https://slicelife.com/restaurants/ga/suwanee/30024/nature-village-restaurant/menu', '_blank')}
                className="group bg-transparent border-2 border-green-400/80 text-green-200 hover:bg-green-400/10 hover:border-green-300 hover:text-green-100 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-colors duration-200 flex items-center justify-center gap-1.5 min-h-[48px] min-w-[150px]"
                aria-label={t.nav?.orderOnline || 'Order Online'}
              >
                <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.nav?.orderOnline || 'Order'}</span>
              </button>
            </div>
          </div>
          
          {/* Kitchen Closing Notice */}
          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-amber-200 italic backdrop-blur-sm bg-black/20 inline-block px-4 py-2 rounded-lg">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 mb-0.5" />
              {t.footer?.kitchenNote || '* Kitchen closes 30 minutes before closing time'}
            </p>
          </div>
        </div>
      </section>

      {/* Restaurant Status Indicator Section removed per request */}

      {/* Featured Dishes Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-800 mb-4">
              {t.featured?.title || 'Featured Dishes'}
            </h2>
            <p className="text-lg sm:text-xl text-amber-600 max-w-3xl mx-auto">
              {t.featured?.subtitle || 'Discover our most beloved Middle Eastern specialties'}
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {menuItems.filter(item => item?.popular === true).slice(0, 3).map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={getLocalText(item.name)}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className={cn('p-4 sm:p-6', rtlClass('text-left', 'text-right'))}>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-800 mb-2">
                    {getLocalText(item.name)}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">
                    {getLocalText(item.description)}
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

      {/* Our Story Section - Minimal */}
      <section id="about" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-amber-800 mb-3">
              {t.about?.title || 'Our Story'}
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mb-5"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t.about?.subtitle || 'Bringing authentic Middle Eastern flavors and warm hospitality to our community'}
            </p>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10">
            
            {/* Left Side - Image */}
            <div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <img 
                  src="/team.jpg"
                  alt="Nature Village restaurant team"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Right Side - Content */}
            <div className="space-y-5">
              <p className="text-base text-gray-700">
                {t.about?.story1 || 'Nature Village is dedicated to bringing you the authentic flavors of Middle Eastern cuisine in a warm and welcoming atmosphere where every guest feels like family.'}
              </p>
              
              <p className="text-base text-gray-600">
                {t.about?.story2 || 'Our chefs are passionate about preparing traditional Middle Eastern dishes using the finest ingredients and time-honored cooking techniques that celebrate our rich culinary heritage.'}
              </p>
              
              {/* Quote Box */}
              <div className="bg-amber-50 border-l-4 border-orange-500 p-5 rounded-r">
                <p className="text-amber-900 italic text-base">
                  {t.about?.quote || 'Every dish is crafted with care and served with the warmth of Middle Eastern hospitality.'}
                </p>
              </div>
              
              {/* Feature Cards - Desktop Only, Smaller */}
              <div className="hidden lg:grid grid-cols-3 gap-4 pt-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {t.about?.features?.chefs?.title || 'Expert Chefs'}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t.about?.features?.chefs?.description || 'Authentic Middle Eastern cuisine'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {t.about?.features?.ingredients?.title || 'Fresh Ingredients'}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t.about?.features?.ingredients?.description || 'Quality sourced daily'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {t.about?.features?.service?.title || 'Warm Service'}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t.about?.features?.service?.description || 'Middle Eastern hospitality'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Cards - Mobile/Tablet Only */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 lg:hidden">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                {t.about?.features?.chefs?.title || 'Expert Chefs'}
              </h4>
              <p className="text-sm text-gray-600">
                {t.about?.features?.chefs?.description || 'Authentic Middle Eastern cuisine'}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                {t.about?.features?.ingredients?.title || 'Fresh Ingredients'}
              </h4>
              <p className="text-sm text-gray-600">
                {t.about?.features?.ingredients?.description || 'Quality sourced daily'}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                {t.about?.features?.service?.title || 'Warm Service'}
              </h4>
              <p className="text-sm text-gray-600">
                {t.about?.features?.service?.description || 'Middle Eastern hospitality'}
              </p>
            </div>
          </div>
          
          {/* Statistics Bar - Minimal */}
          <div className="bg-orange-500 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
              <div>
                <div className="text-4xl sm:text-5xl font-bold mb-1">1000+</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-90">
                  {t.about?.stats?.happyCustomers || 'Happy Customers'}
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold mb-1">50+</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-90">
                  {t.about?.stats?.authenticDishes || 'Authentic Dishes'}
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold mb-1">4.8★</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-90">
                  {t.about?.stats?.customerRating || 'Customer Rating'}
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold mb-1">100%</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-90">
                  {t.about?.stats?.freshIngredients || 'Fresh Ingredients'}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Celebrate Your Special Moments Section */}
      <section className="relative min-h-[100vh] py-16 overflow-hidden">
        {/* Top Curve */}
        <div className="absolute top-0 left-0 w-full h-16 z-10">
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

        <div className="relative z-10 w-full min-h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            
            <div className="relative">
              {/* Decorative top line */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              
              <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
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
                </span>
              </h2>
              
              {/* Decorative bottom line */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent"></div>
            </div>
            
            <p className="text-base lg:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t.celebration?.subtitle || 'Make your birthdays, anniversaries, and special occasions unforgettable with authentic Middle Eastern hospitality'}
            </p>
          </div>

          {/* Enhanced Celebration Options - Full Visibility */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Birthday Celebrations */}
              <div className="group text-center transform hover:scale-105 transition-all duration-500">
                <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 hover:border-amber-400/50 transition-all duration-500 overflow-hidden flex flex-col justify-between">
                  <div className="mb-6">
                    {/* Enhanced icon with glow */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-2xl opacity-20 scale-150"></div>
                      <div className="relative text-5xl lg:text-6xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter drop-shadow-2xl">🎂</div>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-3 group-hover:text-amber-200 transition-colors duration-300">
                      {t.celebration?.birthday?.title || 'Birthday Celebrations'}
                    </h3>
                    <p className="text-white/70 text-lg italic">
                      {t.celebration?.birthday?.tagline || 'Sweet moments made special'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Anniversary Celebrations */}
              <div className="group text-center transform hover:scale-105 transition-all duration-500">
                <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 hover:border-rose-400/50 transition-all duration-500 overflow-hidden flex flex-col justify-between">
                  <div className="mb-6">
                    {/* Enhanced icon with glow */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 scale-150"></div>
                      <div className="relative text-5xl lg:text-6xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter drop-shadow-2xl">💕</div>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-3 group-hover:text-rose-200 transition-colors duration-300">
                      {t.celebration?.anniversary?.title || 'Anniversary Dinners'}
                    </h3>
                    <p className="text-white/70 text-lg italic">
                      {t.celebration?.anniversary?.tagline || 'Celebrate your love story'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Other Celebrations Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <div className="group text-center p-5 lg:p-6 bg-gradient-to-br from-white/10 to-white/15 rounded-2xl border border-white/15 hover:border-amber-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-3xl lg:text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎓</div>
                </div>
                <div className="text-white font-medium group-hover:text-amber-200 transition-colors duration-300 text-sm lg:text-base">{t.celebration?.graduations || 'Graduations'}</div>
              </div>
              <div className="group text-center p-5 lg:p-6 bg-gradient-to-br from-white/10 to-white/15 rounded-2xl border border-white/15 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-3xl lg:text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">💍</div>
                </div>
                <div className="text-white font-medium group-hover:text-pink-200 transition-colors duration-300 text-sm lg:text-base">{t.celebration?.engagements || 'Engagements'}</div>
              </div>
              <div className="group text-center p-5 lg:p-6 bg-gradient-to-br from-white/10 to-white/15 rounded-2xl border border-white/15 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-3xl lg:text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">👨‍👩‍👧‍👦</div>
                </div>

                <div className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300 text-sm lg:text-base">{t.celebration?.familyReunions || 'Family Reunions'}</div>

              </div>
              <div className="group text-center p-5 lg:p-6 bg-gradient-to-br from-white/10 to-white/15 rounded-2xl border border-white/15 hover:border-green-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-3xl lg:text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎄</div>
                </div>
                <div className="text-white font-medium group-hover:text-green-200 transition-colors duration-300 text-sm lg:text-base">{t.celebration?.holidays || 'Holidays'}</div>
              </div>
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 rounded-3xl blur-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/15 to-white/10 rounded-3xl p-6 lg:p-8 border border-white/25 backdrop-blur-lg">
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300">
                  {t.celebration?.cta?.title || 'Ready to Celebrate?'}
                </h3>
                <p className="text-white/90 mb-6 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
                  {t.celebration?.cta?.subtitle || 'Let us make your special day extraordinary with authentic Middle Eastern hospitality and unforgettable flavors'}
                </p>
                
                <div className="text-white text-lg lg:text-xl font-semibold mb-6 flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>{t.celebration?.cta?.reserve || 'Call for special reservation'}</span>
                  <span>📞</span>
                </div>
                
                <div className="text-white/70 text-xs sm:text-sm flex items-center justify-center gap-2 px-2 sm:px-4 max-w-full">
                  <span className="text-amber-300 text-base sm:text-lg flex-shrink-0">💡</span>
                  <span className="whitespace-nowrap text-center">{t.celebration?.cta?.bookingAdvice || 'Book 48 hours in advance for the best celebration experience'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full h-16 z-10">
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
          <MiddleEasternPattern />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            {/* Google Badge */}
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-lg mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>

                <span className="text-sm font-medium text-gray-700">{t.ui?.googleReviews || 'Google Reviews'}</span>

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
                <div className="text-sm sm:text-base text-amber-600 font-medium">{t.about?.stats?.happyCustomers || 'Happy Customers'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-800">4.8★</div>
                <div className="text-sm sm:text-base text-amber-600 font-medium">{t.ui?.averageRating || 'Average Rating'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-800">93%</div>
                <div className="text-sm sm:text-base text-amber-600 font-medium">{t.ui?.fiveStarReviews || '5-Star Reviews'}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Review 1 - Karen Cardenas - Featured Review */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden border border-amber-100">
              {/* Featured Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-bl-2xl text-xs font-bold">
                {t.reviews?.badges?.featured || 'FEATURED'}
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-800">5.0</span>
                <span className="text-sm text-gray-500 ml-2">• {t.reviews?.review1?.time || '1 week ago'}</span>
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
                    <span className="text-xs text-gray-500">{t.ui?.verifiedPurchase || 'Verified Purchase'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review 2 - Ruth Cornea */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden border border-green-100">
              {/* Local Guide Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Users className="w-3 h-3" />
                {t.reviews?.badges?.localGuide || 'LOCAL GUIDE'}
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-800">5.0</span>
                <span className="text-sm text-gray-500 ml-2">• {t.reviews?.review2?.time || '2 months ago'}</span>
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
                    <span className="text-xs text-gray-500">{t.ui?.trustedReviewer || 'Trusted Reviewer'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review 3 - Enhanced with Food Focus */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden border border-purple-100">
              {/* Dish Highlight */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ChefHat className="w-3 h-3" />
                {t.reviews?.badges?.quziLover || 'QUZI LOVER'}
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-800">5.0</span>
                <span className="text-sm text-gray-500 ml-2">• {t.reviews?.review3?.time || 'Recent'}</span>
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
                      <span className="text-xs text-gray-500">{t.ui?.foodEnthusiast || 'Food Enthusiast'}</span>
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
                {t.reviews?.ctaTitle || 'Ready to Create Your Own 5-Star Experience?'}
              </h3>
              <p className="text-base sm:text-lg text-amber-700 mb-8 max-w-2xl mx-auto">
                {t.reviews?.cta || 'Join 572+ satisfied customers who love our authentic cuisine! Book your table today and taste the difference that authentic Middle Eastern hospitality makes.'}
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
                  href="tel:4703501019"
                  className="group bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-300 hover:border-amber-400 px-8 py-4 rounded-2xl text-base font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{t.ui?.call || 'Call'} (470) 350-1019</span>
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-amber-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{t.reviews?.trustIndicators?.googleRating || '4.8★ Google Rating'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{t.reviews?.trustIndicators?.totalReviews || '572+ Reviews'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{t.ui?.familyOwned || 'Family Owned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{t.ui?.halalCertified || 'Halal Certified'}</span>
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
                  {t.footer?.openDaily?.split('\n')[0] || 'SUN - THU: 12 PM - 10 PM'}
                </span>
                <span className="block">
                  {t.footer?.openDaily?.split('\n')[1] || 'FRI - SAT: 12 PM - 11 PM'}
                </span>
                <br />
                <span className="text-amber-600 font-medium">7 Days a Week</span>
                <br />
                <span className="block text-xs text-amber-700 italic mt-2">
                  {t.footer?.kitchenNote || '* Kitchen closes 30 minutes before closing time'}
                </span>
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
                <a href="tel:4703501019" className="text-amber-600 hover:text-amber-800 transition-colors ml-1">
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

      {/* Universal Footer Component */}
      <Footer />

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
      </div>
    </>
  );
};

export default NatureVillageWebsite;


