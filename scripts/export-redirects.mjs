/**
 * Gera os arquivos de exemplo em redirects/ a partir de src/lib/redirects.ts
 * (fonte única do mapa). Rode `npm run redirects:export` sempre que alterar
 * o mapa; os arquivos gerados não devem ser editados à mão.
 *
 * - redirects/_redirects  → Netlify / Cloudflare Pages (caminhos decodificados,
 *                           curinga `:path*` vira `*`)
 * - redirects/vercel.json → Vercel com export estático (caminhos codificados,
 *                           mesma sintaxe de curinga do Next)
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { legacyRedirects } from "../src/lib/redirects.ts";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "redirects");

// Netlify: colunas alinhadas para leitura; `:path*` (Next) vira `*` (splat).
const toNetlify = (source) => source.replace(/:\w+\*$/, "*");
const sourceWidth =
  Math.max(...legacyRedirects.map((r) => toNetlify(r.source).length)) + 2;
const destWidth = Math.max(...legacyRedirects.map((r) => r.destination.length)) + 2;

const netlify = [
  "# Redirects 301 — formato Netlify / Cloudflare Pages.",
  "# GERADO por scripts/export-redirects.mjs a partir de src/lib/redirects.ts;",
  "# não edite à mão — altere o mapa e rode `npm run redirects:export`.",
  "# Para usar: copie este arquivo para a pasta publicada (out/ no export",
  "# estático, ou configure como asset em public/). Instruções no README.",
  "# URLs de origem mantidas exatamente como no site antigo (Wix),",
  "# inclusive acentos (o host compara o caminho já decodificado).",
  "",
  ...legacyRedirects.map(
    ({ source, destination }) =>
      `${toNetlify(source).padEnd(sourceWidth)}${destination.padEnd(destWidth)}301`
  ),
  "",
].join("\n");

const vercel = [
  "{",
  '  "_comment": "GERADO por scripts/export-redirects.mjs a partir de src/lib/redirects.ts (rode `npm run redirects:export`). Exemplo para Vercel; em geral DESNECESSÁRIO: os redirects já estão em next.config.ts e a Vercel os aplica no build. Use este arquivo apenas se optar por export estático (output: \'export\') servido pela Vercel — copie-o para a raiz do projeto como vercel.json.",',
  '  "redirects": [',
  legacyRedirects
    .map(
      ({ source, destination }) =>
        `    { "source": ${JSON.stringify(encodeURI(source))}, "destination": ${JSON.stringify(destination)}, "permanent": true }`
    )
    .join(",\n"),
  "  ]",
  "}",
  "",
].join("\n");

writeFileSync(join(outDir, "_redirects"), netlify);
writeFileSync(join(outDir, "vercel.json"), vercel);
console.log(`redirects/_redirects e redirects/vercel.json gerados (${legacyRedirects.length} regras).`);
