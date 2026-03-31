'use client';

import { motion } from 'framer-motion';

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="px-8 md:px-12 py-24 md:py-36">
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] mb-16 md:mb-20"
        style={{ fontFamily: 'var(--font-geist-sans)' }}
      >
        — Philosophy
      </motion.p>

      {/* Editorial manifesto layout */}
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left: large serif quote */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote
            className="text-[#f5f0eb] leading-[1.1] tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 4.5vw, 58px)',
            }}
          >
            Details matter. Every line is permanent.
          </blockquote>
        </motion.div>

        {/* Right: body text — right-aligned, max 60ch */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="md:pt-4"
        >
          <p
            className="text-[15px] leading-[1.9] text-[#71717a] md:text-right"
            style={{
              fontFamily: 'var(--font-geist-sans)',
              maxWidth: '60ch',
              marginLeft: 'auto',
            }}
          >
            My name is Ali. I'm a self-taught fine line and single needle tattoo artist based in West Hollywood, CA. I've been tattooing since 2022, and I've built my practice around one belief: attention to detail is everything. Before tattooing, I spent eight years in ballet, lived across the world, and became a DJ and producer in Thailand. That journey taught me that the most powerful forms of expression are the ones that take time to perfect.
          </p>

          <div className="md:flex md:flex-col md:items-end mt-6 gap-3">
            {/* Logo mark */}
            <svg width="40" height="30" viewBox="0 0 72 52" fill="none" aria-hidden="true" className="opacity-20">
              <rect x="0"  y="4"  width="5" height="28" fill="white" />
              <rect x="7"  y="0"  width="5" height="32" fill="white" />
              <rect x="16" y="8"  width="8" height="24" fill="white" />
              <rect x="27" y="2"  width="5" height="30" fill="white" />
              <rect x="34" y="10" width="5" height="22" fill="white" />
            </svg>
            <p
              className="text-[15px] text-[#3f3f46] md:text-right whitespace-nowrap"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Currently booking in Los Angeles. Guest spots in Seattle, San Francisco, Austin, Chicago — waitlist open.
            </p>
          </div>

          {/* Horizontal rule */}
          <div className="md:flex md:justify-end mt-10">
            <div className="w-16 h-px bg-[#c9a96e]/40" />
          </div>
        </motion.div>
      </div>

      {/* Pillar list — thin divider rows below the manifesto */}
      <div className="mt-20 md:mt-28 space-y-0">
        {[
          {
            number: '01',
            title: 'Fine Line',
            body: 'Specialising in fine line and single needle tattooing — the most delicate and demanding technique in the craft. Each line is placed with precision that most artists cannot replicate.',
          },
          {
            number: '02',
            title: 'Custom Design',
            body: 'Every tattoo starts with your idea. I reinterpret and develop each concept into a design that fits your body, your skin, and your story — before a single needle touches you.',
          },
          {
            number: '03',
            title: 'West Hollywood',
            body: 'Currently booking in Los Angeles. Guest spots in Seattle, San Francisco, Austin, Chicago — waitlist open. Follow @lemme.ink on Instagram for availability updates.',
          },
        ].map((pillar, i) => (
          <motion.div
            key={pillar.number}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            className="group"
          >
            <div className="w-full h-px bg-[#1c1c1c]" />
            <div className="grid grid-cols-12 gap-4 py-9 md:py-12">
              {/* Number */}
              <div className="col-span-2">
                <span
                  className="text-[2.5rem] md:text-[3.5rem] leading-none text-[#1c1c1c] group-hover:text-[#262626] transition-colors duration-500 select-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                  aria-hidden="true"
                >
                  {pillar.number}
                </span>
              </div>
              {/* Title */}
              <div className="col-span-10 md:col-span-3 flex items-start pt-1">
                <h3
                  className="text-2xl md:text-3xl text-[#f5f0eb] tracking-tight"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                >
                  {pillar.title}
                </h3>
              </div>
              {/* Body */}
              <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-start">
                <p
                  className="text-[13px] leading-[1.95] text-[#71717a]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {pillar.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="w-full h-px bg-[#1c1c1c]" />
      </div>
    </section>
  );
}
