import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AdBanner from "@/components/AdBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Vault",
  description: "Watch and download the latest movies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Background Script Ad */}
        <Script
          src="https://pl30578063.effectivecpmnetwork.com/49/f7/09/49f709c86377900c598d77fce7e8a544.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        
        {/* Top Ad Banner */}
        <div className="w-full bg-neutral-950 flex justify-center border-b border-neutral-900 overflow-hidden">
          <AdBanner />
        </div>

        {/* Aapki Website ka Main Content */}
        {children}

        {/* Bottom Ad Banner */}
        <div className="w-full bg-neutral-950 flex justify-center border-t border-neutral-900 mt-10 overflow-hidden">
          <AdBanner />
        </div>

      </body>
    </html>
  );
}