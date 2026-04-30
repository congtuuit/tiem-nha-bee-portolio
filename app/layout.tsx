import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getShopConfig } from "@/lib/config";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const shopConfig = await getShopConfig();
  return {
    title: {
      default: shopConfig?.meta_title || "Tiệm Nhà Bee | Đồ Handmade & Quà Tặng",
      template: `%s | ${shopConfig?.shop_name || "Tiệm Nhà Bee"}`,
    },
    description: shopConfig?.meta_description || "Cửa hàng đồ handmade, quà tặng ý nghĩa và độc đáo.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-sans)]">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
