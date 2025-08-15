import React, { useState } from 'react'
import Head from 'next/head'
import { Filter } from 'lucide-react'

const FullMenuPage = () => {
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
    en: { title: 'Full Menu', subtitle: 'Explore all our dishes powered by MenuIQ', filters: { all: 'All Items', appetizers: 'Appetizers', salads: 'Salads', sandwich_platter: 'Sandwich & Platter', naan: 'Naan', traditional: 'Traditional', vegan: 'Vegan & Vegetarian', soup: 'Soups', dessert: 'Desserts', popular: 'Most Popular' } },
    ku: { title: 'هەموو خۆراکەکان', subtitle: 'هه‌موو خۆراكه‌كانمان ببینە به‌ MenuIQ', filters: { all: 'هەموو', appetizers: 'خۆراکی پێش‌خواردن', salads: 'لەواشەکان', sandwich_platter: 'ساندویچ و پلیتەر', naan: 'نان', traditional: 'نەریتی', vegan: 'ڕووەکی و ڤێگان', soup: 'شۆربە', dessert: 'شیرینی', popular: 'بەناوبانگترین' } },
    ar: { title: 'القائمة الكاملة', subtitle: 'استكشف جميع أطباقنا مدعومة بـ MenuIQ', filters: { all: 'الكل', appetizers: 'مقبلات', salads: 'سلطات', sandwich_platter: 'سندويش وصحن', naan: 'نان', traditional: 'تقليدي', vegan: 'نباتي ونباتي صرف', soup: 'شوربات', dessert: 'حلويات', popular: 'الأكثر شهرة' } },
    fa: { title: 'منوی کامل', subtitle: 'همه غذاهای ما با MenuIQ', filters: { all: 'همه موارد', appetizers: 'پیش‌غذاها', salads: 'سالادها', sandwich_platter: 'ساندویچ و پلاتر', naan: 'نان', traditional: 'سنتی', vegan: 'گیاهی و وجترین', soup: 'سوپ‌ها', dessert: 'دسرها', popular: 'محبوب‌ترین' } },
    tr: { title: 'Tam Menü', subtitle: 'Tüm yemeklerimiz MenuIQ ile', filters: { all: 'Tümü', appetizers: 'Başlangıçlar', salads: 'Salatalar', sandwich_platter: 'Sandviç & Tabak', naan: 'Naan', traditional: 'Geleneksel', vegan: 'Vegan & Vejetaryen', soup: 'Çorbalar', dessert: 'Tatlılar', popular: 'En Popüler' } },
    ur: { title: 'مکمل مینیو', subtitle: 'تمام ڈشز MenuIQ کے ساتھ', filters: { all: 'سب', appetizers: 'سٹارٹرز', salads: 'سلادز', sandwich_platter: 'سینڈوچ اور پلیٹر', naan: 'نان', traditional: 'روایتی', vegan: 'ویگن و ویجیٹرین', soup: 'سوپس', dessert: 'میٹھائیاں', popular: 'سب سے مقبول' } },
    kmr: { title: 'Hemû Menû', subtitle: 'Hemû xwarinên me bi MenuIQ', filters: { all: 'Hemû', appetizers: 'Destpêk', salads: 'Salatan', sandwich_platter: 'Sandwîç û Plater', naan: 'Nan', traditional: 'Kevnebûyî', vegan: 'Vegan û Wejetaryen', soup: 'Şorbeyên', dessert: 'Şîrînî', popular: 'Herî Bilind' } }
  }
  const t = translations[language] || translations.en
  const getText = (obj) => (obj && (obj[language] || obj.en)) || ''

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
  ]

  const filteredMenuItems = activeFilter === 'all'
    ? menuItems
    : activeFilter === 'popular'
      ? menuItems.filter(item => item.popular)
      : menuItems.filter(item => item.category === activeFilter)

  const isRTL = languages[language].dir === 'rtl'

  return (
    <>
      <Head>
        <title>Nature Village - Full Menu</title>
        <meta name="description" content="Explore the full menu of Nature Village Kurdish Restaurant." />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 pt-24">
          <div className="flex justify-between items-center mb-8" style={{ direction: languages[language].dir }}>
            <div>
              <h1 className="text-4xl font-serif font-bold text-amber-800">{t.title}</h1>
              <p className="text-amber-700 mt-2">{t.subtitle}</p>
            </div>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-white text-amber-800 border border-amber-200 rounded-md px-3 py-2 pr-8"
                style={{ direction: languages[language].dir }}
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10" style={{ direction: languages[language].dir }}>
            {Object.entries(t.filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === key ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />{label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ direction: languages[language].dir }}>
            {filteredMenuItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <img src={item.image} alt={getText(item.name)} className="w-full h-48 object-cover" />
                <div className={`${isRTL ? 'text-right' : 'text-left'} p-6`}>
                  <h3 className="text-xl font-serif font-bold text-amber-800 mb-1">{getText(item.name)}</h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{getText(item.description)}</p>
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


