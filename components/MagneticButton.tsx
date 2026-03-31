'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  threshold?: number;
  maxDisplacement?: number;
  className?: string;
}

export default function MagneticButton({
  children,
  threshold = 80,
  maxDisplacement = 20,
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 150, damping: 18 });
  const y = useSpring(rawY, { stiffness: 150, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < threshold) {
        const factor = (1 - dist / threshold) * maxDisplacement;
        rawX.set((distX / dist) * factor);
        rawY.set((distY / dist) * factor);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const handleMouseLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [rawX, rawY, threshold, maxDisplacement]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
