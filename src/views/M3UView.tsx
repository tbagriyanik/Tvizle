import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { parseM3U } from '../utils/m3uParser';
import { ChannelCard } from '../components/ChannelCard';
import { Upload, Link as LinkIcon, AlertCircle, Trash2, List } from 'lucide-react';
import { getThemeTextClass, getThemeBgClass, getThemeRingClass } from '../utils/theme';

export const M3UView: React.FC = () => {
  const { customChannels, setCustomChannels, themeColor } = useAppContext();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination for large lists
  const [page, setPage] = useState(1);
  const itemsPerPage = 48;
  const totalPages = Math.ceil(customChannels.length / itemsPerPage);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Fetching M3U via URL (note: may fail due to CORS)
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error('Ağ yanıtı başarısız oldu.');
      
      const text = await response.text();
      const parsedChannels = parseM3U(text);
      
      if (parsedChannels.length === 0) {
        throw new Error('Geçerli bir M3U kanalı bulunamadı.');
      }

      setCustomChannels(parsedChannels);
      setUrlInput('');
      setPage(1);
    } catch (err: any) {
      console.error(err);
      setError('M3U dosyası yüklenemedi. (CORS veya geçersiz URL hatası olabilir. Alternatif olarak dosyayı indirebilir ve bilgisayarınızdan yükleyebilirsiniz.)');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedChannels = parseM3U(text);
        
        if (parsedChannels.length === 0) {
          throw new Error('Geçerli bir M3U kanalı bulunamadı.');
        }

        setCustomChannels(parsedChannels);
        setPage(1);
      } catch (err) {
        setError('Dosya okunurken bir hata oluştu veya format desteklenmiyor.');
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setError('Dosya okunurken bir hata oluştu.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Tüm özel kanalları silmek istediğinize emin misiniz?')) {
      setCustomChannels([]);
    }
  };

  const displayedChannels = customChannels.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <List className={getThemeTextClass(themeColor)} size={28} />
          M3U (Özel Kanallar)
        </h2>
        
        {customChannels.length > 0 && (
          <button 
            onClick={handleClear}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={16} />
            Listeyi Temizle
          </button>
        )}
      </div>

      {customChannels.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-4">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${getThemeBgClass(themeColor)}/10`}>
              <Upload className={`w-8 h-8 ${getThemeTextClass(themeColor)}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Kendi Yayınlarınızı Ekleyin</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Uygulamada varsayılan olarak bulunmayan kanalları M3U veya M3U8 formatındaki çalma listelerinizi yükleyerek izleyebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {/* File Upload Option */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Dosya ile Yükle (Önerilen)</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bilgisayarınızdaki veya telefonunuzdaki .m3u dosyasını seçin.
              </p>
              <input 
                type="file" 
                accept=".m3u,.m3u8,text/plain" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-white transition-all ${getThemeBgClass(themeColor)} hover:opacity-90 disabled:opacity-50`}
              >
                <Upload size={20} />
                {loading ? 'Yükleniyor...' : 'M3U Dosyası Seç'}
              </button>
            </div>

            {/* URL Option */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">URL ile Yükle</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                M3U listenizin internet adresini girin (CORS engeline takılabilir).
              </p>
              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://ornek.com/liste.m3u"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${getThemeRingClass(themeColor)}`}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium text-white transition-all ${getThemeBgClass(themeColor)} hover:opacity-90 disabled:opacity-50`}
                >
                  {loading ? '...' : 'Ekle'}
                </button>
              </form>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 max-w-4xl mx-auto">
              <AlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Kanal</p>
              <p className={`text-2xl font-bold ${getThemeTextClass(themeColor)}`}>{customChannels.length}</p>
            </div>
            
            {/* Simple Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Önceki
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sayfa {page} / {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedChannels.map(channel => (
              <ChannelCard key={`m3u-${channel.id}`} channel={channel} />
            ))}
          </div>
          
          {totalPages > 1 && (
             <div className="flex justify-center mt-8">
               <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Önceki Sayfa
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Sonraki Sayfa
                </button>
              </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
