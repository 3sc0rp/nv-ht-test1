# Nature Village Restaurant - AI Agent Instructions

## Project Overview
This is a multilingual Middle Eastern restaurant website built with Next.js 14, featuring extensive internationalization (20+ languages) with RTL support for Arabic scripts. The architecture centers around a unified translation system and comprehensive language-aware components.

## Architecture Principles

### Translation System Architecture
- **Central Pattern**: All text uses translation objects with language keys: `{ en: 'Text', ar: 'نص', ku: 'دەق', fa: 'متن', ... }`
- **Helper Function**: Use `getText(translationObject, language, fallback)` from `lib/i18n.js` for consistent translation resolution
- **RTL Support**: Language context provides `isRTL` boolean for Arabic/Persian/Urdu scripts
- **Language Context**: `contexts/LanguageContext.js` manages global language state with localStorage persistence

### Component Structure
- **Main App**: `components/NatureVillageWebsite.js` is the primary 5898-line component containing all sections
- **Page Layer**: Pages (`pages/index.js`, `pages/menu.js`, etc.) are thin wrappers around main components
- **Shared Components**: `Header.js` and `Footer.js` provide navigation with language-aware routing
- **Utility Layer**: `lib/utils.js` contains booking/validation helpers; `lib/menu/` has specialized menu utilities

## Key Development Patterns

### Adding New Content
1. **Menu Items**: Add to the appropriate category array in `pages/menu.js` with full translation objects
2. **UI Text**: Create translation objects with all 20 language keys (en, ar, ku, fa, tr, ur, kmr, es, fr, de, sq, ru, hi, bn, ko, bs, zh, ro, uk, vi)
3. **Missing Translations**: Use the PowerShell script `add_missing_translations.ps1` for systematic translation updates

### Language Implementation
- **Direction Handling**: Always check `isRTL` for layout adjustments (`flex-row` vs `flex-row-reverse`)
- **Font Loading**: Arabic scripts use `font-arabic` class, defined in Tailwind config
- **URL Handling**: Language preference stored in localStorage and URL params (`?lang=ar`)

### Performance Considerations
- **Image Optimization**: Next.js Image component configured for WebP/AVIF with remote patterns
- **Component Size**: Main component is intentionally large (5898 lines) for optimal bundle splitting
- **Translation Loading**: All translations loaded client-side for instant language switching

## Build & Development

### Essential Commands
```bash
npm run dev          # Development server on :3000
npm run build        # Production build with i18n
npm run start        # Production server
npm run export       # Static export (if needed)
```

### Configuration Files
- **Next.js**: `next.config.js` defines i18n locales and image domains
- **Tailwind**: Extended with Arabic fonts and Middle Eastern color palettes
- **PostCSS**: Standard configuration for Tailwind processing

## Critical Integration Points

### MenuIQ System
- Placeholder integration in main component for AI-enhanced menu management
- Environment variables prepared for real-time restaurant data (Google Places, Yelp, POS systems)
- Status monitoring system with configurable data sources

### SEO & Schema
- **JSON-LD**: Restaurant schema generated in `lib/menu/jsonld.ts` with multilingual support
- **Meta Tags**: Language-specific meta tags and hreflang alternates
- **Structured Data**: Comprehensive restaurant, menu, and menuItem schemas

### External Services
- **Dependencies**: Stripe, Twilio, SendGrid, Supabase ready for reservations/orders
- **Analytics**: Prepared for Google Places API and Yelp Fusion integration
- **Forms**: React Hook Form with Yup validation throughout

## Common Modification Patterns

### Adding New Languages
1. Add language config to `LANGUAGES` object in `lib/i18n.js`
2. Update all translation objects throughout the codebase
3. Test RTL layout if applicable (check `dir` property)

### Menu Updates
- Menu data structure: `{ id, category, name: {}, description: {}, price, variants?, isPopular?, tags? }`
- Images stored in `public/` with descriptive filenames matching menu items
- Categories: appetizers, soups, salads, wraps, platters, desserts, drinks

### Component Extensions
- New sections should follow the pattern in `NatureVillageWebsite.js`
- Use `motion.div` from Framer Motion for animations (check `reducedMotion` preference)
- Implement language switching in all user-facing text

## Testing & Validation
- Language switching should persist across page reloads
- RTL layouts should not break with dynamic content
- Image loading should respect optimization settings
- Translation fallbacks should never show "Translation missing"