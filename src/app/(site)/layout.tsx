import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

/**
 * Layout do site público — cabeçalho, rodapé e botão de WhatsApp.
 * O painel /admin fica fora deste grupo e não herda este chrome.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-5 focus:py-3 focus:text-paper-light"
      >
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
