import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Cockpit — Realistic Interior Simulator",
  description:
    "Interactive Porsche 911 (992) interior simulator with correct specs, flat-6 engine audio, and fully interactive cockpit controls.",
  metadataBase: new URL("https://car-cockpit.vercel.app"),
  openGraph: {
    title: "Car Cockpit — Porsche 911 (992) Simulator",
    description:
      "Sit in a 992 Carrera cockpit. Start the flat-6, rev the engine, and interact with PDK, PASM, and PCM.",
    url: "https://car-cockpit.vercel.app",
    siteName: "Car Cockpit",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#060608] font-sans text-white">{children}</body>
    </html>
  );
}
