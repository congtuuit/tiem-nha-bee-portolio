"use client";

import { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends ImageProps {
  containerClassName?: string;
}

export function ImageWithSkeleton({ 
  src, 
  alt, 
  className, 
  containerClassName,
  ...props 
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached/loaded on mount
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-neutral-100 w-full h-full", containerClassName)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-20 w-full h-full" />
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
