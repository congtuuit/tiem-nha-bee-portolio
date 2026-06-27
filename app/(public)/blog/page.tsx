import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Blog | Tiệm Nhà Bee",
  description:
    "Góc chia sẻ kiến thức đan móc, hướng dẫn làm đồ handmade và mẹo hay từ Tiệm Nhà Bee.",
};

export default async function BlogPage() {
  const posts = await prisma.posts.findMany({
    where: { status: "published" },
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
    <div className="space-y-8 pb-20">
      <Breadcrumbs items={[{ label: "Blog" }]} />

      {/* Page Header */}
      <section className="relative py-12 px-8 rounded-[3rem] overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-sm uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Góc chia sẻ</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Blog Tiệm Nhà Bee
          </h1>
          <p className="text-neutral-400 max-w-xl font-medium">
            Kiến thức đan móc, mẹo hay và câu chuyện handmade từ xưởng nhỏ của
            Bee.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-[3rem] border border-dashed border-neutral-200">
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-neutral-300" />
          </div>
          <p className="text-xl font-bold text-neutral-900">
            Chưa có bài viết nào
          </p>
          <p className="text-neutral-500">
            Bee đang chuẩn bị những bài viết thú vị cho bạn!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-neutral-100 overflow-hidden">
                {post.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-amber-100">
                    <BookOpen className="w-12 h-12 text-violet-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(post.created_at)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-amber-600 text-sm font-bold pt-2">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
