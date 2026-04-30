"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.products || []);
        // Also store categories if any
        if (data.categories) {
          setSuggestedCategories(data.categories);
        } else {
          setSuggestedCategories([]);
        }
      } catch (error) {
        console.error("Suggestion fetch failed", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [suggestedCategories, setSuggestedCategories] = useState<any[]>([]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-amber-600 flex-shrink-0">
          Tiệm Nhà Bee
        </Link>

        {/* Desktop Search */}
        <div ref={searchRef} className="hidden md:block flex-grow max-w-md relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm gấu bông, len sợi..."
              className="w-full bg-neutral-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-amber-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-600">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (searchQuery.length >= 2) && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {suggestions.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Sản phẩm gợi ý</p>
                  {suggestions.map((p) => (
                    <Link
                      key={p.id}
                      href={`/san-pham/${p.slug}`}
                      className="flex items-center gap-3 p-2 hover:bg-amber-50 rounded-xl transition-colors group"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                        {p.cover_image && (
                          <Image src={p.cover_image} alt={p.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold text-neutral-900 truncate group-hover:text-amber-600">{p.name}</h4>
                        <p className="text-xs text-amber-600 font-medium">
                          {p.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(p.price)) : "Liên hệ"}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full mt-2 p-2 text-xs font-bold text-neutral-500 hover:text-amber-600 bg-neutral-50 hover:bg-amber-50 rounded-xl transition-colors"
                  >
                    Xem tất cả kết quả cho "{searchQuery}"
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm text-neutral-500 italic mb-3">Không tìm thấy sản phẩm. Bạn có muốn xem danh mục?</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCategories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/san-pham?category=${c.id}`}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-amber-500 hover:text-white rounded-full text-xs font-medium transition-all"
                        onClick={() => setShowSuggestions(false)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
            Trang chủ
          </Link>
          <Link href="/san-pham" className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
            Sản phẩm
          </Link>
          <Link href="/ve-chung-toi" className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
            Về chúng tôi
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
            <Link href="/ve-chung-toi" className="text-base font-medium text-neutral-600" onClick={() => setIsMenuOpen(false)}>
              Về chúng tôi
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
