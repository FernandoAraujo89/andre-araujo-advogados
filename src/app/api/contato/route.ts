import { NextResponse } from "next/server";
import {
  parseContactInput,
  saveMessage,
  notifyByEmail,
} from "@/lib/contato";

/**
 * Recebe o formulário de contato (público). Grava no banco e avisa por e-mail;
 * basta um dos dois dar certo para o visitante ver "Mensagem enviada".
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Anti-spam sem CAPTCHA: o campo oculto "site" só é preenchido por robôs,
  // e ninguém preenche o formulário em menos de 3 segundos. Nos dois casos a
  // resposta finge sucesso, para o robô não aprender a contornar.
  if (typeof body.site === "string" && body.site.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  const elapsed = Number(body.elapsed);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 3000) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseContactInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const saved = await saveMessage(parsed.value);
  const emailed = await notifyByEmail(parsed.value);

  if (saved.status === "saved" || emailed === "sent") {
    return NextResponse.json({ ok: true });
  }
  if (saved.status === "skipped" && emailed === "skipped") {
    // Ambiente local sem banco nem e-mail: registra no console para o
    // formulário continuar testável.
    console.info("Contato recebido (sem banco/e-mail configurados):", parsed.value);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json(
    { error: "Não foi possível registrar sua mensagem agora." },
    { status: 500 }
  );
}
