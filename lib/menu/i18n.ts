/**
 * Language configuration for the menu page
 */
export const LANGUAGES = {
  en: { name: 'English', code: 'en', dir: 'ltr', flag: '🇺🇸' },
  ku: { name: 'کوردی', code: 'ku', dir: 'rtl', flag: '🏳️' },
  ar: { name: 'العربية', code: 'ar', dir: 'rtl', flag: '🇸🇦' },
  fa: { name: 'فارسی', code: 'fa', dir: 'rtl', flag: '🇮🇷' },
  tr: { name: 'Türkçe', code: 'tr', dir: 'ltr', flag: '🇹🇷' },
  ur: { name: 'اردو', code: 'ur', dir: 'rtl', flag: '🇵🇰' },
  kmr: { name: 'Kurdî (Kurmanî)', code: 'kmr', dir: 'ltr', flag: '🏳️' }
} as const

export type LanguageCode = keyof typeof LANGUAGES

/**
 * Utility function to get text in current language with fallback
 * @param value - Translation object or string
 * @param language - Current language code
 * @param fallback - Fallback text if translation not found
 * @returns Translated text
 */
export function getText(
  value: string | Record<string, string>,
  language: LanguageCode = 'en',
  fallback?: string
): string {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object') {
    return value[language] || value.en || fallback || 'Translation missing'
  }

  return fallback || 'Translation missing'
}

/**
 * Update document language and direction attributes
 * @param language - Language code
 */
export function updateDocumentLanguage(language: LanguageCode): void {
  if (typeof document === 'undefined') return

  const langConfig = LANGUAGES[language]
  if (!langConfig) return

  document.documentElement.lang = language
  document.documentElement.dir = langConfig.dir

  // Update font family for RTL languages
  document.body.style.fontFamily = langConfig.dir === 'rtl' 
    ? '"Noto Sans Arabic", "Noto Sans", system-ui, -apple-system, sans-serif'
    : '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif'
}

/**
 * Generate hreflang alternates for SEO
 * @param baseUrl - Base URL for the page
 * @returns Array of hreflang objects
 */
export function generateHreflangAlternates(baseUrl: string) {
  return Object.entries(LANGUAGES).map(([code, config]) => ({
    hreflang: code,
    href: code === 'en' ? baseUrl : `${baseUrl}?lang=${code}`
  }))
}
