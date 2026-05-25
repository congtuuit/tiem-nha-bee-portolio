import { DeleteProductButton } from "@/components/DeleteProductButton";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, Edit, Filter, Image as ImageIcon, Package, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 10;
const PAGE_NUMBER_WINDOW = 5;

type AdminProductsSearchParams = Promise<{
  category?: string;
  page?: string;
  search?: string;
  sort?: string;
  status?: string;
}>;

function toPositiveInt(value?: string) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildAdminProductsUrl(
  params: {
    category?: string;
    search?: string;
    sort?: string;
    status?: string;
  },
  page: number
) {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.status) query.set("status", params.status);
  if (params.sort) query.set("sort", params.sort);
  if (page > 1) query.set("page", page.toString());

  const queryString = query.toString();
  return queryString ? `/admin/products?${queryString}` : "/admin/products";
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= PAGE_NUMBER_WINDOW) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const halfWindow = Math.floor(PAGE_NUMBER_WINDOW / 2);
  let start = Math.max(1, currentPage - halfWindow);
  const end = Math.min(totalPages, start + PAGE_NUMBER_WINDOW - 1);

  if (end - start + 1 < PAGE_NUMBER_WINDOW) {
    start = Math.max(1, end - PAGE_NUMBER_WINDOW + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default async function AdminProductsPage(props: {
  searchParams: AdminProductsSearchParams;
}) {
  const resolvedSearchParams = await props.searchParams;

  const search = resolvedSearchParams.search?.trim() ?? "";
  const category = resolvedSearchParams.category?.trim() ?? "";
  const status = resolvedSearchParams.status?.trim() ?? "";
  const sort = resolvedSearchParams.sort?.trim() ?? "newest";
  const currentPage = toPositiveInt(resolvedSearchParams.page);

  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const where: Prisma.productsWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category === "uncategorized") {
    where.category_id = null;
  } else if (category) {
    where.category_id = category;
  }

  if (status) {
    where.status = status;
  }

  const orderBy: Prisma.productsOrderByWithRelationInput =
    sort === "oldest"
      ? { created_at: "asc" }
      : sort === "name_asc"
        ? { name: "asc" }
        : sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
            ? { price: "desc" }
            : { created_at: "desc" };

  const totalCount = await prisma.products.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const products = await prisma.products.findMany({
    where,
    orderBy,
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const paginationBaseParams = {
    category,
    search,
    sort,
    status,
  };
  const pageNumbers = getVisiblePageNumbers(safePage, totalPages);
  const hasFilters = Boolean(search || category || status || sort !== "newest");
  const startRow = totalCount === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endRow = totalCount === 0 ? 0 : startRow + products.length - 1;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Danh sách sản phẩm</h1>
          <p className="mt-1 text-slate-500">Quản lý, tìm kiếm và lọc sản phẩm trong cửa hàng.</p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-medium text-white shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-amber-600/40"
        >
          <Plus className="h-5 w-5" />
          Thêm sản phẩm
        </Link>
      </div>

      <form className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(180px,1fr))]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Tìm theo tên, slug hoặc mô tả..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-amber-500 focus:bg-white"
            />
          </div>

          <select
            name="category"
            defaultValue={category}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition-all focus:border-amber-500 focus:bg-white"
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
            name="status"
            defaultValue={status}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition-all focus:border-amber-500 focus:bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hiển thị</option>
            <option value="draft">Nháp</option>
            <option value="hidden">Đã ẩn</option>
          </select>

          <select
            name="sort"
            defaultValue={sort}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition-all focus:border-amber-500 focus:bg-white"
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
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Xóa bộ lọc
              </Link>
            ) : null}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-slate-800"
            >
              <Filter className="h-4 w-4" />
              Áp dụng
            </button>
          </div>
        </div>
      </form>

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
            <tbody className="divide-y divide-slate-100">
              {products.map((product, index) => {
                const rowNumber = (safePage - 1) * PAGE_SIZE + index + 1;
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
                        {product.price !== null
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(Number(product.price))
                          : "Liên hệ"}
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
                        year: "numeric",
                        month: "short",
                        day: "numeric",
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
              Trang <span className="font-semibold text-slate-700">{safePage}</span> / {totalPages}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={buildAdminProductsUrl(paginationBaseParams, safePage - 1)}
                aria-disabled={safePage === 1}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  safePage === 1
                    ? "pointer-events-none border-slate-200 text-slate-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Link>

              {pageNumbers.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={buildAdminProductsUrl(paginationBaseParams, pageNumber)}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-colors ${
                    pageNumber === safePage
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}

              <Link
                href={buildAdminProductsUrl(paginationBaseParams, safePage + 1)}
                aria-disabled={safePage === totalPages}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  safePage === totalPages
                    ? "pointer-events-none border-slate-200 text-slate-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
