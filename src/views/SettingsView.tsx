import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ThemeColor } from '../types';
import { getThemeBgClass, getThemeBorderClass, getThemeTextClass } from '../utils/theme';
import { Moon, Sun, Monitor, Palette, Download, Smartphone, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { themeColor, setThemeColor, themeMode, setThemeMode } = useAppContext();
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
    { id: 'blue', label: 'Mavi', hex: 'bg-blue-600' },
    { id: 'red', label: 'Kırmızı', hex: 'bg-red-600' },
    { id: 'green', label: 'Yeşil', hex: 'bg-green-600' },
    { id: 'purple', label: 'Mor', hex: 'bg-purple-600' },
    { id: 'orange', label: 'Turuncu', hex: 'bg-orange-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Görünüm ve Ayarlar</h2>
      
      {/* PWA App Installation Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Uygulama Olarak Yükle (PWA)</h3>
          </div>
          {isStandalone && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={14} /> Yüklü
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            LiveTVizle'yi telefonunuza, tabletinize veya bilgisayarınıza tam ekran yerel bir uygulama gibi yükleyerek internet tarayıcısı çubuğu olmadan hızlıca kullanabilirsiniz.
          </p>

          {isStandalone || installedSuccessfully ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm">
                LiveTVizle cihazınıza uygulama olarak başarıyla yüklendi ve şu anda tam ekran modunda çalışıyor!
              </p>
            </div>
          ) : deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-md hover:opacity-90 transition-all ${getThemeBgClass(themeColor)} active:scale-98`}
            >
              <Download size={18} />
              <span>LiveTVizle Uygulamasını Şimdi Yükle</span>
            </button>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Nasıl Yüklenir?
              </h4>
              <div className="space-y-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Android / Chrome:</span>
                  <span>Tarayıcı menüsünden (üç nokta) <b>"Uygulamayı Yükle"</b> veya <b>"Ana Ekrana Ekle"</b> seçeneğine dokunun.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">iPhone / iPad (Safari):</span>
                  <span>Paylaş butonuna (<Share2 size={13} className="inline mx-0.5 text-blue-500" />) dokunun ve <b>"Ana Ekrana Ekle"</b> (<PlusSquare size={13} className="inline mx-0.5" />) seçin.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

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

