import React, { useState, useMemo } from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { useAppContext } from '../context/AppContext';
import { mockChannels } from '../data';
import { Search, Tv, Radio, X, Sparkles } from 'lucide-react';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';

export const SearchView: React.FC = () => {
  const { searchQuery, setSearchQuery, customChannels, themeColor } = useAppContext();
  const [filterType, setFilterType] = useState<'all' | 'tv' | 'radio'>('all');

  const query = searchQuery.toLowerCase().trim();
  const allChannels = [...mockChannels, ...customChannels];

  const results = useMemo(() => {
    let list = allChannels.filter(
      c => c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
    );

    if (filterType !== 'all') {
      list = list.filter(c => c.type === filterType);
    }

    return list;
  }, [allChannels, query, filterType]);

  const tvCount = allChannels.filter(c => c.type === 'tv' && (c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query))).length;
  const radioCount = allChannels.filter(c => c.type === 'radio' && (c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query))).length;

  const popularSuggestions = ['TRT 1', 'ATV', 'Kral Pop', 'A Spor', 'NTV', 'Power FM', 'Kanal D', 'HaberTürk'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Search Header and Filter Types */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>"{searchQuery}" için sonuçlar</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {results.length}
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kanal adlarına ve yayın kategorilerine göre filtrelenmiştir
          </p>
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all'
                ? `${getThemeBgClass(themeColor)} text-white`
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Tümü ({tvCount + radioCount})
          </button>

          <button
            onClick={() => setFilterType('tv')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'tv'
                ? `${getThemeBgClass(themeColor)} text-white`
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Tv size={13} />
            <span>TV ({tvCount})</span>
          </button>

          <button
            onClick={() => setFilterType('radio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'radio'
                ? `${getThemeBgClass(themeColor)} text-white`
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Radio size={13} />
            <span>Radyo ({radioCount})</span>
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
          <Search className="w-12 h-12 mx-auto text-gray-400 opacity-50" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sonuç Bulunamadı</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            "<b>{searchQuery}</b>" aramasıyla eşleşen bir TV kanalı veya radyo bulunamadı. Yazımı kontrol edebilir veya aşağıdaki popüler kanalları deneyebilirsiniz:
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {popularSuggestions.map(sug => (
              <button
                key={sug}
                onClick={() => setSearchQuery(sug)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setSearchQuery('')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white ${getThemeBgClass(themeColor)} hover:opacity-90`}
            >
              <X size={14} />
              <span>Aramayı Temizle</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map(channel => (
            <ChannelCard key={`search-${channel.id}`} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
};
