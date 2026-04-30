import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.shop_config.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Saving settings with body:", JSON.stringify(body, null, 2));
    
    // Explicitly pick fields to avoid Prisma errors with unexpected fields
    const data = {
      shop_name: body.shop_name,
      phone: body.phone,
      address: body.address,
      zalo_url: body.zalo_url,
      facebook_url: body.facebook_url,
      footer_text: body.footer_text,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
    };

    const config = await prisma.shop_config.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        ...data,
      },
    });
    
    console.log("Settings saved successfully");
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating shop config:", error);
    return NextResponse.json({ 
      error: "Failed to update config",
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
