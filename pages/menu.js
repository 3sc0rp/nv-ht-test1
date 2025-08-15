import React, { useState } from 'react'
import Head from 'next/head'
import { Filter } from 'lucide-react'

const FullMenuPage = () => {
  const [language, setLanguage] = useState('en')
  const [activeFilter, setActiveFilter] = useState('all')

  const languages = {
    en: { name: 'English', code: 'en', dir: 'ltr' },
    ku: { name: 'کوردی', code: 'ku', dir: 'rtl' },
    ar: { name: 'العربية', code: 'ar', dir: 'rtl' }
  }

  const t = {
    en: {
      title: 'Full Menu',
      subtitle: 'Explore all our dishes powered by MenuIQ',
      filters: { all: 'All Items', traditional: 'Traditional', vegan: 'Vegan & Vegetarian', soup: 'Soups', dessert: 'Desserts', popular: 'Most Popular' }
    },
    ku: {
      title: 'هەموو خۆراکەکان',
      subtitle: 'هه‌موو خۆراكه‌كانمان ببینە به‌ MenuIQ',
      filters: { all: 'هەموو', traditional: 'نەریتی', vegan: 'ڕووەکی و ڤێگان', soup: 'شۆربە', dessert: 'شیرینی', popular: 'بەناوبانگترین' }
    },
    ar: {
      title: 'القائمة الكاملة',
      subtitle: 'استكشف جميع أطباقنا مدعومة بـ MenuIQ',
      filters: { all: 'الكل', traditional: 'تقليدي', vegan: 'نباتي ونباتي صرف', soup: 'شوربات', dessert: 'حلويات', popular: 'الأكثر شهرة' }
    }
  }[language]

  const menuItems = [
    { id: 1, name: { en: 'Kebab-e Kubideh', ku: 'کەباب کوبیده', ar: 'كباب كوبيده' }, description: { en: 'Traditional ground lamb kebab with aromatic spices, served with basmati rice and grilled tomatoes', ku: 'کەبابی نەریتی لە گۆشتی بەرخی هاڕاو لەگەڵ بۆنوبێرینی جۆراوجۆر، لەگەڵ برنجی باسماتی و تەماتەی برژاو', ar: 'كباب لحم الخروف المفروم التقليدي مع التوابل العطرة، يُقدم مع أرز البسمتي والطماطم المشوية' }, price: '$18.99', category: 'traditional', popular: true, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=200&fit=crop', tags: ['spicy', 'grilled'] },
    { id: 2, name: { en: 'Dolma', ku: 'دۆڵمە', ar: 'دولمة' }, description: { en: 'Grape leaves stuffed with rice, herbs, and spices - a Kurdish family recipe', ku: 'گەڵای مێو پڕکراو لە برنج و ڕووەک و بۆنوبێرین - ڕیسەتی خێزانی کوردی', ar: 'أوراق العنب محشوة بالأرز والأعشاب والتوابل - وصفة عائلية كردية' }, price: '$14.99', category: 'vegan', popular: false, image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=300&h=200&fit=crop', tags: ['vegetarian', 'traditional'] },
    { id: 3, name: { en: 'Yaprakh', ku: 'یاپراخ', ar: 'يبرق' }, description: { en: 'Cabbage rolls filled with rice, meat, and Kurdish spices in tomato sauce', ku: 'لەتی کەلەرم پڕکراو لە برنج و گۆشت و بۆنوبێرینی کوردی لە سۆسی تەماتە', ar: 'لفائف الملفوف محشوة بالأرز واللحم والتوابل الكردية في صلصة الطماطم' }, price: '$16.99', category: 'traditional', popular: true, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop', tags: ['comfort food'] },
    { id: 4, name: { en: 'Ash-e Reshteh', ku: 'ئاشی ڕەشتە', ar: 'آش رشتة' }, description: { en: 'Hearty Kurdish noodle soup with beans, herbs, and yogurt', ku: 'شۆربای ڕەشتەی کوردی لەگەڵ لۆبیا و ڕووەک و ماست', ar: 'حساء الشعيرية الكردي المغذي مع الفاصولياء والأعشاب واللبن' }, price: '$12.99', category: 'soup', popular: false, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop', tags: ['soup', 'comfort food'] },
    { id: 5, name: { en: 'Khorak-e Bademjan', ku: 'خۆراکی بادەمجان', ar: 'خوراك الباذنجان' }, description: { en: 'Slow-cooked eggplant stew with tomatoes and Kurdish herbs', ku: 'خۆراکی بادەمجانی هێواش لێنراو لەگەڵ تەماتە و ڕووەکی کوردی', ar: 'يخنة الباذنجان المطبوخة ببطء مع الطماطم والأعشاب الكردية' }, price: '$15.99', category: 'vegan', popular: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', tags: ['vegan', 'stew'] },
    { id: 6, name: { en: 'Baklava Kurdistan', ku: 'بەقڵاوای کوردستان', ar: 'بقلاوة كردستان' }, description: { en: 'Traditional Kurdish baklava with pistachios and rose water', ku: 'بەقڵاوای نەریتی کوردی لەگەڵ فستق و ئاوی گوڵ', ar: 'بقلاوة كردية تقليدية بالفستق وماء الورد' }, price: '$8.99', category: 'dessert', popular: true, image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop', tags: ['sweet', 'traditional'] }
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
                <img src={item.image} alt={item.name[language]} className="w-full h-48 object-cover" />
                <div className={`${isRTL ? 'text-right' : 'text-left'} p-6`}>
                  <h3 className="text-xl font-serif font-bold text-amber-800 mb-1">{item.name[language]}</h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{item.description[language]}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                    {item.popular && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">{t.filters.popular}</span>
                    )}
                  </div>
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


