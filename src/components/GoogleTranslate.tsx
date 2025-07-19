import React, { useEffect } from 'react';

const GoogleTranslate: React.FC = () => {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    (window as any).googleTranslateElementInit = googleTranslateElementInit;

    return () => {
      const widget = document.getElementById('google_translate_element');
      if (widget) widget.innerHTML = '';

      const scripts = document.querySelectorAll('script[src*="translate.google.com"]');
      scripts.forEach((s) => s.remove());
    };
  }, []);

  return (
    <>
      <style>{`
        .google-translate-wrapper .goog-te-gadget {
          font-size: 0;
          display: inline-block;
        }

        .google-translate-wrapper .goog-te-combo {
          background-color: #facc15;
          color: #000;
          border: none;
          border-radius: 9999px;
          padding: 0.4rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          cursor: pointer;
          appearance: none;
          outline: none;
        }

        .google-translate-wrapper .goog-te-combo:hover {
          background-color: #fde047;
        }

        .google-translate-wrapper .goog-logo-link,
        .google-translate-wrapper .goog-te-gadget span {
          display: none !important;
        }
      `}</style>

      <div
        id="google_translate_element"
        className="google-translate-wrapper"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
        }}
      />
    </>
  );
};

export default GoogleTranslate;
      
