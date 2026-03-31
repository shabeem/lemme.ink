'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';

const BASE = 'https://img1.wsimg.com/isteam/ip/274f8bcb-f8db-4939-b54f-fe91f7d903b6';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  meta: string;
}

const categories: Category[] = [
  {
    id: 'black-grey',
    name: 'Black & Grey',
    description:
      'Timeless and understated, Black & Grey focuses on depth, contrast, and precision. Using subtle gradients and smooth shading, this style creates bold yet refined pieces that age beautifully over time.',
    imageUrl: `${BASE}/1BAB3CB1-EE31-4E1D-89B0-EA10D80773A0.jpeg/:/rs=w:800,cg:true`,
    meta: 'Speciality · Los Angeles',
  },
  {
    id: 'microrealism',
    name: 'Microrealism',
    description:
      'Highly detailed at a small scale, Microrealism captures lifelike imagery with incredible precision. Every line and shadow is intentional, resulting in intricate designs that feel both delicate and striking.',
    imageUrl: `${BASE}/8AE4BD7E-C34D-41E5-8643-7D617A0B83DB.jpeg/:/rs=w:800,cg:true,m`,
    meta: 'Speciality · Los Angeles',
  },
  {
    id: 'fine-line',
    name: 'Fine Line',
    description:
      'Clean, minimal, and elegant, Fine Line tattoos emphasize simplicity through thin, precise lines. Perfect for subtle, modern designs that carry meaning without overwhelming the skin.',
    imageUrl: `${BASE}/B9B2FE6D-B2F1-4E4F-A5E5-ECB3386D5BA9.jpeg/:/rs=w:800,cg:true,m`,
    meta: 'Speciality · Los Angeles',
  },
];

function CategoryRow({
  category,
  isOpen,
  onToggle,
  index,
  springX,
  springY,
}: {
  category: Category;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  // Each row has a unique parallax depth — odd rows drift slightly opposite direction
  const dir = index % 2 === 0 ? 1 : -1;
  const depth = 6 + index * 2;
  const rowX = useTransform(springX, [-1, 1], [-depth * dir, depth * dir]);
  const rowY = useTransform(springY, [-1, 1], [-(depth * 0.4), depth * 0.4]);

  // Image floats at a deeper layer
  const imgX = useTransform(springX, [-1, 1], [-18 * dir, 18 * dir]);
  const imgY = useTransform(springY, [-1, 1], [-10, 10]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      {/* Divider */}
      <div className="w-full h-px bg-[#1c1c1c]" />

      {/* Toggle row */}
      <motion.button
        onClick={onToggle}
        style={{ x: rowX, y: rowY }}
        className="w-full flex items-center justify-between py-7 md:py-8 group text-left cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`panel-${category.id}`}
      >
        <span
          className="text-2xl md:text-3xl text-[#f5f0eb] tracking-tight group-hover:text-[#c9a96e] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
        >
          {category.name}
        </span>

        <span
          className="text-[13px] tracking-[0.15em] text-[#71717a] group-hover:text-[#f5f0eb] transition-all duration-300 select-none"
          style={{
            fontFamily: 'var(--font-geist-sans)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            display: 'inline-block',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s',
          }}
          aria-hidden="true"
        >
          (+)
        </span>
      </motion.button>

      {/* Expandable panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`panel-${category.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 pb-10 md:pb-12 items-start">
              {/* Text content */}
              <div className="flex flex-col justify-between gap-8">
                <p
                  className="text-[15px] leading-[1.85] text-[#71717a] max-w-prose"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {category.description}
                </p>
                <div className="flex items-center gap-8">
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase text-[#3f3f46]"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {category.meta}
                  </span>
                  <a
                    href="#contact"
                    className="group/link relative text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#f5f0eb] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    Inquire
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#f5f0eb] group-hover/link:w-full transition-all duration-300" />
                  </a>
                </div>
              </div>

              {/* Preview image — hover expands, hidden on mobile */}
              <motion.div
                style={{ x: imgX, y: imgY }}
                className="relative overflow-hidden flex-shrink-0 group/img hidden md:block"
                whileHover={{ width: 280 }}
                initial={{ width: 140 }}
                animate={{ width: 140 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ aspectRatio: '4/5' }} className="relative w-full overflow-hidden">
                  <Image
                    src={category.imageUrl}
                    alt={`${category.name} tattoo example`}
                    fill
                    className="object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700"
                    sizes="280px"
                  />
                  <div className="absolute inset-0 bg-[#111010]/30 group-hover/img:bg-[#111010]/10 transition-colors duration-500 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ArtistsNav() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 55, damping: 20, mass: 0.8 });
  const springY = useSpring(rawY, { stiffness: 55, damping: 20, mass: 0.8 });

  // Heading drifts at a front layer
  const headX = useTransform(springX, [-1, 1], [-12, 12]);
  const headY = useTransform(springY, [-1, 1], [-6, 6]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
      rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="artists"
      className="px-4 md:px-12 py-20 md:py-28"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Section header */}
      <div className="mb-14 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl text-[#f5f0eb] tracking-tight"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400, x: headX, y: headY }}
        >
          Specialities
        </motion.h2>
      </div>

      {/* Accordion rows */}
      <div>
        {categories.map((cat, i) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            isOpen={openId === cat.id}
            onToggle={() => toggle(cat.id)}
            index={i}
            springX={springX}
            springY={springY}
          />
        ))}
        {/* Final bottom border */}
        <div className="w-full h-px bg-[#1c1c1c]" />
      </div>
    </section>
  );
}
