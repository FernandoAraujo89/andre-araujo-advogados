import "server-only";
import { cache } from "react";
import { put, list } from "@vercel/blob";
import { SEED_POSTS, slugify, type Post } from "@/data/posts";

/**
 * Camada de dados do blog.
 *
 * Fonte de verdade em produção: um único JSON em Vercel Blob
 * (`blog/posts.json`). Quando o Blob não está configurado (dev local sem
 * token) ou ainda está vazio (primeiro deploy), caímos na SEMENTE de
 * src/data/posts.ts — assim o site sempre renderiza.
 *
 * Toda escrita é ler-tudo → alterar → gravar o array completo, de modo que
 * a primeira gravação já migra a semente para o Blob de forma transparente.
 */

const POSTS_KEY = "blog/posts.json";

function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromBlob(): Promise<Post[] | null> {
  const { blobs } = await list({ prefix: POSTS_KEY, limit: 1 });
  const found = blobs.find((b) => b.pathname === POSTS_KEY);
  if (!found) return null;
  // no-store + query única: garante o JSON recém-gravado, furando o cache
  // de borda do Blob (que tem TTL mínimo de 60s).
  const res = await fetch(`${found.url}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as Post[];
  return Array.isArray(data) ? data : null;
}

/**
 * Todos os posts, ordenados do mais recente para o mais antigo.
 * `cache()` deduplica a leitura dentro de um mesmo render.
 */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  let posts: Post[] = SEED_POSTS;
  if (blobEnabled()) {
    try {
      const fromBlob = await readFromBlob();
      if (fromBlob) posts = fromBlob;
    } catch (err) {
      console.error("Falha ao ler posts do Blob, usando semente:", err);
    }
  }
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
});

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

/**
 * Persiste o array completo no Blob. Lança erro claro se o Blob não estiver
 * configurado — as rotas do admin traduzem isso numa mensagem ao usuário.
 */
async function persist(posts: Post[]): Promise<void> {
  if (!blobEnabled()) {
    throw new Error(
      "Vercel Blob não configurado. Ative o Storage → Blob no painel do Vercel e defina BLOB_READ_WRITE_TOKEN."
    );
  }
  await put(POSTS_KEY, JSON.stringify(posts, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    // Mínimo permitido (60s); a leitura fura o cache com query única.
    cacheControlMaxAge: 60,
  });
}

/** Gera um slug único (acrescenta -2, -3… se já existir, ignorando `exceptSlug`). */
function uniqueSlug(base: string, posts: Post[], exceptSlug?: string): string {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 2;
  while (posts.some((p) => p.slug === candidate && p.slug !== exceptSlug)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

export type PostInput = Omit<Post, "slug"> & { slug?: string };

/** Cria um post novo e devolve o registro salvo (com slug definitivo). */
export async function createPost(input: PostInput): Promise<Post> {
  const posts = await getAllPosts();
  const slug = uniqueSlug(input.slug || input.title, posts);
  const post: Post = { ...input, slug, updatedAt: input.date };
  await persist([post, ...posts]);
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
  const posts = await getAllPosts();
  const idx = posts.findIndex((p) => p.slug === originalSlug);
  if (idx === -1) return null;
  const slug = uniqueSlug(input.slug || input.title, posts, originalSlug);
  const updated: Post = {
    ...posts[idx],
    ...input,
    slug,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  const next = [...posts];
  next[idx] = updated;
  await persist(next);
  return updated;
}

/** Remove o post. Devolve true se algo foi removido. */
export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getAllPosts();
  const next = posts.filter((p) => p.slug !== slug);
  if (next.length === posts.length) return false;
  await persist(next);
  return true;
}
