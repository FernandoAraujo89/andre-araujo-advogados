/**
 * Equipe — 13 advogados.
 * André e Sávio com dados reais (números de OAB pendentes de confirmação).
 * Os demais 11 são entradas placeholder a preencher pelo cliente.
 */

export type Lawyer = {
  slug: string;
  name: string;
  role: string;
  oab: string;
  bio: string;
  areas: string[]; // slugs de src/data/areas.ts
  placeholder?: boolean;
};

export const team: Lawyer[] = [
  {
    slug: "andre-augusto-de-araujo",
    name: "André Augusto de Araújo",
    role: "Sócio fundador",
    oab: "OAB/MG — TODO: confirmar número",
    // TODO: substituir pela bio real fornecida pelo escritório
    bio: "Sócio fundador do André Araújo Advogados, conduz o escritório com atuação voltada a empresas e famílias de Formiga e região. TODO: bio completa a fornecer pelo cliente.",
    areas: ["direito-tributario", "direito-empresarial", "direito-imobiliario"],
  },
  {
    slug: "savio-ribeiro-oliveira",
    name: "Sávio Ribeiro Oliveira",
    role: "Sócio",
    oab: "OAB/MG — TODO: confirmar número",
    // TODO: substituir pela bio real fornecida pelo escritório
    bio: "Sócio do André Araújo Advogados, atua no atendimento a clientes do escritório em Formiga e região. TODO: bio completa a fornecer pelo cliente.",
    areas: ["direito-do-consumidor", "direito-condominial", "recuperacao-de-credito"],
  },
  // TODO: substituir as 11 entradas abaixo pelos dados reais dos demais advogados
  ...Array.from({ length: 11 }, (_, i) => {
    const n = i + 3;
    return {
      slug: `advogado-${n}`,
      name: `Advogado(a) ${n} — TODO: nome`,
      role: "Advogado(a)",
      oab: "OAB/MG — TODO: número",
      bio: "TODO: bio curta a fornecer pelo cliente.",
      areas: [] as string[],
      placeholder: true,
    };
  }),
];

export function getLawyer(slug: string): Lawyer | undefined {
  return team.find((l) => l.slug === slug);
}
