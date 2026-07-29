"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Page ko reload hone se rokega
    if (query.trim()) {
      // Search page par bhej dega
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 text-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wider">
          Movie <span className="text-amber-500">Vault</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black border border-neutral-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:border-amber-500"
          />
          <button 
            type="submit" 
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2 rounded-r-md transition-colors"
          >
            Search
          </button>
        </form>

        {/* Links */}
        <div className="flex gap-6 font-medium">
          <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <Link href="/" className="hover:text-amber-500 transition-colors">Explore</Link>
        </div>

      </div>
    </nav>
  );
}