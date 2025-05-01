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
  { code: 'gu', name: 'ગુજરាતી (Gujarati)' },
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
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const translateElementRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Try to get the saved language preference
    const savedLanguage = localStorage.getItem('preferred_language') || 'en';
    setSelectedLanguage(savedLanguage);

    // Initialize Google Translate if not already done
    if (!isScriptAdded) {
      isScriptAdded = true;

      // Create the Google Translate element if it doesn't exist
      if (!document.getElementById('google_translate_element')) {
        const element = document.createElement('div');
        element.id = 'google_translate_element';
        element.style.display = 'none';
        document.body.appendChild(element);
      }

      // Define the Google Translate initialization function
      window.googleTranslateElementInit = () => {
        try {
          // Create the Google Translate element
          translateElementRef.current = new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: INDIAN_LANGUAGES.map(lang => lang.code).join(','),
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );

          isInitializedRef.current = true;

          // Apply the saved language after Google Translate has initialized
          setTimeout(() => {
            const currentLang = localStorage.getItem('preferred_language') || 'en';
            if (currentLang !== 'en') {
              changeLanguageInternal(currentLang);
            }
          }, 1000);

          // Fix scroll issues caused by Google Translate
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

      // Load the Google Translate script
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);

      // Add styles to hide Google Translate widgets and fix related issues
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

  // Handle clicks outside the dropdown to close it
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

  // Internal function to change language that handles all the Google Translate logic
  const changeLanguageInternal = (langCode: string) => {
    if (!isInitializedRef.current) {
      console.warn('Google Translate not yet initialized');
      return;
    }

    // For English, we need special handling
    if (langCode === 'en') {
      // Find the Google Translate dropdown
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        // Select null/original language option (first option)
        selectElement.selectedIndex = 0;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
        
        // Force untranslation by using Google's internal API if available
        if ((window as any).google && (window as any).google.translate) {
          try {
            // Try to access the internal APIs to reset translation
            const doGTranslate = (window as any).doGTranslate;
            if (typeof doGTranslate === 'function') {
              doGTranslate('en|en');
            }
          } catch (e) {
            console.warn('Could not access Google Translate doGTranslate function');
          }
        }
      } else {
        // If we can't find the dropdown, reload as a last resort
        window.location.reload();
      }
      
      return;
    }

    try {
      // Find Google's translate dropdown
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (selectElement) {
        // Set the value to the desired language
        selectElement.value = langCode;
        
        // Create and dispatch a real change event that bubbles
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
        
        // Try another method through Google's function if available
        try {
          const doGTranslate = (window as any).doGTranslate;
          if (typeof doGTranslate === 'function') {
            doGTranslate(`en|${langCode}`);
          }
        } catch (e) {
          console.warn('Could not access Google Translate doGTranslate function');
        }
      } else {
        console.warn('Google Translate dropdown not found');
        
        // Set cookies directly as a fallback
        document.cookie = `googtrans=/en/${langCode}; path=/`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}`;
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Public function called from UI that manages state and throttles calls
  const changeLanguage = (langCode: string) => {
    // Prevent multiple rapid changes
    if (isChangingLanguage) return;
    
    // Update state
    setSelectedLanguage(langCode);
    setIsChangingLanguage(true);
    localStorage.setItem('preferred_language', langCode);
    
    // Close UI elements immediately
    setIsDropdownOpen(false);
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Handle the actual language change with a small delay
    setTimeout(() => {
      changeLanguageInternal(langCode);
      
      // Reset changing flag after a delay to prevent rapid clicking
      setTimeout(() => {
        setIsChangingLanguage(false);
      }, 1000);
    }, 100);
  };

  const toggleDropdown = () => {
    if (!isChangingLanguage) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 text-sm ${position === 'mobile' ? 'p-2 w-full' : ''} text-gray-300 hover:text-primary ${isChangingLanguage ? 'opacity-50 cursor-wait' : ''}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        disabled={isChangingLanguage}
      >
        <Globe className="h-4 w-4" />
        {INDIAN_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name.split(' ')[0] || 'English'}
      </button>

      {isDropdownOpen && !isChangingLanguage && (
        <div className={`absolute ${position === 'desktop' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-md shadow-lg bg-dark border border-white/10 z-50`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {INDIAN_LANGUAGES.map(language => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${selectedLanguage === language.code ? 'text-primary' : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
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
