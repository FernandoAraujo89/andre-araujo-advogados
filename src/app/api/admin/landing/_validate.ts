import { revalidatePath, revalidateTag } from "next/cache";
import type {
  LandingPageInput,
  LpImage,
  LpSection,
  LpSectionType,
} from "@/data/landing";
import { youtubeId } from "@/data/landing";
import { LANDING_TAG } from "@/lib/landing";

/**
 * Valida e normaliza a landing page enviada pelo editor. Devolve erro
 * legível. Limites generosos, mas finitos: o JSON inteiro vai para o banco e
 * é lido a cada render.
 */

const MAX_SECTIONS = 20;
const MAX_ITEMS = 12;

type Ok = { ok: true; value: LandingPageInput };
type Fail = { ok: false; error: string };

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function image(raw: unknown): LpImage | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const src = str(r.src, 500);
  if (!src) return undefined;
  if (!/^https?:\/\//.test(src) && !src.startsWith("/")) return undefined;
  return { src, alt: str(r.alt, 200) };
}

function pairs(raw: unknown, a: "title" | "question", b: "text" | "answer") {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MAX_ITEMS)
    .map((it) => {
      const r = (it ?? {}) as Record<string, unknown>;
      return { [a]: str(r[a], 200), [b]: str(r[b], 2000) };
    })
    .filter((it) => it[a] && it[b]);
}

const TYPES: LpSectionType[] = [
  "texto",
  "lista",
  "passos",
  "cards",
  "sobre",
  "avaliacoes",
  "faq",
  "cta",
];

function section(raw: unknown): LpSection | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const type = r.type as LpSectionType;
  if (!TYPES.includes(type)) return null;
  const id = str(r.id, 20) || Math.random().toString(36).slice(2, 10);
  const title = str(r.title, 200);
  const intro = str(r.intro, 1000) || undefined;
  switch (type) {
    case "texto": {
      const text = str(r.text, 6000);
      if (!title || !text) return null;
      return { type, id, title, text, image: image(r.image) };
    }
    case "lista": {
      const items = Array.isArray(r.items)
        ? r.items.map((i) => str(i, 300)).filter(Boolean).slice(0, MAX_ITEMS)
        : [];
      if (!title || items.length === 0) return null;
      return { type, id, title, intro, items };
    }
    case "passos":
    case "cards": {
      const items = pairs(r.items, "title", "text") as { title: string; text: string }[];
      if (!title || items.length === 0) return null;
      return { type, id, title, intro, items };
    }
    case "sobre": {
      const text = str(r.text, 4000);
      if (!title || !text) return null;
      return { type, id, title, text, image: image(r.image) };
    }
    case "avaliacoes":
      return { type, id };
    case "faq": {
      const items = pairs(r.items, "question", "answer") as {
        question: string;
        answer: string;
      }[];
      if (!title || items.length === 0) return null;
      return { type, id, title, items };
    }
    case "cta": {
      const text = str(r.text, 1000);
      if (!title) return null;
      return { type, id, title, text };
    }
  }
}

export function parseLandingInput(raw: unknown): Ok | Fail {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Dados inválidos." };
  }
  const b = raw as Record<string, unknown>;

  const name = str(b.name, 60);
  const tagline = str(b.tagline, 200);
  const slug = str(b.slug, 80);
  const status = b.status === "publicada" ? "publicada" : "rascunho";

  if (name.length < 3) return { ok: false, error: "Informe o nome da página (o rótulo do menu)." };
  if (tagline.length < 10) return { ok: false, error: "Informe a frase curta do card (pelo menos 10 caracteres)." };

  const seoRaw = (b.seo ?? {}) as Record<string, unknown>;
  const seo = {
    title: str(seoRaw.title, 70) || name,
    description: str(seoRaw.description, 160) || tagline,
    image: str(seoRaw.image, 500) || undefined,
  };

  const h = (b.hero ?? {}) as Record<string, unknown>;
  const videoUrl = str(h.videoUrl, 300);
  if (videoUrl && !youtubeId(videoUrl)) {
    return { ok: false, error: "O vídeo precisa ser um link do YouTube." };
  }
  const hero = {
    eyebrow: str(h.eyebrow, 80) || undefined,
    title: str(h.title, 160),
    subtitle: str(h.subtitle, 400),
    image: image(h.image),
    videoUrl: videoUrl || undefined,
    ctaLabel: str(h.ctaLabel, 40) || "Falar no WhatsApp",
    whatsappMessage: str(h.whatsappMessage, 300),
  };
  if (hero.title.length < 5) return { ok: false, error: "Informe o título principal da página." };
  if (hero.subtitle.length < 10) return { ok: false, error: "Informe o subtítulo do topo." };
  if (hero.whatsappMessage.length < 5) return { ok: false, error: "Informe a mensagem inicial do WhatsApp." };

  const sections = (Array.isArray(b.sections) ? b.sections : [])
    .slice(0, MAX_SECTIONS)
    .map(section)
    .filter((s): s is LpSection => s !== null);

  const f = (b.fechamento ?? {}) as Record<string, unknown>;
  const fechamento = {
    title: str(f.title, 160) || "Conte sua situação",
    text: str(f.text, 600),
    formulario: f.formulario !== false,
  };

  return {
    ok: true,
    value: { slug, status, name, tagline, seo, hero, sections, fechamento },
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
