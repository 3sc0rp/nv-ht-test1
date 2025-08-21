import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Menu, X, MapPin, Phone, Clock, Star, Filter, Globe, Facebook, Instagram, ChefHat, Users, Calendar, Award, ChevronRight, Home, Utensils, Info, Camera, ExternalLink, Share2, ChevronDown, Grid, Heart, Eye, Share, ZoomIn, Download, Truck, Shield } from 'lucide-react';
import { useRouter } from 'next/router';
import { LANGUAGES, getText, updateDocumentLanguage } from '../lib/i18n';

const NatureVillageWebsite = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
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
    
    // Restaurant hours: 11:00 AM to 10:00 PM
    const openingTime = 11.0;
    const closingTime = 22.0;
    const isCurrentlyOpen = currentTime >= openingTime && currentTime < closingTime;
    
    let nextClosing = '';
    let nextOpening = '';
    
    if (isCurrentlyOpen) {
      nextClosing = '10:00 PM';
    } else if (currentTime < openingTime) {
      nextOpening = '11:00 AM';
    } else {
      nextOpening = '11:00 AM Tomorrow';
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

  const handleLanguageChange = useCallback((next) => {
    try {
      if (!LANGUAGES[next]) return;
      
      setLanguage(next);
      updateDocumentLanguage(next);
      const url = { pathname: router.pathname, query: { ...router.query, lang: next } };
      router.replace(url, undefined, { shallow: true });
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [router]);

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
      alt: { en: 'Elegant Restaurant Interior', ku: 'ناوەوەی چێشتخانەی جوان', ar: 'داخل المطعم الأنيق' },
      category: 'atmosphere',
      tags: ['interior', 'ambiance', 'dining'],
      likes: 127,
      featured: true,
      story: {
        en: 'Our warm and inviting dining space reflects Middle Eastern hospitality',
        ku: 'شوێنی خواردنی گەرم و بانگهێشتکارمان ڕەنگدانەوەی میوانداری ناوەڕاستی ئاسیا دەکات'
      }
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
      alt: { en: 'Authentic Middle Eastern Kebab', ku: 'کەبابی ڕەسەنی ناوەڕاستی ئاسیا', ar: 'كباب شرق أوسطي أصيل' },
      category: 'dishes',
      tags: ['kebab', 'grilled', 'signature'],
      likes: 245,
      featured: true,
      story: {
        en: 'Hand-crafted kebabs using traditional Middle Eastern spices and techniques',
        ku: 'کەبابی دەستکرد بە بەکارهێنانی بەهارات و تەکنیکی نەریتی ناوەڕاستی ئاسیا'
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
      alt: { en: 'Traditional Middle Eastern Platter', ku: 'پلێتەری نەریتی ناوەڕاستی ئاسیا', ar: 'طبق شرق أوسطي تقليدي' },
      category: 'dishes',
      tags: ['traditional', 'mixed', 'authentic'],
      likes: 156,
      featured: true,
      story: {
        en: 'A celebration of Middle Eastern culinary heritage in one beautiful platter',
        ku: 'ئاهەنگێک بۆ میراتی چێشتلێنانی ناوەڕاستی ئاسیا لە یەک پلێتەری جوان'
      }
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      alt: { en: 'Middle Eastern Vegetable Medley', ku: 'تێکەڵەی سەوزەی ناوەڕاستی ئاسیا', ar: 'خليط الخضار الشرق أوسطي' },
      category: 'dishes',
      tags: ['vegetables', 'healthy', 'colorful'],
      likes: 134,
      featured: false,
      story: {
        en: 'Fresh seasonal vegetables prepared with Middle Eastern herbs and spices',
        ku: 'سەوزەی وەرزیی تازە کە بە گیا و بەهاراتی ناوەڕاستی ئاسیا ئامادە کراوە'
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
      alt: { en: 'Middle Eastern Dolma', ku: 'دۆڵمەی ناوەڕاستی ئاسیا', ar: 'دولمة شرق أوسطية' },
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
      alt: { en: 'Hearty Middle Eastern Soup', ku: 'شۆربەی بەهێزی ناوەڕاستی ئاسیا', ar: 'حساء شرق أوسطي مغذي' },
      category: 'dishes',
      tags: ['soup', 'comfort', 'warm'],
      likes: 143,
      featured: false,
      story: {
        en: 'Warming soup made with traditional Middle Eastern ingredients and love',
        ku: 'شۆربەی گەرمکەرەوە کە بە پێکهاتەی نەریتی ناوەڕاستی ئاسیا و خۆشەویستی دروست کراوە'
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
      image: '/kpizza.jpg',
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
        kmr: 'Ev xwaştrîn xwarin xwarineke ku bi sebzeyên taze yên bi baldarî hatine hilbijartin û perçeyên nerm ên goştî hatiye çêkirin. Hêdî hêdî heta bi temamî hatiye pijandin. Bi brincê zefranî, salata werzeya, pîvazê sumaq û sebzeyên grîlkirî tê peşkêşkirin. Ezmûnek xwarinê ya jibîrnekirin û şaykirin çêdike.'
      },
      price: '$23.99',
      category: 'specialty',
      popular: true,
      image: '/carnival.jpg',
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
      footer: {
        description: 'Bringing the authentic flavors and warm hospitality of the Middle East to your table. Every dish is a celebration of our rich cultural heritage and culinary excellence.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        followUs: 'Follow Us',
        openDaily: 'SUN - THU: 12 AM - 10 PM\nFRI - SAT: 12 AM - 11 PM',
        poweredBy: 'Powered by',
        blunari: 'Blunari',

        copyright: `© ${new Date().getFullYear()} Nature Village Middle Eastern Restaurant. All rights reserved.`,
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },

      ui: {
        callNow: 'Call Now',
        orderOnline: 'Order Online',
        restaurant: 'Restaurant',
        familyOwned: 'Family Owned',
        halalCertified: 'Halal Certified',
        googleReviews: 'Google Reviews',
        averageRating: 'Average Rating',
        fiveStarReviews: '5-Star Reviews',
        verifiedPurchase: 'Verified Purchase',
        trustedReviewer: 'Trusted Reviewer',
        foodEnthusiast: 'Food Enthusiast'
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

        badge: 'چیرۆکەکەمان',
        subtitle: 'تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان بۆ کۆمەڵگاکەمان دەهێنین',
        content: 'گوندی سروشت لە خەونێکەوە لەدایک بووە بۆ هاوبەشکردنی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان لەگەڵ جیهان. ڕێسەتە خێزانییەکانمان لە نەوەوە بۆ نەوە دەردەچن، هەر خۆراکێک بە خۆشەویستی و ڕێزگرتن لە نەریتە کولتوورییەکانمان دروست دەکرێت.',
        story1: 'گوندی سروشت بەرپرسە لە هێنانی تامە ڕەسەنەکانی چێشتی ناوەڕاستی ئاسیا لە کەشێکی گەرم و بەخێرهاتووەوە کە هەر میوانێک وەک خێزان هەست دەکات.',
        story2: 'چێشتلێنەرەکانمان دڵسۆزن لە ئامادەکردنی خۆراکە نەریتییەکانی ناوەڕاستی ئاسیا بە بەکارهێنانی باشترین پێکهاتەکان و تەکنیکە کۆنەکانی چێشتلێنان کە میراتی دەوڵەمەندی چێشتلێنانمان ئاهەنگ دەگێڕن.',
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
      footer: {
        description: 'هێنانی تامە ڕەسەنەکان و پێشوازی گەرمی کوردستان بۆ مێزەکەتان. هەر خۆراکێک ئاهەنگێکە بۆ میراتی دەوڵەمەند و باشی چێشتلێنانمان.',
        quickLinks: 'لینکە خێراکان',
        contactInfo: 'زانیاری پەیوەندی',
        followUs: 'شوێنمان بکەون',
        openDaily: 'یەکشەممە - پێنجشەممە: ١٢:٠٠ ی بەیانی - ١٠:٠٠ ی شەو\nهەینی - شەممە: ١٢:٠٠ ی بەیانی - ١١:٠٠ ی شەو',
        poweredBy: 'هێزی لەلایەن',
        blunari: 'بلوناری',

        copyright: `© ${new Date().getFullYear()} گوندی سروشت چێشتخانەی کوردی. هەموو مافەکان پارێزراون.`,
        privacy: 'سیاسەتی تایبەتی',
        terms: 'مەرجەکانی خزمەتگوزاری'
      },

      ui: {
        callNow: 'ئێستا پەیوەندی بکە',
        orderOnline: 'داواکاری ئۆنلاین',
        restaurant: 'چێشتخانە',
        familyOwned: 'خاوەن خێزانی',
        halalCertified: 'بەڵگەنامەی حەلاڵ',
        googleReviews: 'پێداچوونەوەی گووگڵ',
        averageRating: 'ناوەندی هەڵسەنگاندن',
        fiveStarReviews: 'پێداچوونەوەی ٥ ئەستێرە',
        verifiedPurchase: 'کڕینی دڵنیاکراو',
        trustedReviewer: 'پێداچوونەوەی متمانەپێکراو',
        foodEnthusiast: 'حەزلێکەری خۆراک'
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

        badge: 'قصتنا',
        subtitle: 'نجلب النكهات الكردية الأصيلة والضيافة الدافئة إلى مجتمعنا',
        content: 'ولدت قرية الطبيعة من حلم مشاركة النكهات الأصيلة والضيافة الدافئة لكردستان مع العالم. وصفات عائلتنا تتوارث عبر الأجيال، كل طبق يُحضر بحب واحترام لتقاليدنا الثقافية.',
        story1: 'قرية الطبيعة مكرسة لتقديم النكهات الأصيلة للمطبخ الشرق أوسطي في جو دافئ ومرحب حيث يشعر كل ضيف وكأنه في بيته.',
        story2: 'طهاتنا شغوفون بإعداد الأطباق الشرق أوسطية التقليدية باستخدام أجود المكونات وتقنيات الطبخ العريقة التي تحتفي بتراثنا الطهوي الغني.',
        quote: 'كل طبق يُحضر بعناية ويُقدم بدفء الضيافة الكردية.',
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
      footer: {
        description: 'نجلب النكهات الأصيلة والضيافة الدافئة من كردستان إلى طاولتك. كل طبق احتفال بتراثنا الثقافي الغني وتميزنا الطهوي.',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        followUs: 'تابعونا',
        openDaily: 'الأحد - الخميس: ١٢:٠٠ ص - ١٠:٠٠ م\nالجمعة - السبت: ١٢:٠٠ ص - ١١:٠٠ م',
        poweredBy: 'مدعوم من',
        blunari: 'بلوناري',
        copyright: `© ${new Date().getFullYear()} قرية الطبيعة مطعم كردي. جميع الحقوق محفوظة.`,
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة'
      },

      ui: {
        callNow: 'اتصل الآن',
        orderOnline: 'اطلب أونلاين',
        restaurant: 'مطعم',
        familyOwned: 'مملوك عائلياً',
        halalCertified: 'معتمد حلال',
        googleReviews: 'مراجعات جوجل',
        averageRating: 'متوسط التقييم',
        fiveStarReviews: 'مراجعات ٥ نجوم',
        verifiedPurchase: 'شراء موثق',
        trustedReviewer: 'مراجع موثوق',
        foodEnthusiast: 'عاشق الطعام'
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

        badge: 'داستان ما',
        subtitle: 'طعم‌های اصیل کردی و مهمان‌نوازی گرم را به جامعه‌مان می‌آوریم',
        content: 'دهکده طبیعت از رویای به اشتراک گذاشتن طعم‌های اصیل و مهمان‌نوازی گرم کردستان با جهان متولد شد.',
        story1: 'دهکده طبیعت متعهد به ارائه طعم‌های اصیل غذاهای کردی در فضایی گرم و دوستانه است که هر مهمان احساس خانوادگی بودن کند.',
        story2: 'آشپزهای ما علاقه‌مند به تهیه غذاهای سنتی کردی با استفاده از بهترین مواد اولیه و تکنیک‌های کهن آشپزی هستند که میراث غنی آشپزی ما را جشن می‌گیرد.',
        quote: 'هر غذا با دقت تهیه و با گرمای مهمان‌نوازی کردی سرو می‌شود.',
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
      footer: {

        description: 'طعم‌های اصیل و مهمان‌نوازی گرم کردستان را به میز شما می‌آوریم. هر غذا جشنی از میراث فرهنگی غنی و برتری آشپزی ما است.',

        quickLinks: 'لینک‌های سریع',
        contactInfo: 'اطلاعات تماس',
        followUs: 'ما را دنبال کنید',
        openDaily: 'یکشنبه - پنج‌شنبه: ۱۲:۰۰ ظهر - ۱۰:۰۰ شب\nجمعه - شنبه: ۱۲:۰۰ ظهر - ۱۱:۰۰ شب',
        poweredBy: 'قدرت گرفته از',

        blunari: 'بلوناری',

        blunari: 'بلوناری AI',

        copyright: `© ${new Date().getFullYear()} دهکده طبیعت رستوران کردی. تمام حقوق محفوظ است.`,
        privacy: 'سیاست حفظ حریم خصوصی',
        terms: 'شرایط خدمات'
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

        badge: 'Hikayemiz',
        subtitle: 'Otantik Kürt lezzetlerini ve sıcak misafirperverliği topluluğumuza getiriyoruz',
        content: 'Nature Village, Kürdistan\'ın otantik lezzetlerini ve sıcak misafirperverliğini dünyayla paylaşma hayalinden doğdu.',
        story1: 'Nature Village, her misafirin kendini aile gibi hissettiği sıcak ve samimi bir atmosferde otantik Kürt mutfağının lezzetlerini sunmaya kendini adamıştır.',
        story2: 'Aşçılarımız, zengin mutfak mirasımızı kutlayan en kaliteli malzemeler ve geleneksel pişirme teknikleri kullanarak geleneksel Kürt yemekleri hazırlamaya tutkuyla bağlıdır.',
        quote: 'Her yemek özenle hazırlanır ve Kürt misafirperverliğinin sıcaklığıyla sunulur.',
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
        subtitle: 'ہر لقمے میں مشرق وسطیٰ کا ذائقہ',
        description: 'روایتی ماحول میں اصل مشرق وسطیٰ کھانوں کا تجربہ کریں۔',
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

        badge: 'ہماری کہانی',
        subtitle: 'اصل کردی ذائقے اور گرم مہمان نوازی ہماری کمیونٹی میں لا رہے ہیں',
        content: 'نیچر ولیج کردستان کے اصل ذائقوں کو دنیا کے ساتھ بانٹنے کے خواب سے پیدا ہوا۔',
        story1: 'نیچر ولیج کردی کھانوں کے اصل ذائقے گرم اور خوش آمدید ماحول میں فراہم کرنے کے لیے وقف ہے جہاں ہر مہمان خاندان کی طرح محسوس کرتا ہے۔',
        story2: 'ہمارے شیف بہترین اجزاء اور روایتی پکانے کی تکنیکوں کا استعمال کرتے ہوئے روایتی کردی پکوان تیار کرنے میں پرجوش ہیں جو ہماری بھرپور پاک ورثے کا جشن مناتے ہیں۔',
        quote: 'ہر پکوان احتیاط سے تیار کیا جاتا ہے اور کردی مہمان نوازی کی گرمجوشی کے ساتھ پیش کیا جاتا ہے۔',
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
        subtitle: 'Di Her Qurçikê de Tama Rojhilatê Navîn',
        description: 'Tamên resen ên Rojhilatê Navîn di hawîrdorekî germ û kevneşopî de biceribînin.',
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

        badge: 'Çîroka Me',
        subtitle: 'Tamên resen ên Kurdî û mêvandariya germ bo civata me tînin',
        content: 'Gundê Xwezayê ji xewna parvekirina tamên resen û mêvandariya germ a Kurdistanê bi cîhanê re hate dayîn.',
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

        description: 'Tamên resen û mêvandariya germ a Kurdistanê tînin ser maseyê we. Her xwarinê pîrozbahiya çanda me ya dewlemend û başiya çêştlênanê ye.',

        

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
        subtitle: 'Работает на MenuIQ - улучшенный ИИ опыт питания',
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
      currency: '$'
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
        subtitle: 'MenuIQ द्वारा संचालित - AI-संवर्धित भोजन अनुभव',
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
      currency: '₹'
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

        badge: 'Çîroka Me',
        subtitle: 'Tamên resen ên Kurdî û mêvandariya germ bo civata me tînin',
        content: 'Gundê Xwezayê ji xewna parvekirina tamên resen û mêvandariya germ a Kurdistanê bi cîhanê re hate dayîn.',
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

        description: 'Tamên resen û mêvandariya germ a Kurdistanê tînin ser maseyê we. Her xwarinê pîrozbahiya çanda me ya dewlemend û başiya çêştlênanê ye.',

        

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

  const isRTL = LANGUAGES[language || 'en']?.dir === 'rtl';
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50" style={{ direction: LANGUAGES[language || 'en']?.dir || 'ltr' }}>
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


                <div className="text-xs text-amber-600 font-sans hidden sm:block">{t.ui?.restaurant || 'Restaurant'}</div>

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
              {/* Order Online Button for Mobile - HIDDEN (available in burger menu) */}
              <button
                onClick={handleOrderOnline}
                className={cn(
                  'hidden flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-green-200 hover:border-green-300 text-green-800 hover:text-green-900 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1',
                  isRTL && 'space-x-reverse'
                )}
                aria-label={t.nav?.orderOnline || 'Order'}
              >
                <ChefHat className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-medium text-xs uppercase tracking-wide whitespace-nowrap">{t.nav?.orderOnline || 'Order'}</span>
              </button>

              {/* Language Selector - Visible on all devices */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={cn(
                    'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm hover:bg-white border border-amber-200/60 hover:border-amber-300 text-amber-800 hover:text-amber-900 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1',
                    isRTL && 'space-x-reverse'
                  )}
                  aria-expanded={showLanguageDropdown}
                  aria-haspopup="listbox"
                  aria-label="Select language"
                >
                  <span className="text-base drop-shadow-sm" aria-hidden="true">
                    {LANGUAGES[language]?.flag || '🌐'}
                  </span>
                  <span className="font-semibold text-xs uppercase tracking-wide drop-shadow-sm">
                    {language === 'en' ? 'EN' :
                     language === 'ku' ? 'KU' :
                     language === 'ar' ? 'AR' :
                     language === 'fa' ? 'FA' :
                     language === 'tr' ? 'TR' :
                     language === 'ur' ? 'UR' :
                      'KMR'}
                  </span>
                  <svg className="w-3 h-3 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
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
                        <span className="text-base mr-2">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && (
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

                      <span className="text-xs text-amber-600 font-medium">{t.ui?.restaurant || 'Restaurant'}</span>

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

                      <span className="text-sm text-amber-600 font-medium px-3 py-1 bg-amber-100 rounded-full flex items-center gap-2">
                        <span className="text-base">{LANGUAGES[language]?.flag || '🌐'}</span>
                        <span className="text-sm text-amber-600 font-medium">
                          {language.toUpperCase()}
                        </span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(LANGUAGES).map(([code, lang], index) => (
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

                            <span className="text-lg mr-2">{lang.flag}</span>

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
              onClick={() => window.open('tel:4703501019', '_self')}
              className="group w-28 sm:w-auto bg-transparent border-2 border-green-400/80 text-green-200 hover:bg-green-400/10 hover:border-green-300 hover:text-green-100 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              <span>{t.ui?.callNow || 'Call Now'}</span>

            </button>
          </div>
        </div>
      </section>

      {/* Restaurant Status Indicator Section */}
      <section className="py-4 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-100/50 hover:shadow-xl transition-all duration-300">
              
              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={cn(
                    "w-3 h-3 rounded-full shadow-sm",
                    restaurantStatus.isOpen ? "bg-green-500" : "bg-red-500"
                  )}></div>
                  {restaurantStatus.isOpen && (
                    <div className={cn(
                      "absolute inset-0 w-3 h-3 rounded-full animate-ping",
                      "bg-green-400 opacity-75"
                    )}></div>
                  )}
                  {restaurantStatus.liveData && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-semibold text-sm",
                      restaurantStatus.isOpen ? "text-green-700" : "text-red-700"
                    )}>
                      {restaurantStatus.isOpen ? 'We\'re Open' : 'Currently Closed'}
                    </span>
                    {restaurantStatus.liveData && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                        LIVE
                      </span>
                    )}
                  </div>
                  {restaurantStatus.isOpen && restaurantStatus.nextClosing && (
                    <span className="text-xs text-gray-500">
                      Until {restaurantStatus.nextClosing}
                    </span>
                  )}
                  {!restaurantStatus.isOpen && restaurantStatus.nextOpening && (
                    <span className="text-xs text-gray-500">
                      Opens {restaurantStatus.nextOpening}
                    </span>
                  )}
                </div>
              </div>

              {/* Activity Level */}
              {restaurantStatus.isOpen && (
                <>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">Activity</span>
                      <div className="flex gap-1">
                        {[1,2,3,4].map((level) => (
                          <div 
                            key={level}
                            className={cn(
                              "w-1.5 h-4 rounded-full transition-all duration-500 ease-out",
                              (restaurantStatus.busyLevel === 'low' && level <= 1) ||
                              (restaurantStatus.busyLevel === 'medium' && level <= 2) ||
                              (restaurantStatus.busyLevel === 'high' && level <= 3) ||
                              (restaurantStatus.busyLevel === 'very-high' && level <= 4)
                                ? "bg-gradient-to-t from-amber-400 via-orange-400 to-red-400 shadow-sm" 
                                : "bg-gray-200"
                            )}
                            style={{
                              animationDelay: `${level * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-medium capitalize",
                        restaurantStatus.busyLevel === 'low' && "text-green-600",
                        restaurantStatus.busyLevel === 'medium' && "text-yellow-600",
                        restaurantStatus.busyLevel === 'high' && "text-orange-600",
                        restaurantStatus.busyLevel === 'very-high' && "text-red-600"
                      )}>
                        {restaurantStatus.busyLevel.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {restaurantStatus.busyLevel === 'low' && 'Perfect time to visit'}
                        {restaurantStatus.busyLevel === 'medium' && 'Moderate crowd'}
                        {restaurantStatus.busyLevel === 'high' && 'Quite busy'}
                        {restaurantStatus.busyLevel === 'very-high' && 'Very busy period'}
                      </span>
                    </div>
                  </div>
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

      {/* About Us Section - Clean & Mobile-Friendly */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <MiddleEasternPattern />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clean Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-amber-700 font-medium text-sm">{t.about?.badge || 'Our Story'}</span>
              <Star className="w-4 h-4 text-amber-500 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              {t.about?.title || 'About Nature Village'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t.about?.subtitle || 'Bringing authentic Middle Eastern flavors and warm hospitality to our community'}
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
                  {t.about?.story1 || 'Nature Village is dedicated to bringing you the authentic flavors of Middle Eastern cuisine in a warm and welcoming atmosphere where every guest feels like family.'}
                </p>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  {t.about?.story2 || 'Our chefs are passionate about preparing traditional Middle Eastern dishes using the finest ingredients and time-honored cooking techniques that celebrate our rich culinary heritage.'}
                </p>
                
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <p className="text-amber-800 italic font-medium">
                    "{t.about?.quote || 'Every dish is crafted with care and served with the warmth of Middle Eastern hospitality.'}"
                  </p>
                </div>
              </div>
              
              {/* Simple Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.about?.features?.chefs?.title || 'Expert Chefs'}</h4>
                  <p className="text-sm text-gray-600">{t.about?.features?.chefs?.description || 'Authentic Middle Eastern cuisine'}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-orange-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.about?.features?.ingredients?.title || 'Fresh Ingredients'}</h4>
                  <p className="text-sm text-gray-600">{t.about?.features?.ingredients?.description || 'Quality sourced daily'}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-red-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.about?.features?.service?.title || 'Warm Service'}</h4>
                  <p className="text-sm text-gray-600">{t.about?.features?.service?.description || 'Middle Eastern hospitality'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Clean Statistics */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">1000+</div>
                <div className="text-sm font-medium text-gray-700">{t.about?.stats?.happyCustomers || 'Happy Customers'}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">50+</div>
                <div className="text-sm font-medium text-gray-700">{t.about?.stats?.authenticDishes || 'Authentic Dishes'}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">4.8★</div>
                <div className="text-sm font-medium text-gray-700">{t.about?.stats?.customerRating || 'Customer Rating'}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">100%</div>
                <div className="text-sm font-medium text-gray-700">{t.about?.stats?.freshIngredients || 'Fresh Ingredients'}</div>
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

        {/* Floating Celebration Elements - positioned to avoid text overlap */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          <div className="absolute top-20 left-8 text-3xl opacity-20 animate-float" style={{animationDelay: '0s'}}>🎈</div>
          <div className="absolute top-32 right-16 text-2xl opacity-30 animate-float" style={{animationDelay: '2s'}}>🎊</div>
          <div className="absolute bottom-40 left-1/6 text-xl opacity-40 animate-float" style={{animationDelay: '4s'}}>✨</div>
          <div className="absolute bottom-24 right-1/4 text-2xl opacity-25 animate-float" style={{animationDelay: '1s'}}>🌟</div>
          <div className="absolute top-1/3 left-3/4 text-xl opacity-20 animate-float" style={{animationDelay: '3s'}}>💫</div>
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
                  
                  {/* Subtle sparkles - positioned away from text */}
                  <span className="absolute -top-6 -right-8 text-amber-300 text-xl animate-pulse opacity-70 hidden sm:block">✨</span>
                  <span className="absolute -bottom-6 -left-8 text-amber-300 text-lg animate-pulse opacity-50 hidden sm:block" style={{animationDelay: '1s'}}>✨</span>
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
                  {/* Floating particles inside card - positioned in corners away from text */}
                  <div className="absolute top-4 right-4 text-amber-300 text-lg opacity-40 animate-float hidden sm:block">🎈</div>
                  <div className="absolute bottom-4 left-4 text-yellow-300 text-sm opacity-30 animate-float hidden sm:block">✨</div>
                  
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
                  {/* Floating particles inside card */}
                  <div className="absolute top-4 right-4 text-rose-300 text-lg opacity-50 animate-float" style={{animationDelay: '0.5s'}}>🌹</div>
                  <div className="absolute bottom-4 left-4 text-pink-300 text-sm opacity-40 animate-float" style={{animationDelay: '1.5s'}}>💕</div>
                  
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
                <div className="text-white font-medium group-hover:text-amber-200 transition-colors duration-300 text-sm lg:text-base">Graduations</div>
              </div>
              <div className="group text-center p-5 lg:p-6 bg-gradient-to-br from-white/10 to-white/15 rounded-2xl border border-white/15 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-3xl lg:text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">💍</div>
                </div>
                <div className="text-white font-medium group-hover:text-pink-200 transition-colors duration-300 text-sm lg:text-base">Engagements</div>
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
                <div className="text-white font-medium group-hover:text-green-200 transition-colors duration-300 text-sm lg:text-base">Holidays</div>
              </div>
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 rounded-3xl blur-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/15 to-white/10 rounded-3xl p-6 lg:p-8 border border-white/25 backdrop-blur-lg">
                {/* Floating particles around CTA - positioned safely away from text */}
                <div className="absolute top-3 left-3 text-amber-300 text-base opacity-25 animate-float hidden lg:block">✨</div>
                <div className="absolute top-3 right-3 text-orange-300 text-base opacity-30 animate-float hidden lg:block" style={{animationDelay: '1s'}}>🎊</div>
                <div className="absolute bottom-3 left-3 text-yellow-300 text-sm opacity-20 animate-float hidden lg:block" style={{animationDelay: '2s'}}>💫</div>
                <div className="absolute bottom-3 right-3 text-red-300 text-sm opacity-25 animate-float hidden lg:block" style={{animationDelay: '0.5s'}}>✨</div>
                
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
                  <span className="whitespace-nowrap text-center">Book 48 hours in advance for the best celebration experience</span>
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
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-sm flex items-center justify-center">
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
                <div className="text-sm sm:text-base text-amber-600 font-medium">Happy Customers</div>
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
                  <span>Call (470) 350-1019</span>
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
                {t.footer?.description || 'Bringing the authentic flavors and warm hospitality of the Middle East to your table. Every dish is a celebration of our rich cultural heritage and culinary excellence.'}
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
                <span className="opacity-80">{t.footer?.poweredBy || 'Powered by'}</span>
                <button
                  onClick={handleBlunariClick}
                  className="group flex items-center space-x-1.5 hover:text-white transition-all duration-300 font-semibold bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-500/30 px-3 py-1.5 rounded-lg border border-amber-600/30 hover:border-amber-500/50 hover:scale-105 transform"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                  </svg>
                  <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent font-bold">
                    {t.footer?.blunari || 'Blunari'}
                  </span>
                  <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 opacity-5">
          <MiddleEasternPattern />
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
      </div>
    </>
  );
};

export default NatureVillageWebsite;