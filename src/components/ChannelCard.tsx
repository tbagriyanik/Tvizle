import React from 'react';
import { Channel } from '../types';
import { useAppContext } from '../context/AppContext';
import { Heart, Play, Radio, Volume2 } from 'lucide-react';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { ChannelPreview } from './ChannelPreview';

export const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const { currentChannel, isPlaying, setCurrentChannel, favorites, toggleFavorite, themeColor } = useAppContext();
  
  const isCurrent = currentChannel?.id === channel.id;
  const isFavorite = favorites.includes(channel.id);

  return (
    <div 
      onClick={() => setCurrentChannel(channel)}
      className={`group relative bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col ${
        isCurrent 
          ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 border-transparent shadow-xl ' + (themeColor === 'red' ? 'ring-red-500' : themeColor === 'green' ? 'ring-emerald-500' : themeColor === 'purple' ? 'ring-purple-500' : themeColor === 'orange' ? 'ring-orange-500' : 'ring-blue-500')
          : 'border-gray-200/80 dark:border-gray-700/70 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
      }`}
    >
      {/* Visual Preview Header */}
      {channel.type === 'tv' ? (
        <div className="aspect-video relative overflow-hidden bg-gray-950">
          <ChannelPreview 
            channel={channel} 
            className="w-full h-full"
            isPlaying={isCurrent && isPlaying}
          />
          
          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentChannel(channel); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getThemeBgClass(themeColor)} transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl`}
              title="İzle"
            >
              {isCurrent && isPlaying ? (
                <Volume2 className="animate-pulse" size={22} />
              ) : (
                <Play className="ml-1" size={22} fill="currentColor" />
              )}
            </button>
          </div>

          {/* Favorite Toggle Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(channel.id); }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full z-30 bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all duration-200 border border-white/10 ${
              isFavorite ? 'text-red-500' : 'text-white/80 hover:text-white'
            }`}
            title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      ) : (
        /* Radio Card Top Section */
        <div className="h-28 relative overflow-hidden bg-gray-950">
          <ChannelPreview 
            channel={channel} 
            className="w-full h-full"
            isPlaying={isCurrent && isPlaying}
          />

          {/* Hover Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentChannel(channel); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getThemeBgClass(themeColor)} transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl`}
              title="Dinle"
            >
              {isCurrent && isPlaying ? (
                <Volume2 className="animate-pulse" size={18} />
              ) : (
                <Play className="ml-0.5" size={18} fill="currentColor" />
              )}
            </button>
          </div>

          {/* Favorite Toggle Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(channel.id); }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full z-30 bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all duration-200 border border-white/10 ${
              isFavorite ? 'text-red-500' : 'text-white/80 hover:text-white'
            }`}
            title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}
      
      {/* Card Info Details */}
      <div className="p-3.5 flex items-center justify-between gap-3 flex-1 bg-white dark:bg-gray-800">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className={`font-bold text-sm md:text-base truncate transition-colors ${
              isCurrent ? getThemeTextClass(themeColor) : 'text-gray-900 dark:text-gray-100'
            }`}>
              {channel.name}
            </h3>
            {isCurrent && (
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
            {channel.category}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentChannel(channel); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isCurrent 
                ? `${getThemeBgClass(themeColor)} text-white shadow-md` 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
            }`}
          >
            {isCurrent && isPlaying ? (
              <Volume2 size={14} className="animate-pulse" />
            ) : (
              <Play size={14} className="ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
