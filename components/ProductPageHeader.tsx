"use client";

import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export function ProductPageHeader({ allCategories }: { allCategories: Category[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const categorySlug = searchParams.get("category");
  
  const activeCategory = allCategories.find(c => c.slug === categorySlug);

  return (
    <section className="relative py-12 px-8 rounded-[3rem] overflow-hidden bg-neutral-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent" />
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Khám phá</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          {activeCategory ? activeCategory.name : search ? `Kết quả cho "${search}"` : "Cửa hàng của Bee"}
        </h1>
        <p className="text-neutral-400 max-w-xl font-medium">
          {activeCategory?.description || "Những sản phẩm handmade tỉ mỉ và nguyên liệu chất lượng cao nhất cho đam mê của bạn."}
        </p>
      </div>
    </section>
  );
}
