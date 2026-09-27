import React, { useEffect, useRef } from 'react';

interface CanvasScratchMaskProps {
  activeTheme: 'retro' | 'cosmic';
}

export const CanvasScratchMask: React.FC<CanvasScratchMaskProps> = ({ activeTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothRef = useRef({ x: -9999, y: -9999 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const imagesLoadedRef = useRef(false);

  const bottomImgRef = useRef<HTMLImageElement | null>(null);
  const topImgRef = useRef<HTMLImageElement | null>(null);

  // Trigger image loading when theme changes
  useEffect(() => {
    imagesLoadedRef.current = false;
    
    const bottom = new Image();
    const top = new Image();

    if (activeTheme === 'retro') {
      bottom.src = '/images/retro_base.png';
      top.src = '/images/matrix_reveal.png';
    } else {
      bottom.src = '/images/cosmic_base.png';
      top.src = '/images/cyber_reveal.png';
    }

    bottomImgRef.current = bottom;
    topImgRef.current = top;

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        imagesLoadedRef.current = true;
      }
    };
    bottom.onload = onLoad;
    top.onload = onLoad;
  }, [activeTheme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TRAIL_LENGTH = 60;
    const HEAD_RADIUS = 180;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    let rafId: number;

    const draw = () => {
      if (!imagesLoadedRef.current || !bottomImgRef.current || !topImgRef.current) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const { width, height } = canvas;
      const s = smoothRef.current;
      const m = mouseRef.current;

      // Initialize coordinates on first interaction to avoid coordinate jump lines
      if (s.x === -9999) {
        s.x = m.x;
        s.y = m.y;
      } else {
        s.x += (m.x - s.x) * 0.13;
        s.y += (m.y - s.y) * 0.13;
      }

      // Add mouse/touch coordinate to history trail
      if (m.x !== -9999) {
        trailRef.current.unshift({ x: s.x, y: s.y });
        if (trailRef.current.length > TRAIL_LENGTH) {
          trailRef.current.length = TRAIL_LENGTH;
        }
      }

      const trail = trailRef.current;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw bottom base image
      ctx.drawImage(bottomImgRef.current, 0, 0, width, height);

      // 2. Prepare offscreen mask canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');
      
      if (offCtx) {
        // Draw trail circles
        for (let i = 0; i < trail.length; i++) {
          const t = 1 - i / trail.length;
          const r = HEAD_RADIUS * (0.25 + 0.75 * t);
          const alpha = Math.pow(t, 1.5);
          offCtx.beginPath();
          offCtx.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
          offCtx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          offCtx.fill();
        }

        // Draw top reveal image masked inside trail
        offCtx.globalCompositeOperation = 'source-in';
        offCtx.drawImage(topImgRef.current, 0, 0, width, height);

        // Blit offscreen mask back to main canvas
        ctx.drawImage(offscreen, 0, 0);
      }

      // 3. Draw glowing brush head
      if (trail.length > 0) {
        const head = trail[0];
        const glow = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, HEAD_RADIUS * 1.3
        );
        const glowColor = activeTheme === 'retro' 
          ? 'rgba(0, 206, 209, 0.22)'  // Cyan
          : 'rgba(32, 178, 170, 0.22)'; // Teal
        const glowColorMuted = activeTheme === 'retro' 
          ? 'rgba(0, 206, 209, 0.08)' 
          : 'rgba(32, 178, 170, 0.08)';

        glow.addColorStop(0, glowColor);
        glow.addColorStop(0.5, glowColorMuted);
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(head.x, head.y, HEAD_RADIUS * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchmove', onTouchMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [activeTheme]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full select-none overflow-hidden bg-[#030d14]">
      <canvas ref={canvasRef} className="w-full h-full pointer-events-none block" />
    </div>
  );
};
