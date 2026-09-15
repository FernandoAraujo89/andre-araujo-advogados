import Link from "next/link";
import DeleteLandingButton from "@/components/admin/DeleteLandingButton";
import { formatDate } from "@/data/posts";
import { getAllLandingPages, landingStorageEnabled } from "@/lib/landing";

export default async function LandingListPage() {
  const pages = await getAllLandingPages();
  const blobConfigured = landingStorageEnabled();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-[-0.02em] text-ink">Landing pages</h1>
          <p className="mt-1 text-base text-ink-soft">
            Páginas de campanha em /areas-de-atuacao. As publicadas entram no menu
            de áreas, no índice de áreas e no rodapé.
          </p>
        </div>
        <Link
          href="/admin/landing/nova"
          className="rounded-sm bg-wine px-5 py-3 font-medium text-paper-light transition-colors hover:bg-wine-deep"
        >
          + Nova página
        </Link>
      </div>

      {!blobConfigured && (
        <p className="mt-6 rounded-md border border-wine/30 bg-wine-mist px-5 py-4 text-base text-wine-deep">
          <strong>Modo demonstração:</strong> o Vercel Blob ainda não está
          configurado, então o que você criar aqui não será salvo. Defina a
          variável BLOB_READ_WRITE_TOKEN para publicar de verdade.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-md border border-line">
        {pages.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink-soft">
            Nenhuma landing page ainda. Clique em “Nova página” para começar.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {pages.map((p) => (
              <li
                key={p.slug}
                className="flex flex-wrap items-center justify-between gap-3 bg-paper-light px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    <span
                      className={
                        p.status === "publicada" ? "text-green-700" : "text-wine"
                      }
                    >
                      {p.status === "publicada" ? "Publicada" : "Rascunho"}
                    </span>
                    {" · "}/areas-de-atuacao/{p.slug}
                    {" · "}atualizada em {formatDate(p.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-base">
                  {p.status === "publicada" ? (
                    <a
                      href={`/areas-de-atuacao/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
                    >
                      Ver
                    </a>
                  ) : (
                    <a
                      href={`/admin/preview/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
                    >
                      Pré-visualizar
                    </a>
                  )}
                  <Link
                    href={`/admin/landing/editar/${p.slug}`}
                    className="font-medium text-ink transition-colors hover:text-wine-deep"
                  >
                    Editar
                  </Link>
                  <DeleteLandingButton slug={p.slug} name={p.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
