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

  // Initialize language from URL params or localStorage on mount - run only once
  useEffect(() => {
    if (!router.isReady || isInitialized) return;

    const langParam = router.query.lang;
    
    if (langParam && LANGUAGES[langParam]) {
      console.log('Initializing language from URL:', langParam);
      setLanguageState(langParam);
      updateDocumentLanguage(langParam);
      localStorage.setItem('preferredLanguage', langParam);
    } else {
      // Check for saved language preference
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && LANGUAGES[savedLang] && savedLang !== 'en') {
        console.log('Initializing language from localStorage:', savedLang);
        setLanguageState(savedLang);
        updateDocumentLanguage(savedLang);
        // Update URL to reflect saved language
        const currentPath = router.asPath.split('?')[0];
        router.replace(`${currentPath}?lang=${savedLang}`, undefined, { shallow: true });
      } else {
        console.log('Initializing language as English (default)');
        setLanguageState('en');
        updateDocumentLanguage('en');
      }
    }
    
    setIsInitialized(true);
  }, [router.isReady, isInitialized]); // Remove router.query.lang dependency to prevent loops

  // Enhanced setLanguage function with better URL handling
  const setLanguage = (newLanguage) => {
    if (!LANGUAGES[newLanguage]) {
      console.warn(`Language ${newLanguage} not supported`);
      return;
    }

    if (language === newLanguage) {
      console.log('Language already set to:', newLanguage);
      return;
    }

    console.log('Changing language from', language, 'to:', newLanguage);
    
    setLanguageState(newLanguage);
    updateDocumentLanguage(newLanguage);
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', newLanguage);
    
    // Update URL with language parameter - simplified approach
    const currentPath = router.pathname;
    
    if (newLanguage === 'en') {
      // Remove lang parameter for English
      router.push(currentPath, undefined, { shallow: true })
        .catch(err => console.warn('Language switching URL update failed:', err));
    } else {
      // Set language parameter
      router.push(`${currentPath}?lang=${newLanguage}`, undefined, { shallow: true })
        .catch(err => console.warn('Language switching URL update failed:', err));
    }
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
