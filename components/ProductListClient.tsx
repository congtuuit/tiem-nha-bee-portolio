"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft, ChevronRight, Filter, Tag, X } from "lucide-react";
import Link from "next/link";
import { MobileFilters } from "@/components/MobileFilters";
import { SortSelect } from "@/components/SortSelect";
import { ProductListSkeleton } from "@/components/ProductListSkeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
}

interface ProductListClientProps {
  allCategories: Category[];
  contactUrl: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProductListClient({ allCategories, contactUrl }: ProductListClientProps) {
  const searchParams = useSearchParams();
  
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page") || "1";
  
  const activeCategory = allCategories.find((c) => c.slug === category);

  const queryString = searchParams.toString();
  const { data, error, isLoading } = useSWR(
    `/api/products${queryString ? `?${queryString}` : ""}`,
    fetcher
  );

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    return `/san-pham?${params.toString()}`;
  };

  const removeFilterUrl = (keyToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(keyToRemove);
    params.delete("page");
    return `/san-pham?${params.toString()}`;
  };

  const getCategoryUrl = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    return `/san-pham?${params.toString()}`;
  };

  if (error) return <div className="text-red-500 py-10 text-center font-bold">Lỗi tải dữ liệu. Vui lòng thử lại.</div>;

  return (
    <div className="space-y-6">
      {/* Top Bar: Results, Sorting & Mobile Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-4">
          <MobileFilters categories={allCategories} />
          <div className="text-sm text-neutral-500 font-medium">
            Hiển thị <span className="font-bold text-neutral-900">{data?.totalCount > 0 ? (data.currentPage - 1) * 20 + 1 : 0}-{Math.min((data?.currentPage || 1) * 20, data?.totalCount || 0)}</span> của <span className="font-bold text-neutral-900">{isLoading ? "..." : data?.totalCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SortSelect />
        </div>
      </div>

      {/* Mobile Categories Scrollbar (Horizontal) */}
      <div className="md:hidden flex overflow-x-auto gap-3 pb-2 w-full hide-scrollbar snap-x">
        <Link
          href={getCategoryUrl(null)}
          className={`shrink-0 snap-start px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
            !category ? "bg-amber-500 text-white border border-amber-500" : "bg-white text-neutral-600 border border-neutral-200"
          }`}
          scroll={false}
        >
          Tất cả
        </Link>
        {allCategories.map((cat) => (
          <Link
            key={cat.id}
            href={getCategoryUrl(cat.slug)}
            className={`shrink-0 snap-start px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
              category === cat.slug ? "bg-amber-500 text-white border border-amber-500" : "bg-white text-neutral-600 border border-neutral-200"
            }`}
            scroll={false}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Active Filter Tags */}
      {(category || search || minPrice || maxPrice) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-neutral-400 uppercase mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Đang lọc:
          </span>
          {search && (
            <Link scroll={false} href={removeFilterUrl("search")} className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Từ khóa: {search} <X className="w-3 h-3" />
            </Link>
          )}
          {category && activeCategory && (
            <Link scroll={false} href={removeFilterUrl("category")} className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Danh mục: {activeCategory.name} <X className="w-3 h-3" />
            </Link>
          )}
          {(minPrice || maxPrice) && (
            <Link scroll={false} href={removeFilterUrl("minPrice")} className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Giá: {minPrice || 0}đ - {maxPrice || "Max"}đ <X className="w-3 h-3" />
            </Link>
          )}
          <Link scroll={false} href="/san-pham" className="text-xs text-neutral-400 hover:text-red-500 font-bold transition-colors">Xóa tất cả</Link>
        </div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <ProductListSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.products?.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} contactUrl={contactUrl} priority={index < 4} />
            ))}
            {(!data?.products || data.products.length === 0) && (
              <div className="col-span-full py-24 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-neutral-200">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto">
                  <Filter className="w-10 h-10 text-neutral-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-neutral-900">Không tìm thấy sản phẩm</p>
                  <p className="text-neutral-500">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                </div>
                <Link scroll={false} href="/san-pham" className="inline-block px-8 py-3 bg-neutral-900 text-white font-bold rounded-full hover:bg-amber-600 transition-all">
                  Quay lại cửa hàng
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-12">
              <Link
                scroll={false}
                href={getPageUrl(data.currentPage - 1)}
                className={`p-3 rounded-xl border transition-all ${data.currentPage === 1 ? 'pointer-events-none opacity-20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              {[...Array(data.totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <Link
                    scroll={false}
                    key={p}
                    href={getPageUrl(p)}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border font-bold transition-all ${data.currentPage === p ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
                  >
                    {p}
                  </Link>
                );
              })}

              <Link
                scroll={false}
                href={getPageUrl(data.currentPage + 1)}
                className={`p-3 rounded-xl border transition-all ${data.currentPage === data.totalPages ? 'pointer-events-none opacity-20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
