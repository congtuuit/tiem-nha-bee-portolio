import { Loading } from "@/components/Loading";

export default function AdminProductsLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="h-20 w-64 bg-slate-100 animate-pulse rounded-2xl" />
        <div className="h-12 w-40 bg-slate-100 animate-pulse rounded-xl" />
      </div>
      
      <div className="h-16 w-full bg-slate-100 animate-pulse rounded-2xl" />
      
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <Loading text="Đang tải danh sách sản phẩm..." className="py-20" />
      </div>
    </div>
  );
}
