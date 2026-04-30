import Image from "next/image";
import { Heart, Star, ShieldCheck, Flower2 } from "lucide-react";

export const metadata = {
  title: "Về chúng tôi - Tiệm Nhà Bee",
  description: "Câu chuyện về tâm huyết và sự tỉ mỉ trong từng mũi len handmade tại Tiệm Nhà Bee.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-[3rem] bg-amber-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
          {/* Giả lập pattern len bằng CSS */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-full uppercase tracking-widest">
            Câu chuyện của Bee
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-neutral-900 tracking-tight leading-tight">
            Gửi gắm yêu thương <br /> 
            <span className="text-amber-600">trong từng mũi len</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-neutral-600 font-medium leading-relaxed">
            Tiệm Nhà Bee không chỉ bán đồ handmade, chúng mình trao đi những món quà mang hơi ấm và tâm hồn của người thợ.
          </p>
        </div>
        </section>

      {/* Philosophy Section */}
      <section className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
          <Image 
            src="https://images.unsplash.com/photo-1601050638924-42171120409a?q=80&w=1000&auto=format&fit=crop" 
            alt="Đan len tỉ mỉ" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">Sứ mệnh của Bee</h2>
            <p className="text-lg text-neutral-600 leading-relaxed italic">
              "Trong một thế giới công nghiệp hối hả, chúng mình chọn dừng lại, dành hàng giờ đồng hồ để móc từng mũi len, phối từng gam màu để tạo ra một người bạn nhỏ mang tên Gấu Bông."
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="text-amber-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Tâm huyết</h3>
              <p className="text-sm text-neutral-500">Mỗi sản phẩm là kết quả của sự kiên nhẫn và đam mê nghệ thuật đan móc.</p>
            </div>
            <div className="p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="text-amber-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Chất lượng</h3>
              <p className="text-sm text-neutral-500">Chúng mình chọn lọc những dòng len mềm mại nhất, an toàn cho cả trẻ nhỏ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="bg-neutral-900 text-white p-10 md:p-20 rounded-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Flower2 size={200} />
        </div>
        
        <div className="max-w-3xl space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Về Nguyên Liệu</h2>
          <p className="text-xl text-neutral-400 leading-relaxed">
            Để có được thành phẩm đẹp, nguyên liệu là quan trọng nhất. Tiệm Nhà Bee cung cấp các loại len sợi nhập khẩu, kim móc và phụ liệu được chính tay chúng mình kiểm tra và sử dụng hàng ngày.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold">
              <Star size={18} fill="currentColor" />
              <span>Len Cotton Milk</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500 font-bold">
              <Star size={18} fill="currentColor" />
              <span>Len Nhung Đũa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center py-10 space-y-8">
        <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">Kết nối với chúng mình</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/san-pham" className="px-8 py-4 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20">
            Xem sản phẩm
          </a>
          <a href="/lien-he" className="px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-900 font-bold rounded-full hover:border-amber-600 transition-all">
            Gửi lời nhắn
          </a>
        </div>
      </section>
    </div>
  );
}
