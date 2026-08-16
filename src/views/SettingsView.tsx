import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ThemeColor } from '../types';
import { getThemeBgClass, getThemeBorderClass } from '../utils/theme';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { themeColor, setThemeColor, themeMode, setThemeMode } = useAppContext();

  const colors: { id: ThemeColor, label: string, hex: string }[] = [
    { id: 'blue', label: 'Mavi', hex: 'bg-blue-600' },
    { id: 'red', label: 'Kırmızı', hex: 'bg-red-600' },
    { id: 'green', label: 'Yeşil', hex: 'bg-green-600' },
    { id: 'purple', label: 'Mor', hex: 'bg-purple-600' },
    { id: 'orange', label: 'Turuncu', hex: 'bg-orange-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Görünüm ve Ayarlar</h2>
      
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Palette className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tema Rengi</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Uygulamanın ana vurgu rengini seçin.</p>
          <div className="flex flex-wrap gap-4">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => setThemeColor(color.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${color.hex} ${themeColor === color.id ? 'ring-4 ring-offset-2 ring-gray-300 dark:ring-gray-600 dark:ring-offset-gray-800 scale-110' : 'hover:scale-105'}`}
                aria-label={color.label}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Monitor className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Görünüm Modu</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${themeMode === 'light' ? `${getThemeBorderClass(themeColor)} bg-gray-50 dark:bg-gray-700` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <Sun className={`w-8 h-8 mb-2 ${themeMode === 'light' ? 'text-yellow-500' : 'text-gray-500'}`} />
              <span className="font-medium">Aydınlık</span>
            </button>
            
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${themeMode === 'dark' ? `${getThemeBorderClass(themeColor)} bg-gray-50 dark:bg-gray-700` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <Moon className={`w-8 h-8 mb-2 ${themeMode === 'dark' ? 'text-blue-500' : 'text-gray-500'}`} />
              <span className="font-medium">Karanlık</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
