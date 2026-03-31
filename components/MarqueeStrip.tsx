'use client';

import { useRef, useState } from 'react';

const MARQUEE_TEXT =
  'LEMME INK · WEST HOLLYWOOD CA · FINE LINE · SINGLE NEEDLE · DETAILS MATTER · BY ALI · CURRENTLY BOOKING · LOS ANGELES · GUEST SPOTS · SEATTLE · SAN FRANCISCO · AUSTIN · CHICAGO · WAITLIST OPEN · ';

// Duplicate for seamless loop
const FULL_TEXT = MARQUEE_TEXT + MARQUEE_TEXT;

export default function MarqueeStrip() {
  const [reversed, setReversed] = useState(false);

  return (
    <div
      className="relative overflow-hidden border-t border-b border-[#1c1c1c] py-4 select-none"
      onMouseEnter={() => setReversed(true)}
      onMouseLeave={() => setReversed(false)}
      aria-hidden="true"
    >
      <div
        className={reversed ? 'animate-marquee-reverse' : 'animate-marquee'}
        style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {/* Two copies for seamless loop */}
        <span
          className="inline-block pr-0"
          style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#71717a',
          }}
        >
          {FULL_TEXT}
        </span>
        <span
          className="inline-block"
          style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#71717a',
          }}
        >
          {FULL_TEXT}
        </span>
      </div>
    </div>
  );
}
