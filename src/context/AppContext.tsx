import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { AppState, Channel, ThemeColor, ThemeMode, Country, Language, SortOrder } from '../types';

interface AppContextType extends AppState {
  setCurrentChannel: (channel: Channel | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleFavorite: (channelId: string) => void;
  clearHistory: () => void;
  removeFromHistory: (channelId: string) => void;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setCountry: (country: Country) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setVolume: (volume: number) => void;
  setSearchQuery: (query: string) => void;
  setCustomChannels: (channels: Channel[]) => void;
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (category: string | string[] | undefined) => void;
  setFilterQuery: (query: string) => void;
  setActiveBitrate: (bitrate: number | 'all') => void;
  setSleepTimer: (minutes: number | null) => void;
  setSortBy: (sort: SortOrder) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const getInitialTab = (): string => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
    if (['home', 'tv', 'radio', 'm3u', 'favorites', 'history', 'settings'].includes(hash)) {
      return hash;
    }
  }
  return 'home';
};

const initialTab = getInitialTab();

const getSystemLanguage = (): Language =>
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';

const getSystemThemeMode = (): ThemeMode =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const defaultState: AppState = {
  currentChannel: null,
  isPlaying: false,
  favorites: [],
  history: [],
  themeColor: 'blue',
  themeMode: getSystemThemeMode(),
  language: getSystemLanguage(),
  country: 'all',
  sidebarOpen: false,
  volume: 0.8,
  searchQuery: '',
  customChannels: [],
  activeTab: initialTab,
  navHistory: [initialTab],
  historyIndex: 0,
  sortBy: 'default',
  filterQuery: '',
  activeBitrate: 'all',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('broadcastAppState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
          ...defaultState, 
          ...parsed, 
          isPlaying: false, 
          customChannels: [],
          activeTab: initialTab,
          navHistory: [initialTab],
          historyIndex: 0
        };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Sync hash and browser history popstate
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const stateTab = e.state?.tab || getInitialTab();
      setState(s => {
        const indexInNav = s.navHistory.lastIndexOf(stateTab);
        return {
          ...s,
          activeTab: stateTab,
          historyIndex: indexInNav !== -1 ? indexInNav : s.historyIndex,
          searchQuery: '',
        };
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = (tab: string) => {
    setState(s => {
      if (s.activeTab === tab && s.searchQuery === '') return s;
      
      const newHistory = s.navHistory.slice(0, s.historyIndex + 1);
      newHistory.push(tab);
      const newIndex = newHistory.length - 1;

      try {
        window.history.pushState({ tab, index: newIndex }, '', `#/${tab}`);
      } catch (e) {
        // ignore
      }

      return {
        ...s,
        activeTab: tab,
        navHistory: newHistory,
        historyIndex: newIndex,
        searchQuery: '',
      };
    });
  };

  const goBack = () => {
    setState(s => {
      if (s.searchQuery.trim() !== '') {
        return { ...s, searchQuery: '' };
      }
      if (s.historyIndex > 0) {
        const newIndex = s.historyIndex - 1;
        const targetTab = s.navHistory[newIndex];
        try {
          window.history.pushState({ tab: targetTab, index: newIndex }, '', `#/${targetTab}`);
        } catch (e) {}
        return {
          ...s,
          activeTab: targetTab,
          historyIndex: newIndex,
          searchQuery: '',
        };
      }
      return s;
    });
  };

  const goForward = () => {
    setState(s => {
      if (s.historyIndex < s.navHistory.length - 1) {
        const newIndex = s.historyIndex + 1;
        const targetTab = s.navHistory[newIndex];
        try {
          window.history.pushState({ tab: targetTab, index: newIndex }, '', `#/${targetTab}`);
        } catch (e) {}
        return {
          ...s,
          activeTab: targetTab,
          historyIndex: newIndex,
          searchQuery: '',
        };
      }
      return s;
    });
  };

  const canGoBack = state.historyIndex > 0 || state.searchQuery.trim() !== '';
  const canGoForward = state.historyIndex < state.navHistory.length - 1;

  // Keyboard navigation for history (Alt + ArrowLeft / Alt + ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;
      
      if (e.altKey && e.key === 'ArrowLeft' && !isInput) {
        e.preventDefault();
        goBack();
      } else if (e.altKey && e.key === 'ArrowRight' && !isInput) {
        e.preventDefault();
        goForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.historyIndex, state.navHistory, state.searchQuery]);

  // Load custom channels from localforage on mount
  useEffect(() => {
    localforage.getItem<Channel[]>('customM3UChannels').then((channels) => {
      if (channels && channels.length > 0) {
        setState(s => ({ ...s, customChannels: channels }));
      }
    }).catch(e => console.error('Failed to load custom channels', e));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('broadcastAppState', JSON.stringify({
        favorites: state.favorites,
        history: state.history,
        themeColor: state.themeColor,
        themeMode: state.themeMode,
        language: state.language,
        country: state.country,
        volume: state.volume,
        sortBy: state.sortBy,
      }));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [state.favorites, state.history, state.themeColor, state.themeMode, state.language, state.country, state.volume]);

  useEffect(() => {
    if (state.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.themeMode]);

  const setCurrentChannel = (channel: Channel | null) => {
    setState(s => {
      const newState = { ...s, currentChannel: channel, isPlaying: !!channel };
      if (channel) {
        const newHistory = s.history.filter(h => h.channelId !== channel.id);
        newHistory.unshift({ channelId: channel.id, timestamp: Date.now() });
        newState.history = newHistory.slice(0, 50); // Keep last 50 items
      }
      return newState;
    });
  };

  const setIsPlaying = (isPlaying: boolean) => setState(s => ({ ...s, isPlaying }));
  
  const toggleFavorite = (channelId: string) => setState(s => ({
    ...s,
    favorites: s.favorites.includes(channelId)
      ? s.favorites.filter(id => id !== channelId)
      : [...s.favorites, channelId]
  }));

  const removeFromHistory = (channelId: string) => {
    setState(s => ({
      ...s,
      history: s.history.filter(h => h.channelId !== channelId)
    }));
  };

  const setSelectedCategory = (category: string | string[] | undefined) => {
    setState(s => ({ ...s, selectedCategory: category }));
  };

  const setFilterQuery = (filterQuery: string) => setState(s => ({ ...s, filterQuery }));
  const setActiveBitrate = (activeBitrate: number | 'all') => setState(s => ({ ...s, activeBitrate }));

  const setSleepTimer = (minutes: number | null) => {
    setState(s => ({
      ...s,
      sleepTimerMinutes: minutes,
      sleepTimerEnd: minutes ? Date.now() + minutes * 60 * 1000 : null
    }));
  };

  // Sleep timer interval effect
  useEffect(() => {
    if (!state.sleepTimerEnd) return;

    const interval = setInterval(() => {
      if (state.sleepTimerEnd && Date.now() >= state.sleepTimerEnd) {
        setState(s => ({
          ...s,
          isPlaying: false,
          sleepTimerMinutes: null,
          sleepTimerEnd: null,
        }));
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.sleepTimerEnd]);

  const clearHistory = () => setState(s => ({ ...s, history: [] }));

  const setThemeColor = (themeColor: ThemeColor) => setState(s => ({ ...s, themeColor }));
  const setThemeMode = (themeMode: ThemeMode) => setState(s => ({ ...s, themeMode }));
  const setLanguage = (language: Language) => setState(s => ({ ...s, language }));
  const setCountry = (country: Country) => setState(s => ({ ...s, country }));
  const setSidebarOpen = (sidebarOpen: boolean) => setState(s => ({ ...s, sidebarOpen }));
  const setVolume = (volume: number) => setState(s => ({ ...s, volume }));
  const setSearchQuery = (searchQuery: string) => setState(s => ({ ...s, searchQuery }));
  
  const setCustomChannels = (channels: Channel[]) => {
    setState(s => ({ ...s, customChannels: channels }));
    localforage.setItem('customM3UChannels', channels).catch(e => console.error('Failed to save custom channels', e));
  };

  const setSortBy = (sortBy: SortOrder) => setState(s => ({ ...s, sortBy }));

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentChannel,
      setIsPlaying,
      toggleFavorite,
      clearHistory,
      removeFromHistory,
      setThemeColor,
      setThemeMode,
      setLanguage,
      setCountry,
      setSidebarOpen,
      setVolume,
      setSearchQuery,
      setCustomChannels,
      setActiveTab,
      setSelectedCategory,
      setFilterQuery,
      setActiveBitrate,
      setSleepTimer,
      setSortBy,
      goBack,
      goForward,
      canGoBack,
      canGoForward,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
