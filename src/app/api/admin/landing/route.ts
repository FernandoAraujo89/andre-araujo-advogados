import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { createLandingPage } from "@/lib/landing";
import { parseLandingInput, revalidateLanding } from "./_validate";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const parsed = parseLandingInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const page = await createLandingPage(parsed.value);
    revalidateLanding([page.slug]);
    return NextResponse.json({ page });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao salvar." },
      { status: 500 }
    );
  }
}
