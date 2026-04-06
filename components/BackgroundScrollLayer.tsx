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
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vh',
          height: '100vw',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          objectFit: 'cover',
          minWidth: '100%',
          minHeight: '100%',
        }}
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
