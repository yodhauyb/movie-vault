import Link from "next/link";

interface HeroMovieProps {
  movie: {
    id: number;
    title: string;
    description: string;
    releaseYear: number;
    categories: string[];
    imageUrl: string;
  };
}

export default function Hero({ movie }: HeroMovieProps) {
  if (!movie) return null;

  return (
    <div className="relative h-[60vh] sm:h-[80vh] w-full bg-neutral-900 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${movie.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-3">
            {movie.categories?.map((cat: string) => (
              <span key={cat} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
                {cat}
              </span>
            ))}
            <span className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded">
              {movie.releaseYear}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            {movie.title}
          </h1>
          
          <p className="text-gray-300 text-sm sm:text-base mb-8 line-clamp-3 max-w-lg drop-shadow-md">
            {movie.description}
          </p>
          
          <div className="flex gap-4">
            <Link 
              href={`/movie/${movie.id}`}
              className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-colors shadow-lg"
            >
              ▶ Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}