import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { GraduationCap, Youtube, Linkedin, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <footer className="bg-dark/50 backdrop-blur-sm border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-white">
              {t('engineeringInKannada')}
            </span>
          </div>

          <p className="mt-4 max-w-md text-center text-sm text-gray-400">
            {t('empoweringKannadaStudents')}
          </p>

          <div className="mt-8 flex items-center gap-6">
            <a
              href="https://www.youtube.com/@EngineeringinKannada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary"
              aria-label={t('youtube')}
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/engineering_in_kannada/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary"
              aria-label={t('instagram')}
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/chandansgowdru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary"
              aria-label="Twitter"
            >
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/chandan-s-gowda-4b2913183/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="mt-1">{t('madeWithLove')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
