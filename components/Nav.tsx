'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, motion, useTransform } from 'framer-motion';

const links = [
  { label: 'Artists', href: '#artists' },
  { label: 'Address', href: '#location' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Book', href: '#contact', accent: true },
];

function NavLink({ label, href, accent }: { label: string; href: string; accent?: boolean }) {
  return (
    <a
      href={href}
      className={`relative group text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
        accent
          ? 'text-[#f5f0eb] hover:text-[#c9a96e]'
          : 'text-[#71717a] hover:text-[#f5f0eb]'
      }`}
      style={{ fontFamily: 'var(--font-geist-sans)' }}
    >
      {label}
      {/* Underline animation — Book link gets a permanent subtle line, others on hover */}
      <span
        className={`absolute left-0 -bottom-0.5 h-px bg-[#c9a96e] transition-all duration-400 ${
          accent
            ? 'w-0 group-hover:w-full'
            : 'w-0 group-hover:w-full'
        }`}
        style={{ transformOrigin: 'left' }}
      />
    </a>
  );
}

export default function Nav({ onBookClick }: { onBookClick?: () => void }) {
  const scrollY = useMotionValue(0);
  const borderOpacity = useSpring(
    useTransform(scrollY, [0, 60], [0, 1]),
    { stiffness: 200, damping: 30 }
  );

  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(17, 16, 16, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Border-bottom that appears on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-[#1c1c1c]"
        style={{ opacity: borderOpacity }}
      />

      <div className="flex items-center justify-between px-8 md:px-12 py-5">
        {/* Logo */}
        <a
          href="#"
          className="text-[11px] tracking-[0.4em] uppercase text-[#f5f0eb] hover:text-[#c9a96e] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          aria-label="ALI DASA — Home"
        >
          ALI DASA
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
          {links.map((link) =>
            link.accent ? (
              <button
                key={link.label}
                onClick={onBookClick}
                className="relative group text-[11px] tracking-[0.2em] uppercase text-[#f5f0eb] hover:text-[#c9a96e] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-px bg-[#c9a96e] w-0 group-hover:w-full transition-all duration-400" />
              </button>
            ) : (
              <NavLink key={link.label} {...link} />
            )
          )}
        </nav>

        {/* Mobile — just show Book */}
        <a
          href="#contact"
          className="md:hidden text-[11px] tracking-[0.2em] uppercase text-[#c9a96e]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Book
        </a>
      </div>
    </motion.header>
  );
}
