'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function VideoSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax: video moves up slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(280px, 50vw, 620px)' }}
    >
      {/* Parallax video container */}
      <motion.div
        style={{ y }}
        className="absolute inset-[-10%] w-full"
      >
        <video
          src="/tattoomachinevideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </motion.div>

      {/* Dark overlay for transparency effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, #111010 0%, transparent 18%, transparent 82%, #111010 100%)',
        }}
      />
      {/* Subtle tint over video */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(17,16,16,0.45)' }}
      />
    </div>
  );
}
