import { NextResponse } from "next/server";
import { site } from "@/data/site";
import { isAdmin } from "@/lib/admin-guard";
import { buildLeadPayload, isWebhookUrl, postLeadWebhook } from "@/lib/lead-webhook";

/**
 * Botão "Enviar teste" do campo Webhook no editor de landing pages: manda ao
 * endereço um lead de exemplo, com `teste: true`, para o Make aprender a
 * estrutura dos dados sem precisar de um envio real pelo site (que geraria
 * mensagem no painel, e-mail e conversão no Google Ads).
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    url?: unknown;
    slug?: unknown;
    name?: unknown;
  } | null;
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!isWebhookUrl(url)) {
    return NextResponse.json(
      { error: "Informe um endereço que comece com https://." },
      { status: 400 }
    );
  }
  const slug = typeof body?.slug === "string" && body.slug ? body.slug.slice(0, 80) : "pagina";
  const name = typeof body?.name === "string" && body.name ? body.name.slice(0, 80) : "Teste";

  const payload = buildLeadPayload(
    {
      nome: "Teste do site",
      celular: "(37) 99999-9999",
      email: "teste@exemplo.com.br",
      assunto: name,
      mensagem: "Envio de teste pelo painel do site. Pode ignorar.",
      origem: slug,
    },
    `${site.url}/areas-de-atuacao/${slug}?utm_source=google&utm_medium=cpc&utm_campaign=teste&gclid=teste`,
    { teste: true }
  );
  const result = await postLeadWebhook(url, payload);
  return NextResponse.json(result);
}
