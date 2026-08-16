import React, { useState } from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { mockChannels } from '../data';
import { useAppContext } from '../context/AppContext';
import { Play, Radio, Tv, Heart, Clock, ChevronRight, Sparkles, Globe2 } from 'lucide-react';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { getChannelBrand } from '../utils/channelLogos';
import { filterChannelsByCountry } from '../utils/country';
import { t, COUNTRY_LABELS } from '../utils/i18n';
import { Channel, Country } from '../types';

const RecentChannelItem: React.FC<{ channel: Channel; onSelect: () => void }> = ({ channel, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const brand = getChannelBrand(channel.id, channel.name, channel.type);

  const showLogo = !!channel.logo && !imgError;

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200/80 dark:border-gray-600/50 text-left transition-all group"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: brand.gradient }}
      >
        {showLogo ? (
          <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain p-0.5" onError={() => setImgError(true)} />
        ) : (
          channel.type === 'tv' ? <Tv size={14} className="text-white" /> : <Radio size={14} className="text-white" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-500">
          {channel.name}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
          {channel.category}
        </p>
      </div>
    </button>
  );
};

export const HomeView: React.FC = () => {
  const { 
    currentChannel, 
    setCurrentChannel, 
    themeColor, 
    setActiveTab, 
    setSelectedCategory,
    history,
    favorites,
    customChannels,
    country,
    setCountry,
    language
  } = useAppContext();

  const allChannels = filterChannelsByCountry([...mockChannels, ...customChannels], country);
  const featured = allChannels[0]; // Flagship featured channel (TRT 1 or first of selected country)
  const featuredBrand = featured ? getChannelBrand(featured.id, featured.name, featured.type) : null;

  // Recent channels from history
  const recentChannels = history
    .map(item => allChannels.find(c => c.id === item.channelId))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .slice(0, 6);

  // Favorite channels
  const favoriteChannels = allChannels.filter(c => favorites.includes(c.id)).slice(0, 4);

  const quickCategories = [
    { label: 'Ulusal', type: 'tv', cat: 'Ulusal' },
    { label: 'Haber', type: 'tv', cat: 'Haber' },
    { label: 'Spor', type: 'tv', cat: 'Spor' },
    { label: 'Müzik', type: 'tv', cat: 'Müzik' },
    { label: 'Pop Radyo', type: 'radio', cat: 'Pop' },
    { label: 'Slow Radyo', type: 'radio', cat: 'Slow' },
    { label: 'Haber / Spor', type: 'radio', cat: 'Haber/Spor' },
  ];

  const countryOptions: { id: Country; flag: string; label: string }[] = [
    { id: 'all', flag: '🌍', label: COUNTRY_LABELS.all[language] },
    { id: 'tr', flag: '🇹🇷', label: COUNTRY_LABELS.tr[language] },
    { id: 'us', flag: '🇺🇸', label: COUNTRY_LABELS.us[language] },
    { id: 'de', flag: '🇩🇪', label: COUNTRY_LABELS.de[language] },
    { id: 'fr', flag: '🇫🇷', label: COUNTRY_LABELS.fr[language] },
    { id: 'gb', flag: '🇬🇧', label: COUNTRY_LABELS.gb[language] },
    { id: 'qa', flag: '🇶🇦', label: COUNTRY_LABELS.qa[language] },
    { id: 'it', flag: '🇮🇹', label: COUNTRY_LABELS.it[language] },
    { id: 'es', flag: '🇪🇸', label: COUNTRY_LABELS.es[language] },
    { id: 'nl', flag: '🇳🇱', label: COUNTRY_LABELS.nl[language] },
    { id: 'au', flag: '🇦🇺', label: COUNTRY_LABELS.au[language] },
    { id: 'ca', flag: '🇨🇦', label: COUNTRY_LABELS.ca[language] },
    { id: 'jp', flag: '🇯🇵', label: COUNTRY_LABELS.jp[language] },
    { id: 'ru', flag: '🇷🇺', label: COUNTRY_LABELS.ru[language] },
    { id: 'cn', flag: '🇨🇳', label: COUNTRY_LABELS.cn[language] },
    { id: 'kr', flag: '🇰🇷', label: COUNTRY_LABELS.kr[language] },
    { id: 'pt', flag: '🇵🇹', label: COUNTRY_LABELS.pt[language] },
  ];

  const handleCategoryClick = (type: 'tv' | 'radio', cat: string) => {
    setActiveTab(type);
    setSelectedCategory(cat);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Country Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-shrink-0 mr-1">
          <Globe2 size={14} className={getThemeTextClass(themeColor)} />
          <span>{t(language, 'home.country')}</span>
        </span>
        {countryOptions.map(c => (
          <button
            key={c.id}
            onClick={() => setCountry(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
              country === c.id
                ? `${getThemeBgClass(themeColor)} text-white border-transparent shadow-sm`
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-2xs'
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Category Discovery Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-shrink-0 mr-1">
          <Sparkles size={14} className={getThemeTextClass(themeColor)} />
          <span>{t(language, 'home.categories')}</span>
        </span>
        {quickCategories.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(item.type as any, item.cat)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            {item.type === 'tv' ? <Tv size={12} className="text-blue-500" /> : <Radio size={12} className="text-amber-500" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Banner Hero */}
      {!currentChannel && featured && (
        <section 
          className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[24/7] shadow-md border border-gray-200 dark:border-gray-800"
          style={{ background: featuredBrand?.gradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent flex flex-col justify-end p-6 md:p-8 z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{t(language, 'home.live')}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs">
                HD 1080p
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs">
                {featured.category}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight">
              {featured.name}
            </h2>
            <p className="text-gray-300 max-w-xl mb-4 text-sm hidden sm:block">
              {t(language, 'home.featuredDesc')}
            </p>

            <div>
              <button 
                onClick={() => setCurrentChannel(featured)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm ${getThemeBgClass(themeColor)} hover:opacity-90 shadow-md`}
              >
                <Play size={17} fill="currentColor" />
                <span>{t(language, 'home.watchLive')}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Recently Played Strip (If user has history) */}
      {recentChannels.length > 0 && (
        <section className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className={getThemeTextClass(themeColor)} />
              <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{t(language, 'home.recentlyPlayed')}</h3>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-0.5"
            >
              <span>{t(language, 'home.history')}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recentChannels.map(ch => (
              <RecentChannelItem key={`recent-${ch.id}`} channel={ch} onSelect={() => setCurrentChannel(ch)} />
            ))}
          </div>
        </section>
      )}

      {/* Favorites Section (If user has favorites) */}
      {favoriteChannels.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{t(language, 'home.favoriteChannels')}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(language, 'home.favDesc')}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`text-xs md:text-sm font-semibold flex items-center gap-1 ${getThemeTextClass(themeColor)} hover:underline`}
            >
              <span>{t(language, 'home.viewAll')} ({favorites.length})</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteChannels.map(channel => (
              <ChannelCard key={`fav-home-${channel.id}`} channel={channel} />
            ))}
          </div>
        </section>
      )}

      {/* Popular TV Channels */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
              <Tv size={18} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{t(language, 'home.popularTv')}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t(language, 'home.popularTvDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('tv'); setSelectedCategory(undefined); }}
            className={`text-xs md:text-sm font-semibold flex items-center gap-1 ${getThemeTextClass(themeColor)} hover:underline`}
          >
            <span>{t(language, 'home.allTv')} ({allChannels.filter(c => c.type === 'tv').length})</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allChannels.filter(c => c.type === 'tv').slice(0, 8).map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>

      {/* Trending Radios */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
              <Radio size={18} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{t(language, 'home.trendingRadios')}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t(language, 'home.trendingRadiosDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('radio'); setSelectedCategory(undefined); }}
            className={`text-xs md:text-sm font-semibold flex items-center gap-1 ${getThemeTextClass(themeColor)} hover:underline`}
          >
            <span>{t(language, 'home.allRadios')} ({allChannels.filter(c => c.type === 'radio').length})</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allChannels.filter(c => c.type === 'radio').slice(0, 8).map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>
    </div>
  );
};
