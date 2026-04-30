"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-amber-600 flex-shrink-0">
          Tiệm Nhà Bee
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-md relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full bg-neutral-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-amber-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-600">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
            Trang chủ
          </Link>
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
            Sản phẩm
          </Link>
          <Link href="/lien-he" className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
            Liên hệ
          </Link>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-neutral-600">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-neutral-100 border-none rounded-full py-2 pl-4 pr-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-base font-medium text-neutral-600" onClick={() => setIsMenuOpen(false)}>
              Trang chủ
            </Link>
            <Link href="/san-pham" className="text-base font-medium text-neutral-600" onClick={() => setIsMenuOpen(false)}>
              Sản phẩm
            </Link>
            <Link href="/lien-he" className="text-base font-medium text-neutral-600" onClick={() => setIsMenuOpen(false)}>
              Liên hệ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
