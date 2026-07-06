import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

/**
 * Botão flutuante de WhatsApp — presente em todas as páginas.
 * Único uso permitido do verde oficial #25D366 no site.
 */
export default function WhatsAppFloat() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o escritório pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={1.75} aria-hidden />
    </a>
  );
}
