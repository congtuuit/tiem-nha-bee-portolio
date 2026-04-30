"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/types/product";
import { ImageUploader } from "./ImageUploader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Tên sản phẩm quá ngắn"),
  slug: z.string().min(2, "Slug quá ngắn"),
  description: z.string().optional(),
  price: z.number().min(0, "Giá không hợp lệ").optional().or(z.literal("")),
  cover_image: z.string().optional(),
  images: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      cover_image: initialData?.cover_image || "",
      images: initialData?.images || [],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        price: data.price === "" ? null : Number(data.price),
        cover_image: data.images[0] || "", // Automatically set first image as cover
      };

      if (initialData) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      router.push("/admin/products");
      router.refresh();
      toast.success(initialData ? "Đã cập nhật sản phẩm thành công!" : "Đã thêm sản phẩm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImages = form.watch("images");

  const handleImageUpload = (url: string) => {
    form.setValue("images", [...currentImages, url]);
    if (!form.getValues("cover_image")) {
      form.setValue("cover_image", url);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = currentImages.filter((_, idx) => idx !== indexToRemove);
    form.setValue("images", newImages);
    if (form.getValues("cover_image") === currentImages[indexToRemove]) {
      form.setValue("cover_image", newImages[0] || "");
    }
  };

  // Auto-generate slug from name
  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!form.getValues("slug")) {
      const generatedSlug = slugify(e.target.value, { lower: true, locale: "vi" });
      form.setValue("slug", generatedSlug);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Thông tin cơ bản */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Thông tin cơ bản</h2>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên sản phẩm *</label>
              <input
                {...form.register("name")}
                onBlur={handleNameBlur}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800"
                placeholder="Ví dụ: Nến thơm tinh dầu sả chanh"
              />
              {form.formState.errors.name && <p className="text-red-500 text-sm mt-1.5">{form.formState.errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Đường dẫn (Slug) *</label>
                <input
                  {...form.register("slug")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-500"
                  placeholder="nen-thom-tinh-dau"
                />
                {form.formState.errors.slug && <p className="text-red-500 text-sm mt-1.5">{form.formState.errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá bán (VNĐ)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">đ</span>
                  <input
                    type="number"
                    {...form.register("price", { 
                      setValueAs: (v) => v === "" || Number.isNaN(Number(v)) ? "" : Number(v) 
                    })}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-medium text-slate-800"
                    placeholder="Để trống = Liên hệ"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả chi tiết</label>
              <textarea
                {...form.register("description")}
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 resize-none"
                placeholder="Mô tả về chất liệu, kích thước, công dụng..."
              />
            </div>
          </div>

          {/* Cột phải: Hình ảnh */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Hình ảnh</h2>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 border-dashed">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Thư viện ảnh</label>
              <ImageUploader onUploadSuccess={handleImageUpload} existingImages={currentImages} />
              
              {currentImages.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200/60">
                  <p className="text-xs text-slate-500 mb-2">Ảnh đã tải lên ({currentImages.length})</p>
                  <div className="flex flex-col gap-2">
                    {currentImages.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 truncate w-32">Ảnh {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <h3 className="text-sm font-bold text-amber-800 mb-1">Mẹo nhỏ</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                Ảnh đầu tiên sẽ tự động được chọn làm ảnh bìa (Cover Image) hiển thị ở trang chủ. Hãy tải ảnh đẹp nhất lên đầu tiên nhé!
              </p>
            </div>
          </div>
          
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-lg font-medium hover:bg-neutral-50 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </div>
    </form>
  );
}
