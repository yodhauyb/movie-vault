/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";

const TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a";

// TypeScript ko batana zaroori hai ki movie ka data kaisa hai
interface TMDBMovie {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string;
  vote_average?: number;
}

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let movie = null;
  let similarMovies: TMDBMovie[] = []; // Yahan any hata kar TMDBMovie lagaya

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
    if (res.ok) {
      movie = await res.json();
    }

    const similarRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    if (similarRes.ok) {
      const similarData = await similarRes.json();
      similarMovies = similarData.results ? similarData.results.slice(0, 10) : [];
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <h1 className="text-2xl text-red-500 font-bold">⚠️ Movie details not found!</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          <div className="w-full md:w-1/3 shrink-0">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"} 
              alt={movie.title}
              className="w-full rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.1)] border border-neutral-800"
            />
          </div>

          <div className="w-full md:w-2/3 mt-4 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-tight">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-8 font-medium">
              <span className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full border border-amber-500/20">
                {movie.release_date?.split('-')[0] || "2026"}
              </span>
              <span className="bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-800">
                {movie.runtime ? `${movie.runtime} mins` : 'Duration N/A'}
              </span>
              <span className="bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-800 flex items-center gap-1">
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span className="uppercase border border-neutral-700 text-neutral-400 px-2 rounded-sm text-xs py-1">HD</span>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl">
              {movie.overview || "No description available for this movie."}
            </p>
            
            <div className="flex">
              <a 
                href={`https://www.google.com/search?q=site:hdhub4u.tv+OR+${encodeURIComponent(movie.title)}+hdhub4u+hindi+dub+download`}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download from HDHub4u
              </a>
            </div>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div className="mt-24 w-full">
            <h2 className="text-2xl font-bold mb-8 border-l-4 border-amber-500 pl-4 text-white">
              Recommended Movies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarMovies.map((simMovie: TMDBMovie) => (
                <MovieCard 
                  key={simMovie.id}
                  id={simMovie.id} 
                  title={simMovie.title || simMovie.original_title || "Unknown"}
                  year={simMovie.release_date ? parseInt(simMovie.release_date.split('-')[0]) : 2026}
                  imageUrl={simMovie.poster_path ? `https://image.tmdb.org/t/p/w500${simMovie.poster_path}` : "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop"}
                  category="Similar"
                />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}