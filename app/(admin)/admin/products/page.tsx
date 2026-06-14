import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";

import { AdminProductsTableClient } from "@/components/admin/AdminProductsTableClient";

const PAGE_SIZE = 10;
const PAGE_NUMBER_WINDOW = 5;
const SEARCH_MIN_LENGTH = 3;

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

function getOrderBy(sort: string): Prisma.productsOrderByWithRelationInput {
  if (sort === "oldest") {
    return { created_at: "asc" };
  }

  if (sort === "name_asc") {
    return { name: "asc" };
  }

  if (sort === "price_asc") {
    return { price: "asc" };
  }

  if (sort === "price_desc") {
    return { price: "desc" };
  }

  return { created_at: "desc" };
}

export default async function AdminProductsPage(props: {
  searchParams: AdminProductsSearchParams;
}) {
  const resolvedSearchParams = await props.searchParams;

  const rawSearch = resolvedSearchParams.search?.trim() ?? "";
  const search = rawSearch.length >= SEARCH_MIN_LENGTH ? rawSearch : "";
  const category = resolvedSearchParams.category?.trim() ?? "";
  const status = resolvedSearchParams.status?.trim() ?? "";
  const sort = resolvedSearchParams.sort?.trim() ?? "newest";
  const currentPage = toPositiveInt(resolvedSearchParams.page);
  const orderBy = getOrderBy(sort);

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

  const requestedSkip = (currentPage - 1) * PAGE_SIZE;
  const [categories, totalCount, initialProducts] = await Promise.all([
    prisma.categories.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.products.count({ where }),
    prisma.products.findMany({
      where,
      orderBy,
      skip: requestedSkip,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        cover_image: true,
        status: true,
        created_at: true,
        category_id: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const products =
    safePage === currentPage
      ? initialProducts
      : await prisma.products.findMany({
          where,
          orderBy,
          skip: (safePage - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            cover_image: true,
            status: true,
            created_at: true,
            category_id: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        });

  const pageNumbers = getVisiblePageNumbers(safePage, totalPages);
  const hasFilters = Boolean(search || category || status || sort !== "newest");
  const startRow = totalCount === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endRow = totalCount === 0 ? 0 : startRow + products.length - 1;
  const serializedProducts = products.map((product) => ({
    ...product,
    created_at: product.created_at.toISOString(),
    price: product.price?.toString() ?? null,
  }));

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

      <AdminProductsTableClient
        key={[safePage, search, category, status, sort].join(":")}
        categories={categories}
        currentPage={safePage}
        endRow={endRow}
        hasFilters={hasFilters}
        pageNumbers={pageNumbers}
        products={serializedProducts}
        search={search}
        selectedCategory={category}
        selectedSort={sort}
        selectedStatus={status}
        startRow={startRow}
        totalCount={totalCount}
        totalPages={totalPages}
      />
    </div>
  );
}
