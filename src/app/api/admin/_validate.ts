import { revalidatePath } from "next/cache";
import { categories, type Category, type Post } from "@/data/posts";
import type { PostInput } from "@/lib/blog";

/** Valida e normaliza o corpo enviado pelo editor. Devolve erro legível. */
export function parsePostInput(
  raw: unknown
): { ok: true; value: PostInput } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Dados inválidos." };
  }
  const b = raw as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  const category = typeof b.category === "string" ? b.category : "";
  const date = typeof b.date === "string" ? b.date : "";
  const excerpt = typeof b.excerpt === "string" ? b.excerpt.trim() : "";
  const body = typeof b.body === "string" ? b.body.trim() : "";
  const slug = typeof b.slug === "string" ? b.slug.trim() : undefined;

  if (title.length < 3) return { ok: false, error: "Informe um título." };
  if (!categories.includes(category as Category))
    return { ok: false, error: "Escolha uma categoria válida." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return { ok: false, error: "Informe uma data válida." };
  if (excerpt.length < 10)
    return { ok: false, error: "O resumo precisa de pelo menos 10 caracteres." };
  if (body.length < 10)
    return { ok: false, error: "O conteúdo precisa de pelo menos 10 caracteres." };

  let image: Post["image"] = null;
  if (b.image && typeof b.image === "object") {
    const img = b.image as Record<string, unknown>;
    const src = typeof img.src === "string" ? img.src.trim() : "";
    if (src) {
      image = {
        src,
        alt: typeof img.alt === "string" ? img.alt.trim() : "",
        credit:
          typeof img.credit === "string" && img.credit.trim()
            ? img.credit.trim()
            : undefined,
        creditUrl:
          typeof img.creditUrl === "string" && img.creditUrl.trim()
            ? img.creditUrl.trim()
            : undefined,
      };
    }
  }

  return {
    ok: true,
    value: {
      title,
      category: category as Category,
      date,
      excerpt,
      body,
      image,
      slug,
    },
  };
}

/** Revalida todas as páginas afetadas por uma mudança no blog. */
export function revalidateBlog(slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/blog/${slug}`);
  }
}
