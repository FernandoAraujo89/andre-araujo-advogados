"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Não foi possível entrar.");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-2xl font-semibold text-ink">
            André Araújo{" "}
            <span className="font-normal text-wine">Advogados</span>
          </p>
          <h1 className="mt-6 font-serif text-xl font-medium text-ink">
            Painel de conteúdo
          </h1>
          <p className="mt-2 text-base text-ink-soft">
            Acesso restrito ao escritório.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-md border border-line bg-paper-light p-6"
        >
          <label
            htmlFor="password"
            className="mb-2 block text-base font-medium text-ink"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink focus:border-wine focus:outline-none"
          />
          {error && (
            <p role="alert" className="mt-3 text-base text-wine-deep">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full rounded-sm bg-wine px-6 py-3 font-medium text-paper-light transition-colors hover:bg-wine-deep disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
