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
        {/* Vinyl Record Visual Disc Background */}
        <div 
          className={`absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full pointer-events-none flex items-center justify-center opacity-85 transition-transform duration-700 group-hover/radio:scale-105`}
          style={{
            background: 'radial-gradient(circle, #18181b 0%, #09090b 45%, #18181b 70%, #000000 100%)',
            boxShadow: `0 0 20px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.08), 0 0 12px ${brand.accentColor}33`,
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          {/* Vinyl Grooves (Subtle concentric rings) */}
          <div className="absolute inset-1.5 rounded-full border border-white/[0.04]" />
          <div className="absolute inset-3.5 rounded-full border border-white/[0.06]" />
          <div className="absolute inset-6 rounded-full border border-white/[0.05]" />
          <div className="absolute inset-8 rounded-full border border-white/[0.07]" />
          <div className="absolute inset-11 rounded-full border border-white/[0.05]" />

          {/* Vinyl Sheen Overlay (Metallic Refraction Lines) */}
          <div 
            className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.4) 60deg, transparent 120deg, transparent 180deg, rgba(255,255,255,0.4) 240deg, transparent 300deg)'
            }}
          />
        </div>

        {/* Center Artwork / Logo Spindle Label */}
        <div className="relative z-10 flex flex-col items-center justify-center p-1.5 text-center max-w-[85%]">
          {hasValidLogo ? (
            <div 
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full p-1.5 bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-md transition-all duration-300 ${
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
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/65 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-md transition-all duration-300 ${
                isPlaying ? 'ring-2 ring-offset-1 ring-offset-black/50 scale-105' : ''
              }`}
              style={{
                borderColor: isPlaying ? brand.accentColor : 'rgba(255,255,255,0.2)',
                boxShadow: isPlaying ? `0 0 14px ${brand.accentColor}66` : '0 3px 8px rgba(0,0,0,0.5)'
              }}
            >
              <div 
                className="text-[10px] font-black tracking-widest uppercase drop-shadow"
                style={{ color: brand.accentColor }}
              >
                {getInitials(brand.textLogo || channel.name)}
              </div>
              <Radio size={10} className="text-white/60 mt-0.5" />
            </div>
          )}

          {/* Station Title on Card */}
          <div className="mt-1 font-bold text-white text-[11px] tracking-wide truncate max-w-[130px] drop-shadow-md">
            {brand.textLogo || channel.name}
          </div>
          
          <div className="text-[9px] text-white/80 font-medium tracking-wider uppercase truncate max-w-[115px] drop-shadow-xs">
            {brand.subtitle || channel.category}
          </div>

          {/* Mini Playing Indicator */}
          {isPlaying && (
            <div className="mt-1 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 px-1.5 py-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
          )}
        </div>

        {/* Top Badges for Radio */}
        {showBadges && (
          <>
            {/* Frequency Badge on top-left */}
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[8.5px] font-bold bg-black/60 backdrop-blur-md text-white/90 uppercase tracking-wider flex items-center gap-1 border border-white/15 shadow-2xs">
              <Radio size={9} style={{ color: brand.accentColor }} />
              <span>{brand.frequency || t(language, 'channel.fm')}</span>
            </div>

            {/* Status / Genre Badge on top-right */}
            {isPlaying ? (
              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500 text-white uppercase tracking-wider flex items-center gap-0.5 shadow-2xs border border-emerald-400/30">
                <span className="w-1 h-1 rounded-full bg-white" />
                <span>{t(language, 'channel.onAir')}</span>
              </div>
            ) : (
              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded text-[8px] font-semibold bg-black/50 backdrop-blur-xs text-white/80 uppercase tracking-wider border border-white/10 truncate max-w-[85px]">
                {brand.genreBadge || channel.category}
              </div>
            )}
          </>
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
