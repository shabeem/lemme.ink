'use client';
import { useRef, useEffect } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { useParallaxFrames } from '@/lib/useParallaxFrames';
import { useScrollFrameIndex } from '@/lib/useScrollFrameIndex';
import { renderFrame } from '@/lib/canvasRenderer';

export default function BackgroundScrollLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { frameIndex } = useScrollFrameIndex();
  const { getFrame, isReady } = useParallaxFrames();

  useMotionValueEvent(frameIndex, 'change', async (idx) => {
    if (!canvasRef.current || !isReady) return;
    try {
      const frame = await getFrame(idx);
      renderFrame(canvasRef.current, frame);
    } catch (error) {
      console.error('Failed to render frame:', error);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none will-change-transform"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(17,16,16,0.15) 0%, transparent 25%, transparent 75%, rgba(17,16,16,0.25) 100%)',
        }}
      />
    </div>
  );
}
