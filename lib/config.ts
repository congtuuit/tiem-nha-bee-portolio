import { prisma } from "./prisma";

export interface ShopConfig {
  id: string;
  shop_name: string;
  phone: string | null;
  address: string | null;
  zalo_url: string | null;
  facebook_url: string | null;
  footer_text: string | null;
  meta_title: string | null;
  meta_description: string | null;
  map_embed_url: string | null;
  working_hours: any;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image: string | null;
}

export const DEFAULT_CONFIG: ShopConfig = {
  id: "default",
  shop_name: "Tiệm Nhà Bee",
  phone: "070 485 9175",
  address: "TP. Hồ Chí Minh",
  zalo_url: "https://zalo.me/0704859175",
  facebook_url: "https://facebook.com/tiemnhabee",
  footer_text: "Tiệm Nhà Bee - Chuyên đồ handmade và quà tặng tâm huyết",
  meta_title: "Tiệm Nhà Bee | Đồ Handmade & Quà Tặng Ý Nghĩa",
  meta_description: "Cửa hàng đồ handmade tỉ mỉ, quà tặng len sợi độc đáo và nguyên liệu đan móc chất lượng cao.",
  map_embed_url: null,
  working_hours: [],
  hero_title: "Gửi gắm yêu thương trong từng mũi len",
  hero_subtitle: "Sản phẩm handmade tỉ mỉ và nguyên liệu len sợi chất lượng cao cho cộng đồng yêu đan móc.",
  hero_image: null,
};

export async function getShopConfig(): Promise<ShopConfig> {
  try {
    const config = await prisma.shop_config.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      return DEFAULT_CONFIG;
    }

    return {
      ...DEFAULT_CONFIG,
      ...config,
    } as ShopConfig;
  } catch (error) {
    console.error("Error fetching shop config:", error);
    return DEFAULT_CONFIG;
  }
}
