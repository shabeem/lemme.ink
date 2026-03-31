'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import GlitchCTA from './GlitchCTA';
import LiquidTitle from './LiquidTitle';
import ParticleField from './ParticleField';

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.4, ease: 'easeOut' } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.3 } },
};

export default function HeroSection({ ready = false, onBookClick }: { ready?: boolean; onBookClick?: () => void }) {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#111010]" aria-hidden="true" />
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Breathing light — top */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none" aria-hidden="true"
        style={{
          height: '60%',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 40%, transparent 100%)',
          animation: 'breathe 3.5s ease-in-out infinite',
        }}
      />

      {/* Logo watermark — bottom right */}
      <div className="absolute bottom-8 right-8 md:bottom-10 md:right-12 z-10 pointer-events-none" aria-hidden="true">
        <svg width="52" height="38" viewBox="0 0 72 52" fill="none">
          <rect x="0"  y="4"  width="5" height="28" fill="white" opacity="0.12" />
          <rect x="7"  y="0"  width="5" height="32" fill="white" opacity="0.12" />
          <rect x="16" y="8"  width="8" height="24" fill="white" opacity="0.12" />
          <rect x="27" y="2"  width="5" height="30" fill="white" opacity="0.12" />
          <rect x="34" y="10" width="5" height="22" fill="white" opacity="0.12" />
          <text x="0" y="50" fontSize="11" letterSpacing="2" fill="white" opacity="0.08" fontFamily="var(--font-geist-sans)">lemme.ink</text>
        </svg>
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 md:px-12 pt-24 pb-10 text-center gap-8"
      >
        {/* Brand name */}
        <motion.div variants={fadeUp} className="w-full">
          <LiquidTitle />
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
          <GlitchCTA onClick={onBookClick} />

          {/* Instagram link */}
          <a
            href="https://www.instagram.com/lemme.ink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @lemme.ink"
            className="opacity-30 hover:opacity-70 transition-opacity duration-300"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#f5f0eb]"
            >
              <circle cx="12" cy="12" r="11" />
              <rect x="7" y="7" width="10" height="10" rx="2.5" />
              <circle cx="12" cy="12" r="2.8" />
              <circle cx="15.2" cy="8.8" r="0.6" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </motion.div>

        {/* Tagline image — small, subtle */}
        <motion.div variants={fadeUp}>
          <Image
            src="/detailsmatter.png"
            alt="details matter"
            width={220}
            height={52}
            className="w-[clamp(120px,16vw,220px)] opacity-30"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        className="relative z-10 px-8 md:px-12 pb-8 flex items-end justify-between"
      >
        {/* City labels bottom-left */}
        <span
          className="text-[10px] tracking-[0.35em] uppercase text-[#3f3f46]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          West Hollywood · Los Angeles · CA
        </span>

        {/* Scroll indicator bottom-right */}
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-[#3f3f46]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          ↓ Scroll
        </span>
      </motion.div>
    </section>
  );
}
