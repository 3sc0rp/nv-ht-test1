import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LANGUAGES, updateDocumentLanguage } from '../lib/i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Simple one-time initialization
  useEffect(() => {
    if (!router.isReady) return;
    
    // Only run once
    if (isInitialized) return;
    
    const langParam = router.query.lang;
    const savedLang = localStorage.getItem('preferredLanguage');
    
    let targetLang = 'en';
    
    // Priority: URL param > localStorage > default English
    if (langParam && LANGUAGES[langParam]) {
      targetLang = langParam;
    } else if (savedLang && LANGUAGES[savedLang]) {
      targetLang = savedLang;
    }
    
    setLanguageState(targetLang);
    updateDocumentLanguage(targetLang);
    localStorage.setItem('preferredLanguage', targetLang);
    
    setIsInitialized(true);
  }, [router.isReady, isInitialized]);

  // Simple setLanguage function without complex URL manipulation
  const setLanguage = (newLanguage) => {
    if (!LANGUAGES[newLanguage] || language === newLanguage) {
      return;
    }
    
    // Update state and document
    setLanguageState(newLanguage);
    updateDocumentLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    
    // Simple URL update without shallow routing complications
    const newUrl = newLanguage === 'en' ? router.pathname : `${router.pathname}?lang=${newLanguage}`;
    window.history.replaceState({}, '', newUrl);
  };

  const contextValue = {
    language,
    setLanguage,
    isRTL: LANGUAGES[language]?.dir === 'rtl',
    languageConfig: LANGUAGES[language],
    isInitialized
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
