'use client';

import { useEffect, useRef } from 'react';

interface Dot { worldX: number; worldZ: number; r: number }
interface Ripple { startT: number }

const CAM_Y    = 320;
const CAM_BACK = 520;
const FOCAL    = 420;
const HORIZON  = 0.38;
const COLOR    = '201,169,110';

// Drop cycle timings (seconds)
const T_PAUSE  = 2.8;   // wait before drop
const T_FALL   = 1.1;   // fall duration
const T_RIPPLE = 3.8;   // ripple lifetime
const CYCLE    = T_PAUSE + T_FALL + T_RIPPLE;

const DROP_START_Y = 95; // world-unit height drop begins from

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let frame = 0;
    let W = 0, H = 0;
    let dots: Dot[] = [];

    const build = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      dots = [];
      const RINGS = 38;
      const MAX_R = Math.max(W, H) * 1.5;
      const SPACING = 34;
      for (let ring = 1; ring <= RINGS; ring++) {
        const r = (ring / RINGS) * MAX_R;
        const count = Math.max(6, Math.round((2 * Math.PI * r) / SPACING));
        for (let i = 0; i < count; i++) {
          const theta = (i / count) * Math.PI * 2;
          dots.push({ r, worldX: r * Math.cos(theta), worldZ: r * Math.sin(theta) });
        }
      }
    };

    const project = (wx: number, wy: number, wz: number) => {
      const camZ = wz + CAM_BACK;
      if (camZ < 5) return null;
      const scale = FOCAL / camZ;
      return { sx: W * 0.5 + wx * scale, sy: H * HORIZON + (CAM_Y - wy) * scale, scale };
    };

    const tick = () => {
      frame++;
      const t = frame * 0.016;
      ctx.clearRect(0, 0, W, H);

      // ── drop / ripple phase ──────────────────────────────────────────
      const phase     = t % CYCLE;
      const isFalling = phase >= T_PAUSE && phase < T_PAUSE + T_FALL;
      const isRipple  = phase >= T_PAUSE + T_FALL;
      const fallProg  = isFalling ? (phase - T_PAUSE) / T_FALL : 0;        // 0→1
      const rippleAge = isRipple  ? phase - (T_PAUSE + T_FALL) : 0;        // seconds since impact

      // ease-in fall
      const dropY = isFalling ? DROP_START_Y * (1 - fallProg * fallProg) : 0;

      // ── draw floor dots ─────────────────────────────────────────────
      // shadowBlur per-dot is extremely expensive — draw all dots without shadow
      ctx.shadowBlur = 0;

      for (const d of dots) {
        // base ambient wave
        let wave = Math.sin(d.r * 0.011 - t * 1.7) * 26
                 + Math.cos(d.r * 0.007 + t * 0.9) * 8;

        // impact ripple
        if (isRipple) {
          const envelope = Math.exp(-rippleAge * 0.65) * Math.exp(-d.r * 0.0018);
          wave += Math.sin(d.r * 0.030 - rippleAge * 5.5) * envelope * 48;
        }

        const p = project(d.worldX, wave, d.worldZ);
        if (!p) continue;
        const { sx, sy, scale } = p;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;

        const s     = Math.min(scale, 2.2);
        const size  = Math.max(0.35, s * 1.15);
        const waveN = (wave + 34) / 68;

        const rippleBoost = isRipple
          ? Math.max(0, Math.sin(d.r * 0.030 - rippleAge * 5.5))
            * Math.exp(-rippleAge * 0.65) * Math.exp(-d.r * 0.0018)
          : 0;

        const alpha = Math.min(0.82, (s * 0.38 + rippleBoost * 0.4) * (0.55 + 0.45 * waveN));

        ctx.beginPath();
        ctx.arc(sx, sy, size + rippleBoost * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},${alpha})`;
        ctx.fill();
      }

      // ── draw falling drop ────────────────────────────────────────────
      if (isFalling) {
        const p = project(0, dropY, 0);
        if (p) {
          // trail
          const trailLen = 5;
          for (let i = 1; i <= trailLen; i++) {
            const trailY = dropY + i * 5;
            const tp = project(0, trailY, 0);
            if (!tp) continue;
            ctx.beginPath();
            ctx.arc(tp.sx, tp.sy, 1.2 * (1 - i / trailLen), 0, Math.PI * 2);
            ctx.fillStyle   = `rgba(${COLOR},${0.3 * (1 - i / trailLen)})`;
            ctx.shadowBlur  = 0;
            ctx.fill();
          }
          // drop head — single shadow call only for the drop dot
          ctx.shadowBlur  = 12;
          ctx.shadowColor = `rgba(${COLOR},1)`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,240,200,0.95)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // impact flash — one shadow call, then reset
      if (isRipple && rippleAge < 0.12) {
        const p = project(0, 0, 0);
        if (p) {
          const flashAlpha = (1 - rippleAge / 0.12) * 0.9;
          ctx.shadowBlur  = 18;
          ctx.shadowColor = `rgba(255,240,200,${flashAlpha})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 4 + rippleAge * 30, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,240,200,${flashAlpha * 0.6})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    build();
    tick();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
