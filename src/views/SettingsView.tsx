import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ThemeColor, Language } from '../types';
import { getThemeBorderClass, getThemeTextClass } from '../utils/theme';
import { t } from '../utils/i18n';
import { Moon, Sun, Palette, Languages, Github, ExternalLink } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { themeColor, setThemeColor, themeMode, setThemeMode, language, setLanguage } = useAppContext();

  const colors: { id: ThemeColor, label: string, hex: string }[] = [
    { id: 'blue', label: t(language, 'settings.blue'), hex: 'bg-blue-600' },
    { id: 'red', label: t(language, 'settings.red'), hex: 'bg-red-600' },
    { id: 'green', label: t(language, 'settings.green'), hex: 'bg-green-600' },
    { id: 'purple', label: t(language, 'settings.purple'), hex: 'bg-purple-600' },
    { id: 'orange', label: t(language, 'settings.orange'), hex: 'bg-orange-600' },
  ];

  const languages: { id: Language, label: string, flag: string }[] = [
    { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">{t(language, 'settings.title')}</h2>
      
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Palette className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(language, 'settings.appearance')}</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t(language, 'settings.themeColorDesc')}</p>
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
          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t(language, 'settings.appearanceMode')}</p>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${themeMode === 'light' ? `${getThemeBorderClass(themeColor)} bg-gray-50 dark:bg-gray-700` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <Sun className={`w-8 h-8 mb-2 ${themeMode === 'light' ? 'text-yellow-500' : 'text-gray-500'}`} />
                <span className="font-medium">{t(language, 'settings.light')}</span>
              </button>

              <button
                onClick={() => setThemeMode('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${themeMode === 'dark' ? `${getThemeBorderClass(themeColor)} bg-gray-50 dark:bg-gray-700` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <Moon className={`w-8 h-8 mb-2 ${themeMode === 'dark' ? 'text-blue-500' : 'text-gray-500'}`} />
                <span className="font-medium">{t(language, 'settings.dark')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Languages className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(language, 'settings.language')}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t(language, 'settings.languageDesc')}</p>
          <div className="flex flex-wrap gap-3">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${language === lang.id ? `${getThemeBorderClass(themeColor)} bg-gray-50 dark:bg-gray-700` : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className={language === lang.id ? getThemeTextClass(themeColor) : ''}>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Github className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(language, 'settings.sourceCode')}</h3>
        </div>
        <div className="p-6">
          <a
            href="https://github.com/tbagriyanik/Tvizle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-gray-700 dark:text-gray-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Github className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold truncate">tbagriyanik/Tvizle</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">github.com</p>
              </div>
            </div>
            <ExternalLink size={16} className="flex-shrink-0 text-gray-400" />
          </a>
        </div>
      </section>
    </div>
  );
};

