'use client'; // Ye line sabse upar honi chahiye, single ya double quotes dono chalenge

import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';



interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  categories: string[];
  imageUrl: string;
}

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-3xl">
        {/* Netflix-style Logo/Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="text-red-600 font-bold text-lg tracking-wider">PUBLICFLIX</span>
          <span className="text-gray-400 text-sm">FILM</span>
        </motion.div>

        {/* Movie Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
        >
          {movie.title}
        </motion.h1>

        {/* Release Year and Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4"
        >
          <span className="text-green-500 font-semibold text-sm sm:text-base">
            {movie.releaseYear}
          </span>
          <span className="text-gray-500">|</span>
          {movie.categories.map((category, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-300 border border-gray-600 rounded-full"
            >
              {category}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-4 max-w-2xl"
        >
          {movie.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-3 sm:gap-4"
        >
          {/* Watch Now Button */}
          <button
            className="
              flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4
              bg-white text-black font-semibold text-sm sm:text-base
              rounded-md transition-all duration-200
              hover:bg-gray-200 hover:scale-105
              active:scale-95
            "
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            Watch Now
          </button>

          {/* More Details Button */}
          <button
            className="
              flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4
              bg-gray-500/70 text-white font-semibold text-sm sm:text-base
              rounded-md transition-all duration-200
              hover:bg-gray-500/90 hover:scale-105
              active:scale-95
            "
          >
            <Info className="w-5 h-5 sm:w-6 sm:h-6" />
            More Details
          </button>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#181818] to-transparent" />
    </section>
  );
}