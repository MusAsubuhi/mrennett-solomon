"use client";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { useToast } from "@/lib/toast";
import { whatsappChatUrl, whatsappEnabled, whatsappUrl } from "@/lib/whatsapp";
import { Button } from "./Button";

type Props = {
  /** Pre-filled message. Leave out for a plain "chat with us" link. */
  message?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  tone?: "light" | "dark";
  className?: string;
  source: string; // where on the site this link sits, for analytics
  onClick?: () => void;
};

/**
 * Opens WhatsApp with a pre-filled message. If NEXT_PUBLIC_WHATSAPP_NUMBER is not
 * set, shows a friendly "ordering opens soon" notice instead of a broken link.
 */
export function WhatsAppLink({ message, children, variant = "primary", tone = "light", className, source, onClick }: Props) {
  const show = useToast((s) => s.show);

  if (!whatsappEnabled) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Mrennett] NEXT_PUBLIC_WHATSAPP_NUMBER is empty, so WhatsApp links show an 'ordering opens soon' notice.");
    }
    return (
      <Button
        variant={variant}
        tone={tone}
        className={className}
        onClick={() => show("Ordering opens soon. Please check back shortly.")}
      >
        {children}
      </Button>
    );
  }

  const href = message ? whatsappUrl(message) : whatsappChatUrl();
  return (
    <Button
      href={href}
      variant={variant}
      tone={tone}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("whatsapp_order_clicked", { source });
        onClick?.();
      }}
    >
      {children}
    </Button>
  );
}
