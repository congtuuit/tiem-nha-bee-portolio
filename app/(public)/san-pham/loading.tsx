import { Skeleton } from "@/components/ui/skeleton";
import { ProductListSkeleton } from "@/components/ProductListSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-6 w-32 rounded-md" />

      {/* Page Header Skeleton */}
      <Skeleton className="h-64 w-full rounded-[3rem]" />

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Desktop Sidebar Filters Skeleton */}
        <aside className="hidden lg:block space-y-8">
          <Skeleton className="h-[500px] w-full rounded-3xl" />
        </aside>

        {/* Main Content Skeleton */}
        <div className="space-y-6">
          {/* Top Bar Skeleton */}
          <Skeleton className="h-20 w-full rounded-2xl" />
          <ProductListSkeleton />
        </div>
      </div>
    </div>
  );
}
