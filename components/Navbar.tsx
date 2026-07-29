import Link from "next/link";
import { Home, Film, Tv, Clapperboard, Video } from "lucide-react";

export default function Navbar() {
  return (
    <>
      {/* 🖥️ Desktop Glassmorphism Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-950/40 backdrop-blur-2xl border-r border-white/10 p-6 flex-col justify-between z-50 hidden md:flex shadow-2xl">
        <div>
          {/* Brand Name */}
          <div className="flex items-center gap-2 mb-10 px-2">
            <h1 className="text-2xl font-black tracking-wider text-white">MOVIE <span className="text-neutral-500">VAULT</span></h1>
          </div>

          {/* Categories Sidebar */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-2">Navigation</p>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white text-black font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02]">
                  <Home size={20} /> Home
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-2">Vault Categories</p>
              <nav className="flex flex-col gap-2">
                <Link href="/explore?cat=web-series" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all font-medium border border-transparent hover:border-white/10">
                  <Tv size={20} /> Web Series
                </Link>
                <Link href="/explore?cat=bollywood" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all font-medium border border-transparent hover:border-white/10">
                  <Clapperboard size={20} /> Bollywood Movie
                </Link>
                <Link href="/explore?cat=hollywood" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all font-medium border border-transparent hover:border-white/10">
                  <Film size={20} /> Hollywood Movie
                </Link>
                <Link href="/explore?cat=south-hindi" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all font-medium border border-transparent hover:border-white/10">
                  <Video size={20} /> South Hindi Movie
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Profile badge */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-black shadow-inner">
            MV
          </div>
          <div>
            <p className="text-sm font-bold text-white">Movie Vault</p>
            <p className="text-xs text-neutral-400">Active Vault</p>
          </div>
        </div>
      </aside>

      {/* 📱 Mobile & Tablet Glassmorphism Top Bar with Horizontal Pills */}
      <div className="md:hidden w-full bg-neutral-950/60 backdrop-blur-2xl border-b border-white/10 px-4 py-3 sticky top-0 z-50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-black tracking-wider text-white">MOVIE <span className="text-neutral-500">VAULT</span></h1>
        </div>
        
        {/* Horizontal Scrollable Glass Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Link href="/" className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold whitespace-nowrap shadow-md">
            Home
          </Link>
          <Link href="/explore?cat=web-series" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium whitespace-nowrap border border-white/10 backdrop-blur-md">
            Web Series
          </Link>
          <Link href="/explore?cat=bollywood" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium whitespace-nowrap border border-white/10 backdrop-blur-md">
            Bollywood
          </Link>
          <Link href="/explore?cat=hollywood" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium whitespace-nowrap border border-white/10 backdrop-blur-md">
            Hollywood
          </Link>
          <Link href="/explore?cat=south-hindi" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium whitespace-nowrap border border-white/10 backdrop-blur-md">
            South Hindi
          </Link>
        </div>
      </div>
    </>
  );
}