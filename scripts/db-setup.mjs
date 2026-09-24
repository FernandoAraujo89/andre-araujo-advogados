/**
 * Cria as tabelas do site no Neon a partir de scripts/schema.sql. Idempotente
 * (só `create ... if not exists`), então pode rodar quantas vezes precisar.
 *
 *   npm run db:setup
 *
 * Precisa de DATABASE_URL em .env.local — vem do `vercel env pull .env.local`
 * depois de conectar o Neon ao projeto no painel do Vercel.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL não definida. Conecte o Neon ao projeto no Vercel e rode `vercel env pull .env.local`."
  );
  process.exit(1);
}

const schema = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "schema.sql"),
  "utf8"
);

// O driver HTTP executa uma instrução por requisição: tira os comentários
// (que podem ter ";") e só então separa pelo ";" — o schema não tem ";"
// dentro de strings.
const statements = schema
  .replace(/--[^\n]*/g, "")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(url);
for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Schema aplicado no Neon: ${statements.length} instruções.`);
