import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"; // 👈 Yeh add kiya hai
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Vault Snowy - Watch Latest Hindi & Hollywood Movies HD",
  description: "Movie Vault Snowy par dekhein latest Bollywood, Hollywood, aur South movies HD mein. Direct play, zero ads, aur 1-click download bilkul free.",
  keywords: ["Movie Vault Snowy", "download new movies", "HD hindi movies", "free movie streaming", "latest bollywood movies 2026"],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0b0b0e] text-white min-h-screen flex flex-col md:flex-row`}>
        <Navbar />
        <div className="flex-1 md:pl-64 min-h-screen w-full">
          {children}
        </div>
        <Analytics /> {/* 👈 Aur yahan isko render kar diya */}
      </body>
    </html>
  );
}