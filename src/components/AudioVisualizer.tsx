import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

interface AudioVisualizerProps {
  isPlaying: boolean;
  volume: number;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, volume, audioRef }) => {
  const { themeColor } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Create references for Audio API nodes to avoid re-creating them
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isSetupRef = useRef<boolean>(false);

  useEffect(() => {
    // We only set this up once there's a valid audioRef and it is playing.
    if (!audioRef || !audioRef.current) return;
    
    const audioElement = audioRef.current;
    
    const setupAudio = () => {
      if (isSetupRef.current) return;
      
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        
        const source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        isSetupRef.current = true;
      } catch (err) {
        console.error("AudioContext setup failed:", err);
      }
    };

    audioElement.addEventListener('play', setupAudio);
    
    if (isPlaying) {
      setupAudio();
    }
    
    return () => {
      audioElement.removeEventListener('play', setupAudio);
    };
  }, [audioRef, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    
    const numBars = 40;
    const barWidth = 6;
    const spacing = 3;
    const dataArray = analyserRef.current 
      ? new Uint8Array(analyserRef.current.frequencyBinCount) 
      : new Uint8Array(numBars);
    
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 80;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const draw = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const totalWidth = (numBars * barWidth) + ((numBars - 1) * spacing);
      const startX = Math.max(0, (width - totalWidth) / 2);
      
      time += isPlaying ? 0.08 : 0.01;
      
      let color = 'rgba(59, 130, 246, 0.7)';
      if (themeColor === 'red') color = 'rgba(239, 68, 68, 0.7)';
      else if (themeColor === 'green') color = 'rgba(34, 197, 94, 0.7)';
      else if (themeColor === 'purple') color = 'rgba(168, 85, 247, 0.7)';
      else if (themeColor === 'orange') color = 'rgba(249, 115, 22, 0.7)';
      
      ctx.fillStyle = color;
      
      let useRealData = false;
      if (analyserRef.current && isPlaying && volume > 0) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const hasData = dataArray.some(val => val > 0);
        useRealData = hasData;
      }
      
      for (let i = 0; i < numBars; i++) {
        let normalizedHeight = 0;
        
        if (useRealData) {
          const dataIndex = Math.floor(i * (128 / numBars) * 0.7); 
          const value = dataArray[dataIndex] || 0;
          normalizedHeight = (value / 255) * volume;
          normalizedHeight = normalizedHeight * 0.9 + (Math.sin(time * 1.5 + i * 0.3) * 0.5 + 0.5) * 0.1 * volume;
        } else {
          let noise = Math.sin(time * 1.5 + i * 0.3) * 0.5 + 0.5;
          if (isPlaying && volume > 0) {
            noise += Math.random() * 0.8;
          } else {
            noise *= 0.1;
          }
          const targetVolume = isPlaying ? Math.max(0.05, volume) : 0.05;
          normalizedHeight = Math.min(1, noise * targetVolume * 0.8);
        }
        
        const barHeight = Math.max(4, height * normalizedHeight);
        const x = startX + i * (barWidth + spacing);
        const y = height - barHeight;
        
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
            ctx.fill();
        } else {
            ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, volume, themeColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none transition-opacity duration-500"
      style={{ opacity: isPlaying ? 0.6 : 0.2 }}
    />
  );
};
