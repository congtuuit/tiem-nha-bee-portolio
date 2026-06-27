import { prisma } from "@/lib/prisma";
import { Plus, FileText, Clock, CheckCircle, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deletePost, updatePost } from "./actions";

export default async function AdminPostsPage() {
  const posts = await prisma.posts.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      excerpt: true,
      cover_image: true,
      created_at: true,
      updated_at: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Bài viết</h1>
          <p className="mt-1 text-slate-500">Quản lý nội dung blog và SEO.</p>
        </div>
        <Link
          href="/admin/posts/create"
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-amber-600/40"
        >
          <Plus className="h-5 w-5" />
          Viết bài mới
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-700">Chưa có bài viết nào</p>
          <p className="text-slate-500 text-sm">Bắt đầu tạo bài viết đầu tiên với sự hỗ trợ của AI!</p>
          <Link
            href="/admin/posts/create"
            className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
          >
            Tạo bài viết
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Tiêu đề</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Trạng thái</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Ngày tạo</th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">/blog/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deletePost(post.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
