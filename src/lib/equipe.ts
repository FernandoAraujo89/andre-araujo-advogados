import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { slugify } from "@/data/posts";
import {
  founderOf,
  team as SEED_TEAM,
  type TeamMember,
  type TeamMemberInput,
} from "@/data/team";
import { dbEnabled, json, requireDb, sql } from "@/lib/db";

/**
 * Camada de dados da equipe: a tabela `team_members` no Neon, uma linha por
 * integrante com o objeto inteiro em `data` (jsonb) e a ordem de exibição em
 * `position`. Mesmo desenho do blog (src/lib/blog.ts).
 *
 * Enquanto ninguém salvar nada no painel, vale a semente de src/data/team.ts.
 * A primeira gravação persiste a semente inteira antes da alteração, então a
 * semente nunca se perde no meio do caminho.
 *
 * A POSIÇÃO É A ORDEM DO SITE. A página pública agrupa por setor preservando
 * essa ordem (ver groupBySetor em src/data/team.ts).
 */

export const EQUIPE_TAG = "equipe";

type Row = { data: TeamMember };
type Db = ReturnType<typeof sql>;

/** True quando há onde guardar as alterações da equipe. */
export function teamStorageEnabled(): boolean {
  return dbEnabled();
}

async function readAll(db: Db): Promise<TeamMember[]> {
  const rows = (await db.query(
    "select data from team_members order by position, slug"
  )) as Row[];
  return rows.map((r) => r.data);
}

/** A equipe do banco, em cache até o painel salvar (ou por 1 dia). */
const readAllCached = unstable_cache(() => readAll(sql()), ["equipe-all"], {
  tags: [EQUIPE_TAG],
  revalidate: 86400,
});

/** A equipe inteira, na ordem de exibição. Cai na semente se o banco não responder. */
export const getTeam = cache(async (): Promise<TeamMember[]> => {
  if (!dbEnabled()) return SEED_TEAM;
  try {
    const fromDb = await readAllCached();
    return fromDb.length > 0 ? fromDb : SEED_TEAM;
  } catch (err) {
    console.error("Falha ao ler a equipe do banco, usando semente:", err);
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

/** Na primeira escrita com a tabela vazia, grava a semente (na ordem dela). */
async function ensureSeeded(db: Db): Promise<void> {
  const [{ n }] = (await db.query(
    "select count(*)::int as n from team_members"
  )) as { n: number }[];
  if (n > 0 || SEED_TEAM.length === 0) return;
  await db.transaction((txn) =>
    SEED_TEAM.map((m, position) =>
      txn.query(
        "insert into team_members (slug, position, data) values ($1, $2, $3::jsonb) on conflict (slug) do nothing",
        [m.slug, position, json(m)]
      )
    )
  );
}

/** Gera um slug único (acrescenta -2, -3… se já existir, ignorando `exceptSlug`). */
function uniqueSlug(base: string, taken: string[], exceptSlug?: string): string {
  const root = slugify(base) || "integrante";
  let candidate = root;
  let n = 2;
  while (taken.some((s) => s === candidate && s !== exceptSlug)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

/** Cria um integrante no fim da lista e devolve o registro salvo. */
export async function createTeamMember(input: TeamMemberInput): Promise<TeamMember> {
  const db = requireDb();
  await ensureSeeded(db);
  const members = await readAll(db);
  const slug = uniqueSlug(
    input.slug || input.name,
    members.map((m) => m.slug)
  );
  const member: TeamMember = { ...input, slug };
  await db.query(
    "insert into team_members (slug, position, data) values ($1, (select coalesce(max(position), -1) + 1 from team_members), $2::jsonb)",
    [slug, json(member)]
  );
  return member;
}

/** Atualiza o integrante `originalSlug` (o slug pode mudar). Null se não existir. */
export async function updateTeamMember(
  originalSlug: string,
  input: TeamMemberInput
): Promise<TeamMember | null> {
  const db = requireDb();
  await ensureSeeded(db);
  const members = await readAll(db);
  if (!members.some((m) => m.slug === originalSlug)) return null;
  const slug = uniqueSlug(
    input.slug || input.name,
    members.map((m) => m.slug),
    originalSlug
  );
  const member: TeamMember = { ...input, slug };
  await db.query(
    "update team_members set slug = $2, data = $3::jsonb, updated_at = now() where slug = $1",
    [originalSlug, slug, json(member)]
  );
  return member;
}

/** Remove o integrante. True se algo foi removido. */
export async function deleteTeamMember(slug: string): Promise<boolean> {
  const db = requireDb();
  await ensureSeeded(db);
  const rows = await db.query(
    "delete from team_members where slug = $1 returning slug",
    [slug]
  );
  return rows.length > 0;
}

/**
 * Reordena a equipe pela sequência de slugs recebida. Quem não estiver na
 * sequência (criado em outra aba, por exemplo) fica no fim, preservado — a
 * reordenação nunca apaga ninguém.
 */
export async function reorderTeam(slugs: string[]): Promise<TeamMember[]> {
  const db = requireDb();
  await ensureSeeded(db);
  const members = await readAll(db);
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
  if (next.length > 0) {
    await db.transaction((txn) =>
      next.map((m, position) =>
        txn.query(
          "update team_members set position = $2, updated_at = now() where slug = $1",
          [m.slug, position]
        )
      )
    );
  }
  return next;
}
