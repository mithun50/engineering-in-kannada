// src/components/GoogleTranslate.tsx

import React, { useEffect, useState, useRef } from 'react';
import { Globe } from 'lucide-react';
import translateService, { INDIAN_LANGUAGES } from '../services/TranslateService';
import './GoogleTranslate.css';

const GoogleTranslate: React.FC<{
  position?: 'desktop' | 'mobile';
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ position = 'desktop', setIsMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize translator and set up event listeners
  useEffect(() => {
    // Initialize translation service
    translateService.initialize().then(() => {
      // Get current language from service
      const currentLang = translateService.getCurrentLanguage();
      setSelectedLanguage(currentLang);
    });
  }, []);

  // Function to change language
  const changeLanguage = (langCode: string) => {
    // Update UI state
    setSelectedLanguage(langCode);
    
    // Use service to apply translation
    translateService.changeLanguage(langCode);
    
    // Close dropdowns
    setIsDropdownOpen(false);
    if (setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Custom UI */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center gap-2 text-sm ${position === 'mobile' ? 'p-2' : ''} text-gray-300 hover:text-primary`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="Select language"
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
