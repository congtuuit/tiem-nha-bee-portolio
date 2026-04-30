import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

export const revalidate = 60; // ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, cover_image")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) {
    return { title: "Không tìm thấy sản phẩm" };
  }

  return {
    title: `${product.name} | Tiệm Nhà Bee`,
    description: product.description?.substring(0, 160) || `Sản phẩm ${product.name} tại Tiệm Nhà Bee`,
    openGraph: {
      images: product.cover_image ? [product.cover_image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) {
    notFound();
  }

  const priceFormatted = product.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
    : 'Liên hệ';

  const allImages = product.images?.length > 0 ? product.images : (product.cover_image ? [product.cover_image] : []);

  return (
    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 py-8">
      {/* Cột hình ảnh */}
      <div className="space-y-4">
        {allImages.length > 0 ? (
          <>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <Image
                src={allImages[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.slice(1).map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <Image src={img} alt={`${product.name} ${idx + 2}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="aspect-square rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
            Chưa có hình ảnh
          </div>
        )}
      </div>

      {/* Cột thông tin */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-amber-600">{priceFormatted}</p>
        </div>

        <div className="prose prose-neutral max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-neutral-700">
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>
        </div>

        <div className="pt-8 border-t border-neutral-200">
          <a
            href="https://m.me/tiemnhabee" // Thay bằng link thật
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-lg font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm hover:shadow"
          >
            Liên hệ tư vấn / Đặt hàng
          </a>
          <p className="text-sm text-neutral-500 mt-4 text-center md:text-left">
            * Nhắn tin trực tiếp cho chúng tôi qua Fanpage để được tư vấn chi tiết và đặt hàng.
          </p>
        </div>
      </div>
    </div>
  );
}
