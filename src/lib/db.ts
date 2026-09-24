import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * Conexão com o Neon (Postgres) pelo driver HTTP: cada query é uma requisição
 * `fetch`, sem conexão persistente, o que serve tanto às funções serverless
 * quanto ao build. `DATABASE_URL` é criada pelo Vercel ao conectar o Neon ao
 * projeto (Storage → Connect Project); localmente vem do `vercel env pull`.
 * Sem ela, as camadas de dados caem nas sementes de src/data/*.
 */
export const dbEnabled = () => Boolean(process.env.DATABASE_URL);
export const sql = () => neon(process.env.DATABASE_URL!);

/** Erro único para as escritas do painel sem banco configurado. */
export function requireDb() {
  if (!dbEnabled()) {
    throw new Error(
      "Banco de dados não configurado. No Vercel, conecte o Neon ao projeto (Storage → Connect Project) e, localmente, rode `vercel env pull .env.local`."
    );
  }
  return sql();
}

/** Serializa um objeto para uma coluna jsonb (`$n::jsonb`). */
export const json = (value: unknown) => JSON.stringify(value);
