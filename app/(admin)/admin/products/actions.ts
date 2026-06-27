"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductCategory(productId: string, categoryId: string | null) {
  try {
    await prisma.products.update({
      where: { id: productId },
      data: { category_id: categoryId },
    });

    revalidatePath("/admin/products", "page");
    revalidatePath("/san-pham", "layout");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Không thể cập nhật danh mục" };
  }
}

export async function updateProductPrice(productId: string, price: number | null) {
  try {
    await prisma.products.update({
      where: { id: productId },
      data: { price },
    });

    revalidatePath("/admin/products", "page");
    revalidatePath("/san-pham", "layout");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update price:", error);
    return { success: false, error: "Không thể cập nhật giá bán" };
  }
}

export async function updateProductName(productId: string, name: string) {
  try {
    if (!name.trim()) {
      return { success: false, error: "Tên không được để trống" };
    }

    await prisma.products.update({
      where: { id: productId },
      data: { name: name.trim() },
    });

    revalidatePath("/admin/products", "page");
    revalidatePath("/san-pham", "layout");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update name:", error);
    return { success: false, error: "Không thể cập nhật tên sản phẩm" };
  }
}
