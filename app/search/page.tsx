import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";

interface TMDBMovie {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string;
}

// TMDB ki Search API call karne ka function
async function searchMovies(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

// Next.js mein URL ke baad aane wale parameters (jaise ?q=don) yahan aate hain
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  
  let movies = [];
  if (query) {
    movies = await searchMovies(query);
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20 pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for: <span className="text-red-500">"{query}"</span>
        </h1>

        {movies.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">Koi movie nahi mili 😢</p>
            <p className="mt-2">Spelling check karein ya kuch aur search karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie: TMDBMovie) => (
              <MovieCard 
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.original_title || "Unknown"}
                year={movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 2024}
                imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop"}
                category="Result"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}