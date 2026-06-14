"use client";

import { useState, useTransition } from "react";
import { updateProductCategory } from "@/app/(admin)/admin/products/actions";
import { toast } from "sonner";

type CategoryOption = {
  id: string;
  name: string;
};

type Props = {
  productId: string;
  currentCategoryId: string | null;
  categories: CategoryOption[];
};

export function QuickCategorySelect({ productId, currentCategoryId, categories }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCategoryId, setOptimisticCategoryId] = useState<string | null>(currentCategoryId);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value === "uncategorized" ? null : e.target.value;
    setOptimisticCategoryId(newCategoryId);

    startTransition(async () => {
      const result = await updateProductCategory(productId, newCategoryId);
      if (result.success) {
        toast.success("Đã cập nhật danh mục thành công");
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
        setOptimisticCategoryId(currentCategoryId); // Revert on failure
      }
    });
  };

  return (
    <div className="relative inline-block min-w-[140px]">
      <select
        value={optimisticCategoryId ?? "uncategorized"}
        onChange={handleChange}
        disabled={isPending}
        className={`w-full appearance-none rounded border px-2 py-1 text-xs font-semibold shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500
          ${
            optimisticCategoryId === null
              ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          }
          ${isPending ? "cursor-wait opacity-60" : "cursor-pointer"}
        `}
      >
        <option value="uncategorized">Chưa phân loại</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      
      {/* Custom arrow so we don't rely on browser defaults too much, but keep it simple */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
