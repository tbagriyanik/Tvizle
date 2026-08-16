import React from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { mockChannels } from '../data';
import { useAppContext } from '../context/AppContext';
import { Play, Sparkles, Radio, Tv } from 'lucide-react';
import { getThemeBgClass } from '../utils/theme';
import { getChannelBrand } from '../utils/channelLogos';

export const HomeView: React.FC = () => {
  const { currentChannel, setCurrentChannel, themeColor } = useAppContext();
  const featured = mockChannels[0]; // TRT 1 as flagship featured channel
  const featuredBrand = featured ? getChannelBrand(featured.id, featured.name, featured.type) : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {!currentChannel && featured && (
        <section 
          className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[24/8] group shadow-2xl border border-white/10"
          style={{ background: featuredBrand?.gradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          {/* Ambient Lighting & Blur Effects */}
          <div 
            className="absolute -right-10 -top-10 w-96 h-96 rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ background: featuredBrand?.accentColor || '#ef4444' }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent flex flex-col justify-end p-6 md:p-10 z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-red-400/30">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Canlı Yayın</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md border border-white/10">
                HD 1080p
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md border border-white/10">
                {featured.category}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">
              {featured.name}
            </h2>
            <p className="text-gray-300 max-w-xl mb-6 text-sm md:text-base hidden sm:block leading-relaxed drop-shadow">
              Ulusal yayınları, dizileri, haber bültenlerini ve canlı spor karşılaşmalarını kesintisiz ve yüksek kalitede izleyin.
            </p>

            <div>
              <button 
                onClick={() => setCurrentChannel(featured)}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-white font-bold text-sm md:text-base shadow-xl hover:scale-105 transition-all duration-300 ${getThemeBgClass(themeColor)}`}
              >
                <Play size={20} fill="currentColor" />
                <span>Hemen İzle</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Popular TV Channels */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
              <Tv size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Popüler TV Kanalları</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">En çok izlenen canlı televizyon kanalları</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockChannels.filter(c => c.type === 'tv').slice(0, 8).map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>

      {/* Trending Radios */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
              <Radio size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Trend Radyolar</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Canlı radyo istasyonları ve müzik akışları</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockChannels.filter(c => c.type === 'radio').slice(0, 8).map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </section>
    </div>
  );
};
