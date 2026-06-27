import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { unstable_cache } from "next/cache";

interface Props {
  params: Promise<{ slug: string }>;
}

const getPostBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.posts.findUnique({
      where: { slug, status: "published" },
    });
  },
  ["post-detail"],
  { tags: ["posts"] }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Không tìm thấy bài viết" };
  }

  const title = post.seo_title || post.title;
  const description =
    post.seo_description ||
    post.excerpt ||
    `${post.title} - Tiệm Nhà Bee Blog`;

  return {
    title,
    description,
    keywords: post.seo_keywords?.split(",").map((k) => k.trim()) || [],
    openGraph: {
      title,
      description,
      type: "article",
      images: post.cover_image ? [{ url: post.cover_image, alt: post.title }] : [],
      publishedTime: post.created_at.toISOString(),
      modifiedTime: post.updated_at.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.tiemnhabee.store";

  // Article Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.seo_description || "",
    image: post.cover_image || "",
    datePublished: post.created_at.toISOString(),
    dateModified: post.updated_at.toISOString(),
    author: {
      "@type": "Organization",
      name: "Tiệm Nhà Bee",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Tiệm Nhà Bee",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  // Estimate reading time
  const wordCount = (post.content || "")
    .replace(/<[^>]*>/g, "")
    .split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Fetch related posts
  const relatedPosts = await prisma.posts.findMany({
    where: {
      status: "published",
      id: { not: post.id },
    },
    take: 3,
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      cover_image: true,
      created_at: true,
    },
  });

  return (
    <div className="space-y-12 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="max-w-3xl mx-auto">
        {/* Post Header */}
        <header className="space-y-6 mb-10">
          <div className="flex items-center gap-4 text-sm text-neutral-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(post.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTime} phút đọc</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-neutral-500 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div
          className="prose prose-neutral prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-neutral-600
            prose-a:text-amber-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-neutral-800
            prose-ul:my-4 prose-li:text-neutral-600
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách bài viết
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto space-y-8 pt-8 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              Bài viết khác
            </h2>
            <Link
              href="/blog"
              className="text-sm font-bold text-amber-600 hover:underline px-4 py-2 bg-amber-50 rounded-xl"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.slug}`}
                className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative h-36 bg-neutral-100 overflow-hidden">
                  {rp.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rp.cover_image}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-100 to-amber-100" />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(rp.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
