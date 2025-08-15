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
    en: { title: 'Full Menu', subtitle: 'Explore all our dishes powered by MenuIQ', filters: { all: 'All Items', appetizers: 'Appetizers', salads: 'Salads', sandwich_platter: 'Sandwich & Platter', naan: 'Naan', pizza: 'Pizza', fish: 'Fish', grill: 'Grill Platters', specialty: 'Specialty Dishes', kids: "Kid's Menu", drinks_cold: 'Drinks (Cold)', drinks_hot: 'Drinks (Hot)', soup: 'Soups', dessert: 'Desserts', popular: 'Most Popular' } },
    ku: { title: 'هەموو خۆراکەکان', subtitle: 'هه‌موو خۆراكه‌كانمان ببینە به‌ MenuIQ', filters: { all: 'هەموو', appetizers: 'خۆراکی پێش‌خواردن', salads: 'لەواشەکان', sandwich_platter: 'ساندویچ و پلیتەر', naan: 'نان', pizza: 'پیتزا', fish: 'ماسی', grill: 'پلیتەری گرێل', specialty: 'خۆراکی تایبەتی', kids: 'مێنیوی منداڵان', drinks_cold: 'خواردنەوەکان (سارد)', drinks_hot: 'خواردنەوەکان (گەرەم)', soup: 'شۆربە', dessert: 'شیرینی', popular: 'بەناوبانگترین' } },
    ar: { title: 'القائمة الكاملة', subtitle: 'استكشف جميع أطباقنا مدعومة بـ MenuIQ', filters: { all: 'الكل', appetizers: 'مقبلات', salads: 'سلطات', sandwich_platter: 'سندويش وصحن', naan: 'نان', pizza: 'بيتزا', fish: 'سمك', grill: 'مشاوي', specialty: 'أطباق مميزة', kids: 'قائمة الأطفال', drinks_cold: 'المشروبات (باردة)', drinks_hot: 'المشروبات (ساخنة)', soup: 'شوربات', dessert: 'حلويات', popular: 'الأكثر شهرة' } },
    fa: { title: 'منوی کامل', subtitle: 'همه غذاهای ما با MenuIQ', filters: { all: 'همه موارد', appetizers: 'پیش‌غذاها', salads: 'سالادها', sandwich_platter: 'ساندویچ و پلاتر', naan: 'نان', pizza: 'پیتزا', fish: 'ماهی', grill: 'کباب و گریل', specialty: 'غذاهای ویژه', kids: 'منوی کودکان', drinks_cold: 'نوشیدنی‌ها (سرد)', drinks_hot: 'نوشیدنی‌ها (گرم)', soup: 'سوپ‌ها', dessert: 'دسرها', popular: 'محبوب‌ترین' } },
    tr: { title: 'Tam Menü', subtitle: 'Tüm yemeklerimiz MenuIQ ile', filters: { all: 'Tümü', appetizers: 'Başlangıçlar', salads: 'Salatalar', sandwich_platter: 'Sandviç & Tabak', naan: 'Naan', pizza: 'Pizza', fish: 'Balık', grill: 'Izgara Tabaklar', specialty: 'Özel Yemekler', kids: 'Çocuk Menüsü', drinks_cold: 'İçecekler (Soğuk)', drinks_hot: 'İçecekler (Sıcak)', soup: 'Çorbalar', dessert: 'Tatlılar', popular: 'En Popüler' } },
    ur: { title: 'مکمل مینیو', subtitle: 'تمام ڈشز MenuIQ کے ساتھ', filters: { all: 'سب', appetizers: 'سٹارٹرز', salads: 'سلادز', sandwich_platter: 'سینڈوچ اور پلیٹر', naan: 'نان', pizza: 'پیزا', fish: 'مچھلی', grill: 'گرل پلیٹرز', specialty: 'خصوصی ڈشز', kids: 'بچوں کا مینیو', drinks_cold: 'مشروبات (سرد)', drinks_hot: 'مشروبات (گرم)', soup: 'سوپس', dessert: 'میٹھائیاں', popular: 'سب سے مقبول' } },
    kmr: { title: 'Hemû Menû', subtitle: 'Hemû xwarinên me bi MenuIQ', filters: { all: 'Hemû', appetizers: 'Destpêk', salads: 'Salatan', sandwich_platter: 'Sandwîç û Plater', naan: 'Nan', pizza: 'Pizza', fish: 'Masî', grill: 'Platerên Grill', specialty: 'Xwarinên Taybet', kids: 'Menûya Zarokan', drinks_cold: 'Vexwarin (Sarî)', drinks_hot: 'Vexwarin (Germ)', soup: 'Şorbeyên', dessert: 'Şîrînî', popular: 'Herî Bilind' } }
  }
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
  // Fallback name translations by English key → localized value
  const NAME_TRANSLATIONS = {
    ar: {
      'Hummus': 'حمص',
      'Baba Ghanoush': 'بابا غنوج',
      'Cool Bulgur Garden': 'سلطة البرغل باللبن',
      'Kibbeh': 'كبة',
      'Falafels': 'فلافل',
      'Borek': 'بوريك',
      'Appetizers Combo': 'تشكيلة مقبلات',
      'Greek Salad': 'سلطة يونانية',
      'Fattoush Salad': 'فتوش',
      'Shwan Salad': 'سلطة شوان',
      'Suwanee Salad': 'سلطة سواني',
      'Lentil Soup': 'شوربة عدس',
      'Iraqi Guss Platter': 'صحن كص عراقي',
      'Chicken Platter': 'صحن دجاج',
      'Falafels Platter': 'صحن فلافل',
      'Hawrami Naan': 'نان هورامي',
      'Samoon': 'سمون',
      'Sesame Kulera': 'كوليرة بالسمسم',
      'Margherita Pizza': 'بيتزا مارجريتا',
      'Kabab Pizza': 'بيتزا كباب',
      'Chicken Pizza': 'بيتزا دجاج',
      'Lahmacun': 'لحم بعجين',
      'Boat': 'بيتزا القارب',
      'Veggie Pizza': 'بيتزا خضار',
      'Masgouf': 'مسكوف',
      'Parda Biryani': 'بيراني برده',
      'Quzi': 'قوزي',
      'Mandi': 'مندي',
      'Nature Kabab': 'كباب الطبيعة',
      'Qaliya': 'قاليه',
      'Butter Shrimp': 'روبيان بالزبدة',
      'Village Carnival': 'كرنفال القرية',
      'Erbil Shish Kabab': 'شيش كباب أربيل',
      'Mahshi Kabab': 'محشي كباب',
      'Chicken Kabab': 'كباب دجاج',
      'Cokertme Kabab': 'جوكيرتما كباب',
      'Wings': 'أجنحة',
      'Beef Ribeye Tikka': 'تيكا ريب آي لحم',
      'Chicken Tikka': 'تيكا دجاج',
      'Lamb Chops': 'ضلوع خروف',
      "Nature's Village Special Platter": 'صحن مشاوي خاص',
      "Kid's Pizza": 'بيتزا أطفال',
      'Chicken Tenders': 'قطع دجاج',
      'Fries': 'بطاطا مقلية',
      'Water': 'ماء',
      'Sparkling Water': 'ماء غازي',
      'Soda': 'مشروبات غازية',
      'Erbil Yogurt Drink': 'دوغ أربيل',
      'Arabic Coffee': 'قهوة عربية',
      'Kurdish Qazwan Coffee': 'قهوة قازوان الكردية',
      'Turkish Pistachio Coffee': 'قهوة تركية بالفستق',
      'Karak Chai': 'شاي كرك',
      'Persian Tea': 'شاي فارسي',
      'Green Tea': 'شاي أخضر',
      'Baklava': 'بقلاوة',
      'Tiramisu': 'تيراميسو',
      'Khash Khash': 'خشخش',
      'Oven Rice Pudding': 'أرز بالحليب بالفرن',
      'Ice Cream': 'آيس كريم'
    },
    fa: {
      'Hummus': 'حمص',
      'Baba Ghanoush': 'باباغنوش',
      'Kibbeh': 'کبه',
      'Falafels': 'فلافل',
      'Borek': 'بورک',
      'Greek Salad': 'سالاد یونانی',
      'Fattoush Salad': 'فتوش',
      'Lentil Soup': 'سوپ عدس',
      'Hawrami Naan': 'نان هورامی',
      'Samoon': 'سمون',
      'Sesame Kulera': 'کولره کنجدی',
      'Margherita Pizza': 'پیتزا مارگاریتا',
      'Kabab Pizza': 'پیتزا کباب',
      'Chicken Pizza': 'پیتزا مرغ',
      'Lahmacun': 'لهمجون',
      'Veggie Pizza': 'پیتزا سبزیجات',
      'Masgouf': 'مسگوف',
      'Quzi': 'قوزی',
      'Mandi': 'مندی',
      'Chicken Tenders': 'استریپس مرغ',
      'Fries': 'سیب‌زمینی سرخ‌کرده',
      'Water': 'آب',
      'Sparkling Water': 'آب گازدار',
      'Soda': 'نوشابه',
      'Arabic Coffee': 'قهوه عربی',
      'Green Tea': 'چای سبز',
      'Baklava': 'بقلاوا',
      'Tiramisu': 'تیرامیسو',
      'Oven Rice Pudding': 'شیر برنج تنوری',
      'Ice Cream': 'بستنی'
    },
    tr: {
      'Hummus': 'Humus',
      'Baba Ghanoush': 'Babaganuş',
      'Kibbeh': 'İçli Köfte',
      'Falafels': 'Falafel',
      'Borek': 'Börek',
      'Greek Salad': 'Yunan Salatası',
      'Fattoush Salad': 'Fettuş',
      'Lentil Soup': 'Mercimek Çorbası',
      'Hawrami Naan': 'Hewramî Naan',
      'Samoon': 'Samun',
      'Sesame Kulera': 'Susamlı Kulera',
      'Margherita Pizza': 'Margarita Pizza',
      'Kabab Pizza': 'Kebap Pizza',
      'Chicken Pizza': 'Tavuklu Pizza',
      'Lahmacun': 'Lahmacun',
      'Veggie Pizza': 'Sebzeli Pizza',
      'Masgouf': 'Masguf',
      'Quzi': 'Kuzu Tandır',
      'Mandi': 'Mendi',
      'Chicken Tenders': 'Tavuk Şeritleri',
      'Fries': 'Patates Kızartması',
      'Water': 'Su',
      'Sparkling Water': 'Soda',
      'Soda': 'Kola/Meşrubat',
      'Arabic Coffee': 'Arap Kahvesi',
      'Green Tea': 'Yeşil Çay',
      'Baklava': 'Baklava',
      'Tiramisu': 'Tiramisu',
      'Ice Cream': 'Dondurma'
    },
    ur: {
      'Hummus': 'حُمص',
      'Baba Ghanoush': 'بابا غنوش',
      'Kibbeh': 'کبہ',
      'Falafels': 'فلافل',
      'Borek': 'بوریک',
      'Greek Salad': 'یونانی سلاد',
      'Fattoush Salad': 'فتوش سلاد',
      'Lentil Soup': 'دال کا سوپ',
      'Margherita Pizza': 'مارگریٹا پیزا',
      'Kabab Pizza': 'کباب پیزا',
      'Chicken Pizza': 'چکن پیزا',
      'Veggie Pizza': 'ویجی پیزا',
      'Masgouf': 'مسگوف',
      "Kid's Pizza": 'بچوں کی پیزا',
      'Chicken Tenders': 'چکن ٹینڈرز',
      'Fries': 'فرائز',
      'Water': 'پانی',
      'Sparkling Water': 'سوڈا واٹر',
      'Soda': 'سافٹ ڈرنکس',
      'Arabic Coffee': 'عربی کافی',
      'Green Tea': 'سبز چائے',
      'Baklava': 'بقلاوہ',
      'Tiramisu': 'تیرامیسو',
      'Ice Cream': 'آئس کریم'
    },
    ku: {
      'Hummus': 'حەممەس',
      'Baba Ghanoush': 'بابا غنوش',
      'Kibbeh': 'کوبە',
      'Falafels': 'فەلەفڵ',
      'Borek': 'بورێک',
      'Greek Salad': 'سالادی یونانی',
      'Fattoush Salad': 'فتوش',
      'Lentil Soup': 'شۆربی عدس',
      'Margherita Pizza': 'پیتزای مارگەرێتا',
      'Kabab Pizza': 'پیتزای کەباب',
      'Chicken Pizza': 'پیتزای مرۆڤ',
      'Masgouf': 'مەسگووف',
      'Fries': 'پیتاتی بەرژاو',
      'Water': 'ئاو',
      'Soda': 'شرۆبە',
      'Baklava': 'بەقڵاڤا'
    },
    kmr: {
      'Hummus': 'Humus',
      'Baba Ghanoush': 'Babeganûş',
      'Kibbeh': 'Kibê',
      'Falafels': 'Falafel',
      'Borek': 'Börek',
      'Greek Salad': 'Salata Yewnanî',
      'Fattoush Salad': 'Fettûş',
      'Lentil Soup': 'Şorbeyê Mercimekê',
      'Margherita Pizza': 'Pizza Margherita',
      'Kabab Pizza': 'Pizza Kebap',
      'Chicken Pizza': 'Pizza Mirîşkê',
      'Masgouf': 'Masgûf',
      'Fries': 'Patatesê Birîn',
      'Water': 'Av',
      'Soda': 'Şerbet',
      'Baklava': 'Baklawa'
    }
  }

  const getText = (obj, englishKey) => {
    const direct = (obj && (obj[language] || obj.en)) || ''
    if (direct) return direct
    if (englishKey && NAME_TRANSLATIONS[language] && NAME_TRANSLATIONS[language][englishKey]) {
      return NAME_TRANSLATIONS[language][englishKey]
    }
    return englishKey || ''
  }

  const menuItems = [
    // Appetizers
    { id: 1001, name: { en: 'Hummus' }, description: { en: 'A classic Middle Eastern dip made from mashed chickpeas, tahini, olive oil, lemon juice, and garlic.' }, price: '$8.50', category: 'appetizers', popular: true, image: 'https://images.unsplash.com/photo-1604908176997-4319b0600b3a?w=300&h=200&fit=crop', tags: ['vegetarian', 'vegan'] },
    { id: 1002, name: { en: 'Baba Ghanoush' }, description: { en: 'A Kurdish dip made from roasted eggplant, roasted tomatoes, peppers, fresh onions, parsley, mint, and pomegranate molasses dressing.' }, price: '$8.50', category: 'appetizers', popular: true, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop', tags: ['vegetarian', 'vegan'] },
    { id: 1003, name: { en: 'Cool Bulgur Garden' }, description: { en: 'A light and nutritious dip made with yogurt, bulgur, tahini, lemon juice, and lettuce.' }, price: '$8.50', category: 'appetizers', popular: false, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop', tags: ['vegetarian'] },
    { id: 1004, name: { en: 'Kibbeh' }, description: { en: 'A Middle Eastern classic with a crispy outer shell made from finely ground rice and spices, encasing a flavorful minced meat filling. Fried to perfection.' }, price: '$9.99', category: 'appetizers', popular: true, image: 'https://images.unsplash.com/photo-1604908554027-8f9e0d5302c0?w=300&h=200&fit=crop', tags: ['fried'] },
    { id: 1005, name: { en: 'Falafels' }, description: { en: 'Chickpea patties seasoned with aromatic spices and fried to a golden, crispy exterior. Served with fresh greens and a drizzle of olive oil.' }, price: '$9.99', category: 'appetizers', popular: false, image: 'https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?w=300&h=200&fit=crop', tags: ['vegetarian', 'vegan'] },
    { id: 1006, name: { en: "Nature's Blend" }, description: { en: 'A fresh dip made with avocados, fresh thyme, walnuts, mint, and olive oil.' }, price: '$8.99', category: 'appetizers', popular: false, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', tags: ['vegetarian'] },
    { id: 1007, name: { en: 'Borek' }, description: { en: 'Handmade beef börek crafted with a rich filling and served with a special sauce. Crispy pastry with unforgettable taste.' }, price: '$9.99', category: 'appetizers', popular: false, image: 'https://images.unsplash.com/photo-1514512364185-4c77e1f9cf3a?w=300&h=200&fit=crop', tags: [] },
    { id: 1008, name: { en: 'Appetizers Combo' }, description: { en: 'A platter of four beloved mezze flavors from the Middle East, with delicious falafel pastries. Elegant presentation and aromas.' }, price: '$25.99', category: 'appetizers', popular: true, image: 'https://images.unsplash.com/photo-1543339318-b43dc53d1d9d?w=300&h=200&fit=crop', tags: [] },
    // Salads
    { id: 1101, name: { en: 'Greek Salad' }, description: { en: 'Tomatoes, cucumbers, green peppers, onions, olives, feta cheese, mixed greens, and olive oil.' }, price: '$13.99', category: 'salads', popular: true, image: 'https://images.unsplash.com/photo-1569058242567-93de6f168329?w=300&h=200&fit=crop', tags: ['vegetarian'], addOns: { title: 'Add Protein', options: [ { name: 'Beef', price: '$7.99' }, { name: 'Chicken', price: '$6.99' }, { name: 'Falafel', price: '$4.99' }, { name: 'Shrimp', price: '$5.99' } ] } },
    { id: 1102, name: { en: 'Fattoush Salad' }, description: { en: 'Lettuce, tomatoes, cucumbers, green peppers, fresh mint, parsley, crispy pita bread, and pomegranate molasses dressing.' }, price: '$13.99', category: 'salads', popular: false, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop', tags: ['vegetarian'], addOns: { title: 'Add Protein', options: [ { name: 'Beef', price: '$7.99' }, { name: 'Chicken', price: '$6.99' }, { name: 'Falafel', price: '$4.99' }, { name: 'Shrimp', price: '$5.99' } ] } },
    { id: 1103, name: { en: 'Shwan Salad' }, description: { en: 'Tomatoes, cucumbers, green peppers, onions, parsley, walnuts, olive oil and lemon juice.' }, price: '$13.99', category: 'salads', popular: false, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', tags: ['vegetarian'], addOns: { title: 'Add Protein', options: [ { name: 'Beef', price: '$7.99' }, { name: 'Chicken', price: '$6.99' }, { name: 'Falafel', price: '$4.99' }, { name: 'Shrimp', price: '$5.99' } ] } },
    { id: 1104, name: { en: 'Suwanee Salad' }, description: { en: 'Boiled beets, tomatoes, bell peppers, cucumber, onions, and seasonal fruits. Colorful and refreshing.' }, price: '$14.99', category: 'salads', popular: false, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop', tags: ['vegetarian'], addOns: { title: 'Add Protein', options: [ { name: 'Beef', price: '$7.99' }, { name: 'Chicken', price: '$6.99' }, { name: 'Falafel', price: '$4.99' }, { name: 'Shrimp', price: '$5.99' } ] } },
    // Soups
    { id: 1201, name: { en: 'Lentil Soup' }, description: { en: 'A hearty and nutritious soup made with red lentils, onions, carrots, potatoes, and a blend of spices.' }, price: '$6.99', category: 'soup', popular: true, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop', tags: ['vegetarian'] },
    // Sandwich & Platter (variants)
    { id: 1301, name: { en: 'Iraqi Guss Platter' }, description: { en: 'Beef wrap, thinly sliced and seasoned. Served with a fresh salad or fries upon choice.' }, category: 'sandwich_platter', popular: true, variants: [ { label: 'Sandwich', price: '$15.99' }, { label: 'Platter', price: '$17.99' } ], image: 'https://images.unsplash.com/photo-1604908177111-19441f4e0f88?w=300&h=200&fit=crop', tags: [] },
    { id: 1302, name: { en: 'Chicken Platter' }, description: { en: 'Sliced, seasoned chicken wrap. Served with a side salad or fries upon choice.' }, category: 'sandwich_platter', popular: false, variants: [ { label: 'Sandwich', price: '$14.99' }, { label: 'Platter', price: '$16.99' } ], image: 'https://images.unsplash.com/photo-1604908177222-7a0d2a8f4f54?w=300&h=200&fit=crop', tags: [] },
    { id: 1303, name: { en: 'Falafels Platter' }, description: { en: 'Special chef made crispy falafel balls. Wrapped in soft pita bread, with fresh vegetables.' }, category: 'sandwich_platter', popular: false, variants: [ { label: 'Sandwich', price: '$14.99' }, { label: 'Platter', price: '$16.99' } ], image: 'https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?w=300&h=200&fit=crop', tags: ['vegetarian', 'vegan'] },
    // Naan
    { id: 1401, name: { en: 'Hawrami Naan' }, description: { en: 'A delightful flatbread originating from Hawraman, traditionally baked to perfection and served warm.' }, price: '$2.99', category: 'naan', popular: true, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=200&fit=crop', tags: [] },
    { id: 1402, name: { en: 'Samoon' }, description: { en: 'A delicious Middle Eastern bread, known for its soft and slightly chewy texture, often enjoyed with a variety of savory and sweet toppings.' }, price: '$2.99', category: 'naan', popular: false, image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&h=200&fit=crop', tags: [] },
    { id: 1403, name: { en: 'Sesame Kulera' }, description: { en: 'A type of flatbread made without the need for extensive kneading. Known for its simplicity and soft, chewy texture.' }, price: '$3.99', category: 'naan', popular: false, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', tags: [] },
    // Pizza
    { id: 1501, name: { en: 'Margherita Pizza' }, description: { en: 'Fresh mozzarella, aromatic basil, and flavorful tomato sauce on thin, crispy crust lightly brushed with olive oil.' }, price: '$13.99', category: 'pizza', popular: true, image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=300&h=200&fit=crop', tags: [] },
    { id: 1502, name: { en: 'Kabab Pizza' }, description: { en: 'Savory pizza topped with thin slices of beef kebab, special sauce, lettuce, onions, cucumbers, and tomatoes.' }, price: '$16.99', category: 'pizza', popular: false, image: 'https://images.unsplash.com/photo-1601924582971-b6f9243c9f17?w=300&h=200&fit=crop', tags: [] },
    { id: 1503, name: { en: 'Chicken Pizza' }, description: { en: 'Tender chicken slices, special sauce, lettuce, onions, cucumbers, and tomatoes on a crispy crust.' }, price: '$15.99', category: 'pizza', popular: false, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop', tags: [] },
    { id: 1504, name: { en: 'Lahmacun' }, description: { en: 'Traditional thin dough topped with a flavorful mixture of minced meat, onions, peppers, tomatoes, and spices. Served with lettuce, sumac onions, and lemon on the side.' }, price: '$15.99', category: 'pizza', popular: false, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop', tags: [] },
    { id: 1505, name: { en: 'Boat' }, description: { en: 'Boat-shaped crust with cheese, sauce, and various ingredients; presented in a unique shape with assorted toppings.' }, price: '$15.99', category: 'pizza', popular: false, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=300&h=200&fit=crop', tags: [], variants: [ { label: 'Kabab', price: '$16.99' }, { label: 'Chicken', price: '$15.99' } ] },
    { id: 1506, name: { en: 'Veggie Pizza' }, description: { en: 'Loaded with an assortment of fresh, colorful vegetables and your choice of cheese.' }, price: '$14.99', category: 'pizza', popular: false, image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=300&h=200&fit=crop', tags: ['vegetarian'] },
    // Fish
    { id: 1601, name: { en: 'Masgouf' }, description: { en: 'Special Iraqi style fish marinated with a blend of spices, then slow-cooked to perfection over an open flame. Must be ordered a day before visit.' }, category: 'fish', popular: true, variants: [ { label: 'Serving for 2', price: '$39.99' }, { label: 'Serving for 4', price: '$74.99' } ], image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&h=200&fit=crop', tags: [] },
    // Specialty Dishes
    { id: 1701, name: { en: 'Parda Biryani' }, description: { en: 'Rich dish of spiced rice with beef, dried grapes, almonds, peas, and potatoes, encased in a delicate pastry and baked. Served with fresh salad.' }, price: '$21.99', category: 'specialty', popular: true, image: 'https://images.unsplash.com/photo-1604908554027-8f9e0d5302c0?w=300&h=200&fit=crop', tags: [] },
    { id: 1702, name: { en: 'Quzi' }, description: { en: 'Traditional Middle Eastern dish made with saffron rice and lamb, garnished with toasted almonds and fresh parsley.' }, price: '$24.99', category: 'specialty', popular: false, image: 'https://images.unsplash.com/photo-1604908176997-4319b0600b3a?w=300&h=200&fit=crop', tags: [] },
    { id: 1703, name: { en: 'Mandi' }, description: { en: 'Traditional Middle Eastern dish with spiced rice and chicken, topped with fresh parsley before serving, accompanied by special sauces.' }, price: '$21.99', category: 'specialty', popular: false, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', tags: [] },
    { id: 1704, name: { en: 'Nature Kabab' }, description: { en: 'Roasted eggplant, cheddar cheese, and garlic. Served with erbil kabab and fresh fries.' }, price: '$25.99', category: 'specialty', popular: false, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop', tags: [] },
    { id: 1705, name: { en: 'Qaliya' }, description: { en: 'Traditional stew with beef and onions, simmered with rich spices and a savory sauce for deep flavor.' }, price: '$22.99', category: 'specialty', popular: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dada1?w=300&h=200&fit=crop', tags: [] },
    { id: 1706, name: { en: 'Butter Shrimp' }, description: { en: 'Shrimp sautéed with butter, mushrooms, and garlic. Served with special spicy seasoning.' }, price: '$22.99', category: 'specialty', popular: false, image: 'https://images.unsplash.com/photo-1555992336-03a23c42d9dc?w=300&h=200&fit=crop', tags: [] },
    { id: 1707, name: { en: 'Village Carnival' }, description: { en: 'Beef stew with carefully selected fresh vegetables and tender pieces of meat, slowly cooked, served with aromatic saffron rice.' }, price: '$23.99', category: 'specialty', popular: false, image: 'https://images.unsplash.com/photo-1476127396927-7b1722a42e08?w=300&h=200&fit=crop', tags: [] },
    // Grill Platters
    { id: 1801, name: { en: 'Erbil Shish Kabab' }, description: { en: 'Mix of lamb and beef, grilled to perfection. Served with saffron rice, seasonal salad, sumac onions, and grilled vegetables.' }, price: '$21.99', category: 'grill', popular: true, image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=300&h=200&fit=crop', tags: ['grilled'] },
    { id: 1802, name: { en: 'Mahshi Kabab' }, description: { en: 'Beef and lamb kabab, flavored with garlic, spicy peppers, and parsley. Served with seasonal salad, saffron rice, sumac onions, and grilled vegetables.' }, price: '$21.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1617195737496-7e3e6c2b7b1c?w=300&h=200&fit=crop', tags: ['grilled'] },
    { id: 1803, name: { en: 'Chicken Kabab' }, description: { en: 'Marinated chicken with spices, dried tomatoes, parsley, and fresh onions. Served with saffron rice, mixed greens salad, sumac onions, and grilled vegetables.' }, price: '$20.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop', tags: ['grilled'] },
    { id: 1804, name: { en: 'Cokertme Kabab' }, description: { en: 'Eggplant with yogurt topped with carefully prepared pita bread, thinly sliced rib eye pieces. Served with shoestring potatoes and special sauce.' }, price: '$24.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', tags: [] },
    { id: 1805, name: { en: 'Wings' }, description: { en: 'Grilled wings served with saffron rice, green salad, sumac onions, and grilled vegetables.' }, price: '$16.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', tags: [] },
    { id: 1806, name: { en: 'Beef Ribeye Tikka' }, description: { en: 'Paired with aromatic saffron rice, seasonal salad, sumac onions, and a medley of grilled vegetables.' }, price: '$22.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', tags: [] },
    { id: 1807, name: { en: 'Chicken Tikka' }, description: { en: 'Flavorful experience served with aromatic saffron rice, seasonal salad, sumac onions, and a medley of grilled vegetables.' }, price: '$19.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', tags: [] },
    { id: 1808, name: { en: 'Lamb Chops' }, description: { en: 'Marinated with special spices and perfectly cooked; served with saffron rice, seasonal salad, sumac onions, and grilled vegetables.' }, price: '$36.99', category: 'grill', popular: false, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop', tags: [] },
    { id: 1809, name: { en: "Nature's Village Special Platter" }, description: { en: 'Special Platter Mixed Grill.' }, category: 'grill', popular: true, variants: [ { label: 'Serving for 2', price: '$69.99' }, { label: 'Serving for 4', price: '$105.99' } ], image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', tags: [] },
    // Kid's Menu
    { id: 1901, name: { en: "Kid's Pizza" }, description: { en: 'Thin crust pizza made for kids.' }, price: '$10.99', category: 'kids', popular: false, image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=300&h=200&fit=crop', tags: [] },
    { id: 1902, name: { en: 'Chicken Tenders' }, description: { en: 'Tender strips of chicken breast, breaded and fried to a crispy golden brown, served with your choice of dipping sauces.' }, price: '$8.99', category: 'kids', popular: false, image: 'https://images.unsplash.com/photo-1571247865791-e08b3d2d0f3b?w=300&h=200&fit=crop', tags: [] },
    { id: 1903, name: { en: 'Fries' }, description: { en: 'Crispy, golden-brown potato fries, seasoned to perfection and served hot.' }, price: '$6.99', category: 'kids', popular: false, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop', tags: ['vegetarian'] },
    // Drinks - Cold
    { id: 2001, name: { en: 'Water' }, price: '$1.50', category: 'drinks_cold', popular: false, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300&h=200&fit=crop', tags: [] },
    { id: 2002, name: { en: 'Sparkling Water' }, price: '$3.99', category: 'drinks_cold', popular: false, image: 'https://images.unsplash.com/photo-1600271886759-80a1a3bbf0ab?w=300&h=200&fit=crop', tags: [] },
    { id: 2003, name: { en: 'Soda' }, category: 'drinks_cold', popular: true, variants: [ { label: 'Coke', price: '$2.99' }, { label: 'Diet Coke', price: '$2.99' }, { label: 'Coke Zero', price: '$2.99' }, { label: 'Sprite', price: '$2.99' }, { label: 'Fanta', price: '$2.99' }, { label: 'Minute Maid', price: '$2.99' } ], image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=200&fit=crop', tags: [] },
    { id: 2004, name: { en: 'Erbil Yogurt Drink' }, price: '$3.99', category: 'drinks_cold', popular: false, image: 'https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?w=300&h=200&fit=crop', tags: [] },
    // Drinks - Hot
    { id: 2101, name: { en: 'Arabic Coffee' }, price: '$2.99', category: 'drinks_hot', popular: false, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300&h=200&fit=crop', tags: [] },
    { id: 2102, name: { en: 'Kurdish Qazwan Coffee' }, price: '$3.50', category: 'drinks_hot', popular: false, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop', tags: [] },
    { id: 2103, name: { en: 'Turkish Pistachio Coffee' }, price: '$3.50', category: 'drinks_hot', popular: false, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop', tags: [] },
    { id: 2104, name: { en: 'Karak Chai' }, price: '$2.99', category: 'drinks_hot', popular: false, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=200&fit=crop', tags: [] },
    { id: 2105, name: { en: 'Persian Tea' }, price: '$2.50', category: 'drinks_hot', popular: false, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300&h=200&fit=crop', tags: [] },
    { id: 2106, name: { en: 'Green Tea' }, price: '$2.50', category: 'drinks_hot', popular: false, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', tags: [] },
    // Desserts
    { id: 2201, name: { en: 'Baklava' }, description: { en: 'A sweet pastry with layers of nuts and honey.' }, price: '$6.99', category: 'dessert', popular: true, image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop', tags: ['sweet', 'traditional'] },
    { id: 2202, name: { en: 'Tiramisu' }, description: { en: 'Sweetened whipped cream and a rich mascarpone.' }, price: '$5.99', category: 'dessert', popular: false, image: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=300&h=200&fit=crop', tags: ['sweet'] },
    { id: 2203, name: { en: 'Khash Khash' }, description: { en: 'Delicious dessert with layers of cream and crunchy vermicelli.' }, price: '$5.99', category: 'dessert', popular: false, image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=300&h=200&fit=crop', tags: ['sweet'] },
    { id: 2204, name: { en: 'Oven Rice Pudding' }, description: { en: 'Creamy Middle Eastern milk pudding.' }, price: '$5.99', category: 'dessert', popular: false, image: 'https://images.unsplash.com/photo-1541782814455-cf97b06a8a12?w=300&h=200&fit=crop', tags: ['sweet'] },
    { id: 2205, name: { en: 'Ice Cream' }, description: { en: 'Choose from 3 flavors: Strawberry, Chocolate, Vanilla. Single scoop.' }, category: 'dessert', popular: false, variants: [ { label: 'Single Scoop', price: '$2.99' } ], image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300&h=200&fit=crop', tags: ['sweet'] },
  ]

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
        <title>Nature Village - Full Menu</title>
        <meta name="description" content="Explore the full menu of Nature Village Kurdish Restaurant." />
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
                <img src={item.image} alt={getText(item.name, item.name?.en)} className="w-full h-48 object-cover" />
                <div className={`${isRTL ? 'text-right' : 'text-left'} p-6`}>
                  <h3 className="text-xl font-serif font-bold text-amber-800 mb-1">{getText(item.name, item.name?.en)}</h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{getText(item.description, item.description?.en)}</p>
                  {item.variants ? (
                    <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-3 mb-2`}>
                      {item.variants.map((v, i) => (
                        <span key={i} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold">
                          {v.label}: {v.price}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                      {item.popular && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">{t.filters.popular}</span>
                      )}
                    </div>
                  )}
                  {item.addOns && (
                    <div className="mt-3 text-sm">
                      <div className="font-semibold text-amber-800 mb-1">{item.addOns.title}</div>
                      <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        {item.addOns.options.map((opt, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
                            {opt.name} {opt.price}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FullMenuPage


