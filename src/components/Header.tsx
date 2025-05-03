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
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'hi,kn,ta,te,ml,mr,bn,gu,pa,or',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
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
    };
    
    // Allow time for Google Translate to initialize
    const timerId = setTimeout(fixTranslateIssues, 1000);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <header className="bg-dark/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="bg-[#222] py-2 px-4 sm:px-6 lg:px-8 text-right border-b border-[#333]">
        <span className="text-primary font-medium mr-2">Translate:</span>
        <div id="google_translate_element" className="inline-block"></div>
      </div>
      
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
