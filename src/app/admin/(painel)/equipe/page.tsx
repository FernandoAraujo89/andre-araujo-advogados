import Link from "next/link";
import Image from "next/image";
import DeleteTeamMemberButton from "@/components/admin/DeleteTeamMemberButton";
import TeamOrderButtons from "@/components/admin/TeamOrderButtons";
import { initialsOf } from "@/data/team";
import { getTeam, teamStorageEnabled } from "@/lib/equipe";

export default async function EquipeListPage() {
  const members = await getTeam();
  const blobConfigured = teamStorageEnabled();
  const slugs = members.map((m) => m.slug);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-[-0.02em] text-ink">Equipe</h1>
          <p className="mt-1 text-base text-ink-soft">
            Quem aparece em /equipe. A ordem desta lista é a ordem do site; o
            setor agrupa as pessoas na página.
          </p>
        </div>
        <Link
          href="/admin/equipe/novo"
          className="rounded-sm bg-wine px-5 py-3 font-medium text-paper-light transition-colors hover:bg-wine-deep"
        >
          + Novo integrante
        </Link>
      </div>

      {!blobConfigured && (
        <p className="mt-6 rounded-md border border-wine/30 bg-wine-mist px-5 py-4 text-base text-wine-deep">
          <strong>Modo demonstração:</strong> o banco de dados ainda não está
          configurado, então o que você alterar aqui não será salvo. No Vercel,
          conecte o Neon ao projeto (Storage → Connect Project) para valer de
          verdade.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-md border border-line">
        {members.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink-soft">
            Nenhum integrante ainda. Clique em “Novo integrante” para começar.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {members.map((m, i) => (
              <li
                key={m.slug}
                className="flex flex-wrap items-center gap-4 bg-paper-light px-5 py-4"
              >
                <TeamOrderButtons slugs={slugs} index={i} />

                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-line bg-paper">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt=""
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-serif text-base italic text-ink-soft">
                      {initialsOf(m.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{m.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {m.role}
                    {m.setor && ` · ${m.setor}`}
                    {m.ramal && ` · ramal ${m.ramal}`}
                    {m.hasProfile && (
                      <span className="text-green-700"> · com perfil</span>
                    )}
                    {!m.photo && <span className="text-wine"> · sem foto</span>}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 text-base">
                  {m.hasProfile && (
                    <a
                      href={`/equipe/${m.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
                    >
                      Ver
                    </a>
                  )}
                  <Link
                    href={`/admin/equipe/editar/${m.slug}`}
                    className="font-medium text-ink transition-colors hover:text-wine-deep"
                  >
                    Editar
                  </Link>
                  <DeleteTeamMemberButton
                    slug={m.slug}
                    name={m.name}
                    hasProfile={m.hasProfile}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
