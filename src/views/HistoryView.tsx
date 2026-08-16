import React, { useState } from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { useAppContext } from '../context/AppContext';
import { mockChannels } from '../data';
import { Trash2, History, X, Tv, Radio, Clock, Play } from 'lucide-react';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { getChannelBrand } from '../utils/channelLogos';

export const HistoryView: React.FC = () => {
  const { 
    history, 
    clearHistory, 
    removeFromHistory, 
    themeColor, 
    customChannels,
    setActiveTab,
    setCurrentChannel
  } = useAppContext();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const allChannels = [...mockChannels, ...customChannels];

  // Map history items to full channel objects with timestamp preserved
  const historyWithChannels = history
    .map(item => ({
      item,
      channel: allChannels.find(c => c.id === item.channelId)
    }))
    .filter((entry): entry is { item: typeof entry.item; channel: NonNullable<typeof entry.channel> } => entry.channel !== undefined);

  const formatTimeAgo = (timestamp: number): string => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <History className={getThemeTextClass(themeColor)} size={26} />
              <span>İzleme Geçmişi</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {historyWithChannels.length}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Son izlediğiniz TV kanalları ve dinlediğiniz radyo istasyonları
          </p>
        </div>
        
        {historyWithChannels.length > 0 && (
          <button 
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 size={15} />
            <span>Geçmişi Temizle</span>
          </button>
        )}
      </div>
      
      {historyWithChannels.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
          <History className="w-12 h-12 mx-auto text-gray-400 opacity-40" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Geçmişiniz Boş</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
            Henüz bir kanal izlemediniz. Canlı yayınları keşfetmek için TV veya Radyo sayfasına göz atın.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('tv')}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white ${getThemeBgClass(themeColor)} hover:opacity-90`}
            >
              <Tv size={14} />
              <span>TV Kanallarını Keşfet</span>
            </button>
            <button
              onClick={() => setActiveTab('radio')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Radio size={14} />
              <span>Radyoları Dinle</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {historyWithChannels.map(({ item, channel }) => (
            <div key={`history-card-${channel.id}`} className="relative group">
              <ChannelCard channel={channel} />
              
              {/* Overlay with timestamp and delete individual item button */}
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-md text-[10px] text-white/90 font-medium backdrop-blur-xs">
                <Clock size={11} className="text-amber-400" />
                <span>{formatTimeAgo(item.timestamp)}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(channel.id);
                }}
                className="absolute top-2 right-12 z-30 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white/80 hover:text-white transition-colors"
                title="Geçmişten Kaldır"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Geçmişi Temizle</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tüm izleme ve dinleme geçmişinizi silmek istediğinize emin misiniz?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
              >
                Evet, Temizle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
