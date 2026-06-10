function LoadingRow({ index }: { index: number }) {
  return (
    <tr key={index} className="animate-pulse border-b border-slate-100">
      <td className="px-6 py-4">
        <div className="h-4 w-8 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-3 w-28 rounded bg-slate-100" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 w-24 rounded-lg bg-amber-100" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-24 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
      </td>
      <td className="px-6 py-4">
        <div className="ml-auto h-8 w-20 rounded-lg bg-slate-200" />
      </td>
    </tr>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-12 w-44 animate-pulse rounded-xl bg-amber-100" />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(180px,1fr))]">
          <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse whitespace-nowrap text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Giá bán</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Ngày tạo</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, index) => (
                <LoadingRow key={index} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
