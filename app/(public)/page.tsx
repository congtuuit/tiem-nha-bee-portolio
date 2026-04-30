import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { Metadata } from "next";
import Link from "next/link";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { ShoppingBag, Sparkles, Heart, Package, ArrowRight } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: shopConfig?.meta_title || "Tiệm Nhà Bee | Đồ Handmade & Quà Tặng",
    description: shopConfig?.meta_description || "Cửa hàng đồ handmade, quà tặng ý nghĩa và độc đáo.",
  };
}

export default async function HomePage() {
  const shopConfig = await getShopConfig();
  
  // Fetch Featured Products (Newest 8)
  const products = await prisma.products.findMany({
    take: 8,
    orderBy: { created_at: "desc" },
  });

  // Fetch Parent Categories for featured section
  const categories = await prisma.categories.findMany({
    where: { parent_id: null },
    take: 2,
  });

  const contactUrl = shopConfig?.facebook_url || shopConfig?.zalo_url || "#";

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-[3rem] bg-neutral-900 group">
        {shopConfig?.hero_image ? (
          <ImageWithSkeleton 
            src={shopConfig.hero_image} 
            alt="Hero" 
            fill 
            containerClassName="absolute inset-0"
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full text-amber-400 text-sm font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="w-4 h-4" />
            <span>Tiệm Nhà Bee</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
            {shopConfig?.hero_title || "Gửi gắm yêu thương trong từng mũi len"}
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {shopConfig?.hero_subtitle || "Sản phẩm handmade tỉ mỉ và nguyên liệu len sợi chất lượng cao cho cộng đồng yêu đan móc."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link 
              href="/san-pham" 
              className="px-8 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 group"
            >
              Xem ngay bộ sưu tập
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">Khám phá Tiệm Bee</h2>
          <p className="text-neutral-500 font-medium">Chúng mình có mọi thứ bạn cần cho niềm đam mê len sợi</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id}
              href={`/san-pham?category=${cat.id}`}
              className={`relative h-[300px] rounded-[2.5rem] overflow-hidden group shadow-xl ${idx === 0 ? 'md:mt-8' : ''}`}
            >
              <div className="absolute inset-0 bg-neutral-100 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 space-y-2">
                <h3 className="text-3xl font-black text-white">{cat.name}</h3>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
             <>
                <Link href="/san-pham" className="relative h-[300px] rounded-[2.5rem] overflow-hidden group shadow-xl md:mt-8">
                  <div className="absolute inset-0 bg-amber-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-3xl font-black text-white">Sản phẩm Handmade</h3>
                  </div>
                </Link>
                <Link href="/san-pham" className="relative h-[300px] rounded-[2.5rem] overflow-hidden group shadow-xl">
                  <div className="absolute inset-0 bg-neutral-200" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-3xl font-black text-white">Nguyên liệu & Len sợi</h3>
                  </div>
                </Link>
             </>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">Tâm huyết của Bee</h2>
            <p className="text-neutral-500 font-medium text-lg">Những mẫu mới nhất vừa hoàn thiện tại xưởng</p>
          </div>
          <Link href="/san-pham" className="flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all">
            Xem tất cả sản phẩm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} contactUrl={contactUrl} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-amber-50 rounded-[4rem] p-10 md:p-20 grid lg:grid-cols-3 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
            Tại sao là <br /> <span className="text-amber-600">Tiệm Nhà Bee?</span>
          </h2>
          <p className="text-neutral-600 leading-relaxed font-medium">
            Chúng mình không chỉ bán len, chúng mình bán niềm vui từ đôi bàn tay.
          </p>
        </div>
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-600">
              <Heart className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">100% Tình yêu</h4>
            <p className="text-neutral-500 text-sm leading-relaxed">Mỗi sản phẩm là một câu chuyện riêng, được làm với tất cả tâm sức.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-600">
              <Package className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">Chất lượng cao</h4>
            <p className="text-neutral-500 text-sm leading-relaxed">Tuyển chọn những dòng len sợi mềm mịn, không xù lông và bền màu.</p>
          </div>
        </div>
      </section>

      {/* Community / Footer CTA */}
      <section className="text-center py-20 space-y-10 relative overflow-hidden rounded-[4rem] bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-from)_0%,_transparent_50%)] from-amber-600/20 to-transparent" />
        <div className="relative z-10 space-y-6 px-4">
          <h2 className="text-3xl md:text-6xl font-black tracking-tight">Bạn đã sẵn sàng cùng Bee <br /> tạo nên điều kỳ diệu?</h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg">Gia nhập cộng đồng yêu handmade và bắt đầu hành trình của bạn ngay hôm nay.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Link href="/lien-he" className="px-10 py-4 bg-white text-neutral-900 font-bold rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-2xl">
              Liên hệ tư vấn
            </Link>
            <Link href="/san-pham" className="px-10 py-4 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-700 transition-all border border-neutral-700">
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
