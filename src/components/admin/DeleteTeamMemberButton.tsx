"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTeamMemberButton({
  slug,
  name,
  hasProfile,
}: {
  slug: string;
  name: string;
  hasProfile?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const extra = hasProfile
      ? ` A página /equipe/${slug} deixa de existir.`
      : "";
    if (
      !confirm(
        `Remover ${name} da equipe?${extra} Esta ação não pode ser desfeita.`
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/equipe/${slug}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Não foi possível remover.");
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="font-medium text-wine-deep transition-colors hover:text-wine disabled:opacity-60"
    >
      {loading ? "Removendo..." : "Remover"}
    </button>
  );
}
