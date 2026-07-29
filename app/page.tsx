import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import AdBanner from "@/components/AdBanner";
import telegramLinks from "@/data/telegramlink.json";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  media_type: string;
  original_language?: string;
}

async function getRichContent(cat: string, query: string) {
  const itemsMap = new Map<number, MediaItem>();

  // 1. Database se saved items load karo
  const keys = Object.keys(telegramLinks);
  for (const key of keys) {
    const parts = key.split('_');
    if (parts.length !== 2) continue;
    const mediaType = parts[0];
    const id = parseInt(parts[1], 10);

    try {
      const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
      if (res.ok) {
        const data = await res.json();
        itemsMap.set(data.id, {
          id: data.id,
          title: data.title,
          name: data.name,
          release_date: data.release_date,
          first_air_date: data.first_air_date,
          poster_path: data.poster_path,
          media_type: mediaType,
          original_language: data.original_language
        });
      }
    } catch {}
  }

  // 2. TMDB se trending aur popular items fetch karke catalog bada karo
  for (let page = 1; page <= 3; page++) {
    try {
      let url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&page=${page}`;
      if (cat === 'web-series') {
        url = `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`;
      } else if (cat === 'bollywood') {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&page=${page}`;
      } else if (cat === 'hollywood') {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=en&page=${page}`;
      } else if (cat === 'south-hindi') {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=te|ta|ml|kn&page=${page}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        data.results?.forEach((item: MediaItem) => {
          const mType = item.media_type || (cat === 'web-series' ? 'tv' : 'movie');
          if (!itemsMap.has(item.id)) {
            itemsMap.set(item.id, {
              id: item.id,
              title: item.title,
              name: item.name,
              release_date: item.release_date,
              first_air_date: item.first_air_date,
              poster_path: item.poster_path,
              media_type: mType,
              original_language: item.original_language
            });
          }
        });
      }
    } catch {}
  }

  let allItems = Array.from(itemsMap.values());

  // Search Query Filter
  if (query) {
    const q = query.toLowerCase();
    allItems = allItems.filter(i => (i.title || i.name || "").toLowerCase().includes(q));
  } else {
    if (cat === 'web-series') {
      allItems = allItems.filter(i => i.media_type === 'tv');
    } else if (cat === 'bollywood') {
      allItems = allItems.filter(i => i.media_type === 'movie' && (i.original_language === 'hi' || !i.original_language));
    } else if (cat === 'hollywood') {
      allItems = allItems.filter(i => i.media_type === 'movie' && i.original_language === 'en');
    } else if (cat === 'south-hindi') {
      allItems = allItems.filter(i => i.media_type === 'movie');
    }
  }

  return allItems;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const params = await searchParams;
  const currentCat = params.cat || "all";
  const searchQuery = params.q || "";
  const items = await getRichContent(currentCat, searchQuery);

  return (
    <main className="min-h-screen bg-[#050507] text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* 🔍 Search Bar & Horizontal Category Pills Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          
          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar w-full md:w-auto">
            <Link 
              href="/" 
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'all' && !searchQuery ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
            >
              🔥 All Releases
            </Link>
            <Link 
              href="/?cat=web-series" 
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'web-series' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
            >
              📺 Web Series
            </Link>
            <Link 
              href="/?cat=bollywood" 
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'bollywood' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
            >
              🎬 Bollywood
            </Link>
            <Link 
              href="/?cat=hollywood" 
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'hollywood' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
            >
              🌍 Hollywood
            </Link>
            <Link 
              href="/?cat=south-hindi" 
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'south-hindi' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
            >
              ⚡ South Hindi
            </Link>
          </div>

          {/* Working Search Form */}
          <form method="GET" action="/" className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              name="q" 
              defaultValue={searchQuery}
              placeholder="Search movies, series..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all backdrop-blur-xl"
            />
          </form>

        </div>

        {/* 📢 Ad Banner 1 (Top) */}
        <div className="w-full">
          <AdBanner />
        </div>

        {/* 🎬 Content Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-wide border-l-4 border-white pl-4 uppercase">
              {searchQuery ? `Search Results for "${searchQuery}"` : (currentCat === 'all' ? 'Trending Vault' : `${currentCat.replace('-', ' ')} Catalog`)}
            </h2>
          </div>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item: MediaItem) => {
                const rawDate = item.release_date || item.first_air_date || "2026";
                const yearNum = parseInt(rawDate.split('-')[0], 10);
                
                return (
                  <MovieCard 
                    key={item.id}
                    id={item.id} 
                    title={item.title || item.name || "Unknown"}
                    year={isNaN(yearNum) ? 2026 : yearNum}
                    imageUrl={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb"}
                    category={item.media_type === 'tv' ? "Web Series" : "Movie"}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
              <p className="text-neutral-400 text-lg">No movies found.</p>
            </div>
          )}
        </div>

        {/* 📢 Ad Banner 2 (Bottom) */}
        <div className="w-full mt-6">
          <AdBanner />
        </div>

      </div>
    </main>
  );
}