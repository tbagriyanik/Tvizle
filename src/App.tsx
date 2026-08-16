/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { ListView } from './views/ListView';
import { SettingsView } from './views/SettingsView';
import { HistoryView } from './views/HistoryView';
import { SearchView } from './views/SearchView';
import { M3UView } from './views/M3UView';
import { mockChannels } from './data';

const AppContent: React.FC = () => {
  const { favorites, searchQuery, customChannels, activeTab } = useAppContext();

  const allChannels = [...mockChannels, ...customChannels];

  const renderContent = () => {
    if (searchQuery.trim() !== '') {
      return <SearchView />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'tv':
        return <ListView title="TV Kanalları" channels={allChannels.filter(c => c.type === 'tv')} />;
      case 'radio':
        return <ListView title="Radyolar" channels={allChannels.filter(c => c.type === 'radio')} />;
      case 'favorites':
        const favoriteChannels = allChannels.filter(c => favorites.includes(c.id));
        return <ListView title="Favoriler" channels={favoriteChannels} emptyMessage="Henüz favorilere kanal eklemediniz." />;
      case 'history':
        return <HistoryView />;
      case 'm3u':
        return <M3UView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
