import React, { useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Grid,
  Maximize2,
  Download,
  Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';

const GalleryPage = () => {
  const { language, isRTL } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const translations = {
    en: {
      title: 'Photo Gallery',
      subtitle: 'Explore Our Culinary Journey',
      description: 'Discover the rich flavors and authentic ambiance of Nature Village through our gallery',
      allPhotos: 'All Photos',
      dishes: 'Signature Dishes',
      ambiance: 'Restaurant Ambiance',
      events: 'Special Events',
      closeGallery: 'Close Gallery',
      previous: 'Previous',
      next: 'Next',
      viewImage: 'View Image',
      photoCount: 'photos',
      downloadImage: 'Download',
      shareImage: 'Share'
    },
    ku: {
      title: 'گاڵەری وێنەکان',
      subtitle: 'گەشتی خۆراکیمان ببینە',
      description: 'تامە دەوڵەمەندەکان و کەشوهەوای ڕاستەقینەی گوندی سروشت لە ڕێگەی گاڵەریەکەمانەوە بدۆزەرەوە',
      allPhotos: 'هەموو وێنەکان',
      dishes: 'خۆراکی تایبەت',
      ambiance: 'کەشی چێشتخانە',
      events: 'بۆنە تایبەتەکان',
      closeGallery: 'داخستنی گاڵەری',
      previous: 'پێشوو',
      next: 'دواتر',
      viewImage: 'بینینی وێنە',
      photoCount: 'وێنە',
      downloadImage: 'داگرتن',
      shareImage: 'هاوبەشکردن'
    },
    ar: {
      title: 'معرض الصور',
      subtitle: 'استكشف رحلتنا الطهوية',
      description: 'اكتشف النكهات الغنية والأجواء الأصيلة لقرية الطبيعة من خلال معرضنا',
      allPhotos: 'جميع الصور',
      dishes: 'الأطباق المميزة',
      ambiance: 'أجواء المطعم',
      events: 'المناسبات الخاصة',
      closeGallery: 'إغلاق المعرض',
      previous: 'السابق',
      next: 'التالي',
      viewImage: 'عرض الصورة',
      photoCount: 'صورة',
      downloadImage: 'تحميل',
      shareImage: 'مشاركة'
    },
    fa: {
      title: 'گالری عکس',
      subtitle: 'سفر آشپزی ما را کاوش کنید',
      description: 'طعم‌های غنی و فضای اصیل دهکده طبیعت را از طریق گالری ما کشف کنید',
      allPhotos: 'همه عکس‌ها',
      dishes: 'غذاهای ویژه',
      ambiance: 'فضای رستوران',
      events: 'رویدادهای ویژه',
      closeGallery: 'بستن گالری',
      previous: 'قبلی',
      next: 'بعدی',
      viewImage: 'مشاهده تصویر',
      photoCount: 'عکس',
      downloadImage: 'دانلود',
      shareImage: 'اشتراک‌گذاری'
    },
    tr: {
      title: 'Fotoğraf Galerisi',
      subtitle: 'Mutfak Yolculuğumuzu Keşfedin',
      description: 'Galerimiz aracılığıyla Nature Village\'ın zengin lezzetlerini ve otantik atmosferini keşfedin',
      allPhotos: 'Tüm Fotoğraflar',
      dishes: 'Özel Yemekler',
      ambiance: 'Restoran Ambiyansı',
      events: 'Özel Etkinlikler',
      closeGallery: 'Galeriyi Kapat',
      previous: 'Önceki',
      next: 'Sonraki',
      viewImage: 'Görüntüyü Görüntüle',
      photoCount: 'fotoğraf',
      downloadImage: 'İndir',
      shareImage: 'Paylaş'
    },
    es: {
      title: 'Galería de Fotos',
      subtitle: 'Explora Nuestro Viaje Culinario',
      description: 'Descubre los ricos sabores y el ambiente auténtico de Nature Village a través de nuestra galería',
      allPhotos: 'Todas las Fotos',
      dishes: 'Platos Especiales',
      ambiance: 'Ambiente del Restaurante',
      events: 'Eventos Especiales',
      closeGallery: 'Cerrar Galería',
      previous: 'Anterior',
      next: 'Siguiente',
      viewImage: 'Ver Imagen',
      photoCount: 'fotos',
      downloadImage: 'Descargar',
      shareImage: 'Compartir'
    },
    ur: {
      title: 'تصاویر کی گیلری',
      subtitle: 'ہمارے کھانے کا سفر دریافت کریں',
      description: 'ہماری گیلری کے ذریعے نیچر ولیج کے بھرپور ذائقوں اور مستند ماحول کو دریافت کریں',
      allPhotos: 'تمام تصاویر',
      dishes: 'خاص پکوان',
      ambiance: 'ریستوراں کا ماحول',
      events: 'خاص تقریبات',
      closeGallery: 'گیلری بند کریں',
      previous: 'پچھلا',
      next: 'اگلا',
      viewImage: 'تصویر دیکھیں',
      photoCount: 'تصاویر',
      downloadImage: 'ڈاؤن لوڈ',
      shareImage: 'شیئر'
    },
    kmr: {
      title: 'Galeriya Wêneyan',
      subtitle: 'Rêwîtiya Me ya Xwarinê Vekolin',
      description: 'Taman dewlemend û atmosfera rast a Gundê Xwezayê bi rêya galeriya me bibînin',
      allPhotos: 'Hemû Wêne',
      dishes: 'Xwarinên Taybet',
      ambiance: 'Atmosfera Xwaringehê',
      events: 'Bûyerên Taybet',
      closeGallery: 'Galeriyê Bigire',
      previous: 'Pêşî',
      next: 'Paşî',
      viewImage: 'Wêneyê Bibîne',
      photoCount: 'wêne',
      downloadImage: 'Daxe',
      shareImage: 'Parve Bike'
    },
    ru: {
      title: 'Фотогалерея',
      subtitle: 'Исследуйте Наше Кулинарное Путешествие',
      description: 'Откройте для себя богатые вкусы и аутентичную атмосферу Nature Village через нашу галерею',
      allPhotos: 'Все Фото',
      dishes: 'Фирменные Блюда',
      ambiance: 'Атмосфера Ресторана',
      events: 'Специальные События',
      closeGallery: 'Закрыть Галерею',
      previous: 'Предыдущий',
      next: 'Следующий',
      viewImage: 'Просмотр Изображения',
      photoCount: 'фотографий',
      downloadImage: 'Скачать',
      shareImage: 'Поделиться'
    },
    hi: {
      title: 'फोटो गैलरी',
      subtitle: 'हमारी पाक यात्रा का अन्वेषण करें',
      description: 'हमारी गैलरी के माध्यम से नेचर विलेज के समृद्ध स्वाद और प्रामाणिक वातावरण की खोज करें',
      allPhotos: 'सभी फोटो',
      dishes: 'विशेष व्यंजन',
      ambiance: 'रेस्टोरेंट का माहौल',
      events: 'विशेष कार्यक्रम',
      closeGallery: 'गैलरी बंद करें',
      previous: 'पिछला',
      next: 'अगला',
      viewImage: 'छवि देखें',
      photoCount: 'फोटो',
      downloadImage: 'डाउनलोड',
      shareImage: 'साझा करें'
    },
    sq: {
      title: 'Galeria e Fotografive',
      subtitle: 'Eksploroni Udhëtimin Tonë Kulinar',
      description: 'Zbuloni shijet e pasura dhe atmosferën autentike të Nature Village nëpërmjet galerisë sonë',
      allPhotos: 'Të Gjitha Fotografitë',
      dishes: 'Pjata Speciale',
      ambiance: 'Ambienti i Restorantit',
      events: 'Ngjarje Speciale',
      closeGallery: 'Mbyll Galerinë',
      previous: 'E Mëparshme',
      next: 'E Ardhshme',
      viewImage: 'Shiko Imazhin',
      photoCount: 'fotografi',
      downloadImage: 'Shkarko',
      shareImage: 'Ndaj'
    },
    fr: {
      title: 'Galerie Photo',
      subtitle: 'Explorez Notre Voyage Culinaire',
      description: 'Découvrez les saveurs riches et l\'ambiance authentique de Nature Village à travers notre galerie',
      allPhotos: 'Toutes les Photos',
      dishes: 'Plats Signature',
      ambiance: 'Ambiance du Restaurant',
      events: 'Événements Spéciaux',
      closeGallery: 'Fermer la Galerie',
      previous: 'Précédent',
      next: 'Suivant',
      viewImage: 'Voir l\'Image',
      photoCount: 'photos',
      downloadImage: 'Télécharger',
      shareImage: 'Partager'
    },
    de: {
      title: 'Fotogalerie',
      subtitle: 'Entdecken Sie Unsere Kulinarische Reise',
      description: 'Entdecken Sie die reichen Aromen und das authentische Ambiente von Nature Village durch unsere Galerie',
      allPhotos: 'Alle Fotos',
      dishes: 'Signature-Gerichte',
      ambiance: 'Restaurant-Ambiente',
      events: 'Besondere Ereignisse',
      closeGallery: 'Galerie Schließen',
      previous: 'Zurück',
      next: 'Weiter',
      viewImage: 'Bild Ansehen',
      photoCount: 'Fotos',
      downloadImage: 'Herunterladen',
      shareImage: 'Teilen'
    },
    bn: {
      title: 'ছবির গ্যালারি',
      subtitle: 'আমাদের রান্নার যাত্রা অন্বেষণ করুন',
      description: 'আমাদের গ্যালারির মাধ্যমে নেচার ভিলেজের সমৃদ্ধ স্বাদ এবং প্রামাণিক পরিবেশ আবিষ্কার করুন',
      allPhotos: 'সমস্ত ছবি',
      dishes: 'বিশেষ খাবার',
      ambiance: 'রেস্তোরাঁর পরিবেশ',
      events: 'বিশেষ ইভেন্ট',
      closeGallery: 'গ্যালারি বন্ধ করুন',
      previous: 'পূর্ববর্তী',
      next: 'পরবর্তী',
      viewImage: 'ছবি দেখুন',
      photoCount: 'ছবি',
      downloadImage: 'ডাউনলোড',
      shareImage: 'শেয়ার'
    },
    ko: {
      title: '사진 갤러리',
      subtitle: '우리의 요리 여정을 탐험하세요',
      description: '갤러리를 통해 Nature Village의 풍부한 맛과 진정한 분위기를 발견하세요',
      allPhotos: '모든 사진',
      dishes: '시그니처 요리',
      ambiance: '레스토랑 분위기',
      events: '특별 이벤트',
      closeGallery: '갤러리 닫기',
      previous: '이전',
      next: '다음',
      viewImage: '이미지 보기',
      photoCount: '사진',
      downloadImage: '다운로드',
      shareImage: '공유'
    }
  };

  const t = translations[language] || translations.en;

  // Gallery images - organized by category
  const galleryImages = useMemo(() => [
    { id: 2, src: '/gallery/2.jpg', category: 'dishes', alt: 'Signature Dish' },
    { id: 3, src: '/gallery/3.jpg', category: 'dishes', alt: 'Grilled Specialties' },
    { id: 4, src: '/gallery/4.jpg', category: 'ambiance', alt: 'Restaurant Interior' },
    { id: 5, src: '/gallery/5.jpg', category: 'dishes', alt: 'Fresh Appetizers' },
    { id: 6, src: '/gallery/6.jpg', category: 'dishes', alt: 'Traditional Platter' },
    { id: 7, src: '/gallery/7.jpg', category: 'ambiance', alt: 'Dining Area' },
    { id: 8, src: '/gallery/8.jpg', category: 'dishes', alt: 'Dessert Selection' },
    { id: 9, src: '/gallery/9.jpg', category: 'dishes', alt: 'Main Course' },
    { id: 10, src: '/gallery/10.jpg', category: 'ambiance', alt: 'Welcoming Atmosphere' },
    { id: 11, src: '/gallery/11.jpg', category: 'dishes', alt: 'Kebab Platter' },
    { id: 12, src: '/gallery/12.jpg', category: 'dishes', alt: 'Traditional Dishes' },
    { id: 13, src: '/gallery/13.jpg', category: 'events', alt: 'Special Event' },
    { id: 14, src: '/gallery/14.jpg', category: 'dishes', alt: 'Fresh Salad' },
    { id: 15, src: '/gallery/15.jpg', category: 'dishes', alt: 'Grilled Meats' },
    { id: 16, src: '/gallery/16.jpg', category: 'ambiance', alt: 'Restaurant Decor' },
    { id: 17, src: '/gallery/17.jpg', category: 'dishes', alt: 'Signature Platter' },
    { id: 18, src: '/gallery/18.jpg', category: 'dishes', alt: 'Middle Eastern Feast' },
    { id: 19, src: '/gallery/19.jpg', category: 'events', alt: 'Celebration' },
    { id: 20, src: '/gallery/20.jpg', category: 'dishes', alt: 'Fresh Ingredients' },
    { id: 21, src: '/gallery/21.jpg', category: 'dishes', alt: 'Appetizer Collection' },
    { id: 22, src: '/gallery/22.jpg', category: 'ambiance', alt: 'Seating Area' },
    { id: 23, src: '/gallery/23.jpg', category: 'dishes', alt: 'Grilled Selection' },
    { id: 24, src: '/gallery/24.jpg', category: 'dishes', alt: 'Traditional Meal' },
    { id: 25, src: '/gallery/25.jpg', category: 'events', alt: 'Group Dining' },
    { id: 26, src: '/gallery/26.jpg', category: 'dishes', alt: 'Chef Special' },
    { id: 27, src: '/gallery/27.jpg', category: 'dishes', alt: 'Food Presentation' },
    { id: 28, src: '/gallery/28.jpg', category: 'ambiance', alt: 'Restaurant View' },
    { id: 29, src: '/gallery/29.jpg', category: 'dishes', alt: 'Delicious Platter' },
    { id: 30, src: '/gallery/30.jpg', category: 'events', alt: 'Special Occasion' }
  ], []);

  // Filter images by category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return galleryImages;
    return galleryImages.filter(img => img.category === selectedCategory);
  }, [selectedCategory, galleryImages]);

  // Categories for filtering
  const categories = useMemo(() => [
    { id: 'all', label: t.allPhotos, count: galleryImages.length },
    { id: 'dishes', label: t.dishes, count: galleryImages.filter(img => img.category === 'dishes').length },
    { id: 'ambiance', label: t.ambiance, count: galleryImages.filter(img => img.category === 'ambiance').length },
    { id: 'events', label: t.events, count: galleryImages.filter(img => img.category === 'events').length }
  ], [t, galleryImages]);

  // Handle image navigation in lightbox
  const handlePrevious = useCallback(() => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  }, [selectedImage, filteredImages]);

  const handleNext = useCallback(() => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  }, [selectedImage, filteredImages]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!selectedImage) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handlePrevious, handleNext]);

  return (
    <>
      <Head>
        <title>{t.title} - Nature Village Middle Eastern Restaurant</title>
        <meta name="description" content={t.description} />
        <meta property="og:title" content={`${t.title} - Nature Village`} />
        <meta property="og:description" content={t.description} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header currentPage="gallery" />

        {/* Simple Hero Section */}
        <div className="relative pt-32 sm:pt-36 lg:pt-40 pb-16">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-100/40 to-transparent"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 text-amber-800">
                {t.title}
              </h1>
              
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
              
              <p className="text-lg sm:text-xl text-gray-700 font-medium mb-3">
                {t.subtitle}
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                {t.description}
              </p>
              
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-md border border-amber-200">
                <Grid className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700 font-semibold">
                  {galleryImages.length}+ {t.photoCount}
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom wave decoration */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white" fillOpacity="0.5"/>
              <path d="M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-md border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-amber-50 border-2 border-gray-200'
                  }`}
                >
                  {category.label}
                  <span className="ml-2 text-sm opacity-75">({category.count})</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-amber-100 to-orange-100"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-center gap-2 text-white">
                        <Maximize2 className="w-5 h-5" />
                        <span className="font-semibold">{t.viewImage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 border-4 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No images message */}
          {filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No photos in this category yet.</p>
            </motion.div>
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                aria-label={t.closeGallery}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Navigation buttons */}
              {filteredImages.findIndex(img => img.id === selectedImage.id) > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300`}
                  aria-label={t.previous}
                >
                  {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                </motion.button>
              )}

              {filteredImages.findIndex(img => img.id === selectedImage.id) < filteredImages.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300`}
                  aria-label={t.next}
                >
                  {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </motion.button>
              )}

              {/* Image container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative max-w-7xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={1200}
                    height={1200}
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                    priority
                  />
                </div>

                {/* Image info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <p className="text-white text-lg font-semibold text-center">
                    {selectedImage.alt}
                  </p>
                  <p className="text-white/70 text-sm text-center mt-1">
                    {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
};

export default GalleryPage;
