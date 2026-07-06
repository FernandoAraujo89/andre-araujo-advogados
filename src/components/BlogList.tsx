"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import { categories, type Post, type Category } from "@/data/posts";

const PAGE_SIZE = 9;

type BlogListProps = {
  posts: Post[];
};

/**
 * Listagem do blog com filtro por categoria e paginação simples.
 * Preparada para os 65 posts da migração — basta crescer src/data/posts.ts.
 */
export default function BlogList({ posts }: BlogListProps) {
  const [category, setCategory] = useState<Category | "Todas">("Todas");
  const [page, setPage] = useState(1);

  const filtered =
    category === "Todas" ? posts : posts.filter((p) => p.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function selectCategory(next: Category | "Todas") {
    setCategory(next);
    setPage(1);
  }

  return (
    <div>
      <div role="group" aria-label="Filtrar artigos por categoria" className="flex flex-wrap gap-3">
        {(["Todas", ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => selectCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full px-5 py-2.5 text-[0.9375rem] font-medium transition-colors ${
              category === c
                ? "bg-ink text-paper-light"
                : "border border-line bg-paper-light text-ink-soft hover:border-brass hover:text-brass-deep"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-ink-soft">
          Ainda não há artigos nesta categoria.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginação dos artigos" className="mt-14 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={page === n ? "page" : undefined}
              aria-label={`Página ${n}`}
              className={`h-11 w-11 rounded-full text-[0.9375rem] font-medium transition-colors ${
                page === n
                  ? "bg-ink text-paper-light"
                  : "border border-line text-ink-soft hover:border-brass hover:text-brass-deep"
              }`}
            >
              {n}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
