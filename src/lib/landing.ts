import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { areas } from "@/data/areas";
import { slugify } from "@/data/posts";
import { upgradeLanding, type LandingPage, type LandingPageInput } from "@/data/landing";
import { dbEnabled, json, requireDb, sql } from "@/lib/db";

/**
 * Camada de dados das landing pages: a tabela `landing_pages` no Neon, uma
 * linha por página com o objeto inteiro em `data` (jsonb). Mesmo desenho do
 * blog (src/lib/blog.ts). Não há semente: sem banco, não há landing pages.
 *
 * Rascunhos ficam só no banco, sem URL pública; as imagens continuam no Blob.
 * Páginas gravadas no formato antigo (antes do layout do Figma) são
 * convertidas na leitura (upgradeLanding) e regravadas no formato novo no
 * próximo salvamento.
 *
 * Só em `next dev` sem DATABASE_URL, as páginas ficam num arquivo local
 * (.data/landing-pages.json, fora do git), para dar para testar o editor e a
 * página pública sem o banco. Em produção não há esse atalho.
 */

export const LANDING_TAG = "landing";

type Row = { data: LandingPage };
type Db = ReturnType<typeof sql>;

const DEV_FILE = path.join(process.cwd(), ".data", "landing-pages.json");

/** Desenvolvimento local sem banco: as páginas vão para um arquivo. */
function devFileStore(): boolean {
  return process.env.NODE_ENV === "development" && !dbEnabled();
}

async function readDevFile(): Promise<LandingPage[]> {
  try {
    const raw = JSON.parse(await fs.readFile(DEV_FILE, "utf8")) as unknown[];
    return raw.map(upgradeLanding);
  } catch {
    return [];
  }
}

async function writeDevFile(pages: LandingPage[]): Promise<void> {
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(pages, null, 2));
}

/** True quando há onde guardar as páginas. */
export function landingStorageEnabled(): boolean {
  return dbEnabled() || devFileStore();
}

async function readAll(db: Db): Promise<LandingPage[]> {
  const rows = (await db.query(
    "select data from landing_pages order by data->>'updatedAt' desc, slug"
  )) as Row[];
  return rows.map((r) => upgradeLanding(r.data));
}

/** As páginas do banco, em cache até o painel salvar (ou por 1 dia). */
const readAllCached = unstable_cache(() => readAll(sql()), ["landing-all"], {
  tags: [LANDING_TAG],
  revalidate: 86400,
});

/** Todas as páginas (rascunhos inclusive), da mais recente para a mais antiga. */
export const getAllLandingPages = cache(async (): Promise<LandingPage[]> => {
  if (devFileStore()) {
    const pages = await readDevFile();
    return pages.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }
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
  if (devFileStore()) {
    const pages = await readDevFile();
    const slug = uniqueSlug(input.slug || input.name, pages.map((p) => p.slug));
    const page: LandingPage = { ...input, slug, createdAt: today(), updatedAt: today() };
    await writeDevFile([...pages, page]);
    return page;
  }
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
  if (devFileStore()) {
    const pages = await readDevFile();
    const current = pages.find((p) => p.slug === originalSlug);
    if (!current) return null;
    const slug = uniqueSlug(input.slug || input.name, pages.map((p) => p.slug), originalSlug);
    const updated: LandingPage = { ...current, ...input, slug, updatedAt: today() };
    await writeDevFile(pages.map((p) => (p.slug === originalSlug ? updated : p)));
    return updated;
  }
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
    ...upgradeLanding(rows[0].data),
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
  if (devFileStore()) {
    const pages = await readDevFile();
    const rest = pages.filter((p) => p.slug !== slug);
    await writeDevFile(rest);
    return rest.length < pages.length;
  }
  const db = requireDb();
  const rows = await db.query(
    "delete from landing_pages where slug = $1 returning slug",
    [slug]
  );
  return rows.length > 0;
}
