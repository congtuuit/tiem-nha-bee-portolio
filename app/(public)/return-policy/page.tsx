import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { CheckCircle2, XCircle, AlertTriangle, ClipboardList, Truck, Wallet, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính sách đổi trả hàng",
  description: "Quy định về việc đổi trả sản phẩm và hoàn tiền tại Tiệm Nhà Bee.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="space-y-8 pb-20">
      <Breadcrumbs items={[{ label: "Chính sách đổi trả" }]} />

      {/* Hero Section */}
      <section className="relative py-12 px-8 rounded-[3rem] overflow-hidden bg-neutral-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest mb-4">
            <HeartHandshake className="w-5 h-5" />
            <span>Cam kết từ Tiệm</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Chính Sách Đổi Trả
          </h1>
          <p className="text-neutral-300 font-medium max-w-2xl text-lg leading-relaxed">
            Tiệm Nhà Bee luôn mong muốn mang đến trải nghiệm tuyệt vời nhất. Dưới đây là những quy định minh bạch về việc đổi trả sản phẩm thủ công để bảo vệ quyền lợi của bạn.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        {/* Section 1: Điều kiện chấp nhận */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">1. Điều kiện hỗ trợ đổi/trả</h2>
          </div>
          <div className="space-y-6 text-slate-600 leading-relaxed ml-2 md:ml-16">
            <p>
              Chúng tôi hỗ trợ đổi/trả sản phẩm trong vòng <strong className="text-amber-600">03 ngày</strong> kể từ ngày nhận hàng (căn cứ theo mã vận đơn) đối với các trường hợp:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                <span>Sản phẩm bị lỗi kỹ thuật do quá trình sản xuất (tuột chỉ, đứt len, lỗi form dáng nghiêm trọng).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                <span>Sản phẩm bị hư hỏng, biến dạng do quá trình vận chuyển.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                <span>Giao sai sản phẩm, sai màu sắc hoặc thiếu số lượng so với đơn đặt hàng.</span>
              </li>
            </ul>
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 mt-6">
              <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" /> Yêu cầu bắt buộc
              </h4>
              <ul className="list-disc list-inside space-y-1 text-amber-700/90 ml-1">
                <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng, không dính bẩn hay ám mùi.</li>
                <li><strong>Phải có Video quay lại toàn bộ quá trình khui kiện hàng</strong> còn nguyên niêm phong để làm bằng chứng đối chiếu.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Trường hợp từ chối */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">2. Trường hợp KHÔNG hỗ trợ</h2>
          </div>
          <div className="text-slate-600 leading-relaxed ml-2 md:ml-16">
            <p className="mb-4">
              Đặc thù của sản phẩm handmade là làm thủ công, mỗi sản phẩm sẽ có nét độc bản riêng. Chúng tôi xin phép từ chối đổi trả với các trường hợp:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Sản phẩm đặt làm theo yêu cầu riêng (custom) về kích thước, thêu tên.",
                "Khách hàng thay đổi ý định, không ưng ý sau khi nhận hàng.",
                "Hư hại do quá trình sử dụng và bảo quản sai cách (giặt máy mạnh, phơi nắng gắt).",
                "Chênh lệch màu sắc nhỏ do ánh sáng chụp ảnh hoặc màn hình thiết bị.",
                "Chênh lệch kích thước ± 1-2cm (sai số cho phép của đồ thủ công)."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                  <XCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Quy trình */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">3. Quy trình đổi trả</h2>
          </div>
          <div className="ml-2 md:ml-16 grid gap-6 md:grid-cols-2">
            <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">1</div>
              <h3 className="font-bold text-slate-800 mb-2">Liên hệ Tiệm</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Nhắn tin cho Tiệm qua Zalo/Fanpage trong vòng <strong>03 ngày</strong> sau khi nhận hàng.</p>
            </div>
            <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">2</div>
              <h3 className="font-bold text-slate-800 mb-2">Cung cấp bằng chứng</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Gửi kèm Mã đơn hàng, hình ảnh tình trạng sản phẩm và <strong>Video khui hàng</strong> rõ nét.</p>
            </div>
            <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">3</div>
              <h3 className="font-bold text-slate-800 mb-2">Chờ phản hồi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Tiệm sẽ kiểm tra và phản hồi cách xử lý (kèm địa chỉ nhận hàng hoàn) trong 24h làm việc.</p>
            </div>
            <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">4</div>
              <h3 className="font-bold text-slate-800 mb-2">Gửi hàng và nhận bồi hoàn</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Gửi trả sản phẩm qua bưu điện. Sau khi nhận và đối chiếu, Tiệm sẽ gửi hàng mới hoặc hoàn tiền.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Chi phí & Hoàn tiền */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-slate-800">Phí vận chuyển</h3>
            </div>
            <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span><strong>Lỗi do Tiệm hoặc Vận chuyển:</strong> Tiệm Nhà Bee chịu 100% phí ship 2 chiều.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                <span><strong>Đổi sản phẩm khác (nếu Tiệm đồng ý):</strong> Khách hàng thanh toán phí ship 2 chiều phát sinh.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-800">Hoàn tiền</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Nếu Tiệm hết nguyên liệu làm mẫu đó hoặc khách không muốn đổi mới, chúng tôi sẽ hoàn tiền qua Chuyển khoản ngân hàng.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>Thời gian xử lý:</strong> Từ 1-3 ngày làm việc sau khi Tiệm nhận lại và kiểm tra tình trạng hàng trả.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-neutral-400 italic pt-8 px-4">
        Cảm ơn bạn đã thấu hiểu và trân trọng công sức của những người thợ làm đồ handmade.
        <br /> Tiệm Nhà Bee sẽ luôn nỗ lực để mang đến những sản phẩm chỉn chu nhất!
      </p>
    </div>
  );
}
