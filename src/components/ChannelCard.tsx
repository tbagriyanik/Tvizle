import React from 'react';
import { Channel } from '../types';
import { useAppContext } from '../context/AppContext';
import { Heart, Play, Tv, Radio } from 'lucide-react';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';

export const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const { currentChannel, isPlaying, setCurrentChannel, favorites, toggleFavorite, themeColor } = useAppContext();
  
  const isCurrent = currentChannel?.id === channel.id;
  const isFavorite = favorites.includes(channel.id);

  return (
    <div 
      onClick={() => setCurrentChannel(channel)}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {channel.type === 'tv' && (
        <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900">
          {channel.logo ? (
            <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tv size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => setCurrentChannel(channel)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getThemeBgClass(themeColor)} transform scale-75 group-hover:scale-100 transition-transform`}
            >
              {(isCurrent && isPlaying) ? <Play className="ml-1 opacity-50" size={24} fill="currentColor" /> : <Play className="ml-1" size={24} fill="currentColor" />}
            </button>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(channel.id); }}
            className={`absolute top-2 right-2 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors ${isFavorite ? getThemeTextClass(themeColor) : 'text-white'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium bg-black/60 text-white backdrop-blur-sm uppercase tracking-wider">
            TV
          </div>
        </div>
      )}
      
      <div className={`p-4 ${channel.type === 'radio' ? 'flex items-center gap-4' : ''}`}>
        {channel.type === 'radio' && (
           <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCurrent ? getThemeBgClass(themeColor) + ' text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'} transition-all`}>
              <Radio size={20} />
           </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg truncate ${isCurrent ? getThemeTextClass(themeColor) : 'text-gray-900 dark:text-white'} ${channel.type === 'tv' ? 'mb-1' : ''}`}>
            {channel.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{channel.category}</p>
        </div>
        
        {channel.type === 'radio' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(channel.id); }}
              className={`p-2 rounded-full transition-colors ${isFavorite ? getThemeTextClass(themeColor) : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => setCurrentChannel(channel)}
              className={`w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white ${getThemeBgClass(themeColor)}`}
            >
              {(isCurrent && isPlaying) ? <Play className="ml-0.5 opacity-50" size={16} fill="currentColor" /> : <Play className="ml-0.5" size={16} fill="currentColor" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
