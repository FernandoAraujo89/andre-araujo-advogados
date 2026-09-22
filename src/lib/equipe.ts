import "server-only";
import { cache } from "react";
import { put, get, list, del } from "@vercel/blob";
import { slugify } from "@/data/posts";
import {
  founderOf,
  team as SEED_TEAM,
  type TeamMember,
  type TeamMemberInput,
} from "@/data/team";

/**
 * Camada de dados da equipe: um único JSON no Vercel Blob com todos os
 * integrantes, na ordem em que devem aparecer no site. Mesmo desenho das
 * landing pages (src/lib/landing.ts):
 *
 * 1. O arquivo nunca é sobrescrito — cada gravação cria `equipe/membros-<n>.json`
 *    com número crescente e apaga as versões anteriores; a leitura pega a mais
 *    nova. Sobrescrever o mesmo caminho faz a leitura devolver a versão
 *    anterior por segundos, e "salvar" não refletiria na hora.
 * 2. Fica no store PRIVADO do painel quando existe (CONTACT_BLOB_READ_WRITE_TOKEN);
 *    só as fotos são públicas.
 *
 * Enquanto ninguém salvar nada no painel, vale a semente de src/data/team.ts.
 * A primeira gravação persiste a lista inteira (semente + alteração), então a
 * semente nunca se perde no meio do caminho.
 *
 * A ORDEM DO ARRAY É A ORDEM DO SITE. A página pública agrupa por setor
 * preservando essa ordem (ver groupBySetor em src/data/team.ts).
 */

const PREFIX = "equipe/membros-";

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

/** True quando há onde guardar as alterações da equipe. */
export function teamStorageEnabled(): boolean {
  return storage() !== null;
}

async function readFromBlob(store: Store): Promise<TeamMember[] | null> {
  const { blobs } = await list({ prefix: PREFIX, token: store.token, limit: 100 });
  if (blobs.length === 0) return null;
  const newest = [...blobs].sort((a, b) => (a.pathname < b.pathname ? 1 : -1))[0];
  const res = await get(newest.pathname, { access: store.access, token: store.token });
  if (!res) return null;
  const data = JSON.parse(await new Response(res.stream).text()) as TeamMember[];
  return Array.isArray(data) ? data : [];
}

/** A equipe inteira, na ordem de exibição. Cai na semente se o Blob não responder. */
export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const store = storage();
  if (!store) return SEED_TEAM;
  try {
    return (await readFromBlob(store)) ?? SEED_TEAM;
  } catch (err) {
    console.error("Falha ao ler a equipe do Blob, usando semente:", err);
    return SEED_TEAM;
  }
});

export async function getTeamMember(slug: string): Promise<TeamMember | undefined> {
  return (await getTeam()).find((m) => m.slug === slug);
}

/** O sócio fundador — a home e o bloco "sobre" das landing pages usam a foto
 *  e o nome dele. */
export async function getFounder(): Promise<TeamMember> {
  return founderOf(await getTeam());
}

/** Integrante com página própria em /equipe/[slug]. */
export async function getTeamProfile(slug: string): Promise<TeamMember | undefined> {
  const member = await getTeamMember(slug);
  return member?.hasProfile ? member : undefined;
}

async function persist(members: TeamMember[]): Promise<void> {
  const store = storage();
  if (!store) {
    throw new Error(
      "Vercel Blob não configurado. Ative o Storage → Blob no painel do Vercel e defina BLOB_READ_WRITE_TOKEN."
    );
  }
  const pathname = `${PREFIX}${String(Date.now()).padStart(14, "0")}.json`;
  await put(pathname, JSON.stringify(members, null, 2), {
    access: store.access,
    token: store.token,
    contentType: "application/json",
    addRandomSuffix: false,
  });
  try {
    const { blobs } = await list({ prefix: PREFIX, token: store.token, limit: 100 });
    const old = blobs.filter((b) => b.pathname !== pathname);
    if (old.length > 0) await del(old.map((b) => b.url), { token: store.token });
  } catch (err) {
    console.error("Falha ao apagar versões antigas da equipe:", err);
  }
}

/** Gera um slug único (acrescenta -2, -3… se já existir, ignorando `exceptSlug`). */
function uniqueSlug(base: string, members: TeamMember[], exceptSlug?: string): string {
  const root = slugify(base) || "integrante";
  let candidate = root;
  let n = 2;
  while (members.some((m) => m.slug === candidate && m.slug !== exceptSlug)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

/** Cria um integrante no fim da lista e devolve o registro salvo. */
export async function createTeamMember(input: TeamMemberInput): Promise<TeamMember> {
  const members = await getTeam();
  const slug = uniqueSlug(input.slug || input.name, members);
  const member: TeamMember = { ...input, slug };
  await persist([...members, member]);
  return member;
}

/** Atualiza o integrante `originalSlug` (o slug pode mudar). Null se não existir. */
export async function updateTeamMember(
  originalSlug: string,
  input: TeamMemberInput
): Promise<TeamMember | null> {
  const members = await getTeam();
  const idx = members.findIndex((m) => m.slug === originalSlug);
  if (idx === -1) return null;
  const slug = uniqueSlug(input.slug || input.name, members, originalSlug);
  const next = [...members];
  next[idx] = { ...input, slug };
  await persist(next);
  return next[idx];
}

/** Remove o integrante. True se algo foi removido. */
export async function deleteTeamMember(slug: string): Promise<boolean> {
  const members = await getTeam();
  const next = members.filter((m) => m.slug !== slug);
  if (next.length === members.length) return false;
  await persist(next);
  return true;
}

/**
 * Reordena a equipe pela sequência de slugs recebida. Quem não estiver na
 * sequência (criado em outra aba, por exemplo) fica no fim, preservado — a
 * reordenação nunca apaga ninguém.
 */
export async function reorderTeam(slugs: string[]): Promise<TeamMember[]> {
  const members = await getTeam();
  const byslug = new Map(members.map((m) => [m.slug, m]));
  const ordered: TeamMember[] = [];
  for (const slug of slugs) {
    const m = byslug.get(slug);
    if (m) {
      ordered.push(m);
      byslug.delete(slug);
    }
  }
  const next = [...ordered, ...byslug.values()];
  await persist(next);
  return next;
}
