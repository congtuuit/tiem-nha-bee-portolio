"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateProductCategory(productId: string, categoryId: string | null) {
  try {
    await prisma.products.update({
      where: { id: productId },
      data: { category_id: categoryId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/san-pham", "layout");
    revalidatePath("/", "layout");
    revalidateTag("products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Không thể cập nhật danh mục" };
  }
}
