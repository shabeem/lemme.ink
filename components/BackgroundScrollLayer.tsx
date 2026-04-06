'use client';

export default function BackgroundScrollLayer() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.3 }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/parallax-bg.gif"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center center' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(17,16,16,0.15) 0%, transparent 25%, transparent 75%, rgba(17,16,16,0.25) 100%)',
        }}
      />
    </div>
  );
}
