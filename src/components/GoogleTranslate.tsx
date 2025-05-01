import React, { useEffect, useState, useRef } from 'react';
import { Globe } from 'lucide-react';

// Indian languages supported by Google Translate
const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'ur', name: 'اردو (Urdu)' }
];

// Track script loading globally
let isScriptLoaded = false;

const GoogleTranslate = ({ position = 'desktop', setIsMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dropdownRef = useRef(null);
  
  // Initialize Google Translate
  useEffect(() => {
    // Get saved language preference
    const savedLanguage = localStorage.getItem('preferred_language') || 'en';
    setSelectedLanguage(savedLanguage);
    
    // Create hidden Google Translate element
    if (!document.getElementById('google_translate_element')) {
      const element = document.createElement('div');
      element.id = 'google_translate_element';
      element.style.display = 'none';
      document.body.appendChild(element);
    }
    
    // Add custom styles to fix Google Translate issues
    if (!document.getElementById('google_translate_fixes')) {
      const style = document.createElement('style');
      style.id = 'google_translate_fixes';
      style.textContent = `
        .goog-te-banner-frame, .skiptranslate { display: none !important; }
        body { top: 0 !important; position: static !important; }
        .goog-te-gadget-icon { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        iframe.skiptranslate { display: none !important; }
        .goog-te-gadget { font-size: 0 !important; }
      `;
      document.head.appendChild(style);
    }
    
    // Fix Google Translate scroll issues
    const fixScrollIssues = () => {
      const observer = new MutationObserver(() => {
        if (document.body.style.top) {
          const scrollTop = parseInt(document.body.style.top || '0', 10) * -1;
          document.body.style.position = '';
          document.body.style.top = '';
          window.scrollTo(0, scrollTop);
        }
      });
      
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['style'] 
      });
    };
    
    // Initialize Google Translate API
    const initializeTranslate = () => {
      // Define initialization function for Google Translate
      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: INDIAN_LANGUAGES.map(lang => lang.code).join(','),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );
          
          setIsInitialized(true);
          
          // Apply saved language if not English
          setTimeout(() => {
            const currentLang = localStorage.getItem('preferred_language') || 'en';
            if (currentLang !== 'en') {
              changeLanguageInternal(currentLang);
            }
          }, 1000);
          
          fixScrollIssues();
        } catch (error) {
          console.error('Google Translate initialization error:', error);
        }
      };
    };
    
    // Load Google Translate script if not already loaded
    if (!isScriptLoaded) {
      isScriptLoaded = true;
      initializeTranslate();
      
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.head.appendChild(script);
    } else if (window.google && window.google.translate) {
      // Script already loaded, just initialize
      initializeTranslate();
      window.googleTranslateElementInit();
    }
  }, []);
  
  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Core function to change language using Google Translate
  const changeLanguageInternal = (langCode) => {
    if (!window.google || !window.google.translate) {
      console.warn('Google Translate not yet initialized');
      return false;
    }
    
    try {
      // Special handling for English - reset to original
      if (langCode === 'en') {
        // Remove cookies first
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        
        // Find dropdown element
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          // Reset to original language (first option)
          selectElement.selectedIndex = 0;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Try direct API methods
        if (typeof window.google.translate.TranslateElement !== 'undefined') {
          try {
            // Reset translation through Google's methods
            window.location.hash = '';
            window.google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
          } catch (e) {
            console.warn('Error with translate element reset', e);
          }
        }
        
        // As a last resort, try reloading the content by removing and recreating the translation element
        const element = document.getElementById('google_translate_element');
        if (element) {
          const parent = element.parentNode;
          if (parent) {
            const newElement = document.createElement('div');
            newElement.id = 'google_translate_element';
            newElement.style.display = 'none';
            parent.removeChild(element);
            parent.appendChild(newElement);
            
            // Reinitialize
            setTimeout(() => {
              if (window.googleTranslateElementInit) {
                window.googleTranslateElementInit();
              }
            }, 100);
          }
        }
        
        return true;
      }
      
      // For other languages
      // Set cookies first (multiple paths to ensure it works)
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}`;
      
      // Find and change the dropdown value
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // Try direct API call if available
      try {
        if (window.google.translate.TranslateElement) {
          window.location.hash = langCode;
        }
      } catch (e) {
        console.warn('Error with translate API call', e);
      }
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };
  
  // Public function for UI interaction
  const changeLanguage = (langCode) => {
    if (isChangingLanguage) return;
    
    setIsChangingLanguage(true);
    setSelectedLanguage(langCode);
    localStorage.setItem('preferred_language', langCode);
    
    // Close UI immediately
    setIsDropdownOpen(false);
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Apply translation with delay
    setTimeout(() => {
      const success = changeLanguageInternal(langCode);
      
      // Handle failed translation change by retrying once
      if (!success && langCode !== 'en') {
        setTimeout(() => {
          changeLanguageInternal(langCode);
        }, 500);
      }
      
      // Reset changing flag after delay
      setTimeout(() => {
        setIsChangingLanguage(false);
      }, 1500);
    }, 100);
  };
  
  const toggleDropdown = () => {
    if (!isChangingLanguage) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };
  
  // Get current language display name
  const currentLanguageName = INDIAN_LANGUAGES.find(
    lang => lang.code === selectedLanguage
  )?.name.split(' ')[0] || 'English';
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 text-sm ${
          position === 'mobile' ? 'p-2 w-full' : ''
        } text-gray-300 hover:text-primary ${
          isChangingLanguage ? 'opacity-50 cursor-wait' : ''
        }`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        disabled={isChangingLanguage}
        title={`Current language: ${currentLanguageName}`}
      >
        <Globe className="h-4 w-4" />
        {currentLanguageName}
      </button>

      {isDropdownOpen && !isChangingLanguage && (
        <div 
          className={`absolute ${
            position === 'desktop' ? 'right-0' : 'left-0'
          } mt-2 w-48 rounded-md shadow-lg bg-dark border border-white/10 z-50`}
          role="menu"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {INDIAN_LANGUAGES.map(language => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedLanguage === language.code 
                    ? 'text-primary' 
                    : 'text-gray-300 hover:text-primary hover:bg-white/5'
                }`}
                role="menuitem"
                disabled={isChangingLanguage}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;
