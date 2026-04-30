"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { ProductFilters } from "./ProductFilters";
import { Button } from "./ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MobileFiltersProps {
  categories: Category[];
}

export function MobileFilters({ categories }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" className="lg:hidden flex items-center gap-2 rounded-xl bg-white border-neutral-200">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-black">Bộ lọc sản phẩm</SheetTitle>
        </SheetHeader>
        <ProductFilters categories={categories} />
      </SheetContent>
    </Sheet>
  );
}
