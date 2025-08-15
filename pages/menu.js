import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Filter } from 'lucide-react'
import { useRouter } from 'next/router'

const FullMenuPage = () => {
  const router = useRouter()
  const [language, setLanguage] = useState('en')
  const [activeFilter, setActiveFilter] = useState('all')

  const languages = {
    en: { name: 'English', code: 'en', dir: 'ltr' },
    ku: { name: 'کوردی', code: 'ku', dir: 'rtl' },
    ar: { name: 'العربية', code: 'ar', dir: 'rtl' },
    fa: { name: 'فارسی', code: 'fa', dir: 'rtl' },
    tr: { name: 'Türkçe', code: 'tr', dir: 'ltr' },
    ur: { name: 'اردو', code: 'ur', dir: 'rtl' },
    kmr: { name: 'Kurdî (Kurmancî)', code: 'kmr', dir: 'ltr' }
  }

  const translations = {
    en: { 
      title: 'Full Menu', 
      subtitle: 'Explore all our dishes powered by MenuIQ', 
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
      }
    },
    ku: { 
      title: 'هەموو خۆراکەکان', 
      subtitle: 'ههّموو خۆراكههّكانمان ببینە به MenuIQ', 
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
      }
    },
    ar: { 
      title: 'القائمة الكاملة', 
      subtitle: 'استكشف جميع أطباقنا مدعومة بـ MenuIQ', 
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
      }
    },
    fa: { 
      title: 'منوی کامل', 
      subtitle: 'همه غذاهای ما با MenuIQ', 
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
      }
    },
    tr: { 
      title: 'Tam Menü', 
      subtitle: 'Tüm yemeklerimiz MenuIQ ile', 
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
      }
    },
    ur: { 
      title: 'مکمل مینیو', 
      subtitle: 'تمام ڈشز MenuIQ کے ساتھ', 
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
      }
    },
    kmr: { 
      title: 'Hemû Menû', 
      subtitle: 'Hemû xwarinên me bi MenuIQ', 
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
      }
    }
  }

  // Complete menu items with full translations
  const menuItems = [
    // Appetizers
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
      image: 'https://images.unsplash.com/photo-1604908176997-4319b0600b3a?w=300&h=200&fit=crop', 
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
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop', 
      tags: ['vegetarian', 'vegan'] 
    },
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
        en: 'Tomatoes, cucumbers, green peppers, onions, olives, feta cheese, mixed greens, and olive oil.',
        ar: 'طماطم وخيار وفلفل أخضر وبصل وزيتون وجبن فيتا وخضروات مشكلة وزيت زيتون.',
        fa: 'گوجه‌فرنگی، خیار، فلفل سبز، پیاز، زیتون، پنیر فتا، سبزیجات مخلوط و روغن زیتون.',
        ku: 'تەماتە، خیار، بیبەری سەوز، پیاز، زەیتوون، پەنیری فیتا، سەوزەی تێکەڵ و زەیتی زەیتوون.',
        tr: 'Domates, salatalık, yeşil biber, soğan, zeytin, beyaz peynir, karışık yeşillikler ve zeytinyağı.',
        ur: 'ٹماٹر، کھیرا، ہری مرچ، پیاز، زیتون، فیٹا چیز، ملے جلے سبزیجات اور زیتون کا تیل۔',
        kmr: 'Firangoş, xiyar, biberê kesk, pîvaz, zeytûn, penîrê feta, sebzeyên tevlihev û zeyta zeytûnê.'
      }, 
      price: '$13.99', 
      category: 'salads', 
      popular: true, 
      image: 'https://images.unsplash.com/photo-1569058242567-93de6f168329?w=300&h=200&fit=crop', 
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
      id: 1601, 
      name: { 
        en: 'Masgouf',
        ar: 'مسكوف',
        fa: 'مسگوف',
        ku: 'مەسگووف',
        tr: 'Masguf',
        ur: 'مسگوف',
        kmr: 'Masgûf'
      }, 
      description: { 
        en: 'Special Iraqi style fish marinated with a blend of spices, then slow-cooked to perfection over an open flame. Must be ordered a day before visit.',
        ar: 'سمك عراقي خاص متبل بخليط من التوابل، ثم يُطبخ ببطء للكمال على نار مفتوحة. يجب طلبه قبل يوم من الزيارة.',
        fa: 'ماهی سبک عراقی خاص با ادویه‌جات مخلوط، سپس روی شعله باز به آهستگی تا کمال پخته می‌شود. باید یک روز قبل از ویزیت سفارش داده شود.',
        ku: 'ماسی عێراقی تایبەت بە تێکەڵەی بەهارات مارینە کراو، پاشان بە هێواشی لەسەر ئاگری کراوە بە تەواوی لێنراو. دەبێت یەک ڕۆژ پێش سەردان فەرمایش بکرێت.',
        tr: 'Baharat karışımı ile marine edilmiş özel Irak tarzı balık, daha sonra açık ateşte mükemmelliğe kadar yavaş pişirilir. Ziyaretten bir gün önce sipariş verilmelidir.',
        ur: 'خاص عراقی طرز کی مچھلی جو مصالحوں کے مکسچر سے میرینیٹ کی گئی، پھر کھلی آگ پر آہستہ آہستہ مکمل طور پر پکائی گئی۔ ویزٹ سے ایک دن پہلے آرڈر کرنا ضروری ہے۔',
        kmr: 'Masîyeke taybet a Iraqî ya ku bi tevahiya baharatan hatiye marine kirin, paşî li ser agirê vekirî hêdî hêdî heta temamî hatiye pijandin. Divê rojek berî serdanê bê siparîşkirin.'
      }, 
      category: 'fish', 
      popular: true, 
      variants: [ 
        { label: { en: 'Serving for 2', ar: 'يكفي لـ 2', fa: 'برای 2 نفر', ku: 'بۆ 2 کەس', tr: '2 Kişilik', ur: '2 افراد کے لیے', kmr: 'Ji bo 2 kesan' }, price: '$39.99' }, 
        { label: { en: 'Serving for 4', ar: 'يكفي لـ 4', fa: 'برای 4 نفر', ku: 'بۆ 4 کەس', tr: '4 Kişilik', ur: '4 افراد کے لیے', kmr: 'Ji bo 4 kesan' }, price: '$74.99' } 
      ], 
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&h=200&fit=crop', 
      tags: [] 
    },
    { 
      id: 1501, 
      name: { 
        en: 'Margherita Pizza',
        ar: 'بيتزا مارجريتا',
        fa: 'پیتزا مارگاریتا',
        ku: 'پیتزای مارگەریتا',
        tr: 'Margarita Pizza',
        ur: 'مارگریٹا پیزا',
        kmr: 'Pizza Margherita'
      }, 
      description: { 
        en: 'Fresh mozzarella, aromatic basil, and flavorful tomato sauce on thin, crispy crust lightly brushed with olive oil.',
        ar: 'موتزاريلا طازجة وريحان عطري وصلصة طماطم لذيذة على قاعدة رقيقة ومقرمشة مدهونة قليلاً بزيت الزيتون.',
        fa: 'موتزارلا تازه، ریحان معطر و سس گوجه‌فرنگی خوشمزه روی خمیر نازک و ترد که کمی با روغن زیتون مالیده شده.',
        ku: 'موزارێلای تازە، ڕێحانی بۆنخۆش و سۆسی تەماتەی بە تام لەسەر بنکەی تەنک و ترسکە کە بە کەمی زەیتی زەیتوون مالراوە.',
        tr: 'Taze mozzarella, aromatik fesleğen ve lezzetli domates sosu ince, çıtır hamur üzerinde zeytinyağı ile hafifçe fırçalanmış.',
        ur: 'تازہ موزاریلا، خوشبودار تلسی، اور لذیذ ٹماٹر ساس پتلے، کرکرے کرسٹ پر جو زیتون کے تیل سے ہلکا سا برش کیا گیا ہے۔',
        kmr: 'Mozzarellaya taze, rêhanê bêhnxweş û soşa firangoşê bi tam li ser bingeha tenik û çitir a ku bi zeyta zeytûnê kêm hatiye malîn.'
      }, 
      price: '$13.99', 
      category: 'pizza', 
      popular: true, 
      image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=300&h=200&fit=crop', 
      tags: [] 
    },
    { 
      id: 2201, 
      name: { 
        en: 'Baklava',
        ar: 'بقلاوة',
        fa: 'باقلوا',
        ku: 'بەقڵاوا',
        tr: 'Baklava',
        ur: 'بقلاوہ',
        kmr: 'Baklawa'
      }, 
      description: { 
        en: 'A sweet pastry with layers of nuts and honey.',
        ar: 'معجنات حلوة بطبقات من المكسرات والعسل.',
        fa: 'شیرینی ورقه‌ای با لایه‌هایی از مغزیجات و عسل.',
        ku: 'شیرینییەکی ورقە بە چینە چینە گوێز و هەنگوین.',
        tr: 'Fındık katmanları ve bal ile tatlı hamur işi.',
        ur: 'میوے اور شہد کی تہوں کے ساتھ میٹھی پیسٹری۔',
        kmr: 'Şîrîniyeke ku bi çînên gûzan û hingiv hatiye çêkirin.'
      }, 
      price: '$6.99', 
      category: 'dessert', 
      popular: true, 
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop', 
      tags: ['sweet', 'traditional'] 
    },
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
      price: '$1.50', 
      category: 'drinks_cold', 
      popular: false, 
      image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300&h=200&fit=crop', 
      tags: [] 
    },
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
      price: '$2.99', 
      category: 'drinks_hot', 
      popular: false, 
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300&h=200&fit=crop', 
      tags: [] 
    }
  ]

  const t = translations[language] || translations.en

  // Sync language with query param (?lang=xx) and propagate changes sitewide
  useEffect(() => {
    const qpLang = typeof router.query.lang === 'string' ? router.query.lang : undefined
    if (qpLang && languages[qpLang]) {
      setLanguage(qpLang)
      document.documentElement.setAttribute('dir', languages[qpLang].dir)
      document.documentElement.lang = qpLang
    } else {
      document.documentElement.setAttribute('dir', languages[language].dir)
      document.documentElement.lang = language
    }
  }, [router.query.lang, language])

  const handleLanguageChange = (next) => {
    setLanguage(next)
    document.documentElement.setAttribute('dir', languages[next].dir)
    document.documentElement.lang = next
    const url = { pathname: router.pathname, query: { ...router.query, lang: next } }
    router.replace(url, undefined, { shallow: true })
  }

  // Enhanced getText function that handles multilingual objects
  const getText = (textObj, fallbackKey = '') => {
    if (!textObj) return fallbackKey || ''
    
    // If it's already a string, return it
    if (typeof textObj === 'string') return textObj
    
    // If it's an object with language keys, get the appropriate translation
    if (typeof textObj === 'object') {
      return textObj[language] || textObj.en || fallbackKey || ''
    }
    
    return fallbackKey || ''
  }

  const getTagTranslation = (tag) => {
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
  }

  const filteredMenuItems = activeFilter === 'all'
    ? menuItems
    : activeFilter === 'popular'
      ? menuItems.filter(item => item.popular)
      : menuItems.filter(item => item.category === activeFilter)

  const isRTL = languages[language].dir === 'rtl'
  const dirStyle = { direction: languages[language].dir }

  return (
    <>
      <Head>
        <title>Nature Village - {t.title}</title>
        <meta name="description" content={t.subtitle} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100" style={dirStyle}>
        {/* Decorative header pattern */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-amber-100/30 to-orange-100/30 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 pt-24">
          {/* Enhanced Header */}
          <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-12`}>
            <div className="space-y-2">
              <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-amber-700 text-lg max-w-2xl leading-relaxed">{t.subtitle}</p>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-amber-600`}>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'قائمة محدثة مباشرة' :
                   language === 'fa' ? 'منوی به‌روزرسانی زنده' :
                   language === 'ku' ? 'مێنیوی نوێکراوەی ڕاستەوخۆ' :
                   language === 'tr' ? 'Canlı güncellenmiş menü' :
                   language === 'ur' ? 'براہ راست اپڈیٹ شدہ مینو' :
                   language === 'kmr' ? 'Menuya nûkirî ya zindî' :
                   'Live updated menu'}
                </span>
              </div>
            </div>
            
            {/* Enhanced Language Selector */}
            <div className="relative group">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`appearance-none bg-white/90 backdrop-blur-sm text-amber-800 border-2 border-amber-200 rounded-xl px-4 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-amber-200 focus:border-amber-400 ${isRTL ? 'pl-10 pr-4' : 'pr-10'}`}
                style={dirStyle}
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>{lang.name}</option>
                ))}
              </select>
              <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className={`flex flex-wrap ${isRTL ? 'justify-end' : 'justify-center'} gap-4 mb-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100`} style={dirStyle}>
            {Object.entries(t.filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} ${
                  activeFilter === key 
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-amber-800 hover:bg-amber-50 hover:shadow-md border border-amber-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{label}</span>
                {activeFilter === key && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" style={dirStyle}>
            {filteredMenuItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img src={item.image} alt={getText(item.name)} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                  {item.popular && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ {t.filters.popular}
                    </div>
                  )}
                  {/* Hover overlay */}
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
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mb-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                      {item.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {getTagTranslation(tag)}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Handle variants */}
                  {item.variants ? (
                    <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-3 mb-2 flex-wrap`}>
                      {item.variants.map((variant, i) => (
                        <span key={i} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-2 rounded-full text-sm font-semibold hover:bg-amber-100 transition-colors">
                          {getText(variant.label)}: {variant.price}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-2`}>
                      <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                    </div>
                  )}
                  
                  {/* Handle add-ons */}
                  {item.addOns && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-amber-800 mb-2 text-sm">
                        {getText(item.addOns.title)}
                      </div>
                      <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        {item.addOns.options.map((option, idx) => (
                          <span key={idx} className="bg-white text-amber-700 border border-amber-200 px-2 py-1 rounded-full text-xs hover:bg-amber-50 transition-colors">
                            {getText(option.name)} {option.price}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {language === 'ar' ? 'لا توجد عناصر في هذه الفئة' :
                 language === 'fa' ? 'موردی در این دسته یافت نشد' :
                 language === 'ku' ? 'هیچ شتێک لەم جۆرە نییە' :
                 language === 'tr' ? 'Bu kategoride öğe bulunamadı' :
                 language === 'ur' ? 'اس کیٹگری میں کوئی آئٹم نہیں ملا' :
                 language === 'kmr' ? 'Di vê kategoriyê de tiştek nehat dîtin' :
                 'No items found in this category'}
              </p>
            </div>
          )}
        </div>
        
        {/* Enhanced Footer */}
        <footer className="mt-20 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-20" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
                 }}>
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
              
              {/* Restaurant Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-amber-100 mb-4">
                    {language === 'ar' ? 'قرية الطبيعة' :
                     language === 'fa' ? 'دهکده طبیعت' :
                     language === 'ku' ? 'گوندی سروشت' :
                     language === 'tr' ? 'Doğa Köyü' :
                     language === 'ur' ? 'فطرت کا گاؤں' :
                     language === 'kmr' ? 'Gundê Xwezayê' :
                     "Nature's Village"}
                  </h3>
                  <p className="text-amber-200 leading-relaxed">
                    {language === 'ar' ? 'تجربة طعام كردية أصيلة في قلب أتلانتا. نقدم أطباق تقليدية بنكهات حديثة.' :
                     language === 'fa' ? 'تجربه غذای کردی اصیل در قلب آتلانتا. غذاهای سنتی با طعم‌های مدرن ارائه می‌دهیم.' :
                     language === 'ku' ? 'ئەزموونی خواردنی کوردی ڕەسەن لە دڵی ئەتلانتا. خواردنی نەریتی بە تامی نوێ پێشکەش دەکەین.' :
                     language === 'tr' ? 'Atlanta\'nın kalbinde otantik Kürt yemek deneyimi. Geleneksel yemekleri modern lezzetlerle sunuyoruz.' :
                     language === 'ur' ? 'اٹلانٹا کے دل میں اصل کردش کھانے کا تجربہ۔ ہم روایتی کھانے جدید ذائقوں کے ساتھ پیش کرتے ہیں۔' :
                     language === 'kmr' ? 'Ezmûna xwarinê ya Kurdî ya orîjînal li dil Atlanta. Em xwarinên kevneşopî bi tamên nû pêşkêş dikin.' :
                     'Authentic Kurdish dining experience in the heart of Atlanta. We serve traditional dishes with modern flavors.'}
                  </p>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <div className="w-5 h-5 bg-amber-400 rounded-full flex-shrink-0"></div>
                    <span className="text-amber-200">123 Kurdish Lane, Atlanta, GA 30309</span>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <div className="w-5 h-5 bg-amber-400 rounded-full flex-shrink-0"></div>
                    <span className="text-amber-200">(404) 555-KURD</span>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <div className="w-5 h-5 bg-amber-400 rounded-full flex-shrink-0"></div>
                    <span className="text-amber-200">info@naturesvillage.com</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-amber-100">
                  {language === 'ar' ? 'روابط سريعة' :
                   language === 'fa' ? 'لینک‌های سریع' :
                   language === 'ku' ? 'بەستەری خێرا' :
                   language === 'tr' ? 'Hızlı Bağlantılar' :
                   language === 'ur' ? 'فوری لنکس' :
                   language === 'kmr' ? 'Girêdanên Bilez' :
                   'Quick Links'}
                </h3>
                <div className="space-y-3">
                  {[
                    { en: 'Home', ar: 'الرئيسية', fa: 'خانه', ku: 'سەرەتا', tr: 'Ana Sayfa', ur: 'ہوم', kmr: 'Serûpel' },
                    { en: 'About Us', ar: 'من نحن', fa: 'درباره ما', ku: 'دەربارەمان', tr: 'Hakkımızda', ur: 'ہمارے بارے میں', kmr: 'Derbarê Me' },
                    { en: 'Reservations', ar: 'الحجوزات', fa: 'رزرو', ku: 'حیجز', tr: 'Rezervasyon', ur: 'بکنگ', kmr: 'Rezervasyon' },
                    { en: 'Contact', ar: 'اتصل بنا', fa: 'تماس', ku: 'پەیوەندی', tr: 'İletişim', ur: 'رابطہ', kmr: 'Têkilî' }
                  ].map((link, index) => (
                    <a key={index} href="#" className="block text-amber-200 hover:text-amber-100 transition-colors hover:translate-x-1 transform duration-200">
                      {getText(link)}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Hours & Social */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-amber-100">
                  {language === 'ar' ? 'ساعات العمل' :
                   language === 'fa' ? 'ساعات کاری' :
                   language === 'ku' ? 'کاتی کارکردن' :
                   language === 'tr' ? 'Çalışma Saatleri' :
                   language === 'ur' ? 'کام کے اوقات' :
                   language === 'kmr' ? 'Demên Xebatê' :
                   'Opening Hours'}
                </h3>
                <div className="space-y-2 text-amber-200">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الإثنين - الخميس' :
                           language === 'fa' ? 'دوشنبه - پنج‌شنبه' :
                           language === 'ku' ? 'دووشەممە - پێنجشەممە' :
                           language === 'tr' ? 'Pazartesi - Perşembe' :
                           language === 'ur' ? 'پیر - جمعرات' :
                           language === 'kmr' ? 'Duşem - Pêncşem' :
                           'Mon - Thu'}</span>
                    <span>11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الجمعة - السبت' :
                           language === 'fa' ? 'جمعه - شنبه' :
                           language === 'ku' ? 'هەینی - شەممە' :
                           language === 'tr' ? 'Cuma - Cumartesi' :
                           language === 'ur' ? 'جمعہ - ہفتہ' :
                           language === 'kmr' ? 'În - Şemî' :
                           'Fri - Sat'}</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الأحد' :
                           language === 'fa' ? 'یکشنبه' :
                           language === 'ku' ? 'یەکشەممە' :
                           language === 'tr' ? 'Pazar' :
                           language === 'ur' ? 'اتوار' :
                           language === 'kmr' ? 'Yekşem' :
                           'Sunday'}</span>
                    <span>12:00 PM - 9:00 PM</span>
                  </div>
                </div>
                
                {/* Social Media */}
                <div className="pt-4">
                  <h4 className="text-lg text-amber-100 mb-3">
                    {language === 'ar' ? 'تابعنا' :
                     language === 'fa' ? 'ما را دنبال کنید' :
                     language === 'ku' ? 'شوێنمان بکەون' :
                     language === 'tr' ? 'Bizi Takip Edin' :
                     language === 'ur' ? 'ہمیں فالو کریں' :
                     language === 'kmr' ? 'Me Bişopînin' :
                     'Follow Us'}
                  </h4>
                  <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                    {['facebook', 'instagram', 'twitter'].map((social) => (
                      <a key={social} href="#" className="w-10 h-10 bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg">
                        <div className="w-5 h-5 bg-white rounded-sm"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="border-t border-amber-700 mt-12 pt-8">
              <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''} justify-between items-center space-y-4 md:space-y-0`}>
                
                {/* Copyright */}
                <div className="text-amber-300 text-sm">
                  © 2024 Nature's Village. {language === 'ar' ? 'جميع الحقوق محفوظة' :
                                          language === 'fa' ? 'تمام حقوق محفوظ است' :
                                          language === 'ku' ? 'هەموو مافەکان پارێزراون' :
                                          language === 'tr' ? 'Tüm hakları saklıdır' :
                                          language === 'ur' ? 'تمام حقوق محفوظ ہیں' :
                                          language === 'kmr' ? 'Hemû maf parastî ne' :
                                          'All rights reserved'}.
                </div>
                
                {/* Powered by Blunari - Enhanced */}
                <div className={`flex items-center group ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <span className="text-amber-300 text-sm">
                    {language === 'ar' ? 'مدعوم بـ' :
                     language === 'fa' ? 'قدرت گرفته از' :
                     language === 'ku' ? 'پشتگیری کراو لەلایەن' :
                     language === 'tr' ? 'Destekleyen' :
                     language === 'ur' ? 'سپورٹ کردہ' :
                     language === 'kmr' ? 'Piştgirî kirin ji alî' :
                     'Powered by'}
                  </span>
                  <a 
                    href="https://blunari.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center"
                  >
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                    
                    {/* Main button */}
                    <div className={`relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl hover:from-blue-500 hover:to-purple-500 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      {/* AI Icon */}
                      <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                      </div>
                      <span className="font-bold tracking-wide">Blunari</span>
                      {/* Arrow icon */}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
        </footer>
      </div>
    </>
  )
}

export default FullMenuPage