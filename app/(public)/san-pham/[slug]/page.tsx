import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/ProductGallery";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getShopConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { ZaloIcon, FacebookIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export const revalidate = 60; // ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.products.findUnique({
    where: { slug: resolvedParams.slug },
    select: { name: true, description: true, cover_image: true },
  });

  if (!product) {
    return { title: "Không tìm thấy sản phẩm" };
  }

  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Sản phẩm ${product.name} tại Tiệm Nhà Bee`,
    openGraph: {
      images: product.cover_image ? [product.cover_image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await prisma.products.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) {
    notFound();
  }

  const shopConfig = await getShopConfig();

  const relatedProducts = await prisma.products.findMany({
    where: {
      AND: [
        { id: { not: product.id } },
        {
          OR: [
            { name: { contains: product.name.split(' ')[0], mode: 'insensitive' } },
            { description: { contains: product.name.split(' ')[0], mode: 'insensitive' } }
          ]
        }
      ]
    },
    take: 10,
    orderBy: { created_at: 'desc' },
  });

  const priceFormatted = product.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))
    : 'Liên hệ';

  const imagesArray = Array.isArray(product.images) ? (product.images as string[]) : [];
  const allImages = imagesArray.length > 0 ? imagesArray : (product.cover_image ? [product.cover_image] : []);

  const contactUrl = shopConfig?.facebook_url || shopConfig?.zalo_url || "https://m.me/tiemnhabee";
  const isZalo = contactUrl.includes("zalo.me");
  const isFacebook = contactUrl.includes("facebook.com") || contactUrl.includes("m.me");

  return (
    <div className="space-y-12">
      <Breadcrumbs 
        items={[
          { label: "Sản phẩm", href: "/san-pham" },
          { label: product.name }
        ]} 
      />

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Gallery */}
        <ProductGallery images={allImages} productName={product.name} />

        {/* Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-amber-600">{priceFormatted}</p>
          </div>

          <div className="prose prose-neutral max-w-none">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">Mô tả sản phẩm</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-neutral-600">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>

          <div className="pt-8 space-y-4 border-t border-neutral-100">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2 w-full px-8 py-4 text-lg font-bold text-white rounded-2xl transition-all shadow-lg active:scale-[0.98]",
                isFacebook ? "bg-[#0866FF] hover:bg-[#0055D4] shadow-[#0866FF]/20" :
                isZalo ? "bg-[#0068FF] hover:bg-[#0055D4] shadow-[#0068FF]/20" :
                "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
              )}
            >
              {isZalo ? <ZaloIcon size={24} /> : isFacebook ? <FacebookIcon size={24} /> : <MessageCircle className="w-6 h-6" />}
              Liên hệ tư vấn / Đặt hàng
            </a>
            <p className="text-sm text-neutral-500 flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              Nhận thiết kế riêng theo yêu cầu của khách hàng
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Sản phẩm tương tự</h2>
            <Link href="/san-pham" className="text-sm font-medium text-amber-600 hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/san-pham/${p.slug}`} className="group space-y-3">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 transition-all group-hover:shadow-md">
                  {p.cover_image && (
                    <Image
                      src={p.cover_image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 line-clamp-1 group-hover:text-amber-600 transition-colors">{p.name}</h3>
                  <p className="text-sm font-semibold text-amber-500">
                    {p.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(p.price)) : 'Liên hệ'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
