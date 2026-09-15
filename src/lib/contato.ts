import "server-only";
import { put, list, get, del } from "@vercel/blob";
import { site } from "@/data/site";

/**
 * Mensagens do formulário de contato.
 *
 * Cada mensagem vira um JSON no Vercel Blob (`contato/mensagens/`), um
 * arquivo por envio, para dois envios simultâneos nunca se sobrescreverem.
 * O painel /admin lista e exclui as mensagens. Se houver RESEND_API_KEY, o
 * escritório também é avisado por e-mail a cada mensagem (ver notifyByEmail).
 *
 * Onde ficam: com CONTACT_BLOB_TOKEN (um store PRIVADO só para as mensagens)
 * os arquivos são privados, o ideal para dados pessoais. Sem ele, vão para o
 * store principal (público, o mesmo do blog), com sufixo aleatório na URL:
 * ninguém lista nem adivinha o endereço sem o token, e o site nunca o exibe.
 */

export type ContactInput = {
  nome: string;
  celular: string;
  email?: string;
  assunto: string;
  mensagem: string;
};

export type ContactMessage = ContactInput & {
  id: string;
  /** ISO 8601 */
  receivedAt: string;
};

const PREFIX = "contato/mensagens/";

type Storage = { token: string; access: "public" | "private" };

function storage(): Storage | null {
  if (process.env.CONTACT_BLOB_TOKEN) {
    return { token: process.env.CONTACT_BLOB_TOKEN, access: "private" };
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN, access: "public" };
  }
  return null;
}

/** True quando há onde guardar as mensagens. */
export function storageEnabled(): boolean {
  return storage() !== null;
}

/** True quando as mensagens ficam num store privado (CONTACT_BLOB_TOKEN). */
export function storageIsPrivate(): boolean {
  return storage()?.access === "private";
}

/** Valida e normaliza o corpo enviado pelo formulário. Devolve erro legível. */
export function parseContactInput(
  raw: unknown
): { ok: true; value: ContactInput } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Dados inválidos." };
  }
  const b = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const nome = str(b.nome, 120);
  const celular = str(b.celular, 30);
  const email = str(b.email, 120);
  const assunto = str(b.assunto, 80);
  const mensagem = str(b.mensagem, 3000);

  if (nome.length < 3) return { ok: false, error: "Informe seu nome completo." };
  if (celular.replace(/\D/g, "").length < 10)
    return { ok: false, error: "Informe um celular válido com DDD." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Informe um e-mail válido ou deixe em branco." };
  if (!assunto) return { ok: false, error: "Escolha o assunto do seu contato." };
  if (mensagem.length < 10)
    return { ok: false, error: "Conte um pouco mais sobre o que você precisa." };

  return {
    ok: true,
    value: { nome, celular, email: email || undefined, assunto, mensagem },
  };
}

export type SaveResult =
  | { status: "saved"; message: ContactMessage }
  | { status: "skipped" }
  | { status: "failed" };

/** Grava a mensagem no Blob. "skipped" quando não há store configurado. */
export async function saveMessage(input: ContactInput): Promise<SaveResult> {
  const store = storage();
  if (!store) return { status: "skipped" };
  const receivedAt = new Date().toISOString();
  // O id começa pela data/hora para a listagem ordenar pelo nome do arquivo.
  const id = `${receivedAt.replace(/\D/g, "").slice(0, 14)}-${crypto
    .randomUUID()
    .slice(0, 8)}`;
  const message: ContactMessage = { id, receivedAt, ...input };
  try {
    await put(`${PREFIX}${id}.json`, JSON.stringify(message, null, 2), {
      access: store.access,
      token: store.token,
      contentType: "application/json",
      // No store público, o sufixo aleatório é o que torna a URL imprevisível.
      addRandomSuffix: store.access === "public",
    });
    return { status: "saved", message };
  } catch (err) {
    console.error("Falha ao gravar mensagem de contato no Blob:", err);
    return { status: "failed" };
  }
}

/** Todas as mensagens, da mais recente para a mais antiga (até `limit`). */
export async function listMessages(limit = 200): Promise<ContactMessage[]> {
  const store = storage();
  if (!store) return [];
  const { blobs } = await list({ prefix: PREFIX, limit, token: store.token });
  const newestFirst = [...blobs].sort((a, b) =>
    a.pathname < b.pathname ? 1 : -1
  );
  const messages = await Promise.all(
    newestFirst.map(async (b) => {
      try {
        const res = await get(b.pathname, {
          access: store.access,
          token: store.token,
        });
        if (!res) return null;
        const text = await new Response(res.stream).text();
        return JSON.parse(text) as ContactMessage;
      } catch (err) {
        console.error(`Falha ao ler ${b.pathname}:`, err);
        return null;
      }
    })
  );
  return messages.filter((m): m is ContactMessage => m !== null);
}

/** Exclui a mensagem. Devolve true se algo foi removido. */
export async function deleteMessage(id: string): Promise<boolean> {
  const store = storage();
  if (!store || !/^[0-9]{14}-[0-9a-f]{8}$/.test(id)) return false;
  const { blobs } = await list({
    prefix: `${PREFIX}${id}`,
    limit: 1,
    token: store.token,
  });
  const found = blobs.find((b) => b.pathname.startsWith(`${PREFIX}${id}`));
  if (!found) return false;
  await del(found.url, { token: store.token });
  return true;
}

/** True quando o aviso por e-mail está ativo (RESEND_API_KEY definida). */
export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Avisa o escritório por e-mail via API do Resend (sem SDK: um POST simples).
 * Remetente e destinatário vêm de CONTACT_EMAIL_FROM / CONTACT_EMAIL_TO; o
 * domínio do remetente precisa estar verificado no Resend. "skipped" quando
 * não há chave.
 */
export async function notifyByEmail(
  input: ContactInput
): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped";
  const to = process.env.CONTACT_EMAIL_TO || site.email;
  const from =
    process.env.CONTACT_EMAIL_FROM ||
    `${site.name} <site@andrearaujoadvogados.com.br>`;

  const linhas = [
    `Nome: ${input.nome}`,
    `Celular: ${input.celular}`,
    `E-mail: ${input.email || "(não informado)"}`,
    `Assunto: ${input.assunto}`,
    "",
    input.mensagem,
  ];
  const html = `<p><strong>Nome:</strong> ${escapeHtml(input.nome)}<br>
<strong>Celular:</strong> ${escapeHtml(input.celular)}<br>
<strong>E-mail:</strong> ${escapeHtml(input.email || "(não informado)")}<br>
<strong>Assunto:</strong> ${escapeHtml(input.assunto)}</p>
<p style="white-space:pre-wrap">${escapeHtml(input.mensagem)}</p>
<p style="color:#666">Mensagem enviada pelo formulário do site. As mensagens também ficam no painel: ${site.url}/admin/mensagens</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(input.email ? { reply_to: input.email } : {}),
        subject: `Contato pelo site: ${input.assunto} (${input.nome})`,
        text: linhas.join("\n"),
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend respondeu", res.status, await res.text());
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("Falha ao enviar e-mail pelo Resend:", err);
    return "failed";
  }
}
