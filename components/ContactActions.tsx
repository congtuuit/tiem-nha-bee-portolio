"use client";

import { MessageCircle } from "lucide-react";
import { ZaloIcon, FacebookIcon } from "@/components/Icons";
import { sendGAEvent } from "@next/third-parties/google";

interface ContactActionsProps {
  fbUrl: string | null;
  zaloUrl: string | null;
  defaultContactUrl: string;
  productName: string;
}

export function ContactActions({ fbUrl, zaloUrl, defaultContactUrl, productName }: ContactActionsProps) {
  const handleEvent = (action: string) => {
    sendGAEvent("event", action, { item_name: productName });
  };

  return (
    <>
      {fbUrl && (
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleEvent("click_messenger")}
          className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-lg font-bold text-white rounded-[2rem] transition-all shadow-xl active:scale-[0.98] group bg-[#0866FF] hover:bg-[#0055D4] shadow-[#0866FF]/20"
        >
          <FacebookIcon size={24} />
          Liên hệ qua Facebook
        </a>
      )}

      {zaloUrl && (
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleEvent("click_zalo")}
          className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-lg font-bold text-white rounded-[2rem] transition-all shadow-xl active:scale-[0.98] group bg-[#0068FF] hover:bg-[#0055D4] shadow-[#0068FF]/20"
        >
          <ZaloIcon size={24} />
          Liên hệ qua Zalo
        </a>
      )}

      {!fbUrl && !zaloUrl && (
        <a
          href={defaultContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleEvent("click_contact")}
          className="inline-flex items-center justify-center gap-3 w-full px-8 py-5 text-lg font-bold text-white rounded-[2rem] transition-all shadow-xl active:scale-[0.98] group bg-neutral-900 hover:bg-amber-600 shadow-neutral-900/20"
        >
          <MessageCircle className="w-6 h-6" />
          Liên hệ tư vấn
        </a>
      )}
    </>
  );
}
