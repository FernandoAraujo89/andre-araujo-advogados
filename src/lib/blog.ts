import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { SEED_POSTS, slugify, type Post } from "@/data/posts";
import { dbEnabled, json, requireDb, sql } from "@/lib/db";

/**
 * Camada de dados do blog.
 *
 * Fonte de verdade em produção: a tabela `posts` no Neon (Postgres), uma
 * linha por post com o objeto inteiro em `data` (jsonb), então os tipos de
 * src/data/posts.ts valem sem mapear coluna por coluna. Sem DATABASE_URL
 * (dev sem `vercel env pull`) ou com a tabela vazia, vale a SEMENTE de
 * src/data/posts.ts, e o site sempre renderiza.
 *
 * A leitura pública fica em cache (tag "posts"): as páginas são estáticas e
 * só consultam o banco quando o painel salva algo (revalidateBlog) ou uma vez
 * por dia. As escritas são uma linha por vez (upsert/delete por slug).
 */

export const POSTS_TAG = "posts";

type Row = { data: Post };

/** Todos os posts do banco, em cache até o painel salvar (ou por 1 dia). */
const readAllCached = unstable_cache(
  async (): Promise<Post[]> => {
    const rows = (await sql().query(
      "select data from posts order by data->>'date' desc"
    )) as Row[];
    return rows.map((r) => r.data);
  },
  ["posts-all"],
  { tags: [POSTS_TAG], revalidate: 86400 }
);

/**
 * Todos os posts, ordenados do mais recente para o mais antigo.
 * `cache()` deduplica a leitura dentro de um mesmo render. A queda para a
 * semente fica fora do cache de dados: uma falha momentânea do banco não
 * congela a semente no cache.
 */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  let posts: Post[] = SEED_POSTS;
  if (dbEnabled()) {
    try {
      const fromDb = await readAllCached();
      if (fromDb.length > 0) posts = fromDb;
    } catch (err) {
      console.error("Falha ao ler posts do banco, usando semente:", err);
    }
  }
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
});

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

/**
 * Na primeira escrita com a tabela vazia, grava a semente antes: o site vinha
 * mostrando esses posts, e uma única linha nova os faria sumir.
 */
async function ensureSeeded(db: ReturnType<typeof sql>): Promise<void> {
  const [{ n }] = (await db.query("select count(*)::int as n from posts")) as {
    n: number;
  }[];
  if (n > 0 || SEED_POSTS.length === 0) return;
  await db.transaction((txn) =>
    SEED_POSTS.map((p) =>
      txn.query(
        "insert into posts (slug, data) values ($1, $2::jsonb) on conflict (slug) do nothing",
        [p.slug, json(p)]
      )
    )
  );
}

async function existingSlugs(db: ReturnType<typeof sql>): Promise<string[]> {
  const rows = (await db.query("select slug from posts")) as { slug: string }[];
  return rows.map((r) => r.slug);
}

/** Gera um slug único (acrescenta -2, -3… se já existir, ignorando `exceptSlug`). */
function uniqueSlug(base: string, taken: string[], exceptSlug?: string): string {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 2;
  while (taken.some((s) => s === candidate && s !== exceptSlug)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

export type PostInput = Omit<Post, "slug"> & { slug?: string };

/** Cria um post novo e devolve o registro salvo (com slug definitivo). */
export async function createPost(input: PostInput): Promise<Post> {
  const db = requireDb();
  await ensureSeeded(db);
  const slug = uniqueSlug(input.slug || input.title, await existingSlugs(db));
  const post: Post = { ...input, slug, updatedAt: input.date };
  await db.query("insert into posts (slug, data) values ($1, $2::jsonb)", [
    slug,
    json(post),
  ]);
  return post;
}

/**
 * Atualiza o post identificado por `originalSlug`. Permite trocar o slug
 * (mantendo-o único). Devolve o registro atualizado ou null se não existir.
 */
export async function updatePost(
  originalSlug: string,
  input: PostInput
): Promise<Post | null> {
  const db = requireDb();
  await ensureSeeded(db);
  const rows = (await db.query("select data from posts where slug = $1", [
    originalSlug,
  ])) as Row[];
  if (rows.length === 0) return null;
  const slug = uniqueSlug(
    input.slug || input.title,
    await existingSlugs(db),
    originalSlug
  );
  const updated: Post = {
    ...rows[0].data,
    ...input,
    slug,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  await db.query(
    "update posts set slug = $2, data = $3::jsonb, updated_at = now() where slug = $1",
    [originalSlug, slug, json(updated)]
  );
  return updated;
}

/** Remove o post. Devolve true se algo foi removido. */
export async function deletePost(slug: string): Promise<boolean> {
  const db = requireDb();
  await ensureSeeded(db);
  const rows = await db.query("delete from posts where slug = $1 returning slug", [
    slug,
  ]);
  return rows.length > 0;
}
