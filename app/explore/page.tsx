import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import telegramLinks from "@/data/telegramlink.json";
import Link from "next/link";

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

async function getExploreContent(cat: string) {
  const items: MediaItem[] = [];

  const keys = Object.keys(telegramLinks);
  for (const key of keys) {
    const parts = key.split('_');
    if (parts.length !== 2) continue;
    const mediaType = parts[0];
    const id = parts[1];

    try {
      const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
      if (res.ok) {
        const data = await res.json();
        const item: MediaItem = {
          id: data.id,
          title: data.title,
          name: data.name,
          release_date: data.release_date,
          first_air_date: data.first_air_date,
          poster_path: data.poster_path,
          media_type: mediaType,
          original_language: data.original_language
        };

        if (cat === 'web-series' && mediaType === 'tv') items.push(item);
        else if (cat === 'bollywood' && mediaType === 'movie' && data.original_language === 'hi') items.push(item);
        else if (cat === 'hollywood' && mediaType === 'movie' && data.original_language === 'en') items.push(item);
        else if (cat === 'south-hindi' && mediaType === 'movie') items.push(item);
        else if (!cat || cat === 'all') items.push(item);
      }
    } catch {}
  }

  // Fallback / Fill with trending data matching category
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US`);
    if (res.ok) {
      const data = await res.json();
      data.results?.forEach((item: MediaItem) => {
        if ((item.media_type === 'movie' || item.media_type === 'tv') && !items.some(i => i.id === item.id)) {
          if (cat === 'web-series' && item.media_type !== 'tv') return;
          if (cat === 'bollywood' && item.media_type !== 'movie') return;
          items.push(item);
        }
      });
    }
  } catch {}

  return items;
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const params = await searchParams;
  const currentCat = params.cat || "web-series";
  const items = await getExploreContent(currentCat);

  const categoryTitles: Record<string, string> = {
    "web-series": "Web Series Vault",
    "bollywood": "Bollywood Movies",
    "hollywood": "Hollywood Movies",
    "south-hindi": "South Hindi Movies"
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* 🏷️ Horizontal Category Pills / Tabs Bar */}
        <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar border-b border-white/10 pb-4">
          <Link 
            href="/" 
            className="px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10"
          >
            🔥 All Releases
          </Link>
          <Link 
            href="/explore?cat=web-series" 
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'web-series' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
          >
            📺 Web Series
          </Link>
          <Link 
            href="/explore?cat=bollywood" 
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'bollywood' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
          >
            🎬 Bollywood Movies
          </Link>
          <Link 
            href="/explore?cat=hollywood" 
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'hollywood' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
          >
            🌍 Hollywood Movies
          </Link>
          <Link 
            href="/explore?cat=south-hindi" 
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-xl border ${currentCat === 'south-hindi' ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'}`}
          >
            ⚡ South Hindi Movies
          </Link>
        </div>

        {/* 🎬 Content Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-wide border-l-4 border-white pl-4 uppercase">
              {categoryTitles[currentCat] || "Explore Vault"}
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
              <p className="text-neutral-400 text-lg">No content found in this category.</p>
              <p className="text-neutral-600 text-sm mt-1">Try running `add_movie.py` to add titles.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}