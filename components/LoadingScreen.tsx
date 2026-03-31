'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
  isVisible: boolean;
}

export default function LoadingScreen({ onComplete, isVisible }: LoadingScreenProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const progressWidth = useTransform(count, [0, 100], ['0%', '100%']);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;

    const controls = animate(count, 100, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        // Brief pause at 100 before exit
        setTimeout(onComplete, 300);
      },
    });

    return () => controls.stop();
  }, [isVisible, count, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex flex-col"
          style={{ background: '#111010' }}
          aria-label="Loading"
          aria-live="polite"
        >
          {/* Top-left label */}
          <div className="absolute top-8 left-8 md:top-10 md:left-12">
            <span
              className="text-[10px] tracking-[0.4em] uppercase text-[#71717a]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Loading
            </span>
          </div>

          {/* Top-right studio name */}
          <div className="absolute top-8 right-8 md:top-10 md:right-12">
            <span
              className="text-[10px] tracking-[0.4em] uppercase text-[#3f3f46]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              LEMME INK
            </span>
          </div>

          {/* Center percentage */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <motion.span
                className="block tabular-nums leading-none text-[#f5f0eb]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(120px, 22vw, 260px)',
                  fontWeight: 400,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                <motion.span>{rounded}</motion.span>
              </motion.span>
              <span
                className="absolute -top-2 -right-6 md:-right-8 text-[#c9a96e]"
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: 'clamp(14px, 2vw, 22px)',
                  letterSpacing: '0.05em',
                }}
              >
                %
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="px-8 md:px-12 pb-8 md:pb-10 flex items-end justify-between">
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-[#3f3f46]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Permanent Art
            </span>

            {/* Progress line */}
            <div className="hidden md:block flex-1 mx-12 h-px bg-[#1c1c1c] relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#c9a96e]/50"
                style={{ width: progressWidth }}
              />
            </div>

            <span
              className="text-[10px] tracking-[0.3em] uppercase text-[#3f3f46]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Est. MMXVII
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
