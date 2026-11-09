import WhatsAppLink from "@/components/WhatsAppLink";

/**
 * Botão flutuante de WhatsApp — presente em todas as páginas. Nas landing
 * pages com formulário, leva ao formulário (ver WhatsAppLink.tsx).
 * Único uso permitido do verde oficial #25D366 no site.
 */
export default function WhatsAppFloat() {
  return (
    <WhatsAppLink
      ariaLabel="Falar com o escritório pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center rounded-sm bg-whatsapp px-5 py-3 font-medium text-ink shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-105"
    >
      WhatsApp
    </WhatsAppLink>
  );
}
