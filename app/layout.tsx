import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const goldleaf = localFont({
  src: "../public/fonts/Goldleaf.ttf",
  variable: "--font-goldleaf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEMME INK — Luxury Tattoo Studio",
  description: "Permanent art. Singular vision. Bespoke tattoo atelier in Tokyo, Berlin, New York.",
  openGraph: {
    title: "LEMME INK",
    description: "Permanent art. Singular vision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${goldleaf.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f0eb]">
        {children}
      </body>
    </html>
  );
}
