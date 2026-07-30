'use client';

import { useState, useMemo } from 'react';
import telegramLinks from "@/data/telegramlink.json";
import AdBanner from "@/components/AdBanner";
import PosterCard from "@/components/PosterCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const movies = useMemo(() => {
    const vaultData = (telegramLinks as Record<string, string>) || {};
    const displayList = Object.entries(vaultData).filter(([, url]) => !url.includes("search.html"));

    return displayList.map(([key, url], index) => {
      let title = "";
      try {
        const urlParts = url.split('/').filter(Boolean);
        let slug = urlParts[urlParts.length - 1] || "";
        
        slug = slug
          .replace(/-bluray.*/i, '')
          .replace(/-webrip.*/i, '')
          .replace(/-hindi.*/i, '')
          .replace(/-english.*/i, '')
          .replace(/-hdts.*/i, '')
          .replace(/-hdrip.*/i, '')
          .replace(/-cam.*/i, '')
          .replace(/-movie.*/i, '')
          .replace(/-\d{4}.*/, '') 
          .replace(/-/g, ' ')
          .trim();
          
        title = slug.replace(/\b\w/g, (char) => char.toUpperCase());
      } catch {
        title = "";
      }

      if (!title || title.length < 2) {
        title = `Vault Movie ${index + 1}`;
      }

      return {
        id: `movie_${index}`,
        title: title,
        year: "2024",
        type: title.toLowerCase().includes("season") ? "Web Series" : "Movie",
        link: url,
        poster_url: null,
      };
    }).reverse();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase().trim();
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [movies, searchQuery]);

  return (
    <div className="w-full min-h-screen text-white pb-12">
      <div className="my-2">
        <AdBanner zoneId="top" />
      </div>

      <div className="px-6 md:px-10 mt-6">
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : "TRENDING VAULT"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Search through {movies.length} movies instantly.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {searchResults.map((movie) => (
              <PosterCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] text-slate-400 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-lg font-medium">No movies found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-bold transition-all shadow-lg cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      <div className="my-8">
        <AdBanner zoneId="bottom" />
      </div>
    </div>
  );
}