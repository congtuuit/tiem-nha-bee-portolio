"use client";

import { FacebookIcon, ZaloIcon } from "@/components/Icons";
import { generateMessengerLink, generateZaloLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContactButtonProps {
  type: "zalo" | "messenger";
  value: string;
  productName?: string;
  productUrl?: string;
  className?: string;
  children?: ReactNode;
}

export function ContactButton({ 
  type, 
  value, 
  productName, 
  productUrl, 
  className,
  children 
}: ContactButtonProps) {
  const url = type === "zalo" 
    ? generateZaloLink(value, productName, productUrl)
    : generateMessengerLink(value, productName, productUrl);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("transition-all", className)}
    >
      {children || (
        type === "zalo" ? <ZaloIcon size={20} /> : <FacebookIcon size={20} />
      )}
    </a>
  );
}
