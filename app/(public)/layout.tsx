import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getShopConfig } from "@/lib/config";
import { FloatingContact } from "@/components/FloatingContact";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getShopConfig();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <Footer config={config} />
      <FloatingContact config={config} />
    </div>
  );
}
