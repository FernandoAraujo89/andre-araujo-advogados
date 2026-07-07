import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { createPost } from "@/lib/blog";
import { parsePostInput, revalidateBlog } from "../_validate";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const parsed = parsePostInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const post = await createPost(parsed.value);
    revalidateBlog([post.slug]);
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao salvar." },
      { status: 500 }
    );
  }
}
