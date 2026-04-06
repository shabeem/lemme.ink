'use client';
import { useEffect, useRef, useState } from 'react';

interface FrameCache {
  [key: number]: HTMLImageElement;
}

const CACHE_SIZE = 12;
const FRAME_PREFIX = '/parallax-frames/frame-';
const TOTAL_FRAMES = 113;

export function useParallaxFrames() {
  const cache = useRef<FrameCache>({});
  const loading = useRef(new Set<number>());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([0, 1, 2].map(i => preloadFrame(i)))
      .then(() => setIsReady(true))
      .catch(console.error);
  }, []);

  const preloadFrame = async (index: number): Promise<HTMLImageElement> => {
    if (index < 0 || index >= TOTAL_FRAMES) {
      return Promise.reject(new Error(`Frame index out of bounds: ${index}`));
    }

    if (cache.current[index]) return cache.current[index];

    if (loading.current.has(index)) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (cache.current[index]) {
            clearInterval(checkInterval);
            resolve(cache.current[index]);
          }
        }, 10);
      });
    }

    loading.current.add(index);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        cache.current[index] = img;
        loading.current.delete(index);

        if (Object.keys(cache.current).length > CACHE_SIZE) {
          const keys = Object.keys(cache.current).map(Number).sort((a, b) => a - b);
          const oldest = keys[0];
          delete cache.current[oldest];
        }
        resolve(img);
      };
      img.onerror = () => {
        loading.current.delete(index);
        reject(new Error(`Failed to load frame ${index}`));
      };
      img.src = `${FRAME_PREFIX}${String(index + 1).padStart(3, '0')}.jpg`;
    });
  };

  const getFrame = async (index: number): Promise<HTMLImageElement> => {
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));

    const prefetch = [clampedIndex - 1, clampedIndex, clampedIndex + 1, clampedIndex + 2]
      .filter(i => i >= 0 && i < TOTAL_FRAMES);

    prefetch.forEach(i => {
      if (!cache.current[i] && !loading.current.has(i)) {
        preloadFrame(i).catch(() => {});
      }
    });

    return preloadFrame(clampedIndex);
  };

  return { getFrame, isReady };
}
