'use client';

import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer({ onBookClick }: { onBookClick?: () => void }) {
  return (
    <motion.footer
      id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="border-t border-[#1c1c1c] px-8 md:px-16 py-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Logo mark */}
        <div className="flex flex-col gap-2">
          {/* SVG logo — geometric mark + wordmark */}
          <svg width="72" height="52" viewBox="0 0 72 52" fill="none" aria-label="Lemme Ink">
            {/* Geometric mark — vertical bar cluster */}
            <rect x="0"  y="4"  width="5" height="28" fill="white" opacity="0.9" />
            <rect x="7"  y="0"  width="5" height="32" fill="white" opacity="0.9" />
            <rect x="16" y="8"  width="8" height="24" fill="white" opacity="0.9" />
            <rect x="27" y="2"  width="5" height="30" fill="white" opacity="0.9" />
            <rect x="34" y="10" width="5" height="22" fill="white" opacity="0.9" />
            {/* Wordmark */}
            <text
              x="0" y="50"
              fontSize="11"
              letterSpacing="2"
              fill="white"
              opacity="0.55"
              fontFamily="var(--font-geist-sans)"
            >
              lemme.ink
            </text>
          </svg>
          <p
            className="text-[10px] tracking-[0.15em] text-[#3f3f46]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            © MMXXV. All rights reserved.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8" aria-label="Footer navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.2em] uppercase text-[#71717a] hover:text-[#f5f0eb] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Book CTA */}
        <button
          onClick={onBookClick}
          className="px-7 py-3 text-xs tracking-[0.25em] uppercase text-[#c9a96e] border border-[#c9a96e]/40 hover:border-[#c9a96e] hover:text-[#111010] hover:bg-[#c9a96e] transition-all duration-400"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          aria-label="Book a tattoo appointment"
        >
          Book
        </button>
      </div>

      {/* Tagline */}
      <div className="mt-12 md:mt-16">
        <p
          className="font-serif italic text-[#1c1c1c] text-4xl md:text-6xl tracking-tight leading-none select-none"
          style={{ fontFamily: 'var(--font-display)' }}
          aria-hidden="true"
        >
          Permanent art. Singular vision.
        </p>
      </div>
    </motion.footer>
  );
}
