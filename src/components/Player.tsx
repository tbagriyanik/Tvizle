import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, X, Tv, Radio, SkipBack, SkipForward, Settings, PictureInPicture } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { mockChannels } from '../data';

export const Player: React.FC = () => {
  const { currentChannel, isPlaying, setIsPlaying, volume, setVolume, setCurrentChannel, themeColor, customChannels } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [isPip, setIsPip] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [qualities, setQualities] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const allChannels = [...mockChannels, ...customChannels];
  const activeList = allChannels.filter(c => c.type === currentChannel?.type);
  const currentIndex = activeList.findIndex(c => c.id === currentChannel?.id);

  const handleNext = () => {
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % activeList.length;
    setCurrentChannel(activeList[nextIndex]);
  };

  const handlePrev = () => {
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    setCurrentChannel(activeList[prevIndex]);
  };

  const toggleQualityMenu = () => {
    if (!showQualityMenu && hlsRef.current) {
      setQualities(hlsRef.current.levels || []);
      setSelectedQuality(hlsRef.current.autoLevelEnabled ? -1 : hlsRef.current.currentLevel);
    }
    setShowQualityMenu(!showQualityMenu);
  };

  const changeQuality = (index: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
      setSelectedQuality(index);
    }
    setShowQualityMenu(false);
  };

  // HLS and Native Media Setup
  useEffect(() => {
    if (!currentChannel) return;

    setIsSwitching(true);

    const mediaElement = currentChannel.type === 'tv' ? videoRef.current : audioRef.current;
    if (!mediaElement) return;

    setQualities([]);
    setSelectedQuality(-1);
    setShowQualityMenu(false);

    const isM3u8 = currentChannel.url.includes('.m3u8');

    if (isM3u8 && Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      const hls = new Hls({
        autoStartLoad: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableWorker: true,
      });
      
      hls.loadSource(currentChannel.url);
      hls.attachMedia(mediaElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (currentChannel.type === 'tv') {
          setQualities(data.levels);
          setSelectedQuality(hls.autoLevelEnabled ? -1 : hls.currentLevel);
        }
        setIsSwitching(false);
        if (isPlaying) {
          mediaElement.play().catch(e => console.log("Otomatik oynatma engellendi", e));
        }
      });

      hlsRef.current = hls;
    } else {
      // Native playback (Safari m3u8 or standard mp3/aac streams)
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      mediaElement.src = currentChannel.url;
      mediaElement.load();
      
      const playHandler = () => {
        setIsSwitching(false);
        if (isPlaying) {
          mediaElement.play().catch(e => console.log("Otomatik oynatma engellendi", e));
        }
      };
      
      mediaElement.addEventListener('loadedmetadata', playHandler, { once: true });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentChannel]);

  // Play/Pause sync
  useEffect(() => {
    const mediaElement = currentChannel?.type === 'tv' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.play().catch(e => console.log("Otomatik oynatma engellendi", e));
      } else {
        mediaElement.pause();
      }
    }
  }, [isPlaying, currentChannel]);

  // Volume sync
  useEffect(() => {
    const mediaElement = currentChannel?.type === 'tv' ? videoRef.current : audioRef.current;
    if (!mediaElement) return;

    if (isSwitching) {
      mediaElement.volume = 0;
    } else {
      let currentVol = mediaElement.volume;
      const targetVol = volume;
      if (targetVol === 0) {
        mediaElement.volume = 0;
        mediaElement.muted = true;
        return;
      }
      mediaElement.muted = false;
      const step = 0.05;
      
      const ramp = setInterval(() => {
        if (currentVol < targetVol) {
          currentVol = Math.min(currentVol + step, targetVol);
        } else if (currentVol > targetVol) {
          currentVol = Math.max(currentVol - step, targetVol);
        }
        
        mediaElement.volume = currentVol;
        
        if (currentVol === targetVol) {
          clearInterval(ramp);
        }
      }, 50);
      
      return () => clearInterval(ramp);
    }
  }, [volume, currentChannel, isSwitching]);

  if (!currentChannel) return null;

  const isTv = currentChannel.type === 'tv';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] transition-all duration-300 ${expanded && isTv ? 'h-full md:h-[60vh] md:bottom-4 md:left-auto md:right-4 md:w-[600px] md:rounded-xl md:border' : 'h-20'}`}>
      
      {/* TV Player Container */}
      {isTv && (
        <div className={expanded ? "relative w-full h-[calc(100%-80px)] bg-black" : (isPip ? "absolute bottom-full right-4 mb-4 w-64 md:w-80 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 z-50 group transition-all duration-300" : "absolute w-1 h-1 opacity-0 pointer-events-none overflow-hidden")}>
          <video
            ref={videoRef}
            className={`w-full h-full object-contain bg-black transition-opacity duration-700 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}
            playsInline
            muted={volume === 0}
          />
          {expanded ? (
            <button 
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
            >
              <X size={20} />
            </button>
          ) : (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
               <button 
                onClick={() => setExpanded(true)}
                className={`bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/30 transition-colors`}
                title="Genişlet"
              >
                <Maximize size={20} />
              </button>
              <button 
                onClick={() => setIsPip(false)}
                className="bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                title="Mini Oynatıcıyı Kapat"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Native audio element for Radio to prevent CORS and parsing issues */}
      {!isTv && (
        <audio ref={audioRef} src={currentChannel.url} className="hidden" />
      )}

      {/* Bottom Bar Controls */}
      <div className="h-16 md:h-20 px-3 md:px-6 flex items-center justify-between gap-2">
        {/* Info (Left) */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 md:w-1/3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {currentChannel.logo ? (
              <img src={currentChannel.logo} alt={currentChannel.name} className="w-full h-full object-cover" />
            ) : (
              isTv ? <Tv className={`w-5 h-5 md:w-6 md:h-6 ${getThemeTextClass(themeColor)}`} /> : <Radio className={`w-5 h-5 md:w-6 md:h-6 ${getThemeTextClass(themeColor)}`} />
            )}
          </div>
          <div className="overflow-hidden pr-2">
            <h4 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white truncate">{currentChannel.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">{currentChannel.type} • {currentChannel.category}</p>
          </div>
        </div>

        {/* Desktop Playback Controls (Center) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${getThemeBgClass(themeColor)} hover:opacity-90 transition-opacity`}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={handleNext}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Actions (Right) & Mobile Playback */}
        <div className="flex items-center justify-end gap-1 md:gap-4 flex-shrink-0 md:w-1/3">
          
          {/* Mobile Playback Controls */}
          <div className="flex md:hidden items-center gap-1">
             <button 
              onClick={handlePrev}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-white ${getThemeBgClass(themeColor)} hover:opacity-90 transition-opacity`}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 group">
            <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2">
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min={0} max={1} step={0.01} 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={`hidden md:block w-20 h-1.5 rounded-lg appearance-none bg-gray-200 dark:bg-gray-700 cursor-pointer accent-current ${getThemeTextClass(themeColor)} opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </div>
          
          {isTv && (
            <div className="relative hidden md:block">
              <button 
                onClick={toggleQualityMenu}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                title="Kalite Ayarları"
              >
                <Settings size={20} />
              </button>
              
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="py-1">
                    <button
                      onClick={() => changeQuality(-1)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedQuality === -1 ? getThemeTextClass(themeColor) + ' font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Otomatik
                    </button>
                    {qualities.map((q, index) => (
                      <button
                        key={index}
                        onClick={() => changeQuality(index)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedQuality === index ? getThemeTextClass(themeColor) + ' font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {q.height}p
                      </button>
                    ))}
                    {qualities.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        Seçenek Yok
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isTv && (
            <>
              <button 
                onClick={() => {
                  if (expanded) {
                    setExpanded(false);
                    setIsPip(true);
                  } else {
                    setIsPip(!isPip);
                  }
                }}
                className={`p-2 transition-colors ${isPip && !expanded ? getThemeTextClass(themeColor) : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                title="Mini Oynatıcı (PiP)"
              >
                <PictureInPicture size={20} />
              </button>

              <button 
                onClick={() => {
                  setExpanded(!expanded);
                  if (!expanded) setIsPip(false);
                }}
                className="hidden md:block text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                title={expanded ? "Küçült" : "Genişlet"}
              >
                {expanded ? <X size={20} /> : <Maximize size={20} />}
              </button>

              {!expanded && (
                <button 
                  onClick={() => {
                    setExpanded(true);
                    setIsPip(false);
                  }}
                  className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                  title="Genişlet"
                >
                  <Maximize size={18} />
                </button>
              )}
            </>
          )}
          
          <button 
            onClick={() => setCurrentChannel(null)}
            className="hidden md:block text-gray-400 hover:text-red-500 p-2"
          >
            <X size={20} />
          </button>

          <button 
            onClick={() => expanded ? setExpanded(false) : setCurrentChannel(null)}
            className="md:hidden text-gray-400 hover:text-red-500 p-2 ml-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

