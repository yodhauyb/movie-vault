import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieCard from "@/components/MovieCard";

interface TMDBMovie {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string;
  overview?: string;
  backdrop_path?: string;
}

const FALLBACK_MOVIES = [
  {
    id: 857598,
    title: "Pushpa 2 The Rule",
    release_date: "2024-12-05",
    poster_path: "",
    backdrop_path: "",
    overview: "Pushpa Raj rule continues in the sequel."
  }
];

async function getTrendingIndianMovies() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=IN&language=en-US&sort_by=popularity.desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return FALLBACK_MOVIES;
    const data = await res.json();
    return data.results && data.results.length > 0 ? data.results : FALLBACK_MOVIES;
  } catch (error) {
    return FALLBACK_MOVIES;
  }
}

export default async function Home() {
  const trendingMovies = await getTrendingIndianMovies();

  const heroMovie = trendingMovies[0] || FALLBACK_MOVIES[0];
  const featuredMovie = {
    id: heroMovie.id,
    title: heroMovie.title || heroMovie.original_title || "Movie Vault",
    description: heroMovie.overview || "Welcome to Movie Vault.",
    releaseYear: heroMovie.release_date ? parseInt(heroMovie.release_date.split('-')[0]) : 2024,
    categories: ["Indian", "Trending"], 
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop"
  };

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      <Hero movie={featuredMovie} />
      
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-3">🔥 Trending in India</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingMovies.slice(1, 9).map((movie: TMDBMovie) => (
            <MovieCard 
              key={movie.id}
              id={movie.id} 
              title={movie.title || movie.original_title || "Unknown"}
              year={movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 2024}
              imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop"}
              category="Trending"
            />
          ))}
        </div>
      </section>
    </main>
  );
}