"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  status: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}) {
  try {
    const slug = slugify(data.title, { lower: true, strict: true, locale: "vi" });

    // Check for existing slug
    const existing = await prisma.posts.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await prisma.posts.create({
      data: {
        title: data.title,
        slug: finalSlug,
        content: data.content,
        excerpt: data.excerpt || data.content?.replace(/<[^>]*>/g, "").substring(0, 200) || "",
        cover_image: data.cover_image || null,
        status: data.status,
        seo_title: data.seo_title || data.title,
        seo_description: data.seo_description || data.excerpt || "",
        seo_keywords: data.seo_keywords || "",
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidateTag("posts");

    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Không thể tạo bài viết" };
  }
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    status?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
  }
) {
  try {
    const post = await prisma.posts.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    revalidateTag("posts");

    return { success: true, post };
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, error: "Không thể cập nhật bài viết" };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.posts.delete({ where: { id } });

    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidateTag("posts");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Không thể xóa bài viết" };
  }
}
