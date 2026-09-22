"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Sobe/desce um integrante na ordem da equipe. A ordem do array salvo é a
 * ordem do site, então mover aqui move lá — ver src/lib/equipe.ts.
 */
export default function TeamOrderButtons({
  slugs,
  index,
}: {
  slugs: string[];
  index: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function move(to: number) {
    if (to < 0 || to >= slugs.length) return;
    const next = [...slugs];
    [next[index], next[to]] = [next[to], next[index]];
    setLoading(true);
    try {
      const res = await fetch("/api/admin/equipe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: next }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Não foi possível reordenar.");
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  const btn =
    "rounded-sm border border-line px-2 py-1 leading-none text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-30";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => move(index - 1)}
        disabled={loading || index === 0}
        className={btn}
        aria-label="Mover para cima"
        title="Mover para cima"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => move(index + 1)}
        disabled={loading || index === slugs.length - 1}
        className={btn}
        aria-label="Mover para baixo"
        title="Mover para baixo"
      >
        ↓
      </button>
    </div>
  );
}
