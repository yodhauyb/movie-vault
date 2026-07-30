'use client';

import { useState, useEffect } from 'react';

interface MovieItem {
  id: string;
  title: string;
  year: string;
  type: string;
  link: string;
  poster_url: string | null;
}

export default function PosterCard({ movie }: { movie: MovieItem }) {
  const [poster, setPoster] = useState<string | null>(null);

  useEffect(() => {
    // TMDB API se poster fetch karne ka function
    const fetchPoster = async () => {
      try {
        const apiKey = "f7ab0059bfd1e541fa8b3fb3d709517a"; // Teri TMDB API Key
        // Movie ke naam se search karke photo nikalna
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie.title)}`;
        
        const res = await fetch(searchUrl);
        const data = await res.json();
        
        // Agar photo mil gayi toh usko set kar do
        if (data.results && data.results.length > 0 && data.results[0].poster_path) {
          setPoster(`https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`);
        }
      } catch (error) {
        console.error("Poster nahi mila:", error);
      }
    };

    fetchPoster();
  }, [movie.title]);

  return (
    <div className="bg-[#1a1c29] border border-white/5 rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300 shadow-lg">
      
      {/* Poster Image Area */}
      <div className="h-64 sm:h-72 bg-slate-800 relative flex items-center justify-center">
        {poster ? (
          <img 
            src={poster} 
            alt={movie.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          // Agar TMDB par kisi wajah se photo na mile, toh fallback design dikhega
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-slate-900 flex items-center justify-center text-center p-4">
            <span className="text-slate-300 font-bold text-sm leading-tight drop-shadow-md">
              {movie.title}
            </span>
          </div>
        )}
      </div>

      {/* Movie Info & Download Button */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-white font-bold truncate" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span>📅 {movie.year}</span>
            <span className="text-slate-500">•</span>
            <span>{movie.type}</span>
          </p>
        </div>

        {/* The Action Button */}
        <a 
          href={movie.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download / Watch
        </a>
      </div>
    </div>
  );
}