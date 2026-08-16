import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ThemeColor, Country, Language } from '../types';
import { getThemeBgClass, getThemeBorderClass, getThemeTextClass } from '../utils/theme';
import { t, COUNTRY_LABELS } from '../utils/i18n';
import { Moon, Sun, Palette, Download, Smartphone, CheckCircle2, Globe2, Languages } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { themeColor, setThemeColor, themeMode, setThemeMode, country, setCountry, language, setLanguage } = useAppContext();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // Check if app is already installed/running as standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setInstalledSuccessfully(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalledSuccessfully(true);
    }
    setDeferredPrompt(null);
  };

  const colors: { id: ThemeColor, label: string, hex: string }[] = [
    { id: 'blue', label: t(language, 'settings.blue'), hex: 'bg-blue-600' },
    { id: 'red', label: t(language, 'settings.red'), hex: 'bg-red-600' },
    { id: 'green', label: t(language, 'settings.green'), hex: 'bg-green-600' },
    { id: 'purple', label: t(language, 'settings.purple'), hex: 'bg-purple-600' },
    { id: 'orange', label: t(language, 'settings.orange'), hex: 'bg-orange-600' },
  ];

  const countries: { id: Country, flag: string, label: string }[] = [
    { id: 'all', flag: '🌍', label: COUNTRY_LABELS.all[language] },
    { id: 'tr', flag: '🇹🇷', label: COUNTRY_LABELS.tr[language] },
    { id: 'us', flag: '🇺🇸', label: COUNTRY_LABELS.us[language] },
    { id: 'de', flag: '🇩🇪', label: COUNTRY_LABELS.de[language] },
    { id: 'fr', flag: '🇫🇷', label: COUNTRY_LABELS.fr[language] },
    { id: 'gb', flag: '🇬🇧', label: COUNTRY_LABELS.gb[language] },
    { id: 'qa', flag: '🇶🇦', label: COUNTRY_LABELS.qa[language] },
  ];

  const languages: { id: Language, label: string, flag: string }[] = [
    { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">{t(language, 'settings.title')}</h2>
      
      {/* PWA App Installation Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(language, 'settings.pwaTitle')}</h3>
          </div>
          {isStandalone && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={14} /> {t(language, 'settings.installed')}
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {t(language, 'settings.pwaDesc')}
          </p>

          {isStandalone || installedSuccessfully ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm">
                {t(language, 'settings.installedOk')}
              </p>
            </div>
          ) : deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-md hover:opacity-90 transition-all ${getThemeBgClass(themeColor)} active:scale-98`}
            >
              <Download size={18} />
              <span>{t(language, 'settings.installNow')}</span>
            </button>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t(language, 'settings.howToInstall')}
              </h4>
              <div className="space-y-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Android / Chrome:</span>
                  <span>{t(language, 'settings.installAndroid')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">iPhone / iPad (Safari):</span>
                  <span>{t(language, 'settings.installIos')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

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
          <Globe2 className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(language, 'settings.country')}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t(language, 'settings.countryDesc')}</p>
          <div className="flex flex-wrap gap-3">
            {countries.map(c => (
              <button
                key={c.id}
                onClick={() => setCountry(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${country === c.id ? `${getThemeBorderClass(themeColor)} bg-gray-50 dark:bg-gray-700` : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className={country === c.id ? getThemeTextClass(themeColor) : ''}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

