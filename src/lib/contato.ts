import "server-only";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { site } from "@/data/site";
import { dbEnabled, json, sql } from "@/lib/db";

/**
 * Mensagens do formulário de contato.
 *
 * Cada mensagem vira uma linha na tabela `contact_messages` do Neon (o objeto
 * inteiro em `data`, jsonb). O painel /admin lista e exclui as mensagens. Com
 * o e-mail configurado (SES ou Resend, ver notifyByEmail), o escritório também
 * é avisado a cada mensagem, e basta um dos dois dar certo para o visitante
 * ver "Mensagem enviada" (ver src/app/api/contato/route.ts).
 */

export type ContactInput = {
  nome: string;
  celular: string;
  email?: string;
  assunto: string;
  mensagem: string;
  /** Slug da landing page de origem, quando o envio veio de uma campanha */
  origem?: string;
};

export type ContactMessage = ContactInput & {
  id: string;
  /** ISO 8601 */
  receivedAt: string;
};

/** True quando há onde guardar as mensagens. */
export function storageEnabled(): boolean {
  return dbEnabled();
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
  const origem = str(b.origem, 80);

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
    value: {
      nome,
      celular,
      email: email || undefined,
      assunto,
      mensagem,
      origem: origem || undefined,
    },
  };
}

export type SaveResult =
  | { status: "saved"; message: ContactMessage }
  | { status: "skipped" }
  | { status: "failed" };

/** Grava a mensagem no banco. "skipped" quando não há banco configurado. */
export async function saveMessage(input: ContactInput): Promise<SaveResult> {
  if (!dbEnabled()) return { status: "skipped" };
  const receivedAt = new Date().toISOString();
  // O id começa pela data/hora: legível e único mesmo em envios simultâneos.
  const id = `${receivedAt.replace(/\D/g, "").slice(0, 14)}-${crypto
    .randomUUID()
    .slice(0, 8)}`;
  const message: ContactMessage = { id, receivedAt, ...input };
  try {
    await sql().query(
      "insert into contact_messages (id, data, created_at) values ($1, $2::jsonb, $3)",
      [id, json(message), receivedAt]
    );
    return { status: "saved", message };
  } catch (err) {
    console.error("Falha ao gravar mensagem de contato no banco:", err);
    return { status: "failed" };
  }
}

/** Todas as mensagens, da mais recente para a mais antiga (até `limit`). */
export async function listMessages(limit = 200): Promise<ContactMessage[]> {
  if (!dbEnabled()) return [];
  const rows = (await sql().query(
    "select data from contact_messages order by created_at desc limit $1",
    [limit]
  )) as { data: ContactMessage }[];
  return rows.map((r) => r.data);
}

/** Exclui a mensagem. Devolve true se algo foi removido. */
export async function deleteMessage(id: string): Promise<boolean> {
  if (!dbEnabled() || !/^[0-9]{14}-[0-9a-f]{8}$/.test(id)) return false;
  const rows = await sql().query(
    "delete from contact_messages where id = $1 returning id",
    [id]
  );
  return rows.length > 0;
}

/*
 * ---------------------------------------------------------------------------
 * Aviso por e-mail
 *
 * Provedor escolhido pelas variáveis de ambiente, nesta ordem:
 *  1. Amazon SES  — SES_ROLE_ARN (OIDC do Vercel, sem chave fixa) ou
 *                   SES_ACCESS_KEY_ID + SES_SECRET_ACCESS_KEY; região em
 *                   SES_REGION (padrão us-east-2, onde a identidade
 *                   mail.andrearaujoadvogados.com.br está verificada).
 *  2. Resend      — RESEND_API_KEY.
 * Sem nenhum, o aviso é pulado e a mensagem fica só no painel.
 * ---------------------------------------------------------------------------
 */

type SesConfig = {
  region: string;
  credentials: NonNullable<ConstructorParameters<typeof SESv2Client>[0]>["credentials"];
};

function sesConfig(): SesConfig | null {
  const region = process.env.SES_REGION || "us-east-2";
  if (process.env.SES_ROLE_ARN) {
    return {
      region,
      credentials: awsCredentialsProvider({
        roleArn: process.env.SES_ROLE_ARN,
        roleSessionName: "site-contato",
      }),
    };
  }
  if (process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY) {
    return {
      region,
      credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      },
    };
  }
  return null;
}

/** Qual provedor de e-mail está configurado, se algum. */
export function emailProvider(): "ses" | "resend" | null {
  if (sesConfig()) return "ses";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

/** True quando o aviso por e-mail está ativo. */
export function emailEnabled(): boolean {
  return emailProvider() !== null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Conteúdo do aviso, igual para os dois provedores. */
function buildEmail(input: ContactInput, from: string) {
  const to = process.env.CONTACT_EMAIL_TO || site.email;
  const text = [
    `Nome: ${input.nome}`,
    `Celular: ${input.celular}`,
    `E-mail: ${input.email || "(não informado)"}`,
    `Assunto: ${input.assunto}`,
    ...(input.origem ? [`Origem: página ${input.origem}`] : []),
    "",
    input.mensagem,
  ].join("\n");
  const html = `<p><strong>Nome:</strong> ${escapeHtml(input.nome)}<br>
<strong>Celular:</strong> ${escapeHtml(input.celular)}<br>
<strong>E-mail:</strong> ${escapeHtml(input.email || "(não informado)")}<br>
<strong>Assunto:</strong> ${escapeHtml(input.assunto)}${input.origem ? `<br>
<strong>Origem:</strong> página ${escapeHtml(input.origem)}` : ""}</p>
<p style="white-space:pre-wrap">${escapeHtml(input.mensagem)}</p>
<p style="color:#666">Mensagem enviada pelo formulário do site. As mensagens também ficam no painel: ${site.url}/admin/mensagens</p>`;
  return {
    from,
    to,
    replyTo: input.email,
    subject: `Contato pelo site: ${input.assunto} (${input.nome})`,
    text,
    html,
  };
}

let sesClient: SESv2Client | undefined;

/**
 * Amazon SES v2. Sem ConfigurationSet de propósito: o do sistema de campanhas
 * rastreia aberturas e cliques e reescreve links, e este aviso é transacional.
 */
async function sendViaSes(input: ContactInput, cfg: SesConfig): Promise<void> {
  sesClient ??= new SESv2Client({
    region: cfg.region,
    credentials: cfg.credentials,
  });
  const m = buildEmail(
    input,
    process.env.CONTACT_EMAIL_FROM ||
      `${site.name} <site@mail.andrearaujoadvogados.com.br>`
  );
  await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: m.from,
      Destination: { ToAddresses: [m.to] },
      ...(m.replyTo ? { ReplyToAddresses: [m.replyTo] } : {}),
      Content: {
        Simple: {
          Subject: { Data: m.subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: m.text, Charset: "UTF-8" },
            Html: { Data: m.html, Charset: "UTF-8" },
          },
        },
      },
    })
  );
}

/** Resend, pela API HTTP (sem SDK). O domínio do remetente precisa estar verificado lá. */
async function sendViaResend(input: ContactInput, key: string): Promise<void> {
  const m = buildEmail(
    input,
    process.env.CONTACT_EMAIL_FROM ||
      `${site.name} <site@andrearaujoadvogados.com.br>`
  );
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: m.from,
      to: [m.to],
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
      subject: m.subject,
      text: m.text,
      html: m.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend respondeu ${res.status}: ${await res.text()}`);
  }
}

/** Avisa o escritório por e-mail. "skipped" quando nenhum provedor está configurado. */
export async function notifyByEmail(
  input: ContactInput
): Promise<"sent" | "skipped" | "failed"> {
  const ses = sesConfig();
  const resendKey = process.env.RESEND_API_KEY;
  if (!ses && !resendKey) return "skipped";
  try {
    if (ses) await sendViaSes(input, ses);
    else await sendViaResend(input, resendKey!);
    return "sent";
  } catch (err) {
    const name = err instanceof Error ? err.name : "Erro";
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`Falha ao enviar o aviso por e-mail (${ses ? "SES" : "Resend"}): ${name}: ${detail}`);
    return "failed";
  }
}
