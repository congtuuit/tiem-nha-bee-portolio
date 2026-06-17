import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.tiemnhabee.store";

  // Fetch all active products
  const products = await prisma.products.findMany({
    where: { status: 'active' },
    select: { slug: true, created_at: true },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    lastModified: product.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/san-pham',
    '/lien-he',
    '/ve-chung-toi',
    '/return-policy'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [
    ...staticRoutes,
    ...productUrls,
  ];
}
