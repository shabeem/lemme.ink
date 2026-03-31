'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

export default function LocationSection({ onBookClick }: { onBookClick?: () => void }) {
  return (
    <section id="location" className="px-4 md:px-12 py-20 md:py-28 border-t border-[#1c1c1c]">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

        {/* Left — address + book + parking */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-8"
        >
          {/* Label */}
          <motion.p
            variants={fadeUp}
            className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            — Location
          </motion.p>

          {/* Address */}
          <motion.div variants={fadeUp}>
            <p
              className="text-3xl md:text-4xl text-[#f5f0eb] tracking-tight leading-snug"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              8967 West Sunset Blvd
            </p>
            <p
              className="text-3xl md:text-4xl text-[#71717a] tracking-tight leading-snug"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              West Hollywood, CA 90069
            </p>
          </motion.div>

          {/* Book button */}
          <motion.div variants={fadeUp}>
            <button
              onClick={onBookClick}
              className="group relative inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[#c9a96e] hover:text-[#f5f0eb] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              <span className="w-8 h-px bg-[#c9a96e] group-hover:w-14 transition-all duration-400" />
              Book a Session
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="w-full h-px bg-[#1c1c1c]" />

          {/* Parking */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            <p
              className="text-[10px] tracking-[0.35em] uppercase text-[#3f3f46]"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Parking
            </p>

            {/* Paid */}
            <div className="flex flex-col gap-1.5">
              <p
                className="text-[12px] text-[#c9a96e] tracking-wide"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Paid parking — all day
              </p>
              <p
                className="text-[13px] text-[#71717a] leading-relaxed"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Send text <span className="text-[#f5f0eb]">"WH259"</span> to{' '}
                <span className="text-[#f5f0eb]">25023</span>
              </p>
              <a
                href="https://maps.app.goo.gl/mhDkrR1rKY2kWsUn8?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.15em] text-[#c9a96e]/60 hover:text-[#c9a96e] underline underline-offset-4 transition-colors duration-300 w-fit"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                View on map ↗
              </a>
            </div>

            {/* Free */}
            <div className="flex flex-col gap-1">
              <p
                className="text-[12px] text-[#c9a96e] tracking-wide"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Free parking — 7 hours
              </p>
              <p
                className="text-[13px] text-[#71717a]"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Harratt St &amp; Hammond St
              </p>
            </div>

            {/* Meter */}
            <div className="flex flex-col gap-1">
              <p
                className="text-[12px] text-[#c9a96e] tracking-wide"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Meter parking
              </p>
              <p
                className="text-[13px] text-[#71717a] leading-relaxed"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Sunset Blvd &amp; Hilldale Ave
                <br />
                <span className="text-[11px] text-[#3f3f46]">
                  Take a photo of the meter text to pay by phone
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — map */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full overflow-hidden"
          style={{ aspectRatio: '4/3' }}
        >
          <iframe
            title="Studio location"
            src="https://www.google.com/maps?q=8967+West+Sunset+Blvd,+West+Hollywood,+CA+90069&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(0.85)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

      </div>
    </section>
  );
}
