"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    router.push(`/san-pham?${params.toString()}`);
  };

  return (
    <select 
      className="text-sm bg-neutral-50 border-none rounded-lg py-1 pl-2 pr-8 focus:ring-0 cursor-pointer"
      value={sort}
      onChange={(e) => handleSortChange(e.target.value)}
    >
      <option value="">Sắp xếp mặc định</option>
      <option value="price_asc">Giá: Thấp đến Cao</option>
      <option value="price_desc">Giá: Cao đến Thấp</option>
    </select>
  );
}
