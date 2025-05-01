// src/components/GoogleTranslate.tsx

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

// Type declaration for Google Translate API
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

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

const GoogleTranslate: React.FC<{
  position?: 'desktop' | 'mobile';
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ position = 'desktop', setIsMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    // Check if a language preference is saved in localStorage
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    // Add the Google Translate script to the document
    const addScript = () => {
      const script = document.createElement('script');
      script.src = 
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    // Initialize the Google Translate Element
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en', // Your site's original language (English)
          includedLanguages: INDIAN_LANGUAGES.map(lang => lang.code).join(','),
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const cleanup = addScript();
    return () => {
      cleanup();
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Function to manually trigger translation to a specific language
  const changeLanguage = (langCode: string) => {
    // Save preference to localStorage
    localStorage.setItem('preferred_language', langCode);
    setSelectedLanguage(langCode);
    
    // Find the Google Translate select element and change it programmatically
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
    
    setIsDropdownOpen(false);
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Render the Google Translate Element (hidden) and our custom UI
  return (
    <div className="relative">
      {/* Hidden div for Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* Custom UI */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center gap-2 text-sm ${position === 'mobile' ? 'p-2' : ''} text-gray-300 hover:text-primary`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <Globe className="h-4 w-4" />
          {INDIAN_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name.split(' ')[0] || 'English'}
        </button>
        
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className={`absolute ${position === 'desktop' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-md shadow-lg bg-dark border border-white/10 z-50`}>
            <div className="py-1" role="menu" aria-orientation="vertical">
              {INDIAN_LANGUAGES.map(language => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`block w-full text-left px-4 py-2 text-sm ${selectedLanguage === language.code ? 'text-primary' : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                  role="menuitem"
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleTranslate;
