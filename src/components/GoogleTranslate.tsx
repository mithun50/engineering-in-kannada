// src/components/GoogleTranslate.tsx

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

let isScriptAdded = false;

const GoogleTranslate: React.FC<{
  position?: 'desktop' | 'mobile';
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ position = 'desktop', setIsMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only run once per app load
  useEffect(() => {
    // Check if a language preference is saved in localStorage
    const savedLanguage = localStorage.getItem('preferred_language') || 'en';
    setSelectedLanguage(savedLanguage);
    
    // Add the Google Translate script only once
    if (!isScriptAdded) {
      isScriptAdded = true;
      
      // Create container for Google Translate if it doesn't exist
      if (!document.getElementById('google_translate_element')) {
        const element = document.createElement('div');
        element.id = 'google_translate_element';
        element.style.display = 'none';
        document.body.appendChild(element);
      }
      
      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: INDIAN_LANGUAGES.map(lang => lang.code).join(','),
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );
          
          // Apply saved language after Google Translate loads
          setTimeout(() => {
            if (savedLanguage !== 'en') {
              changeLanguage(savedLanguage);
            }
          }, 1000);
          
          // Fix Google Translate body styling issues
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
          
        } catch (error) {
          console.error('Google Translate initialization error:', error);
        }
      };
      
      // Add script to page
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
      
      // Add CSS to fix Google Translate issues
      const style = document.createElement('style');
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
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to manually trigger translation
  const changeLanguage = (langCode: string) => {
    localStorage.setItem('preferred_language', langCode);
    setSelectedLanguage(langCode);
    
    // Find the Google Translate select element and change it
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
    
    // Close dropdowns
    setIsDropdownOpen(false);
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Custom UI */}
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 text-sm ${position === 'mobile' ? 'p-2 w-full' : ''} text-gray-300 hover:text-primary`}
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
  );
};

export default GoogleTranslate;
