"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-paper-light">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-5">
        <Link href="/admin" className="font-serif text-lg font-semibold text-ink">
          Painel <span className="font-normal text-wine">· Conteúdo</span>
        </Link>
        <div className="flex items-center gap-4 text-base">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
          >
            Ver site ↗
          </a>
          <button
            type="button"
            onClick={logout}
            disabled={loading}
            className="rounded-sm border border-ink/20 px-4 py-2 font-medium text-ink transition-colors hover:border-wine disabled:opacity-60"
          >
            {loading ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </header>
  );
}
