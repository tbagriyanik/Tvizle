export type MediaType = 'tv' | 'radio';

export interface Channel {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  logo: string;
  category: string;
}

export interface HistoryItem {
  channelId: string;
  timestamp: number;
}

export type ThemeColor = 'blue' | 'red' | 'green' | 'purple' | 'orange';
export type ThemeMode = 'light' | 'dark';

export interface AppState {
  currentChannel: Channel | null;
  isPlaying: boolean;
  favorites: string[];
  history: HistoryItem[];
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  volume: number;
  searchQuery: string;
  customChannels: Channel[];
  activeTab: string;
  navHistory: string[];
  historyIndex: number;
}
