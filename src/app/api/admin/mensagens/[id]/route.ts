import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { deleteMessage } from "@/lib/contato";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { id } = await ctx.params;

  try {
    const removed = await deleteMessage(id);
    if (!removed) {
      return NextResponse.json({ error: "Mensagem não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao excluir." },
      { status: 500 }
    );
  }
}
