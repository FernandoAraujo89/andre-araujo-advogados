import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";
import { updatePost, deletePost } from "@/lib/blog";
import { parsePostInput, revalidateBlog } from "../../_validate";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { slug: originalSlug } = await ctx.params;

  const parsed = parsePostInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const post = await updatePost(originalSlug, parsed.value);
    if (!post) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }
    // Revalida o slug antigo e o novo (caso tenha mudado).
    revalidateBlog([originalSlug, post.slug]);
    return NextResponse.json({ post });
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
    const removed = await deletePost(slug);
    if (!removed) {
      return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
    }
    revalidateBlog([slug]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao excluir." },
      { status: 500 }
    );
  }
}
