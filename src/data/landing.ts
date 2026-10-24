/**
 * Landing pages de campanha — tipos, conteúdo inicial e conversão do formato
 * antigo.
 *
 * O layout segue o arquivo do Figma "Landing page" (topo escuro com imagem
 * recortada, cards com foto em carrossel, números, faixa de destaque com
 * foto, depoimentos, equipe, publicações e galeria), traduzido para o
 * sistema visual do site. O cliente edita tudo no painel, direto sobre a
 * página (editor visual em /admin/landing), e pode reordenar, ocultar,
 * excluir e acrescentar seções. Os dados vivem no banco Neon
 * (src/lib/landing.ts) e as páginas publicadas entram na lista de áreas de
 * atuação em /areas-de-atuacao/<slug>.
 *
 * Este arquivo é importado também no navegador (editor), então não pode ter
 * nada de servidor.
 */

import type { Category } from "@/data/posts";
import { googleReviews } from "@/data/reviews";

export type LpImage = { src: string; alt: string };

/** Para onde um botão leva. */
export type LpLink =
  /** Abre o WhatsApp do escritório com a mensagem da página */
  | { tipo: "whatsapp" }
  /** Rola até o formulário de contato da própria página */
  | { tipo: "contato" }
  /** Qualquer endereço: página do site, link externo, telefone, e-mail */
  | { tipo: "url"; href: string };

export type LpButton = { label: string; link: LpLink };

export type LpHero = {
  eyebrow: string;
  title: string;
  /** Trecho final do título, em serifa itálica dourada */
  highlight: string;
  text: string;
  button: LpButton;
  /** Imagem recortada (PNG/WebP com fundo transparente) ou retrato vertical */
  image: LpImage;
  /** Ramo de louros dourados atrás da imagem */
  ornament: boolean;
};

type Base = {
  id: string;
  /** Oculta no site sem perder o conteúdo */
  hidden?: boolean;
};

export type LpCard = { image: LpImage; title: string; href?: string };
export type LpNumero = { value: string; label: string };
export type LpDepoimento = { quote: string; name: string; role: string };
export type LpPergunta = { question: string; answer: string };

export type LpSection =
  | (Base & { type: "cards"; title: string; text: string; items: LpCard[] })
  | (Base & { type: "numeros"; title: string; text: string; items: LpNumero[] })
  | (Base & {
      type: "destaque";
      eyebrow: string;
      title: string;
      highlight: string;
      text: string;
      button: LpButton;
      image: LpImage;
    })
  | (Base & {
      type: "depoimentos";
      eyebrow: string;
      title: string;
      button: LpButton;
      items: LpDepoimento[];
    })
  | (Base & {
      type: "equipe";
      title: string;
      text: string;
      /** Slugs da equipe, na ordem de exibição; vazio = sócio e advogados com foto */
      members: string[];
    })
  | (Base & {
      type: "blog";
      title: string;
      /** Filtra os posts por categoria; vazio = os mais recentes */
      category: Category | "";
    })
  | (Base & { type: "galeria"; title: string; images: LpImage[] })
  | (Base & {
      type: "perguntas";
      eyebrow: string;
      title: string;
      items: LpPergunta[];
    })
  | (Base & { type: "contato"; title: string; text: string });

export type LpSectionType = LpSection["type"];
export type LpSectionOf<T extends LpSectionType> = Extract<LpSection, { type: T }>;

export type LandingPage = {
  version: 2;
  slug: string;
  status: "rascunho" | "publicada";
  /** Rótulo curto no menu de áreas de atuação */
  name: string;
  /** Uma linha para o card no índice de áreas */
  tagline: string;
  seo: { title: string; description: string; image?: string };
  /** Mensagem pré-preenchida dos botões de WhatsApp da página */
  whatsappMessage: string;
  hero: LpHero;
  sections: LpSection[];
  createdAt: string; // ISO yyyy-mm-dd
  updatedAt: string; // ISO yyyy-mm-dd
};

export type LandingPageInput = Omit<LandingPage, "createdAt" | "updatedAt">;

/** Limites compartilhados pelo editor e pela validação do servidor. */
export const LP_LIMITS = { sections: 20, items: 12 } as const;

export const sectionLabels: Record<LpSectionType, string> = {
  cards: "Cards com foto",
  numeros: "Números",
  destaque: "Destaque com foto",
  depoimentos: "Depoimentos",
  equipe: "Equipe",
  blog: "Publicações do blog",
  galeria: "Galeria de fotos",
  perguntas: "Perguntas frequentes",
  contato: "Formulário de contato",
};

/** Uma linha sobre cada seção, para o menu "Adicionar seção" do editor. */
export const sectionHints: Record<LpSectionType, string> = {
  cards: "Carrossel de cards verticais com foto e título",
  numeros: "Título, texto e quatro números em destaque",
  destaque: "Faixa escura com foto, texto e botão",
  depoimentos: "Citações em carrossel ao lado do título",
  equipe: "Fotos redondas de quem atende",
  blog: "Os posts mais recentes do blog, automaticamente",
  galeria: "Fotos largas em sequência",
  perguntas: "Perguntas e respostas (aparecem no Google)",
  contato: "Formulário com o assunto da página já marcado",
};

/** Imagens do template, em public/images/landing (arquivo do Figma). */
export const LP_IMAGES = {
  justica: "/images/landing/hero-justica.webp",
  louros: "/images/landing/hero-louros.webp",
  curvas: "/images/landing/ornamento-curvas.webp",
  justicaTraco: "/images/landing/ornamento-justica.webp",
  livros: "/images/landing/area-livros.webp",
  martelo: "/images/landing/area-martelo.webp",
  marteloLivro: "/images/landing/area-martelo-livro.webp",
  lombadas: "/images/landing/area-lombadas.webp",
  destaque: "/images/landing/destaque-martelo.webp",
} as const;

export const heroImageDefault: LpImage = {
  src: LP_IMAGES.justica,
  alt: "Estátua da Justiça com a balança erguida",
};

export function newSectionId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Botão de chamada padrão: leva ao formulário da própria página, onde o
 * contato fica registrado no painel com a origem (decisão do escritório,
 * 24/10/2026). O WhatsApp continua como opção de cada botão no editor.
 */
const formButton = (label = "Quero analisar meu caso"): LpButton => ({
  label,
  link: { tipo: "contato" },
});

const whatsappButton = (label = "Falar no WhatsApp"): LpButton => ({
  label,
  link: { tipo: "whatsapp" },
});

/** Avaliações reais do Google (src/data/reviews.ts), sem editar as citações. */
function googleDepoimentos(): LpDepoimento[] {
  return googleReviews.reviews.map((r) => ({
    quote: r.text,
    name: r.name,
    role: "Avaliação 5 estrelas no Google",
  }));
}

/** Um item novo de cada lista, para o botão "Adicionar" do editor. */
export const newItem = {
  card: (): LpCard => ({
    image: { src: LP_IMAGES.livros, alt: "Livros jurídicos sobre a mesa" },
    title: "Novo card",
  }),
  numero: (): LpNumero => ({ value: "10+", label: "Descrição do número" }),
  depoimento: (): LpDepoimento => ({
    quote: "Escreva aqui o depoimento.",
    name: "Nome",
    role: "Cliente",
  }),
  pergunta: (): LpPergunta => ({
    question: "Nova pergunta?",
    answer: "Escreva a resposta em linguagem simples.",
  }),
  foto: (): LpImage => ({ src: "", alt: "" }),
};

/** Uma seção nova, com textos de exemplo que o cliente substitui. */
export function newSection(type: LpSectionType): LpSection {
  const id = newSectionId();
  switch (type) {
    case "cards":
      return {
        type,
        id,
        title: "Áreas de atuação",
        text: "Apresente as situações que esta página atende. Cada card pode levar a uma página do site.",
        items: [
          {
            image: { src: LP_IMAGES.livros, alt: "Livros jurídicos empilhados sobre a mesa" },
            title: "Servidor Público",
            href: "/servidores-publicos",
          },
          {
            image: { src: LP_IMAGES.martelo, alt: "Martelo de juiz em fundo escuro" },
            title: "Direito Tributário",
            href: "/areas-de-atuacao/direito-tributario",
          },
          {
            image: { src: LP_IMAGES.marteloLivro, alt: "Martelo de juiz apoiado sobre um livro" },
            title: "Direito Empresarial",
            href: "/areas-de-atuacao/direito-empresarial",
          },
          {
            image: { src: LP_IMAGES.lombadas, alt: "Lombadas de livros antigos encadernados em couro" },
            title: "Direito Imobiliário",
            href: "/areas-de-atuacao/direito-imobiliario",
          },
        ],
      };
    case "numeros":
      return {
        type,
        id,
        title: "Advocacia comprometida com o seu direito",
        text: "Use esta faixa para mostrar, em poucos números, por que vale a pena confiar o caso ao escritório.",
        items: [
          { value: "7", label: "anos de história" },
          { value: "1.000+", label: "casos acompanhados" },
          {
            value: googleReviews.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 }),
            label: `nota no Google, com ${googleReviews.count} avaliações`,
          },
          { value: "Brasil", label: "atendimento em todo o país" },
        ],
      };
    case "destaque":
      return {
        type,
        id,
        eyebrow: "Atendimento próximo",
        title: "A experiência do escritório",
        highlight: "a serviço do seu caso",
        text: "Conte aqui como o escritório conduz o atendimento: quem analisa o caso, como o cliente acompanha cada etapa e o que torna o trabalho diferente.",
        button: formButton("Fale com o escritório"),
        image: { src: LP_IMAGES.destaque, alt: "Martelo de juiz sobre uma mesa de mármore" },
      };
    case "depoimentos":
      return {
        type,
        id,
        eyebrow: "Avaliações no Google",
        title: "O que dizem os nossos clientes",
        button: formButton(),
        items: googleDepoimentos(),
      };
    case "equipe":
      return {
        type,
        id,
        title: "Quem cuida do seu caso",
        text: "Advogados que acompanham cada etapa com você, presencialmente ou a distância.",
        members: [],
      };
    case "blog":
      return { type, id, title: "Publicações", category: "" };
    case "galeria":
      return {
        type,
        id,
        title: "Conheça o escritório",
        images: [
          { src: "/images/escritorio/recepcao.jpg", alt: "Recepção do escritório André Araújo Advogados" },
          { src: "/images/escritorio/sala-de-reunioes.jpg", alt: "Sala de reuniões do escritório" },
          { src: "/images/escritorio/equipe-reuniao.jpg", alt: "Equipe do escritório reunida" },
        ],
      };
    case "perguntas":
      return {
        type,
        id,
        eyebrow: "Dúvidas frequentes",
        title: "Perguntas frequentes",
        items: [
          {
            question: "O atendimento pode ser a distância?",
            answer: "Sim. As reuniões podem ser por videochamada e os documentos chegam por WhatsApp ou e-mail.",
          },
          {
            question: "Quanto tempo leva?",
            answer: "Depende do caso. Na primeira conversa explicamos os prazos esperados e cada etapa.",
          },
        ],
      };
    case "contato":
      return {
        type,
        id,
        title: "Fale com o escritório",
        text: "Envie sua mensagem ou fale direto pelo WhatsApp. Retornamos o quanto antes.",
      };
  }
}

/** Página nova no modelo padrão: o layout completo do Figma, para adaptar. */
export function emptyLandingPage(): LandingPageInput {
  return {
    version: 2,
    slug: "",
    status: "rascunho",
    name: "",
    tagline: "",
    seo: { title: "", description: "" },
    whatsappMessage: "Olá, vim pela página do site e gostaria de entender meu caso.",
    hero: {
      eyebrow: "Atendimento em todo o Brasil",
      title: "Orientação jurídica clara, do primeiro contato até",
      highlight: "a solução do seu caso",
      text: "Explique em uma ou duas frases o problema que esta página resolve e para quem ela é.",
      button: formButton(),
      image: heroImageDefault,
      ornament: true,
    },
    sections: [
      newSection("cards"),
      newSection("numeros"),
      newSection("destaque"),
      newSection("depoimentos"),
      newSection("equipe"),
      newSection("blog"),
      newSection("galeria"),
      newSection("contato"),
    ],
  };
}

/** Link de WhatsApp do escritório com a mensagem da página. */
export function whatsappHref(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** Endereço final de um botão. */
export function linkHref(link: LpLink, wa: string): string {
  if (link.tipo === "whatsapp") return wa;
  if (link.tipo === "contato") return "#contato";
  return link.href || "#";
}

/** Links que saem do site abrem em outra aba. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/* ------------------------------------------------------------------ */
/* Conversão do formato antigo (antes do layout do Figma)              */
/* ------------------------------------------------------------------ */

type V1Image = { src?: string; alt?: string } | undefined;
type V1Section = {
  type?: string;
  title?: string;
  text?: string;
  image?: V1Image;
  items?: unknown[];
};
type V1Page = {
  slug?: string;
  status?: string;
  name?: string;
  tagline?: string;
  seo?: { title?: string; description?: string; image?: string };
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: V1Image;
    ctaLabel?: string;
    whatsappMessage?: string;
  };
  sections?: V1Section[];
  fechamento?: { title?: string; text?: string; formulario?: boolean };
  createdAt?: string;
  updatedAt?: string;
};

/** Markdown simples do formato antigo → texto corrido. */
function plain(md = ""): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function v1Image(img: V1Image, fallback: LpImage): LpImage {
  return img?.src ? { src: img.src, alt: img.alt ?? "" } : fallback;
}

/**
 * Lê uma página gravada no banco em qualquer formato. As do formato antigo
 * (sem `version`) viram o layout novo: o topo, as seções de texto, as
 * perguntas e o formulário são aproveitados; o resto volta ao padrão.
 */
export function upgradeLanding(raw: unknown): LandingPage {
  const r = (raw ?? {}) as Partial<LandingPage> & V1Page;
  if (r.version === 2) return r as LandingPage;

  const old = r as V1Page;
  const sections: LpSection[] = [];
  for (const s of old.sections ?? []) {
    if ((s.type === "texto" || s.type === "sobre") && s.title) {
      const base = newSection("destaque") as LpSectionOf<"destaque">;
      sections.push({
        ...base,
        eyebrow: "",
        title: s.title,
        highlight: "",
        text: plain(s.text),
        image: v1Image(s.image, base.image),
      });
    } else if (s.type === "faq" && Array.isArray(s.items)) {
      const items = (s.items as { question?: string; answer?: string }[])
        .filter((i) => i?.question && i?.answer)
        .map((i) => ({ question: i.question!, answer: i.answer! }));
      if (items.length) {
        sections.push({
          ...(newSection("perguntas") as LpSectionOf<"perguntas">),
          title: s.title || "Perguntas frequentes",
          items,
        });
      }
    } else if (s.type === "avaliacoes") {
      sections.push(newSection("depoimentos"));
    }
  }
  // Com formulário, os botões levam a ele; sem, ao WhatsApp, como antes.
  const hasForm = old.fechamento?.formulario !== false;
  if (!hasForm) {
    for (const s of sections) {
      if ("button" in s && s.button.link.tipo === "contato") s.button = whatsappButton();
    }
  }
  if (hasForm) {
    sections.push({
      ...(newSection("contato") as LpSectionOf<"contato">),
      title: old.fechamento?.title || "Fale com o escritório",
      text: old.fechamento?.text ?? "",
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  return {
    version: 2,
    slug: old.slug ?? "",
    status: old.status === "publicada" ? "publicada" : "rascunho",
    name: old.name ?? "",
    tagline: old.tagline ?? "",
    seo: {
      title: old.seo?.title ?? "",
      description: old.seo?.description ?? "",
      image: old.seo?.image,
    },
    whatsappMessage:
      old.hero?.whatsappMessage || "Olá, vim pela página do site e gostaria de entender meu caso.",
    hero: {
      eyebrow: old.hero?.eyebrow ?? "",
      title: old.hero?.title ?? "",
      highlight: "",
      text: old.hero?.subtitle ?? "",
      button: hasForm ? formButton() : whatsappButton(old.hero?.ctaLabel || "Falar no WhatsApp"),
      image: v1Image(old.hero?.image, heroImageDefault),
      ornament: !old.hero?.image?.src,
    },
    sections,
    createdAt: old.createdAt ?? today,
    updatedAt: old.updatedAt ?? today,
  };
}
