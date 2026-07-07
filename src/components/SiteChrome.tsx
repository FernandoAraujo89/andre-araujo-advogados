import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { World } from "@/data/site";

/**
 * Chrome do site público, tematizado por "mundo" (data-world define o acento
 * no globals.css). O seletor das duas vertentes fica na navegação global
 * (barra do topo do Header). Cada subgrupo de rota — (civel) e (servidor) —
 * envolve suas páginas com este chrome passando o mundo correspondente.
 */
export default function SiteChrome({
  world,
  children,
}: {
  world: World;
  children: React.ReactNode;
}) {
  return (
    <div data-world={world}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-5 focus:py-3 focus:text-paper-light"
      >
        Ir para o conteúdo
      </a>
      <Header world={world} />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
