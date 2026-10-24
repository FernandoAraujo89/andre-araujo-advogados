import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VisualEditor from "@/components/admin/landing-editor/VisualEditor";
import { getLandingModelo, landingModelos } from "@/data/landing-modelos";
import { getAllPosts } from "@/lib/blog";
import { getTeam } from "@/lib/equipe";
import { landingStorageEnabled } from "@/lib/landing";

type Props = { searchParams: Promise<{ modelo?: string }> };

/**
 * Nova landing page: primeiro a escolha do modelo, depois o editor visual
 * com a página do modelo já montada.
 */
export default async function NovaLandingPage({ searchParams }: Props) {
  const { modelo: id } = await searchParams;
  const modelo = getLandingModelo(id);

  if (!modelo) {
    return (
      <div className="min-h-svh bg-paper px-5 py-10">
        <div className="mx-auto max-w-[1080px]">
          <Link
            href="/admin/landing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Landing pages
          </Link>
          <h1 className="mt-6 text-3xl tracking-[-0.02em] text-ink">Nova landing page</h1>
          <p className="mt-2 text-base text-ink-soft">
            Escolha um ponto de partida. Tudo pode ser alterado no editor: textos, imagens, botões e
            a ordem das seções.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {landingModelos.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/admin/landing/nova?modelo=${m.id}`}
                  className="flex h-full flex-col rounded-md border border-line bg-paper-light p-6 transition-all hover:-translate-y-0.5 hover:border-wine/40 hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
                >
                  <span className="text-xl tracking-[-0.01em] text-ink">{m.nome}</span>
                  <span className="mt-2 flex-1 text-base text-ink-soft">{m.descricao}</span>
                  <span className="mt-5 text-base font-medium text-wine">Começar com este modelo</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const [team, posts] = await Promise.all([getTeam(), getAllPosts()]);
  return (
    <VisualEditor
      initial={modelo.criar()}
      team={team}
      posts={posts}
      storageEnabled={landingStorageEnabled()}
    />
  );
}
