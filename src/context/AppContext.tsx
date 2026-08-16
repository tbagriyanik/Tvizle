import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { AppState, Channel, ThemeColor, ThemeMode } from '../types';

interface AppContextType extends AppState {
  setCurrentChannel: (channel: Channel | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleFavorite: (channelId: string) => void;
  clearHistory: () => void;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setVolume: (volume: number) => void;
  setSearchQuery: (query: string) => void;
  setCustomChannels: (channels: Channel[]) => void;
}

const defaultState: AppState = {
  currentChannel: null,
  isPlaying: false,
  favorites: [],
  history: [],
  themeColor: 'blue',
  themeMode: 'dark',
  sidebarOpen: false,
  volume: 0.8,
  searchQuery: '',
  customChannels: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('broadcastAppState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed, isPlaying: false, customChannels: [] }; // Don't auto-play on load, load custom channels async
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Load custom channels from localforage on mount
  useEffect(() => {
    localforage.getItem<Channel[]>('customM3UChannels').then((channels) => {
      if (channels && channels.length > 0) {
        setState(s => ({ ...s, customChannels: channels }));
      }
    }).catch(e => console.error('Failed to load custom channels', e));
  }, []);

  useEffect(() => {
    localStorage.setItem('broadcastAppState', JSON.stringify({
      favorites: state.favorites,
      history: state.history,
      themeColor: state.themeColor,
      themeMode: state.themeMode,
      volume: state.volume,
    }));
  }, [state.favorites, state.history, state.themeColor, state.themeMode, state.volume]);

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

  const clearHistory = () => setState(s => ({ ...s, history: [] }));

  const setThemeColor = (themeColor: ThemeColor) => setState(s => ({ ...s, themeColor }));
  const setThemeMode = (themeMode: ThemeMode) => setState(s => ({ ...s, themeMode }));
  const setSidebarOpen = (sidebarOpen: boolean) => setState(s => ({ ...s, sidebarOpen }));
  const setVolume = (volume: number) => setState(s => ({ ...s, volume }));
  const setSearchQuery = (searchQuery: string) => setState(s => ({ ...s, searchQuery }));
  
  const setCustomChannels = (channels: Channel[]) => {
    setState(s => ({ ...s, customChannels: channels }));
    localforage.setItem('customM3UChannels', channels).catch(e => console.error('Failed to save custom channels', e));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentChannel,
      setIsPlaying,
      toggleFavorite,
      clearHistory,
      setThemeColor,
      setThemeMode,
      setSidebarOpen,
      setVolume,
      setSearchQuery,
      setCustomChannels,
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
