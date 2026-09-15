import { areas } from "./areas";

/**
 * Todas as áreas de atuação, na ordem do menu, do rodapé e da home: as nove
 * áreas do direito cível e empresarial (src/data/areas.ts) mais o Direito do
 * Servidor Público, que tem hub e subpáginas próprias em /servidores-publicos
 * (src/data/servidores.ts). É a lista que o cliente vê para escolher o seu caso.
 */
export type AreaDeAtuacao = {
  slug: string;
  name: string;
  tagline: string;
  href: string;
};

export const servidorArea: AreaDeAtuacao = {
  slug: "servidor-publico",
  name: "Direito do Servidor Público",
  tagline:
    "Férias-prêmio, progressão e promoção, adicional noturno e vale-transporte para servidores estaduais de Minas Gerais, incluindo policiais penais.",
  href: "/servidores-publicos",
};

export const areasDeAtuacao: AreaDeAtuacao[] = [
  ...areas.map(({ slug, name, tagline }) => ({
    slug,
    name,
    tagline,
    href: `/areas-de-atuacao/${slug}`,
  })),
  servidorArea,
];
