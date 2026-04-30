export default function ProductDetailLoading() {
  return (
    <div className="space-y-12 pb-20 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="h-4 w-64 bg-neutral-100 rounded-lg" />

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-neutral-100 rounded-[2rem]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-amber-50 rounded-full" />
            <div className="h-12 w-3/4 bg-neutral-100 rounded-xl" />
            <div className="h-10 w-1/3 bg-neutral-100 rounded-xl" />
          </div>

          <div className="pt-8 space-y-4 border-t border-neutral-100">
            <div className="h-16 w-full bg-neutral-100 rounded-[2rem]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-neutral-50 rounded-2xl" />
              <div className="h-16 bg-neutral-50 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="pt-12 border-t border-neutral-100">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl" />
            <div className="h-6 w-32 bg-neutral-100 rounded-lg" />
          </div>
          <div className="h-64 w-full bg-neutral-50 rounded-3xl" />
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-8 pt-12 border-t border-neutral-100">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-neutral-100 rounded-lg" />
            <div className="h-4 w-64 bg-neutral-100 rounded-lg" />
          </div>
          <div className="h-10 w-24 bg-neutral-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-neutral-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
