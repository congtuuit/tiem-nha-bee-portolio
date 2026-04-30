import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/ProductGallery";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getShopConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingBag, Info, Heart } from "lucide-react";
import { ZaloIcon, FacebookIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { getContactUrls } from "@/lib/contact";

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

  const title = `${product.name} - Tiệm Nhà Bee`;
  const description = product.description?.substring(0, 160) || `Sản phẩm handmade ${product.name} tinh tế tại Tiệm Nhà Bee. Đặt hàng ngay!`;

  return {
    title,
    description,
    keywords: [product.name, "handmade", "đồ len", "quà tặng", "tiệm nhà bee", "crochet"],
    openGraph: {
      title,
      description,
      type: "website",
      images: product.cover_image ? [{ url: product.cover_image, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.cover_image ? [product.cover_image] : [],
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await prisma.products.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  const shopConfig = await getShopConfig();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tiemnhabee.com";
  const productUrl = `${baseUrl}/san-pham/${product.slug}`;

  const { fbUrl, zaloUrl } = getContactUrls(shopConfig, product.name, productUrl);

  // Fetch related products
  const relatedProducts = await prisma.products.findMany({
    where: {
      AND: [
        { id: { not: product.id } },
        {
          OR: [
            { category_id: product.category_id },
            { name: { contains: product.name.split(' ')[0], mode: 'insensitive' } }
          ]
        }
      ]
    },
    take: 20,
    orderBy: { created_at: 'desc' },
  });

  const priceFormatted = product.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))
    : 'Liên hệ';

  const imagesArray = Array.isArray(product.images) ? (product.images as string[]) : [];
  const allImages = imagesArray.length > 0 ? imagesArray : (product.cover_image ? [product.cover_image] : []);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": allImages,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Tiệm Nhà Bee"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "VND",
      "price": product.price ? Number(product.price) : 0,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Sản phẩm", href: "/san-pham" },
          { label: product.name }
        ]}
      />

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery */}
        <ProductGallery images={allImages} productName={product.name} />

        {/* Info */}
        <div className="space-y-8 sticky top-24">
          <div className="space-y-4">
            {product.category && (
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-amber-600">{priceFormatted}</p>
          </div>

          <div className="pt-8 space-y-4 border-t border-neutral-100">
            {/* Facebook Messenger Button */}
            {fbUrl && (
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-lg font-bold text-white rounded-[2rem] transition-all shadow-xl active:scale-[0.98] group bg-[#0866FF] hover:bg-[#0055D4] shadow-[#0866FF]/20"
              >
                <FacebookIcon size={24} />
                Liên hệ qua Facebook
              </a>
            )}

            {/* Zalo Button */}
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-lg font-bold text-white rounded-[2rem] transition-all shadow-xl active:scale-[0.98] group bg-[#0068FF] hover:bg-[#0055D4] shadow-[#0068FF]/20"
              >
                <ZaloIcon size={24} />
                Liên hệ qua Zalo
              </a>
            )}

            {!fbUrl && !zaloUrl && (
              <a
                href="https://m.me/tiemnhabee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-5 text-lg font-bold text-white rounded-[2rem] transition-all shadow-xl active:scale-[0.98] group bg-neutral-900 hover:bg-amber-600 shadow-neutral-900/20"
              >
                <MessageCircle className="w-6 h-6" />
                Liên hệ tư vấn
              </a>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-2xl flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-medium text-neutral-600">Thiết kế theo yêu cầu</span>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-xs font-medium text-neutral-600">Tỉ mỉ từng mũi len</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Description Section */}
      <div className="pt-12 border-t border-neutral-100">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-md font-bold text-neutral-900">Mô tả chi tiết</h2>
          </div>

          <div className="bg-white p-6 rounded-md border border-neutral-100 shadow-sm">
            <div className="prose prose-neutral max-w-none prose-p:leading-relaxed prose-p:text-neutral-600">
              <p className="whitespace-pre-wrap">
                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-10 pt-12 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-neutral-900">Sản phẩm, dịch vụ khác</h2>
              <p className="text-sm text-neutral-500">Gợi ý dành riêng cho bạn từ Tiệm Nhà Bee</p>
            </div>
            <Link href="/san-pham" className="text-sm font-bold text-amber-600 hover:underline px-4 py-2 bg-amber-50 rounded-xl">
              Xem tất cả
            </Link>
          </div>

          <ProductCarousel products={relatedProducts} contactUrl={contactUrl} />
        </div>
      )}
    </div>
  );
}
