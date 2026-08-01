'use client';

import { useState, useMemo } from 'react';
import telegramLinks from "@/data/telegramlink.json";
import PosterCard from "@/components/PosterCard";
import { Search, Film, Send } from "lucide-react";

interface MovieItem {
  id: string;
  title: string;
  year: string;
  type: string;
  link: string;
  poster_url: string | null;
  isNew?: boolean;
}

// 🔥 TypeScript को नए Object फॉर्मेट समझाने के लिए Type
type TelegramLinkValue = string | { link: string; poster?: string | null };

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const movies = useMemo(() => {
    // 🔥 Record<string, TelegramLinkValue> कर दिया ताकि Type mismatch न हो
    const vaultData = (telegramLinks as Record<string, TelegramLinkValue>) || {};
    
    const entries = Object.entries(vaultData);

    const mappedList: MovieItem[] = entries.map(([key, val], index) => {
      let title = "";
      let movieYear = "2025"; 
      
      const url = typeof val === 'string' ? val : val?.link;
      const poster = typeof val === 'string' ? null : val?.poster;
      
      const cleanKey = key.replace(/^movie_/, '').replace(/_/g, ' ').trim();
      
      const yearMatch = url ? url.match(/(19\d{2}|20\d{2})/) : null;
      if (yearMatch) {
        movieYear = yearMatch[0];
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

      return {
        id: `search_${key}_${index}`,
        title: title,
        year: movieYear,
        type: title.toLowerCase().includes("series") ? "Web Series" : "Movie",
        link: url || "#",
        poster_url: poster || null,
        isNew: false,
      };
    });

    return mappedList.reverse();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase().trim();
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [movies, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-600 selection:text-white pb-20">
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0f19]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                MOVIE SEARCH
              </span>
            </div>
          </div>

          <a
            href="https://t.me/mymovieserver123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-600/25"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type movie name to search instantly..."
              className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              autoFocus
            />
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults.map((movie) => (
              <PosterCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/5">
            <p className="text-slate-400 text-sm mb-4">No movies found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 bg-indigo-600 rounded-xl text-white text-xs font-bold"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}