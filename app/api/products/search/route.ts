import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const categoryId = searchParams.get("categoryId");

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.products.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ]
          },
          categoryId ? { category_id: categoryId } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        cover_image: true,
      },
      take: 6,
    });

    let categories: any[] = [];
    if (products.length === 0) {
      categories = await prisma.categories.findMany({
        where: { parent_id: null },
        take: 4
      });
    }

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
