/**
 * Language configuration for the entire application
 */
export const LANGUAGES = {
  en: { name: 'English', code: 'en', dir: 'ltr', flag: '🇺🇸' },
  ku: { name: 'کوردی', code: 'ku', dir: 'rtl', flag: '☀️' },
  ar: { name: 'العربية', code: 'ar', dir: 'rtl', flag: '🇸🇦' },
  fa: { name: 'فارسی', code: 'fa', dir: 'rtl', flag: '🇮🇷' },
  tr: { name: 'Türkçe', code: 'tr', dir: 'ltr', flag: '🇹🇷' },
  es: { name: 'Español', code: 'es', dir: 'ltr', flag: '🇪🇸' },
  fr: { name: 'Français', code: 'fr', dir: 'ltr', flag: '🇫🇷' },
  de: { name: 'Deutsch', code: 'de', dir: 'ltr', flag: '🇩🇪' },
  sq: { name: 'Shqip', code: 'sq', dir: 'ltr', flag: '🇦🇱' },
  ru: { name: 'Русский', code: 'ru', dir: 'ltr', flag: '🇷🇺' },
  hi: { name: 'हिन्दी', code: 'hi', dir: 'ltr', flag: '🇮🇳' },
  ur: { name: 'اردو', code: 'ur', dir: 'rtl', flag: '🇵🇰' },
  kmr: { name: 'Kurdî (Kurmanî)', code: 'kmr', dir: 'ltr', flag: '☀️' },
  bn: { name: 'বাংলা', code: 'bn', dir: 'ltr', flag: '🇧🇩' },
  ko: { name: '한국어', code: 'ko', dir: 'ltr', flag: '🇰🇷' },
  bs: { name: 'Bosanski', code: 'bs', dir: 'ltr', flag: '🇧🇦' },
  zh: { name: '中文', code: 'zh', dir: 'ltr', flag: '🇨🇳' },
  ro: { name: 'Română', code: 'ro', dir: 'ltr', flag: '🇷🇴' },
  uk: { name: 'Українська', code: 'uk', dir: 'ltr', flag: '🇺🇦' },
  vi: { name: 'Tiếng Việt', code: 'vi', dir: 'ltr', flag: '🇻🇳' }
};

/**
 * Utility function to get text in current language with fallback
 * @param {string|object} value - Translation object or string
 * @param {string} language - Current language code
 * @param {string} fallback - Fallback text if translation not found
 * @returns {string} Translated text
 */
export function getText(value, language = 'en', fallback) {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    return value[language] || value.en || fallback || 'Translation missing';
  }

  return fallback || 'Translation missing';
}

/**
 * Update document language and direction attributes
 * @param {string} language - Language code
 */
export function updateDocumentLanguage(language) {
  if (typeof document === 'undefined') return;

  const langConfig = LANGUAGES[language];
  if (!langConfig) {
    console.warn(`Language configuration not found for: ${language}`);
    return;
  }

  try {
    document.documentElement.lang = language;
    document.documentElement.dir = langConfig.dir;

    // Update font family for different languages
    let fontFamily = '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif';
    
    if (langConfig.dir === 'rtl') {
      fontFamily = '"Noto Sans Arabic", "Noto Sans", system-ui, -apple-system, sans-serif';
    } else if (language === 'sq') {
      // Albanian specific fonts with special character support
      fontFamily = '"Inter", "Roboto", "Open Sans", "Segoe UI", sans-serif';
      // Enable font features for Albanian special characters
      document.body.style.textRendering = 'optimizeLegibility';
      document.body.style.webkitFontFeatureSettings = '"liga", "kern"';
      document.body.style.fontFeatureSettings = '"liga", "kern"';
    }
    
    document.body.style.fontFamily = fontFamily;
      
    console.log(`Document language updated to: ${language} (${langConfig.dir})`);
  } catch (error) {
    console.error('Error updating document language:', error);
  }
}

/**
 * Generate hreflang alternates for SEO
 * @param {string} baseUrl - Base URL for the page
 * @returns {Array} Array of hreflang objects
 */
export function generateHreflangAlternates(baseUrl) {
  return Object.entries(LANGUAGES).map(([code, config]) => ({
    hreflang: code,
    href: code === 'en' ? baseUrl : `${baseUrl}?lang=${code}`
  }));
}
