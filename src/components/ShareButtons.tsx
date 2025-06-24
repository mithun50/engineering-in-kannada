import React, { useState } from 'react';
import { Share2, Link as LinkIcon, CheckCircle } from 'lucide-react'; // Using Lucide icons
// Consider adding specific social media icons if preferred, e.g., from react-icons
// import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { toastWithCustomMessages } from '../utils/toastWithCustomMessages'; // For copy link feedback
import { useTranslation } from 'react-i18next';


interface ShareButtonsProps {
  url: string;
  title: string;
  text?: string; // Optional text for sharing, defaults to title
  variant?: 'full' | 'icon'; // Added variant prop
}

const socialPlatforms = [
  { name: 'Twitter', icon: <Share2 size={18} />, color: 'text-sky-500', constructUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: 'Facebook', icon: <Share2 size={18} />, color: 'text-blue-700', constructUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: 'LinkedIn', icon: <Share2 size={18} />, color: 'text-sky-700', constructUrl: (url: string, title: string) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'WhatsApp', icon: <Share2 size={18} />, color: 'text-green-500', constructUrl: (url: string, title: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}` },
];

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, text, variant = 'full' }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const shareText = text || title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toastWithCustomMessages.showSuccess(t('linkCopiedToClipboard', 'Link copied to clipboard!'));
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      toastWithCustomMessages.showError(t('failedToCopyLink', 'Failed to copy link.'));
    }
  };

  const isIconVariant = variant === 'icon';

  return (
    <div className={isIconVariant ? "my-2" : "my-6"}>
      {!isIconVariant && (
        <h3 className="text-lg font-semibold text-white mb-3">{t('shareThis', 'Share this')}:</h3>
      )}
      <div className={`flex flex-wrap items-center ${isIconVariant ? "gap-2" : "gap-3"}`}>
        {socialPlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.constructUrl(url, shareText)}
            target="_blank"
            rel="noopener noreferrer"
            title={`${t('shareOn', 'Share on')} ${platform.name}`}
            className={`flex items-center rounded-md bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 group ${platform.color} hover:text-opacity-80 ${isIconVariant ? "p-2" : "gap-2 px-4 py-2"}`}
          >
            {React.cloneElement(platform.icon, { className: `group-hover:scale-110 transition-transform ${isIconVariant ? "" : "mr-0"}` })}
            {!isIconVariant && (
              <span className="text-sm font-medium text-white">{platform.name}</span>
            )}
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          title={t('copyLink', 'Copy link')}
          className={`flex items-center rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 hover:text-white transition-all duration-200 group ${isIconVariant ? "p-2" : "gap-2 px-4 py-2"}`}
        >
          {copied ? <CheckCircle size={18} className="text-green-500 transition-all" /> : <LinkIcon size={18} className={`group-hover:scale-110 transition-transform ${isIconVariant ? "" : "mr-0"}`} />}
          {!isIconVariant && (
            <span className="text-sm font-medium">{copied ? t('copied', 'Copied!') : t('copyLink', 'Copy Link')}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
