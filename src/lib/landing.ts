import "server-only";
import { cache } from "react";
import { put, get, list, del } from "@vercel/blob";
import { areas } from "@/data/areas";
import { slugify } from "@/data/posts";
import type { LandingPage, LandingPageInput } from "@/data/landing";

/**
 * Camada de dados das landing pages: um único JSON no Vercel Blob com todas
 * as páginas, lido a cada render e gravado por inteiro a cada alteração no
 * painel (mesmo desenho do blog, src/lib/blog.ts).
 *
 * Duas diferenças, aprendidas testando:
 *
 * 1. O arquivo nunca é sobrescrito. Cada gravação cria `landing/pages-<n>.json`
 *    com um número crescente e apaga as versões anteriores; a leitura lista o
 *    prefixo e pega a mais nova. Sobrescrever o mesmo caminho faz a leitura
 *    devolver a versão anterior por segundos (store privado) ou minutos (CDN
 *    do store público), e "publicar" não refletiria na hora.
 * 2. Fica de preferência no store PRIVADO do painel (o mesmo das mensagens,
 *    CONTACT_BLOB_READ_WRITE_TOKEN), para rascunhos não terem URL pública.
 *    Sem ele, cai no store público. As imagens continuam públicas.
 */

const PREFIX = "landing/pages-";

type Store = { token: string; access: "public" | "private" };

function storage(): Store | null {
  if (process.env.CONTACT_BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.CONTACT_BLOB_READ_WRITE_TOKEN, access: "private" };
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN, access: "public" };
  }
  return null;
}

/** True quando há onde guardar as páginas. */
export function landingStorageEnabled(): boolean {
  return storage() !== null;
}

async function readFromBlob(store: Store): Promise<LandingPage[] | null> {
  const { blobs } = await list({ prefix: PREFIX, token: store.token, limit: 100 });
  if (blobs.length === 0) return null;
  const newest = [...blobs].sort((a, b) => (a.pathname < b.pathname ? 1 : -1))[0];
  const res = await get(newest.pathname, { access: store.access, token: store.token });
  if (!res) return null;
  const data = JSON.parse(await new Response(res.stream).text()) as LandingPage[];
  return Array.isArray(data) ? data : [];
}

/** Todas as páginas (rascunhos inclusive), da mais recente para a mais antiga. */
export const getAllLandingPages = cache(async (): Promise<LandingPage[]> => {
  const store = storage();
  if (!store) return [];
  try {
    const pages = (await readFromBlob(store)) ?? [];
    return [...pages].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  } catch (err) {
    console.error("Falha ao ler landing pages do Blob:", err);
    return [];
  }
});

/** Só as publicadas, na ordem de criação (é a ordem do menu). */
export async function getPublishedLandingPages(): Promise<LandingPage[]> {
  const pages = await getAllLandingPages();
  return pages
    .filter((p) => p.status === "publicada")
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export async function getLandingPage(slug: string): Promise<LandingPage | undefined> {
  const pages = await getAllLandingPages();
  return pages.find((p) => p.slug === slug);
}

async function persist(pages: LandingPage[]): Promise<void> {
  const store = storage();
  if (!store) {
    throw new Error(
      "Vercel Blob não configurado. Ative o Storage → Blob no painel do Vercel e defina BLOB_READ_WRITE_TOKEN."
    );
  }
  // Nome crescente e ordenável como texto (14 dígitos cobrem séculos).
  const pathname = `${PREFIX}${String(Date.now()).padStart(14, "0")}.json`;
  await put(pathname, JSON.stringify(pages, null, 2), {
    access: store.access,
    token: store.token,
    contentType: "application/json",
    addRandomSuffix: false,
  });
  // Apaga as versões anteriores (melhor esforço: a leitura já pega a mais nova).
  try {
    const { blobs } = await list({ prefix: PREFIX, token: store.token, limit: 100 });
    const old = blobs.filter((b) => b.pathname !== pathname);
    if (old.length > 0) await del(old.map((b) => b.url), { token: store.token });
  } catch (err) {
    console.error("Falha ao apagar versões antigas das landing pages:", err);
  }
}

/** Slugs que uma landing page não pode usar: áreas fixas e rotas do site. */
const RESERVED = new Set([
  ...areas.map((a) => a.slug),
  "servidor-publico",
  "admin",
  "api",
  "blog",
  "contato",
  "equipe",
  "faq",
  "o-escritorio",
  "servidores-publicos",
  "politica-de-privacidade",
]);

/** Gera um slug único (acrescenta -2, -3… se já existir, ignorando `exceptSlug`). */
function uniqueSlug(base: string, pages: LandingPage[], exceptSlug?: string): string {
  const root = slugify(base) || "pagina";
  let candidate = root;
  let n = 2;
  const taken = (s: string) =>
    RESERVED.has(s) || pages.some((p) => p.slug === s && p.slug !== exceptSlug);
  while (taken(candidate)) candidate = `${root}-${n++}`;
  return candidate;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Cria uma página e devolve o registro salvo (com slug definitivo). */
export async function createLandingPage(input: LandingPageInput): Promise<LandingPage> {
  const pages = await getAllLandingPages();
  const slug = uniqueSlug(input.slug || input.name, pages);
  const page: LandingPage = { ...input, slug, createdAt: today(), updatedAt: today() };
  await persist([page, ...pages]);
  return page;
}

/** Atualiza a página `originalSlug` (o slug pode mudar). Null se não existir. */
export async function updateLandingPage(
  originalSlug: string,
  input: LandingPageInput
): Promise<LandingPage | null> {
  const pages = await getAllLandingPages();
  const idx = pages.findIndex((p) => p.slug === originalSlug);
  if (idx === -1) return null;
  const slug = uniqueSlug(input.slug || input.name, pages, originalSlug);
  const updated: LandingPage = {
    ...pages[idx],
    ...input,
    slug,
    updatedAt: today(),
  };
  const next = [...pages];
  next[idx] = updated;
  await persist(next);
  return updated;
}

/** Remove a página. Devolve true se algo foi removido. */
export async function deleteLandingPage(slug: string): Promise<boolean> {
  const pages = await getAllLandingPages();
  const next = pages.filter((p) => p.slug !== slug);
  if (next.length === pages.length) return false;
  await persist(next);
  return true;
}
