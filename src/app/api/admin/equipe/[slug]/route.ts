import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { updateTeamMember, deleteTeamMember } from "@/lib/equipe";
import { parseTeamInput, revalidateEquipe } from "../_validate";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { slug: originalSlug } = await ctx.params;

  const parsed = parseTeamInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const member = await updateTeamMember(originalSlug, parsed.value);
    if (!member) {
      return NextResponse.json(
        { error: "Integrante não encontrado." },
        { status: 404 }
      );
    }
    revalidateEquipe([originalSlug, member.slug]);
    return NextResponse.json({ member });
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
    const removed = await deleteTeamMember(slug);
    if (!removed) {
      return NextResponse.json(
        { error: "Integrante não encontrado." },
        { status: 404 }
      );
    }
    revalidateEquipe([slug]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao excluir." },
      { status: 500 }
    );
  }
}
