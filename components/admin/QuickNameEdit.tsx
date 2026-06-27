"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateProductName } from "@/app/(admin)/admin/products/actions";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

type Props = {
  productId: string;
  currentName: string;
};

export function QuickNameEdit({ productId, currentName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticName, setOptimisticName] = useState<string>(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!inputRef.current) return;
    
    const newName = inputRef.current.value.trim();
    
    // Validate
    if (!newName) {
      toast.error("Tên sản phẩm không được để trống");
      setIsEditing(false);
      return;
    }

    // Skip if unchanged
    if (newName === currentName) {
      setIsEditing(false);
      return;
    }

    setOptimisticName(newName);
    setIsEditing(false);

    startTransition(async () => {
      const result = await updateProductName(productId, newName);
      if (result.success) {
        toast.success("Đã cập nhật tên sản phẩm");
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
        setOptimisticName(currentName);
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
          type="text"
          defaultValue={optimisticName}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="w-full appearance-none rounded border border-amber-500 px-2 py-1 text-base font-semibold text-slate-800 shadow-sm outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="Tên sản phẩm"
        />
      </div>
    );
  }

  return (
    <div 
      className={`group flex items-start gap-1.5 cursor-pointer rounded-lg px-2 py-1 -ml-2 transition-colors hover:bg-slate-100 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => setIsEditing(true)}
    >
      <span className="truncate text-base font-semibold text-slate-800 leading-tight">
        {optimisticName}
      </span>
      <Pencil className="h-3 w-3 text-slate-400 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
    </div>
  );
}
