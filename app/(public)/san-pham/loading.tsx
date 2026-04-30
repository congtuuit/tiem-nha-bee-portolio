import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-8 pb-20 px-4 md:px-0">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-6 w-48 rounded-lg" />
      
      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </aside>

        {/* Main content skeleton */}
        <div className="space-y-8">
          {/* Header/Sort skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>

          {/* Product Grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 group">
                <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
