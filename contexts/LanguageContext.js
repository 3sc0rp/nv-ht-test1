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

  // Initialize language from URL params or localStorage on mount
  useEffect(() => {
    if (!router.isReady) return;

    const langParam = router.query.lang;
    
    if (langParam && LANGUAGES[langParam]) {
      setLanguageState(langParam);
      updateDocumentLanguage(langParam);
      localStorage.setItem('preferredLanguage', langParam);
    } else {
      // Check for saved language preference
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && LANGUAGES[savedLang]) {
        setLanguageState(savedLang);
        updateDocumentLanguage(savedLang);
      }
    }
    
    setIsInitialized(true);
  }, [router.isReady, router.query.lang]);

  // Enhanced setLanguage function with better URL handling
  const setLanguage = (newLanguage) => {
    if (!LANGUAGES[newLanguage]) {
      console.warn(`Language ${newLanguage} not supported`);
      return;
    }

    console.log('Changing language to:', newLanguage);
    
    setLanguageState(newLanguage);
    updateDocumentLanguage(newLanguage);
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', newLanguage);
    
    // Update URL with language parameter - improved handling
    const currentPath = router.asPath.split('?')[0];
    const currentQuery = { ...router.query };
    
    if (newLanguage === 'en') {
      // Remove lang parameter for English
      delete currentQuery.lang;
    } else {
      // Set language parameter
      currentQuery.lang = newLanguage;
    }
    
    const newUrl = {
      pathname: currentPath,
      query: currentQuery
    };
    
    // Use router.push instead of router.replace for better reliability
    router.push(newUrl, undefined, { shallow: true })
      .catch(err => console.warn('Language switching URL update failed:', err));
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
