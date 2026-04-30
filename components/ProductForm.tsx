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
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Tên sản phẩm *</label>
          <input
            {...form.register("name")}
            onBlur={handleNameBlur}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Nhập tên sản phẩm"
          />
          {form.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Đường dẫn (Slug) *</label>
          <input
            {...form.register("slug")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="duong-dan-san-pham"
          />
          {form.formState.errors.slug && <p className="text-red-500 text-sm mt-1">{form.formState.errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Giá (VNĐ)</label>
          <input
            type="number"
            {...form.register("price", { 
              setValueAs: (v) => v === "" || Number.isNaN(Number(v)) ? "" : Number(v) 
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Bỏ trống nếu muốn hiển thị 'Liên hệ'"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Mô tả chi tiết</label>
          <textarea
            {...form.register("description")}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Mô tả sản phẩm, chất liệu, kích thước..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Hình ảnh sản phẩm</label>
          <ImageUploader onUploadSuccess={handleImageUpload} existingImages={currentImages} />
          {/* Custom remove buttons for images */}
          {currentImages.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {currentImages.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Xóa ảnh {idx + 1}
                </button>
              ))}
            </div>
          )}
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
