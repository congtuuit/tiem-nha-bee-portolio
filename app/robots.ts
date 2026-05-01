import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tiemnhabee.com";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Prevent crawling of admin and API routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
