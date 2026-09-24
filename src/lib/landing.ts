import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { areas } from "@/data/areas";
import { slugify } from "@/data/posts";
import type { LandingPage, LandingPageInput } from "@/data/landing";
import { dbEnabled, json, requireDb, sql } from "@/lib/db";

/**
 * Camada de dados das landing pages: a tabela `landing_pages` no Neon, uma
 * linha por página com o objeto inteiro em `data` (jsonb). Mesmo desenho do
 * blog (src/lib/blog.ts). Não há semente: sem banco, não há landing pages.
 *
 * Rascunhos ficam só no banco, sem URL pública; as imagens continuam no Blob.
 */

export const LANDING_TAG = "landing";

type Row = { data: LandingPage };
type Db = ReturnType<typeof sql>;

/** True quando há onde guardar as páginas. */
export function landingStorageEnabled(): boolean {
  return dbEnabled();
}

async function readAll(db: Db): Promise<LandingPage[]> {
  const rows = (await db.query(
    "select data from landing_pages order by data->>'updatedAt' desc, slug"
  )) as Row[];
  return rows.map((r) => r.data);
}

/** As páginas do banco, em cache até o painel salvar (ou por 1 dia). */
const readAllCached = unstable_cache(() => readAll(sql()), ["landing-all"], {
  tags: [LANDING_TAG],
  revalidate: 86400,
});

/** Todas as páginas (rascunhos inclusive), da mais recente para a mais antiga. */
export const getAllLandingPages = cache(async (): Promise<LandingPage[]> => {
  if (!dbEnabled()) return [];
  try {
    return await readAllCached();
  } catch (err) {
    console.error("Falha ao ler landing pages do banco:", err);
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
function uniqueSlug(base: string, taken: string[], exceptSlug?: string): string {
  const root = slugify(base) || "pagina";
  let candidate = root;
  let n = 2;
  const isTaken = (s: string) =>
    RESERVED.has(s) || taken.some((t) => t === s && t !== exceptSlug);
  while (isTaken(candidate)) candidate = `${root}-${n++}`;
  return candidate;
}

async function existingSlugs(db: Db): Promise<string[]> {
  const rows = (await db.query("select slug from landing_pages")) as {
    slug: string;
  }[];
  return rows.map((r) => r.slug);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Cria uma página e devolve o registro salvo (com slug definitivo). */
export async function createLandingPage(input: LandingPageInput): Promise<LandingPage> {
  const db = requireDb();
  const slug = uniqueSlug(input.slug || input.name, await existingSlugs(db));
  const page: LandingPage = { ...input, slug, createdAt: today(), updatedAt: today() };
  await db.query("insert into landing_pages (slug, data) values ($1, $2::jsonb)", [
    slug,
    json(page),
  ]);
  return page;
}

/** Atualiza a página `originalSlug` (o slug pode mudar). Null se não existir. */
export async function updateLandingPage(
  originalSlug: string,
  input: LandingPageInput
): Promise<LandingPage | null> {
  const db = requireDb();
  const rows = (await db.query("select data from landing_pages where slug = $1", [
    originalSlug,
  ])) as Row[];
  if (rows.length === 0) return null;
  const slug = uniqueSlug(
    input.slug || input.name,
    await existingSlugs(db),
    originalSlug
  );
  const updated: LandingPage = {
    ...rows[0].data,
    ...input,
    slug,
    updatedAt: today(),
  };
  await db.query(
    "update landing_pages set slug = $2, data = $3::jsonb, updated_at = now() where slug = $1",
    [originalSlug, slug, json(updated)]
  );
  return updated;
}

/** Remove a página. Devolve true se algo foi removido. */
export async function deleteLandingPage(slug: string): Promise<boolean> {
  const db = requireDb();
  const rows = await db.query(
    "delete from landing_pages where slug = $1 returning slug",
    [slug]
  );
  return rows.length > 0;
}
