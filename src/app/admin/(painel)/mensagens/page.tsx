import DeleteMessageButton from "@/components/admin/DeleteMessageButton";
import {
  emailEnabled,
  listMessages,
  storageEnabled,
  storageIsPrivate,
} from "@/lib/contato";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappHref(celular: string): string {
  const digits = celular.replace(/\D/g, "");
  return `https://wa.me/55${digits}`;
}

export default async function MensagensPage() {
  const blobConfigured = storageEnabled();
  const mensagens = await listMessages();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">Mensagens</h1>
          <p className="mt-1 text-base text-ink-soft">
            {mensagens.length}{" "}
            {mensagens.length === 1 ? "mensagem recebida" : "mensagens recebidas"}{" "}
            pelo formulário do site.
          </p>
        </div>
      </div>

      {!blobConfigured && (
        <p className="mt-6 rounded-md border border-wine/30 bg-wine-mist px-5 py-4 text-base text-wine-deep">
          <strong>Vercel Blob não configurado:</strong> as mensagens do
          formulário não estão sendo guardadas. Defina BLOB_READ_WRITE_TOKEN
          no Vercel.
        </p>
      )}

      {blobConfigured && !storageIsPrivate() && (
        <p className="mt-6 rounded-md border border-line bg-paper-light px-5 py-4 text-base text-ink-soft">
          As mensagens estão no store principal do Blob, com endereço
          aleatório. Para guardá-las num store privado, crie um store Blob
          privado no Vercel e defina CONTACT_BLOB_TOKEN (ver README).
        </p>
      )}

      {blobConfigured && !emailEnabled() && (
        <p className="mt-6 rounded-md border border-line bg-paper-light px-5 py-4 text-base text-ink-soft">
          Aviso por e-mail desativado: as mensagens só aparecem aqui. Para
          receber cada uma por e-mail, configure o Amazon SES (variáveis SES_*)
          ou o Resend no Vercel (ver README).
        </p>
      )}

      <div className="mt-8 space-y-4">
        {mensagens.length === 0 ? (
          <p className="rounded-md border border-line px-6 py-10 text-center text-ink-soft">
            Nenhuma mensagem ainda.
          </p>
        ) : (
          mensagens.map((m) => (
            <article
              key={m.id}
              className="rounded-md border border-line bg-paper-light px-6 py-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{m.nome}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    <span className="text-wine">{m.assunto}</span>
                    {" · "}
                    <time dateTime={m.receivedAt}>{formatDateTime(m.receivedAt)}</time>
                  </p>
                </div>
                <DeleteMessageButton id={m.id} nome={m.nome} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-base text-ink">
                {m.mensagem}
              </p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-base">
                <a
                  href={whatsappHref(m.celular)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink transition-colors hover:text-wine-deep"
                >
                  WhatsApp {m.celular}
                </a>
                <a
                  href={`tel:+55${m.celular.replace(/\D/g, "")}`}
                  className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
                >
                  Ligar
                </a>
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="font-medium text-ink-soft transition-colors hover:text-wine-deep"
                  >
                    {m.email}
                  </a>
                )}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
