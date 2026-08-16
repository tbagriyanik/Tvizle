import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

interface AudioVisualizerProps {
  isPlaying: boolean;
  volume: number;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

// A single shared Web Audio graph reused for the app's lifetime.
// We tap the audio via captureStream() (a read-only tap) and do NOT reroute the
// element through the graph, so playback is never affected or silenced.
let sharedCtx: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
let connectedSource: MediaStreamAudioSourceNode | null = null;
let connectedStream: MediaStream | null = null;
let connectedElement: HTMLMediaElement | null = null;

const getSharedAnalyser = (): AnalyserNode | null => {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx || !sharedAnalyser) {
    try {
      const AC: typeof AudioContext =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      sharedCtx = new AC();
      sharedAnalyser = sharedCtx.createAnalyser();
      sharedAnalyser.fftSize = 256;
      sharedAnalyser.smoothingTimeConstant = 0.7;
      // NOTE: intentionally NOT connected to destination (no audio rerouting)
    } catch (_) {
      return null;
    }
  }
  return sharedAnalyser;
};

const connectElement = (el: HTMLMediaElement) => {
  if (!sharedCtx || !sharedAnalyser) return;
  if (connectedElement === el) return;
  if (connectedSource) {
    try {
      connectedSource.disconnect();
    } catch (_) {
      /* ignore */
    }
    connectedSource = null;
  }
  if (connectedStream) {
    try {
      connectedStream.getTracks().forEach((t) => t.stop());
    } catch (_) {
      /* ignore */
    }
    connectedStream = null;
  }
  try {
    const captureStream = (el as HTMLMediaElement & { captureStream?: () => MediaStream }).captureStream;
    if (typeof captureStream !== 'function') {
      connectedElement = null;
      return;
    }
    connectedStream = captureStream.call(el);
    connectedSource = sharedCtx.createMediaStreamSource(connectedStream);
    connectedSource.connect(sharedAnalyser);
    connectedElement = el;
  } catch (_) {
    connectedElement = null;
  }
};

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, volume, audioRef }) => {
  const { themeColor } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    const numBars = 42;
    const barWidth = 5;
    const spacing = 3;
    
    // Wave heights state for organic momentum
    const heights = new Array(numBars).fill(4);
    const targetHeights = new Array(numBars).fill(4);

    const freqData = new Uint8Array(128);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 300;
      canvas.height = canvas.parentElement.clientHeight || 80;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Resume the shared AudioContext on the first user gesture so the analyser
    // actually receives real frequency data (autoplay policy keeps it suspended
    // otherwise).
    const resumeOnGesture = () => {
      if (sharedCtx && sharedCtx.state === 'suspended') {
        sharedCtx.resume().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', resumeOnGesture);
    window.addEventListener('keydown', resumeOnGesture);
    window.addEventListener('touchstart', resumeOnGesture);
    resumeOnGesture();
    
    const draw = () => {
      if (!ctx || !canvas) return;

      // Build/reuse the shared graph and (re)connect the current audio element.
      const analyser = getSharedAnalyser();
      const el = audioRef?.current;
      if (analyser && el) {
        connectElement(el);
        if (sharedCtx && sharedCtx.state === 'suspended') {
          sharedCtx.resume().catch(() => {});
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const totalWidth = (numBars * barWidth) + ((numBars - 1) * spacing);
      const startX = Math.max(0, (width - totalWidth) / 2);
      
      time += isPlaying ? 0.06 : 0.01;

      const hueBases: Record<string, number> = {
        red: 0,
        green: 142,
        blue: 217,
        purple: 271,
        orange: 25,
      };
      const baseHue = hueBases[themeColor] ?? 217;

      const effectiveVol = isPlaying ? Math.max(0.1, volume) : 0.05;

      // Use real frequency data only when the shared graph is live and routed
      // to the current element; otherwise fall back to a calm synthetic wave.
      const useRealData = !!(
        isPlaying &&
        analyser &&
        sharedCtx &&
        connectedElement === audioRef?.current &&
        sharedCtx.state === 'running'
      );

      if (useRealData) {
        analyser!.getByteFrequencyData(freqData);
      }

      for (let i = 0; i < numBars; i++) {
        if (useRealData) {
          // Map bars across the frequency bins, skewing toward lows for a music feel
          const idx = Math.min(freqData.length - 1, Math.floor(Math.pow(i / numBars, 1.4) * (freqData.length * 0.85)));
          const val = freqData[idx] / 255;
          targetHeights[i] = Math.min(1, Math.max(0.05, val * effectiveVol * 1.3));
        } else {
          // Multi-frequency harmonic wave algorithm
          const wave1 = Math.sin(time * 2.2 + i * 0.28);
          const wave2 = Math.cos(time * 1.4 + i * 0.45);
          const wave3 = Math.sin(time * 3.8 + i * 0.15);
          
          const dynamicFactor = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2 + 1) / 2;
          
          if (isPlaying && volume > 0) {
            const jitter = (Math.sin(time * 8 + i * 1.7) + 1) * 0.2;
            targetHeights[i] = Math.min(1, Math.max(0.08, (dynamicFactor + jitter) * effectiveVol));
          } else {
            targetHeights[i] = 0.04;
          }
        }

        // Smooth lerp
        heights[i] += (targetHeights[i] - heights[i]) * 0.18;
        
        const barHeight = Math.max(3, height * heights[i]);
        const x = startX + i * (barWidth + spacing);
        const y = height - barHeight;

        // Multicolor sweep anchored on the theme hue
        const hue = (baseHue + i * 3.2) % 360;
        ctx.fillStyle = `hsla(${hue}, 85%, 62%, 0.85)`;

        // Soft pill-shaped caps
        const radius = barWidth / 2;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, radius);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
      
      animationFrameIdRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', resumeOnGesture);
      window.removeEventListener('keydown', resumeOnGesture);
      window.removeEventListener('touchstart', resumeOnGesture);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, volume, themeColor, audioRef]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none transition-opacity duration-500"
      style={{ opacity: isPlaying ? 0.65 : 0.2 }}
    />
  );
};