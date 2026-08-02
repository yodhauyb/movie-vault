'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import telegramLinks from "@/data/telegramlink.json";
import AdBanner from "@/components/AdBanner"; 
import SquareAd from "@/components/SquareAd"; 
import { Search, Film, Tv, Star, Play, Home, ArrowRight, X, User, Coins, Wallet, History, ChevronRight } from "lucide-react";

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
  
  // 🧑‍💻 User State for Popup & Profile
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [tempName, setTempName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [userCoins, setUserCoins] = useState(0);

  const DIRECT_AD_LINK = "https://www.effectivecpmnetwork.com/zcavyp0r?key=f0cab9cdce909f11003571d769eaef2e"; 

  const handleMovieClick = () => {
    if(DIRECT_AD_LINK) {
      window.open(DIRECT_AD_LINK, '_blank');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      
      const savedName = localStorage.getItem("vault_username");
      const savedCoins = localStorage.getItem("vault_coins");

      if (savedName) {
        setUsername(savedName);
        setUserCoins(savedCoins ? parseInt(savedCoins) : 0);
      } else {
        setShowPopup(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveUser = () => {
    if (tempName.trim().length > 2) {
      const name = tempName.trim();
      localStorage.setItem("vault_username", name);
      localStorage.setItem("vault_coins", "50"); // 50 Coins Welcome Bonus
      setUsername(name);
      setUserCoins(50);
      setShowPopup(false);
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
      };
    });

    return mappedList.reverse();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = movies;
    if (activeTab === "Movies") filtered = filtered.filter(m => m.type === "Movie");
    if (activeTab === "Web Series") filtered = filtered.filter(m => m.type === "Web Series");
    
    if (searchQuery.trim() && activeTab !== "Profile") {
      filtered = filtered.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    }
    return filtered;
  }, [movies, searchQuery, activeTab]);

  const displayItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (activeTab === "Profile") return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length));
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [filteredItems.length, activeTab]);

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen flex bg-[#07090e] text-white font-[Outfit] selection:bg-red-500/30 w-full overflow-x-hidden">
      
      {/* 🛑 FIRST TIME USER POPUP */}
      {isClient && showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#11141d] border border-white/10 p-8 rounded-3xl max-w-sm w-full relative shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <User className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Welcome to VAULT</h2>
            <p className="text-sm text-gray-400 mb-6">Enter a username to start earning Vault Coins. <br/><span className="text-green-400 font-bold">Sign up bonus: 50 Coins!</span></p>
            
            <input 
              type="text" 
              placeholder="Enter Username..." 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full bg-[#161922] border border-red-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-4"
            />
            <button 
              onClick={handleSaveUser}
              disabled={tempName.trim().length < 3}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
            >
              Start Watching
            </button>
          </div>
        </div>
      )}

      {/* 🖥️ DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-72 flex-col justify-between border-r border-white/5 glass-sidebar p-6 z-40 overflow-hidden">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            VAULT
          </h1>

          {/* DESKTOP TOP BAR (Username & Coins) */}
          <div className="flex items-center justify-between gap-2 mb-8">
            <div 
              onClick={() => setActiveTab("Profile")}
              className="cursor-pointer flex-1 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)] flex items-center justify-center gap-1.5"
            >
              <Coins className="w-4 h-4" />
              {isClient ? userCoins : 0}
            </div>
            <div 
              onClick={() => setActiveTab("Profile")}
              className="cursor-pointer flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)] flex items-center justify-center gap-2 truncate"
            >
              <User className="w-4 h-4" />
              {isClient ? (username || "Guest") : "..."}
            </div>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveTab("Home"); setVisibleCount(18); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pl-2">Menu</p>
            {[
              { name: 'Home', icon: Home },
              { name: 'Movies', icon: Film },
              { name: 'Web Series', icon: Tv },
              { name: 'Profile', icon: User } 
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
          <div className="mb-6 w-full flex justify-center bg-white/5 rounded-xl border border-white/10 overflow-hidden p-2">
             <AdBanner />
          </div>
          <div className="text-xs text-gray-500 px-2">
            <p>© 2026 Movie Vault</p>
          </div>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT AREA */}
      <main className="w-full lg:ml-72 flex-1 relative pb-28 md:pb-16 min-h-screen">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-7xl mx-auto px-4 md:px-10 pt-6 md:pt-12">
          
          {/* 📱 MOBILE TOP BAR (Coins & Username Added) */}
          <div className="flex items-center justify-between mb-4 w-full">
            <h1 className="text-2xl font-black text-red-600 tracking-tighter">VAULT</h1>
            <div className="flex items-center gap-2">
              {/* 🪙 COIN BADGE */}
              <div 
                onClick={() => setActiveTab("Profile")}
                className="cursor-pointer px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)] flex items-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5" />
                {isClient ? userCoins : 0}
              </div>

              {/* 🧑 USER BADGE */}
              <div 
                onClick={() => setActiveTab("Profile")}
                className="cursor-pointer px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)] flex items-center gap-2"
              >
                <User className="w-3 h-3" />
                {isClient ? (username || "Guest") : "..."}
              </div>
            </div>
          </div>

          {/* 🔍 SEARCH BAR */}
          {activeTab !== "Profile" && (
            <div className="w-full mb-4 relative z-50">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <input 
                  type="text" 
                  placeholder="🔍 Search movies, web series here..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(18); }}
                  className="w-full bg-[#161922] border-2 border-red-500/60 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white bg-white/10 p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 📱 MOBILE TABS */}
          {activeTab !== "Profile" && (
            <div className="flex overflow-x-auto gap-3 pb-2 mb-3 snap-x hide-scrollbar w-full">
              {['Home', 'Movies', 'Web Series'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setVisibleCount(18); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`snap-start whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'glass border border-white/10 text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* 📱 MOBILE AD BANNER */}
          <div className="flex justify-center w-full mb-6">
            <div className="w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center py-2">
              <AdBanner />
            </div>
          </div>

          {/* ==================================================== */}
          {/* 🧑‍💻 PROFILE & WALLET TAB VIEW */}
          {/* ==================================================== */}
          {activeTab === "Profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-red-500" /> My Profile
              </h2>

              {/* Profile Card */}
              <div className="glass border border-white/10 rounded-3xl p-6 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-purple-800 flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white/10">
                  {isClient && username ? username.charAt(0).toUpperCase() : "V"}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{isClient ? (username || "Guest User") : "Loading..."}</h3>
                  <p className="text-sm text-gray-400">Vault Member</p>
                </div>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-r from-[#1a1412] to-[#12160d] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl mb-8">
                <div className="absolute -right-6 -top-6 opacity-5">
                  <Wallet className="w-40 h-40" />
                </div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-gray-300">Vault Wallet</span>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-bold text-green-400">
                    1 Coin = ₹1 Rupee
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-sm text-gray-400 mb-1">Total Balance</p>
                  <div className="flex items-end gap-2">
                    <h1 className="text-5xl font-black text-white">{isClient ? userCoins : 0}</h1>
                    <span className="text-xl font-bold text-yellow-500 mb-1">Coins</span>
                  </div>
                  <p className="text-sm text-green-400 mt-2 font-semibold">≈ ₹{isClient ? userCoins : 0} INR</p>
                </div>

                <div className="mt-8 relative z-10">
                  <button className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] flex justify-center items-center gap-2">
                    Request Withdrawal <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-3">*Withdrawals are processed manually for selected top users.</p>
                </div>
              </div>

              {/* Rules / Info */}
              <div className="glass border border-white/10 rounded-2xl p-5 mb-10">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-sm"><History className="w-4 h-4 text-red-500"/> How to Earn?</h4>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex gap-2"><span>1.</span> Watch movies & series daily to collect hidden coins.</li>
                  <li className="flex gap-2"><span>2.</span> Keep your rank high on the platform.</li>
                  <li className="flex gap-2"><span>3.</span> Real cash is rewarded to selected top active members.</li>
                </ul>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* 🌟 HERO & MOVIE GRID SECTION */}
          {/* ==================================================== */}
          {activeTab !== "Profile" && (
            <>
              {/* HERO SECTION */}
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

              {/* 🔥 SQUARE AD BANNER */}
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
                    <p>No results found</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      {/* 📱 MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass border border-white/15 rounded-full px-6 py-3.5 flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-[#0c0e15]/90 backdrop-blur-xl">
        {[
          { name: 'Home', icon: Home, tab: "Home" },
          { name: 'Movies', icon: Film, tab: "Movies" },
          { name: 'Series', icon: Tv, tab: "Web Series" },
          { name: 'Profile', icon: User, tab: "Profile" } 
        ].map((item) => (
          <button 
            key={item.name} 
            onClick={() => { 
              setActiveTab(item.tab); 
              setVisibleCount(18); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === item.tab ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
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