import { MetadataRoute } from 'next';
import telegramLinks from '@/data/telegramlink.json';

export default function sitemap(): MetadataRoute.Sitemap {
  // 🔥 यहाँ अपनी वेबसाइट का असली Vercel लिंक डालना
  const baseUrl = 'https://movie-vault-rraz.vercel.app'; 

  // JSON फाइल से सारी मूवीज़ के लिंक्स ऑटोमैटिकली निकालना
  const movieUrls = Object.keys(telegramLinks).map((id) => ({
    url: `${baseUrl}/movie/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8, // मूवी पेजेस को 80% इम्पॉर्टेंस दे रहे हैं
  }));

  // होमपेज और बाकी पेजेस
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, // होमपेज रोज़ अपडेट होता है
      priority: 1.0, // होमपेज सबसे ज़रूरी (100%) है
    },
    ...movieUrls,
  ];

  return routes;
}
