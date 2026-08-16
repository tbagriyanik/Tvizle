import React, { useState } from 'react';
import { Channel } from '../types';
import { getChannelBrand } from '../utils/channelLogos';
import { Tv, Radio, Sparkles } from 'lucide-react';

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
  size = 'md',
  showBadges = true,
  isPlaying = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const brand = getChannelBrand(channel.id, channel.name, channel.type);

  // Check if logo is valid and not error
  const hasValidLogo = !!channel.logo && !imgError;

  if (channel.type === 'radio') {
    return (
      <div 
        className={`relative overflow-hidden flex items-center justify-center select-none ${className}`}
        style={{ background: brand.gradient }}
      >
        {/* Decorative vinyl grooves / soundwave pattern */}
        <div className="absolute inset-0 opacity-15 flex items-center justify-center pointer-events-none">
          <div className={`w-36 h-36 rounded-full border border-white/40 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <div className={`absolute w-24 h-24 rounded-full border border-white/30 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <div className="absolute w-12 h-12 rounded-full border border-white/20" />
        </div>

        {/* Ambient glow */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none blur-xl"
          style={{ background: `radial-gradient(circle at center, ${brand.accentColor} 0%, transparent 70%)` }}
        />

        {/* Radio Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center">
          {hasValidLogo ? (
            <div className="w-14 h-14 rounded-full p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <img 
                src={channel.logo} 
                alt={channel.name} 
                className="w-full h-full object-contain filter drop-shadow"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mb-1 text-white shadow-lg group-hover:scale-110 transition-transform">
              <Radio size={24} style={{ color: brand.accentColor }} />
            </div>
          )}

          <div className="font-bold text-white text-sm tracking-wide truncate max-w-[140px] drop-shadow-sm">
            {brand.textLogo || channel.name}
          </div>
          
          <div className="text-[10px] text-white/70 font-medium tracking-wider uppercase truncate max-w-[120px]">
            {channel.category}
          </div>

          {/* Equalizer animation when playing */}
          {isPlaying && (
            <div className="flex items-end gap-1 mt-1.5 h-3">
              <span className="w-1 bg-white rounded-full animate-pulse h-2" />
              <span className="w-1 bg-white rounded-full animate-pulse h-3" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-white rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Radio Badge */}
        {showBadges && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/50 text-white/90 backdrop-blur-sm uppercase tracking-wider flex items-center gap-1 border border-white/10">
            <Radio size={10} className="text-amber-400" />
            <span>FM</span>
          </div>
        )}
      </div>
    );
  }

  // TV Channel Preview
  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center select-none ${className}`}
      style={{ background: brand.gradient }}
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute inset-0 opacity-35 pointer-events-none blur-2xl"
        style={{ background: `radial-gradient(circle at 70% 30%, ${brand.accentColor} 0%, transparent 65%)` }}
      />

      {/* Subtle grid & broadcast texture pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '16px 16px' 
        }}
      />

      {/* Main Logo & Insignia Centerpiece */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {hasValidLogo ? (
          <div className="relative max-w-[70%] max-h-[55%] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <img 
              src={channel.logo} 
              alt={channel.name} 
              className="max-h-16 md:max-h-20 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          /* Stylish vector insignia if logo isn't available or fails */
          <div className="flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <div className="px-4 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 mb-1">
              <Tv size={18} className="text-white/90" />
              <span className="font-extrabold text-white text-lg md:text-xl tracking-wider drop-shadow-md">
                {brand.textLogo || channel.name}
              </span>
            </div>
            {brand.subtitle && (
              <span className="text-[10px] text-white/70 font-semibold tracking-widest uppercase">
                {brand.subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Top Badges */}
      {showBadges && (
        <>
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
            {/* Live indicator badge */}
            <div className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/90 text-white backdrop-blur-sm uppercase tracking-wider flex items-center gap-1 shadow-sm border border-red-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>CANLI</span>
            </div>

            {/* Quality Tag */}
            <div className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/50 text-white/90 backdrop-blur-sm uppercase tracking-wider border border-white/15">
              HD
            </div>
          </div>

          {/* Category Pill on bottom right */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/50 text-white/80 backdrop-blur-sm truncate max-w-[120px] border border-white/10">
            {channel.category}
          </div>
        </>
      )}

      {/* Glass gradient overlay at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
};
