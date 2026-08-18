export type MediaType = 'tv' | 'radio';

export interface Channel {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  logo: string;
  category: string;
  country?: string;
  bitrate?: number;
  resolution?: string;
}

export interface HistoryItem {
  channelId: string;
  timestamp: number;
}

export type ThemeColor = 'blue' | 'red' | 'green' | 'purple' | 'orange';
export type ThemeMode = 'light' | 'dark';
export type Language = 'tr' | 'en';
export type Country = 'all' | 'tr' | 'us' | 'de' | 'fr' | 'gb' | 'qa' | 'it' | 'es' | 'nl' | 'au' | 'ca' | 'jp' | 'ru' | 'cn' | 'kr' | 'pt';
export type SortOrder = 'default' | 'name-asc' | 'name-desc';

export interface AppState {
  currentChannel: Channel | null;
  isPlaying: boolean;
  favorites: string[];
  history: HistoryItem[];
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  language: Language;
  country: Country;
  sidebarOpen: boolean;
  volume: number;
  searchQuery: string;
  customChannels: Channel[];
  activeTab: string;
  navHistory: string[];
  historyIndex: number;
  sortBy: SortOrder;
  selectedCategory?: string;
  sleepTimerMinutes?: number | null;
  sleepTimerEnd?: number | null;
}
