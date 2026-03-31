'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

export default function CursorGlow() {
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);

  // Magnetic ring — lags behind, creating the pull feel
  const ringX = useSpring(rawX, { stiffness: 90, damping: 18, mass: 0.8 });
  const ringY = useSpring(rawY, { stiffness: 90, damping: 18, mass: 0.8 });

  // Small dot — fast but with just enough lag to feel physical
  const dotX = useSpring(rawX, { stiffness: 220, damping: 22, mass: 0.5 });
  const dotY = useSpring(rawY, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden="true">

      {/* Magnetic ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.45)',
          position: 'absolute',
        }}
      />

      {/* Small dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'rgba(201,169,110,0.9)',
          position: 'absolute',
        }}
      />

    </div>
  );
}
