"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { ArrowUp, MapPin } from "lucide-react";
import { ZaloIcon, FacebookIcon } from "@/components/Icons";
import { ShopConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ContactButton } from "@/components/ContactButton";

interface FloatingContactProps {
  config: ShopConfig | null;
}

export function FloatingContact({ config }: FloatingContactProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      {/* Social Buttons */}
      <div className="flex flex-col gap-3 pointer-events-auto items-end">
        {/* Zalo */}
        <div className="group relative flex items-center gap-3">
          <span className="px-3 py-1.5 bg-white shadow-lg rounded-lg text-xs font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            Zalo của Bee
          </span>
          <ContactButton 
            type="zalo" 
            value={config?.zalo_url || config?.phone || "0704859175"}
            className="w-12 h-12 bg-[#0068FF] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 shadow-[#0068FF]/30"
          >
            <ZaloIcon size={24} />
          </ContactButton>
        </div>

        {/* Messenger */}
        <div className="group relative flex items-center gap-3">
          <span className="px-3 py-1.5 bg-white shadow-lg rounded-lg text-xs font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            Messenger
          </span>
          <ContactButton 
            type="messenger" 
            value={config?.facebook_url || "tiemnhabee"}
            className="w-12 h-12 bg-[#0866FF] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 shadow-[#0866FF]/30"
          >
            <FacebookIcon size={24} />
          </ContactButton>
        </div>

        {/* Maps */}
        <Link
          href="/lien-he"
          className="group relative flex items-center gap-3"
        >
          <span className="px-3 py-1.5 bg-white shadow-lg rounded-lg text-xs font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            Chỉ đường
          </span>
          <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-red-500 hover:scale-110 border border-neutral-100">
            <MapPin className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className={cn(
          "w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-neutral-600 hover:text-amber-600 transition-all pointer-events-auto border border-neutral-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}
