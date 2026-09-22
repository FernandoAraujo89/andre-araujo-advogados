import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { createTeamMember, reorderTeam } from "@/lib/equipe";
import { parseTeamInput, parseOrder, revalidateEquipe } from "./_validate";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const parsed = parseTeamInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const member = await createTeamMember(parsed.value);
    revalidateEquipe([member.slug]);
    return NextResponse.json({ member });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao salvar." },
      { status: 500 }
    );
  }
}

/**
 * Reordena a equipe. Fica no PATCH da coleção, e não numa rota própria tipo
 * /equipe/ordem, porque uma rota estática ali dentro tomaria o lugar do
 * [slug] e impediria editar um integrante cujo slug fosse "ordem".
 */
export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const parsed = parseOrder(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const members = await reorderTeam(parsed.value);
    revalidateEquipe();
    return NextResponse.json({ members });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao reordenar." },
      { status: 500 }
    );
  }
}
