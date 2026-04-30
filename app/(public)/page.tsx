import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { Metadata } from "next";

export const revalidate = 60; // ISR revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: shopConfig?.meta_title || "Tiệm Nhà Bee | Đồ Handmade & Quà Tặng",
    description: shopConfig?.meta_description || "Cửa hàng đồ handmade, quà tặng ý nghĩa và độc đáo.",
  };
}

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
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
    <div className="space-y-12">
      <section className="text-center space-y-6 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-amber-100/50 to-transparent -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight">
          Sản phẩm thủ công <br />
          <span className="text-amber-500 italic">tinh tế & tâm huyết</span>
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Mỗi sản phẩm tại Tiệm Nhà Bee đều được làm bằng tất cả tâm huyết và sự tỉ mỉ, mang đến cho bạn những trải nghiệm tuyệt vời nhất.
        </p>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">
            {search ? `Kết quả tìm kiếm cho "${search}"` : "Sản phẩm mới nhất"}
          </h2>
          <span className="text-sm text-neutral-500">{products.length} sản phẩm</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} contactUrl={contactUrl} />
          ))}
          {!products.length && (
            <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-neutral-200">
              <p className="text-neutral-500 font-medium">Hiện tại không tìm thấy sản phẩm nào.</p>
              <a href="/" className="inline-block text-amber-600 font-bold hover:underline">Quay lại trang chủ</a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
