import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/data/posts";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function AdminDashboard() {
  const posts = await getAllPosts();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">Posts</h1>
          <p className="mt-1 text-base text-ink-soft">
            {posts.length} {posts.length === 1 ? "artigo" : "artigos"} no blog.
          </p>
        </div>
        <Link
          href="/admin/novo"
          className="rounded-sm bg-wine px-5 py-3 font-medium text-paper-light transition-colors hover:bg-wine-deep"
        >
          + Novo post
        </Link>
      </div>

      {!blobConfigured && (
        <p className="mt-6 rounded-md border border-wine/30 bg-wine-mist px-5 py-4 text-base text-wine-deep">
          <strong>Modo demonstração:</strong> o Vercel Blob ainda não está
          configurado, então o que você criar aqui não será salvo. Ative o
          Storage → Blob no painel do Vercel e defina a variável
          BLOB_READ_WRITE_TOKEN para publicar de verdade.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-md border border-line">
        {posts.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink-soft">
            Nenhum post ainda. Clique em “Novo post” para começar.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex flex-wrap items-center justify-between gap-3 bg-paper-light px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{post.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    <span className="text-wine">{post.category}</span>
                    {" · "}
                    {formatDate(post.date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-base">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
                  >
                    Ver
                  </a>
                  <Link
                    href={`/admin/editar/${post.slug}`}
                    className="font-medium text-ink transition-colors hover:text-wine-deep"
                  >
                    Editar
                  </Link>
                  <DeletePostButton slug={post.slug} title={post.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
