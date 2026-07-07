/**
 * Autenticação do painel /admin — sessão em cookie assinado (stateless).
 *
 * Implementado só com Web Crypto (HMAC-SHA256) para funcionar tanto no
 * runtime Node (rotas de API) quanto no Edge (proxy.ts). Não há banco de
 * usuários: uma única senha (ADMIN_PASSWORD) protege o painel do escritório.
 */

export const SESSION_COOKIE = "aa_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    // Fallback só para dev local; em produção defina a variável.
    "dev-secret-troque-em-producao"
  );
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return toBase64Url(sig);
}

/** Comparação de tempo constante para evitar timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Confere a senha do painel (comparação de tempo constante). */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** Cria o valor do cookie: `<expiraEm>.<assinatura>`. */
export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(exp);
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Verifica assinatura e validade do token do cookie. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expectedSig = await hmac(payload);
  return safeEqual(sig, expectedSig);
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
