import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkPassword,
  createSessionToken,
  isSessionConfigured,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Sem as duas variáveis o painel fica fechado; a mensagem diz qual falta.
  const missing = [
    !process.env.ADMIN_PASSWORD && "ADMIN_PASSWORD",
    !isSessionConfigured() && "ADMIN_SESSION_SECRET",
  ].filter(Boolean);
  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Painel não configurado: defina ${missing.join(" e ")} nas variáveis de ambiente.`,
      },
      { status: 500 }
    );
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}
