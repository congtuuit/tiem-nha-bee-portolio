import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";

// Định dạng dữ liệu đầu vào mong muốn
interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  status?: "draft" | "published";
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Xác thực bảo mật (Authentication)
    // Cần truyền API Key qua header Authorization: Bearer <API_KEY>
    // Hoặc header x-api-key: <API_KEY>
    const authHeader = request.headers.get("authorization");
    const apiKeyHeader = request.headers.get("x-api-key");
    const systemApiKey = process.env.ADMIN_API_KEY;

    if (!systemApiKey) {
      return NextResponse.json(
        { error: "Server chưa cấu hình ADMIN_API_KEY trong .env để bảo mật API này." },
        { status: 500 }
      );
    }

    const providedKey = (authHeader?.replace("Bearer ", "") || apiKeyHeader)?.trim();

    if (providedKey !== systemApiKey) {
      return NextResponse.json(
        { error: "Unauthorized. Sai API Key." },
        { status: 401 }
      );
    }

    // 2. Parse dữ liệu
    const body: CreatePostPayload = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Thiếu trường dữ liệu bắt buộc: title và content" },
        { status: 400 }
      );
    }

    // 3. Xử lý Logic
    const slug = slugify(body.title, { lower: true, strict: true, locale: "vi" });

    // Kiểm tra trùng slug
    const existing = await prisma.posts.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Xử lý tạo excerpt tự động nếu không có
    const autoExcerpt = body.content.replace(/<[^>]*>/g, "").substring(0, 200);

    // 4. Lưu vào Database
    const post = await prisma.posts.create({
      data: {
        title: body.title,
        slug: finalSlug,
        content: body.content,
        excerpt: body.excerpt || autoExcerpt,
        cover_image: body.cover_image || null,
        status: body.status || "draft",
        seo_title: body.seo_title || body.title,
        seo_description: body.seo_description || body.excerpt || autoExcerpt,
        seo_keywords: body.seo_keywords || "",
      },
    });

    // 5. Xóa Cache (Revalidate)
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidateTag("posts");

    // 6. Trả về kết quả
    return NextResponse.json({
      success: true,
      message: "Tạo bài viết thành công",
      data: {
        id: post.id,
        slug: post.slug,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.tiemnhabee.store"}/blog/${post.slug}`,
      },
    });

  } catch (error) {
    console.error("API Create Post Error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống khi lưu bài viết." },
      { status: 500 }
    );
  }
}
