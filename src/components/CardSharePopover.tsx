import React, { useState, useRef } from 'react';
import { Share2 } from 'lucide-react';
import ShareButtons from './ShareButtons';
import useOnClickOutside from '../utils/useOnClickOutside';
import { useTranslation } from 'react-i18next';

interface CardSharePopoverProps {
  url: string;
  title: string;
  text?: string;
}

export const CardSharePopover: React.FC<CardSharePopoverProps> = ({
  url: initialUrl,
  title: initialTitle,
  text
}) => {
  const { t } = useTranslation();
  const url = initialUrl || ''; // Default to empty string
  const title = initialTitle || ''; // Default to empty string
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation if this component is on a clickable card
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={handleToggle}
        className="p-2 rounded-full hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
        aria-label={t('share', 'Share')}
        title={t('share', 'Share') as string}
      >
        <Share2 size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 right-0 w-auto min-w-max rounded-md shadow-lg bg-gray-800 border border-gray-700 p-2"
          onClick={(e) => e.stopPropagation()} // Prevent closing popover when clicking inside, and stop card navigation
        >
          <ShareButtons url={url} title={title} text={text} variant="icon" />
        </div>
      )}
    </div>
  );
};

export default CardSharePopover;
