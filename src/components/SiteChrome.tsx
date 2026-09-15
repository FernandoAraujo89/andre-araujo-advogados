import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getAreasDeAtuacao } from "@/lib/atuacao";

/**
 * Chrome do site público (header, rodapé e botão do WhatsApp). O layout do
 * grupo de rotas (site) envolve todas as páginas públicas com ele; o painel
 * /admin fica fora e tem o próprio layout. A lista de áreas do menu inclui as
 * landing pages publicadas no painel (src/lib/atuacao.ts).
 */
export default async function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const areas = await getAreasDeAtuacao();
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-5 focus:py-3 focus:text-paper-light"
      >
        Ir para o conteúdo
      </a>
      <Header areas={areas} />
      <main id="conteudo">{children}</main>
      <Footer areas={areas} />
      <WhatsAppFloat />
    </>
  );
}
