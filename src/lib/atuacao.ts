import "server-only";
import { areasDeAtuacao, type AreaDeAtuacao } from "@/data/atuacao";
import { getPublishedLandingPages } from "@/lib/landing";

/**
 * Lista completa de áreas exibida ao cliente: as 10 fixas (src/data/atuacao.ts)
 * seguidas das landing pages publicadas no painel, todas em
 * /areas-de-atuacao/<slug>. Alimenta o menu, o rodapé, o índice de áreas e o
 * sitemap; a home mantém só as fixas.
 */
export async function getAreasDeAtuacao(): Promise<AreaDeAtuacao[]> {
  const pages = await getPublishedLandingPages();
  return [
    ...areasDeAtuacao,
    ...pages.map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      href: `/areas-de-atuacao/${p.slug}`,
    })),
  ];
}
