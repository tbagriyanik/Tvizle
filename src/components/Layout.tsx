import React, { useState } from 'react';
import { 
  Home, 
  Tv, 
  Radio as RadioIcon, 
  Heart, 
  Settings, 
  X, 
  Menu, 
  History, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Keyboard, 
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeTextClass, getThemeBgClass } from '../utils/theme';
import { Player } from './Player';
import { SearchBar } from './SearchBar';
import { mockChannels } from '../data';
import { filterChannelsByCountry } from '../utils/country';
import { t } from '../utils/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    themeColor, 
    themeMode,
    setThemeMode,
    currentChannel, 
    setSearchQuery,
    activeTab,
    setActiveTab,
    favorites,
    history,
    customChannels,
    country,
    language,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    setSelectedCategory
  } = useAppContext();

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const countryChannels = filterChannelsByCountry(mockChannels, country);
  const tvCount = countryChannels.filter(c => c.type === 'tv').length;
  const radioCount = countryChannels.filter(c => c.type === 'radio').length;

  const navItems = [
    { id: 'home', label: t(language, 'nav.home'), icon: Home, count: null },
    { id: 'tv', label: t(language, 'nav.tv'), icon: Tv, count: tvCount },
    { id: 'radio', label: t(language, 'nav.radio'), icon: RadioIcon, count: radioCount },
    { id: 'favorites', label: t(language, 'nav.favorites'), icon: Heart, count: favorites.length > 0 ? favorites.length : null, badgeColor: 'bg-red-500' },
    { id: 'history', label: t(language, 'nav.history'), icon: History, count: history.length > 0 ? history.length : null },
    { id: 'm3u', label: t(language, 'nav.m3u'), icon: List, count: customChannels.length > 0 ? customChannels.length : null },
    { id: 'settings', label: t(language, 'nav.settings'), icon: Settings, count: null },
  ];

  const mobileNavItems = [
    { id: 'home', label: t(language, 'nav.home'), icon: Home },
    { id: 'tv', label: t(language, 'nav.tvshort'), icon: Tv },
    { id: 'radio', label: t(language, 'nav.radioshort'), icon: RadioIcon },
    { id: 'favorites', label: t(language, 'nav.favorites'), icon: Heart, count: favorites.length },
    { id: 'settings', label: t(language, 'nav.settings'), icon: Settings },
  ];

  const handleLogoClick = () => {
    setActiveTab('home');
    setSelectedCategory(undefined);
    setSidebarOpen(false);
    setSearchQuery('');
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedCategory(undefined);
    setSidebarOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop & Tablet Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button 
            onClick={handleLogoClick}
            className={`text-xl font-black tracking-tight flex items-center gap-2.5 ${getThemeTextClass(themeColor)} hover:opacity-85 transition-opacity cursor-pointer text-left focus:outline-none`}
            title={t(language, 'nav.homeTitle')}
            aria-label={t(language, 'nav.homeTitle')}
          >
            <div className={`p-1.5 rounded-xl text-white ${getThemeBgClass(themeColor)} shadow-sm flex items-center justify-center`}>
              <Tv className="w-4 h-4" />
            </div>
            <span>LiveTVizle</span>
          </button>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" 
            onClick={() => setSidebarOpen(false)} 
            aria-label="Menüyü Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? `${getThemeBgClass(themeColor)} text-white shadow-sm` 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                  <span>{item.label}</span>
                </div>

                {item.count !== null && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.badgeColor ? `${item.badgeColor} text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Utilities */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 p-2 rounded-xl border border-gray-200/80 dark:border-gray-700/60">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 pl-1 flex items-center gap-1.5">
              <Sun size={13} className="text-amber-500" />
              <span>{t(language, 'nav.appearance')}</span>
            </span>
            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              title={themeMode === 'dark' ? t(language, 'nav.lightMode') : t(language, 'nav.darkMode')}
            >
              {themeMode === 'dark' ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-blue-500" />}
            </button>
          </div>

          <button
            onClick={() => setShowShortcutsModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Keyboard size={14} />
            <span>{t(language, 'nav.shortcutKeys')}</span>
          </button>
        </div>
      </aside>

      {/* Main App Canvas */}
      <main className={`flex-1 lg:ml-64 flex flex-col transition-all duration-300 ${currentChannel ? 'pb-32 md:pb-28' : 'pb-20 lg:pb-8'}`}>
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          
          {/* Left: Mobile Menu & Nav History Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              aria-label="Menü Aç"
            >
              <Menu size={22} />
            </button>

            {/* Browser-style Back & Forward History Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title={t(language, 'nav.backTitle')}
                aria-label="Geri Dön"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title={t(language, 'nav.forwardTitle')}
                aria-label="İleri Git"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Mobile Logo Text */}
            <button
              onClick={handleLogoClick}
              className={`lg:hidden ml-1 text-base font-black tracking-tight flex items-center gap-1.5 ${getThemeTextClass(themeColor)} focus:outline-none`}
              title={t(language, 'nav.homeTitle')}
            >
              <span>LiveTVizle</span>
            </button>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title={t(language, 'nav.shortcutsTitle')}
            >
              <Keyboard size={14} />
              <span>{t(language, 'nav.shortcuts')}</span>
            </button>

            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={themeMode === 'dark' ? t(language, 'nav.lightMode') : t(language, 'nav.darkMode')}
              aria-label="Tema Değiştir"
            >
              {themeMode === 'dark' ? <Sun size={19} className="text-yellow-400" /> : <Moon size={19} className="text-blue-500" />}
            </button>
          </div>
        </header>

        {/* Page Main Content Container */}
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
          <SearchBar />
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Thumb friendly) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex items-center justify-around h-15 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl relative transition-all ${
                isActive 
                  ? `${getThemeTextClass(themeColor)} font-bold` 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'scale-110 transition-transform' : ''} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-0 right-1/4 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className={getThemeTextClass(themeColor)} size={22} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(language, 'nav.shortcutKeys')}</h3>
              </div>
              <button 
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.playPause')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">Space / K</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.fullscreen')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">F</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.mute')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">M</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.seek')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">← / →</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.volume')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">↑ / ↓</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.channelNav')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">[ / ]</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-600 dark:text-gray-300">{t(language, 'shortcuts.quickSearch')}</span>
                <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">Ctrl + K</kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className={`w-full py-2.5 rounded-xl font-semibold text-white ${getThemeBgClass(themeColor)} hover:opacity-90 transition-opacity`}
            >
              {t(language, 'common.gotIt')}
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Media Player */}
      <Player />
    </div>
  );
};
