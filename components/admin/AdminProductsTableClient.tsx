"use client";

import { DeleteProductButton } from "@/components/DeleteProductButton";
import { ChevronLeft, ChevronRight, Edit, Filter, Image as ImageIcon, Loader2, Package, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;
const SEARCH_MIN_LENGTH = 3;

type CategoryOption = {
  id: string;
  name: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  cover_image: string | null;
  status: string;
  created_at: string;
  category: {
    name: string;
  } | null;
};

type Props = {
  categories: CategoryOption[];
  currentPage: number;
  endRow: number;
  hasFilters: boolean;
  pageNumbers: number[];
  products: ProductRow[];
  search: string;
  selectedCategory: string;
  selectedSort: string;
  selectedStatus: string;
  startRow: number;
  totalCount: number;
  totalPages: number;
};

function buildAdminProductsUrl(
  params: {
    category?: string;
    page?: number;
    search?: string;
    sort?: string;
    status?: string;
  },
  pathname: string
) {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.category) {
    query.set("category", params.category);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.sort && params.sort !== "newest") {
    query.set("sort", params.sort);
  }

  if (params.page && params.page > 1) {
    query.set("page", params.page.toString());
  }

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

function formatPrice(price: string | null) {
  if (!price) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
}

export function AdminProductsTableClient({
  categories,
  currentPage,
  endRow,
  hasFilters,
  pageNumbers,
  products,
  search,
  selectedCategory,
  selectedSort,
  selectedStatus,
  startRow,
  totalCount,
  totalPages,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(search);
  const deferredSearchInput = useDeferredValue(searchInput);
  const lastAppliedSearchRef = useRef(search);

  const baseParams = useMemo(
    () => ({
      category: selectedCategory,
      search,
      sort: selectedSort,
      status: selectedStatus,
    }),
    [search, selectedCategory, selectedSort, selectedStatus]
  );

  useEffect(() => {
    if (currentPage < totalPages) {
      router.prefetch(buildAdminProductsUrl({ ...baseParams, page: currentPage + 1 }, pathname));
    }

    if (currentPage > 1) {
      router.prefetch(buildAdminProductsUrl({ ...baseParams, page: currentPage - 1 }, pathname));
    }
  }, [baseParams, currentPage, pathname, router, totalPages]);

  useEffect(() => {
    const trimmedSearch = deferredSearchInput.trim();

    if (trimmedSearch === lastAppliedSearchRef.current) {
      return;
    }

    if (trimmedSearch !== "" && trimmedSearch.length < SEARCH_MIN_LENGTH) {
      return;
    }

    if (trimmedSearch === "") {
      lastAppliedSearchRef.current = "";
      const url = buildAdminProductsUrl(
        {
          category: selectedCategory,
          search: "",
          sort: selectedSort,
          status: selectedStatus,
        },
        pathname
      );

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      lastAppliedSearchRef.current = trimmedSearch;
      const url = buildAdminProductsUrl(
        {
          category: selectedCategory,
          search: trimmedSearch,
          sort: selectedSort,
          status: selectedStatus,
        },
        pathname
      );

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [deferredSearchInput, pathname, router, selectedCategory, selectedSort, selectedStatus]);

  function navigate(url: string, mode: "push" | "replace" = "push") {
    startTransition(() => {
      if (mode === "replace") {
        router.replace(url, { scroll: false });
        return;
      }

      router.push(url, { scroll: false });
    });
  }

  function navigateWithParams(
    nextValues: Partial<{
      category: string;
      page: number;
      search: string;
      sort: string;
      status: string;
    }>,
    mode: "push" | "replace" = "replace"
  ) {
    const nextSearch = nextValues.search ?? search;
    const url = buildAdminProductsUrl(
      {
        category: nextValues.category ?? selectedCategory,
        page: nextValues.page,
        search: nextSearch,
        sort: nextValues.sort ?? selectedSort,
        status: nextValues.status ?? selectedStatus,
      },
      pathname
    );

    navigate(url, mode);
  }

  function handleSelectChange(key: "category" | "sort" | "status", value: string) {
    navigateWithParams(
      {
        [key]: value,
        page: 1,
      },
      "replace"
    );
  }

  function handleSearchSubmit() {
    const trimmedSearch = searchInput.trim();

    if (trimmedSearch !== "" && trimmedSearch.length < SEARCH_MIN_LENGTH) {
      return;
    }

    lastAppliedSearchRef.current = trimmedSearch;
    navigateWithParams(
      {
        page: 1,
        search: trimmedSearch,
      },
      "replace"
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(180px,1fr))]">
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                placeholder="Tìm theo tên, slug hoặc mô tả..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white"
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") {
                    return;
                  }

                  event.preventDefault();
                  handleSearchSubmit();
                }}
              />
            </div>
            <div className="mt-2 px-1 text-xs text-slate-400">Nhập từ {SEARCH_MIN_LENGTH} ký tự. Enter để tìm ngay.</div>
          </div>

          <select
            value={selectedCategory}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white"
            onChange={(event) => handleSelectChange("category", event.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            <option value="uncategorized">Chưa phân loại</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white"
            onChange={(event) => handleSelectChange("status", event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hiển thị</option>
            <option value="draft">Nháp</option>
            <option value="hidden">Đã ẩn</option>
          </select>

          <select
            value={selectedSort}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white"
            onChange={(event) => handleSelectChange("sort", event.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-500">
            Hiển thị <span className="font-semibold text-slate-700">{startRow}-{endRow}</span> trên{" "}
            <span className="font-semibold text-slate-700">{totalCount}</span> sản phẩm
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {hasFilters ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                onClick={() => {
                  lastAppliedSearchRef.current = "";
                  setSearchInput("");
                  navigate(pathname, "replace");
                }}
              >
                Xóa bộ lọc
              </button>
            ) : null}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={searchInput.trim() !== "" && searchInput.trim().length < SEARCH_MIN_LENGTH}
              onClick={handleSearchSubmit}
            >
              <Filter className="h-4 w-4" />
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative overflow-x-auto">
          {isPending ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải dữ liệu...
              </div>
            </div>
          ) : null}

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
            <tbody className={`divide-y divide-slate-100 ${isPending ? "pointer-events-none opacity-60" : ""}`}>
              {products.map((product, index) => {
                const rowNumber = (currentPage - 1) * PAGE_SIZE + index + 1;
                const statusLabel =
                  product.status === "draft"
                    ? "Nháp"
                    : product.status === "hidden"
                      ? "Đã ẩn"
                      : "Đang hiển thị";
                const statusClasses =
                  product.status === "draft"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : product.status === "hidden"
                      ? "border-slate-200 bg-slate-100 text-slate-600"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700";

                return (
                  <tr key={product.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">{rowNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {product.cover_image ? (
                            <Image src={product.cover_image} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-slate-800">{product.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="max-w-[140px] truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                              {product.slug}
                            </span>
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                              {product.category?.name ?? "Chưa phân loại"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(product.created_at).toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Package className="mb-4 h-16 w-16 text-slate-200" />
                      <p className="text-lg font-medium text-slate-600">Không tìm thấy sản phẩm phù hợp</p>
                      <p className="mt-1 text-sm">Hãy thay đổi từ khóa hoặc bộ lọc hiện tại.</p>
                      <Link
                        href="/admin/products/create"
                        className="mt-6 rounded-xl bg-amber-100 px-6 py-2.5 font-medium text-amber-700 transition-colors hover:bg-amber-200"
                      >
                        Thêm sản phẩm mới
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Trang <span className="font-semibold text-slate-700">{currentPage}</span> / {totalPages}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-disabled={currentPage === 1}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? "pointer-events-none border-slate-200 text-slate-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => navigateWithParams({ page: currentPage - 1 }, "push")}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-colors ${
                    pageNumber === currentPage
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                  onClick={() => navigateWithParams({ page: pageNumber }, "push")}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                aria-disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? "pointer-events-none border-slate-200 text-slate-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => navigateWithParams({ page: currentPage + 1 }, "push")}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
