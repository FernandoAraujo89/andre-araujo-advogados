"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Monitor,
  Redo2,
  Smartphone,
  Undo2,
} from "lucide-react";
import LandingPageView from "@/components/landing/LandingPageView";
import type { LpPath } from "@/components/landing/kit";
import type { LandingPage, LandingPageInput } from "@/data/landing";
import type { Post } from "@/data/posts";
import type { TeamMember } from "@/data/team";
import { prepararImagem } from "@/lib/imagem-cliente";
import { EditorContext, type EditorApi } from "./EditorContext";
import Inspector from "./Inspector";
import { InsertSection, editKit } from "./editKit";
import { setIn, type Selection } from "./state";

/**
 * Editor visual das landing pages: a página aparece como no site e cada
 * elemento é editado no lugar. Textos: clique e digite. Imagens e botões:
 * clique e ajuste no painel lateral. Seções: barra no topo de cada uma para
 * mover, ocultar, duplicar e excluir, e "Adicionar seção" entre elas.
 */

type History = { past: LandingPageInput[]; present: LandingPageInput; future: LandingPageInput[] };

/** Só os campos que o servidor aceita (sem datas). */
function toInput(page: LandingPage | LandingPageInput): LandingPageInput {
  const { version, slug, status, name, tagline, seo, whatsappMessage, hero, sections } = page;
  return { version, slug, status, name, tagline, seo, whatsappMessage, hero, sections };
}

async function uploadImage(file: File): Promise<string> {
  const prepared = await prepararImagem(file);
  const form = new FormData();
  form.append("file", prepared);
  form.append("pasta", "landing");
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Falha no upload.");
  return data.url;
}

export default function VisualEditor({
  initial,
  originalSlug,
  team,
  posts,
  storageEnabled,
}: {
  initial: LandingPage | LandingPageInput;
  /** Slug salvo no banco; ausente numa página nova */
  originalSlug?: string;
  team: TeamMember[];
  posts: Post[];
  storageEnabled: boolean;
}) {
  const [hist, setHist] = useState<History>(() => ({
    past: [],
    present: toInput(initial),
    future: [],
  }));
  const page = hist.present;
  // Última versão salva: comparar com ela diz se há alterações pendentes.
  const [savedPage, setSavedPage] = useState<LandingPageInput>(page);
  // Sempre a versão mais recente, para o salvar ler depois do último blur.
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  const slugRef = useRef<string | undefined>(originalSlug);
  const [savedSlug, setSavedSlug] = useState<string | undefined>(originalSlug);
  const [rawSelection, setSelection] = useState<Selection>({ kind: "page" });
  // Seção selecionada que deixou de existir (excluída, desfeita) volta à página.
  const sectionGone = rawSelection.kind === "section" && !page.sections[rawSelection.index];
  const selection: Selection = useMemo(
    () => (sectionGone ? { kind: "page" } : rawSelection),
    [sectionGone, rawSelection]
  );
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "ok" | "error" } | null>(null);
  const dirty = page !== savedPage;

  const apply = useCallback((fn: (p: LandingPageInput) => LandingPageInput) => {
    setHist((h) => {
      const next = fn(h.present);
      if (next === h.present) return h;
      return { past: [...h.past.slice(-99), h.present], present: next, future: [] };
    });
  }, []);

  const set = useCallback(
    (path: LpPath, value: unknown) => apply((p) => setIn(p, path, value)),
    [apply]
  );

  const undo = useCallback(() => {
    setHist((h) =>
      h.past.length === 0
        ? h
        : { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] }
    );
  }, []);

  const redo = useCallback(() => {
    setHist((h) =>
      h.future.length === 0
        ? h
        : { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) }
    );
  }, []);

  const notify = useCallback((message: string, tone: "ok" | "error" = "ok") => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.tone === "error" ? 7000 : 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const save = useCallback(
    async (status?: LandingPageInput["status"]) => {
      // Tira o foco do texto em edição para o valor entrar antes de salvar.
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      await new Promise((r) => setTimeout(r, 30));
      const current = pageRef.current;
      const body: LandingPageInput = status ? { ...current, status } : current;

      setSaving(true);
      try {
        const slug = slugRef.current;
        const res = await fetch(
          slug ? `/api/admin/landing/${encodeURIComponent(slug)}` : "/api/admin/landing",
          {
            method: slug ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        const data = (await res.json().catch(() => ({}))) as { page?: LandingPage; error?: string };
        if (!res.ok || !data.page) {
          notify(data.error || "Não foi possível salvar.", "error");
          if (res.status === 400) setSelection({ kind: "page" });
          return;
        }
        const next = toInput(data.page);
        setSavedPage(next);
        setHist((h) => ({ ...h, present: next }));
        if (slugRef.current !== next.slug) {
          slugRef.current = next.slug;
          setSavedSlug(next.slug);
          window.history.replaceState(null, "", `/admin/landing/editar/${next.slug}`);
        }
        notify(next.status === "publicada" ? "Salvo e publicado no site." : "Rascunho salvo.");
      } catch {
        notify("Sem conexão com o servidor. Tente de novo.", "error");
      } finally {
        setSaving(false);
      }
    },
    [notify]
  );

  // Atalhos: ⌘/Ctrl+S salva; ⌘/Ctrl+Z desfaz fora de um texto em edição.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable || target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      } else if (e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, undo, redo]);

  // Avisa antes de fechar a aba com alterações não salvas.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const api: EditorApi = useMemo(
    () => ({ page, selection, select: setSelection, set, apply, upload: uploadImage, notify }),
    [page, selection, set, apply, notify]
  );

  const published = page.status === "publicada";

  return (
    <EditorContext.Provider value={api}>
      <div className="flex h-svh flex-col overflow-hidden bg-[#dcd7cc]">
        {/* Barra superior */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper-light px-4">
          <Link
            href="/admin/landing"
            onClick={(e) => {
              if (dirty && !window.confirm("Sair sem salvar as alterações?")) e.preventDefault();
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Landing pages
          </Link>
          <span className="h-6 w-px bg-line" aria-hidden />
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-[0.9375rem] font-medium text-ink">
              {page.name || "Nova landing page"}
            </h1>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                published ? "bg-green-100 text-green-800" : "bg-wine-mist text-wine-deep"
              }`}
            >
              {published ? "Publicada" : "Rascunho"}
            </span>
            {dirty && <span className="shrink-0 text-xs text-ink-soft">Alterações não salvas</span>}
          </div>

          <div className="mx-auto flex items-center rounded-md border border-line bg-paper p-0.5">
            {(
              [
                ["desktop", "Computador", Monitor],
                ["mobile", "Celular", Smartphone],
              ] as const
            ).map(([d, title, Icon]) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                aria-pressed={device === d}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-colors ${
                  device === d ? "bg-paper-light font-medium text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon aria-hidden className="size-4" />
                {title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={hist.past.length === 0}
              title="Desfazer (⌘Z)"
              aria-label="Desfazer"
              className="grid size-9 place-items-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:opacity-30"
            >
              <Undo2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={hist.future.length === 0}
              title="Refazer (⇧⌘Z)"
              aria-label="Refazer"
              className="grid size-9 place-items-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:opacity-30"
            >
              <Redo2 className="size-4" />
            </button>
          </div>
          {savedSlug && (
            <a
              href={published ? `/areas-de-atuacao/${savedSlug}` : `/admin/preview/${savedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink"
            >
              <ExternalLink aria-hidden className="size-4" />
              {published ? "Ver no site" : "Pré-visualizar"}
            </a>
          )}
          {!published && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                if (window.confirm("Publicar a página no site? Ela entra no menu de áreas.")) {
                  void save("publicada");
                }
              }}
              className="rounded-md border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/40 disabled:opacity-50"
            >
              Publicar
            </button>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-md bg-wine px-4 py-2 text-sm font-medium text-paper-light transition-colors hover:bg-wine-deep disabled:opacity-60"
          >
            {saving ? "Salvando..." : published ? "Salvar e atualizar" : "Salvar rascunho"}
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Página */}
          <main
            className="min-w-0 flex-1 overflow-y-auto"
            onClick={() => setSelection({ kind: "page" })}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative mx-auto bg-paper shadow-[0_10px_40px_rgba(22,34,44,0.18)] transition-[width] duration-300 ${
                device === "mobile" ? "my-6 w-[390px] overflow-hidden rounded-[1.75rem]" : "w-full"
              }`}
            >
              {/* Cabeçalho do site (só a referência visual: o real é o do site) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[4.5rem] items-center justify-between bg-paper-light/95 px-6 shadow-[0_2px_24px_rgba(22,34,44,0.06)]"
              >
                <span className="text-lg tracking-[-0.01em] text-ink">
                  André Araújo <span className="font-serif italic text-wine">Advogados</span>
                </span>
                <span className="text-xs text-ink-soft">Cabeçalho do site</span>
              </div>
              <LandingPageView page={page} team={team} posts={posts} kit={editKit} />
              {page.sections.length === 0 && (
                <div className="group/insert py-16">
                  <InsertSection at={0} className="[&>button]:opacity-100" />
                </div>
              )}
            </div>
          </main>

          <Inspector team={team} posts={posts} storageEnabled={storageEnabled} />
        </div>

        {toast && (
          <div
            role={toast.tone === "error" ? "alert" : "status"}
            className={`fixed bottom-5 left-5 z-50 max-w-md rounded-md px-4 py-3 text-sm shadow-xl ${
              toast.tone === "error" ? "bg-wine-deep text-paper-light" : "bg-ink text-paper-light"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </EditorContext.Provider>
  );
}
