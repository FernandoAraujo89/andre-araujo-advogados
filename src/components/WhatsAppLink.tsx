"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

/**
 * Links de "falar no WhatsApp" do chrome do site (cabeçalho, rodapé, botão
 * flutuante) e o desvio que eles fazem nas landing pages de campanha.
 *
 * Nas landing pages publicadas que têm formulário, todo "WhatsApp" leva ao
 * formulário da página (#contato); o WhatsApp abre depois do envio, já com a
 * mensagem do visitante (ContactForm.tsx). Pedido do gestor de tráfego em
 * 09/11/2026: com o clique direto no WhatsApp não dá para saber de onde a
 * pessoa veio nem mandar ao Google Ads uma conversão de lead, só de clique.
 * No resto do site os links continuam abrindo o WhatsApp direto.
 *
 * Os caminhos das landing pages com formulário vêm do servidor
 * (SiteChrome.tsx); a decisão usa o caminho da página, então o HTML já sai
 * do servidor com o destino certo, sem trocar o link depois de carregar.
 */

const FormPathsContext = createContext<readonly string[]>([]);

export function WhatsAppRouting({
  formPaths,
  children,
}: {
  /** Caminhos das landing pages com formulário, ex.: /areas-de-atuacao/ferias-premio */
  formPaths: readonly string[];
  children: ReactNode;
}) {
  return <FormPathsContext.Provider value={formPaths}>{children}</FormPathsContext.Provider>;
}

/** True quando a página atual é uma landing page com formulário. */
export function useWhatsAppViaForm(): boolean {
  const formPaths = useContext(FormPathsContext);
  const pathname = usePathname();
  return formPaths.includes(pathname.replace(/\/+$/, ""));
}

export default function WhatsAppLink({
  className,
  ariaLabel,
  onClick,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const viaForm = useWhatsAppViaForm();
  if (viaForm) {
    return (
      <a
        href="#contato"
        className={className}
        aria-label={ariaLabel ? `${ariaLabel} (preencha o formulário)` : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
