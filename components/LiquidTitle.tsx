'use client';

import { motion, useAnimate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

const WORD1 = 'LEMME';
const WORD2 = 'INK';

const letterVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      delay: i * 0.055,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

function Letter({ char, index, total }: { char: string; index: number; total: number }) {
  return (
    <span className="inline-block overflow-hidden" aria-hidden="true">
      <motion.span
        className="inline-block"
        variants={letterVariants}
        custom={index}
        style={{ display: 'inline-block' }}
        whileHover={{
          y: '-8%',
          transition: { type: 'spring', stiffness: 400, damping: 20 },
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

export default function LiquidTitle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div
      ref={ref}
      className="w-full flex justify-center select-none"
      aria-label={`${WORD1} ${WORD2}`}
      role="heading"
      aria-level={1}
    >
      <motion.h1
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex items-baseline gap-[0.3em] leading-[0.9] tracking-[0.12em] uppercase"
        style={{
          fontFamily: 'var(--font-goldleaf), var(--font-display)',
          fontWeight: 300,
          fontSize: 'clamp(52px, 11vw, 160px)',
          color: 'rgba(245,240,235,0.50)',
        }}
      >
        {/* Word 1 */}
        <span className="flex">
          {WORD1.split('').map((char, i) => (
            <Letter key={i} char={char} index={i} total={WORD1.length + WORD2.length} />
          ))}
        </span>

        {/* Word 2 */}
        <span className="flex">
          {WORD2.split('').map((char, i) => (
            <Letter
              key={i}
              char={char}
              index={WORD1.length + i + 1}
              total={WORD1.length + WORD2.length}
            />
          ))}
        </span>
      </motion.h1>
    </div>
  );
}
