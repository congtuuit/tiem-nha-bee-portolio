import { prisma } from "./prisma";

export async function getShopConfig() {
  try {
    const config = await prisma.shop_config.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      // Return default values if not found
      return {
        id: "default",
        shop_name: "Tiệm Nhà Bee",
        phone: "0901234567",
        address: "TP. Hồ Chí Minh",
        zalo_url: "https://zalo.me/",
        facebook_url: "https://facebook.com/",
        footer_text: "Tiệm Nhà Bee - Chuyên đồ handmade và quà tặng",
        meta_title: "Tiệm Nhà Bee | Đồ Handmade & Quà Tặng",
        meta_description: "Cửa hàng đồ handmade, quà tặng ý nghĩa và độc đáo.",
      };
    }

    return config;
  } catch (error) {
    console.error("Error fetching shop config:", error);
    return null;
  }
}
