"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, Settings, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin/products",
      label: "Sản phẩm",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Danh mục",
      icon: Tag,
    },
    {
      href: "/admin/stats", // Giả sử route này tồn tại hoặc sẽ có
      label: "Thống kê",
      icon: LayoutDashboard,
      disabled: true,
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: Settings,
    },
  ];

  return (
    <nav className="p-4 space-y-2 flex-grow">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-4">
        Menu Quản Trị
      </div>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        
        if (item.disabled) {
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 text-slate-400 opacity-50 cursor-not-allowed rounded-xl font-medium"
              title="Sắp ra mắt"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
              isActive 
                ? "bg-amber-50 text-amber-700 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Icon className={cn(
              "w-5 h-5 transition-transform",
              isActive ? "scale-110" : "group-hover:scale-110",
              item.label === "Cài đặt" && !isActive && "group-hover:rotate-45"
            )} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
