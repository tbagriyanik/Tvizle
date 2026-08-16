import React, { useState } from 'react';
import { Home, Tv, Radio as RadioIcon, Heart, Settings, X, Menu, History, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeTextClass, getThemeBgClass } from '../utils/theme';
import { Player } from './Player';
import { SearchBar } from './SearchBar';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const { sidebarOpen, setSidebarOpen, themeColor, currentChannel, setSearchQuery } = useAppContext();

  const navItems = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'tv', label: 'TV Kanalları', icon: Tv },
    { id: 'radio', label: 'Radyolar', icon: RadioIcon },
    { id: 'm3u', label: 'M3U (IPTV)', icon: List },
    { id: 'favorites', label: 'Favoriler', icon: Heart },
    { id: 'history', label: 'Geçmiş', icon: History },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 ${getThemeTextClass(themeColor)}`}>
            <Tv className="w-6 h-6" />
            <span>LiveTVizle</span>
          </h1>
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? `${getThemeBgClass(themeColor)} text-white font-medium shadow-md` 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 lg:ml-64 transition-all duration-300 ${currentChannel ? 'pb-24' : ''}`}>
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300"
          >
            <Menu size={24} />
          </button>
          <span className={`ml-2 text-lg font-black tracking-tight ${getThemeTextClass(themeColor)}`}>
            LiveTVizle
          </span>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <SearchBar />
          {children}
        </div>
      </main>

      <Player />
    </div>
  );
};
