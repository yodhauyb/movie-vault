'use client';

import React from 'react';

interface Movie {
  id: string;
  title: string;
  year: string;
  type: string;
  link: string;
  poster_url: string | null;
  isNew?: boolean;
}

interface PosterCardProps {
  movie: Movie;
}

export default function PosterCard({ movie }: PosterCardProps) {
  const cleanTitle = movie.title.trim();
  const encodedTitle = encodeURIComponent(cleanTitle);

  // 🔥 अगर Python स्क्रिप्ट से असली पोस्टर आया है तो वो दिखाओ, वरना लाल वाला फॉलबैक दिखाओ
  const posterSrc = movie.poster_url || `https://placehold.co/500x750/0b0f19/ef4444.png?text=${encodedTitle}`;

  return (
    <div className="group relative bg-[#0e1420] border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-red-500/50 hover:shadow-red-500/20 transition-all duration-300 flex flex-col justify-between">
      
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        
        <img 
          src={posterSrc}
          alt={cleanTitle}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // अगर बाय चांस TMDB का लिंक टूट जाए, तो यह सुंदर लाल फॉलबैक दिखाएगा
            target.src = `https://placehold.co/500x750/0b0f19/ef4444.png?text=${encodedTitle}`;
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40 pointer-events-none"></div>

        {/* NEW 🔥 Badge */}
        {movie.isNew && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg tracking-wider uppercase animate-pulse z-10">
            NEW 🔥
          </span>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10 z-10">
          {movie.type}
        </div>
      </div>

      {/* Content & Action */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-[#121824]/90 backdrop-blur-md border-t border-white/5">
        <div>
          <h3 className="font-bold text-sm md:text-base text-white line-clamp-1 group-hover:text-red-500 transition-colors" title={cleanTitle}>
            {cleanTitle}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>📅 {movie.year}</span>
            <span>•</span>
            <span>{movie.type}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          <a
            href={movie.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95 cursor-pointer"
          >
            <span>▶ Watch / Download</span>
          </a>
        </div>
      </div>

    </div>
  );
}