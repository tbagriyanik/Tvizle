import React from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { Channel } from '../types';

interface ListViewProps {
  title: string;
  channels: Channel[];
  emptyMessage?: string;
}

export const ListView: React.FC<ListViewProps> = ({ title, channels, emptyMessage = "Gösterilecek kanal bulunamadı." }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">{title}</h2>
      
      {channels.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {channels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
};
