import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2Client";

const IMPORT_SECRET = process.env.IMPORT_SECRET || "bee-secret-import-key";

async function uploadToR2(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const key = `products/${fileName}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Check Auth
    const authHeader = req.headers.get("x-import-secret");
    if (authHeader !== IMPORT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const productName = formData.get("productName") as string;
    const categoryPathJson = formData.get("categoryPath") as string; // JSON array
    const price = parseFloat(formData.get("price") as string || "0");
    const description = formData.get("description") as string || "";
    const images = formData.getAll("images") as File[];

    if (!productName || !categoryPathJson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const categoryPath = JSON.parse(categoryPathJson) as string[];

    // 2. Handle Hierarchical Categories
    let parentId: string | null = null;
    let lastCategoryId: string | null = null;

    for (const catName of categoryPath) {
      const slug = slugify(catName, { lower: true, locale: 'vi' });

      let category: any = await prisma.categories.findFirst({
        where: {
          name: catName,
          parent_id: parentId
        }
      });

      if (!category) {
        category = await prisma.categories.create({
          data: {
            name: catName,
            slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`, // Ensure unique slug
            parent_id: parentId
          }
        });
      }

      parentId = category.id;
      lastCategoryId = category.id;
    }

    // 3. Upload Images
    const imageUrls: string[] = [];
    for (const image of images) {
      const url = await uploadToR2(image);
      imageUrls.push(url);
    }

    // 4. Create Product
    if (!lastCategoryId) {
      return NextResponse.json({ error: "Could not resolve category" }, { status: 400 });
    }

    const productSlug = slugify(productName, { lower: true, locale: 'vi' });
    const product = await prisma.products.create({
      data: {
        name: productName,
        slug: `${productSlug}-${Math.random().toString(36).substring(2, 5)}`,
        price: price,
        description: description,
        cover_image: imageUrls[0] || null,
        images: imageUrls,
        category_id: lastCategoryId,
        status: "active"
      }
    });

    return NextResponse.json({ success: true, product });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
