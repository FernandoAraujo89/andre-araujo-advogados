import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Proxy (antigo "middleware") — barreira de autenticação do painel.
 *
 * Faz a checagem otimista lendo só o cookie (sem I/O), como recomenda o Next.
 * A verificação definitiva também é feita em cada rota/página do admin
 * (defesa em profundidade). O /admin não é linkado em nenhum lugar do site.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // O login precisa ser público, senão ninguém consegue autenticar.
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);
  if (authenticated) return NextResponse.next();

  // API protegida → 401 em JSON; páginas → redireciona ao login.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { error: "Não autenticado." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
