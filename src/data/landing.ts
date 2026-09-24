/**
 * Landing pages de campanha — tipos e modelo inicial.
 *
 * O cliente monta cada página no painel /admin a partir de um template do
 * setor jurídico: hero fixo no topo, seções reordenáveis no meio (texto com
 * imagem, lista, passos, cards, sobre o escritório, avaliações do Google,
 * perguntas frequentes, chamada para ação) e fechamento com formulário. Os
 * dados vivem no banco Neon (src/lib/landing.ts) e as páginas publicadas
 * entram na lista de áreas de atuação em /areas-de-atuacao/<slug>.
 *
 * Este arquivo é importado também no navegador (editor), então não pode ter
 * nada de servidor.
 */

export type LpImage = { src: string; alt: string };

export type LpSection =
  | {
      type: "texto";
      id: string;
      title: string;
      /** Markdown simples (parágrafos, negrito, listas, links) */
      text: string;
      image?: LpImage;
    }
  | {
      type: "lista";
      id: string;
      title: string;
      intro?: string;
      items: string[];
    }
  | {
      type: "passos";
      id: string;
      title: string;
      intro?: string;
      items: { title: string; text: string }[];
    }
  | {
      type: "cards";
      id: string;
      title: string;
      intro?: string;
      items: { title: string; text: string }[];
    }
  | {
      type: "sobre";
      id: string;
      title: string;
      text: string;
      image?: LpImage;
    }
  | { type: "avaliacoes"; id: string }
  | {
      type: "faq";
      id: string;
      title: string;
      items: { question: string; answer: string }[];
    }
  | { type: "cta"; id: string; title: string; text: string };

export type LpSectionType = LpSection["type"];

export type LandingPage = {
  slug: string;
  status: "rascunho" | "publicada";
  /** Rótulo curto no menu de áreas de atuação */
  name: string;
  /** Uma linha para o card no índice de áreas */
  tagline: string;
  seo: { title: string; description: string; image?: string };
  hero: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    image?: LpImage;
    /** URL de vídeo do YouTube; quando presente, substitui a imagem */
    videoUrl?: string;
    ctaLabel: string;
    /** Mensagem pré-preenchida ao abrir o WhatsApp */
    whatsappMessage: string;
  };
  sections: LpSection[];
  fechamento: {
    title: string;
    text: string;
    /** Mostra o formulário de contato (com o assunto já marcado) */
    formulario: boolean;
  };
  createdAt: string; // ISO yyyy-mm-dd
  updatedAt: string; // ISO yyyy-mm-dd
};

export type LandingPageInput = Omit<LandingPage, "createdAt" | "updatedAt">;

export const sectionLabels: Record<LpSectionType, string> = {
  texto: "Texto com imagem",
  lista: "Lista de itens",
  passos: "Passo a passo",
  cards: "Cards de diferenciais",
  sobre: "Sobre o escritório",
  avaliacoes: "Avaliações do Google",
  faq: "Perguntas frequentes",
  cta: "Chamada para o WhatsApp",
};

export function newSectionId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Uma seção nova, com textos de exemplo que o cliente substitui. */
export function newSection(type: LpSectionType): LpSection {
  const id = newSectionId();
  switch (type) {
    case "texto":
      return {
        type,
        id,
        title: "O que é este direito",
        text: "Explique em linguagem simples do que se trata, quem costuma ser afetado e por que vale a pena buscar orientação.",
      };
    case "lista":
      return {
        type,
        id,
        title: "Você se identifica com alguma destas situações?",
        items: [
          "Situação comum que o cliente vive",
          "Outra situação frequente",
          "Uma dúvida que costuma aparecer",
        ],
      };
    case "passos":
      return {
        type,
        id,
        title: "Como funciona o atendimento",
        items: [
          { title: "Análise do caso", text: "Você conta sua situação e envia os documentos; o escritório avalia a viabilidade." },
          { title: "Estratégia", text: "Definimos juntos o melhor caminho, administrativo ou judicial." },
          { title: "Acompanhamento", text: "Conduzimos o processo e mantemos você informado a cada etapa." },
        ],
      };
    case "cards":
      return {
        type,
        id,
        title: "Por que contar com o escritório",
        items: [
          { title: "Atendimento próximo", text: "Você fala com quem conduz o seu caso, presencial ou remoto." },
          { title: "Linguagem clara", text: "Explicamos cada etapa sem juridiquês." },
          { title: "Transparência", text: "Você sabe o que esperar e quais são os custos envolvidos." },
        ],
      };
    case "sobre":
      return {
        type,
        id,
        title: "Quem vai cuidar do seu caso",
        text: "Apresente o advogado ou a equipe responsável: formação, experiência na área e como o atendimento acontece.",
      };
    case "avaliacoes":
      return { type, id };
    case "faq":
      return {
        type,
        id,
        title: "Perguntas frequentes",
        items: [
          { question: "Quanto tempo leva?", answer: "Depende do caso; na primeira conversa explicamos os prazos esperados." },
          { question: "O atendimento pode ser a distância?", answer: "Sim. Reuniões por videochamada e documentos por WhatsApp ou e-mail." },
        ],
      };
    case "cta":
      return {
        type,
        id,
        title: "Quer saber se você tem esse direito?",
        text: "Fale com o escritório pelo WhatsApp e conte sua situação. A primeira conversa é para entender o seu caso.",
      };
  }
}

/** Página nova: um esqueleto completo no formato do setor, para editar. */
export function emptyLandingPage(): LandingPageInput {
  return {
    slug: "",
    status: "rascunho",
    name: "",
    tagline: "",
    seo: { title: "", description: "" },
    hero: {
      eyebrow: "Direito do Servidor Público",
      title: "Você pode ter direito a uma indenização",
      subtitle:
        "Explique em uma ou duas frases o problema que a página resolve e para quem ela é.",
      ctaLabel: "Falar no WhatsApp",
      whatsappMessage: "Olá, vim pela página do site e gostaria de entender meu caso.",
    },
    sections: [
      newSection("texto"),
      newSection("lista"),
      newSection("passos"),
      newSection("sobre"),
      newSection("avaliacoes"),
      newSection("faq"),
      newSection("cta"),
    ],
    fechamento: {
      title: "Conte sua situação",
      text: "Envie sua mensagem ou fale direto pelo WhatsApp. Retornamos o quanto antes.",
      formulario: true,
    },
  };
}

/** Extrai o id de um vídeo do YouTube (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}
