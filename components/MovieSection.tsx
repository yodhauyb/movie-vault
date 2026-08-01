'use client';

import { useMemo } from 'react';
import telegramLinks from "@/data/telegramlink.json";
import PosterCard from "@/components/PosterCard";

// 🔥 TypeScript को बताने के लिए कि डेटा कैसा दिखेगा
interface MovieItem {
  id: string;
  title: string;
  year: string;
  type: string;
  link: string;
  poster_url: string | null;
  isNew?: boolean;
}

type TelegramLinkValue = string | { link: string; poster?: string | null; type?: string; year?: string };

export default function MovieSection() {
  const { movies, webSeries } = useMemo(() => {
    const vaultData = (telegramLinks as Record<string, TelegramLinkValue>) || {};
    const entries = Object.entries(vaultData);

    const allItems: MovieItem[] = entries.map(([key, val], index) => {
      let title = "";
      
      const url = typeof val === 'string' ? val : val?.link;
      const poster = typeof val === 'string' ? null : val?.poster;
      const customType = typeof val === 'object' ? val?.type : null;
      const customYear = typeof val === 'object' ? val?.year : null;
      
      const cleanKey = key.replace(/^movie_/, '').replace(/^series_/, '').replace(/_/g, ' ').trim();
      
      let movieYear = customYear || "2025"; 
      if (!customYear) {
        const yearMatch = url ? url.match(/(19\d{2}|20\d{2})/) : null;
        if (yearMatch) {
          movieYear = yearMatch[0];
        }
      }

      if (cleanKey.length > 2 && !cleanKey.match(/^\d+$/)) {
        title = cleanKey.replace(/\b\w/g, (char: string) => char.toUpperCase());
      } else {
        try {
          const urlParts = url ? url.split('/').filter(Boolean) : [];
          let slug = urlParts[urlParts.length - 1] || "";
          slug = slug.replace(/-\d{4}.*/, '').replace(/-/g, ' ').trim();
          title = slug ? slug.replace(/\b\w/g, (char: string) => char.toUpperCase()) : `Movie ${index + 1}`;
        } catch {
          title = `Movie ${index + 1}`;
        }
      }

      let finalType = "Movie";
      if (customType === "series" || key.includes("_show") || key.includes("series") || title.toLowerCase().includes("series")) {
        finalType = "Web Series";
      }

      return {
        id: `item_${key}_${index}`,
        title: title,
        year: movieYear,
        type: finalType,
        link: url || "#",
        poster_url: poster || null,
        isNew: false, // अगर इसे True करोगे तो कार्ड पर 'NEW' का बैज आएगा
      };
    });

    // लेटेस्ट मूवीज़/सीरीज़ ऊपर दिखाने के लिए लिस्ट को उल्टा (reverse) कर रहे हैं
    const reversedItems = allItems.reverse();

    // 🚀 यहाँ हम मूवीज़ और वेब सीरीज़ को 2 अलग-अलग डब्बों (Arrays) में बाँट रहे हैं
    const series = reversedItems.filter(item => item.type === "Web Series");
    const movs = reversedItems.filter(item => item.type === "Movie");

    return { movies: movs, webSeries: series };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 📺 WEB SERIES SECTION (यह तभी दिखेगा जब JSON में कोई सीरीज़ होगी) */}
      {webSeries.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-rose-500 tracking-wide uppercase">
              🔥 Trending Web Series
            </h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {webSeries.map((series) => (
              <PosterCard key={series.id} movie={series} />
            ))}
          </div>
        </section>
      )}

      {/* 🎬 MOVIES SECTION */}
      {movies.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-indigo-400 tracking-wide uppercase">
              🍿 Latest Movies
            </h2>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <PosterCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}