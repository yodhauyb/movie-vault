import Navbar from "@/components/Navbar";
import Image from "next/image";
import telegramLinks from "@/data/telegramlink.json";

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a";

async function fetchTMDBDetails(id: string) {
  let res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
  if (res.ok) {
    const data = await res.json();
    return { ...data, media_type: 'movie' };
  }
  
  res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
  if (res.ok) {
    const data = await res.json();
    return { ...data, media_type: 'tv' };
  }
  
  return null;
}

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const details = await fetchTMDBDetails(id);

  if (!details) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-2xl text-red-500">Content not found!</h1>
        </div>
      </div>
    );
  }

  const linkData = (telegramLinks as Record<string, string>)[`tv_${id}`] || (telegramLinks as Record<string, string>)[`movie_${id}`] || (telegramLinks as Record<string, string>)[id];
  
  let rawLinks = linkData ? linkData.split(" | ") : [];

  // 🎯 SMART FILTER: Agar web series hai, toh sirf main season/quality links filter karenge taaki 40 buttons na banein
  if (details.media_type === 'tv' && rawLinks.length > 5) {
    // Sirf un links ko rakhenge jisme season ya quality ka zikr ho, ya fir top 5-6 main links
    rawLinks = rawLinks.filter((link, idx) => idx < 6 || link.toLowerCase().includes('season') || link.toLowerCase().includes('s0'));
    if (rawLinks.length === 0) rawLinks = linkData.split(" | ").slice(0, 5); // Fallback
  }

  const title = details.title || details.name;
  const releaseYear = (details.release_date || details.first_air_date || "Unknown").split('-')[0];
  const imageUrl = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070";
  const backdropUrl = details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : imageUrl;

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      
      <div className="relative w-full h-[40vh] md:h-[60vh]">
        <div className="absolute inset-0">
          <Image src={backdropUrl} alt={title} fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="w-32 md:w-48 flex-shrink-0 rounded-lg overflow-hidden border-2 border-neutral-800 shadow-2xl">
              <Image src={imageUrl} alt={title} width={500} height={750} className="w-full h-auto object-cover" />
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {details.media_type === 'tv' ? 'Web Series' : 'Movie'}
                </span>
                <span className="text-neutral-400 font-medium">{releaseYear}</span>
                <span className="text-amber-500 font-bold">⭐ {details.vote_average ? details.vote_average.toFixed(1) : "NR"}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-neutral-300 text-sm md:text-base max-w-3xl line-clamp-3 md:line-clamp-none">
                {details.overview || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-amber-500 pl-4">Download Links</h2>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
          {rawLinks.length > 0 ? (
            rawLinks.length === 1 ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Direct Download</h3>
                  <p className="text-neutral-400 text-sm">High speed Hubcloud link</p>
                </div>
                <a href={rawLinks[0]} target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-lg text-lg">
                  Download Now
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Available Seasons & Qualities</h3>
                  <p className="text-neutral-400 text-sm">Choose your preferred download link</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {rawLinks.map((link: string, index: number) => (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-amber-500 hover:text-black text-white border border-neutral-700 font-bold px-6 py-4 rounded-lg transition-colors text-center group">
                      Download Link {index + 1}
                      <span className="block text-xs font-normal text-neutral-500 group-hover:text-black/70 mt-1">
                        High Speed Server
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-white mb-2">Link Not Found</h3>
              <p className="text-neutral-400">The download link will be added soon.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}