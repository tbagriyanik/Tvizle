import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X, Tv, Radio, SkipBack, SkipForward, Settings, PictureInPicture, Loader2, AlertCircle, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { mockChannels } from '../data';
import { AudioVisualizer } from './AudioVisualizer';
import { getChannelBrand } from '../utils/channelLogos';

export const Player: React.FC = () => {
  const { currentChannel, isPlaying, setIsPlaying, volume, setVolume, setCurrentChannel, themeColor, customChannels, favorites, toggleFavorite } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [isPip, setIsPip] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Fullscreen Auto-hide Controls State
  const [showFsControls, setShowFsControls] = useState(true);
  const [showFsVolumeSlider, setShowFsVolumeSlider] = useState(false);
  const fsControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const tvContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [qualities, setQualities] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const allChannels = [...mockChannels, ...customChannels];
  const isFavorite = currentChannel ? favorites.includes(currentChannel.id) : false;

  // Favorite-specific vs regular navigation list
  const favoriteChannelsOfType = allChannels.filter(c => favorites.includes(c.id) && c.type === currentChannel?.type);
  const allFavoriteChannels = allChannels.filter(c => favorites.includes(c.id));

  // If current channel is favorited, navigation is strictly constrained within favorites
  const activeList = isFavorite
    ? (favoriteChannelsOfType.length > 0 ? favoriteChannelsOfType : (allFavoriteChannels.length > 0 ? allFavoriteChannels : allChannels.filter(c => c.type === currentChannel?.type)))
    : allChannels.filter(c => c.type === currentChannel?.type);

  const currentIndex = activeList.findIndex(c => c.id === currentChannel?.id);

  const resetFsControlsTimer = () => {
    setShowFsControls(true);
    if (fsControlsTimerRef.current) {
      clearTimeout(fsControlsTimerRef.current);
    }
    fsControlsTimerRef.current = setTimeout(() => {
      setShowFsControls(false);
      setShowFsVolumeSlider(false);
    }, 3500);
  };

  const handlePlayerAreaClick = () => {
    if (isFullscreen) {
      if (showFsControls) {
        setShowFsControls(false);
        setShowFsVolumeSlider(false);
        if (fsControlsTimerRef.current) clearTimeout(fsControlsTimerRef.current);
      } else {
        resetFsControlsTimer();
      }
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      resetFsControlsTimer();
    } else {
      if (fsControlsTimerRef.current) clearTimeout(fsControlsTimerRef.current);
      setShowFsControls(false);
      setShowFsVolumeSlider(false);
    }
    return () => {
      if (fsControlsTimerRef.current) clearTimeout(fsControlsTimerRef.current);
    };
  }, [isFullscreen, currentChannel]);

  const handleNext = () => {
    if (!activeList || activeList.length === 0) return;
    if (currentIndex === -1) {
      setCurrentChannel(activeList[0]);
      return;
    }
    const nextIndex = (currentIndex + 1) % activeList.length;
    setCurrentChannel(activeList[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeList || activeList.length === 0) return;
    if (currentIndex === -1) {
      setCurrentChannel(activeList[activeList.length - 1]);
      return;
    }
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    setCurrentChannel(activeList[prevIndex]);
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (tvContainerRef.current && tvContainerRef.current.requestFullscreen) {
        await tvContainerRef.current.requestFullscreen().catch(err => console.log(err));
      } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
        // Fallback for iOS Safari which only allows fullscreen on the video element itself
        (videoRef.current as any).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen().catch(err => console.log(err));
      } else if (document.fullscreenElement && (document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
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
      
      // Save resolution height or auto
      if (index === -1) {
        localStorage.setItem('tv_quality', 'auto');
      } else if (qualities[index]) {
        localStorage.setItem('tv_quality', qualities[index].height.toString());
      }
    }
    setShowQualityMenu(false);
  };

  // HLS and Native Media Setup
  useEffect(() => {
    if (!currentChannel) return;

    setIsSwitching(true);
    setIsLoading(true);
    setHasError(false);

    const mediaElement = currentChannel.type === 'tv' ? videoRef.current : audioRef.current;
    if (!mediaElement) return;

    setQualities([]);
    setSelectedQuality(-1);
    setShowQualityMenu(false);

    let loadTimeout = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 15000); // 15 seconds timeout

    const handleLoadedOrPlaying = () => {
      clearTimeout(loadTimeout);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      clearTimeout(loadTimeout);
      setHasError(true);
      setIsLoading(false);
    };

    mediaElement.addEventListener('playing', handleLoadedOrPlaying);
    mediaElement.addEventListener('error', handleError);

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
        setQualities(data.levels);
        
        const savedQuality = localStorage.getItem('tv_quality');
        if (savedQuality && savedQuality !== 'auto') {
          const targetHeight = parseInt(savedQuality, 10);
          const matchIndex = data.levels.findIndex(l => l.height === targetHeight);
          if (matchIndex !== -1) {
            hls.currentLevel = matchIndex;
            setSelectedQuality(matchIndex);
          } else {
            setSelectedQuality(hls.autoLevelEnabled ? -1 : hls.currentLevel);
          }
        } else {
          setSelectedQuality(hls.autoLevelEnabled ? -1 : hls.currentLevel);
        }

        setIsSwitching(false);
        if (isPlaying) {
          mediaElement.play().catch(e => {
            console.log("Otomatik oynatma engellendi", e);
            handleLoadedOrPlaying();
          });
        } else {
          handleLoadedOrPlaying();
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              handleError();
              hls.destroy();
              break;
          }
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
        handleLoadedOrPlaying();
        if (isPlaying) {
          mediaElement.play().catch(e => console.log("Otomatik oynatma engellendi", e));
        }
      };
      
      mediaElement.addEventListener('loadedmetadata', playHandler, { once: true });
    }

    return () => {
      clearTimeout(loadTimeout);
      mediaElement.removeEventListener('playing', handleLoadedOrPlaying);
      mediaElement.removeEventListener('error', handleError);
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
      
      {!isTv && <AudioVisualizer isPlaying={isPlaying} volume={volume} audioRef={audioRef} />}

      {/* TV Player Container */}
      {isTv && (
        <div 
          ref={tvContainerRef}
          onMouseMove={isFullscreen ? resetFsControlsTimer : undefined}
          onTouchStart={isFullscreen ? resetFsControlsTimer : undefined}
          onClick={isFullscreen ? handlePlayerAreaClick : undefined}
          className={
            isFullscreen 
              ? `fixed inset-0 z-[100] w-screen h-screen bg-black select-none ${showFsControls ? 'cursor-default' : 'cursor-none'}` 
              : expanded 
                ? "relative w-full h-[calc(100%-80px)] bg-black group" 
                : (isPip 
                    ? "absolute bottom-full right-4 mb-4 w-64 md:w-80 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 z-50 group transition-all duration-300" 
                    : "absolute w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
                  )
          }
        >
          <video
            ref={videoRef}
            className={`w-full h-full object-contain bg-black transition-opacity duration-700 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}
            playsInline
            muted={volume === 0}
          />
          
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 pointer-events-none">
              <Loader2 className={`w-10 h-10 animate-spin ${getThemeTextClass(themeColor)}`} />
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-white p-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-sm md:text-base font-medium">Yayın Hatası</p>
              <p className="text-xs text-gray-400 mt-1">Bu kanala şu an bağlanılamıyor.</p>
            </div>
          )}
          
          {/* Fullscreen Channel Info Header (Top Left - Fades with controls) */}
          {isFullscreen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-6 left-6 md:top-8 md:left-8 z-40 flex items-center gap-3 bg-black/70 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/15 shadow-2xl transition-all duration-300 transform ${
                showFsControls 
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                  CANLI
                </span>
                {isFavorite && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                    <Heart size={10} fill="currentColor" className="text-red-400" />
                    <span>Favori</span>
                  </span>
                )}
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              <h3 className="font-bold text-white text-sm md:text-base tracking-wide drop-shadow truncate max-w-[200px] md:max-w-md">
                {currentChannel.name}
              </h3>
              <span className="text-xs text-white/60 font-medium hidden sm:inline-block">
                • {currentChannel.category}
              </span>
            </div>
          )}

          {/* Fullscreen Right-Side Controls Bar (Favori, Geri, Play/Pause, İleri, Ses, Exit) */}
          {isFullscreen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={resetFsControlsTimer}
              className={`absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-40 flex flex-col items-center gap-3 md:gap-3.5 bg-black/75 backdrop-blur-2xl p-2.5 md:p-3 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.7)] transition-all duration-300 transform ${
                showFsControls 
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 translate-x-8 scale-90 pointer-events-none'
              }`}
            >
              {/* 1. Favori */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(currentChannel.id);
                  resetFsControlsTimer();
                }}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500/25 text-red-500 border border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.45)]' 
                    : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10'
                }`}
                title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'scale-110' : ''} />
              </button>

              {/* 2. Geri (Önceki Kanal) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                  resetFsControlsTimer();
                }}
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-95"
                title={isFavorite ? "Önceki Favori Kanal" : "Önceki Kanal"}
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              {/* 3. Play / Pause (Merkezi Oynatma) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                  resetFsControlsTimer();
                }}
                className={`w-13 h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white ${getThemeBgClass(themeColor)} shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/30`}
                title={isPlaying ? 'Durdur' : 'Oynat'}
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>

              {/* 4. İleri (Sonraki Kanal) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                  resetFsControlsTimer();
                }}
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-95"
                title={isFavorite ? "Sonraki Favori Kanal" : "Sonraki Kanal"}
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              {/* 5. Ses (Aç/Kapa & Açılır Slider) */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFsVolumeSlider(!showFsVolumeSlider);
                    resetFsControlsTimer();
                  }}
                  className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    showFsVolumeSlider || volume === 0
                      ? 'bg-white/25 text-white border border-white/40'
                      : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10'
                  }`}
                  title="Ses Kontrolü"
                >
                  {volume === 0 ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} />}
                </button>

                {/* Popout Volume Slider (Sol tarafa açılır) */}
                {showFsVolumeSlider && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/85 backdrop-blur-2xl px-4 py-3 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3 min-w-[170px] animate-in fade-in zoom-in-95 duration-200 z-50"
                  >
                    <button
                      onClick={() => {
                        setVolume(volume === 0 ? 0.8 : 0);
                        resetFsControlsTimer();
                      }}
                      className="text-white/80 hover:text-white transition-colors"
                      title={volume === 0 ? "Sesi Aç" : "Sesi Kapat"}
                    >
                      {volume === 0 ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        resetFsControlsTimer();
                      }}
                      className="w-24 h-1.5 rounded-lg appearance-none bg-white/20 cursor-pointer accent-white"
                    />
                    <span className="text-xs font-bold text-white/90 w-8 text-right font-mono">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* 6. Exit (Tam Ekrandan Çıkış) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-red-300 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition-all duration-200 active:scale-95"
                title="Tam Ekrandan Çık"
              >
                <Minimize size={20} />
              </button>
            </div>
          )}
          
          {!isFullscreen && expanded ? (
            <>
              <button 
                onClick={() => setExpanded(false)}
                className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
              >
                <X size={20} />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
                title="Tam Ekran"
              >
                <Maximize size={20} />
              </button>
            </>
          ) : !isFullscreen ? (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
              <button 
                onClick={toggleFullscreen}
                className="bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                title="Tam Ekran"
              >
                <Maximize size={20} />
              </button>
              <button 
                onClick={() => setExpanded(true)}
                className={`bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/30 transition-colors`}
                title="Genişlet"
              >
                <Tv size={20} />
              </button>
              <button 
                onClick={() => setIsPip(false)}
                className="bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                title="Mini Oynatıcıyı Kapat"
              >
                <X size={20} />
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Native audio element for Radio to prevent CORS and parsing issues */}
      {!isTv && (
        <audio ref={audioRef} src={currentChannel.url} className="hidden" crossOrigin="anonymous" />
      )}

      {/* Bottom Bar Controls */}
      <div className="h-16 md:h-20 px-3 md:px-6 flex items-center justify-between gap-2">
        {/* Info (Left) */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 md:w-1/3">
          {(() => {
            const brand = getChannelBrand(currentChannel.id, currentChannel.name, currentChannel.type);
            return (
              <div 
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-sm border border-black/10 dark:border-white/10 p-1"
                style={{ background: brand.gradient }}
              >
                {currentChannel.logo ? (
                  <img 
                    src={currentChannel.logo} 
                    alt={currentChannel.name} 
                    className={`w-full h-full object-contain filter drop-shadow ${hasError ? 'opacity-30 grayscale' : ''}`}
                    onError={(e) => {
                      // fallback to hidden so the icon/text shows
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  isTv ? (
                    <Tv className={`w-5 h-5 md:w-6 md:h-6 text-white/90 ${hasError ? 'opacity-40' : ''}`} />
                  ) : (
                    <Radio className={`w-5 h-5 md:w-6 md:h-6 text-white/90 ${hasError ? 'opacity-40' : ''}`} />
                  )
                )}
                
                {isLoading && !hasError && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                )}
                {hasError && (
                  <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            );
          })()}
          <div className="overflow-hidden pr-2">
            <h4 className={`font-semibold text-sm md:text-base truncate ${hasError ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {hasError ? 'Yayın Hatası' : currentChannel.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
              {hasError ? 'Bağlanılamadı' : `${currentChannel.type} • ${currentChannel.category}`}
            </p>
          </div>
        </div>

        {/* Desktop Playback Controls (Center) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
            title={isFavorite ? "Önceki Favori Kanal" : "Önceki Kanal"}
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${getThemeBgClass(themeColor)} hover:opacity-90 transition-opacity`}
            title={isPlaying ? "Durdur" : "Oynat"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={handleNext}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
            title={isFavorite ? "Sonraki Favori Kanal" : "Sonraki Kanal"}
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
              title={isFavorite ? "Önceki Favori Kanal" : "Önceki Kanal"}
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-white ${getThemeBgClass(themeColor)} hover:opacity-90 transition-opacity`}
              title={isPlaying ? "Durdur" : "Oynat"}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5"
              title={isFavorite ? "Sonraki Favori Kanal" : "Sonraki Kanal"}
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
          
          <div className="relative hidden md:block">
            <button 
              onClick={toggleQualityMenu}
              className={`p-2 transition-colors ${qualities.length === 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title="Kalite Ayarları"
              disabled={qualities.length === 0}
            >
              <Settings size={20} />
            </button>
            
            {showQualityMenu && qualities.length > 0 && (
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
                      {q.height ? `${q.height}p` : `Kalite ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                onClick={toggleFullscreen}
                className="hidden md:block text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                title="Tam Ekran"
              >
                <Maximize size={20} />
              </button>

              <button 
                onClick={toggleFullscreen}
                className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                title="Tam Ekran"
              >
                <Maximize size={18} />
              </button>
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

