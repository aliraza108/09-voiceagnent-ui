import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Liam - AI Voice Agent",
  description: "Premium voice AI experience for instant real-time conversations.",
  applicationName: "Liam Voice Agent",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable}`}>{children}</body>
    </html>
  );
}
