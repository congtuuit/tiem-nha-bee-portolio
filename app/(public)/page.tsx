import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60; // ISR revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
          Sản phẩm thủ công <span className="text-amber-600">tinh tế</span>
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Mỗi sản phẩm tại Tiệm Nhà Bee đều được làm bằng tất cả tâm huyết và sự tỉ mỉ, mang đến cho bạn những trải nghiệm tuyệt vời nhất.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {!products?.length && (
            <div className="col-span-full py-12 text-center text-neutral-500">
              Hiện tại chưa có sản phẩm nào.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
