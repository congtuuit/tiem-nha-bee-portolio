import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductFilters } from "@/components/ProductFilters";
import { Suspense } from "react";
import { ProductListSkeleton } from "@/components/ProductListSkeleton";
import { ProductListClient } from "@/components/ProductListClient";
import { ProductPageHeader } from "@/components/ProductPageHeader";

export const dynamic = "force-static"; // Ensure page is fully static

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: `Tất cả sản phẩm | ${shopConfig?.shop_name || "Tiệm Nhà Bee"}`,
    description: "Khám phá danh mục sản phẩm thủ công, len handmade và quà tặng độc đáo tại Tiệm Nhà Bee.",
  };
}

export default async function ProductsPage() {
  const [shopConfig, allCategories] = await Promise.all([
    getShopConfig(),
    prisma.categories.findMany({
      where: {
        name: { not: "Chưa phân loại" }
      },
      orderBy: [
        { products: { _count: "desc" } },
        { name: "asc" }
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: { select: { products: true } },
      },
    }),
  ]);

  const contactUrl = shopConfig?.facebook_url || shopConfig?.zalo_url || "https://m.me/tiemnhabee";

  return (
    <div className="space-y-8 pb-20">
      <Breadcrumbs items={[{ label: "Sản phẩm" }]} />

      {/* Page Header - Client component to handle dynamic title based on URL */}
      <Suspense fallback={
        <section className="relative py-12 px-8 rounded-[3rem] overflow-hidden bg-neutral-900 text-white min-h-[200px]" />
      }>
        <ProductPageHeader allCategories={allCategories} />
      </Suspense>

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8">
          <Suspense fallback={<div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />}>
            <ProductFilters categories={allCategories} />
          </Suspense>
        </aside>

        {/* Main Content */}
        <div className="space-y-6 min-w-0">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductListClient 
              allCategories={allCategories} 
              contactUrl={contactUrl} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
