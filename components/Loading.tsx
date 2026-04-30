"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ className, fullScreen, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-8 w-full min-h-[200px]";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="relative">
        {/* Outer Ring */}
        <div 
          className={cn(
            "animate-spin rounded-full border-solid border-amber-500 border-t-transparent",
            sizeClasses[size]
          )}
        />
        {/* Inner Pulse (Optional for premium feel) */}
        <div 
          className={cn(
            "absolute inset-0 animate-ping rounded-full bg-amber-500/20",
            size === "sm" ? "scale-150" : size === "md" ? "scale-125" : "scale-110"
          )}
        />
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
