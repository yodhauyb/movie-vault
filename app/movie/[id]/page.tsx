import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Star, Clock, Calendar, Send, XCircle } from "lucide-react";

// 🔥 LOCAL JSON DATABASE IMPORT 🔥
import movieLinks from "@/data/telegramlink.json";

async function getMovieDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.id);

  if (!movie) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-3xl font-bold mt-20 text-red-500">Movie Not Found!</h1>
        <Link href="/" className="mt-6 text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </main>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop";
    
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : null;

  // SYSTEM LOGIC: Direct local JSON file se link uthayega
  const downloadLink = (movieLinks as Record<string, string>)[movie.id.toString()];

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <Image src={backdropUrl} alt={movie.title || "Movie"} fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
          {posterUrl && (
            <div className="hidden md:block w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <Image src={posterUrl} alt={movie.title || "Poster"} width={256} height={384} className="w-full h-auto object-cover" />
            </div>
          )}
          
          <div className="flex-1 pb-4">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Movies
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6">
              <div className="flex items-center gap-1 text-yellow-500 font-semibold bg-gray-900/50 px-3 py-1 rounded-full border border-yellow-500/20">
                <Star className="w-4 h-4 fill-yellow-500" />
                {movie.vote_average?.toFixed(1) || "N/A"} / 10
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                <Calendar className="w-4 h-4" />
                {movie.release_date || "N/A"}
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                <Clock className="w-4 h-4" />
                {movie.runtime || 0} mins
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre: { id: number, name: string }) => (
                <span key={genre.id} className="px-4 py-1 bg-red-600/20 text-red-500 font-medium border border-red-600/30 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <p className="text-gray-300 text-lg max-w-3xl leading-relaxed mb-8">
              {movie.overview || "Story abhi available nahi hai."}
            </p>

            {/* 🔥 BUTTON UI 🔥 */}
            {downloadLink ? (
              <a 
                href={downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-[#0088cc]/30"
              >
                <Send className="w-5 h-5" />
                Download via Telegram
              </a>
            ) : (
              <button 
                disabled
                className="inline-flex items-center gap-2 bg-gray-800 text-gray-400 font-bold py-3 px-8 rounded-full cursor-not-allowed border border-gray-700"
              >
                <XCircle className="w-5 h-5" />
                Download Not Available Yet
              </button>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}