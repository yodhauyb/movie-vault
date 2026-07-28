import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  imageUrl: string;
  category: string;
}

export default function MovieCard({ id, title, year, imageUrl, category }: MovieCardProps) {
  return (
    // Link component card ko clickable banayega aur sahi URL par bheja
    <Link href={`/movie/${id}`}>
      <div className="group relative rounded-xl overflow-hidden cursor-pointer bg-gray-900 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-800/50">
        
        {/* Poster Image Section */}
        <div className="relative w-full h-80">
          <Image 
            src={imageUrl} 
            alt={title} 
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <Play className="w-16 h-16 text-white fill-white/20" strokeWidth={1} />
          </div>
        </div>
        
        {/* Movie Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
            <span>{year}</span>
            <span className="px-2 py-1 bg-gray-800 rounded-md text-xs">{category}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}