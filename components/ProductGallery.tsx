"use client";

import { useState } from "react";
import { ImageWithSkeleton } from "./ui/ImageWithSkeleton";
import { cn } from "@/lib/utils";
import { generateImageAlt } from "@/lib/seo";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
        Chưa có hình ảnh
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
        <ImageWithSkeleton
          src={images[selectedImage]}
          alt={generateImageAlt(productName)}
          fill
          className="object-cover transition-all duration-500 hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedImage(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedImage(idx);
                }
              }}
              className={cn(
                "relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 border transition-all cursor-pointer",
                selectedImage === idx
                  ? "border-amber-500 ring-2 ring-amber-500/20"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <ImageWithSkeleton src={img} alt={generateImageAlt(productName, idx, "Ảnh thumbnail")} fill className="object-cover" sizes="80px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
