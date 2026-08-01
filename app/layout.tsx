import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Vault | Watch HD Movies & Official Trailers",
  description: "Movie Vault is your ultimate destination for the latest HD movies, official trailers, ratings, and cast details. Fast, ad-free, and cinematic experience.",
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