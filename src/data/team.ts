/**
 * Equipe — semente e tipos.
 *
 * Esta lista é o ponto de partida: a partir do momento em que alguém salva
 * qualquer alteração em /admin → Equipe, a equipe passa a vir do banco (Neon,
 * src/lib/equipe.ts) e esta semente só volta a ser usada se o banco não
 * estiver configurado. Mesmo desenho dos posts (src/data/posts.ts).
 *
 * Fotos quadradas (800×800) em public/equipe/<slug>.jpg. Quem não tem foto
 * aparece com as iniciais (PhotoPlaceholder) até o escritório enviar uma
 * pelo painel.
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Setor do escritório — agrupa a página pública (ver SETORES) */
  setor?: string;
  /**
   * Ramal interno. Uso do escritório: aparece só no painel, nunca no site —
   * é número de ramal individual, não canal de atendimento ao cliente.
   */
  ramal?: string;
  /** Foto quadrada em public/equipe/<slug>.jpg ou URL do Blob */
  photo?: string;
  oab?: string;
  bio?: string;
  areas?: string[]; // slugs de src/data/areas.ts
  /** Tem página própria em /equipe/[slug] (exige bio) */
  hasProfile?: boolean;
};

/** Dados aceitos do editor do painel (o slug é gerado/normalizado no servidor). */
export type TeamMemberInput = Omit<TeamMember, "slug"> & { slug?: string };

/**
 * Ordem dos setores na página pública. É só a ordem inicial: a ordem real é a
 * da posição salva no banco, reordenável no painel. Um setor que não esteja aqui
 * aparece depois, na ordem em que surgir.
 */
export const SETORES = [
  "Sócio Administrador/Fundador",
  "Comercial",
  "Escala",
  "Cível",
  "Controladoria",
] as const;

export const team: TeamMember[] = [
  {
    slug: "andre-augusto-de-araujo",
    name: "André Augusto de Araújo",
    role: "Sócio fundador",
    setor: "Sócio Administrador/Fundador",
    ramal: "76",
    photo: "/equipe/andre-augusto-de-araujo.jpg",
    oab: "OAB/MG 142.853",
    bio: "Graduado em Direito pelo Centro Universitário de Formiga/MG (UNIFOR-MG). Pós-graduado em Direito Empresarial e Advocacia Empresarial e em Direito Tributário pela Universidade Anhanguera Uniderp; pós-graduado em Advocacia Tributária pela Universidade FUMEC; pós-graduando em Direito Tributário pelo Instituto Brasileiro de Estudos Tributários (IBET). Membro da Associação Brasileira de Direito Tributário (ABRADT). Soma mais de 12 anos de experiência prática na advocacia, atuando de forma preventiva, consultiva e contenciosa com foco nas áreas do Direito Civil, Direito Empresarial, Direito do Trabalho e Direito Tributário.",
    areas: ["direito-tributario", "direito-empresarial", "direito-trabalhista"],
    hasProfile: true,
  },

  {
    slug: "carlos-cesar-de-oliveira",
    name: "Carlos Cesar de Oliveira",
    role: "Consultor",
    setor: "Comercial",
    ramal: "29",
  },

  {
    slug: "gabriele-silva-melo",
    name: "Gabriele Silva Melo",
    role: "Advogada",
    setor: "Escala",
    ramal: "32",
    photo: "/equipe/gabriele-silva-melo.jpg",
  },
  {
    slug: "matheus-sebastiao-menezes",
    name: "Matheus Sebastião Soares Rodrigues de Menezes",
    role: "Advogado",
    setor: "Escala",
    ramal: "34",
    photo: "/equipe/matheus-sebastiao-menezes.jpg",
  },
  {
    slug: "isadora-castro-silva",
    name: "Isadora Castro Silva",
    role: "Estagiária",
    setor: "Escala",
    ramal: "38",
  },
  {
    slug: "emily-campos-faria",
    name: "Emily Campos Faria",
    role: "Auxiliar Jurídico",
    setor: "Escala",
    ramal: "45",
    photo: "/equipe/emily-campos-faria.jpg",
  },
  {
    slug: "camily-vitoria-faria",
    name: "Camily Vitória Faria",
    role: "Estagiária",
    setor: "Escala",
    ramal: "55",
  },
  {
    slug: "leticia-gonzaga-da-silva",
    name: "Letícia Gonzaga da Silva",
    role: "Estagiária",
    setor: "Escala",
    ramal: "60",
  },
  {
    slug: "ana-karine-leal",
    name: "Ana Karine Leal",
    role: "Advogada",
    setor: "Escala",
    ramal: "63",
  },
  {
    slug: "gabriela-costa-da-cruz",
    name: "Gabriela Costa da Cruz",
    role: "Advogada",
    setor: "Escala",
    ramal: "113",
  },

  {
    slug: "jade-de-souza-rodrigues",
    name: "Jade de Souza Rodrigues",
    role: "Advogada",
    setor: "Cível",
    ramal: "65",
    photo: "/equipe/jade-de-souza-rodrigues.jpg",
    oab: "OAB/MG", // TODO: confirmar número de inscrição
    // TODO: substituir pela bio real fornecida pelo escritório
    bio: "Advogada do André Araújo Advogados, atua no atendimento aos clientes do escritório em todo o Brasil.",
    hasProfile: true,
  },
  {
    slug: "kaic-morais-paim",
    name: "Kaic Morais Paim",
    role: "Advogado",
    setor: "Cível",
    ramal: "67",
  },
  {
    slug: "maria-rita-de-faria",
    name: "Maria Rita de Faria",
    role: "Auxiliar Jurídico",
    setor: "Cível",
    ramal: "69",
    photo: "/equipe/maria-rita-de-faria.jpg",
  },

  {
    slug: "barbara-pereira-da-cunha",
    name: "Bárbara Pereira da Cunha",
    role: "Controller",
    setor: "Controladoria",
    ramal: "162",
    photo: "/equipe/barbara-pereira-da-cunha.jpg",
  },
  {
    slug: "taciana-oliveira-silva",
    name: "Taciana Oliveira Silva",
    role: "Estagiária",
    setor: "Controladoria",
    ramal: "50",
  },
];

/** Slug do sócio fundador — a home e o bloco "sobre" das landing pages usam
 *  a foto e o nome dele. É buscado por slug, e não pela primeira posição do
 *  array, porque a ordem da equipe passou a ser editável no painel. */
export const FOUNDER_SLUG = "andre-augusto-de-araujo";

/** O fundador dentro de uma lista; cai no primeiro integrante se não achar. */
export function founderOf(members: TeamMember[]): TeamMember {
  return members.find((m) => m.slug === FOUNDER_SLUG) ?? members[0];
}

/** Primeira e última inicial do nome, ex.: "André Augusto de Araújo" → "AA" */
export function initialsOf(name: string): string {
  const parts = name.split(" ").filter((p) => p[0] === p[0]?.toUpperCase());
  return (parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "");
}

/**
 * Agrupa a equipe por setor preservando a ordem do array (a ordem definida no
 * painel). Quem está sem setor cai num grupo final sem título.
 */
export function groupBySetor(
  members: TeamMember[]
): { setor: string; members: TeamMember[] }[] {
  const groups = new Map<string, TeamMember[]>();
  for (const m of members) {
    const key = m.setor?.trim() || "";
    const list = groups.get(key);
    if (list) list.push(m);
    else groups.set(key, [m]);
  }
  // Sem setor sempre por último, mesmo que apareça primeiro no array.
  return [...groups.entries()]
    .sort((a, b) => (a[0] === "" ? 1 : b[0] === "" ? -1 : 0))
    .map(([setor, members]) => ({ setor, members }));
}
