import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, Sparkles, Tag, X } from "lucide-react";

import { ProductFilters } from "@/components/ProductFilters";
import { SortSelect } from "@/components/SortSelect";
import { MobileFilters } from "@/components/MobileFilters";
import { Suspense } from "react";
import { ProductListSkeleton } from "@/components/ProductListSkeleton";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: `Tất cả sản phẩm | ${shopConfig?.shop_name || "Tiệm Nhà Bee"}`,
    description: "Khám phá danh mục sản phẩm thủ công, len handmade và quà tặng độc đáo tại Tiệm Nhà Bee.",
  };
}

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const shopConfig = await getShopConfig();
  
  // Fetch categories at top level for sidebar
  const allCategories = await prisma.categories.findMany({
    orderBy: { name: "asc" }
  });

  const activeCategory = allCategories.find(c => c.slug === params.category);

  return (
    <div className="space-y-8 pb-20">
      <Breadcrumbs items={[{ label: "Sản phẩm" }]} />

      {/* Page Header - Static/Pre-rendered */}
      <section className="relative py-12 px-8 rounded-[3rem] overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Khám phá</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            {activeCategory ? activeCategory.name : params.search ? `Kết quả cho "${params.search}"` : "Cửa hàng của Bee"}
          </h1>
          <p className="text-neutral-400 max-w-xl font-medium">
            {activeCategory?.description || "Những sản phẩm handmade tỉ mỉ và nguyên liệu chất lượng cao nhất cho đam mê của bạn."}
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Desktop Sidebar Filters - Rendered immediately with categories */}
        <aside className="hidden lg:block space-y-8">
          <ProductFilters categories={allCategories} />
        </aside>

        {/* Main Content */}
        <div className="space-y-6">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList 
              params={params} 
              allCategories={allCategories} 
              shopConfig={shopConfig} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProductList({ 
  params, 
  allCategories, 
  shopConfig 
}: { 
  params: any, 
  allCategories: any[], 
  shopConfig: any 
}) {
  const { search, category, minPrice, maxPrice, sort, page = "1" } = params;
  const pageSize = 20;
  const currentPage = parseInt(page);

  // Base where clause
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Order by
  const orderBy: any = {};
  if (sort === "price_asc") orderBy.price = "asc";
  else if (sort === "price_desc") orderBy.price = "desc";
  else orderBy.created_at = "desc";

  // Fetch products and count
  const [products, totalCount] = await Promise.all([
    prisma.products.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: { category: true }
    }),
    prisma.products.count({ where })
  ]);

  const activeCategory = allCategories.find(c => c.slug === category);
  const totalPages = Math.ceil(totalCount / pageSize);
  const contactUrl = shopConfig?.facebook_url || shopConfig?.zalo_url || "https://m.me/tiemnhabee";

  const getPageUrl = (p: number) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") searchParams.set(key, value as string);
    });
    searchParams.set("page", p.toString());
    return `/san-pham?${searchParams.toString()}`;
  };

  const removeFilterUrl = (keyToRemove: string) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== keyToRemove && key !== "page") searchParams.set(key, value as string);
    });
    return `/san-pham?${searchParams.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Results, Sorting & Mobile Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-4">
          <MobileFilters categories={allCategories} />
          <div className="text-sm text-neutral-500 font-medium">
            Hiển thị <span className="font-bold text-neutral-900">{totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, totalCount)}</span> của <span className="font-bold text-neutral-900">{totalCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SortSelect />
        </div>
      </div>

      {/* Active Filter Tags */}
      {(category || search || minPrice || maxPrice) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-neutral-400 uppercase mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Đang lọc:
          </span>
          {search && (
            <Link href={removeFilterUrl("search")} className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Từ khóa: {search} <X className="w-3 h-3" />
            </Link>
          )}
          {category && activeCategory && (
            <Link href={removeFilterUrl("category")} className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Danh mục: {activeCategory.name} <X className="w-3 h-3" />
            </Link>
          )}
          {(minPrice || maxPrice) && (
            <Link href={removeFilterUrl("minPrice")} className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Giá: {minPrice || 0}đ - {maxPrice || "Max"}đ <X className="w-3 h-3" />
            </Link>
          )}
          <Link href="/san-pham" className="text-xs text-neutral-400 hover:text-red-500 font-bold transition-colors">Xóa tất cả</Link>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} contactUrl={contactUrl} />
        ))}
        {!products.length && (
          <div className="col-span-full py-24 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-neutral-200">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-10 h-10 text-neutral-300" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-neutral-900">Không tìm thấy sản phẩm</p>
              <p className="text-neutral-500">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
            </div>
            <Link href="/san-pham" className="inline-block px-8 py-3 bg-neutral-900 text-white font-bold rounded-full hover:bg-amber-600 transition-all">
              Quay lại cửa hàng
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-12">
          <Link
            href={getPageUrl(currentPage - 1)}
            className={`p-3 rounded-xl border transition-all ${currentPage === 1 ? 'pointer-events-none opacity-20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                href={getPageUrl(p)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border font-bold transition-all ${currentPage === p ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
              >
                {p}
              </Link>
            );
          })}

          <Link
            href={getPageUrl(currentPage + 1)}
            className={`p-3 rounded-xl border transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
