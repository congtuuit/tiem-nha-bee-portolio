"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/Loading";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Không thể tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    const slug = newName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, slug }),
      });

      if (!res.ok) throw new Error();
      toast.success("Đã thêm danh mục!");
      setNewName("");
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi thêm danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, count: number = 0) => {
    if (count > 0) {
      toast.error(`Không thể xóa danh mục đang chứa ${count} sản phẩm.`);
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Lỗi khi xóa");
      }
      toast.success("Đã xóa danh mục!");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    
    const slug = editName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, slug }),
      });

      if (!res.ok) throw new Error();
      toast.success("Đã cập nhật danh mục!");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi cập nhật danh mục");
    }
  };

  if (isLoading) {
    return <Loading text="Đang tải danh mục..." />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý danh mục</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Thêm mới
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tên danh mục</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="VD: Len sợi, Đồ handmade..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Thêm danh mục"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-500" />
                        {editingId === cat.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium text-slate-700"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(cat.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                        ) : (
                          <span className="font-medium text-slate-700">{cat.name}</span>
                        )}
                        <span className="ml-2 inline-flex items-center justify-center bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {cat._count?.products || 0} SP
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                      {editingId === cat.id ? "Sẽ tự động cập nhật..." : cat.slug}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === cat.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleSaveEdit(cat.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Lưu">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-2 text-slate-400 hover:bg-slate-100 rounded-md transition-colors" title="Hủy">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(cat)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Sửa">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat._count?.products)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                      Chưa có danh mục nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
