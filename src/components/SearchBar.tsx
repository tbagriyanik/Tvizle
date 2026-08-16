import React, { useRef, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeRingClass } from '../utils/theme';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, themeColor, goBack, goForward, canGoBack, canGoForward } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 animate-in fade-in duration-300">
      {/* Navigation History Controls (Geri & İleri) */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`p-2 md:p-2.5 rounded-xl transition-all ${
            canGoBack
              ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 cursor-pointer'
              : 'text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-40'
          }`}
          title={canGoBack ? "Geri Dön (Alt + Sol Ok)" : "Geri Dönülecek Sayfa Yok"}
          aria-label="Geri Dön"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className={`p-2 md:p-2.5 rounded-xl transition-all ${
            canGoForward
              ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 cursor-pointer'
              : 'text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-40'
          }`}
          title={canGoForward ? "İleri Git (Alt + Sağ Ok)" : "İleri Gidilecek Sayfa Yok"}
          aria-label="İleri Git"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Kanal adı veya kategori ara... (Kısayol: Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`block w-full pl-12 pr-10 py-3 md:py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${getThemeRingClass(themeColor)}`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Aramayı Temizle"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
