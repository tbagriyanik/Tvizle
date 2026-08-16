import React from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { useAppContext } from '../context/AppContext';
import { mockChannels } from '../data';
import { Trash2, History } from 'lucide-react';
import { getThemeTextClass } from '../utils/theme';

export const HistoryView: React.FC = () => {
  const { history, clearHistory, themeColor, customChannels } = useAppContext();
  
  const allChannels = [...mockChannels, ...customChannels];

  // Map history items to full channel objects, preserving history order
  const historyChannels = history
    .map(item => allChannels.find(c => c.id === item.channelId))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <History className={getThemeTextClass(themeColor)} size={28} />
          İzleme Geçmişi
        </h2>
        
        {historyChannels.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={16} />
            Geçmişi Temizle
          </button>
        )}
      </div>
      
      {historyChannels.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">Geçmişte izlediğiniz bir kanal bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {historyChannels.map(channel => (
            <ChannelCard key={`history-${channel.id}`} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
};
