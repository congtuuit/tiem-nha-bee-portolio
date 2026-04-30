import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, SortAsc, SortDesc, X } from "lucide-react";

import { ProductFilters } from "@/components/ProductFilters";
import { SortSelect } from "@/components/SortSelect";

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

  // Fetch products and total count
  const [products, totalCount, categories] = await Promise.all([
    prisma.products.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: { category: true }
    }),
    prisma.products.count({ where }),
    prisma.categories.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const shopConfig = await getShopConfig();
  const contactUrl = shopConfig?.facebook_url || shopConfig?.zalo_url || "https://m.me/tiemnhabee";

  // Helper for pagination links
  const getPageUrl = (p: number) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") searchParams.set(key, value as string);
    });
    searchParams.set("page", p.toString());
    return `/san-pham?${searchParams.toString()}`;
  };

  return (
    <div className="space-y-8 pb-20">
      <Breadcrumbs items={[{ label: "Sản phẩm" }]} />

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar Filters (Client Component) */}
        <aside className="hidden lg:block">
          <ProductFilters categories={categories} />
        </aside>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Top Bar: Results & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
            <div className="text-sm text-neutral-500">
              Hiển thị <span className="font-bold text-neutral-900">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}</span> trong <span className="font-bold text-neutral-900">{totalCount}</span> sản phẩm
            </div>

            <div className="flex items-center gap-4">
              <SortSelect />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} contactUrl={contactUrl} />
            ))}
            {!products.length && (
              <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-neutral-200">
                <p className="text-neutral-500 font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
                <Link href="/san-pham" className="inline-block text-amber-600 font-bold hover:underline">Xóa bộ lọc</Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Link
                href={getPageUrl(currentPage - 1)}
                className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'pointer-events-none opacity-20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={getPageUrl(p)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border font-medium transition-all ${currentPage === p ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
                  >
                    {p}
                  </Link>
                );
              })}

              <Link
                href={getPageUrl(currentPage + 1)}
                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-20' : 'hover:bg-amber-50 hover:border-amber-200'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
