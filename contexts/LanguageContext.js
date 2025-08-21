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
  const router = useRouter();

  // Initialize language from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && LANGUAGES[langParam]) {
      setLanguageState(langParam);
      updateDocumentLanguage(langParam);
    } else {
      // Check for saved language preference
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && LANGUAGES[savedLang]) {
        setLanguageState(savedLang);
        updateDocumentLanguage(savedLang);
      }
    }
  }, []);

  // Enhanced setLanguage function
  const setLanguage = (newLanguage) => {
    if (!LANGUAGES[newLanguage]) {
      console.warn(`Language ${newLanguage} not supported`);
      return;
    }

    setLanguageState(newLanguage);
    updateDocumentLanguage(newLanguage);
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', newLanguage);
    
    // Update URL with language parameter
    const currentPath = router.asPath.split('?')[0];
    const newUrl = newLanguage === 'en' ? currentPath : `${currentPath}?lang=${newLanguage}`;
    router.replace(newUrl, undefined, { shallow: true });
  };

  const contextValue = {
    language,
    setLanguage,
    isRTL: LANGUAGES[language]?.dir === 'rtl',
    languageConfig: LANGUAGES[language]
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
