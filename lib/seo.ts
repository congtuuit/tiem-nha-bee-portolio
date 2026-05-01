/**
 * Công cụ hỗ trợ tạo tiêu đề SEO (SEO Title) chuẩn cho sản phẩm.
 * Công thức: [Tên chính] + [Đặc tính/Chất liệu] + [Mục đích sử dụng/Quà tặng] + [Thương hiệu]
 */
export function generateSeoTitle(
  productName: string,
  material: string = "Len Móc Handmade",
  purpose: string = "Quà Tặng Ý Nghĩa",
  brandName: string = "Tiệm Nhà Bee"
): string {
  const cleanName = productName.trim();
  
  if (cleanName.length > 50) {
    return `${cleanName} - ${brandName}`;
  }

  return `${cleanName} ${material} ${purpose} - ${brandName}`;
}

/**
 * Tự động tạo Alt Text cho hình ảnh sản phẩm.
 */
export function generateImageAlt(
  productName: string,
  index: number = 0,
  context: string = "Ảnh chi tiết"
): string {
  if (index === 0 && context === "Ảnh chi tiết") {
    return `${productName} - Ảnh tổng quan`;
  }
  return `${productName} - ${context} ${index + 1}`;
}
