import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Movie Vault - Watch & Download Latest Movies, Web Series Free",
  description: "Explore and stream the latest Bollywood, Hollywood movies, and trending web series in HD quality on Movie Vault. Fast downloads and seamless streaming.",
  keywords: "movie vault, latest movies, web series download, HD movies streaming, watch free movies online",
  openGraph: {
    title: 'Movie Vault - Watch & Download Latest Movies',
    description: 'Stream and download latest HD movies and web series.',
    url: 'https://movie-vault-snowy.vercel.app/',
    siteName: 'Movie Vault',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 🔥 तेरा Pop-Under Ad Script यहाँ लग गया! */}
        <script 
          src="https://blessingrecordpleasant.com/87/80/5f/87805ff623c1e512ff9b550d915beb68.js" 
          async 
          data-cfasync="false"
        ></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}