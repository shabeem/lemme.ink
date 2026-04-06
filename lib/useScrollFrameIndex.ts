'use client';
import { useScroll, useTransform, useMotionValue } from 'framer-motion';

const TOTAL_FRAMES = 113;

export function useScrollFrameIndex() {
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_FRAMES - 1]
  );

  return { frameIndex, scrollYProgress };
}
