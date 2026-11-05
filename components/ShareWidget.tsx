'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, Instagram } from 'lucide-react';
import { trackEvent } from './Analytics';

export const ShareWidget: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://stumpgrindingplaybook.com';
  const shareTitle = 'Check out The First 10 Stumps System: Pricing Engine & Field Manual';

  const handleCopy = () => {
    trackEvent('share_click', { platform: 'copy_link' });
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    trackEvent('share_click', { platform: 'whatsapp' });
    const text = encodeURIComponent(`${shareTitle}: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInstagram = () => {
    trackEvent('share_click', { platform: 'instagram' });
    try {
      navigator.clipboard.writeText(`${shareTitle}: ${shareUrl}`);
    } catch {}
    window.open('https://www.instagram.com/direct/inbox/', '_blank');
  };

  const handleFacebook = () => {
    trackEvent('share_click', { platform: 'facebook' });
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="py-6 border-t border-bark/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-bark">
        <Share2 size={16} className="text-orange" />
        <span>Share with your crew or partner:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
        <button
          onClick={handleWhatsApp}
          className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <MessageSquare size={14} />
          WhatsApp
        </button>

        <button
          onClick={handleInstagram}
          className="px-3 py-1.5 rounded-lg bg-[#E1306C]/15 hover:bg-[#E1306C]/25 text-[#E1306C] text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Share via Instagram Direct message"
        >
          <Instagram size={14} />
          Instagram
        </button>

        <button
          onClick={handleFacebook}
          className="px-3 py-1.5 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          Facebook
        </button>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-sand hover:bg-sand-dark text-bark text-xs font-bold flex items-center gap-1.5 transition-colors border border-wood/20"
        >
          {copied ? <Check size={14} className="text-forest" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};
