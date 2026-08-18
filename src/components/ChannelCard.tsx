import React from 'react';
import { Channel } from '../types';
import { useAppContext } from '../context/AppContext';
import { Heart, Play, Volume2 } from 'lucide-react';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { ChannelPreview } from './ChannelPreview';
import { t } from '../utils/i18n';

export const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const { currentChannel, isPlaying, setCurrentChannel, favorites, toggleFavorite, themeColor, language } = useAppContext();
  
  const isCurrent = currentChannel?.id === channel.id;
  const isFavorite = favorites.includes(channel.id);

  return (
    <div 
      onClick={() => setCurrentChannel(channel)}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border cursor-pointer flex flex-col ${
        isCurrent 
          ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 border-transparent shadow-md ' + (themeColor === 'red' ? 'ring-red-500' : themeColor === 'green' ? 'ring-emerald-500' : themeColor === 'purple' ? 'ring-purple-500' : themeColor === 'orange' ? 'ring-orange-500' : 'ring-blue-500')
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
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
          
          {/* Favorite Toggle Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(channel.id); }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-lg z-30 bg-black/50 hover:bg-black/70 border border-white/10 ${
              isFavorite ? 'text-red-500' : 'text-white/80 hover:text-white'
            }`}
            title={isFavorite ? t(language, 'list.removeFav') : t(language, 'list.addFav')}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      ) : (
        /* Radio Card Top Section (Album Art / Vinyl Cover) */
        <div className="h-24 sm:h-28 relative overflow-hidden bg-gray-950">
          <ChannelPreview 
            channel={channel} 
            className="w-full h-full"
            isPlaying={isCurrent && isPlaying}
          />

          {/* Favorite Toggle Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(channel.id); }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-lg z-30 bg-black/50 hover:bg-black/70 border border-white/10 ${
              isFavorite ? 'text-red-500' : 'text-white/80 hover:text-white'
            }`}
            title={isFavorite ? t(language, 'list.removeFav') : t(language, 'list.addFav')}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}
      
      {/* Card Info Details */}
      <div className="p-3 flex items-center justify-between gap-3 flex-1 bg-white dark:bg-gray-800">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className={`font-semibold text-sm truncate ${
              isCurrent ? getThemeTextClass(themeColor) : 'text-gray-900 dark:text-gray-100'
            }`}>
              {channel.name}
            </h3>
            {isCurrent && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {channel.category}
          </p>
          {(channel.type === 'radio' && channel.bitrate) || (channel.type === 'tv' && channel.resolution) ? (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {channel.type === 'radio' && channel.bitrate ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium leading-none">
                  {channel.bitrate} kbps
                </span>
              ) : null}
              {channel.type === 'tv' && channel.resolution ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium leading-none">
                  {channel.resolution}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentChannel(channel); }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isCurrent 
                ? `${getThemeBgClass(themeColor)} text-white` 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {isCurrent && isPlaying ? (
              <Volume2 size={15} />
            ) : (
              <Play size={15} className="ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
