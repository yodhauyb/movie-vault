import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 🔥 Next.js का स्क्रिप्ट टैग इम्पोर्ट किया
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Movie Vault | Watch HD Movies & Official Trailers",
  description: "Movie Vault is your ultimate destination for the latest HD movies, official trailers, ratings, and cast details. Fast, ad-free, and cinematic experience.",
  keywords: "movies, hd trailers, bollywood, hollywood, watch movies online, movie vault",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        
        {/* 🔥 तेरे दोनों Pop-under और Social Bar एड्स यहाँ बैकग्राउंड में चलेंगे */}
        <Script 
          src="https://pl30578063.effectivecpmnetwork.com/49/f7/09/49f709c86377900c598d77fce7e8a544.js" 
          strategy="lazyOnload" 
        />
        <Script 
          src="https://pl30599095.effectivecpmnetwork.com/87/80/5f/87805ff623c1e512ff9b550d915beb68.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}