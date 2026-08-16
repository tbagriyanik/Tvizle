import React from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { mockChannels } from '../data';
import { useAppContext } from '../context/AppContext';
import { Play } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { currentChannel } = useAppContext();
  const featured = mockChannels[0]; // Just picking one as featured

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {!currentChannel && featured && (
        <section className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[24/7] bg-gray-900 group">
          {featured.logo && (
            <img src={featured.logo} alt="Featured" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-6 md:p-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider w-max mb-4">
              Canlı
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{featured.name}</h2>
            <p className="text-gray-300 max-w-xl mb-6 hidden md:block">
              Hemen izlemeye başla ve en güncel gelişmeleri takip et.
            </p>
            {/* We could add a button to play here, but ChannelCard does it. Let's just use it as a banner */}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popüler TV Kanalları</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockChannels.filter(c => c.type === 'tv').slice(0, 4).map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trend Radyolar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockChannels.filter(c => c.type === 'radio').slice(0, 4).map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>
    </div>
  );
};
