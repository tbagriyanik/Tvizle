import React, { useState } from 'react';
import { Channel } from '../types';
import { getChannelBrand } from '../utils/channelLogos';
import { Tv, Radio, Disc, Music2, Waves, Sparkles, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { t } from '../utils/i18n';

interface ChannelPreviewProps {
  channel: Channel;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showBadges?: boolean;
  isPlaying?: boolean;
}

export const ChannelPreview: React.FC<ChannelPreviewProps> = ({
  channel,
  className = '',
  showBadges = true,
  isPlaying = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const { language } = useAppContext();
  const brand = getChannelBrand(channel.id, channel.name, channel.type);

  const hasValidLogo = !!channel.logo && !imgError;

  // Station initials for vinyl monogram fallback
  const getInitials = (text: string) => {
    const cleaned = text.replace(/radyo|fm|turkey|türkiye|\.com|web/gi, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (cleaned.slice(0, 3) || text.slice(0, 3)).toUpperCase();
  };

  if (channel.type === 'radio') {
    return (
      <div 
        className={`relative overflow-hidden flex items-center justify-center select-none group/radio ${className}`}
        style={{ background: brand.gradient }}
      >
        {/* Editorial scrim to unify/refine the artwork */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/45" />

        {/* Center Artwork / Logo Spindle Label */}
        <div className="relative z-10 flex flex-col items-center justify-center p-1.5 text-center max-w-[85%]">
          {hasValidLogo ? (
            <div 
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full p-1 bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-md transition-all duration-300 ${
                isPlaying ? 'ring-2 ring-offset-1 ring-offset-black/50 scale-105' : ''
              }`}
              style={{
                borderColor: isPlaying ? brand.accentColor : 'rgba(255,255,255,0.25)',
                boxShadow: isPlaying ? `0 0 16px ${brand.accentColor}88` : '0 3px 8px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src={channel.logo} 
                alt={channel.name} 
                className="w-full h-full object-contain filter drop-shadow-md"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div 
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-md transition-all duration-300 ${
                isPlaying ? 'ring-2 ring-offset-1 ring-offset-black/50 scale-105' : ''
              }`}
              style={{
                borderColor: isPlaying ? brand.accentColor : 'rgba(255,255,255,0.2)',
                boxShadow: isPlaying ? `0 0 14px ${brand.accentColor}66` : '0 3px 8px rgba(0,0,0,0.5)'
              }}
            >
              <div 
                className="text-[9px] font-black tracking-widest uppercase drop-shadow"
                style={{ color: brand.accentColor }}
              >
                {getInitials(brand.textLogo || channel.name)}
              </div>
              <Radio size={9} className="text-white/60 mt-0.5" />
            </div>
          )}

          {/* Mini Playing Indicator */}
          {isPlaying && (
            <div className="mt-1.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 px-1.5 py-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
          )}
        </div>

        {/* Top Badges for Radio */}
        {showBadges && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[8.5px] font-bold bg-black/60 backdrop-blur-md text-white/90 uppercase tracking-wider flex items-center gap-1 border border-white/15">
            <Radio size={9} style={{ color: brand.accentColor }} />
            <span>{brand.frequency || t(language, 'channel.fm')}</span>
          </div>
        )}

        {/* Subtle Ambient Vignette Bottom Scrim */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
    );
  }

  // TV Channel Preview
  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center select-none ${className}`}
      style={{ background: brand.gradient }}
    >
      {/* Editorial scrim to unify/refine the artwork */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-black/20" />

      {/* Main Logo & Insignia Centerpiece */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2.5">
        {hasValidLogo ? (
          <div className="relative max-w-[65%] max-h-[60%] flex items-center justify-center">
            <img 
              src={channel.logo} 
              alt={channel.name} 
              className="max-h-10 sm:max-h-12 w-auto object-contain filter drop-shadow"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="px-2.5 py-0.5 rounded bg-black/40 border border-white/20 flex items-center gap-1.5 mb-0.5">
              <Tv size={13} className="text-white/90" />
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
                {brand.textLogo || channel.name}
              </span>
            </div>
            {brand.subtitle && (
              <span className="text-[9px] text-white/70 font-semibold tracking-widest uppercase">
                {brand.subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Top Badges */}
      {showBadges && (
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-20">
          {/* Live indicator badge */}
          <div className="px-1.5 py-0.2 rounded text-[8.5px] font-bold bg-red-600 text-white uppercase tracking-wider flex items-center gap-1 border border-red-400/30">
            <span className="w-1 h-1 rounded-full bg-white" />
            <span>{t(language, 'channel.live')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
