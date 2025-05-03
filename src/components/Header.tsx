import React, { useEffect } from "react";
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
  }
}

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Initialize Google Translate
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      // Skip if script already exists
      if (document.querySelector('script[src="//translate.google.com/translate_a/element.js"]')) {
        // If script exists but translate element needs initialization
        if (window.googleTranslateElementInit) {
          window.googleTranslateElementInit();
        }
        return;
      }
      
      // Define the initialization function
      window.googleTranslateElementInit = function() {
        // Create the main translate element
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'hi,kn,ta,te,ml,mr,bn,gu,pa,or',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          gaTrack: true,
          gaId: '%GOOGLE_ANALYTICS_MEASUREMENT_ID%'
        }, 'google_translate_element');
        
        // Create a separate instance for mobile
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'hi,kn,ta,te,ml,mr,bn,gu,pa,or',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          gaTrack: true,
          gaId: '%GOOGLE_ANALYTICS_MEASUREMENT_ID%'
        }, 'google_translate_element_mobile');
        
        // Hide the Google Translate banner
        const style = document.createElement('style');
        style.textContent = `
          .goog-te-banner-frame { 
            display: none !important;
          }
          .goog-te-gadget-icon {
            display: none !important;
          }
          .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            font-size: 14px !important;
            color: #e5e7eb !important;
            font-family: inherit !important;
          }
          .goog-te-menu-value span:first-child {
            color: #e5e7eb !important;
            font-family: inherit !important;
            font-size: 14px !important;
          }
          .goog-te-menu-value span:first-child:hover {
            color: #FFD700 !important;
            text-decoration: none !important;
          }
          .goog-te-menu-value span[style*="border-left"] {
            display: none !important;
          }
          .goog-te-menu-value span:nth-child(3) {
            display: none !important;
          }
          .goog-te-menu-value span:nth-child(5) {
            display: none !important;
          }
          .goog-te-banner-frame.skiptranslate {
            display: none !important;
          }
          .goog-tooltip {
            display: none !important;
          }
          .goog-tooltip:hover {
            display: none !important;
          }
          .goog-text-highlight {
            background-color: transparent !important;
            border: none !important; 
            box-shadow: none !important;
          }
          body {
            top: 0 !important;
          }
          .skiptranslate {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      };
      
      // Create and append the script
      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    };

    addScript();
    
    // Fix for Google Translate shifting body
    const fixTranslateIssues = () => {
      // Force body top to be 0
      document.body.style.top = '0px';
      
      // Monitor for changes and reset if needed
      const observer = new MutationObserver(function(mutations) {
        if (document.body.style.top !== '' && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
      });
      
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      
      // Add styles to hide Google Translate banner
      const style = document.createElement('style');
      style.textContent = `
        .goog-te-banner-frame { 
          display: none !important;
        }
        .skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `;
      document.head.appendChild(style);
    };
    
    // Allow time for Google Translate to initialize
    const timerId = setTimeout(fixTranslateIssues, 1000);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <header className="bg-dark/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white">
                Engineering in Kannada
              </span>
            </Link>
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
            
            {/* Translate Button */}
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
              
              {/* Mobile Translate Button */}
              <div className="flex items-center gap-2 p-2 mt-2 text-sm border-t border-white/10 pt-3">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Translate:</span>
                <div id="google_translate_element_mobile"></div>
              </div>
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
        
        /* Hide Google Translate banner */
        .goog-te-banner-frame {
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
        
        /* Mobile optimization */
        @media (max-width: 768px) {
          #translate-wrapper {
            text-align: center;
            padding: 8px 10px;
          }
        }
      `}</style>
    </header>
  );
  }
