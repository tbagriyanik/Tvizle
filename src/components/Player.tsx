import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  X, 
  Tv, 
  Radio, 
  SkipBack, 
  SkipForward, 
  Settings, 
  PictureInPicture, 
  Loader2, 
  AlertCircle, 
  Heart, 
  RotateCcw, 
  RotateCw, 
  Timer, 
  RefreshCw, 
  Check 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getThemeBgClass, getThemeTextClass } from '../utils/theme';
import { mockChannels } from '../data';
import { AudioVisualizer } from './AudioVisualizer';
import { getChannelBrand } from '../utils/channelLogos';
import { t } from '../utils/i18n';
import { Channel } from '../types';
import { getYouTubeVideoId } from '../utils/youtube';
import { isEditableTarget } from '../utils/keys';

export const Player: React.FC = () => {
  const { 
    currentChannel, 
    isPlaying, 
    setIsPlaying, 
    volume, 
    setVolume, 
    setCurrentChannel, 
    themeColor, 
    customChannels, 
    favorites, 
    toggleFavorite,
    sleepTimerMinutes,
    sleepTimerEnd,
    setSleepTimer,
    language,
    sortBy,
    selectedCategory,
    filterQuery,
    activeBitrate
  } = useAppContext();

  const [expanded, setExpanded] = useState(false);
  const [isPip, setIsPip] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Time-shifting / DVR states
  const [seekableRange, setSeekableRange] = useState<{ start: number; end: number; duration: number }>({ start: 0, end: 0, duration: 0 });
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLiveEdge, setIsLiveEdge] = useState<boolean>(true);
  const [timeBehindLive, setTimeBehindLive] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Fullscreen Auto-hide Controls State
  const [showFsControls, setShowFsControls] = useState(true);
  const [showFsVolumeSlider, setShowFsVolumeSlider] = useState(false);
  const fsControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sleep timer UI menu
  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);
  const [sleepRemainingText, setSleepRemainingText] = useState<string | null>(null);

  const tvContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);


  // Draggable mini player & expand panel positions
  const [miniPos, setMiniPos] = useState<{ x: number; y: number } | null>(null);
  const [expandedPos, setExpandedPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ type: 'mini' | 'expanded'; startX: number; startY: number; startPos: { x: number; y: number } } | null>(null);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>, type: 'mini' | 'expanded') => {
    if (isFullscreen) return;
    if (type === 'expanded' && !window.matchMedia('(min-width: 768px)').matches) return;
    e.preventDefault();
    const rect = tvContainerRef.current?.getBoundingClientRect();
    const currentPos = type === 'mini'
      ? (miniPos ?? { x: rect?.left ?? 0, y: rect?.top ?? 0 })
      : (expandedPos ?? { x: rect?.left ?? 0, y: rect?.top ?? 0 });
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      // Threshold so a simple click on a button/video still fires, but a real drag takes over.
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      const np = { x: currentPos.x + dx, y: currentPos.y + dy };
      if (type === 'mini') setMiniPos(np);
      else setExpandedPos(np);
    };

    const suppressClick = (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      window.removeEventListener('click', suppressClick, true);
    };

    const onUp = () => {
      // If a drag actually happened, swallow the ensuing click so buttons/video
      // don't also fire after the panel was moved.
      if (moved) {
        window.addEventListener('click', suppressClick, true);
      }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Resizable mini player & expand panel sizes
  const [miniSize, setMiniSize] = useState<{ w: number; h: number }>({ w: 256, h: 144 });
  const [expandedSize, setExpandedSize] = useState<{ w: number; h: number }>({ w: 600, h: 0 });
  const resizeRef = useRef<{ type: 'mini' | 'expanded'; startX: number; startY: number; startSize: { w: number; h: number } } | null>(null);

  const startResize = (e: React.PointerEvent<HTMLDivElement>, type: 'mini' | 'expanded') => {
    if (isFullscreen) return;
    if (type === 'expanded' && !window.matchMedia('(min-width: 768px)').matches) return;
    e.preventDefault();
    e.stopPropagation();
    const startSize = type === 'mini' ? miniSize : expandedSize;
    resizeRef.current = { type, startX: e.clientX, startY: e.clientY, startSize };

    const onMove = (ev: PointerEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      const minW = r.type === 'mini' ? 160 : 320;
      const minH = r.type === 'mini' ? 90 : 200;
      const nw = Math.max(minW, r.startSize.w + (ev.clientX - r.startX));
      const nh = Math.max(minH, r.startSize.h + (ev.clientY - r.startY));
      if (r.type === 'mini') setMiniSize({ w: nw, h: nh });
      else setExpandedSize({ w: nw, h: nh });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      resizeRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Persist mini/expand panel position & size
  const skipPersistRef = useRef(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('playerLayout');
      if (raw) {
        const p = JSON.parse(raw);
        if (p.miniPos) setMiniPos(p.miniPos);
        if (p.miniSize) setMiniSize(p.miniSize);
        if (p.expandedPos) setExpandedPos(p.expandedPos);
        if (p.expandedSize) setExpandedSize(p.expandedSize);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip the very first save so we don't overwrite the loaded values with defaults.
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    try {
      localStorage.setItem('playerLayout', JSON.stringify({ miniPos, miniSize, expandedPos, expandedSize }));
    } catch (_) {}
  }, [miniPos, miniSize, expandedPos, expandedSize]);
  
  const [qualities, setQualities] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const allChannels = [...mockChannels, ...customChannels];
  const isFavorite = currentChannel ? favorites.includes(currentChannel.id) : false;

  // Active channel navigation list
  const favoriteChannelsOfType = allChannels.filter(c => favorites.includes(c.id) && c.type === currentChannel?.type);
  const allFavoriteChannels = allChannels.filter(c => favorites.includes(c.id));

  const sortChannels = (list: Channel[], activeBitrate: number | 'all'): Channel[] => {
    // Mirrors ListView sorting: bitrate filter sorts low -> high, otherwise name sort.
    if (activeBitrate !== 'all') {
      return [...list].sort((a, b) => (a.bitrate ?? 0) - (b.bitrate ?? 0));
    }
    if (sortBy === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }
    if (sortBy === 'name-desc') {
      return [...list].sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    }
    // Default order: bring national (Ulusal) TV channels to the front.
    return [...list].sort((a, b) => {
      const aNat = a.type === 'tv' && a.category === 'Ulusal' ? 0 : 1;
      const bNat = b.type === 'tv' && b.category === 'Ulusal' ? 0 : 1;
      return aNat - bNat;
    });
  };

  // Build the active navigation list using the SAME filters/sort as the list
  // view, so prev/next matches what the user currently sees.
  const activeList = sortChannels(
    (() => {
      let list = isFavorite
        ? (favoriteChannelsOfType.length > 0 ? favoriteChannelsOfType : (allFavoriteChannels.length > 0 ? allFavoriteChannels : allChannels.filter(c => c.type === currentChannel?.type)))
        : allChannels.filter(c => c.type === currentChannel?.type);

      if (selectedCategory) {
        if (Array.isArray(selectedCategory)) {
          list = list.filter(c => selectedCategory.includes(c.category));
        } else {
          list = list.filter(c => c.category === selectedCategory);
        }
      }
      if (activeBitrate !== 'all') {
        list = list.filter(c => c.type === 'radio' && c.bitrate === activeBitrate);
      }
      const q = filterQuery.trim().toLowerCase();
      if (q) {
        list = list.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      }
      return list;
    })(),
    activeBitrate
  );

  const currentIndex = activeList.findIndex(c => c.id === currentChannel?.id);

  // Sleep timer remaining text updater
  useEffect(() => {
    if (!sleepTimerEnd) {
      setSleepRemainingText(null);
      return;
    }

    const updateRemaining = () => {
      const diff = Math.max(0, Math.floor((sleepTimerEnd - Date.now()) / 1000));
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setSleepRemainingText(`${mins}:${secs.toString().padStart(2, '0')}`);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerEnd]);

  const resetFsControlsTimer = () => {
    setShowFsControls(true);
    if (fsControlsTimerRef.current) {
      clearTimeout(fsControlsTimerRef.current);
    }
    fsControlsTimerRef.current = setTimeout(() => {
      setShowFsControls(false);
      setShowFsVolumeSlider(false);
    }, 4000);
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
      
      try {
        if (index === -1) {
          localStorage.setItem('tv_quality', 'auto');
        } else if (qualities[index]) {
          localStorage.setItem('tv_quality', qualities[index].height.toString());
        }
      } catch (e) {
        // Safe fallback if localStorage is disabled
      }
    }
    setShowQualityMenu(false);
  };

  // Time Shifting / Seek Handlers
  const getMediaElement = (): HTMLVideoElement | HTMLAudioElement | null => {
    return currentChannel?.type === 'tv' ? videoRef.current : audioRef.current;
  };

  const seekRelative = (seconds: number) => {
    const media = getMediaElement();
    if (!media) return;

    try {
      const current = media.currentTime;
      let target = current + seconds;

      if (media.seekable && media.seekable.length > 0) {
        const start = media.seekable.start(0);
        const end = media.seekable.end(media.seekable.length - 1);
        target = Math.max(start, Math.min(target, end));
      }

      media.currentTime = target;
      if (isFullscreen) resetFsControlsTimer();
    } catch (e) {
      console.warn("Seek operation failed:", e);
    }
  };

  const jumpToLive = () => {
    const media = getMediaElement();
    if (!media) return;

    try {
      if (hlsRef.current && hlsRef.current.liveSyncPosition) {
        media.currentTime = hlsRef.current.liveSyncPosition;
      } else if (media.seekable && media.seekable.length > 0) {
        media.currentTime = Math.max(0, media.seekable.end(media.seekable.length - 1) - 0.5);
      }
    } catch (e) {
      console.warn("Jump to live failed:", e);
    }

    setIsLiveEdge(true);
    setTimeBehindLive(0);
    if (!isPlaying) {
      setIsPlaying(true);
      media.play().catch(e => console.log(e));
    }
    if (isFullscreen) resetFsControlsTimer();
  };

  const handleSeekChange = (newPos: number) => {
    const media = getMediaElement();
    if (!media) return;
    try {
      media.currentTime = newPos;
      setCurrentTime(newPos);
    } catch (e) {
      console.warn("Seek change failed:", e);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e)) return;

      if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setVolume(volume === 0 ? 0.8 : 0);
      } else if (e.key.toLowerCase() === 'f' && currentChannel?.type === 'tv') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        seekRelative(-10);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'l') {
        e.preventDefault();
        seekRelative(10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolume(Math.min(1, Math.round((volume + 0.05) * 100) / 100));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolume(Math.max(0, Math.round((volume - 0.05) * 100) / 100));
      } else if (e.key === '[') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ']') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, currentChannel, currentIndex, activeList, isFullscreen]);

  // Time update listener for DVR time shifting
  useEffect(() => {
    const media = currentChannel?.type === 'tv' ? videoRef.current : audioRef.current;
    if (!media) return;

    const updateTime = () => {
      if (isScrubbing) return;
      const cur = media.currentTime;
      if (Number.isFinite(cur)) {
        setCurrentTime(cur);
      }

      if (media.seekable && media.seekable.length > 0) {
        try {
          const start = media.seekable.start(0);
          const end = media.seekable.end(media.seekable.length - 1);
          if (Number.isFinite(start) && Number.isFinite(end) && end >= start && end > 0) {
            const duration = end - start;
            setSeekableRange({ start, end, duration });

            if (Number.isFinite(cur)) {
              const behind = Math.max(0, end - cur);
              if (Number.isFinite(behind)) {
                setTimeBehindLive(behind);
                setIsLiveEdge(behind < 6);
              } else {
                setIsLiveEdge(true);
                setTimeBehindLive(0);
              }
            }
          } else {
            setIsLiveEdge(true);
            setTimeBehindLive(0);
          }
        } catch {
          setIsLiveEdge(true);
          setTimeBehindLive(0);
        }
      } else {
        setIsLiveEdge(true);
        setTimeBehindLive(0);
      }
    };

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('progress', updateTime);

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('progress', updateTime);
    };
  }, [currentChannel, isScrubbing]);

  const formatBehindTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || isNaN(seconds) || seconds <= 5) return 'CANLI';
    const safeSecs = Math.min(7200, Math.max(0, Math.floor(seconds)));
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `-${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reload Stream / Retry
  const reloadStream = () => {
    if (!currentChannel) return;
    const ch = currentChannel;
    setCurrentChannel(null);
    setTimeout(() => {
      setCurrentChannel(ch);
      setIsPlaying(true);
    }, 150);
  };

  // HLS and Native Media Setup
  useEffect(() => {
    if (!currentChannel) return;

    setIsSwitching(true);
    setIsLoading(true);
    setHasError(false);
    setSeekableRange({ start: 0, end: 0, duration: 0 });
    setIsLiveEdge(true);
    setTimeBehindLive(0);

    setQualities([]);
    setSelectedQuality(-1);
    setShowQualityMenu(false);

    const ytId = getYouTubeVideoId(currentChannel.url);
    if (ytId) {
      let cancelled = false;
      const loadTimeout = setTimeout(() => {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }, 15000);

      const createPlayer = () => {
        if (cancelled || !ytContainerRef.current) return;
        if (ytPlayerRef.current) {
          try { ytPlayerRef.current.destroy(); } catch (_) {}
          ytPlayerRef.current = null;
        }
        ytContainerRef.current.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        ytContainerRef.current.appendChild(placeholder);
        try {
          ytPlayerRef.current = new (window as any).YT.Player(placeholder, {
            videoId: ytId,
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              playsinline: 1,
              controls: 0,
              rel: 0,
              iv_load_policy: 3,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              mute: 1,
            },
            events: {
              onReady: (e: any) => {
                if (cancelled) return;
                clearTimeout(loadTimeout);
                setIsSwitching(false);
                setIsLoading(false);
                setHasError(false);
                try {
                  if (e.target && typeof e.target.setVolume === 'function') {
                    e.target.setVolume(Math.round((isPlaying ? volume : 0) * 100));
                  }
                  if (e.target && typeof e.target.unMute === 'function') e.target.unMute();
                  if (isPlaying && e.target && typeof e.target.playVideo === 'function') e.target.playVideo();
                } catch (_) {}
              },
              onError: () => {
                if (cancelled) return;
                clearTimeout(loadTimeout);
                setHasError(true);
                setIsLoading(false);
              },
              onStateChange: (e: any) => {
                if (cancelled) return;
                if (e.data === 1) {
                  clearTimeout(loadTimeout);
                  setIsLoading(false);
                  setHasError(false);
                }
              },
            },
          });
        } catch (err) {
          if (!cancelled) {
            setHasError(true);
            setIsLoading(false);
          }
        }
      };

      const ensureApiReady = () => {
        if ((window as any).YT && (window as any).YT.Player) {
          createPlayer();
        } else {
          (window as any).__ytPendingCreate = createPlayer;
          if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            (window as any).onYouTubeIframeAPIReady = () => {
              if (typeof (window as any).__ytPendingCreate === 'function') {
                (window as any).__ytPendingCreate();
              }
            };
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
          }
        }
      };

      ensureApiReady();

      return () => {
        cancelled = true;
        clearTimeout(loadTimeout);
        if (ytPlayerRef.current) {
          try { ytPlayerRef.current.destroy(); } catch (_) {}
          ytPlayerRef.current = null;
        }
      };
    }

    const mediaElement = currentChannel.type === 'tv' ? videoRef.current : audioRef.current;
    if (!mediaElement) return;

    const isM3u8 = currentChannel.url.includes('.m3u8');

    let loadTimeout = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 15000);

    // Load direct streams in CORS mode so the analyser can capture real
    // frequency data. Some servers don't send CORS headers, so retry once
    // without CORS on failure (bars then fall back to a synthetic wave).
    let didRetryCors = false;
    if (currentChannel.type === 'radio' && !isM3u8) {
      mediaElement.crossOrigin = 'anonymous';
    }

    const handleLoadedOrPlaying = () => {
      clearTimeout(loadTimeout);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      clearTimeout(loadTimeout);
      if (!didRetryCors && currentChannel.type === 'radio' && !isM3u8) {
        didRetryCors = true;
        mediaElement.removeAttribute('crossorigin');
        mediaElement.src = currentChannel.url;
        mediaElement.load();
        return;
      }
      setHasError(true);
      setIsLoading(false);
    };

    mediaElement.addEventListener('playing', handleLoadedOrPlaying);
    mediaElement.addEventListener('error', handleError);

    if (isM3u8 && Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      const hls = new Hls({
        autoStartLoad: true,
        lowLatencyMode: true,
        backBufferLength: 1200,
        liveSyncDurationCount: 3,
        maxBufferLength: 60,
        maxMaxBufferLength: 600,
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
    const ytId = currentChannel ? getYouTubeVideoId(currentChannel.url) : null;
    if (ytId) {
      const p = ytPlayerRef.current;
      if (p) {
        try {
          if (isPlaying) p.playVideo();
          else p.pauseVideo();
        } catch (_) {}
      }
      return;
    }
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
    const ytId = currentChannel ? getYouTubeVideoId(currentChannel.url) : null;
    if (ytId) {
      const p = ytPlayerRef.current;
      if (p && typeof p.setVolume === 'function') {
        try {
          p.setVolume(Math.round(volume * 100));
          if (volume > 0 && typeof p.unMute === 'function') p.unMute();
        } catch (_) {}
      }
      return;
    }
    const mediaElement = currentChannel?.type === 'tv' ? videoRef.current : audioRef.current;
    if (!mediaElement) return;

    if (isSwitching || isLoading) {
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
        
        // Strict boundary clamp to prevent DOMException / IndexSizeError
        mediaElement.volume = Math.max(0, Math.min(1, currentVol));
        
        if (Math.abs(currentVol - targetVol) < 0.01) {
          mediaElement.volume = Math.max(0, Math.min(1, targetVol));
          clearInterval(ramp);
        }
      }, 50);
      
      return () => clearInterval(ramp);
    }
  }, [volume, currentChannel, isSwitching, isLoading]);

  if (!currentChannel) return null;

  const isTv = currentChannel.type === 'tv';
  const ytVideoId = getYouTubeVideoId(currentChannel.url);
  const isVideo = isTv || !!ytVideoId;
  const hasTimeShift = seekableRange.duration > 15;
  const isDesktopView = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 shadow-xl ${expanded && isVideo ? 'h-full md:h-[60vh] md:rounded-2xl md:border' : 'h-20 md:h-22'}`}
      style={expanded && isVideo ? {
        top: expandedPos?.y,
        left: expandedPos?.x,
        bottom: expandedPos ? 'auto' : undefined,
        right: expandedPos ? 'auto' : undefined,
        ...(isDesktopView ? { width: expandedSize.w, height: expandedSize.h > 0 ? expandedSize.h : undefined } : {}),
      } : undefined}
    >
      {/* Resize handle for the expand panel */}
      {expanded && isVideo && !isFullscreen && isDesktopView && (
        <div
          onPointerDown={(e) => { e.stopPropagation(); startResize(e, 'expanded'); }}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-[60] touch-none"
          title="Resize"
        >
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 dark:border-gray-500 rounded-br" />
        </div>
      )}
      
      {!isVideo && !hasError && <AudioVisualizer isPlaying={isPlaying} volume={volume} audioRef={audioRef} />}

      {/* TV Player Container */}
      {isVideo && (
        <div 
          ref={tvContainerRef}
          onMouseMove={isFullscreen ? resetFsControlsTimer : undefined}
          onTouchStart={isFullscreen ? resetFsControlsTimer : undefined}
          onClick={isFullscreen ? handlePlayerAreaClick : undefined}
          onPointerDown={(e) => {
            if (isFullscreen) return;
            if (expanded && isVideo) startDrag(e, 'expanded');
            else if (isPip) startDrag(e, 'mini');
          }}
          style={isPip && !expanded ? { top: miniPos?.y, left: miniPos?.x, width: miniSize.w, height: miniSize.h } : undefined}
          className={
            isFullscreen 
              ? `fixed inset-0 z-[100] w-screen h-screen bg-black select-none ${showFsControls ? 'cursor-default' : 'cursor-none'}` 
              : expanded 
                ? "relative w-full h-[calc(100%-85px)] bg-black group" 
                : (isPip 
                    ? `${miniPos ? 'fixed' : 'absolute bottom-full right-4 mb-4'} bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 z-50 group cursor-grab active:cursor-grabbing touch-none` 
                    : "absolute w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
                  )
          }
        >
          {/* Resize handle for the mini player */}
          {isPip && !expanded && (
            <div
              onPointerDown={(e) => { e.stopPropagation(); startResize(e, 'mini'); }}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30 touch-none"
            >
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white/60 rounded-br" />
            </div>
          )}
          {ytVideoId ? (
            <div
              ref={ytContainerRef}
              key={currentChannel.id}
              className="w-full h-full bg-black"
            />
          ) : (
            <video
              ref={videoRef}
              className={`w-full h-full object-contain bg-black ${isSwitching ? 'opacity-0' : 'opacity-100'}`}
              playsInline
              muted={volume === 0}
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
            />
          )}
          
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 pointer-events-none">
              <Loader2 className={`w-10 h-10 animate-spin ${getThemeTextClass(themeColor)}`} />
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-white p-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-sm md:text-base font-bold">{t(language, 'player.connectionError')}</p>
              <p className="text-xs text-gray-400 mt-1 mb-3">{t(language, 'player.unavailable')}</p>
              <button
                onClick={reloadStream}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold text-white"
              >
                <RefreshCw size={13} />
                <span>{t(language, 'player.retry')}</span>
              </button>
            </div>
          )}
          
          {/* Fullscreen Channel Info Header (Top Left) */}
          {isFullscreen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-6 left-6 md:top-8 md:left-8 z-40 flex items-center gap-2.5 bg-black/70 px-3.5 py-2 rounded-xl border border-white/15 shadow-xl ${
                showFsControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <button
                  onClick={jumpToLive}
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1 cursor-pointer ${
                    isLiveEdge 
                      ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-red-500/30'
                  }`}
                  title={isLiveEdge ? t(language, 'player.liveNow') : t(language, 'player.backToLive')}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveEdge ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <span>{isLiveEdge || !Number.isFinite(timeBehindLive) || timeBehindLive <= 5 ? t(language, 'player.liveAbbrev') : `${t(language, 'player.backToLiveAbbrev')} (${formatBehindTime(timeBehindLive)})`}</span>
                </button>

                {isFavorite && (
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                    <Heart size={9} fill="currentColor" className="text-red-400" />
                    <span>{t(language, 'player.favorite')}</span>
                  </span>
                )}
              </div>
              <div className="h-3.5 w-[1px] bg-white/20" />
              <h3 className="font-bold text-white text-xs md:text-sm tracking-wide truncate max-w-[180px] md:max-w-md">
                {currentChannel.name}
              </h3>
              <span className="text-[11px] text-white/60 font-medium hidden sm:inline-block">
                • {currentChannel.category}
              </span>
            </div>
          )}

          {/* Fullscreen Bottom Time-Shift / DVR Bar */}
          {isFullscreen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-6 left-6 right-24 md:left-12 md:right-28 z-40 bg-black/75 px-3.5 py-2.5 rounded-xl border border-white/15 backdrop-blur-md flex flex-col gap-2 ${
                showFsControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2.5 w-full">
                <button
                  onClick={() => seekRelative(-10)}
                  className="text-white/80 hover:text-white flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
                  title={t(language, 'player.rewind10')}
                >
                  <RotateCcw size={12} />
                  <span>10s</span>
                </button>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={Number.isFinite(seekableRange.start) ? seekableRange.start : 0}
                    max={Number.isFinite(seekableRange.end) && seekableRange.end > (seekableRange.start || 0) ? seekableRange.end : 1}
                    step={1}
                    value={Number.isFinite(currentTime) ? currentTime : 0}
                    onMouseDown={() => setIsScrubbing(true)}
                    onMouseUp={() => setIsScrubbing(false)}
                    onTouchStart={() => setIsScrubbing(true)}
                    onTouchEnd={() => setIsScrubbing(false)}
                    onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none bg-white/20 cursor-pointer accent-red-500"
                  />
                </div>

                <button
                  onClick={() => seekRelative(10)}
                  disabled={isLiveEdge}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${
                    isLiveEdge ? 'opacity-40 cursor-not-allowed bg-white/5 text-white/50' : 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20'
                  }`}
                  title={t(language, 'player.forward10')}
                >
                  <span>10s</span>
                  <RotateCw size={12} />
                </button>

                <button
                  onClick={jumpToLive}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isLiveEdge 
                      ? 'bg-red-600/30 text-red-400 border border-red-500/30' 
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-md animate-pulse'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>{isLiveEdge ? t(language, 'player.liveAbbrev') : t(language, 'player.backToLiveAbbrev')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Fullscreen Right-Side Controls Bar */}
          {isFullscreen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={resetFsControlsTimer}
              className={`absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-40 flex flex-col items-center gap-3 bg-black/75 p-2.5 md:p-3 rounded-2xl border border-white/20 shadow-2xl ${
                showFsControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(currentChannel.id);
                  resetFsControlsTimer();
                }}
                className={`btn-3d-glass w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                  isFavorite 
                    ? 'bg-red-500/25 text-red-500' 
                    : 'bg-white/10 text-white/80 hover:text-white'
                }`}
                title={isFavorite ? t(language, 'list.removeFav') : t(language, 'list.addFav')}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                  resetFsControlsTimer();
                }}
                className="btn-3d-glass w-11 h-11 md:w-12 md:h-12 rounded-xl text-white/80 hover:text-white flex items-center justify-center"
                title={isFavorite ? t(language, 'player.prevFav') : t(language, 'player.prev')}
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                  resetFsControlsTimer();
                }}
                className={`btn-3d btn-3d-theme w-13 h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white ${getThemeBgClass(themeColor)}`}
                title={isPlaying ? t(language, 'player.stop') : t(language, 'player.play')}
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                  resetFsControlsTimer();
                }}
                className="btn-3d-glass w-11 h-11 md:w-12 md:h-12 rounded-xl text-white/80 hover:text-white flex items-center justify-center"
                title={isFavorite ? t(language, 'player.nextFav') : t(language, 'player.next')}
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFsVolumeSlider(!showFsVolumeSlider);
                    resetFsControlsTimer();
                  }}
                  className={`btn-3d-glass w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                    showFsVolumeSlider || volume === 0
                      ? 'bg-white/25 text-white'
                      : 'bg-white/10 text-white/80 hover:text-white'
                  }`}
                  title={t(language, 'player.volume')}
                >
                  {volume === 0 ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} />}
                </button>

                {showFsVolumeSlider && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/85 px-4 py-3 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3 min-w-[170px] z-50"
                  >
                    <button
                      onClick={() => {
                        setVolume(volume === 0 ? 0.8 : 0);
                        resetFsControlsTimer();
                      }}
                      className="text-white/80 hover:text-white"
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

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleQualityMenu();
                    resetFsControlsTimer();
                  }}
                  className={`btn-3d-glass w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                    showQualityMenu
                      ? 'bg-white/25 text-white'
                      : 'bg-white/10 text-white/80 hover:text-white'
                  } ${qualities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={t(language, 'player.quality')}
                  disabled={qualities.length === 0}
                >
                  <Settings size={20} />
                </button>

                {showQualityMenu && qualities.length > 0 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/85 px-1 py-2 rounded-xl border border-white/20 shadow-2xl flex flex-col gap-0.5 w-40 z-50"
                  >
                    <button
                      onClick={() => {
                        changeQuality(-1);
                        resetFsControlsTimer();
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs text-white/80 hover:bg-white/10 ${
                        selectedQuality === -1 ? getThemeTextClass(themeColor) + ' font-bold' : ''
                      }`}
                    >
                      {t(language, 'player.autoQuality')}
                    </button>
                    {qualities.map((q, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          changeQuality(index);
                          resetFsControlsTimer();
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs text-white/80 hover:bg-white/10 ${
                          selectedQuality === index ? getThemeTextClass(themeColor) + ' font-bold' : ''
                        }`}
                      >
                        {q.height ? `${q.height}p` : `${t(language, 'player.quality')} ${index + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="btn-3d-glass w-11 h-11 md:w-12 md:h-12 rounded-xl text-white/80 hover:text-red-300 flex items-center justify-center"
                title={t(language, 'player.exitFullscreen')}
              >
                <Minimize size={20} />
              </button>
            </div>
          )}
          
          {!isFullscreen && expanded ? (
            <>
              <button 
                onClick={() => setExpanded(false)}
                className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 z-10"
              >
                <X size={20} />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 z-10"
                title={t(language, 'player.fullscreen')}
              >
                <Maximize size={20} />
              </button>
            </>
          ) : !isFullscreen ? (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 z-10 transition-opacity">
              <button 
                onClick={toggleFullscreen}
                className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30"
                title={t(language, 'player.fullscreen')}
              >
                <Maximize size={20} />
              </button>
              <button 
                onClick={() => setExpanded(true)}
                className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30"
                title={t(language, 'player.expand')}
              >
                <Tv size={20} />
              </button>
              <button 
                onClick={() => setIsPip(false)}
                className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30"
                title={t(language, 'player.closeMini')}
              >
                <X size={20} />
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Native audio element for Radio */}
      {!isVideo && (
        <audio ref={audioRef} src={currentChannel.url} className="hidden" />
      )}

      {/* Top DVR / Time-Shifting Mini Bar for Bottom Player */}
      {hasTimeShift && !isFullscreen && (
        <div className="h-4 bg-gray-100 dark:bg-gray-800/80 px-4 md:px-6 flex items-center gap-2.5 border-b border-gray-200 dark:border-gray-700/50">
          <button
            onClick={() => seekRelative(-10)}
            className="text-[9px] text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-0.5"
            title={t(language, 'player.rewind10s')}
          >
            <RotateCcw size={9} />
            <span>-10s</span>
          </button>
          
          <input
            type="range"
            min={Number.isFinite(seekableRange.start) ? seekableRange.start : 0}
            max={Number.isFinite(seekableRange.end) && seekableRange.end > (seekableRange.start || 0) ? seekableRange.end : 1}
            step={1}
            value={Number.isFinite(currentTime) ? currentTime : 0}
            onMouseDown={() => setIsScrubbing(true)}
            onMouseUp={() => setIsScrubbing(false)}
            onTouchStart={() => setIsScrubbing(true)}
            onTouchEnd={() => setIsScrubbing(false)}
            onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
            className="flex-1 h-1 rounded appearance-none bg-gray-300 dark:bg-gray-700 cursor-pointer accent-red-500"
          />

          <button
            onClick={() => seekRelative(10)}
            disabled={isLiveEdge}
            className={`text-[9px] flex items-center gap-0.5 ${
              isLiveEdge ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            title={t(language, 'player.forward10s')}
          >
            <span>+10s</span>
            <RotateCw size={9} />
          </button>

          <button
            onClick={jumpToLive}
            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded flex items-center gap-1 ${
              isLiveEdge 
                ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                : 'bg-red-600 text-white animate-pulse'
            }`}
            title={isLiveEdge ? t(language, 'player.liveStream') : t(language, 'player.backToLive')}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>{isLiveEdge || !Number.isFinite(timeBehindLive) || timeBehindLive <= 5 ? t(language, 'player.liveAbbrev') : `${t(language, 'player.backToLiveAbbrev')} (${formatBehindTime(timeBehindLive)})`}</span>
          </button>
        </div>
      )}

      {/* Bottom Bar Controls */}
      <div className="h-16 md:h-18 px-3 md:px-6 flex items-center justify-between gap-2 mt-auto">
        
        {/* Info (Left) */}
        <div className="flex items-center gap-2.5 md:gap-4 flex-1 min-w-0 md:w-1/3">
          {(() => {
            const brand = getChannelBrand(currentChannel.id, currentChannel.name, currentChannel.type);
            return (
              <div 
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-xs border border-black/10 dark:border-white/10 p-1 cursor-pointer"
                style={{ background: brand.gradient }}
                onClick={() => isVideo && setExpanded(!expanded)}
                title={t(language, 'player.changeView')}
              >
                {currentChannel.logo ? (
                  <img 
                    src={currentChannel.logo} 
                    alt={currentChannel.name} 
                    className={`w-full h-full object-contain filter drop-shadow ${hasError ? 'opacity-30 grayscale' : ''}`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  isTv ? (
                    <Tv className={`w-5 h-5 text-white/90 ${hasError ? 'opacity-40' : ''}`} />
                  ) : (
                    <Radio className={`w-5 h-5 text-white/90 ${hasError ? 'opacity-40' : ''}`} />
                  )
                )}
                
                {isLoading && !hasError && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                )}
                {hasError && (
                  <div className="absolute inset-0 bg-red-600/70 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })()}

          <div className="overflow-hidden pr-2 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className={`font-bold text-xs md:text-sm truncate ${hasError ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {hasError ? t(language, 'player.streamError') : currentChannel.name}
              </h4>
              <button
                onClick={() => toggleFavorite(currentChannel.id)}
                className={`p-1 rounded-md text-xs ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                title={isFavorite ? t(language, 'list.removeFav') : t(language, 'list.addFav')}
              >
                <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${hasError ? 'bg-red-500' : isLiveEdge ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize truncate">
                {hasError ? (
                  <span className="cursor-pointer underline text-red-400" onClick={reloadStream}>{t(language, 'player.retry')}</span>
                ) : isLiveEdge || !Number.isFinite(timeBehindLive) || timeBehindLive <= 5 ? (
                  `${currentChannel.type === 'tv' ? t(language, 'player.liveTv') : t(language, 'player.liveRadio')} • ${currentChannel.category}`
                ) : (
                  `${t(language, 'player.delay')}: ${formatBehindTime(timeBehindLive)}`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Playback Controls (Center) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-2">
          <button 
            onClick={() => seekRelative(-10)}
            className="btn-3d text-gray-600 dark:text-gray-300 p-2 rounded-lg"
            title={t(language, 'player.rewind10')}
          >
            <RotateCcw size={17} />
          </button>

          <button 
            onClick={handlePrev}
            className="btn-3d text-gray-600 dark:text-gray-300 p-2 rounded-lg"
            title={isFavorite ? t(language, 'player.prevFav') : t(language, 'player.prev')}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn-3d btn-3d-theme w-10 h-10 flex items-center justify-center rounded-xl text-white ${getThemeBgClass(themeColor)}`}
            title={isPlaying ? t(language, 'player.stopSpace') : t(language, 'player.playSpace')}
          >
            {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="ml-0.5" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="btn-3d text-gray-600 dark:text-gray-300 p-2 rounded-lg"
            title={isFavorite ? t(language, 'player.nextFav') : t(language, 'player.next')}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          <button 
            onClick={() => seekRelative(10)}
            disabled={isLiveEdge}
            className={`btn-3d p-2 rounded-lg ${isLiveEdge ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-60' : 'text-gray-600 dark:text-gray-300'}`}
            title={t(language, 'player.forward10')}
          >
            <RotateCw size={17} />
          </button>
        </div>

        {/* Actions (Right) & Mobile Playback */}
        <div className="flex items-center justify-end gap-1 md:gap-2 flex-shrink-0">
          
          {/* Mobile Playback Controls */}
          <div className="flex md:hidden items-center gap-1">
             <button 
              onClick={handlePrev}
              className="btn-3d text-gray-600 dark:text-gray-300 p-1.5 rounded-lg"
              title={t(language, 'player.prev')}
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`btn-3d btn-3d-theme w-8 h-8 flex items-center justify-center rounded-xl text-white ${getThemeBgClass(themeColor)}`}
              title={isPlaying ? "Durdur" : "Oynat"}
            >
              {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={handleNext}
              className="btn-3d text-gray-600 dark:text-gray-300 p-1.5 rounded-lg"
              title={t(language, 'player.next')}
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-1.5">
            <button 
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)} 
              className="btn-3d text-gray-600 dark:text-gray-300 p-1.5 rounded-lg"
              title={volume === 0 ? t(language, 'player.unmuteM') : t(language, 'player.muteM')}
            >
              {volume === 0 ? <VolumeX size={18} className="text-red-500" /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min={0} max={1} step={0.01} 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={`w-18 h-1.5 rounded-lg appearance-none bg-gray-200 dark:bg-gray-700 cursor-pointer accent-current ${getThemeTextClass(themeColor)}`}
            />
          </div>

          {/* Sleep Timer Menu */}
          <div className="relative">
            <button
              onClick={() => setShowSleepTimerMenu(!showSleepTimerMenu)}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold ${
                sleepTimerEnd 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-inner' 
                  : 'btn-3d text-gray-600 dark:text-gray-300'
              }`}
              title={t(language, 'player.sleepTimer')}
            >
              <Timer size={17} className={sleepTimerEnd ? 'text-blue-500 animate-pulse' : ''} />
              {sleepRemainingText && (
                <span className="hidden sm:inline font-mono text-[10px]">{sleepRemainingText}</span>
              )}
            </button>

            {showSleepTimerMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 p-1.5 space-y-0.5">
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700/50">
                  {t(language, 'player.sleepTimerTitle')}
                </div>
                {[
                  { label: t(language, 'player.off'), val: null },
                  { label: `15 ${t(language, 'player.minutes')}`, val: 15 },
                  { label: `30 ${t(language, 'player.minutes')}`, val: 30 },
                  { label: `45 ${t(language, 'player.minutes')}`, val: 45 },
                  { label: `60 ${t(language, 'player.minutes')}`, val: 60 },
                  { label: `90 ${t(language, 'player.minutes')}`, val: 90 },
                ].map(opt => {
                  const isCur = sleepTimerMinutes === opt.val;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setSleepTimer(opt.val);
                        setShowSleepTimerMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isCur 
                          ? `${getThemeTextClass(themeColor)} font-bold bg-gray-100 dark:bg-gray-700` 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isCur && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Quality menu */}
          <div className="relative hidden sm:block">
            <button 
              onClick={toggleQualityMenu}
              className={`p-1.5 rounded-lg ${qualities.length === 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'btn-3d text-gray-600 dark:text-gray-300'}`}
              title={t(language, 'player.quality')}
              disabled={qualities.length === 0}
            >
              <Settings size={18} />
            </button>
            
            {showQualityMenu && qualities.length > 0 && (
              <div className="absolute bottom-full right-0 mb-2 w-32 bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 p-1">
                <button
                  onClick={() => changeQuality(-1)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${selectedQuality === -1 ? getThemeTextClass(themeColor) + ' font-bold bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {t(language, 'player.autoQuality')}
                </button>
                {qualities.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => changeQuality(index)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${selectedQuality === index ? getThemeTextClass(themeColor) + ' font-bold bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {q.height ? `${q.height}p` : `${t(language, 'player.quality')} ${index + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TV Specific buttons */}
          {isVideo && (
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
                className={`btn-3d p-1.5 rounded-lg ${isPip && !expanded ? getThemeTextClass(themeColor) : 'text-gray-600 dark:text-gray-300'}`}
                title={t(language, 'player.pip')}
              >
                <PictureInPicture size={18} />
              </button>

              <button 
                onClick={toggleFullscreen}
                className="btn-3d text-gray-600 dark:text-gray-300 p-1.5 rounded-lg"
                title={t(language, 'player.fullscreenF')}
              >
                <Maximize size={18} />
              </button>
            </>
          )}
          
          <button 
            onClick={() => setCurrentChannel(null)}
            className="btn-3d text-gray-500 hover:text-red-500 dark:text-gray-300 p-1.5 rounded-lg transition-colors"
            title={t(language, 'player.closePlayer')}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
