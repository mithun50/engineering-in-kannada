import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Home,
  Github,
  Menu,
  X,
  Youtube,
  Instagram,
  Trophy,
  BookOpen,
  Globe,
} from "lucide-react";

// Declare Google Translate function type
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const translateInitialized = useRef(false);

  // Initialize Google Translate
  useEffect(() => {
    const initializeTranslate = () => {
      // Define initialization function
      window.googleTranslateElementInit = function() {
        try {
          // Desktop version
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'hi,kn,ta,te,ml,mr,bn,gu,pa,or',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
          
          // Mobile version in header
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'hi,kn,ta,te,ml,mr,bn,gu,pa,or',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element_mobile_header');
          
          translateInitialized.current = true;
          console.log('Google Translate initialized');
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
        }
      };

      // Create and load the script if not already loaded
      if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js"]')) {
        const script = document.createElement('script');
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        console.log('Google Translate script added');
      } else if (window.google && window.google.translate) {
        // If script exists but elements not initialized
        window.googleTranslateElementInit();
      }
    };

    initializeTranslate();

    // Additional check to ensure elements are initialized
    const checkInterval = setInterval(() => {
      const mobileElement = document.getElementById('google_translate_element_mobile_header');
      if (mobileElement && (!mobileElement.firstChild || mobileElement.children.length === 0)) {
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
          console.log('Re-initializing Google Translate');
        }
      } else if (mobileElement && mobileElement.children.length > 0) {
        clearInterval(checkInterval);
      }
    }, 1000);

    // Fix for Google Translate shifting body
    const fixTranslateIssues = () => {
      document.body.style.top = '0px';
      
      const observer = new MutationObserver(function(mutations) {
        if (document.body.style.top !== '' && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
      });
      
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    };
    
    setTimeout(fixTranslateIssues, 1000);
    
    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <header className="bg-dark/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Title and mobile translate section */}
          <div className="flex flex-row items-center">
            {/* Title */}
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <Link to="/" className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
                Engineering in Kannada
              </Link>
            </div>
            
            {/* Mobile Translate Button - Next to title */}
            <div className="md:hidden ml-2 flex items-center">
              <Globe className="h-4 w-4 text-primary mr-1" />
              <select 
                id="mobile-language-select"
                className="text-xs bg-gray-800 border border-gray-700 text-white rounded-sm px-1 py-0.5"
                onChange={(e) => {
                  // Fallback simple language selector that updates Google Translate
                  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                  if (selectElement) {
                    selectElement.value = e.target.value;
                    selectElement.dispatchEvent(new Event('change'));
                  }
                }}
              >
                <option value="">Select</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="ml">മലയാളം</option>
                <option value="mr">मराठी</option>
                <option value="bn">বাংলা</option>
                <option value="gu">ગુજરાતી</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="or">ଓଡ଼ିଆ</option>
              </select>
              {/* Hidden element for Google Translate to connect to */}
              <div id="google_translate_element_mobile_header" className="hidden"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm ${
                location.pathname === "/"
                  ? "text-primary"
                  : "text-gray-300 hover:text-primary"
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/blogs"
              className={`flex items-center gap-2 text-sm ${
                location.pathname === "/blogs"
                  ? "text-primary"
                  : "text-gray-300 hover:text-primary"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Blogs
            </Link>
            <Link
              to="/leaderboard"
              className={`flex items-center gap-2 text-sm ${
                location.pathname === "/leaderboard"
                  ? "text-primary"
                  : "text-gray-300 hover:text-primary"
              }`}
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
            <a
              href="https://www.youtube.com/@EngineeringinKannada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary"
            >
              <Youtube className="h-4 w-4" />
              YouTube
            </a>
            <a
              href="https://www.instagram.com/engineering_in_kannada/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href="https://github.com/chandansgowda/engineering-in-kannada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary"
            >
              <Github className="h-4 w-4" />
              Contribute
            </a>
            
            {/* Desktop Translate Button */}
            <div className="flex items-center gap-2 text-sm border-l border-white/10 pl-5 ml-1">
              <Globe className="h-4 w-4 text-primary" />
              <div id="google_translate_element" className="inline-block"></div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col gap-4 px-2 pb-4">
              <Link
                to="/"
                className={`flex items-center gap-2 p-2 text-sm ${
                  location.pathname === "/"
                    ? "text-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/blogs"
                className={`flex items-center gap-2 p-2 text-sm ${
                  location.pathname === "/blogs"
                    ? "text-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                Blogs
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center gap-2 p-2 text-sm ${
                  location.pathname === "/leaderboard"
                    ? "text-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Link>
              <a
                href="https://www.youtube.com/@EngineeringinKannada"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Youtube className="h-4 w-4" />
                YouTube
              </a>
              <a
                href="https://www.instagram.com/engineering_in_kannada/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a
                href="https://github.com/chandansgowda/engineering-in-kannada"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                Contribute
              </a>
            </div>
          </div>
        )}
      </nav>
      
      {/* CSS for Google Translate */}
      <style jsx>{`
        /* Google Translate Element Styles */
        .goog-logo-link,
        .goog-te-gadget span {
          display: none !important;
        }
        
        /* Force body to not have Google's top property */
        body {
          top: 0 !important;
        }
        
        /* Fix for Google Translate iframe */
        .goog-te-menu-frame {
          max-width: 100% !important;
        }
        
        /* Remove all extra content from Google translate */
        .goog-te-gadget {
          font-size: 0 !important;
          color: transparent !important;
        }
        
        /* Hide Google's attribution */
        .VIpgJd-ZVi9od-l4eHX-hSRGPd,
        .VIpgJd-ZVi9od-ORHb-OEVmcd,
        .goog-te-gadget-icon {
          display: none !important;
        }
        
        /* Make the dropdown more compact */
        .goog-te-combo {
          padding: 2px !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          background-color: rgba(30, 30, 30, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: white !important;
        }
        
        /* Custom mobile language selector */
        #mobile-language-select {
          font-size: 12px;
          height: 24px;
          min-width: 80px;
        }
      `}</style>
    </header>
  );
            }
