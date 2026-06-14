import { prisma } from "@/lib/prisma";
import { getShopConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const [shopConfig, products] = await Promise.all([
      getShopConfig(),
      prisma.products.findMany({
        where: { status: "active" },
        include: {
          category: { select: { name: true } }
        },
        orderBy: { created_at: "desc" }
      })
    ]);

    // Tự động lấy domain name từ request origin (VD: http://localhost:3000 hoặc https://tiemnhabee.com)
    const baseUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "https://tiemnhabee.com";
    const shopName = shopConfig?.shop_name || "Tiệm Nhà Bee";
    const description = shopConfig?.meta_description || shopConfig?.hero_subtitle || "Sản phẩm handmade chất lượng";

    // Build XML string manually
    let xml = `<?xml version="1.0"?>\n`;
    xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
    xml += `  <channel>\n`;
    xml += `    <title><![CDATA[${shopName}]]></title>\n`;
    xml += `    <link>${baseUrl}</link>\n`;
    xml += `    <description><![CDATA[${description}]]></description>\n`;

    products.forEach((product) => {
      const productLink = `${baseUrl}/san-pham/${product.slug}`;
      const imageLink = product.cover_image || "";
      const price = product.price ? Number(product.price).toString() : "0";
      
      xml += `    <item>\n`;
      xml += `      <g:id>${product.id}</g:id>\n`;
      xml += `      <g:title><![CDATA[${product.name}]]></g:title>\n`;
      xml += `      <g:description><![CDATA[${product.description || product.name}]]></g:description>\n`;
      xml += `      <g:link>${productLink}</g:link>\n`;
      if (imageLink) {
        xml += `      <g:image_link>${imageLink}</g:image_link>\n`;
      }
      xml += `      <g:availability>in_stock</g:availability>\n`;
      xml += `      <g:price>${price} VND</g:price>\n`;
      xml += `      <g:condition>new</g:condition>\n`;
      xml += `      <g:brand><![CDATA[${shopName}]]></g:brand>\n`;
      if (product.category?.name) {
        xml += `      <g:product_type><![CDATA[${product.category.name}]]></g:product_type>\n`;
      }
      xml += `    </item>\n`;
    });

    xml += `  </channel>\n`;
    xml += `</rss>\n`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });

  } catch (error) {
    console.error("Error generating Google Merchant Feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
