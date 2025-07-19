// src/components/GoogleTranslate.tsx
import React, { useEffect } from 'react';

const GoogleTranslate: React.FC = () => {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };

    // Append the script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    (window as any).googleTranslateElementInit = googleTranslateElementInit;

    return () => {
      // Cleanup
      const widget = document.getElementById('google_translate_element');
      if (widget) widget.innerHTML = '';

      const scripts = document.querySelectorAll('script[src*="translate.google.com"]');
      scripts.forEach((s) => s.remove());
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 10,
      }}
    />
  );
};

export default GoogleTranslate;
          
