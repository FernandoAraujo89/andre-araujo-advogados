/**
 * Migração única do conteúdo que ficava no Vercel Blob para o Neon: posts,
 * equipe, landing pages e mensagens do formulário. Idempotente (upsert por
 * slug/id), então pode rodar de novo quando os stores do Blob voltarem.
 *
 *   npm run db:migrate            lê o Blob; se um store não responder, usa a
 *                                 semente de src/data/* e avisa no console
 *   npm run db:migrate -- --seed  ignora o Blob e grava só as sementes
 *
 * ATENÇÃO: o que vier do Blob SOBRESCREVE a linha de mesmo slug no banco. Se
 * o painel já tiver sido usado sobre o Neon, confira antes o que está em cada
 * lugar. Como o site lê o banco por um cache (tags "posts", "equipe" e
 * "landing"), depois de migrar com o site já no ar salve qualquer item no
 * painel ou publique de novo (`vercel --prod --force`) para ele atualizar.
 *
 * Tokens: BLOB_READ_WRITE_TOKEN (store público, onde estava blog/posts.json) e
 * CONTACT_BLOB_READ_WRITE_TOKEN (store privado do painel: equipe, landing pages
 * e mensagens). Sem o privado, esses três também são procurados no público.
 */
import { neon } from "@neondatabase/serverless";
import { get, list } from "@vercel/blob";
import { SEED_POSTS } from "../src/data/posts.ts";
import { team as SEED_TEAM } from "../src/data/team.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL não definida. Conecte o Neon ao projeto no Vercel e rode `vercel env pull .env.local`."
  );
  process.exit(1);
}
const sql = neon(url);
const seedOnly = process.argv.includes("--seed");

const publicStore = process.env.BLOB_READ_WRITE_TOKEN
  ? { token: process.env.BLOB_READ_WRITE_TOKEN, access: "public" }
  : null;
const painelStore = process.env.CONTACT_BLOB_READ_WRITE_TOKEN
  ? { token: process.env.CONTACT_BLOB_READ_WRITE_TOKEN, access: "private" }
  : publicStore;

/** Lê e desserializa um JSON do Blob. */
async function readJson(store, pathname) {
  const res = await get(pathname, { access: store.access, token: store.token });
  if (!res || !res.stream) return null;
  return JSON.parse(await new Response(res.stream).text());
}

/** A versão mais nova de um arquivo versionado (`prefixo-<n>.json`). */
async function readNewest(store, prefix) {
  const { blobs } = await list({ prefix, token: store.token, limit: 100 });
  if (blobs.length === 0) return null;
  const newest = [...blobs].sort((a, b) => (a.pathname < b.pathname ? 1 : -1))[0];
  return readJson(store, newest.pathname);
}

/**
 * Tenta ler do Blob; devolve { rows, source }. `source` diz de onde vieram os
 * dados ("Blob", "semente" ou "nada") para o resumo do fim.
 */
async function load(label, store, reader, seed) {
  if (!seedOnly && store) {
    try {
      const rows = await reader(store);
      if (Array.isArray(rows)) return { rows, source: "Blob" };
      console.warn(`${label}: nada encontrado no Blob.`);
    } catch (err) {
      console.warn(
        `${label}: não foi possível ler o Blob (${err instanceof Error ? err.message : err}).`
      );
    }
  }
  if (seed) return { rows: seed, source: "semente" };
  return { rows: [], source: "nada" };
}

const summary = [];

// 1. Posts — um único JSON no store público.
{
  const { rows, source } = await load(
    "Posts",
    publicStore,
    (store) => readJson(store, "blog/posts.json"),
    SEED_POSTS
  );
  for (const post of rows) {
    await sql.query(
      `insert into posts (slug, data) values ($1, $2::jsonb)
       on conflict (slug) do update set data = excluded.data, updated_at = now()`,
      [post.slug, JSON.stringify(post)]
    );
  }
  summary.push(["posts", rows.length, source]);
}

// 2. Equipe — JSON versionado no store do painel; a posição é a ordem do array.
{
  const { rows, source } = await load(
    "Equipe",
    painelStore,
    (store) => readNewest(store, "equipe/membros-"),
    SEED_TEAM
  );
  for (const [position, member] of rows.entries()) {
    await sql.query(
      `insert into team_members (slug, position, data) values ($1, $2, $3::jsonb)
       on conflict (slug) do update
         set position = excluded.position, data = excluded.data, updated_at = now()`,
      [member.slug, position, JSON.stringify(member)]
    );
  }
  summary.push(["team_members", rows.length, source]);
}

// 3. Landing pages — JSON versionado no store do painel; não têm semente.
{
  const { rows, source } = await load(
    "Landing pages",
    painelStore,
    (store) => readNewest(store, "landing/pages-"),
    null
  );
  for (const page of rows) {
    await sql.query(
      `insert into landing_pages (slug, data) values ($1, $2::jsonb)
       on conflict (slug) do update set data = excluded.data, updated_at = now()`,
      [page.slug, JSON.stringify(page)]
    );
  }
  summary.push(["landing_pages", rows.length, source]);
}

// 4. Mensagens — um arquivo por envio; nunca sobrescreve (a mensagem não muda).
{
  const { rows, source } = await load(
    "Mensagens",
    painelStore,
    async (store) => {
      const { blobs } = await list({
        prefix: "contato/mensagens/",
        token: store.token,
        limit: 1000,
      });
      const messages = [];
      for (const b of blobs) {
        const m = await readJson(store, b.pathname);
        if (m && m.id) messages.push(m);
      }
      return messages;
    },
    null
  );
  for (const message of rows) {
    await sql.query(
      `insert into contact_messages (id, data, created_at) values ($1, $2::jsonb, $3)
       on conflict (id) do nothing`,
      [message.id, JSON.stringify(message), message.receivedAt ?? new Date().toISOString()]
    );
  }
  summary.push(["contact_messages", rows.length, source]);
}

console.log("\nMigração concluída:");
for (const [table, count, source] of summary) {
  console.log(`  ${table.padEnd(18)} ${String(count).padStart(4)} registros  (origem: ${source})`);
}
if (summary.some(([, , source]) => source === "semente")) {
  console.log(
    "\nAlgum conteúdo veio da SEMENTE (o Blob não respondeu). Quando os stores voltarem, rode `npm run db:migrate` de novo para trazer o que foi editado pelo painel."
  );
}
