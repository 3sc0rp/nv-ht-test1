import { getText } from '../i18n'

// Type definition for language code
type LanguageCode = 'en' | 'ku' | 'ar' | 'fa' | 'tr' | 'ur' | 'kmr';

interface MenuItem {
  id: number
  category: string
  name: Record<string, string>
  description: Record<string, string>
  price?: number | string
  variants?: Array<{ name: string; price: number | string }>
  isPopular?: boolean
  tags?: string[]
}

interface MenuSection {
  category: string
  items: MenuItem[]
}

/**
 * Generate JSON-LD structured data for restaurant menu
 * @param menuSections - Organized menu sections
 * @param language - Current language
 * @returns JSON-LD object
 */
export function generateMenuJsonLD(menuSections: MenuSection[], language: LanguageCode) {
  const baseUrl = 'https://naturevillagerestaurant.com'
  
  // Restaurant base object
  const restaurant = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Nature\'s Village Restaurant',
    description: 'Authentic Middle Eastern cuisine with traditional flavors and modern presentation',
    url: `${baseUrl}/menu${language !== 'en' ? `?lang=${language}` : ''}`,
    telephone: '+1-xxx-xxx-xxxx',
    servesCuisine: ['Middle Eastern', 'Turkish', 'Arabic'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Your City',
      addressRegion: 'Your State',
      postalCode: 'Your ZIP',
      addressCountry: 'US'
    },
    hasMenu: {
      '@type': 'Menu',
      name: getText({ en: 'Our Menu', ar: 'قائمتنا', fa: 'منوی ما', ku: 'مێنیوی ئێمە', tr: 'Menümüz', ur: 'ہمارا مینیو', kmr: 'Menûya Me' }, language, 'Our Menu'),
      hasMenuSection: menuSections.map(section => ({
        '@type': 'MenuSection',
        name: getText({
          en: section.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          ar: getCategoryTranslation(section.category, 'ar'),
          fa: getCategoryTranslation(section.category, 'fa'),
          ku: getCategoryTranslation(section.category, 'ku'),
          tr: getCategoryTranslation(section.category, 'tr'),
          ur: getCategoryTranslation(section.category, 'ur'),
          kmr: getCategoryTranslation(section.category, 'kmr'),
        }, language, section.category),
        hasMenuItem: section.items.map(item => {
          const menuItem: any = {
            '@type': 'MenuItem',
            name: getText(item.name, language, 'Menu Item'),
            description: getText(item.description, language, 'Description'),
            menuAddOn: item.tags?.map(tag => ({
              '@type': 'MenuSection',
              name: tag
            }))
          }

          // Handle pricing
          if (item.price) {
            menuItem.offers = {
              '@type': 'Offer',
              price: typeof item.price === 'string' ? item.price : item.price.toString(),
              priceCurrency: 'USD'
            }
          } else if (item.variants && item.variants.length > 0) {
            menuItem.offers = item.variants.map(variant => ({
              '@type': 'Offer',
              name: variant.name,
              price: typeof variant.price === 'string' ? variant.price : variant.price.toString(),
              priceCurrency: 'USD'
            }))
          }

          return menuItem
        })
      }))
    }
  }

  return restaurant
}

/**
 * Get category translation for specific language
 */
function getCategoryTranslation(category: string, language: LanguageCode): string {
  const translations: Record<string, Record<LanguageCode, string>> = {
    appetizers: {
      en: 'Appetizers',
      ar: 'مقبلات',
      fa: 'پیش‌غذاها',
      ku: 'خۆراکی پێش‌خواردن',
      tr: 'Başlangıçlar',
      ur: 'سٹارٹرز',
      kmr: 'Destpêk'
    },
    salads: {
      en: 'Salads',
      ar: 'سلطات',
      fa: 'سالادها',
      ku: 'لەواشەکان',
      tr: 'Salatalar',
      ur: 'سلادز',
      kmr: 'Salatan'
    },
    pizza: {
      en: 'Pizza',
      ar: 'بيتزا',
      fa: 'پیتزا',
      ku: 'پیتزا',
      tr: 'Pizza',
      ur: 'پیزا',
      kmr: 'Pizza'
    },
    grill: {
      en: 'Grill Platters',
      ar: 'مشاوي',
      fa: 'کباب و گریل',
      ku: 'پلێتەری گرێل',
      tr: 'Izgara Tabaklar',
      ur: 'گرل پلیٹرز',
      kmr: 'Platerên Grill'
    },
    dessert: {
      en: 'Desserts',
      ar: 'حلويات',
      fa: 'دسرها',
      ku: 'شیرینی',
      tr: 'Tatlılar',
      ur: 'میٹھائیاں',
      kmr: 'Şîrînî'
    }
  }

  return translations[category]?.[language] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}
