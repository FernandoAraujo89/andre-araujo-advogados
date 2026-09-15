import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { updateLandingPage, deleteLandingPage } from "@/lib/landing";
import { parseLandingInput, revalidateLanding } from "../_validate";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { slug: originalSlug } = await ctx.params;

  const parsed = parseLandingInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const page = await updateLandingPage(originalSlug, parsed.value);
    if (!page) {
      return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
    }
    revalidateLanding([originalSlug, page.slug]);
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao salvar." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { slug } = await ctx.params;

  try {
    const removed = await deleteLandingPage(slug);
    if (!removed) {
      return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
    }
    revalidateLanding([slug]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao excluir." },
      { status: 500 }
    );
  }
}
