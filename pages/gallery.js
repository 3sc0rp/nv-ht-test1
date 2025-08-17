import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { 
  Grid, ZoomIn, Heart, Share, Eye, X, Download, 
  Instagram, Facebook, ChefHat, Home, Camera
} from 'lucide-react';

const GalleryPage = () => {
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryView, setGalleryView] = useState('grid');
  const [language, setLanguage] = useState('en');
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();

  // Handle mounting and language
  useEffect(() => {
    setIsMounted(true);
    if (router.query.lang) {
      setLanguage(router.query.lang);
    }
  }, [router.query.lang]);

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

  // Translations
  const translations = {
    en: {
      gallery: {
        title: 'Gallery',
        subtitle: 'A visual journey through our culinary heritage and restaurant atmosphere',
        featured: 'Featured',
        shareTitle: 'Share Your Experience',
        shareSubtitle: 'Tag us in your photos and stories! We love seeing how our dishes bring joy to your table.',
        shareButton: 'Share'
      }
    },
    ku: {
      gallery: {
        title: 'گالەری',
        subtitle: 'گەشتێکی بیناییی بە میراتی چێشتلێنانمان و کەشی چێشتخانەکەمان',
        featured: 'نمایشکراو',
        shareTitle: 'ئەزموونەکەت هاوبەش بکە',
        shareSubtitle: 'لە وێنە و چیرۆکەکانتدا ئاماژەمان بکە! خۆشمان دەوێت ببینین چۆن خۆراکەکانمان خۆشی دەهێننە مێزەکەت.',
        shareButton: 'هاوبەش'
      }
    },
    ar: {
      gallery: {
        title: 'المعرض',
        subtitle: 'رحلة بصرية عبر تراثنا الطهوي وأجواء مطعمنا',
        featured: 'مميز',
        shareTitle: 'شارك تجربتك',
        shareSubtitle: 'ضع علامة لنا في صورك وقصصك! نحب أن نرى كيف تجلب أطباقنا الفرح إلى طاولتك.',
        shareButton: 'شارك'
      }
    }
  };

  const t = translations[language] || translations.en;

  // Filter functionality
  const filteredGalleryImages = useMemo(() => {
    if (galleryFilter === 'all') return galleryImages;
    return galleryImages.filter(image => image.category === galleryFilter);
  }, [galleryImages, galleryFilter]);

  // Lightbox functionality
  const openLightbox = useCallback((image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setLightboxOpen(false);
  }, []);

  // Social sharing functionality
  const shareImage = useCallback(async (image) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.alt[language] || image.alt.en,
          text: image.story?.[language] || image.story?.en,
          url: image.src
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  }, [language]);

  if (!isMounted) {
    return <div className="min-h-screen bg-amber-50"></div>;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t.gallery?.title || 'Gallery'}
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 max-w-4xl mx-auto">
            {t.gallery?.subtitle || 'A visual journey through our culinary heritage and restaurant atmosphere'}
          </p>
          <div className="w-32 h-1 bg-white mx-auto mt-8"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Gallery Controls */}
        <div className="mb-12">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(galleryCategories).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setGalleryFilter(key)}
                  className={`px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 ${
                    galleryFilter === key
                      ? 'bg-amber-500 text-white shadow-lg transform scale-105'
                      : 'bg-white text-amber-700 hover:bg-amber-100 border border-amber-200 hover:shadow-md'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{category[language] || category.en}</span>
                </button>
              );
            })}
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="bg-white p-1 rounded-lg border border-amber-200 shadow-sm">
              <button
                onClick={() => setGalleryView('grid')}
                className={`p-3 rounded transition-all duration-200 ${
                  galleryView === 'grid' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Grid className="w-6 h-6" />
              </button>
              <button
                onClick={() => setGalleryView('masonry')}
                className={`p-3 rounded transition-all duration-200 ${
                  galleryView === 'masonry' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                <ZoomIn className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-6 ${
          galleryView === 'masonry' 
            ? 'sm:columns-2 lg:columns-3 xl:columns-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {filteredGalleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                galleryView === 'masonry' ? 'break-inside-avoid mb-6' : 'aspect-square'
              }`}
              onClick={() => openLightbox(image)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <img
                src={image.src}
                alt={image.alt[language] || image.alt.en}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-semibold mb-3">
                  {image.alt[language] || image.alt.en}
                </h3>
                
                {image.story && (
                  <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                    {image.story[language] || image.story.en}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-medium">{image.likes}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        shareImage(image);
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Featured Badge */}
              {image.featured && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {t.gallery?.featured || 'Featured'}
                </div>
              )}
              
              {/* View Icon */}
              <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Social CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold mb-6">
                {t.gallery?.shareTitle || 'Share Your Experience'}
              </h3>
              <p className="text-amber-100 mb-10 max-w-2xl mx-auto text-lg">
                {t.gallery?.shareSubtitle || 'Tag us in your photos and stories! We love seeing how our dishes bring joy to your table.'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://www.instagram.com/naturevillageatl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="font-semibold text-lg">Instagram</span>
                </a>
                
                <a
                  href="https://facebook.com/naturevillagerestaurant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="font-semibold text-lg">Facebook</span>
                </a>
                
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Nature Village Restaurant Gallery',
                        text: 'Check out this amazing Kurdish restaurant gallery!',
                        url: window.location.href
                      });
                    }
                  }}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Share className="w-6 h-6" />
                  <span className="font-semibold text-lg">{t.gallery?.shareButton || 'Share'}</span>
                </button>
              </div>
              
              <div className="mt-10 text-amber-100">
                <p className="text-xl font-semibold">#NatureVillageATL #KurdishCuisine #AuthenticFlavors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-5xl w-full max-h-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="aspect-video relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt[language] || selectedImage.alt.en}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <h3 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                {selectedImage.alt[language] || selectedImage.alt.en}
              </h3>
              
              {selectedImage.story && (
                <p className="text-gray-600 mb-6 text-lg">
                  {selectedImage.story[language] || selectedImage.story.en}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-red-500" />
                    <span className="text-gray-700 text-lg font-medium">{selectedImage.likes} likes</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedImage.tags.map((tag) => (
                      <span key={tag} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => shareImage(selectedImage)}
                    className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200"
                  >
                    <Share className="w-5 h-5" />
                    <span className="font-medium">Share</span>
                  </button>
                  
                  <a
                    href={selectedImage.src}
                    download
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      <div className="fixed bottom-8 left-8 z-40">
        <button
          onClick={() => router.push('/')}
          className="bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default GalleryPage;
