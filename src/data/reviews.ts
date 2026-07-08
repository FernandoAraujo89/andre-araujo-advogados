/**
 * Avaliações do escritório no Google (perfil do Google Maps).
 * Conteúdo editável — os textos são transcrições fiéis das avaliações
 * públicas; não edite as citações. Para atualizar a nota/quantidade ou
 * adicionar novas avaliações, ajuste os objetos abaixo.
 *
 * Fonte: perfil "André Araújo Advogados" no Google (Formiga, MG).
 */

export type Review = {
  name: string;
  /** Iniciais para o avatar quando não há foto */
  initials: string;
  rating: number;
  /** Data relativa, como exibida no Google (ex.: "há 1 mês") */
  date: string;
  text: string;
};

export const googleReviews = {
  /** URL pública do perfil (abre a lista completa no Google) */
  url: "https://share.google/UHzJoVbhT2SFNFxIa",
  rating: 5.0,
  count: 58,
  reviews: [
    {
      name: "Marcia Benjamim",
      initials: "MB",
      rating: 5,
      date: "há 1 mês",
      text: "Só tenho a elogiar. Consegui seguir o processo com eles, que sempre me informavam o andamento. O prazo foi rápido, com certeza devido à competência do André Araújo e sua equipe. Estão de parabéns. Equipe nota 10.",
    },
    {
      name: "Patrícia Almeida",
      initials: "PA",
      rating: 5,
      date: "há 2 meses",
      text: "Indico muito o trabalho deles! Foram super educados e cordiais, sempre me atualizando do caso e me respondendo prontamente quando eu tinha dúvidas. Estou muito satisfeita pelo serviço prestado. Com certeza contarei com eles se precisar novamente. Gratidão.",
    },
    {
      name: "Adriana Corrêa",
      initials: "AC",
      rating: 5,
      date: "há 1 mês",
      text: "Excelentes profissionais. Mesmo com várias tentativas de golpes por falsos advogados, fui orientada em todos os momentos e mantiveram-se à disposição durante todo o processo. Muito grata à equipe. Muito comprometidos.",
    },
  ] satisfies Review[],
};
