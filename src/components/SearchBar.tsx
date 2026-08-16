import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeRingClass } from '../utils/theme';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, themeColor } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative mb-6 animate-in fade-in duration-300">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <Search className="h-4 w-4 md:h-5 md:w-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Kanal adı veya kategori ara... (örn: TRT 1, Haber, Kral Pop, Spor)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`block w-full pl-11 pr-24 py-3 md:py-3.5 text-sm md:text-base border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-2xs ${getThemeRingClass(themeColor)}`}
      />

      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Aramayı Temizle"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <span>Ctrl</span>
            <span>+</span>
            <span>K</span>
          </kbd>
        )}
      </div>
    </div>
  );
};
