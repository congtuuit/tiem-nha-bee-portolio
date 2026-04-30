import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tiemnhabee.com'

  // Get all products
  const products = await prisma.products.findMany({
    select: { slug: true, created_at: true }
  })

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/san-pham/${p.slug}`,
    lastModified: p.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static pages
  const staticPages = [
    '',
    '/san-pham',
    '/nguyen-lieu',
    '/ve-chung-toi',
    '/admin/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.5,
  }))

  return [...staticPages, ...productUrls]
}
