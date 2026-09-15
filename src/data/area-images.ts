/**
 * Fotografia de cada área de atuação — exibida na faixa superior do AreaCard.
 *
 * Imagens autorais geradas para o site (Recraft, set/2026) com direção única:
 * cena silenciosa de objetos e ambientes, luz natural quente, paleta creme /
 * carvalho / latão da marca. Nenhuma tem pessoas, texto ou marca visível, para
 * não envelhecer e não prometer nada que o escritório não faça.
 *
 * No card elas entram dessaturadas (monocromático quente) e só ganham cor no
 * hover — ver AreaCard. Arquivos em public/images/areas/<slug>.webp, 1200x800.
 *
 * Áreas sem entrada aqui (landing pages criadas no /admin) simplesmente
 * aparecem sem foto, com o card no formato original.
 */
export const areaImages: Record<string, string> = {
  "direito-tributario": "/images/areas/direito-tributario.webp",
  "direito-condominial": "/images/areas/direito-condominial.webp",
  "direito-do-consumidor": "/images/areas/direito-do-consumidor.webp",
  "direito-imobiliario": "/images/areas/direito-imobiliario.webp",
  "direito-empresarial": "/images/areas/direito-empresarial.webp",
  "direito-trabalhista": "/images/areas/direito-trabalhista.webp",
  "recuperacao-de-credito": "/images/areas/recuperacao-de-credito.webp",
  "direito-das-sucessoes": "/images/areas/direito-das-sucessoes.webp",
  "direito-de-familia": "/images/areas/direito-de-familia.webp",
  "servidor-publico": "/images/areas/servidor-publico.webp",
};
