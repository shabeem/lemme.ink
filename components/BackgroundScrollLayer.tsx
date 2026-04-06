'use client';
import { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 120;
const FRAME_PATH = (i: number) => `/frames/f${String(i).padStart(3, '0')}.jpg`;

export default function BackgroundScrollLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentFrame.current);
    };
    resize();
    window.addEventListener('resize', resize);

    // Preload all frames — show first frame + fade in on load
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          drawFrame(TOTAL_FRAMES - 1);
          // Fade in the canvas
          canvas.animate([{ opacity: 0 }, { opacity: 0.45 }], {
            duration: 5000,
            easing: 'ease-in-out',
            fill: 'forwards',
          });
        }
      };
      frames.current[i - 1] = img;
    }

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const idx = Math.min(TOTAL_FRAMES - 1, Math.floor((1 - progress) * TOTAL_FRAMES));

      if (idx !== currentFrame.current) {
        currentFrame.current = idx;
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => drawFrame(idx));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  function drawFrame(idx: number) {
    const canvas = canvasRef.current;
    const img = frames.current[idx];
    if (!canvas || !img?.complete) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover + center on visual content
    // Circle in source frame is ~35px right of frame center (670 vs 640 in 1280px wide)
    // Shift draw position left by that scaled amount to center visually
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    // X: center on subject (circle is 35px right of frame center)
    const contentOffsetX = 35 * scale;
    const dx = Math.round((cw - dw) / 2 - contentOffsetX);
    // Y: place circle just above the top of the viewport (-5% of screen height)
    // Circle sits at y=465 in the 720px source frame
    const circleSourceY = 465;
    const targetY = 0.38 * ch; // circle visible ~38% from top on load
    const dy = Math.round(targetY - circleSourceY * scale);

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
}
