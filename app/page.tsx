// FILE: frontend/app/page.tsx
// YE MAIN HOME PAGE HAI JAHAN SAARI MOVIES AAYENGI

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";

interface TMDBMovie {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string;
  overview?: string;
  backdrop_path?: string;
}

async function getTrendingIndianMovies() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=IN&language=en-US&sort_by=popularity.desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
}

async function getTopRatedIndianMovies() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=IN&language=en-US&sort_by=vote_average.desc&vote_count.gte=100`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const [trendingMovies, topRatedMovies] = await Promise.all([
    getTrendingIndianMovies(),
    getTopRatedIndianMovies(),
  ]);

  if (!trendingMovies || trendingMovies.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-2xl mt-20 text-red-500">VPN/Network check karein.</h1>
      </main>
    );
  }

  const heroMovie = trendingMovies[0];
  const featuredMovie = {
    id: heroMovie.id,
    title: heroMovie.title || heroMovie.original_title || "Unknown Title",
    description: heroMovie.overview || "No description available.",
    releaseYear: heroMovie.release_date ? parseInt(heroMovie.release_date.split('-')[0]) : 2024,
    categories: ["Indian", "Trending"], 
    imageUrl: heroMovie.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` 
      : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop"
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
              imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ""}
              category="Trending"
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-500 pl-3">⭐ Top Rated All Time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topRatedMovies.slice(0, 8).map((movie: TMDBMovie) => (
            <MovieCard 
              key={movie.id}
              id={movie.id}
              title={movie.title || movie.original_title || "Unknown"}
              year={movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 2024}
              imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ""}
              category="Top Rated"
            />
          ))}
        </div>
      </section>
    </main>
  );
}