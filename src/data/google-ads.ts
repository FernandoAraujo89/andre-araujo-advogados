/**
 * Google Ads (gtag.js): a conta e as conversões do site.
 *
 * O ID e os rótulos vêm do painel do Google Ads (Metas → Conversões) e não
 * são segredo: aparecem no código da página de qualquer jeito. A tag entra em
 * todas as páginas públicas pelo layout raiz (src/components/GoogleAds.tsx);
 * o painel /admin fica de fora.
 *
 * Três conversões dependem de QUAL página é: as duas landing pages de
 * campanha têm rótulos próprios de lead e de visualização, e todo o resto usa
 * os rótulos gerais. A página é reconhecida pelo slug em
 * /areas-de-atuacao/<slug>. Se o escritório mudar o endereço de uma delas no
 * painel, atualize o slug aqui; até lá a página passa a contar como "geral".
 *
 * Importado também no navegador: nada de servidor aqui.
 */

export const GOOGLE_ADS_ID = "AW-17574475028";

type Campaign = {
  /** Slug da landing page em /areas-de-atuacao/<slug> (e `origem` do formulário) */
  slug: string;
  /** Rótulo da conversão "Lead" da campanha */
  lead: string;
  /** Rótulo da conversão "Visualização de página" da campanha */
  pageView: string;
};

/** Landing pages com conversões próprias no Google Ads. */
export const campaigns: Record<"progressao" | "ferias", Campaign> = {
  progressao: {
    slug: "progressao-e-promocao",
    lead: "4h2NCKvc2asdEJTqlLxB",
    pageView: "jZfBCOTd4qsdEJTqlLxB",
  },
  ferias: {
    slug: "ferias-premio",
    lead: "eC87COHd4qsdEJTqlLxB",
    pageView: "2O7BCOfd4qsdEJTqlLxB",
  },
};

/** Todas as outras páginas e formulários do site. */
export const geral = {
  lead: "xmw5CKyI6KsdEJTqlLxB",
  pageView: "DOuMCKr55qsdEJTqlLxB",
};

/** Clique em qualquer botão ou link que abre o WhatsApp. */
export const WHATSAPP_LABEL = "lQX2CJPA6asdEJTqlLxB";

function campaignForSlug(slug: string | undefined): Campaign | undefined {
  return slug ? Object.values(campaigns).find((c) => c.slug === slug) : undefined;
}

/** Rótulo do lead pela página de origem do formulário (`origem` = slug). */
export function leadLabel(origem?: string): string {
  return campaignForSlug(origem)?.lead ?? geral.lead;
}

/** Rótulo da visualização pelo caminho da página. */
export function pageViewLabel(pathname: string): string {
  const match = pathname.match(/^\/areas-de-atuacao\/([^/]+)\/?$/);
  return (match && campaignForSlug(match[1])?.pageView) || geral.pageView;
}

/** Links que abrem o WhatsApp (site, landing pages, rodapé, botão flutuante). */
export function isWhatsAppHref(href: string | null | undefined): boolean {
  return (
    !!href &&
    /^(https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\/|whatsapp:)/i.test(href)
  );
}
