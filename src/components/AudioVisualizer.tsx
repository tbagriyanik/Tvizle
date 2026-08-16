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

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 300;
      canvas.height = canvas.parentElement.clientHeight || 80;
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
      
      time += isPlaying ? 0.06 : 0.01;
      
      let color = 'rgba(59, 130, 246, 0.75)';
      if (themeColor === 'red') color = 'rgba(239, 68, 68, 0.75)';
      else if (themeColor === 'green') color = 'rgba(34, 197, 94, 0.75)';
      else if (themeColor === 'purple') color = 'rgba(168, 85, 247, 0.75)';
      else if (themeColor === 'orange') color = 'rgba(249, 115, 22, 0.75)';
      
      ctx.fillStyle = color;
      
      const effectiveVol = isPlaying ? Math.max(0.1, volume) : 0.05;

      for (let i = 0; i < numBars; i++) {
        // Multi-frequency harmonic wave algorithm
        const wave1 = Math.sin(time * 2.2 + i * 0.28);
        const wave2 = Math.cos(time * 1.4 + i * 0.45);
        const wave3 = Math.sin(time * 3.8 + i * 0.15);
        
        let dynamicFactor = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2 + 1) / 2;
        
        if (isPlaying && volume > 0) {
          const jitter = (Math.sin(time * 8 + i * 1.7) + 1) * 0.2;
          targetHeights[i] = Math.min(1, Math.max(0.08, (dynamicFactor + jitter) * effectiveVol));
        } else {
          targetHeights[i] = 0.04;
        }

        // Smooth lerp
        heights[i] += (targetHeights[i] - heights[i]) * 0.18;
        
        const barHeight = Math.max(3, height * heights[i]);
        const x = startX + i * (barWidth + spacing);
        const y = height - barHeight;
        
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
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
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, volume, themeColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none transition-opacity duration-500"
      style={{ opacity: isPlaying ? 0.65 : 0.2 }}
    />
  );
};
