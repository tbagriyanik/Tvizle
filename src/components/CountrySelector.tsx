import React, { useEffect, useRef, useState } from 'react';
import { Globe2, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { t, COUNTRY_LABELS } from '../utils/i18n';
import { Country } from '../types';

interface CountrySelectorProps {
  variant?: 'header' | 'sidebar';
}

const countryOptions: { id: Country; flag: string; label: Record<string, string> }[] = [
  { id: 'all', flag: '🌍', label: COUNTRY_LABELS.all },
  { id: 'tr', flag: '🇹🇷', label: COUNTRY_LABELS.tr },
  { id: 'us', flag: '🇺🇸', label: COUNTRY_LABELS.us },
  { id: 'de', flag: '🇩🇪', label: COUNTRY_LABELS.de },
  { id: 'fr', flag: '🇫🇷', label: COUNTRY_LABELS.fr },
  { id: 'gb', flag: '🇬🇧', label: COUNTRY_LABELS.gb },
  { id: 'qa', flag: '🇶🇦', label: COUNTRY_LABELS.qa },
  { id: 'it', flag: '🇮🇹', label: COUNTRY_LABELS.it },
  { id: 'es', flag: '🇪🇸', label: COUNTRY_LABELS.es },
  { id: 'nl', flag: '🇳🇱', label: COUNTRY_LABELS.nl },
  { id: 'au', flag: '🇦🇺', label: COUNTRY_LABELS.au },
  { id: 'ca', flag: '🇨🇦', label: COUNTRY_LABELS.ca },
  { id: 'jp', flag: '🇯🇵', label: COUNTRY_LABELS.jp },
  { id: 'ru', flag: '🇷🇺', label: COUNTRY_LABELS.ru },
  { id: 'cn', flag: '🇨🇳', label: COUNTRY_LABELS.cn },
  { id: 'kr', flag: '🇰🇷', label: COUNTRY_LABELS.kr },
  { id: 'pt', flag: '🇵🇹', label: COUNTRY_LABELS.pt },
];

export const CountrySelector: React.FC<CountrySelectorProps> = ({ variant = 'header' }) => {
  const { country, setCountry, language, themeColor } = useAppContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = countryOptions.find(o => o.id === country) || countryOptions[0];

  if (variant === 'sidebar') {
    return (
      <div className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 p-2 rounded-xl border border-gray-200/80 dark:border-gray-700/60">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 pl-1 flex items-center gap-1.5">
          <Globe2 size={13} className={getThemeTextClass(themeColor)} />
          <span>{t(language, 'nav.country')}</span>
        </span>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
            title={t(language, 'nav.country')}
          >
            <span>{current.flag}</span>
            <span className="text-xs font-semibold">{current.label[language]}</span>
          </button>
          {open && (
            <div className="absolute bottom-full mb-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-1.5 max-h-64 overflow-y-auto z-50">
              {countryOptions.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setCountry(o.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    o.id === country
                      ? `${getThemeBgClass(themeColor)} text-white`
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{o.flag}</span>
                  <span className="flex-1 text-left">{o.label[language]}</span>
                  {o.id === country && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // header variant
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        title={t(language, 'nav.country')}
      >
        <span>{current.flag}</span>
        <span className="hidden md:inline">{current.label[language]}</span>
        <Globe2 size={14} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-1.5 max-h-72 overflow-y-auto z-50">
          {countryOptions.map(o => (
            <button
              key={o.id}
              onClick={() => { setCountry(o.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                o.id === country
                  ? `${getThemeBgClass(themeColor)} text-white`
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{o.flag}</span>
              <span className="flex-1 text-left">{o.label[language]}</span>
              {o.id === country && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
