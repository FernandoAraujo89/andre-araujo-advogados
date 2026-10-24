import { revalidatePath, revalidateTag } from "next/cache";
import {
  LP_LIMITS,
  heroImageDefault,
  sectionLabels,
  type LandingPageInput,
  type LpButton,
  type LpImage,
  type LpLink,
  type LpSection,
  type LpSectionType,
} from "@/data/landing";
import { categories, type Category } from "@/data/posts";
import { LANDING_TAG } from "@/lib/landing";

/**
 * Valida e normaliza a landing page enviada pelo editor visual. Devolve erro
 * legível. Limites generosos, mas finitos: o JSON inteiro vai para o banco e
 * é lido a cada render. Textos vazios são aceitos (a peça some no site);
 * só o essencial para a página existir é obrigatório.
 */

type Ok = { ok: true; value: LandingPageInput };
type Fail = { ok: false; error: string };
type Raw = Record<string, unknown>;

const obj = (v: unknown): Raw => (v && typeof v === "object" ? (v as Raw) : {});
const arr = (v: unknown, max: number = LP_LIMITS.items): unknown[] =>
  Array.isArray(v) ? v.slice(0, max) : [];

/** Uma linha: sem quebras, espaços aparados. */
const line = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Texto corrido: mantém parágrafos, no máximo uma linha em branco. */
const text = (v: unknown, max: number) =>
  typeof v === "string"
    ? v
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, max)
    : "";

/** Imagem do site, do Blob/banco (/imagens) ou de um endereço https. */
function image(raw: unknown, fallback?: LpImage): LpImage {
  const r = obj(raw);
  const src = line(r.src, 500);
  const valid = src.startsWith("/") ? !src.startsWith("//") : /^https?:\/\//.test(src);
  if (!valid) return fallback ?? { src: "", alt: "" };
  return { src, alt: line(r.alt, 200) };
}

/** Destino de botão/card: caminho do site, âncora, http(s), tel ou e-mail. */
function href(v: unknown): string {
  const h = line(v, 500);
  if (!h) return "";
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  if (h.startsWith("#")) return h;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(h)) return h;
  return "";
}

function link(raw: unknown): LpLink {
  const r = obj(raw);
  if (r.tipo === "contato") return { tipo: "contato" };
  if (r.tipo === "url") {
    const h = href(r.href);
    return h ? { tipo: "url", href: h } : { tipo: "whatsapp" };
  }
  return { tipo: "whatsapp" };
}

function button(raw: unknown): LpButton {
  const r = obj(raw);
  return { label: line(r.label, 40), link: link(r.link) };
}

const TYPES = Object.keys(sectionLabels) as LpSectionType[];

function section(raw: unknown): LpSection | null {
  const r = obj(raw);
  const type = r.type as LpSectionType;
  if (!TYPES.includes(type)) return null;
  const id = line(r.id, 20).replace(/[^a-z0-9-]/gi, "") || Math.random().toString(36).slice(2, 10);
  const base = { id, ...(r.hidden === true ? { hidden: true } : {}) };
  const title = line(r.title, 200);

  switch (type) {
    case "cards":
      return {
        ...base,
        type,
        title,
        text: text(r.text, 1000),
        items: arr(r.items).map((it) => {
          const i = obj(it);
          const h = href(i.href);
          return { image: image(i.image), title: line(i.title, 120), ...(h ? { href: h } : {}) };
        }),
      };
    case "numeros":
      return {
        ...base,
        type,
        title,
        text: text(r.text, 1000),
        items: arr(r.items).map((it) => {
          const i = obj(it);
          return { value: line(i.value, 20), label: line(i.label, 160) };
        }),
      };
    case "destaque":
      return {
        ...base,
        type,
        eyebrow: line(r.eyebrow, 80),
        title,
        highlight: line(r.highlight, 120),
        text: text(r.text, 3000),
        button: button(r.button),
        image: image(r.image),
      };
    case "depoimentos":
      return {
        ...base,
        type,
        eyebrow: line(r.eyebrow, 80),
        title,
        button: button(r.button),
        items: arr(r.items)
          .map((it) => {
            const i = obj(it);
            return { quote: text(i.quote, 1500), name: line(i.name, 80), role: line(i.role, 120) };
          })
          .filter((i) => i.quote),
      };
    case "equipe":
      return {
        ...base,
        type,
        title,
        text: text(r.text, 1000),
        members: arr(r.members, 24)
          .map((s) => line(s, 80))
          .filter(Boolean),
      };
    case "blog": {
      const category = categories.includes(r.category as Category) ? (r.category as Category) : "";
      return { ...base, type, title, category };
    }
    case "galeria":
      return {
        ...base,
        type,
        title,
        images: arr(r.images).map((i) => image(i)),
      };
    case "perguntas":
      return {
        ...base,
        type,
        eyebrow: line(r.eyebrow, 80),
        title,
        items: arr(r.items, 20)
          .map((it) => {
            const i = obj(it);
            return { question: line(i.question, 200), answer: text(i.answer, 2000) };
          })
          .filter((i) => i.question && i.answer),
      };
    case "contato":
      return { ...base, type, title, text: text(r.text, 1000) };
  }
}

export function parseLandingInput(raw: unknown): Ok | Fail {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Dados inválidos." };
  }
  const b = raw as Raw;
  if (b.version !== 2) {
    return { ok: false, error: "Formato de página desatualizado. Recarregue o editor." };
  }

  const name = line(b.name, 60);
  const tagline = line(b.tagline, 200);
  const slug = line(b.slug, 80);
  const status = b.status === "publicada" ? "publicada" : "rascunho";
  const whatsappMessage = line(b.whatsappMessage, 300);

  if (name.length < 3) {
    return { ok: false, error: "Informe o nome da página (o rótulo do menu), no painel “Página”." };
  }
  if (tagline.length < 10) {
    return { ok: false, error: "Informe a frase do card (pelo menos 10 caracteres), no painel “Página”." };
  }
  if (whatsappMessage.length < 5) {
    return { ok: false, error: "Informe a mensagem inicial do WhatsApp, no painel “Página”." };
  }

  const seoRaw = obj(b.seo);
  const seoImage = image({ src: seoRaw.image }).src;
  const seo = {
    title: line(seoRaw.title, 70) || name,
    description: line(seoRaw.description, 160) || tagline,
    ...(seoImage ? { image: seoImage } : {}),
  };

  const h = obj(b.hero);
  const hero = {
    eyebrow: line(h.eyebrow, 80),
    title: line(h.title, 160),
    highlight: line(h.highlight, 120),
    text: text(h.text, 600),
    button: button(h.button),
    image: image(h.image, heroImageDefault),
    ornament: h.ornament !== false,
  };
  if (hero.title.length < 3) {
    return { ok: false, error: "Escreva o título principal no topo da página." };
  }

  const sections = arr(b.sections, LP_LIMITS.sections)
    .map(section)
    .filter((s): s is LpSection => s !== null);

  return {
    ok: true,
    value: { version: 2, slug, status, name, tagline, seo, whatsappMessage, hero, sections },
  };
}

/**
 * Revalida tudo o que muda quando uma landing page é criada, editada ou
 * excluída: a própria página e o menu de áreas, presente em todas as páginas
 * (por isso o layout raiz inteiro).
 */
export function revalidateLanding(slugs: string[]) {
  // A tag vence primeiro (`expire: 0`): a próxima visita já lê o banco.
  revalidateTag(LANDING_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/areas-de-atuacao");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/areas-de-atuacao/${slug}`);
  }
}
