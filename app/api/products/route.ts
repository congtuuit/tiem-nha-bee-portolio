import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const page = searchParams.get("page") || "1";
    
    const pageSize = 20;
    const currentPage = parseInt(page);

    const where: Prisma.productsWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    if (categorySlug) {
      const category = await prisma.categories.findUnique({
        where: { slug: categorySlug }
      });
      if (category) {
        where.category_id = category.id;
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy: Prisma.productsOrderByWithRelationInput = {};
    if (sort === "price_asc") orderBy.price = "asc";
    else if (sort === "price_desc") orderBy.price = "desc";
    else orderBy.created_at = "desc";

    const [rawProducts, count] = await Promise.all([
      prisma.products.findMany({
        where,
        orderBy,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          cover_image: true,
          category: { select: { name: true } },
        },
      }),
      prisma.products.count({ where })
    ]);

    const products = rawProducts.map(p => ({
      ...p,
      price: p.price ? Number(p.price) : null
    }));

    const totalPages = Math.ceil(count / pageSize);

    return NextResponse.json({
      products,
      totalCount: count,
      totalPages,
      currentPage
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
