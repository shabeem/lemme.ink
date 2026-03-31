'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface WorkItem { url: string; specialty: string; color?: boolean }

// Alternates: even index = black & white, odd index = color
const works: WorkItem[] = [
  { url: '/tattoos/FUJI7080.JPG',                              specialty: 'Black & Grey' },
  { url: '/tattoos/FUJI7414.jpg',                              specialty: 'Fine Line',    color: true },
  { url: '/tattoos/FUJI7718.JPG',                              specialty: 'Microrealism' },
  { url: '/tattoos/FUJI8000.jpg',                              specialty: 'Black & Grey', color: true },
  { url: '/tattoos/FUJI8057.jpg',                              specialty: 'Fine Line' },
  { url: '/tattoos/FUJI8635.jpg',                              specialty: 'Microrealism', color: true },
  { url: '/tattoos/FUJI9488.jpg',                              specialty: 'Black & Grey' },
  { url: '/tattoos/DSCF0277.jpg',                              specialty: 'Fine Line',    color: true },
  { url: '/tattoos/IMG_0334.JPG',                              specialty: 'Microrealism' },
  { url: '/tattoos/IMG_0335.jpg',                              specialty: 'Black & Grey', color: true },
  { url: '/tattoos/IMG_7457.jpg',                              specialty: 'Fine Line' },
  { url: '/tattoos/IMG_9118.JPG',                              specialty: 'Microrealism', color: true },
  { url: '/tattoos/75F7AEEC-8C31-4112-BB32-EEF79674E5AA.JPG', specialty: 'Black & Grey' },
  { url: '/tattoos/E3F42E6C-17D3-4D9F-9760-281B6BBC24CC.JPG', specialty: 'Fine Line',    color: true },
  { url: '/tattoos/FUJI4613.JPG',                              specialty: 'Black & Grey' },
  { url: '/tattoos/2A556913-91A6-4B1D-B1D7-4EEB6F140288.JPG', specialty: 'Microrealism', color: true },
];

function ArtistCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.06 }}
      whileHover={{ scale: 1.12, zIndex: 50, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="relative overflow-hidden group cursor-pointer z-10"
      style={{ transformOrigin: 'center center' }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
        <Image
          src={item.url}
          alt={`${item.specialty} tattoo by Ali`}
          fill
          className={`object-cover transition-all duration-500 ${item.color ? 'grayscale-0 group-hover:grayscale' : 'grayscale group-hover:grayscale-0'}`}
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-[#111010]/45 group-hover:bg-[#111010]/10 transition-colors duration-400" />
      </div>
    </motion.div>
  );
}

export default function WorkGrid() {
  return (
    <section id="work" className="px-8 md:px-12 py-20 md:py-28">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] mb-4"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            — Selected Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
            className="text-4xl md:text-5xl text-[#f5f0eb] tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
          >
            The Portfolio
          </motion.h2>
        </div>
        <span
          className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-[#3f3f46]"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {works.length} Works
        </span>
      </div>

      {/* 4-col grid — small thumbnails, overflow visible so hover scales out */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-2"
        style={{ overflow: 'visible' }}
      >
        {works.map((item, i) => (
          <ArtistCard key={item.url} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
