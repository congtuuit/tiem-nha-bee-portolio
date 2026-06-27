"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateProductPrice } from "@/app/(admin)/admin/products/actions";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

type Props = {
  productId: string;
  currentPrice: string | null;
};

export function QuickPriceEdit({ productId, currentPrice }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticPrice, setOptimisticPrice] = useState<string | null>(currentPrice);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!inputRef.current) return;
    
    const value = inputRef.current.value.trim();
    const newPrice = value === "" ? null : Number(value);
    
    // Validate
    if (newPrice !== null && isNaN(newPrice)) {
      toast.error("Giá không hợp lệ");
      return;
    }

    // Skip if unchanged
    const currentPriceNum = currentPrice === null ? null : Number(currentPrice);
    if (newPrice === currentPriceNum) {
      setIsEditing(false);
      return;
    }

    setOptimisticPrice(newPrice === null ? null : newPrice.toString());
    setIsEditing(false);

    startTransition(async () => {
      const result = await updateProductPrice(productId, newPrice);
      if (result.success) {
        toast.success("Đã cập nhật giá bán");
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
        setOptimisticPrice(currentPrice);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="number"
          defaultValue={optimisticPrice || ""}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="w-24 appearance-none rounded border border-amber-500 px-2 py-1 text-sm font-semibold shadow-sm outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="Liên hệ"
        />
      </div>
    );
  }

  const formattedPrice = !optimisticPrice
    ? "Liên hệ"
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(optimisticPrice));

  return (
    <div 
      className={`group flex items-center gap-1.5 cursor-pointer rounded-lg px-2 py-1 -ml-2 transition-colors hover:bg-slate-100 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => setIsEditing(true)}
    >
      <span className="font-semibold text-amber-700 text-sm">
        {formattedPrice}
      </span>
      <Pencil className="h-3 w-3 text-slate-400 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
