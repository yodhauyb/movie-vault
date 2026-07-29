import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  imageUrl: string;
  category: string;
}

export default function MovieCard({ id, title, year, imageUrl, category }: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`} className="group block cursor-pointer">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-neutral-900 transition-transform duration-300 group-hover:scale-105 shadow-md">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-amber-500 text-black font-bold px-4 py-2 rounded-md shadow-lg">
            ▶ Watch
          </span>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-white font-semibold truncate text-base">{title}</h3>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
          <span>{year}</span>
          <span className="border border-neutral-700 bg-neutral-900 px-2 py-0.5 rounded text-amber-500">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
}