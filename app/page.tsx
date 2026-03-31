'use client';

import { useState } from 'react';
import CursorGlow from '@/components/CursorGlow';
import Nav from '@/components/Nav';
import HeroSection from '@/components/HeroSection';
import MarqueeStrip from '@/components/MarqueeStrip';
import ArtistsNav from '@/components/ArtistsNav';
import WorkGrid from '@/components/WorkGrid';
import PhilosophySection from '@/components/PhilosophySection';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import VideoSection from '@/components/VideoSection';
import LocationSection from '@/components/LocationSection';

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <BookingForm isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />

      <main className="relative min-h-[100dvh] bg-[#111010]">
        <CursorGlow />
        <div className="relative z-10">
          <Nav onBookClick={() => setBookingOpen(true)} />
          <HeroSection ready={true} onBookClick={() => setBookingOpen(true)} />
          <MarqueeStrip />
          <ArtistsNav />
          <WorkGrid />
          <MarqueeStrip />
          <LocationSection onBookClick={() => setBookingOpen(true)} />
          <PhilosophySection />
          <Footer onBookClick={() => setBookingOpen(true)} />
        </div>
      </main>
    </>
  );
}
