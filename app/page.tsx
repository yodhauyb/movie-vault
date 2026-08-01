'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import telegramLinks from "@/data/telegramlink.json";
import AdBanner from "@/components/AdBanner"; 
import SquareAd from "@/components/SquareAd"; 
import { Search, Film, Tv, Star, Play, Home, User, ArrowRight } from "lucide-react";

interface MovieItem {
  id: string;
  originalKey: string;
  title: string;
  year: string;
  type: string;
  link: string;
  poster_url: string | null;
  rating: number;
  description?: string;
}

type TelegramLinkValue = string | { link: string; poster?: string | null; type?: string; year?: string; rating?: number; description?: string };

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [visibleCount, setVisibleCount] = useState(18);

  const DIRECT_AD_LINK = "https://blessingrecordpleasant.com/zd815d82xk?key=7617951c76724b05445e6f3e843d4f44"; 

  const handleMovieClick = () => {
    if(DIRECT_AD_LINK) {
      window.open(DIRECT_AD_LINK, '_blank');
    }
  };

  const movies = useMemo(() => {
    const vaultData = (telegramLinks as Record<string, TelegramLinkValue>) || {};
    const entries = Object.entries(vaultData);

    const mappedList: MovieItem[] = entries.map(([key, val], index) => {
      let title = "";
      const url = typeof val === 'string' ? val : val?.link;
      const poster = typeof val === 'string' ? null : val?.poster;
      const customType = typeof val === 'object' ? val?.type : null;
      const customYear = typeof val === 'object' ? val?.year : null;
      const rating = typeof val === 'object' && val?.rating ? val.rating : 8.5; 
      
      const cleanKey = key.replace(/^movie_/, '').replace(/^series_/, '').replace(/_/g, ' ').trim();
      
      let movieYear = customYear || "2025"; 
      if (!customYear) {
        const yearMatch = url ? url.match(/(19\d{2}|20\d{2})/) : null;
        if (yearMatch) { movieYear = yearMatch[0]; }
      }

      if (cleanKey.length > 2 && !cleanKey.match(/^\d+$/)) {
        title = cleanKey.replace(/\b\w/g, (char: string) => char.toUpperCase());
      } else {
        try {
          const urlParts = url ? url.split('/').filter(Boolean) : [];
          let slug = urlParts[urlParts.length - 1] || "";
          slug = slug.replace(/-\d{4}.*/, '').replace(/-/g, ' ').trim();
          title = slug ? slug.replace(/\b\w/g, (char: string) => char.toUpperCase()) : `Vault Item ${index + 1}`;
        } catch { title = `Vault Item ${index + 1}`; }
      }

      let finalType = "Movie";
      if (customType === "series" || key.includes("_show") || key.includes("season") || title.toLowerCase().includes("series")) {
        finalType = "Web Series";
      }

      return {
        id: `vault_${key}_${index}`,
        originalKey: key, 
        title: title,
        year: movieYear,
        type: finalType,
        link: url || "#",
        poster_url: poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
        rating: rating,
        description: "Experience this cinematic masterpiece in full HD. Fast download and seamless streaming.",
      };
    });

    return mappedList.reverse();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = movies;
    if (activeTab === "Movies") filtered = filtered.filter(m => m.type === "Movie");
    if (activeTab === "Web Series") filtered = filtered.filter(m => m.type === "Web Series");
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    }
    return filtered;
  }, [movies, searchQuery, activeTab]);

  const displayItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length));
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [filteredItems.length]);

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen flex bg-[#07090e] text-white font-[Outfit] selection:bg-red-500/30">
      
      {/* 🖥️ DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-72 flex-col justify-between border-r border-white/5 glass-sidebar p-6 z-40 overflow-hidden">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-red-600 mb-10 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            VAULT
          </h1>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(18); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pl-2">Menu</p>
            {[
              { name: 'Home', icon: Home },
              { name: 'Movies', icon: Film },
              { name: 'Web Series', icon: Tv }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveTab(item.name); setVisibleCount(18); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.name 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          {/* 🔥 SIDEBAR BANNER AD FIXED */}
          <div className="mb-6 w-full flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden p-2">
             <AdBanner />
          </div>

          <div className="text-xs text-gray-500 px-2">
            <p>© 2026 Movie Vault</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 relative pb-24 md:pb-16 min-h-screen">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-8 md:pt-12">
          
          <div className="flex md:hidden items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-red-600">VAULT</h1>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="md:hidden flex overflow-x-auto gap-3 pb-4 mb-6 snap-x hide-scrollbar">
            {['Home', 'Movies', 'Web Series'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setVisibleCount(18); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`snap-start whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                  : 'glass border border-white/10 text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 📱 MOBILE AD BANNER */}
          <div className="md:hidden flex justify-center w-full mb-6">
            <div className="w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center py-2">
              <AdBanner />
            </div>
          </div>

          {/* 🌟 HERO SECTION */}
          {featuredMovie && activeTab === "Home" && !searchQuery && (
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl group">
              <img src={featuredMovie.poster_url as string} alt={featuredMovie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start">
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[10px] font-bold text-green-400 border border-white/10">{featuredMovie.rating} Match</span>
                  <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[10px] font-bold border border-white/10">{featuredMovie.year}</span>
                  <span className="px-2 py-0.5 bg-red-600/30 backdrop-blur-md rounded text-[10px] font-bold border border-red-500/30 text-red-300">{featuredMovie.type}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-lg max-w-xl">
                  {featuredMovie.title}
                </h2>
                
                <Link 
                  href={`/movie/${featuredMovie.originalKey}`} 
                  onClick={handleMovieClick}
                  className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-black" /> Watch Now
                </Link>
              </div>
            </div>
          )}

          {/* 🔥 300x250 SQUARE AD BANNER */}
          <div className="flex justify-center w-full my-10">
            <SquareAd />
          </div>

          {/* 🎬 GRID SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {searchQuery ? "Search Results" : activeTab === "Home" ? "Trending Now" : activeTab}
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </h3>
              <span className="text-xs text-gray-500">Showing {displayItems.length} of {filteredItems.length}</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {displayItems.map((item) => (
                <Link 
                  href={`/movie/${item.originalKey}`} 
                  key={item.id} 
                  onClick={handleMovieClick}
                  className="group block relative rounded-2xl overflow-hidden glass border border-white/5 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:z-30 hover:shadow-[0_20px_40px_rgba(220,38,38,0.2)] hover:border-white/20"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-[#11141d]">
                    <img src={item.poster_url as string} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-400 border border-white/10 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-yellow-400" /> {item.rating}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold text-red-500 mb-1">{item.type.toUpperCase()}</p>
                    <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  </div>
                </Link>
              ))}
            </div>

            {displayItems.length < filteredItems.length && (
              <div className="py-10 text-center">
                <p className="text-xs text-gray-500 animate-pulse">Loading more movies...</p>
              </div>
            )}
            
            {displayItems.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No results found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 📱 MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-sm glass border border-white/10 rounded-full px-6 py-3.5 flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {[
          { name: 'Home', icon: Home, tab: "Home" },
          { name: 'Movies', icon: Film, tab: "Movies" },
          { name: 'Series', icon: Tv, tab: "Web Series" },
          { name: 'Profile', icon: User, tab: "Profile" }
        ].map((item) => (
          <button 
            key={item.name} 
            onClick={() => { if(item.tab !== "Profile") { setActiveTab(item.tab); setVisibleCount(18); window.scrollTo({ top: 0, behavior: 'smooth' }); }}}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.tab ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.tab ? 'fill-red-500/20' : ''}`} />
          </button>
        ))}
      </div>

      <style>{`
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); }
        .glass-sidebar { background: rgba(10, 12, 20, 1); border-right: 1px solid rgba(255,255,255,0.05); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}