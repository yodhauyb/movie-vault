/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import telegramLinks from "@/data/telegramlink.json";
import { ArrowLeft, Star, DownloadCloud, Film } from "lucide-react";
import SquareAd from "@/components/SquareAd"; 
import BannerAd468 from "@/components/BannerAd468"; // 🔥 468x60 बैनर इम्पोर्ट कर लिया

// TypeScript Format
type TelegramLinkValue = string | { link: string; poster?: string | null; type?: string; year?: string; rating?: number; description?: string };

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const decodedId = decodeURIComponent(id);
  const vaultData = (telegramLinks as Record<string, TelegramLinkValue>) || {};
  const movieData = vaultData[decodedId];

  if (!movieData) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
        <Film className="w-16 h-16 text-red-500/50 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Movie Not Found</h1>
        <p className="text-gray-400 mb-6">Looks like this vault item is missing or removed.</p>
        <Link href="/" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          Go Back Home
        </Link>
      </div>
    );
  }

  const url = typeof movieData === 'string' ? movieData : movieData?.link;
  const poster = typeof movieData === 'string' ? null : movieData?.poster;
  const rating = typeof movieData === 'object' && movieData?.rating ? movieData.rating : 8.5;
  const year = typeof movieData === 'object' && movieData?.year ? movieData.year : "2025";
  const type = typeof movieData === 'object' && movieData?.type === 'series' ? 'Web Series' : 'Movie';
  
  const desc = typeof movieData === 'object' && movieData?.description 
    ? movieData.description 
    : "Experience this cinematic masterpiece in full HD. Fast download and seamless streaming directly from our Vault servers.";

  const cleanKey = decodedId.replace(/^movie_/, '').replace(/^series_/, '').replace(/_/g, ' ').trim();
  const title = cleanKey.replace(/\b\w/g, char => char.toUpperCase());

  const posterUrl = poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000";

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-[Outfit] relative">
      
      {/* 🌟 Background Blur Effect */}
      <div className="absolute inset-0 w-full h-[60vh] overflow-hidden -z-10">
        <img src={posterUrl} alt="bg" className="w-full h-full object-cover opacity-20 blur-[60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090e]/80 to-[#07090e]" />
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-20">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Back to Vault
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          
          {/* 🎬 Left Poster */}
          <div className="w-full sm:w-2/3 md:w-[350px] mx-auto md:mx-0 shrink-0 relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group">
            <img src={posterUrl} alt={title} className="w-full aspect-[2/3] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* 📝 Right Details */}
          <div className="flex-1 pt-4 text-center md:text-left w-full">
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-bold uppercase tracking-wider">{type}</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-bold">{year}</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-bold flex items-center gap-1 text-yellow-400">
                <Star className="w-3 h-3 fill-yellow-400" /> {rating} / 10
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              {title}
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-light">
              {desc}
            </p>

            {/* 🚀 Fully Working Download Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:scale-105 hover(-translate-y-1"
              >
                <DownloadCloud className="w-6 h-6" /> 
                {type === "Web Series" ? "Download Episodes" : "Download Movie"}
              </a>
            </div>

            {/* 🔥 डाउनलोड बटन के ठीक नीचे 468x60 बैनर और दोनों Square Ads */}
            <div className="w-full flex flex-col items-center md:items-start gap-6 mt-8">
              <BannerAd468 />
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                <SquareAd />
                <SquareAd />
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}