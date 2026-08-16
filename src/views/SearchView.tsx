import React from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { useAppContext } from '../context/AppContext';
import { mockChannels } from '../data';
import { Search } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { searchQuery, customChannels } = useAppContext();

  const query = searchQuery.toLowerCase().trim();
  const allChannels = [...mockChannels, ...customChannels];
  const results = allChannels.filter(
    c => c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        "{searchQuery}" için sonuçlar ({results.length})
      </h2>

      {results.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Search className="w-12 h-12 mx-auto text-gray-400 mb-4 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">Aramanızla eşleşen kanal bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(channel => (
            <ChannelCard key={`search-${channel.id}`} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
};
