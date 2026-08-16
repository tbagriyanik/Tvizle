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
import { filterChannelsByCountry } from './utils/country';
import { t } from './utils/i18n';

const AppContent: React.FC = () => {
  const { favorites, searchQuery, customChannels, activeTab, country, language } = useAppContext();

  const allChannels = filterChannelsByCountry([...mockChannels, ...customChannels], country);

  const renderContent = () => {
    if (searchQuery.trim() !== '') {
      return <SearchView />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'tv':
        return <ListView title={t(language, 'nav.tv')} channels={allChannels.filter(c => c.type === 'tv')} />;
      case 'radio':
        return <ListView title={t(language, 'nav.radio')} channels={allChannels.filter(c => c.type === 'radio')} />;
      case 'favorites':
        const favoriteChannels = allChannels.filter(c => favorites.includes(c.id));
        return <ListView title={t(language, 'nav.favorites')} channels={favoriteChannels} emptyMessage={t(language, 'list.emptyFav')} />;
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
