"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  const getFilterUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on filter change
    if (!newParams.page) params.set("page", "1");
    return `/san-pham?${params.toString()}`;
  };

  const handlePriceBlur = (key: string, value: string) => {
    router.push(getFilterUrl({ [key]: value }));
  };

  const handleSortChange = (value: string) => {
    router.push(getFilterUrl({ sort: value }));
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-bold text-neutral-900 border-b pb-2">Danh mục</h3>
        <div className="flex flex-col gap-2">
          <Link 
            href="/san-pham" 
            className={`text-sm py-1 hover:text-amber-600 transition-colors ${!category ? 'text-amber-600 font-bold' : 'text-neutral-600'}`}
          >
            Tất cả
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              href={getFilterUrl({ category: cat.slug })}
              className={`text-sm py-1 hover:text-amber-600 transition-colors ${category === cat.slug ? 'text-amber-600 font-bold' : 'text-neutral-600'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-bold text-neutral-900 border-b pb-2">Khoảng giá (VNĐ)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Từ" 
              className="w-full px-3 py-2 bg-neutral-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
              defaultValue={minPrice}
              onBlur={(e) => handlePriceBlur("minPrice", e.target.value)}
            />
            <span className="text-neutral-400">-</span>
            <input 
              type="number" 
              placeholder="Đến" 
              className="w-full px-3 py-2 bg-neutral-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
              defaultValue={maxPrice}
              onBlur={(e) => handlePriceBlur("maxPrice", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sort - Desktop only in sidebar for redundancy or mobile menu */}
      <div className="space-y-4 lg:hidden">
        <h3 className="font-bold text-neutral-900 border-b pb-2">Sắp xếp</h3>
        <select 
          className="w-full text-sm bg-neutral-100 border-none rounded-lg py-2 px-3 focus:ring-0 cursor-pointer"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">Sắp xếp mặc định</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* Active Filters */}
      {(category || minPrice || maxPrice) && (
        <div className="pt-4 border-t">
          <Link href="/san-pham" className="text-xs text-red-500 flex items-center gap-1 hover:underline">
            <X className="w-3 h-3" />
            Xóa tất cả bộ lọc
          </Link>
        </div>
      )}
    </div>
  );
}
