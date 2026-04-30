import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-sm text-neutral-600">
                <th className="p-4 font-medium">Hình ảnh</th>
                <th className="p-4 font-medium">Tên sản phẩm</th>
                <th className="p-4 font-medium">Giá</th>
                <th className="p-4 font-medium">Ngày tạo</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-sm">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      {product.cover_image ? (
                        <Image src={product.cover_image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <span className="text-[10px] text-neutral-400 absolute inset-0 flex items-center justify-center">No Img</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-neutral-900">{product.name}</td>
                  <td className="p-4 text-neutral-600">
                    {product.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) : 'Liên hệ'}
                  </td>
                  <td className="p-4 text-neutral-500">
                    {new Date(product.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {/* Note: Delete functionality should ideally be a form or Client Component with confirm dialog */}
                    <Link
                      href={`#`} // Placeholder, needs real implementation for MVP
                      className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Chưa hỗ trợ xóa tạm thời"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!products?.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
