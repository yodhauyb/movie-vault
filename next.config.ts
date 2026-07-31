import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // OMDb API के लिए (अगर भविष्य में यूज़ किया)
      }
    ],
  },
};

export default nextConfig;