'use client';

export default function GlitchCTA({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative px-10 py-4 text-xs tracking-[0.3em] uppercase font-light border border-[#f5f0eb]/20 text-[#f5f0eb]/70 hover:border-[#c9a96e] hover:text-[#111010] hover:bg-[#c9a96e] transition-all duration-500 outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]"
      style={{ fontFamily: 'var(--font-geist-sans)' }}
      aria-label="Book a tattoo session"
    >
      Book a Session
    </button>
  );
}
