import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. ये तेरा वाला इमेज लोडिंग का कोड है (पोस्टर्स के लिए)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', 
      }
    ],
  },

  // 2. ये नया रीडायरेक्ट का कोड है (SEO पावर बचाने के लिए)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'movie-vault-snowy.vercel.app',
          },
        ],
        destination: 'https://movie-vault-rraz.vercel.app/:path*',
        permanent: true, 
      },
    ];
  },
};

export default nextConfig;