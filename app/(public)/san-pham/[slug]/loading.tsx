import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="space-y-12 pb-20 px-4 md:px-0">
      {/* Breadcrumbs Skeleton */}
      <Skeleton className="h-6 w-64 rounded-lg" />

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-[2rem]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-xl" />
            <Skeleton className="h-10 w-1/3 rounded-xl" />
          </div>

          <div className="pt-8 space-y-4 border-t border-neutral-100">
            <Skeleton className="h-16 w-full rounded-[2rem]" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="pt-12 border-t border-neutral-100">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-8 pt-12 border-t border-neutral-100">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
