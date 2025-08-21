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

  ru: { name: 'Русский', code: 'ru', dir: 'ltr', flag: '🇷🇺' },
  hi: { name: 'हिन्दी', code: 'hi', dir: 'ltr', flag: '🇮🇳' },


  ur: { name: 'اردو', code: 'ur', dir: 'rtl', flag: '🇵🇰' },
  kmr: { name: 'Kurdî (Kurmanî)', code: 'kmr', dir: 'ltr', flag: '☀️' }
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

    // Update font family for RTL languages
    document.body.style.fontFamily = langConfig.dir === 'rtl' 
      ? '"Noto Sans Arabic", "Noto Sans", system-ui, -apple-system, sans-serif'
      : '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif';
      
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
