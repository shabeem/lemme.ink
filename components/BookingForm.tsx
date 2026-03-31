'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';

const TELEGRAM_BOT_LINK = 'https://t.me/lemmeinkbot';

const STUDIO_LOCATIONS = [
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { name: 'Austin', lat: 30.2672, lon: -97.7431 },
  { name: 'Seattle', lat: 47.6061, lon: -122.3328 },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function generateRequestId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'REQ-';
  for (let i = 0; i < 4; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingForm({ isOpen, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [replyMethod, setReplyMethod] = useState<'email' | 'telegram' | ''>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [telegramUsername, setTelegramUsername] = useState('@');
  const [locationHint, setLocationHint] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Geolocation
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocationHint('Location not supported. Choose manually.'); return; }
    setLocationHint('Detecting nearest studio...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const nearest = STUDIO_LOCATIONS.reduce((best, s) => {
          const d = haversine(lat, lon, s.lat, s.lon);
          return !best || d < best.d ? { name: s.name, d } : best;
        }, null as { name: string; d: number } | null);
        if (nearest) {
          const sel = formRef.current?.querySelector<HTMLSelectElement>('[name="location"]');
          if (sel) sel.value = nearest.name;
          setLocationHint(`Nearest: ${nearest.name} (${Math.round(nearest.d)} mi). Change if needed.`);
        }
      },
      () => setLocationHint('Permission denied. Choose manually.'),
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => { if (isOpen) detectLocation(); }, [isOpen, detectLocation]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!replyMethod) { setStatus({ type: 'error', msg: "Please select how you'd like me to reply." }); return; }
    if (replyMethod === 'telegram' && telegramUsername.trim() === '@') {
      setStatus({ type: 'error', msg: 'Please enter your Telegram username.' }); return;
    }
    if (!formRef.current?.reportValidity()) { setStatus({ type: 'error', msg: 'Please complete all required fields.' }); return; }

    const requestId = generateRequestId();
    const formData = new FormData(formRef.current!);
    formData.append('requestId', requestId);
    formData.append('submittedAt', new Date().toISOString());
    formData.append('source', window.location.href);
    formData.append('preferredReplyMethod', replyMethod);
    selectedDays.forEach((d) => formData.append('bestDays[]', d));

    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Submission failed. Please try again.');
      setStatus({ type: 'success', msg: 'Request sent successfully.' });

      if (replyMethod === 'telegram') {
        setTimeout(() => {
          const url = `${TELEGRAM_BOT_LINK}?start=${requestId}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        }, 500);
        return;
      }

      formRef.current?.reset();
      setTelegramUsername('@');
      setSelectedDays([]);
      setFileNames([]);
      setReplyMethod('');
      setLocationHint('');
      detectLocation();
    } catch (err: unknown) {
      setStatus({ type: 'error', msg: err instanceof Error ? err.message : 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(16px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="form"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            aria-modal="true"
            role="dialog"
            aria-label="New Tattoo Request"
          >
            <div
              className="pointer-events-auto w-full max-w-2xl max-h-[90dvh] overflow-y-auto relative"
              style={{
                background: 'rgba(17,16,16,0.82)',
                backdropFilter: 'blur(28px)',
                border: '1px solid rgba(245,240,235,0.07)',
                boxShadow: 'inset 0 1px 0 rgba(245,240,235,0.04), 0 40px 100px rgba(0,0,0,0.6)',
              }}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-[10px] tracking-[0.45em] uppercase text-[#71717a]"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}>
                    LEMME INK
                  </p>
                  <button onClick={onClose} className="text-[#71717a] hover:text-[#f5f0eb] transition-colors duration-200 text-lg leading-none" aria-label="Close">✕</button>
                </div>
                <h2 className="text-[#f5f0eb] tracking-[0.06em] uppercase mb-3"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(22px, 3vw, 32px)' }}>
                  New Tattoo Request
                </h2>
                <p className="text-[#71717a] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  Tell me about your idea, placement, size, and attach reference images. I'll reply via your preferred contact method.
                </p>
              </div>

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full name" required><input name="fullName" required className={inputCls} placeholder="Your name" style={inputStyle} /></Field>
                  <Field label="Email" required><input type="email" name="email" required className={inputCls} placeholder="your@email.com" style={inputStyle} /></Field>
                  <Field label="Phone" required><input name="phone" required className={inputCls} placeholder="+1 (000) 000-0000" style={inputStyle} /></Field>
                  <Field label="Preferred location" required hint={locationHint}>
                    <select name="location" required className={inputCls} style={inputStyle}>
                      <option value="">Select</option>
                      {STUDIO_LOCATIONS.map((s) => <option key={s.name}>{s.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Placement"><input name="placement" className={inputCls} placeholder="e.g. forearm, back" style={inputStyle} /></Field>
                  <Field label="Approx size"><input name="size" className={inputCls} placeholder="e.g. 4×4 inches" style={inputStyle} /></Field>
                  <Field label="Budget">
                    <select name="budget" className={inputCls} style={inputStyle}>
                      <option value="">Select</option>
                      {['Under $500', '$500–$1000', '$1000–$2000', '$2000+', 'Flexible'].map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Days */}
                <Field label="Best days">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DAYS.map((day) => (
                      <button key={day} type="button" onClick={() => toggleDay(day)}
                        className="px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-200 border"
                        style={{
                          fontFamily: 'var(--font-geist-sans)',
                          borderColor: selectedDays.includes(day) ? '#c9a96e' : 'rgba(245,240,235,0.08)',
                          color: selectedDays.includes(day) ? '#111010' : '#71717a',
                          background: selectedDays.includes(day) ? '#c9a96e' : 'transparent',
                        }}>
                        {day}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Idea */}
                <Field label="Describe your idea" required>
                  <textarea name="idea" required rows={4} className={inputCls} placeholder="Describe your vision..." style={{ ...inputStyle, resize: 'vertical' }} />
                </Field>

                {/* Files */}
                <Field label="Reference files">
                  <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border border-dashed border-white/[0.08] px-4 py-5 hover:border-[#c9a96e]/40 transition-colors duration-300">
                    <span className="text-xs text-[#71717a] tracking-[0.15em] uppercase" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      {fileNames.length ? fileNames.join(', ') : 'Click to upload images'}
                    </span>
                    <input type="file" multiple accept="image/*,.pdf,.heic,.heif" name="referenceFiles" className="hidden"
                      onChange={(e) => setFileNames([...e.target.files!].map((f) => f.name))} />
                  </label>
                </Field>

                {/* Reply method */}
                <Field label="How should I reply?" required>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {(['email', 'telegram'] as const).map((method) => (
                      <button key={method} type="button" onClick={() => setReplyMethod(method)}
                        className="text-left px-4 py-4 border transition-all duration-200"
                        style={{
                          fontFamily: 'var(--font-geist-sans)',
                          borderColor: replyMethod === method ? '#c9a96e' : 'rgba(245,240,235,0.08)',
                          background: replyMethod === method ? 'rgba(201,169,110,0.06)' : 'transparent',
                        }}>
                        <div className="text-xs tracking-[0.2em] uppercase mb-1"
                          style={{ color: replyMethod === method ? '#c9a96e' : '#f5f0eb' }}>
                          {method === 'email' ? 'Email' : 'Telegram'}
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                          {method === 'email' ? 'Traditional reply' : 'Fastest communication'}
                        </div>
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Telegram username */}
                {replyMethod === 'telegram' && (
                  <Field label="Telegram username" required>
                    <input
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value || '@')}
                      onKeyDown={(e) => { if (telegramUsername.length <= 1 && e.key === 'Backspace') e.preventDefault(); }}
                      className={inputCls} placeholder="@username" style={inputStyle}
                    />
                  </Field>
                )}

                {/* Status */}
                {status && (
                  <p className="text-xs tracking-[0.1em] px-1 py-2"
                    style={{
                      fontFamily: 'var(--font-geist-sans)',
                      color: status.type === 'error' ? '#f87171' : '#86efac',
                    }}>
                    {status.msg}
                  </p>
                )}

                {/* Submit */}
                <button type="submit" disabled={submitting}
                  className="mt-2 w-full py-4 text-xs tracking-[0.3em] uppercase font-light border border-[#c9a96e]/40 text-[#f5f0eb] hover:bg-[#c9a96e] hover:text-[#111010] hover:border-[#c9a96e] transition-all duration-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  {submitting ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inputCls = 'w-full bg-transparent text-[#f5f0eb] placeholder-[#3f3f46] text-sm outline-none border-b border-white/[0.08] focus:border-[#c9a96e]/40 transition-colors duration-300 pb-2';
const inputStyle = { fontFamily: 'var(--font-geist-sans)' };

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-[0.3em] uppercase text-[#71717a]"
        style={{ fontFamily: 'var(--font-geist-sans)' }}>
        {label}{required && <span className="text-[#c9a96e] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-[#3f3f46] mt-0.5" style={{ fontFamily: 'var(--font-geist-sans)' }}>{hint}</p>}
    </div>
  );
}
