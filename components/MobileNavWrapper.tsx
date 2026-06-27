"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Store } from "lucide-react";

export function MobileNavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 z-20 sticky top-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-amber-500/20">
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">Tiệm Nhà Bee</span>
      </div>
      <Sheet>
        <SheetTrigger className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SheetTitle className="sr-only">Menu Quản trị</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
}
