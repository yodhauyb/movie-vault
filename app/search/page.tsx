import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a";

interface TMDBMovie {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  // Next.js 15+ mein searchParams ko await karna padta hai
  const { q } = await searchParams;

  let searchResults: TMDBMovie[] = [];
  
  if (q) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&language=en-US&page=1`);
      if (res.ok) {
        const data = await res.json();
        searchResults = data.results || [];
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-amber-500 pl-4">
          {q ? `Search Results for "${q}"` : "Search for a Movie"}
        </h2>
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {searchResults.map((movie: TMDBMovie) => (
              <MovieCard 
                key={movie.id}
                id={movie.id} 
                title={movie.title || movie.original_title || "Unknown"}
                year={movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 2026}
                imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop"}
                category="Search Result"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <p className="text-xl">
              {q ? `No movies found for "${q}". Try a different name!` : "Type a movie name in the search bar above."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}