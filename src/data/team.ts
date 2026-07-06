/**
 * Equipe — dados e fotos extraídos do site atual
 * (andrearaujoadvogados.com.br/equipe), já sem o Sávio Ribeiro Oliveira,
 * que deixou o escritório. Fotos quadradas (800×800) em public/equipe/.
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Foto quadrada em public/equipe/<slug>.jpg */
  photo?: string;
  oab?: string;
  bio?: string;
  areas?: string[]; // slugs de src/data/areas.ts
  /** Tem página própria em /equipe/[slug] (apenas advogados) */
  hasProfile?: boolean;
};

export const team: TeamMember[] = [
  {
    slug: "andre-augusto-de-araujo",
    name: "André Augusto de Araújo",
    role: "Sócio fundador",
    photo: "/equipe/andre-augusto-de-araujo.jpg",
    oab: "OAB/MG 142.853",
    bio: "Graduado em Direito pelo Centro Universitário de Formiga/MG (UNIFOR-MG). Pós-graduado em Direito Empresarial e Advocacia Empresarial e em Direito Tributário pela Universidade Anhanguera Uniderp; pós-graduado em Advocacia Tributária pela Universidade FUMEC; pós-graduando em Direito Tributário pelo Instituto Brasileiro de Estudos Tributários (IBET). Membro da Associação Brasileira de Direito Tributário (ABRADT). Soma mais de 12 anos de experiência prática na advocacia, atuando de forma preventiva, consultiva e contenciosa com foco nas áreas do Direito Civil, Direito Empresarial, Direito do Trabalho e Direito Tributário.",
    areas: ["direito-tributario", "direito-empresarial", "direito-trabalhista"],
    hasProfile: true,
  },
  {
    slug: "jade-de-souza-rodrigues",
    name: "Jade de Souza Rodrigues",
    role: "Advogada",
    photo: "/equipe/jade-de-souza-rodrigues.jpg",
    oab: "OAB/MG", // TODO: confirmar número de inscrição
    // TODO: substituir pela bio real fornecida pelo escritório
    bio: "Advogada do André Araújo Advogados, atua no atendimento aos clientes do escritório em Formiga e região.",
    hasProfile: true,
  },
  {
    slug: "debora-silvino-dos-santos",
    name: "Débora Silvino dos Santos",
    role: "Advogada",
    photo: "/equipe/debora-silvino-dos-santos.jpg",
    oab: "OAB/MG", // TODO: confirmar número de inscrição
    // TODO: substituir pela bio real fornecida pelo escritório
    bio: "Advogada do André Araújo Advogados, atua no atendimento aos clientes do escritório em Formiga e região.",
    hasProfile: true,
  },
  {
    slug: "matheus-sebastiao-menezes",
    name: "Matheus Sebastião Menezes",
    role: "Auxiliar Jurídico",
    photo: "/equipe/matheus-sebastiao-menezes.jpg",
  },
  {
    slug: "barbara-pereira-da-cunha",
    name: "Bárbara Pereira da Cunha",
    role: "Controller Jurídico",
    photo: "/equipe/barbara-pereira-da-cunha.jpg",
  },
  {
    slug: "geovanna-ribeiro-lima",
    name: "Geovanna Ribeiro Lima",
    role: "Estagiária",
    photo: "/equipe/geovanna-ribeiro-lima.jpg",
  },
  {
    slug: "lucianna-veloso-souza-resende",
    name: "Lucianna Veloso Souza Resende",
    role: "Estagiária",
    photo: "/equipe/lucianna-veloso-souza-resende.jpg",
  },
  {
    slug: "maria-rita-de-faria",
    name: "Maria Rita de Faria",
    role: "Estagiária",
    photo: "/equipe/maria-rita-de-faria.jpg",
  },
  {
    slug: "emily-campos-faria",
    name: "Emily Campos Faria",
    role: "Estagiária",
    photo: "/equipe/emily-campos-faria.jpg",
  },
  {
    slug: "gabriele-silva-melo",
    name: "Gabriele Silva Melo",
    role: "Estagiária",
    photo: "/equipe/gabriele-silva-melo.jpg",
  },
  {
    slug: "mariana-pinheiro-silva",
    name: "Mariana Pinheiro Silva",
    role: "Agente de Vendas",
    photo: "/equipe/mariana-pinheiro-silva.jpg",
  },
  {
    slug: "ellen-junia-silva-nascimento",
    name: "Ellen Junia Silva Nascimento",
    role: "Secretária",
    photo: "/equipe/ellen-junia-silva-nascimento.jpg",
  },
];

/** Membros com página própria em /equipe/[slug] */
export function getLawyer(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug && m.hasProfile);
}

/** Primeira e última inicial do nome, ex.: "André Augusto de Araújo" → "AA" */
export function initialsOf(name: string): string {
  const parts = name.split(" ").filter((p) => p[0] === p[0]?.toUpperCase());
  return (parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "");
}
