import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: `Tất cả sản phẩm | ${shopConfig?.shop_name || "Tiệm Nhà Bee"}`,
    description: "Khám phá danh mục sản phẩm thủ công, len handmade và quà tặng độc đáo tại Tiệm Nhà Bee.",
  };
}

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search } = await searchParams;
  const products = await prisma.products.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    } : {},
    orderBy: { created_at: "desc" },
  });

  const shopConfig = await getShopConfig();
  const contactUrl = shopConfig?.facebook_url || shopConfig?.zalo_url || "https://m.me/tiemnhabee";

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Sản phẩm" }]} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {search ? `Kết quả tìm kiếm cho "${search}"` : "Tất cả sản phẩm"}
          </h1>
          <p className="text-neutral-500 mt-2">
            {products.length} sản phẩm tinh xảo dành cho bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} contactUrl={contactUrl} />
        ))}
        {!products.length && (
          <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 font-medium">Hiện tại không tìm thấy sản phẩm nào.</p>
            <a href="/san-pham" className="inline-block text-amber-600 font-bold hover:underline">Xem tất cả sản phẩm</a>
          </div>
        )}
      </div>
    </div>
  );
}
