"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  GOOGLE_ADS_ID,
  WHATSAPP_LABEL,
  isWhatsAppHref,
  pageViewLabel,
} from "@/data/google-ads";
import { trackConversion } from "@/lib/gtag";

/**
 * Tag do Google Ads (gtag.js) e as conversões que dependem da página.
 *
 *  - Visualização de página: a cada rota, na carga inicial e nas navegações
 *    dentro do site (o App Router troca de página sem recarregar), com o
 *    rótulo da landing page ou o geral.
 *  - Contato por WhatsApp: qualquer clique num link que abre o WhatsApp, em
 *    qualquer lugar da página (cabeçalho, rodapé, botão flutuante, landing
 *    pages), por delegação no documento, sem marcar botão por botão.
 *
 * O lead do formulário fica em ContactForm.tsx. O painel /admin não recebe a
 * tag nem dispara conversões. Em `next dev` o script do Google não é
 * carregado, para os testes não contarem como visitas e conversões reais; os
 * comandos ficam em `window.dataLayer` para conferência (src/lib/gtag.ts).
 */

const LOAD_SCRIPT = process.env.NODE_ENV === "production";

export default function GoogleAds() {
  const pathname = usePathname();
  const tracked = !pathname.startsWith("/admin");
  // Último caminho contado: um mesmo caminho não conta duas vezes seguidas
  // (o modo estrito do React, em desenvolvimento, roda o efeito em dobro).
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!tracked || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackConversion(pageViewLabel(pathname));
  }, [pathname, tracked]);

  useEffect(() => {
    if (!tracked) return;
    function onClick(e: MouseEvent) {
      // auxclick: só o botão do meio (abre em nova aba); o direito é o menu
      if (e.type === "auxclick" && e.button !== 1) return;
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (link && isWhatsAppHref(link.getAttribute("href"))) {
        trackConversion(WHATSAPP_LABEL);
      }
    }
    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, [tracked]);

  if (!tracked || !LOAD_SCRIPT) return null;
  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      strategy="afterInteractive"
    />
  );
}
