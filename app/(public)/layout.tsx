import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-600">
            Tiệm Nhà Bee
          </Link>
          <nav>
            <Link href="/" className="text-neutral-600 hover:text-amber-600 font-medium">
              Sản phẩm
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} Tiệm Nhà Bee. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
