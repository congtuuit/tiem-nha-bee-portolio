import { Loading } from "@/components/Loading";

export default function ProductsLoading() {
  return (
    <div className="space-y-8 pb-20">
      <div className="h-6 w-48 bg-neutral-100 animate-pulse rounded-lg" />
      
      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        <aside className="hidden lg:block space-y-8">
          <div className="h-64 w-full bg-neutral-100 animate-pulse rounded-2xl" />
          <div className="h-40 w-full bg-neutral-100 animate-pulse rounded-2xl" />
        </aside>

        <div className="space-y-6">
          <div className="h-16 w-full bg-neutral-100 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] w-full bg-neutral-100 animate-pulse rounded-3xl" />
            ))}
          </div>
          <Loading text="Đang chuẩn bị sản phẩm cho bạn..." className="py-10" />
        </div>
      </div>
    </div>
  );
}
