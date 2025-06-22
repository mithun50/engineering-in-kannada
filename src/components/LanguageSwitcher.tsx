import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        disabled={i18n.language === 'en'}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          i18n.language === 'en'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('kn')}
        disabled={i18n.language === 'kn'}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          i18n.language === 'kn'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
