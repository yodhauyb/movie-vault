'use client';

import { useState, useMemo } from 'react';
import telegramLinks from "@/data/telegramlink.json";
import AdBanner from "@/components/AdBanner";
import PosterCard from "@/components/PosterCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const movies = useMemo(() => {
    const vaultData = (telegramLinks as Record<string, string>) || {};
    
    const displayList = Object.entries(vaultData).filter(([, url]) => {
      if (!url) return false;
      const lowerUrl = url.toLowerCase();
      return (
        !lowerUrl.includes("search.html") && 
        !lowerUrl.includes("search-recover") && 
        !lowerUrl.includes("?s=") &&
        url.length > 20
      );
    });

    const mappedList = displayList.map(([key, url], index) => {
      let title = "";
      let movieYear = "2025"; 
      
      const cleanKey = key.replace(/^movie_/, '').replace(/_/g, ' ').trim();
      
      const yearMatch = url.match(/(19\d{2}|20\d{2})/);
      if (yearMatch) {
        movieYear = yearMatch[0];
      }

      if (cleanKey.toLowerCase().includes("spider man") || cleanKey.toLowerCase().includes("spider-man") || cleanKey.toLowerCase().includes("spider_man")) {
        title = "Spider-Man Brand New Day";
        movieYear = "2026";
      } else if (cleanKey.length > 2 && !cleanKey.match(/^\d+$/)) {
        title = cleanKey.replace(/\b\w/g, c => c.toUpperCase());
      } else {
        try {
          const urlParts = url.split('/').filter(Boolean);
          let slug = urlParts[urlParts.length - 1] || "";
          slug = slug.replace(/-\d{4}.*/, '').replace(/-/g, ' ').trim();
          title = slug.replace(/\b\w/g, (char) => char.toUpperCase());
        } catch {
          title = `Vault Movie ${index + 1}`;
        }
      }

      if (!title || title.length < 2 || title.match(/^\d+$/)) {
        title = `Movie Release ${index + 1}`;
      }

      return {
        id: `movie_${key}_${index}`,
        title: title,
        year: movieYear,
        type: title.toLowerCase().includes("season") ? "Web Series" : "Movie",
        link: url,
        poster_url: null,
        isNew: false,
      };
    });

    const spiderManMovies = mappedList.filter(m => m.title === "Spider-Man Brand New Day");
    let otherMovies = mappedList.filter(m => m.title !== "Spider-Man Brand New Day");

    // JSON के आख़िर वाली मूवीज़ को ऊपर लाने के लिए रिवर्स किया
    otherMovies = otherMovies.reverse();

    otherMovies = otherMovies.map((movie, index) => ({
      ...movie,
      isNew: index < 25, 
    }));

    return [...spiderManMovies, ...otherMovies];
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase().trim();
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [movies, searchQuery]);

  const displayedMovies = searchResults.slice(0, 60);

  return (
    <div className="w-full min-h-screen text-white pb-12">
      <div className="my-2">
        <AdBanner zoneId="top" />
      </div>

      <div className="px-6 md:px-10 mt-6">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-8 tracking-wider">
          Welcome to Movie Vault Snowy - Ultimate HD Movie Hub
        </h1>

        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : "TRENDING VAULT (NEW RELEASES)"}
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

        {displayedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {displayedMovies.map((movie) => (
                <PosterCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {searchResults.length > 60 && (
              <div className="mt-10 text-center text-slate-400 text-sm font-medium">
                Showing top 60 movies. Use the search bar to find more!
              </div>
            )}
          </>
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