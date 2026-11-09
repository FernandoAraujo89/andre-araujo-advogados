import "server-only";
import type { ContactInput } from "@/lib/contato";
import { getLandingPage } from "@/lib/landing";

/**
 * Webhook dos leads das landing pages (pedido do gestor de tráfego,
 * 09/11/2026): cada envio do formulário de uma landing page vai também para o
 * endereço configurado no editor da página (campo "Webhook", no painel
 * "Página"), por exemplo um cenário do Make.
 *
 * O endereço fica só no banco e no servidor: o repositório é público e a
 * página pública não recebe esse campo. Quem tivesse o endereço poderia
 * mandar leads falsos para o cenário.
 *
 * O corpo é um JSON plano, sempre com as mesmas chaves (vazias quando não há
 * valor), para o Make montar a estrutura de dados uma vez só.
 */

/** Parâmetros de rastreio lidos da URL da página em que o lead foi enviado. */
const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

const TIMEOUT_MS = 5000;

export type LeadPayload = {
  pagina: string;
  nome: string;
  celular: string;
  celular_internacional: string;
  email: string;
  assunto: string;
  mensagem: string;
  url: string;
  recebido_em: string;
  teste: boolean;
} & Record<(typeof TRACKING_KEYS)[number], string>;

/** True para um endereço https válido. */
export function isWebhookUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** URL http(s) da página, ou null quando o valor não é uma URL. */
function pageUrl(raw: unknown): URL | null {
  if (typeof raw !== "string" || raw.length > 2000) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** +55DDNNNNNNNNN, o formato que CRMs e o WhatsApp esperam. */
function internationalPhone(celular: string): string {
  const digits = celular.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return `+${digits}`;
  return "";
}

export function buildLeadPayload(
  input: ContactInput,
  rawPageUrl: unknown,
  options: { teste?: boolean } = {}
): LeadPayload {
  const url = pageUrl(rawPageUrl);
  const tracking = Object.fromEntries(
    TRACKING_KEYS.map((key) => [key, url?.searchParams.get(key)?.slice(0, 300) ?? ""])
  ) as Record<(typeof TRACKING_KEYS)[number], string>;
  return {
    pagina: input.origem ?? "",
    nome: input.nome,
    celular: input.celular,
    celular_internacional: internationalPhone(input.celular),
    email: input.email ?? "",
    assunto: input.assunto,
    mensagem: input.mensagem,
    url: url ? `${url.origin}${url.pathname}${url.search}` : "",
    ...tracking,
    recebido_em: new Date().toISOString(),
    teste: options.teste === true,
  };
}

/** POST do JSON, com tempo máximo de 5 s. Devolve o status HTTP (0 sem resposta). */
export async function postLeadWebhook(
  url: string,
  payload: LeadPayload
): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

/**
 * Manda o lead ao webhook da landing page de origem, se ela estiver publicada
 * e tiver um configurado. Erros não interrompem o envio do formulário; o log
 * registra só a página e o status, sem dados do visitante.
 */
export async function sendLeadToWebhook(
  input: ContactInput,
  rawPageUrl: unknown
): Promise<"sent" | "skipped" | "failed"> {
  if (!input.origem) return "skipped";
  try {
    const page = await getLandingPage(input.origem);
    const url = page?.status === "publicada" ? page.leadWebhook?.trim() : "";
    if (!url || !isWebhookUrl(url)) return "skipped";
    const result = await postLeadWebhook(url, buildLeadPayload(input, rawPageUrl));
    if (result.ok) return "sent";
    console.error(`Webhook do lead falhou (página ${input.origem}, status ${result.status}).`);
    return "failed";
  } catch (err) {
    console.error(`Webhook do lead falhou (página ${input.origem}):`, err);
    return "failed";
  }
}
