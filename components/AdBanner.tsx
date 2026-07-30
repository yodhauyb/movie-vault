"use client";

import Script from "next/script";

interface AdBannerProps {
  zoneId?: string;
}

export default function AdBanner({ zoneId = "default" }: AdBannerProps) {
  const uniqueUrl = `/ad.html?zone=${zoneId}&v=1`;

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden">
      <Script 
        src="https://pl30599095.effectivecpmnetwork.com/87/80/5f/87805ff623c1e512ff9b550d915beb68.js" 
        strategy="lazyOnload" 
      />
      <iframe 
        src={uniqueUrl} 
        width="468" 
        height="60" 
        className="border border-white/10 rounded-lg shadow-lg bg-black/50"
        scrolling="no"
      />
    </div>
  );
}