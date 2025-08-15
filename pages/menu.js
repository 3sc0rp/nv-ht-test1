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
      id: 1003, 
      name: { 
        en: 'Cool Bulgur Garden',
        ar: 'سلطة البرغل بالبن',
        fa: 'باغ بلغور خنک',
        ku: 'باخی بولگوری سارد',
        tr: 'Serinletici Bulgur Bahçesi',
        ur: 'ٹھنڈا بلغور باغ',
        kmr: 'Baxça Bulgura Sar'
      }, 
      description: { 
        en: 'A light and nutritious dip made with yogurt, bulgur, tahini, lemon juice, and lettuce.',
        ar: 'غموس خفيف ومغذي مصنوع من اللبن والبرغل والطحينة وعصير الليمون والخس.',
        fa: 'یک دیپ سبک و مغذی از ماست، بلغور، طحینی، آب لیمو و کاهو.',
        ku: 'دیپێکی سووک و خۆراکی لە ماست، بولگور، تەحینی، شیری لیمۆ و کاهو.',
        tr: 'Yoğurt, bulgur, tahin, limon suyu ve maruldan yapılan hafif ve besleyici bir meze.',
        ur: 'دہی، بلغور، تل کا پیسٹ، لیموں کا رس اور سلاد سے بنا ہلکا اور غذائیت سے بھرپور ڈپ۔',
        kmr: 'Mezeyeke sivik û xwarina ku ji mastê, bulgur, tahînî, ava lîmonê û kahuyê tê çêkirin.'
      }, 
      price: '$8.50', 
      category: 'appetizers', 
      popular: false, 
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop', 
      tags: ['vegetarian'] 
    },
    { 
      id: 1004, 
      name: { 
        en: 'Kibbeh',
        ar: 'كبة',
        fa: 'کبه',
        ku: 'کوبە',
        tr: 'İçli Köfte',
        ur: 'کبی',
        kmr: 'Kibê'
      }, 
      description: { 
        en: 'A Middle Eastern classic with a crispy outer shell made from finely ground rice and spices, encasing a flavorful minced meat filling. Fried to perfection.',
        ar: 'طبق شرق أوسطي كلاسيكي بقشرة خارجية مقرمشة مصنوعة من الأرز المطحون ناعماً والتوابل، تحتوي على حشوة لحم مفروم لذيذة. مقلية إلى الكمال.',
        fa: 'یک کلاسیک خاورمیانه‌ای با پوسته بیرونی ترد از برنج نرم آسیاب شده و ادویه‌جات، حاوی گوشت چرخ کرده طعم‌دار. به کمال سرخ شده.',
        ku: 'کلاسیکێکی ڕۆژهەڵاتی ناوەڕاست بە قەڵفێکی دەرەوەی ترسکە لە برنجی ورد کراو و بەهارات، پڕ لە گۆشتی هاڕاو بە تام. بە تەواوی سووتراو.',
        tr: 'İnce çekilmiş pirinç ve baharatlardan yapılan çıtır dış kabuğu olan, içinde lezzetli kıyma dolgulu Orta Doğu klasiği. Mükemmel kızartılmış.',
        ur: 'باریک پسے چاول اور مصالحوں سے بنے کرکرے باہری خول کے ساتھ مشرق وسطیٰ کا کلاسک، جس میں لذیذ قیمہ کی فلنگ ہے۔ مکمل طور پر تلا ہوا۔',
        kmr: 'Klasîkeke Rojhilatê Navîn a ku qişra derveyî ya çitir ji brincê hindir hatî û baharatan çêkirî, dagirê tijahiya goştê hêşkirî ya xweştam e. Bi temamî sorkirî.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: true, 
      image: 'https://images.unsplash.com/photo-1604908554027-8f9e0d5302c0?w=300&h=200&fit=crop', 
      tags: ['fried'] 
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
        en: 'Chickpea patties seasoned with aromatic spices and fried to a golden, crispy exterior. Served with fresh greens and a drizzle of olive oil.',
        ar: 'كرات الحمص المتبلة بالتوابل العطرية والمقلية حتى تصبح ذهبية ومقرمشة من الخارج. تُقدم مع الخضروات الطازجة ورذاذ من زيت الزيتون.',
        fa: 'کوفته‌های نخود چاشنی شده با ادویه‌جات معطر و سرخ شده تا بیرون طلایی و ترد شود. با سبزیجات تازه و کمی روغن زیتون سرو می‌شود.',
        ku: 'کێکی نۆک بە بەهاراتی بۆنخۆش و سووتراو تا ببێتە زێڕین و ترسکە لە دەرەوە. لەگەڵ سەوزەی تازە و دڵۆپەی زەیتی زەیتوون دەخرێتە سەر.',
        tr: 'Aromatik baharatlarla baharatlanmış ve altın sarısı, çıtır bir dış yüzey elde edene kadar kızartılmış nohut köftesi. Taze yeşillikler ve zeytinyağı çiselemeleri ile servis edilir.',
        ur: 'خوشبودار مصالحوں سے سیزن کیے گئے چنے کے کٹلٹ جو سنہری، کرکرے بیرونی حصے تک تلے گئے ہیں۔ تازہ سبزیوں اور زیتون کے تیل کے ساتھ پیش کیا جاتا ہے۔',
        kmr: 'Kofteyên kurskotên bi baharatên bêhnxweş hatine amade kirin û heta ku derve zêrî û çitir bibin sorkirine. Bi sebzeyên taze û zeyta zeytûnê tê pêşkêşkirin.'
      }, 
      price: '$9.99', 
      category: 'appetizers', 
      popular: false, 
      image: 'https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?w=300&h=200&fit=crop', 
      tags: ['vegetarian', 'vegan'] 
    },
    // Greek Salad
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
    // Masgouf
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
    // Margherita Pizza
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
    // Baklava
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
    // Water
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
    // Arabic Coffee
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
  }, [router.query.lang])

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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50" style={dirStyle}>
        <div className="max-w-7xl mx-auto px-4 pt-24">
          <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-8`}>
            <div>
              <h1 className="text-4xl font-serif font-bold text-amber-800">{t.title}</h1>
              <p className="text-amber-700 mt-2">{t.subtitle}</p>
            </div>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`appearance-none bg-white text-amber-800 border border-amber-200 rounded-md px-3 py-2 ${isRTL ? 'pl-8 pr-3' : 'pr-8'}`}
                style={dirStyle}
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className={`flex flex-wrap ${isRTL ? 'justify-end' : 'justify-center'} gap-3 mb-10`} style={dirStyle}>
            {Object.entries(t.filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === key ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />{label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={dirStyle}>
            {filteredMenuItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <img src={item.image} alt={getText(item.name)} className="w-full h-48 object-cover" />
                <div className={`${isRTL ? 'text-right' : 'text-left'} p-6`}>
                  <h3 className="text-xl font-serif font-bold text-amber-800 mb-1">
                    {getText(item.name)}
                  </h3>
                  {item.description && (
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {getText(item.description)}
                    </p>
                  )}
                  
                  {/* Handle variants */}
                  {item.variants ? (
                    <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-3 mb-2 flex-wrap`}>
                      {item.variants.map((variant, i) => (
                        <span key={i} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold">
                          {getText(variant.label)}: {variant.price}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-2`}>
                      <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                      {item.popular && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                          {t.filters.popular}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Handle add-ons */}
                  {item.addOns && (
                    <div className="mt-3 text-sm">
                      <div className="font-semibold text-amber-800 mb-1">
                        {getText(item.addOns.title)}
                      </div>
                      <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        {item.addOns.options.map((option, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
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
      </div>
    </>
  )
}

export default FullMenuPage