"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteMessageButton({
  id,
  nome,
}: {
  id: string;
  nome: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir a mensagem de ${nome}? Esta ação não pode ser desfeita.`))
      return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mensagens/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Não foi possível excluir.");
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
      className="shrink-0 font-medium text-wine-deep transition-colors hover:text-wine disabled:opacity-60"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
