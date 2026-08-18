import React, { useState, useMemo } from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { Channel } from '../types';
import { useAppContext } from '../context/AppContext';
import { 
  Filter, 
  Grid, 
  List as ListIcon, 
  ArrowUpDown, 
  Search, 
  X, 
  Radio, 
  Tv, 
  Heart,
  Volume2,
  Play
} from 'lucide-react';
import { getThemeBgClass, getThemeTextClass, getThemeRingClass } from '../utils/theme';
import { getChannelBrand } from '../utils/channelLogos';
import { t } from '../utils/i18n';

interface ListViewProps {
  title: string;
  channels: Channel[];
  emptyMessage?: string;
  type?: 'tv' | 'radio' | 'favorites' | 'm3u';
}

export const ListView: React.FC<ListViewProps> = ({ 
  title, 
  channels, 
  emptyMessage
}) => {
  const { 
    themeColor, 
    selectedCategory, 
    setSelectedCategory,
    currentChannel,
    isPlaying,
    setCurrentChannel,
    favorites,
    toggleFavorite,
    language,
    sortBy,
    setSortBy,
    filterQuery,
    setFilterQuery,
    activeBitrate,
    setActiveBitrate
  } = useAppContext();

  const finalEmptyMessage = emptyMessage || t(language, 'list.empty');

  // Category filter reads directly from context so it stays in sync with the
  // Player's prev/next navigation (single source of truth).
  const activeCategory = selectedCategory ?? 'all';
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Extract unique categories and their counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    channels.forEach(ch => {
      counts[ch.category] = (counts[ch.category] || 0) + 1;
    });
    return counts;
  }, [channels]);

  const categoryList = useMemo(() => {
    return Object.keys(categoriesWithCounts).sort();
  }, [categoriesWithCounts]);

  // Unique bitrate values present in the radio channels (for bitrate filtering)
  const bitrateList = useMemo(() => {
    const counts: Record<number, number> = {};
    channels.forEach(ch => {
      if (ch.type === 'radio' && typeof ch.bitrate === 'number' && ch.bitrate > 0) {
        counts[ch.bitrate] = (counts[ch.bitrate] || 0) + 1;
      }
    });
    return Object.keys(counts)
      .map(Number)
      .sort((a, b) => b - a)
      .map(b => ({ bitrate: b, count: counts[b] }));
  }, [channels]);

  // Filter and sort channels
  const filteredChannels = useMemo(() => {
    let list = [...channels];

    // 1. Category Filter (supports single category or a list, e.g. quick pills)
    if (activeCategory !== 'all') {
      if (Array.isArray(activeCategory)) {
        list = list.filter(c => activeCategory.includes(c.category));
      } else {
        list = list.filter(c => c.category === activeCategory);
      }
    }

    // 1b. Bitrate Filter (radio only)
    if (activeBitrate !== 'all') {
      list = list.filter(c => c.type === 'radio' && c.bitrate === activeBitrate);
    }

    // 2. In-page filter search
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    if (activeBitrate !== 'all') {
      // When filtering by bitrate, order the list low -> high
      list.sort((a, b) => (a.bitrate ?? 0) - (b.bitrate ?? 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    } else {
      // Default order: bring national (Ulusal) TV channels to the front.
      list.sort((a, b) => {
        const aNat = a.type === 'tv' && a.category === 'Ulusal' ? 0 : 1;
        const bNat = b.type === 'tv' && b.category === 'Ulusal' ? 0 : 1;
        return aNat - bNat;
      });
    }

    return list;
  }, [channels, selectedCategory, activeBitrate, filterQuery, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat === 'all' ? undefined : cat);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {filteredChannels.length} {t(language, 'list.channelCount')}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t(language, 'list.desc')}
          </p>
        </div>

        {/* View Mode and Sorting Options */}
        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs md:text-sm pl-3 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            >
              <option value="default">{t(language, 'list.sortDefault')}</option>
              <option value="name-asc">{t(language, 'list.sortAsc')}</option>
              <option value="name-desc">{t(language, 'list.sortDesc')}</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* Grid / Compact View Toggle */}
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? `${getThemeBgClass(themeColor)} text-white` : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title={t(language, 'list.gridView')}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-lg ${viewMode === 'compact' ? `${getThemeBgClass(themeColor)} text-white` : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title={t(language, 'list.listView')}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Category Controls */}
      {channels.length > 0 && (
        <div className="space-y-3">
          
          {/* In-page quick filter search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`${title} ${t(language, 'list.filterIn')}`}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 ${getThemeRingClass(themeColor)} transition-all`}
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Interactive Category Filter Chips (Horizontal Scrollable) */}
          {categoryList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === 'all'
                    ? `${getThemeBgClass(themeColor)} text-white shadow-xs`
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{t(language, 'list.all')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'all' ? 'bg-white/25 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {channels.length}
                </span>
              </button>

              {categoryList.map(cat => {
                const isSelected = activeCategory === cat;
                const count = categoriesWithCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${getThemeBgClass(themeColor)} text-white shadow-xs`
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bitrate Filter Chips (Radio only) */}
          {bitrateList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-shrink-0">
                <ArrowUpDown size={12} />
                <span>Bitrate</span>
              </span>
              <button
                onClick={() => setActiveBitrate('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeBitrate === 'all'
                    ? `${getThemeBgClass(themeColor)} text-white shadow-xs`
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{t(language, 'list.all')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeBitrate === 'all' ? 'bg-white/25 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {bitrateList.reduce((acc, b) => acc + b.count, 0)}
                </span>
              </button>
              {bitrateList.map(b => {
                const isSelected = activeBitrate === b.bitrate;
                return (
                  <button
                    key={b.bitrate}
                    onClick={() => setActiveBitrate(isSelected ? 'all' : b.bitrate)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${getThemeBgClass(themeColor)} text-white shadow-xs`
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{b.bitrate} kbps</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {b.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Channels List Output */}
      {filteredChannels.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium">{emptyMessage}</p>
          {(filterQuery || activeCategory !== 'all' || activeBitrate !== 'all') && (
            <button
              onClick={() => {
                setFilterQuery('');
                setSelectedCategory(undefined);
                setActiveBitrate('all');
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white ${getThemeBgClass(themeColor)} hover:opacity-90`}
            >
              <X size={14} />
              <span>{t(language, 'list.clearFilters')}</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Standard Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChannels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      ) : (
        /* Compact List View */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/60 overflow-hidden shadow-xs">
          {filteredChannels.map(channel => {
            const isCurrent = currentChannel?.id === channel.id;
            const isFav = favorites.includes(channel.id);
            const brand = getChannelBrand(channel.id, channel.name, channel.type);

            return (
              <div
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isCurrent 
                    ? 'bg-blue-50/70 dark:bg-blue-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                }`}
              >
                {/* Channel Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div 
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-black/10 dark:border-white/10 shadow-xs ${
                      channel.type === 'radio' && isCurrent && isPlaying ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    style={{ background: brand.gradient }}
                  >
                    {channel.logo ? (
                      <img 
                        src={channel.logo} 
                        alt={channel.name} 
                        className="w-full h-full object-contain p-1 filter drop-shadow"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    ) : (
                      channel.type === 'tv' ? (
                        <Tv size={18} className="text-white" />
                      ) : (
                        <Radio size={18} style={{ color: brand.accentColor }} />
                      )
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold truncate ${isCurrent ? getThemeTextClass(themeColor) : 'text-gray-900 dark:text-gray-100'}`}>
                        {channel.name}
                      </h4>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1.5 mt-0.5">
                      <span>{brand.genreBadge || channel.category}</span>
                      <span>•</span>
                      <span>{channel.type === 'tv' ? t(language, 'list.hdtv') : (brand.frequency || t(language, 'list.radio'))}</span>
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(channel.id);
                    }}
                    className={`p-2 rounded-lg ${
                      isFav 
                        ? 'text-red-500 bg-red-50 dark:bg-red-500/10' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={isFav ? t(language, 'list.removeFav') : t(language, 'list.addFav')}
                  >
                    <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentChannel(channel);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCurrent
                        ? `${getThemeBgClass(themeColor)} text-white`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isCurrent && isPlaying ? <Volume2 size={15} /> : <Play size={15} className="ml-0.5" fill="currentColor" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
